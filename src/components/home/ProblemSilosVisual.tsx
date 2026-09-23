"use client";

import React from "react";
import { AlertTriangle, Clock, Wrench, Radio, Zap, SplitSquareVertical } from "lucide-react";

export function ProblemSilosVisual() {
  return (
    <div className="w-full bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-8">
      {/* Section Headline */}
      <div className="max-w-3xl space-y-2">
        <span className="text-xs font-mono uppercase tracking-wider text-amber-900 font-bold bg-amber-50 px-2.5 py-1 rounded border border-amber-200">
          THE OPERATIONAL PROBLEM
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Maintenance doesn&apos;t happen in isolation.
        </h2>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          Engineering, S&T, and Traction all need access to the same 80 km double-line corridor (SEC–NDL). When departments request separate possessions, track machine transit overheads multiply, OHE power cuts repeat, and passenger trains face chronic speed restrictions.
        </p>
      </div>

      {/* Visual Diagram: 3 Independent Requests Clashing */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* 1. Engineering Isolated Request */}
        <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-bold text-amber-900 text-xs font-mono flex items-center gap-1.5">
              <Wrench className="w-3.5 h-3.5 text-amber-700" />
              <span>Engineering (ENG)</span>
            </span>
            <span className="text-[10px] font-mono font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
              KM 68–74
            </span>
          </div>
          <p className="text-xs text-slate-700">
            Requests 50 min track tamping slot. Requires full line block and machine transit from Kazipet.
          </p>
          <div className="text-[11px] font-mono text-slate-500 pt-1 border-t border-amber-200">
            Overhead: 15 min setup
          </div>
        </div>

        {/* 2. S&T Isolated Request */}
        <div className="p-4 rounded-xl bg-sky-50/70 border border-sky-200 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-bold text-sky-900 text-xs font-mono flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 text-sky-700" />
              <span>S&T Department</span>
            </span>
            <span className="text-[10px] font-mono font-bold text-sky-800 bg-sky-100 px-2 py-0.5 rounded">
              KM 71–76
            </span>
          </div>
          <p className="text-xs text-slate-700">
            Requests 40 min track circuit & axle counter calibration. Requires separate interlocking isolation.
          </p>
          <div className="text-[11px] font-mono text-slate-500 pt-1 border-t border-sky-200">
            Overhead: 10 min testing
          </div>
        </div>

        {/* 3. Traction Isolated Request */}
        <div className="p-4 rounded-xl bg-purple-50/70 border border-purple-200 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-bold text-purple-900 text-xs font-mono flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-purple-700" />
              <span>Traction (TRD)</span>
            </span>
            <span className="text-[10px] font-mono font-bold text-purple-800 bg-purple-100 px-2 py-0.5 rounded">
              KM 72–79
            </span>
          </div>
          <p className="text-xs text-slate-700">
            Requests 45 min 25kV OHE cantilever overhaul. Requires dedicated TSS power shutdown and earthing.
          </p>
          <div className="text-[11px] font-mono text-slate-500 pt-1 border-t border-purple-200">
            Overhead: 10 min earthing
          </div>
        </div>
      </div>

      {/* The Consequence Banner */}
      <div className="p-4 rounded-xl bg-slate-900 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 font-mono text-xs">
        <div className="space-y-0.5">
          <span className="text-amber-400 font-bold uppercase tracking-wide flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            Uncoordinated Outcome: 3 Separate Possessions (135 min corridor disruption)
          </span>
          <p className="text-slate-400 font-sans text-xs">
            CAG Audit Report 2022 documents that 62% of track maintenance idleness stems from fragmented blocks denied by operating control.
          </p>
        </div>

        <span className="px-3 py-1 rounded bg-red-950 text-red-300 border border-red-800 shrink-0 font-bold">
          High Traffic Friction
        </span>
      </div>
    </div>
  );
}
