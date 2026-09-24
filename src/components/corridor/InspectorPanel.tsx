"use client";

import React from "react";
import Link from "next/link";
import {
  TrainTrack,
  Shield,
  Layers,
  Wrench,
  Radio,
  Zap,
  MapPin,
  Clock,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  Eye,
  Info,
} from "lucide-react";
import { SimTrain } from "./TrainVisual";
import { SimSignal } from "./SignalVisual";
import { SimBlock } from "./MaintenanceBlockVisual";
import { CorridorStation } from "./RailwayCanvas";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface InspectorPanelProps {
  selectedEntity: {
    type: "TRAIN" | "BLOCK" | "SIGNAL" | "STATION";
    data: any;
  };
  onSendToPlanner?: () => void;
}

export function InspectorPanel({ selectedEntity, onSendToPlanner }: InspectorPanelProps) {
  const { type, data } = selectedEntity;

  return (
    <div className="w-full bg-white dark:bg-slate-900 border-t lg:border-t-0 lg:border-l border-slate-200 dark:border-slate-800 p-4 sm:p-5 flex flex-col justify-between space-y-4 font-sans text-xs text-slate-800 dark:text-slate-200 select-none overflow-y-auto max-h-[500px] lg:max-h-none">
      {/* Entity Header */}
      <div className="pb-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-600 dark:bg-blue-400" />
          <span className="font-mono text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider">
            OPERATIONAL INSPECTOR · {type}
          </span>
        </div>
        <span className="text-xs font-mono text-slate-500 font-bold">
          SEC–NDL Sector
        </span>
      </div>

      {/* ---------------- TRAIN INSPECTOR ---------------- */}
      {type === "TRAIN" && (
        <div className="space-y-3 font-mono">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                {data.number} {data.name}
              </div>
              <div className="text-xs text-blue-700 dark:text-sky-400 font-sans mt-0.5 font-bold">
                {data.type} · Priority: <strong className="text-slate-900 dark:text-white">{data.priority}</strong>
              </div>
            </div>
            <span
              className={cn(
                "px-2.5 py-1 rounded-md text-xs font-black border",
                data.status === "HOLDING"
                  ? "bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-400 border-red-300 dark:border-red-800 animate-pulse"
                  : data.status === "APPROACHING"
                  ? "bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400 border-amber-300 dark:border-amber-800"
                  : "bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border-emerald-300 dark:border-emerald-800"
              )}
            >
              {data.status}
            </span>
          </div>

          {/* Core Metrics Grid */}
          <div className="grid grid-cols-2 gap-2 text-xs font-sans">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
              <span className="text-xs text-slate-500 dark:text-slate-400 uppercase font-mono font-bold block">Current Location</span>
              <span className="font-mono font-black text-slate-900 dark:text-white text-xs sm:text-sm mt-0.5 block">
                KM {data.currentKm.toFixed(1)} ({data.track} Line)
              </span>
              <span className="text-xs text-slate-600 dark:text-slate-400 font-mono">
                {data.direction === "DN" ? "Eastbound → NDL" : "Westbound → SEC"}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
              <span className="text-xs text-slate-500 dark:text-slate-400 uppercase font-mono font-bold block">Speed & Headway</span>
              <span className="font-mono font-black text-amber-600 dark:text-amber-400 text-xs sm:text-sm mt-0.5 block">
                {data.speed} km/h
              </span>
              <span className="text-xs text-slate-600 dark:text-slate-400 font-mono">
                ETA Next: {data.etaNext}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
              <span className="text-xs text-slate-500 dark:text-slate-400 uppercase font-mono font-bold block">Next Station Stop</span>
              <span className="font-mono font-black text-slate-900 dark:text-slate-200 text-xs sm:text-sm mt-0.5 block">
                {data.nextStation}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
              <span className="text-xs text-slate-500 dark:text-slate-400 uppercase font-mono font-bold block">Block Protection</span>
              <span
                className={cn(
                  "font-mono font-black text-xs sm:text-sm mt-0.5 block",
                  data.status === "HOLDING" ? "text-red-600 dark:text-red-400" : "text-emerald-600 dark:text-emerald-400"
                )}
              >
                {data.status === "HOLDING" ? "HELD BEFORE B-014" : "PROTECTED PATH"}
              </span>
            </div>
          </div>

          {/* Operational Path Status */}
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-sans space-y-1">
            <span className="font-mono text-xs text-slate-600 dark:text-slate-400 uppercase font-black flex items-center gap-1.5">
              <Info className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>Timetable Path Assessment</span>
            </span>
            <p className="text-slate-700 dark:text-slate-300 text-xs leading-relaxed">
              {data.status === "HOLDING"
                ? "Train held at Signal S-18 outside KM 68 boundary while B-014 possession is active on DN line."
                : "Continuous timetable path protected; no conflicting speed restriction or uncoordinated track occupancy."}
            </p>
          </div>
        </div>
      )}

      {/* ---------------- BLOCK B-014 INSPECTOR ---------------- */}
      {type === "BLOCK" && (
        <div className="space-y-3 font-mono">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                {data.id} · {data.name}
              </div>
              <div className="text-xs text-amber-600 dark:text-amber-400 font-sans mt-0.5 font-bold">
                KM {data.startKm}–{data.endKm} ({data.track} Line)
              </div>
            </div>
            <span
              className={cn(
                "px-2.5 py-1 rounded-md text-xs font-black border",
                data.status === "PROTECTED"
                  ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-400 border-emerald-300 dark:border-emerald-800"
                  : data.status === "DENIED"
                  ? "bg-red-100 dark:bg-red-950 text-red-800 dark:text-red-400 border-red-300 dark:border-red-800 animate-pulse"
                  : "bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-400 border-blue-300 dark:border-blue-800"
              )}
            >
              {data.status}
            </span>
          </div>

          {/* Parameters */}
          <div className="grid grid-cols-2 gap-2 text-xs font-sans">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
              <span className="text-xs text-slate-500 dark:text-slate-400 uppercase font-mono font-bold block">Granted Window</span>
              <span className="font-mono font-black text-slate-900 dark:text-white text-xs sm:text-sm mt-0.5 block">
                {data.startTime} – {data.endTime}
              </span>
              <span className="text-xs text-slate-600 dark:text-slate-400 font-mono">
                {data.durationMin} min slot
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
              <span className="text-xs text-slate-500 dark:text-slate-400 uppercase font-mono font-bold block">Usable Work Time</span>
              <span className="font-mono font-black text-emerald-600 dark:text-emerald-400 text-xs sm:text-sm mt-0.5 block">
                {data.usableMin} min (82%)
              </span>
              <span className="text-xs text-slate-600 dark:text-slate-400 font-mono">
                20m Setup & Earthing
              </span>
            </div>
          </div>

          {/* Departments Integrated */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2 text-xs font-sans">
            <span className="font-mono text-xs uppercase font-black text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>3 Co-Located Departments</span>
            </span>

            <div className="space-y-1.5 font-mono text-xs">
              <div className="flex items-center justify-between p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <span className="flex items-center gap-1.5 text-amber-700 dark:text-amber-400 font-bold">
                  <Wrench className="w-3.5 h-3.5" />
                  <span>Engineering</span>
                </span>
                <span className="text-slate-600 dark:text-slate-400 font-medium">Track Tamping (CTM-04)</span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <span className="flex items-center gap-1.5 text-sky-700 dark:text-sky-400 font-bold">
                  <Radio className="w-3.5 h-3.5" />
                  <span>S&T</span>
                </span>
                <span className="text-slate-600 dark:text-slate-400 font-medium">Axle Counter & Point</span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <span className="flex items-center gap-1.5 text-purple-700 dark:text-purple-400 font-bold">
                  <Zap className="w-3.5 h-3.5" />
                  <span>Traction</span>
                </span>
                <span className="text-slate-600 dark:text-slate-400 font-medium">OHE Cantilever Bracket</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ---------------- SIGNAL INSPECTOR ---------------- */}
      {type === "SIGNAL" && (
        <div className="space-y-3 font-mono">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                {data.id}
              </div>
              <div className="text-xs text-slate-600 dark:text-slate-400 font-sans mt-0.5">
                {data.name} · KM {data.km}
              </div>
            </div>
            <span
              className={cn(
                "px-2.5 py-1 rounded-md text-xs font-black border",
                data.aspect === "RED"
                  ? "bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-400 border-red-300 dark:border-red-800"
                  : data.aspect === "GREEN"
                  ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border-emerald-300 dark:border-emerald-800"
                  : "bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400 border-amber-300 dark:border-amber-800"
              )}
            >
              ASPECT: {data.aspect}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1.5 text-xs font-sans">
            <span className="font-mono text-xs uppercase font-black text-slate-700 dark:text-slate-300">
              Aspect Determination Reason:
            </span>
            <p className="text-slate-700 dark:text-slate-300 font-mono text-xs leading-relaxed">
              {data.reason || "Automatic territory block protection aspect"}
            </p>
          </div>
        </div>
      )}

      {/* ---------------- STATION INSPECTOR ---------------- */}
      {type === "STATION" && (
        <div className="space-y-3 font-mono">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                {data.code} · {data.name}
              </div>
              <div className="text-xs text-slate-600 dark:text-slate-400 font-sans mt-0.5">
                Corridor Location: KM {data.km}
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-md bg-blue-100 dark:bg-blue-950 text-blue-900 dark:text-sky-400 border border-blue-300 dark:border-blue-800 text-xs font-black">
              JUNCTION
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs font-sans">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
              <span className="text-xs text-slate-500 dark:text-slate-400 uppercase font-mono font-bold block">Platforms</span>
              <span className="font-mono font-black text-slate-900 dark:text-white text-xs sm:text-sm mt-0.5 block">
                {data.platforms} Platforms
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
              <span className="text-xs text-slate-500 dark:text-slate-400 uppercase font-mono font-bold block">Through Tracks</span>
              <span className="font-mono font-black text-slate-900 dark:text-white text-xs sm:text-sm mt-0.5 block">
                {data.tracks} Tracks
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Action Footer */}
      <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-2">
        <Link
          href="/plan"
          className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-mono font-bold rounded-xl text-xs sm:text-sm transition-all flex items-center justify-center gap-2 shadow-md text-center"
        >
          <span>View Integrated Plan (B-014)</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
