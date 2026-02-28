import React from 'react'
import { User, Mail, Shield, Phone, LogOut } from 'lucide-react'
import { Button } from '../ui/Button'
import { useAuth } from '../../context/AuthContext'

export const ProfilePanel = ({ onLogout }) => {
    const { user } = useAuth();

    // Extract a display name from email since Supabase user metadata might be empty by default
    const displayName = user?.email ? user.email.split('@')[0] : 'System Admin';
    return (
        <div className="space-y-6 pb-20">
            <div className="flex flex-col items-center pt-8 pb-6">
                <div className="h-24 w-24 rounded-full bg-stone-200 dark:bg-slate-800 flex items-center justify-center border-4 border-white dark:border-slate-900 shadow-2xl mb-4">
                    <User className="h-10 w-10 text-slate-400 dark:text-slate-500" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white capitalize">{displayName}</h2>
                <p className="text-brand-blue font-medium">ParkOps Operator</p>
            </div>

            <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Contact Information</h3>
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <Mail className="h-5 w-5 text-slate-400" />
                            <div>
                                <p className="text-sm font-medium text-slate-900 dark:text-white">{user?.email || 'admin@parkops.com'}</p>
                                <p className="text-xs text-slate-500">Email Address</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Phone className="h-5 w-5 text-slate-400" />
                            <div>
                                <p className="text-sm font-medium text-slate-900 dark:text-white">+91 98765 43210</p>
                                <p className="text-xs text-slate-500">Phone Number</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Security</h3>
                    <div className="flex items-center gap-3">
                        <Shield className={`h-5 w-5 ${user?.email?.includes('admin') ? 'text-emerald-500' : 'text-slate-400 dark:text-slate-500'}`} />
                        <div>
                            <p className="text-sm font-medium text-slate-900 dark:text-white">
                                {user?.email?.includes('admin') ? 'Admin Access' : 'Operator Access'}
                            </p>
                            <p className="text-xs text-slate-500">
                                {user?.email?.includes('admin') ? 'Full System Privileges' : 'Standard Terminal Rights'}
                            </p>
                        </div>
                    </div>
                </div>

                <Button
                    variant="destructive"
                    className="w-full"
                    onClick={onLogout}
                >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                </Button>
            </div>
        </div>
    )
}
