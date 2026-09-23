"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface SimSignal {
  id: string;
  name: string;
  km: number;
  track: "UP" | "DN";
  aspect: "GREEN" | "YELLOW" | "DOUBLE_YELLOW" | "RED";
  reason?: string;
}

interface SignalVisualProps {
  signal: SimSignal;
  isSelected: boolean;
  onClick: () => void;
}

export function SignalVisual({ signal, isSelected, onClick }: SignalVisualProps) {
  const isRed = signal.aspect === "RED";
  const isYellow = signal.aspect === "YELLOW" || signal.aspect === "DOUBLE_YELLOW";
  const isGreen = signal.aspect === "GREEN";

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className={cn(
        "cursor-pointer select-none flex flex-col items-center group relative z-30 transition-transform",
        isSelected ? "scale-110" : "hover:scale-105"
      )}
      title={`${signal.name} (KM ${signal.km}) · Aspect: ${signal.aspect}`}
    >
      {/* 4-Aspect Signal Head Box */}
      <div
        className={cn(
          "w-4.5 h-11 rounded-t-md rounded-b-xs bg-slate-950 border p-0.5 flex flex-col justify-between items-center shadow-lg transition-all",
          isSelected
            ? "border-sky-400 ring-2 ring-sky-400/50 shadow-[0_0_10px_rgba(56,189,248,0.5)]"
            : "border-slate-700"
        )}
      >
        {/* Lamp 1: Green */}
        <div
          className={cn(
            "w-2.5 h-2.5 rounded-full border border-black/80 transition-all",
            isGreen
              ? "bg-emerald-400 shadow-[0_0_8px_#34d399]"
              : "bg-emerald-950/40"
          )}
        />

        {/* Lamp 2: Yellow */}
        <div
          className={cn(
            "w-2.5 h-2.5 rounded-full border border-black/80 transition-all",
            isYellow
              ? "bg-amber-400 shadow-[0_0_8px_#fbbf24]"
              : "bg-amber-950/40"
          )}
        />

        {/* Lamp 3: Red */}
        <div
          className={cn(
            "w-2.5 h-2.5 rounded-full border border-black/80 transition-all",
            isRed
              ? "bg-red-500 shadow-[0_0_10px_#ef4444] animate-pulse"
              : "bg-red-950/40"
          )}
        />
      </div>

      {/* Steel Mast Post */}
      <div className="w-1 h-5 bg-gradient-to-b from-slate-400 to-slate-700 shadow-xs" />
      {/* Ground Concrete Foundation Base */}
      <div className="w-3 h-1 bg-slate-600 rounded-t-xs" />

      {/* Signal Name Label Below */}
      <div className="mt-0.5 px-1 py-0.2 rounded bg-black/80 border border-slate-700 text-[8px] font-mono text-slate-300 font-bold whitespace-nowrap">
        {signal.id}
      </div>
    </div>
  );
}
