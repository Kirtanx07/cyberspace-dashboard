import React from 'react'
import { SignIn } from '@clerk/clerk-react'

export function AuthScreen() {
  return (
    <div style={{
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--bg)',
      flexDirection: 'column',
      gap: 0,
      position: 'relative',
      zIndex: 1,
    }}>
      {/* Cyber scanline + grid from body CSS still shows behind */}

      {/* Logo */}
      <div style={{
        fontFamily: 'var(--display)',
        fontSize: '2rem',
        fontWeight: 900,
        color: 'var(--accent)',
        textShadow: 'var(--glow)',
        letterSpacing: 6,
        marginBottom: 6,
        animation: 'glitch 4s infinite',
      }}>
        CYBER<span style={{ color: 'var(--accent2)', textShadow: 'var(--glow2)' }}>SPACE</span>
      </div>

      <div style={{
        fontFamily: 'var(--mono)',
        fontSize: '.7rem',
        color: 'var(--text3)',
        letterSpacing: 4,
        marginBottom: 32,
      }}>
        // PERSONAL MISSION CONTROL
      </div>

      {/* Clerk handles everything — sign in, sign up, OAuth */}
      <SignIn
        routing="hash"
        signUpUrl="#/sign-up"
        appearance={{
          variables: {
            colorPrimary: '#00d4ff',
            colorBackground: '#040f15',
            colorInputBackground: '#061420',
            colorInputText: '#b8e4f5',
            colorText: '#b8e4f5',
            colorTextSecondary: '#6a9ab5',
            colorDanger: '#ff2d55',
            colorSuccess: '#00ff88',
            borderRadius: '2px',
            fontFamily: "'Share Tech Mono', monospace",
          },
          elements: {
            card: {
              border: '1px solid rgba(0,212,255,.4)',
              boxShadow: '0 0 30px rgba(0,212,255,.15)',
              background: '#040f15',
            },
            headerTitle: {
              fontFamily: "'Orbitron', monospace",
              letterSpacing: 3,
              color: '#00d4ff',
            },
            formButtonPrimary: {
              background: 'rgba(0,212,255,.15)',
              border: '1px solid #00d4ff',
              color: '#00d4ff',
              fontFamily: "'Orbitron', monospace",
              letterSpacing: 2,
              fontSize: '.7rem',
            },
            footerActionLink: {
              color: '#00d4ff',
            },
          },
        }}
      />
    </div>
  )
}
