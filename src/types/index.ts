// ── ThePuck — Global TypeScript Types ────────────────────────────────────────

export type Units = "metric" | "imperial";
export type ConnectionState = "connected" | "reconnecting" | "syncing" | "disconnected";

// ── DB Row types (snake_case mirrors Supabase) ────────────────────────────────
export interface Profile {
  id: string;
  user_id: string;
  display_name: string | null;
  age: number | null;
  units: Units;
  onboarding_done: boolean;
  created_at: string;
  updated_at: string;
}

export interface HealthReading {
  id: string;
  user_id: string;
  recorded_at: string;
  heart_rate: number | null;
  hrv: number | null;
  stress_score: number | null;
  readiness_score: number | null;
  steps: number | null;
  calories: number | null;
  distance_m: number | null;
  active_mins: number | null;
  sleep_score: number | null;
  sleep_duration_mins: number | null;
  sleep_deep_mins: number | null;
  sleep_light_mins: number | null;
  sleep_rem_mins: number | null;
  sleep_awake_mins: number | null;
  is_manual_stress_event: boolean;
  notes: string | null;
  created_at: string;
}

export interface DeviceInfo {
  id: string;
  user_id: string;
  model: string;
  serial_number: string | null;
  firmware_version: string;
  battery_level: number;
  connection_state: ConnectionState;
  last_seen_lat: number | null;
  last_seen_lng: number | null;
  last_seen_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface GestureConfig {
  id: string;
  user_id: string;
  gesture_type: GestureType;
  action: GestureAction;
  enabled: boolean;
  created_at: string;
  updated_at: string;
}

export interface HapticProfile {
  id: string;
  user_id: string;
  profile_name: HapticProfileName;
  pattern: HapticPattern;
  intensity: number;
  enabled: boolean;
  created_at: string;
  updated_at: string;
}

// ── Enums / Unions ────────────────────────────────────────────────────────────
export type GestureType = "double_tap" | "tilt_left" | "tilt_right" | "press_hold" | "triple_tap";
export type GestureAction =
  | "call_accept"
  | "call_reject"
  | "music_play_pause"
  | "music_next"
  | "music_prev"
  | "mark_stress"
  | "none";
export type HapticProfileName = "alert" | "stress_warning" | "readiness_nudge" | "call_incoming";
export type HapticPattern = "single" | "double" | "long" | "pattern_sos";

// ── UI / Derived types ────────────────────────────────────────────────────────
export interface DailyStats {
  steps: number;
  stepsGoal: number;
  calories: number;
  caloriesGoal: number;
  distanceKm: number;
  distanceGoal: number;
  activeMins: number;
  activeMinsGoal: number;
}

export interface SleepSummary {
  score: number;
  durationMins: number;
  deepMins: number;
  lightMins: number;
  remMins: number;
  awakeMins: number;
}

export type StressLevel = "calm" | "elevated" | "high";
export function getStressLevel(score: number): StressLevel {
  if (score < 40) return "calm";
  if (score < 70) return "elevated";
  return "high";
}

export interface ChartPoint {
  time: string;   // HH:mm
  value: number;
}

export interface WeeklyPoint {
  day: string;    // Mon, Tue …
  value: number;
}
