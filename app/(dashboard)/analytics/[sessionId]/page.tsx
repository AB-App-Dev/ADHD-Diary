import { notFound } from "next/navigation";
import { getSessionById } from "@/actions/session-actions";
import { WorkdayChart } from "@/components/charts/workday-chart";
import { WorkdayRadarChart } from "@/components/charts/workday-radar-chart";
import { WorkdayHeatmapChart } from "@/components/charts/workday-heatmap-chart";
import { WorkdayScatterChart } from "@/components/charts/workday-scatter-chart";

const FIELD_LABELS: Record<string, string> = {
  attention: "Aufmerksamkeit",
  participation: "Hausaufgaben-Beginn",
  homework: "Aufgaben-Erledigung",
  organisation: "Organisation",
  tiredness: "Müdigkeit",
  sleep: "Mittagsschlaf-Bedürfnis",
  concentration: "Konzentration",
  headache: "Kopfschmerzen",
  mood: "Stimmung",
  irritability: "Reizbarkeit",
  motivation: "Motivation",
  hobby: "Hobby-Interesse",
  sleepQuality: "Schlafqualität",
  asleep: "Einschlafgeschwindigkeit",
  morning: "Morgen-Befinden",
  appetite: "Appetit",
};

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
    <div className="p-6 space-y-6 w-full max-w-none">
      <div>
        <h1 className="text-2xl font-bold">Analytics: {session.medicationName}</h1>
        <p className="text-muted-foreground">
          Dosierung: {session.dosage} | Zeitraum:{" "}
          {session.monitoringFrom.toLocaleDateString("de-DE")} -{" "}
          {session.monitoringTo.toLocaleDateString("de-DE")}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-4 border rounded-lg">
          <p className="text-sm text-muted-foreground">Werktag-Einträge</p>
          <p className="text-2xl font-bold">{workdayEntries.length}</p>
        </div>
        <div className="p-4 border rounded-lg">
          <p className="text-sm text-muted-foreground">Wochenend-Einträge</p>
          <p className="text-2xl font-bold">{weekendEntries.length}</p>
        </div>
      </div>

      {workdayEntries.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="border rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-4">Werktag-Verlauf</h2>
            <WorkdayChart
              entries={workdayEntries}
              dateRange={{
                from: session.monitoringFrom,
                to: session.monitoringTo,
              }}
            />
          </div>

          <div className="border rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-4">Tagesprofil (Radar)</h2>
            <WorkdayRadarChart entries={workdayEntries} />
          </div>

          <div className="border rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-4">Übersicht (Heatmap)</h2>
            <WorkdayHeatmapChart entries={workdayEntries} />
          </div>

          <div className="border rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-4">Korrelation (Scatter)</h2>
            <WorkdayScatterChart entries={workdayEntries} />
          </div>
        </div>
      )}

      {workdayEntries.length > 0 && (() => {
        const parameterNames = Object.keys(workdayEntries[0]?.answers || {});
        const averages = parameterNames.reduce((acc, param) => {
          const sum = workdayEntries.reduce((s, e) => s + (e.answers[param] || 0), 0);
          acc[param] = (sum / workdayEntries.length).toFixed(2);
          return acc;
        }, {} as Record<string, string>);

        return (
          <div className="border rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-4">Datenübersicht</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="p-2 text-left font-semibold">Datum</th>
                    {parameterNames.map((param) => (
                      <th key={param} className="p-2 text-center font-semibold">
                        {FIELD_LABELS[param] || param}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {workdayEntries.map((entry) => (
                    <tr key={entry.id} className="border-b">
                      <td className="p-2 font-medium">
                        {new Date(entry.date).toLocaleDateString("de-DE")}
                      </td>
                      {parameterNames.map((param) => (
                        <td key={param} className="p-2 text-center">
                          {entry.answers[param] ?? "-"}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t-2 bg-muted/50">
                    <td className="p-2 font-semibold">Durchschnitt</td>
                    {parameterNames.map((param) => (
                      <td key={param} className="p-2 text-center font-semibold">
                        {averages[param]}
                      </td>
                    ))}
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        );
      })()}

      {workdayEntries.length === 0 && (
        <div className="border rounded-lg p-8 text-center text-muted-foreground">
          Noch keine Werktag-Einträge vorhanden.
        </div>
      )}
    </div>
  );
}
