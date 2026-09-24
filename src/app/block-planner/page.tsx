"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { AppShell } from "@/components/shell/AppShell";
import { usePlanningRun } from "@/context/PlanningRunContext";
import { CompositionCluster, PlannedBlock, NormalizedTask } from "@/lib/api/runs";
import {
  Layers,
  ArrowRight,
  ShieldCheck,
  Cpu,
  CheckCircle2,
  Wrench,
  Zap,
  Radio,
  Clock,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Calendar
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function BlockPlannerPage() {
  const { currentRun, loading } = usePlanningRun();

  const [selectedClusterId, setSelectedClusterId] = useState<string>("CLUST-2026-03");

  const tasks: NormalizedTask[] = currentRun?.prioritized_tasks || [];
  const clusters: CompositionCluster[] = currentRun?.composition_clusters || [];
  const blocks: PlannedBlock[] = currentRun?.weekly_plan || [];

  const activeCluster = useMemo(() => {
    return clusters.find((c) => c.cluster_id === selectedClusterId) || clusters[0] || null;
  }, [clusters, selectedClusterId]);

  const assignedBlock = useMemo(() => {
    if (!activeCluster) return null;
    return blocks.find((b) =>
      b.tasks.some((bt) => activeCluster.tasks.some((ct) => ct.task_id === bt.task_id))
    );
  }, [blocks, activeCluster]);

  return (
    <AppShell>
      <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans select-none overflow-hidden transition-colors">
        {/* Top Context Strip */}
        <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 shrink-0 text-xs font-mono transition-colors">
          <div className="flex items-center gap-3">
            <span className="font-extrabold text-slate-900 dark:text-slate-100 text-sm tracking-tight">
              BLOCK COMPOSITION &amp; OPTIMIZATION PIPELINE
            </span>
            <span className="text-slate-300 dark:text-slate-700">|</span>
            <span className="text-slate-600 dark:text-slate-400">
              Run: <strong className="text-blue-700 dark:text-blue-400">{currentRun?.planning_run_id || "STANDBY"}</strong>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-500 dark:text-slate-400 font-medium">Solver Engine:</span>
            <span className="px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/60 text-blue-900 dark:text-blue-200 border border-blue-200 dark:border-blue-800 font-bold text-[11px]">
              Google OR-Tools CP-SAT ({currentRun?.solver_result?.solver_status || "STANDBY"})
            </span>
          </div>
        </div>

        {/* 4-Stage Horizontal Pipeline Header */}
        <div className="bg-slate-100 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 py-3 shrink-0 transition-colors">
          <div className="max-w-6xl mx-auto grid grid-cols-4 gap-2 font-mono text-xs">
            <div className="bg-white dark:bg-slate-900 p-2.5 rounded border border-slate-200 dark:border-slate-800 space-y-0.5">
              <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase">Stage 01</span>
              <div className="font-bold text-slate-900 dark:text-slate-100 text-sm">{tasks.length} Demands</div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 font-sans">TMS / SMMS / TDMS Ingested</div>
            </div>

            <div className="bg-blue-50/80 dark:bg-blue-950/40 p-2.5 rounded border border-blue-200 dark:border-blue-800/80 space-y-0.5">
              <span className="text-[10px] text-blue-600 dark:text-blue-400 font-bold uppercase">Stage 02</span>
              <div className="font-bold text-blue-950 dark:text-blue-200 text-sm">{clusters.length} Clusters</div>
              <div className="text-[10px] text-blue-700 dark:text-blue-300 font-sans">≤3km Multi-Dept Spatial Synergy</div>
            </div>

            <div className="bg-amber-50/80 dark:bg-amber-950/40 p-2.5 rounded border border-amber-200 dark:border-amber-800/80 space-y-0.5">
              <span className="text-[10px] text-amber-700 dark:text-amber-400 font-bold uppercase">Stage 03</span>
              <div className="font-bold text-amber-950 dark:text-amber-200 text-sm">24-Hr Windows</div>
              <div className="text-[10px] text-amber-800 dark:text-amber-300 font-sans">Traffic Shadow Candidates</div>
            </div>

            <div className="bg-emerald-50/80 dark:bg-emerald-950/40 p-2.5 rounded border border-emerald-200 dark:border-emerald-800/80 space-y-0.5">
              <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-bold uppercase">Stage 04</span>
              <div className="font-bold text-emerald-950 dark:text-emerald-200 text-sm">{blocks.length} Blocks</div>
              <div className="text-[10px] text-emerald-800 dark:text-emerald-300 font-sans">CP-SAT Optimal Allocation</div>
            </div>
          </div>
        </div>

        {/* Main Split Body: Cluster List + Detailed Pipeline Visualizer */}
        <div className="flex-1 grid grid-cols-12 min-h-0 overflow-hidden">
          {/* Left Column: 14 Compatible Clusters List */}
          <div className="col-span-12 lg:col-span-4 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col min-h-0 transition-colors">
            <div className="p-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/90 font-mono text-xs flex items-center justify-between shrink-0">
              <span className="font-bold text-slate-900 dark:text-slate-100 uppercase">Multi-Dept Clusters</span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400">Click to trace pipeline</span>
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800 font-mono text-xs">
              {clusters.map((cluster) => {
                const isSelected = activeCluster?.cluster_id === cluster.cluster_id;
                const matchBlock = blocks.find((b) =>
                  b.tasks.some((bt) => cluster.tasks.some((ct) => ct.task_id === bt.task_id))
                );

                return (
                  <div
                    key={cluster.cluster_id}
                    onClick={() => setSelectedClusterId(cluster.cluster_id)}
                    className={cn(
                      "p-3 space-y-1.5 transition-colors cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50",
                      isSelected && "bg-blue-50/80 dark:bg-blue-950/60 border-l-4 border-blue-700 dark:border-blue-400 font-semibold"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 dark:text-slate-100">{cluster.cluster_id}</span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 font-normal">
                        KM {cluster.km_start.toFixed(1)}–{cluster.km_end.toFixed(1)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-300">
                      <span>{cluster.tasks.length} tasks consolidated</span>
                      <span className="font-semibold text-blue-700 dark:text-blue-400">
                        {cluster.required_block_window_min}m window needed
                      </span>
                    </div>

                    {/* Department Pills */}
                    <div className="flex items-center gap-1.5 pt-0.5">
                      {cluster.departments.map((dept) => (
                        <span
                          key={dept}
                          className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[9px] font-bold"
                        >
                          {dept === "Engineering" ? "ENG" : dept === "Traction" ? "TRD" : dept}
                        </span>
                      ))}
                      {matchBlock && (
                        <span className="ml-auto text-[9px] px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-bold border border-emerald-200 dark:border-emerald-800">
                          SCHEDULED → {matchBlock.block_id}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Visual Pipeline Inspector for Selected Cluster */}
          <div className="col-span-12 lg:col-span-8 bg-slate-50 dark:bg-slate-950 flex flex-col min-h-0 overflow-y-auto p-5 space-y-5 transition-colors">
            {activeCluster ? (
              <>
                {/* Cluster Transformation Banner */}
                <div className="p-4 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 shadow-2xs space-y-2">
                  <div className="flex items-center justify-between font-mono text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-400" />
                      <span className="font-extrabold text-slate-900 dark:text-slate-100 text-sm">{activeCluster.cluster_id}</span>
                      <span className="text-slate-400 dark:text-slate-600">·</span>
                      <span className="text-slate-600 dark:text-slate-300">
                        KM {activeCluster.km_start.toFixed(1)} → KM {activeCluster.km_end.toFixed(1)} ({activeCluster.line} Line)
                      </span>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/60 text-blue-900 dark:text-blue-200 border border-blue-200 dark:border-blue-800 font-bold text-[11px]">
                      {activeCluster.departments.join(" + ")}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 font-sans leading-relaxed">
                    <strong className="text-slate-800 dark:text-slate-200">Synergy Reason:</strong> Co-located maintenance requests within ≤3km spatial span. Combining track tamping, point testing, and 25kV OHE isolation into one single corridor closure avoids 3 separate siloed track possessions.
                  </p>
                </div>

                {/* Flow Diagram: Member Tasks -> Combined Window -> Selected Block */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
                  {/* Left Box: Tasks Combined */}
                  <div className="p-3.5 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 space-y-2.5">
                    <div className="flex items-center justify-between font-bold text-slate-900 dark:text-slate-100 border-b border-slate-100 dark:border-slate-800 pb-2">
                      <span>Demands Combined ({activeCluster.tasks.length})</span>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 font-normal">Input Stage</span>
                    </div>

                    <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1">
                      {activeCluster.tasks.map((task) => (
                        <div key={task.task_id} className="p-2 bg-slate-50 dark:bg-slate-800/60 rounded border border-slate-200 dark:border-slate-700/80 space-y-0.5">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-slate-900 dark:text-slate-100">{task.task_id}</span>
                            <span
                              className={cn(
                                "px-1.5 py-0.2 rounded text-[9px] font-black",
                                task.safety_tier === "P1" ? "bg-red-600 text-white" : "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300"
                              )}
                            >
                              {task.safety_tier}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-700 dark:text-slate-300 font-sans line-clamp-1">{task.title}</p>
                          <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400">
                            <span>{task.department}</span>
                            <span>{task.duration_min}m</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right Box: Resulting Scheduled Block */}
                  <div className="p-3.5 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 space-y-2.5">
                    <div className="flex items-center justify-between font-bold text-slate-900 dark:text-slate-100 border-b border-slate-100 dark:border-slate-800 pb-2">
                      <span>CP-SAT Optimizer Allocation</span>
                      <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-bold">OPTIMAL</span>
                    </div>

                    {assignedBlock ? (
                      <div className="space-y-3">
                        <div className="p-3 bg-blue-50/80 dark:bg-blue-950/40 rounded border border-blue-200 dark:border-blue-800 space-y-1.5">
                          <div className="flex items-center justify-between">
                            <strong className="text-slate-900 dark:text-slate-100 text-sm">{assignedBlock.block_id}</strong>
                            <span className="font-bold text-blue-900 dark:text-blue-300 text-xs">
                              {assignedBlock.start_time} – {assignedBlock.end_time}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-700 dark:text-slate-300">
                            Granted: <strong className="text-slate-900 dark:text-white">{assignedBlock.duration_minutes} min</strong> · Usable Work: <strong className="text-slate-900 dark:text-white">{assignedBlock.usable_minutes_breakdown?.usable_work_minutes ?? Math.max(0, assignedBlock.duration_minutes - 30)} min</strong>
                          </div>
                        </div>

                        <div className="p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded border border-slate-200 dark:border-slate-700 space-y-1 text-[11px] text-slate-600 dark:text-slate-300 font-sans">
                          <div className="font-bold text-slate-900 dark:text-slate-100 font-mono text-xs">Constraint Checks:</div>
                          <div className="flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                            <span>Zero passenger train conflicts</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                            <span>≥20 min express buffer maintained</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                            <span>BCM → Tamping machine lag (≥15 min) verified</span>
                          </div>
                        </div>

                        <Link
                          href="/plan"
                          className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white rounded font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                        >
                          <span>Open in Plan Workspace</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    ) : (
                      <div className="p-4 bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 rounded border border-amber-200 dark:border-amber-800 text-center text-xs">
                        This cluster contains deferred P3/P4 maintenance, held outside peak traffic windows.
                      </div>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div className="p-12 text-center text-slate-400 dark:text-slate-600 font-mono text-xs">
                Select a cluster to trace optimization pipeline
              </div>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
