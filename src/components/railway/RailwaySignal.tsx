"use client";

import React from "react";
import { cn } from "@/lib/utils";

export type SignalAspect = "CLEAR" | "CAUTION" | "STOP";

interface RailwaySignalProps {
  aspect: SignalAspect;
  label?: string;
  className?: string;
  size?: "sm" | "md";
}

export function RailwaySignal({
  aspect,
  label,
  className,
  size = "md",
}: RailwaySignalProps) {
  const isSm = size === "sm";

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 font-mono select-none",
        className
      )}
      title={`Signal Aspect: ${aspect}`}
    >
      {/* 3-Aspect Lamp Housing */}
      <div
        className={cn(
          "bg-slate-900 border border-slate-700 rounded-full flex items-center justify-center p-0.5 gap-1 shadow-inner",
          isSm ? "h-4 px-1" : "h-5 px-1.5"
        )}
      >
        {/* Red Lamp */}
        <span
          className={cn(
            "rounded-full transition-all duration-200",
            isSm ? "w-1.5 h-1.5" : "w-2 h-2",
            aspect === "STOP"
              ? "bg-red-600 shadow-[0_0_8px_rgba(220,38,38,0.9)]"
              : "bg-red-950/40 opacity-30"
          )}
        />
        {/* Amber Lamp */}
        <span
          className={cn(
            "rounded-full transition-all duration-200",
            isSm ? "w-1.5 h-1.5" : "w-2 h-2",
            aspect === "CAUTION"
              ? "bg-amber-500 shadow-[0_0_8px_rgba(217,119,6,0.9)]"
              : "bg-amber-950/40 opacity-30"
          )}
        />
        {/* Green Lamp */}
        <span
          className={cn(
            "rounded-full transition-all duration-200",
            isSm ? "w-1.5 h-1.5" : "w-2 h-2",
            aspect === "CLEAR"
              ? "bg-emerald-500 shadow-[0_0_8px_rgba(5,150,105,0.9)]"
              : "bg-emerald-950/40 opacity-30"
          )}
        />
      </div>

      {label && (
        <span className="text-[10px] text-slate-600 font-semibold uppercase tracking-wider">
          {label}
        </span>
      )}
    </div>
  );
}
