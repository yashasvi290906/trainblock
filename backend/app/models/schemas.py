from typing import List, Optional, Literal, Dict, Any
from pydantic import BaseModel, Field

# -------------------------------------------------------------
# 1. SIX CANONICAL INPUT SCHEMAS
# -------------------------------------------------------------

class TmsDefect(BaseModel):
    id: str
    defect_type: str
    line: Literal["UP", "DOWN", "BOTH"]
    km_start: float
    km_end: float
    depth_mm: Optional[float] = None
    severity: int = Field(ge=1, le=5)
    overdue_days: int
    speed_restriction_kmph: Optional[int] = None
    detection_method: str
    ingested_at: str

class SmmsWork(BaseModel):
    id: str
    asset_type: str
    asset_id: str
    station_code: str
    km_location: float
    line: Literal["UP", "DOWN", "BOTH"]
    maintenance_type: str
    duration_min: int
    overdue_days: int
    criticality: Literal["Critical", "High", "Medium", "Low"]
    requires_power_isolation: bool
    ingested_at: str

class TdmsWork(BaseModel):
    id: str
    asset_type: str
    substation_code: str
    ohe_section_id: str
    km_start: float
    km_end: float
    line: Literal["UP", "DOWN", "BOTH"]
    work_type: str
    duration_min: int
    power_block_required: bool
    overdue_days: int
    criticality: Literal["Critical", "High", "Medium", "Low"]
    ingested_at: str

class TimetableStop(BaseModel):
    station_code: str
    km: float
    arrival_mins: int
    departure_mins: int
    dwell_min: int

class CoaTrain(BaseModel):
    train_id: str
    service_number: str
    train_name: str
    train_type: str
    priority_class: int
    direction: Literal["UP", "DOWN"]
    stops: List[TimetableStop]

class GoodsForecast(BaseModel):
    rake_id: str
    cargo_type: str
    origin_station: str
    destination_station: str
    direction: Literal["UP", "DOWN"]
    target_window_start_mins: int
    target_window_end_mins: int
    speed_kmph: float
    loop_line_stabling_allowed: bool
    source_system: str

class BlockCorridor(BaseModel):
    section_id: str
    name: str
    km_start: float
    km_end: float
    lines: List[str]
    crossover_km: List[float]
    traction_feeder_post: str
    station_interlockings: List[str]
    max_daily_block_window_min: int
    nominal_isolation_min: int = 10
    nominal_earthing_min: int = 10
    nominal_transit_min: int = 5
    nominal_restoration_min: int = 5

# -------------------------------------------------------------
# 2. NORMALIZED UNIFIED TASK MODEL
# -------------------------------------------------------------

class RankingFeatures(BaseModel):
    defect_severity: float
    overdue_days: float
    asset_criticality: float
    traffic_exposure: float
    availability_impact: float

class NormalizedTask(BaseModel):
    task_id: str
    source_system: Literal["TMS", "SMMS", "TDMS"]
    source_record_id: str
    department: Literal["Engineering", "S&T", "Traction"]
    title: str
    asset_type: str
    asset_id: str
    line: Literal["UP", "DOWN", "BOTH"]
    km_start: float
    km_end: float
    corridor_section_id: str
    ohe_section_id: Optional[str] = None
    duration_min: int
    required_protection: str
    ohe_required: bool
    machine_required: str
    crew_required: int
    overdue_days: int
    
    # Priority & ML outputs
    safety_tier: Literal["P1", "P2", "P3", "P4"]
    safety_tier_reason: str
    ml_ranking_score: float
    within_tier_rank: int
    ranking_features: RankingFeatures

# -------------------------------------------------------------
# 3. COMPOSITION & USABLE MINUTES
# -------------------------------------------------------------

class JobSequenceItem(BaseModel):
    sequence_order: int
    task_id: str
    task_title: str
    department: str
    duration_min: int
    lag_after_min: int
    lag_reason: Optional[str] = None

class UsableMinutesDecomposition(BaseModel):
    raw_possession_minutes: int
    isolation_minutes: int
    earthing_minutes: int
    machine_transit_minutes: int
    restoration_minutes: int
    total_overhead_minutes: int
    usable_work_minutes: int
    is_sufficient_for_demand: bool
    work_demand_minutes: int
    margin_minutes: int

class CompositionCluster(BaseModel):
    cluster_id: str
    corridor_section_id: str
    line: Literal["UP", "DOWN", "BOTH"]
    km_start: float
    km_end: float
    tasks: List[NormalizedTask]
    departments: List[str]
    total_work_duration_min: int
    total_sequential_lags_min: int
    required_block_window_min: int
    ohe_required: bool
    machines_assigned: List[str]
    is_compatible: bool
    why_combined_reasons: List[str]
    why_not_combined_reasons: Optional[List[str]] = None
    job_sequence: List[JobSequenceItem]

# -------------------------------------------------------------
# 4. SOLVER & INTEGRATED PLAN
# -------------------------------------------------------------

class TrainInteraction(BaseModel):
    train_id: str
    train_name: str
    service_number: str
    train_type: str
    is_protected: bool
    clearance_margin_min: int
    status: Literal["PROTECTED", "REGULATED", "CONFLICT"]

class PlannedBlock(BaseModel):
    block_id: str
    corridor: str
    section: str
    line: Literal["UP", "DOWN", "BOTH"]
    km_start: float
    km_end: float
    start_time: str
    end_time: str
    start_minutes_from_midnight: int
    end_minutes_from_midnight: int
    duration_minutes: int
    usable_minutes_breakdown: UsableMinutesDecomposition
    departments: List[str]
    tasks: List[NormalizedTask]
    protection_type: str
    ohe_required: bool
    machines_assigned: List[str]
    crew_count: int
    train_interactions: List[TrainInteraction]
    bdms_reference: str

class SolverResult(BaseModel):
    solver_status: Literal["OPTIMAL", "FEASIBLE", "TIME_LIMIT", "INFEASIBLE"]
    solve_time_ms: float
    iterations: int
    objective_score: float
    hard_constraints_satisfied: int
    total_hard_constraints: int
    selected_blocks: List[PlannedBlock]
    unassigned_tasks: List[NormalizedTask]

# -------------------------------------------------------------
# 5. VALIDATION & BACKTEST
# -------------------------------------------------------------

class ValidationCheck(BaseModel):
    rule_id: str
    name: str
    category: str
    passed: bool
    severity: Literal["CRITICAL", "WARNING", "INFO"]
    details: str

class ValidationReport(BaseModel):
    overall_status: Literal["VALIDATED", "FAILED", "WARNING"]
    passed_checks_count: int
    total_checks_count: int
    checks: List[ValidationCheck]
    validated_at: str

class BacktestMetrics(BaseModel):
    total_blocks: int
    total_blocked_minutes: int
    total_usable_work_minutes: int
    work_minutes_per_blocked_minute: float
    passenger_train_delays_min: int
    unresolved_passenger_conflicts: int
    critical_backlog_cleared_percent: float
    asset_availability_score: float
    repeated_track_possessions: int

class BacktestResult(BaseModel):
    dataset_name: str
    total_input_work_orders: int
    corridor_length_km: float
    siloed_baseline: BacktestMetrics
    integrated_railblock: BacktestMetrics
    delta: Dict[str, Any]

# -------------------------------------------------------------
# 6. DECISION, OVERRIDE & BDMS EXPORT
# -------------------------------------------------------------

class PlannerOverrideRequest(BaseModel):
    planner_name: str
    planner_role: str
    reason: str
    new_start_time: str
    new_duration_min: int

class BdmsExport(BaseModel):
    bdms_reference: str
    generated_timestamp: str
    division: str
    zone: str
    corridor: str
    section: str
    line: str
    km_start: float
    km_end: float
    possession_date: str
    requested_start_time: str
    requested_end_time: str
    duration_minutes: int
    usable_work_minutes: int
    protection_type: str
    ohe_de_energization_required: bool
    departments_involved: List[str]
    machines_allocated: List[str]
    crew_strength: int
    train_protection_summary: str
    solver_engine_status: str
    validation_status: str
    planning_run_id: Optional[str] = "RUN-2026-001"

# -------------------------------------------------------------
# 7. UNIFIED PLANNING RUN STATE & ROLLING BLOCKS
# -------------------------------------------------------------

class MonthlyPlanReservation(BaseModel):
    reservation_id: str
    corridor_section_id: str
    day_of_month: int
    day_name: str
    week_number: int
    is_reserved: bool
    traffic_shadow_type: str
    planned_block_hours: float

class AuditLogEntry(BaseModel):
    log_id: str
    timestamp: str
    event_type: str
    actor: str
    details: str
    planning_run_id: str

class PlanningRun(BaseModel):
    planning_run_id: str
    created_at: str
    data_version: str
    scenario_version: str
    is_baseline: bool
    active_scenario: Optional[str] = None
    input_summary: Dict[str, Any]
    prioritized_tasks: List[NormalizedTask]
    composition_clusters: List[CompositionCluster]
    weekly_plan: List[PlannedBlock]
    monthly_plan: List[MonthlyPlanReservation]
    validation_result: ValidationReport
    backtest_result: BacktestResult
    solver_result: SolverResult
    decision_status: Literal["PENDING_REVIEW", "APPROVED", "OVERRIDDEN", "REPLANNED"]
    approved_by: Optional[str] = None
    approval_timestamp: Optional[str] = None
    override_reason: Optional[str] = None
    bdms_exports: List[BdmsExport]
    audit_events: List[AuditLogEntry]

