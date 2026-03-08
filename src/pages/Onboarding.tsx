// ── Onboarding — 3-step pairing wizard ───────────────────────────────────────
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Zap, Bluetooth, CheckCircle2, ChevronRight, User, Ruler } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useUserStore } from "@/store";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { GhostButton } from "@/components/ui/PrimaryButton";
import { cn } from "@/lib/utils";

type Step = 0 | 1 | 2;

export default function Onboarding() {
  const navigate = useNavigate();
  const { profile, updateProfile } = useUserStore();
  const [step, setStep] = useState<Step>(0);
  const [scanning, setScanning] = useState(false);
  const [found, setFound] = useState(false);
  const [name, setName] = useState(profile?.display_name ?? "");
  const [age, setAge] = useState<string>(profile?.age?.toString() ?? "");
  const [units, setUnits] = useState<"metric" | "imperial">(profile?.units ?? "metric");
  const [saving, setSaving] = useState(false);

  // Simulate BLE scan
  useEffect(() => {
    if (step === 1 && scanning) {
      const t = setTimeout(() => setFound(true), 3000);
      return () => clearTimeout(t);
    }
  }, [step, scanning]);

  async function finishOnboarding() {
    if (!profile) return;
    setSaving(true);
    await supabase.from("profiles").update({
      display_name: name,
      age: age ? parseInt(age) : null,
      units,
      onboarding_done: true,
    }).eq("user_id", profile.user_id);
    updateProfile({ display_name: name, age: age ? parseInt(age) : null, units, onboarding_done: true });
    navigate("/");
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Hero glow */}
      <div className="pointer-events-none absolute inset-0 gradient-hero" />

      {/* Step indicators */}
      <div className="relative z-10 flex items-center justify-center gap-2 pt-12 pb-4">
        {([0, 1, 2] as Step[]).map((s) => (
          <div key={s} className={cn(
            "h-1.5 rounded-full transition-all duration-300",
            s === step ? "w-8 bg-teal" : s < step ? "w-4 bg-teal/50" : "w-4 bg-border"
          )} />
        ))}
      </div>

      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 text-center">
        {/* Step 0 — Welcome */}
        {step === 0 && (
          <div className="animate-fade-in space-y-6 max-w-sm">
            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-3xl bg-teal-dim border border-primary/30 shadow-glow-teal">
              <Zap className="h-12 w-12 text-teal" />
            </div>
            <div>
              <h1 className="text-3xl font-light tracking-tight text-foreground">Meet ThePuck</h1>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                An ultra-thin health sensor that lives invisibly under your mechanical watch,<br />
                monitoring your body around the clock.
              </p>
            </div>
            <div className="space-y-2 text-left rounded-2xl border border-subtle bg-surface p-4">
              {["Continuous heart rate & HRV", "Stress & readiness scores", "Sleep quality tracking", "Gesture controls"].map(f => (
                <div key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="h-3.5 w-3.5 text-teal flex-shrink-0" />
                  {f}
                </div>
              ))}
            </div>
            <PrimaryButton onClick={() => setStep(1)} className="w-full" icon={<ChevronRight className="h-4 w-4" />}>
              Get started
            </PrimaryButton>
          </div>
        )}

        {/* Step 1 — BLE Pairing */}
        {step === 1 && (
          <div className="animate-fade-in space-y-6 max-w-sm w-full">
            <div>
              <h2 className="text-2xl font-light text-foreground">Pair your Puck</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Place your iPhone near your watch with ThePuck attached underneath.
              </p>
            </div>

            {/* Proximity animation */}
            <div className="relative mx-auto flex h-40 w-40 items-center justify-center">
              {found ? (
                <>
                  <div className="absolute inset-0 rounded-full bg-teal/10 animate-ping-slow" />
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-teal-dim border-2 border-teal shadow-glow-teal">
                    <CheckCircle2 className="h-8 w-8 text-teal" />
                  </div>
                </>
              ) : scanning ? (
                <>
                  <div className="absolute inset-0 rounded-full border-2 border-primary/20 animate-ping-slow" />
                  <div className="absolute inset-8 rounded-full border border-primary/30 animate-ping-slow" style={{ animationDelay: "0.5s" }} />
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-surface border border-subtle">
                    <Bluetooth className="h-8 w-8 text-teal animate-pulse" />
                  </div>
                </>
              ) : (
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-surface border border-subtle">
                  <Bluetooth className="h-8 w-8 text-muted-foreground" />
                </div>
              )}
            </div>

            {found ? (
              <div className="space-y-2">
                <p className="text-sm font-medium text-status-green">ThePuck Gen 1 found!</p>
                <p className="text-xs text-muted-foreground">Serial: TPK-2024-A4B7</p>
                <PrimaryButton onClick={() => setStep(2)} className="w-full mt-2">
                  Continue <ChevronRight className="h-4 w-4" />
                </PrimaryButton>
              </div>
            ) : scanning ? (
              <p className="text-sm text-muted-foreground animate-pulse">Scanning for ThePuck…</p>
            ) : (
              <div className="space-y-3 w-full">
                <PrimaryButton onClick={() => setScanning(true)} className="w-full">
                  <Bluetooth className="h-4 w-4" /> Start scan
                </PrimaryButton>
                <GhostButton onClick={() => setStep(2)} className="w-full text-xs">
                  Skip for now
                </GhostButton>
              </div>
            )}
          </div>
        )}

        {/* Step 2 — Profile setup */}
        {step === 2 && (
          <div className="animate-fade-in space-y-6 max-w-sm w-full">
            <div>
              <h2 className="text-2xl font-light text-foreground">Your profile</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Help ThePuck calibrate your metrics for greater accuracy.
              </p>
            </div>

            <div className="space-y-3 text-left">
              <div>
                <label className="mb-1.5 block text-xs text-muted-foreground uppercase tracking-wider">Display name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    value={name} onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    className="w-full rounded-xl border border-subtle bg-surface pl-10 pr-4 py-3 text-sm text-foreground placeholder-muted-foreground outline-none focus:border-primary/60"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs text-muted-foreground uppercase tracking-wider">Age</label>
                <div className="relative">
                  <Ruler className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="number" value={age} onChange={(e) => setAge(e.target.value)}
                    placeholder="e.g. 34"
                    min={10} max={120}
                    className="w-full rounded-xl border border-subtle bg-surface pl-10 pr-4 py-3 text-sm text-foreground placeholder-muted-foreground outline-none focus:border-primary/60"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs text-muted-foreground uppercase tracking-wider">Units</label>
                <div className="flex gap-2">
                  {(["metric", "imperial"] as const).map((u) => (
                    <button
                      key={u}
                      onClick={() => setUnits(u)}
                      className={cn(
                        "flex-1 rounded-xl border py-3 text-sm font-medium capitalize transition-colors",
                        units === u
                          ? "border-primary/40 bg-teal-dim text-teal"
                          : "border-subtle bg-surface text-muted-foreground hover:bg-surface-raised"
                      )}
                    >
                      {u}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <PrimaryButton onClick={finishOnboarding} loading={saving} className="w-full">
              Start tracking <ChevronRight className="h-4 w-4" />
            </PrimaryButton>
          </div>
        )}
      </div>
    </div>
  );
}
