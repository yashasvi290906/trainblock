import pytest
from app.data.seed_data import (
    TMS_DEFECTS_SEED,
    SMMS_WORK_SEED,
    TDMS_WORK_SEED,
    COA_TIMETABLE_SEED,
    GOODS_FORECASTS_SEED,
    BLOCK_CORRIDORS_SEED
)
from app.services.ingestion_service import ingestion_service
from app.services.prioritization_service import prioritization_service
from app.services.composition_service import composition_service
from app.optimization.cp_sat_planner import cp_sat_planner
from app.services.validation_service import validation_service
from app.services.backtest_service import backtest_service
from app.services.export_service import export_service

def test_ingestion_feed_counts():
    """Verify all 6 canonical input feeds are ingested properly."""
    tasks = ingestion_service.ingest_all(
        tms_data=TMS_DEFECTS_SEED,
        smms_data=SMMS_WORK_SEED,
        tdms_data=TDMS_WORK_SEED,
        corridors=BLOCK_CORRIDORS_SEED
    )
    assert len(tasks) == 47
    assert len(COA_TIMETABLE_SEED) == 8
    assert len(GOODS_FORECASTS_SEED) == 3
    assert len(BLOCK_CORRIDORS_SEED) == 6

def test_safety_prioritization_and_xgboost_ranker():
    """Verify safety tiers are deterministically assigned and ranked via XGBoost."""
    tasks = ingestion_service.ingest_all(
        tms_data=TMS_DEFECTS_SEED,
        smms_data=SMMS_WORK_SEED,
        tdms_data=TDMS_WORK_SEED,
        corridors=BLOCK_CORRIDORS_SEED
    )
    prioritized = prioritization_service.prioritize_tasks(tasks)
    assert len(prioritized) == 47

    # Check that P1 tasks exist
    p1_tasks = [t for t in prioritized if t.safety_tier == "P1"]
    assert len(p1_tasks) > 0

    # Check rank ordering within tier
    for tier in ["P1", "P2", "P3", "P4"]:
        tier_tasks = [t for t in prioritized if t.safety_tier == tier]
        for i in range(len(tier_tasks) - 1):
            assert tier_tasks[i].within_tier_rank <= tier_tasks[i+1].within_tier_rank
            assert tier_tasks[i].ml_ranking_score >= tier_tasks[i+1].ml_ranking_score

def test_composition_clusters_and_usable_minutes():
    """Verify cluster composition, physics precedence, and usable minutes formula."""
    tasks = ingestion_service.ingest_all(
        tms_data=TMS_DEFECTS_SEED,
        smms_data=SMMS_WORK_SEED,
        tdms_data=TDMS_WORK_SEED,
        corridors=BLOCK_CORRIDORS_SEED
    )
    prioritized = prioritization_service.prioritize_tasks(tasks)
    clusters = composition_service.compose_tasks(prioritized)
    
    assert len(clusters) > 0
    for clus in clusters:
        assert clus.required_block_window_min > 0
        assert len(clus.job_sequence) == len(clus.tasks)
        # Check usable minutes on raw window
        decomp = composition_service.calculate_usable_minutes(240, clus.total_work_duration_min)
        assert decomp.usable_work_minutes == 240 - 30
        assert decomp.total_overhead_minutes == 30

def test_cp_sat_solver_execution():
    """Verify OR-Tools CP-SAT solves and produces valid non-conflicting schedule."""
    tasks = ingestion_service.ingest_all(
        tms_data=TMS_DEFECTS_SEED,
        smms_data=SMMS_WORK_SEED,
        tdms_data=TDMS_WORK_SEED,
        corridors=BLOCK_CORRIDORS_SEED
    )
    prioritized = prioritization_service.prioritize_tasks(tasks)
    clusters = composition_service.compose_tasks(prioritized)
    
    result = cp_sat_planner.solve(
        clusters=clusters,
        trains=COA_TIMETABLE_SEED,
        goods_forecasts=GOODS_FORECASTS_SEED,
        corridors=BLOCK_CORRIDORS_SEED,
        time_limit_sec=5.0
    )

    assert result.solver_status in ["OPTIMAL", "FEASIBLE"]
    assert len(result.selected_blocks) > 0
    assert result.solve_time_ms > 0

    # Check 100% P1 invariant
    scheduled_tasks = [t for b in result.selected_blocks for t in b.tasks]
    p1_total = sum(1 for t in prioritized if t.safety_tier == "P1")
    p1_scheduled = sum(1 for t in scheduled_tasks if t.safety_tier == "P1")
    assert p1_scheduled == p1_total

def test_validation_report():
    """Verify 8-rule compliance check passes for CP-SAT output."""
    tasks = ingestion_service.ingest_all(
        tms_data=TMS_DEFECTS_SEED,
        smms_data=SMMS_WORK_SEED,
        tdms_data=TDMS_WORK_SEED,
        corridors=BLOCK_CORRIDORS_SEED
    )
    prioritized = prioritization_service.prioritize_tasks(tasks)
    clusters = composition_service.compose_tasks(prioritized)
    result = cp_sat_planner.solve(
        clusters=clusters,
        trains=COA_TIMETABLE_SEED,
        goods_forecasts=GOODS_FORECASTS_SEED,
        corridors=BLOCK_CORRIDORS_SEED
    )

    report = validation_service.validate_plan(result.selected_blocks, COA_TIMETABLE_SEED)
    assert report.passed_checks_count == report.total_checks_count
    assert report.overall_status == "VALIDATED"

def test_comparative_backtesting():
    """Verify backtesting engine calculates realistic comparative deltas."""
    tasks = ingestion_service.ingest_all(
        tms_data=TMS_DEFECTS_SEED,
        smms_data=SMMS_WORK_SEED,
        tdms_data=TDMS_WORK_SEED,
        corridors=BLOCK_CORRIDORS_SEED
    )
    prioritized = prioritization_service.prioritize_tasks(tasks)
    clusters = composition_service.compose_tasks(prioritized)
    result = cp_sat_planner.solve(
        clusters=clusters,
        trains=COA_TIMETABLE_SEED,
        goods_forecasts=GOODS_FORECASTS_SEED,
        corridors=BLOCK_CORRIDORS_SEED
    )

    backtest = backtest_service.compute_backtest(result.selected_blocks, prioritized)
    assert backtest.integrated_railblock.passenger_train_delays_min == 0
    assert backtest.integrated_railblock.unresolved_passenger_conflicts == 0
    assert backtest.integrated_railblock.asset_availability_score > backtest.siloed_baseline.asset_availability_score

def test_bdms_export_generation():
    """Verify BDMS export schemas and compliance."""
    tasks = ingestion_service.ingest_all(
        tms_data=TMS_DEFECTS_SEED,
        smms_data=SMMS_WORK_SEED,
        tdms_data=TDMS_WORK_SEED,
        corridors=BLOCK_CORRIDORS_SEED
    )
    prioritized = prioritization_service.prioritize_tasks(tasks)
    clusters = composition_service.compose_tasks(prioritized)
    result = cp_sat_planner.solve(
        clusters=clusters,
        trains=COA_TIMETABLE_SEED,
        goods_forecasts=GOODS_FORECASTS_SEED,
        corridors=BLOCK_CORRIDORS_SEED
    )

    exports = export_service.generate_bdms_exports(result.selected_blocks)
    assert len(exports) == len(result.selected_blocks)
    for exp in exports:
        assert exp.bdms_reference.startswith("BDMS/SCR/SC")
        assert exp.usable_work_minutes > 0

def test_ml_cannot_downgrade_safety_priority():
    """
    CRITICAL INVARIANT TEST:
    Verify that ML ranking scores (XGBoost) cannot downgrade safety tiers.
    Tasks categorized as P1 by deterministic IR safety rules must NEVER be
    demoted to P2, P3, or P4, regardless of ML model outputs or ranking feature perturbations.
    """
    tasks = ingestion_service.ingest_all(
        tms_data=TMS_DEFECTS_SEED,
        smms_data=SMMS_WORK_SEED,
        tdms_data=TDMS_WORK_SEED,
        corridors=BLOCK_CORRIDORS_SEED
    )
    # Identify tasks that meet P1 criteria
    p1_original_ids = set()
    for t in tasks:
        tier, _ = prioritization_service.evaluate_safety_tier(t)
        if tier == "P1":
            p1_original_ids.add(t.task_id)

    assert len(p1_original_ids) > 0, "Seed data must contain at least one P1 task for safety testing"

    # Prioritize with ML
    prioritized = prioritization_service.prioritize_tasks(tasks)

    for pt in prioritized:
        if pt.task_id in p1_original_ids:
            # Must remain P1 regardless of ml_ranking_score
            assert pt.safety_tier == "P1", f"Task {pt.task_id} was downgraded from P1 to {pt.safety_tier}"
            # Even if ML score is 0.0 or lowest possible, safety_tier must remain P1
            assert pt.within_tier_rank >= 1

