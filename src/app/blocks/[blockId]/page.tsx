import React from "react";
import { ModulePlaceholder } from "@/components/shell/ModulePlaceholder";

interface BlockDetailPageProps {
  params: Promise<{
    blockId: string;
  }>;
}

export default async function BlockDetailPage({ params }: BlockDetailPageProps) {
  const { blockId } = await params;

  return (
    <ModulePlaceholder
      title={`Block Dossier — ${blockId}`}
      moduleName={`Integrated Possession Dossier (${blockId})`}
      description={`Detailed multi-departmental breakdown, timetable conflict verification, fallback windows, and BDMS export for Block ${blockId}.`}
      workflowStep="DECIDE"
      plannedCapabilities={[
        `Comprehensive parameters for Block ${blockId} (Corridor, Section, KM range, Timing)`,
        "Departmental task breakdown (Engineering, S&T, Traction work orders)",
        "Train conflict verification (0 conflicts across 4 passenger & freight movements)",
        "BDMS-style possession demand generation and approval export",
      ]}
    />
  );
}
