// ── Find My Puck / Watch ──────────────────────────────────────────────────────
import React, { useState } from "react";
import { Screen } from "@/components/ui/Screen";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { GhostButton } from "@/components/ui/PrimaryButton";
import { useDeviceStore } from "@/store";
import { MapPin, Vibrate, Clock, Bluetooth, Navigation } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

export default function FindPage() {
  const device = useDeviceStore((s) => s.device);
  const [ringing, setRinging] = useState(false);
  const [proximity] = useState(72); // simulated 0-100

  function ringPuck() {
    setRinging(true);
    toast({ title: "Ringing your Puck…", description: "The device will vibrate 3 times." });
    setTimeout(() => setRinging(false), 3000);
  }

  const proximityLabel =
    proximity > 80 ? "Very close" :
    proximity > 60 ? "Nearby" :
    proximity > 40 ? "In range" :
    proximity > 20 ? "Far" :
    "Out of range";

  const ringColor =
    proximity > 80 ? "hsl(var(--status-green))" :
    proximity > 50 ? "hsl(var(--primary))" :
    proximity > 20 ? "hsl(var(--status-amber))" :
    "hsl(var(--status-red))";

  return (
    <Screen className="space-y-6">
      <div>
        <p className="text-xs text-muted-foreground uppercase tracking-widest">Locate</p>
        <h1 className="mt-0.5 text-xl font-light text-foreground">Find My Puck</h1>
      </div>

      {/* Proximity ring animation */}
      <div className="flex flex-col items-center py-6">
        <div className="relative flex h-48 w-48 items-center justify-center">
          {/* Outer ping */}
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="absolute rounded-full border"
              style={{
                inset: i * -20,
                borderColor: `${ringColor}${["40", "28", "15"][i]}`,
                animation: `ping ${1.5 + i * 0.4}s cubic-bezier(0, 0, 0.2, 1) infinite`,
                animationDelay: `${i * 0.3}s`,
              }}
            />
          ))}

          {/* Center icon */}
          <div
            className="relative z-10 flex h-20 w-20 flex-col items-center justify-center rounded-full border-2"
            style={{ borderColor: ringColor, background: `${ringColor}18` }}
          >
            <Bluetooth className="h-8 w-8" style={{ color: ringColor }} />
          </div>
        </div>

        {/* Proximity value */}
        <p className="mt-4 text-3xl font-light text-foreground">{proximity}%</p>
        <p className="text-sm text-muted-foreground">{proximityLabel}</p>

        {/* Signal bar */}
        <div className="mt-4 flex gap-1">
          {[20, 40, 60, 80, 100].map((threshold) => (
            <div
              key={threshold}
              className={cn("w-3 rounded-sm transition-all", proximity >= threshold ? "bg-teal" : "bg-border")}
              style={{ height: threshold / 20 * 4 + 4 }}
            />
          ))}
        </div>
      </div>

      {/* Last seen info */}
      {device && (
        <div className="rounded-2xl border border-subtle bg-surface p-4 shadow-card space-y-3">
          <SectionHeader title="Last known location" />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                {device.last_seen_at
                  ? new Date(device.last_seen_at).toLocaleString()
                  : "Unknown"}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-teal flex-shrink-0" />
            <span className="text-sm text-foreground">
              {device.last_seen_lat && device.last_seen_lng
                ? `${device.last_seen_lat.toFixed(4)}°, ${device.last_seen_lng.toFixed(4)}°`
                : "Central London, UK (simulated)"}
            </span>
          </div>

          {/* Simulated map placeholder */}
          <div className="relative mt-2 h-32 w-full overflow-hidden rounded-xl bg-surface-raised border border-subtle flex items-center justify-center">
            <div className="pointer-events-none absolute inset-0 opacity-20">
              {/* Grid lines to simulate a map */}
              {[...Array(6)].map((_, i) => (
                <div key={i} className="absolute w-full border-t border-border" style={{ top: `${(i + 1) * 16.6}%` }} />
              ))}
              {[...Array(8)].map((_, i) => (
                <div key={i} className="absolute h-full border-l border-border" style={{ left: `${(i + 1) * 12.5}%` }} />
              ))}
            </div>
            <div className="relative z-10 flex flex-col items-center gap-1">
              <MapPin className="h-6 w-6 text-teal" />
              <span className="text-xs text-muted-foreground">Last seen here</span>
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="space-y-2">
        <PrimaryButton
          onClick={ringPuck}
          loading={ringing}
          icon={<Vibrate className="h-4 w-4" />}
          className="w-full"
        >
          {ringing ? "Ringing…" : "Ring my Puck"}
        </PrimaryButton>
        <GhostButton icon={<Navigation className="h-4 w-4" />} className="w-full">
          Get directions
        </GhostButton>
      </div>
    </Screen>
  );
}
