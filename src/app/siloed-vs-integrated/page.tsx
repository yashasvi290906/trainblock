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
  HardHat,
  Train as TrainIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function SiloedVsIntegratedPage() {
  const [isConsolidated, setIsConsolidated] = useState(false);
  const [activeStep, setActiveStep] = useState<number>(0);

  const handleConsolidate = () => {
    setIsConsolidated(true);
    setActiveStep(3);
  };

  const handleReset = () => {
    setIsConsolidated(false);
    setActiveStep(0);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] bg-[#070e1c] text-slate-100 overflow-hidden select-none">
      {/* 1. TOP HEADER */}
      <div className="flex-shrink-0 h-12 bg-[#0c1527] border-b border-[#182744] px-4 flex items-center justify-between text-xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <SplitSquareVertical className="w-4 h-4 text-sky-400" />
            <span className="font-bold text-white tracking-wider font-mono">SILOED VS. INTEGRATED</span>
          </div>
          <span className="text-slate-600">|</span>
          <span className="font-mono text-slate-300">Multi-Departmental Possession Consolidation Demonstration</span>
          <span className="text-slate-600">|</span>
          <span className="px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono text-[10px] font-bold">
            SYNTHETIC OPERATIONAL SCENARIO
          </span>
        </div>

        {/* Trigger Button */}
        <div className="flex items-center gap-3 font-mono text-xs">
          {!isConsolidated ? (
            <button
              onClick={handleConsolidate}
              className="flex items-center gap-1.5 px-3 py-1 bg-sky-600 hover:bg-sky-500 text-black font-bold rounded shadow transition-all"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>CONSOLIDATE POSSESSIONS (3 → 1)</span>
            </button>
          ) : (
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 px-3 py-1 bg-[#13223f] hover:bg-[#1a2d54] border border-[#23385e] text-slate-300 rounded transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset to Siloed Baseline</span>
            </button>
          )}

          <Link
            href="/block-planner"
            className="flex items-center gap-1 px-2.5 py-1 bg-[#132038] hover:bg-[#1a2c4e] border border-[#22365e] text-sky-400 rounded"
          >
            <span>Block Planner</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* 2. MAIN WORKSPACE: TIMELINE ANIMATION (65%) + RIGHT COMPARISON SUMMARY (35%) */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* LEFT: INTERACTIVE COMPARISON SCENE */}
        <div className="flex-1 flex flex-col bg-[#050b17] p-4 overflow-y-auto space-y-4 border-r border-[#182744]">
          {/* Concept Headline */}
          <div className="bg-[#091326] p-4 rounded-xl border border-[#162747] space-y-1.5">
            <h3 className="text-sm font-bold text-white font-mono flex items-center gap-2">
              <span>Problem Statement Core: Single-Department Bidding vs. Unified Cross-Functional Windows</span>
            </h3>
            <p className="text-xs text-slate-300 font-sans leading-relaxed">
              Traditional Indian Railways practice involves Engineering, S&T, and Traction submitting isolated block requests at different times, creating fragmented corridor occupations, machine idling, and repeated passenger train regulation. RAILBLOCK consolidates co-located tasks into one protected shadow window.
            </p>
          </div>

          {/* SIDE-BY-SIDE VISUAL TIMELINE CONTAINERS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
            {/* 1. SILOED BASELINE CONTAINER */}
            <div className="bg-[#091224] p-4 rounded-xl border border-amber-900/40 flex flex-col justify-between space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-[#182a4d]">
                <span className="font-mono text-xs font-bold text-amber-300 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  TRADITIONAL SILOED PLANNING (3 POSSESSIONS)
                </span>
                <span className="px-2 py-0.5 rounded bg-red-500/20 text-red-300 text-[10px] font-mono font-bold">
                  180 Min Total Blocked
                </span>
              </div>

              {/* 3 Fragmented Blocks Visual */}
              <div className="space-y-3">
                {/* Block 1: Engineering */}
                <div className="bg-[#0e1626] p-2.5 rounded-lg border border-amber-500/30 space-y-1 font-mono text-xs">
                  <div className="flex justify-between text-[11px] text-amber-300 font-bold">
                    <span>1. ENG B-011 (KM 68–80)</span>
                    <span>22:00–22:50 (50 min)</span>
                  </div>
                  <div className="text-[10px] text-slate-400">
                    Continuous Tamping (CSM) • 22 Crew • 15 min Setup Overhead
                  </div>
                  <div className="text-[10px] text-red-400 font-bold">
                    ⚠ Conflicts with Telangana Rajdhani (12723)
                  </div>
                </div>

                {/* Block 2: S&T */}
                <div className="bg-[#0e1626] p-2.5 rounded-lg border border-sky-500/30 space-y-1 font-mono text-xs">
                  <div className="flex justify-between text-[11px] text-sky-300 font-bold">
                    <span>2. S&T B-012 (KM 82–98)</span>
                    <span>23:00–23:40 (40 min)</span>
                  </div>
                  <div className="text-[10px] text-slate-400">
                    Axle Counter Overhaul • 12 Crew • 10 min Setup Overhead
                  </div>
                  <div className="text-[10px] text-amber-400">
                    Separate line clearance required
                  </div>
                </div>

                {/* Block 3: Traction TRD */}
                <div className="bg-[#0e1626] p-2.5 rounded-lg border border-orange-500/30 space-y-1 font-mono text-xs">
                  <div className="flex justify-between text-[11px] text-orange-300 font-bold">
                    <span>3. TRD B-013 (KM 70–94)</span>
                    <span>00:00–00:45 (45 min)</span>
                  </div>
                  <div className="text-[10px] text-slate-400">
                    OHE Cantilever Wash • Tower Wagon • 15 min Earthing Overhead
                  </div>
                  <div className="text-[10px] text-red-400 font-bold">
                    ⚠ Conflicts with Freight G/4217
                  </div>
                </div>
              </div>

              {/* Siloed Summary Footer */}
              <div className="pt-2 border-t border-[#182a4d] text-xs font-mono space-y-1 text-slate-400">
                <div className="flex justify-between">
                  <span>Corridor Traffic Idle Gap:</span>
                  <span className="text-red-400 font-bold">3 Separate Traffic Halts</span>
                </div>
                <div className="flex justify-between">
                  <span>Work Productivity:</span>
                  <span className="text-amber-400">0.58 Work-Min / Block-Min</span>
                </div>
              </div>
            </div>

            {/* 2. INTEGRATED CONSOLIDATED POSSESSION CONTAINER */}
            <div
              className={cn(
                "bg-[#091224] p-4 rounded-xl border flex flex-col justify-between space-y-3 transition-all",
                isConsolidated
                  ? "border-emerald-500/60 shadow-[0_0_20px_rgba(16,185,129,0.15)]"
                  : "border-[#162747]"
              )}
            >
              <div className="flex items-center justify-between pb-2 border-b border-[#182a4d]">
                <span className="font-mono text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  RAILBLOCK INTEGRATED POSSESSION (B-014)
                </span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold">
                  110 Min Single Window
                </span>
              </div>

              {/* Single Consolidated Possession Visual */}
              <div className="space-y-3">
                <div className="bg-[#0b1b2d] p-3.5 rounded-lg border border-emerald-500/40 space-y-2 font-mono text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-emerald-300 text-sm">B-014 (KM 68–94 DN Line)</span>
                    <span className="text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded text-[10px] font-bold">
                      02:20–04:10 IST
                    </span>
                  </div>

                  {/* Co-located Task Strip */}
                  <div className="space-y-1.5 pt-1">
                    <div className="flex items-center gap-2 text-[11px] text-slate-200">
                      <span className="w-2 h-2 rounded-full bg-amber-400" />
                      <span>Engineering: 3 Tasks (Tamping, USFD Testing, Joints)</span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-slate-200">
                      <span className="w-2 h-2 rounded-full bg-sky-400" />
                      <span>S&T: 2 Tasks (Axle Counter Overhaul, Point Machine)</span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-slate-200">
                      <span className="w-2 h-2 rounded-full bg-orange-400" />
                      <span>Traction: 2 Tasks (25kV OHE Power Block Shared)</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[#1a3354] flex justify-between text-[11px] text-emerald-300 font-bold">
                    <span>Combined Machinery: CSM + Tower Wagon</span>
                    <span>Crew: 47 Shared</span>
                  </div>
                </div>

                {/* Benefits Callout */}
                <div className="p-2.5 rounded bg-[#060c18] border border-[#14233e] space-y-1 font-mono text-xs text-slate-300">
                  <span className="text-[10px] text-emerald-400 font-bold uppercase">Co-location Efficiencies:</span>
                  <div className="text-[11px] text-slate-200 space-y-0.5">
                    <div>✓ Single corridor setup & protection overhead (10 min vs. 35 min)</div>
                    <div>✓ Single 25kV OHE de-energization window for SC-TSS</div>
                    <div>✓ 0 Timetable train conflicts (VB-2061 & Rajdhani cleared)</div>
                  </div>
                </div>
              </div>

              {/* Integrated Summary Footer */}
              <div className="pt-2 border-t border-[#182a4d] text-xs font-mono space-y-1 text-slate-400">
                <div className="flex justify-between">
                  <span>Corridor Traffic Idle Gap:</span>
                  <span className="text-emerald-400 font-bold">1 Single Protected Window</span>
                </div>
                <div className="flex justify-between">
                  <span>Work Productivity:</span>
                  <span className="text-emerald-300 font-bold">0.82 Work-Min / Block-Min (+41%)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: QUANTITATIVE IMPACT PANEL (35%) */}
        <div className="w-full lg:w-80 flex-shrink-0 bg-[#081121] border-l border-[#182744] p-4 flex flex-col justify-between overflow-y-auto">
          <div className="space-y-4 font-mono text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-[#1b2b4d]">
              <span className="font-bold text-white uppercase text-xs flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-sky-400" />
                Consolidation KPI Impact
              </span>
              <span className="text-[10px] text-sky-400 bg-sky-950 px-2 py-0.5 rounded border border-sky-800/40">
                SEC–NDL
              </span>
            </div>

            {/* KPI Card */}
            <div className="bg-[#0b152b] p-3 rounded-lg border border-[#162540] space-y-2">
              <span className="text-[10px] text-slate-400 uppercase font-bold">Measured Operational Gains:</span>
              <div className="space-y-1.5 text-slate-300 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-slate-400">Possession Count:</span>
                  <span className="text-emerald-400 font-bold">3 → 1 (-67%)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Total Blocked Time:</span>
                  <span className="text-sky-300 font-bold">180m → 110m (-39%)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Work Utilization:</span>
                  <span className="text-emerald-400 font-bold">58% → 82% (+41%)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Train Conflicts:</span>
                  <span className="text-emerald-400 font-bold">2 → 0 (Resolved)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Setup Overhead Saved:</span>
                  <span className="text-white font-bold">25 Minutes</span>
                </div>
              </div>
            </div>

            {/* CAG Problem Justification */}
            <div className="bg-[#060c18] p-3 rounded-lg border border-[#14233e] space-y-1.5 text-[11px] font-sans">
              <span className="text-[10px] text-amber-300 font-mono font-bold uppercase block">CAG Audit Ground Truth:</span>
              <p className="text-slate-300 leading-relaxed">
                Operating controllers frequently refuse isolated departmental blocks because each request requires independent line block orders and station interlocking setup. Consolidating 3 departments into 1 block guarantees higher granting approval probability.
              </p>
            </div>
          </div>

          {/* Quick Action Navigation */}
          <div className="pt-3 border-t border-[#182744] space-y-2 font-mono text-xs">
            <span className="text-[10px] text-slate-400 uppercase font-bold">Proceed in Workflow:</span>
            <Link
              href="/analysis"
              className="w-full py-2 px-3 bg-sky-600 hover:bg-sky-500 text-black font-bold rounded flex items-center justify-center gap-1.5 shadow"
            >
              <span>View Full Plan Analysis →</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
