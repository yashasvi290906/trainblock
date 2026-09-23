"use client";

import React, { useState } from "react";
import { AlertTriangle, CheckCircle2, Clock, Layers, ArrowRight, X, ShieldAlert, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface FallbackWindow {
  id: string;
  startTime: string;
  endTime: string;
  durationMin: number;
  compatibility: number;
  passengerConflicts: number;
  freightConflicts: number;
  criticalTasksRetained: string;
  status: string;
}

const FALLBACK_OPTIONS: FallbackWindow[] = [
  {
    id: "FW-01",
    startTime: "04:20",
    endTime: "06:10",
    durationMin: 110,
    compatibility: 95,
    passengerConflicts: 0,
    freightConflicts: 1,
    criticalTasksRetained: "7/7 (100%)",
    status: "RECOMMENDED / ZERO PASSENGER DELAY",
  },
  {
    id: "FW-02",
    startTime: "01:10",
    endTime: "02:40",
    durationMin: 90,
    compatibility: 82,
    passengerConflicts: 1,
    freightConflicts: 0,
    criticalTasksRetained: "6/7 (86%)",
    status: "ACCEPTABLE / 1 PASSENGER REGULATED",
  },
  {
    id: "FW-03",
    startTime: "05:10",
    endTime: "06:40",
    durationMin: 90,
    compatibility: 68,
    passengerConflicts: 3,
    freightConflicts: 1,
    criticalTasksRetained: "5/7 (71%)",
    status: "HIGH TIMETABLE CHURN",
  },
];

interface BlockDenialWorkflowProps {
  isOpen: boolean;
  onClose: () => void;
  onReplan: (selectedFallback: FallbackWindow) => void;
}

export function BlockDenialWorkflow({ isOpen, onClose, onReplan }: BlockDenialWorkflowProps) {
  const [selectedFallbackId, setSelectedFallbackId] = useState<string>("FW-01");

  if (!isOpen) return null;

  const selectedFallback =
    FALLBACK_OPTIONS.find((f) => f.id === selectedFallbackId) || FALLBACK_OPTIONS[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-xs p-4 font-sans">
      <div className="bg-white rounded-2xl border border-red-300 shadow-2xl max-w-xl w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-5 border-b border-red-100 bg-red-50/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-red-600 text-white flex items-center justify-center shadow-xs">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-red-950 font-mono">
                OPERATING CONTROL · BLOCK B-014 DENIED
              </h2>
              <p className="text-xs text-red-700">
                Original 02:20–04:10 slot rejected to avoid Vande Bharat 20833 regulation
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-red-400 hover:text-red-600 p-1 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4 text-xs font-sans">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-700 space-y-1">
            <span className="font-mono text-[10.5px] uppercase font-bold text-slate-800 block">
              Dynamic Re-Planning Intelligence
            </span>
            <p className="text-xs leading-relaxed">
              RAILBLOCK has evaluated timetable gaps along the SEC–NDL corridor to identify alternative multi-departmental possession windows that preserve all 7 critical work orders without passenger train detention.
            </p>
          </div>

          {/* Candidate Fallback Slots List */}
          <div className="space-y-2">
            <span className="font-mono text-[10.5px] uppercase font-bold text-slate-500">
              Candidate Fallback Windows:
            </span>

            {FALLBACK_OPTIONS.map((fb) => {
              const isSelected = selectedFallbackId === fb.id;
              return (
                <div
                  key={fb.id}
                  onClick={() => setSelectedFallbackId(fb.id)}
                  className={cn(
                    "p-3 rounded-xl border transition-all cursor-pointer font-mono text-xs flex flex-col justify-between gap-1.5",
                    isSelected
                      ? "bg-blue-50/80 border-blue-600 ring-2 ring-blue-600/30 shadow-xs"
                      : "bg-white border-slate-200 hover:bg-slate-50"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-blue-900">{fb.id}</span>
                      <span className="text-slate-800 font-bold">
                        {fb.startTime} – {fb.endTime} ({fb.durationMin}m)
                      </span>
                    </div>

                    <span
                      className={cn(
                        "px-2 py-0.5 rounded text-[10px] font-bold border",
                        fb.passengerConflicts === 0
                          ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                          : "bg-amber-50 text-amber-800 border-amber-200"
                      )}
                    >
                      {fb.status}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 font-sans pt-1 border-t border-slate-100">
                    <span>
                      Critical Work Retained: <strong className="text-slate-900">{fb.criticalTasksRetained}</strong>
                    </span>
                    <span>
                      Passenger Conflicts: <strong className={fb.passengerConflicts === 0 ? "text-emerald-700" : "text-amber-700"}>{fb.passengerConflicts}</strong>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <Button variant="secondary" size="md" onClick={onClose}>
            Cancel
          </Button>

          <button
            onClick={() => {
              onReplan(selectedFallback);
              onClose();
            }}
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-mono text-xs font-bold transition-colors flex items-center gap-2 shadow-md cursor-pointer"
          >
            <span>Replan to {selectedFallback.id} ({selectedFallback.startTime}–{selectedFallback.endTime})</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
