"use client";

import React from "react";
import Link from "next/link";
import {
  Play,
  Pause,
  RotateCcw,
  Clock,
  AlertTriangle,
  Plus,
  ArrowRight,
  Layers,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface LiveCorridorHeaderProps {
  simSeconds: number;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onReset: () => void;
  playbackSpeed: 1 | 2 | 4;
  onSpeedChange: (speed: 1 | 2 | 4) => void;
  zoomMode: "MACRO" | "CORRIDOR" | "BLOCK";
  onZoomChange: (mode: "MACRO" | "CORRIDOR" | "BLOCK") => void;
  isDenied: boolean;
  onSimulateDenial: () => void;
  onOpenAddWork: () => void;
}

export function LiveCorridorHeader({
  simSeconds,
  isPlaying,
  onTogglePlay,
  onReset,
  playbackSpeed,
  onSpeedChange,
  zoomMode,
  onZoomChange,
  isDenied,
  onSimulateDenial,
  onOpenAddWork,
}: LiveCorridorHeaderProps) {
  const formatClock = (seconds: number) => {
    const hrs = Math.floor((seconds / 3600) % 24).toString().padStart(2, "0");
    const mins = Math.floor((seconds / 60) % 60).toString().padStart(2, "0");
    const secs = Math.floor(seconds % 60).toString().padStart(2, "0");
    return `${hrs}:${mins}:${secs}`;
  };

  return (
    <div className="flex-shrink-0 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 py-3 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs select-none">
      {/* Left: Title & Identity */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
          <h1 className="text-base sm:text-lg font-black text-slate-900 dark:text-white tracking-wider font-mono">
            LIVE CORRIDOR
          </h1>
        </div>

        <span className="text-slate-300 dark:text-slate-700 hidden sm:inline">|</span>

        <span className="font-mono text-blue-700 dark:text-sky-400 font-bold text-xs sm:text-sm">
          SEC–NDL (KM 40 → KM 120)
        </span>

        <span className="text-slate-300 dark:text-slate-700 hidden sm:inline">|</span>

        <span className="px-2.5 py-1 rounded bg-blue-50 dark:bg-blue-950/70 border border-blue-200 dark:border-blue-800 text-blue-900 dark:text-blue-300 font-mono text-xs font-bold">
          18 SEP 2026 · 02:00–06:00
        </span>
      </div>

      {/* Center: Clock & Playback Controls */}
      <div className="flex items-center gap-3">
        {/* Real-time Simulated Clock */}
        <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 px-3 py-1.5 rounded-lg font-mono">
          <Clock className="w-4 h-4 text-blue-600 dark:text-sky-400" />
          <span className="text-slate-900 dark:text-white font-black tracking-widest text-xs sm:text-sm">
            {formatClock(simSeconds)}
          </span>
          <span className="text-xs text-slate-500 font-bold">IST</span>
        </div>

        {/* Play/Pause & Reset */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-950 p-1 rounded-lg border border-slate-200 dark:border-slate-800">
          <button
            onClick={onTogglePlay}
            className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
            title={isPlaying ? "Pause Simulation" : "Resume Simulation"}
          >
            {isPlaying ? (
              <Pause className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            ) : (
              <Play className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            )}
          </button>
          <button
            onClick={onReset}
            className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 transition-colors cursor-pointer"
            title="Reset Simulation"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Playback Speeds */}
        <div className="flex items-center gap-0.5 bg-slate-100 dark:bg-slate-950 p-1 rounded-lg border border-slate-200 dark:border-slate-800 font-mono text-xs">
          {([1, 2, 4] as const).map((spd) => (
            <button
              key={spd}
              onClick={() => onSpeedChange(spd)}
              className={cn(
                "px-2.5 py-0.5 rounded transition-all font-bold cursor-pointer",
                playbackSpeed === spd
                  ? "bg-blue-600 text-white shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              )}
            >
              {spd}×
            </button>
          ))}
        </div>

        {/* Zoom Presets */}
        <div className="hidden xl:flex items-center bg-slate-100 dark:bg-slate-950 p-1 rounded-lg border border-slate-200 dark:border-slate-800 font-mono text-xs">
          <button
            onClick={() => onZoomChange("MACRO")}
            className={cn(
              "px-2.5 py-0.5 rounded transition-colors font-bold cursor-pointer",
              zoomMode === "MACRO"
                ? "bg-slate-900 dark:bg-slate-700 text-white"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
            )}
          >
            MACRO
          </button>
          <button
            onClick={() => onZoomChange("CORRIDOR")}
            className={cn(
              "px-2.5 py-0.5 rounded transition-colors font-bold cursor-pointer",
              zoomMode === "CORRIDOR"
                ? "bg-slate-900 dark:bg-slate-700 text-white"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
            )}
          >
            CORRIDOR
          </button>
          <button
            onClick={() => onZoomChange("BLOCK")}
            className={cn(
              "px-2.5 py-0.5 rounded transition-colors font-bold cursor-pointer",
              zoomMode === "BLOCK"
                ? "bg-slate-900 dark:bg-slate-700 text-white"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
            )}
          >
            BLOCK B-014
          </button>
        </div>
      </div>

      {/* Right: Operational Scenario Actions */}
      <div className="flex items-center gap-2">
        {/* Simulate Block Denial Button */}
        <button
          onClick={onSimulateDenial}
          className={cn(
            "px-3 py-1.5 rounded-lg font-mono font-bold text-xs transition-all flex items-center gap-1.5 shadow-sm cursor-pointer",
            isDenied
              ? "bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300 border border-red-300 dark:border-red-800 animate-pulse"
              : "bg-red-50 hover:bg-red-100 dark:bg-red-900/60 dark:hover:bg-red-800 text-red-700 dark:text-red-200 border border-red-300 dark:border-red-700/60"
          )}
        >
          <AlertTriangle className="w-3.5 h-3.5 text-red-600 dark:text-red-400" />
          <span>{isDenied ? "BLOCK DENIED (Active)" : "Simulate Block Denial"}</span>
        </button>

        {/* Add Critical Work */}
        <button
          onClick={onOpenAddWork}
          className="px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-blue-800 dark:text-slate-200 border border-blue-200 dark:border-slate-700 font-mono text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5 text-blue-600 dark:text-sky-400" />
          <span>+ Add Critical Work</span>
        </button>

        {/* Link to /plan */}
        <Link
          href="/plan"
          className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-mono text-xs font-bold transition-colors flex items-center gap-1 shadow-sm"
        >
          <span>View Plan</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
