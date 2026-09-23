import { fetchApi } from './client';

export async function getInputsSummary() {
  return fetchApi<{
    tms_defects_count: number;
    smms_work_count: number;
    tdms_work_count: number;
    coa_trains_count: number;
    goods_forecasts_count: number;
    corridors_count: number;
    total_work_orders: number;
  }>('/inputs/summary');
}

export async function getTmsDefects() {
  return fetchApi<unknown[]>('/inputs/tms');
}

export async function getSmmsWork() {
  return fetchApi<unknown[]>('/inputs/smms');
}

export async function getTdmsWork() {
  return fetchApi<unknown[]>('/inputs/tdms');
}

export async function getCoaTimetable() {
  return fetchApi<unknown[]>('/inputs/coa');
}

export async function getGoodsForecasts() {
  return fetchApi<unknown[]>('/inputs/goods');
}

export async function getBlockCorridors() {
  return fetchApi<unknown[]>('/inputs/corridors');
}
