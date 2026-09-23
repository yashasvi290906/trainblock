from fastapi import APIRouter, Query
from ...services.planning_service import planning_service
from ...models.schemas import SolverResult

router = APIRouter(prefix="/planning", tags=["Planning"])

@router.post("/run", response_model=SolverResult)
def run_full_planning_pipeline(time_limit: float = Query(10.0, ge=1.0, le=60.0)):
    return planning_service.run_pipeline(time_limit_sec=time_limit)

@router.get("/latest", response_model=SolverResult)
def get_latest_planning_result():
    return planning_service.get_latest_plan()
