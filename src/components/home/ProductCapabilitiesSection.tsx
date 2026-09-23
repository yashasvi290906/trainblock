"use client";

import React from "react";
import Link from "next/link";
import {
  CalendarRange,
  ClipboardList,
  TrainTrack,
  Sliders,
  BarChart3,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

const CAPABILITIES = [
  {
    key: "plan",
    title: "PLAN",
    subtitle: "Build integrated maintenance blocks",
    desc: "Synthesize multi-departmental possessions and evaluate usable minutes with deterministic conflict detection.",
    href: "/plan",
    icon: <CalendarRange className="w-5 h-5 text-blue-700" />,
    badge: "Core Workspace",
  },
  {
    key: "work-orders",
    title: "WORK ORDERS",
    subtitle: "Prioritise maintenance demand",
    desc: "Classify incoming tasks across Engineering, S&T, and Traction into safety criticality tiers P1, P2, and P3.",
    href: "/work-register",
    icon: <ClipboardList className="w-5 h-5 text-amber-700" />,
    badge: "Register",
  },
  {
    key: "corridor",
    title: "CORRIDOR",
    subtitle: "See trains & work together",
    desc: "Observe physical railway track occupation, OHE power status, and timetable string intersections in real time.",
    href: "/live-corridor",
    icon: <TrainTrack className="w-5 h-5 text-emerald-700" />,
    badge: "Live View",
  },
  {
    key: "what-if",
    title: "WHAT-IF",
    subtitle: "Test block denial & disruptions",
    desc: "Simulate operational contingency scenarios, VIP train delays, and fallback slot replanning in seconds.",
    href: "/scenarios",
    icon: <Sliders className="w-5 h-5 text-purple-700" />,
    badge: "Scenario Lab",
  },
  {
    key: "reports",
    title: "REPORTS",
    subtitle: "Audit evidence & benchmarking",
    desc: "Compare integrated vs siloed performance metrics calibrated against CAG audit benchmarks.",
    href: "/analysis",
    icon: <BarChart3 className="w-5 h-5 text-slate-700" />,
    badge: "Audit Evidence",
  },
];

export function ProductCapabilitiesSection() {
  return (
    <div className="w-full bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
      {/* Header */}
      <div className="max-w-3xl space-y-2">
        <span className="text-xs font-mono uppercase tracking-wider text-blue-900 font-bold bg-blue-50 px-2.5 py-1 rounded border border-blue-200">
          OPERATIONAL WORKSPACES
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Five dedicated modules. One unified system.
        </h2>
        <p className="text-sm text-slate-600 leading-relaxed">
          Every capability is built specifically for Indian Railways divisional planning workflows, eliminating fragmented spreadsheets and manual cross-departmental coordination delays.
        </p>
      </div>

      {/* 5 Railway Capabilities Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {CAPABILITIES.map((cap) => (
          <Link
            key={cap.key}
            href={cap.href}
            className="p-4 rounded-xl bg-slate-50 hover:bg-slate-100/80 border border-slate-200 hover:border-blue-400 transition-all flex flex-col justify-between space-y-3 group shadow-2xs"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-lg bg-white border border-slate-200 flex items-center justify-center shadow-xs">
                  {cap.icon}
                </div>
                <span className="text-[9px] font-mono font-bold text-slate-500 uppercase">
                  {cap.badge}
                </span>
              </div>

              <div>
                <h3 className="font-extrabold text-slate-900 text-sm font-mono tracking-tight group-hover:text-blue-900 transition-colors">
                  {cap.title}
                </h3>
                <h4 className="text-xs font-semibold text-slate-700 mt-0.5">
                  {cap.subtitle}
                </h4>
                <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                  {cap.desc}
                </p>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between text-xs font-mono font-semibold text-blue-900 group-hover:translate-x-0.5 transition-transform">
              <span>Open Module</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
