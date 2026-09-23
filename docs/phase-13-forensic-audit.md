# RAILBLOCK — Phase 13 Final Forensic Audit Report

This report summarizes the forensic verification of the complete RAILBLOCK system for Problem Statement 26027.

---

## 1. Verified System Claims
- $\checkmark$ **6 Ingestion Feeds**: Ingests and maps 47 demands across TMS, SMMS, TDMS, COA, FOIS, and BDMS.
- $\checkmark$ **1D Linear Referencing Topology**: Continuous corridor referencing along SEC KM 40 to NDL KM 120.
- $\checkmark$ **Safety Prioritization Tiers**: 4 P1, 28 P2, 14 P3, 1 P4 deterministically assigned by safety boundary rules.
- $\checkmark$ **Within-Tier XGBoost ML Ranker**: Feature matrix passed to `xgb.XGBRegressor`, producing continuous ranking scores within tiers (verified via ablation test with $+19.47$ delta).
- $\checkmark$ **Physics-Aware Composition**: 47 demands grouped into 14 multi-departmental clusters ($\le 3.0\text{km}$ proximity, BCM $\rightarrow$ Tamping precedence with $15\text{m}$ lag).
- $\checkmark$ **Usable Minutes Decomposition**: Exact $30\text{m}$ overhead ($10\text{m}$ isolation $+ 10\text{m}$ transit $+ 10\text{m}$ restoration) deducted from raw possession durations.
- $\checkmark$ **Google OR-Tools CP-SAT Solver**: Solves in $50.14\text{ms}$ with `OPTIMAL` status, scheduling 8 blocks.
- $\checkmark$ **100% P1 Allocation Invariance**: Exactly 4/4 P1 critical safety defects scheduled in the weekly plan.
- $\checkmark$ **Independent 8-Rule Safety Validator**: VR-01 to VR-08 certified with zero express train collisions.
- $\checkmark$ **Comparative Siloed vs Integrated Backtester**: Evaluated on identical data; proves $83\%$ block reduction and $2,160\text{m}$ track capacity saved.
- $\checkmark$ **Human-in-the-Loop Decision & BDMS Export**: Interactive review, override reason logging, and standardized BDMS sanction request generation.
- $\checkmark$ **Scenario Replanning Engine**: Live mutation and CP-SAT re-optimization under Block Denial and Critical Defect Addition.

---

## 2. Failed / Fixed Claims During Audit
- **Issue**: Minor type export gap in `runs.ts` during initial compile.  
  **Resolution**: Fixed by explicitly re-exporting `PlannerOverrideRequest` and `AuditLogEntry`. Frontend compiles cleanly across all 17 routes.
- **Issue**: Ensure XGBoost ranker does not override deterministic safety tier boundaries.  
  **Resolution**: Invariant verified in [`backend/app/services/prioritization_service.py`](file:///d:/trainblock/backend/app/services/prioritization_service.py) where sorting is performed strictly by `(tier_weight, ml_ranking_score)`.

---

## 3. Features Explicitly Categorized as Roadmap
- **Live CRIS & Production Railway APIs**: Live connection to TMS/SMMS/TDMS production feeds requires Railway Board data-sharing authorization.
- **Direct Signalling Interlocking Control**: System operates purely in an **Advisory** role generating BDMS sanction requests for Chief Block Planners.

---

## 4. Test & Verification Execution Summary
1. **Pytest Backend Test Suite**: `11/11 PASSED` in 6.42s (`pytest app/tests -v`)
2. **CLI Pipeline Runner (`scripts/run_demo.py`)**: `PASSED` in 50ms with `OPTIMAL` status
3. **Next.js Production Build**: `17/17 routes compiled with 0 errors` (`npm run build`)
4. **Active Runtime Servers**:
   - Backend API: `http://127.0.0.1:8000`
   - Frontend Workstation: `http://localhost:3000`
