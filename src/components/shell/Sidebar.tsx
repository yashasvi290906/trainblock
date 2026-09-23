"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CalendarRange,
  ClipboardList,
  TrainTrack,
  Sliders,
  BarChart3,
  Settings,
  Shield,
  Layers,
} from "lucide-react";
import { PRIMARY_NAVIGATION, SYSTEM_NAV_ITEM, PrimaryNavItem } from "@/lib/constants";
import { cn } from "@/lib/utils";

const ICON_MAP: Record<string, React.ReactNode> = {
  CalendarRange: <CalendarRange className="w-4 h-4" />,
  ClipboardList: <ClipboardList className="w-4 h-4" />,
  TrainTrack: <TrainTrack className="w-4 h-4" />,
  Sliders: <Sliders className="w-4 h-4" />,
  BarChart3: <BarChart3 className="w-4 h-4" />,
  Settings: <Settings className="w-4 h-4" />,
};

interface SidebarProps {
  onCloseMobileMenu?: () => void;
}

export function Sidebar({ onCloseMobileMenu }: SidebarProps) {
  const pathname = usePathname();

  // Helper to determine active state from current pathname
  const isItemActive = (item: PrimaryNavItem) => {
    if (item.key === "plan") {
      return (
        pathname === "/plan" ||
        pathname === "/control" ||
        pathname === "/block-planner" ||
        pathname === "/decision" ||
        (pathname.startsWith("/blocks") && !pathname.includes("live-corridor"))
      );
    }
    if (item.key === "work-orders") {
      return pathname === "/work-register" || pathname.startsWith("/tasks");
    }
    if (item.key === "corridor") {
      return pathname === "/live-corridor" || pathname === "/time-distance";
    }
    if (item.key === "what-if") {
      return pathname.startsWith("/scenarios");
    }
    if (item.key === "reports") {
      return pathname === "/analysis" || pathname === "/siloed-vs-integrated";
    }
    if (item.key === "system") {
      return pathname.startsWith("/system");
    }
    return pathname === item.href;
  };

  return (
    <aside className="w-60 bg-white border-r border-slate-200/90 flex flex-col justify-between h-screen sticky top-0 select-none z-20 shrink-0">
      {/* Top Header & Brand */}
      <div>
        <div className="p-4 border-b border-slate-200 bg-slate-50/70">
          <Link
            href="/"
            onClick={onCloseMobileMenu}
            className="flex items-center gap-2.5 group"
          >
            <div className="w-8 h-8 rounded-lg bg-blue-900 text-white flex items-center justify-center shadow-xs group-hover:bg-blue-800 transition-colors">
              <TrainTrack className="w-4 h-4 text-blue-200" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold tracking-tight text-slate-900 font-mono text-sm">
                  RAILBLOCK
                </span>
                <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-blue-50 text-blue-800 font-bold border border-blue-200">
                  SIH &apos;26
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">
                Integrated Block Planner
              </p>
            </div>
          </Link>
        </div>

        {/* Section Context Strip */}
        <div className="px-4 py-2 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs font-mono text-slate-600">
          <span className="font-semibold text-slate-800">SEC – NDL</span>
          <span className="text-[11px] text-slate-500">80 km</span>
        </div>

        {/* Primary Navigation List (5 Core Destinations) */}
        <nav className="p-3 space-y-1">
          <div className="px-3 py-1.5 text-[10px] uppercase font-bold text-slate-400 tracking-wider font-mono">
            Operational Workspaces
          </div>

          {PRIMARY_NAVIGATION.map((item) => {
            const active = isItemActive(item);
            return (
              <Link
                key={item.key}
                href={item.href}
                onClick={onCloseMobileMenu}
                className={cn(
                  "flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all group",
                  active
                    ? "bg-blue-50 text-blue-900 font-bold border-l-3 border-blue-800 shadow-xs"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50 border-l-3 border-transparent"
                )}
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className={cn(
                      "transition-colors",
                      active ? "text-blue-800" : "text-slate-400 group-hover:text-slate-600"
                    )}
                  >
                    {ICON_MAP[item.icon]}
                  </span>
                  <span>{item.label}</span>
                </div>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Footer: System Link & Problem Statement Metadata */}
      <div className="p-3 border-t border-slate-200 bg-slate-50/70 space-y-2">
        {/* System & Settings Link */}
        <Link
          href={SYSTEM_NAV_ITEM.href}
          onClick={onCloseMobileMenu}
          className={cn(
            "flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all group",
            pathname === SYSTEM_NAV_ITEM.href
              ? "bg-blue-50 text-blue-900 font-bold border-l-3 border-blue-800"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100 border-l-3 border-transparent"
          )}
        >
          <span className="text-slate-400 group-hover:text-slate-600">
            <Settings className="w-4 h-4" />
          </span>
          <span>{SYSTEM_NAV_ITEM.label}</span>
        </Link>

        {/* Prototype Disclosure Metadata Card */}
        <div className="p-2.5 rounded-lg bg-white border border-slate-200 text-[10px] font-mono text-slate-500 space-y-0.5 shadow-2xs">
          <div className="flex items-center justify-between text-slate-700 font-semibold">
            <span>SCR / Secunderabad</span>
            <span className="text-emerald-700 font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Calibrated
            </span>
          </div>
          <p className="text-[9px] text-slate-400 leading-tight">
            Problem Statement ID: 26027
          </p>
        </div>
      </div>
    </aside>
  );
}
