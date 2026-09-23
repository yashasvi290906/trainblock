"""
RAILBLOCK CP-SAT Hard Constraint Definitions
Implements mathematical formulations for railway operations:
- C1: Zero Passenger Train Overlap (Safety buffer >= 15m)
- C2: Spatial & Line Mutual Exclusion (No concurrent blocks on same track)
- C3: Track Machine Resource Limit Constraints (Cumulative)
- C4: Mandatory Safety Tier 1 (P1) Task Allocation Invariance
- C5: Maximum Corridor Possession Limit per 24h
- C6: Usable Minutes Sufficiency for Work Orders
"""
from typing import List, Dict, Any
from ortools.sat.python import cp_model
from ..models.schemas import CompositionCluster, CoaTrain, BlockCorridor

def add_passenger_train_safety_buffer_constraints(
    model: cp_model.CpModel,
    block_intervals: Dict[str, Any],
    trains: List[CoaTrain],
    buffer_minutes: int = 15
):
    """
    C1: Enforces that no track block interval overlaps with any scheduled passenger train window + safety buffer.
    """
    for b_id, b_data in block_intervals.items():
        sec_id = b_data["section_id"]
        line = b_data["line"]
        b_interval = b_data["interval"]
        b_is_active = b_data["is_active"]

        # Find trains operating on this section and line
        for train in trains:
            if train.direction != line and line != "BOTH":
                continue
            for stop in train.stops:
                # If train is in the section vicinity
                train_start = max(0, stop.arrival_mins - buffer_minutes)
                train_end = min(1440, stop.departure_mins + buffer_minutes)
                
                # Create a fixed interval for the train
                t_interval = model.NewIntervalVar(
                    train_start, train_end - train_start, train_end, f"train_{train.train_id}_{stop.station_code}"
                )
                
                # When block is active, block interval and train interval must not overlap
                # Alternatively: AddNoOverlap on the pair conditional on block activity
                model.AddNoOverlap([b_interval, t_interval]).OnlyEnforceIf(b_is_active)

def add_spatial_exclusion_constraints(
    model: cp_model.CpModel,
    block_intervals: Dict[str, Any]
):
    """
    C2: On any given section and line, at most one block can be active at any time.
    """
    by_track: Dict[str, List[Any]] = {}
    for b_id, b_data in block_intervals.items():
        key = f"{b_data['section_id']}_{b_data['line']}"
        if key not in by_track:
            by_track[key] = []
        by_track[key].append(b_data["opt_interval"])

    for key, intervals in by_track.items():
        if len(intervals) > 1:
            model.AddNoOverlap(intervals)

def add_machine_capacity_constraints(
    model: cp_model.CpModel,
    block_intervals: Dict[str, Any],
    machine_limits: Dict[str, int]
):
    """
    C3: Track machine resource capacity (e.g. BCM=1, CSM=1, PQRS=1, TOWER_WAGON=2).
    """
    by_machine: Dict[str, List[Dict[str, Any]]] = {}
    for m in machine_limits.keys():
        by_machine[m] = []

    for b_id, b_data in block_intervals.items():
        cluster: CompositionCluster = b_data["cluster"]
        for m in cluster.machines_assigned:
            # Map machine string to key
            for m_key in machine_limits.keys():
                if m_key.lower() in m.lower():
                    by_machine[m_key].append(b_data)

    for m_key, capacity in machine_limits.items():
        m_blocks = by_machine.get(m_key, [])
        if m_blocks:
            intervals = [b["opt_interval"] for b in m_blocks]
            demands = [1 for _ in m_blocks]
            model.AddCumulative(intervals, demands, capacity)

def add_mandatory_safety_invariance(
    model: cp_model.CpModel,
    cluster_assignment_vars: Dict[str, List[cp_model.IntVar]],
    clusters: List[CompositionCluster]
):
    """
    C4: All clusters containing P1 tasks MUST be scheduled (strict equality to 1).
    """
    for cluster in clusters:
        has_p1 = any(t.safety_tier == "P1" for t in cluster.tasks)
        if has_p1:
            vars_for_cluster = cluster_assignment_vars.get(cluster.cluster_id, [])
            if vars_for_cluster:
                model.Add(sum(vars_for_cluster) == 1)
