import { fetchApi } from './client';
import { BackendSolverResult } from './planning';
import { ValidationReport } from './validation';
import { BacktestResult } from './analysis';
import { AuditLogEntry, PlannerOverrideRequest } from './decision';

export type { AuditLogEntry, PlannerOverrideRequest };

export interface NormalizedTask {
  task_id: string;
  source_system: 'TMS' | 'SMMS' | 'TDMS';
  source_record_id: string;
  department: 'Engineering' | 'S&T' | 'Traction';
  title: string;
  asset_type: string;
  asset_id: string;
  line: 'UP' | 'DOWN' | 'BOTH';
  km_start: number;
  km_end: number;
  corridor_section_id: string;
  ohe_section_id?: string;
  duration_min: number;
  required_protection: string;
  ohe_required: boolean;
  machine_required: string;
  crew_required: number;
  overdue_days: number;
  safety_tier: 'P1' | 'P2' | 'P3' | 'P4';
  safety_tier_reason: string;
  ml_ranking_score: number;
  within_tier_rank: number;
  ranking_features: {
    defect_severity: number;
    overdue_days: number;
    asset_criticality: number;
    traffic_exposure: number;
    availability_impact: number;
  };
}

export interface JobSequenceItem {
  sequence_order: number;
  task_id: string;
  task_title: string;
  department: string;
  duration_min: number;
  lag_after_min: number;
  lag_reason?: string;
}

export interface CompositionCluster {
  cluster_id: string;
  corridor_section_id: string;
  line: 'UP' | 'DOWN' | 'BOTH';
  km_start: number;
  km_end: number;
  tasks: NormalizedTask[];
  departments: string[];
  total_work_duration_min: number;
  total_sequential_lags_min: number;
  required_block_window_min: number;
  ohe_required: boolean;
  machines_assigned: string[];
  is_compatible: boolean;
  why_combined_reasons: string[];
  why_not_combined_reasons?: string[];
  job_sequence: JobSequenceItem[];
}

export interface PlannedBlock {
  block_id: string;
  corridor: string;
  section: string;
  line: 'UP' | 'DOWN' | 'BOTH';
  km_start: number;
  km_end: number;
  start_time: string;
  end_time: string;
  start_minutes_from_midnight: number;
  end_minutes_from_midnight: number;
  duration_minutes: number;
  usable_minutes_breakdown: {
    raw_possession_minutes: number;
    isolation_minutes: number;
    earthing_minutes: number;
    machine_transit_minutes: number;
    restoration_minutes: number;
    total_overhead_minutes: number;
    usable_work_minutes: number;
    is_sufficient_for_demand: boolean;
    work_demand_minutes: number;
    margin_minutes: number;
  };
  departments: string[];
  tasks: NormalizedTask[];
  protection_type: string;
  ohe_required: boolean;
  machines_assigned: string[];
  crew_count: number;
  train_interactions: Array<{
    train_id: string;
    train_name: string;
    service_number: string;
    train_type: string;
    is_protected: boolean;
    clearance_margin_min: number;
    status: 'PROTECTED' | 'REGULATED' | 'CONFLICT';
  }>;
  bdms_reference: string;
}

export interface MonthlyPlanReservation {
  reservation_id: string;
  corridor_section_id: string;
  day_of_month: number;
  day_name: string;
  week_number: number;
  is_reserved: boolean;
  traffic_shadow_type: string;
  planned_block_hours: number;
}

export interface BdmsExport {
  bdms_reference: string;
  generated_timestamp: string;
  division: string;
  zone: string;
  corridor: string;
  section: string;
  line: string;
  km_start: number;
  km_end: number;
  possession_date: string;
  requested_start_time: string;
  requested_end_time: string;
  duration_minutes: number;
  usable_work_minutes: number;
  protection_type: string;
  ohe_de_energization_required: boolean;
  departments_involved: string[];
  machines_allocated: string[];
  crew_strength: number;
  train_protection_summary: string;
  solver_engine_status: string;
  validation_status: string;
  planning_run_id?: string;
}

export interface PlanningRun {
  planning_run_id: string;
  created_at: string;
  data_version: string;
  scenario_version: string;
  is_baseline: boolean;
  active_scenario?: string | null;
  input_summary: {
    tms_count: number;
    smms_count: number;
    tdms_count: number;
    coa_train_count: number;
    goods_count: number;
    corridors_count: number;
    total_maintenance_demands: number;
    corridor_coverage: string;
    data_status: string;
    prototype_disclaimer: string;
  };
  prioritized_tasks: NormalizedTask[];
  composition_clusters: CompositionCluster[];
  weekly_plan: PlannedBlock[];
  monthly_plan: MonthlyPlanReservation[];
  validation_result: ValidationReport;
  backtest_result: BacktestResult;
  solver_result: BackendSolverResult;
  decision_status: 'PENDING_REVIEW' | 'APPROVED' | 'OVERRIDDEN' | 'REPLANNED';
  approved_by?: string | null;
  approval_timestamp?: string | null;
  override_reason?: string | null;
  bdms_exports: BdmsExport[];
  audit_events: AuditLogEntry[];
}

export async function getCurrentPlanningRun() {
  return fetchApi<PlanningRun>('/runs/current');
}

export async function resetDemoToBaseline() {
  return fetchApi<PlanningRun>('/runs/reset', { method: 'POST' });
}

export async function triggerReplan() {
  return fetchApi<PlanningRun>('/runs/replan', { method: 'POST' });
}

export async function scenarioDenyBlock(blockId: string) {
  return fetchApi<PlanningRun>('/runs/scenarios/deny-block', {
    method: 'POST',
    body: JSON.stringify({ block_id: blockId })
  });
}

export async function scenarioAddCriticalTask(data: {
  defect_type?: string;
  line?: string;
  km_start?: number;
  km_end?: number;
  depth_mm?: number;
}) {
  return fetchApi<PlanningRun>('/runs/scenarios/add-task', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

export async function approvePlan(plannerName = 'Chief Block Planner', plannerRole = 'Operating / Senior DOM') {
  return fetchApi<PlanningRun>('/runs/decision/approve', {
    method: 'POST',
    body: JSON.stringify({ planner_name: plannerName, planner_role: plannerRole })
  });
}

export async function overridePlan(request: PlannerOverrideRequest) {
  return fetchApi<PlanningRun>('/runs/decision/override', {
    method: 'POST',
    body: JSON.stringify(request)
  });
}
