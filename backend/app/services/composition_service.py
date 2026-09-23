from typing import List, Dict, Optional
from ..models.schemas import (
    NormalizedTask,
    CompositionCluster,
    JobSequenceItem,
    UsableMinutesDecomposition
)
from ..core.config import settings

class CompositionService:
    """
    Synthesizes multi-departmental work orders into physically sound,
    precedence-ordered clusters with exact usable work minute calculations.
    """

    def calculate_usable_minutes(self, raw_minutes: int, work_demand_minutes: int) -> UsableMinutesDecomposition:
        """
        Decomposes raw track possession into operational overhead vs usable work.
        """
        iso = settings.NOMINAL_ISOLATION_MIN
        earth = settings.NOMINAL_EARTHING_MIN
        transit = settings.NOMINAL_TRANSIT_MIN
        restore = settings.NOMINAL_RESTORATION_MIN
        total_overhead = iso + earth + transit + restore
        usable = max(0, raw_minutes - total_overhead)

        return UsableMinutesDecomposition(
            raw_possession_minutes=raw_minutes,
            isolation_minutes=iso,
            earthing_minutes=earth,
            machine_transit_minutes=transit,
            restoration_minutes=restore,
            total_overhead_minutes=total_overhead,
            usable_work_minutes=usable,
            is_sufficient_for_demand=(usable >= work_demand_minutes),
            work_demand_minutes=work_demand_minutes,
            margin_minutes=usable - work_demand_minutes
        )

    def _determine_job_precedence(self, tasks: List[NormalizedTask]) -> List[JobSequenceItem]:
        """
        Orders tasks inside a cluster adhering to railway physics and safety protocols:
        1. Engineering heavy track work (BCM/Welding/Rail renewal)
        2. Track Tamping / Dynamic Track Stabiliser (CSM/DGS)
        3. Traction / OHE adjustment or inspection
        4. S&T point machine & track circuit re-connection and certification
        """
        def precedence_key(t: NormalizedTask) -> int:
            if "BCM" in t.machine_required or "Deep Screening" in t.title:
                return 1
            if "Rail" in t.asset_type or "Weld" in t.title:
                return 2
            if "Tamping" in t.machine_required or "CSM" in t.machine_required:
                return 3
            if t.department == "Traction" or t.ohe_required:
                return 4
            if t.department == "S&T":
                return 5
            return 6

        sorted_tasks = sorted(tasks, key=precedence_key)
        sequence: List[JobSequenceItem] = []

        for idx, t in enumerate(sorted_tasks, start=1):
            lag = 0
            lag_reason = None
            if idx < len(sorted_tasks):
                next_t = sorted_tasks[idx]
                if ("BCM" in t.machine_required or "Deep Screening" in t.title) and ("Tamping" in next_t.machine_required):
                    lag = 15
                    lag_reason = "15 min ballast consolidation and tamper alignment gap"
                elif t.department == "Engineering" and next_t.department == "S&T":
                    lag = 10
                    lag_reason = "10 min track circuit bond restoration and point machine test gap"
                elif t.department == "Traction" and next_t.department == "S&T":
                    lag = 5
                    lag_reason = "5 min traction current drain verification"

            sequence.append(JobSequenceItem(
                sequence_order=idx,
                task_id=task_id_clean(t.task_id),
                task_title=t.title,
                department=t.department,
                duration_min=t.duration_min,
                lag_after_min=lag,
                lag_reason=lag_reason
            ))

        return sequence

    def compose_tasks(self, tasks: List[NormalizedTask]) -> List[CompositionCluster]:
        """
        Groups tasks spatially (within section and line) and evaluates compatibility.
        """
        # Bucket by (corridor_section_id, line)
        buckets: Dict[str, List[NormalizedTask]] = {}
        for task in tasks:
            key = f"{task.corridor_section_id}_{task.line}"
            if key not in buckets:
                buckets[key] = []
            buckets[key].append(task)

        clusters: List[CompositionCluster] = []
        cluster_counter = 1

        for key, bucket_tasks in buckets.items():
            section_id = bucket_tasks[0].corridor_section_id
            line = bucket_tasks[0].line
            
            # Sort by KM start
            bucket_tasks.sort(key=lambda t: t.km_start)

            # Sub-cluster tasks that are within spatial proximity (e.g. <= 6.0 km apart)
            current_sub_cluster: List[NormalizedTask] = []
            
            for task in bucket_tasks:
                if not current_sub_cluster:
                    current_sub_cluster.append(task)
                else:
                    prev_task = current_sub_cluster[-1]
                    # Check spatial distance
                    dist = abs(task.km_start - prev_task.km_end)
                    if dist <= 6.0 and len(current_sub_cluster) < 4:
                        current_sub_cluster.append(task)
                    else:
                        clusters.append(self._build_cluster(cluster_counter, section_id, line, current_sub_cluster))
                        cluster_counter += 1
                        current_sub_cluster = [task]

            if current_sub_cluster:
                clusters.append(self._build_cluster(cluster_counter, section_id, line, current_sub_cluster))
                cluster_counter += 1

        return clusters

    def _build_cluster(self, counter: int, section_id: str, line: str, tasks: List[NormalizedTask]) -> CompositionCluster:
        km_start = min(t.km_start for t in tasks)
        km_end = max(t.km_end for t in tasks)
        departments = list(dict.fromkeys(t.department for t in tasks))
        ohe_needed = any(t.ohe_required for t in tasks)
        machines = list(dict.fromkeys(t.machine_required for t in tasks if t.machine_required != "None"))
        
        sequence = self._determine_job_precedence(tasks)
        
        # Concurrent execution across departmental gangs (Engg, S&T, Traction)
        dept_durations: Dict[str, int] = {}
        for item in sequence:
            dept_durations[item.department] = dept_durations.get(item.department, 0) + item.duration_min
        
        work_duration = max(dept_durations.values()) if dept_durations else 60
        lags_duration = max(item.lag_after_min for item in sequence) if sequence else 0
        
        overhead = settings.NOMINAL_ISOLATION_MIN + settings.NOMINAL_EARTHING_MIN + settings.NOMINAL_TRANSIT_MIN + settings.NOMINAL_RESTORATION_MIN
        required_block = work_duration + lags_duration + overhead

        why_combined = []
        if len(tasks) > 1:
            why_combined.append(f"Multi-departmental synergy: Combined {len(tasks)} tasks across {', '.join(departments)}")
            why_combined.append(f"Shared spatial span: KM {km_start:.1f} to {km_end:.1f} within section {section_id}")
            if ohe_needed:
                why_combined.append("Consolidated single OHE de-energization window for all track and overhead assets")
            saved_overheads = (len(tasks) - 1) * overhead
            why_combined.append(f"Eliminated {saved_overheads} minutes of redundant isolation/earthing/transit overheads")
        else:
            why_combined.append(f"Independent safety-critical work order on {line} line")

        return CompositionCluster(
            cluster_id=f"CLUS-{counter:03d}",
            corridor_section_id=section_id,
            line=line,  # type: ignore
            km_start=km_start,
            km_end=km_end,
            tasks=tasks,
            departments=departments,
            total_work_duration_min=work_duration,
            total_sequential_lags_min=lags_duration,
            required_block_window_min=required_block,
            ohe_required=ohe_needed,
            machines_assigned=machines,
            is_compatible=True,
            why_combined_reasons=why_combined,
            why_not_combined_reasons=None,
            job_sequence=sequence
        )

def task_id_clean(tid: str) -> str:
    return tid

composition_service = CompositionService()
