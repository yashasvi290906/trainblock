"use client";

import React from "react";
import { Check, X, Shield, AlertTriangle, Clock, Wrench } from "lucide-react";
import { cn } from "@/lib/utils";

interface BlockConstraintsPanelProps {
  workDurationMin: number;
  possessionDurationMin: number;
  passengerConflictCount: number;
  goodsForecastChecked: boolean;
  departments: string[];
}

export function BlockConstraintsPanel({
  workDurationMin,
  possessionDurationMin,
  passengerConflictCount,
  goodsForecastChecked,
  departments,
}: BlockConstraintsPanelProps) {
  const durationSatisfied = possessionDurationMin >= 90;
  const passengerProtected = passengerConflictCount === 0;

  return (
    <div className="bg-white dark:bg-[#091326] border border-slate-200 dark:border-[#162744] rounded-xl p-4 space-y-3 select-none transition-colors">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-[#182a4d]">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-sky-600 dark:text-sky-400" />
          <h3 className="text-xs font-mono font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            BLOCK CONSTRAINTS
          </h3>
        </div>
        <span
          className={cn(
            "text-[10px] font-mono font-bold px-2 py-0.5 rounded border",
            passengerProtected
              ? "bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800/60"
              : "bg-rose-100 dark:bg-red-950/80 text-rose-800 dark:text-red-300 border-rose-300 dark:border-red-800/60"
          )}
        >
          {passengerProtected ? "ALL CONSTRAINTS MET" : "CONSTRAINT VIOLATION"}
        </span>
      </div>

      {/* Constraints Parameters List */}
      <div className="space-y-1.5 font-mono text-xs">
        <div className="flex justify-between py-1 px-2 rounded bg-slate-50 dark:bg-[#060c18] border border-slate-200 dark:border-[#122038]">
          <span className="text-slate-500 dark:text-slate-400">WORK DURATION</span>
          <span className="text-slate-900 dark:text-white font-bold">{workDurationMin} min</span>
        </div>
        <div className="flex justify-between py-1 px-2 rounded bg-slate-50 dark:bg-[#060c18] border border-slate-200 dark:border-[#122038]">
          <span className="text-slate-500 dark:text-slate-400">POSSESSION</span>
          <span className="text-amber-700 dark:text-amber-300 font-bold">{possessionDurationMin} min</span>
        </div>
        <div className="flex justify-between py-1 px-2 rounded bg-slate-50 dark:bg-[#060c18] border border-slate-200 dark:border-[#122038]">
          <span className="text-slate-500 dark:text-slate-400">PASSENGER PROTECTION</span>
          <span className="text-sky-700 dark:text-sky-300 font-bold">Required</span>
        </div>
        <div className="flex justify-between py-1 px-2 rounded bg-slate-50 dark:bg-[#060c18] border border-slate-200 dark:border-[#122038]">
          <span className="text-slate-500 dark:text-slate-400">GOODS FORECAST</span>
          <span className="text-purple-700 dark:text-purple-300 font-bold">Included</span>
        </div>
        <div className="flex justify-between py-1 px-2 rounded bg-slate-50 dark:bg-[#060c18] border border-slate-200 dark:border-[#122038]">
          <span className="text-slate-500 dark:text-slate-400">SAFETY BUFFER</span>
          <span className="text-slate-800 dark:text-slate-200 font-bold">10 min</span>
        </div>
        <div className="flex justify-between py-1 px-2 rounded bg-slate-50 dark:bg-[#060c18] border border-slate-200 dark:border-[#122038]">
          <span className="text-slate-500 dark:text-slate-400">DEPARTMENTS</span>
          <span className="text-slate-900 dark:text-white font-bold">{departments.join(" · ")}</span>
        </div>
      </div>

      {/* Status Checklist */}
      <div className="pt-2 border-t border-slate-200 dark:border-[#182a4d] space-y-1.5 font-mono text-[11px]">
        <div className="flex items-center gap-2">
          {durationSatisfied ? (
            <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
          ) : (
            <X className="w-3.5 h-3.5 text-rose-600 dark:text-red-400 flex-shrink-0" />
          )}
          <span className={durationSatisfied ? "text-slate-700 dark:text-slate-300" : "text-rose-700 dark:text-red-300 font-semibold"}>
            {durationSatisfied ? "Duration satisfied (≥ 90 min)" : "Duration below threshold"}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {passengerProtected ? (
            <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
          ) : (
            <X className="w-3.5 h-3.5 text-rose-600 dark:text-red-400 flex-shrink-0" />
          )}
          <span className={passengerProtected ? "text-slate-700 dark:text-slate-300" : "text-rose-700 dark:text-red-300 font-semibold"}>
            {passengerProtected
              ? "Passenger paths protected"
              : "Passenger path intersects possession"}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {goodsForecastChecked ? (
            <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
          ) : (
            <X className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 flex-shrink-0" />
          )}
          <span className="text-slate-700 dark:text-slate-300">Goods forecast checked</span>
        </div>

        <div className="flex items-center gap-2">
          <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
          <span className="text-slate-700 dark:text-slate-300">Corridor available (Double Line)</span>
        </div>
      </div>
    </div>
  );
}
