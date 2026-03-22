import { useState, useCallback, useRef } from 'react'
export function useNotification() {
  const [notif, setNotif] = useState({ msg: '', type: '', show: false })
  const t = useRef(null)
  const toast = useCallback((msg, type = '') => {
    clearTimeout(t.current)
    setNotif({ msg, type, show: true })
    t.current = setTimeout(() => setNotif(n => ({ ...n, show: false })), 2600)
  }, [])
  return { notif, toast }
}
