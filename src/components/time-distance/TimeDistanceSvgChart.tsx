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
    <div className="flex flex-col bg-[#070e1d] border border-[#162746] rounded-xl overflow-hidden shadow-2xl relative select-none">
      {/* Chart Toolbar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#0a152a] border-b border-[#182a4d] text-xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-400 animate-ping" />
            <span className="font-bold text-white tracking-wider font-mono">
              TIME–DISTANCE INTERSECTION PLANE
            </span>
          </div>
          <span className="text-slate-600">|</span>
          <span className="font-mono text-slate-400 text-[11px]">
            X: Time (02:00–06:15) · Y: Corridor Distance (KM 40–120)
          </span>
        </div>

        {/* Zoom & Reset Controls */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-[#070e1a] px-2 py-1 rounded border border-[#182b4a] text-slate-300 gap-1 font-mono text-[11px]">
            <button
              onClick={() => setZoomLevel((z) => Math.max(1, z - 0.2))}
              className="p-1 hover:text-white hover:bg-[#122340] rounded transition-colors"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="px-1 font-semibold text-sky-400">{Math.round(zoomLevel * 100)}%</span>
            <button
              onClick={() => setZoomLevel((z) => Math.min(2, z + 0.2))}
              className="p-1 hover:text-white hover:bg-[#122340] rounded transition-colors"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setZoomLevel(1)}
              className="p-1 hover:text-white hover:bg-[#122340] rounded transition-colors ml-1 text-slate-500"
              title="Reset View"
            >
              <RotateCcw className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* SVG Canvas Area with horizontal scroll for responsiveness */}
      <div className="overflow-x-auto overflow-y-hidden p-3 bg-[#050b18]">
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
                    stroke={tick.isMajor ? "#1c3156" : "#101f38"}
                    strokeWidth={tick.isMajor ? "1.5" : "1"}
                    strokeDasharray={tick.isMajor ? "none" : "2,3"}
                  />
                  {/* Time Label on Bottom Axis */}
                  <text
                    x={x}
                    y={SVG_HEIGHT - PAD_BOTTOM + 20}
                    textAnchor="middle"
                    fill={tick.isMajor ? "#cbd5e1" : "#64748b"}
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
                >
                  <line
                    x1={PAD_LEFT}
                    y1={y}
                    x2={SVG_WIDTH - PAD_RIGHT}
                    y2={y}
                    stroke={stn.isTerminal ? "#223d6b" : "#142542"}
                    strokeWidth={stn.isTerminal ? "1.5" : "1"}
                  />
                  {/* Station Code & KM on Left Axis */}
                  <text
                    x={PAD_LEFT - 12}
                    y={y + 4}
                    textAnchor="end"
                    fill={isSelected ? "#38bdf8" : stn.isTerminal ? "#f8fafc" : "#94a3b8"}
                    fontSize="11"
                    fontFamily="IBM Plex Mono, monospace"
                    fontWeight={stn.isTerminal ? "700" : "600"}
                    className="transition-colors group-hover:fill-sky-300"
                  >
                    {stn.code}
                  </text>
                  <text
                    x={PAD_LEFT - 58}
                    y={y + 4}
                    textAnchor="end"
                    fill="#64748b"
                    fontSize="9.5"
                    fontFamily="IBM Plex Mono, monospace"
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
                  fill="#062817"
                  stroke="#10b981"
                  strokeWidth="1"
                />
                <text
                  x={timeToX(timeStringToMins(candidateSafe.startTime)) + 14}
                  y={kmToY(candidateSafe.endKm) - 14}
                  fill="#6ee7b7"
                  fontSize="9.5"
                  fontFamily="IBM Plex Mono, monospace"
                  fontWeight="bold"
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
                  className="transition-all group-hover:stroke-white"
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
                  fill="#0b162c"
                  stroke={conflicts.length > 0 ? "#ef4444" : "#10b981"}
                  strokeWidth="1.2"
                />
                <text
                  x={timeToX(timeStringToMins(activeBlock.startTime)) + 14}
                  y={kmToY(activeBlock.startKm) + 24}
                  fill={conflicts.length > 0 ? "#fca5a5" : "#6ee7b7"}
                  fontSize="11"
                  fontFamily="IBM Plex Mono, monospace"
                  fontWeight="bold"
                >
                  {activeBlock.id} · {activeBlock.startTime}–{activeBlock.endTime} ({activeBlock.durationMin}m)
                </text>
                <text
                  x={timeToX(timeStringToMins(activeBlock.startTime)) + 14}
                  y={kmToY(activeBlock.startKm) + 40}
                  fill="#94a3b8"
                  fontSize="9.5"
                  fontFamily="IBM Plex Mono, monospace"
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

              const firstPt = trn.trajectory[0];
              const midPt = trn.trajectory[Math.floor(trn.trajectory.length / 2)];
              const labelX = timeToX(midPt.minutesFromMidnight) + 8;
              const labelY = kmToY(midPt.km) + (trn.direction === "DOWN" ? 14 : -8);

              return (
                <g
                  key={trn.id}
                  className="cursor-pointer group"
                  onClick={() => onSelectEntity("TRAIN", trn)}
                  onMouseEnter={() => setHoveredEntity(trn.id)}
                  onMouseLeave={() => setHoveredEntity(null)}
                >
                  {/* Subtle wider transparent hit-target line for easy clicking */}
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
                    strokeWidth={isSelected || isHovered ? "4" : trn.isForecast ? "2.5" : "3"}
                    strokeDasharray={trn.isForecast ? "6,4" : "none"}
                    opacity={trn.isForecast ? 0.75 : 1}
                    className="transition-all"
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
                          stroke="#070e1d"
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
                      fill="#060c18"
                      stroke={trn.color}
                      strokeWidth={isSelected ? "1.5" : "0.8"}
                      opacity="0.9"
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
                const isSelected = selectedEntityId === `CONFLICT-${conf.id}`;

                return (
                  <g
                    key={conf.id}
                    className="cursor-pointer group animate-pulse"
                    onClick={() => onSelectEntity("CONFLICT", conf)}
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
                      fill="#450a0a"
                      stroke="#ef4444"
                      strokeWidth="1.2"
                      className="shadow-lg"
                    />
                    <text
                      x={cx + 26}
                      y={cy + 3}
                      fill="#fca5a5"
                      fontSize="10"
                      fontFamily="IBM Plex Mono, monospace"
                      fontWeight="bold"
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
                  fill="#0369a1"
                  stroke="#38bdf8"
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
      </div>

      {/* Chart Footer Operational Status Strip */}
      <div className="flex flex-wrap items-center justify-between px-4 py-2 bg-[#091326] border-t border-[#182744] text-xs font-mono text-slate-300">
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
            <span className="text-[11px] text-emerald-400">Freight (Forecast)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 bg-amber-500/20 border border-amber-500 rounded-sm" />
            <span className="text-[11px] text-amber-300">Block B-014 (KM 68–94)</span>
          </div>
        </div>

        <div className="flex items-center gap-2 mt-1 sm:mt-0">
          {conflicts.length > 0 ? (
            <span className="px-2.5 py-1 rounded bg-red-950/70 border border-red-700/60 text-red-300 font-bold flex items-center gap-1.5 text-[11px]">
              <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
              <span>{conflicts.length} TIMETABLE CONFLICTS DETECTED</span>
            </span>
          ) : (
            <span className="px-2.5 py-1 rounded bg-emerald-950/70 border border-emerald-700/60 text-emerald-300 font-bold flex items-center gap-1.5 text-[11px]">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>0 CONFLICTS · FEASIBLE POSSESSION</span>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
