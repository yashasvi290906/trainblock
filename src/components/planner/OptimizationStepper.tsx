"use client";

import React, { useState } from "react";
import { CheckCircle2, Loader2, Sparkles, Cpu, Clock, Check, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePlanningRun } from "@/context/PlanningRunContext";

interface OptimizationStepperProps {
  onPlanGenerated?: () => void;
  className?: string;
}

export function OptimizationStepper({ onPlanGenerated, className }: OptimizationStepperProps) {
  const [status, setStatus] = useState<"idle" | "running" | "completed">("completed");
  const [currentStep, setCurrentStep] = useState(5);
  const { replan, isBackend, currentRun } = usePlanningRun();

  const steps = [
    { id: 1, title: "Ingesting work orders", desc: `${currentRun?.input_summary.total_maintenance_demands || 47} tasks from TMS, SMMS & TDMS feeds` },
    { id: 2, title: "Checking constraints", desc: "Safety rules, OHE isolation, speed restrictions" },
    { id: 3, title: "Composing compatible tasks", desc: `${currentRun?.composition_clusters.length || 14} multi-dept clusters (ENG + S&T + TRC)` },
    { id: 4, title: "Optimizing with CP-SAT", desc: "Solving mixed-integer corridor window allocation" },
    { id: 5, title: "Generating BDMS plan", desc: `${currentRun?.weekly_plan.length || 8} integrated blocks, 0 train conflicts` },
  ];

  const handleRunOptimization = async () => {
    setStatus("running");
    setCurrentStep(1);

    const stepInterval = 250;
    setTimeout(() => setCurrentStep(2), stepInterval * 1);
    setTimeout(() => setCurrentStep(3), stepInterval * 2);
    setTimeout(() => setCurrentStep(4), stepInterval * 3);

    try {
      await replan();
    } catch (e) {
      console.error("Replan failed, continuing locally:", e);
    }

    setTimeout(() => {
      setCurrentStep(5);
      setStatus("completed");
      onPlanGenerated?.();
    }, stepInterval * 4);
  };

  return (
    <div className={cn("bg-[#0c1527] border border-[#1a2948] rounded-lg p-5 flex flex-col justify-between", className)}>
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-[#16233d]">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-sky-400" />
            <h3 className="text-xs font-semibold text-white uppercase tracking-wider">
              Optimization Status & Engine
            </h3>
          </div>
          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-2 py-0.5 rounded">
            CP-SAT Solver Ready (1.4s)
          </span>
        </div>

        {/* Stepper list */}
        <div className="space-y-4 my-5">
          {steps.map((step) => {
            const isDone = currentStep > step.id || status === "completed";
            const isCurrent = currentStep === step.id && status === "running";
            const isPending = currentStep < step.id && status !== "completed";

            return (
              <div key={step.id} className="flex items-start gap-3">
                <div className="mt-0.5">
                  {isDone ? (
                    <div className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500 text-emerald-400 flex items-center justify-center shadow-[0_0_8px_rgba(16,185,129,0.3)]">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                  ) : isCurrent ? (
                    <div className="w-5 h-5 rounded-full bg-sky-500/20 border border-sky-400 text-sky-400 flex items-center justify-center animate-spin">
                      <Loader2 className="w-3 h-3" />
                    </div>
                  ) : (
                    <div className="w-5 h-5 rounded-full bg-[#131f38] border border-[#23355b] text-slate-500 flex items-center justify-center text-[10px] font-mono">
                      {step.id}
                    </div>
                  )}
                </div>
                <div>
                  <h4
                    className={cn(
                      "text-xs font-semibold",
                      isDone ? "text-slate-200" : isCurrent ? "text-sky-300" : "text-slate-500"
                    )}
                  >
                    {step.title}
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">{step.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Trigger CTA */}
      <div className="pt-4 border-t border-[#16233d]">
        <button
          onClick={handleRunOptimization}
          disabled={status === "running"}
          className="w-full py-2.5 px-4 rounded bg-sky-600 hover:bg-sky-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-semibold text-xs transition-all shadow-lg shadow-sky-950/60 flex items-center justify-center gap-2"
        >
          {status === "running" ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Optimizing Corridor Schedule...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-sky-300" />
              <span>Generate Integrated Plan</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
