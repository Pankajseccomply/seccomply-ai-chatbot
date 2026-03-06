import Link from 'next/link';

export default function Footer() {
  return (
    <footer style={{ position:'relative', zIndex:2, borderTop:'1px solid rgba(255,255,255,.07)', background:'#060d1a', marginTop:80 }}>
      <div style={{ maxWidth:1100, margin:'0 auto', padding:'64px 48px 32px', display:'grid', gridTemplateColumns:'2fr 1fr 1fr 1fr', gap:48 }}>
        <div>
          <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:16 }}>
            <div style={{ width:28, height:28, background:'linear-gradient(145deg,#e87d3e,#c45e25)', clipPath:'polygon(50% 0%,93% 25%,93% 75%,50% 100%,7% 75%,7% 25%)', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <svg viewBox="0 0 24 24" fill="#fff" style={{width:13,height:13}}><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5L12 1z"/></svg>
            </div>
            <span style={{ fontFamily:'Manrope,sans-serif', fontWeight:800, fontSize:'1.1rem' }}>Sec<span style={{color:'#e87d3e'}}>Comply</span></span>
          </div>
          <p style={{ fontSize:'.85rem', color:'#4a5a6a', lineHeight:1.7, maxWidth:260 }}>Turn compliance into a competitive advantage with AI-powered GRC automation.</p>
        </div>
        {[
          { title:'Product',    links:['Platform','Integrations','Pricing','Changelog'] },
          { title:'Company',    links:['About','Blog','Careers','Contact'] },
          { title:'Frameworks', links:['SOC 2','ISO 27001','HIPAA','GDPR'] },
        ].map(col => (
          <div key={col.title}>
            <div style={{ fontSize:'.72rem', fontWeight:700, letterSpacing:'.1em', textTransform:'uppercase', color:'#8899aa', marginBottom:18 }}>{col.title}</div>
            <ul style={{ listStyle:'none', display:'flex', flexDirection:'column', gap:10 }}>
              {col.links.map(l => <li key={l}><Link href="#" style={{ color:'#4a5a6a', fontSize:'.86rem' }}>{l}</Link></li>)}
            </ul>
          </div>
        ))}
      </div>
      <div style={{ borderTop:'1px solid rgba(255,255,255,.05)', padding:'20px 48px', display:'flex', justifyContent:'space-between', fontSize:'.78rem', color:'#4a5a6a' }}>
        <span>© {new Date().getFullYear()} SecComply, Inc. All rights reserved.</span>
        <span>Made with ❤️ for compliance teams everywhere</span>
      </div>
    </footer>
  );
}
