"use client";

import React from "react";
import Link from "next/link";
import {
  Shield,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Sliders,
  RotateCcw,
  Sparkles,
  Layers,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface PlannerControlProps {
  blockId?: string;
  startTime?: string;
  endTime?: string;
  durationMinutes?: number;
  hasConflict?: boolean;
  conflictDetails?: {
    trainName: string;
    serviceNumber: string;
    expectedTime: string;
  } | null;
  onShiftTime?: (deltaMinutes: number) => void;
  onResetTime?: () => void;
  onApplyFallback?: (start: string, duration: number) => void;
}

export function PlannerControl({
  blockId = "B-014",
  startTime = "02:20",
  endTime = "04:10",
  durationMinutes = 110,
  hasConflict = false,
  conflictDetails,
  onShiftTime,
  onResetTime,
  onApplyFallback,
}: PlannerControlProps) {
  return (
    <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-900 text-white flex items-center justify-center font-bold">
            <Shield className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">
              PLANNER REVIEW & HUMAN AUTHORITY
            </h3>
            <p className="text-xs text-slate-500">
              RAILBLOCK provides advisory scheduling. The Divisional Planner retains full control to adjust or submit.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded border border-slate-200">
            Advisory Recommendation
          </span>
        </div>
      </div>

      {/* Adjust Window Controls Strip */}
      <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <span className="text-xs font-mono font-bold text-slate-700 uppercase block">
              Active Possession Window
            </span>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-base font-extrabold text-slate-900 font-mono">
                {startTime} – {endTime}
              </span>
              <span className="text-xs font-mono text-slate-500">
                ({durationMinutes} min duration)
              </span>
            </div>
          </div>

          {/* Direct Adjustment Buttons */}
          <div className="flex items-center gap-1.5 font-mono text-xs">
            <button
              onClick={() => onShiftTime && onShiftTime(-30)}
              className="px-2.5 py-1.5 bg-white hover:bg-slate-100 text-slate-700 font-bold rounded-md border border-slate-300 shadow-2xs transition-colors"
            >
              −30 min
            </button>
            <button
              onClick={() => onShiftTime && onShiftTime(-10)}
              className="px-2.5 py-1.5 bg-white hover:bg-slate-100 text-slate-700 font-bold rounded-md border border-slate-300 shadow-2xs transition-colors"
            >
              −10 min
            </button>
            <button
              onClick={() => onShiftTime && onShiftTime(10)}
              className="px-2.5 py-1.5 bg-white hover:bg-slate-100 text-slate-700 font-bold rounded-md border border-slate-300 shadow-2xs transition-colors"
            >
              +10 min
            </button>
            <button
              onClick={() => onShiftTime && onShiftTime(30)}
              className="px-2.5 py-1.5 bg-white hover:bg-slate-100 text-slate-700 font-bold rounded-md border border-slate-300 shadow-2xs transition-colors"
            >
              +30 min
            </button>
            {onResetTime && (
              <button
                onClick={onResetTime}
                className="px-2.5 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-medium rounded-md text-xs transition-colors flex items-center gap-1 ml-1"
                title="Reset to recommended 02:20"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>

        {/* Fallback / Conflict Notification */}
        {hasConflict ? (
          <div className="p-3 bg-red-50 rounded-lg border border-red-200 space-y-2 font-sans text-xs animate-fadeIn">
            <div className="flex items-center gap-2 text-red-900 font-bold">
              <AlertTriangle className="w-4 h-4 text-red-600" />
              <span>TIMETABLE CONFLICT DETECTED</span>
            </div>
            <p className="text-red-700 leading-relaxed">
              Proposed block window overlaps with <strong className="font-mono text-red-900">{conflictDetails?.trainName || "Telangana Rajdhani"} ({conflictDetails?.serviceNumber || "12723"})</strong> at ETA {conflictDetails?.expectedTime || "02:35"}. Protected passenger service cannot be delayed.
            </p>
            <div className="pt-1 flex flex-wrap items-center justify-between gap-2 border-t border-red-200/80 font-mono text-[11px]">
              <span className="text-red-800">
                Recommended Fallback: <strong className="text-slate-900">FW-01 (04:20–06:10)</strong>
              </span>
              {onApplyFallback && (
                <button
                  onClick={() => onApplyFallback("04:20", 110)}
                  className="px-3 py-1 bg-red-700 hover:bg-red-800 text-white rounded font-bold transition-colors cursor-pointer"
                >
                  Use Alternative Window (04:20) →
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="p-2.5 bg-emerald-50 rounded-lg border border-emerald-200 text-xs font-mono text-emerald-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Current window is safe · 0 timetable conflicts</span>
            </div>
            <span className="text-[11px] text-emerald-900 font-bold">Ready for Approval Gate</span>
          </div>
        )}
      </div>

      {/* Main Action Bar for Planner Decision Gate */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
        <div className="text-xs text-slate-500 font-mono">
          Submission routes to Divisional CPTM / Sr.DOM for final sanction
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/scenarios"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 text-xs font-semibold shadow-2xs transition-colors"
          >
            <Sliders className="w-3.5 h-3.5 text-slate-600" />
            <span>Test in What-If</span>
          </Link>

          <Link
            href="/decision"
            className={cn(
              "inline-flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-xs transition-all shadow-sm",
              hasConflict
                ? "bg-slate-300 text-slate-500 cursor-not-allowed pointer-events-none"
                : "bg-emerald-700 hover:bg-emerald-600 text-white shadow-emerald-900/30"
            )}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Send to Approval Gate</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
