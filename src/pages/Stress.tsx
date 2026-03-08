// ── Stress & Readiness ────────────────────────────────────────────────────────
import React, { useState, useMemo, useEffect } from "react";
import { Screen } from "@/components/ui/Screen";
import { MetricRing } from "@/components/ui/MetricRing";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { useHealthStore } from "@/store";
import { getStressLevel } from "@/types";
import {
  generateStressTimeline, generateHRVTimeline,
  weeklyStress, weeklyReadiness, weeklyHRV, stressEvents,
} from "@/lib/mockData";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";
import { Brain, Zap, Heart, Moon, TrendingUp, AlertTriangle, Clock, Hand, Sparkles, Loader2 } from "lucide-react";
import {
  AreaChart, Area, LineChart, Line, BarChart, Bar, Cell,
  ResponsiveContainer, XAxis, YAxis, Tooltip, ReferenceLine,
} from "recharts";
import { cn } from "@/lib/utils";
import { supabase as sbClient } from "@/integrations/supabase/client";

type Period = "day" | "week" | "month";

const READINESS_FACTORS = [
  { label: "HRV quality",     score: 78, icon: ActivityIcon },
  { label: "Resting HR",      score: 85, icon: Heart },
  { label: "Sleep quality",   score: 74, icon: Moon },
  { label: "Recovery",        score: 82, icon: TrendingUp },
];

function ActivityIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  );
}

export default function StressPage() {
  const [period, setPeriod] = useState<Period>("day");
  const [marking, setMarking] = useState(false);
  const [insight, setInsight] = useState<string | null>(null);
  const [loadingInsight, setLoadingInsight] = useState(false);
  const { user } = useAuth();
  const { liveStress, liveHRV, readinessScore, setLiveStress } = useHealthStore();

  const stressDay  = useMemo(generateStressTimeline, []);
  const hrvTimeline = useMemo(generateHRVTimeline, []);

  const stressLevel = getStressLevel(liveStress);
  const stressColor =
    stressLevel === "calm" ? "hsl(var(--status-green))" :
    stressLevel === "elevated" ? "hsl(var(--status-amber))" :
    "hsl(var(--status-red))";

  const readinessColor = readinessScore < 34 ? "red" : readinessScore < 80 ? "blue" : "green";

  async function markStressNow() {
    if (!user) return;
    setMarking(true);
    try {
      await supabase.from("health_readings").insert({
        user_id: user.id,
        stress_score: liveStress,
        is_manual_stress_event: true,
        notes: "Manual stress marker",
      });
      toast({ title: "Stress marked", description: "Your current stress level has been logged." });
    } catch {
      toast({ title: "Error", variant: "destructive", description: "Could not save." });
    } finally {
      setMarking(false);
    }
  }

  async function generateInsight() {
    setLoadingInsight(true);
    setInsight(null);
    try {
      const prompt = `You are a health coach. Based on these metrics, give a 2-sentence personalised readiness insight:
- Readiness score: ${readinessScore}/100
- HRV: ${liveHRV}ms
- Stress level: ${stressLevel} (${liveStress}/100)
- Sleep quality score: 78/100
Keep it warm, specific, and actionable. No bullet points.`;

      const { data, error } = await sbClient.functions.invoke("ai-proxy", {
        body: { model: "google/gemini-2.5-flash", prompt },
      });
      if (error) throw error;
      setInsight(data?.text ?? data?.content ?? "Unable to generate insight right now.");
    } catch {
      setInsight("Your readiness looks " + (readinessScore >= 80 ? "great today — you're primed to perform at your best." : readinessScore >= 60 ? "moderate — consider lighter activity and good hydration." : "low — your body is asking for rest and recovery."));
    } finally {
      setLoadingInsight(false);
    }
  }

  // Auto-load insight on mount
  useEffect(() => { generateInsight(); }, []);

  const ringColor = stressLevel === "calm" ? "green" : stressLevel === "elevated" ? "amber" : "red";

  return (
    <Screen className="space-y-6">
      <div>
        <p className="text-xs text-muted-foreground uppercase tracking-widest">Overview</p>
        <h1 className="mt-0.5 text-xl font-light text-foreground">Stress & Readiness</h1>
      </div>

      {/* Two rings */}
      <div className="flex items-center justify-around">
        <div className="flex flex-col items-center gap-2">
          <MetricRing score={readinessScore} size={120} color={readinessColor} label="Readiness" sublabel="score" />
          <p className="text-xs text-muted-foreground">
            {readinessScore >= 80 ? "Ready to perform" : readinessScore >= 60 ? "Moderate readiness" : "Rest recommended"}
          </p>
        </div>
        <div className="flex flex-col items-center gap-2">
          <MetricRing score={liveStress} size={120} color={ringColor} label="Stress" sublabel="level" />
          <p className="text-xs text-muted-foreground capitalize">{stressLevel}</p>
        </div>
      </div>

      {/* AI Readiness Insight */}
      <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4 shadow-card">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <SectionHeader title="Today's readiness insight" />
          </div>
          <button onClick={generateInsight} disabled={loadingInsight} className="text-xs text-primary hover:opacity-70 transition-opacity disabled:opacity-40">
            Refresh
          </button>
        </div>
        {loadingInsight ? (
          <div className="flex items-center gap-2 py-1">
            <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
            <span className="text-xs text-muted-foreground">Analysing your metrics…</span>
          </div>
        ) : (
          <p className="text-sm text-foreground leading-relaxed">{insight ?? "—"}</p>
        )}
      </div>

      {/* Readiness breakdown */}
      <div className="rounded-2xl border border-subtle bg-surface p-4 shadow-card">
        <SectionHeader title="Readiness breakdown" className="mb-3" />
        <div className="grid grid-cols-2 gap-2">
          {READINESS_FACTORS.map(({ label, score, icon: Icon }) => (
            <div key={label} className="rounded-xl bg-surface-raised p-3">
              <div className="flex items-center gap-1.5 mb-1">
                <Icon className="h-3 w-3 text-teal" />
                <span className="text-[11px] text-muted-foreground">{label}</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-lg font-light text-foreground">{score}</span>
                <span className="text-xs text-muted-foreground">/100</span>
              </div>
              <div className="mt-1.5 h-1 w-full overflow-hidden rounded-full bg-border">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${score}%`,
                    background: score >= 80 ? "hsl(var(--status-green))" : score >= 60 ? "hsl(var(--primary))" : "hsl(var(--status-amber))"
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stress chart with period tabs */}
      <div className="rounded-2xl border border-subtle bg-surface p-4 shadow-card">
        <div className="flex items-center justify-between mb-3">
          <SectionHeader title="Stress timeline" />
          <div className="flex rounded-lg bg-surface-raised p-0.5 gap-0.5">
            {(["day", "week", "month"] as Period[]).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={cn(
                  "px-3 py-1 text-xs rounded-md capitalize transition-colors",
                  period === p ? "bg-teal text-background font-medium" : "text-muted-foreground hover:text-foreground"
                )}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        <ResponsiveContainer width="100%" height={120}>
          {period === "day" ? (
            <AreaChart data={stressDay} margin={{ top: 4, right: 0, bottom: 0, left: -20 }}>
              <defs>
                <linearGradient id="sg2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor={stressColor} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={stressColor} stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <XAxis dataKey="time" tick={{ fontSize: 9, fill: "hsl(var(--text-muted))" }} tickLine={false} axisLine={false} interval={5} />
              <YAxis tick={{ fontSize: 9, fill: "hsl(var(--text-muted))" }} tickLine={false} axisLine={false} domain={[0, 100]} />
              <ReferenceLine y={40} stroke="hsl(var(--status-amber))" strokeDasharray="3 3" strokeOpacity={0.5} />
              <ReferenceLine y={70} stroke="hsl(var(--status-red))"   strokeDasharray="3 3" strokeOpacity={0.5} />
              <Tooltip contentStyle={{ background: "hsl(var(--surface))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 11 }} itemStyle={{ color: stressColor }} />
              <Area type="monotone" dataKey="value" stroke={stressColor} strokeWidth={1.5} fill="url(#sg2)" dot={false} />
            </AreaChart>
          ) : (
            <BarChart data={period === "week" ? weeklyStress : weeklyStress} margin={{ top: 4, right: 0, bottom: 0, left: -20 }}>
              <XAxis dataKey="day" tick={{ fontSize: 9, fill: "hsl(var(--text-muted))" }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 9, fill: "hsl(var(--text-muted))" }} tickLine={false} axisLine={false} domain={[0, 100]} />
              <Tooltip contentStyle={{ background: "hsl(var(--surface))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 11 }} />
              <Bar dataKey="value" fill="hsl(var(--primary))" radius={[3, 3, 0, 0]} />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Stress Event Log */}
      <div className="rounded-2xl border border-subtle bg-surface p-4 shadow-card">
        <SectionHeader title="Stress event log" className="mb-3" />
        <div className="space-y-2">
          {stressEvents.map((event) => (
            <div key={event.id} className="flex items-center justify-between rounded-xl bg-surface-raised px-3 py-2.5">
              <div className="flex items-center gap-3">
                <div className={cn(
                  "flex h-7 w-7 items-center justify-center rounded-lg",
                  event.isManual ? "bg-gold/15" : "bg-surface"
                )}>
                  {event.isManual
                    ? <Hand className="h-3.5 w-3.5 text-gold" />
                    : <Brain className="h-3.5 w-3.5 text-muted-foreground" />
                  }
                </div>
                <div>
                  <p className="text-xs font-medium text-foreground">{event.label}</p>
                  <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                    <Clock className="h-2.5 w-2.5" /> {event.time}
                    {event.isManual && <span className="text-gold ml-1">· manual</span>}
                  </p>
                </div>
              </div>
              <div className={cn(
                "rounded-full px-2 py-0.5 text-[11px] font-semibold",
                event.score >= 70 ? "bg-status-red/10 text-status-red" :
                event.score >= 40 ? "bg-status-amber/10 text-status-amber" :
                "bg-status-green/10 text-status-green"
              )}>
                {event.score}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Weekly readiness trend */}
      <div className="rounded-2xl border border-subtle bg-surface p-4 shadow-card">
        <SectionHeader title="Readiness · last 7 days" className="mb-3" />
        <ResponsiveContainer width="100%" height={100}>
          <BarChart data={weeklyReadiness} margin={{ top: 4, right: 0, bottom: 0, left: -20 }}>
            <XAxis dataKey="day" tick={{ fontSize: 9, fill: "hsl(var(--text-muted))" }} tickLine={false} axisLine={false} />
            <YAxis tick={{ fontSize: 9, fill: "hsl(var(--text-muted))" }} tickLine={false} axisLine={false} domain={[0, 100]} />
            <Tooltip contentStyle={{ background: "hsl(var(--surface))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 11 }} />
            <Bar dataKey="value" radius={[3, 3, 0, 0]}>
              {weeklyReadiness.map((entry, i) => (
                <Cell key={i}
                  fill={entry.value >= 80 ? "hsl(var(--status-green))" : entry.value >= 34 ? "hsl(var(--primary))" : "hsl(var(--status-red))"}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* HRV trend */}
      <div className="rounded-2xl border border-subtle bg-surface p-4 shadow-card">
        <SectionHeader title="HRV · 24h" className="mb-3" />
        <div className="flex items-baseline gap-2 mb-3">
          <span className="text-3xl font-light text-foreground">{liveHRV}</span>
          <span className="text-sm text-muted-foreground">ms</span>
          <span className="ml-auto text-xs text-status-green">+3 ms from yesterday</span>
        </div>
        <ResponsiveContainer width="100%" height={80}>
          <LineChart data={hrvTimeline} margin={{ top: 2, right: 0, bottom: 0, left: -20 }}>
            <XAxis dataKey="time" tick={{ fontSize: 9, fill: "hsl(var(--text-muted))" }} tickLine={false} axisLine={false} interval={5} />
            <YAxis tick={{ fontSize: 9, fill: "hsl(var(--text-muted))" }} tickLine={false} axisLine={false} />
            <Tooltip contentStyle={{ background: "hsl(var(--surface))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 11 }} />
            <Line type="monotone" dataKey="value" stroke="hsl(var(--primary))" strokeWidth={1.5} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Weekly HRV trend */}
      <div className="rounded-2xl border border-subtle bg-surface p-4 shadow-card">
        <SectionHeader title="HRV · last 7 days" className="mb-3" />
        <ResponsiveContainer width="100%" height={90}>
          <LineChart data={weeklyHRV} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
            <XAxis dataKey="day" tick={{ fontSize: 9, fill: "hsl(var(--text-muted))" }} tickLine={false} axisLine={false} />
            <YAxis tick={{ fontSize: 9, fill: "hsl(var(--text-muted))" }} tickLine={false} axisLine={false} />
            <Tooltip contentStyle={{ background: "hsl(var(--surface))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 11 }}
              formatter={(v: number) => [`${v}ms`, "HRV"]} />
            <Line type="monotone" dataKey="value" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ fill: "hsl(var(--primary))", r: 3 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Mark stress CTA */}
      <PrimaryButton
        onClick={markStressNow}
        loading={marking}
        icon={<AlertTriangle className="h-4 w-4" />}
        className="w-full"
      >
        Mark: I feel stressed now
      </PrimaryButton>
    </Screen>
  );
}
