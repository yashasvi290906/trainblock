"use client";

import React from "react";
import Link from "next/link";
import { Wrench, Radio, Zap, ArrowRight, Check, AlertCircle, Layers } from "lucide-react";
import { MaintenanceTask, Department } from "@/types/maintenance";
import { formatDuration, formatKmRange } from "@/lib/formatting";
import { cn } from "@/lib/utils";

interface WorkDemandPanelProps {
  tasks: MaintenanceTask[];
  selectedTaskIds?: string[];
  onTaskClick?: (taskId: string) => void;
  activeHighlightedTaskId?: string | null;
}

export function WorkDemandPanel({
  tasks,
  selectedTaskIds = ["ENG-260", "ENG-261", "ST-129", "ST-130", "ST-131", "TR-088", "TR-089"],
  onTaskClick,
  activeHighlightedTaskId,
}: WorkDemandPanelProps) {
  // Show the most relevant 7 tasks clustered around KM 68-94
  const displayTasks = tasks
    .filter((t) => selectedTaskIds.includes(t.taskId) || t.kmStart >= 65 && t.kmEnd <= 95)
    .slice(0, 7);

  const getPriorityBadge = (criticality: string, overdueDays: number) => {
    if (criticality === "Critical" || overdueDays >= 10) {
      return (
        <span className="px-1.5 py-0.5 rounded bg-red-100 text-red-800 border border-red-200 text-[10px] font-mono font-bold">
          P1
        </span>
      );
    }
    if (criticality === "High" || overdueDays >= 5) {
      return (
        <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-200 text-[10px] font-mono font-bold">
          P2
        </span>
      );
    }
    return (
      <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 text-[10px] font-mono font-medium">
        P3
      </span>
    );
  };

  const getDeptTag = (department: Department) => {
    if (department === "Engineering") {
      return (
        <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded bg-amber-50 text-amber-900 border border-amber-200 text-[10px] font-mono font-semibold">
          <Wrench className="w-2.5 h-2.5 text-amber-700" />
          <span>ENG</span>
        </span>
      );
    }
    if (department === "S&T") {
      return (
        <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded bg-sky-50 text-sky-900 border border-sky-200 text-[10px] font-mono font-semibold">
          <Radio className="w-2.5 h-2.5 text-sky-700" />
          <span>S&T</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded bg-purple-50 text-purple-900 border border-purple-200 text-[10px] font-mono font-semibold">
        <Zap className="w-2.5 h-2.5 text-purple-700" />
        <span>TRC</span>
      </span>
    );
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 p-4 sm:p-5 shadow-xs flex flex-col justify-between h-full space-y-4">
      <div>
        {/* Panel Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-xs font-mono font-extrabold uppercase text-slate-900 tracking-wider flex items-center gap-1.5">
              <Wrench className="w-3.5 h-3.5 text-blue-900" />
              <span>WORK READY FOR PLANNING</span>
            </h3>
            <p className="text-[11px] text-slate-500 font-medium">
              Maintenance backlog co-located at KM 68–94
            </p>
          </div>
          <span className="text-[11px] font-mono font-bold text-blue-900 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded">
            {displayTasks.length} In Block
          </span>
        </div>

        {/* Integration Compatibility Formula Strip */}
        <div className="my-3 p-2 rounded-lg bg-slate-50 border border-slate-200 text-[10px] font-mono text-slate-600 flex items-center justify-between">
          <span>Similar KM + Compatible Protection</span>
          <span className="text-blue-900 font-bold flex items-center gap-1">
            → Candidate
          </span>
        </div>

        {/* Task List (Top 5-7 tasks) */}
        <div className="space-y-2">
          {displayTasks.map((t) => {
            const isSelected = selectedTaskIds.includes(t.taskId);
            const isHighlighted = activeHighlightedTaskId === t.taskId;

            return (
              <div
                key={t.taskId}
                onClick={() => onTaskClick && onTaskClick(t.taskId)}
                className={cn(
                  "p-2.5 rounded-lg border text-xs transition-all cursor-pointer select-none",
                  isHighlighted
                    ? "bg-blue-50/90 border-blue-500 ring-2 ring-blue-300 shadow-xs"
                    : isSelected
                    ? "bg-white border-slate-300 hover:border-slate-400 hover:bg-slate-50/60 shadow-2xs"
                    : "bg-slate-50 border-slate-200 opacity-60 hover:opacity-100"
                )}
              >
                {/* Top line: Task ID, Department tag, Priority, Duration */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono font-extrabold text-slate-900 text-[11px]">
                      {t.taskId}
                    </span>
                    {getDeptTag(t.department)}
                    {getPriorityBadge(t.criticality, t.overdueDays)}
                  </div>
                  <span className="font-mono font-semibold text-slate-700 text-[11px]">
                    {formatDuration(t.duration)}
                  </span>
                </div>

                {/* Bottom line: Asset & KM range */}
                <div className="flex items-center justify-between mt-1 text-[11px] text-slate-600">
                  <span className="truncate max-w-[140px] font-medium text-slate-700">
                    {t.assetType} · {t.title.split("&")[0].trim()}
                  </span>
                  <span className="font-mono text-slate-500 text-[10px] shrink-0 font-medium">
                    {formatKmRange(t.kmStart, t.kmEnd)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer Navigation */}
      <div className="pt-3 border-t border-slate-100">
        <Link
          href="/work-register"
          className="w-full inline-flex items-center justify-between px-3 py-2 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-medium text-slate-700 hover:text-slate-900 transition-colors group"
        >
          <span>View all work orders ({tasks.length})</span>
          <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-700 transition-colors" />
        </Link>
      </div>
    </div>
  );
}
