// ── SectionHeader ─────────────────────────────────────────────────────────────
import React from "react";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  title: string;
  action?: { label: string; onClick: () => void };
  className?: string;
}

export function SectionHeader({ title, action, className }: SectionHeaderProps) {
  return (
    <div className={cn("flex items-center justify-between", className)}>
      <h2 className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
        {title}
      </h2>
      {action && (
        <button
          onClick={action.onClick}
          className="text-xs text-teal transition-opacity hover:opacity-70"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
