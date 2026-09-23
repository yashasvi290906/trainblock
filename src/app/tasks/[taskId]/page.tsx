import React from "react";
import { ModulePlaceholder } from "@/components/shell/ModulePlaceholder";

interface TaskDetailPageProps {
  params: Promise<{
    taskId: string;
  }>;
}

export default async function TaskDetailPage({ params }: TaskDetailPageProps) {
  const { taskId } = await params;

  return (
    <ModulePlaceholder
      title={`Maintenance Task — ${taskId}`}
      moduleName={`Asset Work Order Dossier (${taskId})`}
      description={`Asset parameters, ultrasonic / sensor inspection records, overdue tracking, and explainability metrics for Task ${taskId}.`}
      workflowStep="PRIORITISE"
      plannedCapabilities={[
        `Asset telemetry and location verification for ${taskId}`,
        "Priority explainability score (asset criticality, overdue days, delay risk)",
        "Recommended corridor slot and cluster compatibility with Block B-014",
        "Resource requirements (Crew count, heavy machinery, power block)",
      ]}
    />
  );
}
