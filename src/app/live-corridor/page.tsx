"use client";

import React, { useState, useEffect, useMemo } from "react";
import { AppShell } from "@/components/shell/AppShell";
import { LiveCorridorHeader } from "@/components/corridor/LiveCorridorHeader";
import { RailwayCanvas, CorridorStation } from "@/components/corridor/RailwayCanvas";
import { InspectorPanel } from "@/components/corridor/InspectorPanel";
import { EventLogFeed, SimEvent } from "@/components/corridor/EventLogFeed";
import { CorridorStatusStrip } from "@/components/corridor/CorridorStatusStrip";
import { BlockDenialWorkflow } from "@/components/corridor/BlockDenialWorkflow";
import { AddCriticalWorkModal } from "@/components/corridor/AddCriticalWorkModal";
import { SimTrain } from "@/components/corridor/TrainVisual";
import { SimSignal } from "@/components/corridor/SignalVisual";
import { SimBlock } from "@/components/corridor/MaintenanceBlockVisual";
import { usePlanningRun } from "@/context/PlanningRunContext";

const STATIONS: CorridorStation[] = [
  { id: "SEC", code: "SEC", name: "Secunderabad Jn", km: 40, platforms: 6, tracks: 4 },
  { id: "LBN", code: "LBN", name: "Labanya Nagar", km: 58, platforms: 2, tracks: 2 },
  { id: "KCG", code: "KCG", name: "Kacheguda Central", km: 76, platforms: 4, tracks: 3 },
  { id: "MCL", code: "MCL", name: "Malkajgiri Loop", km: 98, platforms: 2, tracks: 2 },
  { id: "NDL", code: "NDL", name: "Nandyal Jn", km: 120, platforms: 5, tracks: 4 },
];

const INITIAL_TRAINS: SimTrain[] = [
  {
    id: "VB-2061",
    number: "20833",
    name: "Vande Bharat Express",
    type: "Vande Bharat",
    priority: "HIGH",
    track: "DN",
    currentKm: 62.4,
    baseKm: 62.4,
    speed: 88,
    direction: "DN",
    nextStation: "KCG (KM 76)",
    etaNext: "02:44",
    status: "APPROACHING",
    color: "#0284c7",
    cars: 8,
    lengthKm: 2.2,
  },
  {
    id: "R-124",
    number: "12723",
    name: "Telangana Rajdhani",
    type: "Rajdhani",
    priority: "HIGH",
    track: "UP",
    currentKm: 104.0,
    baseKm: 104.0,
    speed: 76,
    direction: "UP",
    nextStation: "MCL (KM 98)",
    etaNext: "02:51",
    status: "RUNNING",
    color: "#dc2626",
    cars: 10,
    lengthKm: 2.8,
  },
  {
    id: "S-204",
    number: "12027",
    name: "Shatabdi Express",
    type: "Shatabdi",
    priority: "MEDIUM",
    track: "DN",
    currentKm: 46.5,
    baseKm: 46.5,
    speed: 70,
    direction: "DN",
    nextStation: "LBN (KM 58)",
    etaNext: "02:49",
    status: "RUNNING",
    color: "#3b82f6",
    cars: 7,
    lengthKm: 2.0,
  },
  {
    id: "AB-160",
    number: "12076",
    name: "Amrit Bharat Express",
    type: "Amrit Bharat",
    priority: "NORMAL",
    track: "UP",
    currentKm: 88.0,
    baseKm: 88.0,
    speed: 64,
    direction: "UP",
    nextStation: "KCG (KM 76)",
    etaNext: "03:02",
    status: "RUNNING",
    color: "#ea580c",
    cars: 9,
    lengthKm: 2.5,
  },
  {
    id: "T-901",
    number: "22119",
    name: "Tejas Superfast",
    type: "Tejas",
    priority: "MEDIUM",
    track: "DN",
    currentKm: 112.0,
    baseKm: 112.0,
    speed: 72,
    direction: "DN",
    nextStation: "NDL (KM 120)",
    etaNext: "02:56",
    status: "RUNNING",
    color: "#d97706",
    cars: 8,
    lengthKm: 2.2,
  },
  {
    id: "G-4217",
    number: "G/4217",
    name: "Container Freight (Forecast)",
    type: "Goods Forecast",
    priority: "FREIGHT",
    track: "DN",
    currentKm: 52.0,
    baseKm: 52.0,
    speed: 48,
    direction: "DN",
    nextStation: "KCG (KM 76)",
    etaNext: "03:38 (Exp)",
    status: "FORECAST",
    color: "#9333ea",
    cars: 12,
    lengthKm: 3.4,
    isForecast: true,
  },
];

const INITIAL_BLOCK: SimBlock = {
  id: "B-014",
  name: "Integrated Possession B-014",
  startKm: 68,
  endKm: 94,
  track: "DN",
  startTime: "02:20",
  endTime: "04:10",
  durationMin: 110,
  usableMin: 90,
  status: "PROTECTED",
  departments: ["ENGINEERING", "S&T", "TRACTION"],
  taskCount: 7,
  machinery: [
    "Continuous Tamping Machine (CTM-04)",
    "Dynamic Track Stabilizer (DTS-11)",
    "Tower Wagon (TW-09)",
  ],
  tasks: [
    { id: "ENG-204", dept: "Engineering", desc: "Track tamping & ballast regulating", km: "KM 72-84" },
    { id: "SNT-118", dept: "S&T", desc: "Digital Axle Counter & Point overhaul", km: "KM 76" },
    { id: "TRD-076", dept: "Traction", desc: "OHE cantilever bracket & insulator wash", km: "KM 68-94" },
    { id: "ENG-209", dept: "Engineering", desc: "Switch rail ultrasonic testing (USFD)", km: "KM 75-77" },
    { id: "TRD-082", dept: "Traction", desc: "Contact wire tensioning check", km: "KM 70-82" },
    { id: "SNT-124", dept: "S&T", desc: "Track circuit bonding renewal", km: "KM 80-86" },
    { id: "ENG-215", dept: "Engineering", desc: "Weld collar grinding & joint packing", km: "KM 90-93" },
  ],
};

export default function LiveCorridorPage() {
  const { currentRun, isBackend, denyBlock, addCriticalTask, resetDemo } = usePlanningRun();

  // Simulation Controls
  const [isPlaying, setIsPlaying] = useState(true);
  const [playbackSpeed, setPlaybackSpeed] = useState<1 | 2 | 4>(1);
  const [simSeconds, setSimSeconds] = useState(9102); // 02:31:42 IST
  const [zoomMode, setZoomMode] = useState<"MACRO" | "CORRIDOR" | "BLOCK">("CORRIDOR");

  // Operational Simulation State
  const [trains, setTrains] = useState<SimTrain[]>(INITIAL_TRAINS);
  const [block, setBlock] = useState<SimBlock>(INITIAL_BLOCK);
  const [isDenied, setIsDenied] = useState(false);
  const [isReplanned, setIsReplanned] = useState(false);
  const [isAddWorkOpen, setIsAddWorkOpen] = useState(false);

  // Inspector Selection State
  const [selectedEntity, setSelectedEntity] = useState<{
    type: "TRAIN" | "BLOCK" | "SIGNAL" | "STATION";
    data: unknown;
  }>({
    type: "BLOCK",
    data: INITIAL_BLOCK,
  });

  // Sync with active PlanningRun if available
  useEffect(() => {
    if (currentRun?.weekly_plan && currentRun.weekly_plan.length > 0) {
      const firstBlock = currentRun.weekly_plan[0];
      const depts: ("ENGINEERING" | "S&T" | "TRACTION")[] = ["ENGINEERING", "S&T", "TRACTION"];
      const bTasks = (firstBlock.tasks && firstBlock.tasks.length > 0)
        ? firstBlock.tasks.map((t: { task_id?: string; department?: string; title?: string; km_start?: number; km_end?: number }, idx: number) => ({
            id: t.task_id || `TSK-${idx + 1}`,
            dept: t.department || "Engineering",
            desc: t.title || "Track renewal / overhaul",
            km: `KM ${t.km_start ?? firstBlock.km_start ?? 68}-${t.km_end ?? firstBlock.km_end ?? 94}`,
          }))
        : INITIAL_BLOCK.tasks;

      const updatedBlock: SimBlock = {
        id: firstBlock.block_id || "B-014",
        name: `Integrated Possession ${firstBlock.block_id || "B-014"}`,
        startKm: firstBlock.km_start ?? 68,
        endKm: firstBlock.km_end ?? 94,
        track: firstBlock.line?.toUpperCase().includes("UP") ? "UP" : "DN",
        startTime: firstBlock.start_time || "02:20",
        endTime: firstBlock.end_time || "04:10",
        durationMin: firstBlock.duration_minutes || 110,
        usableMin: Math.max(30, (firstBlock.duration_minutes || 110) - 20),
        status: "PROTECTED",
        departments: depts,
        taskCount: bTasks.length,
        machinery: ((firstBlock as any).machinery && (firstBlock as any).machinery.length > 0)
          ? (firstBlock as any).machinery
          : INITIAL_BLOCK.machinery,
        tasks: bTasks,
      };

      setBlock(updatedBlock);
      setSelectedEntity((prev) => (prev.type === "BLOCK" ? { type: "BLOCK", data: updatedBlock } : prev));
    }
  }, [currentRun]);

  // Event Log
  const [eventLog, setEventLog] = useState<SimEvent[]>([
    { time: "02:31:18", text: "VB-20833 entered approach section towards KM 68", type: "info" },
    { time: "02:31:26", text: "Possession B-014 active (KM 68–94 DN Line · 3 Depts)", type: "success" },
    { time: "02:31:31", text: "Signal S-18 (KM 66.8 DN) aspect set to RED", type: "warn" },
    { time: "02:31:39", text: "VB-20833 decelerating outside KM 68 boundary board", type: "error" },
  ]);

  // Format Clock (HH:MM:SS)
  const formatClock = (seconds: number) => {
    const hrs = Math.floor((seconds / 3600) % 24).toString().padStart(2, "0");
    const mins = Math.floor((seconds / 60) % 60).toString().padStart(2, "0");
    const secs = Math.floor(seconds % 60).toString().padStart(2, "0");
    return `${hrs}:${mins}:${secs}`;
  };

  // Deterministic Animation Loop
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setSimSeconds((s) => s + playbackSpeed);

      setTrains((prevTrains) => {
        return prevTrains.map((trn) => {
          let pos = trn.currentKm;
          let status = trn.status;
          const delta = (trn.speed / 3600) * 0.4 * playbackSpeed;

          if (trn.direction === "DN") {
            // Moving towards 120km (Eastbound)
            const isBlockedByB014 =
              !isDenied && !isReplanned && block.track === "DN" && block.status === "PROTECTED";
            const isApproachingHoldZone =
              isBlockedByB014 && trn.id === "VB-2061" && pos >= 64.5 && pos <= 67.4;

            if (isApproachingHoldZone) {
              // Vande Bharat slows and holds before block entrance
              status = "HOLDING";
              pos = Math.min(pos + delta * 0.05, 67.2);
            } else {
              pos = pos >= 120 ? 40 : pos + delta;
              status = trn.isForecast ? "FORECAST" : "RUNNING";
            }
          } else {
            // UP Track (towards 40km, Westbound)
            pos = pos <= 40 ? 120 : pos - delta;
            status = "RUNNING";
          }

          return {
            ...trn,
            currentKm: Number(pos.toFixed(2)),
            status,
          };
        });
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isPlaying, playbackSpeed, isDenied, isReplanned, block]);

  // Dynamic Signals based on train proximity and possession state
  const signals: SimSignal[] = useMemo(() => {
    return [
      {
        id: "S-12",
        name: "Signal S-12 (LBN DN Outer)",
        km: 56.0,
        track: "DN",
        aspect: "DOUBLE_YELLOW",
        reason: "Approach caution towards active section",
      },
      {
        id: "S-18",
        name: "Signal S-18 (B-014 DN Gate)",
        km: 66.8,
        track: "DN",
        aspect: !isDenied && !isReplanned ? "RED" : "GREEN",
        reason:
          !isDenied && !isReplanned
            ? "Active Possession B-014 Ahead (KM 68–94)"
            : "Track Clear (Possession Replanned to Fallback Window)",
      },
      {
        id: "S-24",
        name: "Signal S-24 (KCG Station Advance)",
        km: 78.5,
        track: "DN",
        aspect: "YELLOW",
        reason: "Work zone restricted speed 30 km/h",
      },
      {
        id: "S-31",
        name: "Signal S-31 (MCL UP Starter)",
        km: 96.0,
        track: "UP",
        aspect: "GREEN",
        reason: "UP track normal clearance",
      },
      {
        id: "S-39",
        name: "Signal S-39 (NDL UP Home)",
        km: 118.0,
        track: "UP",
        aspect: "GREEN",
        reason: "Route set for Main Line",
      },
    ];
  }, [isDenied, isReplanned]);

  // Handlers
  const handleSimulateDenial = () => {
    setIsDenied(true);
    setBlock((b) => ({ ...b, status: "DENIED" }));
    denyBlock(block.id).catch(console.error);
    setEventLog((prev) => [
      {
        time: formatClock(simSeconds),
        text: "Operating Control: B-014 DENIED in 02:20–04:10 slot (Dispatched to engine)",
        type: "error",
      },
      {
        time: formatClock(simSeconds + 1),
        text: "Signal S-18 aspect recalculated. Evaluating fallback slots...",
        type: "warn",
      },
      ...prev,
    ]);
  };

  const handleReplanToFallback = (selectedFallback: { startTime: string; endTime: string; durationMin: number; id: string }) => {
    setIsReplanned(true);
    setIsDenied(false);
    setBlock({
      ...block,
      startTime: selectedFallback.startTime,
      endTime: selectedFallback.endTime,
      durationMin: selectedFallback.durationMin,
      status: "PROTECTED",
    });
    setEventLog((prev) => [
      {
        time: formatClock(simSeconds),
        text: `REPLAN ACCEPTED: B-014 shifted to ${selectedFallback.startTime}–${selectedFallback.endTime} (${selectedFallback.id})`,
        type: "success",
      },
      {
        time: formatClock(simSeconds + 1),
        text: "Signal S-18 cleared to GREEN. VB-20833 resuming normal speed notch",
        type: "info",
      },
      {
        time: formatClock(simSeconds + 2),
        text: "CRITICAL WORK RETAINED (7/7) · PASSENGER PATHS PROTECTED",
        type: "success",
      },
      ...prev,
    ]);
  };

  const handleReset = () => {
    setIsDenied(false);
    setIsReplanned(false);
    setBlock(INITIAL_BLOCK);
    setTrains(INITIAL_TRAINS);
    setSimSeconds(9102);
    setSelectedEntity({ type: "BLOCK", data: INITIAL_BLOCK });
    resetDemo().catch(console.error);
    setEventLog((prev) => [
      {
        time: "02:31:42",
        text: "Simulation state reset to baseline operational schedule.",
        type: "info",
      },
      ...prev,
    ]);
  };

  const handleAddCriticalWork = (task: { id: string; dept: string; desc: string; km: string }) => {
    setBlock((prev) => ({
      ...prev,
      taskCount: prev.taskCount + 1,
      tasks: [task, ...prev.tasks],
    }));
    addCriticalTask({
      defect_type: `${task.dept} ${task.desc}`,
      line: "DOWN",
      km_start: 73.5,
      km_end: 74.0,
      depth_mm: 7.2,
    }).catch(console.error);
    setEventLog((prev) => [
      {
        time: formatClock(simSeconds),
        text: `EMERGENCY WORK ADDED: ${task.id} (${task.dept} · ${task.desc} at ${task.km})`,
        type: "warn",
      },
      {
        time: formatClock(simSeconds + 1),
        text: "B-014 work zone re-calculated: tasks co-located inside single possession.",
        type: "success",
      },
      ...prev,
    ]);
  };

  return (
    <AppShell>
      <div className="flex flex-col h-[calc(100vh-120px)] max-w-[1580px] mx-auto bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-2xl overflow-hidden shadow-2xl mb-4">
        {/* 1. TOP OPERATIONAL STATUS BAR */}
        <LiveCorridorHeader
          simSeconds={simSeconds}
          isPlaying={isPlaying}
          onTogglePlay={() => setIsPlaying(!isPlaying)}
          onReset={handleReset}
          playbackSpeed={playbackSpeed}
          onSpeedChange={setPlaybackSpeed}
          zoomMode={zoomMode}
          onZoomChange={setZoomMode}
          isDenied={isDenied}
          onSimulateDenial={handleSimulateDenial}
          onOpenAddWork={() => setIsAddWorkOpen(true)}
        />

        {/* 2. MAIN SIMULATION VIEWPORT: 75% RAILWAY CANVAS + 25% INSPECTOR */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          {/* Left / Center 75%: The Physical 2D/2.5D Railway Corridor Scene */}
          <div className="flex-1 flex flex-col min-w-0 bg-[#050b17] relative">
            <RailwayCanvas
              stations={STATIONS}
              trains={trains}
              signals={signals}
              block={block}
              selectedEntity={selectedEntity}
              onSelectEntity={setSelectedEntity}
              zoomMode={zoomMode}
              isDenied={isDenied}
            />

            {/* Operational Event Feed */}
            <EventLogFeed events={eventLog} />
          </div>

          {/* Right 25%: Inspector Panel */}
          <div className="lg:w-80 xl:w-96 flex-shrink-0 flex flex-col">
            <InspectorPanel selectedEntity={selectedEntity} />
          </div>
        </div>

        {/* 3. BOTTOM OPERATIONAL STATUS STRIP & LEGEND */}
        <CorridorStatusStrip
          activeTrainsCount={trains.length}
          activeBlocksCount={block.status === "PROTECTED" ? 1 : 0}
          protectedTrainsCount={4}
          goodsForecastCount={1}
          conflictsCount={0}
        />
      </div>

      {/* Block Denial & Fallback Replanning Modal */}
      <BlockDenialWorkflow
        isOpen={isDenied}
        onClose={() => setIsDenied(false)}
        onReplan={handleReplanToFallback}
      />

      {/* Add Critical Work Modal */}
      <AddCriticalWorkModal
        isOpen={isAddWorkOpen}
        onClose={() => setIsAddWorkOpen(false)}
        onAddCriticalWork={handleAddCriticalWork}
      />
    </AppShell>
  );
}
