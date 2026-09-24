from typing import Dict, Any, List
from ..models.schemas import BacktestResult, BacktestMetrics, PlannedBlock, NormalizedTask
from ..data.seed_data import (
    TMS_DEFECTS_SEED,
    SMMS_WORK_SEED,
    TDMS_WORK_SEED,
    COA_TIMETABLE_SEED
)

class BacktestService:
    """
    Deterministic comparative backtesting engine.
    Contrasts traditional siloed departmental manual planning vs RAILBLOCK CP-SAT integrated composition.
    """

    def compute_backtest(self, integrated_blocks: List[PlannedBlock], all_tasks: List[NormalizedTask], horizon_days: int = 7) -> BacktestResult:
        # Dynamically determine section count from tasks/blocks
        sections = set(t.corridor_section_id for t in all_tasks if t.corridor_section_id)
        if not sections and integrated_blocks:
            sections = set(b.section for b in integrated_blocks if b.section)
        section_count = max(6, len(sections))

        # Total modeled corridor minutes = section_count * horizon_days * 24 * 60
        total_modeled_section_minutes = float(section_count * horizon_days * 24 * 60)

        p1_total = sum(1 for t in all_tasks if t.safety_tier == "P1")

        # -------------------------------------------------------------
        # 1. Siloed Baseline Simulation (Manual / Departmental Isolation)
        # -------------------------------------------------------------
        # In the siloed baseline, each task is requested as a separate possession:
        # Each request incurs separate 30m isolation/restoration overhead.
        siloed_blocks_count = len(all_tasks)
        siloed_total_blocked_min = sum(t.duration_min + 30 for t in all_tasks)
        siloed_usable_work_min = sum(t.duration_min for t in all_tasks)
        siloed_ratio = round(siloed_usable_work_min / max(1, siloed_total_blocked_min), 3)

        # Repeated possessions: tasks on the same section & line possessing track independently
        siloed_unique_sections = len(set((t.corridor_section_id, t.line) for t in all_tasks))
        siloed_repeated = max(0, siloed_blocks_count - siloed_unique_sections)

        # Uncoordinated individual requests colliding with passenger timetable on same direction/line
        siloed_conflicts = sum(1 for t in all_tasks if any((train.direction == t.line or t.line == "BOTH") and train.train_type != "Freight" for train in COA_TIMETABLE_SEED[:3]))
        siloed_delays = siloed_conflicts * 20  # Nominal 20m speed regulation/detention penalty

        # Siloed P1 clearance (deferred due to individual possession denial by Operating)
        siloed_p1_sched = sum(1 for t in all_tasks if t.safety_tier == "P1" and t.overdue_days >= 4)
        siloed_p1_percent = round((siloed_p1_sched / max(1, p1_total)) * 100.0, 1)

        # Modeled corridor availability: (1.0 - (downtime / total corridor minutes)) * 100
        siloed_avail = round(max(0.0, (1.0 - (siloed_total_blocked_min / total_modeled_section_minutes))) * 100.0, 2)

        siloed_metrics = BacktestMetrics(
            total_blocks=siloed_blocks_count,
            total_blocked_minutes=siloed_total_blocked_min,
            total_usable_work_minutes=siloed_usable_work_min,
            work_minutes_per_blocked_minute=siloed_ratio,
            passenger_train_delays_min=siloed_delays,
            unresolved_passenger_conflicts=siloed_conflicts,
            critical_backlog_cleared_percent=siloed_p1_percent,
            asset_availability_score=siloed_avail,
            repeated_track_possessions=siloed_repeated
        )

        # -------------------------------------------------------------
        # 2. Integrated RAILBLOCK Plan (Mathematical Composition & CP-SAT)
        # -------------------------------------------------------------
        integrated_blocks_count = len(integrated_blocks)
        integrated_total_blocked_min = sum(b.duration_minutes for b in integrated_blocks)
        integrated_usable_work_min = sum(b.usable_minutes_breakdown.usable_work_minutes for b in integrated_blocks)
        integrated_ratio = round(integrated_usable_work_min / max(1, integrated_total_blocked_min), 3)

        scheduled_tasks = [t for b in integrated_blocks for t in b.tasks]
        p1_sched = sum(1 for t in scheduled_tasks if t.safety_tier == "P1")
        p1_percent = round((p1_sched / max(1, p1_total)) * 100.0, 1)

        # Actual train conflicts and delays from solver result
        integrated_conflicts = sum(1 for b in integrated_blocks for ti in b.train_interactions if ti.status == "CONFLICT")
        integrated_delays = sum(abs(ti.clearance_margin_min) for b in integrated_blocks for ti in b.train_interactions if ti.status == "CONFLICT")

        integrated_unique_sections = len(set((b.section, b.line) for b in integrated_blocks))
        integrated_repeated = max(0, integrated_blocks_count - integrated_unique_sections)

        integrated_avail = round(max(0.0, (1.0 - (integrated_total_blocked_min / total_modeled_section_minutes))) * 100.0, 2)

        integrated_metrics = BacktestMetrics(
            total_blocks=integrated_blocks_count,
            total_blocked_minutes=integrated_total_blocked_min,
            total_usable_work_minutes=integrated_usable_work_min,
            work_minutes_per_blocked_minute=integrated_ratio,
            passenger_train_delays_min=integrated_delays,
            unresolved_passenger_conflicts=integrated_conflicts,
            critical_backlog_cleared_percent=p1_percent,
            asset_availability_score=integrated_avail,
            repeated_track_possessions=integrated_repeated
        )

        # -------------------------------------------------------------
        # 3. Delta Calculation
        # -------------------------------------------------------------
        blocked_reduction = siloed_total_blocked_min - integrated_total_blocked_min
        reduction_pct = round((blocked_reduction / max(1, siloed_total_blocked_min)) * 100.0, 2)

        delta = {
            "blocks_reduction_percent": round(((siloed_blocks_count - integrated_blocks_count) / max(1, siloed_blocks_count)) * 100.0, 1),
            "blocked_minutes_saved": blocked_reduction,
            "overhead_waste_reduced_minutes": (siloed_blocks_count * 30) - (integrated_blocks_count * 30),
            "passenger_conflict_reduction": f"{siloed_conflicts} -> {integrated_conflicts} conflicts ({siloed_delays - integrated_delays} min saved)",
            "asset_availability_gain_percent": round(integrated_avail - siloed_avail, 2)
        }

        return BacktestResult(
            dataset_name="Secunderabad (SEC) – Nandyal (NDL) 80km Corridor (SCR Synthetic Topology)",
            total_input_work_orders=len(all_tasks),
            corridor_length_km=80.0,
            horizon_days=horizon_days,
            section_count=section_count,
            total_modeled_section_minutes=total_modeled_section_minutes,
            baseline_blocked_minutes=siloed_total_blocked_min,
            integrated_blocked_minutes=integrated_total_blocked_min,
            blocked_minutes_reduction=blocked_reduction,
            blocked_minutes_reduction_percent=reduction_pct,
            modeled_corridor_availability=integrated_avail,
            baseline_modeled_corridor_availability=siloed_avail,
            p1_completion_percent=p1_percent,
            repeated_possessions=integrated_repeated,
            modeled_conflicts=integrated_conflicts,
            metric_definition="Synthetic prototype metric: percentage of modeled section-time not occupied by maintenance possessions over the evaluated horizon. Formula: (1 - integrated_possession_minutes / total_modeled_section_minutes) * 100.",
            data_status="SYNTHETIC PROTOTYPE DATA",
            siloed_baseline=siloed_metrics,
            integrated_railblock=integrated_metrics,
            delta=delta
        )

backtest_service = BacktestService()
