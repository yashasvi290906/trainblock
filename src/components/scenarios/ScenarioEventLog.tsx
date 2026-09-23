"use client";

import React from "react";
import { ScenarioAuditItem } from "./types";
import { Terminal, Shield, Clock, CheckCircle2, AlertTriangle, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ScenarioEventLogProps {
  events: ScenarioAuditItem[];
}

export function ScenarioEventLog({ events }: ScenarioEventLogProps) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3 font-mono shadow-sm">
      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-blue-400" />
          <h4 className="text-xs font-bold text-white uppercase tracking-wider">
            SCENARIO EVENT AUDIT TRAIL
          </h4>
        </div>
        <span className="text-[10px] text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
          {events.length} Events Logged
        </span>
      </div>

      <div className="space-y-1.5 max-h-44 overflow-y-auto pr-1">
        {events.map((evt, idx) => (
          <div
            key={`${evt.id || "evt"}-${idx}`}
            className="p-2 rounded bg-slate-950/70 border border-slate-800/80 flex items-start gap-2.5 text-xs text-slate-300 transition-colors hover:border-slate-700"
          >
            <span className="text-[10px] font-bold text-blue-400 whitespace-nowrap pt-0.5">
              {evt.timeStr}
            </span>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    "text-[9px] px-1.5 py-0.2 rounded font-bold uppercase",
                    evt.category === "ALERT"
                      ? "bg-rose-950 text-rose-300 border border-rose-800/50"
                      : evt.category === "OPERATING"
                      ? "bg-amber-950 text-amber-300 border border-amber-800/50"
                      : evt.category === "DECISION"
                      ? "bg-emerald-950 text-emerald-300 border border-emerald-800/50"
                      : "bg-slate-800 text-slate-300 border border-slate-700"
                  )}
                >
                  {evt.category}
                </span>
                <span className="font-bold text-white text-[11px] truncate">
                  {evt.event}
                </span>
              </div>
              {evt.details && (
                <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-2">
                  {evt.details}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
