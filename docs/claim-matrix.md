# RAILBLOCK — SIH PPT Claim Verification Matrix

This matrix maps every claim from the SIH Submission Presentation ([`innobyte_4.pptx`](file:///d:/trainblock/innobyte_4.pptx)) to its concrete technical implementation, source of evidence, and honest labelling in RAILBLOCK.

---

| PPT Claim / Feature | Technical Implementation | Source of Evidence | Status | UI Location | Honest Label Required |
|---|---|---|---|---|---|
| **6 Ingestion Feeds** | Adapters for TMS, SMMS, TDMS, COA, FOIS, BDMS | [`backend/app/services/ingestion_service.py`](file:///d:/trainblock/backend/app/services/ingestion_service.py) | **Implemented** | `/work-register`, `/system` | Synthetic Prototype Data |
| **Unified Location Model** | 1D linear referencing along SEC-NDL corridor | [`backend/app/services/location_service.py`](file:///d:/trainblock/backend/app/services/location_service.py) | **Implemented** | `/live-corridor`, `/work-register` | Linear Referencing |
| **Safety Prioritization** | Deterministic P1–P4 rules + ML ranking | [`backend/app/services/prioritization_service.py`](file:///d:/trainblock/backend/app/services/prioritization_service.py) | **Implemented** | `/work-register`, `/tasks/[taskId]` | Deterministic Safety Tiers |
| **XGBoost ML Ranker** | Tabular regression on 5 continuous features | [`backend/app/ml/ranker.py`](file:///d:/trainblock/backend/app/ml/ranker.py) | **Implemented** | `/work-register` | Within-Tier ML Regressor |
| **Physics-Aware Composition** | Spatial clustering, precedence (BCM→CSM), OHE sync | [`backend/app/services/composition_service.py`](file:///d:/trainblock/backend/app/services/composition_service.py) | **Implemented** | `/block-planner` | Multi-Dept Cluster |
| **Usable Minutes Calculation** | Raw Window minus 30m isolation & transit overhead | [`backend/app/services/composition_service.py`](file:///d:/trainblock/backend/app/services/composition_service.py) | **Implemented** | `/block-planner`, `/plan` | Raw vs Usable Minutes |
| **OR-Tools CP-SAT Solver** | Mathematical mixed-integer constraint optimization | [`backend/app/optimization/cp_sat_planner.py`](file:///d:/trainblock/backend/app/optimization/cp_sat_planner.py) | **Implemented** | `/block-planner`, `/control` | CP-SAT Solver Result |
| **Weekly Plan (5-min slots)** | 24-hour detailed timetable-synchronized blocks | [`backend/app/services/planning_service.py`](file:///d:/trainblock/backend/app/services/planning_service.py) | **Implemented** | `/block-planner`, `/plan` | Weekly Detailed Schedule |
| **Monthly Reservations** | Day-level corridor capacity reservation | [`backend/app/services/planning_service.py`](file:///d:/trainblock/backend/app/services/planning_service.py) | **Implemented** | `/plan` | Monthly Capacity Plan |
| **Train Protection** | Zero express collisions with $\ge 15\text{m}$ buffer | [`backend/app/optimization/constraints.py`](file:///d:/trainblock/backend/app/optimization/constraints.py) | **Implemented** | `/time-distance`, `/live-corridor` | Passenger Train Protection |
| **Independent 8-Rule Validator** | VR-01 to VR-08 post-solve certification | [`backend/app/services/validation_service.py`](file:///d:/trainblock/backend/app/services/validation_service.py) | **Implemented** | `/decision`, `/control` | Safety Validation Report |
| **Siloed vs Integrated Backtest** | 47 siloed blocks vs 8 integrated blocks | [`backend/app/services/backtest_service.py`](file:///d:/trainblock/backend/app/services/backtest_service.py) | **Implemented** | `/analysis`, `/siloed-vs-integrated` | Deterministic Backtest |
| **Human-in-the-Loop Approval** | Review, override reason capture, and sign-off | [`backend/app/services/audit_service.py`](file:///d:/trainblock/backend/app/services/audit_service.py) | **Implemented** | `/decision` | Advisory / Human Sign-off |
| **BDMS Sanction Request Export** | Official IR XML/JSON block demand format | [`backend/app/services/export_service.py`](file:///d:/trainblock/backend/app/services/export_service.py) | **Implemented** | `/decision` | BDMS-Style Prototype Export |
| **Live CRIS / IR Data Integration** | Real-time APIs to Indian Railways production systems | None (External authorization required) | **Roadmap** | None | Requires CRIS Authorization |
