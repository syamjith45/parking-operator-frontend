import React, { useState } from 'react'
import { Button } from '../ui/Button'
import { Modal } from '../ui/Modal'
import { CheckCircle2, AlertTriangle, Clock, ArrowRight, Printer } from 'lucide-react'
import { cn } from '../../lib/utils'

export const ExitModal = ({ isOpen, onClose, onConfirm, vehicle, exitData }) => {
    const [isProcessing, setIsProcessing] = useState(false)

    const handleConfirm = async () => {
        setIsProcessing(true)
        await new Promise(resolve => setTimeout(resolve, 800))
        onConfirm()
        setIsProcessing(false)
    }

    const handlePrint = () => {
        window.print()
    }

    if (!vehicle || !exitData) return null

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Complete Session">
            <div className="space-y-6">

                {/* Vehicle Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1 transition-colors">Vehicle Details</p>
                        <p className="text-3xl font-mono font-bold text-slate-900 dark:text-white tracking-tight mb-1 transition-colors">{vehicle.vehicle_number || 'NO PLATE'}</p>
                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 flex items-center gap-2 transition-colors">
                            <span>Ph: {vehicle.driver_phone}</span>
                        </p>
                    </div>
                    <div className={cn(
                        "px-3 py-1 rounded-full text-xs font-bold border transition-colors",
                        vehicle.vehicle_type === 'car' ? "bg-cyan-50 dark:bg-cyan-900/20 text-brand-blue dark:text-cyan-400 border-cyan-100 dark:border-cyan-800" : "bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 border-purple-100 dark:border-purple-800"
                    )}>
                        {vehicle.vehicle_type === 'car' ? 'Car' : 'Bike'}
                    </div>
                </div>

                {/* Duration & Status */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-4 transition-colors">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <Clock className="h-4 w-4 text-slate-400 dark:text-slate-500 transition-colors" />
                                <span className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase transition-colors">Entry Time</span>
                            </div>
                            <p className="text-sm font-mono font-bold text-slate-900 dark:text-white transition-colors">
                                {new Date(vehicle.entry_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium transition-colors">
                                {new Date(vehicle.entry_time).toLocaleDateString()}
                            </p>
                        </div>
                        <div className="text-right">
                            <div className="flex items-center justify-end gap-2 mb-1">
                                <Clock className="h-4 w-4 text-slate-400 dark:text-slate-500 transition-colors" />
                                <span className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase transition-colors">Exit Time</span>
                            </div>
                            <p className="text-sm font-mono font-bold text-slate-900 dark:text-white transition-colors">
                                {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium transition-colors">
                                Present
                            </p>
                        </div>
                    </div>

                    <div className="col-span-2 p-4 rounded-2xl bg-stone-50 dark:bg-slate-900 border border-stone-100 dark:border-slate-800 flex justify-between items-center transition-colors">
                        <div>
                            <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1 transition-colors">Total Duration</p>
                            <p className="text-2xl font-bold text-slate-900 dark:text-white transition-colors">{exitData.actualDuration}h <span className="text-sm font-semibold text-slate-400 dark:text-slate-600">/ {exitData.declaredDuration}h</span></p>
                        </div>
                        <div className="text-right">
                            <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1 transition-colors">Total Cost</p>
                            <p className="text-2xl font-mono font-bold text-slate-900 dark:text-white transition-colors">₹{exitData.totalCost}</p>
                        </div>
                    </div>
                </div>

                {/* Final Calculation */}
                <div className="pt-6 border-t border-slate-100 dark:border-slate-800 space-y-4 transition-colors">
                    <div className="flex justify-between text-sm">
                        <span className="text-slate-500 dark:text-slate-400 transition-colors">Paid Upfront</span>
                        <span className="font-mono font-bold text-emerald-600 dark:text-emerald-500 transition-colors">- ₹{vehicle.base_fee_paid || 0}</span>
                    </div>

                    <div className="flex justify-between items-end">
                        <div>
                            <p className="text-lg font-bold text-slate-900 dark:text-white mb-0 transition-colors">Balance Due</p>
                            {exitData.overstayHours > 0 && (
                                <p className="text-xs text-rose-600 dark:text-rose-500 font-bold flex items-center gap-1 transition-colors">
                                    <AlertTriangle className="h-3 w-3" />
                                    {exitData.overstayHours}h Overstay
                                </p>
                            )}
                        </div>
                        <div className="flex items-center gap-3">
                            <button onClick={handlePrint} className="p-2 rounded-full bg-stone-100 dark:bg-slate-800 hover:bg-stone-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 transition-colors" title="Print Receipt">
                                <Printer className="h-5 w-5" />
                            </button>
                            <div className="text-4xl font-bold text-slate-900 dark:text-white flex items-center tracking-tight transition-colors">
                                <span className="text-xl text-slate-400 dark:text-slate-500 mr-1 transition-colors">₹</span>
                                {exitData.balanceDue}
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <Button variant="ghost" className="flex-1" onClick={onClose} disabled={isProcessing}>
                            Cancel
                        </Button>
                        <Button
                            variant={exitData.balanceDue > 0 ? "default" : "default"}
                            onClick={handleConfirm}
                            isLoading={isProcessing}
                            className={cn(
                                "flex-[2]",
                                exitData.balanceDue > 0 ? "bg-red-600 hover:bg-red-700 text-white shadow-red-200" : ""
                            )}
                        >
                            {exitData.balanceDue > 0 ? 'Collect & Exit' : 'Confirm Exit'}
                            {!isProcessing && <ArrowRight className="ml-2 h-4 w-4" />}
                        </Button>
                    </div>
                </div>
            </div>
        </Modal>
    )
}
