"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  TrainTrack,
  ArrowRight,
  Sparkles,
  ChevronRight,
  RefreshCcw,
} from "lucide-react";
import { LivingRailwayHero } from "@/components/home/LivingRailwayHero";
import { PlanningDrawer } from "@/components/railway/PlanningDrawer";
import { RailwaySignal } from "@/components/railway/RailwaySignal";
import { PlanningEngineOffline } from "@/components/common/PlanningEngineOffline";
import { PlanningLoading } from "@/components/common/PlanningLoading";
import { usePlanningRun } from "@/context/PlanningRunContext";

export default function HomePage() {
  const { currentRun, resetDemo, refresh, loading, error, isBackend } =
    usePlanningRun();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // ── Derived KPIs — NEVER hardcode operational values ──────────────────────
  const runId = currentRun?.planning_run_id ?? null;
  const totalDemands =
    currentRun?.input_summary?.total_maintenance_demands ?? null;
  const totalClusters = currentRun?.composition_clusters?.length ?? null;
  const totalBlocks = currentRun?.weekly_plan?.length ?? null;
  const solverStatus = currentRun?.solver_result?.solver_status ?? null;
  const isValidated =
    currentRun?.validation_result?.overall_status === "VALIDATED";

  // P1 coverage computed from engine data
  const p1Tasks =
    currentRun?.prioritized_tasks?.filter((t) => t.safety_tier === "P1") ?? [];
  const assignedP1 = p1Tasks.filter((t) =>
    currentRun?.weekly_plan?.some((b) =>
      b.tasks?.some((bt) => bt.task_id === t.task_id)
    )
  ).length;
  const p1CoverageText =
    p1Tasks.length > 0
      ? `${assignedP1}/${p1Tasks.length} P1 (${Math.round((assignedP1 / p1Tasks.length) * 100)}%)`
      : null;

  // Active block — first block from engine, or null
  const activeBlock = currentRun?.weekly_plan?.[0] ?? null;

  const isOffline = !loading && (!isBackend || !!error);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-600 selection:text-white flex flex-col">
      {/* 1. COMPACT TOP WORKSTATION BAR */}
      <header className="h-12 bg-white border-b border-slate-200 px-4 sm:px-8 flex items-center justify-between shrink-0 font-mono text-xs">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 rounded bg-slate-900 text-white flex items-center justify-center font-black text-xs">
            <TrainTrack className="w-3.5 h-3.5" />
          </div>
          <span className="font-extrabold tracking-tight text-slate-900 text-sm">
            RAILBLOCK
          </span>
          <span className="hidden sm:inline text-slate-500 font-normal">
            | Integrated Railway Maintenance Planning
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 text-[11px] text-slate-600">
            <span className="text-slate-400">RUN:</span>
            <span className="font-bold text-slate-900">
              {runId ?? (loading ? "…" : "OFFLINE")}
            </span>
            <span className="text-slate-300">·</span>
            <span
              className={
                solverStatus === "OPTIMAL"
                  ? "text-blue-700 font-bold"
                  : "text-slate-400"
              }
            >
              {solverStatus ?? (loading ? "…" : "—")}
            </span>
            <span className="text-slate-300">·</span>
            <span
              className={
                isValidated ? "text-emerald-700 font-bold" : "text-slate-400"
              }
            >
              {currentRun
                ? isValidated
                  ? "VALIDATED"
                  : "CHECK"
                : loading
                  ? "…"
                  : "—"}
            </span>
          </div>

          {isOffline && (
            <button
              onClick={refresh}
              className="flex items-center gap-1 px-2 py-1 rounded bg-rose-50 border border-rose-200 text-rose-700 text-[10px] font-bold hover:bg-rose-100 transition-colors"
            >
              <RefreshCcw className="w-3 h-3" />
              RETRY
            </button>
          )}

          <Link
            href="/demo"
            className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-blue-700 hover:bg-blue-800 text-white font-bold transition-colors shadow-2xs"
          >
            <Sparkles className="w-3 h-3 text-blue-200" />
            <span>JUDGE DEMO</span>
          </Link>
        </div>
      </header>

      {/* SYNTHETIC DATA DISCLOSURE — persistent amber banner */}
      <div className="bg-amber-50 border-b border-amber-200 px-4 sm:px-8 py-1.5 flex items-center gap-2 text-[11px] font-mono text-amber-800 shrink-0">
        <span className="font-bold">⚠ SYNTHETIC OPERATIONAL TOPOLOGY</span>
        <span className="text-amber-600">—</span>
        <span>
          NOT LIVE RAILWAY DATA · Deterministic seed data calibrated to South
          Central Railway (SCR) for SIH 2026 PS 26027 prototype demonstration
        </span>
      </div>

      {/* 2. MAIN OPERATIONAL WORKSPACE */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-5 space-y-4">
        {/* Hero heading */}
        <section className="space-y-1">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="text-[11px] font-mono uppercase tracking-wider text-slate-500 font-bold flex items-center gap-2">
                <span>SEC → NDL</span>
                <span>·</span>
                <span>DOUBLE LINE</span>
                <span>·</span>
                <span>25kV AC</span>
                <span>·</span>
                <span className="text-blue-700">PS 26027</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 mt-0.5">
                PLAN THE BLOCK. PROTECT THE RAILWAY.
              </h1>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href="/plan"
                className="px-4 py-2 rounded bg-slate-900 hover:bg-slate-800 text-white text-xs font-mono font-bold shadow-xs transition-colors flex items-center gap-1.5"
              >
                <span>OPEN PLAN WORKSPACE</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                href="/demo"
                className="px-3.5 py-2 rounded bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 text-xs font-mono font-bold transition-colors flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-blue-700" />
                <span>JUDGE MODE</span>
              </Link>
            </div>
          </div>
        </section>

        {/* Loading state */}
        {loading && (
          <PlanningLoading message="Connecting to CP-SAT planning engine..." />
        )}

        {/* Offline / error state */}
        {isOffline && (
          <PlanningEngineOffline
            runId={runId}
            onRetry={refresh}
            onLoadDemo={resetDemo}
          />
        )}

        {/* 3. COMPACT OPERATIONAL STRIP — only render when engine data present */}
        {currentRun && !loading && (
          <section className="bg-white border border-slate-200 rounded p-2.5 text-xs font-mono flex flex-wrap items-center justify-between gap-3 shadow-2xs">
            <div className="flex flex-wrap items-center gap-5 sm:gap-7">
              <div className="flex items-baseline gap-1.5">
                <span className="text-slate-400 font-medium">DEMANDS:</span>
                <span className="font-bold text-slate-900">
                  {totalDemands} Tasks
                </span>
              </div>

              <div className="flex items-baseline gap-1.5">
                <span className="text-slate-400 font-medium">CLUSTERS:</span>
                <span className="font-bold text-slate-900">
                  {totalClusters} Compatible
                </span>
              </div>

              <div className="flex items-baseline gap-1.5">
                <span className="text-slate-400 font-medium">SELECTED:</span>
                <span className="font-bold text-blue-700">
                  {totalBlocks} Blocks
                </span>
              </div>

              <div className="flex items-baseline gap-1.5">
                <span className="text-slate-400 font-medium">P1 COVERAGE:</span>
                <span className="font-bold text-emerald-700">
                  {p1CoverageText ?? "—"}
                </span>
              </div>

              <div className="flex items-baseline gap-1.5">
                <span className="text-slate-400 font-medium">SOLVER:</span>
                <span className="font-bold text-slate-900">
                  CP-SAT / {solverStatus ?? "—"}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 border-t sm:border-t-0 sm:border-l border-slate-200 pt-1.5 sm:pt-0 sm:pl-3">
              <RailwaySignal
                aspect={isValidated ? "CLEAR" : "CAUTION"}
                size="sm"
                label={isValidated ? "VALIDATED" : "PENDING"}
              />
            </div>
          </section>
        )}

        {/* 4. LIVING RAILWAY CORRIDOR VIEWPORT */}
        <section className="space-y-1.5">
          <div className="flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-2 font-bold text-slate-800">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>LIVING RAILWAY CORRIDOR — SEC → NDL (KM 40–120)</span>
            </div>
            <Link
              href="/live-corridor"
              className="text-blue-700 hover:text-blue-900 font-bold flex items-center gap-1 hover:underline"
            >
              <span>Full Corridor Schematic</span>
              <ChevronRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="border border-slate-200 rounded-xl overflow-hidden shadow-xs bg-white">
            <LivingRailwayHero />
          </div>
        </section>

        {/* 5. ACTIVE POSSESSION CALLOUT — only shown when engine returns blocks */}
        {activeBlock ? (
          <section
            onClick={() => setIsDrawerOpen(true)}
            className="bg-white border border-slate-200 hover:border-amber-400 rounded-lg p-3 text-xs font-mono space-y-2 cursor-pointer transition-all duration-150 shadow-2xs group"
            title="Click to view full technical dossier"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2">
              <div className="flex items-center gap-2.5">
                <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300 font-bold text-[10px]">
                  ACTIVE POSSESSION
                </span>
                <span className="font-extrabold text-slate-900 text-sm group-hover:text-blue-700 transition-colors">
                  {activeBlock.block_id}
                </span>
                <span className="text-slate-300">·</span>
                <span className="text-slate-700 font-semibold">
                  {activeBlock.section} ({activeBlock.line} Line)
                </span>
                <span className="text-slate-300">·</span>
                <span className="text-blue-700 font-bold">
                  {activeBlock.start_time} – {activeBlock.end_time} (
                  {activeBlock.duration_minutes}m)
                </span>
              </div>

              <div className="flex items-center gap-1.5 text-blue-700 font-bold text-[11px]">
                <span>View Block Dossier</span>
                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 text-slate-600">
              <div className="flex items-center gap-4 text-[11px]">
                <span>
                  {activeBlock.tasks?.length ?? 0} Tasks ·{" "}
                  {activeBlock.departments?.join(" · ")}
                </span>
                <span className="text-slate-300">|</span>
                <span className="text-emerald-700 font-semibold">
                  {activeBlock.train_interactions?.filter(
                    (ti) => ti.is_protected
                  ).length ?? 0}{" "}
                  train paths protected
                </span>
              </div>
              <span className="text-[10px] text-slate-400">
                Click to expand technical evidence →
              </span>
            </div>
          </section>
        ) : (
          !loading && currentRun && (
            <section className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-xs font-mono text-slate-500 text-center">
              No active possession scheduled — planning engine returned 0 blocks.
            </section>
          )
        )}
      </main>

      {/* 6. TECHNICAL RAILWAY FOOTER */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-3 text-[11px] text-slate-500 font-mono">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between gap-3">
          <div>
            RAILBLOCK · South Central Railway · SIH 2026 PS 26027
          </div>
          <div className="flex items-center gap-4">
            <Link href="/plan" className="hover:text-blue-900 transition-colors">PLAN</Link>
            <Link href="/work-register" className="hover:text-blue-900 transition-colors">WORK ORDERS</Link>
            <Link href="/live-corridor" className="hover:text-blue-900 transition-colors">CORRIDOR</Link>
            <Link href="/rolling" className="hover:text-blue-900 transition-colors">ROLLING</Link>
            <Link href="/scenarios" className="hover:text-blue-900 transition-colors">WHAT-IF</Link>
            <Link href="/reports" className="hover:text-blue-900 transition-colors">REPORTS</Link>
            <Link href="/demo" className="text-blue-700 font-bold hover:underline">JUDGE DEMO</Link>
          </div>
        </div>
      </footer>

      {/* 7. PROGRESSIVE DISCLOSURE DRAWER */}
      {activeBlock && (
        <PlanningDrawer
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          block={activeBlock}
        />
      )}
    </div>
  );
}
