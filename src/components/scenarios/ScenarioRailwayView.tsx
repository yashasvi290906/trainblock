"use client";

import React, { useState } from "react";
import {
  ScenarioCondition,
  ScenarioState,
  FallbackWindow,
  CriticalWorkInput,
  TrainMovementOverride,
} from "./types";
import { BASELINE_PLAN, CANONICAL_SCENARIO_TRAINS } from "./scenarioData";
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Shield,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Layers,
  Sparkles,
  Train as TrainIcon,
  XCircle,
  Eye,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ScenarioRailwayViewProps {
  condition: ScenarioCondition;
  scenarioState: ScenarioState;
  selectedWindow: FallbackWindow;
  criticalWork: CriticalWorkInput;
  selectedTrain: TrainMovementOverride;
  trainOffsetMinutes: number;
  durationOffsetMin: number;
}

const STATIONS = [
  { code: "SEC", name: "Secunderabad Jn", km: 40, isTerminal: true },
  { code: "LBN", name: "Labanya Nagar", km: 58, isTerminal: false },
  { code: "WL", name: "Warangal South", km: 68, isTerminal: false },
  { code: "KCG", name: "Kacheguda Central", km: 76, isTerminal: false },
  { code: "NDKD", name: "Nadikude Jn", km: 94, isTerminal: false },
  { code: "NDL", name: "Nandyal Jn", km: 120, isTerminal: true },
];

export function ScenarioRailwayView({
  condition,
  scenarioState,
  selectedWindow,
  criticalWork,
  selectedTrain,
  trainOffsetMinutes,
  durationOffsetMin,
}: ScenarioRailwayViewProps) {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [hoveredEntity, setHoveredEntity] = useState<string | null>(null);

  // Time Domain: 01:00 (60 mins) to 07:00 (420 mins)
  const T_START = 60;
  const T_END = 420;
  const T_RANGE = T_END - T_START; // 360 mins

  // Spatial Domain: KM 30 to KM 130
  const KM_START = 30;
  const KM_END = 130;
  const KM_RANGE = KM_END - KM_START; // 100 km

  // SVG Dimension Constants
  const BASE_WIDTH = 680;
  const SVG_HEIGHT = 440;
  const SVG_WIDTH = BASE_WIDTH * zoomLevel;

  const PAD_LEFT = 75;
  const PAD_RIGHT = 30;
  const PAD_TOP = 35;
  const PAD_BOTTOM = 40;

  const PLOT_W = SVG_WIDTH - PAD_LEFT - PAD_RIGHT;
  const PLOT_H = SVG_HEIGHT - PAD_TOP - PAD_BOTTOM;

  // Scale Functions
  const timeToX = (mins: number) => {
    const clamped = Math.max(T_START, Math.min(T_END, mins));
    return PAD_LEFT + ((clamped - T_START) / T_RANGE) * PLOT_W;
  };

  const kmToY = (km: number) => {
    const clamped = Math.max(KM_START, Math.min(KM_END, km));
    return PAD_TOP + ((clamped - KM_START) / KM_RANGE) * PLOT_H;
  };

  // Time Axis Grid Marks (30 min increments)
  const timeTicks = [
    { mins: 60, label: "01:00", isMajor: true },
    { mins: 90, label: "01:30", isMajor: false },
    { mins: 120, label: "02:00", isMajor: true },
    { mins: 150, label: "02:30", isMajor: false },
    { mins: 180, label: "03:00", isMajor: true },
    { mins: 210, label: "03:30", isMajor: false },
    { mins: 240, label: "04:00", isMajor: true },
    { mins: 270, label: "04:30", isMajor: false },
    { mins: 300, label: "05:00", isMajor: true },
    { mins: 330, label: "05:30", isMajor: false },
    { mins: 360, label: "06:00", isMajor: true },
    { mins: 390, label: "06:30", isMajor: false },
    { mins: 420, label: "07:00", isMajor: true },
  ];

  // Coordinates for Base Block B-014 (140 to 250 mins = 02:20 to 04:10, KM 68 to 94)
  const baseBlockX = timeToX(140);
  const baseBlockW = timeToX(250 + durationOffsetMin) - baseBlockX;
  const baseBlockY = kmToY(68);
  const baseBlockH = kmToY(94) - kmToY(68);

  // Coordinates for Selected Fallback Window (e.g. FW-01: 260 to 370 mins = 04:20 to 06:10, KM 68 to 94)
  const [fwStartH, fwStartM] = selectedWindow.startTime.split(":").map(Number);
  const [fwEndH, fwEndM] = selectedWindow.endTime.split(":").map(Number);
  const fwStartMins = (fwStartH || 0) * 60 + (fwStartM || 0);
  const fwEndMins = (fwEndH || 0) * 60 + (fwEndM || 0);
  const fwBlockX = timeToX(fwStartMins);
  const fwBlockW = timeToX(fwEndMins) - fwBlockX;
  const fwBlockY = kmToY(selectedWindow.startKm);
  const fwBlockH = kmToY(selectedWindow.endKm) - kmToY(selectedWindow.startKm);

  // Dynamic trains reflecting timetable overrides
  const trains = CANONICAL_SCENARIO_TRAINS.map((t) => {
    if (condition === "TRAIN_MOVEMENT" && t.id === selectedTrain.trainId) {
      return {
        ...t,
        trajectory: t.trajectory.map((pt) => ({
          ...pt,
          minutesFromMidnight: pt.minutesFromMidnight + trainOffsetMinutes,
        })),
      };
    }
    return t;
  });

  const isTrainMovementConflict =
    condition === "TRAIN_MOVEMENT" &&
    scenarioState === "CONFLICT_DETECTED";

  return (
    <div className="bg-white border border-slate-200 rounded-xl flex flex-col overflow-hidden shadow-xs h-full">
      {/* Visual Chart Header Toolbar */}
      <div className="flex-shrink-0 h-10 bg-slate-50 border-b border-slate-200 px-3.5 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2 font-mono">
          <Layers className="w-4 h-4 text-blue-600" />
          <span className="font-bold text-slate-900 tracking-wide text-[11px]">
            TIME–DISTANCE SCENARIO CANVAS
          </span>
          <span className="text-slate-300">|</span>
          <span className="text-slate-600 text-[10px] hidden sm:inline">
            SEC (KM 40) → NDL (KM 120) · Down & Up Tracks
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Zoom buttons */}
          <div className="flex items-center gap-1 bg-white p-0.5 rounded border border-slate-200 text-slate-700 shadow-xs">
            <button
              onClick={() => setZoomLevel((z) => Math.max(0.8, z - 0.2))}
              className="p-1 hover:bg-slate-100 rounded text-slate-700 cursor-pointer"
              title="Zoom out"
            >
              <ZoomOut className="w-3 h-3" />
            </button>
            <span className="text-[9px] font-mono px-1 font-bold">{Math.round(zoomLevel * 100)}%</span>
            <button
              onClick={() => setZoomLevel((z) => Math.min(1.6, z + 0.2))}
              className="p-1 hover:bg-slate-100 rounded text-slate-700 cursor-pointer"
              title="Zoom in"
            >
              <ZoomIn className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* SVG Canvas Area - Light Themed Canvas */}
      <div className="flex-1 overflow-auto bg-slate-50 relative p-1">
        <svg
          width={SVG_WIDTH}
          height={SVG_HEIGHT}
          className="select-none font-mono"
          style={{ minWidth: `${SVG_WIDTH}px` }}
        >
          <defs>
            {/* Pattern for Denied Block */}
            <pattern
              id="deniedHatchLight"
              width="10"
              height="10"
              patternTransform="rotate(45 0 0)"
              patternUnits="userSpaceOnUse"
            >
              <line x1="0" y1="0" x2="0" y2="10" stroke="#f43f5e" strokeWidth="2.5" opacity="0.4" />
            </pattern>

            <filter id="glowConflictLight" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Plot Background (Crisp White with Slate Border) */}
          <rect
            x={PAD_LEFT}
            y={PAD_TOP}
            width={PLOT_W}
            height={PLOT_H}
            fill="#ffffff"
            stroke="#cbd5e1"
            strokeWidth="1.5"
            rx="4"
          />

          {/* Horizontal Station Guidelines */}
          {STATIONS.map((st) => {
            const y = kmToY(st.km);
            return (
              <g key={st.code}>
                <line
                  x1={PAD_LEFT}
                  y1={y}
                  x2={PAD_LEFT + PLOT_W}
                  y2={y}
                  stroke={st.isTerminal ? "#94a3b8" : "#e2e8f0"}
                  strokeWidth={st.isTerminal ? 1.5 : 1}
                  strokeDasharray={st.isTerminal ? "none" : "3,3"}
                />
                {/* Station Label on Left Y-Axis */}
                <text
                  x={PAD_LEFT - 10}
                  y={y + 3}
                  textAnchor="end"
                  className={cn(
                    "text-[10px] font-mono",
                    st.isTerminal ? "fill-slate-900 font-bold" : "fill-slate-600"
                  )}
                >
                  {st.code} ({st.km}k)
                </text>
              </g>
            );
          })}

          {/* Vertical Time Guidelines */}
          {timeTicks.map((tick) => {
            const x = timeToX(tick.mins);
            return (
              <g key={tick.label}>
                <line
                  x1={x}
                  y1={PAD_TOP}
                  x2={x}
                  y2={PAD_TOP + PLOT_H}
                  stroke={tick.isMajor ? "#cbd5e1" : "#f1f5f9"}
                  strokeWidth={tick.isMajor ? 1 : 0.75}
                  strokeDasharray={tick.isMajor ? "none" : "2,3"}
                />
                {/* Time Label on Top X-Axis */}
                <text
                  x={x}
                  y={PAD_TOP - 10}
                  textAnchor="middle"
                  className={cn(
                    "text-[10px] font-mono",
                    tick.isMajor ? "fill-slate-800 font-bold" : "fill-slate-500"
                  )}
                >
                  {tick.label}
                </text>
              </g>
            );
          })}

          {/* 1. BASE BLOCK VISUALIZATION (B-014) */}
          {condition !== "BLOCK_DENIAL" || scenarioState === "IDLE" ? (
            <g>
              {/* Base Active Possession Box (Amber/Gold Light Theme) */}
              <rect
                x={baseBlockX}
                y={baseBlockY}
                width={baseBlockW}
                height={baseBlockH}
                fill="#fef3c7"
                fillOpacity="0.75"
                stroke="#d97706"
                strokeWidth="1.75"
                rx="4"
              />
              <rect
                x={baseBlockX}
                y={baseBlockY}
                width={baseBlockW}
                height="18"
                fill="#f59e0b"
                fillOpacity="0.95"
                rx="3"
              />
              <text
                x={baseBlockX + 6}
                y={baseBlockY + 12}
                className="fill-slate-950 font-mono text-[9px] font-bold"
              >
                B-014 · 02:20–04:10 · KM 68–94 · 18 ORDERS (3 DEPTS)
              </text>
            </g>
          ) : (
            /* DENIED BLOCK VISUALIZATION */
            <g>
              {/* Stippled Denied Box */}
              <rect
                x={baseBlockX}
                y={baseBlockY}
                width={baseBlockW}
                height={baseBlockH}
                fill="url(#deniedHatchLight)"
                stroke="#e11d48"
                strokeWidth="2"
                strokeDasharray="4,2"
                rx="4"
              />
              <rect
                x={baseBlockX + baseBlockW / 2 - 85}
                y={baseBlockY + baseBlockH / 2 - 14}
                width="170"
                height="28"
                fill="#ffe4e6"
                stroke="#e11d48"
                strokeWidth="1.5"
                rx="4"
              />
              <text
                x={baseBlockX + baseBlockW / 2}
                y={baseBlockY + baseBlockH / 2 + 4}
                textAnchor="middle"
                className="fill-rose-900 font-mono text-[10px] font-bold tracking-wider"
              >
                ✖ B-014 DENIED BY OPERATING
              </text>
            </g>
          )}

          {/* 2. REPLANNED / FALLBACK WINDOW VISUALIZATION */}
          {(scenarioState === "REPLANNED" || (condition === "BLOCK_DENIAL" && scenarioState !== "IDLE")) && (
            <g>
              {/* Fallback Window FW-01 / Selected Window (Emerald / Sky Light Theme) */}
              <rect
                x={fwBlockX}
                y={fwBlockY}
                width={fwBlockW}
                height={fwBlockH}
                fill={scenarioState === "REPLANNED" ? "#d1fae5" : "#e0f2fe"}
                fillOpacity={scenarioState === "REPLANNED" ? "0.8" : "0.7"}
                stroke={scenarioState === "REPLANNED" ? "#059669" : "#0284c7"}
                strokeWidth={scenarioState === "REPLANNED" ? "2" : "1.5"}
                strokeDasharray={scenarioState === "REPLANNED" ? "none" : "4,3"}
                rx="4"
              />
              <rect
                x={fwBlockX}
                y={fwBlockY}
                width={fwBlockW}
                height="18"
                fill={scenarioState === "REPLANNED" ? "#10b981" : "#0284c7"}
                fillOpacity="0.95"
                rx="3"
              />
              <text
                x={fwBlockX + 6}
                y={fwBlockY + 12}
                className="fill-white font-mono text-[9px] font-bold"
              >
                {scenarioState === "REPLANNED"
                  ? `✔ REPLANNED B-014 (${selectedWindow.code}) · ${selectedWindow.startTime}–${selectedWindow.endTime} · 18/18 WORK RETAINED`
                  : `CANDIDATE ${selectedWindow.code} (${selectedWindow.startTime}–${selectedWindow.endTime}) · PASSENGER CLEAR`}
              </text>
            </g>
          )}

          {/* 3. CRITICAL WORK OVERLAY (ADD_CRITICAL_WORK) */}
          {condition === "ADD_CRITICAL_WORK" && (
            <g>
              <rect
                x={timeToX(140)}
                y={kmToY(criticalWork.kmStart)}
                width={timeToX(140 + criticalWork.durationMin) - timeToX(140)}
                height={kmToY(criticalWork.kmEnd) - kmToY(criticalWork.kmStart)}
                fill="#fee2e2"
                fillOpacity="0.8"
                stroke="#dc2626"
                strokeWidth="1.5"
                rx="2"
              />
              <text
                x={timeToX(140) + 4}
                y={kmToY(criticalWork.kmStart) + 12}
                className="fill-rose-900 font-mono text-[8px] font-bold"
              >
                + P1 DEMAND (45m)
              </text>
            </g>
          )}

          {/* 4. TRAIN TRAJECTORIES */}
          {trains.map((train) => {
            const points = train.trajectory
              .map((pt) => `${timeToX(pt.minutesFromMidnight)},${kmToY(pt.km)}`)
              .join(" ");

            const isInteracting =
              condition === "TRAIN_MOVEMENT" && train.id === selectedTrain.trainId;

            // Light-theme high-contrast train line colors
            const strokeColor =
              train.serviceNumber === "20612"
                ? "#2563eb" // Vande Bharat Blue
                : train.serviceNumber === "12434"
                ? "#dc2626" // Rajdhani Red
                : train.serviceNumber === "12076"
                ? "#ea580c" // Amrit Bharat Orange
                : train.serviceNumber === "12009"
                ? "#0d9488" // Shatabdi Teal
                : "#475569"; // Freight Slate

            return (
              <g key={train.id}>
                {/* Train Line Slope */}
                <polyline
                  points={points}
                  fill="none"
                  stroke={strokeColor}
                  strokeWidth={isInteracting ? 3.5 : 2.5}
                  strokeDasharray={train.isForecast ? "4,3" : "none"}
                  opacity={isInteracting ? 1 : 0.9}
                />

                {/* Train Label Along Path */}
                {train.trajectory.length > 0 && (
                  <text
                    x={timeToX(train.trajectory[1]?.minutesFromMidnight || train.trajectory[0].minutesFromMidnight) + 4}
                    y={kmToY(train.trajectory[1]?.km || train.trajectory[0].km) - 4}
                    fill={strokeColor}
                    className="font-mono text-[9px] font-extrabold"
                  >
                    {train.serviceNumber} {train.name.split(" ")[0]}
                  </text>
                )}
              </g>
            );
          })}

          {/* 5. DYNAMIC CONFLICT MARKER (TRAIN MOVEMENT INTERSECTION) */}
          {isTrainMovementConflict && (
            <g filter="url(#glowConflictLight)">
              <circle
                cx={timeToX(180 + trainOffsetMinutes)}
                cy={kmToY(72)}
                r="10"
                fill="#ef4444"
                stroke="#ffffff"
                strokeWidth="2"
              />
              <text
                x={timeToX(180 + trainOffsetMinutes)}
                y={kmToY(72) + 3}
                textAnchor="middle"
                className="fill-white font-mono text-[9px] font-bold"
              >
                !
              </text>
              <rect
                x={timeToX(180 + trainOffsetMinutes) + 14}
                y={kmToY(72) - 16}
                width="165"
                height="22"
                fill="#fee2e2"
                stroke="#ef4444"
                strokeWidth="1.5"
                rx="3"
              />
              <text
                x={timeToX(180 + trainOffsetMinutes) + 20}
                y={kmToY(72) - 2}
                className="fill-rose-900 font-mono text-[8px] font-bold"
              >
                NEW CONFLICT: VB-20612 @ KM 72
              </text>
            </g>
          )}

          {/* Axis Labels */}
          <text
            x={PAD_LEFT + PLOT_W / 2}
            y={SVG_HEIGHT - 12}
            textAnchor="middle"
            className="fill-slate-600 font-mono text-[10px] font-medium"
          >
            Corridor Timeline (01:00 to 07:00 IST) — 24-Hour Military Time
          </text>
        </svg>
      </div>

      {/* Legend Footer Strip (Clean Light) */}
      <div className="flex-shrink-0 h-9 bg-slate-50 border-t border-slate-200 px-4 flex items-center justify-between text-[10px] font-mono text-slate-700">
        <div className="flex items-center gap-3 overflow-x-auto scrollbar-none">
          <span className="text-slate-500 font-bold">Legend:</span>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-2 bg-amber-500 rounded-xs" />
            <span className="font-medium text-slate-700">Base B-014</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-2 bg-emerald-500 rounded-xs" />
            <span className="font-medium text-slate-700">Fallback / Replanned</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-2 bg-rose-600 rounded-xs" />
            <span className="font-medium text-slate-700">Denied / Conflict</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-1 bg-blue-600 rounded-full" />
            <span className="font-medium text-slate-700">Vande Bharat</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-1 bg-red-600 rounded-full" />
            <span className="font-medium text-slate-700">Rajdhani</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-1 bg-slate-600 border-b border-dashed" />
            <span className="font-medium text-slate-700">Freight (FOIS)</span>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-2 text-slate-700 font-bold">
          <Shield className="w-3.5 h-3.5 text-emerald-600" />
          <span>Passenger Path Protection Enforced</span>
        </div>
      </div>
    </div>
  );
}
