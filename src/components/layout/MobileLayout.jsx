import { Logo } from "../ui/Logo"

import React, { useState } from "react"
import { LayoutDashboard, Plus, BarChart3, Settings, User, History, Moon, Sun, LogOut } from "lucide-react"
import { cn } from "../../lib/utils"
import { useTheme } from "../../context/ThemeContext"

// ... inside the file ...

const NavItem = ({ icon: Icon, label, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={cn(
            "relative flex flex-col items-center justify-center w-full h-full transition-all duration-200 active:scale-90",
            isActive ? "text-slate-900 dark:text-white scale-110" : "text-slate-400 dark:text-slate-600"
        )}
    >
        <Icon className={cn("h-6 w-6 stroke-[2.5px]", isActive && "fill-slate-900/5 dark:fill-white/5")} />
    </button>
)

export const MobileLayout = ({ children, activeTab, onTabChange, onLogout }) => {
    const [isSettingsOpen, setIsSettingsOpen] = useState(false)
    const { theme, toggleTheme } = useTheme()

    return (
        <div className="flex flex-col h-full w-full bg-stone-50 dark:bg-slate-950 relative transition-colors duration-300">

            {/* Personalized Header */}
            {/* Premium Header */}
            <header className="flex-none h-16 px-6 flex items-center justify-between z-20 bg-gradient-to-b from-stone-50/90 to-stone-50/0 dark:from-slate-950/90 dark:to-slate-950/0 backdrop-blur-sm sticky top-0 transition-colors duration-300">
                <div className="flex flex-col justify-center">
                    <Logo />
                </div>

                <div className="flex items-center gap-2 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md p-1.5 rounded-full border border-stone-200/50 dark:border-slate-800/50 shadow-sm">
                    <button
                        onClick={toggleTheme}
                        className="p-2.5 rounded-full bg-stone-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-brand-blue dark:hover:text-brand-blue transition-all duration-300 active:scale-95"
                    >
                        {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                    </button>
                    <button
                        onClick={() => setIsSettingsOpen(true)}
                        className="p-2.5 rounded-full hover:bg-stone-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-all duration-300 active:scale-95 relative group"
                    >
                        <Settings className="h-5 w-5 group-hover:rotate-90 transition-transform duration-500" />
                    </button>
                </div>
            </header>



            {/* Main Content Area */}
            <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 relative z-10 bg-stone-50 dark:bg-slate-950 scrollbar-hide transition-colors duration-300">
                {children}
                <div className="h-32 w-full" /> {/* Spacer for Bottom Nav */}
            </main>

            {/* Mobile Bottom Nav */}
            <div className="fixed bottom-6 left-0 right-0 z-50 flex justify-center px-6 pointer-events-none">
                <nav className="flex items-center justify-between w-full max-w-xs h-16 px-6 bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl border border-stone-200 dark:border-slate-800 rounded-2xl shadow-lg pointer-events-auto transition-colors duration-300">

                    <NavItem
                        icon={LayoutDashboard}
                        isActive={activeTab === 'monitor'}
                        onClick={() => onTabChange('monitor')}
                    />

                    <NavItem
                        icon={History}
                        isActive={activeTab === 'history'}
                        onClick={() => onTabChange('history')}
                    />

                    <div className="relative -top-8">
                        <button
                            onClick={() => onTabChange('add')}
                            className={cn(
                                "h-16 w-16 rounded-full bg-slate-900 flex items-center justify-center text-white shadow-xl shadow-slate-900/30 dark:shadow-black/50",
                                "transition-all duration-200 active:scale-90 border-[6px] border-stone-50 dark:border-slate-950"
                            )}
                        >
                            <Plus className="h-8 w-8 stroke-[3px]" />
                        </button>
                    </div>

                    <NavItem
                        icon={BarChart3}
                        isActive={activeTab === 'stats'}
                        onClick={() => onTabChange('stats')}
                    />

                    <NavItem
                        icon={User}
                        isActive={activeTab === 'profile'}
                        onClick={() => onTabChange('profile')}
                    />

                </nav>
            </div>
        </div>
    )
}
