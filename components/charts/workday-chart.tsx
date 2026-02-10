"use client";

import { useEffect, useRef } from "react";
import * as echarts from "echarts";
import type { EChartsOption } from "echarts";

interface WorkdayEntry {
  id: string;
  date: Date;
  answers: Record<string, number>;
}

interface WorkdayChartProps {
  entries: WorkdayEntry[];
  dateRange: { from: Date; to: Date };
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

export function WorkdayChart({ entries, dateRange }: WorkdayChartProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    // Initialize chart
    chartInstance.current = echarts.init(chartRef.current);

    // Sort entries by date
    const sortedEntries = [...entries].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    // Extract dates for x-axis
    const dates = sortedEntries.map((entry) =>
      new Date(entry.date).toLocaleDateString("de-DE")
    );

    // Build series data for each field
    const series: EChartsOption["series"] = FIELD_KEYS.map((key) => ({
      name: FIELD_LABELS[key],
      type: "line",
      smooth: true,
      areaStyle: { opacity: 0.1 },
      data: sortedEntries.map((entry) => entry.answers[key] ?? null),
    }));

    const option: EChartsOption = {
      title: {
        text: `Tagesanalyse: ${dateRange.from.toLocaleDateString("de-DE")} - ${dateRange.to.toLocaleDateString("de-DE")}`,
      },
      tooltip: {
        trigger: "axis",
        axisPointer: { type: "cross" },
      },
      legend: {
        data: FIELD_KEYS.map((k) => FIELD_LABELS[k]),
        type: "scroll",
        bottom: 10,
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "15%",
        containLabel: true,
      },
      xAxis: {
        type: "category",
        boundaryGap: false,
        data: dates,
      },
      yAxis: {
        type: "value",
        min: 0,
        max: 5,
        interval: 1,
      },
      series,
    };

    chartInstance.current.setOption(option);

    // Handle resize
    const handleResize = () => chartInstance.current?.resize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      chartInstance.current?.dispose();
    };
  }, [entries, dateRange]);

  return <div ref={chartRef} className="w-full h-[500px]" />;
}
