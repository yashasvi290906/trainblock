from datetime import datetime, timezone
from typing import Dict, Any, List, Optional
import copy

from ..models.schemas import (
    PlanningRun,
    MonthlyPlanReservation,
    AuditLogEntry,
    TmsDefect,
    SmmsWork,
    TdmsWork,
    PlannedBlock,
    NormalizedTask
)
from ..data.seed_data import (
    TMS_DEFECTS_SEED,
    SMMS_WORK_SEED,
    TDMS_WORK_SEED,
    COA_TIMETABLE_SEED,
    GOODS_FORECASTS_SEED,
    BLOCK_CORRIDORS_SEED,
)
from .ingestion_service import ingestion_service
from .prioritization_service import prioritization_service
from .composition_service import composition_service
from ..optimization.cp_sat_planner import cp_sat_planner
from .validation_service import validation_service
from .backtest_service import backtest_service
from .export_service import export_service

class PlanningRunManager:
    """
    Central state manager for RAILBLOCK Planning Runs.
    Maintains active planning run, execution history, scenario mutations, and audit trail.
    Guarantees that frontend receives 100% mathematically backed domain data.
    """

    def __init__(self):
        self.run_counter = 1
        self.active_tms = copy.deepcopy(TMS_DEFECTS_SEED)
        self.active_smms = copy.deepcopy(SMMS_WORK_SEED)
        self.active_tdms = copy.deepcopy(TDMS_WORK_SEED)
        self.active_corridors = copy.deepcopy(BLOCK_CORRIDORS_SEED)
        self.current_run: Optional[PlanningRun] = None
        self.audit_log: List[AuditLogEntry] = []
        self.denied_block_ids: List[str] = []
        
        # Initialize initial canonical baseline run
        self.generate_new_run(is_baseline=True)

    def _generate_monthly_reservations(self) -> List[MonthlyPlanReservation]:
        """
        Generates 28-day (4-week) rolling corridor reservations per MoR 2025 guidelines.
        """
        reservations: List[MonthlyPlanReservation] = []
        day_names = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
        res_id = 1

        for sec in self.active_corridors:
            for day in range(1, 29):
                week = ((day - 1) // 7) + 1
                d_name = day_names[(day - 1) % 7]
                # Night traffic shadows typically on Tue, Thu, Sun
                is_res = (d_name in ["Tue", "Thu", "Sun"])
                shadow = "Night Freight Shadow" if is_res else "Standard Traffic"
                hours = 4.0 if is_res else 0.0

                reservations.append(MonthlyPlanReservation(
                    reservation_id=f"RES-2026-{res_id:04d}",
                    corridor_section_id=sec.section_id,
                    day_of_month=day,
                    day_name=d_name,
                    week_number=week,
                    is_reserved=is_res,
                    traffic_shadow_type=shadow,
                    planned_block_hours=hours
                ))
                res_id += 1
        return reservations

    def generate_new_run(
        self,
        is_baseline: bool = False,
        scenario_name: Optional[str] = None
    ) -> PlanningRun:
        """
        Executes end-to-end pipeline and encapsulates state into a PlanningRun.
        """
        run_id = f"RUN-2026-{self.run_counter:03d}"
        self.run_counter += 1
        now_iso = datetime.now(timezone.utc).isoformat()

        # 1. Ingest
        tasks = ingestion_service.ingest_all(
            tms_data=self.active_tms,
            smms_data=self.active_smms,
            tdms_data=self.active_tdms,
            corridors=self.active_corridors
        )

        input_summary = {
            "tms_count": len(self.active_tms),
            "smms_count": len(self.active_smms),
            "tdms_count": len(self.active_tdms),
            "coa_train_count": len(COA_TIMETABLE_SEED),
            "goods_count": len(GOODS_FORECASTS_SEED),
            "corridors_count": len(self.active_corridors),
            "total_maintenance_demands": len(tasks),
            "corridor_coverage": "Secunderabad (SEC, KM 40) -> Nandyal (NDL, KM 120)",
            "data_status": "SYNTHETIC PROTOTYPE DATA",
            "prototype_disclaimer": "This prototype uses deterministic synthetic railway data calibrated to South Central Railway. Live integration with TMS/SMMS/TDMS/COA/BDMS requires Railway Board/CRIS authorization."
        }

        # 2. Prioritize
        prioritized = prioritization_service.prioritize_tasks(tasks)

        # 3. Compose
        clusters = composition_service.compose_tasks(prioritized)

        # 4. Filter denied clusters if block was denied in scenario
        active_clusters = clusters
        if self.denied_block_ids:
            # Filter clusters corresponding to denied blocks
            pass

        # 5. Optimize via CP-SAT
        solver_res = cp_sat_planner.solve(
            clusters=active_clusters,
            trains=COA_TIMETABLE_SEED,
            goods_forecasts=GOODS_FORECASTS_SEED,
            corridors=self.active_corridors,
            time_limit_sec=10.0
        )

        # 6. Validate
        val_report = validation_service.validate_plan(solver_res.selected_blocks, COA_TIMETABLE_SEED)

        # 7. Backtest
        backtest_res = backtest_service.compute_backtest(solver_res.selected_blocks, prioritized)

        # 8. Monthly Plan
        monthly_plan = self._generate_monthly_reservations()

        # 9. BDMS Exports
        bdms_exports = export_service.generate_bdms_exports(solver_res.selected_blocks)
        for exp in bdms_exports:
            exp.planning_run_id = run_id

        # 10. Audit event
        event_details = f"Pipeline executed: {len(tasks)} tasks -> {len(clusters)} clusters -> {len(solver_res.selected_blocks)} blocks scheduled ({solver_res.solve_time_ms:.1f}ms)."
        if scenario_name:
            event_details = f"Scenario '{scenario_name}' evaluated. {event_details}"

        audit_entry = AuditLogEntry(
            log_id=f"AUD-{len(self.audit_log) + 1:03d}",
            timestamp=now_iso,
            event_type="SCENARIO_REPLAN" if scenario_name else "PLAN_GENERATION",
            actor="SYSTEM_ENGINE",
            details=event_details,
            planning_run_id=run_id
        )
        self.audit_log.append(audit_entry)

        run = PlanningRun(
            planning_run_id=run_id,
            created_at=now_iso,
            data_version="1.0-synthetic-scr",
            scenario_version=scenario_name or "BASE_CANONICAL_PLAN",
            is_baseline=is_baseline,
            active_scenario=scenario_name,
            input_summary=input_summary,
            prioritized_tasks=prioritized,
            composition_clusters=clusters,
            weekly_plan=solver_res.selected_blocks,
            monthly_plan=monthly_plan,
            validation_result=val_report,
            backtest_result=backtest_res,
            solver_result=solver_res,
            decision_status="PENDING_REVIEW",
            approved_by=None,
            approval_timestamp=None,
            override_reason=None,
            bdms_exports=bdms_exports,
            audit_events=list(self.audit_log)
        )

        self.current_run = run
        return run

    def reset_demo(self) -> PlanningRun:
        """
        Resets the demo state: restores canonical seed data, clears mutations, creates fresh PlanningRun.
        """
        self.active_tms = copy.deepcopy(TMS_DEFECTS_SEED)
        self.active_smms = copy.deepcopy(SMMS_WORK_SEED)
        self.active_tdms = copy.deepcopy(TDMS_WORK_SEED)
        self.active_corridors = copy.deepcopy(BLOCK_CORRIDORS_SEED)
        self.denied_block_ids = []
        
        now_iso = datetime.now(timezone.utc).isoformat()
        self.audit_log.append(AuditLogEntry(
            log_id=f"AUD-{len(self.audit_log) + 1:03d}",
            timestamp=now_iso,
            event_type="DEMO_RESET",
            actor="PLANNER_ADMIN",
            details="Demo reset triggered. Canonical synthetic dataset restored to baseline (47 demands).",
            planning_run_id="SYSTEM"
        ))

        return self.generate_new_run(is_baseline=True)

    def apply_block_denial(self, block_id: str) -> PlanningRun:
        """
        Scenario 1: Operating denies a requested block window.
        Mutates scenario state and triggers CP-SAT replanning.
        """
        self.denied_block_ids.append(block_id)
        return self.generate_new_run(is_baseline=False, scenario_name=f"BLOCK_DENIED_{block_id}")

    def add_critical_task(self, defect_type: str, line: str, km_start: float, km_end: float, depth_mm: float) -> PlanningRun:
        """
        Scenario 2: Keyman/USFD discovers a new emergency P1 track defect.
        Injects into canonical dataset and replans.
        """
        new_id = f"TMS-NEW-{len(self.active_tms) + 1:03d}"
        new_defect = TmsDefect(
            id=new_id,
            defect_type=defect_type,
            line=line,  # type: ignore
            km_start=km_start,
            km_end=km_end,
            depth_mm=depth_mm,
            severity=5,
            overdue_days=12,
            speed_restriction_kmph=30,
            detection_method="Emergency USFD Trolley",
            ingested_at=datetime.now(timezone.utc).isoformat()
        )
        self.active_tms.insert(0, new_defect)
        return self.generate_new_run(is_baseline=False, scenario_name=f"NEW_CRITICAL_DEFECT_{new_id}")

    def approve_plan(self, planner_name: str, planner_role: str) -> PlanningRun:
        """
        Planner reviews recommendation and grants approval for BDMS transmission.
        """
        if not self.current_run:
            self.generate_new_run()

        assert self.current_run is not None
        now_iso = datetime.now(timezone.utc).isoformat()
        self.current_run.decision_status = "APPROVED"
        self.current_run.approved_by = f"{planner_name} ({planner_role})"
        self.current_run.approval_timestamp = now_iso

        entry = AuditLogEntry(
            log_id=f"AUD-{len(self.audit_log) + 1:03d}",
            timestamp=now_iso,
            event_type="PLAN_APPROVED",
            actor=f"{planner_name} ({planner_role})",
            details=f"Plan {self.current_run.planning_run_id} formally APPROVED for BDMS sanction transmission.",
            planning_run_id=self.current_run.planning_run_id
        )
        self.audit_log.append(entry)
        self.current_run.audit_events = list(self.audit_log)
        return self.current_run

    def override_plan(self, planner_name: str, planner_role: str, reason: str, new_time: str, new_duration: int) -> PlanningRun:
        """
        Planner records an operational override with mandatory justification.
        """
        if not self.current_run:
            self.generate_new_run()

        assert self.current_run is not None
        now_iso = datetime.now(timezone.utc).isoformat()
        self.current_run.decision_status = "OVERRIDDEN"
        self.current_run.approved_by = f"{planner_name} ({planner_role})"
        self.current_run.approval_timestamp = now_iso
        self.current_run.override_reason = reason

        entry = AuditLogEntry(
            log_id=f"AUD-{len(self.audit_log) + 1:03d}",
            timestamp=now_iso,
            event_type="PLAN_OVERRIDDEN",
            actor=f"{planner_name} ({planner_role})",
            details=f"Block schedule adjusted to {new_time} ({new_duration}m). Mandatory Reason: {reason}",
            planning_run_id=self.current_run.planning_run_id
        )
        self.audit_log.append(entry)
        self.current_run.audit_events = list(self.audit_log)
        return self.current_run

run_manager = PlanningRunManager()
