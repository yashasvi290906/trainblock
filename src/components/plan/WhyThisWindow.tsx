"use client";

import React, { useState } from "react";
import { Check, ChevronDown, ChevronUp, Clock, Info, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface WhyThisWindowProps {
  blockStartTime?: string;
  blockEndTime?: string;
  usableMinutes?: number;
  grantedMinutes?: number;
  utilizationPercent?: number;
}

export function WhyThisWindow({
  blockStartTime = "02:20",
  blockEndTime = "04:10",
  usableMinutes = 90,
  grantedMinutes = 110,
  utilizationPercent = 82,
}: WhyThisWindowProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const REASONS = [
    {
      id: "r1",
      title: "Co-located multi-departmental demand",
      desc: "Engineering, S&T, and Traction all submitted work orders within the KM 68–94 sub-sector.",
    },
    {
      id: "r2",
      title: "Zero passenger timetable intersection",
      desc: `All 4 priority passenger services (20833, 12723, 12076, 12951) clear the work zone before/after ${blockStartTime}–${blockEndTime}.`,
    },
    {
      id: "r3",
      title: "Sufficient usable maintenance window",
      desc: `${usableMinutes} minutes of actual wrench time remain after accounting for 20 min setup, earthing, and safety margins.`,
    },
    {
      id: "r4",
      title: "OHE traction de-energization compatibility",
      desc: "Single 25kV power cut scheduled with Traction Sub-Station controllers without stalling adjacent sections.",
    },
    {
      id: "r5",
      title: "Goods train forecast path protected",
      desc: "Container freight G/4217 trajectory preserved in the trailing 04:30 slot.",
    },
  ];

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 p-4 sm:p-5 shadow-xs space-y-3">
      {/* Header with Expand Toggle */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-900 flex items-center justify-center font-bold">
            <Check className="w-4 h-4 text-emerald-700" />
          </div>
          <div>
            <h3 className="text-xs font-mono font-extrabold uppercase text-slate-900 tracking-wider">
              WHY THIS WINDOW?
            </h3>
            <p className="text-[11px] text-slate-500 font-medium">
              Operational reasoning for slot {blockStartTime}–{blockEndTime}
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-xs text-blue-900 hover:text-blue-700 font-mono font-bold flex items-center gap-1 cursor-pointer"
        >
          <span>{isExpanded ? "Less Details" : "Calculation Details"}</span>
          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Structured Operational Checkpoints */}
      <div className="space-y-2 text-xs">
        {REASONS.map((r) => (
          <div key={r.id} className="flex items-start gap-2 text-slate-700">
            <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
              <Check className="w-2.5 h-2.5" />
            </div>
            <div>
              <span className="font-semibold text-slate-900">{r.title}: </span>
              <span className="text-slate-600 leading-relaxed">{r.desc}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Expandable Usable Minutes Overhead Math */}
      {isExpanded && (
        <div className="mt-3 p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs font-mono space-y-2 animate-fadeIn">
          <div className="font-bold text-slate-800 text-[11px] uppercase pb-1 border-b border-slate-200 flex items-center justify-between">
            <span>Usable Time Breakdown:</span>
            <span className="text-emerald-700 font-bold">{utilizationPercent}% Track Utilization</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-[11px]">
            <div className="p-2 rounded bg-white border border-slate-200">
              <div className="text-slate-500 text-[10px]">Granted Block</div>
              <div className="font-bold text-slate-900">{grantedMinutes} min</div>
            </div>
            <div className="p-2 rounded bg-white border border-slate-200">
              <div className="text-slate-500 text-[10px]">Protection Setup</div>
              <div className="font-bold text-red-600">-10 min</div>
            </div>
            <div className="p-2 rounded bg-white border border-slate-200">
              <div className="text-slate-500 text-[10px]">OHE Earthing</div>
              <div className="font-bold text-amber-600">-5 min</div>
            </div>
            <div className="p-2 rounded bg-white border border-slate-200">
              <div className="text-slate-500 text-[10px]">Usable Work</div>
              <div className="font-bold text-emerald-700">{usableMinutes} min</div>
            </div>
          </div>

          <p className="text-[11px] text-slate-600 leading-relaxed font-sans pt-1">
            &ldquo;{usableMinutes} minutes available for productive maintenance after protection setup and 25kV earthing overhead.&rdquo;
          </p>
        </div>
      )}
    </div>
  );
}
