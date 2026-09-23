import numpy as np
import xgboost as xgb
from typing import List, Tuple
from ..models.schemas import RankingFeatures
from .feature_builder import extract_feature_matrix

def generate_synthetic_training_data(n_samples: int = 500, random_seed: int = 42) -> Tuple[np.ndarray, np.ndarray]:
    """
    Generates deterministic synthetic training pairs for training the XGBoost ranker within safety tiers.
    Target: ground-truth maintenance urgency score (0 - 100).
    """
    rng = np.random.default_rng(random_seed)
    
    # 1. Defect severity (1 - 10)
    severity = rng.uniform(1.0, 10.0, n_samples)
    # 2. Overdue days (0 - 30)
    overdue = rng.uniform(0.0, 30.0, n_samples)
    # 3. Asset criticality (1 - 10)
    criticality = rng.uniform(4.0, 10.0, n_samples)
    # 4. Traffic exposure (10 - 60 trains/day)
    traffic = rng.uniform(10.0, 60.0, n_samples)
    # 5. Availability impact (1 - 10)
    impact = rng.uniform(2.0, 10.0, n_samples)

    X = np.column_stack([severity, overdue, criticality, traffic, impact])

    # Ground-truth continuous target with non-linear interaction terms
    y = (
        severity * 3.6 +
        np.minimum(overdue, 15.0) * 2.4 +
        criticality * 2.1 +
        (traffic / 50.0) * 10.5 +
        impact * 2.2 +
        (severity * overdue / 40.0)
    )
    y = np.clip(y, 0.0, 100.0)
    return X, y

def train_xgboost_ranker(random_seed: int = 42) -> xgb.XGBRegressor:
    """
    Trains a real XGBoost regressor for within-tier ranking.
    """
    X_train, y_train = generate_synthetic_training_data(n_samples=600, random_seed=random_seed)
    
    model = xgb.XGBRegressor(
        n_estimators=40,
        max_depth=4,
        learning_rate=0.1,
        random_state=random_seed,
        verbosity=0,
        tree_method="hist",
    )
    model.fit(X_train, y_train)
    return model
