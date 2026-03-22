import React, { useState } from 'react'
import { useStore } from '../store'

const TI = { link:'🔗', tool:'🛠', pdf:'📄', roadmap:'🗺', internship:'💼', course:'🎓', repo:'⚡', note:'📝', other:'📦', book:'📚' }

// ── RESOURCE HUB ─────────────────────────────────────────────
export function ResourceHub({ onOpenAdd }) {
  const resources    = useStore(s => s.resources)
  const activeCat    = useStore(s => s.activeCat)
  const setActiveCat = useStore(s => s.setActiveCat)
  const deleteResource = useStore(s => s.deleteResource)
  const [q, setQ] = useState('')

  const cats = ['ALL', ...new Set(resources.map(r => (r.category || 'General').toUpperCase()))]
  const list = resources
    .filter(r => {
      const mc = activeCat === 'ALL' || (r.category || 'General').toUpperCase() === activeCat
      const mq = !q || [r.title, r.description, r.category, ...(r.tags||[])].join(' ').toLowerCase().includes(q.toLowerCase())
      return mc && mq
    })
    .sort((a,b) => ({pinned:0,high:1,normal:2}[a.priority||'normal']||2) - ({pinned:0,high:1,normal:2}[b.priority||'normal']||2))

  return (
    <div className="center-panel">
      <div className="ph">
        <div className="ph-l"><div className="ph-dot"/>RESOURCE HUB</div>
        <div style={{ display:'flex', gap:6 }}>
          <PhBtn onClick={() => document.querySelector('[data-tab="import"]')?.click()}>↑ IMPORT</PhBtn>
          <PhBtn onClick={onOpenAdd}>+ ADD</PhBtn>
        </div>
      </div>

      <div className="res-search">
        <span style={{ color:'var(--accent)' }}>⌕</span>
        <input placeholder="SEARCH RESOURCES..." value={q} onChange={e => setQ(e.target.value)} />
      </div>

      <div className="cat-row">
        {cats.map(c => (
          <button key={c} className={`cat-btn${activeCat === c ? ' active' : ''}`}
            onClick={() => setActiveCat(c)}>{c}</button>
        ))}
      </div>

      <div className="res-grid">
        {list.map(r => (
          <div key={r.id} className={`res-card${r.priority === 'pinned' ? ' pinned' : r.priority === 'high' ? ' high' : ''}`}>
            <div className="rc-type">{TI[r.type]||'📦'} {(r.type||'other').toUpperCase()}</div>
            <div className="rc-title">{r.priority === 'pinned' ? '📌 ' : ''}{r.title}</div>
            <div className="rc-desc">{r.description}</div>
            {(r.tags||[]).length > 0 && <div className="rc-tags">{r.tags.slice(0,3).map(t => <span key={t} className="rc-tag">{t}</span>)}</div>}
            <div className="rc-actions">
              {r.url && <a className="rc-btn" href={r.url} target="_blank" rel="noopener noreferrer">OPEN ↗</a>}
              <button className="rc-btn del" onClick={() => deleteResource(r.id)}>DEL</button>
            </div>
          </div>
        ))}
        <div className="add-card" onClick={onOpenAdd}>
          <div style={{ fontSize:'1.5rem', opacity:.4 }}>+</div>
          ADD RESOURCE
        </div>
      </div>
    </div>
  )
}

function PhBtn({ onClick, children }) {
  return (
    <button onClick={onClick} style={{ fontFamily:'var(--display)', fontSize:'.45rem', letterSpacing:1, padding:'2px 8px', border:'1px solid var(--border)', background:'none', color:'var(--text3)', cursor:'pointer', transition:'all .15s' }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent)' }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text3)' }}>
      {children}
    </button>
  )
}

// ── QUICK LINKS ───────────────────────────────────────────────
export function QuickLinks({ onOpenAdd }) {
  const resources = useStore(s => s.resources)
  const pinned = resources.filter(r => r.priority === 'pinned' || r.priority === 'high').slice(0, 10)
  const list = pinned.length ? pinned : resources.slice(0, 8)

  return (
    <div className="ql-panel">
      <div className="ph">
        <div className="ph-l"><div className="ph-dot"/>QUICK ACCESS</div>
        <button style={{ fontFamily:'var(--display)', fontSize:'.45rem', letterSpacing:1, padding:'2px 8px', border:'1px solid var(--border)', background:'none', color:'var(--text3)', cursor:'pointer' }}
          onClick={onOpenAdd}>+ ADD</button>
      </div>
      {list.map(r => (
        <a key={r.id} className="ql-item" href={r.url || '#'} target={r.url ? '_blank' : '_self'} rel="noopener noreferrer">
          <div className="ql-icon">{TI[r.type]||'📦'}</div>
          <div style={{ flex:1, minWidth:0 }}>
            <div className="ql-name">{r.title}</div>
            <div className="ql-sub">{(r.category||'').toUpperCase()}</div>
          </div>
        </a>
      ))}
    </div>
  )
}

// ── TASK BOARD ────────────────────────────────────────────────
export function TaskBoard() {
  const todos      = useStore(s => s.todos)
  const addTodo    = useStore(s => s.addTodo)
  const toggleTodo = useStore(s => s.toggleTodo)
  const deleteTodo = useStore(s => s.deleteTodo)
  const [text, setText] = useState('')
  const [pri, setPri]   = useState('h')

  const done  = todos.filter(t => t.done).length
  const total = todos.length
  const pct   = total ? Math.round(done / total * 100) : 0

  const add = () => { if (!text.trim()) return; addTodo(text.trim(), pri); setText('') }

  return (
    <div className="tasks-panel">
      <div className="ph">
        <div className="ph-l"><div className="ph-dot"/>MISSION LOG</div>
        <span style={{ fontFamily:'var(--mono)', fontSize:'.6rem', color:'var(--text3)' }}>{done}/{total}</span>
      </div>

      <div className="pri-row">
        {[['h','ah'],['m','am'],['l','al']].map(([p, cls]) => (
          <button key={p} className={`pr-btn${pri === p ? ' '+cls : ''}`}
            onClick={() => setPri(p)}>{p === 'h' ? 'HIGH' : p === 'm' ? 'MED' : 'LOW'}</button>
        ))}
      </div>

      <div className="task-inp-row">
        <input className="task-inp" placeholder="NEW TASK..." value={text}
          onChange={e => setText(e.target.value)} onKeyDown={e => e.key === 'Enter' && add()} />
        <button className="tbtn" style={{ padding:'6px 12px', fontSize:'.5rem', clipPath:'none' }} onClick={add}>ADD</button>
      </div>

      <div className="prog-bar"><div className="prog-fill" style={{ width: pct+'%' }} /></div>
      <div className="prog-txt">{done} / {total} COMPLETE</div>

      {todos.map(t => (
        <div key={t.id} className="task-item">
          <div className={`tpri-bar ${t.priority}`} />
          <div className={`tchk${t.done ? ' done' : ''}`} onClick={() => toggleTodo(t.id)} />
          <div className={`ttxt${t.done ? ' done' : ''}`} onClick={() => toggleTodo(t.id)}>{t.text}</div>
          <button className="tdel" onClick={() => deleteTodo(t.id)}>✕</button>
        </div>
      ))}
    </div>
  )
}

// ── CONFIG / SCRATCHPAD ───────────────────────────────────────
export function ConfigPanel({ onExport, onReset }) {
  const notes    = useStore(s => s.notes)
  const setNotes = useStore(s => s.setNotes)
  const setAccent = useStore(s => s.setAccent)
  const [sl, setSl] = useState(true)
  const [gr, setGr] = useState(true)

  return (
    <div className="cfg-panel">
      <div className="ph"><div className="ph-l"><div className="ph-dot"/>SCRATCHPAD</div></div>
      <textarea className="scratch" placeholder="// notes, commands, ideas..."
        value={notes} onChange={e => setNotes(e.target.value)} />

      <div className="div"/>
      <div style={{ fontFamily:'var(--mono)', fontSize:'.56rem', color:'var(--text3)', letterSpacing:2, marginBottom:5 }}>ACCENT COLOR</div>
      <div className="swatches">
        {['#00d4ff','#00ff88','#bf00ff','#ffaa00','#ff2d55'].map(c => (
          <div key={c} className="sw" style={{ background:c, boxShadow:`0 0 7px ${c}` }} onClick={() => setAccent(c)} />
        ))}
      </div>

      <div className="cfg-row" style={{ marginTop:8 }}>
        <span>Scan Lines</span>
        <button className={`tgl${sl ? ' on' : ''}`} onClick={() => { setSl(v => !v); document.body.classList.toggle('nsl', sl) }} />
      </div>
      <div className="cfg-row">
        <span>Grid BG</span>
        <button className={`tgl${gr ? ' on' : ''}`} onClick={() => { setGr(v => !v); document.body.classList.toggle('ngr', gr) }} />
      </div>

      <div className="action-row">
        <button className="act-btn" onClick={onExport}>↓ EXPORT</button>
        <button className="act-btn r" onClick={onReset}>RESET ALL</button>
      </div>
    </div>
  )
}

// ── ADD RESOURCE MODAL ────────────────────────────────────────
export function AddResourceModal({ open, onClose, toast }) {
  const addResource = useStore(s => s.addResource)
  const [f, setF] = useState({ type:'link', title:'', url:'', description:'', category:'', tags:'', priority:'normal' })
  const set = (k, v) => setF(p => ({ ...p, [k]: v }))

  const save = () => {
    if (!f.title.trim()) { toast?.('TITLE REQUIRED', 'err'); return }
    addResource({ ...f, tags: f.tags.split(',').map(t => t.trim()).filter(Boolean), category: f.category || 'General' })
    toast?.('RESOURCE SAVED!')
    onClose()
    setF({ type:'link', title:'', url:'', description:'', category:'', tags:'', priority:'normal' })
  }

  if (!open) return null
  return (
    <div className="modal-bg open" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="mhdr"><span className="mtitle">ADD RESOURCE</span><button className="mx" onClick={onClose}>✕</button></div>
        <div className="fg"><label className="fl">TYPE</label>
          <select className="fsel" value={f.type} onChange={e => set('type', e.target.value)}>
            {['link','tool','pdf','roadmap','internship','course','repo','note','other'].map(t => (
              <option key={t} value={t}>{TI[t]} {t.charAt(0).toUpperCase()+t.slice(1)}</option>
            ))}
          </select>
        </div>
        <div className="fg"><label className="fl">TITLE *</label><input className="fi" placeholder="Resource name..." value={f.title} onChange={e => set('title', e.target.value)} /></div>
        <div className="fg"><label className="fl">URL</label><input className="fi" placeholder="https://..." value={f.url} onChange={e => set('url', e.target.value)} /></div>
        <div className="fg"><label className="fl">DESCRIPTION</label><textarea className="fta" placeholder="Brief description..." value={f.description} onChange={e => set('description', e.target.value)} /></div>
        <div className="f2">
          <div className="fg"><label className="fl">CATEGORY</label><input className="fi" placeholder="e.g. Cybersecurity" value={f.category} onChange={e => set('category', e.target.value)} /></div>
          <div className="fg"><label className="fl">PRIORITY</label>
            <select className="fsel" value={f.priority} onChange={e => set('priority', e.target.value)}>
              <option value="normal">Normal</option><option value="high">High</option><option value="pinned">Pinned</option>
            </select>
          </div>
        </div>
        <div className="fg"><label className="fl">TAGS (comma separated)</label><input className="fi" placeholder="free, important, beginner" value={f.tags} onChange={e => set('tags', e.target.value)} /></div>
        <div className="mfoot">
          <button className="mb-btn c" onClick={onClose}>CANCEL</button>
          <button className="mb-btn s" onClick={save}>SAVE RESOURCE</button>
        </div>
      </div>
    </div>
  )
}

// ── ADD INTERNSHIP MODAL ──────────────────────────────────────
export function AddInternshipModal({ open, onClose, toast }) {
  const addResource = useStore(s => s.addResource)
  const [f, setF] = useState({ title:'', org:'', stipend:'', dur:'', deadline:'', sector:'', loc:'', url:'', elig:'', skills:'', desc:'', tags:'', priority:'normal' })
  const set = (k, v) => setF(p => ({ ...p, [k]: v }))

  const save = () => {
    if (!f.title.trim()) { toast?.('TITLE REQUIRED', 'err'); return }
    addResource({
      type:'internship', title:f.title, url:f.url, description:f.desc, category:'Internships',
      tags: f.tags.split(',').map(t => t.trim()).filter(Boolean),
      priority: f.priority, status:'not_applied',
      meta:{ organiser:f.org, stipend:f.stipend, duration:f.dur, eligibility:f.elig,
        skills: f.skills.split(',').map(s => s.trim()).filter(Boolean),
        deadline:f.deadline, sector:f.sector, location:f.loc, applyLink:f.url }
    })
    toast?.('INTERNSHIP ADDED!')
    onClose()
    setF({ title:'', org:'', stipend:'', dur:'', deadline:'', sector:'', loc:'', url:'', elig:'', skills:'', desc:'', tags:'', priority:'normal' })
  }

  if (!open) return null
  const F = ({ label, k, placeholder }) => (
    <div className="fg"><label className="fl">{label}</label><input className="fi" placeholder={placeholder||''} value={f[k]} onChange={e => set(k, e.target.value)} /></div>
  )

  return (
    <div className="modal-bg open" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ width:540 }}>
        <div className="mhdr"><span className="mtitle">ADD INTERNSHIP</span><button className="mx" onClick={onClose}>✕</button></div>
        <div className="f2">
          <F label="TITLE *" k="title"/><F label="ORGANISER" k="org"/>
          <F label="STIPEND" k="stipend" placeholder="₹10,000/month"/>
          <F label="DURATION" k="dur" placeholder="2–3 months"/>
          <F label="DEADLINE" k="deadline" placeholder="Rolling"/>
          <F label="SECTOR" k="sector" placeholder="Technology"/>
          <F label="LOCATION" k="loc" placeholder="Delhi / Remote"/>
          <div className="fg"><label className="fl">PRIORITY</label>
            <select className="fsel" value={f.priority} onChange={e => set('priority', e.target.value)}>
              <option value="normal">Normal</option><option value="high">High</option><option value="pinned">Pinned</option>
            </select>
          </div>
        </div>
        <F label="APPLY URL" k="url" placeholder="https://..."/>
        <F label="ELIGIBILITY" k="elig"/>
        <F label="SKILLS (comma separated)" k="skills"/>
        <div className="fg"><label className="fl">DESCRIPTION</label><textarea className="fta" style={{ minHeight:48 }} value={f.desc} onChange={e => set('desc', e.target.value)} /></div>
        <F label="TAGS" k="tags" placeholder="government, paid, tech"/>
        <div className="mfoot">
          <button className="mb-btn c" onClick={onClose}>CANCEL</button>
          <button className="mb-btn s" onClick={save}>SAVE INTERNSHIP</button>
        </div>
      </div>
    </div>
  )
}

// ── PROFILE MODAL ─────────────────────────────────────────────
export function ProfileModal({ open, onClose, user, onUpdate, toast }) {
  const dashName   = useStore(s => s.dashName)
  const setDashName = useStore(s => s.setDashName)
  const [name, setName]         = useState('')
  const [dn, setDn]             = useState('')
  const [pass, setPass]         = useState('')
  const [avIdx, setAvIdx]       = useState(0)
  const GRAD = ['linear-gradient(135deg,#00d4ff,#00ff88)','linear-gradient(135deg,#bf00ff,#00d4ff)','linear-gradient(135deg,#ffaa00,#ff2d55)','linear-gradient(135deg,#00ff88,#ffaa00)','linear-gradient(135deg,#ff2d55,#bf00ff)']

  React.useEffect(() => {
    if (open) { setName(user?.displayname||''); setDn(dashName); setPass('') }
  }, [open])

  const save = () => {
    if (name.trim()) onUpdate?.({ displayname: name.trim() })
    if (dn.trim()) setDashName(dn.trim())
    if (pass.length >= 6) onUpdate?.({ password: pass })
    toast?.('PROFILE UPDATED')
    onClose()
  }

  const getInit = n => n.split(' ').map(w => w[0]).join('').toUpperCase().slice(0,2) || '??'

  if (!open) return null
  return (
    <div className="modal-bg profile-modal open" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ width:400 }}>
        <div className="mhdr"><span className="mtitle">EDIT PROFILE</span><button className="mx" onClick={onClose}>✕</button></div>
        <div className="pm-avatar-wrap">
          <div className="pm-avatar" style={{ background: GRAD[avIdx] }}>{getInit(name || user?.displayname || user?.username || '')}</div>
          <div className="pm-change-avatar" onClick={() => setAvIdx(v => (v+1)%GRAD.length)}>↻ CHANGE AVATAR COLOR</div>
        </div>
        <div className="fg"><label className="fl">DISPLAY NAME</label><input className="fi" placeholder="Your Name" value={name} onChange={e => setName(e.target.value)} /></div>
        <div className="fg"><label className="fl">USERNAME</label><input className="fi" value={user?.username||''} readOnly style={{ color:'var(--text3)' }} /></div>
        <div className="fg">
          <label className="fl">DASHBOARD NAME</label>
          <input className="fi" placeholder="My Workspace" value={dn} onChange={e => setDn(e.target.value)} />
          <div className="rename-hint">↳ This is the name shown in the top bar</div>
        </div>
        <div className="fg"><label className="fl">NEW PASSWORD (leave blank to keep)</label><input className="fi" type="password" placeholder="New password..." value={pass} onChange={e => setPass(e.target.value)} /></div>
        <div className="mfoot">
          <button className="mb-btn c" onClick={onClose}>CANCEL</button>
          <button className="mb-btn s" onClick={save}>SAVE PROFILE</button>
        </div>
      </div>
    </div>
  )
}

// ── TOAST ─────────────────────────────────────────────────────
export function Toast({ notif }) {
  return (
    <div className={`toast${notif.show ? ' show' : ''}${notif.type === 'err' ? ' err' : ''}`}>
      // {notif.msg}
    </div>
  )
}
