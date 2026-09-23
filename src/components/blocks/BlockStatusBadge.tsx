import React from "react";
import { BlockStatus } from "@/types/planning";
import { cn } from "@/lib/utils";

interface BlockStatusBadgeProps {
  status: BlockStatus;
  className?: string;
  size?: "sm" | "md";
}

export function BlockStatusBadge({
  status,
  className,
  size = "md",
}: BlockStatusBadgeProps) {
  const getBadgeConfig = () => {
    switch (status) {
      case "ACTIVE":
        return {
          bg: "bg-emerald-500/20",
          text: "text-emerald-400",
          border: "border-emerald-500/40",
          dot: "bg-emerald-400 animate-pulse",
          label: "ACTIVE POSSESSION",
        };
      case "APPROVED":
        return {
          bg: "bg-blue-500/20",
          text: "text-blue-300",
          border: "border-blue-500/40",
          dot: "bg-blue-400",
          label: "APPROVED",
        };
      case "PLANNED":
        return {
          bg: "bg-amber-500/20",
          text: "text-amber-300",
          border: "border-amber-500/40",
          dot: "bg-amber-400",
          label: "PLANNED",
        };
      case "COMPLETED":
        return {
          bg: "bg-slate-700/40",
          text: "text-slate-400",
          border: "border-slate-600/40",
          dot: "bg-slate-400",
          label: "COMPLETED",
        };
      default:
        return {
          bg: "bg-slate-800",
          text: "text-slate-300",
          border: "border-slate-700",
          dot: "bg-slate-400",
          label: status,
        };
    }
  };

  const config = getBadgeConfig();

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded font-mono font-semibold uppercase tracking-wider border",
        config.bg,
        config.text,
        config.border,
        size === "sm" ? "px-1.5 py-0.5 text-[9px]" : "px-2.5 py-1 text-xs",
        className
      )}
    >
      <span className={cn("w-1.5 h-1.5 rounded-full", config.dot)}></span>
      <span>{config.label}</span>
    </span>
  );
}
