"use client";

import React, { useState } from "react";
import { ArrowRight, CheckCircle2, AlertTriangle, Shield, Wrench, Radio, Zap, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

export function PossessionComparisonVisual() {
  const [viewMode, setViewMode] = useState<"COMPARISON" | "OPTIMIZED" | "BASELINE">("COMPARISON");

  return (
    <div className="w-full bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden text-slate-800">
      {/* Header & Mode Toggles */}
      <div className="bg-slate-50 px-5 py-3.5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-900 uppercase">Operational Transformation Proof</span>
          <span className="text-slate-400">|</span>
          <span className="text-slate-600">SEC–NDL (KM 68–94)</span>
        </div>

        <div className="flex items-center bg-white p-1 rounded-lg border border-slate-200">
          <button
            onClick={() => setViewMode("COMPARISON")}
            className={cn(
              "px-3 py-1 rounded text-[11px] font-semibold transition-all",
              viewMode === "COMPARISON"
                ? "bg-blue-700 text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            )}
          >
            Side-by-Side Comparison
          </button>
          <button
            onClick={() => setViewMode("BASELINE")}
            className={cn(
              "px-3 py-1 rounded text-[11px] font-semibold transition-all",
              viewMode === "BASELINE"
                ? "bg-amber-600 text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            )}
          >
            Siloed Baseline
          </button>
          <button
            onClick={() => setViewMode("OPTIMIZED")}
            className={cn(
              "px-3 py-1 rounded text-[11px] font-semibold transition-all",
              viewMode === "OPTIMIZED"
                ? "bg-emerald-600 text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            )}
          >
            RAILBLOCK Integrated
          </button>
        </div>
      </div>

      {/* Main Comparison Containers */}
      <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 1. BEFORE: SILOED DEPARTMENTAL PLANNING */}
        {(viewMode === "COMPARISON" || viewMode === "BASELINE") && (
          <div className="p-5 rounded-xl bg-slate-50 border border-amber-200/80 space-y-4 flex flex-col justify-between">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-amber-900 uppercase flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  BEFORE: 3 Siloed Departmental Blocks
                </span>
                <span className="text-[10px] font-mono font-bold text-red-700 bg-red-50 border border-red-200 px-2 py-0.5 rounded">
                  180 Min Blocked
                </span>
              </div>
              <p className="text-xs text-slate-600 font-sans">
                Each department requests isolated track occupation with redundant line protection overhead and conflicting schedules.
              </p>
            </div>

            {/* 3 Siloed Possession Cards */}
            <div className="space-y-2 font-mono text-xs">
              <div className="p-2.5 bg-white rounded-lg border border-slate-200 space-y-1">
                <div className="flex justify-between font-bold text-slate-900">
                  <span className="text-amber-800">1. Engineering Block B-011</span>
                  <span>22:00–22:50 (50 min)</span>
                </div>
                <div className="flex justify-between text-[11px] text-slate-500">
                  <span>KM 68–80 • Tamping Machine</span>
                  <span className="text-red-600 font-bold">Conflicts with Rajdhani 12723</span>
                </div>
              </div>

              <div className="p-2.5 bg-white rounded-lg border border-slate-200 space-y-1">
                <div className="flex justify-between font-bold text-slate-900">
                  <span className="text-sky-800">2. S&T Block B-012</span>
                  <span>23:00–23:40 (40 min)</span>
                </div>
                <div className="flex justify-between text-[11px] text-slate-500">
                  <span>KM 82–98 • Axle Counter</span>
                  <span>Separate Station Interlocking Setup</span>
                </div>
              </div>

              <div className="p-2.5 bg-white rounded-lg border border-slate-200 space-y-1">
                <div className="flex justify-between font-bold text-slate-900">
                  <span className="text-emerald-800">3. Traction Block B-013</span>
                  <span>00:00–00:45 (45 min)</span>
                </div>
                <div className="flex justify-between text-[11px] text-slate-500">
                  <span>KM 70–94 • Tower Wagon</span>
                  <span className="text-red-600 font-bold">Conflicts with Freight G/4217</span>
                </div>
              </div>
            </div>

            {/* Siloed Metrics */}
            <div className="pt-3 border-t border-slate-200 grid grid-cols-3 gap-2 text-center font-mono text-xs">
              <div className="p-2 rounded bg-white border border-slate-200">
                <div className="text-[10px] text-slate-500">Possessions</div>
                <div className="font-bold text-slate-900 text-sm">3 Disjointed</div>
              </div>
              <div className="p-2 rounded bg-white border border-slate-200">
                <div className="text-[10px] text-slate-500">Work Efficiency</div>
                <div className="font-bold text-amber-700 text-sm">0.58 / min</div>
              </div>
              <div className="p-2 rounded bg-white border border-slate-200">
                <div className="text-[10px] text-slate-500">Train Conflicts</div>
                <div className="font-bold text-red-700 text-sm">2 Detected</div>
              </div>
            </div>
          </div>
        )}

        {/* 2. AFTER: RAILBLOCK INTEGRATED POSSESSION */}
        {(viewMode === "COMPARISON" || viewMode === "OPTIMIZED") && (
          <div className="p-5 rounded-xl bg-blue-50/40 border border-blue-200 space-y-4 flex flex-col justify-between">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-blue-950 uppercase flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  AFTER: 1 Coordinated Integrated Block
                </span>
                <span className="text-[10px] font-mono font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                  110 Min Single Window
                </span>
              </div>
              <p className="text-xs text-slate-600 font-sans">
                Co-located tasks from Engineering, S&T, and Traction share a single protected shadow window verified against train movements.
              </p>
            </div>

            {/* Single Consolidated Possession Card */}
            <div className="p-4 bg-white rounded-lg border border-blue-200 space-y-3 font-mono text-xs shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <div className="font-bold text-blue-900 text-sm">Integrated Block B-014 (KM 68–94)</div>
                <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded text-[11px]">
                  02:20–04:10 IST
                </span>
              </div>

              <div className="space-y-1.5 text-[11px] text-slate-700">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  <span>3 Engineering Tasks: Tamping, USFD Testing, Joint Packing</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-sky-500" />
                  <span>2 S&T Tasks: Digital Axle Counter Overhaul & Point Machine</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>2 Traction Tasks: 25kV OHE Cantilever & Insulator Isolation</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex justify-between text-[11px] font-bold text-blue-950">
                <span>Machinery: CTM-04 + Tower Wagon</span>
                <span>Crew: 47 Consolidated</span>
              </div>
            </div>

            {/* Optimized Metrics */}
            <div className="pt-3 border-t border-blue-100 grid grid-cols-3 gap-2 text-center font-mono text-xs">
              <div className="p-2 rounded bg-white border border-blue-100">
                <div className="text-[10px] text-slate-500">Possessions</div>
                <div className="font-bold text-emerald-700 text-sm">1 Unified (-67%)</div>
              </div>
              <div className="p-2 rounded bg-white border border-blue-100">
                <div className="text-[10px] text-slate-500">Work Efficiency</div>
                <div className="font-bold text-emerald-700 text-sm">0.82 / min (+41%)</div>
              </div>
              <div className="p-2 rounded bg-white border border-blue-100">
                <div className="text-[10px] text-slate-500">Train Conflicts</div>
                <div className="font-bold text-emerald-700 text-sm">0 (Cleared)</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Provenance Tag Footer */}
      <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-[11px] font-mono text-slate-500">
        <span>Prototype scenario • Synthetic / CAG-calibrated data (SEC–NDL Double Line)</span>
        <span className="text-slate-700 font-semibold">70 Min Corridor Capacity Returned to Operations</span>
      </div>
    </div>
  );
}
