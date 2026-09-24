"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Wrench, Zap, Radio, Clock, ShieldCheck, AlertOctagon } from "lucide-react";

interface RailwayBlockProps {
  blockId: string;
  kmStart: number;
  kmEnd: number;
  startTime: string;
  endTime: string;
  rawMinutes: number;
  usableMinutes: number;
  tasksCount: number;
  departments: string[];
  status?: "PLANNED" | "ACTIVE" | "VALIDATED" | "DENIED";
  isSelected?: boolean;
  onClick?: () => void;
  className?: string;
}

export function RailwayBlock({
  blockId,
  kmStart,
  kmEnd,
  startTime,
  endTime,
  rawMinutes,
  usableMinutes,
  tasksCount,
  departments,
  status = "VALIDATED",
  isSelected = false,
  onClick,
  className,
}: RailwayBlockProps) {
  const isDenied = status === "DENIED";
  const usablePercent = Math.round((usableMinutes / (rawMinutes || 1)) * 100);

  return (
    <div
      onClick={onClick}
      className={cn(
        "relative rounded-xl border-2 font-mono select-none cursor-pointer transition-all duration-200 overflow-hidden shadow-xs hover:shadow-md",
        isDenied
          ? "bg-red-50 dark:bg-red-950/40 border-red-500 text-red-900 dark:text-red-200"
          : isSelected
          ? "bg-amber-50/95 dark:bg-amber-950/50 border-amber-500 ring-2 ring-amber-500/30 shadow-md"
          : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-amber-400 dark:hover:border-amber-500",
        className
      )}
      title={`Block ${blockId}: KM ${kmStart}–${kmEnd} (${startTime}–${endTime})`}
    >
      {/* Track Boundary Top Strip */}
      <div
        className={cn(
          "h-2 w-full flex",
          isDenied ? "bg-red-500" : isSelected ? "bg-amber-500" : "bg-slate-300 dark:bg-slate-700"
        )}
      />

      <div className="p-3.5 space-y-2.5">
        {/* Header: Block ID + Status + Slot */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-black text-slate-900 dark:text-white text-base tracking-tight">
              {blockId}
            </span>
            <span
              className={cn(
                "px-2 py-0.5 rounded text-xs font-black uppercase tracking-wider",
                isDenied
                  ? "bg-red-100 dark:bg-red-900/60 text-red-800 dark:text-red-200 border border-red-300 dark:border-red-700"
                  : "bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-700"
              )}
            >
              {status}
            </span>
          </div>

          <span className="font-black text-sm px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700">
            {startTime} – {endTime}
          </span>
        </div>

        {/* Spatial Coordinates & Tasks */}
        <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
          <span>
            KM {kmStart.toFixed(1)} → KM {kmEnd.toFixed(1)} (DOWN Line)
          </span>
          <span className="px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800 font-bold">
            {tasksCount} tasks consolidated
          </span>
        </div>

        {/* Usable Minutes Segment Bar */}
        <div className="space-y-1 bg-slate-50 dark:bg-slate-950/60 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between text-xs font-medium text-slate-700 dark:text-slate-300">
            <span>
              Usable Work: <strong className="text-amber-600 dark:text-amber-400 font-black">{usableMinutes}m</strong> ({usablePercent}%)
            </span>
            <span className="text-slate-500 dark:text-slate-400">Total Slot: {rawMinutes}m</span>
          </div>
          <div className="h-2.5 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden flex">
            <div
              style={{ width: `${usablePercent}%` }}
              className={cn(
                "h-full rounded-l-full transition-all duration-300",
                isDenied ? "bg-red-500" : "bg-gradient-to-r from-amber-500 to-amber-400"
              )}
            />
            <div
              style={{ width: `${100 - usablePercent}%` }}
              className="bg-slate-300 dark:bg-slate-700 h-full"
            />
          </div>
        </div>

        {/* Department Badges */}
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs font-bold">
          {departments.map((dept) => (
            <span
              key={dept}
              className={cn(
                "flex items-center gap-1.5 px-2 py-0.5 rounded-md border",
                dept === "Engineering"
                  ? "bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-800"
                  : dept === "S&T"
                  ? "bg-sky-50 dark:bg-sky-950/50 text-sky-800 dark:text-sky-300 border-sky-300 dark:border-sky-800"
                  : "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800"
              )}
            >
              {dept === "Engineering" && <Wrench className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />}
              {dept === "S&T" && <Radio className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />}
              {dept === "Traction" && <Zap className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />}
              <span>{dept}</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
