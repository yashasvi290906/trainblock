"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  TrainTrack,
  Menu,
  X,
  Info,
  Database,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  Cpu,
  Layers,
  ArrowRight,
  Sun,
  Moon
} from "lucide-react";
import { InputSourcesModal } from "@/components/common/InputSourcesModal";
import { usePlanningRun } from "@/context/PlanningRunContext";
import { useTheme } from "@/context/ThemeContext";

interface HeaderProps {
  onToggleMobileMenu?: () => void;
  isMobileMenuOpen?: boolean;
}

export function Header({ onToggleMobileMenu, isMobileMenuOpen }: HeaderProps) {
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [showSourcesModal, setShowSourcesModal] = useState(false);
  const { currentRun, resetDemo, loading, isBackend } = usePlanningRun();
  const { theme, toggleTheme } = useTheme();

  const solverStatus = currentRun?.solver_result?.solver_status || "OPTIMAL";
  const runId = currentRun?.planning_run_id || "RB-2026-09-23";
  const isValidated = currentRun?.validation_result?.overall_status === "VALIDATED";

  return (
    <header className="bg-[#070A12]/95 backdrop-blur-md text-slate-100 border-b border-white/10 shrink-0 select-none z-30">
      {/* Top Technical Control Strip */}
      <div className="h-13 px-4 sm:px-6 flex items-center justify-between">
        {/* Brand & Division Identifier */}
        <div className="flex items-center gap-3">
          {onToggleMobileMenu && (
            <button
              onClick={onToggleMobileMenu}
              className="md:hidden p-1.5 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          )}

          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-amber-600 text-white flex items-center justify-center font-mono font-black text-xs shadow-md shadow-orange-500/20 group-hover:scale-105 transition-all">
              <TrainTrack className="w-4 h-4 text-white" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-black text-white font-mono text-base tracking-tight">
                  Train<span className="text-orange-500">Block AI</span>
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse shadow-[0_0_8px_#f97316]" />
              </div>
              <span className="text-[10px] text-slate-400 font-medium">
                Indian Railways · SIH PS 26027
              </span>
            </div>
          </Link>

          <div className="hidden lg:flex items-center gap-2 pl-3 border-l border-slate-800 text-xs font-mono text-slate-400">
            <span className="text-orange-400 font-bold">SEC–NDL CORRIDOR</span>
            <span>·</span>
            <span className="text-slate-300">KM 40–120 (Double Line)</span>
          </div>
        </div>

        {/* Real-Time Planning Telemetry Strip & Quick Actions */}
        <div className="flex items-center gap-2 sm:gap-3 text-xs font-mono">
          {/* Active Planning Run Telemetry */}
          <div className="hidden md:flex items-center gap-2 px-2.5 py-1 rounded bg-slate-800/90 border border-slate-700/80 text-[11px]">
            <span className="flex items-center gap-1 text-slate-300">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-slate-400 font-medium">RUN:</span>
              <span className="font-bold text-white">{runId}</span>
            </span>
            <span className="text-slate-600">|</span>
            <span className="flex items-center gap-1 text-slate-300">
              <Cpu className="w-3 h-3 text-sky-400" />
              <span className="text-sky-300 font-bold">{solverStatus}</span>
            </span>
            <span className="text-slate-600">|</span>
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              <span className={isValidated ? "text-emerald-400 font-bold" : "text-amber-400 font-bold"}>
                {isValidated ? "VALIDATED" : "OVERRIDE"}
              </span>
            </span>
          </div>

          {/* 6 Ingestion Feeds Inspector */}
          <button
            onClick={() => setShowSourcesModal(true)}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-[11px] font-medium transition-colors cursor-pointer"
            title="Inspect the 6 Canonical Input Sources (TMS, SMMS, TDMS, COA, Goods, Corridors)"
          >
            <Database className="w-3 h-3 text-blue-400" />
            <span>6 Feeds</span>
            <span className="px-1 py-0.2 rounded bg-blue-900/60 text-blue-200 text-[9px] font-bold">
              {currentRun?.input_summary?.total_maintenance_demands || 47}
            </span>
          </button>

          {/* Synthetic Prototype Notice */}
          <button
            onClick={() => setShowInfoModal(true)}
            className="hidden xl:flex items-center gap-1 px-2 py-1 rounded bg-amber-950/40 hover:bg-amber-950/70 border border-amber-700/50 text-amber-300 text-[11px] transition-colors cursor-pointer"
            title="Synthetic Prototype Disclosure"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            <span>SYNTHETIC</span>
            <Info className="w-2.5 h-2.5" />
          </button>

          {/* Judge Demo Workstation Launcher */}
          <Link
            href="/demo"
            className="flex items-center gap-1.5 px-3 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-bold shadow-xs transition-colors cursor-pointer border border-blue-400"
            title="Launch 5-7 minute guided SIH Evaluator Walkthrough"
          >
            <Sparkles className="w-3 h-3 text-blue-200" />
            <span>JUDGE DEMO</span>
          </Link>

          {/* Reset Demo State */}
          <button
            onClick={() => resetDemo()}
            disabled={loading}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-[11px] border border-slate-700 transition-colors cursor-pointer disabled:opacity-50"
            title="Restore clean baseline dataset and generate a fresh planning run"
          >
            <RotateCcw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">RESET</span>
          </button>

          {/* Theme Toggle (Light / Dark) */}
          <button
            onClick={toggleTheme}
            className="flex items-center justify-center w-7 h-7 rounded bg-slate-800 hover:bg-slate-700 text-amber-300 hover:text-amber-200 border border-slate-700 transition-colors cursor-pointer"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-blue-300" />}
          </button>
        </div>
      </div>

      {/* Prototype Disclosure Dialog */}
      {showInfoModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-lg p-5 max-w-md w-full shadow-2xl space-y-3 font-sans text-slate-900 animate-scaleUp">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2 font-bold text-slate-900 text-sm font-mono">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                <span>Synthetic Prototype Data Disclosure</span>
              </div>
              <button
                onClick={() => setShowInfoModal(false)}
                className="text-slate-400 hover:text-slate-700 text-xs font-mono p-1"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              This prototype operates on realistic synthetic data calibrated to South Central Railway standards (SEC–NDL Corridor). Live integration with TMS / SMMS / TDMS / COA / BDMS requires CRIS and Railway Board authorization.
            </p>

            <div className="p-3 bg-slate-50 rounded border border-slate-200 space-y-1 text-xs font-mono text-slate-700">
              <div>Problem Statement: <span className="font-bold text-slate-900">26027 (SIH 2026)</span></div>
              <div>Active Run ID: <span className="text-blue-700 font-bold">{runId}</span></div>
              <div>Solver Engine: <span className="text-emerald-700 font-bold">Google OR-Tools CP-SAT</span></div>
              <div>Prioritizer: <span className="text-indigo-700 font-bold">Safety Rules (P1-P4) + XGBoost</span></div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowInfoModal(false)}
                className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded text-xs font-medium"
              >
                Understood
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6 Ingestion Feeds Modal */}
      <InputSourcesModal
        isOpen={showSourcesModal}
        onClose={() => setShowSourcesModal(false)}
      />
    </header>
  );
}
