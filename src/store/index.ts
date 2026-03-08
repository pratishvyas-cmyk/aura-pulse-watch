// ── Zustand Stores ────────────────────────────────────────────────────────────
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  Profile,
  DeviceInfo,
  GestureConfig,
  HapticProfile,
  ConnectionState,
  HealthReading,
} from "@/types";

// ── Device Store ──────────────────────────────────────────────────────────────
interface DeviceState {
  device: DeviceInfo | null;
  setDevice: (d: DeviceInfo | null) => void;
  updateBattery: (level: number) => void;
  updateConnection: (state: ConnectionState) => void;
}

export const useDeviceStore = create<DeviceState>((set) => ({
  device: null,
  setDevice: (device) => set({ device }),
  updateBattery: (level) =>
    set((s) => s.device ? { device: { ...s.device, battery_level: level } } : s),
  updateConnection: (connection_state) =>
    set((s) => s.device ? { device: { ...s.device, connection_state } } : s),
}));

// ── Health Store ──────────────────────────────────────────────────────────────
interface HealthState {
  liveHeartRate: number;
  liveHRV: number;
  liveStress: number;
  readinessScore: number;
  todaySteps: number;
  todayCalories: number;
  todayDistanceM: number;
  todayActiveMins: number;
  recentReadings: HealthReading[];
  streakDays: number;
  setLiveHeartRate: (v: number) => void;
  setLiveHRV: (v: number) => void;
  setLiveStress: (v: number) => void;
  setReadiness: (v: number) => void;
  setTodayStats: (s: Partial<Pick<HealthState, "todaySteps" | "todayCalories" | "todayDistanceM" | "todayActiveMins">>) => void;
  setRecentReadings: (r: HealthReading[]) => void;
  setStreakDays: (v: number) => void;
}

export const useHealthStore = create<HealthState>((set) => ({
  liveHeartRate:   72,
  liveHRV:         54,
  liveStress:      38,
  readinessScore:  82,
  todaySteps:      7240,
  todayCalories:   1840,
  todayDistanceM:  5620,
  todayActiveMins: 42,
  recentReadings:  [],
  streakDays:      5,
  setLiveHeartRate: (liveHeartRate) => set({ liveHeartRate }),
  setLiveHRV:      (liveHRV) => set({ liveHRV }),
  setLiveStress:   (liveStress) => set({ liveStress }),
  setReadiness:    (readinessScore) => set({ readinessScore }),
  setTodayStats:   (s) => set((prev) => ({ ...prev, ...s })),
  setRecentReadings: (recentReadings) => set({ recentReadings }),
  setStreakDays:   (streakDays) => set({ streakDays }),
}));

// ── Gesture Store ─────────────────────────────────────────────────────────────
interface GestureState {
  gestures: GestureConfig[];
  hapticProfiles: HapticProfile[];
  setGestures: (g: GestureConfig[]) => void;
  updateGesture: (id: string, changes: Partial<GestureConfig>) => void;
  setHapticProfiles: (h: HapticProfile[]) => void;
  updateHaptic: (id: string, changes: Partial<HapticProfile>) => void;
}

export const useGestureStore = create<GestureState>((set) => ({
  gestures: [],
  hapticProfiles: [],
  setGestures: (gestures) => set({ gestures }),
  updateGesture: (id, changes) =>
    set((s) => ({ gestures: s.gestures.map((g) => (g.id === id ? { ...g, ...changes } : g)) })),
  setHapticProfiles: (hapticProfiles) => set({ hapticProfiles }),
  updateHaptic: (id, changes) =>
    set((s) => ({ hapticProfiles: s.hapticProfiles.map((h) => (h.id === id ? { ...h, ...changes } : h)) })),
}));

// ── User Store ────────────────────────────────────────────────────────────────
export interface PreAuthProfile {
  display_name: string;
  age: number | null;
  units: "metric" | "imperial";
  devicePaired: boolean;
}

interface UserState {
  profile: Profile | null;
  preAuthProfile: PreAuthProfile | null;
  preAuthDone: boolean;
  isSubscribed: boolean;
  shareAnalytics: boolean;
  shareHealthData: boolean;
  fontSize: number;
  sleepGoalHours: number;
  setProfile: (p: Profile | null) => void;
  updateProfile: (changes: Partial<Profile>) => void;
  setPreAuthProfile: (p: PreAuthProfile) => void;
  setPreAuthDone: (v: boolean) => void;
  setSubscribed: (v: boolean) => void;
  setShareAnalytics: (v: boolean) => void;
  setShareHealthData: (v: boolean) => void;
  setFontSize: (v: number) => void;
  setSleepGoalHours: (v: number) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      profile: null,
      preAuthProfile: null,
      preAuthDone: false,
      isSubscribed: false,
      shareAnalytics: true,
      shareHealthData: false,
      fontSize: 16,
      sleepGoalHours: 8,
      setProfile: (profile) => set({ profile }),
      updateProfile: (changes) =>
        set((s) => s.profile ? { profile: { ...s.profile, ...changes } } : s),
      setPreAuthProfile: (preAuthProfile) => set({ preAuthProfile }),
      setPreAuthDone: (preAuthDone) => set({ preAuthDone }),
      setSubscribed: (isSubscribed) => set({ isSubscribed }),
      setShareAnalytics: (shareAnalytics) => set({ shareAnalytics }),
      setShareHealthData: (shareHealthData) => set({ shareHealthData }),
      setFontSize: (fontSize) => set({ fontSize }),
      setSleepGoalHours: (sleepGoalHours) => set({ sleepGoalHours }),
    }),
    { name: "thepuck-user-store", partialState: true }
  )
);
