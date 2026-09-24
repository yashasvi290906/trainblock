# RAILBLOCK (रैलब्लॉक)
### AI-Powered Automatic Block Planning for Indian Railways
**Smart India Hackathon (SIH) 2026 — Problem Statement 26027**  
*"AI-Powered Automatic Block Planning to Maximize Asset Availability for Train Operations on Indian Railways."*

---

## 1. Executive Summary

RAILBLOCK is an AI-assisted railway maintenance block planning control desk engineered specifically for Indian Railways (IR) zonal and divisional operations. It balances the conflicting mandates of high-density train operations and critical asset maintenance by deterministically solving multi-department corridor possession windows.

The prototype models the **Secunderabad (SEC) – Nandyal (NDL) 80km Corridor (KM 40.0–120.0, Double Line, South Central Railway)** using synthetic operational topology and timetable data aligned with IR CTC/RDSO dispatching conventions.

> **Operational Prototype Disclosure**:  
> All data used in this demonstration is **modeled synthetic operational data** reflecting real Indian Railways operating rules, asset types, and timetables. RAILBLOCK does not claim direct live API integration with production CRIS / COA / FOIS / TMS systems; instead, it provides normalized adapter schemas ready for divisional deployment.

---

## 2. Canonical RAILBLOCK Solution Pipeline

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│ 6 INGESTION  │ ──► │  DETERMINISTIC │ ──► │  XGBOOST ML  │ ──► │ MULTI-DEPT   │
│ FEEDS (TMS,  │     │ SAFETY TIER  │     │ RANKING      │     │ COMPOSITION  │
│ SMMS, TDMS)  │     │ (P1,P2,P3,P4)│     │ (Within-Tier)│     │ (≤3km Spatial)│
└──────────────┘     └──────────────┘     └──────────────┘     └──────────────┘
                                                                       │
                                                                       ▼
┌──────────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│ HUMAN-IN-    │ ◄── │ INDEPENDENT  │ ◄── │  WEEKLY &    │ ◄── │  OR-TOOLS    │
│ THE-LOOP     │     │ 8-RULE       │     │  MONTHLY /   │     │  CP-SAT      │
│ APPROVAL     │     │ VALIDATION   │     │  26W PROGRAM │     │  OPTIMIZER   │
└──────────────┘     └──────────────┘     └──────────────┘     └──────────────┘
       │
       ▼
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│ BDMS EXPORT  │ ──► │ WHAT-IF      │ ──► │ COMPARATIVE  │
│ (Sanction    │     │ SCENARIOS    │     │ BACKTEST     │
│ Request JSON)│     │ (Denial/Over)│     │ (Downtime Δ) │
└──────────────┘     └──────────────┘     └──────────────┘
```

1. **Ingest & Unify**: 6 canonical data feeds (TMS Track Defects, SMMS Signal Disconnections, TDMS OHE Power Blocks, COA Timetable, Freight Forecasts, Corridor Geometry).
2. **Deterministic Safety Tiering**: IR safety rules strictly assign tasks into non-negotiable tiers:
   - **P1**: Emergency safety flaws (USFD flaw progression, switches/turnouts ≥5d, broken rails).
   - **P2**: Urgent corrective maintenance (overdue ≥5d, BCM / Tamping machine requirements).
   - **P3**: Scheduled preventive maintenance (routine renewals, weld neutralisation).
   - **P4**: Routine patrol and asset cleanliness.
3. **ML Prioritization (Critical Safety Invariant)**: XGBoost gradient-boosted trees rank tasks *strictly within* each safety tier based on features including asset criticality, overdue days, traffic density, and failure history. **ML can never downgrade a P1 task to P2/P3/P4.**
4. **Multi-Department Composition**: Spatial clustering groups compatible work within ≤3km possessing identical line protection into unified possession packages.
5. **Candidate Window Generation & Usable Time**: Deducts setup (15 min) and restoration/clearing (15 min) overhead:
   $$\text{Usable Work Minutes} = \text{Window Duration} - 30\text{ min}$$
6. **CP-SAT Constraint Optimization**: Mixed-Integer Programming solves window assignment satisfying hard constraints (zero passenger conflicts, resource exclusivity, machine sequencing).
7. **Multi-Horizon Planning**: Weekly plan (W01), Monthly plan (W01–W04), and 26-Week Rolling Block Programme with dynamic roll-forward (`W01 → W02`).
8. **Independent Validator**: A separate 8-rule compliance checker independently audits the schedule before planner review.
9. **Human-in-the-Loop Decision**: The Chief Controller reviews, modifies, defers, or approves blocks. Approval is strictly separated from operational grant.
10. **Standardized BDMS Export**: Outputs compliant Block Demand Management System (BDMS) sanction request payloads.

---

## 3. Technology Stack

- **Frontend**: Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS, Lucide Icons.
- **Backend**: FastAPI (Python 3.11+), Pydantic v2 schemas, Uvicorn ASGI server.
- **Optimization**: Google OR-Tools CP-SAT (Constraint Programming - Satisfiability).
- **Machine Learning**: XGBoost continuous ranking regressor with Scikit-Learn feature transformers.
- **Spatial Architecture**: 1D linear referencing (`KM 40.0–120.0`) with spatial boundary indexes, designed for PostGIS geometry mapping in production deployment.
- **Visualization**: RDSO CTC-aligned Marey diagram (time-distance string chart), multi-department Gantt schedule, and HTML5 Canvas corridor simulator.

---

## 4. Key Routes & Role Desks

| Route | Role / Desk | Canonical Capabilities |
|---|---|---|
| `/` | **Executive Overview** | Division health, active PlanningRun metrics, solver provenance, P1 completion status. |
| `/plan` | **Block Planner** | Candidate window selection, Gantt visualization, usable time breakdown, approval actions. |
| `/corridor` | **Corridor Control** | RDSO CTC-aligned Marey time-distance diagram, train stringlines, possession envelopes. |
| `/live-corridor`| **Physical Track View** | Section topology (SEC–NDL), active signals, machine locations, corridor stations. |
| `/rolling` | **Rolling Horizon** | 26-Week Rolling Block Programme, 1-Month schedule, dynamic weekly roll-forward (`W01 → W02`). |
| `/what-if` | **Scenario Lab** | Operating block denial (re-solve), block overrun (+35 min reforecast), freight injection. |
| `/evidence` | **Evidence & Reports** | 8-rule validation report, solver provenance, comparative backtest against siloed baseline. |
| `/station-master` | **Station Master Desk** | Local station view (KCG/NDL), approaching trains, local block possession status. |
| `/department` | **Maintenance Desk** | Engineering, S&T, and TRD task work register, machine allocation, departmental readiness. |
| `/administration`| **Sr. DOM / Divisional Desk** | Division-wide block approval queue, backtest metrics, P1 safety compliance summary. |

---

## 5. Verification & Testing

### Backend Test Suite (pytest)
```bash
cd backend
$env:PYTHONPATH='.' ; .\venv\Scripts\pytest.exe -v
```
**Test Results: 18 passed in ~18s**
- `test_ingestion_feed_counts`: Verifies 47 maintenance demands, 8 timetable express trains, 3 freight forecasts, 6 corridor sections.
- `test_safety_prioritization_and_xgboost_ranker`: Verifies deterministic P1..P4 safety tiers and XGBoost rank monotonicity within tiers.
- `test_composition_clusters_and_usable_minutes`: Verifies multi-department clustering and setup/restoration deduction math.
- `test_cp_sat_solver_execution`: Verifies OR-Tools CP-SAT optimal/feasible schedule generation and 100% P1 coverage.
- `test_validation_report`: Verifies independent 8/8 rule validation.
- `test_comparative_backtesting`: Verifies deterministic downtime reduction and zero passenger delay.
- `test_bdms_export_generation`: Verifies BDMS/SCR/SC compliant JSON sanction request payloads.
- `test_ml_cannot_downgrade_safety_priority`: Mathematically asserts that ML ranking never demotes a P1 task.
- `test_scenario_block_denial_and_replanning`: Verifies dynamic re-solve upon block denial.
- `test_scenario_overrun_35min`: Verifies downstream conflict reforecasting upon possession overrun.
- `test_rolling_programme_26w_and_roll_forward`: Verifies 26-week horizon and state mutation upon roll-forward.
- `test_role_actions`: Verifies shared `PlanningRun` state consistency across Station Master, Department, and Administration desks.

### Frontend Quality & Production Build
```bash
npm run lint
npm run build
```
- **Lint**: 0 errors.
- **Build**: Successfully compiled 26 static pages via Next.js Turbopack with zero TypeScript errors.

---

## 6. How to Run Locally

### 1. Start the FastAPI Backend
```bash
cd backend
python -m venv .venv
.\.venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```

### 2. Start the Next.js Frontend
```bash
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 7. SIH 2026 Submission Integrity

- **Problem Statement ID**: 26027
- **Corridor Topology**: Secunderabad (SEC) – Nandyal (NDL), South Central Railway (SCR), KM 40–120.
- **No Fake Data / Fallbacks**: All KPIs, solver statuses, validation reports, and scenarios are dynamically computed from the active `PlanningRun`.
- **Honest Prototype Scope**: Visualizations are RDSO CTC-aligned; integrations are prototype adapter schemas; human controller retains final approval authority.
