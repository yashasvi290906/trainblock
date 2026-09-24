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
    <div className="bg-slate-100 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 px-4 py-2.5 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs font-mono select-none text-slate-700 dark:text-slate-400">
      {/* Operational Indicators */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-1.5">
          <span className="text-slate-500 dark:text-slate-500 uppercase font-bold text-xs">Corridor:</span>
          <span className="font-bold text-slate-900 dark:text-slate-200 text-xs">SEC (KM 40) → NDL (KM 120) · 80 KM</span>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-blue-500" />
          <span className="text-slate-500 dark:text-slate-500 uppercase font-bold text-xs">Trains Active:</span>
          <span className="font-black text-slate-900 dark:text-white text-xs">{activeTrainsCount}</span>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-amber-500" />
          <span className="text-slate-500 dark:text-slate-500 uppercase font-bold text-xs">Blocks:</span>
          <span className="font-black text-amber-700 dark:text-amber-300 text-xs">{activeBlocksCount} (B-014)</span>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span className="text-slate-500 dark:text-slate-500 uppercase font-bold text-xs">Protected:</span>
          <span className="font-black text-emerald-700 dark:text-emerald-400 text-xs">{protectedTrainsCount}/{protectedTrainsCount}</span>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-purple-500" />
          <span className="text-slate-500 dark:text-slate-500 uppercase font-bold text-xs">Goods Forecast:</span>
          <span className="font-black text-purple-700 dark:text-purple-300 text-xs">{goodsForecastCount}</span>
        </div>

        <div className="flex items-center gap-1.5">
          <span
            className={cn(
              "w-2 h-2 rounded-full",
              conflictsCount > 0 ? "bg-red-500 animate-pulse" : "bg-slate-400 dark:bg-slate-600"
            )}
          />
          <span className="text-slate-500 dark:text-slate-500 uppercase font-bold text-xs">Clashes:</span>
          <span className={cn("font-black text-xs", conflictsCount > 0 ? "text-red-600 dark:text-red-400" : "text-slate-700 dark:text-slate-400")}>
            {conflictsCount}
          </span>
        </div>
      </div>

      {/* Visual Legend */}
      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 dark:text-slate-400 border-t md:border-t-0 md:border-l border-slate-300 dark:border-slate-800 pt-1.5 md:pt-0 md:pl-4">
        <div className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-xs bg-blue-500" />
          <span className="font-semibold text-slate-800 dark:text-slate-200">Passenger</span>
        </div>

        <div className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-xs bg-emerald-600" />
          <span className="font-semibold text-slate-800 dark:text-slate-200">Freight</span>
        </div>

        <div className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-xs border-2 border-dashed border-purple-500" />
          <span className="font-semibold text-slate-800 dark:text-slate-200">Forecast</span>
        </div>

        <div className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-xs bg-amber-500" />
          <span className="font-semibold text-slate-800 dark:text-slate-200">Block B-014</span>
        </div>

        <div className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-red-500" />
          <span className="font-semibold text-slate-800 dark:text-slate-200">Signal</span>
        </div>
      </div>
    </div>
  );
}
