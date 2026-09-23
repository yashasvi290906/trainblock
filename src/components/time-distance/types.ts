export type TrainPriorityType = "HIGH" | "MEDIUM" | "NORMAL" | "FREIGHT";

export interface TimeDistanceTrain {
  id: string;
  name: string;
  serviceNumber: string;
  type: string;
  priority: TrainPriorityType;
  direction: "UP" | "DOWN";
  color: string;
  isForecast?: boolean;
  trajectory: {
    km: number;
    time: string; // "02:08"
    minutesFromMidnight: number;
    stationCode?: string;
    isDwell?: boolean;
    dwellMin?: number;
  }[];
}

export interface BlockPossession {
  id: string;
  name: string;
  corridor: string;
  section: string;
  startKm: number;
  endKm: number;
  startTime: string; // "02:20"
  endTime: string; // "04:10"
  durationMin: number;
  usableMin: number;
  departments: string[];
  tasksCount: number;
  p1Tasks: number;
  p2Tasks: number;
  status: "PROTECTED" | "CONFLICT" | "FEASIBLE" | "REPLANNED";
}

export interface CandidateWindow {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  startKm: number;
  endKm: number;
  durationMin: number;
  usableMin: number;
  status: "CONFLICT" | "FEASIBLE" | "PARTIAL";
  passengerConflicts: number;
  freightInteractions: number;
  description: string;
}

export interface ConflictPoint {
  id: string;
  trainId: string;
  trainName: string;
  trainType: string;
  priority: TrainPriorityType;
  direction: "UP" | "DOWN";
  blockId: string;
  km: number;
  timeStr: string;
  timeMins: number;
  conflictType: "DIRECT_OVERLAP" | "HEADWAY_RISK" | "FORECAST_INTERACTION";
  resolutionRequired: string;
}

export interface StationDwell {
  code: string;
  name: string;
  km: number;
  trainId: string;
  trainName: string;
  arrival: string;
  departure: string;
  dwellMin: number;
}
