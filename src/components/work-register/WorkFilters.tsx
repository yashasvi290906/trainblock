"use client";

import React from "react";
import { Search, X, Filter } from "lucide-react";
import { Department, CriticalityTier } from "@/types/maintenance";

interface WorkFiltersProps {
  searchQuery: string;
  onSearchChange: (val: string) => void;
  deptFilter: string;
  onDeptChange: (val: string) => void;
  criticalityFilter: string;
  onCriticalityChange: (val: string) => void;
  statusFilter: string;
  onStatusChange: (val: string) => void;
  assetTypeFilter: string;
  onAssetTypeChange: (val: string) => void;
  onResetFilters: () => void;
  hasActiveFilters: boolean;
  totalFilteredCount: number;
  totalCount: number;
}

export function WorkFilters({
  searchQuery,
  onSearchChange,
  deptFilter,
  onDeptChange,
  criticalityFilter,
  onCriticalityChange,
  statusFilter,
  onStatusChange,
  assetTypeFilter,
  onAssetTypeChange,
  onResetFilters,
  hasActiveFilters,
  totalFilteredCount,
  totalCount,
}: WorkFiltersProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-3 sm:p-4 shadow-2xs space-y-3 font-sans">
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search Field */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search task ID, title, asset ID, or KM range..."
            className="w-full pl-9 pr-8 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white font-mono transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Dropdown Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Department */}
          <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1">
            <span className="text-[10px] uppercase font-bold text-slate-500 font-mono">Dept:</span>
            <select
              value={deptFilter}
              onChange={(e) => onDeptChange(e.target.value)}
              className="bg-transparent text-xs font-semibold text-slate-800 focus:outline-none cursor-pointer"
            >
              <option value="ALL">All Departments</option>
              <option value="Engineering">Engineering</option>
              <option value="S&T">S&T</option>
              <option value="Traction">Traction</option>
            </select>
          </div>

          {/* Criticality */}
          <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1">
            <span className="text-[10px] uppercase font-bold text-slate-500 font-mono">Priority:</span>
            <select
              value={criticalityFilter}
              onChange={(e) => onCriticalityChange(e.target.value)}
              className="bg-transparent text-xs font-semibold text-slate-800 focus:outline-none cursor-pointer"
            >
              <option value="ALL">All Tiers</option>
              <option value="Critical">P1 · Critical</option>
              <option value="High">P2 · High</option>
              <option value="Medium">P3 · Medium</option>
              <option value="Low">P4 · Routine</option>
            </select>
          </div>

          {/* Status */}
          <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1">
            <span className="text-[10px] uppercase font-bold text-slate-500 font-mono">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => onStatusChange(e.target.value)}
              className="bg-transparent text-xs font-semibold text-slate-800 focus:outline-none cursor-pointer"
            >
              <option value="ALL">All Status</option>
              <option value="Unscheduled">Open / Unscheduled</option>
              <option value="Scheduled">Scheduled in Block</option>
              <option value="OVERDUE">Overdue Only</option>
              <option value="BLOCK_REQUIRED">Block Required</option>
            </select>
          </div>

          {/* Asset Type */}
          <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1">
            <span className="text-[10px] uppercase font-bold text-slate-500 font-mono">Asset:</span>
            <select
              value={assetTypeFilter}
              onChange={(e) => onAssetTypeChange(e.target.value)}
              className="bg-transparent text-xs font-semibold text-slate-800 focus:outline-none cursor-pointer"
            >
              <option value="ALL">All Asset Types</option>
              <option value="Track">Track / Alignment</option>
              <option value="Rail Joint">Rail Joint</option>
              <option value="Signal">Signal</option>
              <option value="Track Circuit">Track Circuit</option>
              <option value="Axle Counter">Axle Counter</option>
              <option value="Points">Points & Crossing</option>
              <option value="OHE">OHE Catenary</option>
              <option value="Isolator">Isolator Switch</option>
              <option value="Sectioning">Sectioning / FP</option>
              <option value="Sleeper">PSC Sleeper</option>
              <option value="Ballast">Ballast</option>
            </select>
          </div>

          {/* Reset Filters */}
          {hasActiveFilters && (
            <button
              onClick={onResetFilters}
              className="px-2.5 py-1 text-xs font-semibold text-blue-700 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors flex items-center gap-1"
            >
              <X className="w-3.5 h-3.5" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>
      </div>

      {/* Corridor Scope & Filter Result Count */}
      <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono pt-1 border-t border-slate-100">
        <div>
          Corridor: <span className="font-bold text-slate-700">SEC – NDL (South Central Railway)</span>
        </div>
        <div>
          Showing <span className="font-bold text-slate-900">{totalFilteredCount}</span> of{" "}
          <span className="font-bold text-slate-900">{totalCount}</span> work demands
        </div>
      </div>
    </div>
  );
}
