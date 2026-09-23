from typing import List, Tuple
from ..models.schemas import NormalizedTask, RankingFeatures
from ..ml.feature_builder import extract_features_from_task
from ..ml.ranker import task_ranker

class PrioritizationService:
    """
    Deterministic Safety Classifier + XGBoost Tabular Ranker within tiers.
    Safety rule tiers (P1, P2, P3, P4) are strictly non-negotiable.
    XGBoost is applied only to rank tasks WITHIN their assigned safety tier.
    """

    def evaluate_safety_tier(self, task: NormalizedTask) -> Tuple[str, str]:
        """
        Applies deterministic Indian Railways safety rules.
        Returns (safety_tier, safety_tier_reason).
        """
        # P1 Conditions (Emergency / High-Risk Safety Flaws)
        if "USFD" in task.title and task.overdue_days >= 3:
            return "P1", "P1: Ultrasonic Flaw Detection defect with critical progression risk"
        if task.overdue_days >= 10:
            return "P1", f"P1: Mandatory safety compliance overdue by {task.overdue_days} days (>10d threshold)"
        if "Turnout" in task.asset_type or "Switch" in task.asset_type:
            if task.overdue_days >= 5 or task.required_protection == "Absolute Traffic Block":
                return "P1", "P1: Critical interlocking switch/turnout safety integrity"
        if "OHE" in task.asset_type and ("Cantilever" in task.title or "Contact Wire" in task.title) and task.overdue_days >= 5:
            return "P1", "P1: Traction contact wire structural integrity / dewiring hazard"

        # P2 Conditions (Urgent Corrective & Key Track Geometry)
        if task.overdue_days >= 5:
            return "P2", f"P2: Maintenance overdue by {task.overdue_days} days (5-9d threshold)"
        if "BCM" in task.machine_required or "Tamping" in task.machine_required:
            return "P2", "P2: Track geometry / ballast cushion degradation requiring machine block"
        if task.department == "S&T" and task.overdue_days >= 3:
            return "P2", "P2: Signalling & Telecommunication track circuit / axle counter reliability"
        if task.ohe_required and task.overdue_days >= 3:
            return "P2", "P2: Power block traction overhead equipment periodic safety check"

        # P3 Conditions (Scheduled Preventive & Routine Renewals)
        if task.overdue_days >= 1:
            return "P3", f"P3: Preventive maintenance cycle overdue by {task.overdue_days} days"
        if "Weld" in task.title or "Insulator" in task.title:
            return "P3", "P3: Preventive component rehabilitation and thermal stress neutralisation"

        # P4 Conditions (Routine Patrol & General Asset Cleanliness)
        return "P4", "P4: Standard scheduled maintenance window"

    def prioritize_tasks(self, tasks: List[NormalizedTask]) -> List[NormalizedTask]:
        """
        Evaluates safety tier, extracts ML features, scores via XGBoost,
        and assigns strictly bounded within-tier ranks.
        """
        scored_tasks: List[NormalizedTask] = []
        
        for task in tasks:
            # Step 1: Deterministic Safety Rule
            tier, reason = self.evaluate_safety_tier(task)
            task.safety_tier = tier  # type: ignore
            task.safety_tier_reason = reason

            # Step 2: Feature Extraction
            features_dict = extract_features_from_task(task)
            task.ranking_features = RankingFeatures(**features_dict)

            # Step 3: XGBoost ML continuous ranking score
            score = task_ranker.score_features(features_dict)
            task.ml_ranking_score = score
            scored_tasks.append(task)

        # Step 4: Group by Safety Tier and rank within tier
        tier_buckets = {"P1": [], "P2": [], "P3": [], "P4": []}
        for task in scored_tasks:
            tier_buckets[task.safety_tier].append(task)

        prioritized_list: List[NormalizedTask] = []
        for tier in ["P1", "P2", "P3", "P4"]:
            bucket = tier_buckets[tier]
            # Higher XGBoost score = higher priority within the tier
            bucket.sort(key=lambda t: t.ml_ranking_score, reverse=True)
            for rank_idx, task in enumerate(bucket, start=1):
                task.within_tier_rank = rank_idx
                prioritized_list.append(task)

        return prioritized_list

prioritization_service = PrioritizationService()
