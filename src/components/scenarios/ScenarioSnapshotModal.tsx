"use client";

import React, { useState } from "react";
import { ScenarioSnapshot } from "./types";
import { X, Bookmark, Check, Trash2, ArrowRight, GitCompare, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

interface ScenarioSnapshotModalProps {
  isOpen: boolean;
  onClose: () => void;
  snapshots: ScenarioSnapshot[];
  onApplySnapshot: (snap: ScenarioSnapshot) => void;
  onDeleteSnapshot: (id: string) => void;
}

export function ScenarioSnapshotModal({
  isOpen,
  onClose,
  snapshots,
  onApplySnapshot,
  onDeleteSnapshot,
}: ScenarioSnapshotModalProps) {
  const [selectedSnapId, setSelectedSnapId] = useState<string | null>(
    snapshots.length > 0 ? snapshots[0].id : null
  );

  if (!isOpen) return null;

  const selectedSnap = snapshots.find((s) => s.id === selectedSnapId) || snapshots[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs font-mono">
      <div className="bg-slate-900 border border-slate-700 rounded-xl max-w-3xl w-full max-h-[85vh] flex flex-col overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GitCompare className="w-5 h-5 text-blue-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              SCENARIO SNAPSHOT ARCHIVE & COMPARISON
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body (List on left, Preview on right) */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Snapshot List */}
          <div className="w-full md:w-80 border-r border-slate-800 p-3 space-y-2 overflow-y-auto bg-slate-950/60">
            <div className="text-[10px] text-slate-400 uppercase tracking-wider font-bold mb-2">
              Saved Snapshots ({snapshots.length})
            </div>

            {snapshots.length === 0 ? (
              <div className="text-center py-8 text-slate-500 text-xs">
                No snapshots saved yet. Click "SAVE SNAPSHOT" in the scenario lab.
              </div>
            ) : (
              snapshots.map((snap) => {
                const isSelected = selectedSnap?.id === snap.id;
                return (
                  <div
                    key={snap.id}
                    onClick={() => setSelectedSnapId(snap.id)}
                    className={cn(
                      "p-2.5 rounded-lg border text-xs cursor-pointer transition-all space-y-1 relative group",
                      isSelected
                        ? "bg-blue-950/80 border-blue-400 text-white"
                        : "bg-slate-900/80 border-slate-800 hover:border-slate-700 text-slate-300"
                    )}
                  >
                    <div className="flex items-center justify-between text-[11px] font-bold">
                      <span className="text-blue-300">{snap.id}</span>
                      <span className="text-[10px] text-slate-400">{snap.timestamp}</span>
                    </div>

                    <div className="font-semibold text-xs truncate">{snap.label}</div>
                    <div className="text-[10px] text-slate-400 flex justify-between">
                      <span>Window: {snap.windowStr}</span>
                      <span className="text-emerald-400 font-bold">{snap.workOrders} orders</span>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteSnapshot(snap.id);
                      }}
                      className="absolute top-2 right-2 p-1 rounded hover:bg-rose-900/50 text-slate-500 hover:text-rose-300 opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Delete snapshot"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })
            )}
          </div>

          {/* Snapshot Inspector / Detail */}
          <div className="flex-1 p-4 bg-slate-900 overflow-y-auto space-y-4">
            {selectedSnap ? (
              <div className="space-y-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800/50 text-xs font-bold">
                      {selectedSnap.id}
                    </span>
                    <h4 className="text-sm font-bold text-white">{selectedSnap.label}</h4>
                  </div>
                  <p className="text-xs text-slate-300 font-sans">
                    {selectedSnap.conditionDescription}
                  </p>
                </div>

                {/* Metrics Table */}
                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-800">
                    <span className="text-slate-400">Tested Condition:</span>
                    <span className="text-white font-bold">{selectedSnap.condition}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800">
                    <span className="text-slate-400">Possession Window:</span>
                    <span className="text-blue-400 font-bold">{selectedSnap.windowStr}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800">
                    <span className="text-slate-400">Duration & Usable Time:</span>
                    <span className="text-white">
                      {selectedSnap.durationMin}m total ({selectedSnap.usableMin}m usable)
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800">
                    <span className="text-slate-400">Work Orders Accommodated:</span>
                    <span className="text-emerald-400 font-bold">{selectedSnap.workOrders} orders ({selectedSnap.p1Count} P1)</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-400">Passenger Conflicts:</span>
                    <span className={selectedSnap.passengerConflicts === 0 ? "text-emerald-400 font-bold" : "text-amber-400 font-bold"}>
                      {selectedSnap.passengerConflicts} (Protected)
                    </span>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => {
                      onApplySnapshot(selectedSnap);
                      onClose();
                    }}
                    className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-500 text-white font-mono font-bold text-xs rounded-lg flex items-center justify-center gap-2 shadow-sm transition-all"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>LOAD SNAPSHOT INTO WORKSPACE</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-slate-500 text-xs">
                Select a snapshot to view comparison details.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
