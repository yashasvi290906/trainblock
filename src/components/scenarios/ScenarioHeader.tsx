"use client";

import React from "react";
import { Sliders, ShieldCheck, FileCheck, Layers, GitCompare } from "lucide-react";
import { BASELINE_PLAN } from "./scenarioData";

interface ScenarioHeaderProps {
  activeConditionLabel: string;
  hasExecuted: boolean;
  onOpenSnapshots: () => void;
  snapshotCount: number;
}

export function ScenarioHeader({
  activeConditionLabel,
  hasExecuted,
  onOpenSnapshots,
  snapshotCount,
}: ScenarioHeaderProps) {
  return (
    <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 py-3 sm:px-6 shadow-xs">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        {/* Left: Title & Concept */}
        <div className="space-y-1">
          <div className="flex items-center gap-2.5 flex-wrap">
            <div className="p-1.5 rounded-md bg-blue-50 dark:bg-blue-600/20 border border-blue-200 dark:border-blue-500/30 text-blue-600 dark:text-blue-400">
              <Sliders className="w-4 h-4" />
            </div>
            <h1 className="text-lg sm:text-xl font-bold font-mono tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
              SCENARIO LAB
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-sans font-normal">
                What-If Analysis
              </span>
            </h1>
            <span className="text-xs text-slate-300 dark:text-slate-600 hidden sm:inline">|</span>
            <span className="text-xs font-mono text-amber-700 dark:text-amber-400 font-semibold bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded border border-amber-300 dark:border-amber-800/40">
              Active: {activeConditionLabel}
            </span>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-sans">
            <span className="text-blue-600 dark:text-blue-400 font-medium">“Test the maintenance plan before committing the block.”</span>{" "}
            <span className="text-slate-500 dark:text-slate-400 hidden md:inline">
              — Model operational changes, compare consequences and review alternate possession windows.
            </span>
          </p>
        </div>

        {/* Right: Base Plan Meta & Badges */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap justify-between lg:justify-end text-xs font-mono">
          <button
            onClick={onOpenSnapshots}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 transition-colors shadow-xs"
          >
            <GitCompare className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>Snapshots ({snapshotCount})</span>
          </button>

          <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-950/80 px-3 py-1.5 rounded-md border border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>BASE:</span>
              <span className="text-slate-900 dark:text-white font-bold">{BASELINE_PLAN.blockId}</span>
            </div>
            <span className="text-slate-300 dark:text-slate-600">·</span>
            <span className="text-slate-700 dark:text-slate-300">{BASELINE_PLAN.corridor}</span>
            <span className="text-slate-300 dark:text-slate-600">·</span>
            <span className="text-slate-500 dark:text-slate-400">{BASELINE_PLAN.date}</span>
          </div>

          <div className="px-2 py-1 rounded bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800/40 text-blue-700 dark:text-blue-300 text-[11px] font-mono tracking-wider font-semibold">
            SYNTHETIC DATA
          </div>
        </div>
      </div>
    </div>
  );
}
