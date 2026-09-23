import numpy as np
from typing import List, Any
import xgboost as xgb
from ..models.schemas import RankingFeatures
from .feature_builder import extract_feature_matrix
from .train_ranker import train_xgboost_ranker

class TaskXGBoostRanker:
    """
    Genuine XGBoost Ranker for ranking maintenance tasks within a safety tier.
    Note: Safety tiers (P1, P2, P3, P4) are assigned strictly by deterministic railway rules.
    XGBoost is used ONLY to compute continuous ranking scores within each safety tier.
    """
    def __init__(self):
        self.model: xgb.XGBRegressor = train_xgboost_ranker(random_seed=42)
        self.model_version = "xgb-v1.4-synthetic-scr"
        self.features_used = [
            "defect_severity",
            "overdue_days",
            "asset_criticality",
            "traffic_exposure",
            "availability_impact",
        ]

    def predict_scores(self, features_list: List[RankingFeatures]) -> List[float]:
        if not features_list:
            return []
        X = extract_feature_matrix(features_list)
        preds = self.model.predict(X)
        return [float(np.clip(p, 0.0, 100.0)) for p in preds]

    def score_features(self, features: Any) -> float:
        if isinstance(features, dict):
            f_obj = RankingFeatures(**features)
        else:
            f_obj = features
        return self.predict_scores([f_obj])[0]

    def get_metadata(self):
        return {
            "model_type": "XGBoost Regressor (Tree-based Gradient Boosting)",
            "model_version": self.model_version,
            "training_scope": "Synthetic prototype dataset calibrated to South Central Railway standards",
            "features_used": self.features_used,
            "safety_boundary": "Strictly constrained within safety tiers (P1/P2/P3/P4) assigned by rule-based safety classifier.",
        }

task_ranker = TaskXGBoostRanker()
