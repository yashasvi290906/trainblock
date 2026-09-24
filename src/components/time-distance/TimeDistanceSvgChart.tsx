"use client";

import React, { useState } from "react";
import {
  TimeDistanceTrain,
  BlockPossession,
  CandidateWindow,
  ConflictPoint,
  StationDwell,
} from "./types";
import { cn } from "@/lib/utils";
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  Layers,
  Shield,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Zap,
} from "lucide-react";

interface TimeDistanceSvgChartProps {
  trains: TimeDistanceTrain[];
  activeBlock: BlockPossession;
  candidateWindows: CandidateWindow[];
  selectedCandidateId: string | null;
  conflicts: ConflictPoint[];
  selectedEntityId: string | null;
  onSelectEntity: (type: "TRAIN" | "BLOCK" | "CONFLICT" | "STATION" | "CANDIDATE", data: any) => void;
  showPassenger: boolean;
  showFreight: boolean;
  showForecast: boolean;
  showBlock: boolean;
  showConflicts: boolean;
  showSafeWindow: boolean;
  currentTimeMins: number;
}

export const STATIONS_GRID = [
  { code: "SEC", name: "Secunderabad Jn", km: 40, isTerminal: true },
  { code: "KM 42", name: "SEC Outskirts Crossover", km: 42, isTerminal: false },
  { code: "KM 51", name: "Ghatkesar Loop Section", km: 51, isTerminal: false },
  { code: "LBN", name: "Labanya Nagar Station", km: 58, isTerminal: false },
  { code: "WL", name: "Warangal South Section", km: 68, isTerminal: false },
  { code: "KCG", name: "Kacheguda Central", km: 76, isTerminal: false },
  { code: "NDKD", name: "Nadikude Junction", km: 94, isTerminal: false },
  { code: "NDL", name: "Nandyal Junction", km: 120, isTerminal: true },
];

export function TimeDistanceSvgChart({
  trains,
  activeBlock,
  candidateWindows,
  selectedCandidateId,
  conflicts,
  selectedEntityId,
  onSelectEntity,
  showPassenger,
  showFreight,
  showForecast,
  showBlock,
  showConflicts,
  showSafeWindow,
  currentTimeMins,
}: TimeDistanceSvgChartProps) {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [hoveredEntity, setHoveredEntity] = useState<string | null>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);

  // Floating hover tooltip state
  const [tooltip, setTooltip] = useState<{
    visible: boolean;
    x: number;
    y: number;
    type: "TRAIN" | "STATION" | "BLOCK" | "CONFLICT" | "CANDIDATE";
    title: string;
    subtitle: string;
    details: { label: string; value: string; color?: string }[];
  } | null>(null);

  const handlePointerHover = (
    e: React.MouseEvent,
    type: "TRAIN" | "STATION" | "BLOCK" | "CONFLICT" | "CANDIDATE",
    title: string,
    subtitle: string,
    details: { label: string; value: string; color?: string }[]
  ) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.min(Math.max(10, e.clientX - rect.left + 12), rect.width - 270);
    const y = Math.min(Math.max(10, e.clientY - rect.top - 80), rect.height - 160);
    setTooltip({ visible: true, x, y, type, title, subtitle, details });
  };

  // Time Domain: 02:00 (120 mins) to 06:15 (375 mins)
  const START_MINS = 120; // 02:00
  const END_MINS = 375; // 06:15
  const TOTAL_MINS = END_MINS - START_MINS;

  // Distance Domain: KM 40 (SEC) to KM 120 (NDL)
  const MIN_KM = 40;
  const MAX_KM = 120;
  const TOTAL_KM = MAX_KM - MIN_KM;

  // SVG Geometry
  const BASE_WIDTH = 1100;
  const SVG_WIDTH = BASE_WIDTH * zoomLevel;
  const SVG_HEIGHT = 560;

  const PAD_LEFT = 110;
  const PAD_RIGHT = 60;
  const PAD_TOP = 45;
  const PAD_BOTTOM = 55;

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
    { label: "02:00", mins: 120, isMajor: true },
    { label: "02:20", mins: 140, isMajor: false },
    { label: "02:40", mins: 160, isMajor: false },
    { label: "03:00", mins: 180, isMajor: true },
    { label: "03:20", mins: 200, isMajor: false },
    { label: "03:40", mins: 220, isMajor: false },
    { label: "04:00", mins: 240, isMajor: true },
    { label: "04:10", mins: 250, isMajor: false },
    { label: "04:30", mins: 270, isMajor: false },
    { label: "05:00", mins: 300, isMajor: true },
    { label: "05:30", mins: 330, isMajor: false },
    { label: "06:00", mins: 360, isMajor: true },
  ];

  // Selected Candidate Window if any
  const candidateSafe = candidateWindows.find((w) => w.id === "WIN-B") || candidateWindows[1];

  return (
    <div
      ref={containerRef}
      className="flex flex-col bg-white dark:bg-[#070e1d] border border-slate-200 dark:border-[#162746] rounded-xl overflow-hidden shadow-xl dark:shadow-2xl relative select-none transition-colors"
    >
      {/* Chart Toolbar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-50 dark:bg-[#0a152a] border-b border-slate-200 dark:border-[#182a4d] text-xs transition-colors">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-500 dark:bg-sky-400 animate-ping" />
            <span className="font-bold text-slate-900 dark:text-white tracking-wider font-mono">
              TIME–DISTANCE INTERSECTION PLANE
            </span>
          </div>
          <span className="text-slate-300 dark:text-slate-600">|</span>
          <span className="font-mono text-slate-500 dark:text-slate-400 text-[11px]">
            X: Time (02:00–06:15) · Y: Corridor Distance (KM 40–120)
          </span>
        </div>

        {/* Zoom & Reset Controls */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-slate-100 dark:bg-[#070e1a] px-2 py-1 rounded border border-slate-300 dark:border-[#182b4a] text-slate-700 dark:text-slate-300 gap-1 font-mono text-[11px]">
            <button
              onClick={() => setZoomLevel((z) => Math.max(1, z - 0.2))}
              className="p-1 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-[#122340] rounded transition-colors cursor-pointer"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="px-1 font-semibold text-sky-600 dark:text-sky-400">{Math.round(zoomLevel * 100)}%</span>
            <button
              onClick={() => setZoomLevel((z) => Math.min(2, z + 0.2))}
              className="p-1 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-[#122340] rounded transition-colors cursor-pointer"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setZoomLevel(1)}
              className="p-1 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-[#122340] rounded transition-colors ml-1 text-slate-400 dark:text-slate-500 cursor-pointer"
              title="Reset View"
            >
              <RotateCcw className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* SVG Canvas Area with horizontal scroll for responsiveness */}
      <div className="overflow-x-auto overflow-y-hidden p-3 bg-slate-100/70 dark:bg-[#050b18] transition-colors relative">
        <div className="relative min-w-[900px]">
          <svg
            viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
            className="w-full h-auto"
            style={{ minHeight: "520px" }}
          >
            <defs>
              {/* Hatch pattern for B-014 Block Possession */}
              <pattern
                id="possessionHatch"
                width="12"
                height="12"
                patternTransform="rotate(45 0 0)"
                patternUnits="userSpaceOnUse"
              >
                <line
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="12"
                  stroke={conflicts.length > 0 ? "#ef4444" : "#10b981"}
                  strokeWidth="2.5"
                  opacity="0.3"
                />
              </pattern>

              {/* Safe Candidate Window Hatch */}
              <pattern
                id="safeCandidateHatch"
                width="10"
                height="10"
                patternTransform="rotate(45 0 0)"
                patternUnits="userSpaceOnUse"
              >
                <line x1="0" y1="0" x2="0" y2="10" stroke="#10b981" strokeWidth="1.5" opacity="0.25" />
              </pattern>

              {/* Glow filter for conflicts */}
              <filter id="conflictGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* 1. BACKGROUND TIME GRID (Vertical Lines) */}
            {timeTicks.map((tick) => {
              const x = timeToX(tick.mins);
              return (
                <g key={tick.label}>
                  <line
                    x1={x}
                    y1={PAD_TOP}
                    x2={x}
                    y2={SVG_HEIGHT - PAD_BOTTOM}
                    className={tick.isMajor ? "stroke-slate-300 dark:stroke-[#1c3156]" : "stroke-slate-200 dark:stroke-[#101f38]"}
                    strokeWidth={tick.isMajor ? "1.5" : "1"}
                    strokeDasharray={tick.isMajor ? "none" : "2,3"}
                  />
                  {/* Time Label on Bottom Axis */}
                  <text
                    x={x}
                    y={SVG_HEIGHT - PAD_BOTTOM + 20}
                    textAnchor="middle"
                    className={tick.isMajor ? "fill-slate-700 dark:fill-[#cbd5e1]" : "fill-slate-500 dark:fill-[#64748b]"}
                    fontSize={tick.isMajor ? "11" : "10"}
                    fontFamily="IBM Plex Mono, monospace"
                    fontWeight={tick.isMajor ? "700" : "500"}
                  >
                    {tick.label}
                  </text>
                </g>
              );
            })}

            {/* 2. DISTANCE & STATION GRID (Horizontal Lines) */}
            {STATIONS_GRID.map((stn) => {
              const y = kmToY(stn.km);
              const isSelected = selectedEntityId === `STATION-${stn.code}`;
              return (
                <g
                  key={stn.code}
                  className="cursor-pointer group"
                  onClick={() =>
                    onSelectEntity("STATION", {
                      code: stn.code,
                      name: stn.name,
                      km: stn.km,
                      isTerminal: stn.isTerminal,
                    })
                  }
                  onMouseEnter={(e) => {
                    handlePointerHover(
                      e,
                      "STATION",
                      `${stn.name} (${stn.code})`,
                      `Corridor Distance: KM ${stn.km}.0`,
                      [
                        { label: "Terminal", value: stn.isTerminal ? "YES (Corridor Boundary)" : "Way-Station" },
                        { label: "Main Line", value: "Double Track (UP + DOWN)" },
                        { label: "Section Status", value: stn.code === "WL" || stn.code === "KCG" ? "P1 Severe Flaw in Zone" : "Clear for Operations" },
                      ]
                    );
                  }}
                  onMouseLeave={() => setTooltip(null)}
                >
                  <line
                    x1={PAD_LEFT}
                    y1={y}
                    x2={SVG_WIDTH - PAD_RIGHT}
                    y2={y}
                    className={cn(
                      "transition-colors",
                      stn.isTerminal
                        ? "stroke-slate-400 dark:stroke-[#223d6b] group-hover:stroke-sky-500"
                        : "stroke-slate-200 dark:stroke-[#142542] group-hover:stroke-sky-400"
                    )}
                    strokeWidth={stn.isTerminal ? "1.5" : "1"}
                  />
                  {/* Station Code & KM on Left Axis */}
                  <text
                    x={PAD_LEFT - 12}
                    y={y + 4}
                    textAnchor="end"
                    className={cn(
                      "transition-colors group-hover:fill-sky-600 dark:group-hover:fill-sky-300 font-mono text-[11px]",
                      isSelected
                        ? "fill-sky-600 dark:fill-[#38bdf8] font-bold"
                        : stn.isTerminal
                        ? "fill-slate-900 dark:fill-[#f8fafc] font-bold"
                        : "fill-slate-700 dark:fill-[#94a3b8] font-semibold"
                    )}
                  >
                    {stn.code}
                  </text>
                  <text
                    x={PAD_LEFT - 58}
                    y={y + 4}
                    textAnchor="end"
                    className="fill-slate-500 dark:fill-[#64748b] font-mono text-[9.5px]"
                  >
                    KM {stn.km}
                  </text>
                </g>
              );
            })}

            {/* 3. CANDIDATE SAFE WINDOW OVERLAY (Window B: 04:20–06:10) */}
            {showSafeWindow && candidateSafe && (
              <g
                className="cursor-pointer transition-opacity"
                onClick={() => onSelectEntity("CANDIDATE", candidateSafe)}
                onMouseEnter={(e) => {
                  handlePointerHover(
                    e,
                    "CANDIDATE",
                    `Fallback Window: ${candidateSafe.name}`,
                    `Window: ${candidateSafe.startTime}–${candidateSafe.endTime} (${candidateSafe.durationMin}m)`,
                    [
                      { label: "Clearance", value: "Zero Express Delays (0m)" },
                      { label: "Corridor Segment", value: `KM ${candidateSafe.startKm}–${candidateSafe.endKm}` },
                      { label: "Usable Minutes", value: `${candidateSafe.usableMin}m maintenance work` },
                    ]
                  );
                }}
                onMouseLeave={() => setTooltip(null)}
              >
                {/* Safe Region Box */}
                <rect
                  x={timeToX(timeStringToMins(candidateSafe.startTime))}
                  y={kmToY(candidateSafe.startKm)}
                  width={
                    timeToX(timeStringToMins(candidateSafe.endTime)) -
                    timeToX(timeStringToMins(candidateSafe.startTime))
                  }
                  height={kmToY(candidateSafe.endKm) - kmToY(candidateSafe.startKm)}
                  fill="url(#safeCandidateHatch)"
                  stroke="#10b981"
                  strokeWidth="1.5"
                  strokeDasharray="4,4"
                  rx="6"
                  opacity="0.85"
                />
                <rect
                  x={timeToX(timeStringToMins(candidateSafe.startTime))}
                  y={kmToY(candidateSafe.startKm)}
                  width={
                    timeToX(timeStringToMins(candidateSafe.endTime)) -
                    timeToX(timeStringToMins(candidateSafe.startTime))
                  }
                  height={kmToY(candidateSafe.endKm) - kmToY(candidateSafe.startKm)}
                  fill="rgba(16, 185, 129, 0.05)"
                  rx="6"
                />
                {/* Safe Window Tag */}
                <rect
                  x={timeToX(timeStringToMins(candidateSafe.startTime)) + 8}
                  y={kmToY(candidateSafe.endKm) - 28}
                  width="180"
                  height="20"
                  rx="3"
                  className="fill-emerald-50 dark:fill-[#062817] stroke-emerald-500"
                  strokeWidth="1"
                />
                <text
                  x={timeToX(timeStringToMins(candidateSafe.startTime)) + 14}
                  y={kmToY(candidateSafe.endKm) - 14}
                  className="fill-emerald-800 dark:fill-[#6ee7b7] font-mono text-[9.5px] font-bold"
                >
                  ✓ FEASIBLE WINDOW ({candidateSafe.startTime}–{candidateSafe.endTime})
                </text>
              </g>
            )}

            {/* 4. ACTIVE MAINTENANCE POSSESSION (B-014) */}
            {showBlock && (
              <g
                className="cursor-pointer group"
                onClick={() => onSelectEntity("BLOCK", activeBlock)}
                onMouseEnter={(e) => {
                  handlePointerHover(
                    e,
                    "BLOCK",
                    `Possession ${activeBlock.id}`,
                    `Corridor: KM ${activeBlock.startKm}–${activeBlock.endKm} (DOWN Line)`,
                    [
                      { label: "Time Slot", value: `${activeBlock.startTime}–${activeBlock.endTime} (${activeBlock.durationMin}m)` },
                      { label: "Consolidated Tasks", value: `${activeBlock.tasksCount} Work Orders (ENG, S&T, TRD)` },
                      { label: "Usable Work Time", value: `${activeBlock.usableMin}m effective` },
                      { label: "Status", value: conflicts.length > 0 ? "CONFLICT DETECTED" : "FEASIBLE WINDOW", color: conflicts.length > 0 ? "#ef4444" : "#10b981" },
                    ]
                  );
                }}
                onMouseLeave={() => setTooltip(null)}
              >
                {/* Possession Shaded Region */}
                <rect
                  x={timeToX(timeStringToMins(activeBlock.startTime))}
                  y={kmToY(activeBlock.startKm)}
                  width={
                    timeToX(timeStringToMins(activeBlock.endTime)) -
                    timeToX(timeStringToMins(activeBlock.startTime))
                  }
                  height={kmToY(activeBlock.endKm) - kmToY(activeBlock.startKm)}
                  fill={
                    conflicts.length > 0
                      ? "rgba(239, 68, 68, 0.16)"
                      : "rgba(16, 185, 129, 0.22)"
                  }
                  stroke={conflicts.length > 0 ? "#ef4444" : "#10b981"}
                  strokeWidth="2"
                  rx="6"
                  className="transition-all group-hover:stroke-sky-400 group-hover:stroke-[2.5]"
                />
                <rect
                  x={timeToX(timeStringToMins(activeBlock.startTime))}
                  y={kmToY(activeBlock.startKm)}
                  width={
                    timeToX(timeStringToMins(activeBlock.endTime)) -
                    timeToX(timeStringToMins(activeBlock.startTime))
                  }
                  height={kmToY(activeBlock.endKm) - kmToY(activeBlock.startKm)}
                  fill="url(#possessionHatch)"
                  rx="6"
                />

                {/* Block Header Badge Inside Region */}
                <rect
                  x={timeToX(timeStringToMins(activeBlock.startTime)) + 8}
                  y={kmToY(activeBlock.startKm) + 8}
                  width={Math.max(
                    170,
                    timeToX(timeStringToMins(activeBlock.endTime)) -
                      timeToX(timeStringToMins(activeBlock.startTime)) -
                      16
                  )}
                  height="44"
                  rx="4"
                  className="fill-white dark:fill-[#0b162c] stroke-slate-300 dark:stroke-slate-700 shadow-md"
                  strokeWidth="1.2"
                />
                <text
                  x={timeToX(timeStringToMins(activeBlock.startTime)) + 14}
                  y={kmToY(activeBlock.startKm) + 24}
                  className={cn(
                    "font-mono text-[11px] font-bold",
                    conflicts.length > 0
                      ? "fill-red-600 dark:fill-[#fca5a5]"
                      : "fill-emerald-700 dark:fill-[#6ee7b7]"
                  )}
                >
                  {activeBlock.id} · {activeBlock.startTime}–{activeBlock.endTime} ({activeBlock.durationMin}m)
                </text>
                <text
                  x={timeToX(timeStringToMins(activeBlock.startTime)) + 14}
                  y={kmToY(activeBlock.startKm) + 40}
                  className="fill-slate-600 dark:fill-[#94a3b8] font-mono text-[9.5px]"
                >
                  KM {activeBlock.startKm}–{activeBlock.endKm} · ENG + S&T + TRD · {activeBlock.usableMin}m USABLE
                </text>
              </g>
            )}

            {/* 5. TRAIN TRAJECTORIES (MAREY SLANTED STRINGS) */}
            {trains.map((trn) => {
              if (trn.isForecast && !showForecast) return null;
              if (trn.priority === "FREIGHT" && !trn.isForecast && !showFreight) return null;
              if (trn.priority !== "FREIGHT" && !showPassenger) return null;

              const isSelected = selectedEntityId === `TRAIN-${trn.id}`;
              const isHovered = hoveredEntity === trn.id;

              // Build smooth path through trajectory points
              const pathData = trn.trajectory
                .map((pt, idx) => {
                  const x = timeToX(pt.minutesFromMidnight);
                  const y = kmToY(pt.km);
                  return `${idx === 0 ? "M" : "L"} ${x} ${y}`;
                })
                .join(" ");

              const midPt = trn.trajectory[Math.floor(trn.trajectory.length / 2)];
              const labelX = timeToX(midPt.minutesFromMidnight) + 8;
              const labelY = kmToY(midPt.km) + (trn.direction === "DOWN" ? 14 : -8);

              return (
                <g
                  key={trn.id}
                  className="cursor-pointer group"
                  onClick={() => onSelectEntity("TRAIN", trn)}
                  onMouseEnter={(e) => {
                    setHoveredEntity(trn.id);
                    handlePointerHover(
                      e,
                      "TRAIN",
                      `${trn.name} (${trn.serviceNumber})`,
                      `${trn.type} · ${trn.direction} Line`,
                      [
                        { label: "Priority", value: trn.priority, color: trn.priority === "HIGH" ? "#ef4444" : "#3b82f6" },
                        { label: "Status", value: trn.isForecast ? "FORECAST MOVEMENT" : "SCHEDULED EXPRESS", color: trn.isForecast ? "#10b981" : undefined },
                        { label: "Corridor Path", value: "Secunderabad → Nandyal" },
                        { label: "Start / End", value: `${trn.trajectory[0]?.time} @ KM ${trn.trajectory[0]?.km} → ${trn.trajectory[trn.trajectory.length - 1]?.time} @ KM ${trn.trajectory[trn.trajectory.length - 1]?.km}` },
                      ]
                    );
                  }}
                  onMouseMove={(e) => {
                    if (tooltip?.visible && containerRef.current) {
                      const rect = containerRef.current.getBoundingClientRect();
                      const x = Math.min(Math.max(10, e.clientX - rect.left + 12), rect.width - 270);
                      const y = Math.min(Math.max(10, e.clientY - rect.top - 80), rect.height - 160);
                      setTooltip((t) => (t ? { ...t, x, y } : null));
                    }
                  }}
                  onMouseLeave={() => {
                    setHoveredEntity(null);
                    setTooltip(null);
                  }}
                >
                  {/* Wider transparent hit-target line for responsive cursor capture */}
                  <path
                    d={pathData}
                    fill="none"
                    stroke="transparent"
                    strokeWidth="14"
                  />

                  {/* Main Train Trajectory Path */}
                  <path
                    d={pathData}
                    fill="none"
                    stroke={trn.color}
                    strokeWidth={isSelected || isHovered ? "4.5" : trn.isForecast ? "2.5" : "3"}
                    strokeDasharray={trn.isForecast ? "6,4" : "none"}
                    opacity={trn.isForecast ? 0.75 : 1}
                    className="transition-all duration-150"
                  />

                  {/* Trajectory Points & Station Dwell Markers */}
                  {trn.trajectory.map((pt, pIdx) => {
                    const px = timeToX(pt.minutesFromMidnight);
                    const py = kmToY(pt.km);
                    return (
                      <g key={pIdx}>
                        <circle
                          cx={px}
                          cy={py}
                          r={pt.isDwell ? "5" : "3.5"}
                          fill={pt.isDwell ? "#ffffff" : trn.color}
                          className="stroke-white dark:stroke-[#070e1d]"
                          strokeWidth="1.5"
                        />
                        {pt.isDwell && (
                          <circle
                            cx={px}
                            cy={py}
                            r="7.5"
                            fill="none"
                            stroke={trn.color}
                            strokeWidth="1.2"
                            strokeDasharray="2,2"
                          />
                        )}
                      </g>
                    );
                  })}

                  {/* Compact Operational Train Label along path */}
                  <g>
                    <rect
                      x={labelX - 4}
                      y={labelY - 10}
                      width={trn.name.length * 6.5 + 40}
                      height="17"
                      rx="3"
                      className="fill-white dark:fill-[#060c18] stroke-slate-300 dark:stroke-slate-700 shadow-sm"
                      stroke={trn.color}
                      strokeWidth={isSelected || isHovered ? "1.5" : "0.8"}
                      opacity="0.95"
                    />
                    <text
                      x={labelX}
                      y={labelY + 2}
                      fill={trn.color}
                      fontSize="9.5"
                      fontFamily="IBM Plex Mono, monospace"
                      fontWeight="bold"
                    >
                      {trn.name} ({trn.direction})
                    </text>
                  </g>
                </g>
              );
            })}

            {/* 6. DYNAMIC CONFLICT HIGHLIGHTS */}
            {showConflicts &&
              conflicts.map((conf) => {
                const cx = timeToX(conf.timeMins);
                const cy = kmToY(conf.km);

                return (
                  <g
                    key={conf.id}
                    className="cursor-pointer group animate-pulse"
                    onClick={() => onSelectEntity("CONFLICT", conf)}
                    onMouseEnter={(e) => {
                      handlePointerHover(
                        e,
                        "CONFLICT",
                        `Conflict at KM ${conf.km.toFixed(1)}`,
                        `Time: ${conf.timeStr} · ${conf.trainName}`,
                        [
                          { label: "Type", value: conf.conflictType, color: "#ef4444" },
                          { label: "Affected Service", value: conf.trainName },
                          { label: "Safety Impact", value: "Direct headway breach inside possession" },
                        ]
                      );
                    }}
                    onMouseLeave={() => setTooltip(null)}
                  >
                    {/* Conflict Pulsing Halo */}
                    <circle
                      cx={cx}
                      cy={cy}
                      r="16"
                      fill="rgba(239, 68, 68, 0.3)"
                      stroke="#ef4444"
                      strokeWidth="2"
                      filter="url(#conflictGlow)"
                    />
                    <circle cx={cx} cy={cy} r="6" fill="#ef4444" stroke="#ffffff" strokeWidth="1.5" />

                    {/* Conflict Warning Callout Banner */}
                    <rect
                      x={cx + 18}
                      y={cy - 14}
                      width="165"
                      height="26"
                      rx="4"
                      className="fill-rose-50 dark:fill-[#450a0a] stroke-rose-400 dark:stroke-[#ef4444] shadow-md"
                      strokeWidth="1.2"
                    />
                    <text
                      x={cx + 26}
                      y={cy + 3}
                      className="fill-rose-800 dark:fill-[#fca5a5] font-mono text-[10px] font-bold"
                    >
                      ⚠ CONFLICT · {conf.trainName.split(" ")[0]}
                    </text>
                  </g>
                );
              })}

            {/* 7. CURRENT TIME VERTICAL SCRUB LINE */}
            {currentTimeMins >= START_MINS && currentTimeMins <= END_MINS && (
              <g>
                <line
                  x1={timeToX(currentTimeMins)}
                  y1={PAD_TOP - 10}
                  x2={timeToX(currentTimeMins)}
                  y2={SVG_HEIGHT - PAD_BOTTOM}
                  stroke="#38bdf8"
                  strokeWidth="2"
                  strokeDasharray="4,2"
                />
                <rect
                  x={timeToX(currentTimeMins) - 34}
                  y={PAD_TOP - 24}
                  width="68"
                  height="20"
                  rx="3"
                  className="fill-sky-600 dark:fill-[#0369a1] stroke-sky-400"
                  strokeWidth="1"
                />
                <text
                  x={timeToX(currentTimeMins)}
                  y={PAD_TOP - 10}
                  textAnchor="middle"
                  fill="#ffffff"
                  fontSize="10"
                  fontFamily="IBM Plex Mono, monospace"
                  fontWeight="bold"
                >
                  NOW 03:17
                </text>
              </g>
            )}
          </svg>
        </div>

        {/* 8. FLOATING OPERATIONAL HOVER TOOLTIP */}
        {tooltip && tooltip.visible && (
          <div
            className="pointer-events-none absolute z-50 rounded-lg p-2.5 shadow-xl font-mono text-xs transition-all duration-75 border bg-white/95 dark:bg-slate-900/95 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 backdrop-blur-md max-w-[270px]"
            style={{ left: `${tooltip.x}px`, top: `${tooltip.y}px` }}
          >
            <div className="flex items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-1.5 mb-1.5">
              <span className="font-extrabold text-[11px] truncate text-slate-900 dark:text-white">
                {tooltip.title}
              </span>
              <span className="text-[9px] px-1.5 py-0.2 rounded font-bold bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 shrink-0">
                {tooltip.type}
              </span>
            </div>
            <div className="text-[10px] text-slate-600 dark:text-slate-400 mb-2 truncate">
              {tooltip.subtitle}
            </div>
            <div className="space-y-1">
              {tooltip.details.map((d, i) => (
                <div key={i} className="flex items-center justify-between text-[9.5px]">
                  <span className="text-slate-500 dark:text-slate-400">{d.label}:</span>
                  <span className="font-bold ml-2 truncate" style={{ color: d.color }}>
                    {d.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Chart Footer Operational Status Strip */}
      <div className="flex flex-wrap items-center justify-between px-4 py-2.5 bg-slate-50 dark:bg-[#091326] border-t border-slate-200 dark:border-[#182744] text-xs font-mono text-slate-700 dark:text-slate-300 transition-colors">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-1 bg-[#38bdf8] rounded-full" />
            <span className="text-[11px]">Vande Bharat</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-1 bg-[#ef4444] rounded-full" />
            <span className="text-[11px]">Rajdhani</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-1 bg-[#60a5fa] rounded-full" />
            <span className="text-[11px]">Shatabdi</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-1 bg-[#f97316] rounded-full" />
            <span className="text-[11px]">Amrit Bharat</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-1 border-b border-dashed border-[#10b981]" />
            <span className="text-[11px] text-emerald-600 dark:text-emerald-400">Freight (Forecast)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 bg-amber-500/20 border border-amber-500 rounded-xs" />
            <span className="text-[11px] text-amber-700 dark:text-amber-300">Block B-014 (KM 68–94)</span>
          </div>
        </div>

        <div className="flex items-center gap-2 mt-1 sm:mt-0">
          {conflicts.length > 0 ? (
            <span className="px-2.5 py-1 rounded bg-rose-50 dark:bg-red-950/70 border border-rose-200 dark:border-red-700/60 text-rose-800 dark:text-red-300 font-bold flex items-center gap-1.5 text-[11px]">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-600 dark:text-red-400" />
              <span>{conflicts.length} TIMETABLE CONFLICTS DETECTED</span>
            </span>
          ) : (
            <span className="px-2.5 py-1 rounded bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-700/60 text-emerald-800 dark:text-emerald-300 font-bold flex items-center gap-1.5 text-[11px]">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>0 CONFLICTS · FEASIBLE POSSESSION</span>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
