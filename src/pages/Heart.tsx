// ── Heart & Activity ──────────────────────────────────────────────────────────
import React, { useMemo } from "react";
import { Screen } from "@/components/ui/Screen";
import { MetricRing } from "@/components/ui/MetricRing";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { useHealthStore } from "@/store";
import { generateHRTimeline, hrZones, weeklySteps } from "@/lib/mockData";
import { Heart, Footprints, Flame, MapPin, Clock } from "lucide-react";
import {
  LineChart, Line, BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid,
} from "recharts";

export default function HeartPage() {
  const { liveHeartRate, todaySteps, todayCalories, todayDistanceM, todayActiveMins } = useHealthStore();
  const hrData = useMemo(generateHRTimeline, []);

  const distKm = (todayDistanceM / 1000).toFixed(2);

  return (
    <Screen className="space-y-6">
      <div>
        <p className="text-xs text-muted-foreground uppercase tracking-widest">Monitor</p>
        <h1 className="mt-0.5 text-xl font-light text-foreground">Heart & Activity</h1>
      </div>

      {/* Live HR */}
      <div className="flex items-center gap-5 rounded-2xl border border-subtle bg-surface p-5 shadow-card">
        <div className="relative flex-shrink-0">
          <Heart className="h-16 w-16 text-teal animate-pulse-beat" fill="hsl(var(--primary-dim))" />
        </div>
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-widest">Live heart rate</p>
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="text-metric-lg text-foreground">{liveHeartRate}</span>
            <span className="text-sm text-muted-foreground">bpm</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">Updates every 3 seconds</p>
        </div>
      </div>

      {/* HR trend chart */}
      <div className="rounded-2xl border border-subtle bg-surface p-4 shadow-card">
        <SectionHeader title="Heart rate · 24h" className="mb-3" />
        <ResponsiveContainer width="100%" height={130}>
          <LineChart data={hrData} margin={{ top: 4, right: 0, bottom: 0, left: -20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
            <XAxis dataKey="time" tick={{ fontSize: 9, fill: "hsl(var(--text-muted))" }} tickLine={false} axisLine={false} interval={5} />
            <YAxis tick={{ fontSize: 9, fill: "hsl(var(--text-muted))" }} tickLine={false} axisLine={false} domain={["dataMin - 5", "dataMax + 5"]} />
            <Tooltip
              contentStyle={{ background: "hsl(var(--surface))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 11 }}
              itemStyle={{ color: "hsl(var(--primary))" }}
            />
            <Line type="monotone" dataKey="value" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* HR zones */}
      <div className="rounded-2xl border border-subtle bg-surface p-4 shadow-card">
        <SectionHeader title="HR zones today" className="mb-3" />
        <div className="space-y-2.5">
          {hrZones.map(({ label, min, max, pct, color }) => (
            <div key={label}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-muted-foreground">{label} <span className="text-[10px] opacity-60">{min}–{max} bpm</span></span>
                <span className="text-xs text-foreground font-medium">{pct}%</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-surface-raised">
                <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: color }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Activity stats grid */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { icon: Footprints, label: "Steps",    value: todaySteps.toLocaleString(), unit: "",    color: "text-teal" },
          { icon: Flame,      label: "Calories", value: todayCalories.toLocaleString(), unit: "kcal", color: "text-status-amber" },
          { icon: MapPin,     label: "Distance", value: distKm,    unit: "km",  color: "text-status-green" },
          { icon: Clock,      label: "Active",   value: String(todayActiveMins), unit: "min", color: "text-gold" },
        ].map(({ icon: Icon, label, value, unit, color }) => (
          <div key={label} className="rounded-2xl border border-subtle bg-surface p-4 shadow-card">
            <Icon className={`h-4 w-4 mb-2 ${color}`} />
            <p className="text-2xl font-light text-foreground">{value}<span className="text-xs text-muted-foreground ml-0.5">{unit}</span></p>
            <p className="text-xs text-muted-foreground">{label}</p>
          </div>
        ))}
      </div>

      {/* Weekly steps bar chart */}
      <div className="rounded-2xl border border-subtle bg-surface p-4 shadow-card">
        <SectionHeader title="Steps · last 7 days" className="mb-3" />
        <ResponsiveContainer width="100%" height={100}>
          <BarChart data={weeklySteps} margin={{ top: 4, right: 0, bottom: 0, left: -20 }}>
            <XAxis dataKey="day" tick={{ fontSize: 9, fill: "hsl(var(--text-muted))" }} tickLine={false} axisLine={false} />
            <YAxis tick={{ fontSize: 9, fill: "hsl(var(--text-muted))" }} tickLine={false} axisLine={false} />
            <Tooltip
              contentStyle={{ background: "hsl(var(--surface))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 11 }}
              formatter={(v: number) => [v.toLocaleString(), "steps"]}
            />
            <Bar dataKey="value" fill="hsl(var(--primary))" radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Screen>
  );
}
