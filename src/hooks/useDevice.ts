// ── useDevice — load device + simulate battery/connection polling ─────────────
import { useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useDeviceStore } from "@/store";
import { User } from "@supabase/supabase-js";

export function useDevice(user: User | null) {
  const { setDevice, updateBattery } = useDeviceStore();

  useEffect(() => {
    if (!user) return;

    async function load() {
      const { data } = await supabase
        .from("device_info")
        .select("*")
        .eq("user_id", user!.id)
        .single();
      if (data) setDevice(data);
    }

    load();

    // Simulate slow battery drain every 60 s
    const timer = setInterval(() => {
      updateBattery(Math.max(0, useDeviceStore.getState().device?.battery_level ?? 80 - 1));
    }, 60_000);

    return () => clearInterval(timer);
  }, [user, setDevice, updateBattery]);
}
