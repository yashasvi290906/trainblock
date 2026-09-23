import { fetchApi } from './client';

export interface BacktestResult {
  dataset_name: string;
  total_input_work_orders: number;
  corridor_length_km: number;
  siloed_baseline: {
    total_blocks: number;
    total_blocked_minutes: number;
    total_usable_work_minutes: number;
    work_minutes_per_blocked_minute: number;
    passenger_train_delays_min: number;
    unresolved_passenger_conflicts: number;
    critical_backlog_cleared_percent: number;
    asset_availability_score: number;
    repeated_track_possessions: number;
  };
  integrated_railblock: {
    total_blocks: number;
    total_blocked_minutes: number;
    total_usable_work_minutes: number;
    work_minutes_per_blocked_minute: number;
    passenger_train_delays_min: number;
    unresolved_passenger_conflicts: number;
    critical_backlog_cleared_percent: number;
    asset_availability_score: number;
    repeated_track_possessions: number;
  };
  delta: Record<string, any>;
}

export async function getComparativeBacktest() {
  return fetchApi<BacktestResult>('/analysis/backtest');
}
