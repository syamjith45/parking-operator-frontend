import React, { useState } from 'react'
import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'
import { useParking } from '../../context/ParkingContext'
import { Save, Bike, Car } from 'lucide-react'

export const SettingsModal = ({ isOpen, onClose }) => {
    const { rates, updateRates, resetData } = useParking()
    const [localRates, setLocalRates] = useState(rates)

    const handleChange = (type, field, value) => {
        setLocalRates(prev => ({
            ...prev,
            [type]: {
                ...prev[type],
                [field]: Number(value)
            }
        }))
    }

    const handleSave = () => {
        updateRates(localRates)
        onClose()
    }

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Rate Configuration"
            footer={
                <Button onClick={handleSave} className="w-full bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200 transition-colors">
                    <Save className="h-4 w-4 mr-2" /> Save Configuration
                </Button>
            }
        >
            <div className="space-y-5">
                <p className="text-sm text-slate-500">Configure base and hourly parking charges.</p>

                {/* 2W Settings */}
                <div className="p-4 rounded-xl border border-stone-200 bg-stone-50">
                    <div className="flex items-center gap-2 mb-4 text-slate-700 font-bold">
                        <Bike className="h-5 w-5" />
                        <span>Two Wheeler (2W)</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Base Charge</label>
                            <div className="flex items-center bg-white rounded-lg border border-stone-200 px-3 py-2 focus-within:border-brand-blue focus-within:ring-2 focus-within:ring-brand-blue/20 transition-all">
                                <span className="text-slate-400 mr-2">₹</span>
                                <input
                                    type="number"
                                    value={localRates['2W'].base}
                                    onChange={(e) => handleChange('2W', 'base', e.target.value)}
                                    className="w-full text-slate-900 font-bold outline-none bg-transparent"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Hourly Rate</label>
                            <div className="flex items-center bg-white rounded-lg border border-stone-200 px-3 py-2 focus-within:border-brand-blue focus-within:ring-2 focus-within:ring-brand-blue/20 transition-all">
                                <span className="text-slate-400 mr-2">₹</span>
                                <input
                                    type="number"
                                    value={localRates['2W'].hourly}
                                    onChange={(e) => handleChange('2W', 'hourly', e.target.value)}
                                    className="w-full text-slate-900 font-bold outline-none bg-transparent"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* 4W Settings */}
                <div className="p-4 rounded-xl border border-cyan-100 bg-cyan-50/30">
                    <div className="flex items-center gap-2 mb-4 text-cyan-900 font-bold">
                        <Car className="h-5 w-5" />
                        <span>Four Wheeler (4W)</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Base Charge</label>
                            <div className="flex items-center bg-white rounded-lg border border-cyan-100 px-3 py-2 focus-within:border-brand-blue focus-within:ring-2 focus-within:ring-brand-blue/20 transition-all">
                                <span className="text-slate-400 mr-2">₹</span>
                                <input
                                    type="number"
                                    value={localRates['4W'].base}
                                    onChange={(e) => handleChange('4W', 'base', e.target.value)}
                                    className="w-full text-slate-900 font-bold outline-none bg-transparent"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Hourly Rate</label>
                            <div className="flex items-center bg-white rounded-lg border border-cyan-100 px-3 py-2 focus-within:border-brand-blue focus-within:ring-2 focus-within:ring-brand-blue/20 transition-all">
                                <span className="text-slate-400 mr-2">₹</span>
                                <input
                                    type="number"
                                    value={localRates['4W'].hourly}
                                    onChange={(e) => handleChange('4W', 'hourly', e.target.value)}
                                    className="w-full text-slate-900 font-bold outline-none bg-transparent"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pt-4">
                    <p className="text-xs font-bold text-rose-500 uppercase tracking-widest mb-3">Danger Zone</p>
                    <Button
                        onClick={() => {
                            if (window.confirm('Are you sure you want to clear all history? This cannot be undone.')) {
                                resetData();
                                onClose();
                            }
                        }}
                        variant="outline"
                        className="w-full border-rose-200 text-rose-600 hover:bg-rose-50 dark:border-rose-900/30 dark:text-rose-400 dark:hover:bg-rose-900/20 transition-colors"
                    >
                        Clear History & Reset Revenue
                    </Button>
                </div>
            </div>
        </Modal>
    )
}
