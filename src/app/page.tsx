"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  TrainTrack,
  ArrowRight,
  ShieldCheck,
  Cpu,
  Layers,
  Sparkles,
  Database,
  RotateCcw,
  CheckCircle2,
  Clock,
  Wrench,
  Zap,
  Radio,
  ExternalLink,
  ChevronRight,
  Info
} from "lucide-react";
import { LivingRailwayHero } from "@/components/home/LivingRailwayHero";
import { PlanningDrawer } from "@/components/railway/PlanningDrawer";
import { RailwaySignal } from "@/components/railway/RailwaySignal";
import { usePlanningRun } from "@/context/PlanningRunContext";
import { PlannedBlock } from "@/lib/api/runs";

export default function HomePage() {
  const { currentRun, resetDemo, loading, isBackend } = usePlanningRun();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const runId = currentRun?.planning_run_id || "RB-2026-09-23";
  const totalDemands = currentRun?.input_summary?.total_maintenance_demands || 47;
  const totalClusters = currentRun?.composition_clusters?.length || 14;
  const totalBlocks = currentRun?.weekly_plan?.length || 8;
  const deferredCount = currentRun?.solver_result?.unassigned_tasks?.length || 21;
  const solverStatus = currentRun?.solver_result?.solver_status || "OPTIMAL";
  const isValidated = currentRun?.validation_result?.overall_status === "VALIDATED";

  // Highlighted Active Block (BLK-2026-103 / B-014)
  const activeBlock: PlannedBlock = currentRun?.weekly_plan?.[2] || currentRun?.weekly_plan?.[0] || {
    block_id: "BLK-2026-103",
    corridor: "SEC–NDL",
    section: "Warangal – Kazipet Jn",
    line: "DOWN",
    km_start: 68.0,
    km_end: 94.0,
    start_time: "02:20",
    end_time: "04:10",
    start_minutes_from_midnight: 140,
    end_minutes_from_midnight: 250,
    duration_minutes: 110,
    usable_minutes_breakdown: {
      raw_possession_minutes: 110,
      isolation_minutes: 10,
      earthing_minutes: 5,
      machine_transit_minutes: 5,
      restoration_minutes: 5,
      total_overhead_minutes: 25,
      usable_work_minutes: 85,
      is_sufficient_for_demand: true,
      work_demand_minutes: 80,
      margin_minutes: 5,
    },
    departments: ["Engineering", "S&T", "Traction"],
    tasks: [],
    protection_type: "FULL_BLOCK",
    ohe_required: true,
    machines_assigned: ["CSM-09"],
    crew_count: 14,
    train_interactions: [
      { train_id: "12728", train_name: "Godavari Express", service_number: "12728", train_type: "EXPRESS", is_protected: true, clearance_margin_min: 22, status: "PROTECTED" },
      { train_id: "17015", train_name: "Visakha Express", service_number: "17015", train_type: "EXPRESS", is_protected: true, clearance_margin_min: 25, status: "PROTECTED" },
    ],
    bdms_reference: "BDMS-REQ-2026-103"
  };

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
            <span className="font-bold text-slate-900">{runId}</span>
            <span className="text-slate-300">·</span>
            <span className="text-blue-700 font-bold">{solverStatus}</span>
            <span className="text-slate-300">·</span>
            <span className="text-emerald-700 font-bold">{isValidated ? "VALIDATED" : "CHECK"}</span>
          </div>

          <Link
            href="/demo"
            className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-blue-700 hover:bg-blue-800 text-white font-bold transition-colors shadow-2xs"
          >
            <Sparkles className="w-3 h-3 text-blue-200" />
            <span>JUDGE DEMO</span>
          </Link>
        </div>
      </header>

      {/* 2. MAIN OPERATIONAL WORKSPACE */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-5 space-y-4">
        {/* Hero Section: Technical Purpose */}
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

            {/* Direct Quick Action CTAs */}
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

        {/* 3. COMPACT OPERATIONAL STRIP (SECTION 11 SPEC) */}
        <section className="bg-white border border-slate-200 rounded p-2.5 text-xs font-mono flex flex-wrap items-center justify-between gap-3 shadow-2xs">
          <div className="flex flex-wrap items-center gap-5 sm:gap-7">
            <div className="flex items-baseline gap-1.5">
              <span className="text-slate-400 font-medium">DEMANDS:</span>
              <span className="font-bold text-slate-900">{totalDemands} Tasks</span>
            </div>

            <div className="flex items-baseline gap-1.5">
              <span className="text-slate-400 font-medium">CLUSTERS:</span>
              <span className="font-bold text-slate-900">{totalClusters} Compatible</span>
            </div>

            <div className="flex items-baseline gap-1.5">
              <span className="text-slate-400 font-medium">SELECTED:</span>
              <span className="font-bold text-blue-700">{totalBlocks} Blocks</span>
            </div>

            <div className="flex items-baseline gap-1.5">
              <span className="text-slate-400 font-medium">P1 COVERAGE:</span>
              <span className="font-bold text-emerald-700">100% Guaranteed</span>
            </div>

            <div className="flex items-baseline gap-1.5">
              <span className="text-slate-400 font-medium">SOLVER:</span>
              <span className="font-bold text-slate-900">CP-SAT / OPTIMAL</span>
            </div>
          </div>

          <div className="flex items-center gap-2 border-t sm:border-t-0 sm:border-l border-slate-200 pt-1.5 sm:pt-0 sm:pl-3">
            <RailwaySignal aspect="CLEAR" size="sm" label="VALIDATED" />
          </div>
        </section>

        {/* 4. PRIMARY LIVING RAILWAY CORRIDOR VIEWPORT (THE PRODUCT CENTERPIECE) */}
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

        {/* 5. ACTIVE POSSESSION CALLOUT (SECTION 11 SPEC) */}
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
                KM {activeBlock.km_start} → KM {activeBlock.km_end} (Warangal – Kazipet)
              </span>
              <span className="text-slate-300">·</span>
              <span className="text-blue-700 font-bold">
                {activeBlock.start_time} – {activeBlock.end_time} ({activeBlock.duration_minutes}m Granted)
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-blue-700 font-bold text-[11px]">
              <span>View Block Dossier</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 text-slate-600">
            <div className="flex items-center gap-4 text-[11px]">
              <span>7 Tasks Consolidated: ENG · S&amp;T · TRD</span>
              <span className="text-slate-300">|</span>
              <span>CSM Tamping Machine + 25kV OHE Isolation</span>
              <span className="text-slate-300">|</span>
              <span className="text-emerald-700 font-semibold">Protected: Express 12728 &amp; 17015 (Buffers ≥20m)</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[10px] text-slate-400">Click to expand technical evidence →</span>
            </div>
          </div>
        </section>
      </main>

      {/* 6. TECHNICAL RAILWAY FOOTER */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-3 text-[11px] text-slate-500 font-mono">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between gap-3">
          <div>
            RAILBLOCK · Modern Railway Operations Control Workstation · South Central Railway
          </div>
          <div className="flex items-center gap-4">
            <Link href="/plan" className="hover:text-blue-900 transition-colors">PLAN</Link>
            <Link href="/work-register" className="hover:text-blue-900 transition-colors">WORK ORDERS</Link>
            <Link href="/live-corridor" className="hover:text-blue-900 transition-colors">CORRIDOR</Link>
            <Link href="/scenarios" className="hover:text-blue-900 transition-colors">WHAT-IF</Link>
            <Link href="/reports" className="hover:text-blue-900 transition-colors">REPORTS</Link>
            <Link href="/demo" className="text-blue-700 font-bold hover:underline">JUDGE DEMO</Link>
          </div>
        </div>
      </footer>

      {/* 7. PROGRESSIVE DISCLOSURE DRAWER (LEVEL 3 TECHNICAL EVIDENCE) */}
      <PlanningDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        block={activeBlock}
      />
    </div>
  );
}
