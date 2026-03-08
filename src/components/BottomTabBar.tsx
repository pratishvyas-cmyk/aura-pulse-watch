// ── BottomTabBar — mobile bottom navigation ───────────────────────────────────
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, Brain, Heart, Moon, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const TABS = [
  { label: "Today",    path: "/",         icon: LayoutDashboard },
  { label: "Stress",   path: "/stress",   icon: Brain },
  { label: "Heart",    path: "/heart",    icon: Heart },
  { label: "Sleep",    path: "/sleep",    icon: Moon },
  { label: "Settings", path: "/settings", icon: Settings },
];

export function BottomTabBar() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-subtle bg-sidebar/95 backdrop-blur-md md:hidden">
      <div className="flex items-center justify-around px-2 pb-safe">
        {TABS.map(({ label, path, icon: Icon }) => {
          const active = location.pathname === path;
          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              className={cn(
                "flex flex-col items-center gap-1 px-3 py-3 text-[10px] font-medium transition-colors",
                active ? "text-teal" : "text-muted-foreground"
              )}
            >
              <Icon className={cn("h-5 w-5", active && "drop-shadow-[0_0_6px_hsl(var(--primary))]")} />
              {label}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
