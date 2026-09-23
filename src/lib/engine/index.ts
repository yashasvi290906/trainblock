import {
  TmsDefectInput,
  SmmsWorkInput,
  TdmsWorkInput,
  CoaTrainMovement,
  GoodsMovementForecast,
  BlockCorridorSection,
  UnifiedMaintenanceTask,
  CompositionGroup,
  IntegratedPlanBlock,
  SolverResult,
  PlanValidationReport,
  BacktestComparisonResult,
  PlannerOverrideRecord,
} from "./types";
import {
  CANONICAL_TMS_DEFECTS,
  CANONICAL_SMMS_WORK,
  CANONICAL_TDMS_WORK,
  CANONICAL_COA_TIMETABLE,
  CANONICAL_GOODS_FORECAST,
  CANONICAL_BLOCK_CORRIDORS,
} from "./sources";
import { normalizeInputSourcesToUnifiedTasks } from "./normalization";
import { composeCompatibleTaskClusters } from "./composition";
import { runCpSatSolver } from "./solver";
import { validatePlan } from "./validation";
import { runComparativeBacktest } from "./backtest";
import { generateBdmsPrototypeExport, BdmsExportDocument } from "./export";

class RailwayPlanningEngine {
  private rawTasksCache: UnifiedMaintenanceTask[] | null = null;
  private auditLog: { timestamp: string; action: string; details: string; user: string }[] = [];
  private overrideRecords: PlannerOverrideRecord[] = [];

  constructor() {
    this.logAudit("ENGINE_INIT", "Railway Planning Engine initialized with SCR SEC–NDL corridor dataset", "SYSTEM");
  }

  // 1. INPUT SOURCES
  public getRawInputSources() {
    return {
      tmsDefects: CANONICAL_TMS_DEFECTS,
      smmsWork: CANONICAL_SMMS_WORK,
      tdmsWork: CANONICAL_TDMS_WORK,
      coaTimetable: CANONICAL_COA_TIMETABLE,
      goodsForecast: CANONICAL_GOODS_FORECAST,
      blockCorridors: CANONICAL_BLOCK_CORRIDORS,
      summary: {
        tmsCount: CANONICAL_TMS_DEFECTS.length,     // 18
        smmsCount: CANONICAL_SMMS_WORK.length,       // 14
        tdmsCount: CANONICAL_TDMS_WORK.length,       // 15
        coaTrainCount: CANONICAL_COA_TIMETABLE.length, // 8
        goodsCount: CANONICAL_GOODS_FORECAST.length, // 3
        corridorsCount: CANONICAL_BLOCK_CORRIDORS.length, // 6
        totalMaintenanceDemands: CANONICAL_TMS_DEFECTS.length + CANONICAL_SMMS_WORK.length + CANONICAL_TDMS_WORK.length, // 47
        corridorCoverage: "SEC (KM 40) → NDL (KM 120)",
        syntheticDataNote: "SYNTHETIC PROTOTYPE DATA — Calibrated to South Central Railway Track & Signaling standards.",
      },
    };
  }

  // 2. UNIFIED TASKS (Normalized, Safety Tiered, ML Ranked)
  public getUnifiedTasks(): UnifiedMaintenanceTask[] {
    if (!this.rawTasksCache) {
      this.rawTasksCache = normalizeInputSourcesToUnifiedTasks();
    }
    return this.rawTasksCache;
  }

  // 3. TASK COMPOSITION
  public getComposedClusters(corridorSectionId: string = "SEC-NDL-BLK-03"): CompositionGroup[] {
    const tasks = this.getUnifiedTasks();
    return composeCompatibleTaskClusters(tasks, corridorSectionId);
  }

  // 4. CP-SAT SOLVER PLANNING RUN
  public runPlanning(corridorSectionId: string = "SEC-NDL-BLK-03"): {
    solverResult: SolverResult;
    validationReport: PlanValidationReport;
  } {
    const tasks = this.getUnifiedTasks();
    const clusters = this.getComposedClusters(corridorSectionId);
    const solverResult = runCpSatSolver(tasks, clusters);

    const primaryBlock = solverResult.selectedBlocks[0];
    const validationReport = validatePlan(primaryBlock);

    this.logAudit(
      "PLAN_GENERATED",
      `CP-SAT solve completed in ${solverResult.solveTimeMs}ms with status: ${solverResult.solverStatus}. Block ${primaryBlock.blockId} (${primaryBlock.startTime}–${primaryBlock.endTime}) selected.`,
      "CP-SAT SOLVER"
    );

    return {
      solverResult,
      validationReport,
    };
  }

  // 5. VALIDATION
  public validate(block: IntegratedPlanBlock): PlanValidationReport {
    return validatePlan(block);
  }

  // 6. BACKTEST
  public getBacktest(): BacktestComparisonResult {
    return runComparativeBacktest();
  }

  // 7. BDMS EXPORT
  public getBdmsExport(block: IntegratedPlanBlock): BdmsExportDocument {
    return generateBdmsPrototypeExport(block);
  }

  // 8. OVERRIDE & AUDIT
  public recordOverride(override: Omit<PlannerOverrideRecord, "id" | "timestamp">): PlannerOverrideRecord {
    const record: PlannerOverrideRecord = {
      ...override,
      id: `OVR-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      timestamp: new Date().toISOString(),
    };
    this.overrideRecords.push(record);
    this.logAudit("PLANNER_OVERRIDE", `Plan modified by ${override.plannerName} (${override.plannerRole}): ${override.reason}`, override.plannerName);
    return record;
  }

  public getOverrides(): PlannerOverrideRecord[] {
    return this.overrideRecords;
  }

  public logAudit(action: string, details: string, user: string = "PLANNER") {
    this.auditLog.unshift({
      timestamp: new Date().toLocaleTimeString("en-GB", { hour12: false }),
      action,
      details,
      user,
    });
  }

  public getAuditLog() {
    return this.auditLog;
  }
}

export const railwayEngine = new RailwayPlanningEngine();
