"""
RAILBLOCK CP-SAT Objective Formulation
Calculates weights and coefficients for the multi-objective optimization function.
"""
from typing import Dict, List, Any
from ortools.sat.python import cp_model
from ..models.schemas import CompositionCluster

TIER_WEIGHTS = {
    "P1": 50000,
    "P2": 10000,
    "P3": 2000,
    "P4": 500
}

def build_objective_terms(
    model: cp_model.CpModel,
    cluster_assignment_vars: Dict[str, List[Dict[str, Any]]],
    clusters: List[CompositionCluster]
) -> List[Any]:
    """
    Builds weighted objective terms to maximize safety throughput and composition efficiency.
    """
    objective_terms = []

    for cluster in clusters:
        # Base safety tier score
        highest_tier = "P4"
        if any(t.safety_tier == "P1" for t in cluster.tasks):
            highest_tier = "P1"
        elif any(t.safety_tier == "P2" for t in cluster.tasks):
            highest_tier = "P2"
        elif any(t.safety_tier == "P3" for t in cluster.tasks):
            highest_tier = "P3"

        base_weight = TIER_WEIGHTS[highest_tier]
        
        # ML ranking score addition
        ml_bonus = int(sum(t.ml_ranking_score * 1000 for t in cluster.tasks))
        
        # Multi-department synergy bonus (combining multiple depts eliminates duplicate setup)
        synergy_bonus = 0
        if len(cluster.departments) > 1:
            synergy_bonus = len(cluster.departments) * 5000

        total_cluster_weight = base_weight + ml_bonus + synergy_bonus

        # For every candidate block window where this cluster can be assigned
        c_vars = cluster_assignment_vars.get(cluster.cluster_id, [])
        for item in c_vars:
            x_var = item["x_var"]
            # Reward assignment
            objective_terms.append(x_var * total_cluster_weight)
            
            # Small penalty proportional to block duration (encourage tight, efficient possessions)
            dur = item["duration_min"]
            objective_terms.append(x_var * (-1 * dur))

    return objective_terms
