"use client";

import React, { useState, useEffect } from "react";
import { X, CheckCircle2, Sparkles, Database, Clock, ShieldCheck, ArrowRight, Layers } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface PrioritizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
  totalTasksCount: number;
  criticalCount: number;
  overdueCount: number;
}

const STEPS = [
  { id: 1, label: "Reading Maintenance Demand", detail: "Ingesting work orders from TMS, SMMS & TDMS repositories" },
  { id: 2, label: "Checking Due Dates & Tolerances", detail: "Evaluating permissible inspection cycles and overdue thresholds" },
  { id: 3, label: "Assessing Asset Availability Impact", detail: "Determining operational risk and speed restriction penalties" },
  { id: 4, label: "Identifying Overdue & Safety Critical Work", detail: "Flagging P1 critical track, signal, and 25kV traction items" },
  { id: 5, label: "Ranking Block-Dependent Demands", detail: "Assigning deterministic urgency tiers (P1/P2/P3) across corridor" },
];

export function PrioritizationModal({
  isOpen,
  onClose,
  onComplete,
  totalTasksCount = 18,
  criticalCount = 3,
  overdueCount = 7,
}: PrioritizationModalProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setCurrentStepIndex(0);
      setIsFinished(false);
      return;
    }

    const interval = setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev < STEPS.length - 1) {
          return prev + 1;
        } else {
          clearInterval(interval);
          setIsFinished(true);
          return prev;
        }
      });
    }, 450);

    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 font-sans">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-900 text-white flex items-center justify-center shadow-xs">
              <Sparkles className="w-4 h-4 text-blue-200" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 font-mono">
                CORRIDOR DEMAND PRIORITIZATION
              </h2>
              <p className="text-xs text-slate-500">
                Deterministic Rule-Constrained Assessment · SEC–NDL
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-5">
          {/* Progress Sequence */}
          <div className="space-y-2.5 font-mono text-xs">
            {STEPS.map((step, idx) => {
              const isDone = currentStepIndex > idx || isFinished;
              const isActive = currentStepIndex === idx && !isFinished;

              return (
                <div
                  key={step.id}
                  className={`p-2.5 rounded-xl border transition-all flex items-start gap-3 ${
                    isActive
                      ? "bg-blue-50 border-blue-300 text-blue-900 shadow-2xs"
                      : isDone
                      ? "bg-slate-50 border-slate-200 text-slate-700"
                      : "bg-white border-slate-100 text-slate-400"
                  }`}
                >
                  <div className="mt-0.5 shrink-0">
                    {isDone ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    ) : isActive ? (
                      <div className="w-4 h-4 rounded-full border-2 border-blue-700 border-t-transparent animate-spin" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border border-slate-300 flex items-center justify-center text-[10px]">
                        {step.id}
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="font-bold text-xs uppercase tracking-tight">
                      {step.label}
                    </div>
                    <div className="text-[11px] text-slate-500 font-sans mt-0.5">
                      {step.detail}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Assessment Output Summary (Visible when finished) */}
          {isFinished && (
            <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200 space-y-3 font-mono animate-in fade-in duration-200">
              <div className="flex items-center justify-between text-xs font-bold text-emerald-950 uppercase border-b border-emerald-200 pb-2">
                <span>Assessment Outcome</span>
                <span className="text-emerald-700">100% Calibrated</span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-2 rounded bg-white border border-emerald-100 shadow-2xs">
                  <div className="text-base font-extrabold text-red-700">{criticalCount}</div>
                  <div className="text-[9.5px] uppercase font-bold text-slate-500 mt-0.5">
                    Critical Tasks
                  </div>
                </div>

                <div className="p-2 rounded bg-white border border-emerald-100 shadow-2xs">
                  <div className="text-base font-extrabold text-amber-700">{overdueCount}</div>
                  <div className="text-[9.5px] uppercase font-bold text-slate-500 mt-0.5">
                    Overdue Tasks
                  </div>
                </div>

                <div className="p-2 rounded bg-white border border-emerald-100 shadow-2xs">
                  <div className="text-base font-extrabold text-blue-900">7</div>
                  <div className="text-[9.5px] uppercase font-bold text-slate-500 mt-0.5">
                    Coord Opportunities
                  </div>
                </div>
              </div>

              <p className="text-[11px] text-slate-600 font-sans leading-relaxed">
                Prioritization complete. Maintenance demands are ranked by safety criticality and asset availability impact, ready for multi-departmental block composition.
              </p>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/70 flex items-center justify-end gap-2">
          <Button variant="secondary" size="md" onClick={onClose}>
            Close
          </Button>
          <Button
            variant="primary"
            size="md"
            disabled={!isFinished}
            onClick={() => {
              onComplete();
              onClose();
            }}
            icon={<ArrowRight className="w-4 h-4" />}
          >
            Apply Priority Ranking
          </Button>
        </div>
      </div>
    </div>
  );
}
