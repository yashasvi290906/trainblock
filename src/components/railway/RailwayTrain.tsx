"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Train as TrainIcon } from "lucide-react";

export type TrainType = "vande-bharat" | "rajdhani" | "shatabdi" | "express" | "freight";

interface RailwayTrainProps {
  trainNumber: string;
  trainName: string;
  type?: TrainType;
  direction?: "UP" | "DOWN";
  isForecast?: boolean;
  className?: string;
  onClick?: () => void;
  statusText?: string;
}

export function RailwayTrain({
  trainNumber,
  trainName,
  type = "express",
  direction = "DOWN",
  isForecast = false,
  className,
  onClick,
  statusText,
}: RailwayTrainProps) {
  // Semantic train color schemes matching Indian Railways classifications
  const badgeStyle = {
    "vande-bharat": "bg-sky-50 text-sky-900 border-sky-300",
    rajdhani: "bg-red-50 text-red-900 border-red-300",
    shatabdi: "bg-purple-50 text-purple-900 border-purple-300",
    express: "bg-blue-50 text-blue-900 border-blue-300",
    freight: "bg-emerald-50 text-emerald-900 border-emerald-300 border-dashed",
  }[type];

  const leadPill = {
    "vande-bharat": "bg-sky-600",
    rajdhani: "bg-red-600",
    shatabdi: "bg-purple-600",
    express: "bg-blue-600",
    freight: "bg-emerald-600",
  }[type];

  return (
    <div
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 px-2 py-1 rounded border shadow-2xs font-mono text-xs select-none cursor-pointer transition-all duration-150 hover:shadow-xs",
        badgeStyle,
        isForecast && "opacity-85 border-dashed",
        className
      )}
      title={`${trainNumber} ${trainName} (${direction} Line) - ${statusText || "On Schedule"}`}
    >
      {/* Train Loc Head Indicator */}
      <span className={cn("w-1.5 h-3.5 rounded-xs shrink-0", leadPill)} />

      {/* Train Direction Arrow */}
      <span className="text-[10px] font-bold text-slate-500">
        {direction === "DOWN" ? "→" : "←"}
      </span>

      {/* Train Number */}
      <span className="font-bold text-slate-900 tracking-tight">
        {trainNumber}
      </span>

      {/* Short Train Name */}
      <span className="text-[11px] text-slate-600 font-sans truncate max-w-[110px]">
        {trainName}
      </span>

      {statusText && (
        <span className="text-[9px] px-1 py-0.2 rounded bg-slate-200/70 text-slate-700 font-bold ml-0.5">
          {statusText}
        </span>
      )}
    </div>
  );
}
