import { redirect } from "next/navigation";
import { getActiveSession } from "@/actions/session-actions";
import { WorkdayForm } from "@/components/forms/workday-form";

export default async function WorkdayFormPage() {
  const session = await getActiveSession();

  if (!session) {
    redirect("/home");
  }

  const today = new Date();
  const dayOfWeek = today.getDay();
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

  if (isWeekend) {
    redirect("/form/weekend");
  }

  const sessionEnd = session.stoppedAt ?? session.monitoringTo;

  return (
    <WorkdayForm
      sessionStart={session.monitoringFrom}
      sessionEnd={sessionEnd}
    />
  );
}
