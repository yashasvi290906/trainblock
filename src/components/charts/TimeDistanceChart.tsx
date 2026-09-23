"use client";

import React, { useState } from "react";
import { Station, TimetableMovement } from "@/types/railway";
import { Block } from "@/types/planning";
import { formatKm } from "@/lib/formatting";
import { cn } from "@/lib/utils";
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  CheckSquare,
  Square,
  AlertTriangle,
  Info,
  Calendar,
} from "lucide-react";

interface TimeDistanceChartProps {
  stations: Station[];
  movements: TimetableMovement[];
  blocks: Block[];
  className?: string;
}

export function TimeDistanceChart({
  stations,
  movements,
  blocks,
  className,
}: TimeDistanceChartProps) {
  const [showTrains, setShowTrains] = useState(true);
  const [showBlocks, setShowBlocks] = useState(true);
  const [showSignals, setShowSignals] = useState(true);
  const [showOhe, setShowOhe] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [hoveredEntity, setHoveredEntity] = useState<string | null>(null);

  // Time window: 02:00 (120 mins) to 06:30 (390 mins) => 270 mins range
  const startMinute = 120;
  const endMinute = 390;
  const totalMinutes = endMinute - startMinute;

  const totalKm = 128;

  // Chart dimensions
  const svgWidth = 1000 * zoomLevel;
  const svgHeight = 480;
  const paddingLeft = 90;
  const paddingRight = 40;
  const paddingTop = 40;
  const paddingBottom = 50;

  const chartWidth = svgWidth - paddingLeft - paddingRight;
  const chartHeight = svgHeight - paddingTop - paddingBottom;

  // Coordinate transforms
  const timeToX = (minutes: number) => {
    return paddingLeft + ((minutes - startMinute) / totalMinutes) * chartWidth;
  };

  const kmToY = (km: number) => {
    return paddingTop + (km / totalKm) * chartHeight;
  };

  const timeLabels = [
    { time: "02:00", minutes: 120 },
    { time: "02:30", minutes: 150 },
    { time: "03:00", minutes: 180 },
    { time: "03:30", minutes: 210 },
    { time: "04:00", minutes: 240 },
    { time: "04:30", minutes: 270 },
    { time: "05:00", minutes: 300 },
    { time: "05:30", minutes: 330 },
    { time: "06:00", minutes: 360 },
    { time: "06:30", minutes: 390 },
  ];

  // Helper to parse time string "02:20" to minutes
  const parseTimeToMins = (t: string) => {
    const [h, m] = t.split(":").map(Number);
    return h * 60 + m;
  };

  return (
    <div className={cn("bg-[#0c1527] border border-[#1a2948] rounded-lg p-4 flex flex-col space-y-3", className)}>
      {/* Controls toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#16233d]">
        <div className="flex items-center gap-3">
          <h3 className="text-xs font-semibold text-white tracking-wide flex items-center gap-2">
            <span>Time–Distance (Marey) Diagram</span>
            <span className="text-[10px] font-mono text-sky-400 bg-sky-950/60 border border-sky-800/50 px-2 py-0.5 rounded">
              SEC – NDL (21 Sep 2026)
            </span>
          </h3>
        </div>

        {/* Filter toggles & Zoom */}
        <div className="flex items-center gap-4 text-xs">
          {/* Toggle buttons */}
          <div className="flex items-center gap-3 bg-[#080f1d] px-3 py-1.5 rounded border border-[#16243f]">
            <button
              onClick={() => setShowTrains(!showTrains)}
              className={cn("flex items-center gap-1.5 transition-colors", showTrains ? "text-sky-400" : "text-slate-500")}
            >
              {showTrains ? <CheckSquare className="w-3.5 h-3.5" /> : <Square className="w-3.5 h-3.5" />}
              <span>Trains</span>
            </button>
            <button
              onClick={() => setShowBlocks(!showBlocks)}
              className={cn("flex items-center gap-1.5 transition-colors", showBlocks ? "text-amber-400" : "text-slate-500")}
            >
              {showBlocks ? <CheckSquare className="w-3.5 h-3.5" /> : <Square className="w-3.5 h-3.5" />}
              <span>Blocks</span>
            </button>
            <button
              onClick={() => setShowSignals(!showSignals)}
              className={cn("flex items-center gap-1.5 transition-colors", showSignals ? "text-emerald-400" : "text-slate-500")}
            >
              {showSignals ? <CheckSquare className="w-3.5 h-3.5" /> : <Square className="w-3.5 h-3.5" />}
              <span>Signals</span>
            </button>
            <button
              onClick={() => setShowOhe(!showOhe)}
              className={cn("flex items-center gap-1.5 transition-colors", showOhe ? "text-indigo-400" : "text-slate-500")}
            >
              {showOhe ? <CheckSquare className="w-3.5 h-3.5" /> : <Square className="w-3.5 h-3.5" />}
              <span>OHE</span>
            </button>
          </div>

          {/* Zoom controls */}
          <div className="flex items-center gap-1 bg-[#080f1d] p-1 rounded border border-[#16243f]">
            <button
              onClick={() => setZoomLevel((z) => Math.max(1, z - 0.25))}
              className="p-1 hover:bg-[#162440] rounded text-slate-300"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="mono-num text-[11px] px-1 text-slate-400">{Math.round(zoomLevel * 100)}%</span>
            <button
              onClick={() => setZoomLevel((z) => Math.min(2, z + 0.25))}
              className="p-1 hover:bg-[#162440] rounded text-slate-300"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setZoomLevel(1)}
              className="p-1 hover:bg-[#162440] rounded text-slate-400 hover:text-white"
              title="Reset Zoom"
            >
              <RotateCcw className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* SVG Container with horizontal scroll */}
      <div className="overflow-x-auto bg-[#070e1c] rounded-lg border border-[#14233e] p-2 relative">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-auto min-w-[800px]"
          style={{ height: "480px" }}
        >
          <defs>
            {/* Striped pattern for maintenance block */}
            <pattern id="blockHatch" width="10" height="10" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
              <line x1="0" y1="0" x2="0" y2="10" stroke="#f59e0b" strokeWidth="2" opacity="0.35" />
            </pattern>
            <linearGradient id="blockGlow" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#d97706" stopOpacity="0.15" />
            </linearGradient>
          </defs>

          {/* Time Grid Lines (Vertical) */}
          {timeLabels.map((tl) => {
            const x = timeToX(tl.minutes);
            return (
              <g key={tl.time}>
                <line
                  x1={x}
                  y1={paddingTop}
                  x2={x}
                  y2={paddingTop + chartHeight}
                  stroke="#172744"
                  strokeDasharray="3 3"
                  strokeWidth="1"
                />
                <text
                  x={x}
                  y={paddingTop + chartHeight + 20}
                  fill="#94a3b8"
                  fontSize="11"
                  fontFamily="monospace"
                  textAnchor="middle"
                >
                  {tl.time}
                </text>
              </g>
            );
          })}

          {/* Station Horizontal Lines & Labels */}
          {stations.map((stn) => {
            const y = kmToY(stn.km);
            return (
              <g key={stn.code}>
                <line
                  x1={paddingLeft}
                  y1={y}
                  x2={paddingLeft + chartWidth}
                  y2={y}
                  stroke="#1c2e4f"
                  strokeWidth="1.5"
                />
                {/* Station label */}
                <text
                  x={paddingLeft - 10}
                  y={y + 4}
                  fill="#f1f5f9"
                  fontSize="11"
                  fontWeight="600"
                  textAnchor="end"
                >
                  {stn.code} ({stn.km})
                </text>
              </g>
            );
          })}

          {/* Maintenance Blocks (B-014) */}
          {showBlocks &&
            blocks.map((blk) => {
              const startMins = parseTimeToMins(blk.startTime);
              const endMins = parseTimeToMins(blk.endTime);
              const x = timeToX(startMins);
              const w = timeToX(endMins) - x;
              const y = kmToY(blk.kmStart);
              const h = kmToY(blk.kmEnd) - y;

              return (
                <g key={blk.blockId} className="cursor-pointer">
                  {/* Shaded Area */}
                  <rect
                    x={x}
                    y={y}
                    width={w}
                    height={h}
                    fill="url(#blockGlow)"
                    stroke="#f59e0b"
                    strokeWidth="2"
                    rx="4"
                  />
                  <rect
                    x={x}
                    y={y}
                    width={w}
                    height={h}
                    fill="url(#blockHatch)"
                    rx="4"
                  />

                  {/* Block Badge inside Box */}
                  <rect
                    x={x + 10}
                    y={y + 12}
                    width={w - 20 > 130 ? 130 : w - 20}
                    height="32"
                    fill="#18150c"
                    stroke="#f59e0b"
                    strokeWidth="1"
                    rx="3"
                  />
                  <text
                    x={x + 16}
                    y={y + 26}
                    fill="#fbbf24"
                    fontSize="11"
                    fontWeight="bold"
                    fontFamily="monospace"
                  >
                    {blk.blockId} (KM {blk.kmStart}–{blk.kmEnd})
                  </text>
                  <text
                    x={x + 16}
                    y={y + 38}
                    fill="#fef08a"
                    fontSize="9.5"
                    fontFamily="monospace"
                  >
                    {blk.startTime} – {blk.endTime} · ENG+S&T+TRC
                  </text>
                </g>
              );
            })}

          {/* Train Trajectory Slanted Paths */}
          {showTrains &&
            movements.map((mov) => {
              // Convert trajectory points to SVG path
              const pathData = mov.trajectory
                .map((pt, idx) => {
                  const x = timeToX(pt.minutesFromMidnight);
                  const y = kmToY(pt.km);
                  return `${idx === 0 ? "M" : "L"} ${x} ${y}`;
                })
                .join(" ");

              const firstPoint = mov.trajectory[0];
              const labelX = timeToX(firstPoint.minutesFromMidnight) + 6;
              const labelY = kmToY(firstPoint.km) + (mov.direction === "DOWN" ? 14 : -8);

              return (
                <g key={mov.trainId} className="group cursor-pointer">
                  {/* Trajectory String */}
                  <path
                    d={pathData}
                    fill="none"
                    stroke={mov.color}
                    strokeWidth={mov.isForecast ? "2.5" : "3"}
                    strokeDasharray={mov.isForecast ? "6 4" : undefined}
                    className="transition-all hover:stroke-white hover:stroke-[4]"
                  />

                  {/* Trajectory Points */}
                  {mov.trajectory.map((pt, pIdx) => (
                    <circle
                      key={pIdx}
                      cx={timeToX(pt.minutesFromMidnight)}
                      cy={kmToY(pt.km)}
                      r="3.5"
                      fill={mov.color}
                      stroke="#070e1c"
                      strokeWidth="1.5"
                    />
                  ))}

                  {/* Train Service Number Tag */}
                  <text
                    x={labelX}
                    y={labelY}
                    fill={mov.color}
                    fontSize="10"
                    fontWeight="bold"
                    fontFamily="monospace"
                  >
                    {mov.serviceNumber} ({mov.trainName})
                  </text>
                </g>
              );
            })}
        </svg>
      </div>

      {/* Legend & Conflict status footer */}
      <div className="flex items-center justify-between pt-2 text-xs text-slate-400">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-1 bg-[#38bdf8] rounded-full"></span>
            <span>Vande Bharat (20833)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-1 bg-[#ef4444] rounded-full"></span>
            <span>Rajdhani (12723)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-1 bg-[#f59e0b] rounded-full"></span>
            <span>Amrit Bharat (12076)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-1 bg-[#a855f7] rounded-full"></span>
            <span>Shatabdi (12951)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-1 bg-[#10b981] border-b border-dashed border-emerald-400"></span>
            <span>Freight (G/4217 Forecast)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 bg-amber-500/30 border border-amber-500 rounded-sm"></span>
            <span>Maintenance Block B-014</span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-emerald-400 font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>0 Timetable Conflicts Detected</span>
        </div>
      </div>
    </div>
  );
}
