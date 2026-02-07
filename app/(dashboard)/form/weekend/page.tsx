import { redirect } from "next/navigation";
import { getActiveSession, getWeekendEntry } from "@/actions/session-actions";
import { WeekendForm } from "@/components/forms/weekend-form";
import type { WeekendFormData } from "@/lib/validations/weekend";

export default async function WeekendFormPage() {
  const session = await getActiveSession();

  if (!session) {
    redirect("/home");
  }

  const sessionEnd = session.stoppedAt ?? session.monitoringTo;
  const existingEntry = await getWeekendEntry(session.id);

  const existingData = existingEntry
    ? {
        date: existingEntry.date,
        ...(existingEntry.answers as Omit<WeekendFormData, "date">),
      }
    : undefined;

  return (
    <WeekendForm
      sessionStart={session.monitoringFrom}
      sessionEnd={sessionEnd}
      existingData={existingData}
    />
  );
}
