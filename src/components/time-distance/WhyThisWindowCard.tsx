"use client";

import React from "react";
import { HelpCircle, Wrench, Shield, CheckCircle2, AlertTriangle, Users } from "lucide-react";
import { cn } from "@/lib/utils";

interface WhyThisWindowCardProps {
  startTime: string;
  endTime: string;
  usableMin: number;
  totalWorkOrders: number;
  p1Count: number;
  p2Count: number;
  protectedPassengerCount: number;
  goodsForecastCount: number;
  isFeasible: boolean;
}

export function WhyThisWindowCard({
  startTime,
  endTime,
  usableMin,
  totalWorkOrders,
  p1Count,
  p2Count,
  protectedPassengerCount,
  goodsForecastCount,
  isFeasible,
}: WhyThisWindowCardProps) {
  return (
    <div className="bg-[#091326] border border-[#162744] rounded-xl p-4 space-y-3 select-none">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-[#182a4d]">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-sky-400" />
          <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
            WHY THIS WINDOW?
          </h3>
        </div>
        <span className="text-[10px] font-mono text-sky-300 bg-sky-950/60 px-2 py-0.5 rounded border border-sky-800/50">
          {startTime}–{endTime}
        </span>
      </div>

      {/* Objective Facts Grid */}
      <div className="grid grid-cols-2 gap-2 text-xs font-mono">
        <div className="p-2 rounded bg-[#060c18] border border-[#122038]">
          <span className="text-[10px] text-slate-500 block">WORK DEMAND</span>
          <span className="text-white font-bold">{totalWorkOrders} work orders</span>
        </div>

        <div className="p-2 rounded bg-[#060c18] border border-[#122038] flex items-center justify-between">
          <div>
            <span className="text-[10px] text-rose-400 block">P1 CRITICAL</span>
            <span className="text-rose-300 font-bold">{p1Count}</span>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-amber-400 block">P2 URGENT</span>
            <span className="text-amber-300 font-bold">{p2Count}</span>
          </div>
        </div>

        <div className="p-2 rounded bg-[#060c18] border border-[#122038]">
          <span className="text-[10px] text-slate-500 block">USABLE WORK TIME</span>
          <span className="text-emerald-400 font-bold">{usableMin} min</span>
        </div>

        <div className="p-2 rounded bg-[#060c18] border border-[#122038]">
          <span className="text-[10px] text-slate-500 block">PAX MOVEMENTS</span>
          <span className="text-sky-300 font-bold">{protectedPassengerCount} protected</span>
        </div>

        <div className="p-2 rounded bg-[#060c18] border border-[#122038]">
          <span className="text-[10px] text-slate-500 block">GOODS FORECAST</span>
          <span className="text-purple-300 font-bold">{goodsForecastCount} checked</span>
        </div>

        <div className="p-2 rounded bg-[#060c18] border border-[#122038]">
          <span className="text-[10px] text-slate-500 block">COORDINATION</span>
          <span className="text-slate-200 font-bold">ENG + S&T + TRD</span>
        </div>
      </div>

      {/* Factual Operational Explanation Statement */}
      <div
        className={cn(
          "p-3 rounded-lg border text-[11px] leading-relaxed font-sans",
          isFeasible
            ? "bg-emerald-950/30 border-emerald-800/40 text-slate-200"
            : "bg-red-950/30 border-red-800/40 text-slate-200"
        )}
      >
        <p>
          {isFeasible ? (
            <>
              <strong className="text-emerald-300 font-semibold font-mono block mb-0.5">
                ✓ FEASIBLE INTEGRATED POSSESSION:
              </strong>
              Window contains the required maintenance duration (90 min usable) while preserving protected passenger paths and accommodating goods train forecast movements.
            </>
          ) : (
            <>
              <strong className="text-red-300 font-semibold font-mono block mb-0.5">
                ⚠ INTERSECTION DETECTED:
              </strong>
              High-speed passenger movement (Vande Bharat 20612) intersects candidate possession window. Requires window shifting (+10m/+30m) or replanning to trailing window.
            </>
          )}
        </p>
      </div>
    </div>
  );
}
