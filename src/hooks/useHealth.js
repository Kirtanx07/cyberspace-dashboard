import { useState, useEffect, useRef, useCallback } from 'react'

export function useHealth() {
  const [data, setData] = useState({ net: '—', latency: null, online: navigator.onLine })
  const sessionStart = useRef(Date.now())

  const check = useCallback(async () => {
    if (!navigator.onLine) { setData({ net: 'OFFLINE', latency: null, online: false }); return }
    try {
      const t = performance.now()
      await fetch('https://www.cloudflare.com/cdn-cgi/trace?t=' + Date.now(), { cache: 'no-store', signal: AbortSignal.timeout(5000) })
      const ms = Math.round(performance.now() - t)
      const label = ms < 150 ? 'FAST' : ms < 400 ? 'GOOD' : ms < 800 ? 'SLOW' : 'POOR'
      setData({ net: label, latency: ms, online: true })
    } catch {
      setData({ net: 'ERROR', latency: null, online: false })
    }
  }, [])

  useEffect(() => {
    check()
    const id = setInterval(check, 30000)
    const on  = () => check()
    const off = () => setData({ net: 'OFFLINE', latency: null, online: false })
    window.addEventListener('online', on)
    window.addEventListener('offline', off)
    return () => { clearInterval(id); window.removeEventListener('online', on); window.removeEventListener('offline', off) }
  }, [check])

  return { ...data, refresh: check, sessionStart: sessionStart.current }
}
