"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface SimTrain {
  id: string;
  number: string;
  name: string;
  type: "Vande Bharat" | "Rajdhani" | "Shatabdi" | "Amrit Bharat" | "Tejas" | "Freight" | "Goods Forecast";
  priority: "HIGH" | "MEDIUM" | "NORMAL" | "FREIGHT";
  track: "UP" | "DN";
  currentKm: number;
  baseKm: number;
  speed: number; // km/h
  direction: "UP" | "DN"; // UP = KM 120 -> 40 (Westbound), DN = KM 40 -> 120 (Eastbound)
  nextStation: string;
  etaNext: string;
  status: "RUNNING" | "APPROACHING" | "HOLDING" | "DWELLING" | "FORECAST";
  color: string;
  cars: number;
  lengthKm: number;
  isForecast?: boolean;
}

interface TrainVisualProps {
  train: SimTrain;
  isSelected: boolean;
  onClick: () => void;
}

export function TrainVisual({ train, isSelected, onClick }: TrainVisualProps) {
  const isEastbound = train.direction === "DN"; // Heading left to right
  const isForecast = train.isForecast || train.type === "Goods Forecast";
  const isHolding = train.status === "HOLDING";

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className={cn(
        "cursor-pointer select-none transition-all duration-150 group relative z-20",
        isForecast ? "opacity-75 hover:opacity-100" : "opacity-100"
      )}
      title={`${train.number} ${train.name} (${train.speed} km/h · KM ${train.currentKm})`}
    >
      {/* Train Consist Container */}
      <div
        className={cn(
          "flex items-center px-2 py-1 rounded-lg border shadow-xl backdrop-blur-sm transition-all",
          isEastbound ? "flex-row" : "flex-row-reverse",
          isSelected
            ? "ring-2 ring-sky-400 ring-offset-2 ring-offset-slate-950 bg-slate-900 border-sky-400 scale-105"
            : isHolding
            ? "bg-red-950/90 border-red-500 ring-2 ring-red-500/50"
            : isForecast
            ? "bg-purple-950/80 border-dashed border-purple-400"
            : "bg-slate-900/95 border-slate-700 hover:border-slate-400"
        )}
      >
        {/* Locomotive / Driving Power Unit */}
        <div
          className={cn(
            "relative w-7 h-6 flex items-center justify-center border border-black/40 shadow-sm shrink-0",
            isEastbound ? "rounded-r-md rounded-l-xs mr-1" : "rounded-l-md rounded-r-xs ml-1",
            train.type === "Vande Bharat"
              ? "bg-slate-100 border-blue-600"
              : train.type === "Rajdhani"
              ? "bg-red-600"
              : train.type === "Shatabdi"
              ? "bg-blue-600"
              : train.type === "Amrit Bharat"
              ? "bg-orange-600"
              : train.type === "Tejas"
              ? "bg-amber-500"
              : "bg-emerald-700"
          )}
        >
          {/* Aerodynamic Windshield & Headlight */}
          <div
            className={cn(
              "w-2.5 h-3 bg-slate-900 rounded-xs flex items-center justify-center",
              isEastbound ? "mr-1" : "ml-1"
            )}
          >
            {/* Illuminated Headlight */}
            <div
              className={cn(
                "w-1.5 h-1.5 rounded-full",
                isHolding ? "bg-amber-400 animate-pulse" : "bg-yellow-200 animate-pulse shadow-[0_0_8px_#fef08a]"
              )}
            />
          </div>

          {/* Locomotive Livery Strip */}
          <div className="absolute inset-x-0 bottom-0.5 h-1 bg-blue-900/80" />
        </div>

        {/* Coaches Consist Formation */}
        <div className={cn("flex items-center gap-0.5", isEastbound ? "flex-row" : "flex-row-reverse")}>
          {Array.from({ length: Math.min(train.cars, 5) }).map((_, cIdx) => (
            <div
              key={cIdx}
              className={cn(
                "w-4 h-5 rounded-xs border flex flex-col justify-around px-0.5 shadow-2xs shrink-0",
                train.type === "Vande Bharat"
                  ? "bg-slate-200 border-blue-400/60"
                  : train.type === "Rajdhani"
                  ? "bg-red-800 border-red-950"
                  : train.type === "Shatabdi"
                  ? "bg-blue-800 border-blue-950"
                  : train.type === "Amrit Bharat"
                  ? "bg-orange-800 border-orange-950"
                  : train.type === "Tejas"
                  ? "bg-amber-700 border-amber-900"
                  : "bg-slate-700 border-slate-900"
              )}
            >
              {/* Coach Windows */}
              <div className="w-full h-1 bg-sky-200/60 rounded-xs" />
              <div className="w-full h-0.5 bg-slate-950/80" />
            </div>
          ))}
        </div>

        {/* Train Identification Tag */}
        <div className={cn("font-mono flex flex-col text-left shrink-0", isEastbound ? "ml-2" : "mr-2")}>
          <div className="flex items-center gap-1">
            <span className="text-[10px] font-extrabold text-white leading-tight font-mono">
              {train.number}
            </span>
            {isForecast && (
              <span className="px-1 py-0.2 bg-purple-500/20 text-purple-300 border border-purple-400/40 rounded text-[7.5px] font-bold">
                FORECAST
              </span>
            )}
            {isHolding && (
              <span className="px-1 py-0.2 bg-red-500/20 text-red-400 border border-red-400/40 rounded text-[7.5px] font-bold animate-pulse">
                HELD
              </span>
            )}
          </div>
          <span className="text-[8.5px] text-slate-300 leading-tight">
            {train.speed} km/h · KM {train.currentKm.toFixed(1)}
          </span>
        </div>
      </div>

      {/* Floating Status Pill on Hover */}
      <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap bg-slate-900/95 border border-slate-700 text-slate-200 text-[9px] font-mono px-2 py-0.5 rounded shadow-lg z-30">
        {train.name} ({train.type}) · {train.status}
      </div>
    </div>
  );
}
