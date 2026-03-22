import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const GRAD_COLORS = [
  'linear-gradient(135deg,#00d4ff,#00ff88)',
  'linear-gradient(135deg,#bf00ff,#00d4ff)',
  'linear-gradient(135deg,#ffaa00,#ff2d55)',
  'linear-gradient(135deg,#00ff88,#ffaa00)',
  'linear-gradient(135deg,#ff2d55,#bf00ff)',
]

const SEED_RESOURCES = [
  {id:'d1',type:'internship',title:'Prime Minister Internship Scheme',url:'https://pminternship.mca.gov.in/',description:'Internship with top 500 companies. ₹5,000/mo + ₹6,000 one-time grant.',category:'Internships',tags:['government','pan-india'],priority:'pinned',status:'not_applied',meta:{organiser:'Ministry of Corporate Affairs',stipend:'₹5,000/mo + ₹6,000 grant',duration:'12 months',eligibility:'Any UG/PG | Age 21–24',skills:['MS Office','Communication','Domain Basics'],deadline:'Rolling',sector:'Multi-sector',location:'Pan-India',applyLink:'https://pminternship.mca.gov.in/'}},
  {id:'d2',type:'internship',title:'Digital India Internship (MeitY)',url:'https://internship.meity.gov.in/',description:'MeitY tech internship — Python, AI/ML, Cybersecurity, e-Governance.',category:'Internships',tags:['government','tech','ai-ml'],priority:'pinned',status:'not_applied',meta:{organiser:'Ministry of Electronics & IT',stipend:'~₹10,000/month',duration:'Min 2 months',eligibility:'B.Tech CS/IT/ECE | Final year',skills:['Python','Web Dev','AI/ML','Cyber Security'],deadline:'Periodic batches',sector:'Technology',location:'Delhi / Remote',applyLink:'https://internship.meity.gov.in/'}},
  {id:'d3',type:'internship',title:'SEBI ITD Internship',url:'https://www.sebi.gov.in/',description:'Cybersecurity, RegTech and Fintech at SEBI Mumbai.',category:'Internships',tags:['government','fintech','cybersecurity'],priority:'pinned',status:'not_applied',meta:{organiser:'Securities & Exchange Board of India',stipend:'~₹15,000/month',duration:'2–6 months',eligibility:'B.Tech CS/IT, MCA, MBA Finance+Tech | Age ≤26',skills:['Cybersecurity','SQL','Python','Fintech'],deadline:'Periodic',sector:'Finance / RegTech',location:'Mumbai HQ',applyLink:'https://www.sebi.gov.in/'}},
  {id:'d4',type:'internship',title:'NITI Aayog Internship',url:'https://www.niti.gov.in/internship',description:'Prestigious policy think-tank. UNPAID but invaluable.',category:'Internships',tags:['government','policy','unpaid'],priority:'high',status:'not_applied',meta:{organiser:'NITI Aayog',stipend:'UNPAID',duration:'6 weeks – 6 months',eligibility:'Any discipline | Age ≤30',skills:['Policy Research','Python/R','Data Analysis'],deadline:'Apply 1–10 of every month',sector:'Policy / Think-Tank',location:'Delhi',applyLink:'https://www.niti.gov.in/internship'}},
  {id:'d5',type:'internship',title:'MEA Internship Programme',url:'https://internship.mea.gov.in/',description:'Foreign policy, diplomacy and IR research at MEA.',category:'Internships',tags:['government','diplomacy'],priority:'high',status:'not_applied',meta:{organiser:'Ministry of External Affairs',stipend:'₹10,000/mo + airfare',duration:'1–3 months',eligibility:'Any UG/PG — IR, Law, Economics | Age ≤25',skills:['Research','Report Writing','Foreign Language'],deadline:'Apply 3 months ahead',sector:'Foreign Policy',location:'Delhi / Indian Missions',applyLink:'https://internship.mea.gov.in/'}},
  {id:'d6',type:'internship',title:'MNRE Renewable Energy Internship',url:'https://mnre.gov.in/',description:'Solar, wind and clean energy engineering.',category:'Internships',tags:['government','energy'],priority:'normal',status:'not_applied',meta:{organiser:'Ministry of New & Renewable Energy',stipend:'₹15,000/month',duration:'2–6 months',eligibility:'B.Tech EE/Mech/ECE | 3rd/4th year',skills:['Renewable Energy','AutoCAD','MATLAB'],deadline:'Rolling',sector:'Clean Energy',location:'Delhi / Field Sites',applyLink:'https://mnre.gov.in/'}},
  {id:'d7',type:'internship',title:'DPIIT Internship Scheme',url:'https://dpiit.gov.in/',description:'Policy & research at Ministry of Commerce.',category:'Internships',tags:['government','policy'],priority:'high',status:'not_applied',meta:{organiser:'DPIIT',stipend:'₹10,000/month',duration:'1–3 months',eligibility:'B.Tech / MBA / Any UG',skills:['Policy Analysis','MS Excel','Research Writing'],deadline:'Quarterly batches',sector:'Industry & Commerce',location:'Delhi HQ',applyLink:'https://dpiit.gov.in/'}},
  {id:'d8',type:'internship',title:'MWCD Internship',url:'https://wcd.nic.in/',description:'Social policy, gender studies, governance research.',category:'Internships',tags:['government','social-policy'],priority:'normal',status:'not_applied',meta:{organiser:'Ministry of Women & Child Development',stipend:'₹20,000/month',duration:'2–3 months',eligibility:'Law, Social Work, Public Policy',skills:['Research','Data Analysis','Policy Writing'],deadline:'Batch-wise',sector:'Social Policy',location:'Delhi (hostel provided)',applyLink:'https://wcd.nic.in/'}},
  {id:'d9',type:'internship',title:'MoEFCC Forest & Climate Internship',url:'https://moef.gov.in/',description:'GIS, EIA, climate and forest research.',category:'Internships',tags:['government','environment'],priority:'normal',status:'not_applied',meta:{organiser:'Ministry of Environment, Forest & Climate',stipend:'₹10,000/month',duration:'Up to 3 months',eligibility:'B.Tech Civil/Env, B.Sc Env.Sci',skills:['GIS','EIA','Field Survey'],deadline:'Rolling',sector:'Environment / Climate',location:'Delhi / Field',applyLink:'https://moef.gov.in/'}},
  {id:'d10',type:'internship',title:'NCGG Internship',url:'https://ncgg.org.in/',description:'Good Governance and policy research at NCGG.',category:'Internships',tags:['government','governance'],priority:'normal',status:'not_applied',meta:{organiser:'National Centre for Good Governance',stipend:'~₹10,000/month',duration:'Project-based',eligibility:'Public Admin, Law, Economics | UG/PG/PhD',skills:['Policy Analysis','Research Writing'],deadline:'Rolling',sector:'Governance / Policy',location:'Delhi / Mussoorie',applyLink:'https://ncgg.org.in/'}},
  {id:'d11',type:'roadmap',title:'Cybersecurity Roadmap 2024',url:'https://roadmap.sh/cyber-security',description:'Complete learning path for cybersecurity.',category:'Cybersecurity',tags:['roadmap','free'],priority:'pinned',status:'in_progress',meta:{}},
  {id:'d12',type:'tool',title:'CyberChef',url:'https://gchq.github.io/CyberChef/',description:'Encoding, decoding and crypto analysis tool.',category:'Tools',tags:['crypto','encoding','free'],priority:'high',status:'saved',meta:{}},
  {id:'d13',type:'course',title:'TryHackMe',url:'https://tryhackme.com',description:'Hands-on cybersecurity training with guided labs.',category:'Cybersecurity',tags:['hacking','labs','free'],priority:'high',status:'in_progress',meta:{}},
]

const SEED_TODOS = [
  {id:1,text:'Apply to SEBI ITD internship before deadline',done:false,priority:'h'},
  {id:2,text:'Apply to MeitY Digital India next batch',done:false,priority:'h'},
  {id:3,text:'Apply 1–10 this month for NITI Aayog',done:false,priority:'h'},
  {id:4,text:'Complete TryHackMe Web Fundamentals path',done:false,priority:'m'},
  {id:5,text:'Research MEA internship requirements',done:true,priority:'m'},
]

// Per-user store key
export const getUserKey = (username) => 'cs-data-' + (username || 'guest')

export const useStore = create(
  persist(
    (set, get) => ({
      resources: [],
      todos: [],
      notes: '',
      sessions: 0,
      totalSecs: 0,
      accent: '#00d4ff',
      dashName: 'My Workspace',
      activeCat: 'ALL',

      seedIfEmpty: () => {
        if (get().resources.length > 0) return
        set({
          resources: SEED_RESOURCES,
          todos: SEED_TODOS,
          notes: '// workspace initialized\n// internship tracker ready\n\n> apply 1-10 every month for NITI Aayog\n> MeitY opens periodic batches — check regularly',
        })
      },

      addResource: (res) => set(s => ({ resources: [{ id: Date.now()+'', createdAt: Date.now(), status:'none', meta:{}, ...res }, ...s.resources] })),
      updateResource: (id, patch) => set(s => ({ resources: s.resources.map(r => r.id === id ? { ...r, ...patch } : r) })),
      deleteResource: (id) => set(s => ({ resources: s.resources.filter(r => r.id !== id) })),
      importResources: (list) => set(s => ({ resources: [...s.resources, ...list.map(r => ({ id: Date.now()+Math.random()+'', createdAt: Date.now(), ...r }))] })),
      setActiveCat: (cat) => set({ activeCat: cat }),

      addTodo: (text, priority) => set(s => ({ todos: [{ id: Date.now(), text, priority, done: false }, ...s.todos] })),
      toggleTodo: (id) => set(s => ({ todos: s.todos.map(t => t.id === id ? { ...t, done: !t.done } : t) })),
      deleteTodo: (id) => set(s => ({ todos: s.todos.filter(t => t.id !== id) })),

      setNotes: (notes) => set({ notes }),
      setDashName: (dashName) => set({ dashName }),
      addSession: (secs) => set(s => ({ sessions: s.sessions + 1, totalSecs: s.totalSecs + secs })),

      setAccent: (color) => {
        document.documentElement.style.setProperty('--accent', color)
        document.documentElement.style.setProperty('--border', color + '22')
        document.documentElement.style.setProperty('--border2', color + '44')
        document.documentElement.style.setProperty('--glow', `0 0 12px ${color}55,0 0 35px ${color}18`)
        set({ accent: color })
      },

      resetData: () => set({ resources: SEED_RESOURCES, todos: SEED_TODOS, notes: '', sessions: 0, totalSecs: 0 }),
    }),
    {
      name: 'cs-data-guest', // overridden per-user in App
      partialize: s => ({ resources: s.resources, todos: s.todos, notes: s.notes, sessions: s.sessions, totalSecs: s.totalSecs, accent: s.accent, dashName: s.dashName }),
    }
  )
)
