"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  FileCheck,
  Shield,
  Clock,
  Download,
  RotateCcw,
  Layers,
  ArrowRight,
  Info,
  Lock,
  Unlock,
  FileSpreadsheet,
  SplitSquareVertical,
  Activity,
  HardHat,
  Train as TrainIcon,
  ChevronRight,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { MOCK_BLOCKS } from "@/data/mock/blocks";
import { Block } from "@/types/planning";
import {
  validatePlanForApproval,
  generateBlockDemandCsv,
  ApprovalCheck,
  PlanApprovalDossier,
} from "@/lib/decision";

export default function DecisionPage() {
  const [selectedBlock, setSelectedBlock] = useState<Block>(MOCK_BLOCKS[0]);
  const [planVersion, setPlanVersion] = useState<string>("v1.0");
  const [planStatus, setPlanStatus] = useState<
    "REVIEW_REQUIRED" | "PLANNER_APPROVED" | "REVISION_REQUESTED" | "PLAN_REJECTED"
  >("REVIEW_REQUIRED");

  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [showRevisionModal, setShowRevisionModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);

  const [revisionReason, setRevisionReason] = useState("Operating constraint");
  const [revisionComments, setRevisionComments] = useState("");

  const [auditLog, setAuditLog] = useState<
    { timestamp: string; action: string; user: string; notes?: string }[]
  >([
    { timestamp: "08:42:10", action: "Integrated plan generated via CP-SAT solver", user: "SYSTEM" },
    { timestamp: "08:43:05", action: "Planner opened dossier for SEC–NDL corridor", user: "PROTOTYPE_PLANNER" },
    { timestamp: "08:44:22", action: "Inspected B-014 multi-departmental task allocation", user: "PROTOTYPE_PLANNER" },
    { timestamp: "08:45:18", action: "Tested Scenario SD-01 (Operating Denial fallback)", user: "PROTOTYPE_PLANNER" },
    { timestamp: "08:48:00", action: "Pre-approval safety checks evaluated (8/8 Passed)", user: "SYSTEM" },
  ]);

  // Validation
  const validation = validatePlanForApproval(selectedBlock, 0, 0);

  // Approval Handlers
  const handleConfirmApproval = () => {
    setPlanStatus("PLANNER_APPROVED");
    setShowApprovalModal(false);
    setAuditLog((prev) => [
      {
        timestamp: new Date().toLocaleTimeString("en-GB", { hour12: false }),
        action: `PLAN APPROVED by Chief Planning Officer (Version ${planVersion} Locked)`,
        user: "PROTOTYPE_PLANNER",
        notes: "0 Timetable Conflicts • 7 Consolidated Tasks • 90 min Usable Work",
      },
      ...prev,
    ]);
  };

  const handleSubmitRevision = () => {
    setPlanStatus("REVISION_REQUESTED");
    setShowRevisionModal(false);
    setAuditLog((prev) => [
      {
        timestamp: new Date().toLocaleTimeString("en-GB", { hour12: false }),
        action: `REVISION REQUESTED: ${revisionReason}`,
        user: "PROTOTYPE_PLANNER",
        notes: revisionComments || "Operating adjustment requested",
      },
      ...prev,
    ]);
  };

  const handleConfirmReject = () => {
    setPlanStatus("PLAN_REJECTED");
    setShowRejectModal(false);
    setAuditLog((prev) => [
      {
        timestamp: new Date().toLocaleTimeString("en-GB", { hour12: false }),
        action: "PLAN REJECTED by Divisional Operating Review",
        user: "PROTOTYPE_PLANNER",
      },
      ...prev,
    ]);
  };

  const handleCreateNewRevision = () => {
    const nextVer = `v1.${parseInt(planVersion.split(".")[1] || "0") + 1}`;
    setPlanVersion(nextVer);
    setPlanStatus("REVIEW_REQUIRED");
    setAuditLog((prev) => [
      {
        timestamp: new Date().toLocaleTimeString("en-GB", { hour12: false }),
        action: `Created new draft revision ${nextVer} for planner review`,
        user: "PROTOTYPE_PLANNER",
      },
      ...prev,
    ]);
  };

  const handleExportDemandCsv = () => {
    const dossier: PlanApprovalDossier = {
      planId: "RB-WK-2026-09-04",
      version: planVersion,
      section: "SEC-NDL",
      horizon: "Weekly",
      status: planStatus,
      approvedBy: "PROTOTYPE_PLANNER",
      blocksCount: MOCK_BLOCKS.length,
      integratedBlocksCount: 1,
      tasksCount: 14,
      criticalTasksCovered: 4,
      passengerConflicts: 0,
      freightConflicts: 0,
      checks: validation.checks,
      auditLog,
    };

    const csvContent = generateBlockDemandCsv(dossier, MOCK_BLOCKS);
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `RAILBLOCK_BLOCK_DEMAND_RB-WK-2026-09-04_${planVersion}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportPlanJson = () => {
    const data = {
      planId: "RB-WK-2026-09-04",
      version: planVersion,
      status: planStatus,
      section: "SEC-NDL",
      generatedAt: "2026-09-21T02:14:00Z",
      approvedBy: planStatus === "PLANNER_APPROVED" ? "PROTOTYPE_PLANNER" : null,
      selectedBlock,
      allBlocks: MOCK_BLOCKS,
      checks: validation.checks,
      auditLog,
      syntheticDisclosure: "PROTOTYPE SIMULATION DATA — NOT CONNECTED TO LIVE RAILWAY SYSTEMS",
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `RAILBLOCK_PLAN_SNAPSHOT_${planVersion}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] bg-[#070e1c] text-slate-100 overflow-hidden select-none">
      {/* 1. TOP OPERATIONAL DECISION HEADER */}
      <div className="flex-shrink-0 h-12 bg-[#0c1527] border-b border-[#182744] px-4 flex items-center justify-between text-xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <FileCheck className="w-4 h-4 text-emerald-400" />
            <span className="font-bold text-white tracking-wider font-mono">BLOCK PLAN DECISION</span>
          </div>
          <span className="text-slate-600">|</span>
          <span className="font-mono text-slate-300">Human-in-the-Loop Review & Block Demand Approval</span>
          <span className="text-slate-600">|</span>
          <span className="px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono text-[10px] font-bold">
            SYNTHETIC OPERATIONAL SCENARIO
          </span>
        </div>

        {/* Plan ID, Version & Current Status */}
        <div className="flex items-center gap-3 font-mono text-xs">
          <span className="text-slate-400">
            Plan ID: <span className="text-white font-bold">RB-WK-2026-09-04</span>
          </span>
          <span className="text-slate-400">
            Ver: <span className="text-sky-300 font-bold">{planVersion}</span>
          </span>
          <span
            className={cn(
              "px-2.5 py-0.5 rounded font-bold text-[10px] flex items-center gap-1",
              planStatus === "PLANNER_APPROVED"
                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                : planStatus === "REVISION_REQUESTED"
                ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                : planStatus === "PLAN_REJECTED"
                ? "bg-red-500/20 text-red-300 border border-red-500/40"
                : "bg-sky-500/20 text-sky-300 border border-sky-500/40"
            )}
          >
            {planStatus === "PLANNER_APPROVED" && <Lock className="w-3 h-3 text-emerald-400" />}
            {planStatus}
          </span>
        </div>
      </div>

      {/* 2. MAIN LAYOUT: LEFT PROPOSED BLOCKS (20%) + CENTER EVIDENCE & PREVIEW (52%) + RIGHT DECISION ACTIONS (28%) */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* LEFT: PROPOSED BLOCKS LIST */}
        <div className="w-full lg:w-64 flex-shrink-0 bg-[#091224] border-r border-[#182744] p-3.5 flex flex-col justify-between overflow-y-auto">
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#1b2b4d]">
              <span className="text-[11px] font-mono font-bold text-white uppercase tracking-wider">
                Proposed Block Demands
              </span>
              <span className="text-[10px] font-mono text-slate-400">{MOCK_BLOCKS.length} Blocks</span>
            </div>

            {/* Block Cards */}
            <div className="space-y-2">
              {MOCK_BLOCKS.map((blk) => (
                <div
                  key={blk.blockId}
                  onClick={() => setSelectedBlock(blk)}
                  className={cn(
                    "p-2.5 rounded-lg border text-xs cursor-pointer transition-all space-y-1.5",
                    selectedBlock.blockId === blk.blockId
                      ? "bg-sky-950/80 border-sky-400 shadow-md"
                      : "bg-[#060c18] border-[#14233e] hover:border-slate-500 text-slate-300"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-sky-300">{blk.blockId}</span>
                    <span
                      className={cn(
                        "px-1.5 py-0.2 rounded text-[9px] font-mono font-bold",
                        blk.isIntegrated
                          ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                          : "bg-slate-800 text-slate-400"
                      )}
                    >
                      {blk.isIntegrated ? "INTEGRATED" : "SINGLE DEPT"}
                    </span>
                  </div>
                  <div className="text-[11px] font-mono text-white">
                    KM {blk.kmStart}–{blk.kmEnd} ({blk.section})
                  </div>
                  <div className="flex justify-between text-[10px] font-mono text-slate-400">
                    <span>
                      {blk.startTime}–{blk.endTime} ({blk.durationMinutes}m)
                    </span>
                    <span className="text-amber-300 font-bold">{blk.departments.join("+")}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Handoff Notice */}
          <div className="p-2.5 bg-[#060c18] rounded-lg border border-[#14233e] text-[10px] font-mono space-y-1 text-slate-400">
            <span className="text-slate-300 font-bold block uppercase">Operational Handoff:</span>
            <div>Planner: <span className="text-emerald-400">Decision Maker</span></div>
            <div>Operating: <span className="text-sky-300">Coordinated Control</span></div>
            <div>BDMS: <span className="text-amber-300">Prototype Demand Ready</span></div>
          </div>
        </div>

        {/* CENTER: SELECTED BLOCK PREVIEW, VALIDATION CHECKS & OPERATIONAL EVIDENCE */}
        <div className="flex-1 flex flex-col bg-[#050b17] overflow-y-auto p-4 space-y-4">
          {/* Selected Block Specification Banner */}
          <div className="bg-[#091326] p-4 rounded-xl border border-[#162747] space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#182a4d]">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-mono font-bold">
                  {selectedBlock.blockId}
                </span>
                <h3 className="text-sm font-bold text-white font-mono">
                  Integrated Possession • {selectedBlock.section} (KM {selectedBlock.kmStart}–{selectedBlock.kmEnd})
                </h3>
              </div>
              <span className="text-xs font-mono text-amber-300">
                Window: {selectedBlock.startTime}–{selectedBlock.endTime} ({selectedBlock.durationMinutes} min)
              </span>
            </div>

            {/* Departmental Task Consolidation Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
              <div className="p-2.5 rounded bg-[#060c18] border border-[#14233e] space-y-1">
                <span className="text-[10px] text-amber-400 uppercase font-bold">Engineering (ENG):</span>
                <div className="text-white font-bold">3 Tasks Assigned</div>
                <p className="text-[10px] text-slate-400">Track tamping, USFD rail testing, weld packing</p>
              </div>
              <div className="p-2.5 rounded bg-[#060c18] border border-[#14233e] space-y-1">
                <span className="text-[10px] text-sky-400 uppercase font-bold">Signal & Telecom (S&T):</span>
                <div className="text-white font-bold">2 Tasks Assigned</div>
                <p className="text-[10px] text-slate-400">Digital axle counter & point machine overhaul</p>
              </div>
              <div className="p-2.5 rounded bg-[#060c18] border border-[#14233e] space-y-1">
                <span className="text-[10px] text-orange-400 uppercase font-bold">Traction (TRD):</span>
                <div className="text-white font-bold">2 Tasks (OHE Protected)</div>
                <p className="text-[10px] text-slate-400">Cantilever bracket & insulator wash, contact wire check</p>
              </div>
            </div>
          </div>

          {/* PRE-APPROVAL SAFETY & OPERATIONAL CHECKS */}
          <div className="bg-[#091326] p-4 rounded-xl border border-[#162747] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-emerald-400" />
                Pre-Approval Safety & Planning Gate Checks
              </span>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800/40">
                8/8 MANDATORY CHECKS PASSED
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 font-mono text-xs">
              {validation.checks.map((chk) => (
                <div
                  key={chk.id}
                  className="p-2.5 rounded-lg bg-[#060c18] border border-[#14233e] flex items-start gap-2"
                >
                  <div className="mt-0.5">
                    {chk.status === "PASSED" ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-red-400" />
                    )}
                  </div>
                  <div className="space-y-0.5">
                    <span className="font-bold text-slate-200 text-[11px]">{chk.label}</span>
                    <p className="text-[10px] text-slate-400 font-sans leading-tight">{chk.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Prototype Block Demand Document Preview */}
          <div className="bg-[#091326] rounded-xl border border-[#162747] overflow-hidden font-mono text-xs">
            <div className="px-4 py-2.5 bg-[#0c162b] border-b border-[#182744] flex items-center justify-between">
              <span className="text-xs font-bold text-white uppercase flex items-center gap-1.5">
                <FileSpreadsheet className="w-4 h-4 text-sky-400" />
                Prototype BDMS Block Demand Document Preview
              </span>
              <span className="text-[10px] text-slate-400">Formal Machine-Readable Specification</span>
            </div>

            <div className="p-3 overflow-x-auto">
              <table className="w-full text-left text-[11px]">
                <thead className="text-slate-400 border-b border-[#14233e] uppercase text-[9.5px]">
                  <tr>
                    <th className="py-1.5 px-2">Block ID</th>
                    <th className="py-1.5 px-2">Section</th>
                    <th className="py-1.5 px-2">KM Range</th>
                    <th className="py-1.5 px-2">Window</th>
                    <th className="py-1.5 px-2">Depts</th>
                    <th className="py-1.5 px-2">Tasks</th>
                    <th className="py-1.5 px-2">Protection</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#14233e] text-slate-200">
                  {MOCK_BLOCKS.map((b) => (
                    <tr key={b.blockId} className="hover:bg-[#0c1527]">
                      <td className="py-2 px-2 font-bold text-sky-300">{b.blockId}</td>
                      <td className="py-2 px-2">{b.section}</td>
                      <td className="py-2 px-2">
                        KM {b.kmStart}–{b.kmEnd}
                      </td>
                      <td className="py-2 px-2">
                        {b.startTime}–{b.endTime} ({b.durationMinutes}m)
                      </td>
                      <td className="py-2 px-2 text-amber-300">{b.departments.join("+")}</td>
                      <td className="py-2 px-2">{b.taskIds.length} Tasks</td>
                      <td className="py-2 px-2 text-emerald-300">{b.protectionType}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* RIGHT: PLANNER APPROVAL ACTIONS, AUDIT LOG & EXPORT (28%) */}
        <div className="w-full lg:w-88 flex-shrink-0 bg-[#081121] border-l border-[#182744] p-4 flex flex-col justify-between overflow-y-auto">
          <div className="space-y-4">
            {/* Approval Decision Card */}
            <div className="bg-[#0b152b] p-3.5 rounded-xl border border-[#182a4d] space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between pb-1.5 border-b border-[#182744]">
                <span className="font-bold text-white uppercase text-[11px] flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-sky-400" />
                  Planner Approval Action
                </span>
                <span className="text-[10px] text-slate-400">Human-in-the-Loop</span>
              </div>

              <div className="space-y-1.5 text-[11px] text-slate-300">
                <div className="flex justify-between">
                  <span className="text-slate-400">Plan Status:</span>
                  <span className="font-bold text-white">{planStatus}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Version:</span>
                  <span className="text-sky-300">{planVersion}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Safety Clearance:</span>
                  <span className="text-emerald-400 font-bold">100% Satisfied</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2 border-t border-[#182744]">
                {planStatus !== "PLANNER_APPROVED" ? (
                  <button
                    onClick={() => setShowApprovalModal(true)}
                    className="w-full py-2.5 px-3 bg-emerald-600 hover:bg-emerald-500 text-black font-mono font-bold text-xs rounded-lg flex items-center justify-center gap-2 shadow-lg transition-all"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>APPROVE BLOCK PLAN</span>
                  </button>
                ) : (
                  <div className="p-2.5 bg-emerald-950/40 border border-emerald-500/50 rounded-lg text-center text-emerald-300 text-xs font-bold flex items-center justify-center gap-2">
                    <Lock className="w-4 h-4 text-emerald-400" />
                    <span>PLAN LOCKED & APPROVED</span>
                  </div>
                )}

                {planStatus === "PLANNER_APPROVED" && (
                  <button
                    onClick={handleCreateNewRevision}
                    className="w-full py-2 px-3 bg-[#13223f] hover:bg-[#1a2d54] border border-[#23385e] text-sky-300 font-mono text-xs rounded-lg flex items-center justify-center gap-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>CREATE REVISION (Unlock)</span>
                  </button>
                )}

                {planStatus !== "PLANNER_APPROVED" && (
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setShowRevisionModal(true)}
                      className="py-1.5 px-2 bg-[#13223f] hover:bg-[#1a2d54] border border-[#23385e] text-amber-300 rounded text-center text-[11px]"
                    >
                      Request Revision
                    </button>
                    <button
                      onClick={() => setShowRejectModal(true)}
                      className="py-1.5 px-2 bg-red-950/30 hover:bg-red-950/50 border border-red-800/40 text-red-300 rounded text-center text-[11px]"
                    >
                      Reject Plan
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Block Demand Machine-Readable Export */}
            <div className="bg-[#091224] p-3.5 rounded-xl border border-[#162747] space-y-2.5 font-mono text-xs">
              <span className="font-bold text-white uppercase text-[11px] flex items-center gap-1.5">
                <Download className="w-3.5 h-3.5 text-sky-400" />
                Export Block Demand Artifacts
              </span>

              <div className="space-y-2">
                <button
                  onClick={handleExportDemandCsv}
                  className="w-full py-2 px-3 bg-sky-600 hover:bg-sky-500 text-black font-bold text-xs rounded flex items-center justify-center gap-1.5 shadow"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                  <span>EXPORT BLOCK DEMAND CSV</span>
                </button>
                <button
                  onClick={handleExportPlanJson}
                  className="w-full py-1.5 px-3 bg-[#13223f] hover:bg-[#1a2d54] border border-[#23385e] text-slate-300 text-xs rounded flex items-center justify-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export Full Plan JSON</span>
                </button>
              </div>
            </div>

            {/* Audit Trail Timeline */}
            <div className="space-y-1.5 font-mono text-[10px]">
              <span className="text-slate-400 uppercase font-bold">Immutable Audit Trail:</span>
              <div className="max-h-40 overflow-y-auto space-y-1.5 bg-[#060c18] p-2.5 rounded-lg border border-[#14233e]">
                {auditLog.map((log, idx) => (
                  <div key={idx} className="space-y-0.5 border-b border-[#111d33] pb-1 last:border-0 last:pb-0">
                    <div className="flex justify-between text-slate-400">
                      <span className="text-sky-400 font-bold">{log.timestamp}</span>
                      <span>{log.user}</span>
                    </div>
                    <div className="text-slate-200 leading-tight">{log.action}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Prototype Disclosure */}
          <div className="pt-3 border-t border-[#182744] text-[9.5px] font-mono text-slate-400 leading-tight">
            PROTOTYPE BLOCK DEMAND: Output formatted for future BDMS API ingestion. No live CRIS/TMS commands executed.
          </div>
        </div>
      </div>

      {/* MODAL: APPROVAL CONFIRMATION */}
      {showApprovalModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-[#0c162b] border border-[#1e345e] rounded-xl p-5 max-w-md w-full space-y-4 font-mono shadow-2xl animate-scaleUp">
            <div className="flex items-center gap-2 pb-2 border-b border-[#182744]">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <h3 className="font-bold text-white text-sm">Approve Block Plan RB-WK-2026-09-04?</h3>
            </div>
            <p className="text-xs text-slate-300 font-sans leading-relaxed">
              You are approving the integrated maintenance possession demand for the SEC–NDL corridor. This will lock version {planVersion} and generate the final machine-readable block demand export.
            </p>
            <div className="p-3 bg-[#060c18] rounded border border-[#14233e] text-xs space-y-1 text-slate-300">
              <div className="flex justify-between">
                <span>Total Possessions:</span>
                <span className="text-white font-bold">{MOCK_BLOCKS.length} Blocks</span>
              </div>
              <div className="flex justify-between">
                <span>Timetable Conflicts:</span>
                <span className="text-emerald-400 font-bold">0 Conflicts (All Protected)</span>
              </div>
              <div className="flex justify-between">
                <span>Critical Tasks Covered:</span>
                <span className="text-emerald-400 font-bold">100% Satisfied</span>
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowApprovalModal(false)}
                className="px-3 py-1.5 rounded bg-[#13223f] text-slate-300 text-xs hover:bg-[#1a2d54]"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmApproval}
                className="px-4 py-1.5 rounded bg-emerald-600 hover:bg-emerald-500 text-black font-bold text-xs shadow"
              >
                CONFIRM APPROVAL
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: REQUEST REVISION */}
      {showRevisionModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-[#0c162b] border border-[#1e345e] rounded-xl p-5 max-w-md w-full space-y-4 font-mono shadow-2xl">
            <div className="flex items-center gap-2 pb-2 border-b border-[#182744]">
              <RotateCcw className="w-5 h-5 text-amber-400" />
              <h3 className="font-bold text-white text-sm">Request Plan Revision</h3>
            </div>
            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Revision Reason:</label>
                <select
                  value={revisionReason}
                  onChange={(e) => setRevisionReason(e.target.value)}
                  className="w-full bg-[#060c18] border border-[#14233e] rounded p-2 text-slate-200"
                >
                  <option value="Operating constraint">Operating constraint / Train path change</option>
                  <option value="Insufficient work duration">Insufficient work duration for track machine</option>
                  <option value="Incorrect task grouping">Incorrect task grouping / spatial mismatch</option>
                  <option value="OHE earthing window adjustment">OHE earthing window adjustment</option>
                  <option value="Other">Other operational rationale</option>
                </select>
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Planner Comments & Guidance:</label>
                <textarea
                  value={revisionComments}
                  onChange={(e) => setRevisionComments(e.target.value)}
                  placeholder="Specify required window adjustments or task inclusions..."
                  className="w-full bg-[#060c18] border border-[#14233e] rounded p-2 text-slate-200 h-20"
                />
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowRevisionModal(false)}
                className="px-3 py-1.5 rounded bg-[#13223f] text-slate-300 text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitRevision}
                className="px-4 py-1.5 rounded bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs"
              >
                SUBMIT REVISION
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: REJECT PLAN */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-[#0c162b] border border-red-900/60 rounded-xl p-5 max-w-md w-full space-y-4 font-mono shadow-2xl">
            <div className="flex items-center gap-2 pb-2 border-b border-[#182744]">
              <XCircle className="w-5 h-5 text-red-400" />
              <h3 className="font-bold text-white text-sm">Reject Block Plan?</h3>
            </div>
            <p className="text-xs text-slate-300 font-sans leading-relaxed">
              Rejecting this plan will mark the entire weekly schedule as REJECTED. The planner will need to re-run optimization or request department resubmissions.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowRejectModal(false)}
                className="px-3 py-1.5 rounded bg-[#13223f] text-slate-300 text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReject}
                className="px-4 py-1.5 rounded bg-red-600 hover:bg-red-500 text-white font-bold text-xs"
              >
                CONFIRM REJECTION
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
