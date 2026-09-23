import { Department, CriticalityTier, TaskStatus } from "@/types/maintenance";
import { BlockStatus } from "@/types/planning";

export function formatKm(km: number): string {
  return `KM ${km.toFixed(1)}`;
}

export function formatKmRange(startKm: number, endKm: number): string {
  return `KM ${startKm.toFixed(1)} – ${endKm.toFixed(1)}`;
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes}m`;
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hrs}h ${mins}m` : `${hrs}h`;
}

// Department color identity:
// Engineering: amber/orange
// S&T: blue
// Traction: red/orange-red
export function getDepartmentColor(dept: Department): {
  bg: string;
  text: string;
  border: string;
  badge: string;
} {
  switch (dept) {
    case "Engineering":
      return {
        bg: "bg-amber-950/60",
        text: "text-amber-400",
        border: "border-amber-700/60",
        badge: "bg-amber-500/15 text-amber-400 border-amber-500/30",
      };
    case "S&T":
      return {
        bg: "bg-sky-950/60",
        text: "text-sky-400",
        border: "border-sky-700/60",
        badge: "bg-sky-500/15 text-sky-400 border-sky-500/30",
      };
    case "Traction":
      return {
        bg: "bg-orange-950/60",
        text: "text-orange-400",
        border: "border-orange-700/60",
        badge: "bg-orange-500/15 text-orange-400 border-orange-500/30",
      };
    default:
      return {
        bg: "bg-slate-900",
        text: "text-slate-300",
        border: "border-slate-700",
        badge: "bg-slate-800 text-slate-300 border-slate-600",
      };
  }
}

export function getCriticalityBadge(criticality: CriticalityTier): {
  bg: string;
  text: string;
  border: string;
  dot: string;
} {
  switch (criticality) {
    case "Critical":
      return {
        bg: "bg-rose-950/70",
        text: "text-rose-400",
        border: "border-rose-800/70",
        dot: "bg-rose-500 animate-pulse",
      };
    case "High":
      return {
        bg: "bg-amber-950/60",
        text: "text-amber-400",
        border: "border-amber-800/60",
        dot: "bg-amber-500",
      };
    case "Medium":
      return {
        bg: "bg-sky-950/60",
        text: "text-sky-400",
        border: "border-sky-800/60",
        dot: "bg-sky-500",
      };
    case "Low":
      return {
        bg: "bg-slate-800/80",
        text: "text-slate-400",
        border: "border-slate-700",
        dot: "bg-slate-400",
      };
  }
}

export function getStatusBadge(status: TaskStatus | BlockStatus): {
  bg: string;
  text: string;
  border: string;
} {
  switch (status) {
    case "ACTIVE":
    case "In Progress":
      return {
        bg: "bg-emerald-950/80",
        text: "text-emerald-400",
        border: "border-emerald-600",
      };
    case "APPROVED":
    case "Scheduled":
      return {
        bg: "bg-blue-950/80",
        text: "text-blue-400",
        border: "border-blue-600",
      };
    case "PLANNED":
    case "Unscheduled":
      return {
        bg: "bg-amber-950/60",
        text: "text-amber-400",
        border: "border-amber-800/60",
      };
    case "COMPLETED":
    case "Completed":
      return {
        bg: "bg-slate-800/80",
        text: "text-slate-400",
        border: "border-slate-700",
      };
    default:
      return {
        bg: "bg-slate-800",
        text: "text-slate-400",
        border: "border-slate-700",
      };
  }
}
