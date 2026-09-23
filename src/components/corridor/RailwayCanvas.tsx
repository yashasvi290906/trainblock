"use client";

import React from "react";
import { TrainVisual, SimTrain } from "./TrainVisual";
import { SignalVisual, SimSignal } from "./SignalVisual";
import { MaintenanceBlockVisual, SimBlock } from "./MaintenanceBlockVisual";
import { MapPin, Info, HardHat } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CorridorStation {
  id: string;
  code: string;
  name: string;
  km: number;
  platforms: number;
  tracks: number;
}

interface RailwayCanvasProps {
  stations: CorridorStation[];
  trains: SimTrain[];
  signals: SimSignal[];
  block: SimBlock;
  selectedEntity: { type: string; data: any };
  onSelectEntity: (entity: { type: "TRAIN" | "BLOCK" | "SIGNAL" | "STATION"; data: any }) => void;
  zoomMode: "MACRO" | "CORRIDOR" | "BLOCK";
  isDenied: boolean;
}

export function RailwayCanvas({
  stations,
  trains,
  signals,
  block,
  selectedEntity,
  onSelectEntity,
  zoomMode,
  isDenied,
}: RailwayCanvasProps) {
  // Zoom bounds in KM
  const kmBounds = {
    MACRO: { min: 40, max: 120 },
    CORRIDOR: { min: 45, max: 115 },
    BLOCK: { min: 64, max: 98 },
  }[zoomMode];

  const kmToPercent = (km: number) => {
    const clamped = Math.max(kmBounds.min, Math.min(kmBounds.max, km));
    return ((clamped - kmBounds.min) / (kmBounds.max - kmBounds.min)) * 100;
  };

  const isOheUnderMaintenance = !isDenied && block.status === "PROTECTED";

  return (
    <div className="flex-1 relative overflow-hidden flex flex-col justify-center px-4 sm:px-6 py-4 select-none bg-[#050b17]">
      {/* Subtle Background Radial Depth */}
      <div className="absolute inset-0 bg-radial-at-c from-[#081329] via-[#050b17] to-[#030710] pointer-events-none" />

      {/* KM Marker Ruler & Stations Axis */}
      <div className="relative w-full h-10 flex items-end border-b border-[#142340] mb-3">
        {/* Stations Markers */}
        {stations.map((stn) => {
          if (stn.km < kmBounds.min || stn.km > kmBounds.max) return null;
          const pct = kmToPercent(stn.km);
          const isSelected = selectedEntity?.type === "STATION" && selectedEntity?.data?.id === stn.id;

          return (
            <div
              key={stn.id}
              onClick={() => onSelectEntity({ type: "STATION", data: stn })}
              className={cn(
                "absolute -bottom-1 flex flex-col items-center transform -translate-x-1/2 cursor-pointer z-30 group transition-all",
                isSelected ? "scale-110" : "hover:scale-105"
              )}
              style={{ left: `${pct}%` }}
            >
              <div
                className={cn(
                  "flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono font-bold shadow-md transition-colors",
                  isSelected
                    ? "bg-blue-600 text-white ring-2 ring-sky-300"
                    : "bg-slate-900 border border-slate-700 text-slate-200 group-hover:border-slate-400"
                )}
              >
                <MapPin className="w-2.5 h-2.5 text-sky-400" />
                <span>{stn.code}</span>
              </div>
              <span className="text-[8.5px] font-mono text-slate-400">KM {stn.km}</span>
              <div className="w-0.5 h-2 bg-blue-500/60" />
            </div>
          );
        })}

        {/* Kilometer Ticks */}
        {Array.from({ length: 9 }).map((_, i) => {
          const kmVal = 40 + i * 10;
          if (kmVal < kmBounds.min || kmVal > kmBounds.max) return null;
          const pct = kmToPercent(kmVal);
          return (
            <div
              key={kmVal}
              className="absolute -bottom-1 flex flex-col items-center transform -translate-x-1/2 pointer-events-none opacity-40"
              style={{ left: `${pct}%` }}
            >
              <div className="w-0.5 h-1.5 bg-slate-600" />
            </div>
          );
        })}
      </div>

      {/* THE MAIN PHYSICAL RAILWAY TRACK ENVIRONMENT */}
      <div className="relative w-full h-[380px] bg-[#081122]/80 border border-[#162747] rounded-xl p-4 flex flex-col justify-between shadow-2xl backdrop-blur-sm">
        {/* Overhead Electrification (OHE) Catenary Structure Line */}
        <div className="relative h-6 flex items-center justify-between border-b border-dashed border-sky-400/20 px-2 pointer-events-none">
          {Array.from({ length: 18 }).map((_, idx) => (
            <div key={idx} className="relative flex flex-col items-center">
              {/* OHE Steel Mast */}
              <div
                className={cn(
                  "w-1 h-5 rounded-t transition-colors",
                  isOheUnderMaintenance && idx >= 7 && idx <= 13 ? "bg-amber-400/80" : "bg-slate-500/50"
                )}
              />
              {/* Insulator */}
              <div
                className={cn(
                  "w-2 h-1 -mt-4 rounded-xs transition-colors",
                  isOheUnderMaintenance && idx >= 7 && idx <= 13 ? "bg-amber-300 shadow-[0_0_6px_#f59e0b]" : "bg-sky-400/60"
                )}
              />
            </div>
          ))}
          <span className="absolute left-2 top-0.5 text-[8.5px] font-mono text-sky-400/70 font-bold">
            25kV AC TRACTION OHE CATENARY
          </span>
        </div>

        {/* ----------------- UP TRACK (Towards Secunderabad, KM 120 -> 40) ----------------- */}
        <div className="relative h-28 flex flex-col justify-center">
          <div className="absolute left-2 top-0 text-[10px] font-mono text-emerald-400/80 font-bold tracking-widest flex items-center gap-1.5">
            <span>← UP LINE (WESTBOUND · TOWARDS SECUNDERABAD)</span>
            <span className="px-1.5 py-0.2 bg-emerald-500/10 text-emerald-400 rounded text-[9px] border border-emerald-500/20">
              MAX 130 KM/H · PERMITTED
            </span>
          </div>

          {/* Track Geometry: Ballast bed, Sleepers, Steel Rails */}
          <div className="relative w-full h-14 bg-[#1b2332] rounded-md border-y border-[#2d3b55] flex items-center overflow-hidden shadow-inner">
            {/* Ballast Texture & Sleepers (Ties) Pattern */}
            <div
              className="absolute inset-0 opacity-40 pointer-events-none"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(90deg, #101827, #101827 8px, #374151 8px, #374151 14px)",
              }}
            />
            {/* Centerline */}
            <div className="absolute inset-x-0 h-0.5 bg-slate-700/50 pointer-events-none" />
            {/* Rail 1 (Top Steel Line) */}
            <div className="absolute top-2.5 inset-x-0 h-1 bg-gradient-to-r from-slate-400 via-slate-100 to-slate-400 shadow-[0_0_4px_rgba(255,255,255,0.4)] pointer-events-none" />
            {/* Rail 2 (Bottom Steel Line) */}
            <div className="absolute bottom-2.5 inset-x-0 h-1 bg-gradient-to-r from-slate-400 via-slate-100 to-slate-400 shadow-[0_0_4px_rgba(255,255,255,0.4)] pointer-events-none" />

            {/* Moving Trains on UP Track */}
            {trains
              .filter((t) => t.track === "UP")
              .map((t) => {
                if (t.currentKm < kmBounds.min || t.currentKm > kmBounds.max) return null;
                const leftPct = kmToPercent(t.currentKm);
                const isSelected = selectedEntity?.type === "TRAIN" && selectedEntity?.data?.id === t.id;

                return (
                  <div
                    key={t.id}
                    className="absolute z-20 transform -translate-x-1/2 top-1/2 -translate-y-1/2"
                    style={{ left: `${leftPct}%` }}
                  >
                    <TrainVisual
                      train={t}
                      isSelected={isSelected}
                      onClick={() => onSelectEntity({ type: "TRAIN", data: t })}
                    />
                  </div>
                );
              })}
          </div>
        </div>

        {/* Center Inter-Track Signal Strip */}
        <div className="relative h-12 flex items-center justify-between px-2">
          {signals.map((sig) => {
            if (sig.km < kmBounds.min || sig.km > kmBounds.max) return null;
            const leftPct = kmToPercent(sig.km);
            const isSelected = selectedEntity?.type === "SIGNAL" && selectedEntity?.data?.id === sig.id;

            return (
              <div
                key={sig.id}
                className="absolute transform -translate-x-1/2"
                style={{ left: `${leftPct}%` }}
              >
                <SignalVisual
                  signal={sig}
                  isSelected={isSelected}
                  onClick={() => onSelectEntity({ type: "SIGNAL", data: sig })}
                />
              </div>
            );
          })}
        </div>

        {/* ----------------- DOWN TRACK (Towards Nandyal, KM 40 -> 120) ----------------- */}
        <div className="relative h-28 flex flex-col justify-center">
          <div className="absolute left-2 top-0 text-[10px] font-mono text-sky-400/80 font-bold tracking-widest flex items-center gap-1.5">
            <span>→ DOWN LINE (EASTBOUND · TOWARDS NANDYAL)</span>
            <span className="px-1.5 py-0.2 bg-amber-500/10 text-amber-300 rounded text-[9px] border border-amber-500/20">
              {block.status === "PROTECTED" ? "POSSESSION B-014 ACTIVE (KM 68–94)" : "NORMAL CAPACITY"}
            </span>
          </div>

          {/* Track Geometry: Ballast bed, Sleepers, Steel Rails */}
          <div className="relative w-full h-14 bg-[#1b2332] rounded-md border-y border-[#2d3b55] flex items-center overflow-hidden shadow-inner">
            {/* Ballast Texture & Sleepers Pattern */}
            <div
              className="absolute inset-0 opacity-40 pointer-events-none"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(90deg, #101827, #101827 8px, #374151 8px, #374151 14px)",
              }}
            />
            {/* Centerline */}
            <div className="absolute inset-x-0 h-0.5 bg-slate-700/50 pointer-events-none" />
            {/* Rail 1 (Top Steel Line) */}
            <div className="absolute top-2.5 inset-x-0 h-1 bg-gradient-to-r from-slate-400 via-slate-100 to-slate-400 shadow-[0_0_4px_rgba(255,255,255,0.4)] pointer-events-none" />
            {/* Rail 2 (Bottom Steel Line) */}
            <div className="absolute bottom-2.5 inset-x-0 h-1 bg-gradient-to-r from-slate-400 via-slate-100 to-slate-400 shadow-[0_0_4px_rgba(255,255,255,0.4)] pointer-events-none" />

            {/* PHYSICAL MAINTENANCE BLOCK B-014 (KM 68 - 94) */}
            <MaintenanceBlockVisual
              block={block}
              isSelected={selectedEntity?.type === "BLOCK" && selectedEntity?.data?.id === block.id}
              onClick={() => onSelectEntity({ type: "BLOCK", data: block })}
              kmToPercent={kmToPercent}
            />

            {/* Moving Trains on DOWN Track */}
            {trains
              .filter((t) => t.track === "DN")
              .map((t) => {
                if (t.currentKm < kmBounds.min || t.currentKm > kmBounds.max) return null;
                const leftPct = kmToPercent(t.currentKm);
                const isSelected = selectedEntity?.type === "TRAIN" && selectedEntity?.data?.id === t.id;

                return (
                  <div
                    key={t.id}
                    className="absolute z-20 transform -translate-x-1/2 top-1/2 -translate-y-1/2"
                    style={{ left: `${leftPct}%` }}
                  >
                    <TrainVisual
                      train={t}
                      isSelected={isSelected}
                      onClick={() => onSelectEntity({ type: "TRAIN", data: t })}
                    />
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
}
