# RAILBLOCK — Judge Demonstration Trace Script

This document provides the step-by-step evaluator walkthrough trace on a single `planningRunId`.

---

## 1. Step-by-Step Flow

```
[1. HOMEPAGE] 
   ↳ Review corridor diagram, 6 synthetic feeds, and baseline problem statement.
   ↳ Action: Click "Launch Workstation" or navigate to /work-register.

[2. WORK REGISTER] (/work-register)
   ↳ Inspect 47 unified demands from TMS, SMMS, and TDMS.
   ↳ Trace deterministic safety tiers (P1 to P4) and within-tier XGBoost scores.

[3. BLOCK PLANNER] (/block-planner)
   ↳ Inspect 14 composed clusters and physical precedence rules (BCM → CSM).
   ↳ View Usable Minutes breakdown (Raw Possession - 30m Overhead).
   ↳ Action: Click "Generate Integrated Plan" to run Google OR-Tools CP-SAT.

[4. TIME-DISTANCE STRING CHART] (/time-distance)
   ↳ Verify 8 scheduled blocks placed in traffic shadows.
   ↳ Inspect zero express collisions with 15m safety clearance buffers.

[5. LIVE CORRIDOR VIEW] (/live-corridor)
   ↳ View spatial possession blocks across Secunderabad–Nandyal (KM 40 to 120).
   ↳ Observe active maintenance gangs and synchronized OHE power isolations.

[6. WHAT-IF SCENARIO LAB] (/scenarios)
   ↳ Scenario 1: Block Denial — Invalidate prime window; observe CP-SAT automatic re-optimization.
   ↳ Scenario 2: Emergency Defect Insertion — Inject rail fracture; verify P1 invariant scheduling.

[7. COMPARATIVE BACKTEST & ANALYSIS] (/analysis)
   ↳ Compare 47 Siloed possessions (3,405 min) vs 8 Integrated blocks (1,245 min).
   ↳ Review 2,160 minutes saved and Asset Availability score improvement (+23.6%).

[8. DECISION & BDMS EXPORT] (/decision)
   ↳ Independent 8-Rule Safety Validator certification (8/8 PASS).
   ↳ Human Planner formal approval or manual override with audit logging.
   ↳ Download standardized BDMS XML/JSON sanction requests.
```
