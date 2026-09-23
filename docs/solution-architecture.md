# RAILBLOCK — Solution Architecture Specification
**Problem Statement 26027**: AI-Powered Automatic Block Planning to Maximize Asset Availability for Train Operations on Indian Railways

---

## 1. Executive Overview

RAILBLOCK is an AI-assisted mathematical block planning engine that unifies maintenance demand across multiple Indian Railways engineering departments (Civil Engineering, Signalling & Telecom, Traction/Electrical), resolves spatio-temporal dependencies, and generates conflict-free, timetable-synchronized maintenance blocks using Constraint Programming (Google OR-Tools CP-SAT).

The system operates in an **Advisory Capacity** to Senior Divisional Operations Managers (DOM) and Chief Block Planners, supporting human decision-making with explainable constraint satisfaction, deterministic safety verification, and official BDMS-compatible block demand generation.

---

## 2. End-to-End Solution Pipeline

```
  ┌────────────────────────────────────────────────────────────────────────┐
  │                      1. SIX INPUT SOURCES (SYNTHETIC)                  │
  │  TMS (18)  │  SMMS (14)  │  TDMS (15)  │  COA (8)  │  FOIS (3) │ BDMS (6) │
  └───────────────────────────────────┬────────────────────────────────────┘
                                      │
                                      ▼
  ┌────────────────────────────────────────────────────────────────────────┐
  │                     2. UNIFIED LINEAR LOCATION MODEL                   │
  │     1D Spatial Linear Topology along Corridor (SEC KM 40 → NDL KM 120)  │
  └───────────────────────────────────┬────────────────────────────────────┘
                                      │
                                      ▼
  ┌────────────────────────────────────────────────────────────────────────┐
  │                 3. SAFETY PRIORITIZATION & ML RANKING                  │
  │      Deterministic Rules (P1/P2/P3/P4) + Within-Tier XGBoost Ranker    │
  └───────────────────────────────────┬────────────────────────────────────┘
                                      │
                                      ▼
  ┌────────────────────────────────────────────────────────────────────────┐
  │              4. PHYSICS-AWARE MULTI-DEPARTMENT COMPOSITION             │
  │      Spatial Clustering (≤3km) + Precedence (BCM→Tamping) + OHE Sync   │
  └───────────────────────────────────┬────────────────────────────────────┘
                                      │
                                      ▼
  ┌────────────────────────────────────────────────────────────────────────┐
  │                   5. USABLE BLOCK TIME DECOMPOSITION                   │
  │   Usable = Raw Window - (Isolation + Earthing + Transit + Restoration)  │
  └───────────────────────────────────┬────────────────────────────────────┘
                                      │
                                      ▼
  ┌────────────────────────────────────────────────────────────────────────┐
  │                 6. FEASIBLE CANDIDATE WINDOW GENERATION                │
  │      Traffic Shadow Extraction filtered by Section Possession Caps     │
  └───────────────────────────────────┬────────────────────────────────────┘
                                      │
                                      ▼
  ┌────────────────────────────────────────────────────────────────────────┐
  │              7. GOOGLE OR-TOOLS CP-SAT OPTIMIZATION ENGINE             │
  │    Hard Invariants: Zero Express Overlap, Track Mutual Exclusion, Quota│
  │    Objective: Maximize Safety + ML Score + Synergy, Minimize Delay/Churn│
  └───────────────────────────────────┬────────────────────────────────────┘
                                      │
                                      ▼
  ┌────────────────────────────────────────────────────────────────────────┐
  │             8. INDEPENDENT 8-RULE SAFETY VALIDATOR (VR-01 to 08)       │
  │     Strict Verification of Clearances, Usable Work Time, P1 Coverage   │
  └───────────────────────────────────┬────────────────────────────────────┘
                                      │
                                      ▼
  ┌────────────────────────────────────────────────────────────────────────┐
  │              9. HUMAN PLANNER WORKSTATION (REVIEW & OVERRIDE)          │
  │     Interactive Review of Candidate Windows, Time-Distance, Scenarios  │
  └───────────────────────────────────┬────────────────────────────────────┘
                                      │
                                      ▼
  ┌────────────────────────────────────────────────────────────────────────┐
  │         10. SANCTION APPROVAL, IMMUTABLE AUDIT & BDMS EXPORT           │
  │      Official IR JSON/XML Schema + Complete Siloed vs Integrated Test   │
  └────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Technology Stack & Design Principles

1. **Optimization Core**: Google OR-Tools CP-SAT (Mixed-Integer Constraint Satisfaction).
2. **Machine Learning Layer**: Pre-trained XGBoost Regressor for multi-factor priority sorting within safety tiers.
3. **Backend Service**: Python 3.13 + FastAPI with Pydantic v2 validation.
4. **Data Store & State Management**: Deterministic in-memory run state with snapshot cloning for What-If scenario mutations.
5. **Frontend Workstation**: Next.js 16 (App Router), React 19, Tailwind CSS / Vanilla CSS, HTML5 Canvas for interactive time-distance string charts.
