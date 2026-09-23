import { PlanMetrics } from "@/types/planning";

export const MOCK_INTEGRATED_METRICS: PlanMetrics = {
  possessions: 1,
  workMinutes: 120,
  blockedMinutes: 110,
  weightedTrainDelay: 110,
  criticalBacklog: 0,
  assetAvailability: 81,
  planChurn: 1,
  comparisonWithSiloed: {
    possessionsDiff: -67, // -67% reduction in possessions (from 3 to 1)
    workMinutesDiff: -33, // -33% combined corridor possession time
    weightedTrainDelayDiff: -74, // -74% passenger delay impact
    criticalBacklogDiff: -100, // 0 critical tasks left overdue
    assetAvailabilityDiff: 12, // +12% improvement to 81%
    planChurnDiff: -75, // -75% reduction in last-minute rescheduling
  },
};

export const MOCK_SILOED_METRICS: PlanMetrics = {
  possessions: 3,
  workMinutes: 180,
  blockedMinutes: 135,
  weightedTrainDelay: 420,
  criticalBacklog: 5,
  assetAvailability: 72,
  planChurn: 4,
};

export const MOCK_BENCHMARK_METRICS: PlanMetrics = {
  possessions: 2,
  workMinutes: 150,
  blockedMinutes: 125,
  weightedTrainDelay: 230,
  criticalBacklog: 2,
  assetAvailability: 77,
  planChurn: 2,
};
