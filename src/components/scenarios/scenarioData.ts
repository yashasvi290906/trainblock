import { FallbackWindow, CriticalWorkInput, TrainMovementOverride, ScenarioSnapshot } from "./types";
import { TimeDistanceTrain } from "@/components/time-distance/types";

export interface CanonicalBasePlan {
  blockId: string;
  corridor: string;
  section: string;
  kmStart: number;
  kmEnd: number;
  startTime: string;
  endTime: string;
  durationMin: number;
  usableWorkMin: number;
  departments: string[];
  totalWorkOrders: number;
  p1WorkOrders: number;
  p2WorkOrders: number;
  p3WorkOrders: number;
  passengerMovementsProtected: number;
  goodsForecastPresent: boolean;
  crewCount: number;
  machinesAssigned: string[];
  date: string;
}

export const BASELINE_PLAN: CanonicalBasePlan = {
  blockId: "B-014",
  corridor: "SEC → NDL",
  section: "WL - NDKD",
  kmStart: 68,
  kmEnd: 94,
  startTime: "02:20",
  endTime: "04:10",
  durationMin: 110,
  usableWorkMin: 90,
  departments: ["Engineering", "S&T", "Traction"],
  totalWorkOrders: 18,
  p1WorkOrders: 3,
  p2WorkOrders: 7,
  p3WorkOrders: 8,
  passengerMovementsProtected: 4,
  goodsForecastPresent: true,
  crewCount: 47,
  machinesAssigned: ["CSM-9022 (Track Tamping)", "TW-4401 (Tower Wagon)"],
  date: "18 SEP 2026",
};

export const FALLBACK_WINDOWS: FallbackWindow[] = [
  {
    id: "FW-01",
    code: "FW-01",
    name: "Trailing Morning Window",
    startTime: "04:20",
    endTime: "06:10",
    startKm: 68,
    endKm: 94,
    durationMin: 110,
    usableWorkMin: 90,
    passengerConflicts: 0,
    goodsInteractions: 1,
    protectionStatus: "PASSENGER PATHS PROTECTED",
    feasibilityRating: "FEASIBLE",
    workOrdersRetained: 18,
    totalWorkOrders: 18,
    p1Retained: 3,
    p2Retained: 7,
    reason: "Trailing slot after Rajdhani and Shatabdi passages clear. Full 90m usable window accommodates all 18 multi-dept work orders.",
  },
  {
    id: "FW-02",
    code: "FW-02",
    name: "Early Night Advance Window",
    startTime: "01:10",
    endTime: "02:40",
    startKm: 68,
    endKm: 94,
    durationMin: 90,
    usableWorkMin: 80,
    passengerConflicts: 1,
    goodsInteractions: 0,
    protectionStatus: "REQUIRES REVIEW",
    feasibilityRating: "CONDITIONAL",
    workOrdersRetained: 16,
    totalWorkOrders: 18,
    p1Retained: 3,
    p2Retained: 6,
    reason: "Requires 12-min regulation of trailing Vande Bharat feeder service. 80m usable window defers 2 low-priority P3 tasks.",
  },
  {
    id: "FW-03",
    code: "FW-03",
    name: "Dawn Short Compression Window",
    startTime: "05:00",
    endTime: "06:30",
    startKm: 68,
    endKm: 94,
    durationMin: 90,
    usableWorkMin: 65,
    passengerConflicts: 0,
    goodsInteractions: 1,
    protectionStatus: "INSUFFICIENT FOR FULL DEMAND",
    feasibilityRating: "INSUFFICIENT",
    workOrdersRetained: 12,
    totalWorkOrders: 18,
    p1Retained: 3,
    p2Retained: 4,
    reason: "OHE isolation setup and machine travel cut usable time to 65m. 6 work orders cannot be completed inside this slot.",
  },
];

export const INITIAL_CRITICAL_WORK: CriticalWorkInput = {
  department: "Engineering",
  asset: "Track (USFD Rail Joint Renewal)",
  location: "KM 72–76 (DN Line)",
  kmStart: 72,
  kmEnd: 76,
  durationMin: 45,
  criticality: "P1",
  description: "Ultrasonic flaw detection identified urgent rail head fissure requiring immediate fishplate clamping & thermite weld renewal.",
};

export const TRAIN_OPTIONS: TrainMovementOverride[] = [
  {
    trainId: "VB-20612",
    name: "Vande Bharat Express",
    serviceNumber: "20612",
    type: "Vande Bharat Trainset",
    direction: "DOWN",
    baseKm72Time: "03:02",
    shiftedKm72Time: "03:28",
    offsetMinutes: 26,
  },
  {
    trainId: "R-12434",
    name: "Rajdhani Express",
    serviceNumber: "12434",
    type: "Rajdhani Superfast",
    direction: "DOWN",
    baseKm72Time: "03:24",
    shiftedKm72Time: "02:50",
    offsetMinutes: -34,
  },
  {
    trainId: "S-12009",
    name: "Shatabdi Express",
    serviceNumber: "12009",
    type: "Shatabdi Express",
    direction: "UP",
    baseKm72Time: "04:12",
    shiftedKm72Time: "03:45",
    offsetMinutes: -27,
  },
  {
    trainId: "G-4217",
    name: "Container Freight",
    serviceNumber: "G/4217",
    type: "Container Freight (FOIS)",
    direction: "DOWN",
    baseKm72Time: "05:35",
    shiftedKm72Time: "03:15",
    offsetMinutes: -140,
  },
];

export const CANONICAL_SCENARIO_TRAINS: TimeDistanceTrain[] = [
  {
    id: "VB-20612",
    name: "Vande Bharat 20612",
    serviceNumber: "20612",
    type: "Vande Bharat",
    priority: "HIGH",
    direction: "DOWN",
    color: "#0284c7",
    trajectory: [
      { km: 40, time: "02:20", minutesFromMidnight: 140, stationCode: "SEC" },
      { km: 58, time: "02:44", minutesFromMidnight: 164, stationCode: "LBN" },
      { km: 68, time: "02:56", minutesFromMidnight: 176, stationCode: "WL" },
      { km: 72, time: "03:02", minutesFromMidnight: 182 },
      { km: 76, time: "03:08", minutesFromMidnight: 188, stationCode: "KCG" },
      { km: 94, time: "03:26", minutesFromMidnight: 206, stationCode: "NDKD" },
      { km: 120, time: "03:52", minutesFromMidnight: 232, stationCode: "NDL" },
    ],
  },
  {
    id: "R-12434",
    name: "Rajdhani 12434",
    serviceNumber: "12434",
    type: "Rajdhani",
    priority: "HIGH",
    direction: "DOWN",
    color: "#dc2626",
    trajectory: [
      { km: 40, time: "02:45", minutesFromMidnight: 165, stationCode: "SEC" },
      { km: 58, time: "03:08", minutesFromMidnight: 188, stationCode: "LBN" },
      { km: 68, time: "03:18", minutesFromMidnight: 198, stationCode: "WL" },
      { km: 72, time: "03:24", minutesFromMidnight: 204 },
      { km: 76, time: "03:30", minutesFromMidnight: 210, stationCode: "KCG" },
      { km: 94, time: "03:50", minutesFromMidnight: 230, stationCode: "NDKD" },
      { km: 120, time: "04:16", minutesFromMidnight: 256, stationCode: "NDL" },
    ],
  },
  {
    id: "AB-12076",
    name: "Amrit Bharat 12076",
    serviceNumber: "12076",
    type: "Amrit Bharat",
    priority: "MEDIUM",
    direction: "DOWN",
    color: "#d97706",
    trajectory: [
      { km: 40, time: "03:15", minutesFromMidnight: 195, stationCode: "SEC" },
      { km: 58, time: "03:42", minutesFromMidnight: 222, stationCode: "LBN" },
      { km: 68, time: "03:55", minutesFromMidnight: 235, stationCode: "WL" },
      { km: 76, time: "04:08", minutesFromMidnight: 248, stationCode: "KCG" },
      { km: 94, time: "04:32", minutesFromMidnight: 272, stationCode: "NDKD" },
      { km: 120, time: "05:02", minutesFromMidnight: 302, stationCode: "NDL" },
    ],
  },
  {
    id: "S-12009",
    name: "Shatabdi 12009",
    serviceNumber: "12009",
    type: "Shatabdi",
    priority: "HIGH",
    direction: "UP",
    color: "#7c3aed",
    trajectory: [
      { km: 120, time: "03:30", minutesFromMidnight: 210, stationCode: "NDL" },
      { km: 94, time: "03:52", minutesFromMidnight: 232, stationCode: "NDKD" },
      { km: 76, time: "04:06", minutesFromMidnight: 246, stationCode: "KCG" },
      { km: 72, time: "04:12", minutesFromMidnight: 252 },
      { km: 68, time: "04:18", minutesFromMidnight: 258, stationCode: "WL" },
      { km: 58, time: "04:30", minutesFromMidnight: 270, stationCode: "LBN" },
      { km: 40, time: "04:52", minutesFromMidnight: 292, stationCode: "SEC" },
    ],
  },
  {
    id: "G-4217",
    name: "Freight G/4217 (FOIS Forecast)",
    serviceNumber: "G/4217",
    type: "Freight",
    priority: "FREIGHT",
    direction: "DOWN",
    color: "#059669",
    isForecast: true,
    trajectory: [
      { km: 40, time: "04:40", minutesFromMidnight: 280, stationCode: "SEC" },
      { km: 58, time: "05:12", minutesFromMidnight: 312, stationCode: "LBN" },
      { km: 68, time: "05:28", minutesFromMidnight: 328, stationCode: "WL" },
      { km: 72, time: "05:35", minutesFromMidnight: 335 },
      { km: 76, time: "05:42", minutesFromMidnight: 342, stationCode: "KCG" },
      { km: 94, time: "06:14", minutesFromMidnight: 374, stationCode: "NDKD" },
      { km: 120, time: "06:48", minutesFromMidnight: 408, stationCode: "NDL" },
    ],
  },
];

export const INITIAL_SNAPSHOTS: ScenarioSnapshot[] = [
  {
    id: "SNP-01",
    label: "Snapshot 1: Flagship Fallback Replan (FW-01)",
    condition: "BLOCK_DENIAL",
    conditionDescription: "Operating denied B-014 02:20–04:10 → Replanned to FW-01 (04:20–06:10)",
    windowStr: "04:20–06:10",
    durationMin: 110,
    usableMin: 90,
    workOrders: 18,
    p1Count: 3,
    passengerConflicts: 0,
    timestamp: "09:22:14",
    status: "FEASIBLE FOR REVIEW",
  },
  {
    id: "SNP-02",
    label: "Snapshot 2: Critical Track Ingestion (Deficit Test)",
    condition: "ADD_CRITICAL_WORK",
    conditionDescription: "Added P1 Rail Joint (45m) → Total demand 135m exceeds 90m window",
    windowStr: "02:20–04:10",
    durationMin: 110,
    usableMin: 90,
    workOrders: 19,
    p1Count: 4,
    passengerConflicts: 1,
    timestamp: "09:18:40",
    status: "INSUFFICIENT WINDOW",
  },
];
