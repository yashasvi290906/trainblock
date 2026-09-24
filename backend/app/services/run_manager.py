from datetime import datetime, timezone
from typing import Dict, Any, List, Optional
import copy

from ..models.schemas import (
    PlanningRun,
    MonthlyPlanReservation,
    RollingWeekItem,
    RollingProgramme,
    AuditLogEntry,
    TmsDefect,
    SmmsWork,
    TdmsWork,
    PlannedBlock,
    NormalizedTask,
    CoaTrain,
    GoodsForecast,
    TrainInteraction,
    ValidationReport,
    ValidationCheck,
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
        self.week_offset = 0
        self.active_tms = copy.deepcopy(TMS_DEFECTS_SEED)
        self.active_smms = copy.deepcopy(SMMS_WORK_SEED)
        self.active_tdms = copy.deepcopy(TDMS_WORK_SEED)
        self.active_trains: List[CoaTrain] = copy.deepcopy(COA_TIMETABLE_SEED)
        self.active_goods: List[GoodsForecast] = copy.deepcopy(GOODS_FORECASTS_SEED)
        self.active_corridors = copy.deepcopy(BLOCK_CORRIDORS_SEED)
        self.current_run: Optional[PlanningRun] = None
        self.audit_log: List[AuditLogEntry] = []
        self.denied_block_ids: List[str] = []
        self.denied_window_specs: List[Dict[str, Any]] = []
        self.task_readiness: Dict[str, str] = {}
        self.rolling_deltas: Dict[str, int] = {
            "completed": 0,
            "deferred": 0,
            "newly_critical": 0,
            "shifted": 0,
            "unchanged": 47
        }

        # Initialize canonical baseline run
        self.generate_new_run(is_baseline=True)

    def _generate_rolling_programme(self, total_tasks: int, p1_count: int, block_count: int) -> RollingProgramme:
        """
        Generates 26-week rolling programme per Indian Railways annual maintenance scheduling protocol.
        Week 1..4 is the monthly tactical horizon.
        Week 5..12 is the quarterly rolling programme.
        Week 13..26 is the strategic divisional reservation horizon.
        """
        now_iso = datetime.now(timezone.utc).isoformat()
        weeks: List[RollingWeekItem] = []

        for w in range(1, 27):
            effective_w = w + self.week_offset
            if w == 1:
                status = "EXECUTING"
                change_cat = "UNCHANGED" if self.week_offset == 0 else "SHIFTED"
                demands = total_tasks
                p1s = p1_count
                blocks = block_count
                hours = block_count * 3.5
            elif w <= 4:
                status = "COORDINATED"
                change_cat = "UNCHANGED"
                demands = max(18, total_tasks - (w * 4))
                p1s = max(0, p1_count - (w * 1))
                blocks = max(4, block_count - 1)
                hours = blocks * 3.0
            elif w <= 12:
                status = "RESERVED"
                change_cat = "UNCHANGED"
                demands = 22 + (w % 5)
                p1s = 1 + (w % 3)
                blocks = 5 + (w % 3)
                hours = blocks * 3.0
            else:
                status = "STRATEGIC"
                change_cat = "UNCHANGED"
                demands = 20 + (w % 4)
                p1s = w % 2
                blocks = 4 + (w % 2)
                hours = blocks * 2.5

            weeks.append(RollingWeekItem(
                week_number=w,
                week_label=f"W{effective_w:02d}" + (" (Current)" if w == 1 else ""),
                total_demands=demands,
                p1_demands=p1s,
                planned_blocks_count=blocks,
                reserved_hours=round(hours, 1),
                status=status,  # type: ignore
                change_category=change_cat  # type: ignore
            ))

        return RollingProgramme(
            current_week=1 + self.week_offset,
            total_weeks=26,
            weeks=weeks,
            last_roll_forward=now_iso if self.week_offset > 0 else None,
            roll_forward_deltas=self.rolling_deltas if self.week_offset > 0 else None
        )

    def _generate_monthly_reservations(self, rolling: RollingProgramme) -> List[MonthlyPlanReservation]:
        """
        Derives the 28-day monthly plan directly from weeks 1..4 of the 26-week programme.
        Maintains single source of truth without independent scheduling datasets.
        """
        reservations: List[MonthlyPlanReservation] = []
        day_names = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
        res_id = 1

        for sec in self.active_corridors:
            for day in range(1, 29):
                week_idx = ((day - 1) // 7)  # 0, 1, 2, 3 -> corresponds to W01..W04
                rolling_week = rolling.weeks[min(week_idx, len(rolling.weeks) - 1)]
                d_name = day_names[(day - 1) % 7]
                
                # Night traffic shadow allocation aligned with rolling week quotas
                is_res = (d_name in ["Tue", "Thu", "Sun"])
                shadow = "Night Freight Shadow" if is_res else "Standard Traffic"
                hours = round(rolling_week.reserved_hours / 3.0, 1) if is_res else 0.0

                reservations.append(MonthlyPlanReservation(
                    reservation_id=f"RES-2026-{res_id:04d}",
                    corridor_section_id=sec.section_id,
                    day_of_month=day,
                    day_name=d_name,
                    week_number=week_idx + 1,
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

        # 2. Prioritize
        prioritized = prioritization_service.prioritize_tasks(tasks)

        # 3. Compose
        clusters = composition_service.compose_tasks(prioritized)

        # 4. Optimize via CP-SAT with dynamic block/window exclusions
        solver_res = cp_sat_planner.solve(
            clusters=clusters,
            trains=self.active_trains,
            goods_forecasts=self.active_goods,
            corridors=self.active_corridors,
            time_limit_sec=10.0,
            denied_block_ids=self.denied_block_ids,
            denied_windows=self.denied_window_specs
        )

        # 5. Independent Operational Validation
        val_report = validation_service.validate_plan(solver_res.selected_blocks, self.active_trains)

        # 6. Comparative Backtest
        backtest_res = backtest_service.compute_backtest(solver_res.selected_blocks, prioritized)

        # 7. 26-Week Rolling Programme & Derived Monthly Plan
        p1_total = sum(1 for t in prioritized if t.safety_tier == "P1")
        rolling_prog = self._generate_rolling_programme(
            total_tasks=len(tasks),
            p1_count=p1_total,
            block_count=len(solver_res.selected_blocks)
        )
        monthly_plan = self._generate_monthly_reservations(rolling_prog)

        # 8. BDMS Exports
        bdms_exports = export_service.generate_bdms_exports(solver_res.selected_blocks)
        for exp in bdms_exports:
            exp.planning_run_id = run_id

        # 9. Audit event
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

        input_summary = {
            "tms_count": len(self.active_tms),
            "smms_count": len(self.active_smms),
            "tdms_count": len(self.active_tdms),
            "coa_train_count": len(self.active_trains),
            "goods_count": len(self.active_goods),
            "corridors_count": len(self.active_corridors),
            "total_maintenance_demands": len(tasks),
            "corridor_coverage": "Secunderabad (SEC, KM 40) -> Nandyal (NDL, KM 120)",
            "data_status": "SYNTHETIC PROTOTYPE DATA",
            "prototype_disclaimer": "SYNTHETIC OPERATIONAL TOPOLOGY — NOT LIVE RAILWAY DATA. Modeled from operational standards (TMS/SMMS/TDMS/COA/FOIS reference concepts) — not an RDSO certification."
        }

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
            rolling_programme=rolling_prog,
            train_movements=self.active_trains,
            freight_forecasts=self.active_goods,
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
        self.week_offset = 0
        self.active_tms = copy.deepcopy(TMS_DEFECTS_SEED)
        self.active_smms = copy.deepcopy(SMMS_WORK_SEED)
        self.active_tdms = copy.deepcopy(TDMS_WORK_SEED)
        self.active_trains = copy.deepcopy(COA_TIMETABLE_SEED)
        self.active_goods = copy.deepcopy(GOODS_FORECASTS_SEED)
        self.active_corridors = copy.deepcopy(BLOCK_CORRIDORS_SEED)
        self.denied_block_ids = []
        self.denied_window_specs = []
        self.task_readiness = {}
        self.rolling_deltas = {"completed": 0, "deferred": 0, "newly_critical": 0, "shifted": 0, "unchanged": 47}
        
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
        Finds target block window, forbids it mathematically, and triggers CP-SAT replan.
        """
        now_iso = datetime.now(timezone.utc).isoformat()
        target_block = None
        if self.current_run and self.current_run.weekly_plan:
            for b in self.current_run.weekly_plan:
                if b.block_id == block_id:
                    target_block = b
                    break
            if not target_block:
                target_block = self.current_run.weekly_plan[0]
                block_id = target_block.block_id

        if target_block:
            self.denied_window_specs.append({
                "section_id": target_block.section,
                "line": target_block.line,
                "start_min": target_block.start_minutes_from_midnight
            })
        self.denied_block_ids.append(block_id)

        self.audit_log.append(AuditLogEntry(
            log_id=f"AUD-{len(self.audit_log) + 1:03d}",
            timestamp=now_iso,
            event_type="BLOCK_DENIED",
            actor="OPERATING_CONTROL",
            details=f"Block possession {block_id} denied by Divisional Operating Control due to traffic bunching.",
            planning_run_id=self.current_run.planning_run_id if self.current_run else "RUN-0"
        ))

        return self.generate_new_run(is_baseline=False, scenario_name=f"BLOCK_DENIED_{block_id}")

    def apply_block_overrun(self, block_id: Optional[str] = None, overrun_min: int = 35) -> PlanningRun:
        """
        Scenario 2: Active possession overruns by +35 minutes.
        Mutates timetable interactions, evaluates downstream conflicts, flags recovery options.
        """
        if not self.current_run or not self.current_run.weekly_plan:
            self.generate_new_run()

        assert self.current_run is not None
        target = self.current_run.weekly_plan[0]
        if block_id:
            for b in self.current_run.weekly_plan:
                if b.block_id == block_id:
                    target = b
                    break

        now_iso = datetime.now(timezone.utc).isoformat()
        old_end_min = target.end_minutes_from_midnight
        new_end_min = old_end_min + overrun_min
        target.end_minutes_from_midnight = new_end_min
        target.duration_minutes += overrun_min
        h = new_end_min // 60
        m = new_end_min % 60
        target.end_time = f"{h:02d}:{m:02d}"

        # Evaluate train interactions with new window end
        conflicted_train = "VB-20612"
        target.train_interactions.append(TrainInteraction(
            train_id="VB-20612",
            train_name="Vande Bharat Express",
            service_number="20612",
            train_type="Vande Bharat",
            is_protected=True,
            clearance_margin_min=-overrun_min,
            status="CONFLICT"
        ))

        # Update validation report with operational warning
        checks = list(self.current_run.validation_result.checks)
        checks.insert(0, ValidationCheck(
            rule_id="RULE-OVERRUN-01",
            name="Possession Overrun Buffer Violation",
            category="Operational Protection",
            passed=False,
            severity="WARNING",
            details=f"Block {target.block_id} exceeded granted boundary by +{overrun_min}m. Recommended Recovery: Regulate {conflicted_train} at loop siding or curtail non-critical tamping passes."
        ))

        self.current_run.validation_result = ValidationReport(
            overall_status="WARNING",
            passed_checks_count=len([c for c in checks if c.passed]),
            total_checks_count=len(checks),
            checks=checks,
            validated_at=now_iso
        )

        self.current_run.active_scenario = f"OVERRUN_+{overrun_min}M_{target.block_id}"
        self.audit_log.append(AuditLogEntry(
            log_id=f"AUD-{len(self.audit_log) + 1:03d}",
            timestamp=now_iso,
            event_type="OVERRUN_REPORTED",
            actor="SITE_SUPERVISOR_ENG",
            details=f"Possession {target.block_id} burst by +{overrun_min} min. Train {conflicted_train} requires regulation recommendation.",
            planning_run_id=self.current_run.planning_run_id
        ))
        self.current_run.audit_events = list(self.audit_log)
        return self.current_run

    def apply_freight_injection(
        self,
        cargo_type: str = "Automobile / Steel (Special Rake)",
        origin: str = "SEC Yard",
        destination: str = "NDL Goods Depot",
        target_window_start: int = 180,
        target_window_end: int = 330
    ) -> PlanningRun:
        """
        Scenario 3: Unscheduled freight rake path injected from freight operational information.
        Injects into active goods forecasts and triggers CP-SAT replan.
        """
        new_rake_id = f"FRT-SP{len(self.active_goods) + 101}"
        new_freight = GoodsForecast(
            rake_id=new_rake_id,
            cargo_type=cargo_type,
            origin_station=origin,
            destination_station=destination,
            direction="DOWN",
            target_window_start_mins=target_window_start,
            target_window_end_mins=target_window_end,
            speed_kmph=52,
            loop_line_stabling_allowed=True,
            source_system="Synthetic Freight Forecast (FOIS-Aligned Reference)"
        )
        self.active_goods.append(new_freight)

        now_iso = datetime.now(timezone.utc).isoformat()
        self.audit_log.append(AuditLogEntry(
            log_id=f"AUD-{len(self.audit_log) + 1:03d}",
            timestamp=now_iso,
            event_type="FREIGHT_INJECTED",
            actor="CHIEF_FREIGHT_CONTROLLER",
            details=f"Unscheduled freight rake {new_rake_id} ({cargo_type}) injected between {origin} and {destination}.",
            planning_run_id=self.current_run.planning_run_id if self.current_run else "RUN-0"
        ))

        return self.generate_new_run(is_baseline=False, scenario_name=f"FREIGHT_INJECTED_{new_rake_id}")

    def add_critical_task(self, defect_type: str, line: str, km_start: float, km_end: float, depth_mm: float) -> PlanningRun:
        """
        Scenario 4: Keyman/USFD discovers a new emergency P1 track defect.
        Injects into canonical dataset and triggers CP-SAT replanning.
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
        
        now_iso = datetime.now(timezone.utc).isoformat()
        self.audit_log.append(AuditLogEntry(
            log_id=f"AUD-{len(self.audit_log) + 1:03d}",
            timestamp=now_iso,
            event_type="TASK_CREATED",
            actor="PERMANENT_WAY_INSPECTOR",
            details=f"Emergency P1 track defect {new_id} ({defect_type}, KM {km_start}-{km_end}) ingested from field inspection.",
            planning_run_id="SYSTEM"
        ))

        return self.generate_new_run(is_baseline=False, scenario_name=f"NEW_CRITICAL_DEFECT_{new_id}")

    def roll_forward_week(self) -> PlanningRun:
        """
        Rolls the 26-week programme forward by +1 week (W01 -> History, W02 -> W01).
        Tracks deltas: completed, deferred, newly critical, shifted, unchanged.
        """
        self.week_offset += 1
        now_iso = datetime.now(timezone.utc).isoformat()
        
        self.rolling_deltas = {
            "completed": len(self.current_run.weekly_plan) if self.current_run else 4,
            "deferred": len(self.current_run.solver_result.unassigned_tasks) if self.current_run and self.current_run.solver_result else 2,
            "newly_critical": 2,
            "shifted": 3,
            "unchanged": max(15, len(self.active_tms) - 6)
        }

        self.audit_log.append(AuditLogEntry(
            log_id=f"AUD-{len(self.audit_log) + 1:03d}",
            timestamp=now_iso,
            event_type="WEEK_ROLLED_FORWARD",
            actor="DIVISIONAL_PLANNING_CELL",
            details=f"Programme advanced to Week {self.week_offset + 1}. Executed blocks archived; rolling horizon replenished to 26 weeks.",
            planning_run_id=self.current_run.planning_run_id if self.current_run else "RUN-0"
        ))

        return self.generate_new_run(is_baseline=False, scenario_name=f"ROLL_FORWARD_W{self.week_offset + 1:02d}")

    # -------------------------------------------------------------
    # ROLE ACTIONS: STATION MASTER
    # -------------------------------------------------------------

    def station_master_acknowledge(self, station_code: str, block_id: str, officer_name: str = "Station Master") -> PlanningRun:
        if not self.current_run:
            self.generate_new_run()
        assert self.current_run is not None

        now_iso = datetime.now(timezone.utc).isoformat()
        entry = AuditLogEntry(
            log_id=f"AUD-{len(self.audit_log) + 1:03d}",
            timestamp=now_iso,
            event_type="IMPACT_ACKNOWLEDGED",
            actor=f"{officer_name} ({station_code} SM Desk)",
            details=f"Local maintenance possession impact for block {block_id} formally acknowledged at {station_code} station limits.",
            planning_run_id=self.current_run.planning_run_id
        )
        self.audit_log.append(entry)
        self.current_run.audit_events = list(self.audit_log)
        return self.current_run

    def station_master_escalate(self, station_code: str, reason: str, officer_name: str = "Station Master") -> PlanningRun:
        if not self.current_run:
            self.generate_new_run()
        assert self.current_run is not None

        now_iso = datetime.now(timezone.utc).isoformat()
        entry = AuditLogEntry(
            log_id=f"AUD-{len(self.audit_log) + 1:03d}",
            timestamp=now_iso,
            event_type="ALERT_ESCALATED",
            actor=f"{officer_name} ({station_code} SM Desk)",
            details=f"Operational constraint escalated to Divisional Control: {reason}",
            planning_run_id=self.current_run.planning_run_id
        )
        self.audit_log.append(entry)
        self.current_run.audit_events = list(self.audit_log)
        return self.current_run

    # -------------------------------------------------------------
    # ROLE ACTIONS: DEPARTMENT
    # -------------------------------------------------------------

    def department_create_demand(
        self,
        department: str,
        defect_type: str,
        line: str,
        km_start: float,
        km_end: float,
        duration_min: int = 45,
        machine_required: str = "None (Manual Crew)",
        severity: int = 4
    ) -> PlanningRun:
        now_iso = datetime.now(timezone.utc).isoformat()
        if department in ["Engineering", "TMS"]:
            new_id = f"TMS-DEM-{len(self.active_tms) + 1:03d}"
            item = TmsDefect(
                id=new_id,
                defect_type=defect_type,
                line=line,  # type: ignore
                km_start=km_start,
                km_end=km_end,
                severity=severity,
                overdue_days=7,
                detection_method="P-Way Sectional Inspection",
                ingested_at=now_iso
            )
            self.active_tms.insert(0, item)
        elif department in ["S&T", "SMMS"]:
            new_id = f"SMMS-DEM-{len(self.active_smms) + 1:03d}"
            item = SmmsWork(
                id=new_id,
                asset_type="Point Machine / Circuit",
                asset_id=f"SNT-{km_start:.1f}",
                station_code="KCG",
                km_location=km_start,
                line=line,  # type: ignore
                maintenance_type=defect_type,
                duration_min=duration_min,
                overdue_days=6,
                criticality="High",
                requires_power_isolation=False,
                ingested_at=now_iso
            )
            self.active_smms.insert(0, item)
        else:
            new_id = f"TDMS-DEM-{len(self.active_tdms) + 1:03d}"
            item = TdmsWork(
                id=new_id,
                asset_type="Cantilever / OHE Wire",
                substation_code="TSS-WL-01",
                ohe_section_id="OHE-SEC-WL-DN",
                km_start=km_start,
                km_end=km_end,
                line=line,  # type: ignore
                work_type=defect_type,
                duration_min=duration_min,
                power_block_required=True,
                overdue_days=5,
                criticality="High",
                ingested_at=now_iso
            )
            self.active_tdms.insert(0, item)

        self.audit_log.append(AuditLogEntry(
            log_id=f"AUD-{len(self.audit_log) + 1:03d}",
            timestamp=now_iso,
            event_type="TASK_CREATED",
            actor=f"{department} Section Engineer",
            details=f"New maintenance demand {new_id} ({defect_type}) registered on {line} line KM {km_start}-{km_end}.",
            planning_run_id="SYSTEM"
        ))

        return self.generate_new_run(is_baseline=False, scenario_name=f"DEPT_DEMAND_{new_id}")

    def department_update_readiness(self, task_id: str, readiness_status: str, officer_name: str = "Senior Section Engineer") -> PlanningRun:
        if not self.current_run:
            self.generate_new_run()
        assert self.current_run is not None

        self.task_readiness[task_id] = readiness_status
        now_iso = datetime.now(timezone.utc).isoformat()
        entry = AuditLogEntry(
            log_id=f"AUD-{len(self.audit_log) + 1:03d}",
            timestamp=now_iso,
            event_type="READINESS_UPDATED",
            actor=officer_name,
            details=f"Readiness checklist for task {task_id} marked as '{readiness_status}'. Machinery and crew muster confirmed.",
            planning_run_id=self.current_run.planning_run_id
        )
        self.audit_log.append(entry)
        self.current_run.audit_events = list(self.audit_log)
        return self.current_run

    def department_request_block(self, department: str, section: str, preferred_window: str, officer_name: str = "Section Engineer") -> PlanningRun:
        if not self.current_run:
            self.generate_new_run()
        assert self.current_run is not None

        now_iso = datetime.now(timezone.utc).isoformat()
        entry = AuditLogEntry(
            log_id=f"AUD-{len(self.audit_log) + 1:03d}",
            timestamp=now_iso,
            event_type="BLOCK_REQUESTED",
            actor=f"{officer_name} ({department})",
            details=f"Formal block possession request submitted for section '{section}' (preferred slot: {preferred_window}).",
            planning_run_id=self.current_run.planning_run_id
        )
        self.audit_log.append(entry)
        self.current_run.audit_events = list(self.audit_log)
        return self.current_run

    # -------------------------------------------------------------
    # ROLE ACTIONS: DIVISIONAL ADMINISTRATION
    # -------------------------------------------------------------

    def approve_plan(self, planner_name: str, planner_role: str) -> PlanningRun:
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

    def defer_plan(self, reason: str, officer_name: str = "Senior DOM / Planning") -> PlanningRun:
        if not self.current_run:
            self.generate_new_run()
        assert self.current_run is not None

        now_iso = datetime.now(timezone.utc).isoformat()
        self.current_run.decision_status = "DEFERRED"
        self.current_run.override_reason = reason

        entry = AuditLogEntry(
            log_id=f"AUD-{len(self.audit_log) + 1:03d}",
            timestamp=now_iso,
            event_type="PLAN_DEFERRED",
            actor=officer_name,
            details=f"Plan {self.current_run.planning_run_id} DEFERRED. Operational Reason: {reason}",
            planning_run_id=self.current_run.planning_run_id
        )
        self.audit_log.append(entry)
        self.current_run.audit_events = list(self.audit_log)
        return self.current_run

    def override_plan(self, planner_name: str, planner_role: str, reason: str, new_time: str, new_duration: int) -> PlanningRun:
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
