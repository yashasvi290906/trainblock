"use client";

import React, { useState } from "react";
import { AppShell } from "@/components/shell/AppShell";
import { usePlanningRun } from "@/context/PlanningRunContext";
import { PlanningEngineOffline } from "@/components/common/PlanningEngineOffline";
import { PlanningLoading } from "@/components/common/PlanningLoading";
import { cn } from "@/lib/utils";
import {
  Calendar,
  RefreshCcw,
  ChevronRight,
  Clock,
  TrainTrack,
  Layers,
} from "lucide-react";

const HORIZON_TABS = [
  { id: "7D", label: "7-Day", weeks: 1 },
  { id: "1M", label: "Monthly (4W)", weeks: 4 },
  { id: "26W", label: "26-Week Rolling", weeks: 26 },
] as const;

type HorizonId = (typeof HORIZON_TABS)[number]["id"];

export default function RollingPlanPage() {
  const { currentRun, loading, error, isBackend, refresh, resetDemo, replan } =
    usePlanningRun();
  const [horizon, setHorizon] = useState<HorizonId>("1M");

  const isOffline = !loading && (!isBackend || !!error);
  const monthlyPlan = currentRun?.monthly_plan ?? [];

  // Group reservations by section × week
  const sections = Array.from(
    new Set(monthlyPlan.map((r) => r.corridor_section_id))
  );

  // For 26W horizon, generate synthetic forward weeks beyond the 4 real weeks
  const targetWeeks =
    horizon === "7D" ? 1 : horizon === "1M" ? 4 : 26;

  const weekNumbers = Array.from({ length: targetWeeks }, (_, i) => i + 1);

  function getCellData(sectionId: string, week: number) {
    // Use real data for weeks 1–4, synthetic extrapolation beyond
    if (week <= 4) {
      const entries = monthlyPlan.filter(
        (r) => r.corridor_section_id === sectionId && r.week_number === week
      );
      const reserved = entries.filter((r) => r.is_reserved);
      return {
        real: true,
        reservedDays: reserved.length,
        totalDays: entries.length,
        plannedHours: reserved.reduce((a, r) => a + r.planned_block_hours, 0),
      };
    }
    // Synthetic extrapolation: mirror W1–W4 pattern cyclically
    const mirrorWeek = ((week - 1) % 4) + 1;
    const entries = monthlyPlan.filter(
      (r) =>
        r.corridor_section_id === sectionId && r.week_number === mirrorWeek
    );
    const reserved = entries.filter((r) => r.is_reserved);
    return {
      real: false,
      reservedDays: reserved.length,
      totalDays: entries.length,
      plannedHours: reserved.reduce((a, r) => a + r.planned_block_hours, 0),
    };
  }

  return (
    <AppShell>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-5">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-white/10">
          <div>
            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs font-mono uppercase tracking-wider">
              <span>Railway Operations Control</span>
              <span>/</span>
              <span className="text-blue-700 dark:text-blue-400 font-semibold">
                Rolling Plan
              </span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight mt-1">
              26-Week Rolling Maintenance Horizon
            </h1>
            <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm mt-0.5">
              Section × Week reservation matrix derived from the CP-SAT
              planning engine. Weeks W01–W04 show real engine output; W05+ are
              synthetic extrapolations for planning horizon context.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={replan}
              disabled={loading}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white font-mono text-xs font-bold shadow-xs transition disabled:opacity-60"
            >
              <RefreshCcw
                className={cn("w-3.5 h-3.5", loading && "animate-spin")}
              />
              ROLL FORWARD
            </button>
          </div>
        </div>

        {/* Loading / Offline */}
        {loading && (
          <PlanningLoading message="Loading rolling plan reservation matrix..." />
        )}
        {isOffline && (
          <PlanningEngineOffline
            runId={currentRun?.planning_run_id}
            onRetry={refresh}
            onLoadDemo={resetDemo}
          />
        )}

        {/* Synthetic Data Disclosure */}
        <div className="text-[11px] font-mono text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/50 rounded px-3 py-2">
          ⚠ W01–W04 shows real engine-computed reservation data. W05–W26 are
          synthetic extrapolations (cyclic repeat of 4-week pattern) for
          planning horizon illustration.
        </div>

        {/* Horizon Tabs */}
        <div className="flex gap-1 font-mono text-xs">
          {HORIZON_TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setHorizon(tab.id)}
              className={cn(
                "px-3 py-1.5 rounded transition-colors font-bold cursor-pointer",
                horizon === tab.id
                  ? "bg-slate-900 dark:bg-blue-600 text-white"
                  : "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Stats Strip */}
        {currentRun && !loading && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded p-2.5 text-xs font-mono flex flex-wrap items-center gap-5 shadow-2xs">
            <div className="flex items-baseline gap-1.5">
              <span className="text-slate-400 dark:text-slate-500">PLANNING RUN:</span>
              <span className="font-bold text-slate-900 dark:text-white">
                {currentRun.planning_run_id}
              </span>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-slate-400 dark:text-slate-500">SECTIONS:</span>
              <span className="font-bold text-slate-900 dark:text-white">
                {sections.length}
              </span>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-slate-400 dark:text-slate-500">REAL WEEKS:</span>
              <span className="font-bold text-blue-700 dark:text-blue-400">W01–W04</span>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-slate-400 dark:text-slate-500">HORIZON:</span>
              <span className="font-bold text-slate-900 dark:text-white">
                {horizon} view
              </span>
            </div>
          </div>
        )}

        {/* Rolling Plan Matrix */}
        {currentRun && !loading && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-white/10">
                    <th className="py-2.5 px-3 font-semibold text-slate-700 dark:text-slate-300 sticky left-0 bg-slate-50 dark:bg-slate-950 min-w-[160px]">
                      SECTION
                    </th>
                    {weekNumbers.map((w) => {
                      const isReal = w <= 4;
                      return (
                        <th
                          key={w}
                          className={cn(
                            "py-2.5 px-2 font-semibold text-center min-w-[64px]",
                            isReal ? "text-blue-900 dark:text-blue-400" : "text-slate-400 dark:text-slate-500"
                          )}
                        >
                          W{String(w).padStart(2, "0")}
                          {!isReal && (
                            <span className="block text-[9px] text-slate-400 dark:text-slate-500 font-normal">
                              ~
                            </span>
                          )}
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {sections.length === 0 ? (
                    <tr>
                      <td
                        colSpan={weekNumbers.length + 1}
                        className="py-8 text-center text-slate-400 dark:text-slate-500"
                      >
                        No reservation data — run planning engine first.
                      </td>
                    </tr>
                  ) : (
                    sections.map((sectionId) => (
                      <tr key={sectionId} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                        <td className="py-2 px-3 font-semibold text-slate-800 dark:text-slate-200 sticky left-0 bg-white dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800">
                          <div className="flex items-center gap-1.5">
                            <TrainTrack className="w-3 h-3 text-slate-400 dark:text-slate-500 shrink-0" />
                            <span>{sectionId}</span>
                          </div>
                        </td>
                        {weekNumbers.map((w) => {
                          const cell = getCellData(sectionId, w);
                          const hasReservation = cell.reservedDays > 0;
                          return (
                            <td
                              key={w}
                              className={cn(
                                "py-2 px-1 text-center",
                                !cell.real && "opacity-50"
                              )}
                            >
                              {hasReservation ? (
                                <div
                                  className={cn(
                                    "mx-auto rounded text-[10px] font-bold px-1.5 py-0.5 leading-tight",
                                    cell.real
                                      ? "bg-blue-100 dark:bg-blue-950/60 text-blue-900 dark:text-blue-300 border border-blue-200 dark:border-blue-800/60"
                                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                                  )}
                                >
                                  <div>{cell.reservedDays}d</div>
                                  <div className="text-[9px] font-normal text-slate-500 dark:text-slate-400">
                                    {cell.plannedHours.toFixed(0)}h
                                  </div>
                                </div>
                              ) : (
                                <div className="text-slate-300 dark:text-slate-600 text-[10px]">
                                  —
                                </div>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Legend */}
        <div className="flex items-center gap-4 text-[11px] font-mono text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-4 rounded bg-blue-100 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800/60" />
            <span>Reserved (real engine data)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-4 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 opacity-50" />
            <span>Reserved (synthetic extrapolation)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="text-slate-300 dark:text-slate-600">—</div>
            <span>Standard traffic (no block)</span>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
