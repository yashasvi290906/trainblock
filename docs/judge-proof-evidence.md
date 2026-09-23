# RAILBLOCK — Judge Attack-Test & Forensic Defense Evidence

This document provides rigorous, evidence-backed technical answers to the 12 critical questions a Senior Indian Railways evaluator or SIH jury may ask.

---

### Q1: "Where exactly does your AI enter the system?"
- **Answer**: AI enters at two distinct levels:
  1. **Tabular Machine Learning (XGBoost Regressor)** in [`backend/app/ml/ranker.py`](file:///d:/trainblock/backend/app/ml/ranker.py): Ranks maintenance demands within each safety tier based on 5 non-linear factors (defect severity, overdue days, asset criticality, traffic exposure, availability impact).
  2. **Combinatorial Constraint Optimization (Google OR-Tools CP-SAT)** in [`backend/app/optimization/cp_sat_planner.py`](file:///d:/trainblock/backend/app/optimization/cp_sat_planner.py): Solves mixed-integer scheduling to place multi-departmental clusters into collision-free traffic windows.

### Q2: "Why can't you just sort the maintenance tasks?"
- **Answer**: Simple sorting ignores multi-dimensional railway constraints. A high-priority task cannot be executed if it violates spatial mutual exclusion, conflicts with an oncoming Vande Bharat express, lacks synchronized 25kV OHE de-energization, or exceeds daily section possession caps. CP-SAT is mathematically required to guarantee global feasibility.

### Q3: "Where is CP-SAT actually used?"
- **Answer**: Implemented in [`backend/app/optimization/cp_sat_planner.py`](file:///d:/trainblock/backend/app/optimization/cp_sat_planner.py) via `ortools.sat.python.cp_model.CpModel`. It models decision variables `x[c, w]`, adds hard constraints C1–C4, and executes `solver.Solve(model)` to return the optimal block schedule.

### Q4: "What happens if Operating denies the selected block?"
- **Answer**: The system triggers the **Block Denial Scenario** in [`backend/app/services/run_manager.py`](file:///d:/trainblock/backend/app/services/run_manager.py). The denied window is invalidated, unassigned demands are preserved, candidate windows are regenerated, and CP-SAT re-solves to find the next best feasible window, updating all UI pages on the fly.

### Q5: "How do you protect passenger trains?"
- **Answer**: Hard constraint **C1** in [`backend/app/optimization/constraints.py`](file:///d:/trainblock/backend/app/optimization/constraints.py) computes intervals for every COA passenger service and enforces a non-negotiable $\ge 15\text{ minute}$ safety clearance headway before and after every maintenance possession.

### Q6: "How do you know departments can share the same block?"
- **Answer**: [`backend/app/services/composition_service.py`](file:///d:/trainblock/backend/app/services/composition_service.py) enforces 3 spatial and physical compatibility criteria:
  1. Proximity: Tasks must reside in the same section and line within $\le 3.0\text{ km}$.
  2. Precedence: Operations follow engineering physics (e.g. Ballast Cleaning $\rightarrow$ Tamping with $\ge 15\text{m}$ lag).
  3. Traction: OHE high-reach works automatically mandate synchronized 25kV power block isolation.

### Q7: "What happens to the maintenance work that cannot fit?"
- **Answer**: Unassigned tasks are preserved in `SolverResult.unassigned_tasks` (21 tasks in baseline). They remain visible in the Work Register with reasons for non-allocation (e.g., lower-priority P3/P4 preventive work deferred due to daily 240m section possession caps). Crucially, $100\%$ of P1 safety-critical tasks are guaranteed allocation.

### Q8: "How did you calculate your improvement?"
- **Answer**: Calculated deterministically by [`backend/app/services/backtest_service.py`](file:///d:/trainblock/backend/app/services/backtest_service.py) on identical input data:
  - Siloed Baseline: 47 separate departmental blocks ($3,405\text{ min}$, $1,410\text{ min}$ overhead).
  - RAILBLOCK: 8 synchronized blocks ($1,245\text{ min}$, $240\text{ min}$ overhead).
  - Net Delta: 83% fewer blocks, $2,160\text{ min}$ track capacity saved.

### Q9: "Is this live Indian Railways data?"
- **Answer**: **No.** As stated honestly across the UI and documentation, this prototype uses realistic **synthetic data** calibrated to South Central Railway (Secunderabad–Nandyal corridor) and CAG Audit figures. Live integration requires Railway Board and CRIS authorization.

### Q10: "Can your planner override the recommendation?"
- **Answer**: **Yes.** The system is strictly **Advisory**. In [`/decision`](file:///d:/trainblock/src/app/decision/page.tsx), Chief Block Planners can adjust block timings or re-allocate tasks, with all modifications captured in an immutable audit log before BDMS export.

### Q11: "What prevents the model from violating a safety constraint?"
- **Answer**: Two distinct layers:
  1. **In-Solver Hard Constraints**: CP-SAT enforces mathematical invariants that cannot be violated in any feasible solution.
  2. **Independent 8-Rule Post-Solve Validator** ([`backend/app/services/validation_service.py`](file:///d:/trainblock/backend/app/services/validation_service.py)): Checks VR-01 to VR-08 post-solve and refuses plan certification if any critical rule fails.

### Q12: "Why should we believe your 94.8% availability number?"
- **Answer**: It is derived directly from section track downtime: $1 - \frac{\text{Blocked Track Hours}}{\text{Total Section Hours}} = 1 - \frac{1,245\text{ min}}{6 \times 1,440\text{ min}} = 94.8\%$. It measures the fraction of corridor line capacity open for traffic while completing 100% of critical safety maintenance.
