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
    <div className="w-full rounded-lg border border-rose-200 dark:border-rose-900/40 bg-rose-50 dark:bg-rose-950/40 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 font-mono text-xs">
      <div className="flex items-start gap-3">
        <WifiOff className="w-4 h-4 text-rose-600 dark:text-rose-400 mt-0.5 shrink-0" />
        <div className="space-y-0.5">
          <div className="font-bold text-rose-900 dark:text-rose-200 text-[13px]">
            PLANNING ENGINE OFFLINE
          </div>
          <div className="text-rose-700 dark:text-rose-300">
            FastAPI backend unreachable — no live data available.
            {runId && (
              <span className="text-rose-500 dark:text-rose-400 ml-1">(Last run: {runId})</span>
            )}
          </div>
          <div className="text-rose-600 dark:text-rose-400 text-[11px]">
            Start backend:{" "}
            <code className="bg-rose-100 dark:bg-rose-900/60 px-1 py-0.5 rounded">
              cd backend &amp;&amp; uvicorn app.main:app --reload
            </code>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {onRetry && (
          <button
            onClick={onRetry}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-white dark:bg-slate-800 border border-rose-300 dark:border-rose-800 text-rose-800 dark:text-rose-200 hover:bg-rose-50 dark:hover:bg-slate-700 font-bold transition-colors shadow-xs"
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
