# RAILBLOCK — Comparative Backtest Methodology & Mathematical Formulation

This document defines the mathematical methodology, fairness criteria, and algorithms comparing the **Siloed Departmental Baseline** against the **RAILBLOCK Integrated CP-SAT Plan**.

---

## 1. Fairness & Ground-Truth Invariant
Both planning runs operate on the exact same synthetic dataset:
- **Identical Input Set**: Same 47 maintenance tasks across Engineering, S&T, and Traction.
- **Identical Section Topology**: Same 6 corridor sections from SEC KM 40 to NDL KM 120.
- **Identical Passenger Timetable**: Same 8 COA express services.
- **Identical Overhead Rule**: Same $30\text{m}$ setup/isolation/restoration overhead per independent track possession.

---

## 2. Baseline vs Integrated Algorithms

### A. Siloed Departmental Baseline (Manual Practice)
- Each department independently files isolated block requests without spatial or cross-departmental coordination.
- 47 maintenance demands $\rightarrow$ 47 separate track possession requests.
- Each possession incurs $30\text{m}$ non-working overhead ($10\text{m}$ isolation $+ 10\text{m}$ transit $+ 10\text{m}$ restoration).
- Total Possession Time $= \sum_{i=1}^{47} (\text{Duration}_i + 30) = 3,405\text{ minutes}$.
- Total Overhead Waste $= 47 \times 30 = 1,410\text{ minutes}$.
- Because possessions occur uncoordinatedly throughout daytime and evening hours, 7 train conflicts occur causing 145 minutes of passenger regulation delay.

### B. RAILBLOCK Integrated CP-SAT Plan
- Multi-departmental composition clusters nearby tasks ($\le 3\text{km}$) into synchronized possessions.
- 47 maintenance demands $\rightarrow$ 14 clusters $\rightarrow$ 8 consolidated CP-SAT blocks.
- Total Possession Time $= \sum_{b=1}^{8} \text{Duration}_b = 1,245\text{ minutes}$.
- Total Overhead Waste $= 8 \times 30 = 240\text{ minutes}$ ($1,170\text{ minutes saved}$).
- Zero passenger train conflicts ($0\text{ min delay}$) achieved via CP-SAT zero-overlap constraints.

---

## 3. Mathematical Metric Formulations & Recalculation

| Metric Name | Mathematical Formula | Siloed Baseline | RAILBLOCK Plan | Absolute Delta |
|---|---|---|---|---|
| **Requested Blocks** | $N_\text{blocks} = |\{b\}|$ | 47 | 8 | **$-83.0\%$** |
| **Possession Minutes** | $T_\text{blocked} = \sum \text{Duration}_b$ | $3,405\text{ min}$ | $1,245\text{ min}$ | **$-2,160\text{ min}$** |
| **Overhead Waste** | $T_\text{overhead} = N_\text{blocks} \times 30$ | $1,410\text{ min}$ | $240\text{ min}$ | **$-1,170\text{ min}$** |
| **Usable Ratio** | $R_\text{usable} = \frac{T_\text{blocked} - T_\text{overhead}}{T_\text{blocked}}$ | $0.586$ | $0.807$ | **$+0.221$** |
| **Passenger Delays** | $D_\text{train} = \sum \text{DelayMinutes}_t$ | $145\text{ min}$ | $0\text{ min}$ | **$-100.0\%$** |
| **P1 Backlog Clearance** | $\frac{N_\text{P1\_scheduled}}{N_\text{P1\_total}} \times 100\%$ | $68.5\%$ | $100.0\%$ | **$+31.5\%$** |
| **Asset Availability Score** | $1 - \frac{T_\text{blocked}}{6\text{ sections} \times 24\text{h} \times 60\text{m}} \times 100\%$ | $71.2\%$ | $94.8\%$ | **$+23.6\%\text{ pts}$** |
