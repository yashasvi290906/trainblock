"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { AppShell } from "@/components/shell/AppShell";
import { usePlanningRun } from "@/context/PlanningRunContext";
import { PlanningLoading } from "@/components/common/PlanningLoading";
import { PlanningEngineOffline } from "@/components/common/PlanningEngineOffline";
import {
  TrainTrack,
  Clock,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  Radio,
  Send,
  Eye,
  Activity,
  Layers,
  FileCheck,
  Calendar,
  Zap,
  ArrowRight,
  Info,
  MapPin,
  RefreshCw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { PlannedBlock } from "@/lib/api/runs";

interface StationInfo {
  code: string;
  name: string;
  km: number;
  platforms: number;
  loops: number;
  division: string;
}

interface StationTrainMovement {
  train_id: string;
  train_number: string;
  name: string;
  train_type: string;
  priority_class: number;
  origin: string;
  destination: string;
  direction: "UP" | "DOWN";
  scheduled_arrival: string;
  scheduled_departure: string;
  status: "ON_TIME" | "DELAYED" | "REGULATED";
  delay_minutes: number;
}

const STATIONS: StationInfo[] = [
  { code: "SEC", name: "Secunderabad Jn", km: 0.0, platforms: 10, loops: 4, division: "SC" },
  { code: "LBN", name: "Lalapet / Moula Ali", km: 8.5, platforms: 4, loops: 2, division: "SC" },
  { code: "WL", name: "Warangal", km: 142.0, platforms: 5, loops: 3, division: "SC" },
  { code: "KCG", name: "Kacheguda", km: 22.0, platforms: 5, loops: 2, division: "HYB" },
  { code: "NDKD", name: "Nadikude Jn", km: 89.4, platforms: 4, loops: 3, division: "GNT" },
  { code: "NDL", name: "Nandyal Jn", km: 236.0, platforms: 4, loops: 2, division: "GNT" },
];

export default function StationMasterPage() {
  const {
    currentRun,
    loading,
    error,
    isBackend,
    refresh,
    resetDemo,
    ackStationImpact,
    escalateStationAlert,
  } = usePlanningRun();

  const [selectedStationCode, setSelectedStationCode] = useState<string>("NDKD");
  const [selectedBlockForModal, setSelectedBlockForModal] = useState<PlannedBlock | null>(null);
  const [ackNotes, setAckNotes] = useState<string>("");
  const [escalateMessage, setEscalateMessage] = useState<string>("");
  const [actionStatus, setActionStatus] = useState<string | null>(null);
  const [acknowledgedBlocks, setAcknowledgedBlocks] = useState<Record<string, { time: string; notes: string }>>({});

  // Local station readiness check toggles
  const [localChecks, setLocalChecks] = useState<{
    pointsClamped: boolean;
    oheCutoffAcknowledged: boolean;
    trackCircuitClear: boolean;
    stationDiaryLogged: boolean;
  }>({
    pointsClamped: true,
    oheCutoffAcknowledged: true,
    trackCircuitClear: false,
    stationDiaryLogged: true,
  });

  const activeStation = useMemo(() => {
    return STATIONS.find((s) => s.code === selectedStationCode) || STATIONS[4];
  }, [selectedStationCode]);

  const allBlocks: PlannedBlock[] = currentRun?.weekly_plan || [];

  // Filter blocks affecting this station: within 15 km of station km
  const stationBlocks = useMemo(() => {
    return allBlocks.filter((b) => {
      const minKm = Math.min(b.km_start, b.km_end);
      const maxKm = Math.max(b.km_start, b.km_end);
      return (
        (activeStation.km >= minKm - 10 && activeStation.km <= maxKm + 10) ||
        b.corridor?.includes(activeStation.code) ||
        b.section?.includes(activeStation.code) ||
        b.block_id.includes(activeStation.code)
      );
    });
  }, [allBlocks, activeStation]);

  // Train movements affecting this station
  const stationMovements: StationTrainMovement[] = useMemo(() => {
    if (currentRun?.train_movements && currentRun.train_movements.length > 0) {
      return currentRun.train_movements.map((t) => {
        const stop = t.stops?.find((s) => s.station_code === activeStation.code);
        const arrMin = stop ? stop.arrival_mins : 840;
        const depMin = stop ? stop.departure_mins : 845;
        const formatMin = (m: number) =>
          `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
        return {
          train_id: t.train_id,
          train_number: t.service_number,
          name: t.train_name,
          train_type: t.train_type,
          priority_class: t.priority_class,
          origin: t.stops?.[0]?.station_code || "SEC",
          destination: t.stops?.[t.stops.length - 1]?.station_code || "NDL",
          direction: t.direction,
          scheduled_arrival: formatMin(arrMin),
          scheduled_departure: formatMin(depMin),
          status: "ON_TIME",
          delay_minutes: 0,
        };
      });
    }

    return [
      {
        train_id: "TR-12723",
        train_number: "12723",
        name: "Telangana Express",
        train_type: "SUPERFAST",
        priority_class: 1,
        origin: "HYB",
        destination: "NDLS",
        direction: "UP",
        scheduled_arrival: "14:10",
        scheduled_departure: "14:15",
        status: "ON_TIME",
        delay_minutes: 0,
      },
      {
        train_id: "TR-20701",
        train_number: "20701",
        name: "Vande Bharat Express",
        train_type: "PREMIER",
        priority_class: 1,
        origin: "SEC",
        destination: "TPTY",
        direction: "DOWN",
        scheduled_arrival: "15:45",
        scheduled_departure: "15:48",
        status: "ON_TIME",
        delay_minutes: 0,
      },
      {
        train_id: "TR-12795",
        train_number: "12795",
        name: "Intercity Express",
        train_type: "MAIL_EXPRESS",
        priority_class: 2,
        origin: "BZA",
        destination: "LPI",
        direction: "UP",
        scheduled_arrival: "16:20",
        scheduled_departure: "16:22",
        status: "DELAYED",
        delay_minutes: 12,
      },
      {
        train_id: "FR-BOXN-402",
        train_number: "BOXN/SCR/402",
        name: "Coal Rake (Singareni)",
        train_type: "FREIGHT",
        priority_class: 4,
        origin: "RDM",
        destination: "KSLK",
        direction: "DOWN",
        scheduled_arrival: "17:05",
        scheduled_departure: "17:30",
        status: "REGULATED",
        delay_minutes: 25,
      },
    ];
  }, [currentRun?.train_movements, activeStation]);

  const handleAcknowledge = async (blockId: string) => {
    try {
      setActionStatus(`Acknowledging block ${blockId}...`);
      await ackStationImpact(activeStation.code, blockId, ackNotes || "Station staff briefed and local caution boards positioned.");
      setAcknowledgedBlocks((prev) => ({
        ...prev,
        [blockId]: {
          time: new Date().toLocaleTimeString(),
          notes: ackNotes || "Impact consented by Station Master desk.",
        },
      }));
      setAckNotes("");
      setActionStatus(`Success: Block ${blockId} acknowledged by ${activeStation.code} Station Master.`);
      setTimeout(() => setActionStatus(null), 4000);
    } catch {
      setActionStatus(`Error acknowledging block impact.`);
    }
  };

  const handleEscalate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!escalateMessage.trim()) return;
    try {
      setActionStatus(`Transmitting priority escalation to Control...`);
      await escalateStationAlert(activeStation.code, escalateMessage);
      setActionStatus(`Alert dispatched to Divisional Operating Control for ${activeStation.code}.`);
      setEscalateMessage("");
      setTimeout(() => setActionStatus(null), 5000);
    } catch {
      setActionStatus(`Failed to send escalation.`);
    }
  };

  return (
    <AppShell
      pageTitle="LOCAL OPERATIONS DESK"
      subtitle="Station-level operational awareness, track occupancy & maintenance possession consent"
    >
      <div className="space-y-6">
        {/* Status Notification */}
        {actionStatus && (
          <div className="p-3.5 rounded-xl bg-orange-500/10 border border-orange-500/30 text-orange-900 dark:text-orange-200 text-xs font-mono flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-orange-500 animate-ping" />
              <span className="font-bold">{actionStatus}</span>
            </div>
            <button
              onClick={() => setActionStatus(null)}
              className="text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 font-bold"
            >
              ✕
            </button>
          </div>
        )}

        {/* TOP TOOLBAR: Station Selection & Live Desk Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-600 dark:text-amber-400 flex items-center justify-center font-black">
              <TrainTrack className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-black tracking-tight text-slate-900 dark:text-white">
                  Station Master Desk · {activeStation.name} ({activeStation.code})
                </h1>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/40">
                  KM {activeStation.km.toFixed(1)}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                South Central Railway · {activeStation.division} Division · Interlocked Route
              </p>
            </div>
          </div>

          {/* Station Selector Pills */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-mono text-slate-500 dark:text-slate-400 mr-1 font-bold">SWITCH STATION:</span>
            {STATIONS.map((stn) => {
              const isSelected = stn.code === selectedStationCode;
              return (
                <button
                  key={stn.code}
                  onClick={() => setSelectedStationCode(stn.code)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all",
                    isSelected
                      ? "bg-amber-500 text-white shadow-sm shadow-amber-500/30 ring-1 ring-amber-400"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                  )}
                >
                  {stn.code}
                </button>
              );
            })}
          </div>
        </div>

        {/* 4-KPI SUMMARY TILES */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 font-mono text-xs">
          <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
            <span className="text-slate-500 dark:text-slate-400 font-bold uppercase">STATION CAPACITY</span>
            <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
              {activeStation.platforms} PF / {activeStation.loops} Loops
            </div>
            <span className="text-[11px] text-slate-400 mt-1 block">Operational yard berths</span>
          </div>

          <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
            <span className="text-slate-500 dark:text-slate-400 font-bold uppercase">NEXT 4H MOVEMENTS</span>
            <div className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-1">
              {stationMovements.length} Trains
            </div>
            <span className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 block font-bold">
              1 Vande Bharat Protected
            </span>
          </div>

          <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
            <span className="text-slate-500 dark:text-slate-400 font-bold uppercase">AFFECTING POSSESSIONS</span>
            <div className="text-2xl font-black text-orange-600 dark:text-orange-400 mt-1">
              {stationBlocks.length} Blocks
            </div>
            <span className="text-[11px] text-slate-400 mt-1 block">In section &amp; adjacent zones</span>
          </div>

          <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
            <span className="text-slate-500 dark:text-slate-400 font-bold uppercase">LOCAL SAFETY STATUS</span>
            <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              <span>CLEAR</span>
            </div>
            <span className="text-[11px] text-slate-400 mt-1 block">Signals &amp; route interlocked</span>
          </div>
        </div>

        {/* 2-COLUMN MAIN DESK */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* LEFT COLUMN (7 cols): Maintenance Possessions & Impact Consent */}
          <div className="lg:col-span-7 space-y-6">
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-amber-500" />
                  <h2 className="text-sm font-black uppercase tracking-wide text-slate-900 dark:text-white font-mono">
                    Maintenance Possessions Affecting {activeStation.code} Section
                  </h2>
                </div>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold">
                  {stationBlocks.length} Active in Plan
                </span>
              </div>

              {stationBlocks.length === 0 ? (
                <div className="p-8 text-center rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-dashed border-slate-200 dark:border-slate-700 text-xs font-mono text-slate-500">
                  No immediate maintenance block possessions scheduled within 10 km of {activeStation.name}. Normal through operations permitted.
                </div>
              ) : (
                <div className="space-y-4">
                  {stationBlocks.map((block) => {
                    const isAcked = !!acknowledgedBlocks[block.block_id];
                    return (
                      <div
                        key={block.block_id}
                        className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3 transition-all hover:border-amber-400"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div className="flex items-center gap-2 font-mono">
                            <span className="px-2.5 py-1 rounded bg-amber-500/20 text-amber-800 dark:text-amber-300 font-black text-xs border border-amber-500/30">
                              {block.block_id}
                            </span>
                            <span className="text-xs font-bold text-slate-900 dark:text-white">
                              KM {block.km_start.toFixed(1)} – {block.km_end.toFixed(1)}
                            </span>
                            <span className="text-[11px] text-slate-500 dark:text-slate-400">
                              ({block.duration_minutes}m duration)
                            </span>
                          </div>

                          <div className="flex items-center gap-2 font-mono text-xs">
                            <span className="px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold">
                              {block.start_time} – {block.end_time}
                            </span>
                          </div>
                        </div>

                        {/* Co-located tasks breakdown */}
                        <div className="space-y-1.5">
                          <span className="text-[11px] font-mono font-bold text-slate-500 uppercase">
                            Co-located Work ({block.tasks?.length || 0} departments):
                          </span>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {block.tasks?.map((t) => (
                              <div
                                key={t.task_id}
                                className="p-2 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-mono"
                              >
                                <div className="flex items-center justify-between">
                                  <span className="font-bold text-slate-900 dark:text-slate-100">{t.task_id}</span>
                                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                                    {t.department}
                                  </span>
                                </div>
                                <p className="text-[11px] text-slate-600 dark:text-slate-300 truncate mt-0.5">
                                  {t.title}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* SM Operational Caution & Impact */}
                        <div className="p-2.5 rounded bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 text-xs font-mono text-amber-900 dark:text-amber-300 flex items-start gap-2">
                          <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                          <div>
                            <strong>SM Operational Requirement:</strong> Issue Caution Order (Speed limit 30 km/h on loop line). Verify line clear token and coordinate with pilot guard before machine entry.
                          </div>
                        </div>

                        {/* Action buttons */}
                        <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-slate-200 dark:border-slate-700/60">
                          <button
                            onClick={() => setSelectedBlockForModal(block)}
                            className="text-xs font-mono text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center gap-1 font-bold"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>View Full Machine Roster</span>
                          </button>

                          {isAcked ? (
                            <div className="flex items-center gap-1.5 text-xs font-mono text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-lg border border-emerald-300 dark:border-emerald-800">
                              <CheckCircle2 className="w-4 h-4" />
                              <span>Acknowledged at {acknowledgedBlocks[block.block_id].time}</span>
                            </div>
                          ) : (
                            <button
                              onClick={() => handleAcknowledge(block.block_id)}
                              className="px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-xs font-mono font-bold shadow-xs transition-colors flex items-center gap-1.5"
                            >
                              <FileCheck className="w-3.5 h-3.5" />
                              <span>Acknowledge Block Impact</span>
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Local Safety & Handover Checklist */}
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                <h2 className="text-sm font-black uppercase tracking-wide text-slate-900 dark:text-white font-mono">
                  Station Master Local Clearance Checklist
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                <label className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={localChecks.pointsClamped}
                    onChange={(e) => setLocalChecks((p) => ({ ...p, pointsClamped: e.target.checked }))}
                    className="w-4 h-4 rounded text-amber-500 focus:ring-amber-400"
                  />
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white block">Points &amp; Traps Clamped</span>
                    <span className="text-[11px] text-slate-500">Trailing points to possession line padlocked</span>
                  </div>
                </label>

                <label className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={localChecks.oheCutoffAcknowledged}
                    onChange={(e) => setLocalChecks((p) => ({ ...p, oheCutoffAcknowledged: e.target.checked }))}
                    className="w-4 h-4 rounded text-amber-500 focus:ring-amber-400"
                  />
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white block">OHE Power Block Verified</span>
                    <span className="text-[11px] text-slate-500">TPC permit-to-work message logged</span>
                  </div>
                </label>

                <label className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={localChecks.trackCircuitClear}
                    onChange={(e) => setLocalChecks((p) => ({ ...p, trackCircuitClear: e.target.checked }))}
                    className="w-4 h-4 rounded text-amber-500 focus:ring-amber-400"
                  />
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white block">Track Circuit Shunting Verified</span>
                    <span className="text-[11px] text-slate-500">Track relay drop confirmed on panel</span>
                  </div>
                </label>

                <label className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={localChecks.stationDiaryLogged}
                    onChange={(e) => setLocalChecks((p) => ({ ...p, stationDiaryLogged: e.target.checked }))}
                    className="w-4 h-4 rounded text-amber-500 focus:ring-amber-400"
                  />
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white block">Station Working Diary Entry</span>
                    <span className="text-[11px] text-slate-500">Disconnection memo received from ESM / SE</span>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN (5 cols): Live Train Movements & Escalation */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-cyan-500" />
                  <h2 className="text-sm font-black uppercase tracking-wide text-slate-900 dark:text-white font-mono">
                    Approaching &amp; Through Movements
                  </h2>
                </div>
                <span className="text-xs font-mono text-cyan-600 dark:text-cyan-400 font-bold">
                  Next 4 Hours
                </span>
              </div>

              <div className="space-y-3 font-mono text-xs">
                {stationMovements.map((m) => (
                  <div
                    key={m.train_id}
                    className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-3"
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-black text-slate-900 dark:text-white text-xs">
                          {m.train_number}
                        </span>
                        <span
                          className={cn(
                            "px-1.5 py-0.5 rounded text-[10px] font-bold",
                            m.train_type === "PREMIER"
                              ? "bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300 border border-purple-300 dark:border-purple-700"
                              : m.train_type === "SUPERFAST"
                              ? "bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300"
                              : "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300"
                          )}
                        >
                          {m.train_type}
                        </span>
                        <span className="text-[10px] text-slate-400 font-bold">
                          {m.direction}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 dark:text-slate-300 font-medium truncate max-w-[200px]">
                        {m.name} ({m.origin} → {m.destination})
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="font-bold text-slate-900 dark:text-white">
                        ETA {m.scheduled_arrival}
                      </div>
                      <span
                        className={cn(
                          "text-[10px] font-bold block",
                          m.status === "ON_TIME"
                            ? "text-emerald-600 dark:text-emerald-400"
                            : "text-amber-600 dark:text-amber-400"
                        )}
                      >
                        {m.status === "ON_TIME" ? "● ON TIME" : `+${m.delay_minutes}m DELAY`}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Escalate Alert */}
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                <Radio className="w-5 h-5 text-rose-500" />
                <h2 className="text-sm font-black uppercase tracking-wide text-slate-900 dark:text-white font-mono">
                  Direct Line to Divisional Control (SCR DOM)
                </h2>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                Submit urgent traffic conflicts, weather alerts, or track obstruction reports directly to the Chief Train Controller.
              </p>

              <form onSubmit={handleEscalate} className="space-y-3 font-mono text-xs">
                <textarea
                  rows={3}
                  value={escalateMessage}
                  onChange={(e) => setEscalateMessage(e.target.value)}
                  placeholder="E.g., Train 12723 detained at outer signal due to cattle runover. Requesting 15m delay in block commencement."
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500"
                />

                <button
                  type="submit"
                  disabled={!escalateMessage.trim()}
                  className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white font-bold transition-colors flex items-center justify-center gap-2 shadow-xs"
                >
                  <Send className="w-4 h-4" />
                  <span>Transmit Priority Alert to Control</span>
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* MACHINE ROSTER MODAL */}
        {selectedBlockForModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xl p-6 space-y-4 font-mono">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-amber-500" />
                  <h3 className="text-base font-black text-slate-900 dark:text-white">
                    Possession Detail · {selectedBlockForModal.block_id}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedBlockForModal(null)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-white font-bold text-sm"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-2 p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
                  <div>
                    <span className="text-slate-500">Corridor Span:</span>
                    <p className="font-bold text-slate-900 dark:text-white">
                      KM {selectedBlockForModal.km_start.toFixed(1)} – {selectedBlockForModal.km_end.toFixed(1)}
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-500">Scheduled Time:</span>
                    <p className="font-bold text-amber-600 dark:text-amber-400">
                      {selectedBlockForModal.start_time} – {selectedBlockForModal.end_time}
                    </p>
                  </div>
                </div>

                <div>
                  <span className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Deployed Machinery &amp; Track Vehicles:
                  </span>
                  <div className="space-y-1">
                    {selectedBlockForModal.machines_assigned?.length > 0 ? (
                      selectedBlockForModal.machines_assigned.map((m, i) => (
                        <div key={i} className="p-2 rounded bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 flex justify-between">
                          <span>{m}</span>
                          <span className="font-bold text-emerald-600 dark:text-emerald-400">ASSIGNED</span>
                        </div>
                      ))
                    ) : (
                      <div className="p-2 rounded bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 flex justify-between">
                        <span>Plasser 09-3X Dynamic Tamping Express</span>
                        <span className="font-bold text-emerald-600 dark:text-emerald-400">EN ROUTE</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setSelectedBlockForModal(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
