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

export interface RollingWeekItem {
  week_number: number;
  week_label: string;
  total_demands: number;
  p1_demands: number;
  planned_blocks_count: number;
  reserved_hours: number;
  status: 'EXECUTING' | 'COORDINATED' | 'RESERVED' | 'STRATEGIC';
  change_category: 'COMPLETED' | 'DEFERRED' | 'NEWLY_CRITICAL' | 'SHIFTED' | 'UNCHANGED';
}

export interface RollingProgramme {
  current_week: number;
  total_weeks: number;
  weeks: RollingWeekItem[];
  last_roll_forward?: string | null;
  roll_forward_deltas?: Record<string, number> | null;
}

export interface TimetableStop {
  station_code: string;
  km: number;
  arrival_mins: number;
  departure_mins: number;
  dwell_min: number;
}

export interface CoaTrain {
  train_id: string;
  service_number: string;
  train_name: string;
  train_type: string;
  priority_class: number;
  direction: 'UP' | 'DOWN';
  stops: TimetableStop[];
}

export interface GoodsForecast {
  rake_id: string;
  cargo_type: string;
  origin_station: string;
  destination_station: string;
  direction: 'UP' | 'DOWN';
  target_window_start_mins: number;
  target_window_end_mins: number;
  speed_kmph: number;
  loop_line_stabling_allowed: boolean;
  source_system: string;
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
  rolling_programme?: RollingProgramme | null;
  train_movements?: CoaTrain[];
  freight_forecasts?: GoodsForecast[];
  validation_result: ValidationReport;
  backtest_result: BacktestResult;
  solver_result: BackendSolverResult;
  decision_status: 'PENDING_REVIEW' | 'APPROVED' | 'OVERRIDDEN' | 'REPLANNED' | 'DEFERRED';
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

export async function scenarioOverrunBlock(blockId?: string, overrunMin = 35) {
  return fetchApi<PlanningRun>('/runs/scenarios/overrun', {
    method: 'POST',
    body: JSON.stringify({ block_id: blockId, overrun_min: overrunMin })
  });
}

export async function scenarioInjectFreight(data?: {
  cargo_type?: string;
  origin?: string;
  destination?: string;
  target_window_start?: number;
  target_window_end?: number;
}) {
  return fetchApi<PlanningRun>('/runs/scenarios/inject-freight', {
    method: 'POST',
    body: JSON.stringify(data || {})
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

export async function rollingRollForward() {
  return fetchApi<PlanningRun>('/runs/rolling/roll-forward', { method: 'POST' });
}

export async function approvePlan(plannerName = 'Chief Block Planner', plannerRole = 'Operating / Senior DOM') {
  return fetchApi<PlanningRun>('/runs/decision/approve', {
    method: 'POST',
    body: JSON.stringify({ planner_name: plannerName, planner_role: plannerRole })
  });
}

export async function deferPlan(reason = 'Co-locating with subsequent weekend mega block', officerName = 'Senior DOM / Planning') {
  return fetchApi<PlanningRun>('/runs/decision/defer', {
    method: 'POST',
    body: JSON.stringify({ reason, officer_name: officerName })
  });
}

export async function overridePlan(request: PlannerOverrideRequest) {
  return fetchApi<PlanningRun>('/runs/decision/override', {
    method: 'POST',
    body: JSON.stringify(request)
  });
}

export async function stationMasterAcknowledge(stationCode: string, blockId: string, officerName = 'Station Master') {
  return fetchApi<PlanningRun>('/runs/roles/station-master/acknowledge', {
    method: 'POST',
    body: JSON.stringify({ station_code: stationCode, block_id: blockId, officer_name: officerName })
  });
}

export async function stationMasterEscalate(stationCode: string, reason: string, officerName = 'Station Master') {
  return fetchApi<PlanningRun>('/runs/roles/station-master/escalate', {
    method: 'POST',
    body: JSON.stringify({ station_code: stationCode, reason, officer_name: officerName })
  });
}

export async function departmentAddDemand(data: {
  department: string;
  defect_type: string;
  line: string;
  km_start: number;
  km_end: number;
  duration_min?: number;
  machine_required?: string;
  severity?: number;
}) {
  return fetchApi<PlanningRun>('/runs/roles/department/add-demand', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

export async function departmentUpdateReadiness(taskId: string, readinessStatus = 'READY', officerName = 'Senior Section Engineer') {
  return fetchApi<PlanningRun>('/runs/roles/department/update-readiness', {
    method: 'POST',
    body: JSON.stringify({ task_id: taskId, readiness_status: readinessStatus, officer_name: officerName })
  });
}

export async function departmentRequestBlock(department: string, section: string, preferredWindow: string, officerName = 'Section Engineer') {
  return fetchApi<PlanningRun>('/runs/roles/department/request-block', {
    method: 'POST',
    body: JSON.stringify({ department, section, preferred_window: preferredWindow, officer_name: officerName })
  });
}
