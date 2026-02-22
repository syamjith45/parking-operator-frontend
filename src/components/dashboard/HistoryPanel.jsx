import React from 'react'
import { History, FileText } from 'lucide-react'

export const HistoryPanel = () => {
    return (
        <div className="flex flex-col h-full">
            <div className="px-1 mb-6">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">Transaction History</h2>
                <p className="text-slate-500 dark:text-slate-400 text-xs font-medium">Recorded sessions.</p>
            </div>

            <div className="flex flex-col items-center justify-center py-12 text-center opacity-70">
                <div className="bg-stone-100 dark:bg-slate-800 p-4 rounded-full mb-3 transition-colors">
                    <FileText className="h-8 w-8 text-stone-400 dark:text-slate-500" />
                </div>
                <h3 className="text-slate-900 dark:text-white font-bold transition-colors">Log Unavailable</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-[200px] mt-2">
                    Detailed transaction history is not yet supported by the backend API. Please refer to the daily revenue summary in the Stats panel.
                </p>
            </div>
        </div>
    )
}
