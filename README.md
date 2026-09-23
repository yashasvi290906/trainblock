# RAILBLOCK (रैलब्लॉक)
### AI-Powered Automatic Block Planning for Indian Railways
**Smart India Hackathon (SIH) 2026 — Problem Statement 26027**  
*"AI-Powered Automatic Block Planning to Maximize Asset Availability for Train Operations on Indian Railways."*

---

## 1. Executive Summary

RAILBLOCK is an AI-assisted railway maintenance block planning control desk engineered specifically for Indian Railways (IR) zonal and divisional operations. It balances the conflicting mandates of high-density train operations and critical asset maintenance by deterministically solving multi-department corridor possession windows.

### Core Capabilities
- **Multi-Department Window Shadowing & Co-location**: Integrates Engineering (Civil/Permanent Way), Signal & Telecommunications (S&T), and Traction Distribution (TRD/OHE) maintenance tasks into unified possessions, reducing corridor downtime.
- **Deterministic Conflict Detection**: Pure spatial-temporal trajectory collision analysis (time-distance calculation) against live and timetable movements, protecting premier passenger services (Vande Bharat, Rajdhani, Shatabdi) while isolating freight regulation buffers.
- **Dynamic What-If Disruptions & Re-planning**: Instantaneous re-computation of fallback maintenance slots (`FW-01`, `FW-02`, `FW-03`) when Operating Control denies requested blocks or injects emergency rail fracture work orders.
- **Rolling Horizon Reservation Matrix**: Forward-looking 7-day, 1-month, and 26-week rolling possession commitments aligned with Indian Railways maintenance quotas.
- **Explainable Solver Evidence & Audit Trails**: Complete transparency into constraint satisfaction, penalty objective functions, and safety sign-offs for Chief Controllers (DOM / Sr. DOM / CPTM).

---

## 2. Architecture & Technology Stack

```
                  ┌───────────────────────────────────────────────┐
                  │          Next.js App Router (Frontend)        │
                  │   AppShell · Canvas Sim · Gantt · Tailwind    │
                  └───────────────────────┬───────────────────────┘
                                          │ HTTP / REST
                                          ▼
                  ┌───────────────────────────────────────────────┐
                  │             FastAPI Solver Backend            │
                  │     OR-Tools Constraint Engine / Fallback     │
                  │   Section Corridors · Timetables · Work Orders│
                  └───────────────────────────────────────────────┘
```

- **Frontend**: Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS, Lucide Icons.
- **State Management & Offline Resiliency**: React Context (`PlanningRunContext`) with live engine polling, graceful fallback modes, and transparent offline diagnostic states (`PlanningEngineOffline`).
- **Backend & Solver Engine**: Python 3.11+, FastAPI, Google OR-Tools CP-SAT solver, deterministic timetable intersection math.
- **Railway Visualizations**: HTML5 Canvas physical corridor simulator, interactive time-distance string charts, and interactive Gantt schedulers.

---

## 3. Key Routes & Navigation

| Route | Canonical Purpose | Key Features |
|---|---|---|
| `/` | **Executive Control Desk** | Active run KPIs, critical defect count, P1 coverage, one-click replanning. |
| `/plan` | **Plan Review & Approval** | Multi-department Gantt, safety validation, planner override, digital sign-off. |
| `/live-corridor` | **Live Physical Corridor** | 2D/2.5D simulation of Secunderabad–Nandyal corridor, signal aspects, live train movement. |
| `/rolling` | **Rolling Horizon Matrix** | 7-day, 1-month, and 26-week possession quotas and maintenance forecasts. |
| `/scenarios` | **Scenario Lab (What-If)** | Simulates Operating block denial, emergency rail defects, and timetable shifts. |
| `/reports` | **Evidence & Safety Audit** | Objective score breakdown, constraint checklist, CSV/PDF export. |
| `/demo` | **Scripted Walkthrough** | 7-stage evaluation pipeline demonstrating autonomous conflict resolution. |
| `/corridor`, `/what-if`, `/evidence` | **Canonical Redirects** | Route aliasing to ensure backward compatibility with all documentation. |

---

## 4. Getting Started

### Prerequisites
- **Node.js**: `v18.17+` or `v20+`
- **Python**: `3.10+` (optional for local solver backend, frontend includes built-in fallback engine)

### 1. Frontend Setup
```bash
# Clone the repository
git clone https://github.com/yashasvi290906/trainblock.git
cd trainblock

# Install dependencies
npm install

# Start development server
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 2. Backend Solver Engine (Optional / Production)
```bash
# In a separate terminal
cd backend

# Create virtual environment
python -m venv venv
# Windows:
.\venv\Scripts\activate
# Linux/macOS:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start FastAPI server
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```
The frontend automatically detects the live engine at `http://localhost:8000` via `/api/health`. If the backend is stopped, RAILBLOCK cleanly switches to cached/deterministic local evaluation without crashing.

---

## 5. Verification & Code Quality

Run linting and production build checks:
```bash
# Run lint check
npm run lint

# Build production bundle
npm run build
```

---

## 6. SIH 2026 Submission Details
- **Problem Statement ID**: 26027
- **Domain**: Railway Operations & Infrastructure Management
- **Target Organization**: Ministry of Railways / Indian Railways (CRIS / COA / FOIS)
