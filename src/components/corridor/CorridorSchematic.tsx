"use client";

import React, { useState } from "react";
import { Corridor, Train } from "@/types/railway";
import { Block } from "@/types/planning";
import { formatKm } from "@/lib/formatting";
import { cn } from "@/lib/utils";
import { TrainTrack, Wrench, Zap, AlertCircle, Eye } from "lucide-react";
import Link from "next/link";

interface CorridorSchematicProps {
  corridor: Corridor;
  trains: Train[];
  blocks: Block[];
  selectedBlockId?: string;
  onSelectBlock?: (blockId: string) => void;
  className?: string;
}

export function CorridorSchematic({
  corridor,
  trains,
  blocks,
  selectedBlockId = "B-014",
  onSelectBlock,
  className,
}: CorridorSchematicProps) {
  const [hoveredTrain, setHoveredTrain] = useState<Train | null>(null);
  const [hoveredBlock, setHoveredBlock] = useState<Block | null>(null);

  const totalKm = corridor.length; // 128 km

  const getPercent = (km: number) => {
    return (km / totalKm) * 100;
  };

  return (
    <div className={cn("bg-[#0c1527] border border-[#1a2948] rounded-lg p-4 shadow-md", className)}>
      {/* Header bar */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-sky-400"></div>
          <h3 className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
            Corridor Overview — SEC to NDL ({corridor.length} km)
          </h3>
          <span className="text-[11px] text-slate-400 font-mono bg-[#131f38] px-2 py-0.5 rounded border border-[#1e2f52]">
            Double Line (130 km/h)
          </span>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-[11px] text-slate-400">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-sky-400"></span>
            <span>Passenger Train</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-emerald-400"></span>
            <span>Freight Train</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-2 rounded-sm bg-amber-500/40 border border-amber-500"></span>
            <span>Maintenance Block</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>Signal (Green/Red)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-white border border-slate-400"></span>
            <span>Station</span>
          </div>
        </div>
      </div>

      {/* Schematic Container */}
      <div className="relative pt-6 pb-8 px-4 bg-[#080e1b] rounded border border-[#15233e]">
        {/* Station Markers on top */}
        <div className="relative w-full h-8 mb-2">
          {corridor.stations.map((stn) => {
            const leftPos = getPercent(stn.km);
            return (
              <div
                key={stn.code}
                className="absolute transform -translate-x-1/2 flex flex-col items-center group cursor-pointer"
                style={{ left: `${leftPos}%` }}
              >
                <span className="text-[11px] font-bold text-slate-200 group-hover:text-sky-300 transition-colors">
                  {stn.code}
                </span>
                <span className="text-[9.5px] font-mono text-slate-400">{stn.km} km</span>
                <div className="w-2.5 h-2.5 rounded-full bg-slate-200 border-2 border-slate-900 mt-1 shadow-[0_0_8px_rgba(255,255,255,0.4)] group-hover:bg-sky-400"></div>
              </div>
            );
          })}
        </div>

        {/* Tracks Section */}
        <div className="relative my-4 space-y-4">
          {/* UP Line Track */}
          <div className="relative h-2 bg-[#1a2b4c] rounded-full border-t border-b border-[#2e4573]">
            <span className="absolute -left-12 -top-1.5 text-[9px] font-mono text-slate-400">
              UP LINE
            </span>

            {/* Signals on UP line */}
            {corridor.signals
              .filter((s) => s.direction === "UP")
              .map((sig) => (
                <div
                  key={sig.id}
                  className="absolute -top-3 transform -translate-x-1/2 cursor-pointer"
                  style={{ left: `${getPercent(sig.km)}%` }}
                  title={`${sig.id} (${sig.type}) - ${sig.aspect}`}
                >
                  <span
                    className={cn(
                      "block w-2 h-2 rounded-full shadow-sm",
                      sig.aspect === "GREEN"
                        ? "bg-emerald-400 pulse-signal-green"
                        : sig.aspect === "RED"
                        ? "bg-rose-500 pulse-signal-red"
                        : "bg-amber-400"
                    )}
                  ></span>
                </div>
              ))}

            {/* Trains on UP line */}
            {trains
              .filter((t) => t.direction === "UP")
              .map((trn) => {
                const pos = getPercent(trn.currentKm);
                return (
                  <div
                    key={trn.id}
                    className="absolute -top-3.5 transform -translate-x-1/2 z-10 cursor-pointer group"
                    style={{ left: `${pos}%` }}
                    onMouseEnter={() => setHoveredTrain(trn)}
                    onMouseLeave={() => setHoveredTrain(null)}
                  >
                    <div
                      className={cn(
                        "px-2 py-0.5 rounded text-[10px] font-mono font-bold flex items-center gap-1 shadow-md border transition-transform group-hover:scale-110",
                        trn.isForecast
                          ? "bg-emerald-950/90 text-emerald-300 border-emerald-500 border-dashed"
                          : "bg-purple-900/90 text-purple-200 border-purple-400"
                      )}
                    >
                      <span>← {trn.serviceNumber}</span>
                    </div>
                  </div>
                );
              })}
          </div>

          {/* DOWN Line Track */}
          <div className="relative h-2 bg-[#1a2b4c] rounded-full border-t border-b border-[#2e4573]">
            <span className="absolute -left-12 -top-1.5 text-[9px] font-mono text-slate-400">
              DN LINE
            </span>

            {/* Active Block Zone (e.g. B-014 KM 68 - 94) */}
            {blocks.map((blk) => {
              const startPct = getPercent(blk.kmStart);
              const widthPct = getPercent(blk.kmEnd - blk.kmStart);
              const isSelected = blk.blockId === selectedBlockId;

              return (
                <div
                  key={blk.blockId}
                  className={cn(
                    "absolute -top-3.5 h-9 rounded cursor-pointer transition-all border flex items-center justify-between px-2 z-0",
                    isSelected
                      ? "bg-amber-500/25 border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.25)]"
                      : "bg-amber-500/15 border-amber-600/70 hover:bg-amber-500/20"
                  )}
                  style={{ left: `${startPct}%`, width: `${widthPct}%` }}
                  onClick={() => onSelectBlock?.(blk.blockId)}
                  onMouseEnter={() => setHoveredBlock(blk)}
                  onMouseLeave={() => setHoveredBlock(null)}
                >
                  <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-amber-300">
                    <Wrench className="w-3 h-3 text-amber-400" />
                    <span>
                      {blk.blockId} ({formatKm(blk.kmStart)}–{blk.kmEnd})
                    </span>
                  </div>
                  <div className="text-[9px] font-mono bg-amber-950/80 px-1 py-0.5 rounded text-amber-200 border border-amber-700/50">
                    {blk.startTime}–{blk.endTime}
                  </div>
                </div>
              );
            })}

            {/* Signals on DOWN line */}
            {corridor.signals
              .filter((s) => s.direction === "DOWN")
              .map((sig) => (
                <div
                  key={sig.id}
                  className="absolute -bottom-3 transform -translate-x-1/2 cursor-pointer"
                  style={{ left: `${getPercent(sig.km)}%` }}
                  title={`${sig.id} (${sig.type}) - ${sig.aspect}`}
                >
                  <span
                    className={cn(
                      "block w-2 h-2 rounded-full shadow-sm",
                      sig.aspect === "GREEN"
                        ? "bg-emerald-400 pulse-signal-green"
                        : sig.aspect === "RED"
                        ? "bg-rose-500 pulse-signal-red"
                        : "bg-amber-400"
                    )}
                  ></span>
                </div>
              ))}

            {/* Trains on DOWN line */}
            {trains
              .filter((t) => t.direction === "DOWN")
              .map((trn) => {
                const pos = getPercent(trn.currentKm);
                return (
                  <div
                    key={trn.id}
                    className="absolute -top-3.5 transform -translate-x-1/2 z-10 cursor-pointer group"
                    style={{ left: `${pos}%` }}
                    onMouseEnter={() => setHoveredTrain(trn)}
                    onMouseLeave={() => setHoveredTrain(null)}
                  >
                    <div
                      className={cn(
                        "px-2 py-0.5 rounded text-[10px] font-mono font-bold flex items-center gap-1 shadow-md border transition-transform group-hover:scale-110",
                        trn.isForecast
                          ? "bg-emerald-950/90 text-emerald-300 border-emerald-500 border-dashed"
                          : trn.type === "Vande Bharat"
                          ? "bg-sky-950/95 text-sky-200 border-sky-400 shadow-[0_0_8px_rgba(56,189,248,0.3)]"
                          : trn.type === "Rajdhani"
                          ? "bg-rose-950/95 text-rose-200 border-rose-400"
                          : "bg-amber-950/95 text-amber-200 border-amber-400"
                      )}
                    >
                      <span>{trn.serviceNumber} →</span>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>

        {/* KM Axis Scale */}
        <div className="relative w-full h-4 mt-6 border-t border-[#1e2f52] flex justify-between text-[9px] font-mono text-slate-400 pt-1">
          {corridor.kmMarkers.map((km) => (
            <div
              key={km}
              className="absolute transform -translate-x-1/2 flex flex-col items-center"
              style={{ left: `${getPercent(km)}%` }}
            >
              <div className="w-[1px] h-1.5 bg-[#2a3e66]"></div>
              <span>{km}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Hover Info Tooltip Banner */}
      {(hoveredTrain || hoveredBlock) && (
        <div className="mt-3 p-2 bg-[#091222] border border-[#1e3054] rounded text-xs flex items-center justify-between animate-fadeIn">
          {hoveredTrain && (
            <div className="flex items-center gap-3">
              <span className="font-bold text-sky-400 font-mono">
                {hoveredTrain.serviceNumber} ({hoveredTrain.name})
              </span>
              <span className="text-slate-400">
                Type: <strong className="text-slate-200">{hoveredTrain.type}</strong>
              </span>
              <span className="text-slate-400">
                Speed: <strong className="text-slate-200 mono-num">{hoveredTrain.speed} km/h</strong>
              </span>
              <span className="text-slate-400">
                Location: <strong className="text-slate-200 font-mono">{formatKm(hoveredTrain.currentKm)}</strong>
              </span>
              <span className="text-slate-400">
                Route: <strong className="text-slate-200">{hoveredTrain.origin} → {hoveredTrain.destination}</strong>
              </span>
            </div>
          )}
          {hoveredBlock && (
            <div className="flex items-center gap-3">
              <span className="font-bold text-amber-400 font-mono">
                Block {hoveredBlock.blockId} ({hoveredBlock.section})
              </span>
              <span className="text-slate-400">
                Time: <strong className="text-slate-200 mono-num">{hoveredBlock.startTime} – {hoveredBlock.endTime}</strong>
              </span>
              <span className="text-slate-400">
                Range: <strong className="text-slate-200 font-mono">{formatKm(hoveredBlock.kmStart)} – {formatKm(hoveredBlock.kmEnd)}</strong>
              </span>
              <span className="text-slate-400">
                Depts: <strong className="text-slate-200">{hoveredBlock.departments.join(" + ")}</strong>
              </span>
              <span className="text-slate-400">
                Utilization: <strong className="text-emerald-400 mono-num">{hoveredBlock.utilization}%</strong>
              </span>
            </div>
          )}
          <Link
            href={`/blocks/${selectedBlockId}`}
            className="text-[11px] text-sky-400 hover:underline flex items-center gap-1 shrink-0 ml-4 font-medium"
          >
            <Eye className="w-3 h-3" /> View Block Dossier
          </Link>
        </div>
      )}
    </div>
  );
}
