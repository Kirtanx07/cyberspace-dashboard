import { create } from 'zustand'

/**
 * Health Store
 * Used to track the status of the Supabase connection and other system health signals.
 */
export const useHealthStore = create((set) => ({
  isDbDown: false,
  lastChecked: null,
  setDbDown: (status) => set({ isDbDown: status, lastChecked: new Date().toISOString() }),
}))
