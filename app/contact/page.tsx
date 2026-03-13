'use client';
import { useState } from 'react';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import StarCanvas from '../../components/StarCanvas';

export default function ContactPage() {
  const [form, setForm]  = useState({ name:'', email:'', company:'', message:'' });
  const [done, setDone]  = useState(false);

  return (
    <>
      <div style={{ position:'fixed', inset:0, zIndex:0, background:'linear-gradient(180deg,#07101e,#060d1a)' }} />
      <StarCanvas />
      <div style={{ position:'relative', zIndex:1 }}>
        <Navbar />
        <section style={{ maxWidth:1100, margin:'0 auto', padding:'100px 48px', display:'grid', gridTemplateColumns:'1fr 1fr', gap:80 }}>

          {/* Left */}
          <div>
            <p style={{ fontSize:'.72rem', letterSpacing:'.16em', textTransform:'uppercase', color:'#e87d3e', fontWeight:700, marginBottom:14 }}>Get In Touch</p>
            <h1 style={{ fontFamily:'Manrope,sans-serif', fontSize:'clamp(2.4rem,4vw,3.4rem)', fontWeight:900, letterSpacing:'-.03em', marginBottom:20, lineHeight:1.1 }}>
              Book a <span style={{ color:'#e87d3e' }}>Demo</span>
            </h1>
            <p style={{ fontSize:'.95rem', color:'#8899aa', lineHeight:1.75, marginBottom:40 }}>
              See how SecComply can help your team achieve compliance faster. We'll walk you through the platform and answer all your questions.
            </p>
            {[
              { icon:'📧', label:'Email',    val:'hello@seccomply.io' },
              { icon:'📅', label:'Schedule', val:'Calendly link available after signup' },
              { icon:'💬', label:'Chat',     val:'Use the chatbot → bottom right' },
            ].map(i => (
              <div key={i.label} style={{ display:'flex', alignItems:'center', gap:16, marginBottom:20 }}>
                <span style={{ width:40, height:40, borderRadius:10, background:'rgba(232,125,62,.15)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.1rem', flexShrink:0 }}>{i.icon}</span>
                <div>
                  <div style={{ fontSize:'.72rem', color:'#8899aa', fontWeight:600, textTransform:'uppercase', letterSpacing:'.08em' }}>{i.label}</div>
                  <div style={{ fontSize:'.88rem', marginTop:2 }}>{i.val}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Right — form */}
          {done ? (
            <div style={{ background:'rgba(255,255,255,.04)', border:'1px solid rgba(255,255,255,.08)', borderRadius:20, padding:'60px 36px', textAlign:'center', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:16 }}>
              <div style={{ fontSize:'3.5rem' }}>🎉</div>
              <h2 style={{ fontFamily:'Manrope,sans-serif', fontWeight:800, fontSize:'1.4rem' }}>We'll be in touch!</h2>
              <p style={{ color:'#8899aa' }}>Thanks for reaching out. Our team will contact you within 1 business day.</p>
              <Link href="/" style={{ marginTop:16, background:'#e87d3e', color:'#fff', padding:'12px 28px', borderRadius:8, fontWeight:700, fontFamily:'Manrope,sans-serif' }}>← Back to Home</Link>
            </div>
          ) : (
            <div style={{ background:'rgba(255,255,255,.04)', border:'1px solid rgba(255,255,255,.08)', borderRadius:20, padding:'40px 36px', display:'flex', flexDirection:'column', gap:18 }}>
              <h2 style={{ fontFamily:'Manrope,sans-serif', fontWeight:800, fontSize:'1.3rem' }}>Request a Demo</h2>
              <p style={{ fontSize:'.86rem', color:'#8899aa' }}>We'll reach out within 24 hours.</p>
              {[
                { key:'name',    label:'Full Name',   type:'text',  ph:'Jane Smith' },
                { key:'email',   label:'Work Email',  type:'email', ph:'jane@company.com' },
                { key:'company', label:'Company',     type:'text',  ph:'Acme Corp' },
              ].map(f => (
                <div key={f.key} style={{ display:'flex', flexDirection:'column', gap:6 }}>
                  <label style={{ fontSize:'.8rem', fontWeight:600, color:'#c0d0e0' }}>{f.label}</label>
                  <input type={f.type} placeholder={f.ph} value={(form as any)[f.key]} onChange={e => setForm(p => ({...p,[f.key]:e.target.value}))} required style={{ padding:'11px 14px', background:'rgba(255,255,255,.06)', border:'1px solid rgba(255,255,255,.12)', borderRadius:9, fontSize:'.88rem', color:'#f0f4ff', fontFamily:'inherit', outline:'none' }} />
                </div>
              ))}
              <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
                <label style={{ fontSize:'.8rem', fontWeight:600, color:'#c0d0e0' }}>Target Framework</label>
                <textarea placeholder="e.g. SOC 2, ISO 27001, HIPAA…" rows={3} value={form.message} onChange={e => setForm(p => ({...p,message:e.target.value}))} style={{ padding:'11px 14px', background:'rgba(255,255,255,.06)', border:'1px solid rgba(255,255,255,.12)', borderRadius:9, fontSize:'.88rem', color:'#f0f4ff', fontFamily:'inherit', outline:'none', resize:'vertical' }} />
              </div>
              <button onClick={() => setDone(true)} style={{ background:'#e87d3e', color:'#fff', border:'none', padding:'13px 28px', borderRadius:8, fontSize:'.92rem', fontWeight:700, fontFamily:'Manrope,sans-serif', cursor:'pointer', boxShadow:'0 4px 20px rgba(232,125,62,.35)' }}>Book My Demo →</button>
            </div>
          )}
        </section>
        <Footer />
      </div>
    </>
  );
}




