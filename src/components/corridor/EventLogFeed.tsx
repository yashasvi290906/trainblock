"use client";

import React from "react";
import { Activity, Clock, AlertTriangle, CheckCircle2, Info } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SimEvent {
  time: string;
  text: string;
  type: "info" | "warn" | "error" | "success";
}

interface EventLogFeedProps {
  events: SimEvent[];
}

export function EventLogFeed({ events }: EventLogFeedProps) {
  return (
    <div className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 p-3 sm:p-4 text-xs font-mono select-none space-y-2">
      <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-blue-600 dark:text-sky-400" />
          <span className="font-black uppercase tracking-wider text-slate-900 dark:text-slate-100 text-xs">
            OPERATIONAL CONTROLLER EVENT FEED
          </span>
        </div>
        <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">Live Deterministic Stream</span>
      </div>

      {/* Events List */}
      <div className="space-y-1.5 max-h-28 overflow-y-auto">
        {events.slice(0, 4).map((evt, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between text-xs p-2 rounded-lg bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800"
          >
            <div className="flex items-center gap-2.5">
              <span className="text-slate-500 dark:text-slate-400 font-bold">{evt.time}</span>
              <span
                className={cn(
                  "font-sans font-medium",
                  evt.type === "error"
                    ? "text-red-600 dark:text-red-400 font-bold"
                    : evt.type === "warn"
                    ? "text-amber-700 dark:text-amber-400 font-bold"
                    : evt.type === "success"
                    ? "text-emerald-700 dark:text-emerald-400 font-bold"
                    : "text-slate-800 dark:text-slate-200"
                )}
              >
                {evt.text}
              </span>
            </div>

            <span
              className={cn(
                "w-2 h-2 rounded-full shrink-0",
                evt.type === "error"
                  ? "bg-red-500 shadow-[0_0_8px_#ef4444]"
                  : evt.type === "warn"
                  ? "bg-amber-500 shadow-[0_0_8px_#f59e0b]"
                  : evt.type === "success"
                  ? "bg-emerald-500 shadow-[0_0_8px_#10b981]"
                  : "bg-blue-500 shadow-[0_0_8px_#3b82f6]"
              )}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
