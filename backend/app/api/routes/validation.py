from fastapi import APIRouter
from ...services.planning_service import planning_service
from ...services.validation_service import validation_service
from ...models.schemas import ValidationReport

router = APIRouter(prefix="/validation", tags=["Validation"])

@router.get("/report", response_model=ValidationReport)
def get_validation_report():
    plan = planning_service.get_latest_plan()
    return validation_service.validate_plan(plan.selected_blocks)
