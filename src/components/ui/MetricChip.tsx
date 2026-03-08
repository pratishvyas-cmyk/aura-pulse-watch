// ── MetricChip — small pill: icon + value + unit ──────────────────────────────
import React from "react";
import { cn } from "@/lib/utils";

interface MetricChipProps {
  icon: React.ReactNode;
  value: string | number;
  unit?: string;
  label?: string;
  highlight?: boolean;   // teal glow
  pulse?: boolean;       // animate-pulse-beat on icon
  className?: string;
}

export function MetricChip({ icon, value, unit, label, highlight, pulse, className }: MetricChipProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-1 rounded-2xl border border-subtle bg-surface px-4 py-3 shadow-card",
        highlight && "border-primary/30 bg-teal-dim",
        className
      )}
    >
      <span className={cn("text-teal", pulse && "animate-pulse-beat")}>{icon}</span>
      <span className="text-xl font-light leading-none text-foreground">
        {value}
        {unit && <span className="ml-0.5 text-xs text-muted-foreground">{unit}</span>}
      </span>
      {label && <span className="text-[11px] text-muted-foreground">{label}</span>}
    </div>
  );
}
