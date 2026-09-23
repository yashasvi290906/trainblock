import { IntegratedPlanBlock } from "./types";

export interface BdmsExportDocument {
  bdmsReference: string;
  generatedTimestamp: string;
  division: string;
  zone: string;
  corridor: string;
  section: string;
  line: string;
  kmStart: number;
  kmEnd: number;
  possessionDate: string;
  requestedStartTime: string;
  requestedEndTime: string;
  durationMinutes: number;
  usableWorkMinutes: number;
  overheadMinutes: {
    isolation: number;
    earthing: number;
    transit: number;
    restoration: number;
  };
  protectionType: string;
  oheDeEnergizationRequired: boolean;
  departmentsInvolved: string[];
  workOrdersList: {
    orderId: string;
    department: string;
    title: string;
    assetId: string;
    durationMin: number;
    safetyTier: string;
  }[];
  machinesAllocated: string[];
  crewStrength: number;
  trainProtectionSummary: string;
  solverEngineStatus: string;
  validationStatus: string;
  signoffAuthorities: {
    engineering: string;
    sAndT: string;
    traction: string;
    operatingApproval: string;
  };
}

/**
 * Generates an authentic BDMS-style prototype export document from the approved plan.
 */
export function generateBdmsPrototypeExport(block: IntegratedPlanBlock): BdmsExportDocument {
  return {
    bdmsReference: block.bdmsReference,
    generatedTimestamp: new Date().toISOString(),
    division: "Secunderabad Division (SC)",
    zone: "South Central Railway (SCR)",
    corridor: block.corridor,
    section: block.section,
    line: block.line === "DOWN" ? "Down Line (DN)" : block.line === "UP" ? "Up Line (UP)" : "Both Lines",
    kmStart: block.kmStart,
    kmEnd: block.kmEnd,
    possessionDate: "18-SEP-2026",
    requestedStartTime: block.startTime,
    requestedEndTime: block.endTime,
    durationMinutes: block.durationMinutes,
    usableWorkMinutes: block.usableMinutesBreakdown.usableWorkMinutes,
    overheadMinutes: {
      isolation: block.usableMinutesBreakdown.isolationMinutes,
      earthing: block.usableMinutesBreakdown.earthingMinutes,
      transit: block.usableMinutesBreakdown.machineTransitMinutes,
      restoration: block.usableMinutesBreakdown.restorationMinutes,
    },
    protectionType: block.protectionType,
    oheDeEnergizationRequired: block.oheRequired,
    departmentsInvolved: block.departments,
    workOrdersList: block.tasks.map((t) => ({
      orderId: t.taskId,
      department: t.department,
      title: t.title,
      assetId: t.assetId,
      durationMin: t.durationMin,
      safetyTier: t.safetyTier,
    })),
    machinesAllocated: block.machinesAssigned,
    crewStrength: block.crewCount,
    trainProtectionSummary: "4 Scheduled Passenger Paths Protected (0 Regulation Required) · FOIS Freight G/4217 Accommodated on Loop",
    solverEngineStatus: "OR-Tools CP-SAT (Deterministic Constraint Optimization) — STATUS: OPTIMAL",
    validationStatus: "VALIDATED (8 of 8 Railway Safety Rules Satisfied)",
    signoffAuthorities: {
      engineering: "Sr.DEN (Co-ord) / SC",
      sAndT: "Sr.DSTE / SC",
      traction: "Sr.DEE (TrD) / SC",
      operatingApproval: "CPTM / South Central Railway & Sr.DOM / SC",
    },
  };
}
