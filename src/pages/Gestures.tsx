// ── Gestures & Haptics (Premium) ──────────────────────────────────────────────
import React, { useEffect, useState } from "react";
import { Screen } from "@/components/ui/Screen";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { PremiumGate } from "@/components/ui/PremiumGate";
import { useGestureStore } from "@/store";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";
import type { GestureAction, GestureType, HapticPattern } from "@/types";
import { Vibrate, Hand, Music, Phone, Brain, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

const GESTURE_LABELS: Record<GestureType, string> = {
  double_tap:  "Double tap",
  tilt_left:   "Tilt left",
  tilt_right:  "Tilt right",
  press_hold:  "Press & hold",
  triple_tap:  "Triple tap",
};

const ACTION_LABELS: Record<GestureAction, string> = {
  call_accept:       "Accept call",
  call_reject:       "Reject call",
  music_play_pause:  "Play / Pause",
  music_next:        "Next track",
  music_prev:        "Previous track",
  mark_stress:       "Mark stress",
  none:              "None",
};

const ACTION_ICONS: Record<GestureAction, React.ComponentType<{ className?: string }>> = {
  call_accept:      Phone,
  call_reject:      Phone,
  music_play_pause: Music,
  music_next:       Music,
  music_prev:       Music,
  mark_stress:      Brain,
  none:             Hand,
};

const HAPTIC_LABELS: Record<string, string> = {
  alert:           "Alert",
  stress_warning:  "Stress warning",
  readiness_nudge: "Readiness nudge",
  call_incoming:   "Incoming call",
};

const PATTERN_LABELS: Record<HapticPattern, string> = {
  single:      "Single pulse",
  double:      "Double pulse",
  long:        "Long vibration",
  pattern_sos: "SOS pattern",
};

const ALL_ACTIONS: GestureAction[] = ["call_accept", "call_reject", "music_play_pause", "music_next", "music_prev", "mark_stress", "none"];
const ALL_PATTERNS: HapticPattern[] = ["single", "double", "long", "pattern_sos"];

function GestureContent() {
  const { user } = useAuth();
  const { gestures, hapticProfiles, setGestures, updateGesture, setHapticProfiles, updateHaptic } = useGestureStore();
  const [actionOpen, setActionOpen] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    supabase.from("gesture_configs").select("*").eq("user_id", user.id)
      .then(({ data }) => { if (data) setGestures(data); });
    supabase.from("haptic_profiles").select("*").eq("user_id", user.id)
      .then(({ data }) => { if (data) setHapticProfiles(data); });
  }, [user, setGestures, setHapticProfiles]);

  async function handleGestureAction(id: string, action: GestureAction) {
    updateGesture(id, { action });
    setActionOpen(null);
    await supabase.from("gesture_configs").update({ action }).eq("id", id);
  }

  async function toggleGesture(id: string, enabled: boolean) {
    updateGesture(id, { enabled });
    await supabase.from("gesture_configs").update({ enabled }).eq("id", id);
  }

  async function handleHapticChange(id: string, key: "pattern" | "intensity" | "enabled", value: unknown) {
    updateHaptic(id, { [key]: value });
    await supabase.from("haptic_profiles").update({ [key]: value }).eq("id", id);
    toast({ title: "Haptics updated" });
  }

  return (
    <>
      {/* Gestures */}
      <div className="rounded-2xl border border-subtle bg-surface shadow-card overflow-hidden">
        <div className="px-4 pt-4 pb-2">
          <SectionHeader title="Gesture controls" />
          <p className="mt-1 text-xs text-muted-foreground">Map wrist gestures to actions</p>
        </div>
        <div className="divide-y divide-border">
          {gestures.map((g) => {
            const Icon = ACTION_ICONS[g.action];
            return (
              <div key={g.id} className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-dim">
                    <Hand className="h-4 w-4 text-teal" />
                  </div>
                  <div>
                    <p className="text-sm text-foreground">{GESTURE_LABELS[g.gesture_type]}</p>
                    <div className="relative">
                      <button
                        onClick={() => setActionOpen(actionOpen === g.id ? null : g.id)}
                        className="flex items-center gap-1 text-xs text-muted-foreground hover:text-teal transition-colors"
                      >
                        <Icon className="h-3 w-3" />
                        {ACTION_LABELS[g.action]}
                        <ChevronDown className="h-3 w-3" />
                      </button>
                      {actionOpen === g.id && (
                        <div className="absolute left-0 top-6 z-20 w-44 rounded-xl border border-subtle bg-surface-raised shadow-card overflow-hidden">
                          {ALL_ACTIONS.map((a) => (
                            <button key={a} onClick={() => handleGestureAction(g.id, a)}
                              className={cn("flex w-full items-center gap-2 px-3 py-2 text-xs hover:bg-accent transition-colors",
                                a === g.action ? "text-teal" : "text-foreground")}>
                              {ACTION_LABELS[a]}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <label className="relative inline-flex cursor-pointer items-center">
                  <input type="checkbox" checked={g.enabled} onChange={(e) => toggleGesture(g.id, e.target.checked)} className="sr-only peer" />
                  <div className="h-5 w-9 rounded-full bg-border peer-checked:bg-teal transition-colors after:absolute after:left-0.5 after:top-0.5 after:h-4 after:w-4 after:rounded-full after:bg-background after:transition-all peer-checked:after:translate-x-4" />
                </label>
              </div>
            );
          })}
        </div>
      </div>

      {/* Haptic profiles */}
      <div className="rounded-2xl border border-subtle bg-surface shadow-card overflow-hidden">
        <div className="px-4 pt-4 pb-2">
          <SectionHeader title="Haptic profiles" />
          <p className="mt-1 text-xs text-muted-foreground">Configure vibration feedback</p>
        </div>
        <div className="divide-y divide-border">
          {hapticProfiles.map((h) => (
            <div key={h.id} className="px-4 py-3 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Vibrate className="h-4 w-4 text-teal" />
                  <p className="text-sm text-foreground">{HAPTIC_LABELS[h.profile_name] ?? h.profile_name}</p>
                </div>
                <label className="relative inline-flex cursor-pointer items-center">
                  <input type="checkbox" checked={h.enabled} onChange={(e) => handleHapticChange(h.id, "enabled", e.target.checked)} className="sr-only peer" />
                  <div className="h-5 w-9 rounded-full bg-border peer-checked:bg-teal transition-colors after:absolute after:left-0.5 after:top-0.5 after:h-4 after:w-4 after:rounded-full after:bg-background after:transition-all peer-checked:after:translate-x-4" />
                </label>
              </div>

              {h.enabled && (
                <>
                  <div className="flex gap-1.5">
                    {ALL_PATTERNS.map((p) => (
                      <button
                        key={p}
                        onClick={() => handleHapticChange(h.id, "pattern", p)}
                        className={cn(
                          "flex-1 rounded-lg py-1.5 text-[11px] transition-colors",
                          h.pattern === p ? "bg-teal text-background font-medium" : "bg-surface-raised text-muted-foreground hover:bg-accent"
                        )}
                      >
                        {PATTERN_LABELS[p].split(" ")[0]}
                      </button>
                    ))}
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-xs text-muted-foreground">Intensity</span>
                      <span className="text-xs text-foreground">{h.intensity}%</span>
                    </div>
                    <input
                      type="range" min={0} max={100} value={h.intensity}
                      onChange={(e) => handleHapticChange(h.id, "intensity", Number(e.target.value))}
                      className="w-full h-1.5 appearance-none rounded-full bg-surface-raised accent-teal cursor-pointer"
                    />
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default function GesturesPage() {
  return (
    <Screen className="space-y-6">
      <div>
        <p className="text-xs text-muted-foreground uppercase tracking-widest">Configure</p>
        <h1 className="mt-0.5 text-xl font-light text-foreground">Gestures & Haptics</h1>
      </div>

      <PremiumGate
        feature="Gesture & Haptic configuration"
        description="Customise your puck's wrist gestures and haptic feedback patterns with Premium."
      >
        <GestureContent />
      </PremiumGate>
    </Screen>
  );
}
