"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { AppShell } from "@/components/shell/AppShell";
import { usePlanningRun } from "@/context/PlanningRunContext";
import { NormalizedTask } from "@/lib/api/runs";
import {
  Wrench,
  Zap,
  Radio,
  Filter,
  Search,
  ChevronRight,
  ShieldAlert,
  Clock,
  Layers,
  Sparkles,
  ExternalLink,
  X,
  FileText
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function WorkRegisterPage() {
  const { currentRun, loading } = usePlanningRun();

  const [selectedTask, setSelectedTask] = useState<NormalizedTask | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [tierFilter, setTierFilter] = useState<string>("ALL");
  const [deptFilter, setDeptFilter] = useState<string>("ALL");
  const [sourceFilter, setSourceFilter] = useState<string>("ALL");

  const tasks: NormalizedTask[] = currentRun?.prioritized_tasks || [];
  const weeklyBlocks = currentRun?.weekly_plan || [];

  // Filter tasks
  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      const matchTier = tierFilter === "ALL" || t.safety_tier === tierFilter;
      const matchDept = deptFilter === "ALL" || t.department === deptFilter;
      const matchSource = sourceFilter === "ALL" || t.source_system === sourceFilter;
      const matchQuery =
        !searchQuery ||
        t.task_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.asset_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.asset_type.toLowerCase().includes(searchQuery.toLowerCase());
      return matchTier && matchDept && matchSource && matchQuery;
    });
  }, [tasks, tierFilter, deptFilter, sourceFilter, searchQuery]);

  return (
    <AppShell>
      <div className="flex flex-col h-full bg-slate-50 text-slate-900 font-sans select-none overflow-hidden">
        {/* Top Operational Context Strip */}
        <div className="bg-white border-b border-slate-200 px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 shrink-0 text-xs font-mono">
          <div className="flex items-center gap-3">
            <span className="font-extrabold text-slate-900 text-sm tracking-tight">
              MAINTENANCE DEMAND REGISTER
            </span>
            <span className="text-slate-300">|</span>
            <span className="text-slate-600">
              Run: <strong className="text-blue-700">{currentRun?.planning_run_id || "RB-2026-09-23"}</strong>
            </span>
            <span className="text-slate-300">|</span>
            <span className="text-slate-600">
              Total Ingested: <strong className="text-slate-900">{tasks.length} Work Orders</strong>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-medium">Prioritization:</span>
            <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold text-[11px]">
              Safety Boundary Rules (P1–P4) + XGBoost Ranker
            </span>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="bg-white border-b border-slate-200 px-4 sm:px-6 py-2 flex flex-wrap items-center justify-between gap-3 shrink-0 text-xs font-mono">
          <div className="flex flex-wrap items-center gap-2">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search ID, Defect, Asset..."
                className="pl-8 pr-3 py-1 bg-slate-50 border border-slate-300 rounded text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-600 w-52"
              />
            </div>

            {/* Tier Filters */}
            <div className="flex items-center gap-1 border-l border-slate-200 pl-2">
              <span className="text-[10px] text-slate-400 uppercase font-bold mr-1">Tier:</span>
              {["ALL", "P1", "P2", "P3", "P4"].map((tier) => (
                <button
                  key={tier}
                  onClick={() => setTierFilter(tier)}
                  className={cn(
                    "px-2 py-0.5 rounded text-[11px] font-bold transition-colors cursor-pointer",
                    tierFilter === tier
                      ? "bg-slate-900 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200"
                  )}
                >
                  {tier}
                </button>
              ))}
            </div>

            {/* Department Filters */}
            <div className="hidden sm:flex items-center gap-1 border-l border-slate-200 pl-2">
              <span className="text-[10px] text-slate-400 uppercase font-bold mr-1">Dept:</span>
              {["ALL", "Engineering", "S&T", "Traction"].map((dept) => (
                <button
                  key={dept}
                  onClick={() => setDeptFilter(dept)}
                  className={cn(
                    "px-2 py-0.5 rounded text-[11px] font-semibold transition-colors cursor-pointer",
                    deptFilter === dept
                      ? "bg-blue-900 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200"
                  )}
                >
                  {dept === "Engineering" ? "ENG" : dept === "Traction" ? "TRD" : dept}
                </button>
              ))}
            </div>
          </div>

          <div className="text-[11px] text-slate-500">
            Showing <strong>{filteredTasks.length}</strong> of <strong>{tasks.length}</strong> demands
          </div>
        </div>

        {/* Main Split Layout: Table + Detail Drawer */}
        <div className="flex-1 flex min-h-0 overflow-hidden relative">
          {/* High-Density Operational Table */}
          <div className="flex-1 overflow-y-auto">
            <table className="w-full text-left border-collapse text-xs font-mono">
              <thead className="sticky top-0 bg-slate-100 border-b border-slate-200 text-[10px] text-slate-600 uppercase font-bold tracking-wider z-10">
                <tr>
                  <th className="py-2.5 px-3">Priority</th>
                  <th className="py-2.5 px-3">Work Order</th>
                  <th className="py-2.5 px-3">Defect / Task Description</th>
                  <th className="py-2.5 px-3">Location</th>
                  <th className="py-2.5 px-3">Department</th>
                  <th className="py-2.5 px-3">Duration</th>
                  <th className="py-2.5 px-3">Planning Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {filteredTasks.map((task) => {
                  const assignedBlock = weeklyBlocks.find((b) =>
                    b.tasks.some((t) => t.task_id === task.task_id)
                  );
                  const isSelected = selectedTask?.task_id === task.task_id;

                  return (
                    <tr
                      key={task.task_id}
                      onClick={() => setSelectedTask(task)}
                      className={cn(
                        "hover:bg-slate-50 cursor-pointer transition-colors",
                        isSelected && "bg-blue-50/80 font-semibold"
                      )}
                    >
                      {/* Priority Semantic Tag */}
                      <td className="py-2 px-3 whitespace-nowrap">
                        <span
                          className={cn(
                            "px-1.5 py-0.5 rounded text-[10px] font-black",
                            task.safety_tier === "P1"
                              ? "bg-red-600 text-white"
                              : task.safety_tier === "P2"
                              ? "bg-amber-100 text-amber-900 border border-amber-300"
                              : task.safety_tier === "P3"
                              ? "bg-blue-50 text-blue-900 border border-blue-200"
                              : "bg-slate-100 text-slate-700 border border-slate-200"
                          )}
                        >
                          {task.safety_tier}
                        </span>
                      </td>

                      {/* WO Identifier + Source */}
                      <td className="py-2 px-3 whitespace-nowrap">
                        <div className="font-bold text-slate-900">{task.task_id}</div>
                        <div className="text-[10px] text-slate-400 font-normal">
                          {task.source_system} #{task.source_record_id}
                        </div>
                      </td>

                      {/* Defect Description */}
                      <td className="py-2 px-3">
                        <div className="text-slate-800 font-sans font-medium line-clamp-1">
                          {task.title}
                        </div>
                        <div className="text-[10px] text-slate-500 font-mono">
                          Asset: {task.asset_id} ({task.asset_type})
                        </div>
                      </td>

                      {/* Location Coordinates */}
                      <td className="py-2 px-3 whitespace-nowrap">
                        <div className="text-slate-800 font-bold">
                          KM {task.km_start.toFixed(1)} → {task.km_end.toFixed(1)}
                        </div>
                        <div className="text-[10px] text-slate-500 font-normal">
                          {task.line} Line
                        </div>
                      </td>

                      {/* Department */}
                      <td className="py-2 px-3 whitespace-nowrap">
                        <span className="flex items-center gap-1.5 text-slate-700">
                          {task.department === "Engineering" && <Wrench className="w-3 h-3 text-amber-600" />}
                          {task.department === "S&T" && <Radio className="w-3 h-3 text-sky-600" />}
                          {task.department === "Traction" && <Zap className="w-3 h-3 text-emerald-600" />}
                          <span>{task.department}</span>
                        </span>
                      </td>

                      {/* Duration */}
                      <td className="py-2 px-3 whitespace-nowrap text-slate-700">
                        {task.duration_min} min
                      </td>

                      {/* Planning Status */}
                      <td className="py-2 px-3 whitespace-nowrap">
                        {assignedBlock ? (
                          <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-900 border border-blue-200 font-bold text-[10px]">
                            {assignedBlock.block_id} ({assignedBlock.start_time})
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 text-[10px]">
                            DEFERRED P3/P4
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Right-Side Work Order Detail Drawer (Progressive Disclosure) */}
          {selectedTask && (
            <aside className="w-96 bg-white border-l border-slate-200 h-full shadow-xl flex flex-col font-mono text-xs z-20 shrink-0">
              {/* Drawer Header */}
              <div className="h-12 bg-slate-900 text-white px-4 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      "px-1.5 py-0.2 rounded text-[10px] font-black",
                      selectedTask.safety_tier === "P1" ? "bg-red-600 text-white" : "bg-slate-700 text-white"
                    )}
                  >
                    {selectedTask.safety_tier}
                  </span>
                  <span className="font-extrabold text-sm tracking-tight">{selectedTask.task_id}</span>
                </div>
                <button
                  onClick={() => setSelectedTask(null)}
                  className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Drawer Body */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                <div className="space-y-1">
                  <div className="text-[10px] text-slate-400 uppercase font-bold">Defect Title</div>
                  <h3 className="text-sm font-bold text-slate-900 font-sans leading-tight">
                    {selectedTask.title}
                  </h3>
                </div>

                <div className="p-3 bg-slate-50 rounded border border-slate-200 space-y-1.5 text-[11px] text-slate-700">
                  <div>Department: <strong>{selectedTask.department}</strong></div>
                  <div>Source Feed: <strong>{selectedTask.source_system} (#{selectedTask.source_record_id})</strong></div>
                  <div>Asset: <strong>{selectedTask.asset_id} ({selectedTask.asset_type})</strong></div>
                  <div>Location: <strong>KM {selectedTask.km_start.toFixed(1)}–{selectedTask.km_end.toFixed(1)} ({selectedTask.line} Line)</strong></div>
                  <div>Duration: <strong>{selectedTask.duration_min} minutes</strong></div>
                  <div>OHE Isolation: <strong>{selectedTask.ohe_required ? "REQUIRED" : "NOT REQUIRED"}</strong></div>
                  <div>Machine: <strong>{selectedTask.machine_required || "Manual Track Crew"}</strong></div>
                  <div>Crew Needed: <strong>{selectedTask.crew_required} personnel</strong></div>
                </div>

                {/* Safety Classification Logic */}
                <div className="space-y-1">
                  <div className="text-[10px] text-slate-400 uppercase font-bold">Safety Rule Justification</div>
                  <p className="text-xs text-slate-700 font-sans bg-slate-50 p-2.5 rounded border border-slate-200 leading-relaxed">
                    {selectedTask.safety_tier_reason}
                  </p>
                </div>

                {/* ML Ranking Score */}
                <div className="p-3 bg-blue-50/70 rounded border border-blue-200 space-y-1 text-[11px]">
                  <div className="flex items-center justify-between font-bold text-blue-950">
                    <span>XGBoost Ranking Score</span>
                    <span>{selectedTask.ml_ranking_score.toFixed(3)}</span>
                  </div>
                  <div className="text-[10px] text-blue-800 font-sans">
                    Within-tier Rank #{selectedTask.within_tier_rank} among {selectedTask.safety_tier} demands. Note: ML ranks strictly within safety tiers; it never overrides P1–P4 safety boundaries.
                  </div>
                </div>
              </div>

              {/* Drawer Footer */}
              <div className="p-3 bg-slate-50 border-t border-slate-200 flex justify-between items-center shrink-0">
                <Link
                  href="/plan"
                  className="px-3 py-1.5 bg-blue-900 hover:bg-blue-800 text-white rounded font-bold text-xs flex items-center gap-1"
                >
                  <span>Locate in Plan</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
                <button
                  onClick={() => setSelectedTask(null)}
                  className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded font-medium text-xs"
                >
                  Close
                </button>
              </div>
            </aside>
          )}
        </div>
      </div>
    </AppShell>
  );
}
