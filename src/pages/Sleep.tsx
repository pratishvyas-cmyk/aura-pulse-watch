// ── Sleep ─────────────────────────────────────────────────────────────────────
import React, { useState } from "react";
import { Screen } from "@/components/ui/Screen";
import { MetricRing } from "@/components/ui/MetricRing";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { lastNightSleep, weeklySleep, weeklySleepHours } from "@/lib/mockData";
import { Moon, Zap, Brain, Clock, Target, TrendingDown, CheckCircle2, AlertCircle } from "lucide-react";
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, Cell, ReferenceLine } from "recharts";
import { useUserStore } from "@/store";
import { cn } from "@/lib/utils";

const STAGES = [
  { key: "deepMins",   label: "Deep",   color: "hsl(var(--primary))" },
  { key: "remMins",    label: "REM",    color: "hsl(var(--gold))" },
  { key: "lightMins",  label: "Light",  color: "hsl(var(--text-secondary))" },
  { key: "awakeMins",  label: "Awake",  color: "hsl(var(--text-muted))" },
] as const;

function fmt(mins: number) {
  return `${Math.floor(mins / 60)}h ${mins % 60}m`;
}

export default function SleepPage() {
  const s = lastNightSleep;
  const total = s.deepMins + s.remMins + s.lightMins + s.awakeMins;
  const { sleepGoalHours, setSleepGoalHours } = useUserStore();
  const [editingGoal, setEditingGoal] = useState(false);
  const [goalInput, setGoalInput] = useState(String(sleepGoalHours));

  // Sleep debt calculation
  const totalSlept = weeklySleepHours.reduce((a, d) => a + d.value, 0);
  const goalTotal  = sleepGoalHours * 7;
  const debtHours  = Math.max(0, goalTotal - totalSlept);
  const debtMins   = Math.round((debtHours % 1) * 60);
  const debtWhole  = Math.floor(debtHours);

  function saveGoal() {
    const v = parseFloat(goalInput);
    if (!isNaN(v) && v >= 4 && v <= 12) setSleepGoalHours(v);
    setEditingGoal(false);
  }

  return (
    <Screen className="space-y-6">
      <div>
        <p className="text-xs text-muted-foreground uppercase tracking-widest">Recovery</p>
        <h1 className="mt-0.5 text-xl font-light text-foreground">Sleep Quality</h1>
      </div>

      {/* Score + duration */}
      <div className="flex items-center gap-5">
        <MetricRing score={s.score} size={120} color="teal" label="Sleep" sublabel="score" className="flex-shrink-0" />
        <div className="space-y-2">
          <div>
            <p className="text-xs text-muted-foreground">Duration</p>
            <p className="text-xl font-light text-foreground">{fmt(s.durationMins)}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Efficiency</p>
            <p className="text-xl font-light text-foreground">{Math.round(((total - s.awakeMins) / total) * 100)}%</p>
          </div>
        </div>
      </div>

      {/* Sleep goal card */}
      <div className="rounded-2xl border border-subtle bg-surface p-4 shadow-card">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4 text-teal" />
            <SectionHeader title="Sleep goal" />
          </div>
          <button onClick={() => setEditingGoal(!editingGoal)} className="text-xs text-primary hover:opacity-80 transition-opacity">
            {editingGoal ? "Cancel" : "Edit"}
          </button>
        </div>

        {editingGoal ? (
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <input
                type="range" min={4} max={12} step={0.5}
                value={parseFloat(goalInput) || sleepGoalHours}
                onChange={(e) => setGoalInput(e.target.value)}
                className="w-full h-1.5 appearance-none rounded-full bg-surface-raised accent-primary cursor-pointer"
              />
              <div className="flex justify-between mt-1">
                <span className="text-[10px] text-muted-foreground">4h</span>
                <span className="text-xs font-semibold text-primary">{goalInput}h goal</span>
                <span className="text-[10px] text-muted-foreground">12h</span>
              </div>
            </div>
            <button onClick={saveGoal} className="rounded-xl bg-primary px-3 py-2 text-xs text-primary-foreground font-semibold">
              Save
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-light text-foreground">{sleepGoalHours}<span className="text-sm text-muted-foreground ml-1">hours</span></p>
              <p className="text-xs text-muted-foreground">Target per night</p>
            </div>
            <div className={cn("flex items-center gap-1.5 rounded-full px-3 py-1.5",
              s.durationMins / 60 >= sleepGoalHours ? "bg-status-green/10" : "bg-status-amber/10"
            )}>
              {s.durationMins / 60 >= sleepGoalHours
                ? <CheckCircle2 className="h-3.5 w-3.5 text-status-green" />
                : <AlertCircle   className="h-3.5 w-3.5 text-status-amber" />
              }
              <span className={cn("text-xs font-medium",
                s.durationMins / 60 >= sleepGoalHours ? "text-status-green" : "text-status-amber"
              )}>
                {s.durationMins / 60 >= sleepGoalHours ? "Goal met!" : `${(sleepGoalHours - s.durationMins / 60).toFixed(1)}h short`}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Sleep debt card */}
      <div className={cn(
        "rounded-2xl border p-4 shadow-card",
        debtHours === 0 ? "border-status-green/30 bg-status-green/5" : "border-status-amber/30 bg-status-amber/5"
      )}>
        <div className="flex items-center gap-2 mb-3">
          <TrendingDown className={cn("h-4 w-4", debtHours === 0 ? "text-status-green" : "text-status-amber")} />
          <SectionHeader title="Weekly sleep debt" />
        </div>
        <div className="flex items-baseline gap-2 mb-1">
          {debtHours === 0 ? (
            <p className="text-2xl font-light text-status-green">No debt 🎉</p>
          ) : (
            <>
              <p className="text-2xl font-light text-foreground">{debtWhole}h {debtMins}m</p>
              <p className="text-xs text-muted-foreground">behind this week</p>
            </>
          )}
        </div>
        <p className="text-xs text-muted-foreground">
          {debtHours === 0
            ? `You've met your ${sleepGoalHours}h goal every night this week.`
            : `Based on your ${sleepGoalHours}h nightly goal. Try sleeping ${(debtHours / 7).toFixed(1)}h extra each night to recover.`
          }
        </p>
      </div>

      {/* Stage breakdown bar */}
      <div className="rounded-2xl border border-subtle bg-surface p-4 shadow-card">
        <SectionHeader title="Sleep stages" className="mb-4" />

        <div className="flex h-4 w-full overflow-hidden rounded-full gap-0.5 mb-4">
          {STAGES.map(({ key, label, color }) => {
            const mins = s[key];
            const pct = (mins / total) * 100;
            return (
              <div key={key} style={{ width: `${pct}%`, background: color }} className="h-full first:rounded-l-full last:rounded-r-full" title={`${label}: ${fmt(mins)}`} />
            );
          })}
        </div>

        <div className="grid grid-cols-2 gap-2">
          {STAGES.map(({ key, label, color }) => (
            <div key={key} className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full flex-shrink-0" style={{ background: color }} />
              <div>
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className="text-sm font-light text-foreground">{fmt(s[key])}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Insights */}
      <div className="grid grid-cols-1 gap-2">
        {[
          { icon: Brain,  label: "REM cycles",    value: `${Math.round(s.remMins / 90)} complete`, note: "Memory & mood" },
          { icon: Zap,    label: "Deep sleep",     value: fmt(s.deepMins), note: "Physical recovery" },
          { icon: Clock,  label: "Bedtime",        value: "22:48", note: "Optimal window" },
          { icon: Moon,   label: "Wake time",      value: "06:24", note: "Natural alarm" },
        ].map(({ icon: Icon, label, value, note }) => (
          <div key={label} className="flex items-center justify-between rounded-xl border border-subtle bg-surface p-3">
            <div className="flex items-center gap-3">
              <Icon className="h-4 w-4 text-teal flex-shrink-0" />
              <div>
                <p className="text-sm text-foreground">{label}</p>
                <p className="text-[11px] text-muted-foreground">{note}</p>
              </div>
            </div>
            <p className="text-sm font-medium text-foreground">{value}</p>
          </div>
        ))}
      </div>

      {/* Weekly sleep duration chart */}
      <div className="rounded-2xl border border-subtle bg-surface p-4 shadow-card">
        <SectionHeader title="Sleep duration · last 7 days" className="mb-3" />
        <ResponsiveContainer width="100%" height={110}>
          <BarChart data={weeklySleepHours} margin={{ top: 4, right: 0, bottom: 0, left: -20 }}>
            <XAxis dataKey="day" tick={{ fontSize: 9, fill: "hsl(var(--text-muted))" }} tickLine={false} axisLine={false} />
            <YAxis tick={{ fontSize: 9, fill: "hsl(var(--text-muted))" }} tickLine={false} axisLine={false} domain={[0, 12]} />
            <ReferenceLine y={sleepGoalHours} stroke="hsl(var(--primary))" strokeDasharray="3 3" strokeOpacity={0.6} />
            <Tooltip
              contentStyle={{ background: "hsl(var(--surface))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 11 }}
              formatter={(v: number) => [`${v}h`, "Duration"]}
            />
            <Bar dataKey="value" radius={[3, 3, 0, 0]}>
              {weeklySleepHours.map((entry, i) => (
                <Cell key={i} fill={entry.value >= sleepGoalHours ? "hsl(var(--primary))" : "hsl(var(--status-amber))"} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <p className="text-[10px] text-muted-foreground mt-1">— Blue line = {sleepGoalHours}h goal</p>
      </div>

      {/* Weekly sleep score chart */}
      <div className="rounded-2xl border border-subtle bg-surface p-4 shadow-card">
        <SectionHeader title="Sleep score · last 7 days" className="mb-3" />
        <ResponsiveContainer width="100%" height={100}>
          <BarChart data={weeklySleep} margin={{ top: 4, right: 0, bottom: 0, left: -20 }}>
            <XAxis dataKey="day" tick={{ fontSize: 9, fill: "hsl(var(--text-muted))" }} tickLine={false} axisLine={false} />
            <YAxis tick={{ fontSize: 9, fill: "hsl(var(--text-muted))" }} tickLine={false} axisLine={false} domain={[0, 100]} />
            <Tooltip contentStyle={{ background: "hsl(var(--surface))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 11 }} />
            <Bar dataKey="value" radius={[3, 3, 0, 0]}>
              {weeklySleep.map((entry, i) => (
                <Cell key={i} fill={entry.value >= 80 ? "hsl(var(--primary))" : entry.value >= 65 ? "hsl(var(--gold))" : "hsl(var(--text-muted))"} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Screen>
  );
}
