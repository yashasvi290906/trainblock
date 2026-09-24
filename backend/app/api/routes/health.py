from fastapi import APIRouter
from ...core.config import settings

router = APIRouter()

@router.get("/health")
def health_check():
    return {
        "status": "HEALTHY",
        "service": settings.APP_NAME,
        "version": settings.VERSION,
        "solver_backend": "Google OR-Tools CP-SAT",
        "ml_backend": "XGBoost Regressor",
        "corridor": f"{settings.CORRIDOR_NAME} ({settings.CORRIDOR_CODE})"
    }
