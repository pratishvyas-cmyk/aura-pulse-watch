// ── useHealthData — loads readings + simulates live HR ────────────────────────
import { useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { useHealthStore } from "@/store";
import { User } from "@supabase/supabase-js";

export function useHealthData(user: User | null) {
  const { setLiveHeartRate, setLiveHRV, setLiveStress, setReadiness, setTodayStats, setRecentReadings, liveHeartRate } = useHealthStore();
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!user) return;

    async function loadData() {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const { data } = await supabase
        .from("health_readings")
        .select("*")
        .eq("user_id", user!.id)
        .gte("recorded_at", today.toISOString())
        .order("recorded_at", { ascending: false })
        .limit(200);

      if (data && data.length > 0) {
        setRecentReadings(data);
        const latest = data[0];
        if (latest.heart_rate)      setLiveHeartRate(latest.heart_rate);
        if (latest.hrv)             setLiveHRV(Number(latest.hrv));
        if (latest.stress_score)    setLiveStress(latest.stress_score);
        if (latest.readiness_score) setReadiness(latest.readiness_score);

        // Aggregate today's activity
        const todayRows = data.filter((r) => r.recorded_at >= today.toISOString());
        const steps    = todayRows.reduce((a, r) => a + (r.steps ?? 0), 0);
        const calories = todayRows.reduce((a, r) => a + (r.calories ?? 0), 0);
        const distM    = todayRows.reduce((a, r) => a + (Number(r.distance_m) ?? 0), 0);
        const active   = todayRows.reduce((a, r) => a + (r.active_mins ?? 0), 0);
        if (steps)    setTodayStats({ todaySteps: steps, todayCalories: calories, todayDistanceM: distM, todayActiveMins: active });
      }
    }

    loadData();
  }, [user, setLiveHeartRate, setLiveHRV, setLiveStress, setReadiness, setTodayStats, setRecentReadings]);

  // Simulate real-time HR fluctuation every 3 s
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      const delta = Math.round((Math.random() - 0.5) * 4);
      setLiveHeartRate(Math.max(50, Math.min(180, liveHeartRate + delta)));
    }, 3000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [liveHeartRate, setLiveHeartRate]);
}
