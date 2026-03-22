# CYBERSPACE v3 — Implementation Guide

## RUN IN 3 COMMANDS

```bash
# 1. Enter folder
cd cyberspace-v3

# 2. Install
npm install

# 3. Run
npm run dev
```
Open → http://localhost:3000

---

## PROJECT STRUCTURE

```
cyberspace-v3/
├── index.html                   HTML entry (fonts loaded here)
├── vite.config.js               Dev server on port 3000
├── package.json                 React 18 + Vite 5 + Zustand
├── .gitignore
│
└── src/
    ├── main.jsx                 Entry: wraps App in AuthProvider
    ├── App.jsx                  Root: tabs, modals, layout
    ├── index.css                ALL CSS — exact v3 variables and styles
    │
    ├── store/index.js           Zustand state (localStorage per user)
    │                            resources · todos · notes · timer · accent · dashName
    │
    ├── lib/
    │   └── auth.jsx             Local auth context (register/login/logout)
    │                            → swap with Clerk for production
    │
    ├── hooks/
    │   ├── useHealth.js         Network speed + online/offline monitor
    │   ├── useClock.js          Live clock (1s interval)
    │   └── useNotification.js   Toast state hook
    │
    └── components/
        ├── AuthScreen.jsx       Login / Register / OAuth screen
        ├── TopBar.jsx           Header: logo, rename, pills, clock, user badge
        ├── Timer.jsx            190px ring, Focus/Short/Long/Free, Pomodoro
        ├── SystemHealth.jsx     Network/Latency/Uptime/Resources panel
        ├── DashboardWidgets.jsx ResourceHub, QuickLinks, TaskBoard,
        │                        ConfigPanel, AddResourceModal,
        │                        AddInternshipModal, ProfileModal, Toast
        ├── InternshipsTab.jsx   Full internship tracker (10 pre-loaded)
        ├── ImportTab.jsx        Drag-drop JSON + AI prompt + format ref
        └── ProductionTab.jsx    10-step deployment guide
```

---

## FEATURES (exact match to v3 standalone)

| Feature | Details |
|---|---|
| 🔐 Auth | Sign in / Create account / Google & GitHub OAuth (simulated locally) |
| ✎ Rename Dashboard | Click name in topbar or via user dropdown → Edit Profile |
| ⚙ Edit Profile | Display name, dashboard name, password, avatar color |
| ⏱ Timer | 190px ring, Focus/Short/Long/Free, Pomodoro diamonds, session tracking |
| 🖥 System Health | Network (Fast/Good/Slow/Poor), Latency ms, Uptime, Resources count |
| 🌐 Live Network | Real-time status pill, latency display, auto-refresh every 30s |
| 🔗 Resource Hub | Search, category tabs, card grid, pinned/high priority sorting |
| ⚡ Quick Access | Sidebar with pinned + high-priority resources |
| ✅ Mission Log | H/M/L priority tasks, progress bar, auto-save per user |
| 📝 Scratchpad | Auto-saved notes, accent colors, scanline/grid toggles |
| 💼 Internships | 10 govt internships, status tracker, search/filter/sort |
| ↑ Import | Drag-drop JSON, paste JSON, AI prompt, format reference |
| 🚀 Production | 10-step guide: Supabase + Clerk + Vercel |
| 🎨 Accent Colors | Cyan / Green / Purple / Amber / Red |
| ↓ Export | Downloads all data as JSON (named after dashboard) |
| 👤 Per-user data | Each account has isolated data in localStorage |

---

## DATA PERSISTS PER USER

Data is stored in `localStorage` under the key `cs-data-{username}`.
Each account has its own isolated workspace. No data leaks between accounts.

When you sign out and sign back in, all your resources, todos, notes,
timer sessions, accent color, and dashboard name are restored exactly.

---

## GO PRODUCTION (Multi-user + Cloud)

### Quick overview (full steps in the app → 🚀 GO PRODUCTION tab)

**Step 1 — Supabase (database)**
```bash
# https://supabase.com → New Project
npm install @supabase/supabase-js
# Run the SQL schema from the Production tab in the app
```

**Step 2 — Clerk (auth)**
```bash
# https://clerk.dev → Create app → enable Google + GitHub
npm install @clerk/clerk-react
```

**Step 3 — .env**
```
VITE_CLERK_KEY=pk_test_your_key
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON=eyJhbGc...
```

**Step 4 — Replace local auth with Clerk**

In `src/main.jsx`:
```jsx
import { ClerkProvider } from '@clerk/clerk-react'
// Wrap <App /> with <ClerkProvider publishableKey={...}>
```

In `src/lib/auth.jsx` — replace the entire file with:
```jsx
import { SignIn, useUser, useAuth as useClerkAuth } from '@clerk/clerk-react'
import React, { createContext, useContext } from 'react'
const AuthCtx = createContext(null)
export function AuthProvider({ children }) {
  const { signOut } = useClerkAuth()
  return <AuthCtx.Provider value={{ logout: signOut }}>{children}</AuthCtx.Provider>
}
export const useAuth = () => {
  const { user, isSignedIn, isLoaded } = useUser()
  const { logout } = useContext(AuthCtx)
  return { user: isSignedIn ? { username: user.username || user.id, displayname: user.fullName, avatarColor: null } : null, loading: !isLoaded, logout }
}
export function AuthScreen() {
  return <div style={{ height:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'var(--bg)' }}><SignIn routing="hash" /></div>
}
```

**Step 5 — Deploy**
```bash
npx vercel   # or connect GitHub → vercel.com
```

---

## JSON IMPORT FORMAT

```json
{
  "resources": [
    {
      "type": "link|tool|pdf|roadmap|internship|course|note|repo|other",
      "title": "Resource Name (required)",
      "url": "https://...",
      "description": "1-2 sentences",
      "category": "Category",
      "tags": ["tag1", "tag2"],
      "priority": "normal|high|pinned",
      "status": "none|not_applied|applied|shortlisted|offered|rejected",
      "meta": {}
    },
    {
      "type": "internship",
      "title": "Internship Name",
      "category": "Internships",
      "priority": "high",
      "status": "not_applied",
      "meta": {
        "organiser": "Ministry Name",
        "stipend": "₹10,000/month",
        "duration": "2–3 months",
        "eligibility": "B.Tech / Any UG",
        "skills": ["Python", "Research"],
        "deadline": "Rolling",
        "sector": "Technology",
        "location": "Delhi",
        "applyLink": "https://..."
      }
    }
  ]
}
```

---

## TROUBLESHOOTING

| Problem | Fix |
|---|---|
| `node: command not found` | Install Node.js 18+ from nodejs.org |
| Port 3000 in use | Change to `port: 3001` in vite.config.js |
| Blank screen | Open DevTools (F12) → Console → check errors |
| Fonts look wrong | Check internet — Google Fonts loads from CDN |
| Data disappeared | Check DevTools → Application → Local Storage → `cs-data-{username}` |
| Import fails | Ensure `tags` is array `[]`, `title` is non-empty |
| Build fails | Delete node_modules, run `npm install`, then `npm run build` |

---

## STANDALONE VERSION

The file `cyberspace-v3-STANDALONE.html` is the exact same dashboard
as a single HTML file — no install needed. Just double-click to open
in any browser. Same features, same data (different localStorage key).

*CYBERSPACE v3 — Built with ⚡*
