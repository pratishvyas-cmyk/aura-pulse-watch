// ── AppLayout — wraps all authenticated screens ───────────────────────────────
import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useTheme } from "next-themes";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { BottomTabBar } from "@/components/BottomTabBar";
import { useDeviceStore, useUserStore } from "@/store";
import { BatteryPill } from "@/components/ui/BatteryPill";
import { ConnectionBadge } from "@/components/ui/ConnectionBadge";
import { Sun, Moon } from "lucide-react";

export function AppLayout() {
  const device = useDeviceStore((s) => s.device);
  const fontSize = useUserStore((s) => s.fontSize);
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";

  // Apply font size to the HTML root so all rem-based sizes scale
  useEffect(() => {
    document.documentElement.style.fontSize = `${fontSize}px`;
  }, [fontSize]);

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        {/* Sidebar — hidden on mobile */}
        <div className="hidden md:block">
          <AppSidebar />
        </div>

        <div className="flex flex-1 flex-col min-w-0">
          {/* Top header */}
          <header className="flex h-12 items-center justify-between border-b border-subtle bg-background/80 backdrop-blur-sm px-4 md:px-6">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="hidden md:flex text-muted-foreground hover:text-foreground" />
              <span className="text-xs text-muted-foreground md:hidden font-semibold tracking-widest">THEPUCK</span>
            </div>

            <div className="flex items-center gap-2">
              {/* Theme toggle */}
              <button
                onClick={() => setTheme(isDark ? "light" : "dark")}
                className="flex h-7 w-7 items-center justify-center rounded-lg border border-subtle bg-surface text-muted-foreground transition-colors hover:text-foreground"
                aria-label="Toggle theme"
              >
                {isDark
                  ? <Sun  className="h-3.5 w-3.5" />
                  : <Moon className="h-3.5 w-3.5" />
                }
              </button>

              {device && (
                <>
                  <ConnectionBadge state={device.connection_state} />
                  <BatteryPill level={device.battery_level} />
                </>
              )}
            </div>
          </header>

          {/* Page content */}
          <main className="flex-1 overflow-y-auto pb-20 md:pb-0">
            <Outlet />
          </main>
        </div>

        {/* Bottom tab bar — mobile only */}
        <BottomTabBar />
      </div>
    </SidebarProvider>
  );
}
