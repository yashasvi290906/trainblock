"use client";

import React from "react";
import { SplitSquareVertical, ArrowRight, CheckCircle2, Wrench, Radio, Zap, Layers } from "lucide-react";
import { cn } from "@/lib/utils";

export function DemandTransformationCard() {
  return (
    <div className="bg-white rounded-xl border border-slate-200/90 p-4 sm:p-5 shadow-2xs space-y-3 font-sans">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-900 flex items-center justify-center font-bold">
            <SplitSquareVertical className="w-3.5 h-3.5" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-slate-900 font-mono tracking-tight uppercase">
              MAINTENANCE INTEGRATION PIPELINE
            </h3>
            <p className="text-[11px] text-slate-500">
              Separate maintenance demands become candidates for coordinated possession planning
            </p>
          </div>
        </div>

        <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10.5px] font-mono font-bold">
          3 Siloed Slots → 1 Possession
        </span>
      </div>

      {/* Side-by-Side Flow Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
        {/* Left 5 cols: Siloed Demands */}
        <div className="md:col-span-5 p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
          <div className="flex items-center justify-between text-[11px] font-mono font-bold text-slate-600 uppercase">
            <span>Current Siloed Demand</span>
            <span className="text-amber-800">3 Blockades</span>
          </div>

          <div className="space-y-1.5 font-mono text-[11px]">
            <div className="p-1.5 rounded bg-white border border-slate-200 flex items-center justify-between shadow-2xs">
              <span className="flex items-center gap-1.5 text-slate-800 font-semibold">
                <Wrench className="w-3 h-3 text-amber-600" />
                <span>ENG · B-011</span>
              </span>
              <span className="text-slate-500">50 min (KM 70–84)</span>
            </div>

            <div className="p-1.5 rounded bg-white border border-slate-200 flex items-center justify-between shadow-2xs">
              <span className="flex items-center gap-1.5 text-slate-800 font-semibold">
                <Radio className="w-3 h-3 text-sky-600" />
                <span>S&T · B-012</span>
              </span>
              <span className="text-slate-500">40 min (KM 72–92)</span>
            </div>

            <div className="p-1.5 rounded bg-white border border-slate-200 flex items-center justify-between shadow-2xs">
              <span className="flex items-center gap-1.5 text-slate-800 font-semibold">
                <Zap className="w-3 h-3 text-purple-600" />
                <span>TRD · B-013</span>
              </span>
              <span className="text-slate-500">45 min (KM 72–90)</span>
            </div>
          </div>
        </div>

        {/* Center 2 cols: Flow Arrow */}
        <div className="md:col-span-2 flex flex-col items-center justify-center py-1 md:py-0">
          <div className="w-8 h-8 rounded-full bg-blue-900 text-white flex items-center justify-center shadow-xs">
            <ArrowRight className="w-4 h-4 hidden md:block" />
            <span className="md:hidden text-xs">↓</span>
          </div>
          <span className="text-[10px] font-mono font-bold text-blue-900 uppercase mt-1 text-center">
            COORDINATE
          </span>
        </div>

        {/* Right 5 cols: Coordinated Possession */}
        <div className="md:col-span-5 p-3 rounded-lg bg-emerald-50/50 border border-emerald-300/80 space-y-2">
          <div className="flex items-center justify-between text-[11px] font-mono font-bold text-emerald-950 uppercase">
            <span>RAILBLOCK Coordination</span>
            <span className="text-emerald-800">1 Integrated Slot</span>
          </div>

          <div className="p-2 rounded bg-white border border-emerald-200 shadow-2xs space-y-1.5 font-mono text-[11px]">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-blue-900">Block B-014</span>
              <span className="text-emerald-700 font-bold">02:20–04:10 (110m)</span>
            </div>
            <div className="text-[10.5px] text-slate-600 font-sans">
              KM 68–94 · 3 Departments synchronized
            </div>
            <div className="flex items-center gap-1 text-[10px] text-emerald-800 font-sans pt-0.5 border-t border-slate-100">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              <span>Single 25kV OHE isolation & timetable-protected path</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
