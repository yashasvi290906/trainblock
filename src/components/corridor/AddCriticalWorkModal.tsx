"use client";

import React, { useState } from "react";
import { X, Plus, Wrench, Radio, Zap, AlertTriangle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface AddCriticalWorkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddCriticalWork: (task: {
    id: string;
    dept: string;
    desc: string;
    km: string;
    duration: number;
  }) => void;
}

export function AddCriticalWorkModal({
  isOpen,
  onClose,
  onAddCriticalWork,
}: AddCriticalWorkModalProps) {
  const [department, setDepartment] = useState<string>("Engineering");
  const [assetType, setAssetType] = useState<string>("Track Geometry Rectification");
  const [kmStart, setKmStart] = useState<number>(72.0);
  const [kmEnd, setKmEnd] = useState<number>(76.0);
  const [duration, setDuration] = useState<number>(45);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const prefix = department === "Engineering" ? "ENG" : department === "S&T" ? "SNT" : "TRD";
    const randNum = Math.floor(300 + Math.random() * 500);
    const newId = `${prefix}-${randNum}`;

    onAddCriticalWork({
      id: newId,
      dept: department,
      desc: assetType,
      km: `KM ${kmStart}-${kmEnd}`,
      duration,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-xs p-4 font-sans">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-900 text-white flex items-center justify-center shadow-xs">
              <Plus className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 font-mono">
                ADD CRITICAL MAINTENANCE DEMAND
              </h2>
              <p className="text-xs text-slate-500">
                Insert emergency P1 work order into B-014 block queue
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-3 text-xs font-sans">
          <div>
            <label className="block text-slate-700 font-bold mb-1 font-mono text-[11px]">
              DEPARTMENT *
            </label>
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-semibold text-slate-800 focus:outline-none focus:border-blue-600"
            >
              <option value="Engineering">Engineering (Civil / Track)</option>
              <option value="S&T">S&T (Signals & Telecom)</option>
              <option value="Traction">Traction (TRD / OHE)</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-700 font-bold mb-1 font-mono text-[11px]">
              WORK DESCRIPTION *
            </label>
            <input
              type="text"
              required
              value={assetType}
              onChange={(e) => setAssetType(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-semibold text-slate-900 focus:outline-none focus:border-blue-600"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-bold mb-1 font-mono text-[11px]">
                KM START
              </label>
              <input
                type="number"
                step="0.1"
                min="68"
                max="94"
                value={kmStart}
                onChange={(e) => setKmStart(parseFloat(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-mono text-slate-900 focus:outline-none focus:border-blue-600"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1 font-mono text-[11px]">
                KM END
              </label>
              <input
                type="number"
                step="0.1"
                min="68"
                max="94"
                value={kmEnd}
                onChange={(e) => setKmEnd(parseFloat(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-mono text-slate-900 focus:outline-none focus:border-blue-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-bold mb-1 font-mono text-[11px]">
                ESTIMATED DURATION (MIN)
              </label>
              <input
                type="number"
                min="15"
                max="120"
                step="5"
                value={duration}
                onChange={(e) => setDuration(parseInt(e.target.value) || 45)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-mono text-slate-900 focus:outline-none focus:border-blue-600"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1 font-mono text-[11px]">
                CRITICALITY TIER
              </label>
              <div className="p-2 bg-red-50 text-red-800 border border-red-200 rounded-lg font-mono font-bold text-center">
                P1 · SAFETY CRITICAL
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <Button variant="secondary" size="md" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="primary" size="md" type="submit" icon={<Plus className="w-4 h-4" />}>
              Add & Replan
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
