"use client";

import React from "react";
import {
  ScenarioCondition,
  ScenarioState,
  FallbackWindow,
  CriticalWorkInput,
} from "./types";
import { BASELINE_PLAN } from "./scenarioData";
import { GitCompare, ArrowRight, Check, AlertCircle, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface ScenarioComparisonProps {
  condition: ScenarioCondition;
  scenarioState: ScenarioState;
  selectedWindow: FallbackWindow;
  criticalWork: CriticalWorkInput;
  durationOffsetMin: number;
}

export function ScenarioComparison({
  condition,
  scenarioState,
  selectedWindow,
  criticalWork,
  durationOffsetMin,
}: ScenarioComparisonProps) {
  const isReplanned = scenarioState === "REPLANNED";
  const isDenied = condition === "BLOCK_DENIAL" && scenarioState !== "IDLE" && !isReplanned;

  // Scenario values based on state
  const scenarioWindow = isReplanned
    ? `${selectedWindow.startTime}–${selectedWindow.endTime}`
    : isDenied
    ? "UNAVAILABLE (Denied)"
    : condition === "BLOCK_DURATION"
    ? `02:20–04:${10 + durationOffsetMin >= 60 ? "40" : "10"}`
    : "02:20–04:10";

  const scenarioDuration = isReplanned
    ? `${selectedWindow.durationMin} min`
    : condition === "BLOCK_DURATION"
    ? `${110 + durationOffsetMin} min`
    : "110 min";

  const scenarioWorkTime = isReplanned
    ? `${selectedWindow.usableWorkMin} min`
    : isDenied
    ? "0 min"
    : condition === "BLOCK_DURATION"
    ? `${90 + durationOffsetMin} min`
    : "90 min";

  const scenarioP1 = condition === "ADD_CRITICAL_WORK" ? 4 : isReplanned ? selectedWindow.p1Retained : 3;
  const scenarioP2 = isReplanned ? selectedWindow.p2Retained : 7;
  const scenarioPassengerConflicts = isReplanned ? selectedWindow.passengerConflicts : condition === "TRAIN_MOVEMENT" && scenarioState === "CONFLICT_DETECTED" ? 1 : 1;
  const scenarioGoods = "1 (Forecast)";
  const scenarioDepts = "3 (ENG, S&T, TRD)";
  const scenarioWorkRetained = condition === "ADD_CRITICAL_WORK" ? "19/19" : isReplanned ? `${selectedWindow.workOrdersRetained}/18` : "18/18";

  const comparisonRows = [
    {
      factor: "Block Window",
      baseline: "02:20–04:10",
      scenario: scenarioWindow,
      changed: scenarioWindow !== "02:20–04:10",
      isPositive: isReplanned,
    },
    {
      factor: "Total Duration",
      baseline: "110 min",
      scenario: scenarioDuration,
      changed: scenarioDuration !== "110 min",
      isPositive: true,
    },
    {
      factor: "Usable Work Time",
      baseline: "90 min",
      scenario: scenarioWorkTime,
      changed: scenarioWorkTime !== "90 min",
      isPositive: !isDenied,
    },
    {
      factor: "P1 Critical Work",
      baseline: "3 Orders",
      scenario: `${scenarioP1} Orders`,
      changed: scenarioP1 !== 3,
      isPositive: true,
    },
    {
      factor: "P2 High Urgency",
      baseline: "7 Orders",
      scenario: `${scenarioP2} Orders`,
      changed: scenarioP2 !== 7,
      isPositive: scenarioP2 === 7,
    },
    {
      factor: "Passenger Conflicts",
      baseline: "1 Conflict (VB-20612)",
      scenario: `${scenarioPassengerConflicts} Conflict${scenarioPassengerConflicts === 1 ? "" : "s"}`,
      changed: scenarioPassengerConflicts !== 1,
      isPositive: scenarioPassengerConflicts === 0,
    },
    {
      factor: "Goods Forecast Interactions",
      baseline: "1 Accommodated",
      scenario: scenarioGoods,
      changed: false,
      isPositive: true,
    },
    {
      factor: "Departments Co-located",
      baseline: "3 (ENG, S&T, TRD)",
      scenario: scenarioDepts,
      changed: false,
      isPositive: true,
    },
    {
      factor: "Work Orders Retained",
      baseline: "18 / 18 (100%)",
      scenario: `${scenarioWorkRetained} (${Math.round((parseInt(scenarioWorkRetained) / 18) * 100)}%)`,
      changed: scenarioWorkRetained !== "18/18",
      isPositive: scenarioWorkRetained.startsWith("18") || scenarioWorkRetained.startsWith("19"),
    },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 space-y-3 font-mono shadow-xs">
      {/* Header & Change Badges */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <GitCompare className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            PLAN COMPARISON: BASELINE vs SCENARIO
          </h3>
        </div>

        {/* Change Indicators */}
        <div className="flex items-center gap-2 text-[10px] flex-wrap">
          {isReplanned && (
            <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700/50 font-bold flex items-center gap-1">
              <span>WINDOW: 02:20–04:10</span>
              <ArrowRight className="w-3 h-3" />
              <span>{selectedWindow.startTime}–{selectedWindow.endTime}</span>
            </span>
          )}
          {isReplanned && (
            <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700/50 font-bold flex items-center gap-1">
              <span>PASSENGER CONFLICT: 1</span>
              <ArrowRight className="w-3 h-3" />
              <span>{selectedWindow.passengerConflicts}</span>
            </span>
          )}
        </div>
      </div>

      {/* Comparison Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs text-left">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 text-[10px] text-slate-500 dark:text-slate-400 uppercase">
              <th className="py-2 px-3">Operational Factor</th>
              <th className="py-2 px-3">Baseline Plan (B-014)</th>
              <th className="py-2 px-3">Scenario Plan ({isReplanned ? selectedWindow.code : condition})</th>
              <th className="py-2 px-3 text-right">Delta / Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-mono text-[11px]">
            {comparisonRows.map((row, idx) => (
              <tr
                key={idx}
                className={cn(
                  "hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors",
                  row.changed ? "bg-blue-50/50 dark:bg-blue-950/20" : ""
                )}
              >
                <td className="py-2 px-3 text-slate-800 dark:text-slate-300 font-medium">{row.factor}</td>
                <td className="py-2 px-3 text-slate-500 dark:text-slate-400">{row.baseline}</td>
                <td className="py-2 px-3">
                  <span
                    className={cn(
                      "font-semibold",
                      row.changed
                        ? row.isPositive
                          ? "text-emerald-600 dark:text-emerald-400"
                          : "text-amber-600 dark:text-amber-400"
                        : "text-slate-900 dark:text-white"
                    )}
                  >
                    {row.scenario}
                  </span>
                </td>
                <td className="py-2 px-3 text-right">
                  {row.changed ? (
                    <span
                      className={cn(
                        "px-1.5 py-0.5 rounded text-[9px] font-bold",
                        row.isPositive
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800/60"
                          : "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-300 dark:border-amber-800/60"
                      )}
                    >
                      MODIFIED
                    </span>
                  ) : (
                    <span className="text-slate-400 dark:text-slate-600 text-[10px]">UNCHANGED</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
