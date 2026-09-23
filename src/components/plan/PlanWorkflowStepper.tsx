"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Check, ArrowRight } from "lucide-react";

interface WorkflowStep {
  id: string;
  stepNumber: string;
  label: string;
  status: "completed" | "active" | "upcoming";
}

const STEPS: WorkflowStep[] = [
  { id: "work", stepNumber: "01", label: "WORK ORDERS", status: "completed" },
  { id: "prioritise", stepNumber: "02", label: "PRIORITISE", status: "completed" },
  { id: "compose", stepNumber: "03", label: "COMPOSE", status: "completed" },
  { id: "plan", stepNumber: "04", label: "PLAN", status: "active" },
  { id: "review", stepNumber: "05", label: "REVIEW & APPROVE", status: "upcoming" },
];

export function PlanWorkflowStepper() {
  return (
    <div className="w-full bg-white border border-slate-200/80 rounded-xl px-4 py-3 shadow-xs">
      <div className="flex items-center justify-between overflow-x-auto gap-2 text-xs">
        {STEPS.map((step, idx) => {
          const isCompleted = step.status === "completed";
          const isActive = step.status === "active";

          return (
            <React.Fragment key={step.id}>
              {idx > 0 && (
                <ArrowRight className="w-3.5 h-3.5 text-slate-300 shrink-0 mx-1" />
              )}
              <div
                className={cn(
                  "flex items-center gap-2 px-2.5 py-1.5 rounded-lg font-mono transition-all shrink-0 select-none",
                  isActive
                    ? "bg-blue-900 text-white font-bold shadow-xs ring-2 ring-blue-900/20"
                    : isCompleted
                    ? "bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100"
                    : "text-slate-400 font-medium"
                )}
              >
                {isCompleted ? (
                  <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-[10px] font-bold">
                    <Check className="w-2.5 h-2.5" />
                  </span>
                ) : (
                  <span
                    className={cn(
                      "w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold",
                      isActive
                        ? "bg-blue-800 text-white"
                        : "bg-slate-200 text-slate-500"
                    )}
                  >
                    {step.stepNumber}
                  </span>
                )}
                <span className="tracking-tight text-[11px]">{step.label}</span>
                {isActive && (
                  <span className="text-[9px] uppercase px-1.5 py-0.2 rounded bg-blue-700/80 text-blue-100 font-bold ml-0.5">
                    Current
                  </span>
                )}
              </div>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
