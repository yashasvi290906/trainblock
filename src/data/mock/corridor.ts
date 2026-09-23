import { Corridor } from "@/types/railway";

export const MOCK_CORRIDOR: Corridor = {
  corridorId: "SEC-NDL-128",
  name: "Secunderabad – Nandyal Corridor",
  zone: "South Central Railway (SCR)",
  division: "Secunderabad (SC)",
  length: 128,
  lineType: "Double Line",
  stations: [
    { code: "SEC", name: "Secunderabad Jn", km: 0, type: "TERMINAL", platforms: 10, loopLines: 6 },
    { code: "KZJ", name: "Kazipet Jn", km: 32, type: "JUNCTION", platforms: 5, loopLines: 4 },
    { code: "WL", name: "Warangal", km: 68, type: "JUNCTION", platforms: 4, loopLines: 3 },
    { code: "NDKD", name: "Nadikude Jn", km: 101, type: "WAY_STATION", platforms: 3, loopLines: 2 },
    { code: "NDL", name: "Nandyal Jn", km: 128, type: "TERMINAL", platforms: 4, loopLines: 4 },
  ],
  sections: [
    { id: "SEC-KZJ", fromStation: "SEC", toStation: "KZJ", startKm: 0, endKm: 32, lineType: "DOUBLE", maxSpeed: 130 },
    { id: "KZJ-WL", fromStation: "KZJ", toStation: "WL", startKm: 32, endKm: 68, lineType: "DOUBLE", maxSpeed: 130 },
    { id: "WL-NDKD", fromStation: "WL", toStation: "NDKD", startKm: 68, endKm: 101, lineType: "DOUBLE", maxSpeed: 110 },
    { id: "NDKD-NDL", fromStation: "NDKD", toStation: "NDL", startKm: 101, endKm: 128, lineType: "DOUBLE", maxSpeed: 110 },
  ],
  kmMarkers: [0, 10, 20, 32, 45, 55, 68, 80, 90, 101, 115, 128],
  signals: [
    { id: "SIG-01", km: 12, direction: "DOWN", aspect: "GREEN", type: "AUTOMATIC" },
    { id: "SIG-02", km: 28, direction: "DOWN", aspect: "DOUBLE_YELLOW", type: "HOME" },
    { id: "SIG-03", km: 45, direction: "DOWN", aspect: "GREEN", type: "AUTOMATIC" },
    { id: "SIG-04", km: 66, direction: "DOWN", aspect: "YELLOW", type: "DISTANT" },
    { id: "SIG-05", km: 75, direction: "DOWN", aspect: "RED", type: "HOME" }, // Protected block zone
    { id: "SIG-06", km: 92, direction: "DOWN", aspect: "RED", type: "STARTER" },
    { id: "SIG-07", km: 110, direction: "DOWN", aspect: "GREEN", type: "AUTOMATIC" },
    { id: "SIG-08", km: 18, direction: "UP", aspect: "GREEN", type: "AUTOMATIC" },
    { id: "SIG-09", km: 52, direction: "UP", aspect: "GREEN", type: "AUTOMATIC" },
    { id: "SIG-10", km: 85, direction: "UP", aspect: "YELLOW", type: "AUTOMATIC" },
  ],
  oheSections: [
    { id: "OHE-SEC-KZJ", startKm: 0, endKm: 32, substation: "SC-TSS", voltage: "25kV AC", isEnergized: true },
    { id: "OHE-KZJ-WL", startKm: 32, endKm: 68, substation: "KZJ-TSS", voltage: "25kV AC", isEnergized: true },
    { id: "OHE-WL-NDKD", startKm: 68, endKm: 101, substation: "WL-TSS", voltage: "25kV AC", isEnergized: false }, // De-energized for Block B-014
    { id: "OHE-NDKD-NDL", startKm: 101, endKm: 128, substation: "NDKD-TSS", voltage: "25kV AC", isEnergized: true },
  ],
};
