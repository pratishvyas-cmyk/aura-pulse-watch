// ── SparkLine — tiny recharts line (inline trend) ────────────────────────────
import React from "react";
import { ResponsiveContainer, LineChart, Line, Tooltip } from "recharts";
import type { ChartPoint } from "@/types";

interface SparkLineProps {
  data: ChartPoint[];
  color?: string;
  height?: number;
}

export function SparkLine({ data, color = "hsl(var(--primary))", height = 40 }: SparkLineProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 2, right: 2, bottom: 2, left: 2 }}>
        <Line
          type="monotone"
          dataKey="value"
          stroke={color}
          strokeWidth={1.5}
          dot={false}
          isAnimationActive={false}
        />
        <Tooltip
          contentStyle={{ display: "none" }}
          cursor={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
