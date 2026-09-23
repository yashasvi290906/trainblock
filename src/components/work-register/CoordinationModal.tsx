"use client";

import React from "react";
import { X, Layers, ArrowRight, CheckCircle2, Wrench, Radio, Zap, MapPin, Clock, ShieldCheck } from "lucide-react";
import { MaintenanceTask } from "@/types/maintenance";
import { Button } from "@/components/ui/Button";
import { formatKmRange, formatDuration } from "@/lib/formatting";

interface CoordinationModalProps {
  isOpen: boolean;
  onClose: () => void;
  tasks: MaintenanceTask[];
  onSelectGroupAndPlan: (taskIds: string[]) => void;
}

export function CoordinationModal({
  isOpen,
  onClose,
  tasks,
  onSelectGroupAndPlan,
}: CoordinationModalProps) {
  if (!isOpen) return null;

  // Group 01: WL - NDKD Sector (KM 68 - 94) -> Block B-014
  const group1Tasks = tasks.filter((t) => t.kmStart >= 65 && t.kmStart <= 95);
  // Group 02: SEC - KZJ Sector (KM 42 - 55) -> Block B-009
  const group2Tasks = tasks.filter((t) => t.kmStart >= 40 && t.kmStart <= 55);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 font-sans">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-2xl w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-900 text-white flex items-center justify-center shadow-xs">
              <Layers className="w-4 h-4 text-blue-200" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 font-mono">
                COORDINATION & GROUPING OPPORTUNITIES
              </h2>
              <p className="text-xs text-slate-500">
                Identified candidate multi-department possessions along SEC–NDL corridor
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

        {/* Modal Body - Scrollable */}
        <div className="p-5 overflow-y-auto space-y-4">
          {/* GROUP 01: Primary Integrated Cluster (WL - NDKD) */}
          <div className="p-4 rounded-xl bg-blue-50/40 border border-blue-200 space-y-3 font-mono">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-blue-200 pb-2">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-blue-900 text-white text-[11px] font-bold">
                  GROUP 01 · PRIORITY CLUSTER
                </span>
                <span className="text-xs font-bold text-slate-800">
                  KM 68–94 (WL – NDKD)
                </span>
              </div>

              <div className="flex items-center gap-2 text-xs">
                <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Candidate Block B-014
                </span>
                <span className="text-slate-600 font-bold">02:20–04:10</span>
              </div>
            </div>

            {/* Department Breakdown */}
            <div className="grid grid-cols-3 gap-2 text-xs font-sans">
              <div className="p-2 rounded bg-white border border-slate-200 shadow-2xs">
                <div className="flex items-center gap-1 font-semibold text-amber-900 font-mono text-[11px]">
                  <Wrench className="w-3 h-3 text-amber-600" />
                  <span>Engineering (2)</span>
                </div>
                <span className="text-[10px] text-slate-500 block mt-0.5">
                  Track Tamping & Rail Joints
                </span>
              </div>

              <div className="p-2 rounded bg-white border border-slate-200 shadow-2xs">
                <div className="flex items-center gap-1 font-semibold text-sky-900 font-mono text-[11px]">
                  <Radio className="w-3 h-3 text-sky-600" />
                  <span>S&T (3)</span>
                </div>
                <span className="text-[10px] text-slate-500 block mt-0.5">
                  Track Circuits & Signals
                </span>
              </div>

              <div className="p-2 rounded bg-white border border-slate-200 shadow-2xs">
                <div className="flex items-center gap-1 font-semibold text-purple-900 font-mono text-[11px]">
                  <Zap className="w-3 h-3 text-purple-600" />
                  <span>Traction (2)</span>
                </div>
                <span className="text-[10px] text-slate-500 block mt-0.5">
                  OHE Cantilever & Isolator
                </span>
              </div>
            </div>

            {/* Tasks Summary */}
            <div className="text-[11px] text-slate-600 font-sans flex items-center justify-between pt-1">
              <span>
                <strong>{group1Tasks.length} demands</strong> consolidated into <strong>1 integrated possession</strong>
              </span>
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  onSelectGroupAndPlan(group1Tasks.map((t) => t.taskId));
                  onClose();
                }}
                icon={<ArrowRight className="w-3.5 h-3.5" />}
              >
                Send Group 01 to Block Planner
              </Button>
            </div>
          </div>

          {/* GROUP 02: Secondary Cluster (SEC - KZJ) */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 font-mono">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-2">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-slate-800 text-white text-[11px] font-bold">
                  GROUP 02 · CANDIDATE
                </span>
                <span className="text-xs font-bold text-slate-800">
                  KM 42–51 (SEC – KZJ)
                </span>
              </div>

              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-700 font-bold bg-slate-200 px-2 py-0.5 rounded">
                  Candidate Block B-009
                </span>
                <span className="text-slate-600">01:30–02:45</span>
              </div>
            </div>

            {/* Department Breakdown */}
            <div className="grid grid-cols-3 gap-2 text-xs font-sans">
              <div className="p-2 rounded bg-white border border-slate-200 shadow-2xs">
                <div className="flex items-center gap-1 font-semibold text-amber-900 font-mono text-[11px]">
                  <Wrench className="w-3 h-3 text-amber-600" />
                  <span>Engineering (2)</span>
                </div>
                <span className="text-[10px] text-slate-500 block mt-0.5">
                  Ballast Screening & Joint
                </span>
              </div>

              <div className="p-2 rounded bg-white border border-slate-200 shadow-2xs">
                <div className="flex items-center gap-1 font-semibold text-sky-900 font-mono text-[11px]">
                  <Radio className="w-3 h-3 text-sky-600" />
                  <span>S&T (1)</span>
                </div>
                <span className="text-[10px] text-slate-500 block mt-0.5">
                  Signal Head Overhaul
                </span>
              </div>

              <div className="p-2 rounded bg-white border border-slate-200 shadow-2xs">
                <div className="flex items-center gap-1 font-semibold text-purple-900 font-mono text-[11px]">
                  <Zap className="w-3 h-3 text-purple-600" />
                  <span>Traction (1)</span>
                </div>
                <span className="text-[10px] text-slate-500 block mt-0.5">
                  OHE Isolator Switch
                </span>
              </div>
            </div>

            {/* Tasks Summary */}
            <div className="text-[11px] text-slate-600 font-sans flex items-center justify-between pt-1">
              <span>
                <strong>{group2Tasks.length} demands</strong> compatible for co-located window
              </span>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  onSelectGroupAndPlan(group2Tasks.map((t) => t.taskId));
                  onClose();
                }}
                icon={<ArrowRight className="w-3.5 h-3.5" />}
              >
                Send Group 02 to Block Planner
              </Button>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/70 flex items-center justify-between text-xs font-mono text-slate-500">
          <span>Spatial & Temporal Compatibility Index: 100% Deterministic</span>
          <Button variant="secondary" size="md" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
