import {
  TmsDefectInput,
  SmmsWorkInput,
  TdmsWorkInput,
  UnifiedMaintenanceTask,
} from "./types";
import { CANONICAL_TMS_DEFECTS, CANONICAL_SMMS_WORK, CANONICAL_TDMS_WORK } from "./sources";
import { MachineRequirement, ProtectionType } from "@/types/maintenance";

/**
 * Normalizes disparate records from TMS, SMMS, and TDMS into one unified location and task model.
 */
export function normalizeInputSourcesToUnifiedTasks(): UnifiedMaintenanceTask[] {
  const unifiedTasks: UnifiedMaintenanceTask[] = [];

  // 1. Ingest & Normalize TMS Track Defects (18 items)
  CANONICAL_TMS_DEFECTS.forEach((tms, idx) => {
    const isSafetyCritical = tms.severity >= 5 || tms.overdueDays >= 10 || (tms.speedRestrictionKmph && tms.speedRestrictionKmph <= 30);
    const isHighUrgency = tms.severity === 4 || tms.overdueDays >= 5;

    let safetyTier: "P1" | "P2" | "P3" | "P4" = "P3";
    let safetyTierReason = "Routine track maintenance cycle";

    if (isSafetyCritical) {
      safetyTier = "P1";
      safetyTierReason = `Safety Critical: ${tms.defectType} with depth ${tms.depthMm || "N/A"}mm, ${tms.overdueDays} days overdue, Speed Restriction ${tms.speedRestrictionKmph || 30} km/h`;
    } else if (isHighUrgency) {
      safetyTier = "P2";
      safetyTierReason = `High Urgency: Severity ${tms.severity}/5, ${tms.overdueDays} days overdue`;
    }

    const machine: MachineRequirement =
      tms.defectType === "Gauge Spread" || tms.defectType === "Sleeper Spalling"
        ? "CSM (Continuous Tamping Machine)"
        : tms.defectType === "Switch Blade Wear"
        ? "UNIMAT (Points & Crossing Tamping)"
        : "None";

    const protection: ProtectionType = machine !== "None" ? "Full Block" : "Traffic Block";

    // Feature score (1-10 scale)
    const defectSeverity = tms.severity * 2;
    const overdueDays = tms.overdueDays;
    const assetCriticality = tms.line === "DOWN" ? 9 : 8;
    const trafficExposure = 42; // trains per day
    const availabilityImpact = isSafetyCritical ? 10 : isHighUrgency ? 7 : 4;

    // Feature-weighted ranking score (XGBoost / Rule equivalent)
    const rankingScore = Math.min(
      100,
      Math.round(
        defectSeverity * 3.5 +
        Math.min(overdueDays, 15) * 2.5 +
        assetCriticality * 2.0 +
        (trafficExposure / 50) * 10 +
        availabilityImpact * 2.0
      )
    );

    unifiedTasks.push({
      taskId: `ENG-${240 + idx}`,
      sourceSystem: "TMS",
      sourceRecordId: tms.id,
      department: "Engineering",
      title: `${tms.defectType} Renewal & Ultrasonic Verification`,
      assetType: tms.defectType.includes("Weld") || tms.defectType.includes("Joint") ? "Rail Joint" : "Track Segment",
      assetId: `TRK-${tms.kmStart.toFixed(1)}-${tms.line}`,
      line: tms.line,
      kmStart: tms.kmStart,
      kmEnd: tms.kmEnd,
      corridorSectionId: tms.kmStart >= 68 && tms.kmEnd <= 94 ? "SEC-NDL-BLK-03" : tms.kmStart < 32 ? "SEC-NDL-BLK-01" : "SEC-NDL-BLK-02",
      durationMin: machine !== "None" ? 50 : 35,
      requiredProtection: protection,
      oheRequired: false,
      machineRequired: machine,
      crewRequired: machine !== "None" ? 18 : 8,
      overdueDays: tms.overdueDays,
      safetyTier,
      safetyTierReason,
      mlRankingScore: rankingScore,
      withinTierRank: 1, // dynamically computed later
      rankingFeatures: {
        defectSeverity,
        overdueDays,
        assetCriticality,
        trafficExposure,
        availabilityImpact,
      },
    });
  });

  // 2. Ingest & Normalize SMMS Signal Records (14 items)
  CANONICAL_SMMS_WORK.forEach((smms, idx) => {
    const isSafetyCritical = smms.criticality === "Critical" || smms.overdueDays >= 8;
    const isHighUrgency = smms.criticality === "High" || smms.overdueDays >= 4;

    let safetyTier: "P1" | "P2" | "P3" | "P4" = "P3";
    let safetyTierReason = "Routine signal interlocking cycle";

    if (isSafetyCritical) {
      safetyTier = "P1";
      safetyTierReason = `Safety Critical: Interlocking / Point Machine failure risk at ${smms.stationCode}, ${smms.overdueDays} days overdue`;
    } else if (isHighUrgency) {
      safetyTier = "P2";
      safetyTierReason = `High Urgency: ${smms.assetType} ${smms.maintenanceType}, ${smms.overdueDays} days overdue`;
    }

    const defectSeverity = isSafetyCritical ? 9 : isHighUrgency ? 7 : 4;
    const overdueDays = smms.overdueDays;
    const assetCriticality = smms.assetType === "Point Machine" ? 10 : 8;
    const trafficExposure = 40;
    const availabilityImpact = isSafetyCritical ? 9 : isHighUrgency ? 6 : 3;

    const rankingScore = Math.min(
      100,
      Math.round(
        defectSeverity * 3.5 +
        Math.min(overdueDays, 15) * 2.5 +
        assetCriticality * 2.0 +
        (trafficExposure / 50) * 10 +
        availabilityImpact * 2.0
      )
    );

    unifiedTasks.push({
      taskId: `ST-${120 + idx}`,
      sourceSystem: "SMMS",
      sourceRecordId: smms.id,
      department: "S&T",
      title: `${smms.assetType} — ${smms.maintenanceType}`,
      assetType: smms.assetType,
      assetId: smms.assetId,
      line: smms.line,
      kmStart: smms.kmLocation - 0.2,
      kmEnd: smms.kmLocation + 0.2,
      corridorSectionId: smms.kmLocation >= 68 && smms.kmLocation <= 94 ? "SEC-NDL-BLK-03" : smms.kmLocation < 32 ? "SEC-NDL-BLK-01" : "SEC-NDL-BLK-02",
      durationMin: smms.durationMin,
      requiredProtection: "Traffic Block",
      oheRequired: smms.requiresPowerIsolation,
      machineRequired: "None",
      crewRequired: 6,
      overdueDays: smms.overdueDays,
      safetyTier,
      safetyTierReason,
      mlRankingScore: rankingScore,
      withinTierRank: 1,
      rankingFeatures: {
        defectSeverity,
        overdueDays,
        assetCriticality,
        trafficExposure,
        availabilityImpact,
      },
    });
  });

  // 3. Ingest & Normalize TDMS Traction Records (15 items)
  CANONICAL_TDMS_WORK.forEach((tdms, idx) => {
    const isSafetyCritical = tdms.criticality === "Critical" || tdms.overdueDays >= 9;
    const isHighUrgency = tdms.criticality === "High" || tdms.overdueDays >= 5;

    let safetyTier: "P1" | "P2" | "P3" | "P4" = "P3";
    let safetyTierReason = "Routine OHE maintenance & thermography";

    if (isSafetyCritical) {
      safetyTier = "P1";
      safetyTierReason = `Safety Critical: Catenary/Contact wire de-tensioning hazard in section ${tdms.oheSectionId}, ${tdms.overdueDays} days overdue`;
    } else if (isHighUrgency) {
      safetyTier = "P2";
      safetyTierReason = `High Urgency: OHE ${tdms.workType}, ${tdms.overdueDays} days overdue`;
    }

    const defectSeverity = isSafetyCritical ? 9 : isHighUrgency ? 7 : 4;
    const overdueDays = tdms.overdueDays;
    const assetCriticality = 9;
    const trafficExposure = 45;
    const availabilityImpact = isSafetyCritical ? 9 : isHighUrgency ? 7 : 4;

    const rankingScore = Math.min(
      100,
      Math.round(
        defectSeverity * 3.5 +
        Math.min(overdueDays, 15) * 2.5 +
        assetCriticality * 2.0 +
        (trafficExposure / 50) * 10 +
        availabilityImpact * 2.0
      )
    );

    unifiedTasks.push({
      taskId: `TR-${80 + idx}`,
      sourceSystem: "TDMS",
      sourceRecordId: tdms.id,
      department: "Traction",
      title: `${tdms.assetType} ${tdms.workType}`,
      assetType: "OHE Catenary",
      assetId: `OHE-${tdms.kmStart.toFixed(1)}-${tdms.line}`,
      line: tdms.line,
      kmStart: tdms.kmStart,
      kmEnd: tdms.kmEnd,
      corridorSectionId: tdms.kmStart >= 68 && tdms.kmEnd <= 94 ? "SEC-NDL-BLK-03" : tdms.kmStart < 32 ? "SEC-NDL-BLK-01" : "SEC-NDL-BLK-02",
      oheSectionId: tdms.oheSectionId,
      durationMin: tdms.durationMin,
      requiredProtection: "Power Block",
      oheRequired: tdms.powerBlockRequired,
      machineRequired: "Tower Wagon (OHE)",
      crewRequired: 12,
      overdueDays: tdms.overdueDays,
      safetyTier,
      safetyTierReason,
      mlRankingScore: rankingScore,
      withinTierRank: 1,
      rankingFeatures: {
        defectSeverity,
        overdueDays,
        assetCriticality,
        trafficExposure,
        availabilityImpact,
      },
    });
  });

  // 4. Compute within-tier ranks (P1 tasks ranked by mlRankingScore descending, then P2, etc.)
  ["P1", "P2", "P3", "P4"].forEach((tier) => {
    const tierTasks = unifiedTasks.filter((t) => t.safetyTier === tier);
    tierTasks.sort((a, b) => b.mlRankingScore - a.mlRankingScore);
    tierTasks.forEach((t, rankIdx) => {
      t.withinTierRank = rankIdx + 1;
    });
  });

  return unifiedTasks;
}
