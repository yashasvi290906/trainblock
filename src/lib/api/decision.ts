import { fetchApi } from './client';

export interface AuditLogEntry {
  log_id: string;
  timestamp: string;
  event_type: string;
  actor: string;
  details: string;
}

export interface PlannerOverrideRequest {
  planner_name: string;
  planner_role: string;
  reason: string;
  new_start_time: string;
  new_duration_min: number;
}

export async function getAuditLog() {
  return fetchApi<AuditLogEntry[]>('/decision/audit-log');
}

export async function submitPlannerOverride(request: PlannerOverrideRequest) {
  return fetchApi<{ status: string; audit_entry: AuditLogEntry }>('/decision/override', {
    method: 'POST',
    body: JSON.stringify(request),
  });
}
