// ── BatteryPill ───────────────────────────────────────────────────────────────
import React from "react";
import { cn } from "@/lib/utils";
import { BatteryFull, BatteryMedium, BatteryLow, BatteryWarning } from "lucide-react";

export function BatteryPill({ level }: { level: number }) {
  const Icon =
    level > 60 ? BatteryFull :
    level > 30 ? BatteryMedium :
    level > 10 ? BatteryLow :
    BatteryWarning;

  const color =
    level > 60 ? "text-status-green" :
    level > 30 ? "text-status-amber" :
    "text-status-red";

  return (
    <div className={cn("flex items-center gap-1 rounded-full border border-subtle bg-surface px-2.5 py-1 shadow-card", color)}>
      <Icon className="h-3 w-3" />
      <span className="text-[11px]">{level}%</span>
    </div>
  );
}
