import React, { useState, useEffect, useRef } from 'react'
import { useStore } from '../store'

const MODES = [
  { label: 'FOCUS', key: 'focus', secs: 1500 },
  { label: 'SHORT', key: 'short', secs: 300 },
  { label: 'LONG',  key: 'long',  secs: 900 },
  { label: 'FREE',  key: 'free',  secs: 0 },
]
const CIRC = 515.2

export function Timer({ toast }) {
  const addSession = useStore(s => s.addSession)
  const sessions   = useStore(s => s.sessions)
  const totalSecs  = useStore(s => s.totalSecs)

  const [mode, setMode]   = useState('focus')
  const [max, setMax]     = useState(1500)
  const [secs, setSecs]   = useState(1500)
  const [running, setRun] = useState(false)
  const [pomo, setPomo]   = useState(0)
  const iRef = useRef(null)

  const fmt = s => {
    if (mode === 'free') {
      const h = Math.floor(s/3600), m = Math.floor((s%3600)/60), sec = s%60
      return h > 0
        ? `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`
        : `${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`
    }
    return `${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`
  }

  useEffect(() => {
    if (!running) { clearInterval(iRef.current); return }
    iRef.current = setInterval(() => {
      setSecs(prev => {
        if (mode === 'free') return prev + 1
        if (prev <= 1) {
          clearInterval(iRef.current); setRun(false)
          setPomo(p => (p + 1) % 5)
          addSession(max)
          toast?.('SESSION COMPLETE! 🎉')
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(iRef.current)
  }, [running, mode, max])

  const switchMode = (m) => {
    setRun(false); setMode(m.key)
    if (m.secs > 0) { setMax(m.secs); setSecs(m.secs) }
  }

  const start = () => setRun(true)
  const pause = () => setRun(false)
  const reset = () => {
    setRun(false)
    if (mode !== 'free' && secs < max - 5) addSession(max - secs)
    setSecs(mode === 'free' ? 0 : max)
  }

  const pct    = mode === 'free' ? 1 : max > 0 ? secs / max : 1
  const offset = CIRC * (1 - pct)
  const color  = pct < .25 ? 'var(--accent2)' : pct < .5 ? 'var(--accent4)' : 'var(--accent)'
  const h = Math.floor(totalSecs/3600), mn = Math.floor((totalSecs%3600)/60)

  return (
    <div className="timer-panel">
      <div className="ph"><div className="ph-l"><div className="ph-dot"/>SESSION TIMER</div></div>

      <div className="timer-modes">
        {MODES.map(m => (
          <button key={m.key} className={`tm-btn${mode === m.key ? ' active' : ''}`}
            onClick={() => switchMode(m)}>{m.label}</button>
        ))}
      </div>

      <div className="timer-ring-wrap">
        <div style={{ position:'relative', width:190, height:190 }}>
          <svg className="tsvg" width="190" height="190" viewBox="0 0 190 190">
            <circle className="tr-glow" cx="95" cy="95" r="82"/>
            <circle className="tr-bg"   cx="95" cy="95" r="82"/>
            <circle className="tr-fill" cx="95" cy="95" r="82"
              strokeDasharray={CIRC} strokeDashoffset={offset}
              style={{ stroke: color, transition:'stroke-dashoffset .6s linear,stroke .4s' }}/>
          </svg>
          <div className="timer-center">
            <div className="timer-num" style={{ color }}>{fmt(secs)}</div>
            <div className="timer-mode-lbl">{mode.toUpperCase()}</div>
            <div className="timer-pct">{Math.round(pct * 100)}%</div>
          </div>
        </div>
      </div>

      <div className="pomo-wrap">
        {[0,1,2,3].map(i => (
          <div key={i} className={`pomo-d${i < pomo ? ' done' : ''}`}
            onClick={() => setPomo(i < pomo ? i : i + 1)} />
        ))}
      </div>

      <div className="timer-btns">
        <button className="tbtn g" onClick={start}>▶ START</button>
        <button className="tbtn"   onClick={pause}>⏸ PAUSE</button>
        <button className="tbtn r" onClick={reset}>↺ RESET</button>
      </div>
      <div className="sess-row">SESSIONS: <b>{sessions}</b> | TOTAL: <b>{h}h {mn}m</b></div>
    </div>
  )
}
