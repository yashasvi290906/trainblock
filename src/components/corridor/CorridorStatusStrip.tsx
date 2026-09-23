"use client";

import React from "react";
import { TrainTrack, ShieldCheck, MapPin, Zap, Radio, Layers, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface CorridorStatusStripProps {
  activeTrainsCount: number;
  activeBlocksCount: number;
  protectedTrainsCount: number;
  goodsForecastCount: number;
  conflictsCount: number;
}

export function CorridorStatusStrip({
  activeTrainsCount = 6,
  activeBlocksCount = 1,
  protectedTrainsCount = 4,
  goodsForecastCount = 1,
  conflictsCount = 0,
}: CorridorStatusStripProps) {
  return (
    <div className="bg-slate-950 border-t border-slate-800 px-4 py-2 flex flex-col md:flex-row md:items-center justify-between gap-3 text-[11px] font-mono select-none text-slate-400">
      {/* Operational Indicators */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-1.5">
          <span className="text-slate-500 uppercase">Corridor:</span>
          <span className="font-bold text-slate-200">SEC (KM 40) → NDL (KM 120) · 80 KM</span>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
          <span className="text-slate-500 uppercase">Trains Active:</span>
          <span className="font-bold text-white">{activeTrainsCount}</span>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
          <span className="text-slate-500 uppercase">Blocks:</span>
          <span className="font-bold text-amber-300">{activeBlocksCount} (B-014)</span>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span className="text-slate-500 uppercase">Protected:</span>
          <span className="font-bold text-emerald-400">{protectedTrainsCount}/{protectedTrainsCount}</span>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
          <span className="text-slate-500 uppercase">Goods Forecast:</span>
          <span className="font-bold text-purple-300">{goodsForecastCount}</span>
        </div>

        <div className="flex items-center gap-1.5">
          <span
            className={cn(
              "w-1.5 h-1.5 rounded-full",
              conflictsCount > 0 ? "bg-red-500 animate-pulse" : "bg-slate-600"
            )}
          />
          <span className="text-slate-500 uppercase">Clashes:</span>
          <span className={cn("font-bold", conflictsCount > 0 ? "text-red-400" : "text-slate-400")}>
            {conflictsCount}
          </span>
        </div>
      </div>

      {/* Visual Legend */}
      <div className="flex flex-wrap items-center gap-3 text-[10px] text-slate-500 border-t md:border-t-0 md:border-l border-slate-800 pt-1 md:pt-0 md:pl-4">
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-xs bg-sky-500" />
          <span className="text-slate-300">Passenger</span>
        </div>

        <div className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-xs bg-emerald-600" />
          <span className="text-slate-300">Freight</span>
        </div>

        <div className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-xs border border-dashed border-purple-400" />
          <span className="text-slate-300">Forecast</span>
        </div>

        <div className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-xs bg-amber-500/80" />
          <span className="text-slate-300">Block B-014</span>
        </div>

        <div className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
          <span className="text-slate-300">Signal</span>
        </div>
      </div>
    </div>
  );
}
