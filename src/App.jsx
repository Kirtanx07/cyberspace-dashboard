import React, { useState, useEffect } from 'react'
import { useAuth } from './lib/auth'
import { useStore } from './store'
import { useHealth } from './hooks/useHealth'
import { useNotification } from './hooks/useNotification'
import { AuthScreen }      from './components/AuthScreen'
import { TopBar }          from './components/TopBar'
import { Timer }           from './components/Timer'
import { SystemHealth }    from './components/SystemHealth'
import { ResourceHub, QuickLinks, TaskBoard, ConfigPanel,
         AddResourceModal, ProfileModal, Toast } from './components/DashboardWidgets'
import { InternshipsTab }  from './components/InternshipsTab'
import { ImportTab }       from './components/ImportTab'
import { ProductionTab }   from './components/ProductionTab'

const TABS = [
  { id:'dashboard',  label:'⬡ DASHBOARD' },
  { id:'internships',label:'💼 INTERNSHIPS' },
  { id:'import',     label:'↑ IMPORT' },
  { id:'production', label:'🚀 GO PRODUCTION' },
]

export default function App() {
  const { user, loading, updateProfile } = useAuth()
  const health   = useHealth()
  const { notif, toast } = useNotification()
  const [tab, setTab]           = useState('dashboard')
  const [addOpen, setAddOpen]   = useState(false)
  const [profOpen, setProfOpen] = useState(false)

  const resources  = useStore(s => s.resources)
  const accent     = useStore(s => s.accent)
  const seedIfEmpty = useStore(s => s.seedIfEmpty)
  const resetData  = useStore(s => s.resetData)
  const setAccent  = useStore(s => s.setAccent)

  // Restore accent on load
  useEffect(() => {
    if (accent) setAccent(accent)
  }, [])

  // Seed demo data when user logs in
  useEffect(() => {
    if (user) seedIfEmpty()
  }, [user])

  const exportData = () => {
    const state = useStore.getState()
    const blob = new Blob(
      [JSON.stringify({ resources: state.resources, todos: state.todos, exportedAt: new Date().toISOString() }, null, 2)],
      { type: 'application/json' }
    )
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = (state.dashName || 'cyberspace') + '-export.json'
    a.click()
    URL.revokeObjectURL(a.href)
    toast('DATA EXPORTED!')
  }

  const handleReset = () => {
    if (window.confirm('RESET ALL DATA?')) { resetData(); toast('DATA RESET') }
  }

  if (loading) {
    return (
      <div style={{ height:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'var(--bg)', fontFamily:'var(--mono)', color:'var(--accent)', fontSize:'1rem', letterSpacing:4 }}>
        LOADING...
      </div>
    )
  }

  if (!user) return <AuthScreen />

  return (
    <div className="app">
      <TopBar
        health={health}
        onExport={exportData}
        onOpenProfile={() => setProfOpen(true)}
      />

      {/* Nav */}
      <nav className="nav">
        {TABS.map(t => (
          <button key={t.id} className={`nav-btn${tab === t.id ? ' active' : ''}`}
            data-tab={t.id}
            onClick={() => setTab(t.id)}>
            {t.label}
          </button>
        ))}
      </nav>

      <main className="main">

        {/* ── DASHBOARD ── */}
        {tab === 'dashboard' && (
          <div className="tab active">
            <div className="dash">

              {/* LEFT col: Timer + Health + QuickLinks */}
              <div className="col">
                <Timer toast={toast} />
                <SystemHealth health={health} onRefresh={health.refresh} />
                <QuickLinks onOpenAdd={() => setAddOpen(true)} />
              </div>

              {/* CENTER: Resource Hub */}
              <ResourceHub onOpenAdd={() => setAddOpen(true)} />

              {/* RIGHT col: Tasks + Config */}
              <div className="col">
                <TaskBoard />
                <ConfigPanel onExport={exportData} onReset={handleReset} />
              </div>

            </div>
          </div>
        )}

        {tab === 'internships' && (
          <div className="tab active">
            <InternshipsTab toast={toast} />
          </div>
        )}

        {tab === 'import' && (
          <div className="tab active">
            <ImportTab toast={toast} />
          </div>
        )}

        {tab === 'production' && (
          <div className="tab active">
            <ProductionTab toast={toast} />
          </div>
        )}

      </main>

      {/* Modals */}
      <AddResourceModal open={addOpen} onClose={() => setAddOpen(false)} toast={toast} />
      <ProfileModal
        open={profOpen}
        onClose={() => setProfOpen(false)}
        user={user}
        onUpdate={updateProfile}
        toast={toast}
      />

      {/* Toast */}
      <Toast notif={notif} />
    </div>
  )
}
