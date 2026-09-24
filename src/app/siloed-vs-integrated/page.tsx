"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  SplitSquareVertical,
  ArrowRight,
  Sparkles,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Zap,
  Wrench,
  Radio,
  Clock,
  Layers,
  Activity,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";
import { AppShell } from "@/components/shell/AppShell";
import { cn } from "@/lib/utils";

export default function SiloedVsIntegratedPage() {
  const [isConsolidated, setIsConsolidated] = useState(false);

  const handleConsolidate = () => {
    setIsConsolidated(true);
  };

  const handleReset = () => {
    setIsConsolidated(false);
  };

  return (
    <AppShell
      pageTitle="Siloed vs. Integrated Possessions"
      subtitle="Multi-Departmental Maintenance Window Consolidation"
    >
      <div className="flex-1 flex flex-col overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* 1. TOP INTERACTION & CONCEPT HEADER */}
        <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 font-mono text-xs">
                <span className="px-2.5 py-0.5 rounded bg-orange-100 dark:bg-orange-950/80 text-orange-900 dark:text-orange-300 font-bold border border-orange-200 dark:border-orange-800">
                  CORE SIH INNOVATION
                </span>
                <span className="text-slate-500 dark:text-slate-400">Section: SEC–NDL (KM 68–94 DN Line)</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Traditional Siloed Demands vs. RAILBLOCK Co-Location
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed">
                Traditional Indian Railways practice involves <strong>Civil Engineering, S&amp;T, and Traction (TRD)</strong> bidding for isolated possessions on different days or hours. RAILBLOCK uses spatial-temporal clustering to shadow all 3 departments inside a single, protected 110-minute window.
              </p>
            </div>

            {/* Interactive Simulation Controls */}
            <div className="flex items-center gap-3 shrink-0 font-mono text-xs">
              {!isConsolidated ? (
                <button
                  onClick={handleConsolidate}
                  className="px-5 py-2.5 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-bold rounded-xl shadow-md shadow-orange-500/20 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-amber-200" />
                  <span>CONSOLIDATE POSSESSIONS (3 → 1)</span>
                </button>
              ) : (
                <button
                  onClick={handleReset}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold rounded-xl border border-slate-200 dark:border-slate-700 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>RESTORE SILOED BASELINE</span>
                </button>
              )}
            </div>
          </div>
        </section>

        {/* 2. SIDE-BY-SIDE INTERACTIVE COMPARISON SCENE */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* LEFT: 1. SILOED BASELINE CONTAINER (6 Cols) */}
          <div className="lg:col-span-6 bg-white dark:bg-slate-900 border-2 border-amber-300 dark:border-amber-700/60 rounded-2xl p-6 shadow-sm flex flex-col justify-between space-y-5">
            <div className="space-y-1">
              <div className="flex items-center justify-between pb-3 border-b border-amber-200 dark:border-amber-800/40 font-mono">
                <span className="text-sm font-bold text-amber-800 dark:text-amber-300 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                  <span>1. TRADITIONAL SILOED PLANNING</span>
                </span>
                <span className="px-3 py-1 rounded bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-300 text-xs font-bold border border-rose-200 dark:border-rose-800">
                  180 Min Total Corridor Block
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 pt-1">
                3 fragmented possessions submitted independently by separate divisional departments:
              </p>
            </div>

            {/* 3 Fragmented Blocks Visual */}
            <div className="space-y-3 font-mono text-xs">
              {/* Block 1: Engineering */}
              <div className="bg-amber-50/80 dark:bg-slate-800/90 p-4 rounded-xl border border-amber-200 dark:border-amber-700/50 space-y-2">
                <div className="flex justify-between items-center text-sm font-bold text-slate-900 dark:text-white">
                  <span className="flex items-center gap-2">
                    <Wrench className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                    <span>ENG B-011 (KM 68–80 DN)</span>
                  </span>
                  <span className="text-amber-800 dark:text-amber-300 bg-amber-100 dark:bg-amber-950 px-2 py-0.5 rounded text-xs">
                    22:00–22:50 (50 min)
                  </span>
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-300">
                  Continuous Tamping (CSM-04) • 22 Crew • 15 min Setup Overhead
                </div>
                <div className="text-xs font-bold text-rose-700 dark:text-rose-400 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Direct Conflict with Telangana Rajdhani (12723)</span>
                </div>
              </div>

              {/* Block 2: S&T */}
              <div className="bg-sky-50/80 dark:bg-slate-800/90 p-4 rounded-xl border border-sky-200 dark:border-sky-700/50 space-y-2">
                <div className="flex justify-between items-center text-sm font-bold text-slate-900 dark:text-white">
                  <span className="flex items-center gap-2">
                    <Radio className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                    <span>S&amp;T B-012 (KM 82–98 DN)</span>
                  </span>
                  <span className="text-sky-800 dark:text-sky-300 bg-sky-100 dark:bg-sky-950 px-2 py-0.5 rounded text-xs">
                    23:00–23:40 (40 min)
                  </span>
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-300">
                  Digital Axle Counter Overhaul • 12 Crew • 10 min Station Line Block Setup
                </div>
                <div className="text-xs text-amber-700 dark:text-amber-400">
                  Requires independent line clearance &amp; signal disconnection memo
                </div>
              </div>

              {/* Block 3: Traction TRD */}
              <div className="bg-orange-50/80 dark:bg-slate-800/90 p-4 rounded-xl border border-orange-200 dark:border-orange-700/50 space-y-2">
                <div className="flex justify-between items-center text-sm font-bold text-slate-900 dark:text-white">
                  <span className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                    <span>TRD B-013 (KM 70–94 DN)</span>
                  </span>
                  <span className="text-orange-800 dark:text-orange-300 bg-orange-100 dark:bg-orange-950 px-2 py-0.5 rounded text-xs">
                    00:00–00:45 (45 min)
                  </span>
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-300">
                  OHE Cantilever Bracket &amp; Insulator Wash • Tower Wagon • 15 min Earthing Overhead
                </div>
                <div className="text-xs font-bold text-rose-700 dark:text-rose-400 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Direct Conflict with Container Freight G/4217</span>
                </div>
              </div>
            </div>

            {/* Siloed Summary Footer */}
            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 text-xs font-mono space-y-1.5 text-slate-600 dark:text-slate-400">
              <div className="flex justify-between">
                <span>Traffic Disruptions:</span>
                <span className="text-rose-700 dark:text-rose-400 font-bold">3 Separate Line Block Halts</span>
              </div>
              <div className="flex justify-between">
                <span>Work Productivity Ratio:</span>
                <span className="text-amber-700 dark:text-amber-400 font-bold">0.58 Work-Min / Block-Min</span>
              </div>
            </div>
          </div>

          {/* RIGHT: 2. INTEGRATED CONSOLIDATED POSSESSION CONTAINER (6 Cols) */}
          <div
            className={cn(
              "lg:col-span-6 bg-white dark:bg-slate-900 border-2 rounded-2xl p-6 shadow-sm flex flex-col justify-between space-y-5 transition-all duration-300",
              isConsolidated
                ? "border-emerald-500 dark:border-emerald-500 shadow-lg ring-2 ring-emerald-500/20"
                : "border-slate-300 dark:border-slate-700"
            )}
          >
            <div className="space-y-1">
              <div className="flex items-center justify-between pb-3 border-b border-emerald-200 dark:border-emerald-800/40 font-mono">
                <span className="text-sm font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  <span>2. RAILBLOCK INTEGRATED POSSESSION</span>
                </span>
                <span className="px-3 py-1 rounded bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 text-xs font-bold border border-emerald-200 dark:border-emerald-800">
                  110 Min Single Window
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 pt-1">
                Unified co-location shadowing 3 departments simultaneously inside 1 window:
              </p>
            </div>

            {/* Single Consolidated Possession Visual */}
            <div className="space-y-3 font-mono text-xs">
              <div className="bg-emerald-50/80 dark:bg-slate-800/90 p-4 rounded-xl border border-emerald-300 dark:border-emerald-700/60 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-base text-slate-900 dark:text-white">
                    POSSESSION B-014 (KM 68–94 DN)
                  </span>
                  <span className="text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950 px-2.5 py-1 rounded text-xs font-bold border border-emerald-300 dark:border-emerald-700">
                    02:20–04:10 IST (110m)
                  </span>
                </div>

                {/* Co-located Task Strip */}
                <div className="space-y-2 pt-1">
                  <div className="flex items-center gap-2.5 text-xs text-slate-800 dark:text-slate-200">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" />
                    <span><strong>Engineering:</strong> 3 Tasks (Continuous Tamping, USFD Testing, Joint Packing)</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-slate-800 dark:text-slate-200">
                    <span className="w-2.5 h-2.5 rounded-full bg-sky-500 shrink-0" />
                    <span><strong>S&amp;T:</strong> 2 Tasks (Axle Counter Overhaul, Point Machine Renewal)</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-slate-800 dark:text-slate-200">
                    <span className="w-2.5 h-2.5 rounded-full bg-orange-500 shrink-0" />
                    <span><strong>Traction:</strong> 2 Tasks (25kV OHE Cantilever Bracket &amp; Power Block)</span>
                  </div>
                </div>

                <div className="pt-2.5 border-t border-emerald-200 dark:border-slate-700 flex justify-between text-xs text-emerald-800 dark:text-emerald-300 font-bold">
                  <span>Machinery: CTM-04 + Tower Wagon</span>
                  <span>Shared Crew: 47 Personnel</span>
                </div>
              </div>

              {/* Co-Location Operational Efficiencies */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2 text-xs">
                <span className="text-xs text-emerald-700 dark:text-emerald-400 font-bold uppercase tracking-wider block">
                  Measured Co-Location Efficiencies:
                </span>
                <div className="text-slate-700 dark:text-slate-300 space-y-1">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>Single corridor block setup &amp; safety protection (10m vs. 40m traditional overhead)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>Single 25kV OHE power de-energization window at SC-TSS</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>Zero express passenger train conflicts (Vande Bharat &amp; Rajdhani clear)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Integrated Summary Footer */}
            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 text-xs font-mono space-y-1.5 text-slate-600 dark:text-slate-400">
              <div className="flex justify-between">
                <span>Traffic Disruptions:</span>
                <span className="text-emerald-700 dark:text-emerald-400 font-bold">1 Single Protected Window</span>
              </div>
              <div className="flex justify-between">
                <span>Work Productivity Ratio:</span>
                <span className="text-emerald-700 dark:text-emerald-400 font-bold">0.82 Work-Min / Block-Min (+41%)</span>
              </div>
            </div>
          </div>
        </section>

        {/* 3. QUANTITATIVE IMPACT PANEL */}
        <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800 font-mono text-xs">
            <span className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>Consolidation Quantitative Impact (SEC–NDL Division)</span>
            </span>
            <Link
              href="/analysis"
              className="text-blue-700 dark:text-blue-400 font-bold hover:underline flex items-center gap-1"
            >
              <span>Detailed Backtest Analytics</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 font-mono text-xs">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
              <span className="text-slate-500 dark:text-slate-400 font-medium">POSSESSIONS</span>
              <div className="text-xl font-bold text-slate-900 dark:text-white mt-1">3 → 1</div>
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">-67% Fewer Closures</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
              <span className="text-slate-500 dark:text-slate-400 font-medium">TOTAL BLOCKED TIME</span>
              <div className="text-xl font-bold text-slate-900 dark:text-white mt-1">180m → 110m</div>
              <span className="text-blue-600 dark:text-blue-400 font-bold">70 Minutes Saved</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
              <span className="text-slate-500 dark:text-slate-400 font-medium">WORK UTILIZATION</span>
              <div className="text-xl font-bold text-slate-900 dark:text-white mt-1">58% → 82%</div>
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">+41% Productivity</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
              <span className="text-slate-500 dark:text-slate-400 font-medium">TRAIN CONFLICTS</span>
              <div className="text-xl font-bold text-slate-900 dark:text-white mt-1">2 → 0</div>
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">Zero Delays</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
              <span className="text-slate-500 dark:text-slate-400 font-medium">SETUP OVERHEAD</span>
              <div className="text-xl font-bold text-slate-900 dark:text-white mt-1">40m → 10m</div>
              <span className="text-purple-600 dark:text-purple-400 font-bold">30m Idle Overhead Avoided</span>
            </div>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
