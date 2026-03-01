import { useState } from 'react'
import { MobileLayout } from "./components/layout/MobileLayout"
import { EntryForm } from "./components/dashboard/EntryForm"
import { LiveMonitor } from "./components/dashboard/LiveMonitor"
import { StatsPanel } from "./components/dashboard/StatsPanel"
import { HistoryPanel } from "./components/dashboard/HistoryPanel"
import { LoginPage } from "./components/auth/LoginPage"
import { ProfilePanel } from "./components/dashboard/ProfilePanel"
import { AnimatePresence, motion } from "framer-motion"
import { ThemeProvider } from "./context/ThemeContext"
import { useAuth } from "./context/AuthContext"

function App() {
  const { isAuthenticated, logout } = useAuth()
  const [activeTab, setActiveTab] = useState('monitor')
  const [showEntryForm, setShowEntryForm] = useState(false)

  const handleLogout = () => {
    logout()
    setActiveTab('monitor')
  }

  const handleTabChange = (tab) => {
    if (tab === 'add') {
      setShowEntryForm(true)
    } else {
      setActiveTab(tab)
      setShowEntryForm(false)
    }
  }

  return (
    <ThemeProvider>
      <div className="h-[100dvh] w-full bg-stone-200 dark:bg-[#050505] flex items-center justify-center font-sans tracking-tight selection:bg-brand-blue/20 transition-colors duration-300 overflow-hidden">
        <div className="w-full max-w-md h-full overflow-hidden bg-stone-50 dark:bg-slate-950 relative shadow-2xl transition-colors duration-300">
          {!isAuthenticated ? (
            <LoginPage />
          ) : (
            <>
              {showEntryForm ? (
                <EntryForm
                  onComplete={() => {
                    setShowEntryForm(false)
                    setActiveTab('monitor')
                  }}
                  onCancel={() => setShowEntryForm(false)}
                />
              ) : (
                <MobileLayout activeTab={activeTab} onTabChange={handleTabChange} onLogout={handleLogout}>
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeTab}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="h-full"
                    >
                      {activeTab === 'monitor' && <LiveMonitor />}
                      {activeTab === 'stats' && <StatsPanel />}
                      {activeTab === 'history' && <HistoryPanel />}
                      {activeTab === 'profile' && <ProfilePanel onLogout={handleLogout} />}
                    </motion.div>
                  </AnimatePresence>
                </MobileLayout>
              )}
            </>
          )}
        </div>
      </div>
    </ThemeProvider>
  )
}

export default App
