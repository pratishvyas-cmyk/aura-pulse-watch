// ── MetricChip — small pill: icon + value + unit ──────────────────────────────
import React from "react";
import { cn } from "@/lib/utils";

type ChipColor = "red" | "green" | "amber" | "teal" | "blue" | "purple" | "gold";

interface MetricChipProps {
  icon: React.ReactNode;
  value: string | number;
  unit?: string;
  label?: string;
  highlight?: boolean;
  pulse?: boolean;
  color?: ChipColor;
  className?: string;
}

const COLOR_CLASSES: Record<ChipColor, { icon: string; border: string; bg: string }> = {
  red:    { icon: "text-status-red",   border: "border-status-red/25",   bg: "bg-status-red/5"   },
  green:  { icon: "text-status-green", border: "border-status-green/25", bg: "bg-status-green/5" },
  amber:  { icon: "text-status-amber", border: "border-status-amber/25", bg: "bg-status-amber/5" },
  teal:   { icon: "text-teal",         border: "border-teal/25",         bg: "bg-teal/5"         },
  blue:   { icon: "text-teal",         border: "border-teal/25",         bg: "bg-teal/5"         },
  purple: { icon: "text-primary",      border: "border-primary/25",      bg: "bg-primary/5"      },
  gold:   { icon: "text-gold",         border: "border-gold/25",         bg: "bg-gold/5"         },
};

export function MetricChip({ icon, value, unit, label, highlight, pulse, color = "teal", className }: MetricChipProps) {
  const c = COLOR_CLASSES[color];
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-1 rounded-2xl border bg-surface px-4 py-3 shadow-card",
        c.border,
        highlight ? c.bg : "border-subtle",
        className
      )}
    >
      <span className={cn(c.icon, pulse && "animate-pulse-beat")}>{icon}</span>
      <span className="text-xl font-light leading-none text-foreground">
        {value}
        {unit && <span className="ml-0.5 text-xs text-muted-foreground">{unit}</span>}
      </span>
      {label && <span className="text-[11px] text-muted-foreground">{label}</span>}
    </div>
  );
}
