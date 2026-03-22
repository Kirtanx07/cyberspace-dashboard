import React, { useState } from 'react'
import { useStore } from '../store'
import { AddInternshipModal } from './DashboardWidgets'

const SC = {
  not_applied:{l:'NOT APPLIED',c:'sn'}, applied:{l:'APPLIED',c:'sa'},
  shortlisted:{l:'SHORTLISTED',c:'ss'}, interview:{l:'INTERVIEW',c:'si'},
  offered:{l:'OFFERED',c:'so'}, rejected:{l:'REJECTED',c:'sr'},
  withdrawn:{l:'WITHDRAWN',c:'sn'}, none:{l:'—',c:'sn'}
}

export function InternshipsTab({ toast }) {
  const resources      = useStore(s => s.resources)
  const updateResource = useStore(s => s.updateResource)
  const deleteResource = useStore(s => s.deleteResource)
  const [search, setSearch]   = useState('')
  const [status, setStatus]   = useState('ALL')
  const [sector, setSector]   = useState('ALL')
  const [sort, setSort]       = useState('priority')
  const [addOpen, setAddOpen] = useState(false)

  const ints = resources.filter(r => r.type === 'internship')
  const sectors = ['ALL', ...new Set(ints.map(r => (r.meta?.sector || 'Other')).filter(Boolean))]

  const filtered = ints
    .filter(r => {
      const q = search.toLowerCase()
      const mq = !q || [r.title, r.description, r.meta?.organiser, r.meta?.sector, ...(r.tags||[])].join(' ').toLowerCase().includes(q)
      return mq && (status === 'ALL' || r.status === status) && (sector === 'ALL' || r.meta?.sector === sector)
    })
    .sort((a,b) => {
      if (sort === 'priority') return ({pinned:0,high:1,normal:2}[a.priority||'normal']||2) - ({pinned:0,high:1,normal:2}[b.priority||'normal']||2)
      if (sort === 'stipend') {
        const na = parseInt((a.meta?.stipend||'0').replace(/[^0-9]/g,''))||0
        const nb = parseInt((b.meta?.stipend||'0').replace(/[^0-9]/g,''))||0
        return nb - na
      }
      return (a.status||'').localeCompare(b.status||'')
    })

  const stats = [
    { n: ints.length, l:'TOTAL', c:'' },
    { n: ints.filter(r => !r.status || r.status === 'not_applied').length, l:'NOT APPLIED', c:'' },
    { n: ints.filter(r => r.status === 'applied').length, l:'APPLIED', c:'y' },
    { n: ints.filter(r => r.status === 'shortlisted' || r.status === 'interview').length, l:'SHORTLISTED', c:'y' },
    { n: ints.filter(r => r.status === 'offered').length, l:'OFFERED', c:'g' },
  ]

  return (
    <div className="int-view">
      <div className="int-stats">
        {stats.map(s => (
          <div key={s.l} className="isc">
            <div className={`isc-n${s.c ? ' '+s.c : ''}`}>{s.n}</div>
            <div className="isc-l">{s.l}</div>
          </div>
        ))}
      </div>

      <div className="int-controls">
        <input className="ctrl-inp" placeholder="SEARCH INTERNSHIPS..." value={search} onChange={e => setSearch(e.target.value)} />
        <select className="ctrl-sel" value={status} onChange={e => setStatus(e.target.value)}>
          <option value="ALL">ALL STATUS</option>
          {['not_applied','applied','shortlisted','interview','offered','rejected'].map(s => (
            <option key={s} value={s}>{SC[s].l}</option>
          ))}
        </select>
        <select className="ctrl-sel" value={sector} onChange={e => setSector(e.target.value)}>
          {sectors.map(s => <option key={s} value={s}>{s === 'ALL' ? 'ALL SECTORS' : s}</option>)}
        </select>
        <select className="ctrl-sel" value={sort} onChange={e => setSort(e.target.value)}>
          <option value="priority">PRIORITY</option>
          <option value="stipend">STIPEND ↓</option>
          <option value="status">STATUS</option>
        </select>
        <button className="add-int-btn" onClick={() => setAddOpen(true)}>+ ADD INTERNSHIP</button>
      </div>

      <div className="int-grid">
        {filtered.map(r => (
          <InternshipCard key={r.id} r={r}
            onStatusChange={(id, s) => { updateResource(id, { status: s }); toast?.('STATUS → ' + (SC[s]?.l || s)) }}
            onDelete={(id) => { deleteResource(id); toast?.('INTERNSHIP REMOVED') }} />
        ))}
        {filtered.length === 0 && (
          <div style={{ gridColumn:'1/-1', textAlign:'center', padding:40, color:'var(--text3)', fontFamily:'var(--mono)', fontSize:'.72rem' }}>
            NO INTERNSHIPS MATCH FILTERS
          </div>
        )}
      </div>

      <AddInternshipModal open={addOpen} onClose={() => setAddOpen(false)} toast={toast} />
    </div>
  )
}

function InternshipCard({ r, onStatusChange, onDelete }) {
  const m  = r.meta || {}
  const sc = SC[r.status || 'not_applied'] || SC.not_applied
  const isUnpaid = (m.stipend||'').toUpperCase() === 'UNPAID'

  return (
    <div className={`int-card${r.priority === 'pinned' ? ' pinned' : r.priority === 'high' ? ' high' : ''}`}>
      <div className="ic-hdr">
        <div>
          <div className="ic-title">{r.title}</div>
          <div className="ic-org">{m.organiser}</div>
        </div>
        <span className={`sbadge ${sc.c}`}>{sc.l}</span>
      </div>

      <div className="ic-pills">
        {m.stipend  && <span className={`ic-pill money${isUnpaid ? ' unpaid' : ''}`}>💰 {m.stipend}</span>}
        {m.duration && <span className="ic-pill">⏱ {m.duration}</span>}
        {m.location && <span className="ic-pill">📍 {m.location}</span>}
        {m.deadline && <span className="ic-pill dl">📅 {m.deadline}</span>}
      </div>

      <div className="ic-desc">{r.description}</div>

      {(m.skills||[]).length > 0 && (
        <div className="ic-skills">
          {m.skills.slice(0,5).map(s => <span key={s} className="sk-chip">{s}</span>)}
        </div>
      )}

      <div className="ic-foot">
        <select className="stat-sel" value={r.status || 'not_applied'} onChange={e => onStatusChange(r.id, e.target.value)}>
          {['not_applied','applied','shortlisted','interview','offered','rejected','withdrawn'].map(s => (
            <option key={s} value={s}>{SC[s].l}</option>
          ))}
        </select>
        {(m.applyLink || r.url) && (
          <a className="ic-act apply" href={m.applyLink || r.url} target="_blank" rel="noopener noreferrer">APPLY ↗</a>
        )}
        <button className="ic-act del" onClick={() => onDelete(r.id)}>DEL</button>
      </div>
    </div>
  )
}
