'use client';
import { useState, useEffect, useCallback } from 'react';

/* ══════════════════════════════════════════════
   TYPES
══════════════════════════════════════════════ */
type Tool = { id:string; name:string; domain:string; icon:string; approved:boolean; risk_level:string; category:string; created_at:string };
type Log  = { id:string; user_email:string; tool_name:string; tool_domain:string; action:string; risk_level:string; detail:string; source:string; created_at:string };
type Alert= { id:string; severity:string; title:string; description:string; user_email:string; tool_name:string; status:string; created_at:string };
type Stats= { totalTools:number; unapproved:number; totalUsers:number; sensitiveAlerts:number; shadowCount:number; riskScore:number; todayLogs:number; highLogs:number };

/* ══════════════════════════════════════════════
   HELPERS
══════════════════════════════════════════════ */
function rc(r:string){ return r==='critical'||r==='high'?'#FF4757':r==='medium'?'#FFB347':'#4CE6A8'; }
function rb(r:string){ return r==='critical'||r==='high'?'rgba(255,71,87,.13)':r==='medium'?'rgba(255,179,71,.13)':'rgba(76,230,168,.13)'; }
function fmtTime(iso:string){ try{ return new Date(iso).toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'}); }catch{ return iso; } }
function fmtDate(iso:string){ try{ const d=new Date(iso); return d.toLocaleDateString([],{month:'short',day:'numeric'})+' '+d.toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'}); }catch{ return iso; } }

function AnimNum({ n }:{ n:number }) {
  const [v, setV] = useState(0);
  useEffect(()=>{ let s=0; const step=n/50; const t=setInterval(()=>{ s=Math.min(s+step,n); setV(Math.floor(s)); if(s>=n)clearInterval(t); },18); return ()=>clearInterval(t); },[n]);
  return <>{v}</>;
}

function Gauge({ score }:{ score:number }) {
  const col = score>70?'#4CE6A8':score>45?'#FFB347':'#FF4757';
  const ang = (score/100)*180 - 90;
  return (
    <div style={{ position:'relative', width:170, height:96, margin:'0 auto' }}>
      <svg width="170" height="96" viewBox="0 0 170 96">
        <path d="M14 86 A71 71 0 0 1 156 86" fill="none" stroke="rgba(255,255,255,.07)" strokeWidth="13" strokeLinecap="round"/>
        <path d="M14 86 A71 71 0 0 1 156 86" fill="none" stroke={col} strokeWidth="13" strokeLinecap="round"
          strokeDasharray={`${(score/100)*222} 222`}
          style={{ transition:'stroke-dasharray 1.2s ease', filter:`drop-shadow(0 0 7px ${col}55)` }}/>
        <line x1="85" y1="86" x2="85" y2="26" stroke="white" strokeWidth="2.5" strokeLinecap="round"
          transform={`rotate(${ang},85,86)`} style={{ transition:'transform 1.2s ease' }}/>
        <circle cx="85" cy="86" r="5" fill="white"/>
      </svg>
      <div style={{ position:'absolute', bottom:0, left:'50%', transform:'translateX(-50%)', textAlign:'center' }}>
        <div style={{ fontSize:'1.9rem', fontWeight:900, color:col, lineHeight:1 }}>{score}</div>
        <div style={{ fontSize:'.62rem', color:'rgba(255,255,255,.35)', marginTop:1 }}>/ 100</div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   ADD TOOL MODAL
══════════════════════════════════════════════ */
function AddToolModal({ onClose, onSave }:{ onClose:()=>void; onSave:(t:any)=>void }) {
  const [f, setF] = useState({ name:'', domain:'', icon:'🤖', approved:false, risk_level:'medium', category:'general' });
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');

  async function submit(e:any) {
    e.preventDefault(); setErr('');
    if (!f.name.trim() || !f.domain.trim()) { setErr('Name and domain are required'); return; }
    setSaving(true);
    try {
      const r = await fetch('/api/ai-governance/tools', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(f) });
      const d = await r.json();
      if (!r.ok) { setErr(d.error||'Failed'); setSaving(false); return; }
      onSave(d.tool);
    } catch { setErr('Network error'); setSaving(false); }
  }

  const inp:any = { background:'rgba(255,255,255,.06)', border:'1.5px solid rgba(255,255,255,.1)', borderRadius:10, padding:'10px 13px', fontSize:'.84rem', color:'#C8DEFF', fontFamily:"'DM Sans',sans-serif", outline:'none', width:'100%' };
  const lbl:any = { fontSize:'.76rem', fontWeight:700, color:'rgba(200,220,255,.7)', marginBottom:5, display:'block' };

  return (
    <div className="modal-bg" onClick={onClose}>
      <div className="modal-card" onClick={e=>e.stopPropagation()}>
        <div className="modal-head">
          <span className="modal-title">Register AI Tool</span>
          <button className="modal-x" onClick={onClose}>✕</button>
        </div>
        <form onSubmit={submit} style={{ display:'flex', flexDirection:'column', gap:14, padding:'20px 22px' }}>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
            <div><label style={lbl}>Tool Name *</label><input value={f.name} onChange={e=>setF(p=>({...p,name:e.target.value}))} placeholder="e.g. ChatGPT" style={inp}/></div>
            <div><label style={lbl}>Domain *</label><input value={f.domain} onChange={e=>setF(p=>({...p,domain:e.target.value}))} placeholder="e.g. chat.openai.com" style={inp}/></div>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'80px 1fr 1fr', gap:12 }}>
            <div><label style={lbl}>Icon</label><input value={f.icon} onChange={e=>setF(p=>({...p,icon:e.target.value}))} style={inp}/></div>
            <div>
              <label style={lbl}>Risk Level</label>
              <select value={f.risk_level} onChange={e=>setF(p=>({...p,risk_level:e.target.value}))} style={{...inp}}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div>
              <label style={lbl}>Category</label>
              <select value={f.category} onChange={e=>setF(p=>({...p,category:e.target.value}))} style={{...inp}}>
                <option value="llm">LLM / Chatbot</option>
                <option value="coding">Coding</option>
                <option value="image">Image</option>
                <option value="writing">Writing</option>
                <option value="productivity">Productivity</option>
                <option value="general">General</option>
              </select>
            </div>
          </div>
          <label style={{ display:'flex', alignItems:'center', gap:10, cursor:'pointer' }}>
            <input type="checkbox" checked={f.approved} onChange={e=>setF(p=>({...p,approved:e.target.checked}))} style={{ width:16, height:16, accentColor:'#4CE6A8' }}/>
            <span style={{ fontSize:'.82rem', color:'rgba(200,220,255,.8)' }}>Mark as approved tool</span>
          </label>
          {err && <p style={{ color:'#FF4757', fontSize:'.76rem', margin:0 }}>{err}</p>}
          <button type="submit" disabled={saving} style={{ background:'linear-gradient(135deg,#FF6B35,#C94726)', border:'none', borderRadius:10, padding:'11px', color:'#fff', fontWeight:700, fontSize:'.86rem', cursor:saving?'default':'pointer', fontFamily:"'DM Sans',sans-serif", opacity:saving?.6:1 }}>
            {saving ? 'Saving…' : 'Register Tool'}
          </button>
        </form>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   ADD LOG MODAL
══════════════════════════════════════════════ */
function AddLogModal({ tools, onClose, onSave }:{ tools:Tool[]; onClose:()=>void; onSave:(l:any)=>void }) {
  const [f, setF] = useState({ user_email:'', tool_name:'', tool_domain:'', action:'Prompt submitted', risk_level:'low', detail:'', source:'manual' });
  const [saving, setSaving] = useState(false);

  async function submit(e:any) {
    e.preventDefault();
    setSaving(true);
    const r = await fetch('/api/ai-governance/logs', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(f) });
    const d = await r.json();
    if (r.ok) onSave(d.log);
    setSaving(false);
  }

  const inp:any = { background:'rgba(255,255,255,.06)', border:'1.5px solid rgba(255,255,255,.1)', borderRadius:10, padding:'10px 13px', fontSize:'.84rem', color:'#C8DEFF', fontFamily:"'DM Sans',sans-serif", outline:'none', width:'100%' };
  const lbl:any = { fontSize:'.76rem', fontWeight:700, color:'rgba(200,220,255,.7)', marginBottom:5, display:'block' };

  function pickTool(name:string) {
    const t = tools.find(t=>t.name===name);
    setF(p=>({ ...p, tool_name:name, tool_domain: t?.domain||'' }));
  }

  return (
    <div className="modal-bg" onClick={onClose}>
      <div className="modal-card" onClick={e=>e.stopPropagation()}>
        <div className="modal-head">
          <span className="modal-title">Log AI Activity</span>
          <button className="modal-x" onClick={onClose}>✕</button>
        </div>
        <form onSubmit={submit} style={{ display:'flex', flexDirection:'column', gap:14, padding:'20px 22px' }}>
          <div><label style={lbl}>User Email *</label><input value={f.user_email} onChange={e=>setF(p=>({...p,user_email:e.target.value}))} placeholder="john@company.com" style={inp}/></div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
            <div>
              <label style={lbl}>AI Tool *</label>
              <select value={f.tool_name} onChange={e=>pickTool(e.target.value)} style={inp}>
                <option value="">Select tool…</option>
                {tools.map(t=><option key={t.id} value={t.name}>{t.icon} {t.name}</option>)}
                <option value="__other">Other (type below)</option>
              </select>
              {f.tool_name==='__other' && <input value={f.tool_domain} onChange={e=>setF(p=>({...p,tool_domain:e.target.value}))} placeholder="tool domain" style={{...inp,marginTop:6}}/>}
            </div>
            <div>
              <label style={lbl}>Action</label>
              <select value={f.action} onChange={e=>setF(p=>({...p,action:e.target.value}))} style={inp}>
                <option>Prompt submitted</option>
                <option>File uploaded</option>
                <option>Code completion</option>
                <option>API call made</option>
                <option>Document generated</option>
                <option>Image generated</option>
              </select>
            </div>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
            <div>
              <label style={lbl}>Risk Level</label>
              <select value={f.risk_level} onChange={e=>setF(p=>({...p,risk_level:e.target.value}))} style={inp}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div>
              <label style={lbl}>Source</label>
              <select value={f.source} onChange={e=>setF(p=>({...p,source:e.target.value}))} style={inp}>
                <option value="manual">Manual entry</option>
                <option value="extension">Browser extension</option>
                <option value="api">API monitoring</option>
                <option value="network">Network monitor</option>
              </select>
            </div>
          </div>
          <div><label style={lbl}>Detail / Notes</label><textarea value={f.detail} onChange={e=>setF(p=>({...p,detail:e.target.value}))} placeholder="What happened? Any sensitive data detected?" rows={3} style={{...inp,resize:'vertical'}}/></div>
          <button type="submit" disabled={saving||!f.user_email||!f.tool_name} style={{ background:'linear-gradient(135deg,#FF6B35,#C94726)', border:'none', borderRadius:10, padding:'11px', color:'#fff', fontWeight:700, fontSize:'.86rem', cursor:'pointer', fontFamily:"'DM Sans',sans-serif", opacity:saving?.6:1 }}>
            {saving ? 'Saving…' : 'Submit Log'}
          </button>
        </form>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════════════ */
export default function AIGovernancePage() {
  const [tab,         setTab]        = useState<'overview'|'tools'|'activity'|'alerts'>('overview');
  const [stats,       setStats]      = useState<Stats|null>(null);
  const [tools,       setTools]      = useState<Tool[]>([]);
  const [logs,        setLogs]       = useState<Log[]>([]);
  const [alerts,      setAlerts]     = useState<Alert[]>([]);
  const [loading,     setLoading]    = useState(true);
  const [logFilter,   setLogFilter]  = useState('all');
  const [alertFilter, setAlertFilter]= useState('all');
  const [showAddTool, setShowAddTool]= useState(false);
  const [showAddLog,  setShowAddLog] = useState(false);
  const [pulse,       setPulse]      = useState(false);
  const [liveCount,   setLiveCount]  = useState(0);
  const [toast,       setToast]      = useState('');

  function showToast(msg:string) { setToast(msg); setTimeout(()=>setToast(''),3000); }

  const loadAll = useCallback(async () => {
    setLoading(true);
    const [sRes, tRes, lRes, aRes] = await Promise.all([
      fetch('/api/ai-governance/stats'),
      fetch('/api/ai-governance/tools'),
      fetch('/api/ai-governance/logs?limit=50'),
      fetch('/api/ai-governance/alerts?status=all'),
    ]);
    const [s, t, l, a] = await Promise.all([sRes.json(), tRes.json(), lRes.json(), aRes.json()]);
    if (s)      setStats(s);
    if (t.tools) setTools(t.tools);
    if (l.logs)  setLogs(l.logs);
    if (a.alerts) setAlerts(a.alerts);
    setLoading(false);
  }, []);

  useEffect(() => { loadAll(); }, [loadAll]);

  // Re-fetch logs when filter changes
  useEffect(() => {
    const url = logFilter==='all' ? '/api/ai-governance/logs?limit=50' : `/api/ai-governance/logs?risk=${logFilter}&limit=50`;
    fetch(url).then(r=>r.json()).then(d=>{ if(d.logs) setLogs(d.logs); });
  }, [logFilter]);

  // Re-fetch alerts when filter changes
  useEffect(() => {
    const url = alertFilter==='all' ? '/api/ai-governance/alerts?status=all' : `/api/ai-governance/alerts?severity=${alertFilter}&status=all`;
    fetch(url).then(r=>r.json()).then(d=>{ if(d.alerts) setAlerts(d.alerts); });
  }, [alertFilter]);

  // Live counter animation
  useEffect(() => {
    const t = setInterval(()=>{ setLiveCount(c=>c+Math.floor(Math.random()*2+1)); setPulse(true); setTimeout(()=>setPulse(false),600); }, 5000);
    return ()=>clearInterval(t);
  }, []);

  async function updateAlertStatus(id:string, status:string) {
    await fetch('/api/ai-governance/alerts', { method:'PATCH', headers:{'Content-Type':'application/json'}, body:JSON.stringify({id,status}) });
    setAlerts(p => p.map(a => a.id===id ? {...a, status} : a));
    showToast(`Alert marked as ${status}`);
  }

  async function toggleApproval(tool:Tool) {
    const r = await fetch('/api/ai-governance/tools', { method:'PATCH', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ id:tool.id, approved:!tool.approved }) });
    const d = await r.json();
    if (d.tool) { setTools(p=>p.map(t=>t.id===tool.id?d.tool:t)); showToast(`${tool.name} ${d.tool.approved?'approved':'unapproved'}`); loadAll(); }
  }

  async function deleteTool(id:string, name:string) {
    if (!confirm(`Remove ${name} from monitoring?`)) return;
    await fetch('/api/ai-governance/tools', { method:'DELETE', headers:{'Content-Type':'application/json'}, body:JSON.stringify({id}) });
    setTools(p=>p.filter(t=>t.id!==id));
    showToast(`${name} removed`);
  }

  const openAlerts = alerts.filter(a=>a.status==='open');
  const critHigh   = openAlerts.filter(a=>a.severity==='critical'||a.severity==='high').length;
  const filteredLogs   = logs;
  const filteredAlerts = alertFilter==='all' ? alerts : alerts.filter(a=>a.severity===alertFilter);

  if (loading) return (
    <div style={{ minHeight:'100vh', background:'#060D18', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:"'DM Sans',sans-serif" }}>
      <div style={{ textAlign:'center' }}>
        <div className="spinner"/>
        <p style={{ color:'rgba(200,220,255,.4)', marginTop:16, fontSize:'.86rem' }}>Loading AI Governance data…</p>
      </div>
    </div>
  );

  return (
    <div className="ag-root">
      <div className="ag-grid-bg"/>

      {/* TOPBAR */}
      <header className="ag-topbar">
        <div className="ag-tl">
          <div className="ag-logo-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          </div>
          <span className="ag-brand">Sec<span>Comply</span></span>
          <span className="ag-sep">/</span>
          <span className="ag-ptitle">AI Governance</span>
        </div>
        <div className="ag-tr">
          <div className={`ag-live ${pulse?'ag-live-p':''}`}>
            <span className="ag-live-dot"/>
            Live · <strong>{(stats?.todayLogs||0) + liveCount}</strong> events today
          </div>
          <button className="ag-addbtn ag-addbtn-green" onClick={()=>setShowAddLog(true)}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Log Activity
          </button>
          <button className="ag-addbtn" onClick={()=>setShowAddTool(true)}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Add Tool
          </button>
        </div>
      </header>

      {/* TABS */}
      <nav className="ag-tabs">
        {(['overview','tools','activity','alerts'] as const).map(t=>(
          <button key={t} className={`ag-tab ${tab===t?'ag-tab-on':''}`} onClick={()=>setTab(t)}>
            {t==='overview'?'⊞':t==='tools'?'⬡':t==='activity'?'⌁':'⚠'}
            {t.charAt(0).toUpperCase()+t.slice(1)}
            {t==='alerts' && critHigh>0 && <span className="ag-badge">{critHigh}</span>}
          </button>
        ))}
      </nav>

      <main className="ag-main">

        {/* ══ OVERVIEW ══ */}
        {tab==='overview' && stats && (
          <div className="ag-sec">
            {/* Stats */}
            <div className="ag-stats">
              {[
                { icon:'🤖', label:'AI Tools Detected', val:stats.totalTools, sub:`${stats.unapproved} unapproved`, col:'#FF6B35' },
                { icon:'👥', label:'Active AI Users',   val:stats.totalUsers,  sub:'Employees using AI', col:'#4CE6A8' },
                { icon:'⚠️', label:'Open Alerts',       val:openAlerts.length, sub:`${critHigh} critical/high`, col:'#FF4757' },
                { icon:'👻', label:'Shadow AI Tools',   val:stats.shadowCount, sub:'Unauthorized', col:'#FFB347' },
              ].map((s,i)=>(
                <div key={i} className="stat-card" style={{ '--ac':s.col } as any}>
                  <div className="stat-top">
                    <div className="stat-ico" style={{ background:s.col+'1a', color:s.col }}>{s.icon}</div>
                  </div>
                  <div className="stat-val" style={{ color:s.col }}><AnimNum n={s.val}/></div>
                  <div className="stat-lbl">{s.label}</div>
                  <div className="stat-sub">{s.sub}</div>
                </div>
              ))}
            </div>

            {/* Risk + Tool usage */}
            <div className="ag-row2">
              <div className="ag-card">
                <div className="ag-ch">
                  <span className="ag-ct">AI Security Score</span>
                  <span className="ag-badge-score" style={{ background:stats.riskScore>70?'rgba(76,230,168,.15)':stats.riskScore>45?'rgba(255,179,71,.15)':'rgba(255,71,87,.15)', color:stats.riskScore>70?'#4CE6A8':stats.riskScore>45?'#FFB347':'#FF4757' }}>
                    {stats.riskScore>70?'Low Risk':stats.riskScore>45?'Moderate':'High Risk'}
                  </span>
                </div>
                <Gauge score={stats.riskScore}/>
                <div style={{ marginTop:16, display:'flex', flexDirection:'column', gap:9 }}>
                  {[
                    { label:'Unapproved tools', val:stats.unapproved, max:Math.max(stats.totalTools,1) },
                    { label:'Sensitive alerts',  val:stats.sensitiveAlerts, max:10 },
                    { label:'Shadow AI tools',   val:stats.shadowCount, max:10 },
                  ].map((f,i)=>(
                    <div key={i} style={{ display:'flex', alignItems:'center', gap:10 }}>
                      <span style={{ fontSize:'.7rem', color:'rgba(200,220,255,.5)', width:130, flexShrink:0 }}>{f.label}</span>
                      <div style={{ flex:1, height:4, background:'rgba(255,255,255,.07)', borderRadius:4, overflow:'hidden' }}>
                        <div style={{ height:'100%', borderRadius:4, width:`${Math.min((f.val/f.max)*100,100)}%`, background:f.val/f.max>.6?'#FF4757':f.val/f.max>.3?'#FFB347':'#4CE6A8', transition:'width 1.2s ease' }}/>
                      </div>
                      <span style={{ fontSize:'.72rem', fontWeight:700, color:'#fff', width:20, textAlign:'right' }}>{f.val}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="ag-card">
                <div className="ag-ch"><span className="ag-ct">AI Tools — Usage Ranking</span></div>
                <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
                  {tools.map((t,i)=>(
                    <div key={t.id} style={{ display:'flex', alignItems:'center', gap:10 }}>
                      <span style={{ fontSize:'.7rem', color:'rgba(200,220,255,.35)', width:14 }}>{i+1}</span>
                      <span style={{ fontSize:'1.2rem', width:24, textAlign:'center' }}>{t.icon}</span>
                      <div style={{ flex:1 }}>
                        <div style={{ fontSize:'.8rem', fontWeight:700, color:'#fff', marginBottom:4 }}>{t.name}</div>
                        <div style={{ height:4, background:'rgba(255,255,255,.07)', borderRadius:4, overflow:'hidden' }}>
                          <div style={{ height:'100%', borderRadius:4, width:`${Math.max(20,(tools.length-i)/tools.length*100)}%`, background:t.approved?'#4CE6A8':'#FF6B35', opacity:.8, transition:'width 1.2s ease' }}/>
                        </div>
                      </div>
                      <span className="ag-pill" style={{ background:t.approved?'rgba(76,230,168,.13)':'rgba(255,107,53,.13)', color:t.approved?'#4CE6A8':'#FF6B35' }}>{t.approved?'✓ OK':'Shadow'}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent alerts */}
            <div className="ag-card">
              <div className="ag-ch">
                <span className="ag-ct">Recent Open Alerts</span>
                <button className="ag-link" onClick={()=>setTab('alerts')}>View all →</button>
              </div>
              {openAlerts.length===0 && <p className="ag-empty">No open alerts 🎉</p>}
              {openAlerts.slice(0,5).map(a=>(
                <div key={a.id} className="ag-arow">
                  <div className="ag-asev" style={{ background:rb(a.severity), color:rc(a.severity) }}>
                    {a.severity==='critical'?'●':a.severity==='high'?'▲':'◆'}
                  </div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:'.82rem', fontWeight:700, color:'#fff' }}>{a.title}</div>
                    <div style={{ fontSize:'.72rem', color:'rgba(200,220,255,.45)', marginTop:2 }}>{a.description}</div>
                  </div>
                  <div style={{ textAlign:'right', flexShrink:0 }}>
                    <div style={{ fontSize:'.68rem', color:'rgba(200,220,255,.4)' }}>{a.tool_name}</div>
                    <div style={{ fontSize:'.64rem', color:'rgba(200,220,255,.3)' }}>{fmtDate(a.created_at)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ══ TOOLS ══ */}
        {tab==='tools' && (
          <div className="ag-sec">
            <div className="ag-card">
              <div className="ag-ch">
                <span className="ag-ct">Registered AI Tools <span style={{ color:'rgba(200,220,255,.4)', fontWeight:500 }}>({tools.length})</span></span>
                <button className="ag-addbtn" onClick={()=>setShowAddTool(true)}>+ Add Tool</button>
              </div>
              {tools.length===0 && <p className="ag-empty">No tools registered yet. Click "Add Tool" to start monitoring.</p>}
              <div className="tools-grid">
                {tools.map(t=>(
                  <div key={t.id} className={`tool-card ${!t.approved?'tool-shadow':''}`}>
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:10 }}>
                      <span style={{ fontSize:'2rem' }}>{t.icon}</span>
                      <div style={{ display:'flex', gap:6 }}>
                        <button className="ag-pill" style={{ background:t.approved?'rgba(76,230,168,.13)':'rgba(255,107,53,.13)', color:t.approved?'#4CE6A8':'#FF6B35', border:'none', cursor:'pointer', fontFamily:"'DM Sans',sans-serif" }} onClick={()=>toggleApproval(t)}>
                          {t.approved?'✓ Approved':'✕ Shadow'}
                        </button>
                      </div>
                    </div>
                    <div style={{ fontSize:'.9rem', fontWeight:800, color:'#fff', marginBottom:3 }}>{t.name}</div>
                    <div style={{ fontSize:'.68rem', color:'rgba(200,220,255,.4)', marginBottom:12 }}>{t.domain}</div>
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                      <span className="ag-pill" style={{ background:rb(t.risk_level), color:rc(t.risk_level) }}>{t.risk_level} risk</span>
                      <div style={{ display:'flex', gap:8 }}>
                        <button style={{ background:'none', border:'none', color:'rgba(200,220,255,.35)', cursor:'pointer', fontSize:'.72rem' }} onClick={()=>toggleApproval(t)}>
                          {t.approved?'Revoke':'Approve'}
                        </button>
                        <button style={{ background:'none', border:'none', color:'#FF4757', cursor:'pointer', fontSize:'.72rem' }} onClick={()=>deleteTool(t.id, t.name)}>Remove</button>
                      </div>
                    </div>
                    <div style={{ height:3, borderRadius:3, marginTop:10, background:`linear-gradient(90deg,${rc(t.risk_level)},${rc(t.risk_level)}30)`, width:t.risk_level==='high'?'85%':t.risk_level==='medium'?'55%':'25%' }}/>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ══ ACTIVITY ══ */}
        {tab==='activity' && (
          <div className="ag-sec">
            <div className="ag-card">
              <div className="ag-ch">
                <span className="ag-ct">Activity Log <span style={{ color:'rgba(200,220,255,.4)', fontWeight:500 }}>({logs.length} entries)</span></span>
                <div className="ag-filters">
                  {['all','high','medium','low'].map(f=>(
                    <button key={f} className={`ag-filter ${logFilter===f?'ag-filter-on':''}`} onClick={()=>setLogFilter(f)}>
                      {f==='all'?'All':f.charAt(0).toUpperCase()+f.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
              {logs.length===0 && <p className="ag-empty">No activity logged yet. Click "Log Activity" to add entries.</p>}
              <div className="log-table">
                <div className="log-header">
                  <span>User</span><span>Tool</span><span>Action</span><span>Risk</span><span>Source</span><span>Time</span><span>Detail</span>
                </div>
                {filteredLogs.map(l=>(
                  <div key={l.id} className="log-row">
                    <span style={{ display:'flex', alignItems:'center', gap:7, fontWeight:600, color:'#fff', fontSize:'.78rem' }}>
                      <span className="ag-av">{l.user_email.charAt(0).toUpperCase()}</span>
                      {l.user_email.split('@')[0]}
                    </span>
                    <span style={{ color:'rgba(200,220,255,.8)', fontSize:'.78rem' }}>
                      {tools.find(t=>t.name===l.tool_name)?.icon||'🤖'} {l.tool_name}
                    </span>
                    <span style={{ color:'rgba(200,220,255,.6)', fontSize:'.76rem' }}>{l.action}</span>
                    <span><span className="ag-pill" style={{ background:rb(l.risk_level), color:rc(l.risk_level) }}>{l.risk_level}</span></span>
                    <span><span className="ag-pill" style={{ background:'rgba(255,255,255,.07)', color:'rgba(200,220,255,.5)' }}>{l.source}</span></span>
                    <span style={{ color:'rgba(200,220,255,.4)', fontSize:'.72rem' }}>{fmtTime(l.created_at)}</span>
                    <span style={{ color:'rgba(200,220,255,.4)', fontSize:'.71rem' }}>{l.detail||'—'}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ══ ALERTS ══ */}
        {tab==='alerts' && (
          <div className="ag-sec">
            <div className="ag-card">
              <div className="ag-ch">
                <span className="ag-ct">Security Alerts <span style={{ color:'rgba(200,220,255,.4)', fontWeight:500 }}>({alerts.length})</span></span>
                <div className="ag-filters">
                  {['all','critical','high','medium'].map(f=>(
                    <button key={f} className={`ag-filter ${alertFilter===f?'ag-filter-on':''}`} onClick={()=>setAlertFilter(f)}>
                      {f.charAt(0).toUpperCase()+f.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
              {filteredAlerts.length===0 && <p className="ag-empty">No alerts found.</p>}
              {filteredAlerts.map(a=>(
                <div key={a.id} className={`alert-row ${a.status!=='open'?'alert-row-dim':''}`}>
                  <div className="alert-sev" style={{ background:rb(a.severity), color:rc(a.severity), borderColor:rc(a.severity)+'40' }}>
                    <span style={{ fontSize:'1.1rem' }}>{a.severity==='critical'?'🔴':a.severity==='high'?'🟠':'🟡'}</span>
                    <span>{a.severity.toUpperCase()}</span>
                  </div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:'.88rem', fontWeight:800, color: a.status==='open'?'#fff':'rgba(255,255,255,.5)', marginBottom:5 }}>{a.title}</div>
                    <div style={{ fontSize:'.77rem', color:'rgba(200,220,255,.5)', marginBottom:8 }}>{a.description}</div>
                    <div style={{ display:'flex', gap:14, fontSize:'.7rem', color:'rgba(200,220,255,.35)' }}>
                      {a.user_email && <span>👤 {a.user_email}</span>}
                      {a.tool_name  && <span>🤖 {a.tool_name}</span>}
                      <span>🕐 {fmtDate(a.created_at)}</span>
                      <span className="ag-pill" style={{ background:'rgba(255,255,255,.07)', color:'rgba(200,220,255,.5)' }}>{a.status}</span>
                    </div>
                  </div>
                  {a.status==='open' && (
                    <div style={{ display:'flex', flexDirection:'column', gap:6, flexShrink:0 }}>
                      <button className="ag-action-inv" onClick={()=>updateAlertStatus(a.id,'investigating')}>Investigate</button>
                      <button className="ag-action-dis" onClick={()=>updateAlertStatus(a.id,'dismissed')}>Dismiss</button>
                    </div>
                  )}
                  {a.status==='investigating' && (
                    <button className="ag-action-inv" onClick={()=>updateAlertStatus(a.id,'resolved')}>Mark Resolved</button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

      </main>

      {/* MODALS */}
      {showAddTool && <AddToolModal onClose={()=>setShowAddTool(false)} onSave={t=>{ setTools(p=>[t,...p]); setShowAddTool(false); showToast(`${t.name} registered!`); loadAll(); }}/>}
      {showAddLog  && <AddLogModal tools={tools} onClose={()=>setShowAddLog(false)} onSave={l=>{ setLogs(p=>[l,...p]); setShowAddLog(false); showToast('Activity logged!'); loadAll(); }}/>}

      {/* TOAST */}
      <div className={`ag-toast ${toast?'ag-toast-on':''}`}>{toast}</div>

      {/* ═══ STYLES ═══ */}
      <style>{`
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
        .ag-root{min-height:100vh;background:#060D18;font-family:'DM Sans','Segoe UI',sans-serif;color:#C8DEFF;position:relative;overflow-x:hidden;}
        .ag-grid-bg{position:fixed;inset:0;z-index:0;pointer-events:none;background-image:linear-gradient(rgba(255,107,53,.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,107,53,.025) 1px,transparent 1px);background-size:52px 52px;}

        /* topbar */
        .ag-topbar{position:sticky;top:0;z-index:100;display:flex;align-items:center;justify-content:space-between;padding:13px 26px;background:rgba(6,13,24,.93);backdrop-filter:blur(14px);border-bottom:1px solid rgba(255,255,255,.06);}
        .ag-tl{display:flex;align-items:center;gap:10px;}
        .ag-logo-icon{width:30px;height:30px;border-radius:8px;background:linear-gradient(135deg,#FF8040,#C0392B);display:flex;align-items:center;justify-content:center;box-shadow:0 3px 12px rgba(255,107,53,.4);}
        .ag-brand{font-size:.9rem;font-weight:800;color:#fff;} .ag-brand span{color:#FF6B35;}
        .ag-sep{color:rgba(255,255,255,.18);} .ag-ptitle{font-size:.82rem;font-weight:600;color:rgba(200,220,255,.55);}
        .ag-tr{display:flex;align-items:center;gap:10px;}
        .ag-live{font-size:.74rem;color:rgba(200,220,255,.55);display:flex;align-items:center;gap:6px;background:rgba(76,230,168,.08);border:1px solid rgba(76,230,168,.18);padding:6px 12px;border-radius:20px;transition:box-shadow .3s;}
        .ag-live strong{color:#4CE6A8;} .ag-live-p{box-shadow:0 0 0 4px rgba(76,230,168,.13);}
        .ag-live-dot{width:6px;height:6px;border-radius:50%;background:#4CE6A8;animation:blink 2s infinite;}
        .ag-addbtn{display:flex;align-items:center;gap:5px;background:rgba(255,107,53,.1);border:1px solid rgba(255,107,53,.25);color:#FF6B35;padding:7px 13px;border-radius:9px;font-size:.76rem;font-weight:700;cursor:pointer;font-family:'DM Sans',sans-serif;transition:all .18s;}
        .ag-addbtn:hover{background:rgba(255,107,53,.2);}
        .ag-addbtn-green{background:rgba(76,230,168,.1)!important;border-color:rgba(76,230,168,.22)!important;color:#4CE6A8!important;}
        .ag-addbtn-green:hover{background:rgba(76,230,168,.2)!important;}

        /* tabs */
        .ag-tabs{display:flex;gap:3px;padding:13px 26px 0;border-bottom:1px solid rgba(255,255,255,.06);position:relative;z-index:1;}
        .ag-tab{display:flex;align-items:center;gap:6px;padding:9px 16px;border:none;background:none;cursor:pointer;font-size:.8rem;font-weight:600;color:rgba(200,220,255,.4);font-family:'DM Sans',sans-serif;border-radius:9px 9px 0 0;transition:all .18s;}
        .ag-tab:hover{color:rgba(200,220,255,.75);background:rgba(255,255,255,.04);}
        .ag-tab-on{color:#fff;background:rgba(255,107,53,.1);border-bottom:2.5px solid #FF6B35;}
        .ag-badge{background:#FF4757;color:#fff;font-size:.6rem;font-weight:800;padding:1px 5px;border-radius:10px;}
        .ag-badge-score{font-size:.7rem;font-weight:700;padding:4px 10px;border-radius:20px;}

        /* main */
        .ag-main{padding:22px 26px;position:relative;z-index:1;max-width:1380px;}
        .ag-sec{display:flex;flex-direction:column;gap:18px;}

        /* stat cards */
        .ag-stats{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;}
        .stat-card{background:linear-gradient(160deg,#0C1828,#101E32);border:1px solid rgba(255,255,255,.07);border-radius:16px;padding:18px;transition:transform .2s,box-shadow .2s;}
        .stat-card:hover{transform:translateY(-2px);box-shadow:0 10px 32px rgba(0,0,0,.3);}
        .stat-top{margin-bottom:12px;}
        .stat-ico{width:38px;height:38px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:1.1rem;}
        .stat-val{font-size:2.1rem;font-weight:900;line-height:1;letter-spacing:-.03em;}
        .stat-lbl{font-size:.76rem;font-weight:600;color:rgba(200,220,255,.65);margin-top:5px;}
        .stat-sub{font-size:.68rem;color:rgba(200,220,255,.3);margin-top:2px;}

        /* cards */
        .ag-card{background:linear-gradient(160deg,#0C1828,#0F1C2E);border:1px solid rgba(255,255,255,.07);border-radius:18px;padding:20px;}
        .ag-ch{display:flex;align-items:center;justify-content:space-between;margin-bottom:18px;}
        .ag-ct{font-size:.92rem;font-weight:800;color:#fff;}
        .ag-link{background:none;border:none;color:#FF6B35;font-size:.76rem;font-weight:700;cursor:pointer;font-family:inherit;}
        .ag-link:hover{text-decoration:underline;}
        .ag-row2{display:grid;grid-template-columns:300px 1fr;gap:18px;}
        .ag-empty{color:rgba(200,220,255,.35);font-size:.82rem;padding:20px 0;text-align:center;}

        /* alert rows */
        .ag-arow{display:flex;align-items:center;gap:11px;padding:11px;border-radius:11px;background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.05);margin-bottom:8px;transition:background .18s;}
        .ag-arow:hover{background:rgba(255,255,255,.06);}
        .ag-asev{width:30px;height:30px;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:.75rem;flex-shrink:0;}

        /* tools grid */
        .tools-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(190px,1fr));gap:13px;}
        .tool-card{background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.07);border-radius:15px;padding:17px;transition:all .2s;}
        .tool-card:hover{transform:translateY(-2px);box-shadow:0 10px 28px rgba(0,0,0,.3);}
        .tool-shadow{border-color:rgba(255,71,87,.2);background:rgba(255,71,87,.04);}

        /* log table */
        .log-table{border-radius:11px;overflow:hidden;border:1px solid rgba(255,255,255,.06);}
        .log-header{display:grid;grid-template-columns:1.5fr 1fr 1.1fr .6fr .7fr .6fr 1.8fr;padding:9px 13px;background:rgba(255,255,255,.04);font-size:.68rem;font-weight:700;color:rgba(200,220,255,.35);letter-spacing:.06em;text-transform:uppercase;gap:10px;}
        .log-row{display:grid;grid-template-columns:1.5fr 1fr 1.1fr .6fr .7fr .6fr 1.8fr;padding:11px 13px;gap:10px;align-items:center;border-top:1px solid rgba(255,255,255,.04);transition:background .14s;}
        .log-row:hover{background:rgba(255,255,255,.04);}
        .ag-av{width:22px;height:22px;border-radius:50%;background:linear-gradient(135deg,#FF6B35,#C0392B);display:flex;align-items:center;justify-content:center;font-size:.65rem;font-weight:800;color:#fff;flex-shrink:0;}

        /* full alert rows */
        .alert-row{display:flex;align-items:center;gap:14px;padding:15px 17px;border-radius:13px;background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.06);margin-bottom:9px;transition:all .18s;}
        .alert-row:hover{background:rgba(255,255,255,.06);}
        .alert-row-dim{opacity:.55;}
        .alert-sev{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;width:68px;flex-shrink:0;padding:9px 7px;border-radius:10px;border:1px solid;font-size:.59rem;font-weight:800;letter-spacing:.04em;text-align:center;}
        .ag-action-inv{padding:7px 13px;border-radius:8px;font-size:.74rem;font-weight:700;cursor:pointer;font-family:'DM Sans',sans-serif;background:rgba(255,107,53,.1);border:1px solid rgba(255,107,53,.3);color:#FF6B35;transition:all .18s;}
        .ag-action-inv:hover{background:rgba(255,107,53,.2);}
        .ag-action-dis{padding:7px 13px;border-radius:8px;font-size:.74rem;font-weight:700;cursor:pointer;font-family:'DM Sans',sans-serif;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.1);color:rgba(200,220,255,.45);transition:all .18s;}
        .ag-action-dis:hover{background:rgba(255,255,255,.1);}

        /* filters */
        .ag-filters{display:flex;gap:5px;}
        .ag-filter{background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.09);color:rgba(200,220,255,.45);padding:5px 11px;border-radius:20px;font-size:.72rem;font-weight:600;cursor:pointer;font-family:'DM Sans',sans-serif;transition:all .18s;}
        .ag-filter:hover{background:rgba(255,255,255,.1);color:#fff;}
        .ag-filter-on{background:rgba(255,107,53,.14);border-color:rgba(255,107,53,.32);color:#FF6B35;}

        /* pill */
        .ag-pill{font-size:.67rem;font-weight:700;padding:3px 8px;border-radius:20px;flex-shrink:0;white-space:nowrap;}

        /* modals */
        .modal-bg{position:fixed;inset:0;z-index:200;background:rgba(0,0,0,.65);backdrop-filter:blur(8px);display:flex;align-items:center;justify-content:center;padding:20px;animation:fadeIn .2s ease;}
        .modal-card{background:linear-gradient(160deg,#0D1E36,#112040);border:1px solid rgba(255,255,255,.09);border-radius:20px;width:100%;max-width:500px;box-shadow:0 28px 80px rgba(0,0,0,.7);animation:slideIn .28s ease;font-family:'DM Sans',sans-serif;}
        .modal-head{display:flex;align-items:center;justify-content:space-between;padding:18px 22px 14px;border-bottom:1px solid rgba(255,255,255,.07);}
        .modal-title{font-size:.95rem;font-weight:800;color:#fff;}
        .modal-x{background:rgba(255,255,255,.07);border:none;color:rgba(255,255,255,.4);width:28px;height:28px;border-radius:8px;cursor:pointer;font-size:1rem;display:flex;align-items:center;justify-content:center;}
        .modal-x:hover{background:rgba(255,60,60,.15);color:#ff7070;}

        /* toast */
        .ag-toast{position:fixed;bottom:28px;left:50%;transform:translateX(-50%) translateY(20px);opacity:0;background:#1a2b40;color:#fff;padding:11px 22px;border-radius:10px;font-size:.83rem;font-weight:600;z-index:9999;pointer-events:none;transition:all .3s;font-family:'DM Sans',sans-serif;border:1px solid rgba(76,230,168,.25);box-shadow:0 8px 28px rgba(0,0,0,.3);}
        .ag-toast-on{opacity:1;transform:translateX(-50%) translateY(0);}

        /* spinner */
        .spinner{width:40px;height:40px;border:3px solid rgba(255,107,53,.2);border-top-color:#FF6B35;border-radius:50%;animation:spin .8s linear infinite;margin:0 auto;}

        /* keyframes */
        @keyframes blink{0%,100%{opacity:1}50%{opacity:.15}}
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
        @keyframes slideIn{from{opacity:0;transform:scale(.93) translateY(20px)}to{opacity:1;transform:none}}
        @keyframes spin{to{transform:rotate(360deg)}}

        /* responsive */
        @media(max-width:1100px){.ag-row2{grid-template-columns:1fr;} .ag-stats{grid-template-columns:repeat(2,1fr);}}
        @media(max-width:640px){.ag-topbar{padding:11px 14px;} .ag-main{padding:14px;} .ag-stats{grid-template-columns:1fr 1fr;} .ag-tabs{padding:9px 14px 0;} .ag-live{display:none;} .log-header,.log-row{grid-template-columns:1.4fr 1fr .8fr .6fr .6fr;} .log-header span:last-child,.log-row span:last-child{display:none;}}
      `}</style>
    </div>
  );
}
