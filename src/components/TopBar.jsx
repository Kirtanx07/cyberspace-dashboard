import React, { useState, useRef, useEffect } from 'react'
import { useClock } from '../hooks/useClock'
import { useStore } from '../store'
import { useAuth } from '../lib/auth'
import { GRAD_COLORS } from '../store'

function getInitials(name = '') { return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || '??' }

export function TopBar({ health, onExport, onOpenProfile }) {
  const { timeStr, dateStr } = useClock()
  const { user, logout } = useAuth()
  const resources  = useStore(s => s.resources)
  const todos      = useStore(s => s.todos)
  const sessions   = useStore(s => s.sessions)
  const totalSecs  = useStore(s => s.totalSecs)
  const dashName   = useStore(s => s.dashName)
  const setDashName = useStore(s => s.setDashName)
  const [ddOpen, setDdOpen] = useState(false)
  const badgeRef = useRef(null)

  const done = todos.filter(t => t.done).length
  const pct  = todos.length ? Math.round(done / todos.length * 100) : 0
  const h    = Math.floor(totalSecs / 3600)
  const m    = Math.floor((totalSecs % 3600) / 60)

  const { net, latency, online } = health
  const netColor = !online ? 'var(--accent2)' : net === 'FAST' || net === 'GOOD' ? 'var(--accent3)' : net === 'SLOW' ? 'var(--accent4)' : 'var(--accent2)'
  const sysClass = !online ? 'bad' : (latency && latency > 800) ? 'warn' : 'ok'
  const sysLabel = !online ? 'OFFLINE' : (latency && latency > 800) ? 'HIGH LATENCY' : 'SYS OK'

  useEffect(() => {
    const fn = e => { if (badgeRef.current && !badgeRef.current.contains(e.target)) setDdOpen(false) }
    document.addEventListener('click', fn)
    return () => document.removeEventListener('click', fn)
  }, [])

  const n = user?.displayname || user?.username || 'USER'

  return (
    <header className="topbar">
      <div className="logo-area">
        <div className="logo-text">CYBER<span>SPACE</span></div>
        <div className="logo-name-wrap">
          <span style={{ color:'var(--text3)', fontFamily:'var(--mono)', fontSize:'.65rem' }}>//</span>
          <input className="logo-dash-name" value={dashName} maxLength={32}
            title="Click to rename your dashboard"
            onChange={e => setDashName(e.target.value)}
            onBlur={e => { const v = e.target.value.trim() || 'My Workspace'; setDashName(v) }}
            onKeyDown={e => { if (e.key === 'Enter') e.target.blur() }} />
          <span className="logo-edit-hint" onClick={() => document.querySelector('.logo-dash-name')?.focus()}>✎</span>
        </div>
      </div>

      <div className="top-center">
        <div className="tpill">
          <div className={`health-dot ${sysClass}`} />
          <span className="v" style={{ color: sysClass === 'ok' ? 'var(--accent3)' : sysClass === 'warn' ? 'var(--accent4)' : 'var(--accent2)' }}>{sysLabel}</span>
        </div>
        <div className="tpill g"><span>NET</span><span className="v" style={{ color: netColor }}>{net}</span></div>
        <div className="tpill y"><span>LATENCY</span><span className="v">{latency ? latency + 'ms' : '—'}</span></div>
        <div className="tpill"><span>RESOURCES</span><span className="v">{resources.length}</span></div>
        <div className="tpill"><span>TASKS</span><span className="v">{todos.length}</span></div>
        <div className="tpill g"><span>DONE</span><span className="v">{pct}%</span></div>
        <div className="tpill"><span>SESSION</span><span className="v">{h}h {m}m</span></div>
      </div>

      <div className="topbar-right">
        <div className="clock-wrap">
          <div className="clock-t">{timeStr}</div>
          <div className="clock-d">{dateStr}</div>
        </div>

        <div className={`user-badge${ddOpen ? ' open' : ''}`} ref={badgeRef} onClick={() => setDdOpen(v => !v)}>
          <div className="user-avatar" style={{ background: user?.avatarColor || GRAD_COLORS[0] }}>{getInitials(n)}</div>
          <div className="user-name">{n}</div>
          <span className="user-dd-chevron">▾</span>
          <div className="user-dropdown">
            <div className="user-dd-header">
              <div className="user-dd-name">{n}</div>
              <div className="user-dd-email">@{user?.username}</div>
            </div>
            <div className="user-dd-item" onClick={() => { setDdOpen(false); onOpenProfile?.() }}>⚙ Edit Profile</div>
            <div className="user-dd-item" onClick={() => { setDdOpen(false); document.querySelector('.logo-dash-name')?.focus(); document.querySelector('.logo-dash-name')?.select() }}>✎ Rename Dashboard</div>
            <div className="user-dd-item" onClick={() => { setDdOpen(false); onExport?.() }}>↓ Export Data</div>
            <div className="user-dd-item danger" onClick={() => { setDdOpen(false); if (confirm('Sign out?')) logout() }}>→ Sign Out</div>
          </div>
        </div>
      </div>
    </header>
  )
}
