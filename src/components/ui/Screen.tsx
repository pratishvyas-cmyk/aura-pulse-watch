// ── Screen — full-height page wrapper ────────────────────────────────────────
import React from "react";
import { cn } from "@/lib/utils";

interface ScreenProps {
  children: React.ReactNode;
  className?: string;
  scrollable?: boolean;
}

export function Screen({ children, className, scrollable = true }: ScreenProps) {
  return (
    <div
      className={cn(
        "flex min-h-full flex-col px-4 pb-6 pt-5 md:px-8",
        scrollable && "overflow-y-auto",
        className
      )}
    >
      {children}
    </div>
  );
}
