"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { AppShell } from "@/components/shell/AppShell";
import { usePlanningRun } from "@/context/PlanningRunContext";
import { PlanningLoading } from "@/components/common/PlanningLoading";
import { PlanningEngineOffline } from "@/components/common/PlanningEngineOffline";
import {
  Wrench,
  Zap,
  Radio,
  Layers,
  PlusCircle,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ShieldCheck,
  Cpu,
  FileText,
  Calendar,
  Filter,
  Send,
  Sliders,
  Check,
  X,
  MapPin,
  Truck,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { NormalizedTask, PlannedBlock } from "@/lib/api/runs";

type DepartmentKey = "ENG" | "SIG" | "TRD";

interface DeptMeta {
  key: DepartmentKey;
  label: string;
  deptName: "Engineering" | "S&T" | "Traction";
  sourceSystem: string;
  color: string;
  badgeBg: string;
  badgeBorder: string;
  badgeText: string;
  description: string;
}

const DEPARTMENTS: DeptMeta[] = [
  {
    key: "ENG",
    label: "Civil Engineering (Permanent Way)",
    deptName: "Engineering",
    sourceSystem: "TMS (Track Management System)",
    color: "amber",
    badgeBg: "bg-amber-500/15",
    badgeBorder: "border-amber-500/40",
    badgeText: "text-amber-500 dark:text-amber-400",
    description: "Deep screening, track renewals, rail replacement & switch maintenance",
  },
  {
    key: "SIG",
    label: "Signal & Telecom (S&T)",
    deptName: "S&T",
    sourceSystem: "SMMS (Signal Maintenance Mgmt)",
    color: "cyan",
    badgeBg: "bg-cyan-500/15",
    badgeBorder: "border-cyan-500/40",
    badgeText: "text-cyan-500 dark:text-cyan-400",
    description: "Point machines, axle counters, track circuits & interlocked signaling",
  },
  {
    key: "TRD",
    label: "Traction Distribution (TRD)",
    deptName: "Traction",
    sourceSystem: "TDMS (Traction Distribution Mgmt)",
    color: "purple",
    badgeBg: "bg-purple-500/15",
    badgeBorder: "border-purple-500/40",
    badgeText: "text-purple-500 dark:text-purple-400",
    description: "OHE cantilever adjustments, contact wire replacement & power isolations",
  },
];

export default function DepartmentDeskPage() {
  const {
    currentRun,
    loading,
    error,
    isBackend,
    refresh,
    resetDemo,
    deptAddDemand,
    deptUpdateReadiness,
    deptRequestBlock,
  } = usePlanningRun();

  const [selectedDeptKey, setSelectedDeptKey] = useState<DepartmentKey>("ENG");
  const [filterTier, setFilterTier] = useState<string>("ALL");
  const [isNewDemandModalOpen, setIsNewDemandModalOpen] = useState<boolean>(false);
  const [isRequestBlockModalOpen, setIsRequestBlockModalOpen] = useState<boolean>(false);
  const [actionStatus, setActionStatus] = useState<string | null>(null);

  // New demand form state
  const [newTitle, setNewTitle] = useState("");
  const [newTier, setNewTier] = useState<"P1" | "P2" | "P3" | "P4">("P1");
  const [newStartKm, setNewStartKm] = useState("65.0");
  const [newEndKm, setNewEndKm] = useState("68.0");
  const [newDuration, setNewDuration] = useState("120");
  const [newMachine, setNewMachine] = useState("Plasser BCM 09");

  // Selected task for block request
  const [taskForBlockRequest, setTaskForBlockRequest] = useState<NormalizedTask | null>(null);
  const [reqPreferredWindow, setReqPreferredWindow] = useState("NIGHT (01:00 - 05:00)");
  const [reqUrgency, setReqUrgency] = useState("CRITICAL_SAFETY");

  // Local readiness state overrides
  const [readinessMap, setReadinessMap] = useState<
    Record<string, { crew: boolean; machine: boolean; material: boolean }>
  >({});

  const activeDept = useMemo(() => {
    return DEPARTMENTS.find((d) => d.key === selectedDeptKey) || DEPARTMENTS[0];
  }, [selectedDeptKey]);

  const allTasks: NormalizedTask[] = currentRun?.prioritized_tasks || [];
  const weeklyPlan: PlannedBlock[] = currentRun?.weekly_plan || [];

  // Filter tasks belonging to selected department
  const deptTasks = useMemo(() => {
    return allTasks.filter((t) => {
      const matchDept = t.department === activeDept.deptName;
      const matchTier = filterTier === "ALL" || t.safety_tier === filterTier;
      return matchDept && matchTier;
    });
  }, [allTasks, activeDept, filterTier]);

  // KPIs for active department
  const p1Count = deptTasks.filter((t) => t.safety_tier === "P1").length;
  const p2Count = deptTasks.filter((t) => t.safety_tier === "P2").length;
  const scheduledCount = deptTasks.filter((t) =>
    weeklyPlan.some((b) => b.tasks?.some((bt) => bt.task_id === t.task_id))
  ).length;

  const handleToggleReadiness = async (taskId: string, checkType: "crew" | "machine" | "material") => {
    const current = readinessMap[taskId] || { crew: true, machine: true, material: true };
    const updated = { ...current, [checkType]: !current[checkType] };
    setReadinessMap((prev) => ({ ...prev, [taskId]: updated }));

    const isAllReady = updated.crew && updated.machine && updated.material;
    try {
      await deptUpdateReadiness(taskId, isAllReady ? "READY" : "PARTIAL", "Senior Section Engineer");
      setActionStatus(`Readiness updated for ${taskId} (${isAllReady ? "READY" : "PARTIAL"}).`);
      setTimeout(() => setActionStatus(null), 3000);
    } catch {
      setActionStatus("Failed to update readiness.");
    }
  };

  const handleCreateDemand = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    try {
      setActionStatus(`Submitting ${activeDept.label} demand to Planning Engine...`);
      await deptAddDemand({
        department: activeDept.deptName,
        defect_type: newTitle,
        line: "DOWN",
        km_start: parseFloat(newStartKm) || 65.0,
        km_end: parseFloat(newEndKm) || 68.0,
        duration_min: parseInt(newDuration, 10) || 120,
        machine_required: newMachine || undefined,
        severity: newTier === "P1" ? 1 : newTier === "P2" ? 2 : 3,
      });
      setIsNewDemandModalOpen(false);
      setNewTitle("");
      setActionStatus("Demand registered successfully. Optimization run updated.");
      setTimeout(() => setActionStatus(null), 4000);
    } catch {
      setActionStatus("Failed to register maintenance demand.");
    }
  };

  const handleRequestBlockSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskForBlockRequest) return;
    try {
      setActionStatus("Dispatching formal block requisition to Divisional Operations...");
      await deptRequestBlock(
        taskForBlockRequest.department,
        `KM ${taskForBlockRequest.km_start.toFixed(1)}-${taskForBlockRequest.km_end.toFixed(1)}`,
        reqPreferredWindow,
        "Section Engineer"
      );
      setIsRequestBlockModalOpen(false);
      setActionStatus(`Block request lodged for ${taskForBlockRequest.task_id}. Ticket forwarded to Sr. DOM.`);
      setTimeout(() => setActionStatus(null), 5000);
    } catch {
      setActionStatus("Error lodging block request.");
    }
  };

  return (
    <AppShell
      pageTitle="MAINTENANCE WORK DESK"
      subtitle="Department maintenance demand, resource readiness & co-located block coordination"
    >
      <div className="space-y-6">
        {/* Status notification */}
        {actionStatus && (
          <div className="p-3.5 rounded-xl bg-orange-500/10 border border-orange-500/30 text-orange-900 dark:text-orange-200 text-xs font-mono flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-orange-500 animate-ping" />
              <span className="font-bold">{actionStatus}</span>
            </div>
            <button
              onClick={() => setActionStatus(null)}
              className="text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 font-bold"
            >
              ✕
            </button>
          </div>
        )}

        {/* DEPARTMENT TABS & ACTION HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          {/* Department Selector */}
          <div className="flex flex-wrap items-center gap-2">
            {DEPARTMENTS.map((dept) => {
              const isSelected = dept.key === selectedDeptKey;
              return (
                <button
                  key={dept.key}
                  onClick={() => setSelectedDeptKey(dept.key)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all",
                    isSelected
                      ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                  )}
                >
                  {dept.key === "ENG" && <Wrench className="w-4 h-4 text-amber-500" />}
                  {dept.key === "SIG" && <Radio className="w-4 h-4 text-cyan-500" />}
                  {dept.key === "TRD" && <Zap className="w-4 h-4 text-purple-500" />}
                  <span>{dept.label}</span>
                </button>
              );
            })}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsNewDemandModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-mono font-bold text-xs shadow-xs transition-colors flex items-center gap-1.5"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Create Maintenance Demand</span>
            </button>
          </div>
        </div>

        {/* ACTIVE DEPARTMENT TELEMETRY STRIP */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded font-black text-[10px] bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
              SOURCE INTEGRATION
            </span>
            <span className="font-bold text-slate-900 dark:text-white">
              {activeDept.sourceSystem}
            </span>
            <span className="text-slate-400">·</span>
            <span className="text-slate-500 dark:text-slate-400 hidden md:inline">
              {activeDept.description}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-slate-500 dark:text-slate-400">FILTER TIER:</span>
            {["ALL", "P1", "P2", "P3"].map((tier) => (
              <button
                key={tier}
                onClick={() => setFilterTier(tier)}
                className={cn(
                  "px-2.5 py-1 rounded text-xs font-bold transition-all",
                  filterTier === tier
                    ? "bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-900"
                    : "bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-300"
                )}
              >
                {tier}
              </button>
            ))}
          </div>
        </div>

        {/* 4 SUMMARY STAT CARDS */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 font-mono text-xs">
          <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
            <span className="text-slate-500 dark:text-slate-400 font-bold uppercase">REGISTERED DEMANDS</span>
            <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
              {deptTasks.length} Tasks
            </div>
            <span className="text-[11px] text-slate-400 mt-1 block">In current planning cycle</span>
          </div>

          <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
            <span className="text-slate-500 dark:text-slate-400 font-bold uppercase">CRITICAL P1 TASKS</span>
            <div className="text-2xl font-black text-rose-600 dark:text-rose-400 mt-1">
              {p1Count} Defects
            </div>
            <span className="text-[11px] text-rose-500 mt-1 block font-bold">Mandatory zero-deferral</span>
          </div>

          <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
            <span className="text-slate-500 dark:text-slate-400 font-bold uppercase">P2 URGENT TASKS</span>
            <div className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-1">
              {p2Count} Works
            </div>
            <span className="text-[11px] text-slate-400 mt-1 block">48-hour SLA target</span>
          </div>

          <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
            <span className="text-slate-500 dark:text-slate-400 font-bold uppercase">SCHEDULED IN GANTT</span>
            <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
              {scheduledCount} / {deptTasks.length}
            </div>
            <span className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 block font-bold">
              {deptTasks.length > 0 ? Math.round((scheduledCount / deptTasks.length) * 100) : 0}% Coverage
            </span>
          </div>
        </div>

        {/* WORK REGISTER & READINESS CHECKLIST TABLE */}
        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2 font-mono">
              <Layers className="w-5 h-5 text-orange-500" />
              <h2 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wide">
                {activeDept.label} · Work Register &amp; Resource Readiness
              </h2>
            </div>
            <span className="text-xs font-mono text-slate-500 font-bold">
              {deptTasks.length} Items Listed
            </span>
          </div>

          {deptTasks.length === 0 ? (
            <div className="p-12 text-center text-slate-500 font-mono text-xs">
              No tasks found for {activeDept.label} with filter &quot;{filterTier}&quot;. Click &quot;Create Maintenance Demand&quot; to register new work.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 uppercase text-[11px] border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="py-3 px-4 font-bold">Task ID &amp; Tier</th>
                    <th className="py-3 px-4 font-bold">Work Title &amp; Location</th>
                    <th className="py-3 px-4 font-bold">Duration</th>
                    <th className="py-3 px-4 font-bold">Resource Readiness Checklist</th>
                    <th className="py-3 px-4 font-bold">Plan Status</th>
                    <th className="py-3 px-4 font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                  {deptTasks.map((t) => {
                    const scheduledBlock = weeklyPlan.find((b) =>
                      b.tasks?.some((bt) => bt.task_id === t.task_id)
                    );
                    const isP1 = t.safety_tier === "P1";
                    const readiness = readinessMap[t.task_id] || {
                      crew: true,
                      machine: true,
                      material: true,
                    };

                    return (
                      <tr
                        key={t.task_id}
                        className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                      >
                        {/* Task ID & Tier */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <span className="font-black text-slate-900 dark:text-white">
                              {t.task_id}
                            </span>
                            <span
                              className={cn(
                                "px-2 py-0.5 rounded text-[10px] font-bold border",
                                isP1
                                  ? "bg-rose-500/15 border-rose-500/40 text-rose-600 dark:text-rose-400"
                                  : t.safety_tier === "P2"
                                  ? "bg-amber-500/15 border-amber-500/40 text-amber-600 dark:text-amber-400"
                                  : "bg-slate-200 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400"
                              )}
                            >
                              {t.safety_tier}
                            </span>
                          </div>
                          <span className="text-[10px] text-slate-400 block mt-0.5">
                            {isP1 ? "Safety Invariant" : "Preventive Maintenance"}
                          </span>
                        </td>

                        {/* Title & Location */}
                        <td className="py-3.5 px-4 max-w-sm">
                          <div className="font-bold text-slate-900 dark:text-slate-100 truncate">
                            {t.title}
                          </div>
                          <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                            <MapPin className="w-3 h-3 text-orange-500 shrink-0" />
                            <span>
                              KM {t.km_start.toFixed(1)} – {t.km_end.toFixed(1)}
                            </span>
                            {t.machine_required && (
                              <>
                                <span>•</span>
                                <span className="text-amber-600 dark:text-amber-400 font-semibold">
                                  {t.machine_required}
                                </span>
                              </>
                            )}
                          </div>
                        </td>

                        {/* Duration */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-bold">
                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                            <span>{t.duration_min} min</span>
                          </div>
                        </td>

                        {/* Resource Readiness Checklist */}
                        <td className="py-3.5 px-4">
                          <div className="flex flex-wrap items-center gap-2">
                            {/* Crew button */}
                            <button
                              onClick={() => handleToggleReadiness(t.task_id, "crew")}
                              className={cn(
                                "flex items-center gap-1 px-2 py-1 rounded text-[10px] font-bold border transition-colors",
                                readiness.crew
                                  ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-400 text-emerald-700 dark:text-emerald-300"
                                  : "bg-rose-50 dark:bg-rose-950/40 border-rose-400 text-rose-700 dark:text-rose-300"
                              )}
                              title="Toggle Crew Readiness"
                            >
                              <Users className="w-3 h-3" />
                              <span>Crew {readiness.crew ? "✓" : "✗"}</span>
                            </button>

                            {/* Machine button */}
                            {t.machine_required ? (
                              <button
                                onClick={() => handleToggleReadiness(t.task_id, "machine")}
                                className={cn(
                                  "flex items-center gap-1 px-2 py-1 rounded text-[10px] font-bold border transition-colors",
                                  readiness.machine
                                    ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-400 text-emerald-700 dark:text-emerald-300"
                                    : "bg-rose-50 dark:bg-rose-950/40 border-rose-400 text-rose-700 dark:text-rose-300"
                                )}
                                title="Toggle Machine Fitness"
                              >
                                <Truck className="w-3 h-3" />
                                <span>Plant {readiness.machine ? "✓" : "✗"}</span>
                              </button>
                            ) : (
                              <span className="px-1.5 py-0.5 rounded text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-400">
                                Plant N/A
                              </span>
                            )}

                            {/* Material button */}
                            <button
                              onClick={() => handleToggleReadiness(t.task_id, "material")}
                              className={cn(
                                "flex items-center gap-1 px-2 py-1 rounded text-[10px] font-bold border transition-colors",
                                readiness.material
                                  ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-400 text-emerald-700 dark:text-emerald-300"
                                  : "bg-rose-50 dark:bg-rose-950/40 border-rose-400 text-rose-700 dark:text-rose-300"
                              )}
                              title="Toggle Material Kit Staged"
                            >
                              <FileText className="w-3 h-3" />
                              <span>Kit {readiness.material ? "✓" : "✗"}</span>
                            </button>
                          </div>
                        </td>

                        {/* Plan Status */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          {scheduledBlock ? (
                            <div className="space-y-0.5">
                              <span className="px-2 py-0.5 rounded bg-emerald-500/15 border border-emerald-500/40 text-emerald-700 dark:text-emerald-300 font-bold text-[10px]">
                                SHADOWED IN {scheduledBlock.block_id}
                              </span>
                              <span className="text-[10px] text-slate-400 block font-semibold">
                                {scheduledBlock.start_time}–{scheduledBlock.end_time}
                              </span>
                            </div>
                          ) : (
                            <span className="px-2 py-0.5 rounded bg-amber-500/15 border border-amber-500/40 text-amber-700 dark:text-amber-300 font-bold text-[10px]">
                              UNASSIGNED QUEUE
                            </span>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-4 text-right whitespace-nowrap">
                          <button
                            onClick={() => {
                              setTaskForBlockRequest(t);
                              setIsRequestBlockModalOpen(true);
                            }}
                            className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition-colors"
                          >
                            Request Block
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* MODAL 1: CREATE MAINTENANCE DEMAND */}
        {isNewDemandModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4 font-mono">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <PlusCircle className="w-5 h-5 text-orange-500" />
                  <h3 className="text-base font-black text-slate-900 dark:text-white">
                    Register Maintenance Demand ({activeDept.key})
                  </h3>
                </div>
                <button
                  onClick={() => setIsNewDemandModalOpen(false)}
                  className="text-slate-400 hover:text-white font-bold"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreateDemand} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Work Title / Description
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="E.g., Turnout Renewal Point 104-A at Moula Ali Yard"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Safety Tier
                    </label>
                    <select
                      value={newTier}
                      onChange={(e) => setNewTier(e.target.value as any)}
                      className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-bold"
                    >
                      <option value="P1">P1 — Critical Safety Invariant</option>
                      <option value="P2">P2 — Urgent Asset Maintenance</option>
                      <option value="P3">P3 — Routine Preventive</option>
                      <option value="P4">P4 — Opportunity Window</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Duration (Minutes)
                    </label>
                    <input
                      type="number"
                      value={newDuration}
                      onChange={(e) => setNewDuration(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Start KM
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={newStartKm}
                      onChange={(e) => setNewStartKm(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      End KM
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={newEndKm}
                      onChange={(e) => setNewEndKm(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Specialized Machine / Vehicle Required (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="E.g., Plasser 09-3X Tamping, Tower Wagon, Unimat 08-475"
                    value={newMachine}
                    onChange={(e) => setNewMachine(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsNewDemandModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold"
                  >
                    Submit Demand
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL 2: REQUEST DIRECT BLOCK REQUISITION */}
        {isRequestBlockModalOpen && taskForBlockRequest && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4 font-mono">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Send className="w-5 h-5 text-amber-500" />
                  <h3 className="text-base font-black text-slate-900 dark:text-white">
                    Submit Possession Requisition to Control
                  </h3>
                </div>
                <button
                  onClick={() => setIsRequestBlockModalOpen(false)}
                  className="text-slate-400 hover:text-white font-bold"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleRequestBlockSubmit} className="space-y-4 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 dark:text-white">
                      {taskForBlockRequest.task_id}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-600 dark:text-amber-400 font-black">
                      {taskForBlockRequest.safety_tier}
                    </span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 font-medium">
                    {taskForBlockRequest.title}
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Location: KM {taskForBlockRequest.km_start.toFixed(1)} – {taskForBlockRequest.km_end.toFixed(1)} · {taskForBlockRequest.duration_min} min
                  </p>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Preferred Window
                  </label>
                  <select
                    value={reqPreferredWindow}
                    onChange={(e) => setReqPreferredWindow(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-bold"
                  >
                    <option value="NIGHT (01:00 - 05:00)">Night Window (01:00 – 05:00) · Lowest Traffic Impact</option>
                    <option value="DAY_OFFPEAK (11:00 - 15:00)">Mid-Day Off-Peak (11:00 – 15:00)</option>
                    <option value="IMMEDIATE_EMERGENCY">Emergency Immediate Possession</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Urgency Justification
                  </label>
                  <select
                    value={reqUrgency}
                    onChange={(e) => setReqUrgency(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-bold"
                  >
                    <option value="CRITICAL_SAFETY">Critical Safety — Track integrity compromised</option>
                    <option value="RELAX_SPEED_RESTRICTION">Speed Restriction Removal (Regain 130 km/h PSR)</option>
                    <option value="SCHEDULED_CYCLE">Cycle Maintenance Schedule (TMS/SMMS/TDMS)</option>
                  </select>
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsRequestBlockModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold"
                  >
                    Submit Requisition
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
