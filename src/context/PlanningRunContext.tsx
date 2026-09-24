'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import {
  PlanningRun,
  getCurrentPlanningRun,
  resetDemoToBaseline,
  triggerReplan,
  scenarioDenyBlock,
  scenarioOverrunBlock,
  scenarioInjectFreight,
  scenarioAddCriticalTask,
  rollingRollForward,
  approvePlan,
  deferPlan,
  overridePlan,
  stationMasterAcknowledge,
  stationMasterEscalate,
  departmentAddDemand,
  departmentUpdateReadiness,
  departmentRequestBlock,
  PlannerOverrideRequest
} from '@/lib/api/runs';

export interface AddCriticalTaskData {
  defect_type?: string;
  line?: string;
  km_start?: number;
  km_end?: number;
  depth_mm?: number;
}

export interface DepartmentDemandData {
  department: string;
  defect_type: string;
  line: string;
  km_start: number;
  km_end: number;
  duration_min?: number;
  machine_required?: string;
  severity?: number;
}

interface PlanningRunContextType {
  currentRun: PlanningRun | null;
  loading: boolean;
  error: string | null;
  isBackend: boolean;
  resetDemo: () => Promise<void>;
  replan: () => Promise<void>;
  denyBlock: (blockId: string) => Promise<void>;
  overrunBlock: (blockId?: string, overrunMin?: number) => Promise<void>;
  injectFreight: (data?: { cargo_type?: string; origin?: string; destination?: string; target_window_start?: number; target_window_end?: number }) => Promise<void>;
  addCriticalTask: (data?: AddCriticalTaskData) => Promise<void>;
  rollForward: () => Promise<void>;
  approveCurrentPlan: (name?: string, role?: string) => Promise<void>;
  deferCurrentPlan: (reason?: string, officerName?: string) => Promise<void>;
  overrideCurrentPlan: (request: PlannerOverrideRequest) => Promise<void>;
  ackStationImpact: (stationCode: string, blockId: string, officerName?: string) => Promise<void>;
  escalateStationAlert: (stationCode: string, reason: string, officerName?: string) => Promise<void>;
  deptAddDemand: (data: DepartmentDemandData) => Promise<void>;
  deptUpdateReadiness: (taskId: string, readinessStatus?: string, officerName?: string) => Promise<void>;
  deptRequestBlock: (department: string, section: string, preferredWindow: string, officerName?: string) => Promise<void>;
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

  const overrunBlock = async (blockId?: string, overrunMin = 35) => {
    setLoading(true);
    const res = await scenarioOverrunBlock(blockId, overrunMin);
    if (res.data) {
      setCurrentRun(res.data);
      setIsBackend(res.isBackend);
      setError(null);
    }
    setLoading(false);
  };

  const injectFreight = async (data?: { cargo_type?: string; origin?: string; destination?: string; target_window_start?: number; target_window_end?: number }) => {
    setLoading(true);
    const res = await scenarioInjectFreight(data);
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

  const rollForward = async () => {
    setLoading(true);
    const res = await rollingRollForward();
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

  const deferCurrentPlan = async (reason = 'Co-locating with subsequent weekend mega block', officerName = 'Senior DOM / Planning') => {
    setLoading(true);
    const res = await deferPlan(reason, officerName);
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

  const ackStationImpact = async (stationCode: string, blockId: string, officerName = 'Station Master') => {
    setLoading(true);
    const res = await stationMasterAcknowledge(stationCode, blockId, officerName);
    if (res.data) {
      setCurrentRun(res.data);
      setIsBackend(res.isBackend);
      setError(null);
    }
    setLoading(false);
  };

  const escalateStationAlert = async (stationCode: string, reason: string, officerName = 'Station Master') => {
    setLoading(true);
    const res = await stationMasterEscalate(stationCode, reason, officerName);
    if (res.data) {
      setCurrentRun(res.data);
      setIsBackend(res.isBackend);
      setError(null);
    }
    setLoading(false);
  };

  const deptAddDemand = async (data: DepartmentDemandData) => {
    setLoading(true);
    const res = await departmentAddDemand(data);
    if (res.data) {
      setCurrentRun(res.data);
      setIsBackend(res.isBackend);
      setError(null);
    }
    setLoading(false);
  };

  const deptUpdateReadiness = async (taskId: string, readinessStatus = 'READY', officerName = 'Senior Section Engineer') => {
    setLoading(true);
    const res = await departmentUpdateReadiness(taskId, readinessStatus, officerName);
    if (res.data) {
      setCurrentRun(res.data);
      setIsBackend(res.isBackend);
      setError(null);
    }
    setLoading(false);
  };

  const deptRequestBlock = async (department: string, section: string, preferredWindow: string, officerName = 'Section Engineer') => {
    setLoading(true);
    const res = await departmentRequestBlock(department, section, preferredWindow, officerName);
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
        overrunBlock,
        injectFreight,
        addCriticalTask,
        rollForward,
        approveCurrentPlan,
        deferCurrentPlan,
        overrideCurrentPlan,
        ackStationImpact,
        escalateStationAlert,
        deptAddDemand,
        deptUpdateReadiness,
        deptRequestBlock,
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
