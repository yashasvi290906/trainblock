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
        "relative rounded border font-mono select-none cursor-pointer transition-all duration-200 overflow-hidden",
        isDenied
          ? "bg-red-50/90 border-red-400 text-red-900 shadow-xs"
          : isSelected
          ? "bg-amber-50/95 border-amber-500 shadow-md ring-1 ring-amber-500"
          : "bg-white border-slate-200 hover:border-amber-400 hover:shadow-2xs",
        className
      )}
      title={`Block ${blockId}: KM ${kmStart}–${kmEnd} (${startTime}–${endTime})`}
    >
      {/* Track Boundary Top Strip */}
      <div
        className={cn(
          "h-1.5 w-full flex",
          isDenied ? "bg-red-500" : "bg-amber-500"
        )}
      />

      <div className="p-2.5 space-y-1.5">
        {/* Header: Block ID + Status + Slot */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5">
            <span className="font-extrabold text-slate-900 tracking-tight">
              {blockId}
            </span>
            <span
              className={cn(
                "px-1.5 py-0.2 rounded text-[9px] font-bold uppercase",
                isDenied
                  ? "bg-red-100 text-red-800 border border-red-300"
                  : "bg-amber-100 text-amber-900 border border-amber-300"
              )}
            >
              {status}
            </span>
          </div>

          <span className="font-bold text-slate-800 text-[11px]">
            {startTime} – {endTime}
          </span>
        </div>

        {/* Spatial Coordinates & Tasks */}
        <div className="flex items-center justify-between text-[11px] text-slate-600">
          <span>
            KM {kmStart.toFixed(1)} → KM {kmEnd.toFixed(1)}
          </span>
          <span className="font-semibold text-slate-700">
            {tasksCount} tasks consolidated
          </span>
        </div>

        {/* Usable Minutes Segment Bar */}
        <div className="space-y-0.5">
          <div className="flex items-center justify-between text-[10px] text-slate-500">
            <span>Usable: <strong className="text-slate-900">{usableMinutes}m</strong> ({usablePercent}%)</span>
            <span>Raw: {rawMinutes}m</span>
          </div>
          <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden flex">
            <div
              style={{ width: `${usablePercent}%` }}
              className={cn(
                "h-full rounded-l-full",
                isDenied ? "bg-red-500" : "bg-amber-500"
              )}
            />
            <div
              style={{ width: `${100 - usablePercent}%` }}
              className="bg-slate-300 h-full"
            />
          </div>
        </div>

        {/* Department Icons */}
        <div className="flex items-center gap-2 pt-0.5 text-[10px] text-slate-600">
          {departments.map((dept) => (
            <span key={dept} className="flex items-center gap-0.5">
              {dept === "Engineering" && <Wrench className="w-2.5 h-2.5 text-amber-600" />}
              {dept === "S&T" && <Radio className="w-2.5 h-2.5 text-sky-600" />}
              {dept === "Traction" && <Zap className="w-2.5 h-2.5 text-emerald-600" />}
              <span>{dept.substring(0, 3).toUpperCase()}</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
