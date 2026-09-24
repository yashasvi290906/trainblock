"use client";

import React, { useState, useEffect } from "react";
import { AppShell } from "@/components/shell/AppShell";
import { ScenarioHeader } from "@/components/scenarios/ScenarioHeader";
import { ScenarioControlStrip } from "@/components/scenarios/ScenarioControlStrip";
import { ScenarioInputPanel } from "@/components/scenarios/ScenarioInputPanel";
import { ScenarioRailwayView } from "@/components/scenarios/ScenarioRailwayView";
import { ScenarioConsequencePanel } from "@/components/scenarios/ScenarioConsequencePanel";
import { ScenarioComparison } from "@/components/scenarios/ScenarioComparison";
import { ScenarioTimeline } from "@/components/scenarios/ScenarioTimeline";
import { ScenarioEventLog } from "@/components/scenarios/ScenarioEventLog";
import { ScenarioSnapshotModal } from "@/components/scenarios/ScenarioSnapshotModal";
import {
  ScenarioCondition,
  ScenarioState,
  FallbackWindow,
  CriticalWorkInput,
  TrainMovementOverride,
  ScenarioSnapshot,
  ScenarioAuditItem,
} from "@/components/scenarios/types";
import {
  BASELINE_PLAN,
  FALLBACK_WINDOWS,
  INITIAL_CRITICAL_WORK,
  TRAIN_OPTIONS,
  INITIAL_SNAPSHOTS,
} from "@/components/scenarios/scenarioData";
import { useRouter } from "next/navigation";
import { usePlanningRun } from "@/context/PlanningRunContext";

export default function ScenariosPage() {
  const router = useRouter();
  const { currentRun, loading: engineLoading, isBackend, denyBlock, addCriticalTask, resetDemo } = usePlanningRun();

  // Active condition and scenario lifecycle state
  const [activeCondition, setActiveCondition] = useState<ScenarioCondition>("BLOCK_DENIAL");
  const [scenarioState, setScenarioState] = useState<ScenarioState>("IDLE");
  const [isReplanning, setIsReplanning] = useState<boolean>(false);
  const [replanStep, setReplanStep] = useState<number>(-1);

  // Selected Fallback Window (Default to flagship FW-01)
  const [selectedWindow, setSelectedWindow] = useState<FallbackWindow>(FALLBACK_WINDOWS[0]);

  // Critical work state
  const [criticalWork, setCriticalWork] = useState<CriticalWorkInput>(INITIAL_CRITICAL_WORK);

  // Train movement override state
  const [selectedTrain, setSelectedTrain] = useState<TrainMovementOverride>(TRAIN_OPTIONS[0]);
  const [trainOffsetMinutes, setTrainOffsetMinutes] = useState<number>(26);

  // Duration offset state (-30, -10, 0, 10, 30)
  const [durationOffsetMin, setDurationOffsetMin] = useState<number>(0);

  // Snapshot modal and state
  const [snapshots, setSnapshots] = useState<ScenarioSnapshot[]>(INITIAL_SNAPSHOTS);
  const [isSnapshotModalOpen, setIsSnapshotModalOpen] = useState<boolean>(false);

  // Deterministic Event Audit Log
  const [events, setEvents] = useState<ScenarioAuditItem[]>([
    {
      id: "EVT-01",
      timestamp: "02:20:00",
      timeStr: "02:20",
      event: "BASE PLAN LOADED",
      details: "B-014 (02:20–04:10) KM 68–94 · 18 Work Orders · 3 Departments (ENG, S&T, TRD)",
      category: "BASE",
    },
    {
      id: "EVT-02",
      timestamp: "02:22:15",
      timeStr: "02:22",
      event: "CORRIDOR TIMETABLE BOUNDED",
      details: "4 Passenger paths protected (VB-20612, R-12434, AB-12076, S-12009) · Freight G/4217 forecast checked",
      category: "BASE",
    },
  ]);

  // Helper to append audit event
  const addAuditEvent = (
    event: string,
    details?: string,
    category: "BASE" | "OPERATING" | "ENGINE" | "DECISION" | "ALERT" = "ENGINE"
  ) => {
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, "0")}:${String(
      now.getMinutes()
    ).padStart(2, "0")}`;
    const timestamp = `${timeStr}:${String(now.getSeconds()).padStart(2, "0")}`;

    setEvents((prev) => [
      {
        id: `EVT-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        timestamp,
        timeStr,
        event,
        details,
        category,
      },
      ...prev,
    ]);
  };

  // Flagship: Simulate Block Denial
  const handleSimulateBlockDenial = () => {
    setActiveCondition("BLOCK_DENIAL");
    setScenarioState("DENIED");
    denyBlock("BLK-2026-103").catch(console.error);
    addAuditEvent(
      "BLOCK DENIAL RECEIVED FROM OPERATING",
      "Divisional Operating Control cancelled requested window B-014 (02:20–04:10) due to corridor congestion. Sent to live planning engine.",
      "OPERATING"
    );
    addAuditEvent(
      "ALTERNATE CANDIDATE WINDOWS EVALUATED",
      "Found 3 deterministic fallback slots (FW-01 04:20–06:10, FW-02 01:10–02:40, FW-03 05:00–06:30).",
      "ENGINE"
    );
  };

  // Deterministic Replan Pipeline
  const handleReplan = () => {
    setIsReplanning(true);
    setReplanStep(0);
    setScenarioState("REPLANNING");

    let current = 0;
    const interval = setInterval(() => {
      current += 1;
      if (current < 5) {
        setReplanStep(current);
      } else {
        clearInterval(interval);
        setIsReplanning(false);
        setScenarioState("REPLANNED");
        addAuditEvent(
          `${selectedWindow.code} VALIDATED & REPLANNED`,
          `Shifted possession to ${selectedWindow.startTime}–${selectedWindow.endTime}. 0 Passenger conflicts. 18/18 work orders preserved.`,
          "DECISION"
        );
      }
    }, 220);
  };

  // Add Critical Work & Replan
  const handleAddCriticalWorkAndReplan = () => {
    setScenarioState("INSUFFICIENT_WINDOW");
    addCriticalTask({
      defect_type: `${criticalWork.criticality} ${criticalWork.asset}`,
      line: "DOWN",
      km_start: 73.5,
      km_end: 74.0,
      depth_mm: 7.2,
    }).catch(console.error);
    addAuditEvent(
      "SAFETY CRITICAL DEFECT INGESTED",
      `Added ${criticalWork.criticality} ${criticalWork.asset} at ${criticalWork.location} (${criticalWork.durationMin} min) to backend engine. Total demand 135m exceeds current usable window 90m.`,
      "ALERT"
    );
    addAuditEvent(
      "CAPACITY DEFICIT DETECTED",
      "Usable window insufficient. Candidate longer window (01:30–04:15, 140m usable) required to avoid task deferral.",
      "ENGINE"
    );
  };

  // Recalculate Train Movement
  const handleRecalculateTrainMovement = () => {
    setScenarioState("CONFLICT_DETECTED");
    addAuditEvent(
      `TIMETABLE ADJUSTMENT: ${selectedTrain.name}`,
      `Passage shifted by ${trainOffsetMinutes > 0 ? `+${trainOffsetMinutes}` : trainOffsetMinutes} min. Train path now intersects B-014 at KM 72 (${selectedTrain.shiftedKm72Time}).`,
      "ALERT"
    );
    addAuditEvent(
      "CONFLICT RESOLUTION SLOTS AVAILABLE",
      "Possession must shift to trailing slot FW-01 (04:20–06:10) to clear passenger trajectory.",
      "ENGINE"
    );
  };

  // Reset to Baseline
  const handleResetScenario = () => {
    setActiveCondition("BASELINE");
    setScenarioState("IDLE");
    setIsReplanning(false);
    setReplanStep(-1);
    setSelectedWindow(FALLBACK_WINDOWS[0]);
    setCriticalWork(INITIAL_CRITICAL_WORK);
    setSelectedTrain(TRAIN_OPTIONS[0]);
    setTrainOffsetMinutes(26);
    setDurationOffsetMin(0);
    resetDemo().catch(console.error);

    addAuditEvent(
      "SCENARIO RESET TO BASELINE",
      "Restored canonical B-014 (02:20–04:10) with 18 tasks and nominal train trajectories across backend engine.",
      "BASE"
    );
  };

  // Save current snapshot
  const handleSaveSnapshot = () => {
    const isRepl = scenarioState === "REPLANNED";
    const newSnap: ScenarioSnapshot = {
      id: `SNP-0${snapshots.length + 1}`,
      label: `Snapshot ${snapshots.length + 1}: ${activeCondition} (${
        isRepl ? selectedWindow.code : activeCondition
      })`,
      condition: activeCondition,
      conditionDescription: isRepl
        ? `Replanned B-014 to ${selectedWindow.startTime}–${selectedWindow.endTime} (${selectedWindow.protectionStatus})`
        : `Tested ${activeCondition} condition under current parameters`,
      windowStr: isRepl
        ? `${selectedWindow.startTime}–${selectedWindow.endTime}`
        : "02:20–04:10",
      durationMin: isRepl ? selectedWindow.durationMin : 110 + durationOffsetMin,
      usableMin: isRepl ? selectedWindow.usableWorkMin : 90 + durationOffsetMin,
      workOrders: activeCondition === "ADD_CRITICAL_WORK" ? 19 : isRepl ? selectedWindow.workOrdersRetained : 18,
      p1Count: activeCondition === "ADD_CRITICAL_WORK" ? 4 : isRepl ? selectedWindow.p1Retained : 3,
      passengerConflicts: isRepl ? selectedWindow.passengerConflicts : 0,
      timestamp: new Date().toLocaleTimeString("en-GB", { hour12: false }),
      status: isRepl ? "FEASIBLE FOR REVIEW" : scenarioState,
    };

    setSnapshots((prev) => [newSnap, ...prev]);
    addAuditEvent(
      `SNAPSHOT SAVED: ${newSnap.id}`,
      `Stored snapshot checkpoint "${newSnap.label}" in memory.`,
      "DECISION"
    );
    setIsSnapshotModalOpen(true);
  };

  // Apply a loaded snapshot
  const handleApplySnapshot = (snap: ScenarioSnapshot) => {
    setActiveCondition(snap.condition);
    if (snap.condition === "BLOCK_DENIAL") {
      setScenarioState("REPLANNED");
      setSelectedWindow(FALLBACK_WINDOWS[0]);
    } else if (snap.condition === "ADD_CRITICAL_WORK") {
      setScenarioState("INSUFFICIENT_WINDOW");
    } else {
      setScenarioState("IDLE");
    }

    addAuditEvent(
      `SNAPSHOT LOADED: ${snap.id}`,
      `Restored workspace state to ${snap.label}.`,
      "DECISION"
    );
  };

  // Delete snapshot
  const handleDeleteSnapshot = (id: string) => {
    setSnapshots((prev) => prev.filter((s) => s.id !== id));
  };

  // Human-in-the-loop review navigation
  const handleReviewScenario = () => {
    if (scenarioState === "REPLANNED") {
      router.push(
        `/plan?start=${selectedWindow.startTime}&duration=${selectedWindow.durationMin}&scenario=${selectedWindow.code}`
      );
    } else {
      router.push("/plan");
    }
  };

  // Status string for control strip
  const statusSummary =
    scenarioState === "REPLANNED"
      ? `REPLANNED (${selectedWindow.code} FEASIBLE)`
      : scenarioState === "DENIED"
      ? "BLOCK DENIED (Pending Replan)"
      : scenarioState === "INSUFFICIENT_WINDOW"
      ? "INSUFFICIENT WINDOW (135m required)"
      : scenarioState === "CONFLICT_DETECTED"
      ? "NEW CONFLICT DETECTED"
      : "BASE PLAN ACTIVE";

  const conditionLabel =
    activeCondition === "BASELINE"
      ? "Baseline B-014"
      : activeCondition === "BLOCK_DENIAL"
      ? "Block Denial (Flagship)"
      : activeCondition === "ADD_CRITICAL_WORK"
      ? "Add Critical Work"
      : activeCondition === "TRAIN_MOVEMENT"
      ? "Train Movement Shift"
      : "Block Duration Modification";

  return (
    <AppShell pageTitle="Scenario Lab" subtitle="Test operational changes before committing the block">
      <div className="flex flex-col h-[calc(100vh-64px)] bg-slate-950 text-slate-100 overflow-y-auto select-none font-sans">
        {/* 1. TOP HEADER */}
        <ScenarioHeader
          activeConditionLabel={conditionLabel}
          hasExecuted={scenarioState === "REPLANNED"}
          onOpenSnapshots={() => setIsSnapshotModalOpen(true)}
          snapshotCount={snapshots.length}
        />

        {/* 2. SCENARIO CONTROL STRIP */}
        <ScenarioControlStrip
          activeCondition={activeCondition}
          onSelectCondition={(cond) => {
            setActiveCondition(cond);
            if (cond === "BASELINE") {
              handleResetScenario();
            } else if (cond === "BLOCK_DENIAL") {
              setScenarioState("IDLE");
            } else if (cond === "ADD_CRITICAL_WORK") {
              setScenarioState("IDLE");
            } else if (cond === "TRAIN_MOVEMENT") {
              setScenarioState("IDLE");
            } else if (cond === "BLOCK_DURATION") {
              setScenarioState("IDLE");
            }
          }}
          onResetScenario={handleResetScenario}
          onSaveSnapshot={handleSaveSnapshot}
          isModified={scenarioState !== "IDLE" || activeCondition !== "BASELINE"}
          statusText={statusSummary}
        />

        {/* 3. SCENARIO TIMELINE STEPPER */}
        <div className="px-4 py-2 sm:px-6 bg-slate-950">
          <ScenarioTimeline
            condition={activeCondition}
            scenarioState={scenarioState}
            selectedWindow={selectedWindow}
          />
        </div>

        {/* 4. MAIN SCENARIO WORKSPACE (3 Columns: Left Input, Center Time-Distance Visualization, Right Consequence) */}
        <div className="px-4 py-2 sm:px-6 grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1">
          {/* LEFT: SCENARIO INPUT (3 Cols) */}
          <div className="lg:col-span-3 h-[480px] lg:h-[500px]">
            <ScenarioInputPanel
              condition={activeCondition}
              scenarioState={scenarioState}
              selectedWindow={selectedWindow}
              onSelectWindow={(w) => setSelectedWindow(w)}
              onSimulateDenial={handleSimulateBlockDenial}
              onReplan={handleReplan}
              isReplanning={isReplanning}
              replanStep={replanStep}
              criticalWork={criticalWork}
              onChangeCriticalWork={setCriticalWork}
              onAddCriticalWorkAndReplan={handleAddCriticalWorkAndReplan}
              selectedTrain={selectedTrain}
              onSelectTrain={setSelectedTrain}
              trainOffsetMinutes={trainOffsetMinutes}
              onChangeTrainOffset={setTrainOffsetMinutes}
              onRecalculateTrainMovement={handleRecalculateTrainMovement}
              durationOffsetMin={durationOffsetMin}
              onChangeDurationOffset={setDurationOffsetMin}
              onReset={handleResetScenario}
            />
          </div>

          {/* CENTER: DOMINANT TIME-DISTANCE CANVAS (6 Cols) */}
          <div className="lg:col-span-6 h-[480px] lg:h-[500px]">
            <ScenarioRailwayView
              condition={activeCondition}
              scenarioState={scenarioState}
              selectedWindow={selectedWindow}
              criticalWork={criticalWork}
              selectedTrain={selectedTrain}
              trainOffsetMinutes={trainOffsetMinutes}
              durationOffsetMin={durationOffsetMin}
            />
          </div>

          {/* RIGHT: CONSEQUENCE ANALYSIS (3 Cols) */}
          <div className="lg:col-span-3 h-[480px] lg:h-[500px]">
            <ScenarioConsequencePanel
              condition={activeCondition}
              scenarioState={scenarioState}
              selectedWindow={selectedWindow}
              criticalWork={criticalWork}
              durationOffsetMin={durationOffsetMin}
              onKeepBaseline={handleResetScenario}
              onReviewScenario={handleReviewScenario}
            />
          </div>
        </div>

        {/* 5. BASELINE VS SCENARIO COMPARISON & AUDIT LOG */}
        <div className="px-4 py-3 sm:px-6 grid grid-cols-1 lg:grid-cols-12 gap-4 pb-6">
          {/* Comparison Table (8 Cols) */}
          <div className="lg:col-span-8">
            <ScenarioComparison
              condition={activeCondition}
              scenarioState={scenarioState}
              selectedWindow={selectedWindow}
              criticalWork={criticalWork}
              durationOffsetMin={durationOffsetMin}
            />
          </div>

          {/* Event Audit Log (4 Cols) */}
          <div className="lg:col-span-4">
            <ScenarioEventLog events={events} />
          </div>
        </div>

        {/* 6. SNAPSHOT MODAL */}
        <ScenarioSnapshotModal
          isOpen={isSnapshotModalOpen}
          onClose={() => setIsSnapshotModalOpen(false)}
          snapshots={snapshots}
          onApplySnapshot={handleApplySnapshot}
          onDeleteSnapshot={handleDeleteSnapshot}
        />
      </div>
    </AppShell>
  );
}
