"use client";

import React, { useState } from "react";
import { railwayEngine } from "@/lib/engine";
import { Database, X, Shield, FileText, CheckCircle2, Layers, Train, Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface InputSourcesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function InputSourcesModal({ isOpen, onClose }: InputSourcesModalProps) {
  const [activeTab, setActiveTab] = useState<"TMS" | "SMMS" | "TDMS" | "COA" | "GOODS" | "CORRIDORS">("TMS");

  if (!isOpen) return null;

  const rawSources = railwayEngine.getRawInputSources();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs font-mono">
      <div className="bg-slate-900 border border-slate-700 rounded-xl max-w-4xl w-full max-h-[88vh] flex flex-col overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Database className="w-5 h-5 text-blue-400" />
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                CANONICAL INPUT SOURCES (SIH PROBLEM STATEMENT 26027)
              </h3>
              <p className="text-[11px] text-slate-400 font-sans">
                Unified ingestion pipeline across 6 enterprise railway datasets
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Synthetic Prototype Data Banner */}
        <div className="bg-blue-950/40 border-b border-blue-800/40 px-4 py-2 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-blue-300">
            <Info className="w-4 h-4 text-blue-400 flex-shrink-0" />
            <span>
              <strong className="text-white">SYNTHETIC PROTOTYPE DATA:</strong> {rawSources.summary.totalMaintenanceDemands} Total Maintenance Demands · {rawSources.summary.corridorCoverage}
            </span>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded bg-blue-900/60 border border-blue-700/50 text-blue-200 font-bold">
            SCR SEC–NDL BENCHMARK
          </span>
        </div>

        {/* Source Selector Tabs */}
        <div className="flex items-center gap-1.5 p-2 bg-slate-950 border-b border-slate-800 overflow-x-auto">
          {[
            { id: "TMS", label: "TMS (Track)", count: rawSources.summary.tmsCount, color: "text-amber-400" },
            { id: "SMMS", label: "SMMS (Signal)", count: rawSources.summary.smmsCount, color: "text-sky-400" },
            { id: "TDMS", label: "TDMS (Traction)", count: rawSources.summary.tdmsCount, color: "text-orange-400" },
            { id: "COA", label: "COA (Timetable)", count: rawSources.summary.coaTrainCount, color: "text-purple-400" },
            { id: "GOODS", label: "Goods Forecast", count: rawSources.summary.goodsCount, color: "text-emerald-400" },
            { id: "CORRIDORS", label: "Block Corridors", count: rawSources.summary.corridorsCount, color: "text-blue-400" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "px-3 py-1.5 rounded-md text-xs font-mono font-medium transition-all whitespace-nowrap flex items-center gap-1.5",
                activeTab === tab.id
                  ? "bg-blue-600 text-white shadow-xs"
                  : "bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-850 border border-slate-800"
              )}
            >
              <span>{tab.label}</span>
              <span className="px-1.5 py-0.2 rounded bg-black/40 text-[10px] font-bold">
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Content Viewer */}
        <div className="flex-1 p-4 overflow-y-auto bg-slate-900 text-xs">
          {activeTab === "TMS" && (
            <div className="space-y-3">
              <div className="flex justify-between items-center text-slate-400 text-[11px]">
                <span>Track Management System (TMS) Ingested Track Defects ({rawSources.tmsDefects.length} records)</span>
                <span>Source: USFD Trolley & OMS-2000 Records</span>
              </div>
              <div className="border border-slate-800 rounded-lg overflow-x-auto">
                <table className="w-full text-left font-mono">
                  <thead className="bg-slate-950 text-slate-400 text-[10px] border-b border-slate-800 uppercase">
                    <tr>
                      <th className="p-2">Record ID</th>
                      <th className="p-2">Defect Type</th>
                      <th className="p-2">Location</th>
                      <th className="p-2">Severity</th>
                      <th className="p-2">Overdue</th>
                      <th className="p-2">Detection Method</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-[11px]">
                    {rawSources.tmsDefects.map((d) => (
                      <tr key={d.id} className="hover:bg-slate-800/40">
                        <td className="p-2 text-blue-300 font-bold">{d.id}</td>
                        <td className="p-2 text-white">{d.defectType}</td>
                        <td className="p-2 text-slate-300">KM {d.kmStart}–{d.kmEnd} ({d.line})</td>
                        <td className="p-2">
                          <span className={cn("px-1.5 py-0.5 rounded text-[10px] font-bold", d.severity >= 5 ? "bg-rose-950 text-rose-300 border border-rose-700/50" : "bg-amber-950 text-amber-300")}>
                            Level {d.severity}/5
                          </span>
                        </td>
                        <td className="p-2 text-rose-400 font-bold">{d.overdueDays} days</td>
                        <td className="p-2 text-slate-400">{d.detectionMethod}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "SMMS" && (
            <div className="space-y-3">
              <div className="flex justify-between items-center text-slate-400 text-[11px]">
                <span>Signal Maintenance Management System (SMMS) Records ({rawSources.smmsWork.length} records)</span>
                <span>Source: Station Interlocking Log</span>
              </div>
              <div className="border border-slate-800 rounded-lg overflow-x-auto">
                <table className="w-full text-left font-mono">
                  <thead className="bg-slate-950 text-slate-400 text-[10px] border-b border-slate-800 uppercase">
                    <tr>
                      <th className="p-2">Record ID</th>
                      <th className="p-2">Asset Type</th>
                      <th className="p-2">Station & KM</th>
                      <th className="p-2">Maintenance Work</th>
                      <th className="p-2">Duration</th>
                      <th className="p-2">Criticality</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-[11px]">
                    {rawSources.smmsWork.map((s) => (
                      <tr key={s.id} className="hover:bg-slate-800/40">
                        <td className="p-2 text-sky-300 font-bold">{s.id}</td>
                        <td className="p-2 text-white">{s.assetType} ({s.assetId})</td>
                        <td className="p-2 text-slate-300">{s.stationCode} · KM {s.kmLocation}</td>
                        <td className="p-2 text-slate-300">{s.maintenanceType}</td>
                        <td className="p-2 text-emerald-400 font-bold">{s.durationMin} min</td>
                        <td className="p-2">
                          <span className={cn("px-1.5 py-0.5 rounded text-[10px] font-bold", s.criticality === "Critical" ? "bg-rose-950 text-rose-300 border border-rose-700/50" : "bg-amber-950 text-amber-300")}>
                            {s.criticality}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "TDMS" && (
            <div className="space-y-3">
              <div className="flex justify-between items-center text-slate-400 text-[11px]">
                <span>Traction Distribution Management System (TDMS) OHE Records ({rawSources.tdmsWork.length} records)</span>
                <span>Source: 25kV Catenary Audit</span>
              </div>
              <div className="border border-slate-800 rounded-lg overflow-x-auto">
                <table className="w-full text-left font-mono">
                  <thead className="bg-slate-950 text-slate-400 text-[10px] border-b border-slate-800 uppercase">
                    <tr>
                      <th className="p-2">Record ID</th>
                      <th className="p-2">OHE Asset</th>
                      <th className="p-2">Location</th>
                      <th className="p-2">Power Block?</th>
                      <th className="p-2">Duration</th>
                      <th className="p-2">Criticality</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-[11px]">
                    {rawSources.tdmsWork.map((t) => (
                      <tr key={t.id} className="hover:bg-slate-800/40">
                        <td className="p-2 text-orange-300 font-bold">{t.id}</td>
                        <td className="p-2 text-white">{t.assetType} ({t.workType})</td>
                        <td className="p-2 text-slate-300">KM {t.kmStart}–{t.kmEnd} ({t.line})</td>
                        <td className="p-2 text-amber-400 font-bold">{t.powerBlockRequired ? "YES (25kV Required)" : "NO"}</td>
                        <td className="p-2 text-emerald-400 font-bold">{t.durationMin} min</td>
                        <td className="p-2">
                          <span className={cn("px-1.5 py-0.5 rounded text-[10px] font-bold", t.criticality === "Critical" ? "bg-rose-950 text-rose-300 border border-rose-700/50" : "bg-amber-950 text-amber-300")}>
                            {t.criticality}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "COA" && (
            <div className="space-y-3">
              <div className="flex justify-between items-center text-slate-400 text-[11px]">
                <span>Control Office Application (COA) Passenger Timetable ({rawSources.coaTimetable.length} scheduled services)</span>
                <span>Source: CRIS / COA Master Timetable</span>
              </div>
              <div className="border border-slate-800 rounded-lg overflow-x-auto">
                <table className="w-full text-left font-mono">
                  <thead className="bg-slate-950 text-slate-400 text-[10px] border-b border-slate-800 uppercase">
                    <tr>
                      <th className="p-2">Train Number</th>
                      <th className="p-2">Train Name</th>
                      <th className="p-2">Type</th>
                      <th className="p-2">Direction</th>
                      <th className="p-2">Priority</th>
                      <th className="p-2">Corridor Passage Window</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-[11px]">
                    {rawSources.coaTimetable.map((tr) => (
                      <tr key={tr.trainId} className="hover:bg-slate-800/40">
                        <td className="p-2 text-purple-300 font-bold">{tr.serviceNumber}</td>
                        <td className="p-2 text-white">{tr.trainName}</td>
                        <td className="p-2 text-slate-300">{tr.trainType}</td>
                        <td className="p-2 text-slate-300">{tr.direction}</td>
                        <td className="p-2 text-amber-400 font-bold">Class {tr.priorityClass} (Protected)</td>
                        <td className="p-2 text-blue-300">
                          {Math.floor(tr.stops[0].arrivalMins / 60).toString().padStart(2, "0")}:{Math.floor(tr.stops[0].arrivalMins % 60).toString().padStart(2, "0")} → {Math.floor(tr.stops[tr.stops.length - 1].arrivalMins / 60).toString().padStart(2, "0")}:{Math.floor(tr.stops[tr.stops.length - 1].arrivalMins % 60).toString().padStart(2, "0")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "GOODS" && (
            <div className="space-y-3">
              <div className="flex justify-between items-center text-slate-400 text-[11px]">
                <span>Freight Operations Information System (FOIS) Forecast ({rawSources.goodsForecast.length} freight paths)</span>
                <span>Source: FOIS Freight Projection</span>
              </div>
              <div className="border border-slate-800 rounded-lg overflow-x-auto">
                <table className="w-full text-left font-mono">
                  <thead className="bg-slate-950 text-slate-400 text-[10px] border-b border-slate-800 uppercase">
                    <tr>
                      <th className="p-2">Rake ID</th>
                      <th className="p-2">Cargo Type</th>
                      <th className="p-2">Route</th>
                      <th className="p-2">Target Window</th>
                      <th className="p-2">Speed</th>
                      <th className="p-2">Loop Stabling?</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-[11px]">
                    {rawSources.goodsForecast.map((g) => (
                      <tr key={g.rakeId} className="hover:bg-slate-800/40">
                        <td className="p-2 text-emerald-300 font-bold">{g.rakeId}</td>
                        <td className="p-2 text-white">{g.cargoType}</td>
                        <td className="p-2 text-slate-300">{g.originStation} → {g.destinationStation}</td>
                        <td className="p-2 text-blue-300">
                          {Math.floor(g.targetWindowStartMins / 60).toString().padStart(2, "0")}:{Math.floor(g.targetWindowStartMins % 60).toString().padStart(2, "0")}–{Math.floor(g.targetWindowEndMins / 60).toString().padStart(2, "0")}:{Math.floor(g.targetWindowEndMins % 60).toString().padStart(2, "0")}
                        </td>
                        <td className="p-2 text-slate-300">{g.speedKmph} km/h</td>
                        <td className="p-2 text-amber-400">{g.loopLineStablingAllowed ? "Allowed" : "Main Line Only"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "CORRIDORS" && (
            <div className="space-y-3">
              <div className="flex justify-between items-center text-slate-400 text-[11px]">
                <span>Available Block Corridors ({rawSources.blockCorridors.length} Sections)</span>
                <span>Source: Divisional Engineering Block Section Master</span>
              </div>
              <div className="border border-slate-800 rounded-lg overflow-x-auto">
                <table className="w-full text-left font-mono">
                  <thead className="bg-slate-950 text-slate-400 text-[10px] border-b border-slate-800 uppercase">
                    <tr>
                      <th className="p-2">Section ID</th>
                      <th className="p-2">Name</th>
                      <th className="p-2">KM Span</th>
                      <th className="p-2">Feeder Post</th>
                      <th className="p-2">Nominal Overheads</th>
                      <th className="p-2">Max Daily Window</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-[11px]">
                    {rawSources.blockCorridors.map((c) => (
                      <tr key={c.sectionId} className="hover:bg-slate-800/40">
                        <td className="p-2 text-blue-300 font-bold">{c.sectionId}</td>
                        <td className="p-2 text-white">{c.name}</td>
                        <td className="p-2 text-slate-300">KM {c.kmStart}–{c.kmEnd}</td>
                        <td className="p-2 text-slate-300">{c.tractionFeederPost}</td>
                        <td className="p-2 text-slate-400">
                          Iso: {c.nominalOverheadMinutes.isolation}m · Earth: {c.nominalOverheadMinutes.earthing}m · Trans: {c.nominalOverheadMinutes.transit}m
                        </td>
                        <td className="p-2 text-emerald-400 font-bold">{c.maxDailyBlockWindowMin} min</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            All 6 Enterprise Ingestion Feeds Synchronized & Validated
          </span>
          <button
            onClick={onClose}
            className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded font-mono text-xs transition-colors"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
}
