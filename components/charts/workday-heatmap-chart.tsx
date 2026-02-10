"use client";

import { useEffect, useRef } from "react";
import * as echarts from "echarts";
import type { EChartsOption } from "echarts";

interface WorkdayEntry {
  id: string;
  date: Date;
  answers: Record<string, number>;
}

interface WorkdayHeatmapChartProps {
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

export function WorkdayHeatmapChart({ entries }: WorkdayHeatmapChartProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);

  useEffect(() => {
    if (!chartRef.current || entries.length === 0) return;

    chartInstance.current = echarts.init(chartRef.current);

    // Sort entries by date
    const sortedEntries = [...entries].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    // X-axis: dates
    const dates = sortedEntries.map((entry) =>
      new Date(entry.date).toLocaleDateString("de-DE", {
        day: "2-digit",
        month: "2-digit",
      })
    );

    // Y-axis: parameter labels
    const yLabels = FIELD_KEYS.map((key) => FIELD_LABELS[key]);

    // Build heatmap data: [x-index, y-index, value]
    const heatmapData: [number, number, number][] = [];
    sortedEntries.forEach((entry, xIndex) => {
      FIELD_KEYS.forEach((key, yIndex) => {
        const value = entry.answers[key] ?? 0;
        heatmapData.push([xIndex, yIndex, value]);
      });
    });

    const option: EChartsOption = {
      tooltip: {
        position: "top",
        formatter: (params: unknown) => {
          const p = params as { data: [number, number, number] };
          const date = dates[p.data[0]];
          const param = yLabels[p.data[1]];
          const value = p.data[2];
          return `${date}<br/>${param}: <b>${value}</b>`;
        },
      },
      grid: {
        height: "70%",
        top: "10%",
        left: "20%",
        right: "5%",
      },
      xAxis: {
        type: "category",
        data: dates,
        splitArea: { show: true },
        axisLabel: { rotate: 45 },
      },
      yAxis: {
        type: "category",
        data: yLabels,
        splitArea: { show: true },
      },
      visualMap: {
        min: 0,
        max: 5,
        calculable: true,
        orient: "horizontal",
        left: "center",
        bottom: "2%",
        inRange: {
          color: ["#f3f4f6", "#fde68a", "#fbbf24", "#f97316", "#dc2626"],
        },
      },
      series: [
        {
          name: "Bewertung",
          type: "heatmap",
          data: heatmapData,
          label: { show: true },
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowColor: "rgba(0, 0, 0, 0.5)",
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
  }, [entries]);

  if (entries.length === 0) return null;

  return <div ref={chartRef} className="w-full h-[600px]" />;
}
