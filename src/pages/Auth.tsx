// ── Auth page — Proton VPN inspired animated login ────────────────────────────
import React, { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { Zap, Mail, Lock, User } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useUserStore } from "@/store";
import { cn } from "@/lib/utils";

// ── Floating star particle ───────────────────────────────────────────────────
function Star({ style }: { style: React.CSSProperties }) {
  return (
    <div
      className="absolute rounded-full bg-white animate-star-blink"
      style={style}
    />
  );
}

// ── Generate random stars ────────────────────────────────────────────────────
function useStars(count: number) {
  const stars = useRef(
    Array.from({ length: count }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 85}%`,
      size: Math.random() * 2.5 + 1,
      delay: `${Math.random() * 5}s`,
      duration: `${2.5 + Math.random() * 4}s`,
    }))
  );
  return stars.current;
}

export default function AuthPage() {
  const { preAuthProfile, preAuthDone } = useUserStore();
  const [mode, setMode] = useState<"login" | "signup">(preAuthDone ? "signup" : "login");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [name, setName]         = useState(preAuthProfile?.display_name ?? "");
  const [loading, setLoading]   = useState(false);
  const [mounted, setMounted]   = useState(false);
  const stars = useStars(48);

  useEffect(() => { setMounted(true); }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email, password,
          options: { data: { display_name: name }, emailRedirectTo: window.location.origin },
        });
        if (error) throw error;
        toast({ title: "Check your email", description: "Confirm your address to activate your account." });
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
    } catch (err: unknown) {
      toast({ title: "Error", description: (err as Error).message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4">

      {/* ── Deep gradient background ─────────────────────────────── */}
      <div className="absolute inset-0 bg-[#0a0e1a]" />
      {/* Teal-to-dark gradient sweep */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(165deg, hsl(185 80% 22% / 0.85) 0%, hsl(210 60% 12% / 0.7) 35%, hsl(225 40% 6% / 0.95) 70%, #0a0e1a 100%)",
        }}
      />

      {/* ── Animated glow orbs ───────────────────────────────────── */}
      <div
        className="pointer-events-none absolute animate-orb-pulse"
        style={{
          top: "-5%", left: "50%", transform: "translateX(-50%)",
          width: 520, height: 320,
          background: "radial-gradient(ellipse, hsl(180 80% 45% / 0.22) 0%, transparent 70%)",
          filter: "blur(30px)",
        }}
      />
      <div
        className="pointer-events-none absolute animate-orb-drift"
        style={{
          top: "8%", left: "15%",
          width: 260, height: 260,
          background: "radial-gradient(circle, hsl(265 85% 65% / 0.18) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />
      <div
        className="pointer-events-none absolute animate-orb-drift"
        style={{
          top: "12%", right: "10%",
          width: 200, height: 200,
          background: "radial-gradient(circle, hsl(180 72% 55% / 0.16) 0%, transparent 70%)",
          filter: "blur(35px)",
          animationDelay: "3s",
        }}
      />

      {/* ── Floating stars ────────────────────────────────────────── */}
      {stars.map((s) => (
        <Star
          key={s.id}
          style={{
            left: s.left, top: s.top,
            width: s.size, height: s.size,
            "--blink-dur": s.duration,
            animationDelay: s.delay,
          } as React.CSSProperties}
        />
      ))}

      {/* ── Teal arc line (like globe arc in Proton) ────────────── */}
      <div className="pointer-events-none absolute" style={{ top: "0%", left: "50%", transform: "translateX(-50%)", width: "120%", height: 320 }}>
        <svg width="100%" height="320" viewBox="0 0 800 320" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ opacity: 0.5 }}>
          <defs>
            <linearGradient id="arcGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="hsl(265,85%,66%)" stopOpacity="0" />
              <stop offset="40%" stopColor="hsl(180,80%,52%)" stopOpacity="0.8" />
              <stop offset="60%" stopColor="hsl(180,80%,52%)" stopOpacity="0.9" />
              <stop offset="100%" stopColor="hsl(265,85%,66%)" stopOpacity="0" />
            </linearGradient>
            <filter id="arcGlow">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>
          <path d="M0 280 Q400 40 800 280" stroke="url(#arcGrad)" strokeWidth="1.5" fill="none" filter="url(#arcGlow)" />
          <path d="M80 300 Q400 20 720 300" stroke="url(#arcGrad)" strokeWidth="0.8" fill="none" strokeOpacity="0.4" />
          {/* Moving dot on arc */}
          <circle r="4" fill="hsl(180,80%,60%)" filter="url(#arcGlow)">
            <animateMotion dur="6s" repeatCount="indefinite" path="M0 280 Q400 40 800 280" />
          </circle>
          {/* Trailing pulse rings around dot */}
          <circle r="10" fill="none" stroke="hsl(180,80%,60%)" strokeWidth="1" strokeOpacity="0.4">
            <animateMotion dur="6s" repeatCount="indefinite" path="M0 280 Q400 40 800 280" />
            <animate attributeName="r" from="4" to="20" dur="1s" repeatCount="indefinite" />
            <animate attributeName="stroke-opacity" from="0.5" to="0" dur="1s" repeatCount="indefinite" />
          </circle>
        </svg>
      </div>

      {/* ── Card ─────────────────────────────────────────────────── */}
      <div
        className={cn(
          "relative z-10 w-full max-w-sm space-y-7 rounded-3xl border px-7 py-9",
          "transition-all duration-700",
          mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        )}
        style={{
          background: "hsl(225 35% 7% / 0.82)",
          borderColor: "hsl(225 25% 18% / 0.9)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          boxShadow: "0 24px 80px hsl(0 0% 0% / 0.6), 0 0 0 1px hsl(225 25% 18% / 0.8), inset 0 1px 0 hsl(210 20% 97% / 0.05)",
        }}
      >
        {/* Logo */}
        <div className="text-center" style={{ animationDelay: "0.1s" }}>
          <div
            className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl shadow-glow-teal"
            style={{
              background: "linear-gradient(135deg, hsl(180 80% 52% / 0.25) 0%, hsl(265 85% 66% / 0.2) 100%)",
              border: "1px solid hsl(180 80% 52% / 0.35)",
            }}
          >
            <Zap className="h-8 w-8" style={{ color: "hsl(180 80% 55%)" }} />
          </div>
          <h1 className="text-2xl font-bold tracking-tight" style={{ color: "hsl(210 20% 97%)" }}>
            ThePuck
          </h1>
          <p className="mt-1 text-sm" style={{ color: "hsl(220 10% 60%)" }}>
            {mode === "login" ? "Welcome back" : preAuthDone ? "Almost there — create your account" : "Create your account"}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          {mode === "signup" && (
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2" style={{ color: "hsl(220 10% 55%)" }} />
              <input
                type="text" required value={name} onChange={(e) => setName(e.target.value)}
                placeholder="Display name"
                className="w-full rounded-xl pl-10 pr-4 py-3.5 text-sm outline-none transition-all"
                style={{
                  background: "hsl(225 30% 11%)",
                  border: "1px solid hsl(225 22% 20%)",
                  color: "hsl(210 20% 97%)",
                }}
                onFocus={(e) => { e.currentTarget.style.borderColor = "hsl(180 80% 52% / 0.6)"; e.currentTarget.style.boxShadow = "0 0 0 3px hsl(180 80% 52% / 0.12)"; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = "hsl(225 22% 20%)"; e.currentTarget.style.boxShadow = "none"; }}
              />
            </div>
          )}
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2" style={{ color: "hsl(220 10% 55%)" }} />
            <input
              type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              className="w-full rounded-xl pl-10 pr-4 py-3.5 text-sm outline-none transition-all"
              style={{
                background: "hsl(225 30% 11%)",
                border: "1px solid hsl(225 22% 20%)",
                color: "hsl(210 20% 97%)",
              }}
              onFocus={(e) => { e.currentTarget.style.borderColor = "hsl(180 80% 52% / 0.6)"; e.currentTarget.style.boxShadow = "0 0 0 3px hsl(180 80% 52% / 0.12)"; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = "hsl(225 22% 20%)"; e.currentTarget.style.boxShadow = "none"; }}
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2" style={{ color: "hsl(220 10% 55%)" }} />
            <input
              type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
              placeholder="Password" minLength={6}
              className="w-full rounded-xl pl-10 pr-4 py-3.5 text-sm outline-none transition-all"
              style={{
                background: "hsl(225 30% 11%)",
                border: "1px solid hsl(225 22% 20%)",
                color: "hsl(210 20% 97%)",
              }}
              onFocus={(e) => { e.currentTarget.style.borderColor = "hsl(180 80% 52% / 0.6)"; e.currentTarget.style.boxShadow = "0 0 0 3px hsl(180 80% 52% / 0.12)"; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = "hsl(225 22% 20%)"; e.currentTarget.style.boxShadow = "none"; }}
            />
          </div>

          {/* Primary CTA button — gradient purple like Proton */}
          <button
            type="submit"
            disabled={loading}
            className="relative mt-1 w-full overflow-hidden rounded-xl px-6 py-3.5 text-sm font-bold transition-all active:scale-[0.98] disabled:opacity-50"
            style={{
              background: "linear-gradient(135deg, hsl(265 85% 62%) 0%, hsl(275 80% 58%) 100%)",
              color: "#fff",
              boxShadow: "0 4px 24px hsl(265 85% 62% / 0.40), 0 1px 0 hsl(265 85% 80% / 0.2) inset",
            }}
          >
            {/* Shimmer sweep */}
            <span
              className="pointer-events-none absolute inset-0 rounded-xl"
              style={{
                background: "linear-gradient(90deg, transparent 0%, hsl(0 0% 100% / 0.12) 50%, transparent 100%)",
                backgroundSize: "200% 100%",
                animation: "shimmerSlide 2.5s linear infinite",
              }}
            />
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                {mode === "login" ? "Signing in…" : "Creating…"}
              </span>
            ) : (
              mode === "login" ? "Sign in" : "Create account"
            )}
          </button>
        </form>

        <p className="text-center text-xs" style={{ color: "hsl(220 10% 52%)" }}>
          {mode === "login" ? "New to ThePuck? " : "Already have an account? "}
          <button
            type="button"
            onClick={() => setMode(mode === "login" ? "signup" : "login")}
            className="font-semibold transition-opacity hover:opacity-80"
            style={{ color: "hsl(180 80% 52%)" }}
          >
            {mode === "login" ? "Sign up" : "Sign in"}
          </button>
        </p>
      </div>
    </div>
  );
}
