# RAILBLOCK — Data Contract & Canonical Schema Specification

This document defines the data contract for the six synthetic input feeds and the canonical runtime state entities.

---

## 1. Six Synthetic Input Feeds

| Source | Department / Domain | Record Count | Schema Model | Synthetic Representation |
|---|---|---|---|---|
| **TMS** | Civil / Track Maintenance | 18 | `TmsDefectInput` | Rail fractures, USFD flaws, weld defects, sleeper/ballast renewal demands |
| **SMMS** | Signalling & Telecom (S&T) | 14 | `SmmsWorkInput` | Point machine overhauls, track circuit testing, axle counter recalibrations |
| **TDMS** | Traction Distribution (OHE) | 15 | `TdmsWorkInput` | 25kV catenary adjustments, contact wire dropper renewals, insulator wash |
| **COA** | Control Office Application | 8 | `CoaTrain` | Express & Passenger services with exact sectional transit schedules |
| **FOIS** | Freight Operations System | 3 | `GoodsForecast` | Coal/cement goods train paths requiring window de-confliction |
| **BDMS** | Block Demand Management | 6 | `BlockCorridor` | Statutory corridor block sections across the Secunderabad–Nandyal line |

---

## 2. Canonical State Entities

### `PlanningRun`
The single source of truth for the active planning session:
```typescript
interface PlanningRun {
  planning_run_id: string;          // e.g. "RUN-MAS-2026-0923-0825"
  created_at: string;
  data_version: string;             // "SYNTHETIC_V1_PROTOTYPE"
  is_baseline: boolean;
  active_scenario: string | null;   // null, "BLOCK_DENIAL", "CRITICAL_TASK_ADDED"
  input_summary: InputSummary;
  prioritized_tasks: NormalizedTask[];
  composition_clusters: CompositionCluster[];
  weekly_plan: PlannedBlock[];
  monthly_plan: MonthlyPlanReservation[];
  validation_result: ValidationReport;
  backtest_result: BacktestResult;
  solver_result: SolverResult;
  decision_status: 'PENDING_REVIEW' | 'APPROVED' | 'OVERRIDDEN' | 'REPLANNED';
  approved_by: string | null;
  bdms_exports: BdmsExport[];
  audit_events: AuditLogEntry[];
}
```

### `NormalizedTask`
Unified 1D linear referencing representation of departmental maintenance:
```typescript
interface NormalizedTask {
  task_id: string;
  source_system: 'TMS' | 'SMMS' | 'TDMS';
  department: 'Engineering' | 'S&T' | 'Traction';
  title: string;
  km_start: number;
  km_end: number;
  line: 'UP' | 'DOWN' | 'BOTH';
  duration_min: number;
  safety_tier: 'P1' | 'P2' | 'P3' | 'P4';
  ml_ranking_score: number;
  within_tier_rank: number;
  machine_required: string;
  crew_required: number;
}
```
