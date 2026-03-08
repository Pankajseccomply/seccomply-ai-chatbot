'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

/* ── Inline password gate — no middleware needed ── */
function AdminGate({ children }: { children: React.ReactNode }) {
  const [authed,  setAuthed]  = useState(false);
  const [checked, setChecked] = useState(false);
  const [pw,      setPw]      = useState('');
  const [error,   setError]   = useState(false);

  useEffect(() => {
    const ok = sessionStorage.getItem('sc_admin_ok');
    if (ok === '1') setAuthed(true);
    setChecked(true);
  }, []);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const expected = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'admin123';
    if (pw === expected) {
      sessionStorage.setItem('sc_admin_ok', '1');
      setAuthed(true);
      setError(false);
    } else {
      setError(true);
      setPw('');
    }
  }

  if (!checked) return null;

  if (!authed) return (
    <div style={{ minHeight:'100vh', background:'#070f1c', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'Manrope,sans-serif' }}>
      <div style={{ background:'#0f1e32', border:'1px solid rgba(255,255,255,.08)', borderRadius:20, padding:'40px 36px', width:380, boxShadow:'0 24px 72px rgba(0,0,0,.6)' }}>
        <div style={{ textAlign:'center', marginBottom:28 }}>
          <div style={{ width:54, height:54, borderRadius:14, background:'linear-gradient(135deg,#FF8040,#C0392B)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 14px' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
          </div>
          <h1 style={{ fontSize:'1.15rem', fontWeight:800, color:'#fff', margin:0 }}>SecComply Admin</h1>
          <p style={{ fontSize:'.78rem', color:'#4a6a8a', marginTop:6 }}>Enter your admin password to continue</p>
        </div>
        <form onSubmit={submit} style={{ display:'flex', flexDirection:'column', gap:14 }}>
          <input
            type="password"
            value={pw}
            onChange={e => { setPw(e.target.value); setError(false); }}
            placeholder="Admin password"
            autoFocus
            style={{ background:'rgba(255,255,255,.06)', border:`1.5px solid ${error ? '#ff4757' : 'rgba(255,255,255,.1)'}`, borderRadius:11, padding:'12px 15px', fontSize:'.9rem', color:'#c8deff', fontFamily:'inherit', outline:'none', transition:'border-color .2s' }}
          />
          {error && <p style={{ margin:0, fontSize:'.76rem', color:'#ff6b6b' }}>Incorrect password. Please try again.</p>}
          <button type="submit" style={{ background:'linear-gradient(135deg,#FF6B35,#C94726)', border:'none', borderRadius:11, padding:'12px', color:'#fff', fontWeight:700, fontSize:'.9rem', cursor:'pointer', fontFamily:'inherit', boxShadow:'0 4px 16px rgba(255,107,53,.35)' }}>
            Sign In →
          </button>
        </form>
      </div>
    </div>
  );

  return <>{children}</>;
}

const CATS = ['general','frameworks','sales','technical'];
const CAT_COLOR: Record<string,{bg:string,color:string}> = {
  general:    {bg:'#f0f4ff',color:'#4060b0'},
  frameworks: {bg:'#f0fff8',color:'#1a7a50'},
  sales:      {bg:'#fff7f0',color:'#b45820'},
  technical:  {bg:'#f5f0ff',color:'#6040b0'},
};

type Question = { id:string; label:string; message:string; category:string; active:boolean; sort_order:number };

function Modal({ open, onClose, onSave, editing }: any) {
  const [f, setF] = useState({ label:'', message:'', category:'general', sort_order:99 });
  const [saving, setSaving] = useState(false);
  useEffect(() => { setF(editing ? { label:editing.label, message:editing.message, category:editing.category, sort_order:editing.sort_order } : { label:'', message:'', category:'general', sort_order:99 }); }, [editing, open]);
  if (!open) return null;
  const save = async () => { if (!f.label.trim() || !f.message.trim()) return; setSaving(true); await onSave({...f, sort_order:Number(f.sort_order)}); setSaving(false); };
  const inp = { padding:'9px 12px', border:'1.5px solid #e2e8f0', borderRadius:8, fontSize:'.87rem', color:'#1a2b40', fontFamily:'inherit', outline:'none', background:'#fff', width:'100%' };
  return (
    <div onClick={e => { if(e.target===e.currentTarget) onClose(); }} style={{ position:'fixed', inset:0, zIndex:999, background:'rgba(0,0,0,.45)', display:'flex', alignItems:'center', justifyContent:'center', padding:20 }}>
      <div style={{ background:'#fff', borderRadius:16, width:'100%', maxWidth:520, boxShadow:'0 30px 80px rgba(0,0,0,.2)' }}>
        <div style={{ padding:'22px 24px 18px', borderBottom:'1px solid #e2e8f0', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <h2 style={{ fontFamily:'Manrope,sans-serif', fontWeight:800, fontSize:'1.05rem', color:'#1a2b40' }}>{editing ? 'Edit' : 'Add'} Question</h2>
          <button onClick={onClose} style={{ background:'#f0f4f8', border:'none', cursor:'pointer', width:30, height:30, borderRadius:7, fontSize:16, display:'flex', alignItems:'center', justifyContent:'center' }}>✕</button>
        </div>
        <div style={{ padding:'22px 24px', display:'flex', flexDirection:'column', gap:14 }}>
          <div style={{ display:'flex', flexDirection:'column', gap:5 }}>
            <label style={{ fontSize:'.8rem', fontWeight:600, color:'#1a2b40' }}>Button Label *</label>
            <input value={f.label} onChange={e => setF(p=>({...p,label:e.target.value}))} placeholder="e.g. What is SecComply?" style={inp} />
            <span style={{ fontSize:'.72rem', color:'#64748b' }}>Shown as the quick-reply chip in the chatbot</span>
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:5 }}>
            <label style={{ fontSize:'.8rem', fontWeight:600, color:'#1a2b40' }}>Message Sent to AI *</label>
            <textarea value={f.message} onChange={e => setF(p=>({...p,message:e.target.value}))} placeholder="e.g. What is SecComply and what does it do?" rows={3} style={{ ...inp, resize:'vertical' }} />
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
            <div style={{ display:'flex', flexDirection:'column', gap:5 }}>
              <label style={{ fontSize:'.8rem', fontWeight:600, color:'#1a2b40' }}>Category</label>
              <select value={f.category} onChange={e => setF(p=>({...p,category:e.target.value}))} style={inp}>
                {CATS.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase()+c.slice(1)}</option>)}
              </select>
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:5 }}>
              <label style={{ fontSize:'.8rem', fontWeight:600, color:'#1a2b40' }}>Sort Order</label>
              <input type="number" value={f.sort_order} onChange={e => setF(p=>({...p,sort_order:Number(e.target.value)}))} min={1} max={999} style={inp} />
            </div>
          </div>
        </div>
        <div style={{ padding:'16px 24px', borderTop:'1px solid #e2e8f0', display:'flex', justifyContent:'flex-end', gap:10 }}>
          <button onClick={onClose} style={{ background:'transparent', color:'#64748b', border:'1px solid #e2e8f0', padding:'9px 18px', borderRadius:8, fontWeight:600, cursor:'pointer', fontFamily:'inherit' }}>Cancel</button>
          <button onClick={save} disabled={saving||!f.label.trim()||!f.message.trim()} style={{ background:'#e87d3e', color:'#fff', border:'none', padding:'9px 18px', borderRadius:8, fontWeight:600, cursor:'pointer', fontFamily:'inherit', opacity: saving||!f.label.trim()||!f.message.trim() ? .6 : 1 }}>
            {saving ? 'Saving…' : editing ? 'Update' : 'Save Question'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── PDF Upload Section ────────────────────────────────────
function PdfUpload() {
  const [uploading,   setUploading]   = useState(false);
  const [status,      setStatus]      = useState<{msg:string,ok:boolean}|null>(null);
  const [currentFile, setCurrentFile] = useState<string|null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Check if a PDF is already uploaded
    fetch('/api/questions') // just to warm up, we'll check knowledge separately
      .catch(() => {});
  }, []);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setStatus(null);
    try {
      const form = new FormData();
      form.append('pdf', file);
      const res  = await fetch('/api/upload-pdf', { method: 'POST', body: form });
      const data = await res.json();
      if (data.success) {
        setCurrentFile(file.name);
        setStatus({ msg: data.message, ok: true });
      } else {
        setStatus({ msg: data.error || 'Upload failed', ok: false });
      }
    } catch (err: any) {
      setStatus({ msg: err.message, ok: false });
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  }

  return (
    <div style={{ background:'#fff', borderRadius:14, border:'1px solid #e2e8f0', overflow:'hidden', marginBottom:0 }}>
      <div style={{ padding:'18px 22px', borderBottom:'1px solid #e2e8f0', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <div>
          <div style={{ fontFamily:'Manrope,sans-serif', fontWeight:800, color:'#1a2b40', fontSize:'.95rem', display:'flex', alignItems:'center', gap:8 }}>
            📄 Company Knowledge Base
          </div>
          <div style={{ fontSize:'.78rem', color:'#64748b', marginTop:2 }}>
            Upload your company PDF — the chatbot will only answer from this document
          </div>
        </div>
        {currentFile && (
          <span style={{ fontSize:'.75rem', background:'#f0fff8', color:'#1a7a50', border:'1px solid #bbf7d0', padding:'4px 12px', borderRadius:20, fontWeight:600 }}>
            ✓ {currentFile}
          </span>
        )}
      </div>

      <div style={{ padding:'24px 22px' }}>
        {/* Drop zone */}
        <label style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:12, padding:'32px 20px', border:'2px dashed #e2e8f0', borderRadius:12, cursor:'pointer', background:'#fafbfc', transition:'border-color .2s' }}
          onDragOver={e => e.preventDefault()}
          onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f && fileRef.current) { const dt = new DataTransfer(); dt.items.add(f); fileRef.current.files = dt.files; handleUpload({ target: { files: dt.files } } as any); } }}>
          <input ref={fileRef} type="file" accept=".pdf" onChange={handleUpload} style={{ display:'none' }} />
          <div style={{ width:48, height:48, background:'rgba(232,125,62,.1)', borderRadius:12, display:'flex', alignItems:'center', justifyContent:'center', fontSize:24 }}>📄</div>
          <div style={{ textAlign:'center' }}>
            <div style={{ fontFamily:'Manrope,sans-serif', fontWeight:700, color:'#1a2b40', marginBottom:4 }}>
              {uploading ? 'Uploading & extracting text…' : 'Click to upload or drag & drop'}
            </div>
            <div style={{ fontSize:'.8rem', color:'#64748b' }}>PDF files only · Max 10MB</div>
          </div>
          {!uploading && (
            <div style={{ background:'#e87d3e', color:'#fff', padding:'9px 22px', borderRadius:8, fontWeight:700, fontFamily:'Manrope,sans-serif', fontSize:'.85rem' }}>
              Choose PDF
            </div>
          )}
          {uploading && (
            <div style={{ display:'flex', gap:5, alignItems:'center' }}>
              {[0,1,2].map(i => <span key={i} style={{ width:8, height:8, borderRadius:'50%', background:'#e87d3e', display:'inline-block', animation:`tdot 1.1s ${i*.18}s infinite` }}/>)}
            </div>
          )}
        </label>

        {/* Status message */}
        {status && (
          <div style={{ marginTop:14, padding:'12px 16px', borderRadius:10, background: status.ok ? '#f0fff8' : '#fff5f5', border:`1px solid ${status.ok ? '#bbf7d0' : '#fca5a5'}`, color: status.ok ? '#1a7a50' : '#dc2626', fontSize:'.84rem', display:'flex', alignItems:'flex-start', gap:8 }}>
            <span style={{ fontSize:16, flexShrink:0 }}>{status.ok ? '✅' : '❌'}</span>
            <span>{status.msg}</span>
          </div>
        )}

        <div style={{ marginTop:14, padding:'12px 16px', borderRadius:10, background:'#f8faff', border:'1px solid #e2e8f0', fontSize:'.8rem', color:'#64748b', lineHeight:1.7 }}>
          💡 <strong>How it works:</strong> Upload your company brochure, product docs, or FAQ PDF. The chatbot will read only from this file and ignore outside information. Upload a new PDF anytime to update the knowledge base.
        </div>
      </div>
    </div>
  );
}

// ── Main Admin Page ───────────────────────────────────────
function AdminPageInner() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading,   setLoading]   = useState(true);
  const [filter,    setFilter]    = useState('all');
  const [search,    setSearch]    = useState('');
  const [modal,     setModal]     = useState(false);
  const [editing,   setEditing]   = useState<Question|null>(null);
  const [deleting,  setDeleting]  = useState<Question|null>(null);
  const [toast,     setToast]     = useState({ msg:'', show:false, ok:true });
  const [tab,       setTab]       = useState<'questions'|'knowledge'>('questions');

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    const r = await fetch('/api/questions'); const d = await r.json();
    setQuestions(d.data || []); setLoading(false);
  }

  const notify = (msg:string, ok=true) => { setToast({msg,show:true,ok}); setTimeout(()=>setToast(t=>({...t,show:false})),3000); };

  async function toggleActive(id:string, val:boolean) {
    await fetch(`/api/questions/${id}`,{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({active:val})});
    setQuestions(p => p.map(q => q.id===id ? {...q,active:val} : q));
    notify(val ? 'Activated ✓' : 'Hidden ✓');
  }

  async function handleSave(payload:any) {
    try {
      if (editing) {
        const r = await fetch(`/api/questions/${editing.id}`,{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});
        const d = await r.json(); setQuestions(p => p.map(q => q.id===editing.id ? d.data : q)); notify('Updated ✓');
      } else {
        const r = await fetch('/api/questions',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});
        const d = await r.json(); setQuestions(p => [...p, d.data]); notify('Added ✓');
      }
      setModal(false); setEditing(null);
    } catch { notify('Failed', false); }
  }

  async function handleDelete() {
    if (!deleting) return;
    await fetch(`/api/questions/${deleting.id}`,{method:'DELETE'});
    setQuestions(p => p.filter(q => q.id!==deleting.id)); setDeleting(null); notify('Deleted');
  }

  const shown = questions.filter(q => {
    const okCat  = filter==='all' || q.category===filter;
    const okSrch = !search || q.label.toLowerCase().includes(search.toLowerCase()) || q.message.toLowerCase().includes(search.toLowerCase());
    return okCat && okSrch;
  });

  return (
    <div style={{ display:'flex', minHeight:'100vh', fontFamily:'Inter,sans-serif', background:'#f0f4f8' }}>

      {/* Sidebar */}
      <aside style={{ width:240, background:'#0f1e36', display:'flex', flexDirection:'column', flexShrink:0, position:'sticky', top:0, height:'100vh' }}>
        <Link href="/" style={{ padding:'22px 20px', borderBottom:'1px solid rgba(255,255,255,.07)', display:'flex', alignItems:'center', gap:10, textDecoration:'none' }}>
          <div style={{ width:30, height:30, background:'linear-gradient(145deg,#e87d3e,#c45e25)', clipPath:'polygon(50% 0%,93% 25%,93% 75%,50% 100%,7% 75%,7% 25%)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
            <svg viewBox="0 0 24 24" fill="#fff" style={{width:14,height:14}}><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5L12 1z"/></svg>
          </div>
          <div>
            <div style={{ color:'#fff', fontFamily:'Manrope,sans-serif', fontWeight:800 }}>Sec<span style={{color:'#e87d3e'}}>Comply</span></div>
            <div style={{ fontSize:'.65rem', color:'#e87d3e', fontWeight:600, letterSpacing:'.1em', textTransform:'uppercase' }}>Admin Panel</div>
          </div>
        </Link>
        <nav style={{ padding:'16px 10px', flex:1 }}>
          <div style={{ fontSize:'.65rem', letterSpacing:'.12em', textTransform:'uppercase', color:'rgba(255,255,255,.25)', padding:'8px 12px 6px', fontWeight:600 }}>Chatbot</div>
          {[
            { key:'questions', icon:'💬', label:'Quick Questions' },
            { key:'knowledge', icon:'📄', label:'Knowledge Base' },
          ].map(item => (
            <button key={item.key} onClick={() => setTab(item.key as any)} style={{ display:'flex', width:'100%', alignItems:'center', gap:10, padding:'10px 12px', borderRadius:8, color: tab===item.key ? '#e87d3e' : 'rgba(255,255,255,.55)', background: tab===item.key ? 'rgba(232,125,62,.15)' : 'none', border:'none', cursor:'pointer', fontSize:'.875rem', fontWeight:600, marginBottom:2, fontFamily:'inherit', textAlign:'left' }}>
              <span>{item.icon}</span>{item.label}
            </button>
          ))}
        </nav>
        <div style={{ padding:'16px 20px', borderTop:'1px solid rgba(255,255,255,.07)' }}>
          <Link href="/" style={{ color:'rgba(255,255,255,.4)', textDecoration:'none', fontSize:'.8rem' }}>🏠 View Site</Link>
        </div>
      </aside>

      {/* Main */}
      <main style={{ flex:1, display:'flex', flexDirection:'column' }}>
        {/* Topbar */}
        <div style={{ background:'#fff', borderBottom:'1px solid #e2e8f0', padding:'0 32px', height:64, display:'flex', alignItems:'center', justifyContent:'space-between', position:'sticky', top:0, zIndex:10 }}>
          <div style={{ fontFamily:'Manrope,sans-serif', fontSize:'1.1rem', fontWeight:800, color:'#1a2b40' }}>
            {tab === 'questions' ? 'Quick Questions' : 'Knowledge Base'}
          </div>
          {tab === 'questions' && (
            <button onClick={() => { setEditing(null); setModal(true); }} style={{ background:'#e87d3e', color:'#fff', border:'none', padding:'9px 20px', borderRadius:8, fontWeight:700, cursor:'pointer', fontFamily:'Manrope,sans-serif', boxShadow:'0 2px 12px rgba(232,125,62,.3)' }}>+ Add Question</button>
          )}
        </div>

        <div style={{ padding:32, display:'flex', flexDirection:'column', gap:24 }}>

          {/* ── KNOWLEDGE BASE TAB ── */}
          {tab === 'knowledge' && <PdfUpload />}

          {/* ── QUESTIONS TAB ── */}
          {tab === 'questions' && (
            <>
              {/* Stats */}
              <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:16 }}>
                {[
                  { label:'Total',      val:questions.length,                              color:'#e87d3e' },
                  { label:'Active',     val:questions.filter(q=>q.active).length,          color:'#17b26a' },
                  { label:'Inactive',   val:questions.filter(q=>!q.active).length,         color:'#64748b' },
                  { label:'Categories', val:new Set(questions.map(q=>q.category)).size,    color:'#64748b' },
                ].map(s => (
                  <div key={s.label} style={{ background:'#fff', borderRadius:12, padding:'20px 22px', border:'1px solid #e2e8f0' }}>
                    <div style={{ fontSize:'.75rem', fontWeight:700, color:'#64748b', textTransform:'uppercase', letterSpacing:'.08em', marginBottom:8 }}>{s.label}</div>
                    <div style={{ fontFamily:'Manrope,sans-serif', fontSize:'2rem', fontWeight:800, color:s.color }}>{s.val}</div>
                  </div>
                ))}
              </div>

              {/* Table */}
              <div style={{ background:'#fff', borderRadius:14, border:'1px solid #e2e8f0', overflow:'hidden' }}>
                <div style={{ padding:'18px 22px', display:'flex', alignItems:'center', justifyContent:'space-between', borderBottom:'1px solid #e2e8f0' }}>
                  <div>
                    <div style={{ fontFamily:'Manrope,sans-serif', fontWeight:800, color:'#1a2b40', fontSize:'.95rem' }}>Manage Questions</div>
                    <div style={{ fontSize:'.78rem', color:'#64748b', marginTop:2 }}>Quick-reply buttons shown in the chatbot</div>
                  </div>
                  <input value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍  Search…" style={{ padding:'8px 12px', border:'1px solid #e2e8f0', borderRadius:8, fontSize:'.83rem', outline:'none', width:200, fontFamily:'inherit', color:'#1a2b40' }} />
                </div>
                <div style={{ display:'flex', gap:6, padding:'12px 22px', borderBottom:'1px solid #e2e8f0', background:'#fafbfc' }}>
                  {['all',...CATS].map(f => (
                    <button key={f} onClick={() => setFilter(f)} style={{ padding:'5px 14px', borderRadius:20, fontSize:'.78rem', fontWeight:600, cursor:'pointer', border:`1.5px solid ${filter===f ? 'rgba(232,125,62,.4)' : '#e2e8f0'}`, background: filter===f ? 'rgba(232,125,62,.1)' : 'none', color: filter===f ? '#e87d3e' : '#64748b', fontFamily:'inherit' }}>
                      {f.charAt(0).toUpperCase()+f.slice(1)}
                    </button>
                  ))}
                </div>

                {loading ? (
                  <div style={{ padding:60, textAlign:'center', color:'#94a3b8' }}>Loading…</div>
                ) : shown.length === 0 ? (
                  <div style={{ padding:60, textAlign:'center', color:'#94a3b8' }}>
                    <div style={{ fontSize:36, marginBottom:12 }}>🔍</div><p>No questions found</p>
                  </div>
                ) : (
                  <table style={{ width:'100%', borderCollapse:'collapse' }}>
                    <thead>
                      <tr style={{ background:'#fafbfc' }}>
                        {['Question','Category','Order','Active','Actions'].map(h => (
                          <th key={h} style={{ padding:'11px 20px', textAlign:'left', fontSize:'.72rem', fontWeight:700, color:'#64748b', textTransform:'uppercase', letterSpacing:'.08em', borderBottom:'1px solid #e2e8f0' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {shown.map(q => (
                        <tr key={q.id} style={{ borderBottom:'1px solid #f0f4f8' }}>
                          <td style={{ padding:'14px 20px' }}>
                            <div style={{ fontWeight:600, color:'#1a2b40', fontSize:'.86rem' }}>{q.label}</div>
                            <div style={{ color:'#64748b', fontSize:'.8rem', marginTop:3, maxWidth:320, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{q.message}</div>
                          </td>
                          <td style={{ padding:'14px 20px' }}>
                            <span style={{ padding:'3px 10px', borderRadius:20, fontSize:'.72rem', fontWeight:700, textTransform:'capitalize', background:CAT_COLOR[q.category]?.bg||'#f0f4ff', color:CAT_COLOR[q.category]?.color||'#4060b0' }}>{q.category}</span>
                          </td>
                          <td style={{ padding:'14px 20px', fontSize:'.82rem', color:'#64748b' }}>{q.sort_order}</td>
                          <td style={{ padding:'14px 20px' }}>
                            <label style={{ position:'relative', width:38, height:22, cursor:'pointer', display:'inline-block' }}>
                              <input type="checkbox" checked={Boolean(q.active)} onChange={e => toggleActive(q.id, e.target.checked)} style={{ opacity:0, width:0, height:0 }} />
                              <span style={{ position:'absolute', inset:0, background:q.active?'#17b26a':'#cbd5e0', borderRadius:11, transition:'background .2s' }}>
                                <span style={{ position:'absolute', height:16, width:16, left:q.active?19:3, bottom:3, background:'#fff', borderRadius:'50%', transition:'left .2s', boxShadow:'0 1px 3px rgba(0,0,0,.15)' }} />
                              </span>
                            </label>
                          </td>
                          <td style={{ padding:'14px 20px' }}>
                            <div style={{ display:'flex', gap:8 }}>
                              <button onClick={() => { setEditing(q); setModal(true); }} style={{ width:30, height:30, borderRadius:7, border:'1px solid #e2e8f0', background:'#f8fafc', cursor:'pointer', fontSize:13 }}>✏️</button>
                              <button onClick={() => setDeleting(q)} style={{ width:30, height:30, borderRadius:7, border:'1px solid #fca5a5', background:'#fee2e2', cursor:'pointer', fontSize:13 }}>🗑️</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </>
          )}
        </div>
      </main>

      <Modal open={modal} onClose={() => { setModal(false); setEditing(null); }} onSave={handleSave} editing={editing} />

      {deleting && (
        <div style={{ position:'fixed', inset:0, zIndex:9998, background:'rgba(0,0,0,.45)', display:'flex', alignItems:'center', justifyContent:'center' }}>
          <div style={{ background:'#fff', borderRadius:14, padding:28, maxWidth:360, width:'90%', textAlign:'center', boxShadow:'0 20px 60px rgba(0,0,0,.2)' }}>
            <div style={{ width:48, height:48, background:'#fee2e2', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px', fontSize:22 }}>🗑️</div>
            <h3 style={{ fontFamily:'Manrope,sans-serif', fontWeight:800, marginBottom:8, color:'#1a2b40' }}>Delete this question?</h3>
            <p style={{ fontSize:'.86rem', color:'#64748b', lineHeight:1.6, marginBottom:22 }}>"{deleting.label}" will be permanently removed.</p>
            <div style={{ display:'flex', gap:10, justifyContent:'center' }}>
              <button onClick={() => setDeleting(null)} style={{ background:'transparent', color:'#64748b', border:'1px solid #e2e8f0', padding:'9px 18px', borderRadius:8, fontWeight:600, cursor:'pointer', fontFamily:'inherit' }}>Cancel</button>
              <button onClick={handleDelete} style={{ background:'#ef4444', color:'#fff', border:'none', padding:'9px 18px', borderRadius:8, fontWeight:600, cursor:'pointer', fontFamily:'inherit' }}>Delete</button>
            </div>
          </div>
        </div>
      )}

      <div style={{ position:'fixed', bottom:28, left:'50%', transform:`translateX(-50%) translateY(${toast.show?0:20}px)`, opacity:toast.show?1:0, transition:'all .3s', background:'#1a2b40', color:'#fff', padding:'12px 22px', borderRadius:10, fontSize:'.86rem', fontWeight:500, zIndex:9999, display:'flex', alignItems:'center', gap:8, boxShadow:'0 8px 30px rgba(0,0,0,.25)', pointerEvents:'none' }}>
        <span style={{ color:toast.ok?'#17b26a':'#ef4444' }}>{toast.ok?'✓':'✕'}</span>{toast.msg}
      </div>

      <style>{`@keyframes tdot{0%,80%,100%{transform:translateY(0)}40%{transform:translateY(-7px)}}`}</style>
    </div>
  );
}

export default function AdminPage() {
  return <AdminGate><AdminPageInner /></AdminGate>;
}
