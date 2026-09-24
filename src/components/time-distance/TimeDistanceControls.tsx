"use client";

import React from "react";
import {
  Clock,
  RotateCcw,
  RefreshCw,
  Eye,
  Layers,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Play,
  Pause,
  Sliders,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface TimeDistanceControlsProps {
  showPassenger: boolean;
  setShowPassenger: (v: boolean) => void;
  showFreight: boolean;
  setShowFreight: (v: boolean) => void;
  showForecast: boolean;
  setShowForecast: (v: boolean) => void;
  showBlock: boolean;
  setShowBlock: (v: boolean) => void;
  showConflicts: boolean;
  setShowConflicts: (v: boolean) => void;
  showSafeWindow: boolean;
  setShowSafeWindow: (v: boolean) => void;
  timeShiftMinutes: number;
  onShiftTime: (deltaMinutes: number) => void;
  onResetTime: () => void;
  onReplanWindow: () => void;
  isReplanned: boolean;
  currentTimeMins: number;
  onCurrentTimeChange: (mins: number) => void;
  isPlaying: boolean;
  onTogglePlay: () => void;
  activeStartTime: string;
  activeEndTime: string;
}

export function TimeDistanceControls({
  showPassenger,
  setShowPassenger,
  showFreight,
  setShowFreight,
  showForecast,
  setShowForecast,
  showBlock,
  setShowBlock,
  showConflicts,
  setShowConflicts,
  showSafeWindow,
  setShowSafeWindow,
  timeShiftMinutes,
  onShiftTime,
  onResetTime,
  onReplanWindow,
  isReplanned,
  currentTimeMins,
  onCurrentTimeChange,
  isPlaying,
  onTogglePlay,
  activeStartTime,
  activeEndTime,
}: TimeDistanceControlsProps) {
  const currentHours = Math.floor(currentTimeMins / 60);
  const currentMinutes = currentTimeMins % 60;
  const currentTimeString = `${currentHours.toString().padStart(2, "0")}:${currentMinutes
    .toString()
    .padStart(2, "0")}`;

  return (
    <div className="bg-white dark:bg-[#091326] border border-slate-200 dark:border-[#162744] rounded-xl p-3.5 flex flex-col xl:flex-row items-start xl:items-center justify-between gap-4 shadow-md select-none transition-colors">
      {/* 1. Left: Time Window & Layer Toggles */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-2 bg-slate-100 dark:bg-[#060c18] px-3 py-1.5 rounded-lg border border-slate-200 dark:border-[#152442] text-xs font-mono">
          <Clock className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
          <span className="text-slate-500 dark:text-slate-400">WINDOW:</span>
          <span className="text-slate-900 dark:text-white font-bold">02:00 — 06:00</span>
        </div>

        <div className="h-5 w-[1px] bg-slate-200 dark:bg-[#1a2d50] hidden sm:block" />

        {/* Filter Toggle Buttons */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono">
          <button
            onClick={() => {
              const allOn = showPassenger && showFreight && showForecast;
              setShowPassenger(!allOn);
              setShowFreight(!allOn);
              setShowForecast(!allOn);
            }}
            className={cn(
              "px-2.5 py-1 rounded border transition-all text-[11px] font-semibold active:scale-95",
              showPassenger && showFreight && showForecast
                ? "bg-sky-500/20 border-sky-500/50 text-sky-700 dark:text-sky-300 font-bold"
                : "bg-slate-100 dark:bg-[#060c18] border-slate-200 dark:border-[#152442] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
            )}
          >
            ALL TRAINS
          </button>

          <button
            onClick={() => setShowPassenger(!showPassenger)}
            className={cn(
              "px-2.5 py-1 rounded border transition-all text-[11px] font-semibold flex items-center gap-1.5 active:scale-95",
              showPassenger
                ? "bg-blue-500/20 border-blue-500/50 text-blue-700 dark:text-blue-300 font-bold"
                : "bg-slate-100 dark:bg-[#060c18] border-slate-200 dark:border-[#152442] text-slate-500 dark:text-slate-500 hover:text-slate-800 dark:hover:text-slate-300"
            )}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 dark:bg-blue-400" />
            PASSENGER
          </button>

          <button
            onClick={() => setShowFreight(!showFreight)}
            className={cn(
              "px-2.5 py-1 rounded border transition-all text-[11px] font-semibold flex items-center gap-1.5 active:scale-95",
              showFreight
                ? "bg-purple-500/20 border-purple-500/50 text-purple-700 dark:text-purple-300 font-bold"
                : "bg-slate-100 dark:bg-[#060c18] border-slate-200 dark:border-[#152442] text-slate-500 dark:text-slate-500 hover:text-slate-800 dark:hover:text-slate-300"
            )}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-purple-500 dark:bg-purple-400" />
            FREIGHT
          </button>

          <button
            onClick={() => setShowForecast(!showForecast)}
            className={cn(
              "px-2.5 py-1 rounded border transition-all text-[11px] font-semibold flex items-center gap-1.5 active:scale-95",
              showForecast
                ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-700 dark:text-emerald-300 font-bold"
                : "bg-slate-100 dark:bg-[#060c18] border-slate-200 dark:border-[#152442] text-slate-500 dark:text-slate-500 hover:text-slate-800 dark:hover:text-slate-300"
            )}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400" />
            FORECAST
          </button>

          <button
            onClick={() => setShowBlock(!showBlock)}
            className={cn(
              "px-2.5 py-1 rounded border transition-all text-[11px] font-semibold flex items-center gap-1.5 active:scale-95",
              showBlock
                ? "bg-amber-500/20 border-amber-500/50 text-amber-700 dark:text-amber-300 font-bold"
                : "bg-slate-100 dark:bg-[#060c18] border-slate-200 dark:border-[#152442] text-slate-500 dark:text-slate-500 hover:text-slate-800 dark:hover:text-slate-300"
            )}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 dark:bg-amber-400" />
            BLOCK
          </button>

          <button
            onClick={() => setShowSafeWindow(!showSafeWindow)}
            className={cn(
              "px-2.5 py-1 rounded border transition-all text-[11px] font-semibold flex items-center gap-1.5 active:scale-95",
              showSafeWindow
                ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-700 dark:text-emerald-300 font-bold"
                : "bg-slate-100 dark:bg-[#060c18] border-slate-200 dark:border-[#152442] text-slate-500 dark:text-slate-500 hover:text-slate-800 dark:hover:text-slate-300"
            )}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400" />
            SAFE GAPS
          </button>
        </div>
      </div>

      {/* 2. Middle & Right: Interactive Window Adjuster & Replan Action */}
      <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto justify-between xl:justify-end">
        {/* Block Time Shift Stepper */}
        <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-[#060c18] p-1 rounded-lg border border-slate-200 dark:border-[#172b4c]">
          <span className="text-[11px] font-mono text-slate-600 dark:text-slate-400 px-2 font-medium">
            POSSESSION: <span className="text-amber-700 dark:text-amber-300 font-bold">{activeStartTime}–{activeEndTime}</span>
            {timeShiftMinutes !== 0 && (
              <span className="ml-1 text-sky-600 dark:text-sky-400">
                ({timeShiftMinutes > 0 ? `+${timeShiftMinutes}` : timeShiftMinutes}m)
              </span>
            )}
          </span>

          <button
            onClick={() => onShiftTime(-30)}
            className="px-2 py-1 bg-slate-200 hover:bg-slate-300 dark:bg-[#0c1830] dark:hover:bg-[#132448] text-slate-700 dark:text-slate-300 dark:hover:text-white rounded text-xs font-mono font-bold transition-all active:scale-95"
            title="Shift window -30 minutes"
          >
            −30m
          </button>
          <button
            onClick={() => onShiftTime(-10)}
            className="px-2 py-1 bg-slate-200 hover:bg-slate-300 dark:bg-[#0c1830] dark:hover:bg-[#132448] text-slate-700 dark:text-slate-300 dark:hover:text-white rounded text-xs font-mono font-bold transition-all active:scale-95"
            title="Shift window -10 minutes"
          >
            −10m
          </button>
          <button
            onClick={() => onShiftTime(10)}
            className="px-2 py-1 bg-slate-200 hover:bg-slate-300 dark:bg-[#0c1830] dark:hover:bg-[#132448] text-slate-700 dark:text-slate-300 dark:hover:text-white rounded text-xs font-mono font-bold transition-all active:scale-95"
            title="Shift window +10 minutes"
          >
            +10m
          </button>
          <button
            onClick={() => onShiftTime(30)}
            className="px-2 py-1 bg-slate-200 hover:bg-slate-300 dark:bg-[#0c1830] dark:hover:bg-[#132448] text-slate-700 dark:text-slate-300 dark:hover:text-white rounded text-xs font-mono font-bold transition-all active:scale-95"
            title="Shift window +30 minutes"
          >
            +30m
          </button>
          <button
            onClick={onResetTime}
            className="p-1 hover:bg-slate-200 dark:hover:bg-[#132448] text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded transition-all active:scale-95"
            title="Reset to 02:20–04:10"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* REPLAN WINDOW Primary Action */}
        <button
          onClick={onReplanWindow}
          className={cn(
            "px-4 py-2 rounded-lg font-mono text-xs font-bold transition-all flex items-center gap-2 shadow-md active:scale-95",
            isReplanned
              ? "bg-emerald-600 hover:bg-emerald-500 text-white dark:text-black border border-emerald-400"
              : "bg-sky-600 hover:bg-sky-500 text-white dark:text-black border border-sky-400 hover:shadow-sky-500/20"
          )}
        >
          <RefreshCw className={cn("w-3.5 h-3.5", isReplanned ? "" : "animate-spin-slow")} />
          <span>{isReplanned ? "WINDOW REPLANNED (04:20–06:10)" : "REPLAN WINDOW"}</span>
        </button>
      </div>
    </div>
  );
}
