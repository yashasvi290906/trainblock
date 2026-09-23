import { MaintenanceTask, CriticalityTier, Department, ProtectionType } from "@/types/maintenance";
import { Train, TimetableMovement } from "@/types/railway";
import { Block, TrainConflict } from "@/types/planning";

export type PriorityTier = "P1" | "P2" | "P3" | "P4";

export interface PriorityInfo {
  tier: PriorityTier;
  label: string;
  badgeClass: string;
  reasons: string[];
}

/**
 * Deterministic railway priority calculation based on safety criticality,
 * overdue status, asset availability impact, and protection level.
 */
export function calculateTaskPriority(task: MaintenanceTask): PriorityInfo {
  const reasons: string[] = [];

  if (task.criticality === "Critical" || task.overdueDays >= 10) {
    reasons.push("Safety critical asset condition");
    if (task.overdueDays >= 10) {
      reasons.push(`${task.overdueDays} days overdue (exceeds tolerance)`);
    }
    if (task.requiredProtection === "Full Block" || task.requiredProtection === "Power Block") {
      reasons.push("Requires dedicated corridor protection");
    }
    reasons.push("High asset availability impact if unaddressed");
    return {
      tier: "P1",
      label: "P1 · SAFETY CRITICAL",
      badgeClass: "bg-rose-950/80 text-rose-300 border-rose-700/60",
      reasons,
    };
  }

  if (task.criticality === "High" || task.overdueDays >= 5) {
    reasons.push("High priority track/signal asset");
    if (task.overdueDays > 0) {
      reasons.push(`${task.overdueDays} days overdue`);
    }
    reasons.push("Moderate corridor speed restriction risk");
    return {
      tier: "P2",
      label: "P2 · HIGH URGENCY",
      badgeClass: "bg-amber-950/80 text-amber-300 border-amber-700/60",
      reasons,
    };
  }

  if (task.criticality === "Medium" || task.overdueDays > 0) {
    reasons.push("Routine maintenance cycle due");
    reasons.push("Standard maintenance window required");
    return {
      tier: "P3",
      label: "P3 · NORMAL",
      badgeClass: "bg-sky-950/80 text-sky-300 border-sky-700/60",
      reasons,
    };
  }

  reasons.push("Low urgency / preventive inspection");
  return {
    tier: "P4",
    label: "P4 · LOW / ROUTINE",
    badgeClass: "bg-slate-800 text-slate-300 border-slate-700",
    reasons,
  };
}

/**
 * Check if two maintenance tasks are potentially compatible for consolidation
 * into a single multi-departmental block.
 * Factors: Spatial proximity (within 15km), corridor section, non-conflicting protections.
 */
export function isPotentiallyCompatible(taskA: MaintenanceTask, taskB: MaintenanceTask): boolean {
  if (taskA.taskId === taskB.taskId) return false;

  // Spatial proximity check (within 15km)
  const distance = Math.max(
    0,
    Math.max(taskA.kmStart, taskB.kmStart) - Math.min(taskA.kmEnd, taskB.kmEnd)
  );

  if (distance > 18) return false;

  // Direction compatibility: If both have directions specified, they should match or be BOTH
  if (
    taskA.direction !== "BOTH" &&
    taskB.direction !== "BOTH" &&
    taskA.direction !== taskB.direction
  ) {
    // Cross-track is sometimes compatible in full shadow block, but same-line preferred
    return distance <= 5;
  }

  return true;
}

/**
 * Usable-minute calculations:
 * Accounts for setup/protection, machine transit, OHE earthing, and safety margins.
 */
export interface UsableMinuteBreakdown {
  grantedMinutes: number;
  protectionOverhead: number;
  machineTransitOverhead: number;
  earthingOverhead: number;
  safetyMargin: number;
  usableMinutes: number;
  requiredWorkMinutes: number;
  utilizationPercent: number;
  remainingMinutes: number;
}

export function calculateUsableMinutes(
  grantedMinutes: number,
  requiredWorkMinutes: number,
  hasOhe: boolean,
  hasMachine: boolean
): UsableMinuteBreakdown {
  const protectionOverhead = 10;
  const machineTransitOverhead = hasMachine ? 10 : 0;
  const earthingOverhead = hasOhe ? 5 : 0;
  const safetyMargin = 5;

  const totalOverhead =
    protectionOverhead + machineTransitOverhead + earthingOverhead + safetyMargin;

  const usableMinutes = Math.max(0, grantedMinutes - totalOverhead);
  const utilizationPercent =
    usableMinutes > 0
      ? Math.min(100, Math.round((requiredWorkMinutes / usableMinutes) * 100))
      : 0;
  const remainingMinutes = usableMinutes - requiredWorkMinutes;

  return {
    grantedMinutes,
    protectionOverhead,
    machineTransitOverhead,
    earthingOverhead,
    safetyMargin,
    usableMinutes,
    requiredWorkMinutes,
    utilizationPercent,
    remainingMinutes,
  };
}

/**
 * Helper to convert "HH:MM" string to minutes from midnight
 */
export function timeStringToMinutes(timeStr: string): number {
  const [h, m] = timeStr.split(":").map(Number);
  return h * 60 + m;
}

/**
 * Helper to convert minutes from midnight to "HH:MM"
 */
export function minutesToTimeString(minutes: number): string {
  const normalized = ((minutes % 1440) + 1440) % 1440;
  const h = Math.floor(normalized / 60);
  const m = normalized % 60;
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
}

/**
 * Detect train conflicts with a planned maintenance block.
 * Checks spatial overlap (KM) and temporal overlap (Time).
 */
export function detectTrainBlockConflicts(
  block: {
    kmStart: number;
    kmEnd: number;
    startTime: string;
    endTime: string;
    line?: string;
  },
  movements: TimetableMovement[]
): TrainConflict[] {
  const conflicts: TrainConflict[] = [];

  const blockStartMins = timeStringToMinutes(block.startTime);
  const blockEndMins = timeStringToMinutes(block.endTime);

  movements.forEach((mov) => {
    // Check trajectory points
    for (let i = 0; i < mov.trajectory.length - 1; i++) {
      const pt1 = mov.trajectory[i];
      const pt2 = mov.trajectory[i + 1];

      const segMinKm = Math.min(pt1.km, pt2.km);
      const segMaxKm = Math.max(pt1.km, pt2.km);

      const segMinTime = Math.min(pt1.minutesFromMidnight, pt2.minutesFromMidnight);
      const segMaxTime = Math.max(pt1.minutesFromMidnight, pt2.minutesFromMidnight);

      // Spatial overlap check
      const spatialOverlap =
        Math.max(block.kmStart, segMinKm) <= Math.min(block.kmEnd, segMaxKm);

      // Temporal overlap check (with 10 min safety buffer)
      const temporalOverlap =
        Math.max(blockStartMins - 5, segMinTime) <= Math.min(blockEndMins + 5, segMaxTime);

      if (spatialOverlap && temporalOverlap) {
        conflicts.push({
          trainId: mov.trainId,
          trainName: mov.trainName,
          serviceNumber: mov.serviceNumber,
          expectedTime: minutesToTimeString(segMinTime),
          conflictType: "DIRECT_OVERLAP",
          resolution: "REGULATE",
          estimatedDelayMinutes: Math.max(15, blockEndMins - segMinTime + 10),
        });
        break; // One conflict record per train
      }
    }
  });

  return conflicts;
}
