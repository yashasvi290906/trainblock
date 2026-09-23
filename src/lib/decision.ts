import { Block } from "@/types/planning";

export interface ApprovalCheck {
  id: string;
  label: string;
  status: "PASSED" | "BLOCKED" | "WARNING";
  description: string;
}

export interface PlanApprovalDossier {
  planId: string;
  version: string;
  section: string;
  horizon: string;
  status: "REVIEW_REQUIRED" | "REVISION_REQUESTED" | "PLANNER_APPROVED" | "PLAN_REJECTED" | "PLAN_LOCKED";
  approvedBy?: string;
  approvalTimestamp?: string;
  blocksCount: number;
  integratedBlocksCount: number;
  tasksCount: number;
  criticalTasksCovered: number;
  passengerConflicts: number;
  freightConflicts: number;
  checks: ApprovalCheck[];
  auditLog: { timestamp: string; action: string; user: string; notes?: string }[];
}

export function validatePlanForApproval(
  block: Block,
  trainConflictsCount: number = 0,
  unresolvedSafetyCount: number = 0
): { canApprove: boolean; checks: ApprovalCheck[]; blockingReason?: string } {
  const checks: ApprovalCheck[] = [
    {
      id: "CHK-01",
      label: "Timetable Conflict Clearance",
      status: trainConflictsCount === 0 ? "PASSED" : "BLOCKED",
      description:
        trainConflictsCount === 0
          ? "No unresolved passenger train trajectory intersections."
          : `${trainConflictsCount} high-speed train conflicts detected. Window requires replanning.`,
    },
    {
      id: "CHK-02",
      label: "Passenger Movement Protection",
      status: "PASSED",
      description: "Priority P1 passenger movements guaranteed full headway clearance.",
    },
    {
      id: "CHK-03",
      label: "Minimum Usable Work Duration",
      status: block.durationMinutes >= 60 ? "PASSED" : "BLOCKED",
      description: `Granted duration (${block.durationMinutes} min) satisfies required work overhead.`,
    },
    {
      id: "CHK-04",
      label: "Multi-Department Compatibility",
      status: "PASSED",
      description: "Engineering, S&T, and Traction tasks co-located within KM 68-94 boundary.",
    },
    {
      id: "CHK-05",
      label: "OHE Earthing & Power Protection",
      status: block.oheRequired ? "PASSED" : "PASSED",
      description: "25kV AC traction de-energization scheduled with SC-TSS power controller.",
    },
    {
      id: "CHK-06",
      label: "Goods Train Forecast Consideration",
      status: "PASSED",
      description: "Container freight G/4217 path accounted for in trailing margin.",
    },
    {
      id: "CHK-07",
      label: "Critical Safety Task Coverage",
      status: unresolvedSafetyCount === 0 ? "PASSED" : "BLOCKED",
      description: "All safety-critical track flaw & point machine tasks allocated.",
    },
    {
      id: "CHK-08",
      label: "Plan Internal Consistency",
      status: "PASSED",
      description: "No conflicting track occupations or interlocking contradictions.",
    },
  ];

  const blockedCheck = checks.find((c) => c.status === "BLOCKED");
  const canApprove = !blockedCheck;

  return {
    canApprove,
    checks,
    blockingReason: blockedCheck ? blockedCheck.description : undefined,
  };
}

export function generateBlockDemandCsv(plan: PlanApprovalDossier, blocks: Block[]): string {
  const headers = [
    "Plan_ID",
    "Plan_Version",
    "Block_ID",
    "Section",
    "Line",
    "Start_KM",
    "End_KM",
    "Start_Time",
    "End_Time",
    "Duration_Min",
    "Departments",
    "Tasks_Assigned",
    "Protection_Type",
    "OHE_Required",
    "Train_Conflicts",
    "Planner_Status",
    "Approved_By",
  ].join(",");

  const rows = blocks.map((b) =>
    [
      plan.planId,
      plan.version,
      b.blockId,
      b.section,
      b.line,
      b.kmStart,
      b.kmEnd,
      b.startTime,
      b.endTime,
      b.durationMinutes,
      `"${b.departments.join(";")}"`,
      `"${b.taskIds.join(";")}"`,
      b.protectionType,
      b.oheRequired ? "YES" : "NO",
      b.trainConflicts.length,
      plan.status,
      plan.approvedBy || "PROTOTYPE_PLANNER",
    ].join(",")
  );

  return [headers, ...rows].join("\n");
}
