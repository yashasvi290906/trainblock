"use client";

import React from "react";
import {
  RotateCcw,
  BookmarkPlus,
  ShieldAlert,
  PlusCircle,
  TrainTrack,
  Clock,
  CheckCircle2,
  Sliders,
} from "lucide-react";
import { ScenarioCondition } from "./types";
import { cn } from "@/lib/utils";

interface ScenarioControlStripProps {
  activeCondition: ScenarioCondition;
  onSelectCondition: (cond: ScenarioCondition) => void;
  onResetScenario: () => void;
  onSaveSnapshot: () => void;
  isModified: boolean;
  statusText: string;
}

const CONDITIONS: {
  id: ScenarioCondition;
  label: string;
  shortLabel: string;
  icon: React.ComponentType<{ className?: string }>;
  tag: string;
  desc: string;
}[] = [
  {
    id: "BASELINE",
    label: "Baseline Plan",
    shortLabel: "BASELINE",
    icon: CheckCircle2,
    tag: "02:20–04:10",
    desc: "Active approved B-014 window",
  },
  {
    id: "BLOCK_DENIAL",
    label: "Block Denial",
    shortLabel: "BLOCK DENIAL",
    icon: ShieldAlert,
    tag: "FLAGSHIP TEST",
    desc: "Simulate operating cancellation & alternate window discovery",
  },
  {
    id: "ADD_CRITICAL_WORK",
    label: "Add Critical Work",
    shortLabel: "ADD CRITICAL WORK",
    icon: PlusCircle,
    tag: "+45m P1 Track",
    desc: "Ingest urgent maintenance demand & evaluate capacity gap",
  },
  {
    id: "TRAIN_MOVEMENT",
    label: "Train Movement",
    shortLabel: "TRAIN MOVEMENT",
    icon: TrainTrack,
    tag: "VB-20612 Shift",
    desc: "Shift passenger / freight trajectories & test conflict clearance",
  },
  {
    id: "BLOCK_DURATION",
    label: "Block Duration",
    shortLabel: "BLOCK DURATION",
    icon: Clock,
    tag: "−30m to +30m",
    desc: "Adjust possession window length to balance work vs traffic exposure",
  },
];

export function ScenarioControlStrip({
  activeCondition,
  onSelectCondition,
  onResetScenario,
  onSaveSnapshot,
  isModified,
  statusText,
}: ScenarioControlStripProps) {
  return (
    <div className="bg-slate-950 border-b border-slate-800 px-4 py-2.5 sm:px-6">
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-3">
        {/* Left: Test Condition Selector Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 xl:pb-0 scrollbar-none">
          <span className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap mr-1">
            TEST CONDITION:
          </span>

          <div className="flex items-center gap-1.5 p-1 bg-slate-900/90 rounded-lg border border-slate-800">
            {CONDITIONS.map((c) => {
              const Icon = c.icon;
              const isActive = activeCondition === c.id;
              const isFlagship = c.id === "BLOCK_DENIAL";

              return (
                <button
                  key={c.id}
                  onClick={() => onSelectCondition(c.id)}
                  className={cn(
                    "flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-mono font-medium transition-all whitespace-nowrap",
                    isActive
                      ? "bg-blue-600 text-white shadow-md shadow-blue-900/30 border border-blue-400/50"
                      : "text-slate-300 hover:text-white hover:bg-slate-800/80 border border-transparent"
                  )}
                  title={c.desc}
                >
                  <Icon className={cn("w-3.5 h-3.5", isActive ? "text-white" : isFlagship ? "text-amber-400" : "text-slate-400")} />
                  <span>{c.label}</span>
                  {c.tag && (
                    <span
                      className={cn(
                        "text-[9px] px-1.5 py-0.2 rounded font-mono font-bold",
                        isActive
                          ? "bg-blue-900/60 text-blue-100"
                          : isFlagship
                          ? "bg-amber-950 text-amber-300 border border-amber-800/50"
                          : "bg-slate-800 text-slate-400"
                      )}
                    >
                      {c.tag}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: State & Reset / Save Actions */}
        <div className="flex items-center gap-2 justify-end text-xs font-mono">
          <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300">
            <span className="text-slate-500">Status:</span>
            <span
              className={cn(
                "font-semibold",
                statusText.includes("FEASIBLE") || statusText.includes("OPTIMIZED")
                  ? "text-emerald-400"
                  : statusText.includes("DENIED") || statusText.includes("INSUFFICIENT") || statusText.includes("CONFLICT")
                  ? "text-amber-400"
                  : "text-blue-400"
              )}
            >
              {statusText}
            </span>
          </div>

          <button
            onClick={onSaveSnapshot}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-slate-900 hover:bg-slate-850 border border-slate-700 text-slate-200 font-mono transition-colors"
            title="Save current scenario state as a snapshot"
          >
            <BookmarkPlus className="w-3.5 h-3.5 text-blue-400" />
            <span>SAVE SNAPSHOT</span>
          </button>

          <button
            onClick={onResetScenario}
            disabled={!isModified && activeCondition === "BASELINE"}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-md font-mono transition-colors",
              isModified || activeCondition !== "BASELINE"
                ? "bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-600/40"
                : "bg-slate-900 text-slate-600 border border-slate-800 cursor-not-allowed"
            )}
            title="Restore canonical baseline B-014 02:20–04:10"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>RESET SCENARIO</span>
          </button>
        </div>
      </div>
    </div>
  );
}
