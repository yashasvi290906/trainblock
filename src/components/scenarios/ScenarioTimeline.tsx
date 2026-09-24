"use client";

import React from "react";
import { ScenarioCondition, ScenarioState, FallbackWindow } from "./types";
import { Check, ArrowRight, ShieldAlert, Sparkles, Clock, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ScenarioTimelineProps {
  condition: ScenarioCondition;
  scenarioState: ScenarioState;
  selectedWindow: FallbackWindow;
}

export function ScenarioTimeline({
  condition,
  scenarioState,
  selectedWindow,
}: ScenarioTimelineProps) {
  const isReplanned = scenarioState === "REPLANNED";
  const isDenied = condition === "BLOCK_DENIAL" && scenarioState !== "IDLE";

  const steps = [
    {
      label: "BASELINE",
      sub: "B-014 (02:20–04:10)",
      isDone: true,
      isActive: scenarioState === "IDLE",
    },
    {
      label:
        condition === "BLOCK_DENIAL"
          ? "BLOCK DENIED"
          : condition === "ADD_CRITICAL_WORK"
          ? "DEMAND ADDED"
          : condition === "TRAIN_MOVEMENT"
          ? "TRAIN SHIFTED"
          : condition === "BLOCK_DURATION"
          ? "DURATION MOD"
          : "CHANGE CONDITION",
      sub:
        condition === "BLOCK_DENIAL" && isDenied
          ? "Operating Constraint"
          : condition === "ADD_CRITICAL_WORK"
          ? "+45m P1 Demand"
          : "Input Applied",
      isDone: scenarioState !== "IDLE",
      isActive: scenarioState === "DENIED" || scenarioState === "CONFLICT_DETECTED" || scenarioState === "INSUFFICIENT_WINDOW",
    },
    {
      label: "CONSTRAINT CHECK",
      sub: "Paths & Usable Slot",
      isDone: isReplanned,
      isActive: scenarioState === "REPLANNING",
    },
    {
      label: "REPLAN",
      sub: isReplanned ? selectedWindow.code : "Candidate Search",
      isDone: isReplanned,
      isActive: isReplanned,
    },
    {
      label: "RESULT",
      sub: isReplanned ? `${selectedWindow.startTime}–${selectedWindow.endTime} (0 Conflicts)` : "Pending Approval",
      isDone: isReplanned,
      isActive: isReplanned,
    },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 font-mono shadow-xs">
      <div className="flex items-center justify-between gap-2 overflow-x-auto scrollbar-none">
        {steps.map((step, idx) => {
          const isLast = idx === steps.length - 1;

          return (
            <React.Fragment key={idx}>
              <div className="flex items-center gap-2.5 flex-shrink-0">
                <div
                  className={cn(
                    "w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border transition-all",
                    step.isDone
                      ? "bg-emerald-500 text-white border-emerald-400"
                      : step.isActive
                      ? "bg-blue-600 text-white border-blue-400 animate-pulse"
                      : "bg-slate-100 dark:bg-slate-950 text-slate-400 dark:text-slate-500 border-slate-300 dark:border-slate-800"
                  )}
                >
                  {step.isDone ? <Check className="w-3.5 h-3.5" /> : idx + 1}
                </div>

                <div className="text-left">
                  <div
                    className={cn(
                      "text-[10px] font-bold uppercase tracking-wider",
                      step.isDone
                        ? "text-emerald-700 dark:text-emerald-300"
                        : step.isActive
                        ? "text-blue-700 dark:text-blue-300"
                        : "text-slate-500 dark:text-slate-400"
                    )}
                  >
                    {step.label}
                  </div>
                  <div className="text-[9px] text-slate-500 dark:text-slate-400">{step.sub}</div>
                </div>
              </div>

              {!isLast && (
                <div className="flex-1 min-w-[16px] max-w-[40px] h-0.5 bg-slate-200 dark:bg-slate-800 mx-1 flex items-center justify-center">
                  <ArrowRight className="w-3 h-3 text-slate-400 dark:text-slate-600" />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
