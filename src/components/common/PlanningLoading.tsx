"use client";

import React from "react";
import { Cpu } from "lucide-react";

interface Props {
  message?: string;
}

export function PlanningLoading({ message = "Loading planning run data..." }: Props) {
  return (
    <div className="w-full rounded-lg border border-blue-100 dark:border-blue-900/40 bg-blue-50 dark:bg-blue-950/40 p-4 flex items-center gap-3 font-mono text-xs animate-pulse">
      <Cpu className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
      <div className="space-y-0.5">
        <div className="font-bold text-blue-900 dark:text-blue-200">PLANNING ENGINE LOADING</div>
        <div className="text-blue-700 dark:text-blue-300">{message}</div>
      </div>
      <div className="ml-auto flex items-center gap-1">
        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce [animation-delay:0ms]" />
        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce [animation-delay:150ms]" />
        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce [animation-delay:300ms]" />
      </div>
    </div>
  );
}
