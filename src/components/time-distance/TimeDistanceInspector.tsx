"use client";

import React from "react";
import {
  TimeDistanceTrain,
  BlockPossession,
  ConflictPoint,
  CandidateWindow,
} from "./types";
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Layers,
  MapPin,
  Shield,
  Train,
  Wrench,
  Zap,
  ArrowRight,
  Info,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface TimeDistanceInspectorProps {
  selectedType: "TRAIN" | "BLOCK" | "CONFLICT" | "STATION" | "CANDIDATE" | null;
  selectedData: any;
  onApplyCandidate?: (w: CandidateWindow) => void;
  onReplanToFeasible?: () => void;
}

export function TimeDistanceInspector({
  selectedType,
  selectedData,
  onApplyCandidate,
  onReplanToFeasible,
}: TimeDistanceInspectorProps) {
  if (!selectedType || !selectedData) {
    return (
      <div className="bg-white dark:bg-[#091326] border border-slate-200 dark:border-[#162744] rounded-xl p-6 text-center space-y-3 select-none transition-colors">
        <Activity className="w-8 h-8 text-slate-400 dark:text-slate-600 mx-auto" />
        <h4 className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300 uppercase">
          INSPECTOR DOSSIER
        </h4>
        <p className="text-xs text-slate-500 max-w-xs mx-auto">
          Click any train trajectory, maintenance possession box, station marker, or conflict icon on the chart to inspect operational details.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-[#091326] border border-slate-200 dark:border-[#162744] rounded-xl p-4 space-y-3.5 select-none font-mono text-xs shadow-sm transition-colors">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-[#182a4d]">
        <div className="flex items-center gap-2">
          {selectedType === "TRAIN" && <Train className="w-4 h-4 text-sky-600 dark:text-sky-400" />}
          {selectedType === "BLOCK" && <Wrench className="w-4 h-4 text-amber-600 dark:text-amber-400" />}
          {selectedType === "CONFLICT" && <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400" />}
          {selectedType === "STATION" && <MapPin className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />}
          {selectedType === "CANDIDATE" && <Layers className="w-4 h-4 text-sky-600 dark:text-sky-400" />}
          <h3 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            {selectedType} DOSSIER
          </h3>
        </div>
        <span className="text-[10px] bg-slate-100 dark:bg-[#060c18] px-2 py-0.5 rounded border border-slate-200 dark:border-[#152544] text-slate-700 dark:text-slate-300">
          INSPECTION
        </span>
      </div>

      {/* 1. TRAIN INSPECTION */}
      {selectedType === "TRAIN" && (
        <div className="space-y-3">
          <div className="bg-slate-50 dark:bg-[#060c18] p-3 rounded-lg border border-slate-200 dark:border-[#14233e] space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 dark:text-white text-sm">
                {(selectedData as TimeDistanceTrain).name}
              </span>
              <span
                className="px-2 py-0.5 rounded text-[10px] font-bold"
                style={{
                  backgroundColor: `${(selectedData as TimeDistanceTrain).color}25`,
                  color: (selectedData as TimeDistanceTrain).color,
                  border: `1px solid ${(selectedData as TimeDistanceTrain).color}50`,
                }}
              >
                {(selectedData as TimeDistanceTrain).priority}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-slate-700 dark:text-slate-300 text-[11px] pt-1 border-t border-slate-200 dark:border-[#122038]">
              <div>
                <span className="text-slate-400 dark:text-slate-500 block">Service:</span>
                <span className="text-slate-900 dark:text-white font-medium">{(selectedData as TimeDistanceTrain).serviceNumber}</span>
              </div>
              <div>
                <span className="text-slate-400 dark:text-slate-500 block">Direction:</span>
                <span className="text-sky-600 dark:text-sky-300 font-medium">{(selectedData as TimeDistanceTrain).direction}</span>
              </div>
              <div>
                <span className="text-slate-400 dark:text-slate-500 block">Corridor Path:</span>
                <span className="text-slate-900 dark:text-white font-medium">SEC → NDL</span>
              </div>
              <div>
                <span className="text-slate-400 dark:text-slate-500 block">Status:</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">PROTECTED PATH</span>
              </div>
            </div>
          </div>

          <div className="p-2.5 rounded bg-sky-50 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-800/40 text-[11px] text-slate-700 dark:text-slate-300 font-sans leading-relaxed">
            <span className="font-bold text-sky-700 dark:text-sky-300 font-mono block mb-0.5">
              Corridor Protection Rules:
            </span>
            High-speed passenger services carry highest corridor priority. Maintenance possessions must maintain a 10-minute clear headway buffer.
          </div>
        </div>
      )}

      {/* 2. BLOCK INSPECTION */}
      {selectedType === "BLOCK" && (
        <div className="space-y-3">
          <div className="bg-slate-50 dark:bg-[#060c18] p-3 rounded-lg border border-slate-200 dark:border-[#14233e] space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-amber-700 dark:text-amber-300 text-sm">
                {(selectedData as BlockPossession).id} · POSSESSION
              </span>
              <span className="px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950/70 border border-amber-300 dark:border-amber-800/60 text-amber-800 dark:text-amber-300 text-[10px] font-bold">
                {(selectedData as BlockPossession).durationMin} MIN
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-slate-700 dark:text-slate-300 text-[11px] pt-1 border-t border-slate-200 dark:border-[#122038]">
              <div>
                <span className="text-slate-400 dark:text-slate-500 block">Window:</span>
                <span className="text-slate-900 dark:text-white font-bold">
                  {(selectedData as BlockPossession).startTime}–{(selectedData as BlockPossession).endTime}
                </span>
              </div>
              <div>
                <span className="text-slate-400 dark:text-slate-500 block">Section:</span>
                <span className="text-slate-900 dark:text-white font-bold">
                  KM {(selectedData as BlockPossession).startKm}–{(selectedData as BlockPossession).endKm}
                </span>
              </div>
              <div>
                <span className="text-slate-400 dark:text-slate-500 block">Usable Work:</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                  {(selectedData as BlockPossession).usableMin} min
                </span>
              </div>
              <div>
                <span className="text-slate-400 dark:text-slate-500 block">Departments:</span>
                <span className="text-sky-600 dark:text-sky-300">ENG + S&T + TRD</span>
              </div>
            </div>
          </div>

          <div className="p-2.5 rounded bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40 text-[11px] text-slate-700 dark:text-slate-300 font-sans leading-relaxed">
            <span className="font-bold text-amber-700 dark:text-amber-300 font-mono block mb-0.5">
              Multi-Departmental Coordination:
            </span>
            Consolidates 18 maintenance tasks across 3 departments into a single physical shadow possession, preserving 90 minutes of active track availability.
          </div>
        </div>
      )}

      {/* 3. CONFLICT INSPECTION */}
      {selectedType === "CONFLICT" && (
        <div className="space-y-3">
          <div className="bg-rose-50 dark:bg-red-950/30 p-3 rounded-lg border border-rose-200 dark:border-red-800/60 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-rose-700 dark:text-red-300 text-sm">
                TIMETABLE INTERSECTION
              </span>
              <span className="px-2 py-0.5 rounded bg-rose-600 dark:bg-red-900 border border-rose-500 dark:border-red-700 text-white text-[10px] font-bold">
                CONFLICT
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-slate-700 dark:text-slate-300 text-[11px] pt-1 border-t border-rose-200 dark:border-red-900/50">
              <div>
                <span className="text-slate-500 block">Conflicting Train:</span>
                <span className="text-slate-900 dark:text-white font-bold">
                  {(selectedData as ConflictPoint).trainName}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block">Intersection Time:</span>
                <span className="text-rose-600 dark:text-red-400 font-bold">
                  {(selectedData as ConflictPoint).timeStr}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block">Location:</span>
                <span className="text-slate-900 dark:text-white">
                  KM {(selectedData as ConflictPoint).km}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block">Required Action:</span>
                <span className="text-amber-700 dark:text-amber-300 font-bold">REPLAN WINDOW</span>
              </div>
            </div>
          </div>

          {onReplanToFeasible && (
            <button
              onClick={onReplanToFeasible}
              className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white dark:text-black rounded-lg font-bold text-xs font-mono transition-all flex items-center justify-center gap-2 shadow active:scale-95"
            >
              <span>REPLAN TO SAFE WINDOW (04:20–06:10)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}

      {/* 4. STATION INSPECTION */}
      {selectedType === "STATION" && (
        <div className="space-y-3">
          <div className="bg-slate-50 dark:bg-[#060c18] p-3 rounded-lg border border-slate-200 dark:border-[#14233e] space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 dark:text-white text-sm">
                {selectedData.name} ({selectedData.code})
              </span>
              <span className="px-2 py-0.5 rounded bg-sky-100 dark:bg-sky-950 text-sky-800 dark:text-sky-300 border border-sky-300 dark:border-sky-800 text-[10px] font-bold">
                KM {selectedData.km}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-slate-700 dark:text-slate-300 text-[11px] pt-1 border-t border-slate-200 dark:border-[#122038]">
              <div>
                <span className="text-slate-400 dark:text-slate-500 block">Corridor Section:</span>
                <span className="text-slate-900 dark:text-white">SEC–NDL Mainline</span>
              </div>
              <div>
                <span className="text-slate-400 dark:text-slate-500 block">Dwell Profile:</span>
                <span className="text-sky-700 dark:text-sky-300 font-semibold">2–4 Min Scheduled</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. CANDIDATE INSPECTION */}
      {selectedType === "CANDIDATE" && (
        <div className="space-y-3">
          <div className="bg-slate-50 dark:bg-[#060c18] p-3 rounded-lg border border-slate-200 dark:border-[#14233e] space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 dark:text-white text-sm">
                {(selectedData as CandidateWindow).name}
              </span>
              <span className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 text-[10px] font-bold">
                {(selectedData as CandidateWindow).status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-slate-700 dark:text-slate-300 text-[11px] pt-1 border-t border-slate-200 dark:border-[#122038]">
              <div>
                <span className="text-slate-400 dark:text-slate-500 block">Time Span:</span>
                <span className="text-slate-900 dark:text-white font-bold">
                  {(selectedData as CandidateWindow).startTime}–{(selectedData as CandidateWindow).endTime}
                </span>
              </div>
              <div>
                <span className="text-slate-400 dark:text-slate-500 block">Usable Work:</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                  {(selectedData as CandidateWindow).usableMin} min
                </span>
              </div>
            </div>
          </div>

          {onApplyCandidate && (
            <button
              onClick={() => onApplyCandidate(selectedData as CandidateWindow)}
              className="w-full py-2 bg-sky-600 hover:bg-sky-500 text-white dark:text-black rounded-lg font-bold text-xs font-mono transition-all flex items-center justify-center gap-2 shadow active:scale-95"
            >
              <span>APPLY THIS WINDOW TO CHART</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
