// ── ConnectionBadge ───────────────────────────────────────────────────────────
import React from "react";
import { cn } from "@/lib/utils";
import type { ConnectionState } from "@/types";

const CONFIG: Record<ConnectionState, { dot: string; label: string }> = {
  connected:    { dot: "bg-status-green",           label: "Connected"    },
  syncing:      { dot: "bg-primary animate-pulse",  label: "Syncing"      },
  reconnecting: { dot: "bg-status-amber animate-pulse", label: "Reconnecting" },
  disconnected: { dot: "bg-status-red",             label: "Disconnected" },
};

export function ConnectionBadge({ state }: { state: ConnectionState }) {
  const cfg = CONFIG[state];
  return (
    <div className="flex items-center gap-1.5 rounded-full border border-subtle bg-surface px-2.5 py-1 shadow-card">
      <span className={cn("h-1.5 w-1.5 rounded-full", cfg.dot)} />
      <span className="text-[11px] text-muted-foreground">{cfg.label}</span>
    </div>
  );
}
