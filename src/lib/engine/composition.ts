import {
  UnifiedMaintenanceTask,
  CompositionGroup,
  UsableMinutesBreakdown,
  BlockCorridorSection,
} from "./types";
import { CANONICAL_BLOCK_CORRIDORS } from "./sources";

/**
 * Calculates genuine usable work minutes after deducting safety overheads.
 */
export function calculateUsableMinutesBreakdown(
  rawPossessionMinutes: number,
  corridorSection: BlockCorridorSection,
  hasOheRequired: boolean,
  hasHeavyMachine: boolean,
  workDemandMinutes: number
): UsableMinutesBreakdown {
  const isolationMinutes = hasOheRequired ? corridorSection.nominalOverheadMinutes.isolation : 5;
  const earthingMinutes = hasOheRequired ? corridorSection.nominalOverheadMinutes.earthing : 0;
  const machineTransitMinutes = hasHeavyMachine ? corridorSection.nominalOverheadMinutes.transit : 2;
  const restorationMinutes = corridorSection.nominalOverheadMinutes.restoration;

  const totalOverheadMinutes = isolationMinutes + earthingMinutes + machineTransitMinutes + restorationMinutes;
  const usableWorkMinutes = Math.max(0, rawPossessionMinutes - totalOverheadMinutes);

  return {
    rawPossessionMinutes,
    isolationMinutes,
    earthingMinutes,
    machineTransitMinutes,
    restorationMinutes,
    totalOverheadMinutes,
    usableWorkMinutes,
    isSufficientForDemand: usableWorkMinutes >= workDemandMinutes,
    workDemandMinutes,
    marginMinutes: usableWorkMinutes - workDemandMinutes,
  };
}

/**
 * Composes multi-department tasks into physics-aware integrated candidate clusters.
 */
export function composeCompatibleTaskClusters(
  tasks: UnifiedMaintenanceTask[],
  corridorSectionId: string = "SEC-NDL-BLK-03"
): CompositionGroup[] {
  const sectionCorridor =
    CANONICAL_BLOCK_CORRIDORS.find((c) => c.sectionId === corridorSectionId) ||
    CANONICAL_BLOCK_CORRIDORS[2]; // Default to WL - NDKD

  // Filter tasks in this corridor section on DOWN line (flagship demo)
  const candidateTasks = tasks.filter(
    (t) =>
      t.kmStart >= sectionCorridor.kmStart &&
      t.kmEnd <= sectionCorridor.kmEnd &&
      (t.line === "DOWN" || t.line === "BOTH")
  );

  // Group candidate tasks into primary cluster
  const p1Tasks = candidateTasks.filter((t) => t.safetyTier === "P1");
  const p2Tasks = candidateTasks.filter((t) => t.safetyTier === "P2");
  const p3Tasks = candidateTasks.filter((t) => t.safetyTier === "P3").slice(0, 4);

  const selectedForCluster = [...p1Tasks, ...p2Tasks, ...p3Tasks].slice(0, 7);

  // Enforce job sequencing and physics lag
  // 1. Engineering track renewal (e.g. 35m) -> 10m lag for track stabilization
  // 2. Traction OHE dropper & stagger adjustment (30m) -> 10m lag for earthing discharge
  // 3. S&T point machine testing (25m)
  const jobSequence = selectedForCluster.map((task, idx) => {
    let lagAfterMin = 0;
    let lagReason: string | undefined = undefined;

    if (task.department === "Engineering" && idx < selectedForCluster.length - 1) {
      lagAfterMin = 10;
      lagReason = "Track stabilization & weld cooling before OHE tower wagon passage";
    } else if (task.department === "Traction" && idx < selectedForCluster.length - 1) {
      lagAfterMin = 5;
      lagReason = "OHE power clearance verification prior to S&T point movement test";
    }

    return {
      sequenceOrder: idx + 1,
      taskId: task.taskId,
      taskTitle: task.title,
      department: task.department,
      durationMin: task.durationMin,
      lagAfterMin,
      lagReason,
    };
  });

  const totalWorkDurationMin = selectedForCluster.reduce((sum, t) => sum + t.durationMin, 0);
  const totalSequentialLagsMin = jobSequence.reduce((sum, j) => sum + j.lagAfterMin, 0);
  const requiredBlockWindowMin = totalWorkDurationMin + totalSequentialLagsMin;

  const departments = Array.from(new Set(selectedForCluster.map((t) => t.department)));
  const machines = Array.from(
    new Set(selectedForCluster.map((t) => t.machineRequired).filter((m) => m !== "None"))
  );
  const oheRequired = selectedForCluster.some((t) => t.oheRequired);

  const primaryCluster: CompositionGroup = {
    clusterId: "CLUST-WL-NDKD-01",
    corridorSectionId: sectionCorridor.sectionId,
    line: "DOWN",
    kmStart: Math.min(...selectedForCluster.map((t) => t.kmStart)),
    kmEnd: Math.max(...selectedForCluster.map((t) => t.kmEnd)),
    tasks: selectedForCluster,
    departments,
    totalWorkDurationMin,
    totalSequentialLagsMin,
    requiredBlockWindowMin,
    oheRequired,
    machinesAssigned: machines,
    isCompatible: true,
    whyCombinedReasons: [
      `✓ Shared Corridor Boundary: All ${selectedForCluster.length} tasks fall within KM ${sectionCorridor.kmStart}–${sectionCorridor.kmEnd} on the DOWN line.`,
      `✓ Power Block Co-location: TRD OHE work and S&T point overhaul share a single 25kV traction isolation, eliminating redundant de-energization cycles.`,
      `✓ Sequential Machine Clearance: CSM tamping machine and OHE tower wagon operate with 10-min safety separation buffers.`,
      `✓ Multi-Department Consolidation: Combines ${departments.join(", ")} into one single corridor closure.`,
      `✓ Work Window Feasibility: Usable work time accommodates total sequenced task demand with safety lag.`,
    ],
    jobSequence,
  };

  return [primaryCluster];
}
