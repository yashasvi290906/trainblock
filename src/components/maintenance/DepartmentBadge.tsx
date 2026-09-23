import React from "react";
import { Department } from "@/types/maintenance";
import { getDepartmentColor } from "@/lib/formatting";
import { cn } from "@/lib/utils";
import { Wrench, Radio, Zap } from "lucide-react";

interface DepartmentBadgeProps {
  department: Department;
  showIcon?: boolean;
  className?: string;
  size?: "sm" | "md";
}

export function DepartmentBadge({
  department,
  showIcon = true,
  className,
  size = "md",
}: DepartmentBadgeProps) {
  const styles = getDepartmentColor(department);

  const icons = {
    Engineering: <Wrench className="w-3 h-3" />,
    "S&T": <Radio className="w-3 h-3" />,
    Traction: <Zap className="w-3 h-3" />,
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded font-medium border",
        styles.badge,
        size === "sm" ? "px-1.5 py-0.5 text-[10px]" : "px-2 py-0.5 text-xs",
        className
      )}
    >
      {showIcon && icons[department]}
      <span>{department}</span>
    </span>
  );
}
