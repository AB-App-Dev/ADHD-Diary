import { redirect } from "next/navigation";
import { getActiveSession, getWeekendEntry } from "@/actions/session-actions";
import { WeekendForm } from "@/components/forms/weekend-form";
import { WorkdayForm } from "@/components/forms/workday-form";
import type { WeekendFormData } from "@/lib/validations/weekend";

export const dynamic = 'force-dynamic';

export default async function FormPage() {
  const session = await getActiveSession();

  if (!session) {
    redirect("/home");
  }

  const sessionEnd = session.stoppedAt ?? session.monitoringTo;

  const today = new Date();
  const dayOfWeek = today.getDay();
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

  if (isWeekend) {
    const existingEntry = await getWeekendEntry(session.id);
    const existingData = existingEntry
      ? {
          date: existingEntry.date,
          ...(existingEntry.answers as Omit<WeekendFormData, "date">),
        }
      : undefined;

    return (
      <div>
        <WeekendForm
          sessionStart={session.monitoringFrom}
          sessionEnd={sessionEnd}
          existingData={existingData}
        />
      </div>
    );
  }

  return (
    <div>
      <WorkdayForm
        sessionStart={session.monitoringFrom}
        sessionEnd={sessionEnd}
      />
    </div>
  );
}
