import pytest
from app.services.run_manager import run_manager

def test_run_manager_initialization_and_run_id():
    """Verify PlanningRun is instantiated with unique run ID, monthly reservations, and audit trail."""
    run = run_manager.current_run
    assert run is not None
    assert run.planning_run_id.startswith("RUN-2026-")
    assert len(run.monthly_plan) == 6 * 28  # 6 sections x 28 days
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

def test_approval_and_override_workflow():
    """Verify approval and override update decision_status and append to audit trail."""
    # 1. Approval
    approved = run_manager.approve_plan(planner_name="S. Ramanathan", planner_role="Sr. DOM / Planning")
    assert approved.decision_status == "APPROVED"
    assert "S. Ramanathan" in (approved.approved_by or "")
    
    last_event = approved.audit_events[-1]
    assert last_event.event_type == "PLAN_APPROVED"
    assert "S. Ramanathan" in last_event.actor

    # 2. Override
    overridden = run_manager.override_plan(
        planner_name="S. Ramanathan",
        planner_role="Sr. DOM / Planning",
        reason="Priority freight rake clearance window adjusted",
        new_time="01:30",
        new_duration=120
    )
    assert overridden.decision_status == "OVERRIDDEN"
    assert overridden.override_reason == "Priority freight rake clearance window adjusted"
    assert overridden.audit_events[-1].event_type == "PLAN_OVERRIDDEN"
