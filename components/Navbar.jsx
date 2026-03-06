'use client';
import Link from 'next/link';

export default function Navbar() {
  return (
    <nav style={{ position:'relative', zIndex:10, display:'flex', alignItems:'center', justifyContent:'space-between', padding:'18px 48px', borderBottom:'1px solid rgba(255,255,255,.08)' }}>
      <Link href="/" style={{ display:'flex', alignItems:'center', gap:10 }}>
        <div style={{ width:34, height:34, background:'linear-gradient(145deg,#e87d3e,#c45e25)', clipPath:'polygon(50% 0%,93% 25%,93% 75%,50% 100%,7% 75%,7% 25%)', display:'flex', alignItems:'center', justifyContent:'center' }}>
          <svg viewBox="0 0 24 24" fill="#fff" style={{width:16,height:16}}><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5L12 1z"/></svg>
        </div>
        <span style={{ fontFamily:'Manrope,sans-serif', fontWeight:800, fontSize:'1.2rem', color:'#fff' }}>Sec<span style={{color:'#e87d3e'}}>Comply</span></span>
        <sup style={{ fontSize:'.55rem', color:'#8899aa', verticalAlign:'super' }}>™</sup>
      </Link>
      <ul style={{ display:'flex', gap:36, listStyle:'none' }}>
        <li><Link href="#features" style={{ color:'#8899aa', fontSize:'.9rem', fontWeight:500 }}>Features</Link></li>
        <li><Link href="#stats"    style={{ color:'#8899aa', fontSize:'.9rem', fontWeight:500 }}>Results</Link></li>
        <li><Link href="/contact"  style={{ color:'#8899aa', fontSize:'.9rem', fontWeight:500 }}>Contact</Link></li>
      </ul>
      <div style={{ display:'flex', alignItems:'center', gap:12 }}>
        <Link href="/admin" style={{ color:'#8899aa', fontSize:'.82rem', fontWeight:500, padding:'8px 14px', border:'1px solid rgba(255,255,255,.08)', borderRadius:7 }}>⚙ Admin</Link>
        <Link href="/contact" style={{ background:'#e87d3e', color:'#fff', padding:'11px 22px', borderRadius:8, fontSize:'.875rem', fontWeight:700, fontFamily:'Manrope,sans-serif', boxShadow:'0 4px 20px rgba(232,125,62,.3)' }}>Book Demo →</Link>
      </div>
    </nav>
  );
}
