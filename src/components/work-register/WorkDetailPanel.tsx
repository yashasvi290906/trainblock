"use client";

import React from "react";
import Link from "next/link";
import { MaintenanceTask } from "@/types/maintenance";
import { calculateTaskPriority } from "@/lib/calculations";
import { formatKmRange, formatDuration, getDepartmentColor } from "@/lib/formatting";
import {
  MapPin,
  Clock,
  Shield,
  Users,
  AlertTriangle,
  Layers,
  ArrowRight,
  Eye,
  CheckCircle2,
  Wrench,
  Radio,
  Zap,
  HelpCircle,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface WorkDetailPanelProps {
  task: MaintenanceTask;
  allTasks: MaintenanceTask[];
  onSelectTask: (taskId: string) => void;
  onSendToPlanner: (taskIds: string[]) => void;
  onOpenTrace?: () => void;
}

export function WorkDetailPanel({
  task,
  allTasks,
  onSelectTask,
  onSendToPlanner,
  onOpenTrace,
}: WorkDetailPanelProps) {
  const priority = calculateTaskPriority(task);
  const isOverdue = task.overdueDays > 0;

  // Find nearby compatible tasks within 15 km
  const nearbyCompatibleTasks = allTasks.filter(
    (t) =>
      t.taskId !== task.taskId &&
      Math.abs(t.kmStart - task.kmStart) <= 18
  );

  const departmentsInCluster = Array.from(
    new Set([task.department, ...nearbyCompatibleTasks.map((t) => t.department)])
  );

  const hasEng = departmentsInCluster.includes("Engineering");
  const hasSt = departmentsInCluster.includes("S&T");
  const hasTrc = departmentsInCluster.includes("Traction");

  const combinedCandidateIds = [task.taskId, ...nearbyCompatibleTasks.map((t) => t.taskId)];

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-xs flex flex-col justify-between space-y-4 font-sans">
      {/* Header Info */}
      <div className="space-y-3 pb-3 border-b border-slate-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-mono text-base font-extrabold text-blue-900">
              {task.taskId}
            </span>
            <span
              className={cn(
                "px-2 py-0.5 rounded text-[10.5px] font-mono font-semibold border",
                getDepartmentColor(task.department).badge
              )}
            >
              {task.department}
            </span>
            <span
              className={cn(
                "px-2 py-0.5 rounded text-[10.5px] font-mono font-bold border",
                priority.tier === "P1"
                  ? "bg-red-50 text-red-800 border-red-200"
                  : priority.tier === "P2"
                  ? "bg-amber-50 text-amber-800 border-amber-200"
                  : priority.tier === "P3"
                  ? "bg-blue-50 text-blue-800 border-blue-200"
                  : "bg-slate-100 text-slate-700 border-slate-200"
              )}
            >
              {priority.tier} · {task.criticality}
            </span>
          </div>

          <span className="text-[11px] font-mono text-slate-400">
            SEC–NDL Division
          </span>
        </div>

        <div>
          <h3 className="text-sm font-bold text-slate-900 leading-snug">
            {task.title}
          </h3>
          <p className="text-xs text-slate-500 font-mono mt-0.5">
            Asset ID: <span className="font-semibold text-slate-700">{task.assetId}</span> ({task.assetType})
          </p>
        </div>
      </div>

      {/* Core Operational Parameters Grid */}
      <div className="grid grid-cols-2 gap-2 text-xs font-sans">
        <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80">
          <span className="text-[10px] uppercase font-bold text-slate-500 flex items-center gap-1 font-mono">
            <MapPin className="w-3 h-3 text-blue-700" /> Location
          </span>
          <div className="font-mono font-bold text-slate-900 mt-1">
            {formatKmRange(task.kmStart, task.kmEnd)}
          </div>
          <span className="text-[10px] text-slate-500 font-mono">
            {task.direction} Line
          </span>
        </div>

        <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80">
          <span className="text-[10px] uppercase font-bold text-slate-500 flex items-center gap-1 font-mono">
            <Clock className="w-3 h-3 text-amber-600" /> Duration & Due
          </span>
          <div className="font-mono font-bold text-slate-900 mt-1">
            {formatDuration(task.duration)}
          </div>
          <span
            className={cn(
              "text-[10px] font-mono font-semibold",
              isOverdue ? "text-red-700" : "text-emerald-700"
            )}
          >
            {isOverdue ? `${task.overdueDays}d overdue` : "On maintenance cycle"}
          </span>
        </div>

        <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80">
          <span className="text-[10px] uppercase font-bold text-slate-500 flex items-center gap-1 font-mono">
            <Shield className="w-3 h-3 text-emerald-700" /> Block Requirement
          </span>
          <div className="font-mono font-semibold text-slate-900 mt-1 truncate">
            {task.requiredProtection}
          </div>
          <span className="text-[10px] text-slate-500 font-mono">
            {task.oheRequired ? "OHE 25kV Isolation" : "No OHE Isolation"}
          </span>
        </div>

        <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80">
          <span className="text-[10px] uppercase font-bold text-slate-500 flex items-center gap-1 font-mono">
            <Users className="w-3 h-3 text-purple-700" /> Crew & Plant
          </span>
          <div className="font-mono font-semibold text-slate-900 mt-1">
            {task.crewRequired} Crew Members
          </div>
          <span className="text-[10px] text-slate-500 truncate block">
            {task.machineRequired !== "None" ? task.machineRequired : "Manual deployment"}
          </span>
        </div>
      </div>

      {/* Asset Availability Impact (Specific Problem Statement Context) */}
      <div className="p-3 rounded-lg bg-amber-50/60 border border-amber-200 space-y-1 text-xs">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[10.5px] uppercase font-bold text-amber-900 flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            <span>Asset Availability Impact</span>
          </span>
          <span className="px-1.5 py-0.2 rounded bg-amber-100 text-amber-900 border border-amber-300 font-mono font-bold text-[10px]">
            {task.reasonCodes.availabilityImpact.toUpperCase()} IMPACT
          </span>
        </div>
        <p className="text-slate-700 text-xs leading-relaxed">
          {task.criticality === "Critical" || isOverdue
            ? "Track section unavailable for planned operations if deferred; imminent failure risk imposes 30 km/h caution order."
            : "Routine cyclic wear on high-density corridor; timely completion preserves standard line capacity."}
        </p>
      </div>

      {/* Planning Context & Coordination Opportunity */}
      <div className="p-3.5 rounded-xl bg-blue-50/50 border border-blue-200 space-y-3 font-sans">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[11px] uppercase font-extrabold text-blue-950 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-blue-700" />
            <span>COORDINATION OPPORTUNITY</span>
          </span>
          <span className="text-[10px] font-mono font-bold text-blue-800 bg-blue-100/70 px-2 py-0.5 rounded border border-blue-300">
            {nearbyCompatibleTasks.length} Compatible Nearby
          </span>
        </div>

        <p className="text-xs text-slate-600">
          <strong className="text-slate-800">{nearbyCompatibleTasks.length + 1} nearby tasks</strong> can share the same track possession window without separate blockades.
        </p>

        {/* Nearby Compatible Tasks List */}
        {nearbyCompatibleTasks.length > 0 && (
          <div className="space-y-1.5">
            {nearbyCompatibleTasks.slice(0, 3).map((ct) => (
              <div
                key={ct.taskId}
                onClick={() => onSelectTask(ct.taskId)}
                className="flex items-center justify-between p-2 rounded-lg bg-white border border-slate-200 text-xs font-mono hover:border-blue-400 cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className="font-bold text-blue-900">{ct.taskId}</span>
                  <span className="text-slate-400">·</span>
                  <span className="text-slate-700 font-sans truncate max-w-[140px]">
                    {ct.title}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-slate-500 text-[10.5px]">
                  <span>KM {ct.kmStart}</span>
                  <span className="px-1.5 py-0.2 rounded bg-slate-100 text-slate-700 text-[9.5px]">
                    {ct.duration}m
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Potential Integrated Block Box */}
        <div className="p-2.5 rounded-lg bg-white border border-blue-200 font-mono text-xs space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="text-slate-500 font-sans">Potential Block:</span>
              <span className="font-extrabold text-blue-900">
                {task.scheduledBlockId || "B-014"}
              </span>
            </div>
            <span className="text-blue-950 font-bold">
              {task.recommendedWindow || "02:20–04:10"}
            </span>
          </div>

          {/* Department Compatibility Checklist */}
          <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-[10.5px]">
            <span className="font-sans text-slate-500">Compatibility:</span>
            <div className="flex items-center gap-3">
              <span
                className={cn(
                  "flex items-center gap-0.5",
                  hasEng ? "text-emerald-700 font-bold" : "text-slate-400"
                )}
              >
                <CheckCircle2 className="w-3 h-3" /> ENG
              </span>
              <span
                className={cn(
                  "flex items-center gap-0.5",
                  hasSt ? "text-emerald-700 font-bold" : "text-slate-400"
                )}
              >
                <CheckCircle2 className="w-3 h-3" /> S&T
              </span>
              <span
                className={cn(
                  "flex items-center gap-0.5",
                  hasTrc ? "text-emerald-700 font-bold" : "text-slate-400"
                )}
              >
                <CheckCircle2 className="w-3 h-3" /> TRD
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Footers */}
      <div className="pt-2 border-t border-slate-100 space-y-2">
        <button
          onClick={() => onOpenTrace && onOpenTrace()}
          className="w-full py-2 px-3.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-950 border border-indigo-200 rounded-lg text-xs font-semibold font-mono flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-700" />
          <span>Why This Task? (Rule + ML Trace)</span>
        </button>

        <button
          onClick={() => onSendToPlanner(combinedCandidateIds)}
          className="w-full py-2.5 px-4 bg-blue-900 hover:bg-blue-800 text-white rounded-lg text-xs font-semibold font-mono flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
        >
          <span>Plan with Compatible Work</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <Link
          href={`/live-corridor?task=${task.taskId}`}
          className="w-full py-2 px-4 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-lg text-xs font-semibold text-center transition-colors flex items-center justify-center gap-1.5"
        >
          <Eye className="w-3.5 h-3.5 text-slate-500" />
          <span>Inspect on Live Corridor</span>
        </Link>
      </div>
    </div>
  );
}
