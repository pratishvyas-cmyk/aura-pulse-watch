// ── Realistic mock data helpers ───────────────────────────────────────────────
import type { ChartPoint, WeeklyPoint, SleepSummary } from "@/types";

// Generate 24h HR timeline (hourly points)
export function generateHRTimeline(): ChartPoint[] {
  const base = [62, 60, 58, 57, 56, 57, 68, 75, 72, 74, 78, 80, 76, 77, 79, 82, 80, 75, 72, 70, 68, 65, 63, 62];
  return base.map((v, i) => ({
    time: `${String(i).padStart(2, "0")}:00`,
    value: v + Math.round((Math.random() - 0.5) * 6),
  }));
}

// Generate 24h stress timeline
export function generateStressTimeline(): ChartPoint[] {
  const base = [18, 15, 14, 13, 14, 16, 22, 30, 42, 55, 50, 45, 60, 65, 58, 52, 48, 42, 36, 30, 28, 22, 20, 18];
  return base.map((v, i) => ({
    time: `${String(i).padStart(2, "0")}:00`,
    value: Math.max(5, v + Math.round((Math.random() - 0.5) * 8)),
  }));
}

// Generate 24h HRV timeline
export function generateHRVTimeline(): ChartPoint[] {
  const base = [62, 65, 68, 70, 72, 69, 55, 48, 44, 40, 42, 45, 38, 36, 40, 44, 48, 52, 55, 58, 60, 63, 65, 64];
  return base.map((v, i) => ({
    time: `${String(i).padStart(2, "0")}:00`,
    value: Math.max(20, v + Math.round((Math.random() - 0.5) * 5)),
  }));
}

// 7-day weekly HR average
export const weeklyHR: WeeklyPoint[] = [
  { day: "Mon", value: 68 },
  { day: "Tue", value: 72 },
  { day: "Wed", value: 70 },
  { day: "Thu", value: 74 },
  { day: "Fri", value: 76 },
  { day: "Sat", value: 71 },
  { day: "Sun", value: 69 },
];

// 7-day stress average
export const weeklyStress: WeeklyPoint[] = [
  { day: "Mon", value: 38 },
  { day: "Tue", value: 52 },
  { day: "Wed", value: 45 },
  { day: "Thu", value: 61 },
  { day: "Fri", value: 55 },
  { day: "Sat", value: 30 },
  { day: "Sun", value: 28 },
];

// 7-day sleep scores
export const weeklySleep: WeeklyPoint[] = [
  { day: "Mon", value: 74 },
  { day: "Tue", value: 68 },
  { day: "Wed", value: 82 },
  { day: "Thu", value: 71 },
  { day: "Fri", value: 65 },
  { day: "Sat", value: 88 },
  { day: "Sun", value: 78 },
];

// 7-day steps
export const weeklySteps: WeeklyPoint[] = [
  { day: "Mon", value: 8420 },
  { day: "Tue", value: 6230 },
  { day: "Wed", value: 11050 },
  { day: "Thu", value: 7800 },
  { day: "Fri", value: 9120 },
  { day: "Sat", value: 12400 },
  { day: "Sun", value: 5600 },
];

// 7-day readiness scores
export const weeklyReadiness: WeeklyPoint[] = [
  { day: "Mon", value: 72 },
  { day: "Tue", value: 65 },
  { day: "Wed", value: 80 },
  { day: "Thu", value: 78 },
  { day: "Fri", value: 70 },
  { day: "Sat", value: 85 },
  { day: "Sun", value: 82 },
];

// 7-day HRV average
export const weeklyHRV: WeeklyPoint[] = [
  { day: "Mon", value: 48 },
  { day: "Tue", value: 44 },
  { day: "Wed", value: 56 },
  { day: "Thu", value: 52 },
  { day: "Fri", value: 49 },
  { day: "Sat", value: 60 },
  { day: "Sun", value: 54 },
];

// Step goal streaks (true = hit goal)
export const stepStreaks: boolean[] = [true, false, true, true, true, true, false];

export const lastNightSleep: SleepSummary = {
  score: 78,
  durationMins: 432, // 7h 12m
  deepMins: 94,
  lightMins: 198,
  remMins: 106,
  awakeMins: 34,
};

// Weekly sleep durations (in hours) for debt calculation
export const weeklySleepHours: WeeklyPoint[] = [
  { day: "Mon", value: 6.5 },
  { day: "Tue", value: 5.8 },
  { day: "Wed", value: 7.2 },
  { day: "Thu", value: 6.9 },
  { day: "Fri", value: 6.0 },
  { day: "Sat", value: 8.1 },
  { day: "Sun", value: 7.2 },
];

export const hrZones = [
  { label: "Resting",  min: 0,   max: 60,  pct: 42, color: "hsl(var(--text-muted))" },
  { label: "Fat Burn", min: 61,  max: 115, pct: 35, color: "hsl(var(--primary))" },
  { label: "Cardio",   min: 116, max: 153, pct: 18, color: "hsl(var(--status-amber))" },
  { label: "Peak",     min: 154, max: 220, pct: 5,  color: "hsl(var(--status-red))" },
];

// Mock stress events (manual + auto)
export interface StressEvent {
  id: string;
  time: string;       // HH:mm
  score: number;
  label: string;
  isManual: boolean;
}

export const stressEvents: StressEvent[] = [
  { id: "1", time: "09:14", score: 72, label: "Morning spike", isManual: false },
  { id: "2", time: "11:30", score: 81, label: "Manual marker", isManual: true },
  { id: "3", time: "13:45", score: 65, label: "Post-lunch", isManual: false },
  { id: "4", time: "15:20", score: 74, label: "Manual marker", isManual: true },
  { id: "5", time: "17:05", score: 58, label: "Afternoon stress", isManual: false },
];
