"use client";

import React from "react";
import { Plus, Sparkles, Layers, RefreshCw, Database } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface WorkRegisterHeaderProps {
  totalCount: number;
  criticalCount: number;
  overdueCount: number;
  coordinationCandidatesCount: number;
  onAddWork: () => void;
  onPrioritize: () => void;
  onFindCoordination: () => void;
}

export function WorkRegisterHeader({
  totalCount = 18,
  criticalCount = 3,
  overdueCount = 7,
  coordinationCandidatesCount = 7,
  onAddWork,
  onPrioritize,
  onFindCoordination,
}: WorkRegisterHeaderProps) {
  return (
    <div className="space-y-4 pb-4 border-b border-slate-200">
      {/* Top Header Row */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 font-mono">
              WORK REGISTER
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-900 border border-blue-200 text-xs font-mono font-bold">
              SEC (KM 40) → NDL (KM 120) · 80 km
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
            <span className="font-semibold text-slate-800">Maintenance demand across the corridor.</span> Review, prioritize and coordinate work before it enters block planning.
          </p>
        </div>

        {/* Right Side: Data Status + Action Buttons */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 shrink-0">
          {/* Synthetic Data Stamp */}
          <div className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-[10.5px] font-mono text-slate-500 shadow-2xs space-y-0.5">
            <div className="flex items-center gap-1.5 font-bold text-slate-700">
              <Database className="w-3 h-3 text-blue-700" />
              <span>DATA STATUS: DEMO DATASET</span>
            </div>
            <div className="text-[9.5px] text-slate-400">
              Last sync 18 Sep 2026 · 18:42 IST
            </div>
          </div>

          {/* Workstation Actions */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="md"
              onClick={onPrioritize}
              icon={<Sparkles className="w-3.5 h-3.5 text-blue-700" />}
            >
              Prioritize Demand
            </Button>

            <Button
              variant="secondary"
              size="md"
              onClick={onFindCoordination}
              icon={<Layers className="w-3.5 h-3.5 text-slate-700" />}
            >
              Find Coordination
            </Button>

            <Button
              variant="primary"
              size="md"
              onClick={onAddWork}
              icon={<Plus className="w-4 h-4" />}
            >
              + Add Work
            </Button>
          </div>
        </div>
      </div>

      {/* Operational Summary Strip (Compact Horizontal Statistics) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
        {/* Total Open Demands */}
        <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs flex items-center justify-between">
          <div>
            <div className="text-2xl font-extrabold text-slate-900">{totalCount}</div>
            <div className="text-[10px] uppercase font-bold text-slate-500 mt-0.5">
              Open Demands
            </div>
          </div>
          <span className="w-2.5 h-2.5 rounded-full bg-slate-400" />
        </div>

        {/* P1 Critical Tasks */}
        <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs flex items-center justify-between">
          <div>
            <div className="text-2xl font-extrabold text-red-700">{criticalCount}</div>
            <div className="text-[10px] uppercase font-bold text-slate-500 mt-0.5">
              P1 Critical
            </div>
          </div>
          <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
        </div>

        {/* Overdue Work */}
        <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs flex items-center justify-between">
          <div>
            <div className="text-2xl font-extrabold text-amber-700">{overdueCount}</div>
            <div className="text-[10px] uppercase font-bold text-slate-500 mt-0.5">
              Overdue
            </div>
          </div>
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
        </div>

        {/* Coordination Candidates */}
        <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs flex items-center justify-between">
          <div>
            <div className="text-2xl font-extrabold text-blue-900">{coordinationCandidatesCount}</div>
            <div className="text-[10px] uppercase font-bold text-slate-500 mt-0.5">
              Coordination Candidates
            </div>
          </div>
          <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
        </div>
      </div>
    </div>
  );
}
