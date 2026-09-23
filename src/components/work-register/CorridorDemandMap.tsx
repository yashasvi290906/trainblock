"use client";

import React, { useState } from "react";
import { MaintenanceTask, Department } from "@/types/maintenance";
import { MapPin, Info, AlertTriangle, Layers, Wrench, Radio, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface CorridorDemandMapProps {
  tasks: MaintenanceTask[];
  selectedTaskId: string | null;
  onSelectTask: (taskId: string) => void;
  selectedTaskIds?: string[];
}

const STATIONS = [
  { code: "SEC", name: "Secunderabad Jn", km: 0, percent: 3 },
  { code: "KZJ", name: "Kazipet Jn", km: 32, percent: 27 },
  { code: "WL", name: "Warangal", km: 68, percent: 53 },
  { code: "NDKD", name: "Nadikude", km: 101, percent: 79 },
  { code: "NDL", name: "Nandyal", km: 128, percent: 97 },
];

export function CorridorDemandMap({
  tasks,
  selectedTaskId,
  onSelectTask,
  selectedTaskIds = [],
}: CorridorDemandMapProps) {
  const [hoveredTask, setHoveredTask] = useState<MaintenanceTask | null>(null);

  const getKmPercent = (km: number) => {
    return Math.max(3, Math.min(97, (km / 128) * 100));
  };

  const getDeptBadge = (dept: Department) => {
    switch (dept) {
      case "Engineering":
        return {
          bg: "bg-amber-500 text-amber-950",
          border: "border-amber-600",
          label: "ENG",
          icon: <Wrench className="w-2.5 h-2.5" />,
        };
      case "S&T":
        return {
          bg: "bg-sky-500 text-sky-950",
          border: "border-sky-600",
          label: "S&T",
          icon: <Radio className="w-2.5 h-2.5" />,
        };
      case "Traction":
        return {
          bg: "bg-purple-500 text-purple-950",
          border: "border-purple-600",
          label: "TRD",
          icon: <Zap className="w-2.5 h-2.5" />,
        };
    }
  };

  return (
    <div className="w-full bg-slate-900 rounded-xl border border-slate-800 p-4 sm:p-5 text-white font-mono shadow-md space-y-3 select-none">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-slate-800 text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-blue-500" />
          <span className="font-extrabold uppercase tracking-wider text-slate-200">
            CORRIDOR DEMAND MAP
          </span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-400 font-sans text-xs">
            Spatial distribution of maintenance demands across SEC–NDL (128 km)
          </span>
        </div>

        {/* Department & Criticality Legend */}
        <div className="flex flex-wrap items-center gap-3 text-[10.5px] text-slate-400">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span className="text-slate-300">ENG</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-500" />
            <span className="text-slate-300">S&T</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
            <span className="text-slate-300">TRD (Traction)</span>
          </div>
          <div className="flex items-center gap-1.5 pl-2 border-l border-slate-700">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 ring-2 ring-red-400 animate-pulse" />
            <span className="text-red-300 font-bold">P1 Critical</span>
          </div>
        </div>
      </div>

      {/* Corridor Spatial Track Schematic */}
      <div className="relative pt-3 pb-1">
        {/* Station Markers (Top Axis) */}
        <div className="relative h-8 border-b border-slate-800">
          {STATIONS.map((stn) => (
            <div
              key={stn.code}
              className="absolute transform -translate-x-1/2 flex flex-col items-center"
              style={{ left: `${stn.percent}%` }}
            >
              <div className="flex items-center gap-1 text-[11px] font-bold text-slate-200">
                <MapPin className="w-3 h-3 text-blue-400" />
                <span>{stn.code}</span>
              </div>
              <span className="text-[9.5px] text-slate-400 font-normal">KM {stn.km}</span>
            </div>
          ))}
        </div>

        {/* Double Line Tracks with Sleepers */}
        <div className="relative my-4 space-y-3">
          {/* Candidate Cluster Highlight Region (KM 68–94) */}
          <div
            className="absolute -top-1 bottom-0 rounded-lg bg-blue-600/15 border border-dashed border-blue-500/50 z-0 flex items-start justify-center pt-0.5 pointer-events-none"
            style={{
              left: `${getKmPercent(68)}%`,
              width: `${getKmPercent(94) - getKmPercent(68)}%`,
            }}
          >
            <span className="text-[9px] font-bold text-blue-200 bg-blue-950/90 px-1.5 py-0.5 rounded border border-blue-700">
              CLUSTER B-014 (KM 68–94) · 7 DEMANDS
            </span>
          </div>

          {/* DOWN Line Track */}
          <div className="relative h-10 bg-slate-950/90 rounded-md border border-slate-800 flex items-center overflow-hidden">
            {/* Sleepers texture */}
            <div
              className="absolute inset-0 opacity-15 pointer-events-none"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(90deg, #64748b, #64748b 6px, transparent 6px, transparent 16px)",
              }}
            />
            {/* Steel Rail Lines */}
            <div className="absolute top-2.5 inset-x-0 h-0.5 bg-slate-600 pointer-events-none" />
            <div className="absolute bottom-2.5 inset-x-0 h-0.5 bg-slate-600 pointer-events-none" />
            <span className="absolute left-2 text-[8.5px] text-slate-400 font-bold z-0 pointer-events-none">
              DOWN LINE (SEC → NDL)
            </span>

            {/* Demand Markers on DOWN line */}
            {tasks
              .filter((t) => t.direction === "DOWN" || t.direction === "BOTH")
              .map((task) => {
                const isSelected = selectedTaskId === task.taskId || selectedTaskIds.includes(task.taskId);
                const isCritical = task.criticality === "Critical" || task.overdueDays >= 10;
                const deptStyle = getDeptBadge(task.department);

                return (
                  <button
                    key={task.taskId}
                    onClick={() => onSelectTask(task.taskId)}
                    onMouseEnter={() => setHoveredTask(task)}
                    onMouseLeave={() => setHoveredTask(null)}
                    className={cn(
                      "absolute z-10 transform -translate-x-1/2 flex items-center justify-center rounded-full transition-all cursor-pointer shadow-sm",
                      isSelected
                        ? "w-6 h-6 ring-3 ring-white scale-125 z-20"
                        : "w-5 h-5 hover:scale-125",
                      deptStyle.bg,
                      isCritical ? "ring-2 ring-red-400" : "border border-black/40"
                    )}
                    style={{ left: `${getKmPercent(task.kmStart)}%` }}
                    title={`${task.taskId} · ${task.title} (KM ${task.kmStart})`}
                  >
                    {isCritical ? (
                      <span className="w-2 h-2 rounded-full bg-red-950 animate-pulse" />
                    ) : (
                      <span className="text-[8px] font-extrabold text-slate-950 font-sans leading-none">
                        {task.department === "Engineering" ? "E" : task.department === "S&T" ? "S" : "T"}
                      </span>
                    )}
                  </button>
                );
              })}
          </div>

          {/* UP Line Track */}
          <div className="relative h-10 bg-slate-950/90 rounded-md border border-slate-800 flex items-center overflow-hidden">
            {/* Sleepers texture */}
            <div
              className="absolute inset-0 opacity-15 pointer-events-none"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(90deg, #64748b, #64748b 6px, transparent 6px, transparent 16px)",
              }}
            />
            {/* Steel Rail Lines */}
            <div className="absolute top-2.5 inset-x-0 h-0.5 bg-slate-600 pointer-events-none" />
            <div className="absolute bottom-2.5 inset-x-0 h-0.5 bg-slate-600 pointer-events-none" />
            <span className="absolute left-2 text-[8.5px] text-slate-400 font-bold z-0 pointer-events-none">
              UP LINE (NDL → SEC)
            </span>

            {/* Demand Markers on UP line */}
            {tasks
              .filter((t) => t.direction === "UP")
              .map((task) => {
                const isSelected = selectedTaskId === task.taskId || selectedTaskIds.includes(task.taskId);
                const isCritical = task.criticality === "Critical" || task.overdueDays >= 10;
                const deptStyle = getDeptBadge(task.department);

                return (
                  <button
                    key={task.taskId}
                    onClick={() => onSelectTask(task.taskId)}
                    onMouseEnter={() => setHoveredTask(task)}
                    onMouseLeave={() => setHoveredTask(null)}
                    className={cn(
                      "absolute z-10 transform -translate-x-1/2 flex items-center justify-center rounded-full transition-all cursor-pointer shadow-sm",
                      isSelected
                        ? "w-6 h-6 ring-3 ring-white scale-125 z-20"
                        : "w-5 h-5 hover:scale-125",
                      deptStyle.bg,
                      isCritical ? "ring-2 ring-red-400" : "border border-black/40"
                    )}
                    style={{ left: `${getKmPercent(task.kmStart)}%` }}
                    title={`${task.taskId} · ${task.title} (KM ${task.kmStart})`}
                  >
                    {isCritical ? (
                      <span className="w-2 h-2 rounded-full bg-red-950 animate-pulse" />
                    ) : (
                      <span className="text-[8px] font-extrabold text-slate-950 font-sans leading-none">
                        {task.department === "Engineering" ? "E" : task.department === "S&T" ? "S" : "T"}
                      </span>
                    )}
                  </button>
                );
              })}
          </div>
        </div>

        {/* Interactive Inspection Strip */}
        <div className="min-h-7 text-xs flex flex-wrap items-center justify-between text-slate-400 border-t border-slate-800/80 pt-2 gap-2">
          {hoveredTask ? (
            <div className="flex items-center gap-2 text-slate-200">
              <span className="font-bold text-sky-400">{hoveredTask.taskId}</span>
              <span>·</span>
              <span className="text-slate-300 font-sans">{hoveredTask.title}</span>
              <span>·</span>
              <span className="text-amber-300">KM {hoveredTask.kmStart}–{hoveredTask.kmEnd}</span>
              <span>·</span>
              <span className="text-slate-400">{hoveredTask.department} ({hoveredTask.duration}m)</span>
            </div>
          ) : (
            <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-blue-400 shrink-0" />
              <span>Click any track demand marker to focus the work order details and candidate coordination</span>
            </div>
          )}

          <span className="text-[10px] text-slate-500 hidden sm:inline">
            {tasks.length} Corridor Demands Mapped
          </span>
        </div>
      </div>
    </div>
  );
}
