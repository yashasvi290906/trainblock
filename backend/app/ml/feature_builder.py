import numpy as np
from typing import List, Dict, Any
from ..models.schemas import RankingFeatures, NormalizedTask

FEATURE_NAMES = [
    "defect_severity",
    "overdue_days",
    "asset_criticality",
    "traffic_exposure",
    "availability_impact",
]

def extract_features_from_task(task: NormalizedTask) -> Dict[str, float]:
    """
    Computes tabular feature dictionary from a NormalizedTask.
    """
    # Defect severity
    severity = 3.0
    if task.source_system == "TMS":
        severity = 5.0 if "Fracture" in task.title or "USFD" in task.title else 4.0
    elif task.source_system == "SMMS":
        severity = 4.5 if "Point Machine" in task.asset_type else 3.5
    elif task.source_system == "TDMS":
        severity = 4.5 if "Cantilever" in task.asset_type or "Contact Wire" in task.asset_type else 3.5

    # Asset Criticality
    crit = 3.0
    if "USFD" in task.title or "BCM" in task.machine_required:
        crit = 5.0
    elif "Point Machine" in task.asset_type or "Cantilever" in task.asset_type:
        crit = 4.5
    elif "Track Circuit" in task.asset_type or "Section Insulator" in task.asset_type:
        crit = 3.5

    # Traffic Exposure
    traffic = 4.5 if task.line == "DOWN" else (4.0 if task.line == "UP" else 3.5)

    # Availability Impact
    avail_impact = min(5.0, max(1.0, float(task.duration_min) / 25.0))

    return {
        "defect_severity": round(severity, 2),
        "overdue_days": float(task.overdue_days),
        "asset_criticality": round(crit, 2),
        "traffic_exposure": round(traffic, 2),
        "availability_impact": round(avail_impact, 2),
    }

def extract_feature_vector(features: RankingFeatures) -> List[float]:
    """
    Extracts numerical feature vector for the XGBoost / tabular ranker model.
    """
    return [
        float(features.defect_severity),
        float(features.overdue_days),
        float(features.asset_criticality),
        float(features.traffic_exposure),
        float(features.availability_impact),
    ]

def extract_feature_matrix(features_list: List[RankingFeatures]) -> np.ndarray:
    """
    Converts list of ranking features into 2D NumPy feature matrix (N x 5).
    """
    return np.array([extract_feature_vector(f) for f in features_list], dtype=np.float32)
