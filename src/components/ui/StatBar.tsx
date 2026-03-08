// ── StatBar — horizontal progress bar ────────────────────────────────────────
import React from "react";
import { cn } from "@/lib/utils";

interface StatBarProps {
  label: string;
  value: number;
  goal: number;
  unit?: string;
  color?: "teal" | "gold" | "green" | "amber";
  className?: string;
}

const BAR_COLOR = {
  teal:  "bg-primary",
  gold:  "bg-gold",
  green: "bg-status-green",
  amber: "bg-status-amber",
} as const;

export function StatBar({ label, value, goal, unit, color = "teal", className }: StatBarProps) {
  const pct = Math.min(100, Math.round((value / goal) * 100));
  const formatted = value >= 1000 ? `${(value / 1000).toFixed(1)}k` : String(value);
  const goalFormatted = goal >= 1000 ? `${(goal / 1000).toFixed(0)}k` : String(goal);

  return (
    <div className={cn("space-y-1.5", className)}>
      <div className="flex items-baseline justify-between">
        <span className="text-xs text-muted-foreground">{label}</span>
        <span className="text-xs text-foreground">
          <span className="font-medium">{formatted}</span>
          <span className="text-muted-foreground">/{goalFormatted}</span>
          {unit && <span className="ml-0.5 text-muted-foreground">{unit}</span>}
        </span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-raised">
        <div
          className={cn("h-full rounded-full transition-all duration-700", BAR_COLOR[color])}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
