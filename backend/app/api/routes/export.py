from fastapi import APIRouter, Response, Query
from typing import List, Optional
import json
from ...services.planning_service import planning_service
from ...services.export_service import export_service
from ...models.schemas import BdmsExport

router = APIRouter(prefix="/export", tags=["Export"])

@router.get("/bdms", response_model=List[BdmsExport])
def get_bdms_export():
    plan = planning_service.get_latest_plan()
    return export_service.generate_bdms_exports(plan.selected_blocks)

@router.get("/bdms/download")
def download_bdms_export(run_id: Optional[str] = Query(None)):
    plan = planning_service.get_latest_plan()
    exports = export_service.generate_bdms_exports(plan.selected_blocks)
    actual_run_id = run_id or "RUN-2026-001"
    content = json.dumps([e.model_dump() for e in exports], indent=2)
    return Response(
        content=content,
        media_type="application/json",
        headers={
            "Content-Disposition": f'attachment; filename="railblock_bdms_sanction_{actual_run_id}.json"'
        }
    )

@router.get("/bdms/csv")
def download_bdms_csv(run_id: Optional[str] = Query(None)):
    plan = planning_service.get_latest_plan()
    csv_text = export_service.generate_bdms_csv(plan.selected_blocks)
    actual_run_id = run_id or "RUN-2026-001"
    return Response(
        content=csv_text,
        media_type="text/csv",
        headers={
            "Content-Disposition": f'attachment; filename="railblock_bdms_requisition_{actual_run_id}.csv"'
        }
    )

@router.get("/backtest/csv")
def download_backtest_csv():
    csv_text = export_service.generate_backtest_csv()
    return Response(
        content=csv_text,
        media_type="text/csv",
        headers={
            "Content-Disposition": 'attachment; filename="railblock_backtest_benchmark_report.csv"'
        }
    )

@router.get("/validation/certificate")
def download_validation_certificate():
    cert_text = export_service.generate_safety_certificate()
    return Response(
        content=cert_text,
        media_type="text/plain; charset=utf-8",
        headers={
            "Content-Disposition": 'attachment; filename="railblock_8rule_safety_certificate.txt"'
        }
    )
