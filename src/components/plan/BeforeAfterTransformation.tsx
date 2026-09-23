"use client";

import React from "react";
import {
  Layers,
  ArrowRight,
  TrendingDown,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Wrench,
  Radio,
  Zap,
  SplitSquareVertical,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface BeforeAfterTransformationProps {
  siloedPossessionCount?: number;
  siloedTotalMinutes?: number;
  integratedMinutes?: number;
  usableMinutes?: number;
  reductionPercentage?: number;
}

export function BeforeAfterTransformation({
  siloedPossessionCount = 3,
  siloedTotalMinutes = 135,
  integratedMinutes = 110,
  usableMinutes = 90,
  reductionPercentage = 67,
}: BeforeAfterTransformationProps) {
  return (
    <div className="bg-white rounded-xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-4">
      {/* Section Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-900 flex items-center justify-center font-bold">
            <SplitSquareVertical className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">
              PLANNING IMPROVEMENT · BEFORE → AFTER
            </h3>
            <p className="text-xs text-slate-500">
              Possession consolidation transformation for Secunderabad Division
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-mono font-bold flex items-center gap-1.5">
            <TrendingDown className="w-3.5 h-3.5 text-emerald-600" />
            <span>{reductionPercentage}% FEWER POSSESSIONS</span>
          </span>
        </div>
      </div>

      {/* Main Side-by-Side Flow Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
        {/* Left 5 Cols: BEFORE — Siloed Possessions */}
        <div className="lg:col-span-5 bg-slate-50/80 rounded-xl p-4 border border-slate-200/90 flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <span className="text-xs font-mono font-extrabold uppercase text-slate-700 tracking-wide flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                <span>BEFORE · Siloed Planning</span>
              </span>
              <span className="text-[11px] font-mono text-amber-900 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded font-bold">
                {siloedPossessionCount} Separate Possessions
              </span>
            </div>

            {/* 3 Siloed Possession Bars */}
            <div className="space-y-2 mt-3 font-mono text-xs">
              {/* Possession 1: Engineering */}
              <div className="p-2.5 rounded-lg bg-white border border-slate-200 shadow-2xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800 flex items-center gap-1.5">
                    <Wrench className="w-3 h-3 text-amber-600" />
                    <span>B-011 · Engineering</span>
                  </span>
                  <span className="text-slate-600 font-semibold">22:00–22:50</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span>KM 70–84 · Track Tamping</span>
                  <span className="text-amber-800 font-bold">50 min</span>
                </div>
              </div>

              {/* Plus symbol */}
              <div className="text-center text-slate-400 font-bold text-xs leading-none">+</div>

              {/* Possession 2: S&T */}
              <div className="p-2.5 rounded-lg bg-white border border-slate-200 shadow-2xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800 flex items-center gap-1.5">
                    <Radio className="w-3 h-3 text-sky-600" />
                    <span>B-012 · S&T</span>
                  </span>
                  <span className="text-slate-600 font-semibold">23:00–23:40</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span>KM 72–92 · Circuit Tuning</span>
                  <span className="text-sky-800 font-bold">40 min</span>
                </div>
              </div>

              {/* Plus symbol */}
              <div className="text-center text-slate-400 font-bold text-xs leading-none">+</div>

              {/* Possession 3: Traction */}
              <div className="p-2.5 rounded-lg bg-white border border-slate-200 shadow-2xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800 flex items-center gap-1.5">
                    <Zap className="w-3 h-3 text-purple-600" />
                    <span>B-013 · Traction</span>
                  </span>
                  <span className="text-slate-600 font-semibold">00:00–00:45</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span>KM 72–90 · OHE Isolator</span>
                  <span className="text-purple-800 font-bold">45 min</span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs font-mono text-slate-600">
            <span>Total Corridor Blockade:</span>
            <strong className="text-slate-900 font-bold">{siloedTotalMinutes} min across 3 slots</strong>
          </div>
        </div>

        {/* Center 2 Cols: Transformation Bridge Flow Arrow */}
        <div className="lg:col-span-2 flex flex-col items-center justify-center py-2 lg:py-0">
          <div className="w-full flex lg:flex-col items-center justify-center gap-2">
            <div className="h-0.5 w-8 lg:w-0.5 lg:h-12 bg-slate-300" />
            <div className="w-10 h-10 rounded-full bg-blue-900 text-white flex items-center justify-center font-mono font-bold shadow-md text-xs">
              <ArrowRight className="w-5 h-5 hidden lg:block" />
              <span className="lg:hidden">↓</span>
            </div>
            <div className="h-0.5 w-8 lg:w-0.5 lg:h-12 bg-slate-300" />
          </div>
          <span className="text-[11px] font-mono font-bold text-blue-900 uppercase tracking-tight mt-1 text-center">
            RAILBLOCK INTEGRATION
          </span>
        </div>

        {/* Right 5 Cols: AFTER — 1 Coordinated Possession */}
        <div className="lg:col-span-5 bg-emerald-50/40 rounded-xl p-4 border border-emerald-300/80 flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-emerald-200">
              <span className="text-xs font-mono font-extrabold uppercase text-emerald-900 tracking-wide flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>AFTER · Coordinated Integration</span>
              </span>
              <span className="text-[11px] font-mono text-emerald-900 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded font-bold">
                1 Integrated Possession
              </span>
            </div>

            {/* 1 Consolidated Block Card */}
            <div className="mt-3 p-4 rounded-xl bg-white border border-emerald-200 shadow-sm space-y-3 font-mono">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-lg font-extrabold text-slate-900">Block B-014</div>
                  <div className="text-xs text-slate-600 font-sans font-medium">
                    Engineering + S&T + Traction
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-emerald-800">02:20 – 04:10</div>
                  <div className="text-[11px] text-slate-500">110 min total slot</div>
                </div>
              </div>

              {/* Multi-departmental tags in block */}
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs space-y-1 font-sans">
                <div className="flex items-center justify-between text-slate-700 font-mono text-[11px]">
                  <span>Work Location:</span>
                  <strong className="text-slate-900">KM 68–94 (WL – NDKD)</strong>
                </div>
                <div className="flex items-center justify-between text-slate-700 font-mono text-[11px]">
                  <span>Usable Work Time:</span>
                  <strong className="text-emerald-700">{usableMinutes} min (82% track utilization)</strong>
                </div>
                <div className="flex items-center justify-between text-slate-700 font-mono text-[11px]">
                  <span>Machine / Crew Overhead:</span>
                  <span className="text-slate-500">20 min (Earthing & Safety margin)</span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs text-emerald-800 font-sans font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Single 25kV OHE isolation & single station interlocking blockade</span>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-emerald-200 flex items-center justify-between text-xs font-mono text-emerald-900 font-bold">
            <span>Result:</span>
            <span>67% fewer possessions · 0 train clashes</span>
          </div>
        </div>
      </div>
    </div>
  );
}
