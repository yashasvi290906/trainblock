export type TrainType =
  | "Vande Bharat"
  | "Rajdhani"
  | "Shatabdi"
  | "Amrit Bharat"
  | "Tejas"
  | "Freight"
  | "Passenger";

export type TrainPriority = "P1_HIGHEST" | "P2_HIGH" | "P3_MEDIUM" | "P4_FREIGHT";

export type Direction = "UP" | "DOWN";

export type TrainStatus = "ON_TIME" | "DELAYED" | "REGULATED" | "RUNNING" | "FORECAST";

export interface Train {
  id: string;
  serviceNumber: string;
  name: string;
  type: TrainType;
  priority: TrainPriority;
  direction: Direction;
  origin: string;
  destination: string;
  currentKm: number;
  startKm: number;
  endKm: number;
  speed: number; // km/h
  scheduledTime: string;
  status: TrainStatus;
  color: string;
  isForecast?: boolean;
  rakesCount?: number;
  delayMinutes?: number;
}

export interface Station {
  code: string;
  name: string;
  km: number;
  type: "JUNCTION" | "TERMINAL" | "WAY_STATION";
  platforms?: number;
  loopLines?: number;
}

export interface Section {
  id: string;
  fromStation: string;
  toStation: string;
  startKm: number;
  endKm: number;
  lineType: "DOUBLE" | "SINGLE" | "QUADRUPLE";
  maxSpeed: number;
  gradient?: string;
}

export interface Signal {
  id: string;
  km: number;
  direction: Direction;
  aspect: "GREEN" | "DOUBLE_YELLOW" | "YELLOW" | "RED";
  type: "AUTOMATIC" | "HOME" | "STARTER" | "DISTANT";
}

export interface Corridor {
  corridorId: string;
  name: string;
  zone: string;
  division: string;
  length: number; // in km (128)
  lineType: "Double Line";
  stations: Station[];
  sections: Section[];
  kmMarkers: number[];
  signals: Signal[];
  oheSections: {
    id: string;
    startKm: number;
    endKm: number;
    substation: string;
    voltage: string;
    isEnergized: boolean;
  }[];
}

export interface TimetableMovement {
  trainId: string;
  trainName: string;
  serviceNumber: string;
  trainType: TrainType;
  direction: Direction;
  color: string;
  isForecast?: boolean;
  trajectory: {
    km: number;
    time: string; // "02:15"
    minutesFromMidnight: number;
    stationCode?: string;
  }[];
}
