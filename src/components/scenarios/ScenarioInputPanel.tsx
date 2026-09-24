"use client";

import React, { useState } from "react";
import {
  ScenarioCondition,
  ScenarioState,
  FallbackWindow,
  CriticalWorkInput,
  TrainMovementOverride,
} from "./types";
import {
  BASELINE_PLAN,
  FALLBACK_WINDOWS,
  INITIAL_CRITICAL_WORK,
  TRAIN_OPTIONS,
} from "./scenarioData";
import {
  ShieldAlert,
  Play,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Wrench,
  TrainTrack,
  ArrowRight,
  Sparkles,
  Sliders,
  Check,
  Info,
  XCircle,
  PlusCircle,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ScenarioInputPanelProps {
  condition: ScenarioCondition;
  scenarioState: ScenarioState;
  selectedWindow: FallbackWindow;
  onSelectWindow: (w: FallbackWindow) => void;
  onSimulateDenial: () => void;
  onReplan: () => void;
  isReplanning: boolean;
  replanStep: number;
  criticalWork: CriticalWorkInput;
  onChangeCriticalWork: (cw: CriticalWorkInput) => void;
  onAddCriticalWorkAndReplan: () => void;
  selectedTrain: TrainMovementOverride;
  onSelectTrain: (t: TrainMovementOverride) => void;
  trainOffsetMinutes: number;
  onChangeTrainOffset: (offset: number) => void;
  onRecalculateTrainMovement: () => void;
  durationOffsetMin: number;
  onChangeDurationOffset: (offset: number) => void;
  onReset: () => void;
}

const REPLAN_CHECKLIST = [
  "CHECKING TRAIN PATHS",
  "CHECKING POSSESSION LIMITS",
  "CHECKING WORK DURATION",
  "CHECKING PASSENGER PROTECTION",
  "CHECKING GOODS FORECAST",
];

export function ScenarioInputPanel({
  condition,
  scenarioState,
  selectedWindow,
  onSelectWindow,
  onSimulateDenial,
  onReplan,
  isReplanning,
  replanStep,
  criticalWork,
  onChangeCriticalWork,
  onAddCriticalWorkAndReplan,
  selectedTrain,
  onSelectTrain,
  trainOffsetMinutes,
  onChangeTrainOffset,
  onRecalculateTrainMovement,
  durationOffsetMin,
  onChangeDurationOffset,
  onReset,
}: ScenarioInputPanelProps) {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 flex flex-col justify-between space-y-4 shadow-xs h-full">
      {/* 1. Panel Header & Operational Mode */}
      <div className="space-y-2">
        <div className="flex items-center justify-between pb-2.5 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span className="text-xs font-mono font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              SCENARIO INPUT
            </span>
          </div>
          <span className="text-[11px] font-mono text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-950 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-800">
            {condition}
          </span>
        </div>

        {/* 2. Contextual Scenario Controls */}
        {condition === "BASELINE" && (
          <div className="space-y-3 font-sans text-xs">
            <div className="p-3 bg-slate-50 dark:bg-slate-950/80 rounded-lg border border-slate-200 dark:border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-slate-500 dark:text-slate-400">Current Possession:</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">
                  {BASELINE_PLAN.blockId} ({BASELINE_PLAN.startTime}–{BASELINE_PLAN.endTime})
                </span>
              </div>
              <div className="flex justify-between text-slate-500 dark:text-slate-400 font-mono text-[11px]">
                <span>Corridor: {BASELINE_PLAN.corridor}</span>
                <span>Section: {BASELINE_PLAN.section}</span>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-200 dark:border-slate-800/80 text-[11px] font-mono">
                <div>
                  <span className="text-slate-500 dark:text-slate-400">Work Orders:</span>{" "}
                  <span className="text-slate-900 dark:text-white font-bold">{BASELINE_PLAN.totalWorkOrders} (3 P1, 7 P2)</span>
                </div>
                <div>
                  <span className="text-slate-500 dark:text-slate-400">Usable Time:</span>{" "}
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">{BASELINE_PLAN.usableWorkMin} min</span>
                </div>
              </div>
            </div>

            <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed">
              This is the currently approved multi-department possession plan. Select any test condition above to simulate disruptions or operational shifts.
            </p>

            <button
              onClick={onSimulateDenial}
              className="w-full py-2.5 px-3 bg-blue-600 hover:bg-blue-500 text-white font-mono font-bold text-xs rounded-lg flex items-center justify-center gap-2 shadow-xs transition-all"
            >
              <ShieldAlert className="w-4 h-4 text-amber-300" />
              <span>TEST FLAGSHIP: SIMULATE BLOCK DENIAL</span>
            </button>
          </div>
        )}

        {condition === "BLOCK_DENIAL" && (
          <div className="space-y-3 text-xs">
            {/* Initial Baseline / Denied Status Callout */}
            {scenarioState === "IDLE" ? (
              <div className="p-3 bg-slate-50 dark:bg-slate-950/80 rounded-lg border border-slate-200 dark:border-slate-800 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-slate-500 dark:text-slate-300">Base Request:</span>
                  <span className="font-mono font-bold text-amber-600 dark:text-amber-400">
                    B-014 ({BASELINE_PLAN.startTime}–{BASELINE_PLAN.endTime})
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                  Click to model Divisional Operating Control denying the 02:20–04:10 window due to corridor congestion.
                </p>
                <button
                  onClick={onSimulateDenial}
                  className="w-full py-2 px-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-mono font-bold text-xs rounded-lg flex items-center justify-center gap-2 shadow-xs transition-all"
                >
                  <ShieldAlert className="w-4 h-4" />
                  <span>SIMULATE BLOCK DENIAL</span>
                </button>
              </div>
            ) : (
              <div className="p-3 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-600/40 rounded-lg space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-rose-700 dark:text-rose-300 font-bold flex items-center gap-1.5">
                    <XCircle className="w-4 h-4 text-rose-500 dark:text-rose-400" />
                    OPERATING RESPONSE
                  </span>
                  <span className="px-2 py-0.5 rounded bg-rose-100 dark:bg-rose-900/60 text-rose-800 dark:text-rose-200 text-[10px] font-mono font-bold border border-rose-300 dark:border-rose-700/50">
                    DENIED
                  </span>
                </div>
                <p className="text-[11px] text-rose-800 dark:text-rose-200/90 leading-snug">
                  “Requested possession <span className="font-mono font-bold text-slate-900 dark:text-white">B-014 (02:20–04:10)</span> unavailable in current window. High-density corridor traffic.”
                </p>
              </div>
            )}

            {/* Fallback Windows Selection */}
            {scenarioState !== "IDLE" && (
              <div className="space-y-2 pt-1">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    ALTERNATE WINDOWS
                  </span>
                  <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">Select candidate</span>
                </div>

                <div className="space-y-2">
                  {FALLBACK_WINDOWS.map((fw) => {
                    const isSelected = selectedWindow.id === fw.id;
                    return (
                      <div
                        key={fw.id}
                        onClick={() => onSelectWindow(fw)}
                        className={cn(
                          "p-2.5 rounded-lg border text-xs cursor-pointer transition-all space-y-1.5",
                          isSelected
                            ? "bg-blue-50 dark:bg-blue-950/70 border-blue-500 shadow-xs"
                            : "bg-slate-50 dark:bg-slate-950/70 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300"
                        )}
                      >
                        <div className="flex items-center justify-between font-mono">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900 dark:text-white">{fw.code}</span>
                            <span className="text-blue-600 dark:text-blue-400 font-semibold">{fw.startTime}–{fw.endTime}</span>
                          </div>
                          <span
                            className={cn(
                              "px-1.5 py-0.5 rounded text-[9px] font-bold font-mono",
                              fw.feasibilityRating === "FEASIBLE"
                                ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700/50"
                                : fw.feasibilityRating === "CONDITIONAL"
                                ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-300 dark:border-amber-700/50"
                                : "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border border-rose-300 dark:border-rose-700/50"
                            )}
                          >
                            {fw.feasibilityRating}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-1 text-[11px] font-mono text-slate-500 dark:text-slate-400">
                          <div>
                            <span>Passenger conflicts:</span>{" "}
                            <span className={fw.passengerConflicts === 0 ? "text-emerald-600 dark:text-emerald-400 font-bold" : "text-amber-600 dark:text-amber-400 font-bold"}>
                              {fw.passengerConflicts}
                            </span>
                          </div>
                          <div>
                            <span>Available work time:</span>{" "}
                            <span className="text-slate-900 dark:text-white font-bold">{fw.usableWorkMin} min</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-[10px] font-mono pt-1 border-t border-slate-200 dark:border-slate-800/60">
                          <span className="text-slate-500 dark:text-slate-400">Protection:</span>
                          <span
                            className={cn(
                              "font-bold",
                              fw.protectionStatus === "PASSENGER PATHS PROTECTED"
                                ? "text-emerald-600 dark:text-emerald-400"
                                : fw.protectionStatus === "REQUIRES REVIEW"
                                ? "text-amber-600 dark:text-amber-400"
                                : "text-rose-600 dark:text-rose-400"
                            )}
                          >
                            {fw.protectionStatus}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Replan Button with Deterministic Check Sequence */}
                <div className="pt-2">
                  <button
                    onClick={onReplan}
                    disabled={isReplanning}
                    className="w-full py-2.5 px-3 bg-blue-600 hover:bg-blue-500 text-white font-mono font-bold text-xs rounded-lg flex items-center justify-center gap-2 shadow-xs transition-all disabled:opacity-60"
                  >
                    {isReplanning ? (
                      <Sparkles className="w-4 h-4 animate-spin text-amber-300" />
                    ) : (
                      <Play className="w-4 h-4" />
                    )}
                    <span>
                      {isReplanning
                        ? "EVALUATING CONSTRAINTS..."
                        : scenarioState === "REPLANNED"
                        ? "REPLAN (APPLY " + selectedWindow.code + ")"
                        : "REPLAN (" + selectedWindow.code + ")"}
                    </span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {condition === "ADD_CRITICAL_WORK" && (
          <div className="space-y-3 text-xs">
            <div className="p-2.5 bg-slate-50 dark:bg-slate-950/80 rounded-lg border border-slate-200 dark:border-slate-800 space-y-2">
              <span className="text-[10px] font-mono font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider block">
                ADD MAINTENANCE DEMAND
              </span>

              <div className="space-y-2 font-mono text-[11px]">
                <div>
                  <label className="text-slate-500 dark:text-slate-400 text-[10px] block mb-0.5">Department</label>
                  <select
                    value={criticalWork.department}
                    onChange={(e) =>
                      onChangeCriticalWork({
                        ...criticalWork,
                        department: e.target.value as any,
                      })
                    }
                    className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded px-2 py-1 text-slate-900 dark:text-white text-xs focus:outline-hidden focus:border-blue-500"
                  >
                    <option value="Engineering">Engineering (Permanent Way)</option>
                    <option value="S&T">S&T (Signals & Telecom)</option>
                    <option value="Traction">Traction (TRD / OHE)</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-slate-500 dark:text-slate-400 text-[10px] block mb-0.5">Asset</label>
                    <input
                      type="text"
                      value={criticalWork.asset}
                      onChange={(e) =>
                        onChangeCriticalWork({ ...criticalWork, asset: e.target.value })
                      }
                      className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded px-2 py-1 text-slate-900 dark:text-white text-xs focus:outline-hidden focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="text-slate-500 dark:text-slate-400 text-[10px] block mb-0.5">Location</label>
                    <input
                      type="text"
                      value={criticalWork.location}
                      onChange={(e) =>
                        onChangeCriticalWork({ ...criticalWork, location: e.target.value })
                      }
                      className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded px-2 py-1 text-slate-900 dark:text-white text-xs focus:outline-hidden focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-slate-500 dark:text-slate-400 text-[10px] block mb-0.5">Duration</label>
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        value={criticalWork.durationMin}
                        onChange={(e) =>
                          onChangeCriticalWork({
                            ...criticalWork,
                            durationMin: Math.max(15, parseInt(e.target.value) || 15),
                          })
                        }
                        className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded px-2 py-1 text-slate-900 dark:text-white text-xs focus:outline-hidden focus:border-blue-500 font-mono"
                      />
                      <span className="text-slate-500 dark:text-slate-400 text-xs">min</span>
                    </div>
                  </div>
                  <div>
                    <label className="text-slate-500 dark:text-slate-400 text-[10px] block mb-0.5">Criticality</label>
                    <select
                      value={criticalWork.criticality}
                      onChange={(e) =>
                        onChangeCriticalWork({
                          ...criticalWork,
                          criticality: e.target.value as any,
                        })
                      }
                      className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded px-2 py-1 text-rose-600 dark:text-rose-300 font-bold text-xs focus:outline-hidden focus:border-blue-500"
                    >
                      <option value="P1">P1 (Safety Critical)</option>
                      <option value="P2">P2 (High Urgency)</option>
                      <option value="P3">P3 (Routine)</option>
                    </select>
                  </div>
                </div>
              </div>

              <button
                onClick={onAddCriticalWorkAndReplan}
                className="w-full py-2 px-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-mono font-bold text-xs rounded flex items-center justify-center gap-1.5 transition-all mt-1"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>ADD & REPLAN</span>
              </button>
            </div>

            {/* Demand vs Capacity Result */}
            {scenarioState === "INSUFFICIENT_WINDOW" && (
              <div className="p-2.5 bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-600/40 rounded-lg space-y-1.5 font-mono">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-500 dark:text-slate-400">BASELINE:</span>
                  <span className="text-slate-900 dark:text-white">18 orders • 90 min usable</span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-amber-700 dark:text-amber-400 font-bold">SCENARIO:</span>
                  <span className="text-amber-800 dark:text-amber-300 font-bold">19 orders • 135 min required</span>
                </div>
                <div className="p-1.5 rounded bg-rose-50 dark:bg-rose-950/60 border border-rose-300 dark:border-rose-700/50 text-rose-800 dark:text-rose-200 text-[10px] leading-snug mt-1">
                  <span className="font-bold text-rose-700 dark:text-rose-300">STATUS: INSUFFICIENT WINDOW</span>
                  <br />
                  Current window (90m) cannot accommodate 135m total demand. Re-evaluating candidate longer slot (01:30–04:15, 140m).
                </div>
              </div>
            )}
          </div>
        )}

        {condition === "TRAIN_MOVEMENT" && (
          <div className="space-y-3 text-xs">
            <div className="p-2.5 bg-slate-50 dark:bg-slate-950/80 rounded-lg border border-slate-200 dark:border-slate-800 space-y-2">
              <span className="text-[10px] font-mono font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider block">
                TIMETABLE TRAIN SELECTION
              </span>

              <div className="space-y-2 font-mono text-[11px]">
                <div>
                  <label className="text-slate-500 dark:text-slate-400 text-[10px] block mb-0.5">Select Train Movement</label>
                  <select
                    value={selectedTrain.trainId}
                    onChange={(e) => {
                      const t = TRAIN_OPTIONS.find((opt) => opt.trainId === e.target.value);
                      if (t) onSelectTrain(t);
                    }}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded px-2 py-1 text-slate-900 dark:text-white text-xs focus:outline-hidden focus:border-blue-500"
                  >
                    {TRAIN_OPTIONS.map((t) => (
                      <option key={t.trainId} value={t.trainId}>
                        {t.name} ({t.serviceNumber}) — {t.direction}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="p-2 bg-white dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-800 space-y-1">
                  <div className="flex justify-between text-[10px] text-slate-500 dark:text-slate-400">
                    <span>Original passage at KM 72:</span>
                    <span className="text-slate-900 dark:text-white font-bold">{selectedTrain.baseKm72Time}</span>
                  </div>
                  <div className="flex justify-between text-[10px] text-blue-600 dark:text-blue-400">
                    <span>Modified passage at KM 72:</span>
                    <span className="font-bold">{selectedTrain.shiftedKm72Time}</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[10px] text-slate-500 dark:text-slate-400 mb-1">
                    <span>Passage Time Adjustment:</span>
                    <span className="text-amber-600 dark:text-amber-400 font-bold">
                      {trainOffsetMinutes > 0 ? `+${trainOffsetMinutes} min` : `${trainOffsetMinutes} min`}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="-45"
                    max="60"
                    step="5"
                    value={trainOffsetMinutes}
                    onChange={(e) => onChangeTrainOffset(parseInt(e.target.value))}
                    className="w-full accent-blue-600 cursor-pointer"
                  />
                  <div className="flex justify-between text-[9px] text-slate-400 dark:text-slate-500">
                    <span>-45 min (Early)</span>
                    <span>Base (0)</span>
                    <span>+60 min (Delayed)</span>
                  </div>
                </div>
              </div>

              <button
                onClick={onRecalculateTrainMovement}
                className="w-full py-2 px-3 bg-blue-600 hover:bg-blue-500 text-white font-mono font-bold text-xs rounded flex items-center justify-center gap-1.5 transition-all mt-1"
              >
                <TrainTrack className="w-3.5 h-3.5" />
                <span>RECALCULATE TIMETABLE</span>
              </button>
            </div>

            {scenarioState === "CONFLICT_DETECTED" && (
              <div className="p-2.5 bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-600/40 rounded-lg space-y-1 font-mono text-[11px]">
                <div className="flex items-center gap-1.5 text-amber-700 dark:text-amber-300 font-bold">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                  <span>NEW CONFLICT DETECTED</span>
                </div>
                <p className="text-[10px] text-slate-700 dark:text-slate-300">
                  {selectedTrain.name} now intersects possession B-014 at KM 72 ({selectedTrain.shiftedKm72Time}).
                </p>
                <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold pt-1 border-t border-slate-200 dark:border-slate-800">
                  Alternate Window Available: FW-01 (04:20–06:10)
                </div>
              </div>
            )}
          </div>
        )}

        {condition === "BLOCK_DURATION" && (
          <div className="space-y-3 text-xs">
            <div className="p-2.5 bg-slate-50 dark:bg-slate-950/80 rounded-lg border border-slate-200 dark:border-slate-800 space-y-2.5">
              <span className="text-[10px] font-mono font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider block">
                BLOCK DURATION ADJUSTMENT
              </span>

              <div className="space-y-1.5 font-mono">
                <label className="text-slate-500 dark:text-slate-400 text-[10px] block">Select Window Variation</label>
                <div className="grid grid-cols-5 gap-1">
                  {[-30, -10, 0, 10, 30].map((offset) => {
                    const isSelected = durationOffsetMin === offset;
                    const duration = 110 + offset;
                    return (
                      <button
                        key={offset}
                        onClick={() => onChangeDurationOffset(offset)}
                        className={cn(
                          "py-1.5 px-1 rounded text-center text-[10px] font-mono font-bold border transition-all",
                          isSelected
                            ? "bg-blue-600 text-white border-blue-400 shadow-xs"
                            : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-500"
                        )}
                      >
                        {offset === 0 ? "BASE" : offset > 0 ? `+${offset}m` : `${offset}m`}
                        <span className="block text-[8px] font-normal text-slate-400">{duration}m</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="p-2 bg-white dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-800 space-y-1.5 font-mono text-[11px]">
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Total Possession:</span>
                  <span className="text-slate-900 dark:text-white font-bold">{110 + durationOffsetMin} min</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Usable Work Time:</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">{90 + durationOffsetMin} min</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Traffic Exposure:</span>
                  <span className={durationOffsetMin > 10 ? "text-amber-600 dark:text-amber-400 font-bold" : "text-emerald-600 dark:text-emerald-400 font-bold"}>
                    {durationOffsetMin > 10 ? "High (Encroaches 04:30 train)" : "Nominal (Protected)"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Replan Deterministic Step Overlay */}
        {isReplanning && (
          <div className="p-2.5 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-700/50 rounded-lg space-y-1.5 animate-fadeIn font-mono">
            <span className="text-[10px] font-bold text-blue-700 dark:text-blue-300 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 animate-spin" />
              EVALUATION PIPELINE:
            </span>
            <div className="space-y-1">
              {REPLAN_CHECKLIST.map((step, idx) => (
                <div
                  key={idx}
                  className={cn(
                    "flex items-center gap-1.5 text-[10px] px-2 py-1 rounded transition-all",
                    replanStep === idx
                      ? "bg-blue-100 dark:bg-blue-600/30 text-blue-900 dark:text-white font-bold border border-blue-400 dark:border-blue-500/50 animate-pulse"
                      : replanStep > idx
                      ? "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700/30"
                      : "text-slate-400 dark:text-slate-500"
                  )}
                >
                  {replanStep > idx ? (
                    <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                  ) : (
                    <span className="w-3 h-3 rounded-full bg-slate-200 dark:bg-slate-800 text-[8px] flex items-center justify-center text-slate-600 dark:text-slate-400 flex-shrink-0">
                      {idx + 1}
                    </span>
                  )}
                  <span>{step}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="pt-2 border-t border-slate-200 dark:border-slate-800 text-[10px] font-mono text-slate-500 dark:text-slate-400 flex items-center justify-between">
        <span className="flex items-center gap-1">
          <Info className="w-3 h-3 text-blue-600 dark:text-blue-400" />
          Deterministic Solver
        </span>
        <span className="text-slate-400 dark:text-slate-500">BDMS / FOIS Rule Set</span>
      </div>
    </div>
  );
}
