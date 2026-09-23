import { Department, MaintenanceTask, ProtectionType } from "./maintenance";

export type BlockStatus = "PLANNED" | "APPROVED" | "ACTIVE" | "COMPLETED" | "CANCELLED";

export interface TrainConflict {
  trainId: string;
  trainName: string;
  serviceNumber: string;
  expectedTime: string;
  conflictType: "HEADWAY_VIOLATION" | "DIRECT_OVERLAP" | "SHADOW_WINDOW";
  resolution: "REGULATE" | "REROUTE_LOOP" | "RESCHEDULE_BLOCK";
  estimatedDelayMinutes: number;
}

export interface FallbackWindow {
  windowId: string;
  startTime: string;
  endTime: string;
  feasibilityScore: number;
  reason: string;
}

export interface Block {
  blockId: string; // e.g. "B-014"
  corridor: string; // "SEC - NDL"
  section: string; // "KZJ - WL"
  line: "UP" | "DOWN" | "BOTH";
  kmStart: number;
  kmEnd: number;
  startTime: string; // "02:20"
  endTime: string; // "04:10"
  durationMinutes: number; // 110
  departments: Department[];
  taskIds: string[];
  tasks?: MaintenanceTask[];
  protectionType: ProtectionType;
  oheRequired: boolean;
  utilization: number; // percentage e.g. 72%
  status: BlockStatus;
  isIntegrated: boolean;
  trainConflicts: TrainConflict[];
  fallbackWindows: FallbackWindow[];
  machinesAssigned?: string[];
  crewCount?: number;
  bdmsReference?: string;
  requestedBy?: string;
  approvedBy?: string;
}

export interface CorridorAvailabilityWindow {
  id: string;
  startTime: string;
  endTime: string;
  section: string;
  startKm: number;
  endKm: number;
  status: "Free" | "Partial" | "Restricted" | "Blocked";
  reason: string;
}

export interface PlanMetrics {
  possessions: number;
  workMinutes: number;
  blockedMinutes: number;
  weightedTrainDelay: number;
  criticalBacklog: number;
  assetAvailability: number; // percentage e.g. 81%
  planChurn: number;
  comparisonWithSiloed?: {
    possessionsDiff: number; // -67%
    workMinutesDiff: number; // -33%
    weightedTrainDelayDiff: number; // -74%
    criticalBacklogDiff: number; // -100%
    assetAvailabilityDiff: number; // +12%
    planChurnDiff: number; // -75%
  };
}

export interface OptimizationConstraint {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  isHardConstraint: boolean;
}

export interface OptimizationStep {
  id: string;
  title: string;
  status: "pending" | "running" | "completed" | "error";
  durationMs?: number;
  detail?: string;
}
