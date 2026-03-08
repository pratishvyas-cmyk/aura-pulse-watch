// ── PrimaryButton & GhostButton ───────────────────────────────────────────────
import React from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  icon?: React.ReactNode;
}

export function PrimaryButton({ children, className, loading, icon, ...props }: ButtonProps) {
  return (
    <button
      {...props}
      disabled={props.disabled || loading}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl bg-teal px-6 py-3 text-sm font-semibold text-background",
        "transition-all hover:opacity-90 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50",
        "shadow-glow-teal",
        className
      )}
    >
      {loading ? (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
      ) : icon}
      {children}
    </button>
  );
}

export function GhostButton({ children, className, icon, ...props }: ButtonProps) {
  return (
    <button
      {...props}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl border border-subtle px-6 py-3 text-sm font-medium text-foreground",
        "transition-all hover:bg-surface-raised active:scale-95 disabled:opacity-50",
        className
      )}
    >
      {icon}
      {children}
    </button>
  );
}
