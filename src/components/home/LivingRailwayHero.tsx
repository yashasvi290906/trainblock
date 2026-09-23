"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  TrainTrack,
  ArrowRight,
  ShieldCheck,
  Wrench,
  Zap,
  Radio,
  Clock,
  MapPin,
  Sparkles,
  Info,
  CheckCircle2,
  AlertTriangle,
  Layers,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface TrainVisualState {
  id: string;
  name: string;
  serviceNumber: string;
  type: "vande-bharat" | "rajdhani" | "amrit-bharat" | "freight";
  direction: "UP" | "DOWN";
  speed: number;
  initialPos: number;
  isForecast?: boolean;
  color: string;
  bgColor: string;
  track: "UP" | "DOWN";
}

const HERO_TRAINS: TrainVisualState[] = [
  {
    id: "trn-20833",
    name: "Vande Bharat Express",
    serviceNumber: "20833",
    type: "vande-bharat",
    direction: "DOWN",
    speed: 0.18,
    initialPos: 18,
    color: "#0284c7",
    bgColor: "bg-sky-500",
    track: "DOWN",
  },
  {
    id: "trn-12723",
    name: "Telangana Rajdhani",
    serviceNumber: "12723",
    type: "rajdhani",
    direction: "DOWN",
    speed: 0.14,
    initialPos: 62,
    color: "#dc2626",
    bgColor: "bg-red-600",
    track: "DOWN",
  },
  {
    id: "trn-12951",
    name: "Shatabdi Express",
    serviceNumber: "12951",
    type: "rajdhani",
    direction: "UP",
    speed: 0.15,
    initialPos: 84,
    color: "#7c3aed",
    bgColor: "bg-purple-600",
    track: "UP",
  },
  {
    id: "trn-g4217",
    name: "Container Freight (Forecast)",
    serviceNumber: "G/4217",
    type: "freight",
    direction: "DOWN",
    speed: 0.08,
    initialPos: 40,
    isForecast: true,
    color: "#059669",
    bgColor: "bg-emerald-600",
    track: "DOWN",
  },
];

const STATIONS = [
  { code: "SEC", name: "Secunderabad", km: 40, percent: 5 },
  { code: "LBN", name: "Labanya Nagar", km: 58, percent: 24 },
  { code: "WL", name: "Warangal", km: 68, percent: 38 },
  { code: "KCG", name: "Kacheguda", km: 76, percent: 50 },
  { code: "NDKD", name: "Nadikude", km: 94, percent: 72 },
  { code: "NDL", name: "Nandyal", km: 120, percent: 95 },
];

export function LivingRailwayHero() {
  const [trainPositions, setTrainPositions] = useState<Record<string, number>>({
    "trn-20833": 18,
    "trn-12723": 62,
    "trn-12951": 84,
    "trn-g4217": 40,
  });

  const [hoveredElement, setHoveredElement] = useState<{
    type: "train" | "block" | "station" | "signal";
    title: string;
    subtitle: string;
    badge?: string;
  } | null>(null);

  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  // Smooth continuous train animation
  useEffect(() => {
    if (prefersReducedMotion) return;

    let animFrameId: number;
    let lastTime = performance.now();

    const animate = (time: number) => {
      const delta = (time - lastTime) / 1000;
      lastTime = time;

      setTrainPositions((prev) => {
        const next = { ...prev };
        HERO_TRAINS.forEach((trn) => {
          const current = next[trn.id] ?? trn.initialPos;
          if (trn.direction === "DOWN") {
            const updated = current + trn.speed * delta * 25;
            next[trn.id] = updated > 102 ? -10 : updated;
          } else {
            const updated = current - trn.speed * delta * 25;
            next[trn.id] = updated < -10 ? 102 : updated;
          }
        });
        return next;
      });

      animFrameId = requestAnimationFrame(animate);
    };

    animFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animFrameId);
  }, [prefersReducedMotion]);

  return (
    <div className="w-full">
      {/* LIVING RAILWAY 2.5D DIGITAL CORRIDOR SCENE */}
      <div className="w-full bg-slate-900 rounded-xl border border-slate-800 shadow-xl overflow-hidden relative text-white select-none">
        {/* Top Operational Status Bar */}
        <div className="bg-slate-950/80 px-4 sm:px-6 py-3 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-slate-200">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <strong className="tracking-wide">LIVING RAILWAY SIMULATION</strong>
            </div>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400">SEC (KM 40) → NDL (KM 120) · 80 km Double Line · 25kV AC</span>
          </div>

          <div className="flex items-center gap-3 text-[11px]">
            <span className="text-slate-400">Time Window:</span>
            <span className="px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800 font-bold">
              02:00 – 05:30 IST
            </span>
          </div>
        </div>

        {/* The 2.5D Railway Corridor Scene */}
        <div className="p-4 sm:p-8 relative min-h-[360px] overflow-hidden bg-radial from-slate-900 via-slate-950 to-black">
          {/* Station Markers & Kilometre Flags (Top Axis) */}
          <div className="relative h-8 border-b border-slate-800/80 mb-6">
            {STATIONS.map((stn) => (
              <div
                key={stn.code}
                onMouseEnter={() =>
                  setHoveredElement({
                    type: "station",
                    title: `${stn.code} · ${stn.name}`,
                    subtitle: `Corridor Location: KM ${stn.km} · Interlocked Station`,
                    badge: "STATION",
                  })
                }
                onMouseLeave={() => setHoveredElement(null)}
                className="absolute flex flex-col items-center transform -translate-x-1/2 cursor-pointer group"
                style={{ left: `${stn.percent}%` }}
              >
                <div className="flex items-center gap-1 font-mono text-xs font-bold text-slate-300 group-hover:text-sky-300 transition-colors">
                  <MapPin className="w-3 h-3 text-blue-400" />
                  <span>{stn.code}</span>
                </div>
                <div className="text-[9px] font-mono text-slate-400">
                  KM {stn.km}
                </div>
              </div>
            ))}
          </div>

          {/* OHE Catenary Wire & Support Cantilever Poles */}
          <div className="relative h-6 border-b border-dashed border-slate-700/60 flex justify-between px-4 mb-4">
            {Array.from({ length: 14 }).map((_, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <div className="w-1 h-3.5 bg-slate-600 rounded-t" />
                <div className="w-2.5 h-0.5 bg-amber-400/80 shadow-xs" />
              </div>
            ))}
          </div>

          {/* TRACK 1: DOWN LINE (Eastbound: Towards Warangal & Nandyal) */}
          <div className="relative h-18 bg-slate-950/90 rounded-xl border border-slate-800 flex items-center overflow-hidden mb-6 shadow-inner">
            {/* Sleepers Pattern */}
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(90deg, #64748b, #64748b 8px, transparent 8px, transparent 20px)",
              }}
            />
            {/* Steel Rail Lines */}
            <div className="absolute top-4 inset-x-0 h-1 bg-slate-600 shadow-sm" />
            <div className="absolute bottom-4 inset-x-0 h-1 bg-slate-600 shadow-sm" />

            {/* Line Label */}
            <span className="absolute left-3 font-mono text-[9px] font-bold text-slate-400 uppercase tracking-wider z-0">
              DOWN LINE (SEC → NDL)
            </span>

            {/* INTEGRATED POSSESSION B-014 REGION (KM 68–94) */}
            <div
              onMouseEnter={() =>
                setHoveredElement({
                  type: "block",
                  title: "Block B-014 · Integrated Possession",
                  subtitle: "Engineering + S&T + Traction co-located (KM 68–94 · 02:20–04:10 · 90m usable)",
                  badge: "PROTECTED POSSESSION",
                })
              }
              onMouseLeave={() => setHoveredElement(null)}
              className="absolute h-14 rounded-lg bg-amber-500/20 border-2 border-amber-400 ring-2 ring-amber-400/40 text-amber-200 z-10 flex items-center justify-between px-3 cursor-pointer shadow-lg hover:bg-amber-500/30 transition-all"
              style={{ left: "38%", width: "34%" }}
            >
              <div className="flex items-center gap-1.5 font-mono text-xs font-extrabold truncate">
                <Wrench className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>B-014 (ENG + S&T + TRC)</span>
              </div>
              <span className="text-[10px] font-mono bg-black/80 px-2 py-0.5 rounded border border-amber-400/60 text-amber-300 font-bold shrink-0">
                02:20–04:10
              </span>
            </div>

            {/* Moving Trains on DOWN Line */}
            {/* 1. Vande Bharat Express */}
            <div
              onMouseEnter={() =>
                setHoveredElement({
                  type: "train",
                  title: "20833 Vande Bharat Express",
                  subtitle: "SEC → VSKP · Scheduled 02:15 · Priority P1 (Protected Trajectory)",
                  badge: "PASSENGER · PROTECTED",
                })
              }
              onMouseLeave={() => setHoveredElement(null)}
              className="absolute z-20 flex items-center cursor-pointer transition-transform hover:scale-105"
              style={{
                left: `${trainPositions["trn-20833"]}%`,
                top: "10px",
              }}
            >
              {/* Train Body Silhouette (Vande Bharat Livery: White/Sky Blue) */}
              <div className="h-8 w-28 bg-white rounded-r-xl rounded-l-md border border-sky-400 shadow-lg flex items-center justify-between px-2 text-slate-900 font-mono text-[10px] font-extrabold">
                <div className="w-2 h-4 bg-sky-600 rounded-l" />
                <span className="text-[10px] text-sky-900 tracking-tight">20833 VB</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
              </div>
            </div>

            {/* 2. Telangana Rajdhani */}
            <div
              onMouseEnter={() =>
                setHoveredElement({
                  type: "train",
                  title: "12723 Telangana Rajdhani Express",
                  subtitle: "HYB → NDLS · Scheduled 02:40 · Priority P1 (Protected Trajectory)",
                  badge: "PASSENGER · PROTECTED",
                })
              }
              onMouseLeave={() => setHoveredElement(null)}
              className="absolute z-20 flex items-center cursor-pointer transition-transform hover:scale-105"
              style={{
                left: `${trainPositions["trn-12723"]}%`,
                top: "10px",
              }}
            >
              {/* Train Body Silhouette (Rajdhani Livery: Red/Silver) */}
              <div className="h-8 w-26 bg-red-700 rounded-r-xl rounded-l-md border border-red-400 shadow-lg flex items-center justify-between px-2 text-white font-mono text-[10px] font-extrabold">
                <div className="w-2 h-4 bg-amber-400 rounded-l" />
                <span>12723 RAJ</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
              </div>
            </div>

            {/* 3. Ghosted Forecast: G/4217 Container Freight */}
            <div
              onMouseEnter={() =>
                setHoveredElement({
                  type: "train",
                  title: "G/4217 Container Freight (CONCOR)",
                  subtitle: "SNF → BZA · Forecast Trajectory at 04:30 (Ghosted / Planned slot)",
                  badge: "FREIGHT · FORECAST",
                })
              }
              onMouseLeave={() => setHoveredElement(null)}
              className="absolute z-10 flex items-center cursor-pointer opacity-40 hover:opacity-80 transition-opacity"
              style={{
                left: `${trainPositions["trn-g4217"]}%`,
                top: "12px",
              }}
            >
              {/* Translucent/Ghosted Freight Locomotive */}
              <div className="h-7 w-32 bg-emerald-950/80 border-2 border-dashed border-emerald-400 rounded-md flex items-center justify-between px-2 text-emerald-300 font-mono text-[9px] font-bold">
                <span>G/4217 FORECAST</span>
                <span className="text-[8px] bg-emerald-900/80 px-1 rounded">04:30</span>
              </div>
            </div>
          </div>

          {/* TRACK 2: UP LINE (Westbound: Towards Kazipet & Secunderabad) */}
          <div className="relative h-18 bg-slate-950/90 rounded-xl border border-slate-800 flex items-center overflow-hidden shadow-inner">
            {/* Sleepers Pattern */}
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(90deg, #64748b, #64748b 8px, transparent 8px, transparent 20px)",
              }}
            />
            {/* Steel Rail Lines */}
            <div className="absolute top-4 inset-x-0 h-1 bg-slate-600 shadow-sm" />
            <div className="absolute bottom-4 inset-x-0 h-1 bg-slate-600 shadow-sm" />

            {/* Line Label */}
            <span className="absolute left-3 font-mono text-[9px] font-bold text-slate-400 uppercase tracking-wider z-0">
              UP LINE (NDL → SEC)
            </span>

            {/* Moving Train on UP Line: 12951 Shatabdi Express */}
            <div
              onMouseEnter={() =>
                setHoveredElement({
                  type: "train",
                  title: "12951 Shatabdi Express",
                  subtitle: "NDL → SEC · Scheduled 03:45 · Priority P1 (Clear UP Track)",
                  badge: "PASSENGER · PROTECTED",
                })
              }
              onMouseLeave={() => setHoveredElement(null)}
              className="absolute z-20 flex items-center cursor-pointer transition-transform hover:scale-105"
              style={{
                left: `${trainPositions["trn-12951"]}%`,
                top: "10px",
              }}
            >
              {/* Train Body Silhouette (Shatabdi: Purple/Silver) */}
              <div className="h-8 w-26 bg-purple-900 rounded-l-xl rounded-r-md border border-purple-400 shadow-lg flex items-center justify-between px-2 text-white font-mono text-[10px] font-extrabold">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>12951 SHT</span>
                <div className="w-2 h-4 bg-sky-400 rounded-r" />
              </div>
            </div>
          </div>

          {/* Interactive Inspection Tooltip Overlay (Hover feedback) */}
          <div className="min-h-12 mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-mono">
            {hoveredElement ? (
              <div className="flex items-center gap-2.5 animate-fadeIn">
                <span className="px-2 py-0.5 rounded bg-blue-900 text-blue-200 border border-blue-700 text-[10px] font-bold">
                  {hoveredElement.badge || "INSPECT"}
                </span>
                <div>
                  <strong className="text-white text-xs">{hoveredElement.title}: </strong>
                  <span className="text-slate-400">{hoveredElement.subtitle}</span>
                </div>
              </div>
            ) : (
              <div className="text-slate-400 text-[11px] flex items-center gap-2">
                <Info className="w-3.5 h-3.5 text-slate-500" />
                <span>Hover over trains, maintenance block, or stations to inspect corridor parameters</span>
              </div>
            )}

            <div className="hidden sm:flex items-center gap-3 text-[11px] text-slate-500">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-sky-400" />
                <span>Solid = Scheduled Train</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 border border-dashed border-emerald-300" />
                <span>Dashed = Goods Forecast</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-amber-500/30 border border-amber-400" />
                <span>Amber = Integrated Possession</span>
              </span>
            </div>
          </div>
        </div>

        {/* 3. HERO RESTRAINED OPERATIONAL CONTROL STRIP */}
        <div className="bg-slate-950 px-4 sm:px-6 py-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
          <div className="flex flex-wrap items-center gap-4 text-slate-300">
            <div>
              <span className="text-slate-400 block text-[9.5px]">CORRIDOR:</span>
              <strong className="text-white">SEC (KM 40) → NDL (KM 120) · 80 km</strong>
            </div>
            <div className="h-6 w-px bg-slate-800" />
            <div>
              <span className="text-slate-400 block text-[9.5px]">MAINTENANCE DEMANDS:</span>
              <strong className="text-white">47 Demands (4 P1 Mandatory)</strong>
            </div>
            <div className="h-6 w-px bg-slate-800" />
            <div>
              <span className="text-slate-400 block text-[9.5px]">OPTIMIZED POSSESSION:</span>
              <strong className="text-amber-300">Block B-014 (KM 68–94 · 02:20–04:10)</strong>
            </div>
          </div>

          <Link
            href="/plan"
            className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <span>Open Plan Workspace</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
