import { Block, PlanMetrics } from "./planning";

export type ScenarioType =
  | "BLOCK_DENIAL"
  | "TRAIN_ADDITION"
  | "MAINTENANCE_OVERRUN"
  | "OHE_BLOCK"
  | "EMERGENCY_DEFECT";

export interface PlanningScenario {
  scenarioId: string;
  name: string;
  type: ScenarioType;
  description: string;
  badge: string;
  affectedSection: string;
  timeRange: string;
  impactSummary: string;
  status: "Completed" | "Pending" | "Simulated";
  createdAt: string;
  baselineMetrics: PlanMetrics;
  adjustedMetrics: PlanMetrics;
  resultingBlock?: Block;
}
