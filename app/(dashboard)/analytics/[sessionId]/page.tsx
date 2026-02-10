import { notFound } from "next/navigation";
import { getSessionById } from "@/actions/session-actions";
import { AnalyticsCharts } from "@/components/charts/analytics-charts";

export default async function SessionAnalyticsPage({
  params,
}: {
  params: Promise<{ sessionId: string }>;
}) {
  const { sessionId } = await params;
  const session = await getSessionById(sessionId);

  if (!session) {
    notFound();
  }

  const workdayEntries = session.entries
    .filter((e) => e.type === "WORKDAY")
    .map((entry) => ({
      id: entry.id,
      date: entry.date,
      answers: entry.answers as Record<string, number>,
    }));

  const weekendEntries = session.entries.filter((e) => e.type === "WEEKEND");

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Analytics: {session.medicationName}</h1>
        <p className="text-muted-foreground">
          Dosierung: {session.dosage} | Zeitraum:{" "}
          {session.monitoringFrom.toLocaleDateString("de-DE")} -{" "}
          {session.monitoringTo.toLocaleDateString("de-DE")}
        </p>
      </div>

      {workdayEntries.length > 0 ? (
        <AnalyticsCharts
          entries={workdayEntries}
          dateRange={{
            from: session.monitoringFrom,
            to: session.monitoringTo,
          }}
          sessionInfo={{
            medicationName: session.medicationName,
            dosage: session.dosage,
            monitoringFrom: session.monitoringFrom.toLocaleDateString("de-DE"),
            monitoringTo: session.monitoringTo.toLocaleDateString("de-DE"),
            workdayCount: workdayEntries.length,
            weekendCount: weekendEntries.length,
          }}
        />
      ) : (
        <div className="border rounded-lg p-8 text-center text-muted-foreground">
          Noch keine Werktag-Einträge vorhanden.
        </div>
      )}
    </div>
  );
}
