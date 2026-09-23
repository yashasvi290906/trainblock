# RAILBLOCK — Judge Demonstration Script & Walkthrough Guide

This script guides presenters through delivering a high-impact, 5–7 minute technical evaluation to a Smart India Hackathon jury or Senior Indian Railways Railway Board panel using the dedicated `/demo` workstation.

---

## 1. Step-by-Step 5–7 Minute Walkthrough Script

| Time | Stage | Action on Screen | Narrative for Evaluator | Underlying Technical Evidence |
|---|---|---|---|---|
| **0:00 – 0:45** | **Stage 1: The Problem** | Open `/demo` Stage 1. Highlight the 3 comparison cards. | "In Indian Railways, Engineering, Signalling, and Traction file separate block requests on shared corridors, causing severe overhead waste ($1,410\text{m}$) and $145\text{m}$ passenger delay. RAILBLOCK unifies this into one coordinated plan." | Siloed Baseline: 47 blocks, $3,405\text{m}$ possession, 7 train conflicts. |
| **0:45 – 1:30** | **Stage 2: The Inputs** | Click Stage 2. Inspect the 6 input counters. | "We ingest 47 synthetic demands from TMS (18 track flaws), SMMS (14 signalling jobs), and TDMS (15 OHE jobs) alongside COA express timetables and goods forecasts into a continuous 1D linear referencing corridor model." | [`backend/app/services/ingestion_service.py`](file:///d:/trainblock/backend/app/services/ingestion_service.py). |
| **1:30 – 2:30** | **Stage 3: Prioritize & Compose** | Click Stage 3. Review Safety Tiers + 14 Clusters. | "Crucially, ML does not override railway safety. Non-negotiable boundary rules set tiers P1 to P4. An XGBoost model ranks tasks *strictly within each tier*. We compose tasks within $\le 3\text{km}$ enforcing engineering sequence lags (e.g. BCM $\rightarrow$ Tamping $\ge 15\text{m}$)." | [`backend/app/services/prioritization_service.py`](file:///d:/trainblock/backend/app/services/prioritization_service.py), [`backend/app/ml/ranker.py`](file:///d:/trainblock/backend/app/ml/ranker.py). |
| **2:30 – 3:30** | **Stage 4: CP-SAT Optimization** | Click Stage 4. Show solver status and 8 scheduled blocks. | "Google OR-Tools CP-SAT solves the mixed-integer scheduling problem in $50\text{ms}$ with status `OPTIMAL`. It satisfies zero express collisions and guarantees $100\%$ P1 safety defect inclusion, allocating 8 consolidated blocks." | [`backend/app/optimization/cp_sat_planner.py`](file:///d:/trainblock/backend/app/optimization/cp_sat_planner.py) ($50.14\text{ms}$ solve). |
| **3:30 – 4:15** | **Stage 5: Train Protection** | Click Stage 5. Inspect block `BLK-2026-103`. | "Notice how Block 103 sits cleanly between Express 12728 and Express 17015 with a non-negotiable $20\text{m}$ safety buffer ($> 15\text{m}$ required). The independent validator certifies VR-01 with zero passenger conflicts." | Independent 8-Rule Validator (`VR-01` to `VR-08`). |
| **4:15 – 5:30** | **Stage 6: What-If Replanning** | Click Stage 6. Click 'Execute Block Denial'. | "What if Operating denies a prime slot? Watch: we deny Block 101, and CP-SAT re-optimizes the entire schedule in real-time, finding the next best feasible window without dropping critical safety work." | Real-time backend replan via `PlanningRunManager.deny_block()`. |
| **5:30 – 6:30** | **Stage 7: Backtest & Sanction** | Click Stage 7. Click 'Approve Plan' & 'Download BDMS'. | "Our deterministic backtest proves an $83\%$ reduction in block demands, $2,160\text{m}$ track capacity saved, and a $94.8\%$ asset availability score. The Chief Block Planner approves the plan and exports official BDMS sanction requests." | [`backend/app/services/backtest_service.py`](file:///d:/trainblock/backend/app/services/backtest_service.py), [`backend/app/services/export_service.py`](file:///d:/trainblock/backend/app/services/export_service.py). |

---

## 2. Key Talking Points for Evaluators
- **Honest Prototype Scope**: Always emphasize: *"This prototype runs on realistic synthetic data calibrated to South Central Railway and CAG audit reports. Live integration requires Railway Board and CRIS authorization."*
- **Advisory Role**: Always emphasize: *"RAILBLOCK recommends. The Chief Block Planner decides. Signalling control is never automated."*
- **Mathematical Rigor**: Emphasize: *"The 2,160 minutes saved and 8 scheduled blocks are dynamically calculated by Google OR-Tools CP-SAT on the fly—not hard-coded."*
