"use client";

import React from "react";
import { WifiOff, RefreshCcw, Sparkles } from "lucide-react";

interface Props {
  onRetry?: () => void;
  onLoadDemo?: () => void;
  runId?: string | null;
}

export function PlanningEngineOffline({ onRetry, onLoadDemo, runId }: Props) {
  return (
    <div className="w-full rounded-lg border border-rose-200 bg-rose-50 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 font-mono text-xs">
      <div className="flex items-start gap-3">
        <WifiOff className="w-4 h-4 text-rose-600 mt-0.5 shrink-0" />
        <div className="space-y-0.5">
          <div className="font-bold text-rose-900 text-[13px]">
            PLANNING ENGINE OFFLINE
          </div>
          <div className="text-rose-700">
            FastAPI backend unreachable — no live data available.
            {runId && (
              <span className="text-rose-500 ml-1">(Last run: {runId})</span>
            )}
          </div>
          <div className="text-rose-600 text-[11px]">
            Start backend:{" "}
            <code className="bg-rose-100 px-1 py-0.5 rounded">
              cd backend &amp;&amp; uvicorn app.main:app --reload
            </code>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {onRetry && (
          <button
            onClick={onRetry}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-white border border-rose-300 text-rose-800 hover:bg-rose-50 font-bold transition-colors shadow-xs"
          >
            <RefreshCcw className="w-3 h-3" />
            RETRY
          </button>
        )}
        {onLoadDemo && (
          <button
            onClick={onLoadDemo}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-blue-700 text-white hover:bg-blue-800 font-bold transition-colors shadow-xs"
          >
            <Sparkles className="w-3 h-3 text-blue-200" />
            LOAD DEMO DATA
          </button>
        )}
      </div>
    </div>
  );
}
