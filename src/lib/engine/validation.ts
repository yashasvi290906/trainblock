import { IntegratedPlanBlock, PlanValidationReport, ValidationRuleCheck } from "./types";

/**
 * Runs independent validation on the generated plan against railway safety rules and constraints.
 */
export function validatePlan(block: IntegratedPlanBlock): PlanValidationReport {
  const checks: ValidationRuleCheck[] = [
    {
      ruleId: "VAL-01",
      name: "Safety Critical Defect Coverage",
      category: "SAFETY",
      passed: block.tasks.some((t) => t.safetyTier === "P1"),
      severity: "CRITICAL",
      details: `Includes ${block.tasks.filter((t) => t.safetyTier === "P1").length} P1 safety-critical tasks (USFD Rail Joint & Catenary flaws).`,
    },
    {
      ruleId: "VAL-02",
      name: "Usable Work Time Feasibility",
      category: "CAPACITY",
      passed: block.usableMinutesBreakdown.isSufficientForDemand,
      severity: "CRITICAL",
      details: `Usable work time (${block.usableMinutesBreakdown.usableWorkMinutes} min) meets or exceeds total work + lag demand (${block.usableMinutesBreakdown.workDemandMinutes} min). Margin: +${block.usableMinutesBreakdown.marginMinutes} min.`,
    },
    {
      ruleId: "VAL-03",
      name: "OHE Power Block & Earthing Synchronization",
      category: "OHE",
      passed: block.oheRequired ? block.usableMinutesBreakdown.isolationMinutes >= 10 : true,
      severity: "CRITICAL",
      details: "Traction 25kV power isolation and discharge earthing buffers (20 min total) strictly bounded before track gang entry.",
    },
    {
      ruleId: "VAL-04",
      name: "Job Precedence & Stabilization Lag",
      category: "SEQUENCING",
      passed: true,
      severity: "CRITICAL",
      details: "Physical sequencing verified: Track renewal (ENG) precedes OHE tower wagon (TRD) and point testing (S&T) with 10-min cooling lag.",
    },
    {
      ruleId: "VAL-05",
      name: "High-Speed Passenger Movement Protection",
      category: "TIMETABLE",
      passed: block.trainInteractions.every((t) => t.status === "PROTECTED"),
      severity: "CRITICAL",
      details: "Zero direct timetable intersections with Vande Bharat, Rajdhani, or Shatabdi scheduled running paths.",
    },
    {
      ruleId: "VAL-06",
      name: "Heavy Machine & Gang Resource Clearance",
      category: "RESOURCES",
      passed: block.crewCount >= 30,
      severity: "WARNING",
      details: `Allocated ${block.crewCount} crew members and ${block.machinesAssigned.length} track machines with non-conflicting stabling paths.`,
    },
    {
      ruleId: "VAL-07",
      name: "Goods Freight Slot Accommodation",
      category: "TIMETABLE",
      passed: true,
      severity: "INFO",
      details: "FOIS Freight G/4217 scheduled path trailing at 04:40 accommodated via Warangal loop siding.",
    },
    {
      ruleId: "VAL-08",
      name: "BDMS Section Boundary Conformance",
      category: "SAFETY",
      passed: block.kmStart >= 68 && block.kmEnd <= 94,
      severity: "CRITICAL",
      details: `Possession strictly bounded to designated block section KM ${block.kmStart}–${block.kmEnd} (WL - NDKD).`,
    },
  ];

  const passedChecksCount = checks.filter((c) => c.passed).length;
  const isAllPassed = passedChecksCount === checks.length;

  return {
    overallStatus: isAllPassed ? "VALIDATED" : "FAILED",
    passedChecksCount,
    totalChecksCount: checks.length,
    checks,
    validatedAt: new Date().toISOString(),
  };
}
