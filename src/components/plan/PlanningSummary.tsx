"use client";

import React from "react";
import { Sparkles, ArrowRight, ShieldCheck, Clock, MapPin, Layers } from "lucide-react";
import { cn } from "@/lib/utils";

interface PlanningSummaryProps {
  totalTasks: number;
  criticalTasks: number;
  highPriorityTasks: number;
  proposedBlockId: string;
  kmRange: string;
  timeWindow: string;
  hasPlanGenerated: boolean;
  onGenerateClick?: () => void;
}

export function PlanningSummary({
  totalTasks = 18,
  criticalTasks = 3,
  highPriorityTasks = 7,
  proposedBlockId = "B-014",
  kmRange = "KM 68–94 (WL – NDKD)",
  timeWindow = "02:20–04:10",
  hasPlanGenerated = true,
  onGenerateClick,
}: PlanningSummaryProps) {
  return (
    <div className="w-full bg-linear-to-r from-blue-950 via-slate-900 to-slate-900 text-white border border-slate-800/80 rounded-xl p-4 sm:p-5 shadow-sm">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Left: Operational Synthesis Sentence */}
        <div className="space-y-1.5 max-w-3xl">
          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-bold border border-blue-400/30 uppercase tracking-wider">
              Today&apos;s Integrated Plan
            </span>
            <span className="text-slate-400">·</span>
            <span className="text-slate-300 font-medium">21 September 2026</span>
          </div>

          <p className="text-sm sm:text-base text-slate-100 font-medium leading-relaxed">
            Evaluated <strong className="text-white font-mono font-bold">{totalTasks} work orders</strong> (
            <span className="text-rose-300 font-bold">{criticalTasks} critical</span>,{" "}
            <span className="text-amber-300 font-bold">{highPriorityTasks} high priority</span>). System grouped{" "}
            <strong className="text-blue-300">3 compatible departmental requests</strong> into{" "}
            <strong className="text-emerald-300">1 coordinated possession</strong> without disrupting passenger services.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-slate-300 font-mono">
            <div className="flex items-center gap-1.5 bg-slate-800/80 px-2.5 py-1 rounded-md border border-slate-700">
              <Layers className="w-3.5 h-3.5 text-blue-400" />
              <span>Recommended Block: <strong className="text-white font-bold">{proposedBlockId}</strong></span>
            </div>
            <div className="flex items-center gap-1.5 bg-slate-800/80 px-2.5 py-1 rounded-md border border-slate-700">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              <span>{kmRange}</span>
            </div>
            <div className="flex items-center gap-1.5 bg-slate-800/80 px-2.5 py-1 rounded-md border border-slate-700">
              <Clock className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-300 font-bold">{timeWindow}</span>
              <span className="text-slate-400">(110 min)</span>
            </div>
          </div>
        </div>

        {/* Right: Quick Operational Recommendation Tag & Regenerate CTA */}
        <div className="flex items-center gap-3 shrink-0 self-start lg:self-center border-t lg:border-t-0 lg:border-l border-slate-800 pt-3 lg:pt-0 lg:pl-5">
          <div className="text-right hidden sm:block">
            <div className="text-xs text-slate-400 font-mono uppercase">Recommendation State</div>
            <div className="text-sm font-bold text-emerald-400 font-mono flex items-center gap-1.5 justify-end">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Ready for Review</span>
            </div>
          </div>

          <button
            onClick={onGenerateClick}
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs font-mono transition-all flex items-center gap-2 shadow-md shadow-blue-950 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Rebuild Plan</span>
          </button>
        </div>
      </div>
    </div>
  );
}
