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
  return fetchApi<any[]>('/inputs/tms');
}

export async function getSmmsWork() {
  return fetchApi<any[]>('/inputs/smms');
}

export async function getTdmsWork() {
  return fetchApi<any[]>('/inputs/tdms');
}

export async function getCoaTimetable() {
  return fetchApi<any[]>('/inputs/coa');
}

export async function getGoodsForecasts() {
  return fetchApi<any[]>('/inputs/goods');
}

export async function getBlockCorridors() {
  return fetchApi<any[]>('/inputs/corridors');
}
