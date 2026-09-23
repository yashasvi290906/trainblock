"use client";

import React from "react";
import { Check, Clock, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ConstraintCheckProps {
  hasConflict?: boolean;
}

export function ConstraintCheck({ hasConflict = false }: ConstraintCheckProps) {
  const CONSTRAINTS = [
    {
      id: "c1",
      label: "Train timetable",
      status: hasConflict ? "CONFLICT" : "PASS",
      variant: hasConflict ? "conflict" : "pass",
    },
    {
      id: "c2",
      label: "Safety Criticality",
      status: "PASS",
      variant: "pass",
    },
    {
      id: "c3",
      label: "Work duration",
      status: "PASS",
      variant: "pass",
    },
    {
      id: "c4",
      label: "OHE / protection",
      status: "PASS",
      variant: "pass",
    },
    {
      id: "c5",
      label: "Corridor availability",
      status: "PASS",
      variant: "pass",
    },
    {
      id: "c6",
      label: "Goods forecast",
      status: "CONSIDERED",
      variant: "info",
    },
  ];

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-xs space-y-2.5">
      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
        <h4 className="text-xs font-mono font-extrabold uppercase text-slate-900 tracking-wider">
          PLANNING CONSTRAINT VERIFICATION
        </h4>
        <span className="text-[10px] font-mono text-slate-500">
          6 Checks Evaluated
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-xs font-mono">
        {CONSTRAINTS.map((c) => (
          <div
            key={c.id}
            className={cn(
              "p-2 rounded-lg border flex flex-col justify-between space-y-1 transition-all",
              c.variant === "conflict"
                ? "bg-red-50 border-red-200 text-red-900"
                : c.variant === "pass"
                ? "bg-slate-50 border-slate-200 text-slate-800"
                : "bg-blue-50/60 border-blue-200 text-blue-900"
            )}
          >
            <span className="text-[10px] text-slate-600 font-sans truncate font-medium">
              {c.label}
            </span>
            <div className="flex items-center justify-between">
              <span
                className={cn(
                  "text-[11px] font-extrabold",
                  c.variant === "conflict"
                    ? "text-red-700"
                    : c.variant === "pass"
                    ? "text-emerald-700"
                    : "text-blue-800"
                )}
              >
                {c.status}
              </span>
              {c.variant === "conflict" ? (
                <AlertCircle className="w-3.5 h-3.5 text-red-600 shrink-0" />
              ) : c.variant === "pass" ? (
                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              ) : (
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
