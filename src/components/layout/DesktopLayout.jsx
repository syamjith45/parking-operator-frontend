import React, { useState } from "react"
import { LayoutDashboard, PlusCircle, BarChart3, Settings, LogOut, Search, Bell } from "lucide-react"
import { cn } from "../../lib/utils"

const SidebarItem = ({ icon: Icon, label, isActive, onClick, isCollapsed }) => (
    <button
        onClick={onClick}
        className={cn(
            "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
            isActive
                ? "bg-brand-blue/10 text-brand-blue font-medium"
                : "text-slate-400 hover:bg-white/5 hover:text-white"
        )}
    >
        <Icon className={cn("h-5 w-5 flex-shrink-0", isActive ? "stroke-[2.5px]" : "stroke-[1.5px]")} />
        {!isCollapsed && (
            <span className="truncate tracking-wide text-sm">{label}</span>
        )}
        {isActive && !isCollapsed && (
            <div className="ml-auto w-1.5 h-1.5 rounded-full bg-brand-blue shadow-[0_0_8px_rgba(59,130,246,0.6)]" />
        )}
    </button>
)

export const DesktopLayout = ({ children, activeTab, onTabChange }) => {
    const [isCollapsed, setIsCollapsed] = useState(false)

    return (
        <div className="flex h-screen w-full bg-navy-950 text-slate-100 font-sans selection:bg-brand-blue/30">

            {/* Sidebar */}
            <aside
                className={cn(
                    "flex flex-col border-r border-navy-700 bg-navy-900 transition-all duration-300 relative z-20",
                    isCollapsed ? "w-20" : "w-72"
                )}
            >
                {/* Logo Area */}
                <div className="h-16 flex items-center px-6 border-b border-navy-700/50">
                    <div className="h-8 w-8 rounded-lg bg-brand-blue flex items-center justify-center text-white font-bold flex-shrink-0 shadow-lg shadow-brand-blue/20">
                        P
                    </div>
                    {!isCollapsed && (
                        <div className="ml-3 transition-opacity duration-200">
                            <h1 className="font-semibold tracking-tight text-white leading-none">ParkOps</h1>
                            <p className="text-[10px] text-slate-500 font-mono mt-1">v2.4.0</p>
                        </div>
                    )}
                </div>

                {/* Nav Items */}
                <nav className="flex-1 p-3 space-y-1 mt-4">
                    <div className={cn("px-4 mb-2 text-xs font-mono text-slate-500 uppercase tracking-wider", isCollapsed && "hidden")}>
                        Menu
                    </div>
                    <SidebarItem
                        icon={LayoutDashboard}
                        label="Live Monitor"
                        isActive={activeTab === 'monitor'}
                        onClick={() => onTabChange('monitor')}
                        isCollapsed={isCollapsed}
                    />
                    <SidebarItem
                        icon={PlusCircle}
                        label="New Entry"
                        isActive={activeTab === 'add'}
                        onClick={() => onTabChange('add')}
                        isCollapsed={isCollapsed}
                    />
                    <SidebarItem
                        icon={BarChart3}
                        label="Analytics"
                        isActive={activeTab === 'stats'}
                        onClick={() => onTabChange('stats')}
                        isCollapsed={isCollapsed}
                    />
                </nav>

                {/* User Profile / Collapse Trigger at bottom */}
                <div className="p-3 border-t border-navy-700/50">
                    <button
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className="w-full flex items-center justify-center p-2 rounded-lg text-slate-500 hover:text-white hover:bg-white/5 transition-colors"
                    >
                        {isCollapsed ? <Search className="h-5 w-5" /> : <span className="text-xs font-mono">Collapse Sidebar</span>}
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0 bg-navy-950 relative overflow-hidden">
                {/* Top Header */}
                <header className="h-16 border-b border-navy-700/50 flex items-center justify-between px-8 bg-navy-900/50 backdrop-blur-sm z-10">
                    <div className="flex items-center gap-4 text-slate-400">
                        <Search className="h-4 w-4" />
                        <input
                            placeholder="Global search (Cmd + K)"
                            className="bg-transparent border-none text-sm focus:outline-none focus:ring-0 text-white w-64 placeholder:text-slate-600 font-mono"
                        />
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-blue/10 border border-brand-blue/20">
                            <div className="h-2 w-2 rounded-full bg-brand-blue animate-pulse"></div>
                            <span className="text-xs font-medium text-brand-blue">System Online</span>
                        </div>
                        <button onClick={() => onTabChange('settings')} className="p-2 text-slate-400 hover:text-white transition-colors">
                            <Settings className="h-5 w-5" />
                        </button>
                        <button className="p-2 text-slate-400 hover:text-white transition-colors">
                            <Bell className="h-5 w-5" />
                        </button>
                        <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-slate-700 to-slate-600 border border-slate-500/30"></div>
                    </div>
                </header>

                {/* Scrollable View Area */}
                <div className="flex-1 overflow-y-auto p-8 scroll-smooth">
                    <div className="max-w-7xl mx-auto h-full">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    )
}
