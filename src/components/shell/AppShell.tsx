"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Header } from "./Header";
import { PRIMARY_NAVIGATION } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { LayoutGrid, FileText, Activity, GitFork, BarChart2, ShieldAlert } from "lucide-react";
import { RailwayAmbientBackground } from "@/components/common/RailwayAmbientBackground";

interface AppShellProps {
  children: React.ReactNode;
  pageTitle?: string;
  subtitle?: string;
}

export function AppShell({ children }: AppShellProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // Find active primary section to render contextual sub-navigation tabs
  const activeSection = PRIMARY_NAVIGATION.find((item) => {
    if (item.key === "roles") {
      return (
        pathname === "/station-master" ||
        pathname === "/department" ||
        pathname === "/administration"
      );
    }
    if (item.key === "plan") {
      return (
        pathname === "/plan" ||
        pathname === "/control" ||
        pathname === "/block-planner" ||
        pathname === "/decision" ||
        pathname.startsWith("/blocks")
      );
    }
    if (item.key === "work-orders") {
      return pathname === "/work-register" || pathname.startsWith("/tasks");
    }
    if (item.key === "corridor") {
      return pathname === "/live-corridor" || pathname === "/time-distance";
    }
    if (item.key === "what-if") {
      return pathname.startsWith("/scenarios") || pathname.startsWith("/what-if");
    }
    if (item.key === "reports") {
      return pathname === "/reports" || pathname === "/analysis" || pathname === "/siloed-vs-integrated" || pathname === "/evidence";
    }
    return pathname === item.href;
  }) || PRIMARY_NAVIGATION[0];

  return (
    <div className="relative flex flex-col h-screen w-screen overflow-hidden bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-200">
      {/* Personalized Ambient Railway Background Layer */}
      <RailwayAmbientBackground />

      {/* Persistent Synthetic Operational Topology Disclosure */}
      <div className="bg-amber-500/15 border-b border-amber-500/30 px-3 py-1 text-center text-[10px] font-mono font-bold text-amber-800 dark:text-amber-300 z-30 shrink-0">
        SYNTHETIC OPERATIONAL TOPOLOGY — NOT LIVE RAILWAY DATA · Modeled from operational standards (TMS/SMMS/TDMS/COA/FOIS reference concepts) — not an RDSO certification.
      </div>

      {/* 1. Global Workstation Header */}
      <Header
        onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        isMobileMenuOpen={isMobileMenuOpen}
      />

      {/* 2. Primary Horizontal Navigation Bar */}
      <nav className="bg-slate-50/95 dark:bg-[#0B0F19]/95 backdrop-blur-md border-b border-slate-200 dark:border-white/10 px-4 sm:px-6 shrink-0 z-20 transition-colors duration-200">
        <div className="flex items-center justify-between h-11">
          {/* Main Workstation Modules */}
          <div className="flex items-center space-x-1 sm:space-x-2 overflow-x-auto scrollbar-none">
            {PRIMARY_NAVIGATION.map((item) => {
              const isItemActive =
                activeSection.key === item.key ||
                (item.href !== "/" && pathname.startsWith(item.href));

              return (
                <Link
                  key={item.key}
                  href={item.href}
                  className={cn(
                    "px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold tracking-tight transition-all flex items-center gap-1.5 whitespace-nowrap",
                    isItemActive
                      ? "bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-xs"
                      : "text-slate-600 dark:text-slate-300 hover:text-orange-600 dark:hover:text-orange-400 hover:bg-slate-200/60 dark:hover:bg-white/5"
                  )}
                >
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Sub-Items Contextual Tabs */}
          {activeSection?.subItems && activeSection.subItems.length > 0 && (
            <div className="hidden lg:flex items-center gap-1 text-xs border-l border-slate-200 dark:border-white/10 pl-3">
              <span className="text-[10px] font-mono text-slate-500 uppercase font-semibold mr-1">
                Views:
              </span>
              {activeSection.subItems.map((sub) => {
                const isSubActive = pathname === sub.href;
                return (
                  <Link
                    key={sub.href}
                    href={sub.href}
                    className={cn(
                      "px-2.5 py-1 rounded-md text-[11px] font-mono transition-colors",
                      isSubActive
                        ? "bg-orange-500/15 text-orange-600 dark:text-orange-300 font-bold border border-orange-500/30"
                        : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-white/5"
                    )}
                  >
                    {sub.label}
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </nav>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="relative z-10 w-64 h-full bg-white dark:bg-slate-900 text-slate-900 dark:text-white p-4 space-y-4 font-mono text-xs border-r border-slate-200 dark:border-slate-800 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <span className="font-bold text-slate-900 dark:text-white text-sm">RAILBLOCK WORKSTATION</span>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white p-1"
              >
                ✕
              </button>
            </div>
            <div className="space-y-1">
              {PRIMARY_NAVIGATION.map((item) => (
                <Link
                  key={item.key}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    "block px-3 py-2 rounded text-xs font-semibold transition-colors",
                    activeSection.key === item.key
                      ? "bg-blue-600 text-white"
                      : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 3. Main Operational Content Workspace */}
      <main className="flex-1 min-w-0 overflow-y-auto bg-slate-50 dark:bg-[#070A12] text-slate-900 dark:text-slate-100 transition-colors">
        {children}
      </main>
    </div>
  );
}
