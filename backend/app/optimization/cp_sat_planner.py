import time
from typing import List, Dict, Tuple, Any, Optional
from ortools.sat.python import cp_model

from ..models.schemas import (
    CompositionCluster,
    CoaTrain,
    GoodsForecast,
    BlockCorridor,
    PlannedBlock,
    SolverResult,
    NormalizedTask,
    TrainInteraction,
    UsableMinutesDecomposition
)
from ..core.config import settings
from .constraints import (
    add_passenger_train_safety_buffer_constraints,
    add_spatial_exclusion_constraints,
    add_machine_capacity_constraints,
    add_mandatory_safety_invariance
)
from .objectives import build_objective_terms

class CpSatPlanner:
    """
    Google OR-Tools CP-SAT Planning Engine for Automatic Railway Block Scheduling.
    Satisfies Problem Statement 26027 constraints with mathematical optimality.
    """

    def _generate_candidate_windows(self, corridors: List[BlockCorridor]) -> List[Dict[str, Any]]:
        """
        Generates candidate block opportunity windows across corridor sections and lines.
        Standard IR maintenance slots:
        1. Early Night Slot: 00:15 - 02:15 (15 to 135 mins)
        2. Deep Night Slot: 02:30 - 05:00 (150 to 300 mins)
        3. Morning Inter-Express Slot: 08:30 - 11:00 (510 to 660 mins)
        4. Midday Shadow Window: 11:30 - 14:00 (690 to 840 mins)
        5. Afternoon Secondary Slot: 14:30 - 17:00 (870 to 1020 mins)
        6. Evening Slot: 21:00 - 23:45 (1260 to 1425 mins)
        """
        slots = [
            {"name": "Night-Mega-Block", "start": 30, "end": 270, "duration": 240, "start_str": "00:30", "end_str": "04:30"},
            {"name": "Early-Night", "start": 15, "end": 150, "duration": 135, "start_str": "00:15", "end_str": "02:30"},
            {"name": "Deep-Night", "start": 150, "end": 300, "duration": 150, "start_str": "02:30", "end_str": "05:00"},
            {"name": "Secondary-Night", "start": 180, "end": 420, "duration": 240, "start_str": "03:00", "end_str": "07:00"},
            {"name": "Morning-Slot", "start": 510, "end": 675, "duration": 165, "start_str": "08:30", "end_str": "11:15"},
            {"name": "Midday-Mega-Block", "start": 645, "end": 870, "duration": 225, "start_str": "10:45", "end_str": "14:30"},
            {"name": "Afternoon-Slot", "start": 870, "end": 1050, "duration": 180, "start_str": "14:30", "end_str": "17:30"},
            {"name": "Late-Afternoon-Mega", "start": 960, "end": 1200, "duration": 240, "start_str": "16:00", "end_str": "20:00"},
            {"name": "Evening-Slot", "start": 1245, "end": 1425, "duration": 180, "start_str": "20:45", "end_str": "23:45"}
        ]
        
        candidates = []
        w_id = 1
        for corr in corridors:
            for line in ["UP", "DOWN"]:
                for slot in slots:
                    candidates.append({
                        "window_id": f"WIN-{w_id:03d}",
                        "section_id": corr.section_id,
                        "km_start": corr.km_start,
                        "km_end": corr.km_end,
                        "line": line,
                        "start_min": slot["start"],
                        "end_min": slot["end"],
                        "duration_min": slot["duration"],
                        "start_str": slot["start_str"],
                        "end_str": slot["end_str"],
                        "slot_name": slot["name"]
                    })
                    w_id += 1
        return candidates

    def _evaluate_train_conflicts(
        self,
        window: Dict[str, Any],
        trains: List[CoaTrain],
        buffer_min: int = 15
    ) -> Tuple[bool, List[TrainInteraction]]:
        """
        Evaluates whether a candidate window has passenger train conflicts and generates interactions.
        Checks train passage specifically within the section's spatial span.
        """
        has_conflict = False
        interactions: List[TrainInteraction] = []

        w_start = window["start_min"]
        w_end = window["end_min"]
        w_line = window["line"]
        sec_km_start = window.get("km_start", 0.0)
        sec_km_end = window.get("km_end", 150.0)

        for train in trains:
            if train.direction != w_line and w_line != "BOTH":
                continue
            
            # Check stops that fall inside or adjacent to this section
            for stop in train.stops:
                if stop.km < (sec_km_start - 6.0) or stop.km > (sec_km_end + 6.0):
                    continue

                t_arr = stop.arrival_mins
                t_dep = stop.departure_mins

                # Check overlap with safety buffer
                buffered_start = max(0, t_arr - buffer_min)
                buffered_end = min(1440, t_dep + buffer_min)

                if max(w_start, buffered_start) < min(w_end, buffered_end):
                    has_conflict = True
                    margin = min(abs(w_start - t_dep), abs(t_arr - w_end))
                    interactions.append(TrainInteraction(
                        train_id=train.train_id,
                        train_name=train.train_name,
                        service_number=train.service_number,
                        train_type=train.train_type,
                        is_protected=True,
                        clearance_margin_min=margin,
                        status="CONFLICT"
                    ))
                else:
                    # Near miss / protected train
                    margin = min(abs(w_start - t_dep), abs(t_arr - w_end))
                    if margin <= 45:
                        interactions.append(TrainInteraction(
                            train_id=train.train_id,
                            train_name=train.train_name,
                            service_number=train.service_number,
                            train_type=train.train_type,
                            is_protected=True,
                            clearance_margin_min=margin,
                            status="PROTECTED"
                        ))

        return has_conflict, interactions

    def solve(
        self,
        clusters: List[CompositionCluster],
        trains: List[CoaTrain],
        goods_forecasts: List[GoodsForecast],
        corridors: List[BlockCorridor],
        time_limit_sec: float = 10.0,
        denied_block_ids: Optional[List[str]] = None,
        denied_windows: Optional[List[Dict[str, Any]]] = None
    ) -> SolverResult:
        """
        Executes CP-SAT solver to find optimal non-conflicting block schedule.
        """
        start_time = time.time()
        model = cp_model.CpModel()
        candidate_windows = self._generate_candidate_windows(corridors)
        denied_ids = set(denied_block_ids or [])
        denied_win_specs = denied_windows or []

        # Dictionary of cluster_id -> list of candidate assignment variable dicts
        cluster_assignment_vars: Dict[str, List[Dict[str, Any]]] = {c.cluster_id: [] for c in clusters}
        # Dictionary of window_id -> list of cluster assignment variables assigned to this window
        window_cluster_vars: Dict[str, List[cp_model.IntVar]] = {w["window_id"]: [] for w in candidate_windows}
        
        # Track valid candidate pairs
        candidate_pair_map: Dict[str, Dict[str, Any]] = {}

        for cluster in clusters:
            for win in candidate_windows:
                # Spatial matching: cluster section and line must match candidate window
                if cluster.corridor_section_id != win["section_id"]:
                    continue
                if cluster.line != win["line"] and cluster.line != "BOTH":
                    continue
                
                # Check if window duration is sufficient for required block window
                if win["duration_min"] < cluster.required_block_window_min:
                    continue

                # Check passenger train conflict
                has_conflict, interactions = self._evaluate_train_conflicts(win, trains, settings.MIN_HEADWAY_BUFFER_MIN)
                if has_conflict:
                    continue

                # Valid candidate! Create binary decision variable x_{c,w}
                var_name = f"x_{cluster.cluster_id}_{win['window_id']}"
                x_var = model.NewBoolVar(var_name)

                # Check if this cluster/window is denied
                is_denied = False
                if any(did in var_name or did == cluster.cluster_id or did == win["window_id"] for did in denied_ids):
                    is_denied = True
                
                if not is_denied and denied_win_specs:
                    for dw in denied_win_specs:
                        if (win["section_id"] == dw.get("section_id") and
                            (win["line"] == dw.get("line") or dw.get("line") == "BOTH") and
                            abs(win["start_min"] - dw.get("start_min", -9999)) < 45):
                            is_denied = True
                            break

                if is_denied:
                    model.Add(x_var == 0)
                
                record = {
                    "x_var": x_var,
                    "cluster": cluster,
                    "window": win,
                    "duration_min": win["duration_min"],
                    "interactions": interactions
                }
                cluster_assignment_vars[cluster.cluster_id].append(record)
                window_cluster_vars[win["window_id"]].append(x_var)
                candidate_pair_map[var_name] = record

        # Constraint 1: Each cluster assigned AT MOST ONCE
        for cluster in clusters:
            vars_for_c = [r["x_var"] for r in cluster_assignment_vars[cluster.cluster_id]]
            if vars_for_c:
                model.Add(sum(vars_for_c) <= 1)

        # Constraint 2: Mandatory Safety Tier 1 (P1) Allocation Invariance (Strictly prioritized with penalty)
        p1_penalties = []
        for cluster in clusters:
            has_p1 = any(t.safety_tier == "P1" for t in cluster.tasks)
            if has_p1:
                vars_for_c = [r["x_var"] for r in cluster_assignment_vars[cluster.cluster_id]]
                if vars_for_c:
                    unassigned_var = model.NewBoolVar(f"p1_unassigned_{cluster.cluster_id}")
                    model.Add(sum(vars_for_c) + unassigned_var == 1)
                    p1_penalties.append(unassigned_var * (-1000000))

        # Constraint 3: At most ONE cluster per candidate window
        for win_id, vars_for_w in window_cluster_vars.items():
            if len(vars_for_w) > 1:
                model.Add(sum(vars_for_w) <= 1)

        # Constraint 4: Temporal Non-Overlap between any overlapping windows on the same track
        for i, w1 in enumerate(candidate_windows):
            vars_w1 = window_cluster_vars.get(w1["window_id"], [])
            if not vars_w1:
                continue
            for j in range(i + 1, len(candidate_windows)):
                w2 = candidate_windows[j]
                vars_w2 = window_cluster_vars.get(w2["window_id"], [])
                if not vars_w2:
                    continue
                if w1["section_id"] == w2["section_id"] and (w1["line"] == w2["line"] or w1["line"] == "BOTH" or w2["line"] == "BOTH"):
                    # Check if the time intervals overlap
                    if max(w1["start_min"], w2["start_min"]) < min(w1["end_min"], w2["end_min"]):
                        model.Add(sum(vars_w1) + sum(vars_w2) <= 1)

        # Build Multi-Objective Function
        objective_terms = build_objective_terms(model, cluster_assignment_vars, clusters)
        if p1_penalties:
            objective_terms.extend(p1_penalties)
        if objective_terms:
            model.Maximize(sum(objective_terms))

        # Solve model
        solver = cp_model.CpSolver()
        solver.parameters.max_time_in_seconds = time_limit_sec
        solver.parameters.num_search_workers = 4
        
        status_code = solver.Solve(model)
        solve_time_ms = (time.time() - start_time) * 1000.0

        status_str_map = {
            cp_model.OPTIMAL: "OPTIMAL",
            cp_model.FEASIBLE: "FEASIBLE",
            cp_model.MODEL_INVALID: "INFEASIBLE",
            cp_model.INFEASIBLE: "INFEASIBLE",
            cp_model.UNKNOWN: "TIME_LIMIT"
        }
        solver_status = status_str_map.get(status_code, "FEASIBLE")

        # Extract results
        selected_blocks: List[PlannedBlock] = []
        assigned_cluster_ids = set()
        block_counter = 1

        for var_name, record in candidate_pair_map.items():
            if solver.Value(record["x_var"]) == 1:
                cluster: CompositionCluster = record["cluster"]
                win: Dict[str, Any] = record["window"]
                assigned_cluster_ids.add(cluster.cluster_id)

                iso = settings.NOMINAL_ISOLATION_MIN
                earth = settings.NOMINAL_EARTHING_MIN
                transit = settings.NOMINAL_TRANSIT_MIN
                restore = settings.NOMINAL_RESTORATION_MIN
                overhead = iso + earth + transit + restore
                usable = win["duration_min"] - overhead

                usable_decomp = UsableMinutesDecomposition(
                    raw_possession_minutes=win["duration_min"],
                    isolation_minutes=iso,
                    earthing_minutes=earth,
                    machine_transit_minutes=transit,
                    restoration_minutes=restore,
                    total_overhead_minutes=overhead,
                    usable_work_minutes=usable,
                    is_sufficient_for_demand=usable >= cluster.total_work_duration_min,
                    work_demand_minutes=cluster.total_work_duration_min,
                    margin_minutes=usable - cluster.total_work_duration_min
                )

                planned_b = PlannedBlock(
                    block_id=f"BLK-2026-{(100 + block_counter):03d}",
                    corridor=f"CORR-SEC-NDL",
                    section=cluster.corridor_section_id,
                    line=cluster.line,
                    km_start=cluster.km_start,
                    km_end=cluster.km_end,
                    start_time=win["start_str"],
                    end_time=win["end_str"],
                    start_minutes_from_midnight=win["start_min"],
                    end_minutes_from_midnight=win["end_min"],
                    duration_minutes=win["duration_min"],
                    usable_minutes_breakdown=usable_decomp,
                    departments=cluster.departments,
                    tasks=cluster.tasks,
                    protection_type="Absolute Traffic Block with Power Block" if cluster.ohe_required else "Absolute Traffic Block",
                    ohe_required=cluster.ohe_required,
                    machines_assigned=cluster.machines_assigned,
                    crew_count=sum(t.crew_required for t in cluster.tasks),
                    train_interactions=record["interactions"],
                    bdms_reference=f"BDMS/SCR/SC/2026/{block_counter:04d}"
                )
                selected_blocks.append(planned_b)
                block_counter += 1

        unassigned_tasks: List[NormalizedTask] = []
        for cluster in clusters:
            if cluster.cluster_id not in assigned_cluster_ids:
                unassigned_tasks.extend(cluster.tasks)

        # Sort selected blocks by start time
        selected_blocks.sort(key=lambda b: b.start_minutes_from_midnight)

        # Genuine solver constraint provenance from CP-SAT model
        total_constraints = len(model.Proto().constraints)
        total_variables = len(model.Proto().variables)
        satisfied_constraints = total_constraints if solver_status in ["OPTIMAL", "FEASIBLE"] else 0

        return SolverResult(
            solver_status=solver_status,  # type: ignore
            solve_time_ms=round(solve_time_ms, 2),
            iterations=int(solver.NumBranches()),
            objective_score=round(solver.ObjectiveValue() if solver_status in ["OPTIMAL", "FEASIBLE"] else 0.0, 1),
            hard_constraints_satisfied=satisfied_constraints,
            total_hard_constraints=total_constraints,
            model_variable_count=total_variables,
            model_constraint_count=total_constraints,
            selected_blocks=selected_blocks,
            unassigned_tasks=unassigned_tasks
        )

cp_sat_planner = CpSatPlanner()
