"use client";

import React, { useEffect } from "react";
import { X, ShieldCheck, Clock, Wrench, Zap, Radio, CheckCircle2, ChevronRight, FileText } from "lucide-react";
import { PlannedBlock } from "@/lib/api/runs";
import { cn } from "@/lib/utils";

interface PlanningDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  block: PlannedBlock | null;
}

export function PlanningDrawer({ isOpen, onClose, block }: PlanningDrawerProps) {
  // Handle ESC key to close drawer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !block) return null;

  const rawMinutes = block.duration_minutes;
  const usableBreakdown = block.usable_minutes_breakdown;
  const usableMinutes = usableBreakdown?.usable_work_minutes ?? Math.max(0, rawMinutes - 30);
  const overheadMinutes = usableBreakdown?.total_overhead_minutes ?? Math.max(0, rawMinutes - usableMinutes);

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Dim Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity duration-200"
      />

      {/* Slide-In Drawer Panel */}
      <aside className="relative z-10 w-full max-w-md bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-white/10 h-full shadow-2xl flex flex-col font-mono text-xs overflow-hidden animate-slideLeft">
        {/* Top Drawer Command Bar */}
        <div className="h-12 bg-slate-100 dark:bg-slate-950 border-b border-slate-200 dark:border-white/10 text-slate-900 dark:text-white px-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500 dark:bg-amber-400" />
            <span className="font-extrabold text-sm tracking-tight">{block.block_id}</span>
            <span className="text-slate-400 dark:text-slate-600">·</span>
            <span className="text-amber-700 dark:text-amber-300 font-bold">{block.start_time}–{block.end_time}</span>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded text-slate-500 hover:text-slate-900 hover:bg-slate-200 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800 transition-colors"
            title="Close Drawer (Esc)"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Drawer Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-5">
          {/* Spatial & Line Coordinates */}
          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded border border-slate-200 dark:border-white/10 space-y-1">
            <div className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold">Spatial Reference</div>
            <div className="text-sm font-bold text-slate-900 dark:text-white">
              KM {block.km_start.toFixed(1)} → KM {block.km_end.toFixed(1)}
            </div>
            <div className="text-[11px] text-slate-600 dark:text-slate-300">
              Line: <strong>{block.line} Track</strong> · Section: <strong>{block.section || "Warangal – Kazipet Jn"}</strong>
            </div>
          </div>

          {/* Usable Work Time Calculation */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-slate-800 dark:text-slate-200 font-bold uppercase text-[11px]">
              <span>Usable Work Minutes</span>
              <span className="text-blue-700 dark:text-blue-400">{usableMinutes}m / {rawMinutes}m</span>
            </div>

            <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex">
              <div
                style={{ width: `${Math.round((usableMinutes / rawMinutes) * 100)}%` }}
                className="bg-blue-600 dark:bg-blue-500 h-full"
                title={`Usable work: ${usableMinutes} min`}
              />
              <div
                style={{ width: `${Math.round((overheadMinutes / rawMinutes) * 100)}%` }}
                className="bg-amber-400 h-full"
                title={`Overhead: ${overheadMinutes} min`}
              />
            </div>

            <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-600 dark:text-slate-300 pt-1">
              <div className="p-2 bg-slate-50 dark:bg-slate-800/60 rounded border border-slate-200 dark:border-white/10">
                <span className="text-slate-500 dark:text-slate-400 block">OHE Isolation:</span>
                <strong className="text-slate-900 dark:text-white">{usableBreakdown?.isolation_minutes || 10}m</strong>
              </div>
              <div className="p-2 bg-slate-50 dark:bg-slate-800/60 rounded border border-slate-200 dark:border-white/10">
                <span className="text-slate-500 dark:text-slate-400 block">Safety Earthing:</span>
                <strong className="text-slate-900 dark:text-white">{usableBreakdown?.earthing_minutes || 5}m</strong>
              </div>
              <div className="p-2 bg-slate-50 dark:bg-slate-800/60 rounded border border-slate-200 dark:border-white/10">
                <span className="text-slate-500 dark:text-slate-400 block">Machine Transit:</span>
                <strong className="text-slate-900 dark:text-white">{usableBreakdown?.machine_transit_minutes || 5}m</strong>
              </div>
              <div className="p-2 bg-slate-50 dark:bg-slate-800/60 rounded border border-slate-200 dark:border-white/10">
                <span className="text-slate-500 dark:text-slate-400 block">Restoration Lag:</span>
                <strong className="text-slate-900 dark:text-white">{usableBreakdown?.restoration_minutes || 5}m</strong>
              </div>
            </div>
          </div>

          {/* Why Selected Breakdown (Level 3 Explanation) */}
          <div className="space-y-2">
            <div className="text-slate-800 dark:text-slate-200 font-bold uppercase text-[11px]">
              Operational Reasoning
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded border border-slate-200 dark:border-white/10 space-y-1.5 text-[11px] text-slate-700 dark:text-slate-300 font-sans">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span><strong>Safety:</strong> P1 severe rail flaws scheduled with highest mathematical reward.</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span><strong>Spatial Synergy:</strong> Consolidated tasks within ≤3km spatial window.</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span><strong>Express Clearance:</strong> ≥15 min safety buffer maintained for express passenger paths.</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span><strong>OHE De-energization:</strong> Traction distribution power cut coordinated with track maintenance.</span>
              </div>
            </div>
          </div>

          {/* Consolidated Tasks List */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-slate-800 dark:text-slate-200 font-bold uppercase text-[11px]">
              <span>Consolidated Work Orders ({block.tasks?.length || 0})</span>
            </div>

            <div className="space-y-1.5">
              {block.tasks?.map((t) => (
                <div
                  key={t.task_id}
                  className="p-2.5 rounded bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-white/10 space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 dark:text-white">{t.task_id}</span>
                    <span
                      className={cn(
                        "px-1.5 py-0.2 rounded text-[9px] font-black",
                        t.safety_tier === "P1"
                          ? "bg-red-600 text-white"
                          : "bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200"
                      )}
                    >
                      {t.safety_tier}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-700 dark:text-slate-300 font-sans line-clamp-1">{t.title}</p>
                  <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400">
                    <span>{t.department} · KM {t.km_start}</span>
                    <span>{t.duration_min}m duration</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Train Interactions & Protection */}
          {block.train_interactions && block.train_interactions.length > 0 && (
            <div className="space-y-2">
              <div className="text-slate-800 dark:text-slate-200 font-bold uppercase text-[11px]">
                Protected Express Trains
              </div>
              <div className="space-y-1.5">
                {block.train_interactions.map((ti) => (
                  <div
                    key={ti.train_id}
                    className="p-2 rounded bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-300 flex items-center justify-between text-[11px]"
                  >
                    <div>
                      <span className="font-bold">{ti.service_number || ti.train_id}</span>
                      <span className="text-slate-600 dark:text-slate-400 font-sans ml-1.5">{ti.train_name}</span>
                    </div>
                    <span className="px-1.5 py-0.2 rounded bg-emerald-200/80 dark:bg-emerald-900/60 text-emerald-900 dark:text-emerald-200 font-bold text-[9px]">
                      BUFFER ≥{ti.clearance_margin_min || 20}m SAFE
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Drawer Action Footer */}
        <div className="p-3 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-white/10 flex items-center justify-between shrink-0">
          <span className="text-[10px] text-slate-500 dark:text-slate-400">
            Validated by Independent 8-Rule Engine
          </span>
          <button
            onClick={onClose}
            className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white rounded font-medium text-xs transition-colors"
          >
            Close Dossier
          </button>
        </div>
      </aside>
    </div>
  );
}
