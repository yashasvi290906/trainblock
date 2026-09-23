"use client";

import React, { useRef, useEffect, useState } from "react";
import { Corridor, Train } from "@/types/railway";
import { Block } from "@/types/planning";
import { formatKm } from "@/lib/formatting";
import { cn } from "@/lib/utils";
import {
  Play,
  Pause,
  RotateCcw,
  Zap,
  Wrench,
  Shield,
  Gauge,
  Layers,
  ZoomIn,
  ZoomOut,
  Maximize2,
} from "lucide-react";

interface LiveCorridorCanvasProps {
  corridor: Corridor;
  trains: Train[];
  blocks: Block[];
  className?: string;
}

export function LiveCorridorCanvas({
  corridor,
  trains,
  blocks,
  className,
}: LiveCorridorCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [activeBlock, setActiveBlock] = useState<Block | null>(blocks[0] || null);
  const [selectedTrain, setSelectedTrain] = useState<Train | null>(trains[0] || null);
  const [zoom, setZoom] = useState(1);

  // Local state for train positions to animate along track
  const [trainPositions, setTrainPositions] = useState<Record<string, number>>({
    "TRN-20833": 28,
    "TRN-12723": 62,
    "TRN-12076": 108,
    "TRN-12951": 84,
    "TRN-G4217": 44,
  });

  // Animation Loop
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setTrainPositions((prev) => {
        const next = { ...prev };
        trains.forEach((t) => {
          const current = next[t.id] ?? t.currentKm;
          if (t.direction === "DOWN") {
            // Move toward NDL (128km)
            next[t.id] = current >= 128 ? 0 : current + 0.15;
          } else {
            // Move toward SEC (0km)
            next[t.id] = current <= 0 ? 128 : current - 0.15;
          }
        });
        return next;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [isPlaying, trains]);

  // Render on HTML5 Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Clear background
    ctx.fillStyle = "#070e1c";
    ctx.fillRect(0, 0, width, height);

    // Draw Grid
    ctx.strokeStyle = "rgba(30, 44, 74, 0.4)";
    ctx.lineWidth = 1;
    for (let x = 0; x < width; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    const paddingX = 70;
    const trackWidth = width - paddingX * 2;
    const kmToX = (km: number) => paddingX + (km / 128) * trackWidth;

    const upLineY = height * 0.42;
    const downLineY = height * 0.58;

    // Draw Tracks
    const drawTrack = (y: number, label: string) => {
      // Ballast Bed
      ctx.fillStyle = "#111c33";
      ctx.fillRect(paddingX - 10, y - 12, trackWidth + 20, 24);

      // Sleepers (ties)
      ctx.strokeStyle = "#1e2e4e";
      ctx.lineWidth = 3;
      for (let x = paddingX; x <= paddingX + trackWidth; x += 12) {
        ctx.beginPath();
        ctx.moveTo(x, y - 10);
        ctx.lineTo(x, y + 10);
        ctx.stroke();
      }

      // Steel Rails (2 parallel lines)
      ctx.strokeStyle = "#475569";
      ctx.lineWidth = 2.5;
      // Rail 1
      ctx.beginPath();
      ctx.moveTo(paddingX, y - 5);
      ctx.lineTo(paddingX + trackWidth, y - 5);
      ctx.stroke();
      // Rail 2
      ctx.beginPath();
      ctx.moveTo(paddingX, y + 5);
      ctx.lineTo(paddingX + trackWidth, y + 5);
      ctx.stroke();

      // Track Label
      ctx.fillStyle = "#94a3b8";
      ctx.font = "bold 10px monospace";
      ctx.fillText(label, 15, y + 3);
    };

    drawTrack(upLineY, "UP LINE");
    drawTrack(downLineY, "DN LINE");

    // Draw Stations
    corridor.stations.forEach((stn) => {
      const x = kmToX(stn.km);

      // Station Pillar line
      ctx.strokeStyle = "rgba(71, 85, 105, 0.5)";
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(x, 40);
      ctx.lineTo(x, height - 40);
      ctx.stroke();
      ctx.setLineDash([]);

      // Station Building Icon / Node
      ctx.fillStyle = "#1e293b";
      ctx.strokeStyle = "#38bdf8";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(x, 40, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = "#f8fafc";
      ctx.font = "bold 11px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(stn.code, x, 24);

      ctx.fillStyle = "#94a3b8";
      ctx.font = "10px monospace";
      ctx.fillText(`${stn.km} km`, x, height - 20);
    });

    // Draw Active Block B-014 (KM 68 to 94 on DOWN line)
    blocks.forEach((blk) => {
      const startX = kmToX(blk.kmStart);
      const endX = kmToX(blk.kmEnd);
      const blockWidth = endX - startX;

      // Work Zone Shaded Box
      ctx.fillStyle = "rgba(245, 158, 11, 0.15)";
      ctx.fillRect(startX, downLineY - 24, blockWidth, 48);

      // Hatched Border
      ctx.strokeStyle = "#f59e0b";
      ctx.lineWidth = 2;
      ctx.strokeRect(startX, downLineY - 24, blockWidth, 48);

      // Block Badge
      ctx.fillStyle = "#18150c";
      ctx.fillRect(startX + 10, downLineY - 38, 160, 24);
      ctx.strokeRect(startX + 10, downLineY - 38, 160, 24);

      ctx.fillStyle = "#fbbf24";
      ctx.font = "bold 10px monospace";
      ctx.textAlign = "left";
      ctx.fillText(`🔧 BLOCK ${blk.blockId} (KM ${blk.kmStart}-${blk.kmEnd})`, startX + 16, downLineY - 22);

      // Draw Maintenance Machinery / Crew icons
      ctx.fillStyle = "#d97706";
      ctx.beginPath();
      ctx.arc(startX + blockWidth * 0.35, downLineY, 7, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#ea580c";
      ctx.beginPath();
      ctx.arc(startX + blockWidth * 0.65, downLineY, 7, 0, Math.PI * 2);
      ctx.fill();
    });

    // Draw Signals
    corridor.signals.forEach((sig) => {
      const x = kmToX(sig.km);
      const y = sig.direction === "UP" ? upLineY - 20 : downLineY + 20;

      ctx.fillStyle = sig.aspect === "GREEN" ? "#10b981" : sig.aspect === "RED" ? "#f43f5e" : "#f59e0b";
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fill();
    });

    // Draw Moving Trains
    trains.forEach((trn) => {
      const currentKm = trainPositions[trn.id] ?? trn.currentKm;
      const x = kmToX(currentKm);
      const y = trn.direction === "UP" ? upLineY : downLineY;

      // Train Consist Body
      const trainLength = trn.type === "Freight" ? 48 : 36;
      ctx.fillStyle = trn.color;
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 1;

      ctx.beginPath();
      ctx.roundRect(x - trainLength / 2, y - 7, trainLength, 14, 4);
      ctx.fill();
      ctx.stroke();

      // Train Headlight / Direction Indicator
      ctx.fillStyle = "#ffffff";
      const headX = trn.direction === "DOWN" ? x + trainLength / 2 - 3 : x - trainLength / 2 + 3;
      ctx.beginPath();
      ctx.arc(headX, y, 2.5, 0, Math.PI * 2);
      ctx.fill();

      // Train Label Tag
      ctx.fillStyle = "#0c1527";
      ctx.fillRect(x - 24, y + (trn.direction === "UP" ? -26 : 14), 48, 14);
      ctx.strokeStyle = trn.color;
      ctx.strokeRect(x - 24, y + (trn.direction === "UP" ? -26 : 14), 48, 14);

      ctx.fillStyle = "#f8fafc";
      ctx.font = "bold 9px monospace";
      ctx.textAlign = "center";
      ctx.fillText(trn.serviceNumber, x, y + (trn.direction === "UP" ? -16 : 24));
    });
  }, [trainPositions, corridor, blocks, trains]);

  return (
    <div className={cn("bg-[#0c1527] border border-[#1a2948] rounded-lg overflow-hidden shadow-xl flex flex-col", className)}>
      {/* Simulation Top Bar Controls & HUD */}
      <div className="bg-[#091122] p-4 border-b border-[#182643] flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <h3 className="text-xs font-semibold text-white uppercase tracking-wider">
              Live Corridor Real-Time Simulation
            </h3>
            <span className="text-[10px] font-mono text-sky-400 bg-sky-950/60 border border-sky-800/40 px-2 py-0.5 rounded">
              SEC – NDL (128 km)
            </span>
          </div>

          <div className="flex items-center gap-1.5 bg-[#070e1c] p-1 rounded border border-[#16233d]">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-1.5 hover:bg-[#162440] rounded text-sky-400 font-medium text-xs flex items-center gap-1"
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isPlaying ? "Pause" : "Resume"}</span>
            </button>
            <button
              onClick={() =>
                setTrainPositions({
                  "TRN-20833": 28,
                  "TRN-12723": 62,
                  "TRN-12076": 108,
                  "TRN-12951": 84,
                  "TRN-G4217": 44,
                })
              }
              className="p-1.5 hover:bg-[#162440] rounded text-slate-400 hover:text-white"
              title="Reset Movements"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* HUD Metrics */}
        <div className="flex items-center gap-5 text-xs">
          <div className="flex items-center gap-2 bg-[#070e1c] px-3 py-1.5 rounded border border-[#16233d]">
            <span className="text-slate-400">Corridor Status:</span>
            <span className="text-emerald-400 font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Normal
            </span>
          </div>
          <div className="flex items-center gap-2 bg-[#070e1c] px-3 py-1.5 rounded border border-[#16233d]">
            <span className="text-slate-400">Trains on Section:</span>
            <span className="mono-num font-bold text-sky-400">4 Active + 1 Freight</span>
          </div>
          <div className="flex items-center gap-2 bg-[#070e1c] px-3 py-1.5 rounded border border-[#16233d]">
            <span className="text-slate-400">Active Possession:</span>
            <span className="mono-num font-bold text-amber-400">B-014 (KM 68–94)</span>
          </div>
        </div>
      </div>

      {/* HTML5 Canvas Viewport */}
      <div className="relative bg-[#070e1c] p-2 flex items-center justify-center">
        <canvas
          ref={canvasRef}
          width={1050}
          height={320}
          className="w-full h-auto rounded border border-[#14223b]"
        />
      </div>

      {/* Corridor Zoom Details Drawer / Active Block Spotlight */}
      {activeBlock && (
        <div className="p-4 bg-[#091122] border-t border-[#182643] flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <Wrench className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-white">
                  Active Possession: Block {activeBlock.blockId}
                </span>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
                  DN LINE · SAFE
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Section: <strong>{activeBlock.section}</strong> (KM {activeBlock.kmStart} – {activeBlock.kmEnd}) · Time: <strong>{activeBlock.startTime} – {activeBlock.endTime}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <div className="bg-[#070e1c] px-3 py-1.5 rounded border border-[#16233d]">
              <span className="text-slate-400">Integrated Depts:</span>
              <span className="text-slate-200 font-semibold ml-1.5">
                Engineering + S&T + Traction
              </span>
            </div>
            <div className="bg-[#070e1c] px-3 py-1.5 rounded border border-[#16233d]">
              <span className="text-slate-400">Machinery:</span>
              <span className="text-amber-300 font-semibold ml-1.5">
                CSM Tamping + Tower Wagon
              </span>
            </div>
            <div className="bg-[#070e1c] px-3 py-1.5 rounded border border-[#16233d]">
              <span className="text-slate-400">Workforce:</span>
              <span className="text-slate-200 font-semibold ml-1.5">
                47 Crew Members
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
