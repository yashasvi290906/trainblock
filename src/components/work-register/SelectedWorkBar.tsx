"use client";

import React from "react";
import { MaintenanceTask } from "@/types/maintenance";
import { Layers, ArrowRight, X, CalendarRange } from "lucide-react";
import { formatKmRange, formatDuration } from "@/lib/formatting";
import { Button } from "@/components/ui/Button";

interface SelectedWorkBarProps {
  selectedTasks: MaintenanceTask[];
  onClearSelection: () => void;
  onFindCoordination: () => void;
  onSendToPlanner: () => void;
}

export function SelectedWorkBar({
  selectedTasks,
  onClearSelection,
  onFindCoordination,
  onSendToPlanner,
}: SelectedWorkBarProps) {
  if (selectedTasks.length === 0) return null;

  const totalDuration = selectedTasks.reduce((acc, t) => acc + t.duration, 0);
  const minKm = Math.min(...selectedTasks.map((t) => t.kmStart));
  const maxKm = Math.max(...selectedTasks.map((t) => t.kmEnd));
  const departments = Array.from(new Set(selectedTasks.map((t) => t.department)));

  const deptLabels = departments
    .map((d) => (d === "Engineering" ? "ENG" : d === "S&T" ? "S&T" : "TRD"))
    .join(" · ");

  return (
    <div className="fixed bottom-4 inset-x-4 sm:inset-x-auto sm:right-6 sm:left-64 z-30 animate-in slide-in-from-bottom-3 duration-200">
      <div className="bg-slate-900 text-white rounded-2xl border border-slate-700 p-3 sm:p-4 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-3 font-mono">
        {/* Selection Statistics */}
        <div className="flex flex-wrap items-center gap-4 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse" />
            <span className="font-extrabold text-sm text-white">
              {selectedTasks.length} DEMANDS SELECTED
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-3 text-slate-300 border-l border-slate-700 pl-4">
            <div>
              <span className="text-slate-500 text-[10px] block">Combined Duration:</span>
              <span className="font-bold text-amber-400">{formatDuration(totalDuration)}</span>
            </div>

            <div>
              <span className="text-slate-500 text-[10px] block">Shared Corridor:</span>
              <span className="font-bold text-slate-200">{formatKmRange(minKm, maxKm)}</span>
            </div>

            <div>
              <span className="text-slate-500 text-[10px] block">Departments:</span>
              <span className="font-bold text-sky-400">{deptLabels}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
          <button
            onClick={onClearSelection}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
            <span>Clear</span>
          </button>

          <Button
            variant="secondary"
            size="sm"
            onClick={onFindCoordination}
            icon={<Layers className="w-3.5 h-3.5 text-slate-700" />}
          >
            Find Coordination
          </Button>

          <button
            onClick={onSendToPlanner}
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold font-mono transition-colors flex items-center gap-1.5 shadow-md cursor-pointer"
          >
            <span>Send to Block Planner</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
