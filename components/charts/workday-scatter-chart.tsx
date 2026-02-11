"use client";

import { useEffect, useRef, useState } from "react";
import * as echarts from "echarts";
import type { EChartsOption } from "echarts";

interface WorkdayEntry {
  id: string;
  date: Date;
  answers: Record<string, number>;
}

interface WorkdayScatterChartProps {
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

// Color palette for data points
const COLORS = [
  "#6366f1", "#8b5cf6", "#a855f7", "#d946ef", "#ec4899",
  "#f43f5e", "#ef4444", "#f97316", "#f59e0b", "#eab308",
  "#84cc16", "#22c55e", "#10b981", "#14b8a6", "#06b6d4",
];

export function WorkdayScatterChart({ entries }: WorkdayScatterChartProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);

  const [xAxis, setXAxis] = useState("sleepQuality");
  const [yAxis, setYAxis] = useState("mood");
  const [sizeParam, setSizeParam] = useState("tiredness");

  useEffect(() => {
    if (!chartRef.current || entries.length === 0) return;

    chartInstance.current = echarts.init(chartRef.current);

    const sortedEntries = [...entries].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    const scatterData = sortedEntries.map((entry, index) => ({
      value: [
        entry.answers[xAxis] ?? 0,
        entry.answers[yAxis] ?? 0,
      ],
      [xAxis]: entry.answers[xAxis] ?? 0,
      [yAxis]: entry.answers[yAxis] ?? 0,
      [sizeParam]: entry.answers[sizeParam] ?? 0,
      date: new Date(entry.date).toLocaleDateString("de-DE"),
      colorIndex: index,
    }));

    const option: EChartsOption = {
      title: {
        text: `${FIELD_LABELS[yAxis]} vs ${FIELD_LABELS[xAxis]}`,
        textStyle: { color: "#fff" },
      },
      tooltip: {
        trigger: "item",
        formatter: (params: unknown) => {
          const p = params as { data: Record<string, unknown> };
          const d = p.data;
          return `
            Datum: ${d.date}<br/>
            ${FIELD_LABELS[xAxis]}: ${d[xAxis]}<br/>
            ${FIELD_LABELS[yAxis]}: ${d[yAxis]}<br/>
            ${FIELD_LABELS[sizeParam]} (Größe): ${d[sizeParam]}
          `;
        },
      },
      xAxis: {
        type: "value",
        name: FIELD_LABELS[xAxis],
        min: 0,
        max: 5,
        nameLocation: "middle",
        nameGap: 30,
        axisLabel: { color: "#fff" },
        nameTextStyle: { color: "#fff" },
      },
      yAxis: {
        type: "value",
        name: FIELD_LABELS[yAxis],
        min: 0,
        max: 5,
        nameLocation: "middle",
        nameGap: 40,
        axisLabel: { color: "#fff" },
        nameTextStyle: { color: "#fff" },
      },
      series: [
        {
          name: "Tageswerte",
          type: "scatter",
          symbolSize: (data: Record<string, number>) => {
            const size = data[sizeParam] ?? 1;
            return Math.max(size * 8, 10);
          },
          data: scatterData,
          itemStyle: {
            color: (params: { dataIndex: number }) => {
              return COLORS[params.dataIndex % COLORS.length];
            },
          },
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
  }, [entries, xAxis, yAxis, sizeParam]);

  if (entries.length === 0) return null;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <label htmlFor="x-axis" className="text-sm font-medium">
            X-Achse:
          </label>
          <select
            id="x-axis"
            value={xAxis}
            onChange={(e) => setXAxis(e.target.value)}
            className="border rounded-md px-3 py-1.5 text-sm"
          >
            {FIELD_KEYS.map((key) => (
              <option key={key} value={key}>
                {FIELD_LABELS[key]}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label htmlFor="y-axis" className="text-sm font-medium">
            Y-Achse:
          </label>
          <select
            id="y-axis"
            value={yAxis}
            onChange={(e) => setYAxis(e.target.value)}
            className="border rounded-md px-3 py-1.5 text-sm"
          >
            {FIELD_KEYS.map((key) => (
              <option key={key} value={key}>
                {FIELD_LABELS[key]}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label htmlFor="size-param" className="text-sm font-medium">
            Größe:
          </label>
          <select
            id="size-param"
            value={sizeParam}
            onChange={(e) => setSizeParam(e.target.value)}
            className="border rounded-md px-3 py-1.5 text-sm"
          >
            {FIELD_KEYS.map((key) => (
              <option key={key} value={key}>
                {FIELD_LABELS[key]}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div ref={chartRef} className="w-full h-[500px]" />
    </div>
  );
}
