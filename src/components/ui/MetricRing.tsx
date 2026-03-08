// ── MetricRing — SVG arc ring with luxury glow ───────────────────────────────
import React from "react";
import { cn } from "@/lib/utils";

interface MetricRingProps {
  score: number;        // 0-100
  size?: number;        // px
  strokeWidth?: number;
  color?: "gold" | "teal" | "green" | "amber" | "red" | "blue";
  label?: string;
  sublabel?: string;
  className?: string;
}

const COLOR_MAP = {
  gold:  "hsl(var(--gold))",
  teal:  "hsl(var(--teal))",
  blue:  "hsl(var(--primary))",
  green: "hsl(var(--status-green))",
  amber: "hsl(var(--status-amber))",
  red:   "hsl(var(--status-red))",
} as const;

const GLOW_MAP = {
  gold:  "hsl(var(--gold) / 0.55)",
  teal:  "hsl(var(--teal) / 0.55)",
  blue:  "hsl(var(--primary) / 0.6)",
  green: "hsl(var(--status-green) / 0.55)",
  amber: "hsl(var(--status-amber) / 0.55)",
  red:   "hsl(var(--status-red) / 0.55)",
} as const;

export function MetricRing({
  score,
  size = 140,
  strokeWidth = 7,
  color = "blue",
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
  const glowColor   = GLOW_MAP[color];
  const filterId = `ring-glow-${color}`;

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)", overflow: "visible" }}>
        <defs>
          <filter id={filterId} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="blur1" />
            <feGaussianBlur stdDeviation="8" result="blur2" />
            <feMerge>
              <feMergeNode in="blur2" />
              <feMergeNode in="blur1" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Ambient glow ring behind track */}
        <circle
          cx={cx} cy={cy} r={r}
          fill="none"
          stroke={glowColor}
          strokeWidth={strokeWidth + 6}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ filter: `blur(${strokeWidth * 1.4}px)`, opacity: 0.35 }}
        />

        {/* Track */}
        <circle
          cx={cx} cy={cy} r={r}
          fill="none"
          stroke="hsl(var(--border))"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />

        {/* Progress arc */}
        <circle
          cx={cx} cy={cy} r={r}
          fill="none"
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          filter={`url(#${filterId})`}
          style={{
            transition: "stroke-dashoffset 0.9s cubic-bezier(0.4,0,0.2,1)",
          }}
        />
      </svg>

      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className="font-bold"
          style={{
            fontSize: size * 0.26,
            lineHeight: 1,
            letterSpacing: "-0.04em",
            color: strokeColor,
            textShadow: `0 0 20px ${glowColor}, 0 0 40px ${glowColor}`,
          }}
        >
          {clamped}
        </span>
        {label && (
          <span
            className="mt-1 font-semibold text-muted-foreground"
            style={{ fontSize: size * 0.105 }}
          >
            {label}
          </span>
        )}
        {sublabel && (
          <span
            className="font-semibold"
            style={{ fontSize: size * 0.09, color: strokeColor }}
          >
            {sublabel}
          </span>
        )}
      </div>
    </div>
  );
}
