from fastapi import APIRouter
from typing import List, Dict, Any
from ...models.schemas import PlannerOverrideRequest
from ...services.audit_service import audit_service

router = APIRouter(prefix="/decision", tags=["Decision & Audit"])

@router.get("/audit-log")
def get_audit_log():
    return audit_service.get_logs()

@router.post("/override")
def submit_planner_override(request: PlannerOverrideRequest):
    event = audit_service.record_event(
        event_type="PLANNER_OVERRIDE",
        actor=f"{request.planner_name} ({request.planner_role})",
        details=f"Overrode block timing to {request.new_start_time} ({request.new_duration_min}m). Reason: {request.reason}"
    )
    return {
        "status": "RECORDED",
        "audit_entry": event
    }
