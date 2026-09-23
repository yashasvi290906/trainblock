from fastapi import APIRouter
from ...services.planning_service import planning_service
from ...services.backtest_service import backtest_service
from ...models.schemas import BacktestResult

router = APIRouter(prefix="/analysis", tags=["Analysis"])

@router.get("/backtest", response_model=BacktestResult)
def get_comparative_backtest():
    plan = planning_service.get_latest_plan()
    all_tasks = []
    if "prioritized_tasks" in planning_service.last_pipeline_state:
        all_tasks = planning_service.last_pipeline_state["prioritized_tasks"]
    else:
        all_tasks = [t for b in plan.selected_blocks for t in b.tasks] + plan.unassigned_tasks

    return backtest_service.compute_backtest(plan.selected_blocks, all_tasks)
