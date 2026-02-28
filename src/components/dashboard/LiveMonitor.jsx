import React, { useState } from 'react'
import { ExitModal } from './ExitModal'
import { Car, Bike, Search, Clock, ArrowRight } from 'lucide-react'
import { cn } from '../../lib/utils'
import { gql } from '@apollo/client';
import { useQuery, useMutation } from '@apollo/client/react';

// Query to get active vehicles and pricing rules
const GET_MONITOR_DATA = gql`
  query GetMonitorData {
    activeVehicles {
      id
      session_id
      driver_phone
      vehicle_type
      vehicle_number
      entry_time
      status
      base_fee_paid
      duration_minutes
      is_overstay
      overstay_minutes
      declared_duration_hours
    }
    pricingRules {
      id
      vehicle_type
      base_fee
      base_hours
      extra_hour_rate
    }
  }
`;

const PROCESS_EXIT = gql`
  mutation ProcessExit($sessionId: String!) {
    processVehicleExit(session_id: $sessionId) {
      session_id
      total_amount
      overstay_fee
      overstay_record {
        id
        fee_amount
      }
    }
  }
`;

const COLLECT_PAYMENT = gql`
  mutation CollectPayment($chargeId: ID!) {
     collectOverstayPayment(overstay_charge_id: $chargeId) {
       id
       is_collected
     }
  }
`;

// --- COMPONENT: Mobile Card (Light Mode) ---
const VehicleCard = ({ vehicle, onExit, baseHours }) => {
    const now = new Date();
    const entry = new Date(vehicle.entry_time);
    // Use backend duration if available, else calculate
    const elapsedHrs = vehicle.duration_minutes ? vehicle.duration_minutes / 60 : (now - entry) / 3600000;

    // Use backend is_overstay flag
    const isOverstaying = vehicle.is_overstay;

    const effectiveBaseHours = vehicle.declared_duration_hours || baseHours;

    return (
        <div
            onClick={() => onExit(vehicle)}
            className={cn(
                "relative p-5 rounded-[2rem] border bg-white dark:bg-slate-900 shadow-[0_2px_4px_rgba(0,0,0,0.02)] dark:shadow-none active:scale-[0.97] active:bg-stone-50 dark:active:bg-slate-800 transition-all duration-200 ease-out",
                isOverstaying ? "border-rose-100 dark:border-rose-900/30 shadow-rose-50/50 dark:shadow-none" : "border-stone-100 dark:border-slate-800"
            )}
        >
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-4">
                    <div className={cn(
                        "h-12 w-12 rounded-2xl flex items-center justify-center border border-stone-100 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-[0_2px_8px_rgba(0,0,0,0.04)] dark:shadow-none",
                        vehicle.vehicle_type === 'car' ? "text-brand-blue" : "text-stone-500 dark:text-slate-400"
                    )}>
                        {vehicle.vehicle_type === 'car' ? <Car className="h-6 w-6" /> : <Bike className="h-6 w-6" />}
                    </div>
                    <div>
                        <div className="text-xl font-bold text-slate-900 dark:text-white tracking-tight font-mono">{vehicle.vehicle_number || 'NO PLATE'}</div>
                        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-medium">
                            <span>{vehicle.driver_phone}</span>
                            <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600"></span>
                            <span>In: {entry.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                    </div>
                </div>
                {isOverstaying && (
                    <div className="animate-pulse-slow px-2.5 py-1 rounded-full bg-rose-100 dark:bg-rose-900/30 text-[10px] font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wide">
                        Late
                    </div>
                )}
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-stone-50 dark:border-slate-800/50">
                <div className={cn(
                    "flex items-center gap-2 text-sm font-semibold",
                    isOverstaying ? "text-rose-600 dark:text-rose-400" : "text-slate-500 dark:text-slate-400"
                )}>
                    <Clock className="h-4 w-4" />
                    <span>
                        {elapsedHrs.toFixed(1)}
                        <span className="text-slate-300 dark:text-slate-600 font-normal"> / </span>
                        {effectiveBaseHours}h
                    </span>
                </div>
                <button className="h-10 w-10 flex items-center justify-center rounded-full bg-stone-50 dark:bg-slate-800 text-stone-400 dark:text-slate-500 active:bg-brand-blue active:text-white active:scale-90 transition-all duration-200 shadow-sm dark:shadow-none">
                    <ArrowRight className="h-5 w-5" />
                </button>
            </div>
        </div>
    )
}

// --- MAIN COMPONENT ---
export const LiveMonitor = () => {
    const { data, loading, error, refetch } = useQuery(GET_MONITOR_DATA, { pollInterval: 30000, fetchPolicy: 'cache-and-network' });
    const [processExit] = useMutation(PROCESS_EXIT);
    const [collectPayment] = useMutation(COLLECT_PAYMENT);

    const [searchTerm, setSearchTerm] = useState('')
    const [exitModalCtx, setExitModalCtx] = useState(null)

    // Filter active vehicles based on search
    const activeVehicles = data?.activeVehicles
        ? data.activeVehicles
            .filter(v =>
                v.driver_phone.includes(searchTerm) ||
                (v.vehicle_number && v.vehicle_number.includes(searchTerm.toUpperCase()))
            )
            .sort((a, b) => new Date(a.entry_time) - new Date(b.entry_time))
        : [];

    const getPricingRule = (type) => {
        return data?.pricingRules?.find(r => r.vehicle_type.toLowerCase() === type.toLowerCase());
    }

    const handleExitClick = (vehicle) => {
        const rule = getPricingRule(vehicle.vehicle_type);
        if (!rule) {
            console.error("No pricing rule found for", vehicle.vehicle_type);
            return;
        }

        const now = new Date();
        const entry = new Date(vehicle.entry_time);
        const durationHours = (now - entry) / (1000 * 60 * 60);
        const actualDuration = Math.ceil(durationHours);

        const baseHours = Math.max(
            rule.base_hours,
            vehicle.declared_duration_hours || 0
        );
        const overstayHours = Math.max(0, actualDuration - baseHours);

        // Calculate costs (Mock logic matching backend simply for preview)
        // Rate: Base Fee + (Overstay Hours * Extra Rate)
        const baseFee = rule.base_fee; // Already paid
        const overstayFee = overstayHours * rule.extra_hour_rate;
        const totalCost = baseFee + overstayFee;
        const balanceDue = overstayFee; // Assuming base fee is paid upfront

        const exitData = {
            actualDuration,
            overstayHours,
            totalCost,
            balanceDue,
            declaredDuration: baseHours // Using base hours as declared duration
        };

        setExitModalCtx({ vehicle, exitData, rule });
    }

    const handleConfirmExit = async () => {
        if (!exitModalCtx) return;

        try {
            const result = await processExit({ variables: { sessionId: exitModalCtx.vehicle.session_id } });
            const exitResult = result.data.processVehicleExit;

            // If there is an overstay fee and we are "Collecting & Exiting"
            if (exitResult.overstay_fee > 0 && exitResult.overstay_record) {
                await collectPayment({ variables: { chargeId: exitResult.overstay_record.id } });
            }

            // Refresh list
            refetch();
            setExitModalCtx(null);
        } catch (e) {
            console.error("Exit processing failed", e);
            alert("Failed to process exit: " + e.message);
        }
    }

    if (loading) return <div className="p-8 text-center text-slate-500">Loading active sessions...</div>;
    if (error) return <div className="p-8 text-center text-rose-500">Error loading data: {error.message}</div>;

    return (
        <div className="flex flex-col h-full">
            {/* Toolbar */}
            <div className="flex flex-col gap-4 mb-6">
                <div className="px-1">
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">Live Monitor</h2>
                    <p className="text-slate-500 dark:text-slate-400 text-xs font-medium">Manage active sessions.</p>
                </div>
                <div className="relative group">
                    <Search className="absolute left-4 top-3.5 h-5 w-5 text-slate-400 dark:text-slate-500 group-focus-within:text-brand-blue transition-colors" />
                    <input
                        placeholder="Search vehicle..."
                        className="w-full bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 rounded-[1.5rem] pl-12 pr-4 py-3 text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue transition-all shadow-sm dark:shadow-none"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Active Vehicle List (Cards Only) */}
            <div className="space-y-3 pb-24">
                {activeVehicles.length === 0 ? (
                    <div className="py-12 flex flex-col items-center justify-center text-slate-400">
                        <div className="h-16 w-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                            <Car className="h-8 w-8 text-slate-300" />
                        </div>
                        <p className="font-medium">No active vehicles</p>
                    </div>
                ) : (
                    activeVehicles.map(v => {
                        const rule = getPricingRule(v.vehicle_type);
                        return (
                            <VehicleCard
                                key={v.id}
                                vehicle={v}
                                onExit={handleExitClick}
                                baseHours={rule ? rule.base_hours : 2}
                            />
                        );
                    })
                )}
            </div>

            <ExitModal
                isOpen={!!exitModalCtx}
                onClose={() => setExitModalCtx(null)}
                vehicle={exitModalCtx?.vehicle}
                exitData={exitModalCtx?.exitData}
                onConfirm={handleConfirmExit}
            />
        </div>
    )
}
