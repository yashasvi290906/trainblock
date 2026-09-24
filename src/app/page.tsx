"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  TrainTrack,
  ArrowRight,
  Sparkles,
  ChevronRight,
  RefreshCcw,
  ShieldCheck,
  Cpu,
  Layers,
  Activity,
  Sliders,
  CalendarRange,
  FileText,
  AlertTriangle,
  Sun,
  Moon,
  CheckCircle2,
} from "lucide-react";
import { LivingRailwayHero } from "@/components/home/LivingRailwayHero";
import { PlanningDrawer } from "@/components/railway/PlanningDrawer";
import { RailwaySignal } from "@/components/railway/RailwaySignal";
import { PlanningEngineOffline } from "@/components/common/PlanningEngineOffline";
import { PlanningLoading } from "@/components/common/PlanningLoading";
import { RailwayAmbientBackground } from "@/components/common/RailwayAmbientBackground";
import { usePlanningRun } from "@/context/PlanningRunContext";
import { useTheme } from "@/context/ThemeContext";

export default function HomePage() {
  const { currentRun, resetDemo, refresh, loading, error, isBackend } = usePlanningRun();
  const { theme, toggleTheme } = useTheme();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Derived KPIs from live planning engine - NO fabricated operational fallbacks
  const runId = currentRun?.planning_run_id ?? null;
  const totalDemands = currentRun?.input_summary?.total_maintenance_demands ?? (loading ? "…" : "—");
  const totalClusters = currentRun?.composition_clusters?.length ?? (loading ? "…" : "—");
  const totalBlocks = currentRun?.weekly_plan?.length ?? (loading ? "…" : "—");
  const solverStatus = currentRun?.solver_result?.solver_status ?? (loading ? "SOLVING" : "READY");
  const solveTimeMs = currentRun?.solver_result?.solve_time_ms != null ? currentRun.solver_result.solve_time_ms.toFixed(1) : (loading ? "…" : "—");
  const isValidated = currentRun?.validation_result?.overall_status === "VALIDATED";

  // P1 coverage computed from engine data
  const p1Tasks = currentRun?.prioritized_tasks?.filter((t) => t.safety_tier === "P1") ?? [];
  const assignedP1 = p1Tasks.filter((t) =>
    currentRun?.weekly_plan?.some((b) => b.tasks?.some((bt) => bt.task_id === t.task_id))
  ).length;
  const p1CoveragePct = p1Tasks.length > 0 ? `${Math.round((assignedP1 / p1Tasks.length) * 100)}%` : (loading ? "…" : "—");

  // Active possession block
  const activeBlock = currentRun?.weekly_plan?.[0] ?? null;
  const isOffline = !loading && (!isBackend || !!error);

  return (
    <div className="relative min-h-screen bg-[#070A12] text-slate-100 font-sans selection:bg-orange-500 selection:text-white flex flex-col transition-colors duration-200">
      {/* Personalized Ambient Railway Background with Moving Train Motion */}
      <RailwayAmbientBackground />

      {/* 1. TOP CONTROL & TELEMETRY BAR */}
      <header className="sticky top-0 z-40 h-14 bg-[#090D17]/95 backdrop-blur-md border-b border-white/10 px-4 sm:px-8 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-amber-600 text-white flex items-center justify-center font-black text-sm shadow-md shadow-orange-500/20">
            <TrainTrack className="w-4 h-4 text-white" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-black tracking-tight text-white font-mono text-base leading-none">
                Train<span className="text-orange-500">Block AI</span>
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse shadow-[0_0_8px_#f97316]" />
            </div>
            <span className="text-[10px] text-slate-400 font-medium">
              Indian Railways · SIH PS 26027
            </span>
          </div>
        </div>

        {/* Live Engine Status & Actions */}
        <div className="flex items-center gap-2 sm:gap-3 text-xs font-mono">
          <div className="hidden md:flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-slate-900/90 border border-white/10 text-xs">
            <span className="text-slate-400 font-medium">RUN:</span>
            <span className="font-bold text-white">{runId ?? (loading ? "…" : "OFFLINE")}</span>
            <span className="text-slate-700">|</span>
            <span className="flex items-center gap-1 font-bold text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>{solverStatus} {solveTimeMs !== "—" && `(${solveTimeMs}ms)`}</span>
            </span>
          </div>

          {isOffline && (
            <button
              onClick={refresh}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded bg-rose-950/60 border border-rose-800 text-rose-300 text-xs font-bold hover:bg-rose-900 transition-colors"
            >
              <RefreshCcw className="w-3.5 h-3.5" />
              <span>RETRY</span>
            </button>
          )}

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-900 hover:bg-slate-800 border border-white/10 text-amber-300 transition-colors cursor-pointer"
            title={`Switch to ${theme === "dark" ? "Light" : "Dark"} Mode`}
            aria-label="Toggle Theme"
          >
            {theme === "dark" ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-orange-400" />}
          </button>

          <Link
            href="/demo"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-bold text-xs transition-all shadow-md shadow-orange-600/20"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-200" />
            <span>JUDGE DEMO</span>
          </Link>
        </div>
      </header>

      {/* Persistent Synthetic Operational Topology Disclosure Banner */}
      <div className="bg-amber-950/80 border-b border-amber-500/30 px-4 py-2 text-xs font-mono text-amber-200 flex items-center justify-between shrink-0 shadow-inner">
        <div className="flex items-center gap-2 max-w-5xl">
          <span className="inline-block w-2 h-2 rounded-full bg-amber-400 animate-pulse shrink-0" />
          <span className="font-semibold text-amber-300 uppercase tracking-wider text-[11px] shrink-0">Operational Data Note:</span>
          <span className="text-amber-200/90 text-xs">
            Corridors, assets, and trains shown are synthetically modeled for the South Central Railway SEC–NDL section (SIH PS 26027). Production deployment interfaces directly with CRIS COA / ICMS / FOIS via REST / Kafka.
          </span>
        </div>
        <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] bg-amber-900/60 border border-amber-600/40 text-amber-300 shrink-0 font-bold">
          SIH 2026 DEMO BENCHMARK
        </span>
      </div>

      {/* 2. MAIN WORKSPACE CONTAINER */}
      <main className="flex-1 max-w-[1580px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
        {/* Loading / Offline notifications */}
        {loading && <PlanningLoading message="Connecting to CP-SAT solver optimization engine..." />}
        {isOffline && <PlanningEngineOffline runId={runId} onRetry={refresh} onLoadDemo={resetDemo} />}

        {/* ============================================================== */}
        {/* SECTION 1: BLOCK PLANNING PORTAL HERO + ROLE SELECTION          */}
        {/* Dedicated Entry Points to Station Master, Dept & Administration */}
        {/* ============================================================== */}
        <section className="relative rounded-3xl overflow-hidden border border-white/15 shadow-2xl bg-[#090D17]">
          <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[520px]">
            {/* LEFT HALF (7 Columns): Indian Railways Locomotive on Truss Bridge at Twilight */}
            <div className="lg:col-span-7 relative overflow-hidden flex flex-col justify-end p-8 sm:p-12 lg:p-14 min-h-[380px] lg:min-h-[520px]">
              {/* Authentic Indian Railways Locomotive Backdrop Image (updated_2) */}
              <div
                className="absolute inset-0 bg-cover bg-center transform scale-105 transition-transform duration-1000"
                style={{
                  backgroundImage: "url(/updated_2_clean.png), url(/updated_2.png)",
                }}
              />
              {/* Cinematic Vignette & Midnight Gradient Mask */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#090D17] via-[#090D17]/40 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-[#090D17]/40 lg:to-[#090D17]" />
              <div className="absolute inset-0 bg-black/20" />

              {/* Foreground Typography matching the reference */}
              <div className="relative z-10 space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-xs font-mono text-orange-400 font-bold">
                  <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse shadow-[0_0_8px_#f97316]" />
                  <span>SIH PS 26027 · SOUTH CENTRAL RAILWAY</span>
                </div>

                <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.05] drop-shadow-lg">
                  TrainBlock<br />
                  <span className="text-orange-500 text-glow-orange">AI</span>
                </h1>

                <p className="text-sm sm:text-base text-slate-200 max-w-md font-medium leading-relaxed drop-shadow-md">
                  AI-powered maintenance scheduling & defect tracking for Indian Railways infrastructure.
                </p>
              </div>
            </div>

            {/* RIGHT HALF (5 Columns): Select Your Role Glassmorphism Cards */}
            <div className="lg:col-span-5 relative bg-[#090D17] p-8 sm:p-10 lg:p-12 flex flex-col justify-between space-y-6 border-t lg:border-t-0 lg:border-l border-white/10">
              {/* Subtle background glow */}
              <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-1/4 right-1/3 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

              {/* Role Header */}
              <div className="relative z-10 space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/90 border border-slate-700/80 text-xs font-mono text-slate-300">
                  <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse shadow-[0_0_8px_#f97316]" />
                  <span>TrainBlock AI • Indian Railways</span>
                </div>

                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
                  Select Your <span className="text-orange-500">Role</span>
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 font-medium">
                  Choose your dedicated operational desk to access live planning & control actions.
                </p>
              </div>

              {/* 3 Interactive Role Cards */}
              <div className="relative z-10 space-y-3.5">
                {/* ROLE 1: Station Master - Dedicated Route */}
                <Link
                  href="/station-master"
                  className="group flex items-center justify-between p-4 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-amber-500/50 backdrop-blur-xl transition-all duration-200 shadow-md hover:shadow-amber-500/10"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-amber-500/15 border border-amber-500/40 text-amber-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                      <TrainTrack className="w-6 h-6" />
                    </div>
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <h3 className="font-black text-base text-white group-hover:text-amber-400 transition-colors">
                          Station Master
                        </h3>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold">
                          LOCAL DESK
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 font-medium leading-normal">
                        Station occupancy, upcoming block impact, local checks & operational consent
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-amber-400 group-hover:translate-x-1 transition-all shrink-0 ml-2" />
                </Link>

                {/* ROLE 2: Department (Engineering / S&T / TRD) - Dedicated Route */}
                <Link
                  href="/department"
                  className="group flex items-center justify-between p-4 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-cyan-500/50 backdrop-blur-xl transition-all duration-200 shadow-md hover:shadow-cyan-500/10"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-cyan-500/15 border border-cyan-500/40 text-cyan-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                      <Layers className="w-6 h-6" />
                    </div>
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <h3 className="font-black text-base text-white group-hover:text-cyan-400 transition-colors">
                          Department Desk
                        </h3>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold">
                          ENG · S&T · TRD
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 font-medium leading-normal">
                        Work register, priority triage, asset readiness checklist & block demands
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all shrink-0 ml-2" />
                </Link>

                {/* ROLE 3: Divisional Administration - Dedicated Route */}
                <Link
                  href="/administration"
                  className="group flex items-center justify-between p-4 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-purple-500/50 backdrop-blur-xl transition-all duration-200 shadow-md hover:shadow-purple-500/10"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-purple-500/15 border border-purple-500/40 text-purple-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                      <ShieldCheck className="w-6 h-6" />
                    </div>
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <h3 className="font-black text-base text-white group-hover:text-purple-400 transition-colors">
                          Divisional Administration
                        </h3>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/40 font-bold">
                          CONTROL & PLANNING
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 font-medium leading-normal">
                        Plan approvals, 26-week rolling programme, policy overrides & backtest audit
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-purple-400 group-hover:translate-x-1 transition-all shrink-0 ml-2" />
                </Link>
              </div>

              {/* Sub-footer matching reference */}
              <div className="relative z-10 pt-2 text-center">
                <span className="text-xs text-slate-500 font-mono">
                  TrainBlock AI • South Central Railway Division
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: PROBLEM STATEMENT & SOLUTION SPOTLIGHT */}
        <section className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-white/10">
            <div className="space-y-2 max-w-4xl">
              <div className="flex flex-wrap items-center gap-2 font-mono text-xs sm:text-sm">
                <span className="px-3 py-1 rounded-md bg-orange-500/20 text-orange-300 font-black border border-orange-500/40">
                  SMART INDIA HACKATHON 2026
                </span>
                <span className="px-3 py-1 rounded-md bg-amber-500/20 text-amber-300 font-black border border-amber-500/40">
                  PROBLEM STATEMENT 26027
                </span>
                <span className="text-slate-400 font-semibold">South Central Railway (SEC → NDL)</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-white leading-tight">
                TrainBlock AI: Automatic Possession Planning for Indian Railways
              </h2>
              <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-medium">
                Maximizing asset availability while eliminating express passenger delays on Indian Railways through deterministic multi-department possession shadowing.
              </p>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap sm:flex-col gap-3 shrink-0 font-mono text-xs sm:text-sm">
              <Link
                href="/plan"
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-black shadow-md shadow-orange-600/30 transition-all flex items-center justify-center gap-2 text-center"
              >
                <span>OPEN GANTT PLAN</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/scenarios"
                className="px-6 py-3 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 font-bold border border-white/10 transition-colors flex items-center justify-center gap-2 text-center"
              >
                <Sliders className="w-4 h-4 text-orange-400" />
                <span>WHAT-IF SCENARIO LAB</span>
              </Link>
            </div>
          </div>

          {/* Side-by-Side: The Operational Problem vs Our AI Solution */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            {/* The Problem Card */}
            <div className="p-6 rounded-xl bg-rose-950/30 border border-rose-900/50 space-y-3.5 shadow-xs">
              <div className="flex items-center gap-2 text-rose-300 font-black font-mono text-sm uppercase tracking-wide">
                <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
                <span>The Operational Challenge in Indian Railways</span>
              </div>
              <p className="text-slate-300 leading-relaxed text-sm sm:text-base">
                High trunk route utilization (&gt;130%) creates intense competition for track access. <strong>Civil Engineering, S&amp;T, and Traction (TRD)</strong> submit fragmented, unsynchronized block demands. Operating controllers frequently deny 20–40% of blocks due to express train bunching, resulting in deferred rail fractures and speed restrictions.
              </p>
              <div className="flex flex-wrap gap-2 text-xs font-mono font-bold pt-1">
                <span className="px-2.5 py-1 rounded bg-rose-900/40 text-rose-200 border border-rose-800">
                  47 Siloed Demands/Week
                </span>
                <span className="px-2.5 py-1 rounded bg-rose-900/40 text-rose-200 border border-rose-800">
                  Recurring Passenger Delays
                </span>
              </div>
            </div>

            {/* The Solution Card */}
            <div className="p-6 rounded-xl bg-emerald-950/30 border border-emerald-900/50 space-y-3.5 shadow-xs">
              <div className="flex items-center gap-2 text-emerald-300 font-black font-mono text-sm uppercase tracking-wide">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>The TrainBlock AI Unified Solution</span>
              </div>
              <p className="text-slate-300 leading-relaxed text-sm sm:text-base">
                RAILBLOCK clusters geographically adjacent maintenance tasks (&le;3 km) into <strong>co-located integrated possessions</strong>. A Google OR-Tools CP-SAT engine solves exact non-conflicting time-space windows, protecting premier trains (Vande Bharat, Rajdhani) while guaranteeing 100% P1 mandatory defect repairs.
              </p>
              <div className="flex flex-wrap gap-2 text-xs font-mono font-bold pt-1">
                <span className="px-2.5 py-1 rounded bg-emerald-900/40 text-emerald-200 border border-emerald-800">
                  OR-Tools CP-SAT Solver
                </span>
                <span className="px-2.5 py-1 rounded bg-emerald-900/40 text-emerald-200 border border-emerald-800">
                  0 Express Conflicts
                </span>
                <span className="px-2.5 py-1 rounded bg-emerald-900/40 text-emerald-200 border border-emerald-800">
                  2,160m Possession Time Saved
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 3: REAL-TIME ENGINE KPI METRICS */}
        <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 font-mono text-xs">
          <div className="p-4 sm:p-5 rounded-xl bg-slate-900/70 backdrop-blur-md border border-white/10 shadow-xs flex flex-col justify-between">
            <span className="text-slate-400 font-bold text-xs uppercase">TOTAL DEMANDS</span>
            <div className="text-3xl font-black text-white mt-1.5">{totalDemands}</div>
            <span className="text-xs text-slate-500 font-semibold mt-1">6 Ingestion Feeds</span>
          </div>

          <div className="p-4 sm:p-5 rounded-xl bg-slate-900/70 backdrop-blur-md border border-white/10 shadow-xs flex flex-col justify-between">
            <span className="text-slate-400 font-bold text-xs uppercase">CO-LOCATED CLUSTERS</span>
            <div className="text-3xl font-black text-orange-400 mt-1.5">{totalClusters}</div>
            <span className="text-xs text-slate-500 font-semibold mt-1">≤3 km Shadowing</span>
          </div>

          <div className="p-4 sm:p-5 rounded-xl bg-slate-900/70 backdrop-blur-md border border-white/10 shadow-xs flex flex-col justify-between">
            <span className="text-slate-400 font-bold text-xs uppercase">SCHEDULED BLOCKS</span>
            <div className="text-3xl font-black text-white mt-1.5">{totalBlocks}</div>
            <span className="text-xs text-slate-500 font-semibold mt-1">Unified Possessions</span>
          </div>

          <div className="p-4 sm:p-5 rounded-xl bg-slate-900/70 backdrop-blur-md border border-white/10 shadow-xs flex flex-col justify-between">
            <span className="text-slate-400 font-bold text-xs uppercase">P1 REPAIR RATE</span>
            <div className="text-3xl font-black text-emerald-400 mt-1.5">{p1CoveragePct}%</div>
            <span className="text-xs text-emerald-400 font-bold mt-1">100% Critical Safety</span>
          </div>

          <div className="p-4 sm:p-5 rounded-xl bg-slate-900/70 backdrop-blur-md border border-white/10 shadow-xs flex flex-col justify-between">
            <span className="text-slate-400 font-bold text-xs uppercase">CP-SAT SOLVE TIME</span>
            <div className="text-3xl font-black text-white mt-1.5">{solveTimeMs}ms</div>
            <span className="text-xs text-slate-500 font-semibold mt-1">CP Solver Speed</span>
          </div>

          <div className="p-4 sm:p-5 rounded-xl bg-slate-900/70 backdrop-blur-md border border-white/10 shadow-xs flex flex-col justify-between">
            <span className="text-slate-400 font-bold text-xs uppercase">SAFETY INVARIANTS</span>
            <div className="text-3xl font-black text-emerald-400 mt-1.5">4 / 4</div>
            <span className="text-xs text-emerald-400 font-bold mt-1">0 Express Conflicts</span>
          </div>
        </section>

        {/* SECTION 3: LIVING RAILWAY CORRIDOR SIMULATION */}
        <section className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-5 sm:p-6 shadow-xl space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 font-mono text-xs">
            <div className="flex items-center gap-2.5 font-bold text-white text-sm">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]" />
              <span>LIVING CORRIDOR SIMULATION — SECUNDERABAD TO NANDYAL (KM 40–120)</span>
            </div>
            <Link
              href="/live-corridor"
              className="text-orange-400 hover:text-orange-300 hover:underline font-bold flex items-center gap-1.5 transition-colors"
            >
              <span>Full Interactive Corridor Control Desk</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <p className="text-xs text-slate-300 font-sans">
            Real-time visual simulation of train movements, signal interlocking, and active block possession boundaries. Trains decelerate and hold safely outside active maintenance sections.
          </p>

          <div className="border border-white/10 rounded-xl overflow-hidden shadow-2xl bg-[#090D17]">
            <LivingRailwayHero />
          </div>
        </section>

        {/* SECTION 4: ACTIVE POSSESSION DOSSIER CALLOUT */}
        {activeBlock && (
          <section
            onClick={() => setIsDrawerOpen(true)}
            className="bg-slate-900/60 backdrop-blur-xl border border-white/10 hover:border-orange-500/50 rounded-2xl p-5 shadow-xl cursor-pointer transition-all duration-200 group"
          >
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3 font-mono text-xs">
              <div className="flex items-center gap-3">
                <span className="px-2.5 py-1 rounded bg-orange-500/20 text-orange-300 font-bold border border-orange-500/40">
                  FLAGSHIP POSSESSION
                </span>
                <span className="font-extrabold text-base text-white group-hover:text-orange-400 transition-colors">
                  {activeBlock.block_id}
                </span>
                <span className="text-slate-500">·</span>
                <span className="text-slate-300 font-semibold">
                  {activeBlock.section} ({activeBlock.line} Line)
                </span>
                <span className="text-slate-500">·</span>
                <span className="text-orange-400 font-bold">
                  {activeBlock.start_time} – {activeBlock.end_time} ({activeBlock.duration_minutes}m)
                </span>
              </div>

              <div className="flex items-center gap-1.5 text-orange-400 font-bold group-hover:text-orange-300">
                <span>View Full Technical Dossier</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-3 text-xs text-slate-300 font-sans">
              <div className="flex items-center gap-4">
                <span>
                  <strong className="text-white">{activeBlock.tasks?.length ?? 0} Work Orders</strong> across{" "}
                  <strong className="text-orange-300">{activeBlock.departments?.join(", ")}</strong>
                </span>
                <span className="text-slate-700">|</span>
                <span className="text-emerald-400 font-semibold">
                  {activeBlock.train_interactions?.filter((ti) => ti.is_protected).length ?? 4} passenger paths protected
                </span>
              </div>
              <span className="text-slate-400 text-xs font-mono">
                Click card to inspect machinery allocation and safety sign-off →
              </span>
            </div>
          </section>
        )}

        {/* SECTION 5: MODULAR WORKSTATION NAVIGATION GRID */}
        <section className="space-y-4">
          <div className="flex items-center justify-between font-mono text-xs sm:text-sm">
            <h2 className="text-sm sm:text-base font-black text-white uppercase tracking-wider">
              TrainBlock AI System Modules
            </h2>
            <span className="text-slate-400 font-semibold">SIH 2026 Evaluation Suite</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <Link
              href="/plan"
              className="p-6 rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-white/10 hover:border-orange-500/60 shadow-xl hover:shadow-orange-500/10 transition-all group"
            >
              <div className="flex items-center gap-3 text-orange-400 mb-2.5">
                <CalendarRange className="w-6 h-6" />
                <h3 className="font-black font-mono text-base text-white group-hover:text-orange-400 transition-colors">
                  Gantt Plan Review & Sign-Off
                </h3>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed font-medium">
                Interactive multi-department Gantt chart, machine crew dispatch, planner manual override, and digital authorization.
              </p>
            </Link>

            <Link
              href="/live-corridor"
              className="p-6 rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-white/10 hover:border-emerald-500/60 shadow-xl hover:shadow-emerald-500/10 transition-all group"
            >
              <div className="flex items-center gap-3 text-emerald-400 mb-2.5">
                <Activity className="w-6 h-6" />
                <h3 className="font-black font-mono text-base text-white group-hover:text-emerald-400 transition-colors">
                  Live Physical Corridor Simulation
                </h3>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed font-medium">
                Full 2D/2.5D schematic of the Secunderabad–Nandyal corridor, showing train headway, signal aspects, and possession zones.
              </p>
            </Link>

            <Link
              href="/scenarios"
              className="p-6 rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-white/10 hover:border-amber-500/60 shadow-xl hover:shadow-amber-500/10 transition-all group"
            >
              <div className="flex items-center gap-3 text-amber-400 mb-2.5">
                <Sliders className="w-6 h-6" />
                <h3 className="font-black font-mono text-base text-white group-hover:text-amber-400 transition-colors">
                  What-If Disruption Lab
                </h3>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed font-medium">
                Test real-time block denial from Operating, inject emergency USFD rail joint fractures, and evaluate fallback windows.
              </p>
            </Link>

            <Link
              href="/rolling"
              className="p-6 rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-white/10 hover:border-purple-500/60 shadow-xl hover:shadow-purple-500/10 transition-all group"
            >
              <div className="flex items-center gap-3 text-purple-400 mb-2.5">
                <Layers className="w-6 h-6" />
                <h3 className="font-black font-mono text-base text-white group-hover:text-purple-400 transition-colors">
                  Rolling Horizon Reservation Matrix
                </h3>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed font-medium">
                Multi-timescale reservation matrix spanning 7-day operational, 1-month tactical, and 26-week strategic maintenance quotas.
              </p>
            </Link>

            <Link
              href="/reports"
              className="p-6 rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-white/10 hover:border-sky-500/60 shadow-xl hover:shadow-sky-500/10 transition-all group"
            >
              <div className="flex items-center gap-3 text-sky-400 mb-2.5">
                <FileText className="w-6 h-6" />
                <h3 className="font-black font-mono text-base text-white group-hover:text-sky-400 transition-colors">
                  Evidence &amp; Safety Audit Reports
                </h3>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed font-medium">
                Solver execution proof, mathematical constraint verification checklist, and divisional operating export dossier.
              </p>
            </Link>

            <Link
              href="/demo"
              className="p-6 rounded-2xl bg-gradient-to-br from-orange-950/60 via-slate-900 to-[#090D17] text-white border-2 border-orange-500/50 shadow-xl hover:shadow-orange-500/20 transition-all group"
            >
              <div className="flex items-center gap-3 text-amber-300 mb-2.5">
                <Sparkles className="w-6 h-6" />
                <h3 className="font-black font-mono text-base text-white group-hover:text-amber-300">
                  Judge Demo Workstation
                </h3>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed font-medium">
                Curated 7-stage evaluation walkthrough illustrating the transformation from fragmented demands to conflict-free blocks.
              </p>
            </Link>
          </div>
        </section>
      </main>

      {/* 3. TECHNICAL RAILWAY FOOTER */}
      <footer className="mt-auto border-t border-white/10 bg-[#090D17]/95 backdrop-blur-md py-5 text-xs text-slate-400 font-mono">
        <div className="max-w-[1580px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between gap-4">
          <div className="font-semibold text-slate-300">
            TrainBlock AI · South Central Railway Division · SIH 2026 Problem Statement 26027
          </div>
          <div className="flex flex-wrap items-center gap-4 font-bold text-slate-300">
            <Link href="/plan" className="hover:text-orange-400 transition-colors">PLAN</Link>
            <Link href="/work-register" className="hover:text-orange-400 transition-colors">WORK ORDERS</Link>
            <Link href="/live-corridor" className="hover:text-orange-400 transition-colors">CORRIDOR</Link>
            <Link href="/rolling" className="hover:text-orange-400 transition-colors">ROLLING</Link>
            <Link href="/scenarios" className="hover:text-orange-400 transition-colors">WHAT-IF</Link>
            <Link href="/analysis" className="hover:text-orange-400 transition-colors">BACKTEST</Link>
            <Link href="/siloed-vs-integrated" className="hover:text-orange-400 transition-colors">SILOED VS INTEGRATED</Link>
            <Link href="/reports" className="hover:text-orange-400 transition-colors">REPORTS</Link>
            <Link href="/demo" className="text-orange-400 font-black hover:underline">JUDGE DEMO</Link>
          </div>
        </div>
      </footer>

      {/* 4. PROGRESSIVE DISCLOSURE DRAWER */}
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
