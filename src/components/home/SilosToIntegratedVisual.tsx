"use client";

import React, { useState } from "react";
import { ArrowRight, CheckCircle2, TrendingDown, Wrench, Radio, Zap, SplitSquareVertical } from "lucide-react";
import { cn } from "@/lib/utils";

export function SilosToIntegratedVisual() {
  const [activeTab, setActiveTab] = useState<"TRANSFORMATION" | "BEFORE" | "AFTER">("TRANSFORMATION");

  return (
    <div className="w-full bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
      {/* Section Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="max-w-2xl space-y-1.5">
          <span className="text-xs font-mono uppercase tracking-wider text-emerald-900 font-bold bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
            THE TRANSFORMATION
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            From departmental silos to one coordinated possession.
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            Instead of granting 3 separate possessions totaling 135 minutes of corridor blockade, RAILBLOCK finds a single 110-minute slot where all three teams work concurrently.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-lg bg-emerald-100 text-emerald-900 border border-emerald-300 font-mono text-xs font-extrabold flex items-center gap-1.5">
            <TrendingDown className="w-4 h-4 text-emerald-700" />
            <span>67% FEWER POSSESSIONS</span>
          </span>
        </div>
      </div>

      {/* Side-by-Side Consolidation Visualization */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch pt-2">
        {/* Left 5 Cols: BEFORE — 3 Siloed Blocks */}
        <div className="lg:col-span-5 p-5 rounded-xl bg-slate-50 border border-amber-200/90 space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <span className="text-xs font-mono font-bold text-amber-900 uppercase">
                BEFORE: 3 Siloed Possessions
              </span>
              <span className="text-[10px] font-mono font-bold text-red-700 bg-red-50 border border-red-200 px-2 py-0.5 rounded">
                135 min Total Blockade
              </span>
            </div>

            <div className="space-y-2.5 mt-3 font-mono text-xs">
              <div className="p-3 bg-white rounded-lg border border-slate-200 shadow-2xs space-y-1">
                <div className="flex justify-between font-bold text-slate-900">
                  <span className="text-amber-800 flex items-center gap-1.5">
                    <Wrench className="w-3.5 h-3.5 text-amber-600" />
                    <span>B-011 · Engineering</span>
                  </span>
                  <span>22:00–22:50 (50m)</span>
                </div>
                <div className="text-[11px] text-slate-500 font-sans">
                  Plain Track Tamping & USFD Inspection (KM 70–84)
                </div>
              </div>

              <div className="p-3 bg-white rounded-lg border border-slate-200 shadow-2xs space-y-1">
                <div className="flex justify-between font-bold text-slate-900">
                  <span className="text-sky-800 flex items-center gap-1.5">
                    <Radio className="w-3.5 h-3.5 text-sky-600" />
                    <span>B-012 · S&T</span>
                  </span>
                  <span>23:00–23:40 (40m)</span>
                </div>
                <div className="text-[11px] text-slate-500 font-sans">
                  Track Circuit & Digital Axle Counter Overhaul (KM 72–92)
                </div>
              </div>

              <div className="p-3 bg-white rounded-lg border border-slate-200 shadow-2xs space-y-1">
                <div className="flex justify-between font-bold text-slate-900">
                  <span className="text-purple-800 flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-purple-600" />
                    <span>B-013 · Traction</span>
                  </span>
                  <span>00:00–00:45 (45m)</span>
                </div>
                <div className="text-[11px] text-slate-500 font-sans">
                  25kV OHE Cantilever Re-crimping & Isolator Servicing (KM 72–90)
                </div>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-200 text-xs font-mono text-slate-600 flex justify-between">
            <span>Possession Setup Overhead:</span>
            <strong className="text-red-700">3 separate track occupations</strong>
          </div>
        </div>

        {/* Center 2 Cols: Arrow Bridge */}
        <div className="lg:col-span-2 flex flex-col items-center justify-center py-4 lg:py-0">
          <div className="w-12 h-12 rounded-full bg-blue-900 text-white flex items-center justify-center font-bold text-sm shadow-md">
            <ArrowRight className="w-6 h-6 hidden lg:block" />
            <span className="lg:hidden text-base">↓</span>
          </div>
          <span className="text-[11px] font-mono font-bold text-blue-900 uppercase tracking-tight mt-2 text-center">
            CONVERGED BY RAILBLOCK
          </span>
        </div>

        {/* Right 5 Cols: AFTER — 1 Consolidated Possession */}
        <div className="lg:col-span-5 p-5 rounded-xl bg-emerald-50/50 border border-emerald-300 space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-emerald-200">
              <span className="text-xs font-mono font-bold text-emerald-900 uppercase">
                AFTER: 1 Integrated Possession
              </span>
              <span className="text-[10px] font-mono font-bold text-emerald-800 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded">
                110 min Block · 90m Usable
              </span>
            </div>

            <div className="mt-3 p-4 rounded-xl bg-white border border-emerald-200 shadow-sm space-y-3 font-mono">
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-lg font-extrabold text-slate-900">Block B-014</div>
                  <div className="text-xs text-slate-600 font-sans font-medium">
                    Engineering + S&T + Traction Concurrent Execution
                  </div>
                </div>
                <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
                  02:20 – 04:10
                </span>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs font-sans space-y-1">
                <div className="flex justify-between text-slate-700 font-mono text-[11px]">
                  <span>Corridor Sector:</span>
                  <strong className="text-slate-900">KM 68–94 (WL – NDKD)</strong>
                </div>
                <div className="flex justify-between text-slate-700 font-mono text-[11px]">
                  <span>Track Utilization:</span>
                  <strong className="text-emerald-700">82% Productive Work (90 min)</strong>
                </div>
                <div className="flex justify-between text-slate-700 font-mono text-[11px]">
                  <span>Protected Movements:</span>
                  <strong className="text-blue-900">4 Passenger Trains Safeguarded</strong>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs text-emerald-800 font-sans font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>One OHE power cut · One station interlocking reservation</span>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-emerald-200 text-xs font-mono text-emerald-900 font-bold flex justify-between">
            <span>Outcome:</span>
            <span>Single window · 0 passenger train delay</span>
          </div>
        </div>
      </div>
    </div>
  );
}
