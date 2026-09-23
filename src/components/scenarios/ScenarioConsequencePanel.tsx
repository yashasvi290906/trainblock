"use client";

import React from "react";
import Link from "next/link";
import {
  ScenarioCondition,
  ScenarioState,
  FallbackWindow,
  CriticalWorkInput,
} from "./types";
import { BASELINE_PLAN } from "./scenarioData";
import {
  Activity,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock,
  ArrowRight,
  Shield,
  HelpCircle,
  HardHat,
  Train,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ScenarioConsequencePanelProps {
  condition: ScenarioCondition;
  scenarioState: ScenarioState;
  selectedWindow: FallbackWindow;
  criticalWork: CriticalWorkInput;
  durationOffsetMin: number;
  onKeepBaseline: () => void;
  onReviewScenario: () => void;
}

export function ScenarioConsequencePanel({
  condition,
  scenarioState,
  selectedWindow,
  criticalWork,
  durationOffsetMin,
  onKeepBaseline,
  onReviewScenario,
}: ScenarioConsequencePanelProps) {
  // Compute display facts based on active condition and state
  const isReplanned = scenarioState === "REPLANNED";
  const isDenied = condition === "BLOCK_DENIAL" && scenarioState !== "IDLE" && !isReplanned;
  const isInsufficient = scenarioState === "INSUFFICIENT_WINDOW";
  const isConflict = scenarioState === "CONFLICT_DETECTED";

  const blockWindow =
    isReplanned
      ? `${selectedWindow.startTime}–${selectedWindow.endTime}`
      : isDenied
      ? "DENIED (Pending Replan)"
      : condition === "BLOCK_DURATION"
      ? `${BASELINE_PLAN.startTime}–04:${10 + durationOffsetMin >= 60 ? "40" : "10"}`
      : `${BASELINE_PLAN.startTime}–${BASELINE_PLAN.endTime}`;

  const workOrders =
    condition === "ADD_CRITICAL_WORK"
      ? 19
      : isReplanned
      ? `${selectedWindow.workOrdersRetained}/18 orders`
      : `${BASELINE_PLAN.totalWorkOrders} orders`;

  const p1Count =
    condition === "ADD_CRITICAL_WORK"
      ? "4 (1 added)"
      : isReplanned
      ? `${selectedWindow.p1Retained} retained`
      : "3 retained";

  const passengerConflicts =
    isReplanned
      ? selectedWindow.passengerConflicts
      : isConflict
      ? 1
      : isDenied
      ? 0
      : 0;

  const usableWorkTime =
    isReplanned
      ? `${selectedWindow.usableWorkMin} min`
      : isDenied
      ? "0 min"
      : condition === "BLOCK_DURATION"
      ? `${90 + durationOffsetMin} min`
      : `${BASELINE_PLAN.usableWorkMin} min`;

  const statusText =
    isReplanned
      ? "FEASIBLE FOR REVIEW"
      : isDenied
      ? "BLOCK DENIED"
      : isInsufficient
      ? "INSUFFICIENT WINDOW"
      : isConflict
      ? "CONFLICT DETECTED"
      : "BASE PLAN ACTIVE";

  // Dynamic explanation text
  let whyChangedText = "";
  if (condition === "BLOCK_DENIAL") {
    whyChangedText =
      "Original possession was unavailable. A later window was evaluated to preserve the maintenance demand while avoiding protected passenger movements.";
  } else if (condition === "ADD_CRITICAL_WORK") {
    whyChangedText =
      "Additional work increased required possession time (135 min) beyond the current usable window (90 min).";
  } else if (condition === "TRAIN_MOVEMENT") {
    whyChangedText =
      "Updated train passage intersects the existing possession at KM 72. Alternate slot evaluated to eliminate passenger conflict.";
  } else if (condition === "BLOCK_DURATION") {
    whyChangedText =
      "Possession duration adjusted to balance maintenance capacity against corridor train-path clearance.";
  } else {
    whyChangedText =
      "Base plan satisfies all timetable and multi-department co-location constraints.";
  }

  // Target URL for Review in Plan
  const planUrl = isReplanned
    ? `/plan?start=${selectedWindow.startTime}&duration=${selectedWindow.durationMin}&scenario=${selectedWindow.code}`
    : `/plan`;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col justify-between space-y-4 shadow-sm h-full font-mono">
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-center justify-between pb-2.5 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              SCENARIO CONSEQUENCES
            </span>
          </div>
          <span
            className={cn(
              "text-[10px] px-2 py-0.5 rounded font-bold border",
              isReplanned || statusText === "BASE PLAN ACTIVE"
                ? "bg-emerald-950 text-emerald-300 border-emerald-700/50"
                : isDenied || isInsufficient || isConflict
                ? "bg-rose-950 text-rose-300 border-rose-700/50"
                : "bg-blue-950 text-blue-300 border-blue-700/50"
            )}
          >
            {statusText}
          </span>
        </div>

        {/* Operational Fact Matrix */}
        <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800 space-y-2 text-xs">
          <div className="flex justify-between items-center py-0.5 border-b border-slate-800/60">
            <span className="text-slate-400">BLOCK WINDOW</span>
            <span className="text-white font-bold">{blockWindow}</span>
          </div>

          <div className="flex justify-between items-center py-0.5 border-b border-slate-800/60">
            <span className="text-slate-400">WORK DEMAND</span>
            <span className="text-white font-semibold">{workOrders}</span>
          </div>

          <div className="flex justify-between items-center py-0.5 border-b border-slate-800/60">
            <span className="text-slate-400">P1 CRITICAL</span>
            <span className="text-rose-400 font-bold">{p1Count}</span>
          </div>

          <div className="flex justify-between items-center py-0.5 border-b border-slate-800/60">
            <span className="text-slate-400">PASSENGER CONFLICTS</span>
            <span
              className={cn(
                "font-bold",
                passengerConflicts === 0 ? "text-emerald-400" : "text-amber-400"
              )}
            >
              {passengerConflicts} {passengerConflicts === 0 ? "(Protected)" : "(Conflict)"}
            </span>
          </div>

          <div className="flex justify-between items-center py-0.5 border-b border-slate-800/60">
            <span className="text-slate-400">GOODS FORECAST</span>
            <span className="text-blue-300">Checked · 1 Slot</span>
          </div>

          <div className="flex justify-between items-center py-0.5">
            <span className="text-slate-400">USABLE WORK TIME</span>
            <span className="text-emerald-400 font-bold">{usableWorkTime}</span>
          </div>
        </div>

        {/* WHY DID THE PLAN CHANGE? */}
        <div className="bg-slate-950/90 p-3 rounded-lg border border-slate-800 space-y-1.5">
          <div className="flex items-center gap-1.5 text-blue-400 text-[11px] font-bold">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>WHY DID THE PLAN CHANGE?</span>
          </div>
          <p className="text-[11px] text-slate-300 leading-relaxed font-sans">
            {whyChangedText}
          </p>
        </div>
      </div>

      {/* Human-In-The-Loop Actions */}
      <div className="pt-3 border-t border-slate-800 space-y-2">
        <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">
          PLANNER REVIEW ACTIONS:
        </span>

        <Link
          href={planUrl}
          className={cn(
            "w-full py-2.5 px-3 rounded-lg font-mono font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all",
            isReplanned
              ? "bg-emerald-600 hover:bg-emerald-500 text-slate-950"
              : "bg-blue-600 hover:bg-blue-500 text-white"
          )}
        >
          <span>REVIEW PLAN IN WORKSTATION</span>
          <ArrowRight className="w-4 h-4" />
        </Link>

        <div className="grid grid-cols-2 gap-2">
          <Link
            href="/live-corridor"
            className="py-1.5 px-2 bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-200 font-mono text-[11px] rounded flex items-center justify-center gap-1 text-center"
          >
            <Train className="w-3 h-3 text-blue-400" />
            <span>Live Corridor</span>
          </Link>

          <button
            onClick={onKeepBaseline}
            className="py-1.5 px-2 bg-slate-800 hover:bg-slate-750 border border-slate-700 text-amber-300 font-mono text-[11px] rounded flex items-center justify-center gap-1 text-center"
          >
            <span>Keep Base</span>
          </button>
        </div>
      </div>
    </div>
  );
}
