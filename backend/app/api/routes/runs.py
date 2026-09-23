from fastapi import APIRouter, Body
from typing import Dict, Any, Optional
from pydantic import BaseModel
from ...services.run_manager import run_manager
from ...models.schemas import PlanningRun, PlannerOverrideRequest

router = APIRouter(prefix="/runs", tags=["Planning Runs & Scenarios"])

class DenyBlockRequest(BaseModel):
    block_id: str

class AddCriticalTaskRequest(BaseModel):
    defect_type: str = "Rail Joint Fracture (Severe USFD)"
    line: str = "DOWN"
    km_start: float = 73.2
    km_end: float = 73.8
    depth_mm: float = 6.8

class ApprovePlanRequest(BaseModel):
    planner_name: str = "Chief Block Planner"
    planner_role: str = "Operating / Senior DOM"

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

@router.post("/scenarios/deny-block", response_model=PlanningRun)
def scenario_deny_block(request: DenyBlockRequest):
    return run_manager.apply_block_denial(request.block_id)

@router.post("/scenarios/add-task", response_model=PlanningRun)
def scenario_add_critical_task(request: AddCriticalTaskRequest):
    return run_manager.add_critical_task(
        defect_type=request.defect_type,
        line=request.line,
        km_start=request.km_start,
        km_end=request.km_end,
        depth_mm=request.depth_mm
    )

@router.post("/decision/approve", response_model=PlanningRun)
def approve_current_plan(request: ApprovePlanRequest):
    return run_manager.approve_plan(
        planner_name=request.planner_name,
        planner_role=request.planner_role
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
