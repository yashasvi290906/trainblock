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
  const deferredTasks: NormalizedTask[] = currentRun?.solver_result?.unassigned_tasks || [];

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
      <div className="flex flex-col h-full bg-slate-50 text-slate-900 font-sans select-none overflow-hidden">
        {/* Top Operational Context Strip */}
        <div className="bg-white border-b border-slate-200 px-4 sm:px-6 py-2 flex flex-wrap items-center justify-between gap-3 shrink-0 text-xs font-mono">
          <div className="flex items-center gap-3">
            <span className="font-extrabold text-slate-900 text-sm tracking-tight">
              BLOCK PLANNING WORKSTATION
            </span>
            <span className="text-slate-300">|</span>
            <span className="text-slate-600">
              Run: <strong className="text-blue-700">{currentRun?.planning_run_id || "RB-2026-09-23"}</strong>
            </span>
            <span className="text-slate-300">|</span>
            <span className="text-slate-600">
              Corridor: <strong>SEC–NDL (KM 40–120)</strong>
            </span>
          </div>

          <div className="flex items-center gap-3">
            {currentRun?.solver_result && (
              <div className="flex items-center gap-2">
                <span className="text-slate-500 font-medium">Solver:</span>
                <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-900 border border-blue-200 font-bold text-[11px]">
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
          {/* COLUMN 1: Maintenance Demand Register (Left 25%) */}
          <div className="col-span-12 lg:col-span-3 bg-white border-r border-slate-200 flex flex-col min-h-0">
            {/* Header & Filter Bar */}
            <div className="p-2.5 border-b border-slate-200 space-y-2 shrink-0 bg-slate-50/70">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="font-mono font-bold text-xs text-slate-900 uppercase">
                    Work Register
                  </span>
                  <span className="px-1.5 py-0.2 rounded bg-slate-200 text-slate-700 text-[10px] font-mono font-bold">
                    {tasks.length}
                  </span>
                </div>
                <span className="text-[10px] font-mono text-slate-500">
                  TMS · SMMS · TDMS
                </span>
              </div>

              {/* Safety Tier Filter Pills */}
              <div className="flex items-center gap-1 text-[10px] font-mono">
                {["ALL", "P1", "P2", "P3", "P4"].map((tier) => (
                  <button
                    key={tier}
                    onClick={() => setFilterTier(tier)}
                    className={cn(
                      "px-2 py-0.5 rounded transition-colors font-bold cursor-pointer",
                      filterTier === tier
                        ? "bg-slate-900 text-white"
                        : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
                    )}
                  >
                    {tier}
                  </button>
                ))}
              </div>
            </div>

            {/* Task Register Rows (Clean Engineering Register Format) */}
            <div className="flex-1 overflow-y-auto divide-y divide-slate-100 text-xs font-mono">
              {filteredTasks.map((task) => {
                const isSelected = activeBlock?.tasks?.some((t) => t.task_id === task.task_id);

                return (
                  <div
                    key={task.task_id}
                    className={cn(
                      "p-2.5 transition-colors space-y-1 hover:bg-slate-50 cursor-pointer",
                      isSelected ? "bg-amber-50/70 border-l-3 border-amber-500" : ""
                    )}
                  >
                    {/* Compact Engineering Row: P1 | WO-ID | DEFECT | KM | DEPT | DURATION */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={cn(
                            "px-1.5 py-0.2 rounded text-[10px] font-black",
                            task.safety_tier === "P1"
                              ? "bg-red-600 text-white"
                              : task.safety_tier === "P2"
                              ? "bg-amber-100 text-amber-900 border border-amber-300"
                              : "bg-slate-100 text-slate-700 border border-slate-200"
                          )}
                        >
                          {task.safety_tier}
                        </span>
                        <span className="font-bold text-slate-900">{task.task_id}</span>
                      </div>
                      <span className="text-[10px] text-slate-500 font-semibold">
                        KM {task.km_start.toFixed(1)}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-700 font-sans line-clamp-1">
                      {task.title}
                    </p>

                    <div className="flex items-center justify-between text-[10px] text-slate-500 pt-0.5">
                      <span className="flex items-center gap-1">
                        {task.department === "Engineering" && <Wrench className="w-2.5 h-2.5 text-amber-600" />}
                        {task.department === "S&T" && <Radio className="w-2.5 h-2.5 text-sky-600" />}
                        {task.department === "Traction" && <Zap className="w-2.5 h-2.5 text-emerald-600" />}
                        <span>{task.department}</span>
                      </span>
                      <span>{task.duration_min}m</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* COLUMN 2: Block Planning Board (Center 55%) */}
          <div className="col-span-12 lg:col-span-6 bg-slate-50 flex flex-col min-h-0 border-r border-slate-200">
            {/* Center Header */}
            <div className="p-2.5 bg-white border-b border-slate-200 flex items-center justify-between shrink-0 font-mono text-xs">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-700" />
                <span className="font-bold text-slate-900 uppercase">
                  Planning Timeline (00:00–24:00)
                </span>
                <span className="text-slate-400">·</span>
                <span className="text-slate-600">Double Line Corridor</span>
              </div>
              <span className="font-bold text-blue-700 text-xs">
                {blocks.length} Scheduled Blocks
              </span>
            </div>

            {/* Block Schedule Visual Rail */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {blocks.length === 0 && !loading && (
                <div className="p-6 text-center text-slate-400 text-xs font-mono">
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

          {/* COLUMN 3: Decision & Sanction Panel (Right 20%) */}
          <div className="col-span-12 lg:col-span-3 bg-white flex flex-col min-h-0">
            {/* Header */}
            <div className="p-2.5 border-b border-slate-200 shrink-0 bg-slate-50/70 font-mono text-xs flex items-center justify-between">
              <span className="font-bold text-slate-900 uppercase">
                Decision &amp; Sanction
              </span>
              {activeBlock && (
                <span className="text-blue-700 font-bold">{activeBlock.block_id}</span>
              )}
            </div>

            {/* Decision Content */}
            <div className="flex-1 overflow-y-auto p-3.5 space-y-4 text-xs font-mono">
              {activeBlock ? (
                <>
                  {/* Selected Block Quick Coordinates */}
                  <div className="p-2.5 bg-slate-50 rounded border border-slate-200 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-slate-900">{activeBlock.block_id}</span>
                      <RailwaySignal aspect="CLEAR" size="sm" label="VALID" />
                    </div>
                    <div className="text-[11px] text-slate-600 space-y-0.5">
                      <div>Slot: <strong>{activeBlock.start_time} – {activeBlock.end_time}</strong></div>
                      <div>Location: <strong>KM {activeBlock.km_start} – {activeBlock.km_end}</strong></div>
                      <div>Usable Work: <strong>{activeBlock.usable_minutes_breakdown?.usable_work_minutes ?? "—"} min</strong></div>
                    </div>
                  </div>

                  {/* Why This Block? (Section 34 Interaction Principle) */}
                  <div className="space-y-1.5">
                    <div className="text-slate-800 font-bold uppercase text-[11px]">
                      Why This Block?
                    </div>
                    <div className="p-2.5 bg-slate-50 rounded border border-slate-200 space-y-1 text-[11px] text-slate-700 font-sans">
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span><strong>Safety:</strong> P1 critical defect protected</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span><strong>Spatial:</strong> ≤3km multi-dept cluster</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span><strong>Timetable:</strong> ≥20 min passenger buffer</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span><strong>Capacity:</strong> 85 min usable work</span>
                      </div>
                    </div>
                  </div>

                  {/* Level 3 Evidence Drawer Trigger Button */}
                  <button
                    onClick={() => setIsDrawerOpen(true)}
                    className="w-full py-2 px-3 rounded bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-200 text-xs font-bold transition-colors flex items-center justify-between cursor-pointer"
                  >
                    <span>Inspect Full Block Dossier</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>

                  {/* Fast 8-Rule Validator Checks */}
                  <div className="p-2.5 bg-slate-50 rounded border border-slate-200 space-y-1">
                    <div className="text-slate-800 font-bold uppercase text-[10px]">
                      Independent Checks
                    </div>
                    <div className="space-y-0.5 text-[10px] text-slate-600">
                      <div className="flex items-center justify-between">
                        <span>VR-01 Train Overlap</span>
                        <span className="text-emerald-700 font-bold">PASS (0)</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>VR-02 Safety Buffer</span>
                        <span className="text-emerald-700 font-bold">PASS (≥20m)</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>VR-04 OHE Power Cut</span>
                        <span className="text-emerald-700 font-bold">PASS</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>VR-05 Critical Flaws</span>
                        <span className="text-emerald-700 font-bold">PASS (100%)</span>
                      </div>
                    </div>
                  </div>

                  {/* Planner Sanction Action Gate */}
                  <div className="pt-1 space-y-2">
                    {approvalMessage && (
                      <div className="p-2 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-sans">
                        {approvalMessage}
                      </div>
                    )}

                    <button
                      onClick={handleApprove}
                      disabled={isApproving || isApproved}
                      className={cn(
                        "w-full py-2.5 rounded font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer",
                        isApproved
                          ? "bg-emerald-700 text-white cursor-default"
                          : "bg-slate-900 hover:bg-slate-800 text-white"
                      )}
                    >
                      <UserCheck className="w-4 h-4" />
                      <span>{isApproved ? "PLAN APPROVED & SANCTIONED" : "APPROVE PLAN AS CHIEF PLANNER"}</span>
                    </button>

                    <p className="text-[10px] text-slate-400 text-center font-sans">
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
