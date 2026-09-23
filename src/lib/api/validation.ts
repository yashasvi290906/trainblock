import { fetchApi } from './client';

export interface ValidationReport {
  overall_status: 'VALIDATED' | 'FAILED' | 'WARNING';
  passed_checks_count: number;
  total_checks_count: number;
  checks: Array<{
    rule_id: string;
    name: string;
    category: string;
    passed: boolean;
    severity: 'CRITICAL' | 'WARNING' | 'INFO';
    details: string;
  }>;
  validated_at: string;
}

export async function getValidationReport() {
  return fetchApi<ValidationReport>('/validation/report');
}
