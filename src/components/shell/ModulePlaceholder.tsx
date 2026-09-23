import React from "react";
import { AppShell } from "./AppShell";
import { Construction, Sparkles, TrainTrack, Layers, ArrowRight } from "lucide-react";
import Link from "next/link";

interface ModulePlaceholderProps {
  title: string;
  moduleName: string;
  description: string;
  workflowStep: "INGEST" | "PRIORITISE" | "COMPOSE" | "PLAN" | "DECIDE" | "SYSTEM";
  plannedCapabilities: string[];
}

export function ModulePlaceholder({
  title,
  moduleName,
  description,
  workflowStep,
  plannedCapabilities,
}: ModulePlaceholderProps) {
  const stepColors: Record<string, string> = {
    INGEST: "text-sky-400 bg-sky-950/60 border-sky-700/50",
    PRIORITISE: "text-amber-400 bg-amber-950/60 border-amber-700/50",
    COMPOSE: "text-purple-400 bg-purple-950/60 border-purple-700/50",
    PLAN: "text-emerald-400 bg-emerald-950/60 border-emerald-700/50",
    DECIDE: "text-rose-400 bg-rose-950/60 border-rose-700/50",
    SYSTEM: "text-slate-300 bg-slate-800/60 border-slate-600/50",
  };

  return (
    <AppShell pageTitle={title} subtitle="Secunderabad Division (SC) · SEC–NDL Corridor">
      <div className="max-w-4xl mx-auto my-8 bg-[#0c1527] border border-[#1a2948] rounded-lg p-8 shadow-xl">
        <div className="flex items-start justify-between pb-4 border-b border-[#182643]">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border uppercase ${stepColors[workflowStep]}`}>
                Phase: {workflowStep}
              </span>
              <span className="text-xs font-mono text-slate-400">
                Corridor: SEC – NDL (128 km)
              </span>
            </div>
            <h2 className="text-lg font-bold text-white">{moduleName}</h2>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">{description}</p>
          </div>
          <div className="p-3 bg-sky-950/40 border border-sky-800/40 rounded text-sky-400">
            <TrainTrack className="w-6 h-6" />
          </div>
        </div>

        {/* Planned Capabilities */}
        <div className="my-6 space-y-3">
          <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
            Operational Architecture & Workflow Role
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {plannedCapabilities.map((cap, i) => (
              <div
                key={i}
                className="p-3 rounded bg-[#080f1d] border border-[#15233c] text-xs flex items-start gap-2.5"
              >
                <span className="w-5 h-5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/30 flex items-center justify-center font-mono text-[10px] shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <span className="text-slate-300 leading-relaxed">{cap}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Navigation Footer */}
        <div className="pt-4 border-t border-[#182643] flex items-center justify-between">
          <span className="text-[11px] font-mono text-amber-400/90 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
            Shell Registered · Foundation Active
          </span>
          <div className="flex items-center gap-2">
            <Link
              href="/control"
              className="py-1.5 px-3 rounded bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs transition-colors flex items-center gap-1.5"
            >
              <span>Back to Control Room</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
