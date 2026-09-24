import pytest
from app.services.run_manager import run_manager
from app.services.prioritization_service import prioritization_service
from app.models.schemas import NormalizedTask, RankingFeatures

def test_run_manager_initialization_and_run_id():
    """Verify PlanningRun is instantiated with unique run ID, monthly reservations, and audit trail."""
    run = run_manager.current_run
    assert run is not None
    assert run.planning_run_id.startswith("RUN-2026-")
    assert len(run.monthly_plan) == 6 * 28  # 6 sections x 28 days
    assert run.rolling_programme is not None
    assert len(run.rolling_programme.weeks) == 26
    assert len(run.train_movements) > 0
    assert run.decision_status == "PENDING_REVIEW"
    assert len(run.audit_events) > 0

def test_demo_reset_action():
    """Verify reset_demo() resets state and produces a new baseline run."""
    old_id = run_manager.current_run.planning_run_id if run_manager.current_run else "RUN-0"
    new_run = run_manager.reset_demo()
    assert new_run.planning_run_id != old_id
    assert new_run.input_summary["total_maintenance_demands"] == 47
    assert new_run.validation_result.overall_status == "VALIDATED"

def test_scenario_add_critical_task():
    """Verify injecting a new emergency P1 USFD flaw updates demands to 48 and schedules it."""
    run_manager.reset_demo()
    run_before = run_manager.current_run
    count_before = run_before.input_summary["total_maintenance_demands"] if run_before else 47

    replanned = run_manager.add_critical_task(
        defect_type="Rail Joint Fracture (Severe USFD Flaw)",
        line="DOWN",
        km_start=73.5,
        km_end=74.0,
        depth_mm=7.2
    )

    assert replanned.input_summary["total_maintenance_demands"] == count_before + 1
    assert replanned.active_scenario is not None
    assert replanned.active_scenario.startswith("NEW_CRITICAL_DEFECT_")
    
    # Verify the new task was prioritized as P1
    p1_tasks = [t for t in replanned.prioritized_tasks if t.safety_tier == "P1"]
    assert any("73.5" in t.title or "73.5" in t.asset_id for t in p1_tasks)
    assert replanned.solver_result.solver_status in ["OPTIMAL", "FEASIBLE"]

def test_scenario_block_denial_and_replanning():
    """Verify denying a planned block eliminates that window and triggers solver replanning."""
    run_manager.reset_demo()
    base_run = run_manager.current_run
    assert base_run and len(base_run.weekly_plan) > 0
    denied_target = base_run.weekly_plan[0]
    target_id = denied_target.block_id

    replanned = run_manager.apply_block_denial(target_id)
    assert replanned.active_scenario == f"BLOCK_DENIED_{target_id}"
    assert target_id in run_manager.denied_block_ids
    assert any(evt.event_type == "BLOCK_DENIED" for evt in replanned.audit_events)

def test_scenario_overrun_35min():
    """Verify +35 min overrun adjusts block end time and flags operational conflict."""
    run_manager.reset_demo()
    base_run = run_manager.current_run
    assert base_run and len(base_run.weekly_plan) > 0
    first_block = base_run.weekly_plan[0]
    orig_duration = first_block.duration_minutes

    overrun_run = run_manager.apply_block_overrun(first_block.block_id, overrun_min=35)
    updated_block = next(b for b in overrun_run.weekly_plan if b.block_id == first_block.block_id)
    assert updated_block.duration_minutes == orig_duration + 35
    assert overrun_run.validation_result.overall_status in ["WARNING", "FAILED"]
    assert any(evt.event_type == "OVERRUN_REPORTED" for evt in overrun_run.audit_events)

def test_scenario_freight_injection():
    """Verify injecting an unscheduled freight rake updates active goods and logs audit event."""
    run_manager.reset_demo()
    goods_before = len(run_manager.active_goods)
    replanned = run_manager.apply_freight_injection(
        cargo_type="Container Cargo (CONCOR Express)",
        origin="SEC Yard",
        destination="NDL Main",
        target_window_start=240,
        target_window_end=390
    )
    assert len(run_manager.active_goods) == goods_before + 1
    assert any(evt.event_type == "FREIGHT_INJECTED" for evt in replanned.audit_events)

def test_rolling_programme_26w_and_roll_forward():
    """Verify 26-week programme derives monthly plan and rolling +1 week shifts horizon."""
    run_manager.reset_demo()
    initial_run = run_manager.current_run
    assert initial_run is not None
    assert initial_run.rolling_programme is not None
    assert len(initial_run.rolling_programme.weeks) == 26
    # Monthly plan derives directly from weeks 1..4
    assert len(initial_run.monthly_plan) == 6 * 28  # 4 weeks of 7 days across 6 sections

    rolled_run = run_manager.roll_forward_week()
    assert rolled_run.rolling_programme is not None
    assert rolled_run.rolling_programme.current_week == 2
    assert rolled_run.rolling_programme.roll_forward_deltas is not None
    assert any(evt.event_type == "WEEK_ROLLED_FORWARD" for evt in rolled_run.audit_events)

def test_role_station_master_actions():
    """Verify Station Master local acknowledgment and escalation create audit events."""
    run_manager.reset_demo()
    run = run_manager.station_master_acknowledge(
        station_code="WL",
        block_id="BLK-2026-101",
        officer_name="R. K. Sharma (SM/WL)"
    )
    last_event = run.audit_events[-1]
    assert last_event.event_type == "IMPACT_ACKNOWLEDGED"
    assert "WL" in last_event.actor

    run2 = run_manager.station_master_escalate(
        station_code="WL",
        reason="Platform 3 fouling point clearance required for 12724 pass",
        officer_name="R. K. Sharma (SM/WL)"
    )
    last_event2 = run2.audit_events[-1]
    assert last_event2.event_type == "ALERT_ESCALATED"

def test_role_department_actions():
    """Verify Department task creation and readiness updates propagate to PlanningRun."""
    run_manager.reset_demo()
    count_before = len(run_manager.active_tms)
    run = run_manager.department_create_demand(
        department="Engineering",
        defect_type="Deep Ballast Screening Deficit",
        line="UP",
        km_start=88.0,
        km_end=89.5,
        duration_min=60,
        machine_required="BCM-300"
    )
    assert len(run_manager.active_tms) == count_before + 1
    assert any(evt.event_type == "TASK_CREATED" for evt in run.audit_events)

    run2 = run_manager.department_update_readiness(
        task_id="TMS-1081",
        readiness_status="CERTIFIED_READY",
        officer_name="Sr. Section Engineer / P-Way"
    )
    assert any(evt.event_type == "READINESS_UPDATED" for evt in run2.audit_events)

def test_safety_tier_invariance_ml_cannot_downgrade():
    """Verify safety tiering is strictly deterministic and ML ranking cannot downgrade tiers."""
    task_p1 = NormalizedTask(
        task_id="TEST-001",
        source_system="TMS",
        source_record_id="REC-001",
        department="Engineering",
        title="USFD Rail Joint Defect (Depth 6.5mm)",
        asset_type="Rail Joint",
        asset_id="RJ-45",
        line="DOWN",
        km_start=72.0,
        km_end=72.5,
        corridor_section_id="SEC-NDL-BLK-03",
        duration_min=45,
        required_protection="Absolute Traffic Block",
        ohe_required=False,
        machine_required="None",
        crew_required=6,
        overdue_days=14,
        safety_tier="P1",
        safety_tier_reason="Test",
        ml_ranking_score=0.1,  # Intentionally low score
        within_tier_rank=999,
        ranking_features=RankingFeatures(
            defect_severity=5, overdue_days=14, asset_criticality=5, traffic_exposure=4, availability_impact=4
        )
    )
    prioritized = prioritization_service.prioritize_tasks([task_p1])
    assert prioritized[0].safety_tier == "P1", "ML score must never downgrade a P1 task"
