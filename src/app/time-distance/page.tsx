"use client";

import React, { useState, useMemo } from "react";
import { TimeDistanceHeader } from "@/components/time-distance/TimeDistanceHeader";
import {
  TimeDistanceSvgChart,
  STATIONS_GRID,
} from "@/components/time-distance/TimeDistanceSvgChart";
import { TimeDistanceControls } from "@/components/time-distance/TimeDistanceControls";
import { CandidateWindowsPanel } from "@/components/time-distance/CandidateWindowsPanel";
import { BlockConstraintsPanel } from "@/components/time-distance/BlockConstraintsPanel";
import { WhyThisWindowCard } from "@/components/time-distance/WhyThisWindowCard";
import { TimeDistanceInspector } from "@/components/time-distance/TimeDistanceInspector";
import {
  TimeDistanceTrain,
  BlockPossession,
  CandidateWindow,
  ConflictPoint,
} from "@/components/time-distance/types";
import {
  timeStringToMinutes,
  minutesToTimeString,
} from "@/lib/calculations";
import { AppShell } from "@/components/shell/AppShell";

// Canonical Trains with realistic trajectories across SEC (KM 40) to NDL (KM 120)
const INITIAL_TRAINS: TimeDistanceTrain[] = [
  {
    id: "VB-20833",
    name: "Vande Bharat 20833",
    serviceNumber: "20833",
    type: "Vande Bharat Trainset",
    priority: "HIGH",
    direction: "DOWN",
    color: "#38bdf8",
    trajectory: [
      { km: 40, time: "02:00", minutesFromMidnight: 120, stationCode: "SEC" },
      { km: 58, time: "02:24", minutesFromMidnight: 144, stationCode: "LBN" },
      { km: 68, time: "02:38", minutesFromMidnight: 158, stationCode: "WL" },
      { km: 76, time: "02:49", minutesFromMidnight: 169, stationCode: "KCG", isDwell: true, dwellMin: 3 },
      { km: 76, time: "02:52", minutesFromMidnight: 172, stationCode: "KCG" },
      { km: 94, time: "03:08", minutesFromMidnight: 188, stationCode: "NDKD" },
      { km: 120, time: "03:32", minutesFromMidnight: 212, stationCode: "NDL" },
    ],
  },
  {
    id: "R-12723",
    name: "Telangana Rajdhani 12723",
    serviceNumber: "12723",
    type: "Rajdhani LHB",
    priority: "HIGH",
    direction: "DOWN",
    color: "#ef4444",
    trajectory: [
      { km: 40, time: "02:25", minutesFromMidnight: 145, stationCode: "SEC" },
      { km: 58, time: "02:52", minutesFromMidnight: 172, stationCode: "LBN" },
      { km: 68, time: "03:08", minutesFromMidnight: 188, stationCode: "WL" },
      { km: 76, time: "03:20", minutesFromMidnight: 200, stationCode: "KCG", isDwell: true, dwellMin: 3 },
      { km: 76, time: "03:23", minutesFromMidnight: 203, stationCode: "KCG" },
      { km: 94, time: "03:42", minutesFromMidnight: 222, stationCode: "NDKD" },
      { km: 120, time: "04:10", minutesFromMidnight: 250, stationCode: "NDL" },
    ],
  },
  {
    id: "S-12027",
    name: "Shatabdi Express 12027",
    serviceNumber: "12027",
    type: "Shatabdi Chair Car",
    priority: "MEDIUM",
    direction: "UP",
    color: "#60a5fa",
    trajectory: [
      { km: 120, time: "03:15", minutesFromMidnight: 195, stationCode: "NDL" },
      { km: 94, time: "03:42", minutesFromMidnight: 222, stationCode: "NDKD" },
      { km: 76, time: "04:02", minutesFromMidnight: 242, stationCode: "KCG", isDwell: true, dwellMin: 2 },
      { km: 76, time: "04:04", minutesFromMidnight: 244, stationCode: "KCG" },
      { km: 68, time: "04:16", minutesFromMidnight: 256, stationCode: "WL" },
      { km: 58, time: "04:30", minutesFromMidnight: 270, stationCode: "LBN" },
      { km: 40, time: "04:55", minutesFromMidnight: 295, stationCode: "SEC" },
    ],
  },
  {
    id: "AB-12076",
    name: "Amrit Bharat 12076",
    serviceNumber: "12076",
    type: "Amrit Bharat Push-Pull",
    priority: "NORMAL",
    direction: "DOWN",
    color: "#f97316",
    trajectory: [
      { km: 40, time: "03:05", minutesFromMidnight: 185, stationCode: "SEC" },
      { km: 58, time: "03:36", minutesFromMidnight: 216, stationCode: "LBN" },
      { km: 68, time: "03:54", minutesFromMidnight: 234, stationCode: "WL" },
      { km: 76, time: "04:08", minutesFromMidnight: 248, stationCode: "KCG" },
      { km: 94, time: "04:35", minutesFromMidnight: 275, stationCode: "NDKD" },
      { km: 120, time: "05:10", minutesFromMidnight: 310, stationCode: "NDL" },
    ],
  },
  {
    id: "T-22119",
    name: "Tejas Superfast 22119",
    serviceNumber: "22119",
    type: "Tejas Express",
    priority: "MEDIUM",
    direction: "UP",
    color: "#eab308",
    trajectory: [
      { km: 120, time: "04:20", minutesFromMidnight: 260, stationCode: "NDL" },
      { km: 94, time: "04:46", minutesFromMidnight: 286, stationCode: "NDKD" },
      { km: 76, time: "05:04", minutesFromMidnight: 304, stationCode: "KCG" },
      { km: 68, time: "05:16", minutesFromMidnight: 316, stationCode: "WL" },
      { km: 58, time: "05:28", minutesFromMidnight: 328, stationCode: "LBN" },
      { km: 40, time: "05:50", minutesFromMidnight: 350, stationCode: "SEC" },
    ],
  },
  {
    id: "G-4217",
    name: "Container Freight G/4217",
    serviceNumber: "G/4217",
    type: "Freight Goods",
    priority: "FREIGHT",
    direction: "DOWN",
    color: "#10b981",
    isForecast: true,
    trajectory: [
      { km: 40, time: "03:38", minutesFromMidnight: 218, stationCode: "SEC" },
      { km: 58, time: "04:18", minutesFromMidnight: 258, stationCode: "LBN" },
      { km: 68, time: "04:45", minutesFromMidnight: 285, stationCode: "WL" },
      { km: 76, time: "05:05", minutesFromMidnight: 305, stationCode: "KCG" },
      { km: 94, time: "05:35", minutesFromMidnight: 335, stationCode: "NDKD" },
      { km: 120, time: "06:10", minutesFromMidnight: 370, stationCode: "NDL" },
    ],
  },
];

// Initial Possession B-014
const BASE_BLOCK: BlockPossession = {
  id: "B-014",
  name: "Integrated Possession B-014",
  corridor: "SEC - NDL",
  section: "WL - NDKD",
  startKm: 68,
  endKm: 94,
  startTime: "02:20",
  endTime: "04:10",
  durationMin: 110,
  usableMin: 90,
  departments: ["Engineering", "S&T", "Traction"],
  tasksCount: 18,
  p1Tasks: 3,
  p2Tasks: 7,
  status: "CONFLICT",
};

// Candidate Windows for Objective Evaluation
const CANDIDATE_WINDOWS: CandidateWindow[] = [
  {
    id: "WIN-A",
    name: "WINDOW A",
    startTime: "02:20",
    endTime: "04:10",
    startKm: 68,
    endKm: 94,
    durationMin: 110,
    usableMin: 90,
    status: "CONFLICT",
    passengerConflicts: 2,
    freightInteractions: 0,
    description: "2 passenger train path intersections (Vande Bharat & Rajdhani).",
  },
  {
    id: "WIN-B",
    name: "WINDOW B",
    startTime: "04:20",
    endTime: "06:10",
    startKm: 68,
    endKm: 94,
    durationMin: 110,
    usableMin: 90,
    status: "FEASIBLE",
    passengerConflicts: 0,
    freightInteractions: 1,
    description: "Trailing window with zero passenger conflicts; freight forecast accommodates loop regulation.",
  },
  {
    id: "WIN-C",
    name: "WINDOW C",
    startTime: "01:10",
    endTime: "02:40",
    startKm: 68,
    endKm: 94,
    durationMin: 90,
    usableMin: 70,
    status: "PARTIAL",
    passengerConflicts: 1,
    freightInteractions: 1,
    description: "Partial clearance; 70 min usable work time falls below 90 min required threshold.",
  },
];

export default function TimeDistancePage() {
  // Layer toggles
  const [showPassenger, setShowPassenger] = useState(true);
  const [showFreight, setShowFreight] = useState(true);
  const [showForecast, setShowForecast] = useState(true);
  const [showBlock, setShowBlock] = useState(true);
  const [showConflicts, setShowConflicts] = useState(true);
  const [showSafeWindow, setShowSafeWindow] = useState(true);

  // Time adjustment state (relative shift in minutes)
  const [timeShiftMinutes, setTimeShiftMinutes] = useState(0);
  const [isReplanned, setIsReplanned] = useState(false);
  const [selectedCandidateId, setSelectedCandidateId] = useState<string | null>("WIN-A");

  // Current simulation clock (03:17 = 197 mins)
  const [currentTimeMins, setCurrentTimeMins] = useState(197);
  const [isPlaying, setIsPlaying] = useState(false);

  // Inspector state
  const [selectedEntity, setSelectedEntity] = useState<{
    type: "TRAIN" | "BLOCK" | "CONFLICT" | "STATION" | "CANDIDATE" | null;
    data: any;
  }>({
    type: "BLOCK",
    data: BASE_BLOCK,
  });

  // Calculate active block window based on base time + shift
  const activeBlock = useMemo<BlockPossession>(() => {
    if (isReplanned) {
      return {
        ...BASE_BLOCK,
        startTime: "04:20",
        endTime: "06:10",
        status: "FEASIBLE",
      };
    }

    const baseStartMins = timeStringToMinutes("02:20");
    const baseEndMins = timeStringToMinutes("04:10");

    const newStartMins = baseStartMins + timeShiftMinutes;
    const newEndMins = baseEndMins + timeShiftMinutes;

    return {
      ...BASE_BLOCK,
      startTime: minutesToTimeString(newStartMins),
      endTime: minutesToTimeString(newEndMins),
      status: timeShiftMinutes >= 120 ? "FEASIBLE" : "CONFLICT",
    };
  }, [timeShiftMinutes, isReplanned]);

  // Geometric Conflict Detection: Check where train path crosses activeBlock rectangle
  const calculatedConflicts = useMemo<ConflictPoint[]>(() => {
    const conflicts: ConflictPoint[] = [];
    const blockStartMins = timeStringToMinutes(activeBlock.startTime);
    const blockEndMins = timeStringToMinutes(activeBlock.endTime);

    INITIAL_TRAINS.forEach((trn) => {
      // Check each line segment
      for (let i = 0; i < trn.trajectory.length - 1; i++) {
        const p1 = trn.trajectory[i];
        const p2 = trn.trajectory[i + 1];

        const segMinKm = Math.min(p1.km, p2.km);
        const segMaxKm = Math.max(p1.km, p2.km);
        const segMinTime = Math.min(p1.minutesFromMidnight, p2.minutesFromMidnight);
        const segMaxTime = Math.max(p1.minutesFromMidnight, p2.minutesFromMidnight);

        // Check if spatial overlap and temporal overlap occur
        const spatialOverlap =
          Math.max(activeBlock.startKm, segMinKm) <= Math.min(activeBlock.endKm, segMaxKm);
        const temporalOverlap =
          Math.max(blockStartMins, segMinTime) <= Math.min(blockEndMins, segMaxTime);

        if (spatialOverlap && temporalOverlap) {
          // Calculate approx midpoint of intersection
          const interKm = Math.round((Math.max(activeBlock.startKm, segMinKm) + Math.min(activeBlock.endKm, segMaxKm)) / 2);
          const interTimeMins = Math.round((Math.max(blockStartMins, segMinTime) + Math.min(blockEndMins, segMaxTime)) / 2);

          conflicts.push({
            id: `CONF-${trn.id}-${i}`,
            trainId: trn.id,
            trainName: trn.name,
            trainType: trn.type,
            priority: trn.priority,
            direction: trn.direction,
            blockId: activeBlock.id,
            km: interKm,
            timeStr: minutesToTimeString(interTimeMins),
            timeMins: interTimeMins,
            conflictType: trn.isForecast ? "FORECAST_INTERACTION" : "DIRECT_OVERLAP",
            resolutionRequired: "REPLAN WINDOW",
          });
          break; // One conflict point per train
        }
      }
    });

    return conflicts;
  }, [activeBlock]);

  // Handle entity selection from chart
  const handleSelectEntity = (
    type: "TRAIN" | "BLOCK" | "CONFLICT" | "STATION" | "CANDIDATE",
    data: any
  ) => {
    setSelectedEntity({ type, data });
  };

  // Shift block window by delta
  const handleShiftTime = (deltaMinutes: number) => {
    setIsReplanned(false);
    setTimeShiftMinutes((prev) => prev + deltaMinutes);
  };

  // Reset to original 02:20–04:10
  const handleResetTime = () => {
    setIsReplanned(false);
    setTimeShiftMinutes(0);
    setSelectedCandidateId("WIN-A");
    setSelectedEntity({ type: "BLOCK", data: BASE_BLOCK });
  };

  // Replan to Feasible Window (04:20–06:10)
  const handleReplanWindow = () => {
    setIsReplanned(true);
    setTimeShiftMinutes(120);
    setSelectedCandidateId("WIN-B");
    setSelectedEntity({
      type: "BLOCK",
      data: {
        ...BASE_BLOCK,
        startTime: "04:20",
        endTime: "06:10",
        status: "FEASIBLE",
      },
    });
  };

  // Apply candidate window
  const handleApplyCandidate = (candidate: CandidateWindow) => {
    setSelectedCandidateId(candidate.id);
    if (candidate.id === "WIN-B") {
      handleReplanWindow();
    } else if (candidate.id === "WIN-A") {
      handleResetTime();
    } else {
      setIsReplanned(false);
      const shift = timeStringToMinutes(candidate.startTime) - timeStringToMinutes("02:20");
      setTimeShiftMinutes(shift);
    }
  };

  const passengerConflicts = calculatedConflicts.filter((c) => c.conflictType === "DIRECT_OVERLAP");

  return (
    <AppShell>
      <div className="flex flex-col min-h-[calc(100vh-64px)] bg-[#050b17] text-slate-100 select-none pb-12">
        {/* 1. TOP HEADER */}
        <TimeDistanceHeader
          conflictCount={calculatedConflicts.length}
          blockId={activeBlock.id}
        />

        {/* 2. MAIN WORKSPACE CONTAINER */}
        <div className="flex-1 max-w-[1680px] w-full mx-auto p-4 sm:p-6 space-y-5">
          {/* CONTROL STRIP */}
          <TimeDistanceControls
            showPassenger={showPassenger}
            setShowPassenger={setShowPassenger}
            showFreight={showFreight}
            setShowFreight={setShowFreight}
            showForecast={showForecast}
            setShowForecast={setShowForecast}
            showBlock={showBlock}
            setShowBlock={setShowBlock}
            showConflicts={showConflicts}
            setShowConflicts={setShowConflicts}
            showSafeWindow={showSafeWindow}
            setShowSafeWindow={setShowSafeWindow}
            timeShiftMinutes={timeShiftMinutes}
            onShiftTime={handleShiftTime}
            onResetTime={handleResetTime}
            onReplanWindow={handleReplanWindow}
            isReplanned={isReplanned}
            currentTimeMins={currentTimeMins}
            onCurrentTimeChange={setCurrentTimeMins}
            isPlaying={isPlaying}
            onTogglePlay={() => setIsPlaying(!isPlaying)}
            activeStartTime={activeBlock.startTime}
            activeEndTime={activeBlock.endTime}
          />

          {/* PRIMARY WORKSPACE GRID: DOMINANT SVG MAREY CHART (70%) + ANALYTICAL DOSSIER (30%) */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-start">
            {/* LEFT / CENTER: DOMINANT TIME-DISTANCE MAREY CHART (8 COLS ON XL) */}
            <div className="xl:col-span-8 space-y-4">
              <TimeDistanceSvgChart
                trains={INITIAL_TRAINS}
                activeBlock={activeBlock}
                candidateWindows={CANDIDATE_WINDOWS}
                selectedCandidateId={selectedCandidateId}
                conflicts={calculatedConflicts}
                selectedEntityId={
                  selectedEntity.data ? `${selectedEntity.type}-${selectedEntity.data.id || selectedEntity.data.code}` : null
                }
                onSelectEntity={handleSelectEntity}
                showPassenger={showPassenger}
                showFreight={showFreight}
                showForecast={showForecast}
                showBlock={showBlock}
                showConflicts={showConflicts}
                showSafeWindow={showSafeWindow}
                currentTimeMins={currentTimeMins}
              />

              {/* WHY THIS WINDOW SECTION UNDER CHART */}
              <WhyThisWindowCard
                startTime={activeBlock.startTime}
                endTime={activeBlock.endTime}
                usableMin={activeBlock.usableMin}
                totalWorkOrders={activeBlock.tasksCount}
                p1Count={activeBlock.p1Tasks}
                p2Count={activeBlock.p2Tasks}
                protectedPassengerCount={INITIAL_TRAINS.filter((t) => t.priority !== "FREIGHT").length}
                goodsForecastCount={1}
                isFeasible={calculatedConflicts.length === 0}
              />
            </div>

            {/* RIGHT: ANALYTICAL DOSSIER & PLANNING PANELS (4 COLS ON XL) */}
            <div className="xl:col-span-4 space-y-4">
              {/* INSPECTOR DOSSIER */}
              <TimeDistanceInspector
                selectedType={selectedEntity.type}
                selectedData={selectedEntity.data}
                onApplyCandidate={handleApplyCandidate}
                onReplanToFeasible={handleReplanWindow}
              />

              {/* CANDIDATE WINDOWS COMPARISON */}
              <CandidateWindowsPanel
                candidateWindows={CANDIDATE_WINDOWS}
                selectedCandidateId={selectedCandidateId}
                onSelectCandidate={(w) => setSelectedEntity({ type: "CANDIDATE", data: w })}
                onApplyCandidate={handleApplyCandidate}
              />

              {/* OPERATIONAL BLOCK CONSTRAINTS */}
              <BlockConstraintsPanel
                workDurationMin={90}
                possessionDurationMin={activeBlock.durationMin}
                passengerConflictCount={passengerConflicts.length}
                goodsForecastChecked={true}
                departments={activeBlock.departments}
              />
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
