import React, { useState } from 'react'
import { useStore } from '../store'

const AI_PROMPT = `Convert my list into EXACT JSON — no markdown:

{"resources":[{
  "type":"link|tool|pdf|roadmap|internship|course|note|repo|other",
  "title":"Name (required)",
  "url":"https://...",
  "description":"1-2 sentences",
  "category":"Category",
  "tags":["tag1","tag2"],
  "priority":"normal|high|pinned",
  "status":"none|not_applied|applied",
  "meta":{}
}]}

For internships, add in meta:
organiser, stipend, duration, eligibility,
skills (array), deadline, sector, location

My resources: [PASTE HERE]`

const FMT = `{
  "resources": [
    {
      "type": "link",
      "title": "Resource Name",
      "url": "https://...",
      "description": "Description",
      "category": "Category",
      "tags": ["tag1","tag2"],
      "priority": "normal",
      "status": "none",
      "meta": {}
    }
  ]
}`

export function ImportTab({ toast }) {
  const importResources = useStore(s => s.importResources)
  const [json, setJson] = useState('')
  const [drag, setDrag] = useState(false)

  const doImport = () => {
    try {
      const d = JSON.parse(json.trim())
      if (!d.resources || !Array.isArray(d.resources)) throw new Error('bad')
      const valid = d.resources.filter(r => r.title)
      importResources(valid)
      setJson('')
      toast?.(`IMPORTED ${valid.length} RESOURCES!`)
    } catch { toast?.('INVALID JSON FORMAT', 'err') }
  }

  const readFile = (f) => {
    if (!f) return
    const r = new FileReader()
    r.onload = e => setJson(e.target.result)
    r.readAsText(f)
  }

  return (
    <div className="imp-view">
      {/* Drop zone — full width */}
      <div className="imp-box" style={{ gridColumn:'1/-1' }}>
        <h3>↑ IMPORT RESOURCES</h3>
        <div className={`drop-zone${drag ? ' over' : ''}`}
          onClick={() => document.getElementById('fi-input').click()}
          onDragOver={e => { e.preventDefault(); setDrag(true) }}
          onDragLeave={() => setDrag(false)}
          onDrop={e => { e.preventDefault(); setDrag(false); readFile(e.dataTransfer.files[0]) }}>
          📁 DRAG & DROP JSON FILE — OR CLICK TO BROWSE
        </div>
        <input id="fi-input" type="file" accept=".json" style={{ display:'none' }}
          onChange={e => readFile(e.target.files[0])} />

        <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:8 }}>
          <div style={{ flex:1, height:1, background:'var(--border)' }} />
          <span style={{ fontFamily:'var(--mono)', fontSize:'.58rem', color:'var(--text3)' }}>OR PASTE JSON</span>
          <div style={{ flex:1, height:1, background:'var(--border)' }} />
        </div>

        <textarea className="imp-ta" placeholder='{"resources": [...]}'
          value={json} onChange={e => setJson(e.target.value)} />

        <div className="imp-btn-row">
          <button className="imp-btn g" onClick={doImport}>↑ IMPORT</button>
          <button className="imp-btn" onClick={() => navigator.clipboard.writeText(FMT).then(() => toast?.('FORMAT COPIED!'))}>COPY FORMAT</button>
        </div>
      </div>

      {/* AI Prompt */}
      <div className="imp-box">
        <h3>🤖 AI CONVERSION PROMPT</h3>
        <p style={{ fontSize:'.72rem', color:'var(--text2)', marginBottom:10, lineHeight:1.6 }}>
          Copy → paste into any AI with your resource list. Returns ready-to-import JSON.
        </p>
        <div className="ai-box">
          <button className="copy-abs"
            onClick={() => navigator.clipboard.writeText(AI_PROMPT).then(() => toast?.('PROMPT COPIED!'))}>
            COPY
          </button>
          {AI_PROMPT}
        </div>
      </div>

      {/* JSON Format */}
      <div className="imp-box">
        <h3>{'{ }'} JSON FORMAT</h3>
        <div className="json-box">
          <span className="jk">{'{\n  "resources"'}</span>{': [\n    {\n      '}
          <span className="jk">"type"</span>{'     : '}<span className="js">"internship"</span>{',\n      '}
          <span className="jk">"title"</span>{'    : '}<span className="js">"Name"</span>{',\n      '}
          <span className="jk">"url"</span>{'      : '}<span className="js">"https://..."</span>{',\n      '}
          <span className="jk">"category"</span>{' : '}<span className="js">"Career"</span>{',\n      '}
          <span className="jk">"tags"</span>{'     : '}<span className="jv">["govt","paid"]</span>{',\n      '}
          <span className="jk">"priority"</span>{' : '}<span className="js">"pinned"</span>{',\n      '}
          <span className="jk">"status"</span>{'   : '}<span className="js">"not_applied"</span>{',\n      '}
          <span className="jk">"meta"</span>{' : {\n        '}
          <span className="jk">"organiser"</span>{' : '}<span className="js">"Ministry"</span>{',\n        '}
          <span className="jk">"stipend"</span>{'   : '}<span className="js">"₹10,000/mo"</span>{',\n        '}
          <span className="jk">"deadline"</span>{'  : '}<span className="js">"Rolling"</span>{',\n        '}
          <span className="jk">"skills"</span>{'    : '}<span className="jv">["Python"]</span>{'\n      }\n    }\n  ]\n}'}
        </div>
        <button className="imp-btn" style={{ width:'100%' }}
          onClick={() => navigator.clipboard.writeText(FMT).then(() => toast?.('FORMAT COPIED!'))}>
          COPY FORMAT
        </button>
      </div>
    </div>
  )
}
