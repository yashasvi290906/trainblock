"use client";

import React from "react";
import Link from "next/link";
import { Sliders, AlertOctagon, ArrowRight, CheckCircle2, RotateCcw } from "lucide-react";

export function WhatIfPreviewSection() {
  return (
    <div className="w-full bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="max-w-2xl space-y-1.5">
          <span className="text-xs font-mono uppercase tracking-wider text-purple-900 font-bold bg-purple-50 px-2.5 py-1 rounded border border-purple-200">
            SCENARIO PLANNING
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            What happens when the plan changes?
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            Corridor conditions change rapidly. What if operating control denies the primary 02:20 window due to an emergency freight detour or VIP rake movement? RAILBLOCK instantly evaluates ranked alternative slots.
          </p>
        </div>

        <Link
          href="/scenarios"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-blue-900 hover:bg-blue-800 text-white text-xs font-semibold shadow-sm transition-all"
        >
          <Sliders className="w-4 h-4" />
          <span>Test in What-If Lab</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Scenario Flow Simulation Box */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
        {/* Step 1: Disruption Injected */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
          <span className="text-[10px] text-slate-500 font-bold block">1 · DISRUPTION TRIGGER</span>
          <div className="text-slate-900 font-extrabold text-xs flex items-center gap-1.5">
            <AlertOctagon className="w-4 h-4 text-red-600 shrink-0" />
            <span>Primary Block Denied</span>
          </div>
          <p className="text-[11px] text-slate-600 font-sans">
            Central Operating Control withholds approval for B-014 at 02:20–04:10 due to high freight volume.
          </p>
        </div>

        {/* Step 2: Passenger Paths Preserved */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
          <span className="text-[10px] text-slate-500 font-bold block">2 · TRAIN PROTECTION</span>
          <div className="text-slate-900 font-extrabold text-xs flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
            <span>Passenger Paths Protected</span>
          </div>
          <p className="text-[11px] text-slate-600 font-sans">
            All 4 passenger trains maintain 100% on-time trajectories with zero regulated stops.
          </p>
        </div>

        {/* Step 3: Fallback Window Slot Synthesized */}
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 space-y-2">
          <span className="text-[10px] text-emerald-800 font-bold block">3 · ALTERNATIVE WINDOW</span>
          <div className="text-emerald-950 font-extrabold text-xs flex items-center gap-1.5">
            <RotateCcw className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>Fallback FW-01 (04:20–06:10)</span>
          </div>
          <p className="text-[11px] text-slate-700 font-sans">
            System identifies trailing morning slot: 90m usable work, zero passenger conflict, 7/7 tasks preserved.
          </p>
        </div>
      </div>
    </div>
  );
}
