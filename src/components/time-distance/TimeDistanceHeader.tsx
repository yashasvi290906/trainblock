"use client";

import React from "react";
import Link from "next/link";
import {
  Activity,
  ArrowRight,
  Clock,
  Database,
  Layers,
  MapPin,
  Sparkles,
  Calendar,
} from "lucide-react";

interface TimeDistanceHeaderProps {
  conflictCount: number;
  blockId: string;
}

export function TimeDistanceHeader({
  conflictCount,
  blockId,
}: TimeDistanceHeaderProps) {
  return (
    <header className="border-b border-slate-200 dark:border-[#182744] bg-white dark:bg-[#070e1d] px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 select-none transition-colors">
      {/* Left: Title & Subtitle */}
      <div className="space-y-1">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-2.5 py-1 rounded bg-sky-50 dark:bg-sky-950/70 border border-sky-200 dark:border-sky-800/60 text-sky-700 dark:text-sky-300 font-mono text-xs font-bold tracking-wider">
            <Activity className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
            <span>TIME–DISTANCE WORKSTATION</span>
          </div>
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700/60 text-[11px] font-mono text-slate-700 dark:text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse" />
            <span>MAREY ANALYTICAL ENGINE</span>
          </div>
        </div>

        <h1 className="text-xl md:text-2xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
          <span>TIME–DISTANCE</span>
          <span className="text-slate-400 dark:text-slate-500 font-normal text-lg">·</span>
          <span className="text-sky-600 dark:text-sky-400 font-mono text-lg font-bold">POSSESSION ANALYSIS</span>
        </h1>

        <p className="text-xs md:text-sm text-slate-600 dark:text-slate-300 font-medium max-w-2xl leading-relaxed">
          See where train paths and maintenance possessions intersect. Evaluate candidate block windows against passenger services, goods movements, and corridor constraints.
        </p>
      </div>

      {/* Right: Operational Metadata & Navigation */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 self-start md:self-auto">
        {/* Corridor, Date, Dataset Badge */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
          <div className="bg-slate-100 dark:bg-[#0b162c] px-3 py-1.5 rounded-lg border border-slate-200 dark:border-[#1b2f56] flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
            <span className="text-slate-500 dark:text-slate-400">CORRIDOR:</span>
            <span className="text-slate-900 dark:text-white font-bold">SEC → NDL</span>
          </div>

          <div className="bg-slate-100 dark:bg-[#0b162c] px-3 py-1.5 rounded-lg border border-slate-200 dark:border-[#1b2f56] flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
            <span className="text-slate-500 dark:text-slate-400">DATE:</span>
            <span className="text-slate-800 dark:text-slate-200 font-semibold">18 SEP 2026</span>
          </div>

          <div className="bg-amber-50 dark:bg-amber-950/40 px-2.5 py-1.5 rounded-lg border border-amber-200 dark:border-amber-800/40 flex items-center gap-1.5 text-amber-800 dark:text-amber-300">
            <Database className="w-3 h-3 text-amber-600 dark:text-amber-400" />
            <span className="text-[10px] font-bold">SYNTHETIC OPERATIONS DATASET</span>
          </div>
        </div>

        {/* Action Links */}
        <div className="flex items-center gap-2 mt-1 sm:mt-0">
          <Link
            href="/live-corridor"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-[#0e1d3a] dark:hover:bg-[#152a54] border border-slate-300 dark:border-[#213a6e] text-sky-700 dark:text-sky-300 hover:text-sky-900 dark:hover:text-white text-xs font-mono font-semibold transition-all shadow-sm active:scale-95"
          >
            <span>VIEW IN LIVE CORRIDOR</span>
            <ArrowRight className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
          </Link>

          <Link
            href="/plan"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white dark:text-black text-xs font-mono font-bold transition-all shadow-md active:scale-95"
          >
            <span>OPEN BLOCK PLAN</span>
            <ArrowRight className="w-3.5 h-3.5 text-white dark:text-black" />
          </Link>
        </div>
      </div>
    </header>
  );
}
