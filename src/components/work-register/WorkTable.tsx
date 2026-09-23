"use client";

import React from "react";
import { MaintenanceTask, Department } from "@/types/maintenance";
import { calculateTaskPriority } from "@/lib/calculations";
import { formatKmRange, formatDuration, getDepartmentColor } from "@/lib/formatting";
import { CheckSquare, Square, ArrowUpDown, Layers, Shield, Clock, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface WorkTableProps {
  tasks: MaintenanceTask[];
  allTasks: MaintenanceTask[];
  selectedTaskId: string | null;
  onSelectTask: (taskId: string) => void;
  selectedTaskIds: string[];
  onToggleTaskSelection: (taskId: string, e: React.MouseEvent) => void;
  onToggleSelectAll: () => void;
  sortField: keyof MaintenanceTask;
  sortAsc: boolean;
  onSort: (field: keyof MaintenanceTask) => void;
  onResetFilters: () => void;
}

export function WorkTable({
  tasks,
  allTasks,
  selectedTaskId,
  onSelectTask,
  selectedTaskIds,
  onToggleTaskSelection,
  onToggleSelectAll,
  sortField,
  sortAsc,
  onSort,
  onResetFilters,
}: WorkTableProps) {
  const isAllSelected = selectedTaskIds.length === tasks.length && tasks.length > 0;

  // Helper to count coordination candidates for a task
  const getCandidateCount = (task: MaintenanceTask) => {
    if (task.scheduledBlockId) {
      return `Block ${task.scheduledBlockId}`;
    }
    const nearby = allTasks.filter(
      (t) =>
        t.taskId !== task.taskId &&
        Math.abs(t.kmStart - task.kmStart) <= 15
    );
    if (nearby.length === 0) return "Solo";
    return `${nearby.length} candidate${nearby.length > 1 ? "s" : ""}`;
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs flex flex-col font-sans">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          {/* Table Header */}
          <thead className="bg-slate-50 border-b border-slate-200 text-[10.5px] uppercase font-mono text-slate-500 sticky top-0 z-10 select-none">
            <tr>
              <th className="p-3 w-8 text-center">
                <button
                  onClick={onToggleSelectAll}
                  className="p-0.5 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
                  title="Select all filtered demands"
                >
                  {isAllSelected ? (
                    <CheckSquare className="w-4 h-4 text-blue-700" />
                  ) : (
                    <Square className="w-4 h-4 text-slate-400" />
                  )}
                </button>
              </th>
              <th
                className="p-3 cursor-pointer hover:text-slate-900 transition-colors"
                onClick={() => onSort("criticality")}
              >
                <div className="flex items-center gap-1">
                  <span>Priority</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th
                className="p-3 cursor-pointer hover:text-slate-900 transition-colors"
                onClick={() => onSort("taskId")}
              >
                <div className="flex items-center gap-1">
                  <span>Work ID</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th
                className="p-3 cursor-pointer hover:text-slate-900 transition-colors"
                onClick={() => onSort("department")}
              >
                Dept
              </th>
              <th className="p-3">Asset & Title</th>
              <th
                className="p-3 cursor-pointer hover:text-slate-900 transition-colors"
                onClick={() => onSort("kmStart")}
              >
                <div className="flex items-center gap-1">
                  <span>Location</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th
                className="p-3 cursor-pointer hover:text-slate-900 transition-colors"
                onClick={() => onSort("overdueDays")}
              >
                <div className="flex items-center gap-1">
                  <span>Due / Status</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th
                className="p-3 cursor-pointer hover:text-slate-900 transition-colors"
                onClick={() => onSort("duration")}
              >
                <div className="flex items-center gap-1">
                  <span>Duration</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th className="p-3">Block Req</th>
              <th className="p-3">Coordination</th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-slate-100">
            {tasks.length === 0 ? (
              <tr>
                <td colSpan={10} className="p-12 text-center text-slate-500">
                  <div className="max-w-sm mx-auto space-y-2">
                    <p className="font-semibold text-slate-800 text-sm">
                      No maintenance demand matches these filters.
                    </p>
                    <p className="text-xs text-slate-500">
                      Try adjusting the search query, department, criticality, or asset filters.
                    </p>
                    <button
                      onClick={onResetFilters}
                      className="mt-3 px-3.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-900 font-semibold rounded-lg text-xs transition-colors"
                    >
                      Reset All Filters
                    </button>
                  </div>
                </td>
              </tr>
            ) : (
              tasks.map((task) => {
                const isSelected = task.taskId === selectedTaskId;
                const isChecked = selectedTaskIds.includes(task.taskId);
                const priority = calculateTaskPriority(task);
                const isCritical = task.criticality === "Critical";
                const isOverdue = task.overdueDays > 0;
                const candidateText = getCandidateCount(task);

                return (
                  <tr
                    key={task.taskId}
                    onClick={() => onSelectTask(task.taskId)}
                    className={cn(
                      "transition-all cursor-pointer group select-none relative",
                      isSelected
                        ? "bg-blue-50/80 font-medium"
                        : isChecked
                        ? "bg-blue-50/30 hover:bg-blue-50/50"
                        : "hover:bg-slate-50"
                    )}
                  >
                    {/* Checkbox */}
                    <td
                      className="p-3 text-center"
                      onClick={(e) => onToggleTaskSelection(task.taskId, e)}
                    >
                      {isChecked ? (
                        <CheckSquare className="w-4 h-4 text-blue-700 inline" />
                      ) : (
                        <Square className="w-4 h-4 text-slate-300 group-hover:text-slate-400 inline" />
                      )}
                    </td>

                    {/* Visual Priority Marker + Badge */}
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        {/* Narrow Vertical Visual Bar */}
                        <div
                          className={cn(
                            "w-1.5 h-6 rounded-full shrink-0",
                            priority.tier === "P1"
                              ? "bg-red-500"
                              : priority.tier === "P2"
                              ? "bg-amber-500"
                              : priority.tier === "P3"
                              ? "bg-blue-500"
                              : "bg-slate-300"
                          )}
                        />
                        <div>
                          <span
                            className={cn(
                              "px-1.5 py-0.5 rounded text-[10px] font-mono font-bold border block text-center",
                              priority.tier === "P1"
                                ? "bg-red-50 text-red-800 border-red-200"
                                : priority.tier === "P2"
                                ? "bg-amber-50 text-amber-800 border-amber-200"
                                : priority.tier === "P3"
                                ? "bg-blue-50 text-blue-800 border-blue-200"
                                : "bg-slate-100 text-slate-700 border-slate-200"
                            )}
                          >
                            {priority.tier}
                          </span>
                          <span className="text-[9px] text-slate-500 block leading-tight font-sans">
                            {task.criticality}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Work ID */}
                    <td className="p-3 font-mono font-bold text-blue-900 whitespace-nowrap">
                      {task.taskId}
                    </td>

                    {/* Department Badge */}
                    <td className="p-3 whitespace-nowrap">
                      <span
                        className={cn(
                          "px-2 py-0.5 rounded text-[10px] font-mono font-semibold border",
                          getDepartmentColor(task.department).badge
                        )}
                      >
                        {task.department}
                      </span>
                    </td>

                    {/* Asset & Title */}
                    <td className="p-3 max-w-[220px]">
                      <div className="truncate font-semibold text-slate-900 text-xs">
                        {task.title}
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono truncate">
                        {task.assetType} · {task.assetId}
                      </div>
                    </td>

                    {/* Location */}
                    <td className="p-3 whitespace-nowrap font-mono text-slate-700">
                      <div className="font-semibold text-xs">
                        {formatKmRange(task.kmStart, task.kmEnd)}
                      </div>
                      <div className="text-[9.5px] text-slate-400">
                        {task.direction} Line
                      </div>
                    </td>

                    {/* Due / Overdue Status */}
                    <td className="p-3 whitespace-nowrap">
                      {isOverdue ? (
                        <div>
                          <span
                            className={cn(
                              "px-1.5 py-0.5 rounded text-[10px] font-mono font-bold border inline-flex items-center gap-1",
                              task.overdueDays >= 10
                                ? "bg-red-50 text-red-800 border-red-200"
                                : "bg-amber-50 text-amber-800 border-amber-200"
                            )}
                          >
                            <AlertTriangle className="w-2.5 h-2.5" />
                            <span>{task.overdueDays}d overdue</span>
                          </span>
                          <span className="text-[9.5px] text-slate-400 block font-mono">
                            Tolerance exceeded
                          </span>
                        </div>
                      ) : (
                        <div>
                          <span className="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-mono font-semibold">
                            On schedule
                          </span>
                          <span className="text-[9.5px] text-slate-400 block font-mono">
                            Cycle active
                          </span>
                        </div>
                      )}
                    </td>

                    {/* Duration */}
                    <td className="p-3 whitespace-nowrap font-mono font-bold text-slate-800">
                      {formatDuration(task.duration)}
                    </td>

                    {/* Block Requirement */}
                    <td className="p-3 whitespace-nowrap">
                      <span className="text-[11px] font-mono text-slate-700 block">
                        {task.requiredProtection}
                      </span>
                      <span className="text-[9.5px] text-slate-400 font-mono">
                        {task.oheRequired ? "OHE Power Iso" : "Standard"}
                      </span>
                    </td>

                    {/* Coordination Opportunities */}
                    <td className="p-3 whitespace-nowrap">
                      {task.scheduledBlockId ? (
                        <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-900 border border-blue-200 text-[10px] font-mono font-bold inline-flex items-center gap-1">
                          <Layers className="w-3 h-3 text-blue-700" />
                          <span>Block {task.scheduledBlockId}</span>
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 text-[10px] font-mono font-medium inline-flex items-center gap-1">
                          <Layers className="w-3 h-3 text-slate-400" />
                          <span>{candidateText}</span>
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Table Footer Strip */}
      <div className="p-3 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between text-xs text-slate-500 font-mono">
        <span>
          Showing {tasks.length} of {allTasks.length} active work orders
        </span>
        <span className="text-slate-400">
          Click any row to view operational parameters & coordination opportunities
        </span>
      </div>
    </div>
  );
}
