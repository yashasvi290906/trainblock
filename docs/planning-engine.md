# RAILBLOCK — Mathematical Planning Engine Specification

This document details the exact mathematical formulations, constraints, and machine learning components implemented in the RAILBLOCK planning engine.

---

## 1. Safety Prioritization & XGBoost ML Ranking

### A. Deterministic Urgency Tiers
Tasks are first partitioned by non-negotiable safety rules:
- **P1 (Immediate / Safety-Critical)**:
  - USFD flaw severity > 70
  - Rail fracture or emergency track joint defect
  - Red signal lamp failure or point motor locking failure
  - Contact wire parted or 25kV OHE catenary drop
  - Severe speed restriction ($\le 30\text{ km/h}$)
- **P2 (Urgent Corrective)**:
  - Overdue days $> 14$
  - High asset criticality with planned maintenance overdue
  - S&T track circuit fluctuation or axle counter intermittent fault
- **P3 (Planned Preventive)**:
  - Routine machine tamping (CSM), ballast regulation (BRM), OHE annual overhaul (AOH)
- **P4 (Routine / Deferrable)**:
  - Visual patrol, cess cleaning, cosmetic mast painting

### B. Within-Tier XGBoost Ranking Model
Within each tier $T \in \{P1, P2, P3, P4\}$, tasks are ordered using a pre-trained XGBoost Regressor ($M$):

$$\text{MLScore} = M(\mathbf{x})$$

Where feature vector $\mathbf{x}$ consists of 5 normalized tabular features:
1. $x_1$: Defect Severity $[0, 100]$
2. $x_2$: Overdue Days $[0, 60]$
3. $x_3$: Asset Criticality Factor $[0, 10]$
4. $x_4$: Traffic Exposure (GMT/day) $[0, 100]$
5. $x_5$: Section Availability Impact $[0, 100]$

> **Invariant**: $\text{Tier}(A) < \text{Tier}(B) \implies \text{Priority}(A) > \text{Priority}(B)$ regardless of ML score.

---

## 2. Multi-Departmental Composition Engine

### A. Spatial Clustering
Tasks $t_i, t_j$ are clustered into a joint possession candidate $C_k$ if:
1. $\text{Section}(t_i) = \text{Section}(t_j)$ and $\text{Line}(t_i) \sim \text{Line}(t_j)$
2. $|\text{KMStart}(t_i) - \text{KMStart}(t_j)| \le 3.0\text{ km}$
3. Machine resource compatibility: $\text{Machines}(C_k) \cap \text{ConflictSet} = \emptyset$

### B. Physical Precedence Rules
For sequential operations within a cluster:
- **Ballast Cleaning (BCM) $\rightarrow$ Track Tamping (CSM)**: Enforces lag $\tau \ge 15\text{ min}$.
- **Track Renewal (PQRS) $\rightarrow$ Axle Counter Re-clamping**: Enforces lag $\tau \ge 10\text{ min}$.
- **OHE High-Reach Work $\rightarrow$ 25kV De-energization**: Synchronized isolation required.

### C. Usable Block Minutes Decomposition

$$\text{UsableMinutes}(B) = \text{RawDuration}(B) - (\Delta_\text{isolation} + \Delta_\text{earthing} + \Delta_\text{transit} + \Delta_\text{restoration})$$

- Standard Overhead Buffer: $30\text{ minutes}$ ($10\text{m}$ isolation/earthing, $10\text{m}$ machine positioning, $10\text{m}$ track clearing/restoration).

---

## 3. Google OR-Tools CP-SAT Optimization Formulation

### A. Decision Variables
- $x_{c, w} \in \{0, 1\}$: Binary variable indicating cluster $c$ is assigned to time window $w$.
- $\text{start}_b, \text{end}_b \in [0, 1440]$: Integer variables representing block boundary minutes from midnight.
- $\text{interval}_b = \text{NewIntervalVar}(\text{start}_b, \text{duration}_b, \text{end}_b)$: CP-SAT interval decision variable.

### B. Hard Constraints
1. **Zero Express Train Overlap (C1)**:
   For every scheduled passenger train $T_p$ with interval $[s_p, e_p]$ traversing section $S$ on line $L$:
   $$\text{end}_b + \delta_\text{buffer} \le s_p \quad \lor \quad \text{start}_b \ge e_p + \delta_\text{buffer} \quad (\delta_\text{buffer} = 15\text{ min})$$

2. **Spatial & Line Mutual Exclusion (C2)**:
   $$\text{NoOverlap}(\{\text{interval}_b \mid \text{Section}(b) = S, \text{Line}(b) = L\})$$

3. **Track Machine Divisional Quota (C3)**:
   $$\sum_{b \in \text{Active}(t), m \in \text{Machines}(b)} 1 \le \text{Quota}(m) \quad \forall m \in \{\text{BCM}, \text{CSM}, \text{PQRS}, \text{TOWER\_WAGON}\}$$

4. **Safety Tier P1 Invariance (C4)**:
   $$\sum_{w} x_{c, w} = 1 \quad \forall c \text{ containing } t \in P1$$

### C. Objective Function
$$\max \quad \sum_{c, w} x_{c, w} \cdot \Big( W_\text{tier}(c) \cdot 1000 + W_\text{ML}(c) \cdot 10 + W_\text{synergy}(|Dept(c)|) \cdot 50 \Big) - \sum_b \text{Overhead}(b) \cdot 2 - \sum_g \text{Delay}(g) \cdot 5$$

---

## 4. Independent 8-Rule Safety Validator

| Rule ID | Rule Name | Severity | Criterion |
|---|---|---|---|
| **VR-01** | Passenger Train Clearance | CRITICAL | Buffer $\ge 15\text{ min}$ to all passenger services |
| **VR-02** | Usable Minute Sufficiency | CRITICAL | $\text{UsableMinutes}(B) \ge \text{WorkDemand}(C)$ |
| **VR-03** | Mandatory P1 Inclusion | CRITICAL | $100\%$ P1 tasks must be scheduled |
| **VR-04** | Heavy Machine Fleet Limit | CRITICAL | Machine concurrency $\le$ divisional quota |
| **VR-05** | Track Mutual Exclusion | CRITICAL | No concurrent blocks on same track segment |
| **VR-06** | OHE Power De-energization | CRITICAL | 25kV shutdown allocated for all electrical tasks |
| **VR-07** | Daily Section Possession Cap | WARNING | Total section possession $\le 240\text{ min/day}$ |
| **VR-08** | Statutory Gang Strength | INFO | Average gang strength $\ge$ departmental requirement |
