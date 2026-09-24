"use client";

import React from "react";

export function RailwayAmbientBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden select-none transition-opacity duration-700 opacity-30 dark:opacity-30"
    >
      {/* 1. Deep Midnight & Twilight Amber Radial Backdrop */}
      <div className="absolute inset-0 bg-slate-100/60 dark:bg-[#070A12] transition-colors duration-200" />
      <div
        className="absolute inset-0 opacity-40 dark:opacity-40"
        style={{
          background: "radial-gradient(ellipse 80% 50% at 20% 40%, rgba(249, 115, 22, 0.08) 0%, rgba(13, 21, 39, 0) 70%), radial-gradient(ellipse 60% 60% at 80% 30%, rgba(139, 92, 246, 0.06) 0%, rgba(7, 10, 18, 0) 70%)"
        }}
      />

      {/* 2. Floating 3D Geometric Polyhedral Wireframe (Top-Right Amber) */}
      <div className="absolute top-12 right-[8%] w-80 h-80 animate-float-slow opacity-60">
        <svg viewBox="0 0 200 200" className="w-full h-full stroke-amber-500/40 fill-none" strokeWidth="1.2">
          {/* Outer Polyhedron edges */}
          <polygon points="100,20 170,70 150,150 50,150 30,70" stroke="#f59e0b" strokeOpacity="0.45" />
          {/* Inner vertices & intersecting lines */}
          <line x1="100" y1="20" x2="100" y2="100" stroke="#f59e0b" strokeOpacity="0.5" />
          <line x1="170" y1="70" x2="100" y2="100" stroke="#f59e0b" strokeOpacity="0.5" />
          <line x1="150" y1="150" x2="100" y2="100" stroke="#f59e0b" strokeOpacity="0.5" />
          <line x1="50" y1="150" x2="100" y2="100" stroke="#f59e0b" strokeOpacity="0.5" />
          <line x1="30" y1="70" x2="100" y2="100" stroke="#f59e0b" strokeOpacity="0.5" />
          <line x1="100" y1="20" x2="150" y2="150" stroke="#f59e0b" strokeOpacity="0.25" strokeDasharray="3 3" />
          <line x1="170" y1="70" x2="50" y2="150" stroke="#f59e0b" strokeOpacity="0.25" strokeDasharray="3 3" />
          {/* Glowing Vertex Dots */}
          <circle cx="100" cy="20" r="3" fill="#f59e0b" />
          <circle cx="170" cy="70" r="3" fill="#f59e0b" />
          <circle cx="150" cy="150" r="3" fill="#f59e0b" />
          <circle cx="50" cy="150" r="3" fill="#f59e0b" />
          <circle cx="30" cy="70" r="3" fill="#f59e0b" />
          <circle cx="100" cy="100" r="4" fill="#fbbf24" className="animate-pulse" />
        </svg>
      </div>

      {/* 3. Floating 3D Geometric Polyhedral Wireframe (Mid-Left Purple) */}
      <div className="absolute top-[45%] right-[25%] w-64 h-64 animate-float-slow opacity-50" style={{ animationDelay: "4s" }}>
        <svg viewBox="0 0 200 200" className="w-full h-full stroke-purple-500/40 fill-none" strokeWidth="1">
          <polygon points="100,30 160,80 130,160 70,160 40,80" stroke="#8b5cf6" strokeOpacity="0.4" />
          <line x1="100" y1="30" x2="70" y2="160" stroke="#a78bfa" strokeOpacity="0.3" />
          <line x1="160" y1="80" x2="40" y2="80" stroke="#a78bfa" strokeOpacity="0.3" />
          <line x1="130" y1="160" x2="100" y2="100" stroke="#8b5cf6" strokeOpacity="0.4" />
          <circle cx="100" cy="30" r="2.5" fill="#c4b5fd" />
          <circle cx="160" cy="80" r="2.5" fill="#c4b5fd" />
          <circle cx="130" cy="160" r="2.5" fill="#c4b5fd" />
          <circle cx="70" cy="160" r="2.5" fill="#c4b5fd" />
          <circle cx="40" cy="80" r="2.5" fill="#c4b5fd" />
        </svg>
      </div>

      {/* 4. Perspective 3D Track Grid receding toward the center horizon */}
      <svg
        className="absolute inset-0 w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="railGlow" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#f97316" stopOpacity="0.7" />
            <stop offset="60%" stopColor="#3b82f6" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#93c5fd" stopOpacity="0.05" />
          </linearGradient>

          <linearGradient id="headlightCone" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#fef08a" stopOpacity="0.6" />
            <stop offset="70%" stopColor="#fde047" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#fef9c3" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Center Horizon Sky Glow */}
        <radialGradient id="horizonSun" cx="50%" cy="38%" r="45%">
          <stop offset="0%" stopColor="#f97316" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#070a12" stopOpacity="0" />
        </radialGradient>
        <rect x="0" y="0" width="100%" height="100%" fill="url(#horizonSun)" />

        {/* Perspective Overhead OHE Catenary Wire Lines */}
        <line x1="10%" y1="100%" x2="49%" y2="38%" stroke="#64748b" strokeWidth="1" strokeOpacity="0.25" strokeDasharray="6 4" />
        <line x1="90%" y1="100%" x2="51%" y2="38%" stroke="#64748b" strokeWidth="1" strokeOpacity="0.25" strokeDasharray="6 4" />

        {/* Dual Double-Line Main Tracks (DOWN Line Left, UP Line Right) */}
        {/* Left Track (Down Line) */}
        <line x1="8%" y1="100%" x2="47%" y2="38%" stroke="url(#railGlow)" strokeWidth="3" />
        <line x1="16%" y1="100%" x2="48%" y2="38%" stroke="url(#railGlow)" strokeWidth="3" />

        {/* Right Track (Up Line) */}
        <line x1="84%" y1="100%" x2="52%" y2="38%" stroke="url(#railGlow)" strokeWidth="3" />
        <line x1="92%" y1="100%" x2="53%" y2="38%" stroke="url(#railGlow)" strokeWidth="3" />

        {/* Dynamic Receding Track Sleepers / Ties */}
        {[50, 56, 63, 71, 80, 90, 100].map((y, idx) => (
          <g key={idx} opacity={0.25 + idx * 0.08}>
            {/* Left track sleepers */}
            <line
              x1={`${8 + (idx * 5)}%`}
              y1={`${y}%`}
              x2={`${16 + (idx * 4.5)}%`}
              y2={`${y}%`}
              stroke="#64748b"
              strokeWidth={2 + idx * 0.4}
            />
            {/* Right track sleepers */}
            <line
              x1={`${84 - (idx * 4.5)}%`}
              y1={`${y}%`}
              x2={`${92 - (idx * 5)}%`}
              y2={`${y}%`}
              stroke="#64748b"
              strokeWidth={2 + idx * 0.4}
            />
          </g>
        ))}

        {/* OHE Mast Posts along the Corridor */}
        <line x1="6%" y1="100%" x2="6%" y2="60%" stroke="#475569" strokeWidth="2.5" strokeOpacity="0.4" />
        <line x1="6%" y1="60%" x2="18%" y2="60%" stroke="#475569" strokeWidth="1.5" strokeOpacity="0.3" />

        <line x1="94%" y1="100%" x2="94%" y2="60%" stroke="#475569" strokeWidth="2.5" strokeOpacity="0.4" />
        <line x1="94%" y1="60%" x2="82%" y2="60%" stroke="#475569" strokeWidth="1.5" strokeOpacity="0.3" />
      </svg>

      {/* 2. Fast Express Train (Vande Bharat 20833) gliding smoothly across lower corridor */}
      <div className="absolute bottom-20 left-0 right-0 h-12 border-b border-t border-slate-400/30 dark:border-slate-600/40">
        {/* Track Sleepers horizontal */}
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: "repeating-linear-gradient(90deg, #64748b 0px, #64748b 2px, transparent 2px, transparent 18px)",
          }}
        />

        {/* Express Train Movement */}
        <div className="absolute top-[-16px] left-0 animate-train-glide flex items-center">
          {/* Headlight beam casting light forward */}
          <div
            className="w-64 h-12 -mr-2"
            style={{
              background: "linear-gradient(90deg, rgba(254, 240, 138, 0.6) 0%, rgba(254, 240, 138, 0.15) 60%, rgba(254, 240, 138, 0) 100%)",
              clipPath: "polygon(0 35%, 100% 0, 100% 100%, 0 65%)",
            }}
          />

          {/* Vande Bharat Aerodynamic White & Blue Engine */}
          <div className="relative bg-gradient-to-r from-blue-700 via-white to-slate-100 dark:to-slate-800 text-blue-900 px-5 py-1.5 rounded-r-2xl rounded-l-xs flex items-center gap-2 shadow-xl border-2 border-blue-500 h-9 font-mono font-black text-xs tracking-wider whitespace-nowrap">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
            <span className="text-slate-900 dark:text-white font-extrabold">VANDE BHARAT 20833</span>
            <div className="flex gap-1.5 ml-2">
              <span className="w-4 h-2 bg-blue-600 rounded-xs" />
              <span className="w-4 h-2 bg-blue-600 rounded-xs" />
              <span className="w-4 h-2 bg-blue-600 rounded-xs" />
            </div>
          </div>

          {/* Executive Coaches */}
          <div className="flex gap-1.5 ml-1.5">
            {[1, 2, 3].map((coach) => (
              <div
                key={coach}
                className="w-24 h-8 bg-slate-100 dark:bg-slate-800 rounded-xs border border-slate-300 dark:border-slate-600 flex items-center justify-around px-1.5 shadow-sm"
              >
                <div className="w-full h-1.5 bg-blue-700 rounded-xs mb-3" />
                <span className="w-3 h-1.5 bg-amber-200/60 rounded-xs" />
                <span className="w-3 h-1.5 bg-amber-200/60 rounded-xs" />
                <span className="w-3 h-1.5 bg-amber-200/60 rounded-xs" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Upper Track: Freight Train (WAG-9 31204) moving in counter-direction */}
      <div className="absolute top-28 left-0 right-0 h-10 border-b border-t border-slate-400/25 dark:border-slate-700/30">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: "repeating-linear-gradient(90deg, #64748b 0px, #64748b 2px, transparent 2px, transparent 22px)",
          }}
        />

        <div className="absolute top-[-12px] right-0 animate-train-glide-reverse flex items-center">
          {/* Container Freight Wagons */}
          <div className="flex gap-1.5 mr-2">
            <div className="w-16 h-7 bg-amber-800/80 rounded-xs border border-amber-600/50" />
            <div className="w-16 h-7 bg-blue-900/80 rounded-xs border border-blue-700/50" />
            <div className="w-16 h-7 bg-emerald-900/80 rounded-xs border border-emerald-700/50" />
          </div>

          {/* WAG-9 Electric Locomotive */}
          <div className="bg-red-800 text-white px-4 py-1 rounded-l-xl rounded-r-xs flex items-center gap-1.5 shadow-lg border-2 border-red-500 h-8 font-mono text-xs font-bold whitespace-nowrap">
            <span className="w-2 h-2 rounded-full bg-amber-300 animate-pulse" />
            <span>WAG-9 · 31204 (IR FREIGHT)</span>
          </div>

          {/* Reverse Headlight Beam */}
          <div
            className="w-48 h-8 -ml-2 rotate-180"
            style={{
              background: "linear-gradient(90deg, rgba(254, 240, 138, 0.5) 0%, rgba(254, 240, 138, 0) 100%)",
              clipPath: "polygon(0 35%, 100% 0, 100% 100%, 0 65%)",
            }}
          />
        </div>
      </div>

      {/* 4. Ambient Glowing Railway Signal Lanterns (Left: Green 4-Aspect, Right: Caution Amber) */}
      <div className="absolute top-48 left-[8%] flex flex-col items-center gap-1">
        <div className="w-4 h-4 rounded-full bg-emerald-500 shadow-[0_0_18px_#10b981] animate-signal-lantern border border-emerald-300" />
        <div className="w-1 h-24 bg-slate-600/60 rounded-full" />
      </div>

      <div className="absolute top-52 right-[10%] flex flex-col items-center gap-1">
        <div className="w-4 h-4 rounded-full bg-amber-500 shadow-[0_0_18px_#f59e0b] animate-signal-lantern border border-amber-300" />
        <div className="w-1 h-24 bg-slate-600/60 rounded-full" />
      </div>

      {/* 5. Front-Approaching Locomotive emerging from vanishing horizon */}
      <div className="absolute left-1/2 animate-train-approach pointer-events-none flex flex-col items-center">
        {/* Dual High-Beam Headlights Cone */}
        <div className="flex gap-16 -mb-4">
          <div className="w-40 h-72 bg-gradient-to-b from-amber-300/40 via-yellow-200/20 to-transparent blur-md -rotate-12 origin-top" />
          <div className="w-40 h-72 bg-gradient-to-b from-amber-300/40 via-yellow-200/20 to-transparent blur-md rotate-12 origin-top" />
        </div>

        {/* Front Profile of Aerodynamic Locomotive (WAP-7 / Vande Bharat) */}
        <div className="relative w-48 h-36 bg-gradient-to-b from-blue-900 via-blue-800 to-slate-900 rounded-t-3xl border-4 border-blue-500/80 shadow-2xl flex flex-col items-center justify-between p-2">
          {/* Pantograph */}
          <div className="absolute -top-6 w-14 h-6 border-t-2 border-r-2 border-l-2 border-amber-400/80" />
          
          {/* Top Marker Light */}
          <div className="w-3 h-3 rounded-full bg-amber-300 shadow-[0_0_12px_#fde047] animate-pulse" />

          {/* Windshield Cab Windows */}
          <div className="w-36 h-10 bg-slate-950/90 rounded-t-lg border border-cyan-400/50 flex items-center justify-around px-2">
            <div className="w-14 h-6 bg-cyan-900/60 rounded-xs border border-cyan-500/40" />
            <div className="w-14 h-6 bg-cyan-900/60 rounded-xs border border-cyan-500/40" />
          </div>

          {/* IR Emblem & Twin High-Intensity Headlights */}
          <div className="w-full flex items-center justify-between px-3">
            <div className="w-5 h-5 rounded-full bg-amber-300 shadow-[0_0_16px_#fde047] border border-white" />
            <div className="text-[9px] font-mono font-black text-amber-300 tracking-wider bg-slate-950/80 px-2 py-0.5 rounded border border-amber-400/50">
              IR 26027
            </div>
            <div className="w-5 h-5 rounded-full bg-amber-300 shadow-[0_0_16px_#fde047] border border-white" />
          </div>

          {/* Cowcatcher / Cattle Guard Pilot */}
          <div className="w-40 h-4 bg-gradient-to-r from-red-700 via-red-600 to-red-700 rounded-b border border-red-500 flex justify-center gap-1.5 items-center">
            <span className="w-1 h-3 bg-slate-300 rotate-12" />
            <span className="w-1 h-3 bg-slate-300 rotate-12" />
            <span className="w-1 h-3 bg-slate-300 -rotate-12" />
            <span className="w-1 h-3 bg-slate-300 -rotate-12" />
          </div>
        </div>
      </div>
    </div>
  );
}
