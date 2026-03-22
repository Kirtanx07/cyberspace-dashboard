import React, { useState, useEffect } from 'react'
import { useStore } from '../store'

export function SystemHealth({ health, onRefresh }) {
  const resources = useStore(s => s.resources)
  const [uptime, setUptime] = useState('0s')
  const [browser, setBrowser] = useState('')
  const [lastCheck, setLastCheck] = useState('—')

  const { net, latency, online, sessionStart } = health

  useEffect(() => {
    const id = setInterval(() => {
      const s = Math.floor((Date.now() - sessionStart) / 1000)
      setUptime(s < 60 ? s+'s' : s < 3600 ? Math.floor(s/60)+'m' : Math.floor(s/3600)+'h '+Math.floor((s%3600)/60)+'m')
    }, 1000)
    return () => clearInterval(id)
  }, [sessionStart])

  useEffect(() => {
    const ua = navigator.userAgent
    const br = ua.includes('Chrome') && !ua.includes('Edg') ? 'Chrome' : ua.includes('Firefox') ? 'Firefox' : ua.includes('Safari') && !ua.includes('Chrome') ? 'Safari' : ua.includes('Edg') ? 'Edge' : 'Unknown'
    setBrowser(br + ' · ' + navigator.platform)
  }, [])

  useEffect(() => {
    setLastCheck(new Date().toLocaleTimeString('en-GB', { hour12: false }))
  }, [net, latency])

  const netScore = !online ? 0 : latency === null ? 50 : latency < 150 ? 100 : latency < 400 ? 75 : latency < 800 ? 45 : 20
  const netColor = netScore > 70 ? 'var(--accent3)' : netScore > 40 ? 'var(--accent4)' : 'var(--accent2)'
  const latBar   = latency ? Math.max(0, 100 - Math.round(latency / 10)) : 0
  const latColor = !latency ? 'var(--text3)' : latency < 150 ? 'var(--accent3)' : latency < 400 ? 'var(--accent)' : latency < 800 ? 'var(--accent4)' : 'var(--accent2)'

  const allGood = online && (!latency || latency < 400)
  const warn    = online && latency && latency >= 400 && latency < 800
  const sysClass = allGood ? 'ok' : warn ? 'warn' : 'bad'
  const statusTxt = !online ? 'NETWORK OFFLINE' : allGood ? 'ALL SYSTEMS NOMINAL' : warn ? 'HIGH LATENCY DETECTED' : 'DEGRADED PERFORMANCE'
  const statusColor = allGood ? 'var(--accent3)' : warn ? 'var(--accent4)' : 'var(--accent2)'

  return (
    <div className="health-panel">
      <div className="ph">
        <div className="ph-l"><div className="ph-dot"/>SYSTEM HEALTH</div>
        <span style={{ fontFamily:'var(--mono)', fontSize:'.55rem', color:'var(--text3)', cursor:'pointer' }} onClick={onRefresh}>↻ REFRESH</span>
      </div>

      <div className="health-grid">
        <Metric label="NETWORK" val={net} valColor={netColor} barW={netScore} barColor={netColor} note={online ? (latency ? latency+'ms latency' : 'connected') : 'disconnected'} />
        <Metric label="LATENCY" val={latency ? latency+'ms' : '—'} valColor={latColor} barW={latBar} barColor={latColor} note={latency ? latency < 150 ? 'excellent' : latency < 400 ? 'good' : latency < 800 ? 'slow' : 'poor' : '—'} />
        <Metric label="UPTIME"  val={uptime} valColor="var(--accent3)" barW={100} barColor="var(--accent3)" note="this session" />
        <Metric label="RESOURCES" val={resources.length} valColor="var(--accent)" barW={Math.min(100, resources.length * 4)} barColor="var(--accent)" note={resources.length + ' items stored'} />
      </div>

      <div className="health-status-row">
        <span className="hsr-label">STATUS</span>
        <div className={`health-dot ${sysClass}`} />
        <span className="hsr-val" style={{ color: statusColor }}>{statusTxt}</span>
      </div>
      <div className="health-status-row">
        <span className="hsr-label">LAST CHECK</span>
        <span className="hsr-val" style={{ color:'var(--text3)' }}>{lastCheck}</span>
      </div>
      <div className="health-status-row">
        <span className="hsr-label">BROWSER</span>
        <span className="hsr-val" style={{ color:'var(--text3)' }}>{browser}</span>
      </div>
    </div>
  )
}

function Metric({ label, val, valColor, barW, barColor, note }) {
  return (
    <div className="hmetric">
      <div className="hm-label">{label}</div>
      <div className="hm-val" style={{ color: valColor }}>{val}</div>
      <div className="hm-bar"><div className="hm-bar-fill" style={{ width: barW+'%', background: barColor }} /></div>
      <div className="hm-note">{note}</div>
    </div>
  )
}
