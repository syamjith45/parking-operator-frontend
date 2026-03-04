import React from 'react'
import { ActivityGrid } from './ActivityGrid'
import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';

const GET_STATS_DATA = gql`
  query GetStatsData {
    dashboardStats {
      active_vehicles
      completed_today
      base_fees_collected
      overstay_fees_collected
      total_revenue_today
    }
    activeVehicles {
      id
      vehicle_type
      is_overstay
    }
  }
`;

export const StatsPanel = () => {
  const { data, loading, error } = useQuery(GET_STATS_DATA, { pollInterval: 30000, fetchPolicy: 'cache-and-network' });

  if (loading) return <div className="p-4 text-slate-500 text-sm">Loading stats...</div>
  if (error) return <div className="p-4 text-rose-500 text-sm">Failed to load stats</div>

  return (
    <div className="space-y-4 pb-24">
      <div className="px-1">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">Today's Overview</h2>
      </div>
      <ActivityGrid
        dashboardStats={data?.dashboardStats}
        activeVehicles={data?.activeVehicles}
      />
    </div>
  )
}
