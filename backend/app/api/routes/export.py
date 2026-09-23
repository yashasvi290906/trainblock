from fastapi import APIRouter
from typing import List
from ...services.planning_service import planning_service
from ...services.export_service import export_service
from ...models.schemas import BdmsExport

router = APIRouter(prefix="/export", tags=["Export"])

@router.get("/bdms", response_model=List[BdmsExport])
def get_bdms_export():
    plan = planning_service.get_latest_plan()
    return export_service.generate_bdms_exports(plan.selected_blocks)
