import Link from 'next/link';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import StarCanvas from '../components/StarCanvas';
import ShieldScene from '../components/ShieldScene';

const FRAMEWORKS = ['SOC 2', 'ISO 27001', 'HIPAA', 'GDPR', 'PCI DSS', 'NIST'];
const LOGOS      = ['T-Mobile', 'OpenAI', 'Brex', 'Asana', 'Notion', 'Figma'];

const STATS = [
  { val: '90%',  label: 'Manual tasks automated' },
  { val: '12×',  label: 'Faster questionnaire responses' },
  { val: '300+', label: 'Tool integrations' },
  { val: '50+',  label: 'Frameworks supported' },
];

const FEATURES = [
  { icon: '🤖', title: 'AI Automation',      desc: 'Auto-collect evidence and respond to questionnaires instantly.' },
  { icon: '📊', title: 'Live Monitoring',    desc: 'Real-time alerts when controls drift out of compliance.' },
  { icon: '🔗', title: '300+ Integrations', desc: 'AWS, GitHub, Okta, Jira, Slack — evidence collected automatically.' },
  { icon: '🛡️', title: 'Multi-Framework',   desc: 'SOC 2, ISO 27001, HIPAA, GDPR and more in one platform.' },
  { icon: '📋', title: 'Audit Ready',       desc: 'Dedicated auditor portal with automated evidence sharing.' },
  { icon: '⚡', title: 'Fast Certification', desc: '60% faster to certification than traditional methods.' },
];

const TESTIMONIALS = [
  { quote: "SecComply turned the promise of compliance automation into reality.", name: 'Jonathan Jaffe', role: 'CISO, Lemonade' },
  { quote: "We went from dreading SOC 2 audits to barely noticing them.", name: 'Sarah Chen', role: 'VP Engineering, Brex' },
  { quote: "HIPAA audit-ready in 3 weeks instead of 3 months.", name: 'Marcus Rivera', role: 'CTO, HealthStream' },
];

export default function HomePage() {
  return (
    <>
      <div style={{ position:'fixed', inset:0, zIndex:0, background:'radial-gradient(ellipse 80% 70% at 50% 45%,rgba(0,60,120,.22) 0%,transparent 65%),linear-gradient(180deg,#07101e,#060d1a)' }} />
      <StarCanvas />

      <div style={{ position:'relative', zIndex:1 }}>
        <Navbar />

        {/* HERO */}
        <section style={{ position:'relative', display:'flex', flexDirection:'column', alignItems:'center', textAlign:'center', padding:'80px 24px 60px', minHeight:'calc(100vh - 73px)' }}>
          <ShieldScene />
          <div style={{ position:'relative', zIndex:2, maxWidth:820, margin:'0 auto', animation:'fadeUp .7s ease both' }}>
            <h1 style={{ fontFamily:'Manrope,sans-serif', fontSize:'clamp(2.8rem,6vw,4.6rem)', fontWeight:900, lineHeight:1.08, letterSpacing:'-.03em', marginBottom:28 }}>
              <span style={{ display:'block', background:'linear-gradient(90deg,#f5a56a,#e87d3e)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>Compliance Automation</span>
              <span style={{ display:'block', color:'#5ce6b5' }}>Simplified</span>
            </h1>
            <div style={{ width:120, height:1.5, background:'linear-gradient(90deg,transparent,rgba(255,255,255,.2),transparent)', margin:'0 auto 28px' }} />
            <p style={{ fontSize:'1.05rem', color:'#8899aa', lineHeight:1.75, maxWidth:580, margin:'0 auto 44px' }}>
              Move fast, meet compliance goals quickly, and stay secure and audit-ready at all times. SecComply automates evidence collection, continuous monitoring, and audit management across 50+ frameworks.
            </p>
            <div style={{ display:'flex', gap:16, justifyContent:'center', flexWrap:'wrap', marginBottom:52 }}>
              <Link href="/contact" style={{ background:'#e87d3e', color:'#fff', padding:'14px 30px', borderRadius:8, fontSize:'.9rem', fontWeight:700, fontFamily:'Manrope,sans-serif', boxShadow:'0 4px 24px rgba(232,125,62,.35)' }}>Schedule a Demo →</Link>
              <Link href="#features" style={{ background:'rgba(255,255,255,.06)', color:'#fff', padding:'14px 30px', borderRadius:8, fontSize:'.9rem', fontWeight:600, border:'1px solid rgba(255,255,255,.12)' }}>▶ Explore Platform</Link>
            </div>
            <p style={{ fontSize:'.7rem', letterSpacing:'.16em', textTransform:'uppercase', color:'#8899aa', marginBottom:14, fontWeight:600 }}>Trusted Frameworks</p>
            <div style={{ display:'flex', justifyContent:'center', gap:10, flexWrap:'wrap' }}>
              {FRAMEWORKS.map(f => <span key={f} style={{ padding:'6px 16px', borderRadius:20, border:'1px solid rgba(255,255,255,.15)', color:'rgba(255,255,255,.7)', fontSize:'.8rem', background:'rgba(255,255,255,.04)' }}>{f}</span>)}
            </div>
          </div>
        </section>

        {/* LOGOS */}
        <section style={{ position:'relative', zIndex:2, padding:'40px 48px', borderTop:'1px solid rgba(255,255,255,.06)', textAlign:'center' }}>
          <p style={{ fontSize:'.72rem', letterSpacing:'.14em', textTransform:'uppercase', color:'#4a5a6a', marginBottom:24, fontWeight:600 }}>Trusted by leading companies</p>
          <div style={{ display:'flex', justifyContent:'center', gap:48, flexWrap:'wrap' }}>
            {LOGOS.map(n => <span key={n} style={{ fontFamily:'Manrope,sans-serif', fontSize:'1rem', fontWeight:800, color:'#4a5a6a' }}>{n}</span>)}
          </div>
        </section>

        {/* STATS */}
        <section style={{ position:'relative', zIndex:2, padding:'100px 48px' }}>
          <div style={{ maxWidth:1100, margin:'0 auto' }}>
            <p style={{ fontSize:'.72rem', letterSpacing:'.16em', textTransform:'uppercase', color:'#e87d3e', fontWeight:700, marginBottom:14 }}>By The Numbers</p>
            <h2 style={{ fontFamily:'Manrope,sans-serif', fontSize:'clamp(1.8rem,3.5vw,2.8rem)', fontWeight:800, marginBottom:52 }}>Results that speak for themselves</h2>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:24 }}>
              {STATS.map(s => (
                <div key={s.val} style={{ background:'rgba(255,255,255,.04)', border:'1px solid rgba(255,255,255,.08)', borderRadius:16, padding:'32px 28px', textAlign:'center' }}>
                  <div style={{ fontFamily:'Manrope,sans-serif', fontSize:'3rem', fontWeight:900, background:'linear-gradient(90deg,#f5a56a,#e87d3e)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text', marginBottom:10 }}>{s.val}</div>
                  <div style={{ fontSize:'.86rem', color:'#8899aa', lineHeight:1.6 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FEATURES */}
        <section id="features" style={{ position:'relative', zIndex:2, padding:'80px 48px 100px' }}>
          <div style={{ maxWidth:1100, margin:'0 auto' }}>
            <p style={{ fontSize:'.72rem', letterSpacing:'.16em', textTransform:'uppercase', color:'#e87d3e', fontWeight:700, marginBottom:14 }}>Platform Features</p>
            <h2 style={{ fontFamily:'Manrope,sans-serif', fontSize:'clamp(1.8rem,3.5vw,2.8rem)', fontWeight:800, marginBottom:52 }}>Everything you need to stay compliant</h2>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:24 }}>
              {FEATURES.map(f => (
                <div key={f.title} style={{ background:'rgba(255,255,255,.03)', border:'1px solid rgba(255,255,255,.07)', borderRadius:16, padding:'32px 28px' }}>
                  <div style={{ fontSize:'2rem', marginBottom:18 }}>{f.icon}</div>
                  <h3 style={{ fontFamily:'Manrope,sans-serif', fontSize:'1.05rem', fontWeight:800, marginBottom:12 }}>{f.title}</h3>
                  <p style={{ fontSize:'.88rem', color:'#8899aa', lineHeight:1.7 }}>{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section style={{ position:'relative', zIndex:2, padding:'80px 48px 100px' }}>
          <div style={{ maxWidth:1100, margin:'0 auto' }}>
            <p style={{ fontSize:'.72rem', letterSpacing:'.16em', textTransform:'uppercase', color:'#e87d3e', fontWeight:700, marginBottom:14 }}>Customer Stories</p>
            <h2 style={{ fontFamily:'Manrope,sans-serif', fontSize:'clamp(1.8rem,3.5vw,2.8rem)', fontWeight:800, marginBottom:52 }}>Loved by compliance teams</h2>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:24 }}>
              {TESTIMONIALS.map(t => (
                <div key={t.name} style={{ background:'rgba(255,255,255,.03)', border:'1px solid rgba(255,255,255,.07)', borderRadius:16, padding:'32px 28px', display:'flex', flexDirection:'column', gap:20 }}>
                  <div style={{ fontSize:'3rem', color:'#e87d3e', lineHeight:1, fontFamily:'Georgia,serif' }}>"</div>
                  <p style={{ fontSize:'.9rem', color:'#c0d0e0', lineHeight:1.75, flex:1 }}>{t.quote}</p>
                  <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                    <div style={{ width:40, height:40, borderRadius:'50%', background:'linear-gradient(135deg,#e87d3e,#c45e25)', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'Manrope,sans-serif', fontWeight:800, flexShrink:0 }}>{t.name[0]}</div>
                    <div>
                      <div style={{ fontFamily:'Manrope,sans-serif', fontWeight:700, fontSize:'.88rem' }}>{t.name}</div>
                      <div style={{ fontSize:'.78rem', color:'#8899aa', marginTop:2 }}>{t.role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section style={{ position:'relative', zIndex:2, padding:'80px 24px 120px', textAlign:'center' }}>
          <div style={{ maxWidth:640, margin:'0 auto', background:'linear-gradient(135deg,rgba(232,125,62,.12),rgba(92,230,181,.06))', border:'1px solid rgba(232,125,62,.2)', borderRadius:24, padding:'64px 48px' }}>
            <h2 style={{ fontFamily:'Manrope,sans-serif', fontSize:'clamp(1.8rem,3vw,2.6rem)', fontWeight:900, marginBottom:16, letterSpacing:'-.02em' }}>Ready to simplify compliance?</h2>
            <p style={{ fontSize:'1rem', color:'#8899aa', marginBottom:36 }}>Start your free 14-day trial. No credit card required.</p>
            <div style={{ display:'flex', gap:16, justifyContent:'center', flexWrap:'wrap' }}>
              <Link href="/contact" style={{ background:'#e87d3e', color:'#fff', padding:'14px 30px', borderRadius:8, fontWeight:700, fontFamily:'Manrope,sans-serif' }}>Start Free Trial →</Link>
              <Link href="/contact" style={{ background:'rgba(255,255,255,.06)', color:'#fff', padding:'14px 30px', borderRadius:8, fontWeight:600, border:'1px solid rgba(255,255,255,.25)' }}>Talk to Sales</Link>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
}
