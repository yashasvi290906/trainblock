"use client";

import React from "react";
import Link from "next/link";
import {
  Settings,
  Radio,
  Cpu,
  Database,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ArrowRight,
  Info,
  Server,
  Terminal,
} from "lucide-react";
import { APP_CONFIG } from "@/lib/constants";

export default function SystemSettingsPage() {
  const feeds = [
    {
      id: "TMS",
      name: "Train Management System (TMS)",
      type: "Live Track Occupancy & Signal Aspects",
      status: "SIMULATED / ONLINE",
      latency: "14ms",
      records: "1,240 events/min",
      state: "NORMAL",
    },
    {
      id: "SMMS",
      name: "Track & S&T Asset Management (SMMS/USFD)",
      type: "Safety Defect Work Orders & Urgent Tasks",
      status: "SIMULATED / ONLINE",
      latency: "38ms",
      records: "18 active work orders",
      state: "NORMAL",
    },
    {
      id: "TDMS",
      name: "Traction Distribution Management (TDMS)",
      type: "25kV AC OHE Electrical Switching & Isolation",
      status: "SIMULATED / ONLINE",
      latency: "22ms",
      records: "4 feeding sections (SC-TSS)",
      state: "NORMAL",
    },
    {
      id: "COA",
      name: "Control Office Application (COA)",
      type: "Working Timetable & Passenger String Paths",
      status: "SYNTHETIC TIMETABLE / ONLINE",
      latency: "19ms",
      records: "6 active train movements",
      state: "NORMAL",
    },
    {
      id: "FOIS",
      name: "Freight Operations Information System (FOIS)",
      type: "Container & Freight Movement Forecasts",
      status: "SIMULATED / ONLINE",
      latency: "45ms",
      records: "Freight path G/4217",
      state: "NORMAL",
    },
  ];

  const engineComponents = [
    {
      name: "Multi-Departmental Task Combinator",
      status: "READY",
      type: "Spatial Clustering (KM 68–94)",
      description: "Groups Engineering, S&T, and Traction tasks within 15km co-location thresholds.",
    },
    {
      name: "CP-SAT Constraint Satisfaction Engine",
      status: "READY (PROTOTYPE LOGIC)",
      type: "Mathematical Optimizer",
      description: "Generates zero-conflict maintenance windows satisfying headway and buffer rules.",
    },
    {
      name: "Timetable Conflict Evaluator",
      status: "ACTIVE",
      type: "Marey Trajectory Intersect",
      description: "Evaluates passenger train string intersections against planned maintenance bands.",
    },
    {
      name: "Scenario Simulation Engine",
      status: "READY",
      type: "What-If Resilience Pipeline",
      description: "Deterministic evaluation of operational disruptions and fallback slot candidate rankings.",
    },
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] bg-[#070e1c] text-slate-100 overflow-hidden select-none font-mono">
      {/* 1. TOP OPERATIONAL HEADER */}
      <div className="flex-shrink-0 h-12 bg-[#0c1527] border-b border-[#182744] px-4 flex items-center justify-between text-xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Settings className="w-4 h-4 text-sky-400" />
            <span className="font-bold text-white tracking-wider">SYSTEM CONFIGURATION & DATA PROVENANCE</span>
          </div>
          <span className="text-slate-600">|</span>
          <span className="text-slate-300">Input Feeds & Engine Health</span>
          <span className="text-slate-600">|</span>
          <span className="px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[10px] font-bold">
            PROTOTYPE ENVIRONMENT
          </span>
        </div>

        <Link
          href="/control"
          className="flex items-center gap-1 px-2.5 py-1 bg-[#132038] hover:bg-[#1a2c4e] border border-[#22365e] text-sky-400 rounded text-xs"
        >
          <span>Control Room</span>
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      {/* 2. MAIN CONTENT AREA */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* System Overview Banner */}
        <div className="bg-[#091326] p-4 rounded-xl border border-[#162747] space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <h3 className="font-bold text-white text-sm">
                RAILBLOCK Prototype System Architecture • Problem Statement ID: 26027
              </h3>
            </div>
            <span className="text-xs text-sky-400 font-bold">{APP_CONFIG.organization}</span>
          </div>
          <p className="text-xs text-slate-300 font-sans leading-relaxed">
            This prototype demonstrates the automated synthesis and scheduling of multi-departmental railway maintenance possessions for the Secunderabad Division (SEC–NDL Corridor). All operational feeds are calibrated against realistic Indian Railways dispatching constraints.
          </p>
        </div>

        {/* FEED STATUS GRID */}
        <div className="bg-[#091326] p-4 rounded-xl border border-[#162747] space-y-3">
          <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
            <Radio className="w-4 h-4 text-emerald-400" />
            Input Data Feeds & System Connectivity (Simulated Prototype)
          </span>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {feeds.map((feed) => (
              <div
                key={feed.id}
                className="p-3 rounded-lg bg-[#060c18] border border-[#14233e] space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sky-300 text-sm">{feed.id}</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold">
                    {feed.status}
                  </span>
                </div>
                <div className="text-[11px] text-white font-bold">{feed.name}</div>
                <div className="text-[10px] text-slate-400 font-sans">{feed.type}</div>
                <div className="pt-2 border-t border-[#14233e] flex justify-between text-[10px] text-slate-400">
                  <span>Latency: {feed.latency}</span>
                  <span className="text-slate-200">{feed.records}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ENGINE COMPONENTS STATUS */}
        <div className="bg-[#091326] p-4 rounded-xl border border-[#162747] space-y-3">
          <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
            <Cpu className="w-4 h-4 text-sky-400" />
            Core Planning & Optimization Engines
          </span>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            {engineComponents.map((eng, idx) => (
              <div
                key={idx}
                className="p-3 rounded-lg bg-[#060c18] border border-[#14233e] space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">{eng.name}</span>
                  <span className="text-emerald-400 font-bold text-[10px]">{eng.status}</span>
                </div>
                <span className="text-[10px] text-sky-400 uppercase">{eng.type}</span>
                <p className="text-[11px] text-slate-300 font-sans leading-relaxed">{eng.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CALIBRATION & AUDIT EVIDENCE FOOTER */}
        <div className="p-3.5 bg-[#060c18] rounded-xl border border-[#14233e] text-xs space-y-2">
          <span className="font-bold text-amber-300 uppercase text-[11px] flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            Synthetic Environment Calibration Notes:
          </span>
          <p className="text-[11px] text-slate-300 font-sans leading-relaxed">
            Timetable headway margins are set to 15 minutes for passenger trains and 20 minutes for freight. Track tamping machine speeds are calibrated to 1.2 km/h usable work rate with 15-minute entrance/exit protection overhead. All metrics reflect mathematically reproducible synthetic data.
          </p>
        </div>
      </div>
    </div>
  );
}
