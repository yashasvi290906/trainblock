from typing import Dict, Any, Optional
from ..data.seed_data import (
    TMS_DEFECTS_SEED,
    SMMS_WORK_SEED,
    TDMS_WORK_SEED,
    COA_TIMETABLE_SEED,
    GOODS_FORECASTS_SEED,
    BLOCK_CORRIDORS_SEED
)
from .ingestion_service import ingestion_service
from .prioritization_service import prioritization_service
from .composition_service import composition_service
from ..optimization.cp_sat_planner import cp_sat_planner
from ..models.schemas import SolverResult

class PlanningService:
    """
    Central orchestration service for the RAILBLOCK automatic planning pipeline.
    Connects the 6 Ingestion Feeds -> Linear Location Referencing -> Deterministic Safety & ML Prioritization -> Multi-Dept Composition -> CP-SAT Mathematical Optimization.
    """

    def __init__(self):
        self.cached_result: Optional[SolverResult] = None
        self.last_pipeline_state: Dict[str, Any] = {}

    def run_pipeline(self, time_limit_sec: float = 10.0) -> SolverResult:
        """
        Executes complete end-to-end planning cycle.
        """
        # 1. Ingestion
        tasks = ingestion_service.ingest_all(
            tms_data=TMS_DEFECTS_SEED,
            smms_data=SMMS_WORK_SEED,
            tdms_data=TDMS_WORK_SEED,
            corridors=BLOCK_CORRIDORS_SEED
        )

        # 2. Prioritization (Safety Tier + XGBoost ML ranker)
        prioritized_tasks = prioritization_service.prioritize_tasks(tasks)

        # 3. Composition (Spatial clustering + Engineering Precedence + Usable Minutes)
        clusters = composition_service.compose_tasks(prioritized_tasks)

        # 4. CP-SAT Mathematical Optimization
        result = cp_sat_planner.solve(
            clusters=clusters,
            trains=COA_TIMETABLE_SEED,
            goods_forecasts=GOODS_FORECASTS_SEED,
            corridors=BLOCK_CORRIDORS_SEED,
            time_limit_sec=time_limit_sec
        )

        self.cached_result = result
        self.last_pipeline_state = {
            "total_tasks": len(tasks),
            "prioritized_tasks": prioritized_tasks,
            "clusters": clusters,
            "result": result
        }

        return result

    def get_latest_plan(self) -> SolverResult:
        if self.cached_result is None:
            return self.run_pipeline()
        return self.cached_result

planning_service = PlanningService()
