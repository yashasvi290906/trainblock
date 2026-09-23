import { fetchApi } from './client';

export interface BackendSolverResult {
  solver_status: 'OPTIMAL' | 'FEASIBLE' | 'TIME_LIMIT' | 'INFEASIBLE';
  solve_time_ms: number;
  iterations: number;
  objective_score: number;
  hard_constraints_satisfied: number;
  total_hard_constraints: number;
  selected_blocks: unknown[];
  unassigned_tasks: unknown[];
}

export async function runPlanningPipeline(timeLimitSec = 10.0) {
  return fetchApi<BackendSolverResult>(`/planning/run?time_limit=${timeLimitSec}`, {
    method: 'POST'
  });
}

export async function getLatestPlan() {
  return fetchApi<BackendSolverResult>('/planning/latest');
}
