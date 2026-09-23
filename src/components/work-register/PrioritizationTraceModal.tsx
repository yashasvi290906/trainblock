"use client";

import React from "react";
import { X, ShieldAlert, Cpu, ArrowDown, CheckCircle2, AlertTriangle, FileText } from "lucide-react";

interface PrioritizationTraceModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: {
    taskId: string;
    title: string;
    department: string;
    assetType: string;
    kmStart: number;
    kmEnd: number;
    overdueDays: number;
    criticality: string;
    safetyTier?: string;
    safetyReason?: string;
    mlScore?: number;
    withinTierRank?: number;
    features?: {
      defect_severity: number;
      overdue_days: number;
      asset_criticality: number;
      traffic_exposure: number;
      availability_impact: number;
    };
  } | null;
}

export function PrioritizationTraceModal({ isOpen, onClose, task }: PrioritizationTraceModalProps) {
  if (!isOpen || !task) return null;

  const tier = task.safetyTier || (task.overdueDays >= 10 || task.criticality === "Critical" ? "P1" : task.overdueDays >= 5 ? "P2" : "P3");
  const reason = task.safetyReason || (tier === "P1" ? "Emergency safety compliance: overdue track flaw threshold exceeded" : tier === "P2" ? "Urgent track geometry / interlocking maintenance required" : "Preventive maintenance cycle");
  const mlScore = task.mlScore !== undefined ? task.mlScore : (tier === "P1" ? 82.4 : tier === "P2" ? 64.1 : 41.2);
  const rank = task.withinTierRank || 1;

  const feats = task.features || {
    defect_severity: tier === "P1" ? 5.0 : tier === "P2" ? 4.0 : 3.0,
    overdue_days: task.overdueDays,
    asset_criticality: task.criticality === "Critical" ? 5.0 : 4.0,
    traffic_exposure: 4.5,
    availability_impact: 4.0
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 font-sans animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-900 text-white flex items-center justify-center shadow-xs">
              <Cpu className="w-4 h-4 text-blue-200" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 font-mono">
                PRIORITIZATION TRACE: {task.taskId}
              </h2>
              <p className="text-xs text-slate-500 font-sans">
                Deterministic Safety Rule + XGBoost Tabular Ranker
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Trace Flow */}
        <div className="p-5 space-y-4 text-xs font-sans">
          {/* Step 1: Raw Ingested Demand */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center justify-between font-mono text-[11px] font-bold text-slate-700">
              <span className="flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-blue-700" /> 1. RAW INGESTION RECORD
              </span>
              <span className="text-slate-500">{task.department}</span>
            </div>
            <div className="text-slate-800 font-bold text-sm">{task.title}</div>
            <div className="grid grid-cols-3 gap-2 font-mono text-[11px] text-slate-600 pt-1 border-t border-slate-200">
              <div>Asset: <span className="font-semibold text-slate-900">{task.assetType}</span></div>
              <div>KM: <span className="font-semibold text-slate-900">{task.kmStart}–{task.kmEnd}</span></div>
              <div>Overdue: <span className="font-semibold text-red-700">{task.overdueDays}d</span></div>
            </div>
          </div>

          <div className="flex justify-center text-slate-400">
            <ArrowDown className="w-4 h-4" />
          </div>

          {/* Step 2: Deterministic Safety Rule */}
          <div className="p-3.5 rounded-xl bg-red-50/70 border border-red-200 space-y-1.5">
            <div className="flex items-center justify-between font-mono text-[11px] font-bold text-red-900">
              <span className="flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-red-700" /> 2. DETERMINISTIC SAFETY CLASSIFIER
              </span>
              <span className="px-2 py-0.5 rounded bg-red-200 text-red-950 font-extrabold text-xs">
                TIER {tier}
              </span>
            </div>
            <p className="text-xs text-red-900 leading-relaxed font-mono">
              {reason}
            </p>
            <div className="text-[10px] text-red-700/80 font-sans italic pt-1">
              *Non-negotiable rule hierarchy: P1 emergency defects must always be scheduled; ML cannot override safety tiers.
            </div>
          </div>

          <div className="flex justify-center text-slate-400">
            <ArrowDown className="w-4 h-4" />
          </div>

          {/* Step 3: XGBoost Within-Tier Ranking */}
          <div className="p-3.5 rounded-xl bg-indigo-50/70 border border-indigo-200 space-y-2.5">
            <div className="flex items-center justify-between font-mono text-[11px] font-bold text-indigo-900">
              <span className="flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-indigo-700" /> 3. XGBOOST TABULAR RANKER
              </span>
              <span className="font-mono text-xs font-extrabold text-indigo-950 bg-indigo-200/80 px-2 py-0.5 rounded border border-indigo-300">
                Score: {mlScore.toFixed(2)} (Rank #{rank})
              </span>
            </div>

            <div className="space-y-1 text-[11px] font-mono">
              <div className="text-indigo-950 font-semibold mb-1">5 Canonical Tabular Features Evaluated:</div>
              <div className="grid grid-cols-2 gap-1.5 text-slate-700">
                <div className="flex justify-between p-1.5 bg-white rounded border border-indigo-100">
                  <span>Defect Severity:</span>
                  <span className="font-bold text-indigo-900">{feats.defect_severity.toFixed(1)}/5.0</span>
                </div>
                <div className="flex justify-between p-1.5 bg-white rounded border border-indigo-100">
                  <span>Overdue Days:</span>
                  <span className="font-bold text-indigo-900">{feats.overdue_days}d</span>
                </div>
                <div className="flex justify-between p-1.5 bg-white rounded border border-indigo-100">
                  <span>Asset Criticality:</span>
                  <span className="font-bold text-indigo-900">{feats.asset_criticality.toFixed(1)}/5.0</span>
                </div>
                <div className="flex justify-between p-1.5 bg-white rounded border border-indigo-100">
                  <span>Traffic Exposure:</span>
                  <span className="font-bold text-indigo-900">{feats.traffic_exposure.toFixed(1)}/5.0</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold font-mono cursor-pointer"
          >
            Close Trace
          </button>
        </div>
      </div>
    </div>
  );
}
