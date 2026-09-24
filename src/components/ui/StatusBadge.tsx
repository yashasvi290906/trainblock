"use client";

import React from "react";
import { cn } from "@/lib/utils";

export type StatusVariant = "safe" | "attention" | "conflict" | "info" | "neutral";

export interface StatusBadgeProps {
  variant?: StatusVariant;
  label: string;
  size?: "sm" | "md";
  showDot?: boolean;
  className?: string;
}

export function StatusBadge({
  variant = "neutral",
  label,
  size = "md",
  showDot = true,
  className,
}: StatusBadgeProps) {
  const variantStyles = {
    safe: "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60",
    attention: "bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800/60",
    conflict: "bg-red-50 dark:bg-red-950/60 text-red-800 dark:text-red-300 border-red-200 dark:border-red-800/60",
    info: "bg-blue-50 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800/60",
    neutral: "bg-slate-100 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700/60",
  }[variant];

  const dotColor = {
    safe: "bg-emerald-500",
    attention: "bg-amber-500",
    conflict: "bg-red-500",
    info: "bg-blue-500",
    neutral: "bg-slate-400",
  }[variant];

  const sizeStyles = {
    sm: "text-[10px] px-1.5 py-0.5",
    md: "text-[11px] px-2 py-0.5 font-semibold",
  }[size];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border font-mono tracking-tight select-none",
        variantStyles,
        sizeStyles,
        className
      )}
    >
      {showDot && <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", dotColor)} />}
      <span>{label}</span>
    </span>
  );
}
