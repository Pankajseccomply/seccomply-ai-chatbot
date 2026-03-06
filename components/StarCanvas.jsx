'use client';
import { useEffect, useRef } from 'react';

export default function StarCanvas() {
  const ref = useRef(null);
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext('2d');
    const resize = () => { c.width = innerWidth; c.height = innerHeight; };
    resize(); window.addEventListener('resize', resize);
    const stars = Array.from({ length: 220 }, () => ({ x:Math.random()*innerWidth, y:Math.random()*innerHeight, r:Math.random()*.9+.15, a:Math.random(), da:(Math.random()-.5)*.004 }));
    let raf;
    const frame = () => {
      ctx.clearRect(0,0,c.width,c.height);
      stars.forEach(s => { s.a+=s.da; if(s.a<0||s.a>1)s.da*=-1; ctx.beginPath(); ctx.arc(s.x,s.y,s.r,0,Math.PI*2); ctx.fillStyle=`rgba(180,210,255,${s.a*.75})`; ctx.fill(); });
      raf = requestAnimationFrame(frame);
    };
    frame();
    return () => { window.removeEventListener('resize',resize); cancelAnimationFrame(raf); };
  }, []);
  return <canvas ref={ref} style={{ position:'fixed', inset:0, zIndex:0, pointerEvents:'none' }} />;
}
