"use client";

import React from "react";
import { Block } from "@/types/planning";
import { BlockStatusBadge } from "./BlockStatusBadge";
import { DepartmentBadge } from "../maintenance/DepartmentBadge";
import { formatKmRange, formatDuration } from "@/lib/formatting";
import { Clock, MapPin, Wrench, Shield, ArrowRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface BlockCardProps {
  block: Block;
  className?: string;
  isCompact?: boolean;
}

export function BlockCard({ block, className, isCompact = false }: BlockCardProps) {
  return (
    <div
      className={cn(
        "bg-[#0c1527] border border-[#1a2948] rounded-lg p-4 transition-all hover:border-sky-500/50 hover:shadow-[0_0_15px_rgba(56,189,248,0.1)] flex flex-col justify-between group",
        block.isIntegrated && "border-l-4 border-l-amber-500",
        className
      )}
    >
      <div>
        {/* Top bar */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="font-mono text-sm font-bold text-white group-hover:text-sky-400 transition-colors">
              {block.blockId}
            </span>
            {block.isIntegrated && (
              <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                INTEGRATED ({block.departments.length} DEPTS)
              </span>
            )}
          </div>
          <BlockStatusBadge status={block.status} size="sm" />
        </div>

        {/* Section & Time */}
        <div className="flex items-center justify-between text-xs py-1.5 border-b border-[#16233d]">
          <span className="text-slate-300 font-medium flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-sky-400" />
            {block.section} ({formatKmRange(block.kmStart, block.kmEnd)})
          </span>
          <span className="font-mono text-slate-200 font-semibold flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            {block.startTime} – {block.endTime}
          </span>
        </div>

        {/* Department badges */}
        <div className="flex flex-wrap gap-1.5 my-3">
          {block.departments.map((dept) => (
            <DepartmentBadge key={dept} department={dept} size="sm" />
          ))}
        </div>

        {/* Quick specs */}
        {!isCompact && (
          <div className="grid grid-cols-2 gap-2 text-[11px] bg-[#080e1b] p-2 rounded border border-[#14223b] mb-3">
            <div>
              <span className="text-slate-400">Duration:</span>
              <span className="mono-num font-semibold text-slate-200 ml-1">
                {formatDuration(block.durationMinutes)}
              </span>
            </div>
            <div>
              <span className="text-slate-400">Track Utilization:</span>
              <span className="mono-num font-semibold text-emerald-400 ml-1">
                {block.utilization}%
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Footer link */}
      <Link
        href={`/blocks/${block.blockId}`}
        className="text-xs font-semibold text-sky-400 hover:text-sky-300 flex items-center justify-between pt-2 border-t border-[#16233d] transition-colors"
      >
        <span>View Block Dossier</span>
        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
      </Link>
    </div>
  );
}
