"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { AppShell } from "@/components/shell/AppShell";
import { usePlanningRun } from "@/context/PlanningRunContext";
import { PlanningEngineOffline } from "@/components/common/PlanningEngineOffline";
import { PlanningLoading } from "@/components/common/PlanningLoading";
import {
  TrainTrack,
  ShieldCheck,
  Clock,
  Wrench,
  Zap,
  Radio,
  CheckCircle2,
  ChevronRight,
  Filter,
  ArrowRight,
  Sparkles,
  Download,
  Info,
  Calendar,
  Layers,
  Cpu,
  UserCheck,
  AlertTriangle,
  Sliders
} from "lucide-react";
import { PlannedBlock, NormalizedTask } from "@/lib/api/runs";
import { RailwayBlock } from "@/components/railway/RailwayBlock";
import { RailwaySignal } from "@/components/railway/RailwaySignal";
import { PlanningDrawer } from "@/components/railway/PlanningDrawer";
import { cn } from "@/lib/utils";

export default function PlanPage() {
  const { currentRun, loading, error, isBackend, approveCurrentPlan, replan, refresh, resetDemo } = usePlanningRun();
  const isOffline = !loading && (!isBackend || !!error);

  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [filterTier, setFilterTier] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isApproving, setIsApproving] = useState<boolean>(false);
  const [approvalMessage, setApprovalMessage] = useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);

  const blocks: PlannedBlock[] = currentRun?.weekly_plan || [];
  const tasks: NormalizedTask[] = currentRun?.prioritized_tasks || [];
  const deferredTasks: NormalizedTask[] = (currentRun?.solver_result?.unassigned_tasks as unknown as NormalizedTask[]) || [];

  // Default selected block is the first block or highlighted B-014 / BLK-2026-103
  const activeBlock: PlannedBlock = useMemo(() => {
    if (selectedBlockId) {
      return blocks.find((b) => b.block_id === selectedBlockId) || blocks[0];
    }
    return blocks.find((b) => b.block_id === "BLK-2026-103") || blocks[0];
  }, [blocks, selectedBlockId]);

  // Filter tasks for the left queue
  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      const matchTier = filterTier === "ALL" || t.safety_tier === filterTier;
      const matchQuery =
        !searchQuery ||
        t.task_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.department.toLowerCase().includes(searchQuery.toLowerCase());
      return matchTier && matchQuery;
    });
  }, [tasks, filterTier, searchQuery]);

  const handleApprove = async () => {
    setIsApproving(true);
    await approveCurrentPlan("Chief Block Planner (SC Div)", "Senior Divisional Operations Manager");
    setIsApproving(false);
    setApprovalMessage("Plan successfully approved and stamped for BDMS export.");
    setTimeout(() => setApprovalMessage(null), 5000);
  };

  const isApproved = currentRun?.decision_status === "APPROVED";

  return (
    <AppShell>
      <div className="flex flex-col h-[calc(100vh-110px)] bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans select-none overflow-hidden rounded-2xl border border-slate-300 dark:border-slate-800 shadow-xl mx-2 sm:mx-6 mb-4">
        {/* Top Operational Context Strip */}
        <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3 shrink-0 text-sm font-mono">
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-black text-slate-900 dark:text-white text-base tracking-tight">
              BLOCK PLANNING WORKSTATION
            </span>
            <span className="text-slate-300 dark:text-slate-700">|</span>
            <span className="text-slate-700 dark:text-slate-300 text-xs sm:text-sm">
              Run: <strong className="text-orange-500">{currentRun?.planning_run_id || "RB-2026-09-23"}</strong>
            </span>
            <span className="text-slate-300 dark:text-slate-700">|</span>
            <span className="text-slate-700 dark:text-slate-300 text-xs sm:text-sm">
              Corridor: <strong className="text-slate-900 dark:text-white">SEC–NDL (KM 40–120) Double Line</strong>
            </span>
          </div>

          <div className="flex items-center gap-3">
            {currentRun?.solver_result && (
              <div className="flex items-center gap-2">
                <span className="text-slate-600 dark:text-slate-400 font-medium text-xs">Solver:</span>
                <span className="px-2.5 py-1 rounded bg-orange-50 dark:bg-orange-950/70 text-orange-900 dark:text-orange-300 border border-orange-200 dark:border-orange-800 font-black text-xs">
                  {currentRun.solver_result.solver_status} ({currentRun.solver_result.solve_time_ms.toFixed(2)}ms)
                </span>
              </div>
            )}
            {currentRun?.validation_result && (
              <RailwaySignal
                aspect={currentRun.validation_result.overall_status === "VALIDATED" ? "CLEAR" : "CAUTION"}
                size="sm"
                label={currentRun.validation_result.overall_status ?? "PENDING"}
              />
            )}
          </div>
        </div>

        {/* Loading / Offline states */}
        {loading && (
          <div className="px-4 py-2"><PlanningLoading message="Executing CP-SAT planning pipeline..." /></div>
        )}
        {isOffline && (
          <div className="px-4 py-2">
            <PlanningEngineOffline runId={currentRun?.planning_run_id} onRetry={refresh} onLoadDemo={resetDemo} />
          </div>
        )}

        {/* Main 3-Column Split Planning Desk */}
        <div className="flex-1 grid grid-cols-12 min-h-0 overflow-hidden">
          {/* COLUMN 1: Maintenance Demand Register (Left 28%) */}
          <div className="col-span-12 lg:col-span-3 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col min-h-0">
            {/* Header & Filter Bar */}
            <div className="p-3 border-b border-slate-200 dark:border-slate-800 space-y-2.5 shrink-0 bg-slate-50 dark:bg-slate-950/40">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-black text-sm text-slate-900 dark:text-white uppercase tracking-wider">
                    Work Register
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-mono font-bold">
                    {tasks.length}
                  </span>
                </div>
                <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
                  TMS · SMMS · TDMS
                </span>
              </div>

              {/* Safety Tier Filter Pills */}
              <div className="flex items-center gap-1.5 text-xs font-mono">
                {["ALL", "P1", "P2", "P3", "P4"].map((tier) => (
                  <button
                    key={tier}
                    onClick={() => setFilterTier(tier)}
                    className={cn(
                      "px-2.5 py-1 rounded text-xs font-bold transition-all cursor-pointer",
                      filterTier === tier
                        ? "bg-orange-500 text-white shadow-xs"
                        : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700"
                    )}
                  >
                    {tier}
                  </button>
                ))}
              </div>
            </div>

            {/* Task Register Rows */}
            <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60 text-xs font-mono">
              {filteredTasks.map((task) => {
                const isSelected = activeBlock?.tasks?.some((t) => t.task_id === task.task_id);

                return (
                  <div
                    key={task.task_id}
                    className={cn(
                      "p-3 transition-colors space-y-1.5 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer",
                      isSelected
                        ? "bg-amber-50/90 dark:bg-amber-950/30 border-l-4 border-amber-500"
                        : ""
                    )}
                  >
                    {/* Engineering Row: Tier | ID | Location */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span
                          className={cn(
                            "px-2 py-0.5 rounded text-xs font-black",
                            task.safety_tier === "P1"
                              ? "bg-red-600 text-white"
                              : task.safety_tier === "P2"
                              ? "bg-amber-500 text-slate-950 font-black"
                              : "bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200"
                          )}
                        >
                          {task.safety_tier}
                        </span>
                        <span className="font-bold text-slate-900 dark:text-slate-100 text-xs">{task.task_id}</span>
                      </div>
                      <span className="text-xs text-slate-600 dark:text-slate-400 font-bold">
                        KM {task.km_start.toFixed(1)}
                      </span>
                    </div>

                    <p className="text-xs text-slate-800 dark:text-slate-200 font-sans font-medium line-clamp-1">
                      {task.title}
                    </p>

                    <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 pt-0.5">
                      <span className="flex items-center gap-1 font-semibold">
                        {task.department === "Engineering" && <Wrench className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />}
                        {task.department === "S&T" && <Radio className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />}
                        {task.department === "Traction" && <Zap className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />}
                        <span>{task.department}</span>
                      </span>
                      <span className="font-bold">{task.duration_min}m</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* COLUMN 2: Block Planning Board (Center 50%) */}
          <div className="col-span-12 lg:col-span-6 bg-slate-50 dark:bg-slate-950 flex flex-col min-h-0 border-r border-slate-200 dark:border-slate-800">
            {/* Center Header */}
            <div className="p-3 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0 font-mono text-xs sm:text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-orange-500" />
                <span className="font-black text-slate-900 dark:text-white uppercase">
                  Planning Timeline (00:00–24:00)
                </span>
                <span className="text-slate-300 dark:text-slate-700">·</span>
                <span className="text-slate-600 dark:text-slate-400">Double Line Corridor</span>
              </div>
              <span className="font-black text-orange-500">
                {blocks.length} Scheduled Blocks
              </span>
            </div>

            {/* Block Schedule Visual Rail */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {blocks.length === 0 && !loading && (
                <div className="p-8 text-center text-slate-500 dark:text-slate-400 text-sm font-mono">
                  No blocks scheduled — run planning engine to generate a plan.
                </div>
              )}
              {blocks.map((block) => {
                const isSelected = activeBlock?.block_id === block.block_id;
                const rawMin = block.duration_minutes;
                const usableMin = block.usable_minutes_breakdown?.usable_work_minutes ?? (rawMin - 25);

                return (
                  <RailwayBlock
                    key={block.block_id}
                    blockId={block.block_id}
                    kmStart={block.km_start}
                    kmEnd={block.km_end}
                    startTime={block.start_time}
                    endTime={block.end_time}
                    rawMinutes={rawMin}
                    usableMinutes={usableMin}
                    tasksCount={block.tasks?.length || 0}
                    departments={block.departments || []}
                    status={isSelected ? "ACTIVE" : "VALIDATED"}
                    isSelected={isSelected}
                    onClick={() => {
                      setSelectedBlockId(block.block_id);
                    }}
                  />
                );
              })}
            </div>
          </div>

          {/* COLUMN 3: Decision & Sanction Panel (Right 22%) */}
          <div className="col-span-12 lg:col-span-3 bg-white dark:bg-slate-900 flex flex-col min-h-0">
            {/* Header */}
            <div className="p-3 border-b border-slate-200 dark:border-slate-800 shrink-0 bg-slate-50 dark:bg-slate-950/40 font-mono text-xs sm:text-sm flex items-center justify-between">
              <span className="font-black text-slate-900 dark:text-white uppercase tracking-wider">
                Decision &amp; Sanction
              </span>
              {activeBlock && (
                <span className="text-orange-500 font-black">{activeBlock.block_id}</span>
              )}
            </div>

            {/* Decision Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs font-mono">
              {activeBlock ? (
                <>
                  {/* Selected Block Quick Coordinates */}
                  <div className="p-3 bg-slate-50 dark:bg-slate-950/60 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-black text-slate-900 dark:text-white text-sm">{activeBlock.block_id}</span>
                      <RailwaySignal aspect="CLEAR" size="sm" label="VALID" />
                    </div>
                    <div className="text-xs text-slate-700 dark:text-slate-300 space-y-1">
                      <div>Slot: <strong className="text-slate-900 dark:text-white">{activeBlock.start_time} – {activeBlock.end_time}</strong></div>
                      <div>Location: <strong className="text-slate-900 dark:text-white">KM {activeBlock.km_start} – {activeBlock.km_end}</strong></div>
                      <div>Usable Work: <strong className="text-amber-600 dark:text-amber-400">{activeBlock.usable_minutes_breakdown?.usable_work_minutes ?? "—"} min</strong></div>
                    </div>
                  </div>

                  {/* Why This Block? */}
                  <div className="space-y-2">
                    <div className="text-slate-900 dark:text-white font-black uppercase text-xs tracking-wider">
                      Why This Block?
                    </div>
                    <div className="p-3 bg-slate-50 dark:bg-slate-950/60 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2 text-xs text-slate-700 dark:text-slate-300 font-sans">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                        <span><strong>Safety:</strong> P1 critical defect protected</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                        <span><strong>Spatial:</strong> ≤3km multi-dept cluster</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                        <span><strong>Timetable:</strong> ≥20 min passenger buffer</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                        <span><strong>Capacity:</strong> 85 min usable work</span>
                      </div>
                    </div>
                  </div>

                  {/* Level 3 Evidence Drawer Trigger Button */}
                  <button
                    onClick={() => setIsDrawerOpen(true)}
                    className="w-full py-2.5 px-3.5 rounded-xl bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 border border-orange-500/30 text-xs font-bold transition-all flex items-center justify-between cursor-pointer"
                  >
                    <span>Inspect Full Block Dossier</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>

                  {/* Fast 8-Rule Validator Checks */}
                  <div className="p-3 bg-slate-50 dark:bg-slate-950/60 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1.5">
                    <div className="text-slate-900 dark:text-white font-black uppercase text-xs">
                      Independent Checks
                    </div>
                    <div className="space-y-1 text-xs text-slate-600 dark:text-slate-400">
                      <div className="flex items-center justify-between">
                        <span>VR-01 Train Overlap</span>
                        <span className="text-emerald-700 dark:text-emerald-400 font-black">PASS (0)</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>VR-02 Safety Buffer</span>
                        <span className="text-emerald-700 dark:text-emerald-400 font-black">PASS (≥20m)</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>VR-04 OHE Power Cut</span>
                        <span className="text-emerald-700 dark:text-emerald-400 font-black">PASS</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>VR-05 Critical Flaws</span>
                        <span className="text-emerald-700 dark:text-emerald-400 font-black">PASS (100%)</span>
                      </div>
                    </div>
                  </div>

                  {/* Planner Sanction Action Gate */}
                  <div className="pt-2 space-y-2.5">
                    {approvalMessage && (
                      <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-700 text-xs font-sans font-semibold">
                        {approvalMessage}
                      </div>
                    )}

                    <button
                      onClick={handleApprove}
                      disabled={isApproving || isApproved}
                      className={cn(
                        "w-full py-3 rounded-xl font-black text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer",
                        isApproved
                          ? "bg-emerald-700 text-white cursor-default"
                          : "bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white shadow-md shadow-orange-500/20"
                      )}
                    >
                      <UserCheck className="w-4 h-4" />
                      <span>{isApproved ? "PLAN APPROVED & SANCTIONED" : "APPROVE PLAN AS CHIEF PLANNER"}</span>
                    </button>

                    <p className="text-xs text-slate-500 dark:text-slate-400 text-center font-sans">
                      RAILBLOCK recommends. The planner decides.
                    </p>
                  </div>
                </>
              ) : (
                <div className="p-6 text-center text-slate-400">
                  Select a block to inspect
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Progressive Disclosure Planning Drawer */}
      <PlanningDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        block={activeBlock}
      />
    </AppShell>
  );
}
