import { Department, CriticalityTier, ProtectionType, MachineRequirement } from "@/types/maintenance";

// -------------------------------------------------------------
// 1. THE SIX CANONICAL INPUT SOURCES (SIH PPT Specification)
// -------------------------------------------------------------

export interface TmsDefectInput {
  id: string; // e.g. "TMS-1082"
  defectType: "Rail Joint Fracture" | "Thermite Weld Crack" | "Gauge Spread" | "Sleeper Spalling" | "Switch Blade Wear" | "USFD Flaw";
  line: "UP" | "DOWN" | "BOTH";
  kmStart: number;
  kmEnd: number;
  depthMm?: number;
  severity: 1 | 2 | 3 | 4 | 5; // 5 is most severe
  overdueDays: number;
  speedRestrictionKmph?: number;
  detectionMethod: "USFD Trolley" | "Track Recording Car" | "Keyman Inspection" | "OMS-2000";
  ingestedAt: string;
}

export interface SmmsWorkInput {
  id: string; // e.g. "SMMS-429"
  assetType: "Point Machine" | "Track Circuit" | "Multi-Aspect Signal" | "Axle Counter" | "Interlocking Relay";
  assetId: string;
  stationCode: string;
  kmLocation: number;
  line: "UP" | "DOWN" | "BOTH";
  maintenanceType: "Periodic Overhaul" | "Insulation Resistance Test" | "Contact Cleaning" | "Cable Meggering" | "Obstruction Test";
  durationMin: number;
  overdueDays: number;
  criticality: CriticalityTier;
  requiresPowerIsolation: boolean;
  ingestedAt: string;
}

export interface TdmsWorkInput {
  id: string; // e.g. "TDMS-881"
  assetType: "Catenary Wire" | "Contact Wire" | "Cantilever Assembly" | "Section Insulator" | "Auto Tensioning Device (ATD)" | "Feeding Post";
  substationCode: string;
  oheSectionId: string;
  kmStart: number;
  kmEnd: number;
  line: "UP" | "DOWN" | "BOTH";
  workType: "Current Collection Test" | "Contact Wire Dropper Renewal" | "Insulator De-greasing" | "Height & Stagger Adjustment" | "Thermal Imaging Audit";
  durationMin: number;
  powerBlockRequired: boolean;
  overdueDays: number;
  criticality: CriticalityTier;
  ingestedAt: string;
}

export interface CoaTrainMovement {
  trainId: string;
  serviceNumber: string;
  trainName: string;
  trainType: "Vande Bharat" | "Rajdhani" | "Shatabdi" | "Amrit Bharat" | "Superfast Express" | "Express Passenger";
  priorityClass: 1 | 2 | 3 | 4; // 1 = High priority passenger (VB/Rajdhani)
  direction: "UP" | "DOWN";
  stops: {
    stationCode: string;
    km: number;
    arrivalMins: number; // minutes from midnight
    departureMins: number;
    dwellMin: number;
  }[];
}

export interface GoodsMovementForecast {
  rakeId: string;
  cargoType: "Container (CONCOR)" | "Coal (NTPC)" | "Steel (SAIL)" | "Petroleum (POL)" | "Automobile (NMG)";
  originStation: string;
  destinationStation: string;
  direction: "UP" | "DOWN";
  targetWindowStartMins: number;
  targetWindowEndMins: number;
  speedKmph: number;
  loopLineStablingAllowed: boolean;
  sourceSystem: "FOIS (Freight Operations Information System)";
}

export interface BlockCorridorSection {
  sectionId: string; // e.g. "SEC-NDL-BLK-04"
  name: string; // "WL - NDKD"
  kmStart: number;
  kmEnd: number;
  lines: ("UP" | "DOWN")[];
  crossoverKm: number[];
  tractionFeederPost: string;
  stationInterlockings: string[];
  maxDailyBlockWindowMin: number;
  nominalOverheadMinutes: {
    isolation: number; // 10m
    earthing: number;  // 10m
    transit: number;   // 5m
    restoration: number; // 5m
  };
}

// -------------------------------------------------------------
// 2. NORMALIZED UNIFIED LOCATION & TASK MODEL
// -------------------------------------------------------------

export interface UnifiedMaintenanceTask {
  taskId: string;
  sourceSystem: "TMS" | "SMMS" | "TDMS";
  sourceRecordId: string;
  department: Department;
  title: string;
  assetType: string;
  assetId: string;
  line: "UP" | "DOWN" | "BOTH";
  kmStart: number;
  kmEnd: number;
  corridorSectionId: string;
  oheSectionId?: string;
  durationMin: number;
  requiredProtection: ProtectionType;
  oheRequired: boolean;
  machineRequired: MachineRequirement;
  crewRequired: number;
  overdueDays: number;
  
  // Prioritization outputs
  safetyTier: "P1" | "P2" | "P3" | "P4";
  safetyTierReason: string;
  mlRankingScore: number; // 0 - 100 calculated from XGBoost / Feature weights
  withinTierRank: number; // e.g. #2 in P1
  rankingFeatures: {
    defectSeverity: number;     // 1 - 10
    overdueDays: number;        // days
    assetCriticality: number;   // 1 - 10
    trafficExposure: number;    // trains / day
    availabilityImpact: number; // 1 - 10
  };
}

// -------------------------------------------------------------
// 3. PHYSICS-AWARE COMPOSITION & SEQUENCING
// -------------------------------------------------------------

export interface CompositionGroup {
  clusterId: string;
  corridorSectionId: string;
  line: "UP" | "DOWN" | "BOTH";
  kmStart: number;
  kmEnd: number;
  tasks: UnifiedMaintenanceTask[];
  departments: Department[];
  totalWorkDurationMin: number;
  totalSequentialLagsMin: number;
  requiredBlockWindowMin: number; // total work + lags + setup overhead
  oheRequired: boolean;
  machinesAssigned: MachineRequirement[];
  isCompatible: boolean;
  whyCombinedReasons: string[];
  whyNotCombinedReasons?: string[];
  jobSequence: {
    sequenceOrder: number;
    taskId: string;
    taskTitle: string;
    department: Department;
    durationMin: number;
    lagAfterMin: number;
    lagReason?: string;
  }[];
}

// -------------------------------------------------------------
// 4. USABLE MINUTES BREAKDOWN
// -------------------------------------------------------------

export interface UsableMinutesBreakdown {
  rawPossessionMinutes: number;
  isolationMinutes: number;
  earthingMinutes: number;
  machineTransitMinutes: number;
  restorationMinutes: number;
  totalOverheadMinutes: number;
  usableWorkMinutes: number;
  isSufficientForDemand: boolean;
  workDemandMinutes: number;
  marginMinutes: number;
}

// -------------------------------------------------------------
// 5. SOLVER / CP-SAT OPTIMIZATION MODEL
// -------------------------------------------------------------

export interface SolverConstraintConfig {
  enforceTrainProtection: boolean;
  enforceOheConsistency: boolean;
  enforceMachineClearance: boolean;
  enforcePrecedenceAndLag: boolean;
  enforceUsableCapacity: boolean;
  maxConsecutiveBlockMin: number;
  maxDailyPassengerDelayMin: number;
}

export interface SolverObjectiveWeights {
  criticalWorkWeight: number;    // e.g. 100 (P1), 50 (P2)
  assetAvailabilityWeight: number; // e.g. 30
  blockCountPenalty: number;     // e.g. 40 per extra block
  trainDelayPenalty: number;     // e.g. 15 per weighted min delay
  unusedMinutesPenalty: number;  // e.g. 2 per idle minute
}

export interface SolverResult {
  solverStatus: "OPTIMAL" | "FEASIBLE" | "TIME_LIMIT" | "INFEASIBLE";
  solveTimeMs: number;
  iterations: number;
  objectiveScore: number;
  hardConstraintsSatisfied: number;
  totalHardConstraints: number;
  selectedBlocks: IntegratedPlanBlock[];
  unassignedTasks: UnifiedMaintenanceTask[];
}

export interface IntegratedPlanBlock {
  blockId: string;
  corridor: string;
  section: string;
  line: "UP" | "DOWN" | "BOTH";
  kmStart: number;
  kmEnd: number;
  startTime: string; // "02:20"
  endTime: string;   // "04:10"
  startMinutesFromMidnight: number;
  endMinutesFromMidnight: number;
  durationMinutes: number;
  usableMinutesBreakdown: UsableMinutesBreakdown;
  departments: Department[];
  tasks: UnifiedMaintenanceTask[];
  protectionType: ProtectionType;
  oheRequired: boolean;
  machinesAssigned: MachineRequirement[];
  crewCount: number;
  trainInteractions: {
    trainId: string;
    trainName: string;
    serviceNumber: string;
    trainType: string;
    isProtected: boolean;
    clearanceMarginMin: number;
    status: "PROTECTED" | "REGULATED" | "CONFLICT";
  }[];
  bdmsReference: string;
}

// -------------------------------------------------------------
// 6. VALIDATION & HUMAN DECISION LIFECYCLE
// -------------------------------------------------------------

export interface ValidationRuleCheck {
  ruleId: string;
  name: string;
  category: "SAFETY" | "TIMETABLE" | "CAPACITY" | "OHE" | "SEQUENCING" | "RESOURCES";
  passed: boolean;
  severity: "CRITICAL" | "WARNING" | "INFO";
  details: string;
}

export interface PlanValidationReport {
  overallStatus: "VALIDATED" | "FAILED" | "WARNING";
  passedChecksCount: number;
  totalChecksCount: number;
  checks: ValidationRuleCheck[];
  validatedAt: string;
}

export type PlannerDecisionStatus = "GENERATED" | "VALIDATED" | "PENDING_REVIEW" | "APPROVED" | "OVERRIDDEN" | "REJECTED";

export interface PlannerOverrideRecord {
  id: string;
  timestamp: string;
  plannerRole: string;
  plannerName: string;
  reason: string;
  beforeState: {
    startTime: string;
    endTime: string;
    durationMin: number;
    tasksCount: number;
  };
  afterState: {
    startTime: string;
    endTime: string;
    durationMin: number;
    tasksCount: number;
  };
}

// -------------------------------------------------------------
// 7. BACKTEST METRICS (Siloed Baseline vs Integrated RAILBLOCK)
// -------------------------------------------------------------

export interface BacktestComparisonResult {
  datasetName: string;
  totalInputWorkOrders: number;
  corridorLengthKm: number;
  
  siloedBaseline: {
    totalBlocks: number;
    totalBlockedMinutes: number;
    totalUsableWorkMinutes: number;
    workMinutesPerBlockedMinute: number;
    passengerTrainDelaysMin: number;
    unresolvedPassengerConflicts: number;
    criticalBacklogClearedPercent: number;
    assetAvailabilityScore: number;
    repeatedTrackPossessions: number;
    departmentalBlocks: {
      engineering: number;
      sAndT: number;
      traction: number;
    };
  };

  integratedRailblock: {
    totalBlocks: number;
    totalBlockedMinutes: number;
    totalUsableWorkMinutes: number;
    workMinutesPerBlockedMinute: number;
    passengerTrainDelaysMin: number;
    unresolvedPassengerConflicts: number;
    criticalBacklogClearedPercent: number;
    assetAvailabilityScore: number;
    repeatedTrackPossessions: number;
    departmentalBlocks: {
      engineering: number;
      sAndT: number;
      traction: number;
    };
  };

  delta: {
    blockReductionCount: number;
    blockReductionPercent: number;
    freedCorridorMinutes: number;
    workEfficiencyGainPercent: number;
    passengerDelayReductionPercent: number;
    assetAvailabilityImprovementPercent: number;
  };
}
