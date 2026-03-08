// ── Home / Today Dashboard ────────────────────────────────────────────────────
import React, { useMemo } from "react";
import { Screen } from "@/components/ui/Screen";
import { MetricRing } from "@/components/ui/MetricRing";
import { MetricChip } from "@/components/ui/MetricChip";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { StatBar } from "@/components/ui/StatBar";
import { SparkLine } from "@/components/ui/SparkLine";
import { useHealthStore, useUserStore, useDeviceStore } from "@/store";
import { getStressLevel } from "@/types";
import { generateHRTimeline, generateStressTimeline, lastNightSleep } from "@/lib/mockData";
import {
  Heart, Brain, Activity, Footprints, Flame, Zap, Clock,
  AreaChart as AreaChartIcon,
} from "lucide-react";
import {
  AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip, ReferenceLine,
} from "recharts";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

const STEPS_GOAL = 10000;
const CAL_GOAL   = 2500;
const DIST_GOAL  = 8000;
const ACTIVE_GOAL = 60;

export default function HomePage() {
  const navigate = useNavigate();
  const { liveHeartRate, liveHRV, liveStress, readinessScore, todaySteps, todayCalories, todayDistanceM, todayActiveMins } = useHealthStore();
  const profile  = useUserStore((s) => s.profile);
  const device   = useDeviceStore((s) => s.device);

  const hrData     = useMemo(generateHRTimeline, []);
  const stressData = useMemo(generateStressTimeline, []);
  const stressLevel = getStressLevel(liveStress);

  const stressColor =
    stressLevel === "calm" ? "hsl(var(--status-green))" :
    stressLevel === "elevated" ? "hsl(var(--status-amber))" :
    "hsl(var(--status-red))";

  const now = new Date();
  const greeting = now.getHours() < 12 ? "Good morning" : now.getHours() < 18 ? "Good afternoon" : "Good evening";

  return (
    <Screen className="space-y-6">
      {/* Greeting */}
      <div>
        <p className="text-xs text-muted-foreground uppercase tracking-widest">{greeting}</p>
        <h1 className="mt-0.5 text-xl font-light text-foreground">
          {profile?.display_name ?? "—"}
        </h1>
      </div>

      {/* Readiness ring + metric chips */}
      <div className="flex items-center gap-4">
        <MetricRing score={readinessScore} size={130} color="gold" label="Readiness" className="flex-shrink-0" />
        <div className="grid grid-cols-1 gap-2 flex-1">
          <MetricChip icon={<Heart className="h-4 w-4" />} value={liveHeartRate} unit="bpm" label="Heart rate" highlight pulse />
          <MetricChip icon={<Brain className="h-4 w-4" />} value={liveStress} label="Stress" className={stressLevel !== "calm" ? "border-status-amber/30" : ""} />
          <MetricChip icon={<Activity className="h-4 w-4" />} value={liveHRV} unit="ms" label="HRV" />
        </div>
      </div>

      {/* Activity */}
      <div className="rounded-2xl border border-subtle bg-surface p-4 shadow-card space-y-3">
        <SectionHeader title="Today's activity" action={{ label: "Details →", onClick: () => navigate("/heart") }} />
        <StatBar label="Steps"    value={todaySteps}    goal={STEPS_GOAL} />
        <StatBar label="Calories" value={todayCalories} goal={CAL_GOAL}   unit="kcal" color="amber" />
        <StatBar label="Distance" value={Math.round(todayDistanceM)} goal={DIST_GOAL} unit="m" color="green" />
        <StatBar label="Active"   value={todayActiveMins} goal={ACTIVE_GOAL} unit="min" color="teal" />
      </div>

      {/* Stress timeline */}
      <div className="rounded-2xl border border-subtle bg-surface p-4 shadow-card">
        <SectionHeader title="Stress today" action={{ label: "Deep dive →", onClick: () => navigate("/stress") }} className="mb-3" />
        <ResponsiveContainer width="100%" height={100}>
          <AreaChart data={stressData} margin={{ top: 4, right: 0, bottom: 0, left: -20 }}>
            <defs>
              <linearGradient id="stressGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor={stressColor} stopOpacity={0.3} />
                <stop offset="95%" stopColor={stressColor} stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <XAxis dataKey="time" tick={{ fontSize: 9, fill: "hsl(var(--text-muted))" }} tickLine={false} axisLine={false} interval={5} />
            <YAxis tick={{ fontSize: 9, fill: "hsl(var(--text-muted))" }} tickLine={false} axisLine={false} domain={[0, 100]} />
            <ReferenceLine y={40} stroke="hsl(var(--status-amber))" strokeDasharray="3 3" strokeOpacity={0.4} />
            <ReferenceLine y={70} stroke="hsl(var(--status-red))" strokeDasharray="3 3" strokeOpacity={0.4} />
            <Tooltip
              contentStyle={{ background: "hsl(var(--surface))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 11 }}
              labelStyle={{ color: "hsl(var(--muted-foreground))" }}
              itemStyle={{ color: stressColor }}
            />
      <Area type="monotone" dataKey="value" stroke={stressColor} strokeWidth={1.5} fill="url(#stressGrad)" dot={false} />
        </AreaChart>
      </ResponsiveContainer>
      <div className="mt-2 flex items-center gap-1.5">
        <div className={cn("h-2 w-2 rounded-full", stressLevel === "calm" ? "bg-status-green" : stressLevel === "elevated" ? "bg-status-amber" : "bg-status-red")} />
          <span className="text-xs text-muted-foreground capitalize">{stressLevel} stress right now · {liveStress}/100</span>
        </div>
      </div>

      {/* Sleep card */}
      <div
        className="flex items-center justify-between rounded-2xl border border-subtle bg-surface p-4 shadow-card cursor-pointer hover:bg-surface-raised transition-colors"
        onClick={() => navigate("/sleep")}
      >
        <div className="flex items-center gap-3">
          <MetricRing score={lastNightSleep.score} size={52} strokeWidth={4} color="teal" />
          <div>
            <p className="text-sm font-medium text-foreground">Last night</p>
            <p className="text-xs text-muted-foreground">
              {Math.floor(lastNightSleep.durationMins / 60)}h {lastNightSleep.durationMins % 60}m
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1 text-muted-foreground">
          <span className="text-xs">Sleep →</span>
        </div>
      </div>

      {/* HR sparkline */}
      <div className="rounded-2xl border border-subtle bg-surface p-4 shadow-card">
        <SectionHeader title="Heart rate · 24h" action={{ label: "Details →", onClick: () => navigate("/heart") }} className="mb-3" />
        <SparkLine data={hrData} height={60} />
        <div className="mt-1 flex justify-between text-[10px] text-muted-foreground">
          <span>00:00</span><span>12:00</span><span>Now</span>
        </div>
      </div>

      {/* Device card */}
      {device && (
        <div className="rounded-2xl border border-subtle bg-surface p-4 shadow-card">
          <SectionHeader title="Device" />
          <div className="mt-3 flex items-center justify-between">
            <div>
              <p className="text-sm text-foreground">{device.model}</p>
              <p className="text-xs text-muted-foreground">FW {device.firmware_version}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-foreground">{device.battery_level}%</p>
              <p className="text-xs text-muted-foreground capitalize">{device.connection_state}</p>
            </div>
          </div>
        </div>
      )}
    </Screen>
  );
}
