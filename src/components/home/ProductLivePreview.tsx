"use client";

import React from "react";
import Link from "next/link";
import { Layers, ArrowRight, ShieldCheck, Clock, MapPin, Wrench, Radio, Zap, CheckCircle2 } from "lucide-react";
import { RecommendationCard } from "@/components/plan/RecommendationCard";

export function ProductLivePreview() {
  return (
    <div className="w-full bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="max-w-2xl space-y-1.5">
          <span className="text-xs font-mono uppercase tracking-wider text-blue-900 font-bold bg-blue-50 px-2.5 py-1 rounded border border-blue-200">
            SYSTEM PREVIEW
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Integrated 24-Hour Corridor Planning Workstation.
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            Directly inspect the active integrated possession recommendation for the Secunderabad Division, with live timetable conflict recalculation and human planner approval controls.
          </p>
        </div>

        <Link
          href="/plan"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-900 hover:bg-blue-800 text-white text-xs font-semibold shadow-sm hover:shadow transition-all"
        >
          <span>Open Full Plan Workspace</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Embedded Live Recommendation Card Preview */}
      <div className="pt-2">
        <RecommendationCard
          blockId="B-014"
          kmStart={68}
          kmEnd={94}
          sectionName="WL – NDKD"
          startTime="02:20"
          endTime="04:10"
          durationMinutes={110}
          usableMinutes={90}
          utilizationPercent={82}
          taskCount={7}
          departments={["Engineering", "S&T", "Traction"]}
          protectedTrainsCount={4}
          hasConflict={false}
        />
      </div>
    </div>
  );
}
