from fastapi import APIRouter
from ...data.seed_data import (
    TMS_DEFECTS_SEED,
    SMMS_WORK_SEED,
    TDMS_WORK_SEED,
    COA_TIMETABLE_SEED,
    GOODS_FORECASTS_SEED,
    BLOCK_CORRIDORS_SEED
)

router = APIRouter(prefix="/inputs", tags=["Inputs"])

@router.get("/summary")
def get_inputs_summary():
    return {
        "tms_defects_count": len(TMS_DEFECTS_SEED),
        "smms_work_count": len(SMMS_WORK_SEED),
        "tdms_work_count": len(TDMS_WORK_SEED),
        "coa_trains_count": len(COA_TIMETABLE_SEED),
        "goods_forecasts_count": len(GOODS_FORECASTS_SEED),
        "corridors_count": len(BLOCK_CORRIDORS_SEED),
        "total_work_orders": len(TMS_DEFECTS_SEED) + len(SMMS_WORK_SEED) + len(TDMS_WORK_SEED)
    }

@router.get("/tms")
def get_tms_defects():
    return TMS_DEFECTS_SEED

@router.get("/smms")
def get_smms_work():
    return SMMS_WORK_SEED

@router.get("/tdms")
def get_tdms_work():
    return TDMS_WORK_SEED

@router.get("/coa")
def get_coa_timetable():
    return COA_TIMETABLE_SEED

@router.get("/goods")
def get_goods_forecasts():
    return GOODS_FORECASTS_SEED

@router.get("/corridors")
def get_block_corridors():
    return BLOCK_CORRIDORS_SEED
