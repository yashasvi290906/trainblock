"use client";

import React, { useState } from "react";
import {
  Clock,
  MapPin,
  TrainTrack,
  AlertTriangle,
  CheckCircle2,
  Layers,
  ChevronLeft,
  ChevronRight,
  MoveHorizontal,
  Info,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { timeStringToMinutes, minutesToTimeString } from "@/lib/calculations";

interface PlanningTimelineProps {
  blockStartTime: string;
  blockEndTime: string;
  blockDurationMins: number;
  blockKmStart?: number;
  blockKmEnd?: number;
  onShiftTime?: (deltaMinutes: number) => void;
  hasConflict?: boolean;
  conflictDetails?: {
    trainName: string;
    serviceNumber: string;
    expectedTime: string;
  } | null;
  selectedTrainId?: string | null;
  onSelectTrain?: (trainId: string | null) => void;
}

const STATIONS = [
  { code: "SEC", name: "Secunderabad", km: 40 },
  { code: "LBN", name: "Labanya Nagar", km: 58 },
  { code: "WL", name: "Warangal", km: 68 },
  { code: "KCG", name: "Kacheguda", km: 76 },
  { code: "NDKD", name: "Nadikude", km: 94 },
  { code: "NDL", name: "Nandyal", km: 120 },
];

const TIME_MARKS = [
  "02:00",
  "02:30",
  "03:00",
  "03:30",
  "04:00",
  "04:30",
  "05:00",
  "05:30",
];

export function PlanningTimeline({
  blockStartTime = "02:20",
  blockEndTime = "04:10",
  blockDurationMins = 110,
  blockKmStart = 68,
  blockKmEnd = 94,
  onShiftTime,
  hasConflict = false,
  conflictDetails,
  selectedTrainId,
  onSelectTrain,
}: PlanningTimelineProps) {
  const windowStartMins = 120; // 02:00
  const windowEndMins = 330; // 05:30
  const totalWindowMins = windowEndMins - windowStartMins; // 210 mins

  const getLeftPercent = (timeStr: string) => {
    const mins = timeStringToMinutes(timeStr);
    return Math.max(0, Math.min(100, ((mins - windowStartMins) / totalWindowMins) * 100));
  };

  const getWidthPercent = (durationMins: number) => {
    return Math.max(0, Math.min(100, (durationMins / totalWindowMins) * 100));
  };

  const currentBlockStartMins = timeStringToMinutes(blockStartTime);
  const blockLeftPercent = ((currentBlockStartMins - windowStartMins) / totalWindowMins) * 100;
  const blockWidthPercent = (blockDurationMins / totalWindowMins) * 100;

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 p-4 sm:p-5 shadow-xs space-y-4">
      {/* Header Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-900 flex items-center justify-center font-bold">
            <TrainTrack className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <span>OPERATIONAL PLANNING CANVAS</span>
              <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                02:00 – 05:30 IST
              </span>
            </h3>
            <p className="text-xs text-slate-500">
              Timetable train movements vs. integrated possession window
            </p>
          </div>
        </div>

        {/* Shift Window Action Buttons */}
        <div className="flex items-center gap-1.5 font-mono text-xs">
          <span className="text-slate-500 text-[11px] font-medium mr-1 hidden sm:inline">
            Adjust Block Slot:
          </span>
          <button
            onClick={() => onShiftTime && onShiftTime(-30)}
            className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded border border-slate-300 text-xs transition-colors"
            title="Shift window 30 minutes earlier"
          >
            -30m
          </button>
          <button
            onClick={() => onShiftTime && onShiftTime(-10)}
            className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded border border-slate-300 text-xs transition-colors"
            title="Shift window 10 minutes earlier"
          >
            -10m
          </button>
          <span
            className={cn(
              "px-2.5 py-1 rounded font-bold border text-xs",
              hasConflict
                ? "bg-red-50 text-red-800 border-red-300"
                : "bg-blue-50 text-blue-900 border-blue-200"
            )}
          >
            {blockStartTime}–{blockEndTime}
          </span>
          <button
            onClick={() => onShiftTime && onShiftTime(10)}
            className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded border border-slate-300 text-xs transition-colors"
            title="Shift window 10 minutes later"
          >
            +10m
          </button>
          <button
            onClick={() => onShiftTime && onShiftTime(30)}
            className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded border border-slate-300 text-xs transition-colors"
            title="Shift window 30 minutes later"
          >
            +30m
          </button>
        </div>
      </div>

      {/* Dynamic Conflict Alert Notice */}
      {hasConflict && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center justify-between text-xs animate-fadeIn">
          <div className="flex items-center gap-2.5 text-red-900">
            <AlertTriangle className="w-5 h-5 text-red-600 shrink-0" />
            <div>
              <strong className="font-mono text-red-900">
                TIMETABLE INTERSECTION: {conflictDetails?.trainName || "Passenger Train"} ({conflictDetails?.serviceNumber || "12723"})
              </strong>
              <p className="text-red-700 text-[11px] mt-0.5">
                Proposed possession window intersects scheduled train trajectory at {conflictDetails?.expectedTime || "02:35"}. Shift window to return to conflict-free zone.
              </p>
            </div>
          </div>
          {onShiftTime && (
            <button
              onClick={() => onShiftTime(30)}
              className="px-3 py-1.5 bg-red-700 hover:bg-red-800 text-white rounded font-mono font-bold text-xs shrink-0 transition-colors cursor-pointer"
            >
              Resolve Conflict →
            </button>
          )}
        </div>
      )}

      {/* Track & Timetable SVG Diagram Canvas */}
      <div className="bg-slate-900 rounded-xl p-4 sm:p-5 text-white relative overflow-x-auto shadow-inner">
        {/* Top Time Scale Axis */}
        <div className="flex justify-between text-[11px] font-mono text-slate-400 border-b border-slate-800 pb-2 mb-4">
          {TIME_MARKS.map((t) => (
            <div key={t} className="flex flex-col items-center">
              <span>{t}</span>
              <span className="h-1.5 w-px bg-slate-700 mt-1" />
            </div>
          ))}
        </div>

        {/* Corridor Station Lines & Tracks */}
        <div className="space-y-4 relative">
          {/* Station Rows with Track Bars */}
          {STATIONS.map((station, sIdx) => {
            const isWLtoNDKD = station.code === "WL";

            return (
              <div key={station.code} className="relative flex items-center h-12">
                {/* Station Code & KM Marker */}
                <div className="w-24 sm:w-28 shrink-0 font-mono pr-2">
                  <div className="flex items-center gap-1.5 text-xs font-extrabold text-slate-200">
                    <span className="w-2 h-2 rounded-full bg-slate-400" />
                    <span>{station.code}</span>
                  </div>
                  <div className="text-[10px] text-slate-400">
                    KM {station.km}
                  </div>
                </div>

                {/* Track Line Canvas */}
                <div className="flex-1 relative h-full flex items-center">
                  {/* Background Track Line */}
                  <div className="absolute inset-x-0 h-1 bg-slate-800 rounded-full" />
                  <div className="absolute inset-x-0 h-0.5 border-t border-dashed border-slate-700/60" />

                  {/* Section 0: SEC (KM 0) - Vande Bharat departure */}
                  {sIdx === 0 && (
                    <div
                      onClick={() => onSelectTrain && onSelectTrain("TRN-20833")}
                      className={cn(
                        "absolute z-10 px-2.5 py-1 rounded bg-sky-950/90 border border-sky-400 text-sky-300 text-[10px] font-mono font-bold flex items-center gap-1.5 cursor-pointer shadow-sm hover:scale-105 transition-transform",
                        selectedTrainId === "TRN-20833" ? "ring-2 ring-sky-300" : ""
                      )}
                      style={{ left: `${getLeftPercent("02:00")}%` }}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                      <span>20833 Vande Bharat (02:00)</span>
                    </div>
                  )}

                  {/* Section 1: KZJ (KM 32) - Rajdhani pass */}
                  {sIdx === 1 && (
                    <div
                      onClick={() => onSelectTrain && onSelectTrain("TRN-12723")}
                      className={cn(
                        "absolute z-10 px-2.5 py-1 rounded bg-rose-950/90 border border-rose-400 text-rose-300 text-[10px] font-mono font-bold flex items-center gap-1.5 cursor-pointer shadow-sm hover:scale-105 transition-transform",
                        selectedTrainId === "TRN-12723" ? "ring-2 ring-rose-300" : ""
                      )}
                      style={{ left: `${getLeftPercent("02:35")}%` }}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                      <span>12723 Rajdhani (02:35)</span>
                    </div>
                  )}

                  {/* Section 2: WL (KM 68) - PROPOSED BLOCK B-014 OCCUPATION */}
                  {isWLtoNDKD && (
                    <>
                      {/* Amrit Bharat pass marker */}
                      <div
                        onClick={() => onSelectTrain && onSelectTrain("TRN-12076")}
                        className={cn(
                          "absolute z-10 px-2 py-0.5 rounded bg-amber-950/90 border border-amber-400 text-amber-300 text-[9.5px] font-mono font-bold flex items-center gap-1 cursor-pointer shadow-sm",
                          selectedTrainId === "TRN-12076" ? "ring-2 ring-amber-300" : ""
                        )}
                        style={{ left: `${getLeftPercent("03:42")}%`, top: "2px" }}
                      >
                        <span>12076 Amrit Bharat (03:42)</span>
                      </div>

                      {/* The Integrated Possession Block Rectangle */}
                      <div
                        className={cn(
                          "absolute h-9 rounded-lg flex items-center justify-between px-3 z-20 transition-all shadow-lg border",
                          hasConflict
                            ? "bg-red-600/40 border-red-500 text-red-200 ring-2 ring-red-400 animate-pulse"
                            : "bg-blue-600/35 border-amber-400 ring-2 ring-amber-400/60 text-amber-100"
                        )}
                        style={{
                          left: `${Math.max(0, Math.min(85, blockLeftPercent))}%`,
                          width: `${Math.max(10, Math.min(100, blockWidthPercent))}%`,
                          top: "6px",
                        }}
                      >
                        <div className="flex items-center gap-1.5 text-[11px] font-mono font-extrabold truncate">
                          <Layers className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                          <span>B-014 · KM 68–94 (ENG + S&T + TRC)</span>
                        </div>
                        <span className="text-[10px] font-mono bg-black/70 px-1.5 py-0.5 rounded text-amber-200 font-bold shrink-0 ml-2">
                          {blockStartTime}–{blockEndTime}
                        </span>
                      </div>
                    </>
                  )}

                  {/* Section 3: NDKD (KM 101) - Shatabdi pass */}
                  {sIdx === 3 && (
                    <div
                      onClick={() => onSelectTrain && onSelectTrain("TRN-12951")}
                      className={cn(
                        "absolute z-10 px-2.5 py-1 rounded bg-purple-950/90 border border-purple-400 text-purple-300 text-[10px] font-mono font-bold flex items-center gap-1.5 cursor-pointer shadow-sm hover:scale-105 transition-transform",
                        selectedTrainId === "TRN-12951" ? "ring-2 ring-purple-300" : ""
                      )}
                      style={{ left: `${getLeftPercent("03:50")}%` }}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                      <span>12951 Shatabdi UP (03:50)</span>
                    </div>
                  )}

                  {/* Section 4: NDL (KM 128) - Freight Forecast path */}
                  {sIdx === 4 && (
                    <div
                      onClick={() => onSelectTrain && onSelectTrain("TRN-G4217")}
                      className={cn(
                        "absolute z-10 px-2.5 py-1 rounded bg-emerald-950/90 border border-emerald-500 border-dashed text-emerald-300 text-[10px] font-mono font-bold flex items-center gap-1.5 cursor-pointer shadow-sm hover:scale-105 transition-transform",
                        selectedTrainId === "TRN-G4217" ? "ring-2 ring-emerald-300" : ""
                      )}
                      style={{ left: `${getLeftPercent("04:40")}%` }}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      <span>G/4217 Container Freight (04:40)</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Legend */}
        <div className="mt-4 pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between text-[11px] font-mono text-slate-400 gap-3">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-amber-400/30 border border-amber-400" />
              <span>Proposed Integrated Possession (B-014)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-400" />
              <span>Protected Passenger Movements</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 border border-dashed border-emerald-300" />
              <span>Goods Forecast Path (Trailing)</span>
            </div>
          </div>

          <div className="text-slate-400">
            Click any train or possession to inspect impact
          </div>
        </div>
      </div>
    </div>
  );
}
