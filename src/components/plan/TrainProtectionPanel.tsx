"use client";

import React from "react";
import { ShieldCheck, TrainTrack, AlertTriangle, Clock, ArrowRight, Shield } from "lucide-react";
import { Train } from "@/types/railway";
import { cn } from "@/lib/utils";

interface TrainProtectionPanelProps {
  trains: Train[];
  hasConflict?: boolean;
  conflictingTrainId?: string;
  selectedTrainId?: string | null;
  onSelectTrain?: (trainId: string | null) => void;
}

export function TrainProtectionPanel({
  trains,
  hasConflict = false,
  conflictingTrainId,
  selectedTrainId,
  onSelectTrain,
}: TrainProtectionPanelProps) {
  // Key passenger trains on corridor
  const passengerTrains = trains.filter((t) => !t.isForecast).slice(0, 4);
  const freightTrain = trains.find((t) => t.isForecast);

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 p-4 sm:p-5 shadow-xs space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-900 flex items-center justify-center font-bold">
            <Shield className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-mono font-extrabold uppercase text-slate-900 tracking-wider">
              TRAIN IMPACT & PROTECTION
            </h3>
            <p className="text-[11px] text-slate-500 font-medium">
              Corridor movement clearance verification
            </p>
          </div>
        </div>

        <span className="text-[11px] font-mono font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>4 Protected</span>
        </span>
      </div>

      {/* Passenger Services List */}
      <div className="space-y-2 font-mono text-xs">
        {passengerTrains.map((train) => {
          const isConflicting = hasConflict && (conflictingTrainId === train.id || train.serviceNumber === "12723");
          const isSelected = selectedTrainId === train.id;

          return (
            <div
              key={train.id}
              onClick={() => onSelectTrain && onSelectTrain(train.id)}
              className={cn(
                "p-2.5 rounded-lg border transition-all cursor-pointer flex items-center justify-between",
                isConflicting
                  ? "bg-red-50 border-red-300 text-red-900 shadow-2xs"
                  : isSelected
                  ? "bg-blue-50/80 border-blue-400 shadow-2xs"
                  : "bg-slate-50/70 border-slate-200 hover:bg-slate-100/70"
              )}
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: isConflicting ? "#ef4444" : train.color || "#0284c7" }}
                />
                <div>
                  <div className="font-extrabold text-slate-900 flex items-center gap-1.5">
                    <span>{train.serviceNumber}</span>
                    <span className="font-sans font-medium text-slate-600 text-[11px]">
                      {train.name.replace("Express", "").trim()}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-500 font-normal">
                    {train.origin} → {train.destination} · Scheduled {train.scheduledTime}
                  </div>
                </div>
              </div>

              <div>
                {isConflicting ? (
                  <span className="px-2 py-0.5 rounded bg-red-100 text-red-800 border border-red-200 text-[10px] font-bold">
                    CONFLICT
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold">
                    PROTECTED
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Freight Forecast Section */}
      {freightTrain && (
        <div className="pt-2 border-t border-slate-100">
          <div className="text-[10px] font-mono text-slate-400 uppercase font-bold mb-1.5">
            Goods Movement Forecast:
          </div>
          <div className="p-2.5 rounded-lg bg-slate-50 border border-dashed border-slate-300 flex items-center justify-between font-mono text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <div>
                <div className="font-bold text-slate-800">{freightTrain.serviceNumber} Container Freight</div>
                <div className="text-[10px] text-slate-500 font-normal">
                  Trailing slot at 04:30 · Margin verified
                </div>
              </div>
            </div>
            <span className="text-[10px] text-slate-600 font-semibold px-2 py-0.5 rounded bg-white border border-slate-200">
              CONSIDERED
            </span>
          </div>
        </div>
      )}

      {/* Synthetic Scenario Tag */}
      <div className="text-[10px] font-mono text-slate-600 text-right">
        Synthetic operational scenario · SEC–NDL
      </div>
    </div>
  );
}
