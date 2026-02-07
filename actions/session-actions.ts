"use server";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sessionFormSchema, type SessionFormData } from "@/lib/validations/session";
import { createWeekendFormSchema, type WeekendFormData } from "@/lib/validations/weekend";
import { startOfDay, endOfDay, previousSaturday, isSaturday, isSunday } from "date-fns";

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
      monitoringFrom: data.monitoringFrom,
      monitoringTo: data.monitoringTo,
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

  const entry = await prisma.entry.create({
    data: {
      sessionId: session.id,
      date: startOfDay(date),
      type: "WEEKEND",
      answers,
    },
  });

  return { success: true, entry };
}
