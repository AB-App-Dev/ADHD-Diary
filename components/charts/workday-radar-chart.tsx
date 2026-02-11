"use client";

import { useEffect, useRef, useState } from "react";
import * as echarts from "echarts";
import type { EChartsOption } from "echarts";

interface WorkdayEntry {
  id: string;
  date: Date;
  answers: Record<string, number>;
}

interface WorkdayRadarChartProps {
  entries: WorkdayEntry[];
}

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

const FIELD_KEYS = Object.keys(FIELD_LABELS);

export function WorkdayRadarChart({ entries }: WorkdayRadarChartProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Sort entries by date
  const sortedEntries = [...entries].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  useEffect(() => {
    if (!chartRef.current || sortedEntries.length === 0) return;

    chartInstance.current = echarts.init(chartRef.current);

    const selectedEntry = sortedEntries[selectedIndex];
    const values = FIELD_KEYS.map((key) => selectedEntry.answers[key] ?? 0);

    const option: EChartsOption = {
      title: {
        text: `Tagesprofil: ${new Date(selectedEntry.date).toLocaleDateString("de-DE")}`,
        textStyle: { color: "#fff" },
      },
      tooltip: {
        trigger: "item",
      },
      radar: {
        indicator: FIELD_KEYS.map((key) => ({
          name: FIELD_LABELS[key],
          max: 5,
        })),
        axisName: { color: "#fff" },
      },
      series: [
        {
          name: "Tageswerte",
          type: "radar",
          data: [
            {
              value: values,
              name: "Aktuelle Werte",
              areaStyle: { color: "rgba(99, 102, 241, 0.4)" },
              lineStyle: { color: "rgb(99, 102, 241)" },
              itemStyle: { color: "rgb(99, 102, 241)" },
            },
          ],
        },
      ],
    };

    chartInstance.current.setOption(option);

    const handleResize = () => chartInstance.current?.resize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      chartInstance.current?.dispose();
    };
  }, [sortedEntries, selectedIndex]);

  if (sortedEntries.length === 0) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <label htmlFor="date-select" className="text-sm font-medium">
          Datum auswählen:
        </label>
        <select
          id="date-select"
          value={selectedIndex}
          onChange={(e) => setSelectedIndex(Number(e.target.value))}
          className="border rounded-md px-3 py-1.5 text-sm"
        >
          {sortedEntries.map((entry, index) => (
            <option key={entry.id} value={index}>
              {new Date(entry.date).toLocaleDateString("de-DE")}
            </option>
          ))}
        </select>
      </div>
      <div ref={chartRef} className="w-full h-[500px]" />
    </div>
  );
}
