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
    <div className="bg-slate-900 border-t border-slate-800 p-3 sm:p-4 text-xs font-mono select-none space-y-2">
      <div className="flex items-center justify-between pb-1.5 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Activity className="w-3.5 h-3.5 text-sky-400" />
          <span className="font-extrabold uppercase tracking-wider text-slate-300 text-[11px]">
            OPERATIONAL CONTROLLER EVENT FEED
          </span>
        </div>
        <span className="text-[10px] text-slate-500">Live Deterministic Stream</span>
      </div>

      {/* Events List */}
      <div className="space-y-1.5 max-h-24 overflow-y-auto">
        {events.slice(0, 4).map((evt, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between text-[11px] p-1.5 rounded bg-slate-950/80 border border-slate-800/80"
          >
            <div className="flex items-center gap-2">
              <span className="text-slate-500 font-bold">{evt.time}</span>
              <span
                className={cn(
                  "font-sans",
                  evt.type === "error"
                    ? "text-red-400 font-semibold"
                    : evt.type === "warn"
                    ? "text-amber-400 font-medium"
                    : evt.type === "success"
                    ? "text-emerald-400 font-medium"
                    : "text-slate-300"
                )}
              >
                {evt.text}
              </span>
            </div>

            <span
              className={cn(
                "w-1.5 h-1.5 rounded-full shrink-0",
                evt.type === "error"
                  ? "bg-red-500"
                  : evt.type === "warn"
                  ? "bg-amber-500"
                  : evt.type === "success"
                  ? "bg-emerald-500"
                  : "bg-sky-500"
              )}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
