import { useState, useEffect } from 'react'
export function useClock() {
  const [now, setNow] = useState(new Date())
  useEffect(() => { const id = setInterval(() => setNow(new Date()), 1000); return () => clearInterval(id) }, [])
  return {
    timeStr: now.toLocaleTimeString('en-GB', { hour12: false }),
    dateStr: now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase(),
  }
}
