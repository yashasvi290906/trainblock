'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import {
  PlanningRun,
  getCurrentPlanningRun,
  resetDemoToBaseline,
  triggerReplan,
  scenarioDenyBlock,
  scenarioAddCriticalTask,
  approvePlan,
  overridePlan,
  PlannerOverrideRequest
} from '@/lib/api/runs';

export interface AddCriticalTaskData {
  defect_type?: string;
  line?: string;
  km_start?: number;
  km_end?: number;
  depth_mm?: number;
}

interface PlanningRunContextType {
  currentRun: PlanningRun | null;
  loading: boolean;
  error: string | null;
  isBackend: boolean;
  resetDemo: () => Promise<void>;
  replan: () => Promise<void>;
  denyBlock: (blockId: string) => Promise<void>;
  addCriticalTask: (data?: AddCriticalTaskData) => Promise<void>;
  approveCurrentPlan: (name?: string, role?: string) => Promise<void>;
  overrideCurrentPlan: (request: PlannerOverrideRequest) => Promise<void>;
  refresh: () => Promise<void>;
}

const PlanningRunContext = createContext<PlanningRunContextType | null>(null);

export function PlanningRunProvider({ children }: { children: React.ReactNode }) {
  const [currentRun, setCurrentRun] = useState<PlanningRun | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isBackend, setIsBackend] = useState<boolean>(false);

  const fetchRun = useCallback(async () => {
    setLoading(true);
    const res = await getCurrentPlanningRun();
    if (res.data) {
      setCurrentRun(res.data);
      setIsBackend(res.isBackend);
      setError(null);
    } else {
      setError(res.error);
      setIsBackend(false);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    fetchRun();
  }, [fetchRun]);

  const resetDemo = async () => {
    setLoading(true);
    const res = await resetDemoToBaseline();
    if (res.data) {
      setCurrentRun(res.data);
      setIsBackend(res.isBackend);
      setError(null);
    }
    setLoading(false);
  };

  const replan = async () => {
    setLoading(true);
    const res = await triggerReplan();
    if (res.data) {
      setCurrentRun(res.data);
      setIsBackend(res.isBackend);
      setError(null);
    }
    setLoading(false);
  };

  const denyBlock = async (blockId: string) => {
    setLoading(true);
    const res = await scenarioDenyBlock(blockId);
    if (res.data) {
      setCurrentRun(res.data);
      setIsBackend(res.isBackend);
      setError(null);
    }
    setLoading(false);
  };

  const addCriticalTask = async (data?: AddCriticalTaskData) => {
    setLoading(true);
    const res = await scenarioAddCriticalTask(data || {
      defect_type: 'Severe Rail Joint Fracture (USFD Depth 7.2mm)',
      line: 'DOWN',
      km_start: 73.5,
      km_end: 74.0,
      depth_mm: 7.2
    });
    if (res.data) {
      setCurrentRun(res.data);
      setIsBackend(res.isBackend);
      setError(null);
    }
    setLoading(false);
  };

  const approveCurrentPlan = async (name = 'Chief Block Planner', role = 'Operating / Senior DOM') => {
    setLoading(true);
    const res = await approvePlan(name, role);
    if (res.data) {
      setCurrentRun(res.data);
      setIsBackend(res.isBackend);
      setError(null);
    }
    setLoading(false);
  };

  const overrideCurrentPlan = async (request: PlannerOverrideRequest) => {
    setLoading(true);
    const res = await overridePlan(request);
    if (res.data) {
      setCurrentRun(res.data);
      setIsBackend(res.isBackend);
      setError(null);
    }
    setLoading(false);
  };

  return (
    <PlanningRunContext.Provider
      value={{
        currentRun,
        loading,
        error,
        isBackend,
        resetDemo,
        replan,
        denyBlock,
        addCriticalTask,
        approveCurrentPlan,
        overrideCurrentPlan,
        refresh: fetchRun
      }}
    >
      {children}
    </PlanningRunContext.Provider>
  );
}

export function usePlanningRun() {
  const ctx = useContext(PlanningRunContext);
  if (!ctx) {
    throw new Error('usePlanningRun must be used within a PlanningRunProvider');
  }
  return ctx;
}
