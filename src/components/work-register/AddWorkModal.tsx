"use client";

import React, { useState } from "react";
import { X, Plus, Wrench, Radio, Zap, Shield, Clock, MapPin, AlertTriangle } from "lucide-react";
import { MaintenanceTask, Department, CriticalityTier, ProtectionType, MachineRequirement } from "@/types/maintenance";
import { Button } from "@/components/ui/Button";

interface AddWorkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTask: (task: MaintenanceTask) => void;
}

export function AddWorkModal({ isOpen, onClose, onAddTask }: AddWorkModalProps) {
  const [department, setDepartment] = useState<Department>("Engineering");
  const [assetType, setAssetType] = useState<string>("Track");
  const [title, setTitle] = useState<string>("");
  const [assetId, setAssetId] = useState<string>("");
  const [kmStart, setKmStart] = useState<number>(72.0);
  const [kmEnd, setKmEnd] = useState<number>(74.5);
  const [direction, setDirection] = useState<"UP" | "DOWN" | "BOTH">("DOWN");
  const [duration, setDuration] = useState<number>(60);
  const [criticality, setCriticality] = useState<CriticalityTier>("High");
  const [overdueDays, setOverdueDays] = useState<number>(0);
  const [requiredProtection, setRequiredProtection] = useState<ProtectionType>("Full Block");
  const [oheRequired, setOheRequired] = useState<boolean>(false);
  const [machineRequired, setMachineRequired] = useState<MachineRequirement>("None");
  const [crewRequired, setCrewRequired] = useState<number>(10);
  const [availabilityImpact, setAvailabilityImpact] = useState<"High" | "Medium" | "Low">("High");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const prefix = department === "Engineering" ? "ENG" : department === "S&T" ? "ST" : "TR";
    const randId = Math.floor(200 + Math.random() * 800);
    const newTaskId = `${prefix}-${randId}`;

    const newTask: MaintenanceTask = {
      taskId: newTaskId,
      department,
      assetType,
      assetId: assetId || `${assetType.substring(0, 3).toUpperCase()}-${kmStart.toFixed(1)}-${direction}`,
      title: title || `${assetType} Urgent Maintenance & Track Inspection`,
      kmStart: Number(kmStart),
      kmEnd: Number(kmEnd),
      direction,
      duration: Number(duration),
      criticality,
      overdueDays: Number(overdueDays),
      requiredProtection,
      oheRequired: oheRequired || department === "Traction",
      machineRequired,
      crewRequired: Number(crewRequired),
      status: "Unscheduled",
      priorityScore: criticality === "Critical" ? 95 : criticality === "High" ? 82 : 60,
      mlRank: 2,
      reasonCodes: {
        assetCriticality: criticality === "Critical" || criticality === "High" ? "High" : "Medium",
        overdueDays: Number(overdueDays),
        availabilityImpact,
        operationalConsequence: criticality === "Critical" ? "High" : "Medium",
      },
      recommendedWindow: "02:20 - 04:10",
      notes: "Newly registered maintenance order entering integrated corridor planning queue.",
    };

    onAddTask(newTask);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 font-sans">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-xl w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-900 text-white flex items-center justify-center shadow-xs">
              <Plus className="w-4 h-4 text-blue-200" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 font-mono">
                ADD MAINTENANCE DEMAND ORDER
              </h2>
              <p className="text-xs text-slate-500">
                Register departmental maintenance demand for block planning queue
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body - Scrollable */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 text-xs font-sans">
          {/* Row 1: Department & Asset Type */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-bold mb-1 font-mono text-[11px]">
                DEPARTMENT *
              </label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value as Department)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-semibold text-slate-800 focus:outline-none focus:border-blue-600"
              >
                <option value="Engineering">Engineering (Civil / Track)</option>
                <option value="S&T">S&T (Signals & Telecom)</option>
                <option value="Traction">Traction (TRD / OHE)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1 font-mono text-[11px]">
                ASSET TYPE *
              </label>
              <select
                value={assetType}
                onChange={(e) => setAssetType(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-semibold text-slate-800 focus:outline-none focus:border-blue-600"
              >
                <option value="Track">Track Geometry / Relining</option>
                <option value="Rail Joint">Rail Joint / Fasteners</option>
                <option value="Signal">Multi-Aspect Signal Head</option>
                <option value="Track Circuit">Track Circuit / AFTC</option>
                <option value="Points">Points & Crossing Machine</option>
                <option value="OHE">OHE Cantilever / Contact Wire</option>
                <option value="Isolator">Section Isolator Switch</option>
                <option value="Sleeper">PSC Sleeper</option>
                <option value="Ballast">Ballast Cushion</option>
              </select>
            </div>
          </div>

          {/* Row 2: Title / Description */}
          <div>
            <label className="block text-slate-700 font-bold mb-1 font-mono text-[11px]">
              WORK ORDER TITLE / DESCRIPTION *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Plain Track Tamping & Alignment Rectification"
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 font-sans"
            />
          </div>

          {/* Row 3: Location (KM Start, KM End, Direction) */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-700 font-bold mb-1 font-mono text-[11px]">
                KM START *
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="128"
                required
                value={kmStart}
                onChange={(e) => setKmStart(parseFloat(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-mono text-slate-900 focus:outline-none focus:border-blue-600"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1 font-mono text-[11px]">
                KM END *
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="128"
                required
                value={kmEnd}
                onChange={(e) => setKmEnd(parseFloat(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-mono text-slate-900 focus:outline-none focus:border-blue-600"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1 font-mono text-[11px]">
                DIRECTION
              </label>
              <select
                value={direction}
                onChange={(e) => setDirection(e.target.value as "UP" | "DOWN" | "BOTH")}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-mono text-slate-800 focus:outline-none focus:border-blue-600"
              >
                <option value="DOWN">DOWN Line (SEC→NDL)</option>
                <option value="UP">UP Line (NDL→SEC)</option>
                <option value="BOTH">Both Lines</option>
              </select>
            </div>
          </div>

          {/* Row 4: Criticality, Overdue Days, Duration */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-700 font-bold mb-1 font-mono text-[11px]">
                CRITICALITY *
              </label>
              <select
                value={criticality}
                onChange={(e) => setCriticality(e.target.value as CriticalityTier)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-semibold text-slate-800 focus:outline-none focus:border-blue-600"
              >
                <option value="Critical">P1 · Critical</option>
                <option value="High">P2 · High</option>
                <option value="Medium">P3 · Medium</option>
                <option value="Low">P4 · Low</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1 font-mono text-[11px]">
                OVERDUE (DAYS)
              </label>
              <input
                type="number"
                min="0"
                value={overdueDays}
                onChange={(e) => setOverdueDays(parseInt(e.target.value) || 0)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-mono text-slate-900 focus:outline-none focus:border-blue-600"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1 font-mono text-[11px]">
                DURATION (MIN) *
              </label>
              <input
                type="number"
                min="15"
                max="240"
                step="5"
                required
                value={duration}
                onChange={(e) => setDuration(parseInt(e.target.value) || 60)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-mono text-slate-900 focus:outline-none focus:border-blue-600"
              />
            </div>
          </div>

          {/* Row 5: Protection & Impact */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-bold mb-1 font-mono text-[11px]">
                REQUIRED PROTECTION *
              </label>
              <select
                value={requiredProtection}
                onChange={(e) => setRequiredProtection(e.target.value as ProtectionType)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-mono text-slate-800 focus:outline-none focus:border-blue-600"
              >
                <option value="Full Block">Full Track Block</option>
                <option value="Power Block">Power Block (OHE)</option>
                <option value="Traffic Block">Traffic Block</option>
                <option value="Caution Order">Caution Order</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1 font-mono text-[11px]">
                ASSET AVAILABILITY IMPACT
              </label>
              <select
                value={availabilityImpact}
                onChange={(e) => setAvailabilityImpact(e.target.value as "High" | "Medium" | "Low")}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-semibold text-slate-800 focus:outline-none focus:border-blue-600"
              >
                <option value="High">High Impact (Speed restriction risk)</option>
                <option value="Medium">Medium Impact (Standard cycle)</option>
                <option value="Low">Low Impact (Routine)</option>
              </select>
            </div>
          </div>

          {/* Modal Actions */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
            <Button variant="secondary" size="md" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="primary" size="md" type="submit" icon={<Plus className="w-4 h-4" />}>
              Add to Work Register
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
