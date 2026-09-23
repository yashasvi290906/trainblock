"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  TrainTrack,
  Layers,
  ShieldCheck,
  Cpu,
  BarChart3,
  ArrowRight,
  Sparkles,
  Lock,
  User,
  CheckCircle2,
} from "lucide-react";
import { APP_CONFIG } from "@/lib/constants";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("rail_ops_sc");
  const [password, setPassword] = useState("••••••••");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      router.push("/control");
    }, 400);
  };

  return (
    <div className="min-h-screen w-full bg-[#060b15] text-slate-100 flex flex-col justify-between selection:bg-sky-500 selection:text-white">
      {/* Top Bar Banner */}
      <div className="bg-[#091122] border-b border-[#182643] px-6 py-2 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2 text-slate-300">
          <TrainTrack className="w-4 h-4 text-sky-400" />
          <span className="font-semibold text-white">South Central Railway</span>
          <span className="text-slate-500">|</span>
          <span className="text-slate-400">Problem Statement ID: 26027 (SIH 2026)</span>
        </div>
        <div className="mono-num text-[11px] text-amber-400/90 font-mono flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
          Prototype Environment · Synthetic Corridor (SEC–NDL 128 km)
        </div>
      </div>

      {/* Main Content Split */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-6 lg:p-12 flex flex-col lg:flex-row items-center gap-12 justify-center">
        {/* Left Column: Brand, Vision, 4 Pillars & Train Graphic */}
        <div className="flex-1 space-y-6 max-w-2xl">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-lg bg-sky-500/10 border border-sky-500/40 flex items-center justify-center text-sky-400 shadow-[0_0_20px_rgba(56,189,248,0.25)]">
              <TrainTrack className="w-6 h-6 text-sky-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold tracking-tight text-white">RAILBLOCK</h1>
                <span className="text-xs px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 font-mono border border-sky-500/30">
                  SIH 2026
                </span>
              </div>
              <p className="text-xs text-sky-400/90 font-medium">
                Integrated Maintenance Block Planning System
              </p>
            </div>
          </div>

          <div>
            <h2 className="text-3xl font-extrabold text-white tracking-tight leading-tight">
              Smarter planning, Safer operations, Higher asset availability.
            </h2>
            <p className="text-sm text-slate-400 mt-2 leading-relaxed">
              Consolidating Engineering, S&T, and Traction possessions into optimized timetable windows to prevent traffic bottlenecks and maximize corridor throughput.
            </p>
          </div>

          {/* Visual Train Card */}
          <div className="relative rounded-xl overflow-hidden border border-[#1e2f52] bg-[#0c162b] shadow-2xl p-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#182643] text-xs">
              <span className="font-mono text-slate-300 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                Corridor Section: SEC (0 km) → NDL (128 km)
              </span>
              <span className="font-mono text-sky-400">Double Line · 130 km/h</span>
            </div>

            <div className="py-4 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Vande Bharat Express (20833)</span>
                <span className="mono-num text-emerald-400 font-bold">On Time · KM 28.4</span>
              </div>
              <div className="h-2 w-full bg-[#142340] rounded-full overflow-hidden relative">
                <div className="h-full bg-gradient-to-r from-sky-500 to-emerald-400 w-1/4 rounded-full"></div>
              </div>
              <div className="flex justify-between text-[10px] font-mono text-slate-500">
                <span>SEC 0km</span>
                <span>KZJ 32km</span>
                <span>WL 68km (Block B-014)</span>
                <span>NDKD 101km</span>
                <span>NDL 128km</span>
              </div>
            </div>
          </div>

          {/* Four Core Pillars */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2">
            <div className="p-3 rounded-lg bg-[#0b1426] border border-[#182746] space-y-1">
              <div className="w-6 h-6 rounded bg-blue-500/10 text-blue-400 flex items-center justify-center">
                <Layers className="w-3.5 h-3.5" />
              </div>
              <h4 className="text-xs font-semibold text-slate-200">Integrate</h4>
              <p className="text-[11px] text-slate-400">
                Combine ENG + S&T + Traction into 1 block
              </p>
            </div>

            <div className="p-3 rounded-lg bg-[#0b1426] border border-[#182746] space-y-1">
              <div className="w-6 h-6 rounded bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                <ShieldCheck className="w-3.5 h-3.5" />
              </div>
              <h4 className="text-xs font-semibold text-slate-200">Respect</h4>
              <p className="text-[11px] text-slate-400">
                Protect passenger timetable & headway rules
              </p>
            </div>

            <div className="p-3 rounded-lg bg-[#0b1426] border border-[#182746] space-y-1">
              <div className="w-6 h-6 rounded bg-amber-500/10 text-amber-400 flex items-center justify-center">
                <Cpu className="w-3.5 h-3.5" />
              </div>
              <h4 className="text-xs font-semibold text-slate-200">Optimize</h4>
              <p className="text-[11px] text-slate-400">
                CP-SAT mathematical scheduling engine
              </p>
            </div>

            <div className="p-3 rounded-lg bg-[#0b1426] border border-[#182746] space-y-1">
              <div className="w-6 h-6 rounded bg-purple-500/10 text-purple-400 flex items-center justify-center">
                <BarChart3 className="w-3.5 h-3.5" />
              </div>
              <h4 className="text-xs font-semibold text-slate-200">Deliver</h4>
              <p className="text-[11px] text-slate-400">
                -67% possessions, +12% availability
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Operations Login Card */}
        <div className="w-full max-w-md bg-[#0d1629] border border-[#1d2d4d] rounded-xl p-8 shadow-2xl">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-white">Welcome Back</h3>
            <p className="text-xs text-slate-400 mt-1">
              Sign in to Divisional Operations Control Room
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Username / Designation
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-[#070e1c] border border-[#1a2948] rounded text-xs text-slate-200 focus:outline-none focus:border-sky-400 font-mono"
                  placeholder="Enter your username"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-[#070e1c] border border-[#1a2948] rounded text-xs text-slate-200 focus:outline-none focus:border-sky-400 font-mono"
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 px-4 rounded bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs transition-all shadow-lg shadow-sky-950/60 flex items-center justify-center gap-2 group cursor-pointer"
              >
                <span>{isLoading ? "Authenticating Operations..." : "Sign In to Control Room"}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </form>

          <div className="mt-6 pt-4 border-t border-[#182643] space-y-2 text-center">
            <span className="text-[11px] text-slate-400 block font-mono">
              Secunderabad Division · SCR
            </span>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#091122] border border-[#182643] text-[10px] text-slate-400">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              <span>Offline Prototype Mode Activated</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[#080e1b] border-t border-[#16233d] px-6 py-3 text-center text-xs text-slate-400">
        RAILBLOCK — AI-Powered Automatic Block Planning for Indian Railways · Problem Statement ID 26027
      </footer>
    </div>
  );
}
