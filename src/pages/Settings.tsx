// ── Device & Account Settings ─────────────────────────────────────────────────
import React, { useState } from "react";
import { useTheme } from "next-themes";
import { Screen } from "@/components/ui/Screen";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { GhostButton } from "@/components/ui/PrimaryButton";
import { useUserStore, useDeviceStore } from "@/store";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";
import { User, Download, Trash2, LogOut, Star, Cpu, Wifi, ChevronRight, Sun, Moon } from "lucide-react";
import { cn } from "@/lib/utils";

export default function SettingsPage() {
  const { user, signOut } = useAuth();
  const { profile, updateProfile, isSubscribed, shareAnalytics, shareHealthData, setShareAnalytics, setShareHealthData } = useUserStore();
  const device = useDeviceStore((s) => s.device);
  const { theme, setTheme } = useTheme();
  const [name, setName] = useState(profile?.display_name ?? "");
  const [saving, setSaving] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  async function saveProfile() {
    if (!user || !profile) return;
    setSaving(true);
    await supabase.from("profiles").update({ display_name: name }).eq("user_id", user.id);
    updateProfile({ display_name: name });
    toast({ title: "Profile updated" });
    setSaving(false);
  }

  async function exportData() {
    if (!user) return;
    const { data } = await supabase.from("health_readings").select("*").eq("user_id", user.id).order("recorded_at");
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "thepuck-data.json"; a.click();
    URL.revokeObjectURL(url);
    toast({ title: "Export complete" });
  }

  async function deleteAllData() {
    if (!user) return;
    await supabase.from("health_readings").delete().eq("user_id", user.id);
    toast({ title: "All health data deleted" });
    setShowDelete(false);
  }

  const Row = ({ icon: Icon, label, value, danger = false }: { icon: React.ComponentType<{ className?: string }>; label: string; value?: string; danger?: boolean }) => (
    <div className={cn("flex items-center justify-between py-3", danger && "text-status-red")}>
      <div className="flex items-center gap-3">
        <Icon className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
        <span className={cn("text-sm", danger ? "text-status-red" : "text-foreground")}>{label}</span>
      </div>
      {value && <span className="text-sm text-muted-foreground">{value}</span>}
    </div>
  );

  const Toggle = ({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) => (
    <div className="flex items-center justify-between py-3">
      <span className="text-sm text-foreground">{label}</span>
      <label className="relative inline-flex cursor-pointer items-center">
        <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="sr-only peer" />
        <div className="h-5 w-9 rounded-full bg-border peer-checked:bg-primary transition-colors after:absolute after:left-0.5 after:top-0.5 after:h-4 after:w-4 after:rounded-full after:bg-background after:transition-all peer-checked:after:translate-x-4" />
      </label>
    </div>
  );

  const isDark = theme === "dark";

  return (
    <Screen className="space-y-6">
      <div>
        <p className="text-xs text-muted-foreground uppercase tracking-widest">Account</p>
        <h1 className="mt-0.5 text-xl font-light text-foreground">Settings</h1>
      </div>

      {/* ── Appearance ── */}
      <div className="rounded-2xl border border-subtle bg-surface shadow-card overflow-hidden">
        <div className="px-4 pt-4 pb-2">
          <SectionHeader title="Appearance" />
        </div>
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {isDark
                ? <Moon className="h-4 w-4 text-muted-foreground" />
                : <Sun  className="h-4 w-4 text-muted-foreground" />
              }
              <span className="text-sm text-foreground">{isDark ? "Dark mode" : "Light mode"}</span>
            </div>
            {/* Segmented toggle */}
            <div className="flex rounded-xl border border-subtle bg-surface-raised p-0.5 gap-0.5">
              <button
                onClick={() => setTheme("light")}
                className={cn(
                  "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all",
                  !isDark
                    ? "bg-surface text-foreground shadow-sm border border-subtle"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Sun className="h-3 w-3" />
                Light
              </button>
              <button
                onClick={() => setTheme("dark")}
                className={cn(
                  "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all",
                  isDark
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Moon className="h-3 w-3" />
                Dark
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Subscription badge ── */}
      <div className={cn(
        "flex items-center gap-3 rounded-2xl border p-4",
        isSubscribed ? "border-gold/30 bg-gold-dim" : "border-subtle bg-surface"
      )}>
        <Star className={cn("h-5 w-5 flex-shrink-0", isSubscribed ? "text-gold" : "text-muted-foreground")} />
        <div>
          <p className={cn("text-sm font-medium", isSubscribed ? "text-gold" : "text-foreground")}>
            {isSubscribed ? "ThePuck Premium" : "Free plan"}
          </p>
          <p className="text-xs text-muted-foreground">
            {isSubscribed ? "All features unlocked" : "Upgrade for deeper analytics & export"}
          </p>
        </div>
        {!isSubscribed && <ChevronRight className="ml-auto h-4 w-4 text-muted-foreground" />}
      </div>

      {/* ── Profile ── */}
      <div className="rounded-2xl border border-subtle bg-surface shadow-card overflow-hidden">
        <div className="px-4 pt-4 pb-2">
          <SectionHeader title="Profile" />
        </div>
        <div className="divide-y divide-border px-4">
          <div className="py-3">
            <label className="mb-1.5 block text-xs text-muted-foreground">Display name</label>
            <div className="flex gap-2">
              <input
                value={name} onChange={(e) => setName(e.target.value)}
                className="flex-1 rounded-xl border border-subtle bg-surface-raised px-3 py-2 text-sm text-foreground outline-none focus:border-primary/60"
              />
              <button onClick={saveProfile} disabled={saving} className="rounded-xl bg-primary px-3 py-2 text-sm text-primary-foreground font-medium disabled:opacity-50">
                {saving ? "…" : "Save"}
              </button>
            </div>
          </div>
          <Row icon={User} label="Email" value={user?.email ?? "—"} />
          <Row icon={User} label="Units"  value={profile?.units ?? "metric"} />
        </div>
      </div>

      {/* ── Device ── */}
      {device && (
        <div className="rounded-2xl border border-subtle bg-surface shadow-card overflow-hidden">
          <div className="px-4 pt-4 pb-2">
            <SectionHeader title="Device" />
          </div>
          <div className="divide-y divide-border px-4">
            <Row icon={Cpu}  label="Model"    value={device.model} />
            <Row icon={Cpu}  label="Firmware" value={device.firmware_version} />
            <Row icon={Cpu}  label="Serial"   value={device.serial_number ?? "TPK-2024-A4B7"} />
            <Row icon={Wifi} label="Status"   value={device.connection_state} />
          </div>
        </div>
      )}

      {/* ── Privacy ── */}
      <div className="rounded-2xl border border-subtle bg-surface shadow-card overflow-hidden">
        <div className="px-4 pt-4 pb-2">
          <SectionHeader title="Privacy" />
        </div>
        <div className="divide-y divide-border px-4">
          <Toggle label="Share analytics"              checked={shareAnalytics}  onChange={setShareAnalytics}  />
          <Toggle label="Share health data for research" checked={shareHealthData} onChange={setShareHealthData} />
        </div>
      </div>

      {/* ── Data controls ── */}
      <div className="rounded-2xl border border-subtle bg-surface shadow-card overflow-hidden">
        <div className="px-4 pt-4 pb-2">
          <SectionHeader title="Data" />
        </div>
        <div className="divide-y divide-border px-4">
          <button onClick={exportData} className="flex w-full items-center gap-3 py-3 text-sm text-foreground hover:text-primary transition-colors">
            <Download className="h-4 w-4 text-muted-foreground" />
            Export all data
          </button>
          <button onClick={() => setShowDelete(true)} className="flex w-full items-center gap-3 py-3 text-sm text-status-red">
            <Trash2 className="h-4 w-4" />
            Delete all health data
          </button>
        </div>
      </div>

      {/* ── Sign out ── */}
      <GhostButton onClick={signOut} icon={<LogOut className="h-4 w-4" />} className="w-full">
        Sign out
      </GhostButton>

      {/* ── Delete confirm modal ── */}
      {showDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm px-4">
          <div className="w-full max-w-sm rounded-2xl border border-subtle bg-surface p-6 shadow-card space-y-4">
            <div className="flex items-center gap-3">
              <Trash2 className="h-5 w-5 text-status-red flex-shrink-0" />
              <h3 className="text-sm font-semibold text-foreground">Delete all health data?</h3>
            </div>
            <p className="text-xs text-muted-foreground">This permanently removes all recorded health readings. Your account and settings remain intact.</p>
            <div className="flex gap-2">
              <GhostButton onClick={() => setShowDelete(false)} className="flex-1">Cancel</GhostButton>
              <button onClick={deleteAllData} className="flex-1 rounded-xl bg-status-red px-4 py-2 text-sm font-semibold text-primary-foreground">Delete</button>
            </div>
          </div>
        </div>
      )}
    </Screen>
  );
}
