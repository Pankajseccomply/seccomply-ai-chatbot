'use client';
import { useEffect, useRef } from 'react';

export default function ShieldScene() {
  const ref = useRef(null);
  useEffect(() => {
    const wrap = ref.current; if (!wrap) return;
    const pts = [[50,2],[80,14],[96,38],[92,68],[72,90],[50,100],[28,90],[8,68],[4,38],[20,14],[35,8],[65,8]];
    pts.forEach(([x,y]) => {
      const d = document.createElement('div');
      const sz = (Math.random()*3+1.5).toFixed(1);
      d.style.cssText = `position:absolute;border-radius:50%;background:rgba(100,200,255,.7);box-shadow:0 0 4px rgba(100,200,255,.5);width:${sz}px;height:${sz}px;left:${x}%;top:${y}%;transform:translate(-50%,-50%);animation:twinkle ${(Math.random()*2+2.5).toFixed(1)}s ${(Math.random()*2).toFixed(2)}s infinite ease-in-out`;
      wrap.appendChild(d);
    });
    for (let i=0;i<30;i++) {
      const d = document.createElement('div');
      const sz = (Math.random()*2+.8).toFixed(1);
      d.style.cssText = `position:absolute;border-radius:50%;background:rgba(0,200,255,${(Math.random()*.5+.3).toFixed(2)});width:${sz}px;height:${sz}px;left:${(Math.random()*90+5).toFixed(1)}%;top:${(Math.random()*90+5).toFixed(1)}%;animation:twinkle ${(Math.random()*3+2).toFixed(1)}s ${(Math.random()*3).toFixed(2)}s infinite ease-in-out`;
      wrap.appendChild(d);
    }
    return () => { wrap.innerHTML=''; };
  }, []);
  return (
    <div style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-56%)', width:'min(700px,90vw)', aspectRatio:'1', pointerEvents:'none', zIndex:0 }}>
      <div style={{ position:'absolute', inset:0, borderRadius:'50%', border:'1.5px solid rgba(0,180,220,.18)' }} />
      <div style={{ position:'absolute', width:'62%', height:'78%', top:'11%', left:'19%', clipPath:'polygon(50% 0%,97% 22%,97% 72%,50% 100%,3% 72%,3% 22%)', boxShadow:'inset 0 0 0 1.5px rgba(30,200,240,.25)', background:'radial-gradient(ellipse 80% 60% at 50% 40%,rgba(0,140,200,.08) 0%,transparent 70%)' }} />
      <div ref={ref} style={{ position:'absolute', inset:0 }} />
    </div>
  );
}
