import React from 'react'
import ReactDOM from 'react-dom/client'
import { ClerkProvider } from '@clerk/clerk-react'
import { AuthProvider } from './lib/auth'
import App from './App.jsx'
import './index.css'
import './overrides.css'

const CLERK_KEY = import.meta.env.VITE_CLERK_KEY

if (!CLERK_KEY) {
  document.getElementById('root').innerHTML = `
    <div style="height:100vh;display:flex;align-items:center;justify-content:center;
      background:#020c10;color:#ff2d55;font-family:monospace;font-size:14px;
      flex-direction:column;gap:12px;text-align:center;padding:20px">
      <div style="font-size:1.5rem">⚠ MISSING ENV VAR</div>
      <div>VITE_CLERK_KEY is not set in your .env file</div>
      <div style="color:#6a9ab5;font-size:12px">
        1. Check your .env file is in the project root (next to package.json)<br/>
        2. Make sure it contains: VITE_CLERK_KEY=pk_test_...<br/>
        3. Restart the dev server: Ctrl+C then npm run dev
      </div>
    </div>
  `
} else {
  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <ClerkProvider publishableKey={CLERK_KEY}>
        <AuthProvider>
          <App />
        </AuthProvider>
      </ClerkProvider>
    </React.StrictMode>
  )
}
