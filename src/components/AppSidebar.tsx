// ── AppSidebar — desktop persistent sidebar ───────────────────────────────────
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, Heart, Brain, Moon, Vibrate, MapPin, Settings, Zap,
} from "lucide-react";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarMenu,
  SidebarMenuItem, SidebarMenuButton, SidebarHeader, SidebarFooter, useSidebar,
} from "@/components/ui/sidebar";
import { useDeviceStore, useUserStore } from "@/store";
import { ConnectionBadge } from "@/components/ui/ConnectionBadge";
import { BatteryPill } from "@/components/ui/BatteryPill";
import { cn } from "@/lib/utils";

const NAV = [
  { label: "Today",    path: "/",         icon: LayoutDashboard },
  { label: "Stress",   path: "/stress",   icon: Brain },
  { label: "Heart",    path: "/heart",    icon: Heart },
  { label: "Sleep",    path: "/sleep",    icon: Moon },
  { label: "Gestures", path: "/gestures", icon: Vibrate },
  { label: "Find",     path: "/find",     icon: MapPin },
  { label: "Settings", path: "/settings", icon: Settings },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const navigate = useNavigate();
  const device = useDeviceStore((s) => s.device);
  const profile = useUserStore((s) => s.profile);

  return (
    <Sidebar collapsible="icon" className="border-r border-subtle bg-sidebar">
      {/* Logo */}
      <SidebarHeader className="px-4 py-5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-dim border border-primary/30">
            <Zap className="h-4 w-4 text-teal" />
          </div>
          {!collapsed && (
            <div>
              <p className="text-sm font-semibold tracking-tight text-foreground">ThePuck</p>
              <p className="text-[10px] text-muted-foreground">
                {profile?.display_name ?? "—"}
              </p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="gap-0.5">
              {NAV.map(({ label, path, icon: Icon }) => {
                const active = location.pathname === path;
                return (
                  <SidebarMenuItem key={path}>
                    <SidebarMenuButton
                      onClick={() => navigate(path)}
                      className={cn(
                        "w-full rounded-xl px-3 py-2.5 text-sm transition-colors",
                        active
                          ? "bg-teal-dim text-teal border border-primary/20"
                          : "text-muted-foreground hover:bg-accent hover:text-foreground"
                      )}
                    >
                      <Icon className="h-[1.05rem] w-[1.05rem] flex-shrink-0" />
                      {!collapsed && <span>{label}</span>}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Device status footer */}
      {!collapsed && device && (
        <SidebarFooter className="border-t border-subtle px-4 py-3 space-y-2">
          <ConnectionBadge state={device.connection_state} />
          <BatteryPill level={device.battery_level} />
        </SidebarFooter>
      )}
    </Sidebar>
  );
}
