"use client";

import React, { useState } from "react";
import { AppShell } from "@/components/shell/AppShell";
import { mockRailwayService } from "@/lib/mock-service";
import { Department, CriticalityTier, ProtectionType, MachineRequirement } from "@/types/maintenance";
import { useRouter } from "next/navigation";
import {
  PlusCircle,
  Wrench,
  Radio,
  Zap,
  MapPin,
  Clock,
  Shield,
  Users,
  Layers,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function AddTaskPage() {
  const router = useRouter();

  const [department, setDepartment] = useState<Department>("Engineering");
  const [assetType, setAssetType] = useState<string>("Rail Joint");
  const [assetId, setAssetId] = useState<string>("RJ-72.4-DN");
  const [title, setTitle] = useState<string>("Rail Joint Fastener Replacement & Ultrasonic Inspection");
  const [kmStart, setKmStart] = useState<number>(72.0);
  const [kmEnd, setKmEnd] = useState<number>(73.5);
  const [direction, setDirection] = useState<"UP" | "DOWN" | "BOTH">("DOWN");
  const [duration, setDuration] = useState<number>(45);
  const [criticality, setCriticality] = useState<CriticalityTier>("Critical");
  const [overdueDays, setOverdueDays] = useState<number>(8);
  const [requiredProtection, setRequiredProtection] = useState<ProtectionType>("Full Block");
  const [oheRequired, setOheRequired] = useState<boolean>(true);
  const [machineRequired, setMachineRequired] = useState<MachineRequirement>("CSM (Continuous Tamping Machine)");
  const [crewRequired, setCrewRequired] = useState<number>(12);
  const [notes, setNotes] = useState<string>("Detected via ultrasonic flaw detector (USFD) trolley run.");

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showSuccessNotice, setShowSuccessNotice] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const added = await mockRailwayService.addTask({
        department,
        assetType,
        assetId,
        title,
        kmStart: Number(kmStart),
        kmEnd: Number(kmEnd),
        direction,
        duration: Number(duration),
        criticality,
        overdueDays: Number(overdueDays),
        requiredProtection,
        oheRequired,
        machineRequired,
        crewRequired: Number(crewRequired),
        status: "Unscheduled",
        notes,
      });

      setShowSuccessNotice(true);
      setTimeout(() => {
        router.push("/work-register");
      }, 1200);
    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
    }
  };

  return (
    <AppShell
      pageTitle="ADD MAINTENANCE WORK ORDER"
      subtitle="Work Order Ingestion & Dynamic Replanning · SEC–NDL Corridor"
    >
      <div className="max-w-4xl mx-auto space-y-5">
        {/* Top Workflow Notice */}
        <div className="bg-[#0c1527] border border-[#1a2948] rounded-lg p-3.5 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-slate-300">
            <span className="w-2 h-2 rounded-full bg-sky-400"></span>
            <span>
              Ingesting maintenance demand from <strong>TMS / SMMS / TDMS</strong> into RAILBLOCK planning register.
            </span>
          </div>
          <span className="text-[10px] font-mono text-amber-400 bg-amber-950/60 border border-amber-700/40 px-2 py-0.5 rounded">
            Dynamic Replanning Active
          </span>
        </div>

        {/* Task Entry Form Card */}
        <div className="bg-[#0c1527] border border-[#1a2948] rounded-lg p-6 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Department Selection */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wide mb-2">
                1. Maintenance Department
              </label>
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setDepartment("Engineering");
                    setAssetType("Track");
                  }}
                  className={cn(
                    "p-3 rounded-lg border text-xs font-medium flex items-center justify-center gap-2 transition-all cursor-pointer",
                    department === "Engineering"
                      ? "bg-amber-950/80 text-amber-300 border-amber-500 ring-1 ring-amber-400"
                      : "bg-[#080f1d] text-slate-400 border-[#16233d] hover:text-slate-200"
                  )}
                >
                  <Wrench className="w-4 h-4 text-amber-400" />
                  <span>Engineering (Track & P-Way)</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setDepartment("S&T");
                    setAssetType("Signal");
                  }}
                  className={cn(
                    "p-3 rounded-lg border text-xs font-medium flex items-center justify-center gap-2 transition-all cursor-pointer",
                    department === "S&T"
                      ? "bg-sky-950/80 text-sky-300 border-sky-500 ring-1 ring-sky-400"
                      : "bg-[#080f1d] text-slate-400 border-[#16233d] hover:text-slate-200"
                  )}
                >
                  <Radio className="w-4 h-4 text-sky-400" />
                  <span>S&T (Signals & Interlocking)</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setDepartment("Traction");
                    setAssetType("OHE");
                  }}
                  className={cn(
                    "p-3 rounded-lg border text-xs font-medium flex items-center justify-center gap-2 transition-all cursor-pointer",
                    department === "Traction"
                      ? "bg-orange-950/80 text-orange-300 border-orange-500 ring-1 ring-orange-400"
                      : "bg-[#080f1d] text-slate-400 border-[#16233d] hover:text-slate-200"
                  )}
                >
                  <Zap className="w-4 h-4 text-orange-400" />
                  <span>Traction (TRD / 25kV OHE)</span>
                </button>
              </div>
            </div>

            {/* Asset Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Asset Type
                </label>
                <input
                  type="text"
                  value={assetType}
                  onChange={(e) => setAssetType(e.target.value)}
                  className="w-full px-3 py-2 bg-[#080f1d] border border-[#162542] rounded text-xs text-slate-200 focus:outline-none focus:border-sky-400"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Asset Identifier (Asset ID)
                </label>
                <input
                  type="text"
                  value={assetId}
                  onChange={(e) => setAssetId(e.target.value)}
                  className="w-full px-3 py-2 bg-[#080f1d] border border-[#162542] rounded text-xs text-slate-200 font-mono focus:outline-none focus:border-sky-400"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Direction / Track Line
                </label>
                <select
                  value={direction}
                  onChange={(e) => setDirection(e.target.value as any)}
                  className="w-full px-3 py-2 bg-[#080f1d] border border-[#162542] rounded text-xs text-slate-200 focus:outline-none focus:border-sky-400 font-mono"
                >
                  <option value="DOWN">DOWN Line (SEC → NDL)</option>
                  <option value="UP">UP Line (NDL → SEC)</option>
                  <option value="BOTH">BOTH Lines (Cross-over / Full Corridor)</option>
                </select>
              </div>
            </div>

            {/* Title / Description */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Work Order Title & Scope
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 bg-[#080f1d] border border-[#162542] rounded text-xs text-slate-200 focus:outline-none focus:border-sky-400"
                required
              />
            </div>

            {/* Spatial KM Range & Timing */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  KM Start (0 – 128)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={kmStart}
                  onChange={(e) => setKmStart(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-[#080f1d] border border-[#162542] rounded text-xs text-slate-200 font-mono focus:outline-none focus:border-sky-400"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  KM End
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={kmEnd}
                  onChange={(e) => setKmEnd(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-[#080f1d] border border-[#162542] rounded text-xs text-slate-200 font-mono focus:outline-none focus:border-sky-400"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Required Work Duration (min)
                </label>
                <input
                  type="number"
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-[#080f1d] border border-[#162542] rounded text-xs text-slate-200 font-mono focus:outline-none focus:border-sky-400"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Overdue Days
                </label>
                <input
                  type="number"
                  value={overdueDays}
                  onChange={(e) => setOverdueDays(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-[#080f1d] border border-[#162542] rounded text-xs text-slate-200 font-mono focus:outline-none focus:border-sky-400"
                  required
                />
              </div>
            </div>

            {/* Criticality & Protection */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Safety Criticality Tier
                </label>
                <select
                  value={criticality}
                  onChange={(e) => setCriticality(e.target.value as CriticalityTier)}
                  className="w-full px-3 py-2 bg-[#080f1d] border border-[#162542] rounded text-xs text-slate-200 focus:outline-none focus:border-sky-400"
                >
                  <option value="Critical">Critical (Immediate P1 tier)</option>
                  <option value="High">High Urgency (P2 tier)</option>
                  <option value="Medium">Medium (P3 tier)</option>
                  <option value="Low">Low / Routine (P4 tier)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Required Protection Type
                </label>
                <select
                  value={requiredProtection}
                  onChange={(e) => setRequiredProtection(e.target.value as ProtectionType)}
                  className="w-full px-3 py-2 bg-[#080f1d] border border-[#162542] rounded text-xs text-slate-200 focus:outline-none focus:border-sky-400"
                >
                  <option value="Full Block">Full Track Block</option>
                  <option value="Power Block">Power Block (OHE Isolation)</option>
                  <option value="Traffic Block">Traffic Block</option>
                  <option value="Caution Order">Caution Order (Speed Restriction)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  OHE Power Isolation Required?
                </label>
                <select
                  value={oheRequired ? "yes" : "no"}
                  onChange={(e) => setOheRequired(e.target.value === "yes")}
                  className="w-full px-3 py-2 bg-[#080f1d] border border-[#162542] rounded text-xs text-slate-200 focus:outline-none focus:border-sky-400"
                >
                  <option value="yes">Yes (Requires Power Block / Earthing)</option>
                  <option value="no">No (Track / Signal work only)</option>
                </select>
              </div>
            </div>

            {/* Resources Needed */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Heavy Track Machinery Needed
                </label>
                <select
                  value={machineRequired}
                  onChange={(e) => setMachineRequired(e.target.value as MachineRequirement)}
                  className="w-full px-3 py-2 bg-[#080f1d] border border-[#162542] rounded text-xs text-slate-200 focus:outline-none focus:border-sky-400"
                >
                  <option value="None">None (Manual Crew Only)</option>
                  <option value="CSM (Continuous Tamping Machine)">CSM (Continuous Tamping Machine)</option>
                  <option value="BCM (Ballast Cleaning Machine)">BCM (Ballast Cleaning Machine)</option>
                  <option value="UNIMAT (Points & Crossing Tamping)">UNIMAT (Points & Crossing Tamping)</option>
                  <option value="Tower Wagon (OHE)">Tower Wagon (OHE Maintenance)</option>
                  <option value="DGS (Dynamic Track Stabilizer)">DGS (Dynamic Track Stabilizer)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Crew Workforce Required (count)
                </label>
                <input
                  type="number"
                  value={crewRequired}
                  onChange={(e) => setCrewRequired(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-[#080f1d] border border-[#162542] rounded text-xs text-slate-200 font-mono focus:outline-none focus:border-sky-400"
                  required
                />
              </div>
            </div>

            {/* Submit Action */}
            <div className="pt-4 border-t border-[#182643] flex items-center justify-between">
              <Link
                href="/work-register"
                className="px-4 py-2 rounded bg-[#132039] hover:bg-[#1a2b4d] text-slate-300 text-xs font-medium"
              >
                Cancel
              </Link>

              <button
                type="submit"
                disabled={isSubmitting}
                className="py-2 px-5 rounded bg-sky-600 hover:bg-sky-500 disabled:bg-slate-700 text-white font-semibold text-xs transition-colors flex items-center gap-2 shadow-lg shadow-sky-950 cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span>{isSubmitting ? "Ingesting Work Order..." : "Add to Work Register"}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Success Notice Modal */}
        {showSuccessNotice && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center z-50 p-4">
            <div className="bg-[#0d1629] border border-emerald-500/60 rounded-xl p-6 max-w-sm w-full shadow-2xl text-center space-y-3 animate-fadeIn">
              <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-white">Maintenance Task Ingested</h3>
              <p className="text-xs text-slate-400">
                Task assigned priority <strong>P1 · SAFETY CRITICAL</strong>. Recalculating candidate corridor consolidation cluster...
              </p>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
