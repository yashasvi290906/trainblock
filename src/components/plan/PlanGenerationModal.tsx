"use client";

import React, { useEffect, useState } from "react";
import { Check, Loader2, Sparkles, X, ArrowRight, ShieldCheck, Layers } from "lucide-react";
import { cn } from "@/lib/utils";

interface PlanGenerationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

const GENERATION_STEPS = [
  {
    step: 1,
    title: "Reading Maintenance Demand",
    desc: "18 departmental work orders ingested from Engineering, S&T, and Traction feeds.",
  },
  {
    step: 2,
    title: "Prioritising Critical Asset Flaws",
    desc: "3 safety-critical track flaws and 7 high-urgency tasks flagged for immediate scheduling.",
  },
  {
    step: 3,
    title: "Grouping Compatible Tasks",
    desc: "7 co-located tasks clustered across KM 68–94 sub-sector for combined possession.",
  },
  {
    step: 4,
    title: "Checking Train Timetable",
    desc: "Verified 4 scheduled passenger train trajectories (Vande Bharat, Rajdhani, Shatabdi, Amrit Bharat).",
  },
  {
    step: 5,
    title: "Testing Available Block Windows",
    desc: "Evaluated night shadow windows; confirmed 02:20–04:10 offers 0 timetable conflicts and 90m usable work.",
  },
  {
    step: 6,
    title: "Preparing Integrated Plan Dossier",
    desc: "Consolidated Block B-014 synthesized and ready for Divisional Planner sanction.",
  },
];

export function PlanGenerationModal({ isOpen, onClose, onComplete }: PlanGenerationModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setCurrentStep(1);
      setIsFinished(false);
      return;
    }

    // Fast, deterministic 1.2s progression
    const timer1 = setTimeout(() => setCurrentStep(2), 200);
    const timer2 = setTimeout(() => setCurrentStep(3), 400);
    const timer3 = setTimeout(() => setCurrentStep(4), 600);
    const timer4 = setTimeout(() => setCurrentStep(5), 800);
    const timer5 = setTimeout(() => setCurrentStep(6), 1000);
    const timer6 = setTimeout(() => {
      setIsFinished(true);
      setCurrentStep(7);
    }, 1200);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
      clearTimeout(timer5);
      clearTimeout(timer6);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 max-w-lg w-full shadow-2xl space-y-5 font-sans animate-scaleUp">
        {/* Header */}
        <div className="flex items-start justify-between pb-3 border-b border-slate-100">
          <div>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-900 border border-blue-200">
              INTEGRATED PLANNING ENGINE
            </span>
            <h3 className="text-base font-bold text-slate-900 mt-1">
              Building Today&apos;s Integrated Plan
            </h3>
            <p className="text-xs text-slate-500">
              Deterministic timetable-safe possession composition
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-700 rounded-md transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Vertical Step Workflow */}
        <div className="space-y-3 font-mono">
          {GENERATION_STEPS.map((s) => {
            const isDone = currentStep > s.step;
            const isCurrent = currentStep === s.step;

            return (
              <div key={s.step} className="flex items-start gap-3 text-xs">
                <div className="mt-0.5 shrink-0">
                  {isDone ? (
                    <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center justify-center">
                      <Check className="w-3 h-3" />
                    </div>
                  ) : isCurrent ? (
                    <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-800 border border-blue-400 flex items-center justify-center animate-spin">
                      <Loader2 className="w-3 h-3" />
                    </div>
                  ) : (
                    <div className="w-5 h-5 rounded-full bg-slate-100 text-slate-400 border border-slate-200 flex items-center justify-center text-[10px]">
                      {s.step}
                    </div>
                  )}
                </div>

                <div>
                  <h4
                    className={cn(
                      "font-semibold text-xs transition-colors",
                      isDone
                        ? "text-slate-900"
                        : isCurrent
                        ? "text-blue-900 font-bold"
                        : "text-slate-400 font-normal"
                    )}
                  >
                    {s.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 font-sans mt-0.5 leading-tight">
                    {s.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
          <span className="text-[11px] font-mono text-slate-500">
            {isFinished ? "Plan synthesized in 1.2s" : "Evaluating constraints..."}
          </span>

          <button
            onClick={() => {
              onComplete();
              onClose();
            }}
            disabled={!isFinished}
            className={cn(
              "px-4 py-2 rounded-lg font-semibold text-xs transition-all flex items-center gap-1.5 shadow-sm",
              isFinished
                ? "bg-blue-900 hover:bg-blue-800 text-white cursor-pointer shadow-blue-950/20"
                : "bg-slate-200 text-slate-400 cursor-not-allowed"
            )}
          >
            <span>View Generated Recommendation</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
