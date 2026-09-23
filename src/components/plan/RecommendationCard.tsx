"use client";

import React from "react";
import Link from "next/link";
import {
  Shield,
  Layers,
  Clock,
  MapPin,
  TrainTrack,
  CheckCircle2,
  ArrowRight,
  ExternalLink,
  Zap,
  Wrench,
  Radio,
  FileCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

interface RecommendationCardProps {
  blockId?: string;
  kmStart?: number;
  kmEnd?: number;
  sectionName?: string;
  startTime?: string;
  endTime?: string;
  durationMinutes?: number;
  usableMinutes?: number;
  utilizationPercent?: number;
  taskCount?: number;
  departments?: string[];
  protectedTrainsCount?: number;
  onReviewClick?: () => void;
  onAdjustClick?: () => void;
  hasConflict?: boolean;
}

export function RecommendationCard({
  blockId = "B-014",
  kmStart = 68,
  kmEnd = 94,
  sectionName = "WL – NDKD",
  startTime = "02:20",
  endTime = "04:10",
  durationMinutes = 110,
  usableMinutes = 90,
  utilizationPercent = 82,
  taskCount = 7,
  departments = ["Engineering", "S&T", "Traction"],
  protectedTrainsCount = 4,
  onReviewClick,
  onAdjustClick,
  hasConflict = false,
}: RecommendationCardProps) {
  return (
    <div
      className={cn(
        "bg-white rounded-xl border p-5 sm:p-6 shadow-sm transition-all relative overflow-hidden",
        hasConflict
          ? "border-red-300 ring-2 ring-red-100"
          : "border-blue-200 ring-1 ring-blue-100/80"
      )}
    >
      {/* Visual Accent Top Bar */}
      <div
        className={cn(
          "absolute top-0 left-0 right-0 h-1.5",
          hasConflict
            ? "bg-red-500"
            : "bg-linear-to-r from-blue-900 via-blue-700 to-amber-500"
        )}
      />

      {/* Header Tag Row */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded bg-blue-50 text-blue-900 border border-blue-200 text-xs font-mono font-extrabold tracking-wider uppercase flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-blue-700" />
            <span>INTEGRATED BLOCK RECOMMENDATION</span>
          </span>
          <span className="text-[11px] font-mono text-slate-500">
            SEC–NDL Corridor · Double Line
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {hasConflict ? (
            <span className="px-2.5 py-0.5 rounded-full bg-red-100 text-red-800 border border-red-200 text-xs font-mono font-bold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              TIMETABLE CONFLICT
            </span>
          ) : (
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-mono font-bold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              FEASIBLE & CONFLICT-FREE
            </span>
          )}
        </div>
      </div>

      {/* Main Core Recommendation Presentation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left 7 Cols: Dominant Block Identity & Location */}
        <div className="lg:col-span-7 space-y-4">
          <div className="space-y-1">
            <div className="flex flex-wrap items-baseline gap-3">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-mono tracking-tight">
                {blockId}
              </h2>
              <span className="text-base sm:text-lg font-bold text-slate-700 font-mono">
                KM {kmStart}–{kmEnd}
              </span>
              <span className="text-xs text-slate-500 font-mono bg-slate-100 px-2 py-0.5 rounded border border-slate-200 font-medium">
                {sectionName}
              </span>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 text-white font-mono text-sm sm:text-base font-bold shadow-xs">
                <Clock className="w-4 h-4 text-amber-400" />
                <span>{startTime} – {endTime}</span>
                <span className="text-slate-400 text-xs font-normal">({durationMinutes} min)</span>
              </div>
            </div>
          </div>

          {/* Department Co-location Pills */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-xs font-bold text-slate-500 font-mono uppercase">
              Combined Departments:
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-50 text-amber-900 border border-amber-200 font-medium font-mono text-[11px]">
              <Wrench className="w-3 h-3 text-amber-700" />
              <span>Engineering</span>
            </span>
            <span className="text-slate-300 font-bold">+</span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-sky-50 text-sky-900 border border-sky-200 font-medium font-mono text-[11px]">
              <Radio className="w-3 h-3 text-sky-700" />
              <span>S&T</span>
            </span>
            <span className="text-slate-300 font-bold">+</span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-purple-50 text-purple-900 border border-purple-200 font-medium font-mono text-[11px]">
              <Zap className="w-3 h-3 text-purple-700" />
              <span>Traction</span>
            </span>
          </div>

          {/* Primary Explainability Note */}
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-700 leading-relaxed">
            <strong className="text-slate-900 font-semibold">Operational Reasoning: </strong>
            Three departmental maintenance requests co-located in the KM 68–94 sub-sector are consolidated into one coordinated possession, eliminating duplicate track occupations while protecting all passenger train paths.
          </div>
        </div>

        {/* Right 5 Cols: Core Metrics & Actions */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-4 lg:border-l lg:border-slate-200 lg:pl-6">
          {/* Key Metric Indicators */}
          <div className="grid grid-cols-3 gap-2.5 text-center">
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
              <div className="text-2xl font-extrabold text-slate-900 font-mono">{taskCount}</div>
              <div className="text-[10px] uppercase font-bold text-slate-500 font-mono mt-0.5">
                Tasks Integrated
              </div>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
              <div className="text-2xl font-extrabold text-emerald-700 font-mono">{usableMinutes}m</div>
              <div className="text-[10px] uppercase font-bold text-slate-500 font-mono mt-0.5">
                Usable Work ({utilizationPercent}%)
              </div>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
              <div className="text-2xl font-extrabold text-blue-900 font-mono">{protectedTrainsCount}</div>
              <div className="text-[10px] uppercase font-bold text-slate-500 font-mono mt-0.5">
                Trains Protected
              </div>
            </div>
          </div>

          {/* Action Button Row */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 pt-1">
            <Button
              variant="primary"
              size="md"
              onClick={onReviewClick}
              className="flex-1"
              icon={<CheckCircle2 className="w-4 h-4" />}
            >
              Review Recommendation
            </Button>

            <Link
              href="/time-distance"
              className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 text-xs font-semibold shadow-2xs transition-colors"
            >
              <TrainTrack className="w-3.5 h-3.5 text-slate-600" />
              <span>See Timetable</span>
              <ExternalLink className="w-3 h-3 text-slate-400 ml-0.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
