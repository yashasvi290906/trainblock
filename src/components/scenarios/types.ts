export type ScenarioCondition =
  | "BASELINE"
  | "BLOCK_DENIAL"
  | "ADD_CRITICAL_WORK"
  | "TRAIN_MOVEMENT"
  | "BLOCK_DURATION";

export type ScenarioState =
  | "IDLE"
  | "SIMULATING"
  | "DENIED"
  | "REPLANNING"
  | "REPLANNED"
  | "CONFLICT_DETECTED"
  | "INSUFFICIENT_WINDOW"
  | "FEASIBLE";

export interface FallbackWindow {
  id: string;
  code: string;
  name: string;
  startTime: string; // "04:20"
  endTime: string;   // "06:10"
  startKm: number;
  endKm: number;
  durationMin: number;
  usableWorkMin: number;
  passengerConflicts: number;
  goodsInteractions: number;
  protectionStatus: "PASSENGER PATHS PROTECTED" | "REQUIRES REVIEW" | "INSUFFICIENT FOR FULL DEMAND";
  feasibilityRating: "FEASIBLE" | "CONDITIONAL" | "INSUFFICIENT";
  workOrdersRetained: number; // e.g. 18
  totalWorkOrders: number;    // e.g. 18
  p1Retained: number;
  p2Retained: number;
  reason: string;
}

export interface CriticalWorkInput {
  department: "Engineering" | "S&T" | "Traction";
  asset: string;
  location: string;
  kmStart: number;
  kmEnd: number;
  durationMin: number;
  criticality: "P1" | "P2" | "P3";
  description: string;
}

export interface TrainMovementOverride {
  trainId: string;
  name: string;
  serviceNumber: string;
  type: string;
  direction: "UP" | "DOWN";
  baseKm72Time: string;
  shiftedKm72Time: string;
  offsetMinutes: number; // e.g. +26
}

export interface ScenarioSnapshot {
  id: string;
  label: string;
  condition: ScenarioCondition;
  conditionDescription: string;
  windowStr: string;
  durationMin: number;
  usableMin: number;
  workOrders: number;
  p1Count: number;
  passengerConflicts: number;
  timestamp: string;
  status: string;
}

export interface ScenarioAuditItem {
  id: string;
  timestamp: string;
  timeStr: string;
  event: string;
  details?: string;
  category: "BASE" | "OPERATING" | "ENGINE" | "DECISION" | "ALERT";
}
