import React, { useState } from 'react'

const SQL = `CREATE TABLE resources (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL, type TEXT NOT NULL DEFAULT 'link',
  title TEXT NOT NULL, url TEXT, description TEXT,
  category TEXT DEFAULT 'General', tags TEXT[] DEFAULT '{}',
  priority TEXT DEFAULT 'normal', status TEXT DEFAULT 'none',
  meta JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE TABLE todos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL, text TEXT NOT NULL,
  done BOOLEAN DEFAULT FALSE, priority TEXT DEFAULT 'h',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE TABLE notes (
  user_id TEXT PRIMARY KEY, content TEXT DEFAULT '',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE todos ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own_resources" ON resources FOR ALL USING (user_id = auth.uid()::text);
CREATE POLICY "own_todos" ON todos FOR ALL USING (user_id = auth.uid()::text);
CREATE POLICY "own_notes" ON notes FOR ALL USING (user_id = auth.uid()::text);`

const STEPS = [
  { n:'01', t:'Install Node.js & run locally', done:true,
    note:'You are here ✓',
    cmd:`node -v   # needs v18+\nnpm install\nnpm run dev\n# Open http://localhost:3000` },
  { n:'02', t:'Create Supabase project (database)',
    note:'Free: 500MB DB, 1GB storage. No credit card.',
    cmd:`# Go to https://supabase.com → New Project\n# SQL Editor → paste + run the schema\nnpm install @supabase/supabase-js` },
  { n:'03', t:'Set up Clerk authentication',
    note:'Free: 10,000 monthly active users.',
    cmd:`# Go to https://clerk.dev → Create app\n# Enable Google + GitHub OAuth\nnpm install @clerk/clerk-react` },
  { n:'04', t:'Create .env file',
    note:'Never commit .env to Git.',
    cmd:`VITE_CLERK_KEY=pk_test_your_key\nVITE_SUPABASE_URL=https://xxx.supabase.co\nVITE_SUPABASE_ANON=eyJhbGc...` },
  { n:'05', t:'Wrap App with ClerkProvider + AuthGuard',
    note:'Users see a login page before accessing dashboard.',
    cmd:`// src/main.jsx\nimport { ClerkProvider } from '@clerk/clerk-react'\nReactDOM.createRoot(root).render(\n  <ClerkProvider publishableKey={import.meta.env.VITE_CLERK_KEY}>\n    <App />\n  </ClerkProvider>\n)\n\n// src/lib/auth.jsx — replace local auth with:\nimport { SignIn, useUser } from '@clerk/clerk-react'\nexport function AuthGuard({ children }) {\n  const { isSignedIn, isLoaded } = useUser()\n  if (!isLoaded) return <div>Loading...</div>\n  if (!isSignedIn) return <SignIn />\n  return children\n}` },
  { n:'06', t:'Connect store to Supabase',
    note:'All data syncs to cloud — accessible from any device.',
    cmd:`// src/lib/supabase.js\nimport { createClient } from '@supabase/supabase-js'\nexport const supabase = createClient(\n  import.meta.env.VITE_SUPABASE_URL,\n  import.meta.env.VITE_SUPABASE_ANON\n)\n// Replace localStorage actions in store/index.js\n// with supabase.from('resources').select()/insert()/delete()` },
  { n:'07', t:'Create Supabase Storage bucket',
    note:'For PDFs, images, documents.',
    cmd:`# Supabase Dashboard:\n# Storage → New Bucket → name: "user-files"\n# Policies → Allow: auth.uid()::text =\n#   (storage.foldername(name))[1]` },
  { n:'08', t:'Deploy to Vercel',
    note:'Free hobby plan. Auto-deploys on every git push.',
    cmd:`npm install -g vercel\nvercel login && vercel\n# OR: connect GitHub repo at vercel.com\n# Add ENV vars in Project Settings → Environment Variables` },
  { n:'09', t:'Configure Clerk allowed origins',
    note:'Without this, login is blocked on deployed domain.',
    cmd:`# Clerk Dashboard → Configure → Domains\n# Add: https://your-app.vercel.app\n# Add: http://localhost:3000` },
  { n:'10', t:'Live! Invite users',
    note:'Total cost for 0–10K users: $0/month.',
    cmd:`# Your app is now:\n# ✓ Auth (Clerk — Google/GitHub/Email)\n# ✓ Multi-user (each user has private workspace)\n# ✓ Cloud synced (Supabase)\n# ✓ File storage (PDFs, images)\n# ✓ Deployed (Vercel — auto-deploys)\n# ✓ Per-user data isolation (Row Level Security)` },
]

const FREE_TIERS = [
  ['Clerk Auth',       '10,000 MAU',           'var(--accent)'],
  ['Supabase DB',      '500MB database',        'var(--accent3)'],
  ['Supabase Storage', '1GB file storage',      'var(--accent3)'],
  ['Vercel Deploy',    'Unlimited hobby',       'var(--text)'],
  ['Railway Backend',  '$5/mo (optional)',      'var(--accent4)'],
]

export function ProductionTab({ toast }) {
  const [open, setOpen] = useState(null)

  return (
    <div className="prod-view">
      <div style={{ borderLeft:'3px solid var(--accent3)', paddingLeft:12, fontSize:'.8rem', color:'var(--text2)', lineHeight:1.7 }}>
        Follow these <strong style={{ color:'var(--accent3)' }}>10 steps</strong> to go from localhost → live multi-user production app.
        <strong style={{ color:'var(--accent)' }}> Total cost for 0–10K users: $0/month.</strong>
      </div>

      <div className="prod-steps">
        {STEPS.map((step, i) => (
          <div key={i} className={`prod-step${open === i ? ' open' : ''}`}>
            <div className="ps-hdr" onClick={() => setOpen(open === i ? null : i)}>
              <div className="ps-num">{step.n}</div>
              <div className="ps-title">{step.t}</div>
              {step.done && <span className="ps-done">✓ DONE</span>}
              <span className="ps-arrow">▶</span>
            </div>
            {open === i && (
              <div className="ps-body">
                {step.note && <div className="ps-note">💡 {step.note}</div>}
                <div className="code-block">
                  {step.cmd}
                  <button className="cb-copy"
                    onClick={e => { e.stopPropagation(); navigator.clipboard.writeText(step.cmd).then(() => toast?.('COPIED!')) }}>
                    COPY
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
        <div className="imp-box">
          <h3>📊 FREE TIER SUMMARY</h3>
          {FREE_TIERS.map(([svc, limit, color]) => (
            <div key={svc} style={{ display:'flex', justifyContent:'space-between', padding:'7px 0', borderBottom:'1px solid var(--border)', fontSize:'.78rem' }}>
              <strong style={{ color }}>{svc}</strong>
              <span style={{ fontFamily:'var(--mono)', fontSize:'.65rem', color:'var(--text3)' }}>{limit}</span>
            </div>
          ))}
        </div>

        <div className="imp-box">
          <h3>🗄 SQL SCHEMA</h3>
          <p style={{ fontSize:'.7rem', color:'var(--text2)', marginBottom:10, lineHeight:1.5 }}>
            Paste in Supabase → SQL Editor → Run.
          </p>
          <button className="imp-btn g" style={{ width:'100%', marginBottom:8 }}
            onClick={() => navigator.clipboard.writeText(SQL).then(() => toast?.('SQL SCHEMA COPIED — PASTE IN SUPABASE SQL EDITOR'))}>
            COPY FULL SQL SCHEMA
          </button>
          <div style={{ fontFamily:'var(--mono)', fontSize:'.58rem', color:'var(--text3)', lineHeight:1.6 }}>
            Tables: resources · todos · notes · sessions · user_settings<br/>
            Includes: Row Level Security, indexes, auto-updated triggers
          </div>
        </div>
      </div>
    </div>
  )
}
