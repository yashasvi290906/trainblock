"use client";

import React from "react";
import { MaintenanceTask } from "@/types/maintenance";
import { DepartmentBadge } from "./DepartmentBadge";
import { CriticalityBadge } from "./CriticalityBadge";
import { formatKmRange, formatDuration } from "@/lib/formatting";
import {
  X,
  Clock,
  MapPin,
  Shield,
  Layers,
  Sparkles,
  Zap,
  Users,
  Eye,
  CheckCircle2,
  Calendar,
} from "lucide-react";
import Link from "next/link";

interface TaskDetailDrawerProps {
  task: MaintenanceTask | null;
  onClose: () => void;
}

export function TaskDetailDrawer({ task, onClose }: TaskDetailDrawerProps) {
  if (!task) return null;

  return (
    <div className="bg-[#0c1527] border border-[#1a2948] rounded-lg p-5 flex flex-col justify-between h-full shadow-xl">
      <div>
        {/* Header */}
        <div className="flex items-start justify-between pb-3 border-b border-[#182643]">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm font-bold text-sky-400">
                {task.taskId}
              </span>
              <DepartmentBadge department={task.department} size="sm" />
              <CriticalityBadge criticality={task.criticality} size="sm" />
            </div>
            <h3 className="text-sm font-semibold text-white mt-1">
              {task.title}
            </h3>
            <p className="text-[11px] text-slate-400 font-mono">
              Asset ID: {task.assetId} ({task.assetType})
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded hover:bg-[#16233d] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Core Task Parameters Grid */}
        <div className="grid grid-cols-2 gap-3 my-4">
          <div className="p-2.5 rounded bg-[#080f1d] border border-[#14223b]">
            <span className="text-[10px] text-slate-400 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-sky-400" /> KM Range & Track
            </span>
            <p className="mono-num text-xs font-semibold text-slate-200 mt-1">
              {formatKmRange(task.kmStart, task.kmEnd)}
            </p>
            <span className="text-[10px] font-mono text-slate-400">
              {task.direction} Line
            </span>
          </div>

          <div className="p-2.5 rounded bg-[#080f1d] border border-[#14223b]">
            <span className="text-[10px] text-slate-400 flex items-center gap-1">
              <Clock className="w-3 h-3 text-amber-400" /> Required Duration
            </span>
            <p className="mono-num text-xs font-semibold text-slate-200 mt-1">
              {formatDuration(task.duration)}
            </p>
            <span className="text-[10px] font-mono text-rose-400 font-semibold">
              {task.overdueDays} days overdue
            </span>
          </div>

          <div className="p-2.5 rounded bg-[#080f1d] border border-[#14223b]">
            <span className="text-[10px] text-slate-400 flex items-center gap-1">
              <Shield className="w-3 h-3 text-emerald-400" /> Protection Level
            </span>
            <p className="text-xs font-semibold text-slate-200 mt-1">
              {task.requiredProtection}
            </p>
            <span className="text-[10px] font-mono text-slate-400">
              {task.oheRequired ? "OHE Power Block Req" : "No OHE Isolation"}
            </span>
          </div>

          <div className="p-2.5 rounded bg-[#080f1d] border border-[#14223b]">
            <span className="text-[10px] text-slate-400 flex items-center gap-1">
              <Users className="w-3 h-3 text-indigo-400" /> Resources Needed
            </span>
            <p className="text-xs font-semibold text-slate-200 mt-1 truncate">
              {task.crewRequired} Crew
            </p>
            <span className="text-[10px] text-slate-400 truncate block">
              {task.machineRequired}
            </span>
          </div>
        </div>

        {/* Recommended Corridor Window */}
        <div className="p-3 bg-sky-950/30 border border-sky-800/40 rounded-lg mb-4">
          <div className="flex items-center justify-between text-xs">
            <span className="text-sky-300 font-medium flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-sky-400" /> Recommended Corridor Slot
            </span>
            <span className="font-mono font-bold text-sky-200 bg-sky-900/60 px-2 py-0.5 rounded border border-sky-700/50">
              {task.recommendedWindow || "02:20 – 04:10"}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1.5 leading-relaxed">
            Optimal integration with adjacent S&T and Traction possession orders. Zero passenger service headway violation.
          </p>
        </div>

        {/* Explainability / ML Priority Breakdown */}
        <div className="p-3 bg-[#080f1d] border border-[#162542] rounded-lg space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Why this priority? (Explainability)
            </span>
            <span className="text-[10px] font-mono font-bold bg-amber-950/60 text-amber-300 border border-amber-700/40 px-1.5 py-0.5 rounded">
              ML Rank: #{task.mlRank}
            </span>
          </div>

          <div className="space-y-1.5 pt-1 text-xs">
            <div className="flex justify-between text-slate-400 text-[11px]">
              <span>Asset criticality:</span>
              <strong className="text-rose-400 font-medium">
                {task.reasonCodes.assetCriticality}
              </strong>
            </div>
            <div className="flex justify-between text-slate-400 text-[11px]">
              <span>Overdue duration:</span>
              <strong className="text-amber-400 font-mono">
                {task.reasonCodes.overdueDays} days
              </strong>
            </div>
            <div className="flex justify-between text-slate-400 text-[11px]">
              <span>Asset availability impact:</span>
              <strong className="text-sky-400 font-medium">
                {task.reasonCodes.availabilityImpact}
              </strong>
            </div>
            <div className="flex justify-between text-slate-400 text-[11px]">
              <span>Operational consequence:</span>
              <strong className="text-rose-400 font-medium">
                {task.reasonCodes.operationalConsequence}
              </strong>
            </div>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="pt-4 border-t border-[#182643] flex items-center gap-2 mt-4">
        <Link
          href="/live-corridor"
          className="flex-1 py-2 px-3 bg-sky-600 hover:bg-sky-500 text-white rounded text-xs font-semibold text-center transition-colors flex items-center justify-center gap-1.5 shadow-md shadow-sky-950"
        >
          <Eye className="w-3.5 h-3.5" /> View on Corridor
        </Link>
        <Link
          href="/block-planner"
          className="py-2 px-3 bg-[#162440] hover:bg-[#1e3056] text-slate-200 rounded text-xs font-medium border border-[#20355e] transition-colors"
        >
          Optimizer
        </Link>
      </div>
    </div>
  );
}
