"use client";

import React from "react";
import { Wrench, Radio, Zap, Shield, HardHat, AlertTriangle, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SimBlock {
  id: string;
  name: string;
  startKm: number;
  endKm: number;
  track: "UP" | "DN" | "BOTH";
  startTime: string;
  endTime: string;
  durationMin: number;
  usableMin: number;
  status: "PROTECTED" | "DENIED" | "REPLANNED";
  departments: ("ENGINEERING" | "S&T" | "TRACTION")[];
  taskCount: number;
  machinery: string[];
  tasks: { id: string; dept: string; desc: string; km: string }[];
}

interface MaintenanceBlockVisualProps {
  block: SimBlock;
  isSelected: boolean;
  onClick: () => void;
  kmToPercent: (km: number) => number;
}

export function MaintenanceBlockVisual({
  block,
  isSelected,
  onClick,
  kmToPercent,
}: MaintenanceBlockVisualProps) {
  const leftPct = kmToPercent(block.startKm);
  const rightPct = kmToPercent(block.endKm);
  const widthPct = Math.max(12, rightPct - leftPct);

  if (block.status === "DENIED") return null;

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className={cn(
        "absolute top-0 bottom-0 z-10 rounded-lg cursor-pointer transition-all flex flex-col justify-between p-1 select-none overflow-hidden",
        isSelected
          ? "bg-amber-500/25 border-2 border-amber-400 ring-2 ring-amber-400/50 shadow-[0_0_15px_rgba(245,158,11,0.4)]"
          : "bg-amber-500/15 border border-dashed border-amber-400/80 hover:bg-amber-500/20"
      )}
      style={{
        left: `${leftPct}%`,
        width: `${widthPct}%`,
      }}
      title={`Active Possession ${block.id} (KM ${block.startKm}–${block.endKm}) · 3 Departments Integrated`}
    >
      {/* Top Protection Banner */}
      <div className="flex items-center justify-between bg-amber-950/90 text-amber-200 border border-amber-500/50 px-2 py-0.5 rounded font-mono text-[9px]">
        <div className="flex items-center gap-1 font-bold">
          <Shield className="w-2.5 h-2.5 text-amber-400" />
          <span>POSSESSION {block.id}</span>
          <span className="text-amber-400">({block.startTime}–{block.endTime})</span>
        </div>
        <span className="font-sans font-semibold text-[8px] bg-amber-500/20 px-1 rounded">
          {block.usableMin}m Usable
        </span>
      </div>

      {/* Center Trackside Work Zones (3 Departments Integrated) */}
      <div className="flex items-center justify-around gap-1 my-auto">
        {/* Department 1: Engineering */}
        <div className="flex items-center gap-1 bg-black/70 border border-amber-500/40 px-1.5 py-0.5 rounded text-[8px] font-mono text-amber-300">
          <Wrench className="w-2.5 h-2.5 text-amber-400 shrink-0" />
          <span className="hidden sm:inline">ENG: Tamping (CTM-04)</span>
          <span className="sm:hidden">ENG</span>
        </div>

        {/* Department 2: S&T */}
        <div className="flex items-center gap-1 bg-black/70 border border-sky-500/40 px-1.5 py-0.5 rounded text-[8px] font-mono text-sky-300">
          <Radio className="w-2.5 h-2.5 text-sky-400 shrink-0" />
          <span className="hidden sm:inline">S&T: Axle Counter & Point</span>
          <span className="sm:hidden">S&T</span>
        </div>

        {/* Department 3: Traction */}
        <div className="flex items-center gap-1 bg-black/70 border border-purple-500/40 px-1.5 py-0.5 rounded text-[8px] font-mono text-purple-300">
          <Zap className="w-2.5 h-2.5 text-purple-400 shrink-0" />
          <span className="hidden sm:inline">TRD: Tower Wagon OHE</span>
          <span className="sm:hidden">TRD</span>
        </div>
      </div>

      {/* Bottom Limits: KM 68 Boundary Board -> KM 94 Boundary Board */}
      <div className="flex items-center justify-between text-[8px] font-mono text-amber-400 font-bold px-1">
        <span>▲ KM {block.startKm} LIMIT</span>
        <span className="text-amber-300/80 font-normal">7 CO-LOCATED TASKS</span>
        <span>KM {block.endKm} LIMIT ▲</span>
      </div>
    </div>
  );
}
