// ── MetricRing — SVG arc ring (readiness/stress/sleep) ───────────────────────
import React from "react";
import { cn } from "@/lib/utils";

interface MetricRingProps {
  score: number;        // 0-100
  size?: number;        // px
  strokeWidth?: number;
  color?: "gold" | "teal" | "green" | "amber" | "red";
  label?: string;
  sublabel?: string;
  className?: string;
}

const COLOR_MAP = {
  gold:  "hsl(var(--gold))",
  teal:  "hsl(var(--primary))",
  green: "hsl(var(--status-green))",
  amber: "hsl(var(--status-amber))",
  red:   "hsl(var(--status-red))",
} as const;

export function MetricRing({
  score,
  size = 140,
  strokeWidth = 7,
  color = "gold",
  label,
  sublabel,
  className,
}: MetricRingProps) {
  const r = (size - strokeWidth * 2) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const circumference = 2 * Math.PI * r;
  const clamped = Math.max(0, Math.min(100, score));
  const offset = circumference - (clamped / 100) * circumference;
  const strokeColor = COLOR_MAP[color];

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        {/* Track */}
        <circle
          cx={cx} cy={cy} r={r}
          fill="none"
          stroke="hsl(var(--border))"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
        {/* Progress */}
        <circle
          cx={cx} cy={cy} r={r}
          fill="none"
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{
            transition: "stroke-dashoffset 0.8s cubic-bezier(0.4,0,0.2,1)",
            filter: `drop-shadow(0 0 6px ${strokeColor}66)`,
          }}
        />
      </svg>
      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-light text-foreground" style={{ fontSize: size * 0.22, lineHeight: 1 }}>
          {clamped}
        </span>
        {label && (
          <span className="mt-1 text-muted-foreground" style={{ fontSize: size * 0.1 }}>
            {label}
          </span>
        )}
        {sublabel && (
          <span className="text-muted-foreground" style={{ fontSize: size * 0.085 }}>
            {sublabel}
          </span>
        )}
      </div>
    </div>
  );
}
