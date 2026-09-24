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
      <div className="flex flex-col h-[calc(100vh-110px)] bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans select-none overflow-hidden rounded-2xl border border-slate-300 dark:border-slate-800 shadow-xl mx-2 sm:mx-6 mb-4">
        {/* Top Operational Context Strip */}
        <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3 shrink-0 text-sm font-mono">
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-black text-slate-900 dark:text-white text-base tracking-tight">
              MAINTENANCE DEMAND REGISTER
            </span>
            <span className="text-slate-300 dark:text-slate-700">|</span>
            <span className="text-slate-700 dark:text-slate-300 text-xs sm:text-sm">
              Run: <strong className="text-orange-500">{currentRun?.planning_run_id || "RB-2026-09-23"}</strong>
            </span>
            <span className="text-slate-300 dark:text-slate-700">|</span>
            <span className="text-slate-700 dark:text-slate-300 text-xs sm:text-sm">
              Total Ingested: <strong className="text-slate-900 dark:text-white">{tasks.length} Work Orders</strong>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-600 dark:text-slate-400 font-medium text-xs">Prioritization:</span>
            <span className="px-2.5 py-1 rounded bg-emerald-50 dark:bg-emerald-950/70 text-emerald-900 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 font-black text-xs">
              Safety Boundary Rules (P1–P4) + XGBoost Ranker
            </span>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="bg-slate-100 dark:bg-slate-900/90 border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 shrink-0 text-xs font-mono">
          <div className="flex flex-wrap items-center gap-3">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search ID, Defect, Asset..."
                className="pl-9 pr-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-orange-500 w-60 shadow-xs"
              />
            </div>

            {/* Tier Filters */}
            <div className="flex items-center gap-1.5 border-l border-slate-300 dark:border-slate-700 pl-3">
              <span className="text-xs text-slate-500 dark:text-slate-400 uppercase font-black mr-1">Tier:</span>
              {["ALL", "P1", "P2", "P3", "P4"].map((tier) => (
                <button
                  key={tier}
                  onClick={() => setTierFilter(tier)}
                  className={cn(
                    "px-2.5 py-1 rounded-md text-xs font-black transition-all cursor-pointer",
                    tierFilter === tier
                      ? "bg-orange-500 text-white shadow-xs"
                      : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700"
                  )}
                >
                  {tier}
                </button>
              ))}
            </div>

            {/* Department Filters */}
            <div className="hidden sm:flex items-center gap-1.5 border-l border-slate-300 dark:border-slate-700 pl-3">
              <span className="text-xs text-slate-500 dark:text-slate-400 uppercase font-black mr-1">Dept:</span>
              {["ALL", "Engineering", "S&T", "Traction"].map((dept) => (
                <button
                  key={dept}
                  onClick={() => setDeptFilter(dept)}
                  className={cn(
                    "px-2.5 py-1 rounded-md text-xs font-bold transition-all cursor-pointer",
                    deptFilter === dept
                      ? "bg-orange-500 text-white shadow-xs"
                      : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700"
                  )}
                >
                  {dept === "Engineering" ? "Civil Engg" : dept === "Traction" ? "TRD (OHE)" : dept}
                </button>
              ))}
            </div>
          </div>

          <div className="text-xs font-semibold text-slate-600 dark:text-slate-400">
            Showing <strong className="text-slate-900 dark:text-white">{filteredTasks.length}</strong> of <strong className="text-slate-900 dark:text-white">{tasks.length}</strong> demands
          </div>
        </div>

        {/* Main Split Layout: Table + Detail Drawer */}
        <div className="flex-1 flex min-h-0 overflow-hidden relative">
          {/* High-Density Operational Table */}
          <div className="flex-1 overflow-y-auto">
            <table className="w-full text-left border-collapse font-mono">
              <thead className="sticky top-0 bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 uppercase font-black tracking-wider z-10">
                <tr>
                  <th className="py-3 px-4">Priority</th>
                  <th className="py-3 px-4">Work Order</th>
                  <th className="py-3 px-4">Defect / Task Description</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4">Department</th>
                  <th className="py-3 px-4">Duration</th>
                  <th className="py-3 px-4">Planning Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 bg-white dark:bg-slate-900">
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
                        "hover:bg-blue-50/50 dark:hover:bg-slate-800/60 cursor-pointer transition-colors text-xs sm:text-sm",
                        isSelected && "bg-blue-50/90 dark:bg-blue-950/40 font-semibold"
                      )}
                    >
                      {/* Priority Semantic Tag */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span
                          className={cn(
                            "px-2.5 py-1 rounded-md text-xs font-black tracking-wider",
                            task.safety_tier === "P1"
                              ? "bg-red-600 text-white shadow-xs"
                              : task.safety_tier === "P2"
                              ? "bg-amber-500 text-slate-950 font-black shadow-xs"
                              : task.safety_tier === "P3"
                              ? "bg-blue-100 dark:bg-blue-950/70 text-blue-900 dark:text-blue-300 border border-blue-300 dark:border-blue-700"
                              : "bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-300 border border-slate-300 dark:border-slate-700"
                          )}
                        >
                          {task.safety_tier}
                        </span>
                      </td>

                      {/* WO Identifier + Source */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="font-black text-slate-900 dark:text-white text-xs sm:text-sm">{task.task_id}</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 font-normal">
                          {task.source_system} #{task.source_record_id}
                        </div>
                      </td>

                      {/* Defect Description */}
                      <td className="py-3 px-4">
                        <div className="text-slate-900 dark:text-slate-100 font-sans font-medium line-clamp-1 text-xs sm:text-sm">
                          {task.title}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                          Asset: {task.asset_id} ({task.asset_type})
                        </div>
                      </td>

                      {/* Location Coordinates */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="text-slate-900 dark:text-slate-100 font-bold text-xs sm:text-sm">
                          KM {task.km_start.toFixed(1)} → {task.km_end.toFixed(1)}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 font-normal">
                          {task.line} Line
                        </div>
                      </td>

                      {/* Department */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span
                          className={cn(
                            "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md border text-xs font-bold",
                            task.department === "Engineering"
                              ? "bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-800"
                              : task.department === "S&T"
                              ? "bg-sky-50 dark:bg-sky-950/50 text-sky-800 dark:text-sky-300 border-sky-300 dark:border-sky-800"
                              : "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800"
                          )}
                        >
                          {task.department === "Engineering" && <Wrench className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />}
                          {task.department === "S&T" && <Radio className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />}
                          {task.department === "Traction" && <Zap className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />}
                          <span>{task.department}</span>
                        </span>
                      </td>

                      {/* Duration */}
                      <td className="py-3 px-4 whitespace-nowrap text-slate-800 dark:text-slate-200 font-bold text-xs sm:text-sm">
                        {task.duration_min} min
                      </td>

                      {/* Planning Status */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        {assignedBlock ? (
                          <span className="px-2.5 py-1 rounded-lg bg-blue-100 dark:bg-blue-950/80 text-blue-900 dark:text-blue-200 border border-blue-300 dark:border-blue-700 font-black text-xs">
                            {assignedBlock.block_id} [{assignedBlock.start_time}]
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/70 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-amber-700 text-xs font-bold">
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
            <aside className="w-96 bg-white dark:bg-slate-900 border-l border-slate-300 dark:border-slate-800 h-full shadow-2xl flex flex-col font-mono text-xs z-20 shrink-0">
              {/* Drawer Header */}
              <div className="h-14 bg-slate-900 dark:bg-slate-950 text-white px-5 flex items-center justify-between shrink-0 border-b border-slate-800">
                <div className="flex items-center gap-2.5">
                  <span
                    className={cn(
                      "px-2 py-0.5 rounded text-xs font-black",
                      selectedTask.safety_tier === "P1" ? "bg-red-600 text-white" : "bg-slate-700 text-white"
                    )}
                  >
                    {selectedTask.safety_tier}
                  </span>
                  <span className="font-black text-base tracking-tight">{selectedTask.task_id}</span>
                </div>
                <button
                  onClick={() => setSelectedTask(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer Body */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                <div className="space-y-1">
                  <div className="text-xs text-slate-500 dark:text-slate-400 uppercase font-black">Defect Title</div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white font-sans leading-snug">
                    {selectedTask.title}
                  </h3>
                </div>

                <div className="p-3.5 bg-slate-50 dark:bg-slate-950/60 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2 text-xs text-slate-700 dark:text-slate-300">
                  <div>Department: <strong className="text-slate-900 dark:text-white">{selectedTask.department}</strong></div>
                  <div>Source Feed: <strong className="text-slate-900 dark:text-white">{selectedTask.source_system} (#{selectedTask.source_record_id})</strong></div>
                  <div>Asset: <strong className="text-slate-900 dark:text-white">{selectedTask.asset_id} ({selectedTask.asset_type})</strong></div>
                  <div>Location: <strong className="text-slate-900 dark:text-white">KM {selectedTask.km_start.toFixed(1)}–{selectedTask.km_end.toFixed(1)} ({selectedTask.line} Line)</strong></div>
                  <div>Duration: <strong className="text-slate-900 dark:text-white">{selectedTask.duration_min} minutes</strong></div>
                  <div>OHE Isolation: <strong className="text-amber-600 dark:text-amber-400">{selectedTask.ohe_required ? "REQUIRED" : "NOT REQUIRED"}</strong></div>
                  <div>Machine: <strong className="text-slate-900 dark:text-white">{selectedTask.machine_required || "Manual Track Crew"}</strong></div>
                  <div>Crew Needed: <strong className="text-slate-900 dark:text-white">{selectedTask.crew_required} personnel</strong></div>
                </div>

                {/* Safety Classification Logic */}
                <div className="space-y-1.5">
                  <div className="text-xs text-slate-500 dark:text-slate-400 uppercase font-black">Safety Rule Justification</div>
                  <p className="text-xs text-slate-800 dark:text-slate-200 font-sans bg-slate-50 dark:bg-slate-950/60 p-3 rounded-xl border border-slate-200 dark:border-slate-800 leading-relaxed">
                    {selectedTask.safety_tier_reason}
                  </p>
                </div>

                {/* ML Ranking Score */}
                <div className="p-3.5 bg-blue-50/70 dark:bg-blue-950/40 rounded-xl border border-blue-200 dark:border-blue-800 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between font-black text-blue-950 dark:text-blue-200 text-sm">
                    <span>XGBoost Ranking Score</span>
                    <span>{selectedTask.ml_ranking_score.toFixed(3)}</span>
                  </div>
                  <div className="text-xs text-blue-800 dark:text-blue-300 font-sans leading-relaxed">
                    Within-tier Rank #{selectedTask.within_tier_rank} among {selectedTask.safety_tier} demands. Note: ML ranks strictly within safety tiers; it never overrides P1–P4 safety boundaries.
                  </div>
                </div>
              </div>

              {/* Drawer Footer */}
              <div className="p-4 bg-slate-50 dark:bg-slate-950/60 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center shrink-0">
                <Link
                  href="/plan"
                  className="px-4 py-2 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-md shadow-orange-500/20 transition-all"
                >
                  <span>Locate in Plan</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
                <button
                  onClick={() => setSelectedTask(null)}
                  className="px-4 py-2 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl font-bold text-xs transition-all cursor-pointer"
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
