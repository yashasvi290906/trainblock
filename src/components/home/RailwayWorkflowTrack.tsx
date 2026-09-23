"use client";

import React from "react";
import { TrainTrack, CheckCircle2, ArrowRight, ShieldCheck, Layers, Clock, FileCheck } from "lucide-react";
import { cn } from "@/lib/utils";

const WORKFLOW_NODES = [
  {
    step: "01",
    title: "WORK ORDERS",
    desc: "Ingest maintenance backlog from Engineering, S&T & Traction",
    badge: "DEMAND",
  },
  {
    step: "02",
    title: "PRIORITISE",
    desc: "Rank safety-critical track flaws and high-urgency assets",
    badge: "P1 / P2",
  },
  {
    step: "03",
    title: "COMPOSE",
    desc: "Cluster co-located work into multi-departmental bundles",
    badge: "CO-LOCATION",
  },
  {
    step: "04",
    title: "CHECK TRAINS",
    desc: "Evaluate timetable trajectories & protected passenger headways",
    badge: "TIMETABLE",
  },
  {
    step: "05",
    title: "SAFE WINDOW",
    desc: "Identify conflict-free corridor slot with sufficient usable time",
    badge: "SLOT 02:20",
  },
  {
    step: "06",
    title: "REVIEW",
    desc: "Planner inspects constraints, usable minutes & fallbacks",
    badge: "HUMAN CONTROL",
  },
  {
    step: "07",
    title: "APPROVE",
    desc: "Sanction integrated possession and generate BDMS dossier",
    badge: "SANCTION",
  },
];

export function RailwayWorkflowTrack() {
  return (
    <div className="w-full bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-8">
      {/* Section Header */}
      <div className="max-w-3xl space-y-2">
        <span className="text-xs font-mono uppercase tracking-wider text-blue-900 font-bold bg-blue-50 px-2.5 py-1 rounded border border-blue-200">
          THE RAILBLOCK IDEA
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          One corridor. One plan.
        </h2>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          Instead of dispatching three separate work teams at disjointed hours, RAILBLOCK runs a deterministic planning pipeline that balances asset urgency, corridor geography, and passenger train paths.
        </p>
      </div>

      {/* Railway Track Motif Workflow */}
      <div className="relative pt-4 pb-2">
        {/* Track Line Background (Sleepers & Rails) */}
        <div className="hidden lg:block absolute top-12 inset-x-8 h-4 bg-slate-100 rounded-md border border-slate-300">
          {/* Sleepers */}
          <div
            className="absolute inset-0 opacity-40"
            style={{
              backgroundImage:
                "repeating-linear-gradient(90deg, #64748b, #64748b 4px, transparent 4px, transparent 12px)",
            }}
          />
          {/* Steel Rails */}
          <div className="absolute top-1 inset-x-0 h-0.5 bg-slate-500" />
          <div className="absolute bottom-1 inset-x-0 h-0.5 bg-slate-500" />
        </div>

        {/* 7 Workflow Step Markers */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-4 relative z-10">
          {WORKFLOW_NODES.map((node, idx) => (
            <div
              key={node.step}
              className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-2 hover:border-blue-400 hover:shadow-sm transition-all"
            >
              {/* Step Number & Track Knot */}
              <div className="flex items-center justify-between">
                <div className="w-6 h-6 rounded-full bg-blue-900 text-white font-mono text-xs font-bold flex items-center justify-center shadow-xs">
                  {node.step}
                </div>
                <span className="text-[9px] font-mono font-bold text-blue-900 bg-blue-50 border border-blue-200 px-1.5 py-0.2 rounded">
                  {node.badge}
                </span>
              </div>

              {/* Title & Description */}
              <div>
                <h4 className="text-xs font-extrabold text-slate-900 font-mono tracking-tight">
                  {node.title}
                </h4>
                <p className="text-[11px] text-slate-600 font-sans mt-1 leading-tight">
                  {node.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
