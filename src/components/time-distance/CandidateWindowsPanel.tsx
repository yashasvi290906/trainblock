"use client";

import React from "react";
import { CandidateWindow } from "./types";
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  Layers,
  ArrowRight,
  ShieldAlert,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface CandidateWindowsPanelProps {
  candidateWindows: CandidateWindow[];
  selectedCandidateId: string | null;
  onSelectCandidate: (w: CandidateWindow) => void;
  onApplyCandidate: (w: CandidateWindow) => void;
}

export function CandidateWindowsPanel({
  candidateWindows,
  selectedCandidateId,
  onSelectCandidate,
  onApplyCandidate,
}: CandidateWindowsPanelProps) {
  return (
    <div className="bg-white dark:bg-[#091326] border border-slate-200 dark:border-[#162744] rounded-xl p-4 space-y-3.5 select-none transition-colors">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-[#182a4d]">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-sky-600 dark:text-sky-400" />
          <h3 className="text-xs font-mono font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            CANDIDATE WINDOWS
          </h3>
        </div>
        <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-[#060c18] px-2 py-0.5 rounded border border-slate-200 dark:border-[#172b4c]">
          3 COMPARATIVE SLOTS
        </span>
      </div>

      <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed font-sans">
        Objective evaluation of available possession intervals along the SEC–NDL section (KM 68–94) against protected passenger paths and freight paths.
      </p>

      {/* Candidate Cards Grid */}
      <div className="space-y-2.5">
        {candidateWindows.map((win) => {
          const isSelected = selectedCandidateId === win.id;

          return (
            <div
              key={win.id}
              onClick={() => onSelectCandidate(win)}
              className={cn(
                "p-3 rounded-lg border transition-all cursor-pointer font-mono text-xs relative active:scale-98",
                isSelected
                  ? "bg-sky-50/70 dark:bg-[#0d1c38] border-sky-500 shadow-md ring-1 ring-sky-500/50"
                  : "bg-slate-50 dark:bg-[#060c18] border-slate-200 dark:border-[#152544] hover:border-slate-400 dark:hover:border-slate-500 hover:bg-slate-100/70 dark:hover:bg-[#0a1528]"
              )}
            >
              {/* Top Row: Name, Time, Status Badge */}
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 dark:text-white">{win.name}</span>
                  <span className="text-sky-700 dark:text-sky-300 font-bold">
                    {win.startTime}–{win.endTime}
                  </span>
                </div>

                {win.status === "CONFLICT" && (
                  <span className="px-2 py-0.5 rounded bg-rose-100 dark:bg-red-950/70 border border-rose-300 dark:border-red-800/60 text-rose-800 dark:text-red-300 font-bold text-[10px] flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3 text-rose-600 dark:text-red-400" />
                    CONFLICT
                  </span>
                )}

                {win.status === "FEASIBLE" && (
                  <span className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/70 border border-emerald-300 dark:border-emerald-800/60 text-emerald-800 dark:text-emerald-300 font-bold text-[10px] flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                    FEASIBLE
                  </span>
                )}

                {win.status === "PARTIAL" && (
                  <span className="px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950/70 border border-amber-300 dark:border-amber-800/60 text-amber-800 dark:text-amber-300 font-bold text-[10px] flex items-center gap-1">
                    <Clock className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                    PARTIAL
                  </span>
                )}
              </div>

              {/* Middle Metrics: Passenger conflicts, Freight, Usable Mins */}
              <div className="grid grid-cols-3 gap-2 py-1.5 px-2 bg-slate-100 dark:bg-[#040812] rounded border border-slate-200 dark:border-[#111e35] text-[10px] mb-2">
                <div>
                  <span className="text-slate-500 block">Pax Conflicts:</span>
                  <span
                    className={cn(
                      "font-bold",
                      win.passengerConflicts > 0 ? "text-rose-600 dark:text-red-400" : "text-emerald-600 dark:text-emerald-400"
                    )}
                  >
                    {win.passengerConflicts}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block">Freight Int.:</span>
                  <span
                    className={cn(
                      "font-bold",
                      win.freightInteractions > 0 ? "text-amber-600 dark:text-amber-400" : "text-slate-700 dark:text-slate-300"
                    )}
                  >
                    {win.freightInteractions}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block">Usable Work:</span>
                  <span className="font-bold text-sky-700 dark:text-sky-300">{win.usableMin} min</span>
                </div>
              </div>

              {/* Bottom: Description & Apply Action */}
              <div className="flex items-center justify-between pt-1 text-[11px] font-sans">
                <span className="text-slate-500 dark:text-slate-400 line-clamp-1">{win.description}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onApplyCandidate(win);
                  }}
                  className="px-2.5 py-1 rounded bg-slate-200 hover:bg-sky-600 hover:text-white dark:bg-[#102344] dark:hover:bg-sky-600 dark:hover:text-black border border-slate-300 dark:border-sky-500/40 text-sky-800 dark:text-sky-300 font-mono text-[10px] font-bold transition-all flex items-center gap-1 ml-2 flex-shrink-0 active:scale-95"
                >
                  <span>Apply</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
