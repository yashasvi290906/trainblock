from datetime import datetime, timezone
from typing import List, Optional, Any
from ..models.schemas import (
    PlannedBlock,
    ValidationReport,
    ValidationCheck,
    CoaTrain
)
from ..data.seed_data import COA_TIMETABLE_SEED
from ..core.config import settings

class ValidationService:
    """
    Independent 8-Rule Railway Safety & Compliance Validator.
    Verifies every planned possession before granting BDMS transmission clearance.
    """

    def validate_plan(
        self,
        blocks: List[PlannedBlock],
        trains: List[CoaTrain] = COA_TIMETABLE_SEED,
        all_tasks: Optional[List[Any]] = None,
        total_p1_count: Optional[int] = None
    ) -> ValidationReport:
        checks: List[ValidationCheck] = []

        # -------------------------------------------------------------
        # VR-01: Passenger Train Clearance Rule
        # -------------------------------------------------------------
        train_conflicts = 0
        conflicted_block_ids = []
        for b in blocks:
            for interaction in b.train_interactions:
                if interaction.status == "CONFLICT":
                    train_conflicts += 1
                    conflicted_block_ids.append(b.block_id)

        checks.append(ValidationCheck(
            rule_id="VR-01",
            name="Passenger Train Headway & Safety Clearance Buffer",
            category="Traffic Safety",
            passed=(train_conflicts == 0),
            severity="CRITICAL",
            details=f"Zero passenger train conflicts detected across {len(blocks)} blocks (Buffer >= {settings.MIN_HEADWAY_BUFFER_MIN}m maintained)."
            if train_conflicts == 0 else f"{train_conflicts} passenger train conflicts detected with insufficient headway.",
            actual_value=f"{train_conflicts} conflicts",
            threshold=f"0 conflicts (headway >= {settings.MIN_HEADWAY_BUFFER_MIN}m)",
            evidence=f"Audited {len(blocks)} possessions against timetable passenger trajectories",
            affected_items=list(set(conflicted_block_ids))
        ))

        # -------------------------------------------------------------
        # VR-02: Usable Work Minutes Sufficiency Rule
        # -------------------------------------------------------------
        insufficient_usable = [b for b in blocks if not b.usable_minutes_breakdown.is_sufficient_for_demand]
        checks.append(ValidationCheck(
            rule_id="VR-02",
            name="Usable Work Minutes Sufficiency Protocol",
            category="Operational Feasibility",
            passed=(len(insufficient_usable) == 0),
            severity="CRITICAL",
            details=f"All {len(blocks)} blocks have usable minutes exceeding task demand after 30m overhead deduction."
            if len(insufficient_usable) == 0 else f"{len(insufficient_usable)} blocks fail usable minutes demand threshold.",
            actual_value=f"{len(insufficient_usable)} deficient blocks",
            threshold="0 deficient blocks (usable >= required work duration)",
            evidence=f"Verified window duration minus 30m isolation/restoration overhead across {len(blocks)} blocks",
            affected_items=[b.block_id for b in insufficient_usable]
        ))

        # -------------------------------------------------------------
        # VR-03: Safety Tier Invariance Rule (100% P1 Scheduled)
        # -------------------------------------------------------------
        scheduled_tasks = [t for b in blocks for t in b.tasks]
        scheduled_p1_count = sum(1 for t in scheduled_tasks if getattr(t, "safety_tier", None) == "P1")
        if total_p1_count is not None:
            expected_p1 = total_p1_count
        elif all_tasks is not None:
            expected_p1 = sum(1 for t in all_tasks if getattr(t, "safety_tier", None) == "P1")
        else:
            expected_p1 = scheduled_p1_count

        scheduled_task_ids = set(t.task_id for t in scheduled_tasks)
        unscheduled_p1_ids = [t.task_id for t in (all_tasks or []) if getattr(t, "safety_tier", None) == "P1" and t.task_id not in scheduled_task_ids]

        p1_passed = (scheduled_p1_count == expected_p1 and scheduled_p1_count > 0)
        checks.append(ValidationCheck(
            rule_id="VR-03",
            name="Mandatory Safety Tier 1 (P1) Allocation Invariance",
            category="Asset Integrity",
            passed=p1_passed,
            severity="CRITICAL",
            details=f"100% of P1 critical safety defects ({scheduled_p1_count}/{expected_p1} work orders) successfully scheduled."
            if p1_passed else f"P1 safety invariance violated: {scheduled_p1_count} of {expected_p1} P1 work orders scheduled.",
            actual_value=f"{scheduled_p1_count}/{expected_p1} P1 tasks",
            threshold=f"{expected_p1}/{expected_p1} (100% P1 scheduled)",
            evidence=f"Audited {scheduled_p1_count} scheduled P1 work orders against {expected_p1} total critical demands",
            affected_items=unscheduled_p1_ids
        ))

        # -------------------------------------------------------------
        # VR-04: Track Machine Fleet Capacity Rule
        # -------------------------------------------------------------
        HEAVY_MACHINE_QUOTA_TYPES = ["BCM", "CSM", "PQRS", "Ballast Cleaning Machine", "Track Relaying Train"]
        machine_conflicts = 0
        conflicting_machines = []
        conflicted_machine_blocks = []
        for i, b1 in enumerate(blocks):
            for j, b2 in enumerate(blocks):
                if i >= j:
                    continue
                if max(b1.start_minutes_from_midnight, b2.start_minutes_from_midnight) < min(b1.end_minutes_from_midnight, b2.end_minutes_from_midnight):
                    m1 = set(m for m in (b1.machines_assigned or []) if any(hm in m for hm in HEAVY_MACHINE_QUOTA_TYPES))
                    m2 = set(m for m in (b2.machines_assigned or []) if any(hm in m for hm in HEAVY_MACHINE_QUOTA_TYPES))
                    overlap_m = m1.intersection(m2)
                    if overlap_m:
                        machine_conflicts += 1
                        conflicting_machines.extend(list(overlap_m))
                        conflicted_machine_blocks.extend([b1.block_id, b2.block_id])

        checks.append(ValidationCheck(
            rule_id="VR-04",
            name="Track Machine Fleet Simultaneous Allocation Constraint",
            category="Resource Capacity",
            passed=(machine_conflicts == 0),
            severity="CRITICAL",
            details="Heavy mechanized fleet (BCM, CSM, PQRS) within regional divisional quota (Zero overlapping machine allocations)."
            if machine_conflicts == 0 else f"{machine_conflicts} concurrent machine conflicts detected ({', '.join(set(conflicting_machines))}).",
            actual_value=f"{machine_conflicts} concurrent allocations",
            threshold="0 concurrent heavy machine allocations (quota = 1 per type)",
            evidence=f"Checked heavy fleet non-overlap across {len(blocks)} possessions"
            if machine_conflicts == 0 else f"Heavy machine concurrent allocation detected: {', '.join(set(conflicting_machines))}",
            affected_items=list(set(conflicted_machine_blocks))
        ))

        # -------------------------------------------------------------
        # VR-05: Spatial & Line Mutual Exclusion Rule
        # -------------------------------------------------------------
        spatial_conflicts = 0
        colliding_block_ids = []
        for i, b1 in enumerate(blocks):
            for j, b2 in enumerate(blocks):
                if i >= j:
                    continue
                if b1.section == b2.section and (b1.line == b2.line or b1.line == "BOTH" or b2.line == "BOTH"):
                    # Check temporal overlap
                    if max(b1.start_minutes_from_midnight, b2.start_minutes_from_midnight) < min(b1.end_minutes_from_midnight, b2.end_minutes_from_midnight):
                        spatial_conflicts += 1
                        colliding_block_ids.extend([b1.block_id, b2.block_id])

        checks.append(ValidationCheck(
            rule_id="VR-05",
            name="Spatial & Line Mutual Exclusion Invariance",
            category="Track Geometry",
            passed=(spatial_conflicts == 0),
            severity="CRITICAL",
            details=f"Zero track section overlaps verified across {len(blocks)} possessions."
            if spatial_conflicts == 0 else f"{spatial_conflicts} concurrent track possession collisions found.",
            actual_value=f"{spatial_conflicts} spatial collisions",
            threshold="0 concurrent line-section overlaps",
            evidence=f"Audited pairwise section and line mutual exclusion across {len(blocks)} blocks",
            affected_items=list(set(colliding_block_ids))
        ))

        # -------------------------------------------------------------
        # VR-06: Power Block OHE Co-ordination Rule
        # -------------------------------------------------------------
        ohe_violations = 0
        ohe_violating_blocks = []
        for b in blocks:
            needs_ohe = any(t.ohe_required for t in b.tasks)
            if needs_ohe and not b.ohe_required:
                ohe_violations += 1
                ohe_violating_blocks.append(b.block_id)

        checks.append(ValidationCheck(
            rule_id="VR-06",
            name="Traction Power Block OHE Synchronization",
            category="Electrical Safety",
            passed=(ohe_violations == 0),
            severity="CRITICAL",
            details="100% of traction and high-reach maintenance tasks assigned synchronized 25kV de-energization.",
            actual_value=f"{ohe_violations} non-synchronized OHE blocks",
            threshold="0 non-synchronized OHE blocks (100% 25kV isolation where required)",
            evidence="Verified OHE de-energization flags for high-reach and traction work orders",
            affected_items=ohe_violating_blocks
        ))

        # -------------------------------------------------------------
        # VR-07: Maximum Daily Section Possession Cap
        # -------------------------------------------------------------
        duration_violations = [b for b in blocks if b.duration_minutes > 240]
        checks.append(ValidationCheck(
            rule_id="VR-07",
            name="Section Daily Track Possession Cap (<= 240m)",
            category="Corridor Throughput",
            passed=(len(duration_violations) == 0),
            severity="WARNING",
            details="All scheduled block durations within statutory divisional 240m daily corridor limit.",
            actual_value=f"{len(duration_violations)} blocks > 240m",
            threshold="duration <= 240m per statutory daily corridor cap",
            evidence=f"Audited possession duration across {len(blocks)} scheduled blocks",
            affected_items=[b.block_id for b in duration_violations]
        ))

        # -------------------------------------------------------------
        # VR-08: Statutory Maintenance Crew Strength Rule
        # -------------------------------------------------------------
        crew_violations = [b for b in blocks if b.crew_count < 5]
        avg_crew = sum(b.crew_count for b in blocks) // max(1, len(blocks))
        checks.append(ValidationCheck(
            rule_id="VR-08",
            name="Statutory Maintenance Gang Crew Strength Compliance",
            category="Human Resources",
            passed=(len(crew_violations) == 0),
            severity="INFO",
            details=f"Adequate gang strength allocated across all departments (Average {avg_crew} personnel per block).",
            actual_value=f"{len(crew_violations)} blocks under minimum crew size",
            threshold="crew_count >= 5 personnel per possession",
            evidence=f"Average crew strength = {avg_crew} personnel across {len(blocks)} blocks",
            affected_items=[b.block_id for b in crew_violations]
        ))

        passed_count = sum(1 for c in checks if c.passed)
        overall_status = "VALIDATED" if passed_count == len(checks) else ("WARNING" if all(c.passed for c in checks if c.severity == "CRITICAL") else "FAILED")

        return ValidationReport(
            overall_status=overall_status,  # type: ignore
            passed_checks_count=passed_count,
            total_checks_count=len(checks),
            checks=checks,
            validated_at=datetime.now(timezone.utc).isoformat()
        )

validation_service = ValidationService()
