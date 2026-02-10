"use client";

import { useRef } from "react";
import { WorkdayChart } from "./workday-chart";
import { WorkdayRadarChart } from "./workday-radar-chart";
import { WorkdayHeatmapChart } from "./workday-heatmap-chart";
import { WorkdayScatterChart } from "./workday-scatter-chart";
import { ExportPdfButton } from "./export-pdf-button";

interface WorkdayEntry {
  id: string;
  date: Date;
  answers: Record<string, number>;
}

interface AnalyticsChartsProps {
  entries: WorkdayEntry[];
  dateRange: { from: Date; to: Date };
  sessionInfo: {
    medicationName: string;
    dosage: string;
    monitoringFrom: string;
    monitoringTo: string;
    workdayCount: number;
    weekendCount: number;
  };
}

export function AnalyticsCharts({
  entries,
  dateRange,
  sessionInfo,
}: AnalyticsChartsProps) {
  const chartsRef = useRef<HTMLDivElement>(null);

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <ExportPdfButton
          containerRef={chartsRef}
          title={`Analytics Report: ${sessionInfo.medicationName}`}
          filename={`analytics-${sessionInfo.medicationName.toLowerCase().replace(/\s+/g, "-")}`}
        />
      </div>

      <div ref={chartsRef} className="space-y-6 bg-white">
        {/* Header for PDF */}
        <div className="p-4 border rounded-lg bg-gray-50">
          <h2 className="text-xl font-bold mb-2">
            Session Analytics: {sessionInfo.medicationName}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Dosierung</p>
              <p className="font-medium">{sessionInfo.dosage}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Zeitraum</p>
              <p className="font-medium">
                {sessionInfo.monitoringFrom} - {sessionInfo.monitoringTo}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Werktag-Einträge</p>
              <p className="font-medium">{sessionInfo.workdayCount}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Wochenend-Einträge</p>
              <p className="font-medium">{sessionInfo.weekendCount}</p>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="border rounded-lg p-4 bg-white">
          <h2 className="text-lg font-semibold mb-4">Werktag-Verlauf</h2>
          <WorkdayChart entries={entries} dateRange={dateRange} />
        </div>

        <div className="border rounded-lg p-4 bg-white">
          <h2 className="text-lg font-semibold mb-4">Tagesprofil (Radar)</h2>
          <WorkdayRadarChart entries={entries} />
        </div>

        <div className="border rounded-lg p-4 bg-white">
          <h2 className="text-lg font-semibold mb-4">Übersicht (Heatmap)</h2>
          <WorkdayHeatmapChart entries={entries} />
        </div>

        <div className="border rounded-lg p-4 bg-white">
          <h2 className="text-lg font-semibold mb-4">Korrelation (Scatter)</h2>
          <WorkdayScatterChart entries={entries} />
        </div>
      </div>
    </div>
  );
}
