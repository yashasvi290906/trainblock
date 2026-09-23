import React from "react";
import { CriticalityTier } from "@/types/maintenance";
import { getCriticalityBadge } from "@/lib/formatting";
import { cn } from "@/lib/utils";

interface CriticalityBadgeProps {
  criticality: CriticalityTier;
  className?: string;
  size?: "sm" | "md";
}

export function CriticalityBadge({
  criticality,
  className,
  size = "md",
}: CriticalityBadgeProps) {
  const styles = getCriticalityBadge(criticality);

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded font-medium border",
        styles.bg,
        styles.text,
        styles.border,
        size === "sm" ? "px-1.5 py-0.5 text-[10px]" : "px-2 py-0.5 text-xs",
        className
      )}
    >
      <span className={cn("w-1.5 h-1.5 rounded-full", styles.dot)}></span>
      <span>{criticality}</span>
    </span>
  );
}
