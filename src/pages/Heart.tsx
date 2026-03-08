// ── Heart & Activity ──────────────────────────────────────────────────────────
import React, { useMemo } from "react";
import { Screen } from "@/components/ui/Screen";
import { MetricRing } from "@/components/ui/MetricRing";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { useHealthStore } from "@/store";
import { generateHRTimeline, hrZones, weeklySteps, weeklyHR } from "@/lib/mockData";
import { Heart, Footprints, Flame, MapPin, Clock, TrendingUp } from "lucide-react";
import {
  LineChart, Line, BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, Cell, ReferenceLine,
} from "recharts";

const STEPS_GOAL = 10000;

export default function HeartPage() {
  const { liveHeartRate, todaySteps, todayCalories, todayDistanceM, todayActiveMins } = useHealthStore();
  const hrData = useMemo(generateHRTimeline, []);

  const distKm = (todayDistanceM / 1000).toFixed(2);

  // Week avg heart rate
  const avgHR = Math.round(weeklyHR.reduce((a, d) => a + d.value, 0) / weeklyHR.length);

  return (
    <Screen className="space-y-6">
      <div>
        <p className="text-xs text-muted-foreground uppercase tracking-widest">Monitor</p>
        <h1 className="mt-0.5 text-xl font-light text-foreground">Heart & Activity</h1>
      </div>

      {/* Live HR */}
      <div className="flex items-center gap-5 rounded-2xl border border-subtle bg-surface p-5 shadow-card">
        <div className="relative flex-shrink-0">
          <Heart className="h-16 w-16 animate-pulse-beat" style={{ color: "hsl(var(--status-red))", filter: "drop-shadow(0 0 10px hsl(var(--status-red) / 0.7))" }} fill="hsl(var(--status-red) / 0.15)" />
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
              itemStyle={{ color: "hsl(var(--status-red))" }}
            />
            <defs>
              <filter id="hrGlow">
                <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
                <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
            </defs>
            <Line type="monotone" dataKey="value" stroke="hsl(var(--status-red))" strokeWidth={2.5} dot={false} filter="url(#hrGlow)" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Weekly HR trend */}
      <div className="rounded-2xl border border-subtle bg-surface p-4 shadow-card">
        <div className="flex items-center justify-between mb-3">
          <SectionHeader title="Heart rate · last 7 days" />
          <span className="text-xs text-muted-foreground">avg <span className="text-foreground font-medium">{avgHR} bpm</span></span>
        </div>
        <ResponsiveContainer width="100%" height={90}>
          <LineChart data={weeklyHR} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
            <XAxis dataKey="day" tick={{ fontSize: 9, fill: "hsl(var(--text-muted))" }} tickLine={false} axisLine={false} />
            <YAxis tick={{ fontSize: 9, fill: "hsl(var(--text-muted))" }} tickLine={false} axisLine={false} domain={[60, 85]} />
            <Tooltip contentStyle={{ background: "hsl(var(--surface))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 11 }}
              formatter={(v: number) => [`${v} bpm`, "Heart rate"]} />
            <ReferenceLine y={avgHR} stroke="hsl(var(--status-red))" strokeDasharray="3 3" strokeOpacity={0.4} />
            <Line type="monotone" dataKey="value" stroke="hsl(var(--status-red))" strokeWidth={2} dot={{ fill: "hsl(var(--status-red))", r: 3 }} />
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
        <div className="flex items-center justify-between mb-3">
          <SectionHeader title="Steps · last 7 days" />
          <span className="text-xs text-muted-foreground">goal <span className="text-foreground font-medium">{(STEPS_GOAL / 1000).toFixed(0)}k</span></span>
        </div>
        <ResponsiveContainer width="100%" height={100}>
          <BarChart data={weeklySteps} margin={{ top: 4, right: 0, bottom: 0, left: -20 }}>
            <XAxis dataKey="day" tick={{ fontSize: 9, fill: "hsl(var(--text-muted))" }} tickLine={false} axisLine={false} />
            <YAxis tick={{ fontSize: 9, fill: "hsl(var(--text-muted))" }} tickLine={false} axisLine={false} />
            <ReferenceLine y={STEPS_GOAL} stroke="hsl(var(--status-green))" strokeDasharray="3 3" strokeOpacity={0.5} />
            <Tooltip
              contentStyle={{ background: "hsl(var(--surface))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 11 }}
              formatter={(v: number) => [v.toLocaleString(), "steps"]}
            />
            <Bar dataKey="value" radius={[3, 3, 0, 0]}>
              {weeklySteps.map((entry, i) => (
                <Cell key={i} fill={entry.value >= STEPS_GOAL ? "hsl(var(--status-green))" : "hsl(var(--primary))"} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <p className="text-[10px] text-muted-foreground mt-1">— Green line = 10k step goal</p>
      </div>
    </Screen>
  );
}
