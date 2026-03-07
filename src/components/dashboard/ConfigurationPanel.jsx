import React, { useState, useEffect } from 'react'
import { Bike, Car, ArrowLeft, Save, AlertCircle, CheckCircle2 } from 'lucide-react'
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
      extra_hour_rate
    }
  }
`;

const UPDATE_PRICING_RULES = gql`
  mutation UpdatePricingRules($rules: [PricingRuleInput!]!) {
    updatePricingRules(rules: $rules) {
      id
      vehicle_type
      base_fee
      base_hours
      extra_hour_rate
    }
  }
`;

// Assuming a generalized input layout
const FormInput = ({ label, value, onChange, prefix, type = "number" }) => (
    <div className="space-y-2 flex-1 min-w-0">
        <label className="text-[10px] md:text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider pl-1 block truncate">{label}</label>
        <div className="flex items-center bg-white dark:bg-slate-950 border border-stone-200 dark:border-slate-800 rounded-2xl overflow-hidden focus-within:border-brand-blue focus-within:ring-1 focus-within:ring-brand-blue transition-all">
            {prefix && <span className="pl-3 pr-2 py-3 text-slate-400 dark:text-slate-500 font-mono font-bold bg-stone-50 dark:bg-slate-900 border-r border-stone-100 dark:border-slate-800 flex-shrink-0">{prefix}</span>}
            <input
                type={type}
                value={value}
                onChange={onChange}
                className="w-full min-w-0 bg-transparent px-2 py-3 text-base md:text-lg font-mono font-bold text-slate-900 dark:text-white placeholder:text-stone-200 dark:placeholder:text-slate-700 focus:outline-none"
            />
        </div>
    </div>
)

export const ConfigurationPanel = ({ onBack }) => {
    const { data, loading: rulesLoading } = useQuery(GET_PRICING_RULES, {
        fetchPolicy: 'network-only' // Ensure we get latest
    });
    const [updateRules] = useMutation(UPDATE_PRICING_RULES);

    const [rules, setRules] = useState({
        bike: { baseCharge: 0, hourlyRate: 10, overstayRate: 15, baseHours: 2 },
        car: { baseCharge: 0, hourlyRate: 20, overstayRate: 30, baseHours: 2 }
    });

    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (data?.pricingRules) {
            const newRules = { ...rules };
            data.pricingRules.forEach(r => {
                const type = r.vehicle_type.toLowerCase();
                if (newRules[type]) {
                    newRules[type] = {
                        ...newRules[type],
                        baseCharge: r.base_fee,
                        hourlyRate: r.extra_hour_rate, // Assuming this is hourly
                        baseHours: r.base_hours, // Preserve base hours
                        // We leave overstay to defaults or fetch if exists in backend
                        overstayRate: newRules[type].overstayRate
                    };
                }
            });
            setRules(newRules);
        }
    }, [data]);

    const handleSave = async () => {
        setIsSaving(true);
        setError('');
        setMessage('');

        try {
            const payload = Object.entries(rules).map(([type, data]) => ({
                vehicle_type: type,
                base_fee: data.baseCharge,
                base_hours: data.baseHours,
                extra_hour_rate: data.hourlyRate
            }));

            await updateRules({
                variables: { rules: payload },
                refetchQueries: ['GetPricingRules']
            });

            setMessage('Configuration saved successfully!');
            setTimeout(() => setMessage(''), 3000);
        } catch (e) {
            setError(e.message || 'Failed to save configuration');
        } finally {
            setIsSaving(false);
        }
    };

    const handleChange = (type, field, val) => {
        setRules(prev => ({
            ...prev,
            [type]: {
                ...prev[type],
                [field]: Number(val)
            }
        }));
    };

    if (rulesLoading) return <div className="p-8 text-center text-slate-500">Loading Configuration...</div>

    return (
        <div className="flex flex-col w-full h-full overflow-y-auto p-4 max-w-2xl mx-auto pb-8 relative scrollbar-hide">
            <div className="mb-6 px-1 mt-2 flex items-center gap-3">
                {onBack && (
                    <button
                        onClick={onBack}
                        className="p-2 -ml-2 rounded-xl text-slate-400 dark:text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-slate-800 transition-all duration-200 active:scale-90"
                        aria-label="Go back"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </button>
                )}
                <div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1 tracking-tight transition-colors">Settings</h2>
                    <p className="text-slate-500 dark:text-slate-400 font-medium text-xs transition-colors">Configure base and hourly parking charges.</p>
                </div>
            </div>

            <div className="space-y-6">
                {/* Two Wheeler Section */}
                <div className="bg-stone-50 dark:bg-slate-900/40 p-6 rounded-[2rem] border border-stone-200 dark:border-slate-800 transition-colors">
                    <div className="flex items-center gap-2 mb-6 text-slate-900 dark:text-white">
                        <Bike className="h-6 w-6 stroke-[2px]" />
                        <h3 className="text-lg font-bold tracking-tight">Two Wheeler (2W)</h3>
                    </div>

                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-3">
                            <FormInput
                                label="Base Charge"
                                prefix="₹"
                                value={rules.bike.baseCharge}
                                onChange={(e) => handleChange('bike', 'baseCharge', e.target.value)}
                            />
                            <FormInput
                                label="Hourly Rate"
                                prefix="₹"
                                value={rules.bike.hourlyRate}
                                onChange={(e) => handleChange('bike', 'hourlyRate', e.target.value)}
                            />
                        </div>
                        <FormInput
                            label="Overstay Rate / Hr"
                            prefix="₹"
                            value={rules.bike.overstayRate}
                            onChange={(e) => handleChange('bike', 'overstayRate', e.target.value)}
                        />
                    </div>
                </div>

                {/* Four Wheeler Section */}
                <div className="bg-brand-soft/30 dark:bg-brand-blue/5 p-6 rounded-[2rem] border border-brand-blue/10 dark:border-brand-blue/20 transition-colors">
                    <div className="flex items-center gap-2 mb-6 text-slate-800 dark:text-slate-200">
                        <Car className="h-6 w-6 stroke-[2px]" />
                        <h3 className="text-lg font-bold tracking-tight">Four Wheeler (4W)</h3>
                    </div>

                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-3">
                            <FormInput
                                label="Base Charge"
                                prefix="₹"
                                value={rules.car.baseCharge}
                                onChange={(e) => handleChange('car', 'baseCharge', e.target.value)}
                            />
                            <FormInput
                                label="Hourly Rate"
                                prefix="₹"
                                value={rules.car.hourlyRate}
                                onChange={(e) => handleChange('car', 'hourlyRate', e.target.value)}
                            />
                        </div>
                        <FormInput
                            label="Overstay Rate / Hr"
                            prefix="₹"
                            value={rules.car.overstayRate}
                            onChange={(e) => handleChange('car', 'overstayRate', e.target.value)}
                        />
                    </div>
                </div>

                {error && (
                    <div className="flex items-center gap-2 text-rose-600 dark:text-rose-500 text-sm bg-rose-50 dark:bg-rose-950/20 p-4 rounded-xl border border-rose-100 dark:border-rose-900/30">
                        <AlertCircle className="h-5 w-5 flex-shrink-0" />
                        <p className="font-medium">{error}</p>
                    </div>
                )}

                {message && (
                    <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-500 text-sm bg-emerald-50 dark:bg-emerald-950/20 p-4 rounded-xl border border-emerald-100 dark:border-emerald-900/30">
                        <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
                        <p className="font-medium">{message}</p>
                    </div>
                )}

                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="w-full h-14 rounded-2xl bg-black dark:bg-white text-white dark:text-black font-bold text-base tracking-wide transition-all shadow-lg active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50"
                >
                    {isSaving ? (
                        <span className="animate-pulse">Saving...</span>
                    ) : (
                        <>
                            <Save className="h-5 w-5" /> Save Configuration
                        </>
                    )}
                </button>

                {/* Danger Zone */}
                <div className="pt-6 pb-2">
                    <h4 className="text-xs font-bold text-rose-500 uppercase tracking-widest pl-1 mb-4">Danger Zone</h4>
                    <button className="w-full h-14 rounded-2xl border-2 border-rose-100 dark:border-rose-900/50 text-rose-600 dark:text-rose-500 font-bold text-base hover:bg-rose-50 dark:hover:bg-rose-950/20 active:bg-rose-100 dark:active:bg-rose-900/40 transition-colors">
                        Reset to Defaults
                    </button>
                </div>
            </div>
        </div>
    )
}
