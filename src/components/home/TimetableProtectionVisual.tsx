"use client";

import React from "react";
import { TrainTrack, ShieldCheck, Clock, Layers, ArrowRight } from "lucide-react";

export function TimetableProtectionVisual() {
  return (
    <div className="w-full bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
      {/* Section Header */}
      <div className="max-w-3xl space-y-2">
        <span className="text-xs font-mono uppercase tracking-wider text-blue-900 font-bold bg-blue-50 px-2.5 py-1 rounded border border-blue-200">
          TIMETABLE COEXISTENCE
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          The block must fit the railway.
        </h2>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          Maintenance cannot simply claim arbitrary track hours. RAILBLOCK continuously projects passenger timetable trajectories and freight forecasts, searching for natural traffic shadow windows where work can execute with zero delay to high-speed trains.
        </p>
      </div>

      {/* Visual Diagram: Timetable String vs Block Window */}
      <div className="p-5 bg-slate-900 rounded-xl text-white font-mono text-xs space-y-4 shadow-inner overflow-x-auto">
        <div className="flex justify-between text-slate-400 border-b border-slate-800 pb-2 text-[11px]">
          <span>02:00</span>
          <span>02:30</span>
          <span>03:00</span>
          <span>03:30</span>
          <span>04:00</span>
          <span>04:30</span>
          <span>05:00</span>
        </div>

        {/* Train Path 1 */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span>TRAIN PATH 1: 20833 Vande Bharat (SEC → VSKP)</span>
            <span className="text-emerald-400 font-bold">CLEARS KM 94 @ 02:18 (SAFE)</span>
          </div>
          <div className="h-4 bg-slate-800 rounded relative overflow-hidden flex items-center">
            <div className="absolute left-[5%] w-[25%] h-full bg-sky-500/80 rounded flex items-center px-2 text-[9px] text-white font-bold">
              20833 Trajectory
            </div>
          </div>
        </div>

        {/* Integrated Block Slot */}
        <div className="space-y-1.5 py-1">
          <div className="flex items-center justify-between text-[11px] text-amber-300 font-bold">
            <span className="flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-amber-400" />
              <span>NATURAL NIGHT SHADOW WINDOW: Block B-014 (KM 68–94)</span>
            </span>
            <span className="text-emerald-300">02:20 – 04:10 (110 MIN FULL CLEARANCE)</span>
          </div>
          <div className="h-8 bg-amber-500/25 border-2 border-amber-400 ring-2 ring-amber-400/40 rounded-lg relative flex items-center justify-between px-3 text-amber-200">
            <span className="font-bold">B-014 Integrated Possession (ENG + S&T + TRC)</span>
            <span className="text-[10px] bg-black/70 px-2 py-0.5 rounded font-bold">90m Usable Wrench Time</span>
          </div>
        </div>

        {/* Train Path 2 */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span>TRAIN PATH 2: G/4217 Container Freight Forecast</span>
            <span className="text-emerald-400 font-bold">ENTERS KM 68 @ 04:30 (CLEAR TRAILING MARGIN)</span>
          </div>
          <div className="h-4 bg-slate-800 rounded relative overflow-hidden flex items-center">
            <div className="absolute left-[70%] w-[25%] h-full bg-emerald-600/70 border border-dashed border-emerald-400 rounded flex items-center px-2 text-[9px] text-emerald-100 font-bold">
              G/4217 Forecast
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
