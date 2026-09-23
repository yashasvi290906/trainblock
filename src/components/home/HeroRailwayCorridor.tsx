"use client";

import React, { useState, useEffect } from "react";
import { Wrench, Zap, Radio, Shield, CheckCircle2, Train as TrainIcon, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

export function HeroRailwayCorridor() {
  const [trainPos1, setTrainPos1] = useState(15);
  const [trainPos2, setTrainPos2] = useState(85);
  const [activeTab, setActiveTab] = useState<"INTEGRATED" | "CONVERGENCE">("INTEGRATED");

  useEffect(() => {
    const interval = setInterval(() => {
      setTrainPos1((prev) => (prev >= 95 ? 5 : prev + 0.35));
      setTrainPos2((prev) => (prev <= 5 ? 95 : prev - 0.3));
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full bg-white rounded-2xl border border-slate-200/80 shadow-xl overflow-hidden text-slate-800">
      {/* Top Console Bar */}
      <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 font-bold text-slate-900">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>SEC–NDL CORRIDOR</span>
          </div>
          <span className="text-slate-300">|</span>
          <span className="text-slate-600">KM 40 → KM 120 (Double Line)</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab("INTEGRATED")}
            className={cn(
              "px-2.5 py-1 rounded text-[11px] font-semibold transition-all",
              activeTab === "INTEGRATED"
                ? "bg-blue-700 text-white shadow-sm"
                : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
            )}
          >
            Integrated Block View
          </button>
          <button
            onClick={() => setActiveTab("CONVERGENCE")}
            className={cn(
              "px-2.5 py-1 rounded text-[11px] font-semibold transition-all",
              activeTab === "CONVERGENCE"
                ? "bg-blue-700 text-white shadow-sm"
                : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
            )}
          >
            3 Depts → 1 Possession
          </button>
        </div>
      </div>

      {/* Main Railway Canvas */}
      <div className="p-6 bg-slate-50/50 space-y-6">
        {/* Convergence Diagram Mode */}
        {activeTab === "CONVERGENCE" && (
          <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-3 animate-fadeIn">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="font-bold text-slate-900 uppercase">Multi-Departmental Demand Synthesis</span>
              <span className="text-blue-700 font-semibold">Consolidated into B-014</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              {/* Engineering */}
              <div className="p-3 rounded-lg bg-amber-50/70 border border-amber-200 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-amber-900">
                  <Wrench className="w-3.5 h-3.5 text-amber-600" />
                  <span>Engineering (ENG)</span>
                </div>
                <p className="text-[11px] text-slate-600">Track tamping & USFD rail defect inspection (KM 68–84)</p>
                <span className="inline-block text-[10px] font-mono font-semibold text-amber-800 bg-amber-100/80 px-2 py-0.5 rounded">
                  3 Tasks • CSM Tamping Machine
                </span>
              </div>

              {/* S&T */}
              <div className="p-3 rounded-lg bg-sky-50/70 border border-sky-200 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-sky-900">
                  <Radio className="w-3.5 h-3.5 text-sky-600" />
                  <span>Signalling & Telecom (S&T)</span>
                </div>
                <p className="text-[11px] text-slate-600">Digital Axle Counter & Point machine overhaul (KM 76)</p>
                <span className="inline-block text-[10px] font-mono font-semibold text-sky-800 bg-sky-100/80 px-2 py-0.5 rounded">
                  2 Tasks • Point Testing Team
                </span>
              </div>

              {/* Traction */}
              <div className="p-3 rounded-lg bg-emerald-50/70 border border-emerald-200 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-emerald-900">
                  <Zap className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Traction Distribution (TRD)</span>
                </div>
                <p className="text-[11px] text-slate-600">25kV OHE Cantilever bracket & insulator wash (KM 68–94)</p>
                <span className="inline-block text-[10px] font-mono font-semibold text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded">
                  2 Tasks • Tower Wagon TW-09
                </span>
              </div>
            </div>

            {/* Convergence Result Arrow */}
            <div className="flex items-center justify-center pt-2">
              <div className="px-4 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-mono font-bold flex items-center gap-2">
                <span>3 Departmental Demands</span>
                <span>→</span>
                <span className="text-blue-900">1 Unified Possession B-014 (02:20–04:10 • 110 min)</span>
              </div>
            </div>
          </div>
        )}

        {/* Physical Railway Corridor Schematic Visual */}
        <div className="relative bg-white rounded-xl border border-slate-200/90 p-5 shadow-inner overflow-hidden">
          {/* Station / Kilometer Labels Header */}
          <div className="flex justify-between items-center text-[11px] font-mono text-slate-500 border-b border-slate-200 pb-2 mb-4">
            <span className="font-bold text-slate-800">SEC (KM 40)</span>
            <span>LBN (KM 58)</span>
            <span className="font-bold text-slate-800">KCG (KM 76)</span>
            <span>MCL (KM 98)</span>
            <span className="font-bold text-slate-800">NDL (KM 120)</span>
          </div>

          {/* OHE Catenary Wire & Overhead Insulators */}
          <div className="h-4 border-b border-dashed border-slate-300 relative flex justify-between px-2 mb-3">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="w-1 h-3 bg-slate-400 rounded-t" />
                <div className="w-2 h-1 bg-amber-500/70" />
              </div>
            ))}
          </div>

          {/* Track 1: UP Line (Westbound, Towards Secunderabad) */}
          <div className="relative h-14 bg-slate-100 rounded-lg border border-slate-300 flex items-center overflow-hidden mb-5">
            {/* Sleepers Pattern */}
            <div
              className="absolute inset-0 opacity-25"
              style={{
                backgroundImage: "repeating-linear-gradient(90deg, #94a3b8, #94a3b8 6px, transparent 6px, transparent 14px)",
              }}
            />
            {/* Steel Rail Lines */}
            <div className="absolute top-3 inset-x-0 h-0.5 bg-slate-500 shadow-sm" />
            <div className="absolute bottom-3 inset-x-0 h-0.5 bg-slate-500 shadow-sm" />

            {/* Line Identifier Tag */}
            <div className="absolute left-3 top-1 text-[9px] font-mono text-slate-500 font-bold uppercase tracking-wider">
              ← UP Line (Main Line: Max 130 km/h)
            </div>

            {/* Moving Train on UP Track (Telangana Rajdhani) */}
            <div
              className="absolute transform -translate-x-1/2 flex items-center z-10 transition-all duration-75"
              style={{ left: `${trainPos2}%` }}
            >
              <div className="flex items-center bg-red-700 text-white px-2 py-0.5 rounded shadow-md border border-red-800 text-[10px] font-mono font-bold">
                <div className="w-2 h-2 rounded-full bg-yellow-300 mr-1.5 shadow-[0_0_4px_#fef08a]" />
                <span>R-124 Rajdhani</span>
                <span className="ml-1 text-[8px] opacity-80">120 km/h</span>
              </div>
            </div>
          </div>

          {/* Track 2: DOWN Line (Eastbound, With Maintenance Block B-014) */}
          <div className="relative h-16 bg-slate-100 rounded-lg border border-slate-300 flex items-center overflow-hidden">
            {/* Sleepers Pattern */}
            <div
              className="absolute inset-0 opacity-25"
              style={{
                backgroundImage: "repeating-linear-gradient(90deg, #94a3b8, #94a3b8 6px, transparent 6px, transparent 14px)",
              }}
            />
            {/* Steel Rail Lines */}
            <div className="absolute top-3 inset-x-0 h-0.5 bg-slate-500 shadow-sm" />
            <div className="absolute bottom-3 inset-x-0 h-0.5 bg-slate-500 shadow-sm" />

            {/* Line Identifier Tag */}
            <div className="absolute left-3 top-1 text-[9px] font-mono text-slate-500 font-bold uppercase tracking-wider">
              → DN Line (Controlled Section)
            </div>

            {/* Physical Integrated Possession B-014 (KM 68–94) */}
            <div
              className="absolute top-1 bottom-1 bg-amber-500/20 border-2 border-amber-500 rounded-md flex flex-col justify-between p-1 z-0 shadow-sm"
              style={{ left: "42%", width: "35%" }}
            >
              <div className="flex items-center justify-between text-[9px] font-mono font-bold text-amber-900 bg-amber-100/90 px-1.5 py-0.5 rounded">
                <span className="flex items-center gap-1">
                  <Shield className="w-3 h-3 text-amber-700" />
                  PROTECTED BLOCK B-014 (KM 68–94)
                </span>
                <span>02:20–04:10 IST</span>
              </div>

              <div className="flex items-center justify-between text-[8.5px] font-mono text-amber-800 px-1">
                <span>ENG Tamping (CTM-04)</span>
                <span>S&T Overhaul</span>
                <span>TRD 25kV OHE Isolation</span>
              </div>
            </div>

            {/* Moving Train on DN Track (Vande Bharat Express) outside work zone */}
            <div
              className="absolute transform -translate-x-1/2 flex items-center z-10 transition-all duration-75"
              style={{ left: `${trainPos1 > 38 && trainPos1 < 80 ? 38 : trainPos1}%` }}
            >
              <div className="flex items-center bg-blue-700 text-white px-2 py-0.5 rounded shadow-md border border-blue-800 text-[10px] font-mono font-bold">
                <div className="w-2 h-2 rounded-full bg-yellow-300 mr-1.5 shadow-[0_0_4px_#fef08a]" />
                <span>VB-2061 Vande Bharat</span>
                <span className="ml-1 text-[8px] opacity-80">
                  {trainPos1 > 38 && trainPos1 < 80 ? "Holding Signal S-18" : "88 km/h"}
                </span>
              </div>
            </div>
          </div>

          {/* Bottom Operational Legend */}
          <div className="flex flex-wrap items-center justify-between gap-2 mt-4 pt-3 border-t border-slate-200 text-[11px] text-slate-600 font-mono">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                Passenger Service (Protected Headway)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-amber-500" />
                Integrated Possession Zone (B-014)
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-500 text-[10px]">
              <Clock className="w-3 h-3 text-slate-400" />
              <span>Deterministic Railway Simulation Loop</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
