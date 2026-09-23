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
import { TimeDistanceTrain } from "@/components/time-distance/types";
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
  const START_MINS = 60;
  const END_MINS = 420;
  const TOTAL_MINS = END_MINS - START_MINS;

  // Distance Domain: KM 40 (SEC) to KM 120 (NDL)
  const MIN_KM = 40;
  const MAX_KM = 120;
  const TOTAL_KM = MAX_KM - MIN_KM;

  // SVG Geometry
  const SVG_WIDTH = 920 * zoomLevel;
  const SVG_HEIGHT = 440;

  const PAD_LEFT = 110;
  const PAD_RIGHT = 45;
  const PAD_TOP = 40;
  const PAD_BOTTOM = 45;

  const PLOT_W = SVG_WIDTH - PAD_LEFT - PAD_RIGHT;
  const PLOT_H = SVG_HEIGHT - PAD_TOP - PAD_BOTTOM;

  const timeToX = (mins: number) => {
    const clamped = Math.max(START_MINS, Math.min(END_MINS, mins));
    return PAD_LEFT + ((clamped - START_MINS) / TOTAL_MINS) * PLOT_W;
  };

  const kmToY = (km: number) => {
    const clamped = Math.max(MIN_KM, Math.min(MAX_KM, km));
    return PAD_TOP + ((clamped - MIN_KM) / TOTAL_KM) * PLOT_H;
  };

  const timeStringToMins = (timeStr: string) => {
    const [h, m] = timeStr.split(":").map(Number);
    return h * 60 + m;
  };

  // Time Ticks across horizontal axis
  const timeTicks = [
    { label: "01:00", mins: 60, isMajor: true },
    { label: "01:30", mins: 90, isMajor: false },
    { label: "02:00", mins: 120, isMajor: true },
    { label: "02:20", mins: 140, isMajor: false },
    { label: "03:00", mins: 180, isMajor: true },
    { label: "03:30", mins: 210, isMajor: false },
    { label: "04:00", mins: 240, isMajor: true },
    { label: "04:20", mins: 260, isMajor: false },
    { label: "05:00", mins: 300, isMajor: true },
    { label: "05:30", mins: 330, isMajor: false },
    { label: "06:00", mins: 360, isMajor: true },
    { label: "06:30", mins: 390, isMajor: false },
    { label: "07:00", mins: 420, isMajor: true },
  ];

  // Compute dynamic trains with overrides
  const trains: TimeDistanceTrain[] = CANONICAL_SCENARIO_TRAINS.map((t) => {
    if (condition === "TRAIN_MOVEMENT" && t.id === selectedTrain.trainId && trainOffsetMinutes !== 0) {
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

  // Base Block B-014 coordinates
  const baseStartMins = timeStringToMins(BASELINE_PLAN.startTime);
  const baseDuration = condition === "BLOCK_DURATION" ? 110 + durationOffsetMin : 110;
  const baseEndMins = baseStartMins + baseDuration;
  const baseKmStart = BASELINE_PLAN.kmStart;
  const baseKmEnd = BASELINE_PLAN.kmEnd;

  const baseBlockX = timeToX(baseStartMins);
  const baseBlockY = kmToY(baseKmStart);
  const baseBlockW = timeToX(baseEndMins) - baseBlockX;
  const baseBlockH = kmToY(baseKmEnd) - baseBlockY;

  // Replanned Fallback Window Coordinates
  const fwStartMins = timeStringToMins(selectedWindow.startTime);
  const fwEndMins = timeStringToMins(selectedWindow.endTime);
  const fwBlockX = timeToX(fwStartMins);
  const fwBlockY = kmToY(selectedWindow.startKm);
  const fwBlockW = timeToX(fwEndMins) - fwBlockX;
  const fwBlockH = kmToY(selectedWindow.endKm) - fwBlockY;

  // Detect if train movement causes conflict
  const isTrainMovementConflict =
    condition === "TRAIN_MOVEMENT" &&
    scenarioState === "CONFLICT_DETECTED";

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl flex flex-col overflow-hidden shadow-sm h-full">
      {/* Visual Chart Header Toolbar */}
      <div className="flex-shrink-0 h-10 bg-slate-950 border-b border-slate-800 px-3.5 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2 font-mono">
          <Layers className="w-4 h-4 text-blue-400" />
          <span className="font-bold text-white tracking-wide text-[11px]">
            TIME–DISTANCE SCENARIO CANVAS
          </span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-300 text-[10px] hidden sm:inline">
            SEC (KM 40) → NDL (KM 120) · Down & Up Tracks
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Zoom buttons */}
          <div className="flex items-center gap-1 bg-slate-900 p-0.5 rounded border border-slate-800 text-slate-300">
            <button
              onClick={() => setZoomLevel((z) => Math.max(0.8, z - 0.2))}
              className="p-1 hover:bg-slate-800 rounded text-slate-300"
              title="Zoom out"
            >
              <ZoomOut className="w-3 h-3" />
            </button>
            <span className="text-[9px] font-mono px-1">{Math.round(zoomLevel * 100)}%</span>
            <button
              onClick={() => setZoomLevel((z) => Math.min(1.6, z + 0.2))}
              className="p-1 hover:bg-slate-800 rounded text-slate-300"
              title="Zoom in"
            >
              <ZoomIn className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* SVG Canvas Area */}
      <div className="flex-1 overflow-auto bg-[#070e1c] relative p-1">
        <svg
          width={SVG_WIDTH}
          height={SVG_HEIGHT}
          className="select-none font-mono"
          style={{ minWidth: `${SVG_WIDTH}px` }}
        >
          <defs>
            {/* Pattern for Denied Block */}
            <pattern
              id="deniedHatch"
              width="10"
              height="10"
              patternTransform="rotate(45 0 0)"
              patternUnits="userSpaceOnUse"
            >
              <line x1="0" y1="0" x2="0" y2="10" stroke="#f43f5e" strokeWidth="2.5" opacity="0.6" />
            </pattern>

            {/* Grid line pattern */}
            <linearGradient id="corridorGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#0f1d38" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#081020" stopOpacity="0.9" />
            </linearGradient>

            <filter id="glowConflict" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Plot Background */}
          <rect
            x={PAD_LEFT}
            y={PAD_TOP}
            width={PLOT_W}
            height={PLOT_H}
            fill="url(#corridorGradient)"
            stroke="#182744"
            strokeWidth="1"
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
                  stroke={st.isTerminal ? "#253b66" : "#14223c"}
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
                    st.isTerminal ? "fill-slate-200 font-bold" : "fill-slate-400"
                  )}
                >
                  {st.code} (KM {st.km})
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
                  stroke={tick.isMajor ? "#1e3358" : "#101d33"}
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
                    tick.isMajor ? "fill-slate-300 font-bold" : "fill-slate-500"
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
              {/* Base Active Possession Box */}
              <rect
                x={baseBlockX}
                y={baseBlockY}
                width={baseBlockW}
                height={baseBlockH}
                fill="#d97706"
                fillOpacity="0.22"
                stroke="#f59e0b"
                strokeWidth="1.75"
                rx="4"
              />
              <rect
                x={baseBlockX}
                y={baseBlockY}
                width={baseBlockW}
                height="18"
                fill="#f59e0b"
                fillOpacity="0.85"
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
                fill="url(#deniedHatch)"
                stroke="#f43f5e"
                strokeWidth="2"
                strokeDasharray="4,2"
                rx="4"
                opacity="0.8"
              />
              <rect
                x={baseBlockX + baseBlockW / 2 - 85}
                y={baseBlockY + baseBlockH / 2 - 14}
                width="170"
                height="28"
                fill="#881337"
                stroke="#f43f5e"
                strokeWidth="1.5"
                rx="4"
              />
              <text
                x={baseBlockX + baseBlockW / 2}
                y={baseBlockY + baseBlockH / 2 + 3}
                textAnchor="middle"
                className="fill-rose-100 font-mono text-[10px] font-bold tracking-wider"
              >
                ✖ B-014 DENIED BY OPERATING
              </text>
            </g>
          )}

          {/* 2. REPLANNED / FALLBACK WINDOW VISUALIZATION */}
          {(scenarioState === "REPLANNED" || (condition === "BLOCK_DENIAL" && scenarioState !== "IDLE")) && (
            <g>
              {/* Fallback Window FW-01 / Selected Window */}
              <rect
                x={fwBlockX}
                y={fwBlockY}
                width={fwBlockW}
                height={fwBlockH}
                fill={scenarioState === "REPLANNED" ? "#059669" : "#0284c7"}
                fillOpacity={scenarioState === "REPLANNED" ? "0.28" : "0.15"}
                stroke={scenarioState === "REPLANNED" ? "#10b981" : "#38bdf8"}
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
                fillOpacity="0.9"
                rx="3"
              />
              <text
                x={fwBlockX + 6}
                y={fwBlockY + 12}
                className="fill-slate-950 font-mono text-[9px] font-bold"
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
                fill="#ef4444"
                fillOpacity="0.4"
                stroke="#dc2626"
                strokeWidth="1.5"
                rx="2"
              />
              <text
                x={timeToX(140) + 4}
                y={kmToY(criticalWork.kmStart) + 12}
                className="fill-rose-200 font-mono text-[8px] font-bold"
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

            return (
              <g key={train.id}>
                {/* Train Line Slope */}
                <polyline
                  points={points}
                  fill="none"
                  stroke={train.color}
                  strokeWidth={isInteracting ? 3 : 2}
                  strokeDasharray={train.isForecast ? "4,3" : "none"}
                  opacity={isInteracting ? 1 : 0.85}
                />

                {/* Train Label Along Path */}
                {train.trajectory.length > 0 && (
                  <text
                    x={timeToX(train.trajectory[1]?.minutesFromMidnight || train.trajectory[0].minutesFromMidnight) + 4}
                    y={kmToY(train.trajectory[1]?.km || train.trajectory[0].km) - 4}
                    fill={train.color}
                    className="font-mono text-[9px] font-bold"
                  >
                    {train.serviceNumber} {train.name.split(" ")[0]}
                  </text>
                )}
              </g>
            );
          })}

          {/* 5. DYNAMIC CONFLICT MARKER (TRAIN MOVEMENT INTERSECTION) */}
          {isTrainMovementConflict && (
            <g filter="url(#glowConflict)">
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
                width="160"
                height="22"
                fill="#991b1b"
                stroke="#ef4444"
                strokeWidth="1"
                rx="3"
              />
              <text
                x={timeToX(180 + trainOffsetMinutes) + 20}
                y={kmToY(72) - 2}
                className="fill-white font-mono text-[8px] font-bold"
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
            className="fill-slate-400 font-mono text-[10px]"
          >
            Corridor Timeline (01:00 to 07:00 IST) — 24-Hour Military Time
          </text>
        </svg>
      </div>

      {/* Legend Footer Strip */}
      <div className="flex-shrink-0 h-9 bg-slate-950 border-t border-slate-800 px-4 flex items-center justify-between text-[10px] font-mono text-slate-300">
        <div className="flex items-center gap-3 overflow-x-auto scrollbar-none">
          <span className="text-slate-500">Legend:</span>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-2 bg-amber-500/80 rounded-xs" />
            <span>Base B-014</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-2 bg-emerald-500/80 rounded-xs" />
            <span>Fallback / Replanned</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-2 bg-rose-600/80 rounded-xs" />
            <span>Denied / Conflict</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-sky-400" />
            <span>Vande Bharat</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-red-500" />
            <span>Rajdhani</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-emerald-400 border-b border-dashed" />
            <span>Freight (FOIS)</span>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-2 text-slate-400">
          <Shield className="w-3 h-3 text-emerald-400" />
          <span>Passenger Path Protection Enforced</span>
        </div>
      </div>
    </div>
  );
}
