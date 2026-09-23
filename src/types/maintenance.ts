export type Department = "Engineering" | "S&T" | "Traction";

export type CriticalityTier = "Critical" | "High" | "Medium" | "Low";

export type ProtectionType = "Full Block" | "Power Block" | "Traffic Block" | "Caution Order" | "Shadow Block";

export type TaskStatus = "Unscheduled" | "Scheduled" | "In Progress" | "Completed" | "Deferred";

export type MachineRequirement =
  | "None"
  | "BCM (Ballast Cleaning Machine)"
  | "CSM (Continuous Tamping Machine)"
  | "UNIMAT (Points & Crossing Tamping)"
  | "Tower Wagon (OHE)"
  | "DGS (Dynamic Track Stabilizer)"
  | "Wiring Train";

export interface MaintenanceTask {
  taskId: string; // e.g. "ENG-241"
  department: Department;
  assetType: string; // "Rail Joint", "Signal", "OHE", "Track Circuit", "Points"
  assetId: string; // e.g. "RJ-43.1-UP"
  title: string; // e.g. "Rail Joint Renewal"
  kmStart: number;
  kmEnd: number;
  direction: "UP" | "DOWN" | "BOTH";
  duration: number; // minutes, e.g. 65
  criticality: CriticalityTier;
  overdueDays: number;
  requiredProtection: ProtectionType;
  oheRequired: boolean;
  machineRequired: MachineRequirement;
  crewRequired: number;
  status: TaskStatus;
  priorityScore: number; // 0 - 100
  mlRank: number; // e.g. 1
  reasonCodes: {
    assetCriticality: "High" | "Medium" | "Low";
    overdueDays: number;
    availabilityImpact: "High" | "Medium" | "Low";
    operationalConsequence: "High" | "Medium" | "Low";
    clusterCompatibility?: string;
  };
  scheduledBlockId?: string;
  recommendedWindow?: string; // "02:20 - 04:10"
  notes?: string;
}
