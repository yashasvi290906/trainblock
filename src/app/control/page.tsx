"use client";

import React, { useState, useEffect } from "react";
import { AppShell } from "@/components/shell/AppShell";
import { mockRailwayService } from "@/lib/mock-service";
import { Corridor, Train, TimetableMovement } from "@/types/railway";
import { Block, PlanMetrics } from "@/types/planning";
import { MaintenanceTask } from "@/types/maintenance";
import { formatKm, formatKmRange, formatDuration, getDepartmentColor } from "@/lib/formatting";
import {
  ClipboardList,
  AlertTriangle,
  Layers,
  TrendingDown,
  TrendingUp,
  ShieldCheck,
  Zap,
  Sparkles,
  TrainTrack,
  PlusCircle,
  FileText,
  Activity,
  CheckCircle2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  ArrowRight,
  Clock,
  MapPin,
  Eye,
  Info,
  ChevronRight,
  Database,
  Calendar,
  Wrench,
  Radio,
  Sliders,
  Check,
  Loader2,
  X,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function ControlRoomPage() {
  const [corridor, setCorridor] = useState<Corridor | null>(null);
  const [trains, setTrains] = useState<Train[]>([]);
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [tasks, setTasks] = useState<MaintenanceTask[]>([]);
  const [metrics, setMetrics] = useState<PlanMetrics | null>(null);
  const [timetable, setTimetable] = useState<TimetableMovement[]>([]);

  // Interactive selection state
  const [selectedTrainId, setSelectedTrainId] = useState<string | null>("TRN-20833");
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>("B-014");
  const [corridorZoom, setCorridorZoom] = useState<number>(1);
  const [planningHorizon, setPlanningHorizon] = useState<"Weekly" | "Monthly">("Weekly");

  // Simulation run modal state
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [simStep, setSimStep] = useState<number>(0);

  // Train animation positions
  const [trainPositions, setTrainPositions] = useState<Record<string, number>>({
    "TRN-20833": 28.4,
    "TRN-12723": 61.2,
    "TRN-12076": 109.5,
    "TRN-12951": 85.0,
    "TRN-G4217": 44.0,
  });

  useEffect(() => {
    mockRailwayService.getCorridor().then(setCorridor);
    mockRailwayService.getTrains().then(setTrains);
    mockRailwayService.getBlocks().then(setBlocks);
    mockRailwayService.getMaintenanceTasks().then(setTasks);
    mockRailwayService.getMetrics("integrated").then(setMetrics);
    mockRailwayService.getTimetable().then(setTimetable);
  }, []);

  // Subtle continuous train animation
  useEffect(() => {
    const interval = setInterval(() => {
      setTrainPositions((prev) => {
        const next = { ...prev };
        trains.forEach((t) => {
          const current = next[t.id] ?? t.currentKm;
          if (t.direction === "DOWN") {
            next[t.id] = current >= 128 ? 0 : Number((current + 0.1).toFixed(1));
          } else {
            next[t.id] = current <= 0 ? 128 : Number((current - 0.1).toFixed(1));
          }
        });
        return next;
      });
    }, 200);
    return () => clearInterval(interval);
  }, [trains]);

  // Derived metrics from mock dataset
  const totalTasksCount = tasks.length;
  const criticalTasksCount = tasks.filter((t) => t.criticality === "Critical").length;
  const blocksCount = blocks.length;
  const activePossessionsCount = blocks.filter((b) => b.status === "ACTIVE").length;
  const selectedTrain = trains.find((t) => t.id === selectedTrainId) || trains[0];
  const selectedBlock = blocks.find((b) => b.blockId === selectedBlockId) || blocks[0];

  // Helper for corridor percentage positioning
  const totalKm = 128;
  const getPercent = (km: number) => (km / totalKm) * 100;

  // Frontend simulation execution
  const handleRunSimulation = () => {
    setIsSimulating(true);
    setSimStep(1);
    const timer1 = setTimeout(() => setSimStep(2), 600);
    const timer2 = setTimeout(() => setSimStep(3), 1200);
    const timer3 = setTimeout(() => setSimStep(4), 1800);
    const timer4 = setTimeout(() => setSimStep(5), 2400);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  };

  return (
    <AppShell
      pageTitle="DIVISIONAL MAINTENANCE CONTROL"
      subtitle="Integrated block planning · SEC–NDL corridor · Double Line"
    >
      {/* Top Banner / Actions Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-1">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-semibold text-sky-400 bg-sky-950/60 border border-sky-800/50 px-2 py-0.5 rounded">
              SEC → KZJ → WL → NDKD → NDL
            </span>
            <span className="text-xs text-slate-300 font-mono">
              128 km · Double Line (130 km/h)
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-300 border border-emerald-800/40 font-mono flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              SYNTHETIC OPERATIONAL SCENARIO
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="flex items-center bg-[#0d1629] border border-[#1b2b4b] rounded p-0.5 text-xs font-medium">
            <button
              onClick={() => setPlanningHorizon("Weekly")}
              className={cn(
                "px-2.5 py-1 rounded transition-colors",
                planningHorizon === "Weekly"
                  ? "bg-sky-500/20 text-sky-300 font-semibold"
                  : "text-slate-400 hover:text-slate-200"
              )}
            >
              Weekly Horizon
            </button>
            <button
              onClick={() => setPlanningHorizon("Monthly")}
              className={cn(
                "px-2.5 py-1 rounded transition-colors",
                planningHorizon === "Monthly"
                  ? "bg-sky-500/20 text-sky-300 font-semibold"
                  : "text-slate-400 hover:text-slate-200"
              )}
            >
              Monthly Reserve
            </button>
          </div>

          <button
            onClick={handleRunSimulation}
            className="py-1.5 px-3 rounded bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs transition-all shadow-md shadow-sky-950/50 flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Generate Integrated Plan</span>
          </button>

          <Link
            href="/live-corridor"
            className="py-1.5 px-3 rounded bg-[#132039] hover:bg-[#1a2b4d] text-slate-200 border border-[#1e3258] font-medium text-xs transition-colors flex items-center gap-1.5"
          >
            <TrainTrack className="w-3.5 h-3.5 text-sky-400" />
            <span>View Live Corridor</span>
          </Link>
        </div>
      </div>

      {/* Six Operational Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-3 rounded-lg bg-[#0c1527] border border-[#1a2948] flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-medium">TOTAL TASKS</span>
            <ClipboardList className="w-3.5 h-3.5 text-sky-400" />
          </div>
          <div className="mt-1.5">
            <span className="mono-num text-xl font-bold text-white">
              {totalTasksCount}
            </span>
            <span className="text-[10px] text-slate-400 block">
              ENG (7) · S&T (6) · TRC (5)
            </span>
          </div>
        </div>

        <div className="p-3 rounded-lg bg-[#0c1527] border border-[#1a2948] flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-medium">CRITICAL TASKS</span>
            <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
          </div>
          <div className="mt-1.5">
            <span className="mono-num text-xl font-bold text-rose-400">
              {criticalTasksCount}
            </span>
            <span className="text-[10px] text-rose-300/80 block font-medium">
              Overdue track & signal
            </span>
          </div>
        </div>

        <div className="p-3 rounded-lg bg-[#0c1527] border border-[#1a2948] flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-medium">BLOCKS PLANNED</span>
            <Layers className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="mt-1.5">
            <span className="mono-num text-xl font-bold text-amber-400">
              {blocksCount}
            </span>
            <span className="text-[10px] text-slate-400 block">
              2 Multi-Dept Blocks
            </span>
          </div>
        </div>

        <div className="p-3 rounded-lg bg-[#0c1527] border border-[#1a2948] flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-medium">ACTIVE POSSESSIONS</span>
            <Wrench className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="mt-1.5">
            <span className="mono-num text-xl font-bold text-emerald-400">
              {activePossessionsCount}
            </span>
            <span className="text-[10px] text-emerald-400/80 block font-medium">
              Block B-014 (KM 68–94)
            </span>
          </div>
        </div>

        <div className="p-3 rounded-lg bg-[#0c1527] border border-[#1a2948] flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-medium">TRAIN CONFLICTS</span>
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="mt-1.5">
            <span className="mono-num text-xl font-bold text-emerald-400">
              0
            </span>
            <span className="text-[10px] text-emerald-400/80 block font-medium">
              Timetable clear
            </span>
          </div>
        </div>

        <div className="p-3 rounded-lg bg-[#0c1527] border border-[#1a2948] flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-medium">ASSET AVAILABILITY</span>
            <TrendingUp className="w-3.5 h-3.5 text-sky-400" />
          </div>
          <div className="mt-1.5">
            <div className="flex items-baseline gap-1">
              <span className="mono-num text-xl font-bold text-sky-400">
                81.2%
              </span>
              <span className="text-[10px] text-emerald-400 font-mono font-medium">
                (Synthetic)
              </span>
            </div>
            <span className="text-[10px] text-slate-400 block">
              120 min possession used
            </span>
          </div>
        </div>
      </div>

      {/* Main Centerpiece: Corridor Overview (Left) + Next Train Movements (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Left 3 Cols: Corridor Overview Visual Centerpiece */}
        <div className="lg:col-span-3 bg-[#0c1527] border border-[#1a2948] rounded-lg p-4 flex flex-col justify-between shadow-lg">
          {/* Corridor Top Bar */}
          <div className="flex items-center justify-between mb-3 pb-2.5 border-b border-[#16233d]">
            <div className="flex items-center gap-3">
              <div className="w-2.5 h-2.5 rounded-full bg-sky-400"></div>
              <div>
                <h3 className="text-xs font-semibold text-white tracking-wider uppercase flex items-center gap-2">
                  <span>Corridor Operational Overview</span>
                  <span className="text-[10px] font-mono text-slate-400 bg-[#080e1b] px-2 py-0.5 rounded border border-[#162544]">
                    SEC (0 km) → NDL (128 km)
                  </span>
                </h3>
              </div>
            </div>

            {/* Zoom Controls & Legend */}
            <div className="flex items-center gap-3 text-xs">
              <div className="flex items-center gap-1 bg-[#080f1d] p-0.5 rounded border border-[#16243f]">
                <button
                  onClick={() => setCorridorZoom((z) => Math.max(1, z - 0.2))}
                  className="p-1 hover:bg-[#162440] rounded text-slate-300"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-3 h-3" />
                </button>
                <span className="mono-num text-[10px] px-1 text-slate-400">
                  {Math.round(corridorZoom * 100)}%
                </span>
                <button
                  onClick={() => setCorridorZoom((z) => Math.min(1.8, z + 0.2))}
                  className="p-1 hover:bg-[#162440] rounded text-slate-300"
                  title="Zoom In"
                >
                  <ZoomIn className="w-3 h-3" />
                </button>
                <button
                  onClick={() => setCorridorZoom(1)}
                  className="p-1 hover:bg-[#162440] rounded text-slate-400 hover:text-white"
                  title="Fit Corridor"
                >
                  <RotateCcw className="w-3 h-3" />
                </button>
              </div>

              <div className="hidden sm:flex items-center gap-3 text-[10px] text-slate-400 font-medium">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-sky-400"></span> Passenger
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span> Freight (Forecast)
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-1.5 bg-amber-500 rounded-sm"></span> Block B-014
                </span>
              </div>
            </div>
          </div>

          {/* Interactive Railway Visual Track Section */}
          <div className="relative py-4 px-3 bg-[#080e1b] rounded border border-[#15233e] overflow-x-auto">
            <div
              className="relative min-w-[720px] h-48 transition-all"
              style={{ transform: `scale(${corridorZoom})`, transformOrigin: "left center" }}
            >
              {/* Station Pillars & Code Labels */}
              {corridor?.stations.map((stn) => {
                const pos = getPercent(stn.km);
                return (
                  <div
                    key={stn.code}
                    className="absolute top-0 bottom-0 transform -translate-x-1/2 flex flex-col items-center pointer-events-none z-0"
                    style={{ left: `${pos}%` }}
                  >
                    <span className="text-[11px] font-bold text-slate-200 tracking-wide">
                      {stn.code}
                    </span>
                    <span className="text-[9px] font-mono text-slate-400">
                      {stn.km} km
                    </span>
                    <div className="w-[1px] flex-1 bg-slate-800 border-l border-dashed border-slate-700 my-1"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-slate-200 border-2 border-[#080e1b] shadow-sm"></div>
                  </div>
                );
              })}

              {/* UP Line Track (Top line) */}
              <div className="absolute top-[68px] left-0 right-0 h-4 bg-[#111c33] border-y border-[#2a3e66] flex items-center">
                <span className="absolute -left-1 text-[9px] font-mono text-slate-400 -top-4">
                  UP LINE (SEC ← NDL)
                </span>

                {/* Signals on UP Line */}
                {corridor?.signals
                  .filter((s) => s.direction === "UP")
                  .map((sig) => (
                    <div
                      key={sig.id}
                      className="absolute -top-3.5 transform -translate-x-1/2 cursor-pointer"
                      style={{ left: `${getPercent(sig.km)}%` }}
                      title={`Signal ${sig.id} (${sig.type}) - ${sig.aspect}`}
                    >
                      <span
                        className={cn(
                          "block w-2 h-2 rounded-full shadow-sm",
                          sig.aspect === "GREEN"
                            ? "bg-emerald-400 pulse-signal-green"
                            : sig.aspect === "RED"
                            ? "bg-rose-500 pulse-signal-red"
                            : "bg-amber-400"
                        )}
                      ></span>
                    </div>
                  ))}

                {/* Trains on UP Line */}
                {trains
                  .filter((t) => t.direction === "UP")
                  .map((trn) => {
                    const pos = getPercent(trainPositions[trn.id] ?? trn.currentKm);
                    const isSelected = trn.id === selectedTrainId;

                    return (
                      <div
                        key={trn.id}
                        onClick={() => setSelectedTrainId(trn.id)}
                        className={cn(
                          "absolute -top-3.5 transform -translate-x-1/2 z-10 cursor-pointer transition-all",
                          isSelected ? "scale-110 z-20" : "hover:scale-105"
                        )}
                        style={{ left: `${pos}%` }}
                      >
                        <div
                          className={cn(
                            "px-2 py-0.5 rounded text-[10px] font-mono font-bold flex items-center gap-1 shadow-md border transition-colors",
                            isSelected
                              ? "bg-purple-900 text-purple-100 border-purple-300 ring-2 ring-purple-400"
                              : "bg-[#0d1629] text-purple-300 border-purple-500/70"
                          )}
                        >
                          <span>← {trn.serviceNumber}</span>
                          <span className="text-[8.5px] opacity-80">({trn.speed}k)</span>
                        </div>
                      </div>
                    );
                  })}
              </div>

              {/* DOWN Line Track (Bottom line) */}
              <div className="absolute top-[124px] left-0 right-0 h-4 bg-[#111c33] border-y border-[#2a3e66] flex items-center">
                <span className="absolute -left-1 text-[9px] font-mono text-slate-400 -top-4">
                  DN LINE (SEC → NDL)
                </span>

                {/* Shaded Physical Maintenance Possession Zone B-014 (KM 68 - 94) */}
                {blocks.map((blk) => {
                  const startPct = getPercent(blk.kmStart);
                  const widthPct = getPercent(blk.kmEnd - blk.kmStart);
                  const isSelected = blk.blockId === selectedBlockId;

                  return (
                    <div
                      key={blk.blockId}
                      onClick={() => setSelectedBlockId(blk.blockId)}
                      className={cn(
                        "absolute -top-3.5 h-11 rounded cursor-pointer transition-all border flex items-center justify-between px-2 z-0",
                        isSelected
                          ? "bg-amber-500/30 border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.35)] ring-2 ring-amber-400"
                          : "bg-amber-500/15 border-amber-600/70 hover:bg-amber-500/25"
                      )}
                      style={{ left: `${startPct}%`, width: `${widthPct}%` }}
                    >
                      <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-amber-300 truncate">
                        <Wrench className="w-3 h-3 text-amber-400 shrink-0" />
                        <span>
                          {blk.blockId} ({formatKm(blk.kmStart)}–{blk.kmEnd})
                        </span>
                      </div>
                      <div className="text-[8.5px] font-mono bg-amber-950/90 px-1 py-0.5 rounded text-amber-200 border border-amber-700/50 shrink-0">
                        {blk.startTime}–{blk.endTime} · ENG+S&T+TRC
                      </div>
                    </div>
                  );
                })}

                {/* Signals on DOWN Line */}
                {corridor?.signals
                  .filter((s) => s.direction === "DOWN")
                  .map((sig) => (
                    <div
                      key={sig.id}
                      className="absolute -bottom-3.5 transform -translate-x-1/2 cursor-pointer"
                      style={{ left: `${getPercent(sig.km)}%` }}
                      title={`Signal ${sig.id} (${sig.type}) - ${sig.aspect}`}
                    >
                      <span
                        className={cn(
                          "block w-2 h-2 rounded-full shadow-sm",
                          sig.aspect === "GREEN"
                            ? "bg-emerald-400 pulse-signal-green"
                            : sig.aspect === "RED"
                            ? "bg-rose-500 pulse-signal-red"
                            : "bg-amber-400"
                        )}
                      ></span>
                    </div>
                  ))}

                {/* Trains on DOWN Line */}
                {trains
                  .filter((t) => t.direction === "DOWN")
                  .map((trn) => {
                    const pos = getPercent(trainPositions[trn.id] ?? trn.currentKm);
                    const isSelected = trn.id === selectedTrainId;

                    return (
                      <div
                        key={trn.id}
                        onClick={() => setSelectedTrainId(trn.id)}
                        className={cn(
                          "absolute -top-3.5 transform -translate-x-1/2 z-10 cursor-pointer transition-all",
                          isSelected ? "scale-110 z-20" : "hover:scale-105"
                        )}
                        style={{ left: `${pos}%` }}
                      >
                        <div
                          className={cn(
                            "px-2 py-0.5 rounded text-[10px] font-mono font-bold flex items-center gap-1 shadow-md border transition-colors",
                            trn.isForecast
                              ? "bg-emerald-950/90 text-emerald-300 border-emerald-500 border-dashed"
                              : trn.type === "Vande Bharat"
                              ? isSelected
                                ? "bg-sky-600 text-white border-white ring-2 ring-sky-300 shadow-[0_0_12px_rgba(56,189,248,0.5)]"
                                : "bg-sky-950/90 text-sky-300 border-sky-400"
                              : trn.type === "Rajdhani"
                              ? isSelected
                                ? "bg-rose-600 text-white border-white ring-2 ring-rose-300"
                                : "bg-rose-950/90 text-rose-300 border-rose-400"
                              : isSelected
                              ? "bg-amber-600 text-white border-white ring-2 ring-amber-300"
                              : "bg-amber-950/90 text-amber-300 border-amber-400"
                          )}
                        >
                          <span>{trn.serviceNumber} →</span>
                          <span className="text-[8.5px] opacity-80">
                            {trn.isForecast ? "Forecast" : `${trn.speed}k`}
                          </span>
                        </div>
                      </div>
                    );
                  })}
              </div>

              {/* Bottom KM Ruler */}
              <div className="absolute bottom-1 left-0 right-0 h-4 border-t border-[#1e2f52] flex justify-between text-[9px] font-mono text-slate-400 pt-1">
                {corridor?.kmMarkers.map((km) => (
                  <div
                    key={km}
                    className="absolute transform -translate-x-1/2 flex flex-col items-center"
                    style={{ left: `${getPercent(km)}%` }}
                  >
                    <div className="w-[1px] h-1.5 bg-[#2a3e66]"></div>
                    <span>{km}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Selected Entity Spotlight Banner */}
          <div className="mt-3 p-2.5 bg-[#091222] border border-[#1e3054] rounded text-xs flex flex-wrap items-center justify-between gap-3">
            {selectedTrain && (
              <div className="flex items-center gap-4">
                <span className="font-bold text-sky-400 font-mono">
                  {selectedTrain.serviceNumber} ({selectedTrain.name})
                </span>
                <span className="text-slate-400">
                  Speed: <strong className="text-slate-200 mono-num">{selectedTrain.speed} km/h</strong>
                </span>
                <span className="text-slate-400">
                  Location: <strong className="text-slate-200 font-mono">{formatKm(trainPositions[selectedTrain.id] ?? selectedTrain.currentKm)}</strong>
                </span>
                <span className="text-slate-400">
                  Priority: <strong className="text-amber-300 font-mono">{selectedTrain.priority}</strong>
                </span>
                <span className="text-slate-400">
                  Constraint: <strong className="text-emerald-400 font-medium">Clear / Protected</strong>
                </span>
              </div>
            )}

            <div className="flex items-center gap-2">
              <Link
                href={`/blocks/${selectedBlockId}`}
                className="text-[11px] text-amber-400 hover:underline flex items-center gap-1 font-mono font-semibold"
              >
                <Eye className="w-3 h-3" /> Inspect Block B-014 Dossier →
              </Link>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Next Train Movements Panel */}
        <div className="bg-[#0c1527] border border-[#1a2948] rounded-lg p-4 flex flex-col justify-between shadow-lg">
          <div>
            <div className="flex items-center justify-between pb-2.5 border-b border-[#16233d]">
              <h3 className="text-xs font-semibold text-white tracking-wider uppercase flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-sky-400" />
                <span>Next Train Movements</span>
              </h3>
              <span className="text-[10px] font-mono text-slate-400">SEC–NDL</span>
            </div>

            <div className="space-y-2 mt-3">
              {trains.map((t) => {
                const isSelected = t.id === selectedTrainId;
                return (
                  <div
                    key={t.id}
                    onClick={() => setSelectedTrainId(t.id)}
                    className={cn(
                      "p-2 rounded border transition-all cursor-pointer text-xs",
                      isSelected
                        ? "bg-[#132240] border-sky-500/70 shadow-sm"
                        : "bg-[#080f1d] border-[#15233c] hover:bg-[#0e192f]"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 font-mono font-bold text-slate-200">
                        <span
                          className={cn(
                            "w-1.5 h-1.5 rounded-full",
                            t.isForecast ? "bg-emerald-400" : "bg-sky-400"
                          )}
                        ></span>
                        <span>{t.serviceNumber}</span>
                        <span className="text-[10px] text-slate-400 font-sans truncate max-w-[85px]">
                          {t.name}
                        </span>
                      </div>
                      <span className="mono-num text-[10px] text-slate-300 font-semibold">
                        {t.scheduledTime}
                      </span>
                    </div>

                    <div className="flex items-center justify-between mt-1 text-[10px] text-slate-400 font-mono">
                      <span>
                        KM {t.startKm} → {t.endKm}
                      </span>
                      <span
                        className={cn(
                          "px-1 py-0.2 rounded font-semibold",
                          t.isForecast
                            ? "bg-emerald-950/80 text-emerald-300 border border-emerald-700/50"
                            : "bg-sky-950/80 text-sky-300"
                        )}
                      >
                        {t.isForecast ? "FORECAST" : "ON TIME"}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-3 border-t border-[#16233d] mt-3">
            <Link
              href="/time-distance"
              className="text-[11px] text-sky-400 hover:text-sky-300 font-medium flex items-center justify-between"
            >
              <span>Open Time–Distance Diagram</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>

      {/* Split Bottom Section: Today's Block Plan (Left) + System Data Sources & Activity (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left 2 Cols: Today's Block Plan & Siloed vs Integrated Preview */}
        <div className="lg:col-span-2 bg-[#0c1527] border border-[#1a2948] rounded-lg p-4 space-y-4">
          <div className="flex items-center justify-between pb-2.5 border-b border-[#16233d]">
            <div>
              <h3 className="text-xs font-semibold text-white tracking-wider uppercase flex items-center gap-2">
                <span>Today&apos;s Integrated Block Plan</span>
                <span className="text-[10px] font-mono text-amber-400 bg-amber-950/60 border border-amber-700/40 px-2 py-0.5 rounded">
                  Possessions Consolidated
                </span>
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Multi-departmental possessions scheduled inside verified timetable windows
              </p>
            </div>
            <Link
              href="/block-planner"
              className="text-xs font-semibold text-sky-400 hover:text-sky-300 flex items-center gap-1"
            >
              <span>Block Optimizer</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Siloed Baseline vs Integrated Transformation Banner */}
          <div className="p-3 bg-[#080e1b] rounded-lg border border-[#162544] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="space-y-1 w-full sm:w-auto">
              <span className="text-[10px] font-mono uppercase text-slate-400">
                Baseline (3 Disjointed Possessions)
              </span>
              <div className="flex items-center gap-1.5 font-mono text-[11px]">
                <span className="px-1.5 py-0.5 rounded bg-amber-950 text-amber-400 border border-amber-800">
                  B-011 (ENG 50m)
                </span>
                <span className="text-slate-600">+</span>
                <span className="px-1.5 py-0.5 rounded bg-sky-950 text-sky-400 border border-sky-800">
                  B-012 (S&T 40m)
                </span>
                <span className="text-slate-600">+</span>
                <span className="px-1.5 py-0.5 rounded bg-orange-950 text-orange-400 border border-orange-800">
                  B-013 (TRC 45m)
                </span>
              </div>
            </div>

            <div className="text-sky-400 font-bold hidden sm:block">
              <ArrowRight className="w-4 h-4" />
            </div>

            <div className="space-y-1 w-full sm:w-auto">
              <span className="text-[10px] font-mono uppercase text-emerald-400 font-semibold">
                Integrated Plan (1 Possession)
              </span>
              <div className="flex items-center gap-2 font-mono text-xs">
                <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40">
                  B-014: 02:20–04:10 (ENG + S&T + TRC)
                </span>
                <span className="text-[10px] text-emerald-400 font-mono font-bold">
                  ↓ 67% Possessions
                </span>
              </div>
            </div>
          </div>

          {/* Block Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {blocks.map((blk) => (
              <div
                key={blk.blockId}
                onClick={() => setSelectedBlockId(blk.blockId)}
                className={cn(
                  "p-3 rounded-lg border transition-all cursor-pointer flex flex-col justify-between",
                  blk.blockId === selectedBlockId
                    ? "bg-[#111e38] border-amber-400/80 shadow-md ring-1 ring-amber-400/50"
                    : "bg-[#091122] border-[#182643] hover:bg-[#0e192f]"
                )}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-white">
                        {blk.blockId}
                      </span>
                      {blk.isIntegrated && (
                        <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          INTEGRATED
                        </span>
                      )}
                    </div>
                    <span className="mono-num text-[10px] font-semibold text-amber-400 bg-amber-950/60 px-1.5 py-0.5 rounded border border-amber-700/50">
                      {blk.startTime} – {blk.endTime}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-300 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-sky-400" />
                    <span>{blk.section}</span>
                    <span className="font-mono text-slate-400">
                      ({formatKmRange(blk.kmStart, blk.kmEnd)})
                    </span>
                  </p>

                  <div className="flex flex-wrap gap-1 mt-2">
                    {blk.departments.map((d) => (
                      <span
                        key={d}
                        className="text-[9.5px] font-medium px-1.5 py-0.2 rounded bg-[#080e1b] text-slate-300 border border-[#16233d]"
                      >
                        {d}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between text-[10px] text-slate-400 pt-2 mt-2 border-t border-[#14223d]">
                  <span>Utilization: <strong className="text-emerald-400 font-mono">{blk.utilization}%</strong></span>
                  <Link
                    href={`/blocks/${blk.blockId}`}
                    className="text-sky-400 hover:underline flex items-center gap-0.5"
                  >
                    <span>Dossier</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Candidate Consolidation Action Notice */}
          <div className="p-3 bg-sky-950/30 border border-sky-800/40 rounded-lg flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-sky-200">
              <Info className="w-4 h-4 text-sky-400 shrink-0" />
              <span>
                <strong>Next Planning Decision:</strong> 3 pending maintenance work orders at KM 68–94 are eligible for unified inclusion into Block B-014.
              </span>
            </div>
            <Link
              href="/block-planner"
              className="px-2.5 py-1 rounded bg-sky-600 hover:bg-sky-500 text-white font-semibold text-[11px] shrink-0 transition-colors"
            >
              Open Planner →
            </Link>
          </div>
        </div>

        {/* Right 1 Col: Input Data Sources & Chronological Activity Feed */}
        <div className="space-y-4">
          {/* Data Sources Ingest Panel */}
          <div className="bg-[#0c1527] border border-[#1a2948] rounded-lg p-4">
            <h3 className="text-xs font-semibold text-white tracking-wider uppercase pb-2.5 border-b border-[#16233d] flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-sky-400" />
              <span>Input Data Sources (Ingest)</span>
            </h3>

            <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
              {[
                { name: "TMS (Track)", status: "Synthetic", color: "text-amber-400" },
                { name: "SMMS (Signalling)", status: "Synthetic", color: "text-sky-400" },
                { name: "TDMS (Traction)", status: "Synthetic", color: "text-orange-400" },
                { name: "COA (Timetable)", status: "Synthetic", color: "text-emerald-400" },
                { name: "Goods Forecast", status: "Synthetic", color: "text-emerald-400" },
                { name: "Corridor Limits", status: "Synthetic", color: "text-purple-400" },
              ].map((src) => (
                <div
                  key={src.name}
                  className="p-2 rounded bg-[#080f1d] border border-[#15233c] flex items-center justify-between"
                >
                  <span className="text-[11px] font-medium text-slate-300 truncate">
                    {src.name}
                  </span>
                  <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-[#0e192f] text-slate-400 border border-[#182643]">
                    ● Synced
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Operational Activity Feed */}
          <div className="bg-[#0c1527] border border-[#1a2948] rounded-lg p-4">
            <h3 className="text-xs font-semibold text-white tracking-wider uppercase pb-2.5 border-b border-[#16233d] flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>Recent Operational Events</span>
            </h3>

            <div className="space-y-2.5 mt-3 text-xs">
              {[
                { time: "02:12", text: "Rajdhani 12723 approaching Kazipet (KM 32)", type: "train" },
                { time: "02:08", text: "Block B-014 activated across KM 68–94", type: "block" },
                { time: "01:56", text: "Tower wagon TW-4401 entered possession zone", type: "crew" },
                { time: "01:45", text: "S&T task ST-129 joined integrated possession", type: "task" },
                { time: "01:32", text: "OHE power isolation verified at Feeding Post", type: "power" },
              ].map((evt, idx) => (
                <div key={idx} className="flex items-start gap-2 text-[11px]">
                  <span className="mono-num text-slate-400 font-semibold shrink-0">
                    {evt.time}
                  </span>
                  <span className="text-slate-300 leading-tight">
                    {evt.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Frontend Prototype Planning Run Modal */}
      {isSimulating && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-[#0d1629] border border-[#1e3258] rounded-xl p-6 max-w-lg w-full shadow-2xl space-y-4 animate-fadeIn">
            <div className="flex items-start justify-between pb-3 border-b border-[#182643]">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-500/30">
                    PROTOTYPE SIMULATION RUN
                  </span>
                </div>
                <h3 className="text-sm font-bold text-white mt-1">
                  Corridor Maintenance Optimization Simulation
                </h3>
              </div>
              <button
                onClick={() => setIsSimulating(false)}
                className="text-slate-400 hover:text-white p-1 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Stepper progress */}
            <div className="space-y-3 py-2 text-xs">
              {[
                { step: 1, title: "Ingesting Work Orders", desc: "18 backlog requests from TMS, SMMS & TDMS" },
                { step: 2, title: "Checking Constraints", desc: "Safety rules, OHE isolation, timetable headway" },
                { step: 3, title: "Composing Compatible Tasks", desc: "Engineering + S&T + Traction unified at KM 68–94" },
                { step: 4, title: "Corridor Slot Feasibility", desc: "Zero passenger conflicts in 02:20–04:10 window" },
                { step: 5, title: "Integrated Plan Synthesized", desc: "Block B-014 verified with 89% track utilization" },
              ].map((s) => {
                const isDone = simStep > s.step;
                const isCurrent = simStep === s.step;

                return (
                  <div key={s.step} className="flex items-start gap-3">
                    <div className="mt-0.5">
                      {isDone ? (
                        <div className="w-4 h-4 rounded-full bg-emerald-500/20 border border-emerald-500 text-emerald-400 flex items-center justify-center">
                          <Check className="w-2.5 h-2.5" />
                        </div>
                      ) : isCurrent ? (
                        <div className="w-4 h-4 rounded-full bg-sky-500/20 border border-sky-400 text-sky-400 flex items-center justify-center animate-spin">
                          <Loader2 className="w-2.5 h-2.5" />
                        </div>
                      ) : (
                        <div className="w-4 h-4 rounded-full bg-[#131f38] text-slate-500 flex items-center justify-center text-[9px] font-mono">
                          {s.step}
                        </div>
                      )}
                    </div>
                    <div>
                      <h4
                        className={cn(
                          "font-semibold text-xs",
                          isDone ? "text-slate-200" : isCurrent ? "text-sky-300" : "text-slate-500"
                        )}
                      >
                        {s.title}
                      </h4>
                      <p className="text-[11px] text-slate-400">{s.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-3 border-t border-[#182643] flex items-center justify-between">
              <span className="text-[10px] font-mono text-slate-400">
                Simulation complete · Fast evaluation
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsSimulating(false)}
                  className="px-3 py-1.5 rounded bg-[#16233d] hover:bg-[#1f3054] text-slate-200 text-xs font-medium"
                >
                  Close
                </button>
                <Link
                  href="/block-planner"
                  className="px-3 py-1.5 rounded bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold"
                >
                  Open in Optimizer →
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}
