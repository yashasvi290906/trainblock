import { TimetableMovement, Train } from "@/types/railway";
import { Block, TrainConflict } from "@/types/planning";

export interface ConflictResult {
  hasConflict: boolean;
  conflicts: TrainConflict[];
  protectedCount: number;
  conflictingCount: number;
  freightConflicts: number;
  totalEvaluated: number;
}

/**
 * Pure deterministic conflict detection between train trajectories and maintenance block windows.
 */
export function calculateBlockIntersection(
  trainStartKm: number,
  trainEndKm: number,
  trainStartTimeMins: number,
  trainEndTimeMins: number,
  blockStartKm: number,
  blockEndKm: number,
  blockStartTimeMins: number,
  blockEndTimeMins: number,
  bufferMins: number = 5
): { intersects: boolean; crossingKm?: number; crossingTimeMins?: number } {
  // Spatial overlap
  const spatialOverlap =
    Math.max(blockStartKm, Math.min(trainStartKm, trainEndKm)) <=
    Math.min(blockEndKm, Math.max(trainStartKm, trainEndKm));

  // Temporal overlap with safety buffer
  const temporalOverlap =
    Math.max(blockStartTimeMins - bufferMins, Math.min(trainStartTimeMins, trainEndTimeMins)) <=
    Math.min(blockEndTimeMins + bufferMins, Math.max(trainStartTimeMins, trainEndTimeMins));

  if (!spatialOverlap || !temporalOverlap) {
    return { intersects: false };
  }

  // Calculate approximate crossing point
  const crossingKm = Number(
    (
      Math.max(blockStartKm, Math.min(trainStartKm, trainEndKm)) +
      Math.min(blockEndKm, Math.max(trainStartKm, trainEndKm))
    ) / 2
  ).toFixed(1);

  const crossingTimeMins = Math.round(
    (Math.max(blockStartTimeMins, trainStartTimeMins) +
      Math.min(blockEndTimeMins, trainEndTimeMins)) /
      2
  );

  return {
    intersects: true,
    crossingKm: parseFloat(crossingKm),
    crossingTimeMins,
  };
}

export function calculateTrainConflicts(
  block: {
    kmStart: number;
    kmEnd: number;
    startTime: string;
    endTime: string;
    line?: string;
  },
  trains: {
    id: string;
    name: string;
    serviceNumber: string;
    startKm: number;
    endKm: number;
    startTime: string;
    endTime: string;
    priority: string;
    isForecast?: boolean;
  }[]
): ConflictResult {
  const [bh1, bm1] = block.startTime.split(":").map(Number);
  const [bh2, bm2] = block.endTime.split(":").map(Number);
  const blockStartMins = bh1 * 60 + bm1;
  const blockEndMins = bh2 * 60 + bm2;

  const conflicts: TrainConflict[] = [];
  let freightConflicts = 0;

  trains.forEach((trn) => {
    const [th1, tm1] = trn.startTime.split(":").map(Number);
    const [th2, tm2] = trn.endTime.split(":").map(Number);
    const trainStartMins = th1 * 60 + tm1;
    const trainEndMins = th2 * 60 + tm2;

    const intersection = calculateBlockIntersection(
      trn.startKm,
      trn.endKm,
      trainStartMins,
      trainEndMins,
      block.kmStart,
      block.kmEnd,
      blockStartMins,
      blockEndMins
    );

    if (intersection.intersects) {
      if (trn.isForecast) {
        freightConflicts += 1;
      }
      const delay = Math.max(15, blockEndMins - (intersection.crossingTimeMins || trainStartMins) + 5);
      conflicts.push({
        trainId: trn.id,
        trainName: trn.name,
        serviceNumber: trn.serviceNumber,
        expectedTime: `${Math.floor((intersection.crossingTimeMins || 160) / 60)
          .toString()
          .padStart(2, "0")}:${((intersection.crossingTimeMins || 160) % 60)
          .toString()
          .padStart(2, "0")}`,
        conflictType: "DIRECT_OVERLAP",
        resolution: "REGULATE",
        estimatedDelayMinutes: delay,
      });
    }
  });

  const conflictingCount = conflicts.length;
  const protectedCount = Math.max(0, trains.length - conflictingCount);

  return {
    hasConflict: conflictingCount > 0,
    conflicts,
    protectedCount,
    conflictingCount,
    freightConflicts,
    totalEvaluated: trains.length,
  };
}

export function calculateFallbackWindows(
  currentWindow: { start: string; end: string; duration: number },
  trains: any[]
) {
  const candidateSlots = [
    { id: "OPT-A", start: "03:10", end: "05:00", duration: 110, compatibility: 91, conflicts: 0, freight: 1, retained: "7/7" },
    { id: "OPT-B", start: "04:20", end: "06:00", duration: 100, compatibility: 76, conflicts: 2, freight: 0, retained: "6/7" },
    { id: "OPT-C", start: "05:10", end: "06:40", duration: 90, compatibility: 64, conflicts: 3, freight: 1, retained: "5/7" },
  ];

  return candidateSlots;
}
