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
    safe: "bg-emerald-50 text-emerald-800 border-emerald-200",
    attention: "bg-amber-50 text-amber-800 border-amber-200",
    conflict: "bg-red-50 text-red-800 border-red-200",
    info: "bg-blue-50 text-blue-800 border-blue-200",
    neutral: "bg-slate-100 text-slate-700 border-slate-200",
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
