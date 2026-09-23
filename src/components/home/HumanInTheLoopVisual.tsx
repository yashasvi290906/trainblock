"use client";

import React from "react";
import Link from "next/link";
import { Shield, CheckCircle2, Sliders, XCircle, ArrowRight, UserCheck } from "lucide-react";

export function HumanInTheLoopVisual() {
  return (
    <div className="w-full bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
      {/* Section Header */}
      <div className="max-w-3xl space-y-2">
        <span className="text-xs font-mono uppercase tracking-wider text-slate-900 font-bold bg-slate-100 px-2.5 py-1 rounded border border-slate-200">
          PLANNER CONTROL
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          The system recommends. The planner decides.
        </h2>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          RAILBLOCK operates as a deterministic decision support system for Indian Railways. It formulates mathematically optimal, timetable-safe possession proposals, while the Divisional Railway Planner retains exclusive authority to adjust, approve, or simulate contingency scenarios.
        </p>
      </div>

      {/* 3-Step Human Decision Gate Flow */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
        {/* Step 1: System Recommendation */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-[10px] font-bold">
            <span>01 · ENGINE SYNTHESIS</span>
            <span className="text-blue-900">ADVISORY</span>
          </div>
          <h3 className="font-extrabold text-slate-900 text-sm">
            RAILBLOCK Recommends
          </h3>
          <p className="text-xs text-slate-600 font-sans">
            Block B-014 synthesized for KM 68–94 at 02:20–04:10 with 0 train conflicts and 90m usable wrench time.
          </p>
        </div>

        {/* Step 2: Human Inspection */}
        <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 space-y-2">
          <div className="flex items-center justify-between text-blue-800 text-[10px] font-bold">
            <span>02 · PLANNER REVIEW</span>
            <UserCheck className="w-4 h-4 text-blue-700" />
          </div>
          <h3 className="font-extrabold text-blue-950 text-sm">
            Human Inspection
          </h3>
          <p className="text-xs text-slate-700 font-sans">
            Divisional Controller verifies machine availability, OHE earthing protocols, and local operating conditions.
          </p>
        </div>

        {/* Step 3: Planner Action Gate */}
        <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-300 space-y-2">
          <div className="flex items-center justify-between text-emerald-800 text-[10px] font-bold">
            <span>03 · OPERATIONAL GATE</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-700" />
          </div>
          <h3 className="font-extrabold text-emerald-950 text-sm">
            Approve, Adjust, or Deny
          </h3>
          <div className="flex flex-wrap gap-1.5 pt-1 text-[11px]">
            <span className="px-2 py-0.5 rounded bg-emerald-700 text-white font-bold">APPROVE</span>
            <span className="px-2 py-0.5 rounded bg-slate-200 text-slate-700">ADJUST (−30m/+30m)</span>
            <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800">REPLAN</span>
          </div>
        </div>
      </div>
    </div>
  );
}
