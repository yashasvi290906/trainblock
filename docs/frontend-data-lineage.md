# RAILBLOCK — Frontend Data Lineage & Backend State Mapping

This document proves the exact origin of every operational metric and data visualization displayed across the RAILBLOCK frontend workstation.

---

## 1. Page-by-Page Data Lineage Map

```
                                [ BACKEND ENGINE ]
                   PlanningRunManager.current_run (RUN-2026-001)
                                       │
                                       ▼
                   [ FASTAPI REST API / CLIENT LAYER ]
               GET /runs/current -> PlanningRunContext.tsx
                                       │
         ┌─────────────────────────────┼─────────────────────────────┐
         ▼                             ▼                             ▼
  [/work-register]              [/block-planner]              [/time-distance]
  prioritized_tasks             composition_clusters          weekly_plan + coa_trains
  - Task Titles                 - Cluster Sections            - Train Paths & Times
  - Deterministic Safety Tiers  - Dept Combinations           - Scheduled Blocks
  - Within-Tier XGBoost Ranks   - Usable Minutes Breakdown    - Clearance Margins
         │                             │                             │
         ▼                             ▼                             ▼
  [/scenarios]                  [/analysis]                   [/decision]
  Mutations:                    backtest_result               validation_result + bdms
  - scenarioDenyBlock()         - Siloed Baseline Metrics     - 8-Rule VR-01..08 Status
  - scenarioAddCriticalTask()   - RAILBLOCK Plan Metrics      - Human Review & Sign-Off
  - triggerReplan()             - 2,160m Saved Calculation   - BDMS Sanction Export
```

---

## 2. Key UI Metrics Traceability

| UI Location | Displayed Value | Mathematical Source | Exact API Field |
|---|---|---|---|
| **Header / Global** | `RUN-2026-001` | Active Session UUID | `PlanningRun.planning_run_id` |
| **Work Register** | `47 Demands (4 P1, 28 P2)` | Seed Feeds + Safety Classifier | `PlanningRun.prioritized_tasks` |
| **Task Detail Drawer** | `ML Rank #1 (Score: 82.38)` | Pre-trained XGBoost Model | `NormalizedTask.ml_ranking_score` |
| **Block Planner** | `8 Blocks (105m Usable)` | CP-SAT Solver + Decomposition | `PlannedBlock.usable_minutes_breakdown` |
| **Time-Distance** | `Zero Conflicts, 15m Buffer` | CP-SAT Collision Constraint | `PlannedBlock.train_interactions` |
| **Analysis Page** | `83% Block Reduction` | Backtest Delta Engine | `BacktestResult.comparison.block_reduction_pct` |
| **Analysis Page** | `2,160 Mins Track Saved` | Possession Delta Calculation | `BacktestResult.comparison.possession_minutes_saved` |
| **Analysis Page** | `94.8% Asset Availability` | Section Capacity Downtime Model | `BacktestMetrics.asset_availability_score` |
| **Decision Page** | `VALIDATED (8/8 Passed)` | 8-Rule Independent Validator | `ValidationReport.overall_status` |
| **Decision Page** | `BDMS/SR/MAS/2026/0001` | BDMS Sanction Request Serializer| `BdmsExport.bdms_reference` |
