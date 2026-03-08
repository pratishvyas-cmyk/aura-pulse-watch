// ── PremiumGate — wraps premium-only content ──────────────────────────────────
import React from "react";
import { Star, Lock, Zap } from "lucide-react";
import { useUserStore } from "@/store";
import { cn } from "@/lib/utils";

interface PremiumGateProps {
  children: React.ReactNode;
  feature?: string;
  description?: string;
}

export function PremiumGate({ children, feature = "This feature", description = "Upgrade to ThePuck Premium to unlock advanced controls and personalisation." }: PremiumGateProps) {
  const { isSubscribed, setSubscribed } = useUserStore();

  if (isSubscribed) return <>{children}</>;

  return (
    <div className="relative">
      {/* Blurred preview */}
      <div className="pointer-events-none select-none blur-[3px] opacity-40 overflow-hidden max-h-48">
        {children}
      </div>

      {/* Lock overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl bg-gradient-to-b from-surface/60 to-surface/95 backdrop-blur-[1px] border border-gold/30 p-6 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gold/15 border border-gold/30 mb-3">
          <Lock className="h-5 w-5 text-gold" />
        </div>
        <p className="text-sm font-bold text-foreground mb-1">{feature} is Premium</p>
        <p className="text-xs text-muted-foreground mb-4 max-w-[220px]">{description}</p>
        <button
          onClick={() => setSubscribed(true)}
          className="flex items-center gap-2 rounded-xl bg-gold px-5 py-2.5 text-sm font-bold text-background shadow-glow-gold transition-all active:scale-95 hover:opacity-90"
        >
          <Star className="h-3.5 w-3.5" />
          Upgrade to Premium
        </button>
      </div>
    </div>
  );
}
