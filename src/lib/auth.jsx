import React, { createContext, useContext } from 'react'
import { useUser, useClerk } from '@clerk/clerk-react'

export const GRAD_COLORS = [
  'linear-gradient(135deg,#00d4ff,#00ff88)',
  'linear-gradient(135deg,#bf00ff,#00d4ff)',
  'linear-gradient(135deg,#ffaa00,#ff2d55)',
  'linear-gradient(135deg,#00ff88,#ffaa00)',
  'linear-gradient(135deg,#ff2d55,#bf00ff)',
]

const AuthCtx = createContext(null)

export function AuthProvider({ children }) {
  const { signOut } = useClerk()
  return (
    <AuthCtx.Provider value={{ logout: () => signOut(), updateProfile: () => {} }}>
      {children}
    </AuthCtx.Provider>
  )
}

export function useAuth() {
  const { user, isSignedIn, isLoaded } = useUser()
  const ctx = useContext(AuthCtx)
  return {
    loading: !isLoaded,
    user: isSignedIn ? {
      username:    user.username || user.primaryEmailAddress?.emailAddress?.split('@')[0] || user.id,
      displayname: user.fullName || user.firstName || user.username || 'User',
      avatarColor: GRAD_COLORS[0],
    } : null,
    logout:        ctx?.logout        ?? (() => {}),
    updateProfile: ctx?.updateProfile ?? (() => {}),
  }
}
