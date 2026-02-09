"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sessionFormSchema, type SessionFormData } from "@/lib/validations/session";
import { createWeekendFormSchema, type WeekendFormData } from "@/lib/validations/weekend";
import { createWorkdayFormSchema, type WorkdayFormData } from "@/lib/validations/workday";
import { startOfDay, endOfDay, previousSaturday, isSaturday, isSunday, isWeekend } from "date-fns";

// Create UTC midnight date preserving the local date components
// Fixes timezone issue where Vercel (UTC) would shift dates back a day
function toUTCDate(date: Date): Date {
  return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
}

async function getAuthUser() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user?.id) {
    throw new Error("Nicht authentifiziert");
  }
  return session.user;
}

export async function getActiveSession() {
  const user = await getAuthUser();
  const today = startOfDay(new Date());

  const session = await prisma.monitoringSession.findFirst({
    where: {
      userId: user.id,
      isLocked: true,
      stoppedAt: null,
      monitoringTo: { gte: today },
    },
    orderBy: { createdAt: "desc" },
  });

  return session;
}

export async function getSessionById(id: string) {
  const user = await getAuthUser();
  const today = startOfDay(new Date());

  const session = await prisma.monitoringSession.findFirst({
    where: { id, userId: user.id },
    include: {
      entries: { orderBy: { date: "desc" } },
    },
  });

  if (!session) return null;

  return {
    ...session,
    isActive:
      session.isLocked &&
      !session.stoppedAt &&
      session.monitoringTo >= today,
  };
}

export async function getAllSessions() {
  const user = await getAuthUser();
  const today = startOfDay(new Date());

  const sessions = await prisma.monitoringSession.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { entries: true } } },
  });

  return sessions.map((session: (typeof sessions)[number]) => ({
    ...session,
    isActive:
      session.isLocked &&
      !session.stoppedAt &&
      session.monitoringTo >= today,
    entryCount: session._count.entries,
  }));
}

export async function createAndStartSession(data: SessionFormData) {
  const user = await getAuthUser();

  const validation = sessionFormSchema.safeParse(data);
  if (!validation.success) {
    return { error: validation.error.flatten().fieldErrors };
  }

  const existingActive = await getActiveSession();
  if (existingActive) {
    return { error: { _form: ["Es gibt bereits eine aktive Sitzung"] } };
  }

  const session = await prisma.monitoringSession.create({
    data: {
      userId: user.id,
      medicationName: data.medicationName,
      dosage: data.dosage,
      intakeTimes: [data.intakeTime],
      monitoringFrom: toUTCDate(data.monitoringFrom),
      monitoringTo: toUTCDate(data.monitoringTo),
      isLocked: true,
    },
  });

  return { success: true, session };
}

export async function stopSession(sessionId: string) {
  const user = await getAuthUser();

  const session = await prisma.monitoringSession.findFirst({
    where: {
      id: sessionId,
      userId: user.id,
      isLocked: true,
      stoppedAt: null,
    },
  });

  if (!session) {
    return { error: "Sitzung nicht gefunden oder bereits gestoppt" };
  }

  await prisma.monitoringSession.update({
    where: { id: sessionId },
    data: { stoppedAt: new Date() },
  });

  return { success: true };
}

export async function getWeekendEntry(sessionId: string) {
  const today = new Date();

  // Get current weekend's Saturday
  let saturday: Date;
  if (isSaturday(today)) {
    saturday = startOfDay(today);
  } else if (isSunday(today)) {
    saturday = startOfDay(previousSaturday(today));
  } else {
    // Weekday - get the previous Saturday (last weekend)
    saturday = startOfDay(previousSaturday(today));
  }

  // Sunday is the day after Saturday
  const sunday = new Date(saturday);
  sunday.setDate(sunday.getDate() + 1);

  const entry = await prisma.entry.findFirst({
    where: {
      sessionId,
      type: "WEEKEND",
      date: {
        gte: saturday,
        lte: endOfDay(sunday),
      },
    },
  });

  return entry;
}

export async function saveWeekendEntry(data: WeekendFormData) {
  const session = await getActiveSession();

  if (!session) {
    return { error: "Keine aktive Sitzung gefunden" };
  }

  const sessionEnd = session.stoppedAt ?? session.monitoringTo;
  const schema = createWeekendFormSchema(session.monitoringFrom, sessionEnd);
  const validation = schema.safeParse(data);

  if (!validation.success) {
    return { error: validation.error.flatten().fieldErrors };
  }

  // Check if entry already exists for this weekend
  const existingEntry = await getWeekendEntry(session.id);
  if (existingEntry) {
    return { error: "Für dieses Wochenende wurde bereits ein Eintrag erstellt" };
  }

  const { date, ...answers } = validation.data;

  await prisma.entry.create({
    data: {
      sessionId: session.id,
      date: toUTCDate(date),
      type: "WEEKEND",
      answers,
    },
  });

  redirect("/confirmation");
}

export async function getWorkdayEntry(sessionId: string, date: Date) {
  const dayStart = toUTCDate(date);

  const entry = await prisma.entry.findFirst({
    where: {
      sessionId,
      type: "WORKDAY",
      date: dayStart,
    },
  });

  return entry;
}

export async function saveWorkdayEntry(data: WorkdayFormData) {
  const session = await getActiveSession();

  if (!session) {
    return { error: "Keine aktive Sitzung gefunden" };
  }

  const sessionEnd = session.stoppedAt ?? session.monitoringTo;
  const schema = createWorkdayFormSchema(session.monitoringFrom, sessionEnd);
  const validation = schema.safeParse(data);

  if (!validation.success) {
    return { error: validation.error.flatten().fieldErrors };
  }

  // Check if date is a weekend
  if (isWeekend(validation.data.date)) {
    return { error: "Datum muss ein Wochentag sein" };
  }

  // Check if entry already exists for this date
  const existingEntry = await getWorkdayEntry(session.id, validation.data.date);
  if (existingEntry) {
    return { error: "Für diesen Tag wurde bereits ein Eintrag erstellt" };
  }

  const { date, ...answers } = validation.data;

  await prisma.entry.create({
    data: {
      sessionId: session.id,
      date: toUTCDate(date),
      type: "WORKDAY",
      answers,
    },
  });

  redirect("/confirmation");
}
