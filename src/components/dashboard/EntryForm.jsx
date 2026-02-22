import React, { useState } from 'react'
import { Bike, Car, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react'
import { cn } from '../../lib/utils'
import { gql } from '@apollo/client';
import { useQuery, useMutation } from '@apollo/client/react';

const GET_PRICING_RULES = gql`
  query GetPricingRules {
    pricingRules {
      id
      vehicle_type
      base_fee
      base_hours
    }
  }
`;

const LOG_ENTRY = gql`
  mutation LogEntry($input: VehicleEntryInput!) {
    logVehicleEntry(input: $input) {
      id
      session_id
      base_fee_paid
      vehicle_number
    }
  }
`;

export const EntryForm = ({ onComplete }) => {
    const { data, loading: rulesLoading } = useQuery(GET_PRICING_RULES);
    const [logEntry, { loading: submitting }] = useMutation(LOG_ENTRY);

    const [phoneNumber, setPhoneNumber] = useState('')
    const [numberPlate, setNumberPlate] = useState('')
    const [vehicleType, setVehicleType] = useState('car') // Default to car (matches backend lowercase)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    // Get rule for selected type
    const selectedRule = data?.pricingRules?.find(r => r.vehicle_type.toLowerCase() === vehicleType.toLowerCase());

    const handleSubmit = async () => {
        if (!phoneNumber || phoneNumber.length < 10 || !numberPlate) return
        setError('')
        setSuccess('')

        try {
            await logEntry({
                variables: {
                    input: {
                        driver_phone: phoneNumber,
                        vehicle_number: numberPlate.toUpperCase(),
                        vehicle_type: vehicleType
                    }
                },
                refetchQueries: ['GetMonitorData', 'GetStatsData'],
                onCompleted: () => {
                    setSuccess('Vehicle logged successfully!')
                    setTimeout(() => {
                        if (onComplete) onComplete()
                    }, 1000)
                }
            });

            setPhoneNumber('')
            setNumberPlate('')
        } catch (e) {
            console.error("Entry error", e);
            setError(e.message || "Failed to log entry")
        }
    }

    if (rulesLoading) return <div className="p-8 text-center text-slate-500">Loading rates...</div>

    return (
        <div className="flex flex-col h-full max-w-2xl mx-auto">
            <div className="mb-6 px-1">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1 tracking-tight transition-colors">New Entry</h2>
                <p className="text-slate-500 dark:text-slate-400 font-medium text-xs transition-colors">Create a new parking session.</p>
            </div>

            <div className="space-y-8 bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-stone-100 dark:border-slate-800 shadow-bento transition-colors">

                {/* Number Plate Input */}
                <div className="space-y-4">
                    <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest pl-1 transition-colors">Number Plate</label>
                    <input
                        type="text"
                        placeholder="KL-00-XX-0000"
                        value={numberPlate}
                        onChange={(e) => setNumberPlate(e.target.value.toUpperCase())}
                        className="w-full bg-transparent border-b-2 border-stone-100 dark:border-slate-800 px-2 py-2 text-4xl font-mono font-bold text-slate-900 dark:text-white placeholder:text-stone-200 dark:placeholder:text-slate-700 focus:outline-none focus:border-brand-blue transition-colors tracking-widest uppercase"
                        autoFocus
                    />
                </div>

                {/* Phone Input */}
                <div className="space-y-4">
                    <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest pl-1 transition-colors">Mobile Number</label>
                    <input
                        type="tel"
                        placeholder="00000 00000"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                        className="w-full bg-transparent border-b-2 border-stone-100 dark:border-slate-800 px-2 py-2 text-4xl font-mono font-bold text-slate-900 dark:text-white placeholder:text-stone-200 dark:placeholder:text-slate-700 focus:outline-none focus:border-brand-blue transition-colors tracking-widest"
                    />
                </div>

                <div className="grid grid-cols-1 gap-6">
                    {/* Vehicle Type */}
                    <div className="space-y-4">
                        <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest pl-1 transition-colors">Vehicle Class</label>
                        <div className="flex gap-4">
                            {[
                                { id: 'bike', icon: Bike, label: 'Bike' },
                                { id: 'car', icon: Car, label: 'Car' }
                            ].map((type) => (
                                <button
                                    key={type.id}
                                    onClick={() => setVehicleType(type.id)}
                                    className={cn(
                                        "flex-1 flex flex-col items-center justify-center gap-2 p-5 rounded-2xl border transition-all duration-300",
                                        vehicleType === type.id
                                            ? "bg-brand-soft dark:bg-cyan-900/20 border-brand-blue/20 dark:border-cyan-700/50 text-brand-blue dark:text-cyan-400 shadow-lg shadow-brand-blue/10 scale-[1.02]"
                                            : "bg-stone-50 dark:bg-slate-800 border-transparent text-stone-400 dark:text-slate-500 hover:bg-stone-100 dark:hover:bg-slate-700"
                                    )}
                                >
                                    <type.icon className="h-8 w-8 stroke-[1.5px]" />
                                    <span className="font-bold text-sm tracking-tight">{type.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Upfront Payment Display */}
                    <div className="bg-emerald-50 dark:bg-emerald-900/10 rounded-2xl p-4 border border-emerald-100 dark:border-emerald-900/30 flex items-center justify-between transition-colors">
                        <div>
                            <p className="text-xs font-bold text-emerald-800 dark:text-emerald-400 uppercase tracking-widest mb-0.5 transition-colors">Entry Fee</p>
                            <p className="text-[10px] text-emerald-600 dark:text-emerald-500 font-medium transition-colors">
                                Covers first {selectedRule?.base_hours || 2} hours
                            </p>
                        </div>
                        <div className="text-3xl font-mono font-bold text-emerald-900 dark:text-emerald-300 tracking-tight transition-colors">
                            <span className="text-lg text-emerald-600/70 dark:text-emerald-500/70 mr-1">₹</span>
                            {selectedRule?.base_fee || '-'}
                        </div>
                    </div>
                </div>

                {error && (
                    <div className="flex items-center gap-2 text-rose-600 dark:text-rose-500 text-sm bg-rose-50 dark:bg-rose-950/20 p-3 rounded-lg border border-rose-100 dark:border-rose-900/30">
                        <AlertCircle className="h-4 w-4" />
                        {error}
                    </div>
                )}

                {success && (
                    <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-500 text-sm bg-emerald-50 dark:bg-emerald-950/20 p-3 rounded-lg border border-emerald-100 dark:border-emerald-900/30">
                        <CheckCircle2 className="h-4 w-4" />
                        {success}
                    </div>
                )}

                <button
                    onClick={handleSubmit}
                    disabled={!phoneNumber || !numberPlate || submitting}
                    className="w-full h-16 mt-2 rounded-2xl bg-slate-900 dark:bg-brand-blue hover:bg-slate-800 dark:hover:bg-cyan-600 text-white font-bold text-lg tracking-wide transition-all shadow-xl shadow-slate-900/20 dark:shadow-brand-blue/20 disabled:opacity-50 disabled:shadow-none disabled:cursor-not-allowed flex items-center justify-center gap-2 group active:scale-[0.98]"
                >
                    {submitting ? (
                        <span className="animate-pulse">Processing...</span>
                    ) : (
                        <>
                            Confirm Entry <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                        </>
                    )}
                </button>

            </div>
        </div>
    )
}
