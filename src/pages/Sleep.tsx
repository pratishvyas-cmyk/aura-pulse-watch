// ── Sleep ─────────────────────────────────────────────────────────────────────
import React from "react";
import { Screen } from "@/components/ui/Screen";
import { MetricRing } from "@/components/ui/MetricRing";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { lastNightSleep, weeklySleep } from "@/lib/mockData";
import { Moon, Zap, Brain, Clock } from "lucide-react";
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, Cell } from "recharts";

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

      {/* Stage breakdown bar */}
      <div className="rounded-2xl border border-subtle bg-surface p-4 shadow-card">
        <SectionHeader title="Sleep stages" className="mb-4" />

        {/* Visual proportional bar */}
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

      {/* Weekly sleep chart */}
      <div className="rounded-2xl border border-subtle bg-surface p-4 shadow-card">
        <SectionHeader title="Sleep score · last 7 days" className="mb-3" />
        <ResponsiveContainer width="100%" height={100}>
          <BarChart data={weeklySleep} margin={{ top: 4, right: 0, bottom: 0, left: -20 }}>
            <XAxis dataKey="day" tick={{ fontSize: 9, fill: "hsl(var(--text-muted))" }} tickLine={false} axisLine={false} />
            <YAxis tick={{ fontSize: 9, fill: "hsl(var(--text-muted))" }} tickLine={false} axisLine={false} domain={[0, 100]} />
            <Tooltip contentStyle={{ background: "hsl(var(--surface))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 11 }} />
            <Bar dataKey="value" radius={[3, 3, 0, 0]}>
              {weeklySleep.map((entry, i) => (
                <Cell
                  key={i}
                  fill={entry.value >= 80 ? "hsl(var(--primary))" : entry.value >= 65 ? "hsl(var(--gold))" : "hsl(var(--text-muted))"}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Screen>
  );
}
