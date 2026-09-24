from fastapi import APIRouter
from typing import Optional
from pydantic import BaseModel
from ...services.run_manager import run_manager
from ...models.schemas import PlanningRun, PlannerOverrideRequest

router = APIRouter(prefix="/runs", tags=["Planning Runs & Scenarios"])

# Request models
class DenyBlockRequest(BaseModel):
    block_id: str

class OverrunBlockRequest(BaseModel):
    block_id: Optional[str] = None
    overrun_min: int = 35

class InjectFreightRequest(BaseModel):
    cargo_type: str = "Automobile / Steel (Special Rake)"
    origin: str = "SEC Yard"
    destination: str = "NDL Goods Depot"
    target_window_start: int = 180
    target_window_end: int = 330

class AddCriticalTaskRequest(BaseModel):
    defect_type: str = "Rail Joint Fracture (Severe USFD)"
    line: str = "DOWN"
    km_start: float = 73.2
    km_end: float = 73.8
    depth_mm: float = 6.8

class ApprovePlanRequest(BaseModel):
    planner_name: str = "Chief Block Planner"
    planner_role: str = "Operating / Senior DOM"

class DeferPlanRequest(BaseModel):
    reason: str = "Co-locating with subsequent weekend mega block"
    officer_name: str = "Senior DOM / Planning"

class StationMasterAcknowledgeRequest(BaseModel):
    station_code: str = "KCG"
    block_id: str
    officer_name: str = "Station Master"

class StationMasterEscalateRequest(BaseModel):
    station_code: str = "KCG"
    reason: str
    officer_name: str = "Station Master"

class DepartmentAddDemandRequest(BaseModel):
    department: str = "Engineering"
    defect_type: str = "Track Geometry Alignment Defect"
    line: str = "DOWN"
    km_start: float = 75.0
    km_end: float = 76.0
    duration_min: int = 45
    machine_required: str = "Duomatic Tamping Machine"
    severity: int = 4

class DepartmentUpdateReadinessRequest(BaseModel):
    task_id: str
    readiness_status: str = "READY"
    officer_name: str = "Senior Section Engineer"

class DepartmentRequestBlockRequest(BaseModel):
    department: str = "Engineering"
    section: str = "WL - NDKD Section"
    preferred_window: str = "02:30–04:30"
    officer_name: str = "Section Engineer"

# -------------------------------------------------------------
# CORE PLANNING RUN ENDPOINTS
# -------------------------------------------------------------

@router.get("/current", response_model=PlanningRun)
def get_current_planning_run():
    if run_manager.current_run is None:
        return run_manager.generate_new_run(is_baseline=True)
    return run_manager.current_run

@router.post("/reset", response_model=PlanningRun)
def reset_demo_to_baseline():
    return run_manager.reset_demo()

@router.post("/replan", response_model=PlanningRun)
def trigger_replan():
    return run_manager.generate_new_run(is_baseline=False)

# -------------------------------------------------------------
# WHAT-IF SCENARIOS
# -------------------------------------------------------------

@router.post("/scenarios/deny-block", response_model=PlanningRun)
def scenario_deny_block(request: DenyBlockRequest):
    return run_manager.apply_block_denial(request.block_id)

@router.post("/scenarios/overrun", response_model=PlanningRun)
def scenario_block_overrun(request: OverrunBlockRequest):
    return run_manager.apply_block_overrun(request.block_id, request.overrun_min)

@router.post("/scenarios/inject-freight", response_model=PlanningRun)
def scenario_inject_freight(request: InjectFreightRequest):
    return run_manager.apply_freight_injection(
        cargo_type=request.cargo_type,
        origin=request.origin,
        destination=request.destination,
        target_window_start=request.target_window_start,
        target_window_end=request.target_window_end
    )

@router.post("/scenarios/add-task", response_model=PlanningRun)
def scenario_add_critical_task(request: AddCriticalTaskRequest):
    return run_manager.add_critical_task(
        defect_type=request.defect_type,
        line=request.line,
        km_start=request.km_start,
        km_end=request.km_end,
        depth_mm=request.depth_mm
    )

# -------------------------------------------------------------
# ROLLING PLANNING
# -------------------------------------------------------------

@router.post("/rolling/roll-forward", response_model=PlanningRun)
def rolling_roll_forward():
    return run_manager.roll_forward_week()

# -------------------------------------------------------------
# DECISION WORKFLOW
# -------------------------------------------------------------

@router.post("/decision/approve", response_model=PlanningRun)
def approve_current_plan(request: ApprovePlanRequest):
    return run_manager.approve_plan(
        planner_name=request.planner_name,
        planner_role=request.planner_role
    )

@router.post("/decision/defer", response_model=PlanningRun)
def defer_current_plan(request: DeferPlanRequest):
    return run_manager.defer_plan(
        reason=request.reason,
        officer_name=request.officer_name
    )

@router.post("/decision/override", response_model=PlanningRun)
def override_current_plan(request: PlannerOverrideRequest):
    return run_manager.override_plan(
        planner_name=request.planner_name,
        planner_role=request.planner_role,
        reason=request.reason,
        new_time=request.new_start_time,
        new_duration=request.new_duration_min
    )

# -------------------------------------------------------------
# ROLE WORKFLOW: STATION MASTER
# -------------------------------------------------------------

@router.post("/roles/station-master/acknowledge", response_model=PlanningRun)
def station_master_acknowledge(request: StationMasterAcknowledgeRequest):
    return run_manager.station_master_acknowledge(
        station_code=request.station_code,
        block_id=request.block_id,
        officer_name=request.officer_name
    )

@router.post("/roles/station-master/escalate", response_model=PlanningRun)
def station_master_escalate(request: StationMasterEscalateRequest):
    return run_manager.station_master_escalate(
        station_code=request.station_code,
        reason=request.reason,
        officer_name=request.officer_name
    )

# -------------------------------------------------------------
# ROLE WORKFLOW: DEPARTMENT
# -------------------------------------------------------------

@router.post("/roles/department/add-demand", response_model=PlanningRun)
def department_add_demand(request: DepartmentAddDemandRequest):
    return run_manager.department_create_demand(
        department=request.department,
        defect_type=request.defect_type,
        line=request.line,
        km_start=request.km_start,
        km_end=request.km_end,
        duration_min=request.duration_min,
        machine_required=request.machine_required,
        severity=request.severity
    )

@router.post("/roles/department/update-readiness", response_model=PlanningRun)
def department_update_readiness(request: DepartmentUpdateReadinessRequest):
    return run_manager.department_update_readiness(
        task_id=request.task_id,
        readiness_status=request.readiness_status,
        officer_name=request.officer_name
    )

@router.post("/roles/department/request-block", response_model=PlanningRun)
def department_request_block(request: DepartmentRequestBlockRequest):
    return run_manager.department_request_block(
        department=request.department,
        section=request.section,
        preferred_window=request.preferred_window,
        officer_name=request.officer_name
    )
