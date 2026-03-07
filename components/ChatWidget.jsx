'use client';
import { useState, useEffect, useRef } from 'react';

const LANGUAGES = [
  { code: 'en', label: 'English',  voice: 'en-US' },
  { code: 'hi', label: 'हिंदी',    voice: 'hi-IN' },
  { code: 'mr', label: 'मराठी',    voice: 'mr-IN' },
  { code: 'fr', label: 'Français', voice: 'fr-FR' },
  { code: 'de', label: 'Deutsch',  voice: 'de-DE' },
  { code: 'es', label: 'Español',  voice: 'es-ES' },
  { code: 'ar', label: 'العربية',  voice: 'ar-SA' },
  { code: 'zh', label: '中文',      voice: 'zh-CN' },
  { code: 'ja', label: '日本語',    voice: 'ja-JP' },
];

const WELCOME_TEXT = "Hi! I'm the SecComply AI assistant. Welcome to our platform! How can I help you today?";

const IDLE_PROMPTS = {
  en: ["Is there a specific framework you're working towards?", "Would you like to see a live demo?", "Any questions I can help with?"],
  hi: ["क्या आप किसी framework पर काम कर रहे हैं?", "क्या मैं कुछ और मदद कर सकता हूं?"],
  mr: ["तुम्हाला काही प्रश्न आहेत का?", "मी आणखी कशात मदत करू?"],
  fr: ["Une question sur la conformité ?", "Puis-je vous aider avec autre chose ?"],
  de: ["Haben Sie noch Fragen?", "Kann ich Ihnen weiterhelfen?"],
  es: ["¿Tiene alguna pregunta?", "¿En qué más puedo ayudarle?"],
  ar: ["هل لديك أسئلة أخرى؟", "كيف يمكنني مساعدتك؟"],
  zh: ["还有其他问题吗？", "我能帮您什么？"],
  ja: ["他にご質問はありますか？", "何かお手伝いできますか？"],
};

// ── Modern AI Bot Icon (SVG face) ─────────────────────────
// size: 'fab' | 'header' | 'bubble'
function BotIcon({ size = 'bubble', animate = false }) {
  const s = size === 'fab' ? 62 : size === 'header' ? 42 : 28;
  const eyeR = size === 'fab' ? 4.5 : size === 'header' ? 3 : 2;
  const eyeY = size === 'fab' ? 21 : size === 'header' ? 14 : 10;
  const eyeX = size === 'fab' ? 9  : size === 'header' ? 6  : 4;
  const cx   = s / 2;

  return (
    <div style={{
      width: s, height: s, borderRadius: size === 'bubble' ? 8 : size === 'header' ? 13 : '50%',
      background: 'linear-gradient(135deg, #ff8c42 0%, #e8612e 40%, #c0392b 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      position: 'relative', overflow: 'visible',
      boxShadow: size === 'fab'
        ? '0 0 0 0 rgba(232,97,46,.5), 0 8px 32px rgba(232,97,46,.55)'
        : size === 'header'
        ? '0 0 24px rgba(232,97,46,.5), 0 4px 12px rgba(0,0,0,.3)'
        : '0 2px 10px rgba(232,97,46,.4)',
    }}>
      {/* Glossy shine overlay */}
      <div style={{ position:'absolute', top:0, left:0, right:0, height:'50%', borderRadius: size === 'bubble' ? '8px 8px 0 0' : size === 'header' ? '13px 13px 0 0' : '50% 50% 0 0', background:'linear-gradient(180deg, rgba(255,255,255,.18) 0%, rgba(255,255,255,0) 100%)', pointerEvents:'none' }}/>

      {/* SVG face */}
      <svg width={s * 0.72} height={s * 0.72} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Antenna */}
        <line x1="16" y1="1" x2="16" y2="5" stroke="rgba(255,255,255,.9)" strokeWidth="1.6" strokeLinecap="round"/>
        <circle cx="16" cy="1" r="1.2" fill="rgba(255,255,255,.9)">
          {animate && <animate attributeName="opacity" values="1;0.3;1" dur="1.8s" repeatCount="indefinite"/>}
        </circle>

        {/* Head */}
        <rect x="4" y="6" width="24" height="20" rx="6" fill="rgba(255,255,255,.15)" stroke="rgba(255,255,255,.35)" strokeWidth="1.2"/>

        {/* Eyes */}
        <rect x="8.5" y="12" width="5" height="5" rx="2" fill="white">
          {animate && <animate attributeName="scaleY" values="1;0.1;1" dur="3.5s" begin="1s" repeatCount="indefinite"/>}
        </rect>
        <rect x="18.5" y="12" width="5" height="5" rx="2" fill="white">
          {animate && <animate attributeName="scaleY" values="1;0.1;1" dur="3.5s" begin="1s" repeatCount="indefinite"/>}
        </rect>

        {/* Eye glint */}
        <circle cx="10.5" cy="13.5" r="1" fill="rgba(255,180,80,.9)"/>
        <circle cx="20.5" cy="13.5" r="1" fill="rgba(255,180,80,.9)"/>

        {/* Mouth — friendly smile */}
        <path d="M10 21 Q16 26 22 21" stroke="white" strokeWidth="1.8" strokeLinecap="round" fill="none"/>

        {/* Cheek dots */}
        <circle cx="8"  cy="20" r="1.5" fill="rgba(255,255,255,.2)"/>
        <circle cx="24" cy="20" r="1.5" fill="rgba(255,255,255,.2)"/>

        {/* Side bolts */}
        <rect x="1.5" y="12" width="2.5" height="4" rx="1.2" fill="rgba(255,255,255,.4)"/>
        <rect x="28"  y="12" width="2.5" height="4" rx="1.2" fill="rgba(255,255,255,.4)"/>
      </svg>

      {/* Animated orbit ring — only for header size */}
      {size === 'header' && (
        <div style={{ position:'absolute', inset:-5, borderRadius:'50%', border:'1.5px dashed rgba(255,180,80,.35)', animation:'orbitSpin 8s linear infinite', pointerEvents:'none' }}/>
      )}
    </div>
  );
}

// ── FAB Icon (open/close) ─────────────────────────────────
function FabIcon({ open, animate }) {
  return (
    <div style={{ position:'relative', width:62, height:62, display:'flex', alignItems:'center', justifyContent:'center' }}>
      {/* Pulsing glow rings */}
      {!open && <>
        <div style={{ position:'absolute', inset:-6,  borderRadius:'50%', border:'2px solid rgba(232,97,46,.3)', animation:'fabRing 2.4s ease-out infinite' }}/>
        <div style={{ position:'absolute', inset:-12, borderRadius:'50%', border:'2px solid rgba(232,97,46,.15)', animation:'fabRing 2.4s .6s ease-out infinite' }}/>
      </>}
      {open
        ? <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        : <BotIcon size="fab" animate={animate} />
      }
    </div>
  );
}

// ── Small bubble avatar ───────────────────────────────────
function BubbleAvatar() {
  return <BotIcon size="bubble" />;
}

function formatText(text) {
  const lines = text.split('\n');
  let html = ''; let inList = false;
  for (const line of lines) {
    const t = line.trim();
    if (t.startsWith('- ') || t.startsWith('* ')) {
      if (!inList) { html += '<ul style="padding-left:16px;margin:6px 0">'; inList = true; }
      html += `<li style="margin:3px 0">${t.slice(2)}</li>`;
    } else {
      if (inList) { html += '</ul>'; inList = false; }
      html += t === '' ? '<br/>' : line + '<br/>';
    }
  }
  if (inList) html += '</ul>';
  return html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/<br\/>$/, '');
}

function useVoiceInput(onResult, onInterim, langVoice) {
  const [state,   setState]   = useState('idle');
  const [interim, setInterim] = useState('');
  const recRef = useRef(null);
  function start() {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { alert('Voice input requires Chrome or Edge.'); return; }
    const rec = new SR();
    rec.lang = langVoice; rec.interimResults = true; rec.maxAlternatives = 1; rec.continuous = false;
    rec.onstart  = () => setState('listening');
    rec.onresult = e => {
      const transcript = Array.from(e.results).map(r => r[0].transcript).join('');
      const isFinal    = e.results[e.results.length - 1].isFinal;
      if (isFinal) { setState('processing'); setInterim(''); setTimeout(() => { onResult(transcript); setState('idle'); }, 300); }
      else { setInterim(transcript); onInterim?.(transcript); }
    };
    rec.onerror = () => { setState('idle'); setInterim(''); };
    rec.onend   = () => { setState('idle'); setInterim(''); };
    rec.start(); recRef.current = rec;
  }
  function stop() { recRef.current?.stop(); setState('idle'); setInterim(''); }
  return { state, interim, start, stop };
}

function Waveform({ active }) {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:3, height:22 }}>
      {[1,2,3,4,5,6,7].map(i => (
        <div key={i} style={{ width:3, borderRadius:3, background: active ? '#fff' : 'rgba(255,255,255,.4)', height: active ? `${Math.sin(i*0.8)*10+12}px` : '5px', animation: active ? `wave ${0.6+i*0.08}s ${i*0.05}s ease-in-out infinite alternate` : 'none', transition:'height .3s ease' }}/>
      ))}
      <style>{`@keyframes wave{from{transform:scaleY(.4)}to{transform:scaleY(1.4)}}`}</style>
    </div>
  );
}

function MicButton({ voiceState, onStart, onStop }) {
  const isListening  = voiceState === 'listening';
  const isProcessing = voiceState === 'processing';
  return (
    <button onClick={isListening ? onStop : onStart} title={isListening ? 'Stop' : 'Click to speak'} style={{ position:'relative', width:44, height:44, borderRadius:'50%', flexShrink:0, border:'none', cursor:'pointer', background: isListening ? 'linear-gradient(135deg,#ff4757,#c0392b)' : isProcessing ? 'linear-gradient(135deg,#f39c12,#e67e22)' : 'linear-gradient(135deg,#e87d3e,#c45e25)', color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', boxShadow: isListening ? '0 0 0 6px rgba(255,71,87,.2),0 4px 14px rgba(255,71,87,.4)' : '0 2px 10px rgba(232,125,62,.35)', transition:'all .25s ease' }}>
      {isListening && <>
        <span style={{ position:'absolute', inset:-8,  borderRadius:'50%', border:'2px solid rgba(255,71,87,.4)', animation:'micRing 1.2s ease-out infinite' }}/>
        <span style={{ position:'absolute', inset:-14, borderRadius:'50%', border:'2px solid rgba(255,71,87,.2)', animation:'micRing 1.2s .4s ease-out infinite' }}/>
      </>}
      {isListening  && <Waveform active />}
      {isProcessing && (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round">
          <path d="M12 2a10 10 0 0 1 10 10"><animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur=".7s" repeatCount="indefinite"/></path>
        </svg>
      )}
      {!isListening && !isProcessing && (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <rect x="9" y="2" width="6" height="12" rx="3"/>
          <path d="M5 10a7 7 0 0 0 14 0"/>
          <line x1="12" y1="19" x2="12" y2="22"/>
          <line x1="9" y1="22" x2="15" y2="22"/>
        </svg>
      )}
      <style>{`@keyframes micRing{0%{transform:scale(1);opacity:1}100%{transform:scale(1.6);opacity:0}}`}</style>
    </button>
  );
}

export default function ChatWidget() {
  const [open,         setOpen]         = useState(false);
  const [messages,     setMessages]     = useState([]);
  const [quickBtns,    setQuickBtns]    = useState([]);
  const [input,        setInput]        = useState('');
  const [typing,       setTyping]       = useState(false);
  const [showQuick,    setShowQuick]    = useState(true);
  const [suggestions,  setSuggestions]  = useState([]);
  const [history,      setHistory]      = useState([]);
  const [lang,         setLang]         = useState(LANGUAGES[0]);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [speaking,     setSpeaking]     = useState(null);
  const [interimText,  setInterimText]  = useState('');
  const [fabAnimate,   setFabAnimate]   = useState(false);

  const msgsRef      = useRef(null);
  const inited       = useRef(false);
  const sessionId    = useRef('sess_' + Math.random().toString(36).slice(2));
  const proactiveRef = useRef(null);
  const idleFired    = useRef(false);
  const askedSet     = useRef(new Set());
  const msgCount     = useRef(0);

  const voice = useVoiceInput(
    (text) => { setInput(text); setInterimText(''); },
    (t)    => setInterimText(t),
    lang.voice
  );

  // Auto-open + animate FAB after 1.5s
  useEffect(() => {
    const t1 = setTimeout(() => { setFabAnimate(true); setOpen(true); }, 1500);
    return () => clearTimeout(t1);
  }, []);

  useEffect(() => {
    if (msgsRef.current) msgsRef.current.scrollTop = msgsRef.current.scrollHeight;
  }, [messages, typing, suggestions]);

  useEffect(() => {
    if (!open || inited.current) return;
    inited.current = true;
    fetch('/api/questions?active=true').then(r => r.json()).then(d => setQuickBtns((d.data || []).slice(0, 5))).catch(() => {});
    setTimeout(() => {
      addBot(WELCOME_TEXT);
      speakText(WELCOME_TEXT, lang.voice);
    }, 500);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    clearTimeout(proactiveRef.current);
    if (messages.length > 0 && !typing && !idleFired.current) {
      proactiveRef.current = setTimeout(() => {
        if (idleFired.current) return;
        idleFired.current = true;
        const pool   = IDLE_PROMPTS[lang.code] || IDLE_PROMPTS['en'];
        addBot(pool[Math.floor(Math.random() * pool.length)]);
      }, 90000);
    }
    return () => clearTimeout(proactiveRef.current);
  }, [messages, open, typing]);

  function speakText(text, voiceCode) {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const plain = text.replace(/\*\*/g,'').replace(/\*/g,'').replace(/💬/g,'').replace(/<[^>]+>/g,'');
    const utt   = new SpeechSynthesisUtterance(plain);
    utt.lang = voiceCode; utt.rate = 0.95;
    utt.onend = () => setSpeaking(null);
    window.speechSynthesis.speak(utt);
  }

  const ts      = () => new Date().toLocaleTimeString([], { hour:'2-digit', minute:'2-digit' });
  const addBot  = t  => setMessages(p => [...p, { id: Date.now()+Math.random(), role:'bot',  text:t, time:ts() }]);
  const addUser = t  => setMessages(p => [...p, { id: Date.now()+Math.random(), role:'user', text:t, time:ts() }]);

  async function send(text) {
    if (!text?.trim() || typing) return;
    clearTimeout(proactiveRef.current);
    askedSet.current.add(text.toLowerCase().trim());
    setInput(''); setInterimText(''); setShowQuick(false); setSuggestions([]);
    addUser(text);
    msgCount.current += 1;
    const next = [...history, { role:'user', content:text }];
    setHistory(next); setTyping(true);
    try {
      const res   = await fetch('/api/chat', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ messages:next, session_id:sessionId.current, language:lang.label, msg_count:msgCount.current }) });
      const d     = await res.json();
      const reply = d.reply || 'Sorry, something went wrong.';
      const newSuggestions = msgCount.current >= 2
        ? (d.suggestions || []).filter(s => !askedSet.current.has(s.toLowerCase().trim()))
        : [];
      setHistory(p => [...p, { role:'assistant', content:reply }]);
      addBot(reply);
      if (newSuggestions.length > 0) setTimeout(() => setSuggestions(newSuggestions), 800);
    } catch { addBot('Something went wrong. Please try again!'); }
    finally  { setTyping(false); }
  }

  function toggleSpeak(msg) {
    if (!window.speechSynthesis) return;
    if (speaking === msg.id) { window.speechSynthesis.cancel(); setSpeaking(null); return; }
    window.speechSynthesis.cancel();
    setSpeaking(msg.id);
    const plain = msg.text.replace(/\*\*/g,'').replace(/\*/g,'').replace(/💬/g,'');
    const utt   = new SpeechSynthesisUtterance(plain);
    utt.lang  = lang.voice; utt.rate = 0.95;
    utt.onend = () => setSpeaking(null);
    window.speechSynthesis.speak(utt);
  }

  const displayInput = interimText || input;
  const placeholder  =
    voice.state === 'listening'   ? '🎤 Listening… speak now'
    : voice.state === 'processing'? '⚙️ Processing your voice…'
    : lang.code === 'hi' ? 'अनुपालन के बारे में पूछें…'
    : lang.code === 'mr' ? 'अनुपालनाबद्दल विचारा…'
    : lang.code === 'ar' ? 'اسأل عن الامتثال…'
    : lang.code === 'fr' ? 'Posez une question…'
    : lang.code === 'es' ? 'Pregunta sobre cumplimiento…'
    : lang.code === 'de' ? 'Frage zur Compliance…'
    : lang.code === 'zh' ? '询问合规问题…'
    : lang.code === 'ja' ? 'コンプライアンスについて質問…'
    : 'Type or click 🎤 to speak…';

  return (
    <>
      {/* FAB */}
      <button
        onClick={() => setOpen(o => !o)}
        style={{ position:'fixed', bottom:28, right:28, zIndex:9999, width:62, height:62, borderRadius:'50%', background:'linear-gradient(135deg,#ff8c42,#e8612e,#c0392b)', border:'none', cursor:'pointer', padding:0, display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 8px 32px rgba(232,97,46,.55)', transition:'transform .2s ease', animation:'fabFloat 3s ease-in-out infinite' }}
        onMouseEnter={e => e.currentTarget.style.transform='scale(1.08)'}
        onMouseLeave={e => e.currentTarget.style.transform='scale(1)'}
      >
        {!open && <span style={{ position:'absolute', top:-2, right:-2, zIndex:2, width:20, height:20, borderRadius:'50%', background:'#ff3355', border:'2px solid #07101e', fontSize:10, fontWeight:800, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center' }}>1</span>}
        {!open && <>
          <span style={{ position:'absolute', inset:-8,  borderRadius:'50%', border:'2px solid rgba(232,97,46,.3)', animation:'fabRing 2.4s ease-out infinite' }}/>
          <span style={{ position:'absolute', inset:-14, borderRadius:'50%', border:'2px solid rgba(232,97,46,.15)', animation:'fabRing 2.4s .7s ease-out infinite' }}/>
        </>}
        {open
          ? <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          : (
            /* FAB bot face */
            <svg width="36" height="36" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <line x1="16" y1="1" x2="16" y2="5" stroke="rgba(255,255,255,.9)" strokeWidth="1.6" strokeLinecap="round"/>
              <circle cx="16" cy="1" r="1.4" fill="white"><animate attributeName="opacity" values="1;0.2;1" dur="1.6s" repeatCount="indefinite"/></circle>
              <rect x="3" y="5.5" width="26" height="21" rx="7" fill="rgba(255,255,255,.13)" stroke="rgba(255,255,255,.4)" strokeWidth="1.2"/>
              <rect x="7.5" y="11" width="5.5" height="5.5" rx="2.5" fill="white"/>
              <rect x="19" y="11" width="5.5" height="5.5" rx="2.5" fill="white"/>
              <circle cx="9.8" cy="12.5" r="1.2" fill="rgba(255,200,80,1)"/>
              <circle cx="21.3" cy="12.5" r="1.2" fill="rgba(255,200,80,1)"/>
              <path d="M9.5 21.5 Q16 27 22.5 21.5" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none"/>
              <rect x="0.5" y="11" width="3" height="5" rx="1.5" fill="rgba(255,255,255,.4)"/>
              <rect x="28.5" y="11" width="3" height="5" rx="1.5" fill="rgba(255,255,255,.4)"/>
            </svg>
          )
        }
      </button>

      {open && (
        <div style={{ position:'fixed', bottom:108, right:28, zIndex:9998, width:414, maxHeight:645, borderRadius:22, overflow:'hidden', display:'flex', flexDirection:'column', boxShadow:'0 32px 100px rgba(0,0,0,.55),0 0 0 1px rgba(255,255,255,.08)', animation:'slideUp .32s cubic-bezier(.34,1.56,.64,1)' }}>

          {/* Header */}
          <div style={{ background:'linear-gradient(135deg,#0a1525,#13233d)', padding:'14px 16px', display:'flex', alignItems:'center', justifyContent:'space-between', flexShrink:0, borderBottom:'1px solid rgba(255,255,255,.07)' }}>
            <div style={{ display:'flex', alignItems:'center', gap:12 }}>

              {/* Header avatar with orbit ring */}
              <div style={{ position:'relative', flexShrink:0 }}>
                <div style={{ width:46, height:46, borderRadius:14, background:'linear-gradient(135deg,#ff8c42,#e8612e,#c0392b)', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 0 22px rgba(232,97,46,.5), 0 4px 14px rgba(0,0,0,.3)' }}>
                  <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <line x1="16" y1="0.5" x2="16" y2="4.5" stroke="rgba(255,255,255,.9)" strokeWidth="1.5" strokeLinecap="round"/>
                    <circle cx="16" cy="0.5" r="1.2" fill="white"><animate attributeName="opacity" values="1;0.2;1" dur="2s" repeatCount="indefinite"/></circle>
                    <rect x="3.5" y="5.5" width="25" height="21" rx="6.5" fill="rgba(255,255,255,.12)" stroke="rgba(255,255,255,.35)" strokeWidth="1.2"/>
                    <rect x="8" y="11" width="5" height="5" rx="2" fill="white"/>
                    <rect x="19" y="11" width="5" height="5" rx="2" fill="white"/>
                    <circle cx="10" cy="12.5" r="1.1" fill="rgba(255,210,80,1)"/>
                    <circle cx="21" cy="12.5" r="1.1" fill="rgba(255,210,80,1)"/>
                    <path d="M9.5 21 Q16 26.5 22.5 21" stroke="white" strokeWidth="1.8" strokeLinecap="round" fill="none"/>
                    <rect x="0.5" y="11" width="3" height="4.5" rx="1.5" fill="rgba(255,255,255,.4)"/>
                    <rect x="28.5" y="11" width="3" height="4.5" rx="1.5" fill="rgba(255,255,255,.4)"/>
                  </svg>
                </div>
                {/* Orbiting dot */}
                <div style={{ position:'absolute', inset:-5, borderRadius:'50%', border:'1.5px dashed rgba(255,180,80,.3)', animation:'orbitSpin 8s linear infinite', pointerEvents:'none' }}>
                  <div style={{ position:'absolute', top:-3, left:'50%', width:6, height:6, borderRadius:'50%', background:'rgba(255,200,80,.8)', transform:'translateX(-50%)', boxShadow:'0 0 6px rgba(255,200,80,.6)' }}/>
                </div>
                {/* Online dot */}
                <span style={{ position:'absolute', bottom:1, right:1, width:11, height:11, borderRadius:'50%', background:'#5ce6b5', border:'2px solid #0a1525', boxShadow:'0 0 6px rgba(92,230,181,.6)' }}/>
              </div>

              <div>
                <div style={{ fontFamily:'Manrope,sans-serif', fontSize:'.95rem', fontWeight:800, color:'#fff', letterSpacing:'-.01em' }}>SecComply AI</div>
                <div style={{ fontSize:'.68rem', color:'#5ce6b5', marginTop:3, display:'flex', alignItems:'center', gap:5 }}>
                  <span style={{ width:6, height:6, borderRadius:'50%', background:'#5ce6b5', display:'inline-block', animation:'blink 2s infinite' }}/>
                  Online · Replies instantly
                </div>
              </div>
            </div>

            <div style={{ display:'flex', alignItems:'center', gap:8 }}>
              <div style={{ position:'relative' }}>
                <button onClick={() => setShowLangMenu(m => !m)} style={{ background:'rgba(255,255,255,.08)', border:'1px solid rgba(255,255,255,.12)', borderRadius:8, padding:'6px 11px', color:'#fff', fontSize:'.74rem', fontWeight:600, cursor:'pointer', display:'flex', alignItems:'center', gap:5, fontFamily:'inherit' }}>
                  🌐 {lang.label}
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="6 9 12 15 18 9"/></svg>
                </button>
                {showLangMenu && (
                  <div style={{ position:'absolute', top:'115%', right:0, background:'#152540', border:'1px solid rgba(255,255,255,.1)', borderRadius:12, overflow:'hidden', zIndex:100, minWidth:150, boxShadow:'0 16px 50px rgba(0,0,0,.5)', maxHeight:300, overflowY:'auto' }}>
                    {LANGUAGES.map(l => (
                      <button key={l.code} onClick={() => { setLang(l); setShowLangMenu(false); setSuggestions([]); }} style={{ display:'block', width:'100%', padding:'10px 16px', textAlign:'left', background: lang.code===l.code ? 'rgba(232,125,62,.2)' : 'none', border:'none', borderBottom:'1px solid rgba(255,255,255,.05)', color: lang.code===l.code ? '#e87d3e' : '#c0d0e0', fontSize:'.83rem', cursor:'pointer', fontFamily:'inherit' }}>
                        {lang.code===l.code ? '✓ ' : '  '}{l.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <button onClick={() => setOpen(false)} style={{ background:'rgba(255,255,255,.08)', border:'none', cursor:'pointer', color:'rgba(255,255,255,.6)', width:30, height:30, borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center' }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
          </div>

          {/* Listening banner */}
          {voice.state !== 'idle' && (
            <div style={{ background: voice.state==='listening' ? 'linear-gradient(90deg,#ff4757,#c0392b)' : 'linear-gradient(90deg,#f39c12,#e67e22)', padding:'10px 16px', display:'flex', alignItems:'center', justifyContent:'space-between', flexShrink:0 }}>
              <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                <Waveform active={voice.state==='listening'} />
                <span style={{ color:'#fff', fontSize:'.82rem', fontWeight:600 }}>{voice.state==='listening' ? 'Listening… speak now' : 'Processing…'}</span>
              </div>
              {voice.state==='listening' && <button onClick={voice.stop} style={{ background:'rgba(255,255,255,.2)', border:'none', color:'#fff', padding:'4px 12px', borderRadius:20, fontSize:'.74rem', fontWeight:700, cursor:'pointer', fontFamily:'inherit' }}>Done</button>}
            </div>
          )}

          {interimText && (
            <div style={{ background:'#fff8f0', borderBottom:'1px solid #ffe4cc', padding:'8px 16px', fontSize:'.83rem', color:'#b85a1e', fontStyle:'italic', flexShrink:0 }}>
              "{interimText}…"
            </div>
          )}

          {/* Messages */}
          <div ref={msgsRef} style={{ flex:1, overflowY:'auto', padding:'16px 14px', display:'flex', flexDirection:'column', gap:12, background:'#f2f5fa', scrollBehavior:'smooth' }}>
            {messages.map(m => (
              <div key={m.id} style={{ display:'flex', flexDirection:'column', maxWidth:'88%', alignSelf: m.role==='bot' ? 'flex-start' : 'flex-end', animation:'fadeUp .2s ease' }}>
                <div style={{ display:'flex', alignItems:'flex-end', gap:8, flexDirection: m.role==='bot' ? 'row' : 'row-reverse' }}>
                  {m.role==='bot' && (
                    /* Mini bot avatar in bubble */
                    <div style={{ width:30, height:30, borderRadius:9, flexShrink:0, background:'linear-gradient(135deg,#ff8c42,#e8612e,#c0392b)', display:'flex', alignItems:'center', justifyContent:'center', marginBottom:2, boxShadow:'0 3px 10px rgba(232,97,46,.4)' }}>
                      <svg width="18" height="18" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <line x1="16" y1="1" x2="16" y2="5" stroke="rgba(255,255,255,.9)" strokeWidth="1.6" strokeLinecap="round"/>
                        <rect x="3" y="5.5" width="26" height="21" rx="7" fill="rgba(255,255,255,.12)" stroke="rgba(255,255,255,.35)" strokeWidth="1.3"/>
                        <rect x="7.5" y="11" width="5.5" height="5.5" rx="2.5" fill="white"/>
                        <rect x="19" y="11" width="5.5" height="5.5" rx="2.5" fill="white"/>
                        <circle cx="9.8" cy="12.5" r="1.2" fill="rgba(255,210,80,1)"/>
                        <circle cx="21.3" cy="12.5" r="1.2" fill="rgba(255,210,80,1)"/>
                        <path d="M9.5 21.5 Q16 27 22.5 21.5" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none"/>
                      </svg>
                    </div>
                  )}
                  <div style={m.role==='bot'
                    ? { padding:'11px 14px', borderRadius:16, borderBottomLeftRadius:4, fontSize:'.85rem', lineHeight:1.68, background:'#fff', color:'#1a2b3c', boxShadow:'0 2px 8px rgba(0,0,0,.07)', maxWidth:285 }
                    : { padding:'11px 14px', borderRadius:16, borderBottomRightRadius:4, fontSize:'.85rem', lineHeight:1.68, background:'linear-gradient(135deg,#1a3a6e,#0d2247)', color:'#e8f0ff', boxShadow:'0 2px 10px rgba(0,0,0,.2)', maxWidth:285 }}>
                    <span dangerouslySetInnerHTML={{ __html: formatText(m.text) }} />
                  </div>
                </div>
                <div style={{ display:'flex', alignItems:'center', gap:6, marginTop:5, paddingLeft: m.role==='bot' ? 38 : 0, justifyContent: m.role==='bot' ? 'flex-start' : 'flex-end' }}>
                  <span style={{ fontSize:'.64rem', color:'#9ab' }}>{m.time}</span>
                  {m.role==='bot' && (
                    <button onClick={() => toggleSpeak(m)} style={{ background: speaking===m.id ? 'rgba(232,125,62,.15)' : 'none', border: speaking===m.id ? '1px solid rgba(232,125,62,.3)' : 'none', cursor:'pointer', padding:'3px 7px', borderRadius:6, color: speaking===m.id ? '#e87d3e' : '#9ab', display:'flex', alignItems:'center', gap:4, fontSize:'.68rem', transition:'all .2s' }}>
                      {speaking===m.id
                        ? <><svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg> Stop</>
                        : <><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/></svg> Listen</>
                      }
                    </button>
                  )}
                </div>
              </div>
            ))}

            {typing && (
              <div style={{ display:'flex', alignItems:'flex-end', gap:8, alignSelf:'flex-start' }}>
                <div style={{ width:30, height:30, borderRadius:9, background:'linear-gradient(135deg,#ff8c42,#e8612e,#c0392b)', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 3px 10px rgba(232,97,46,.4)' }}>
                  <svg width="18" height="18" viewBox="0 0 32 32" fill="none"><rect x="3" y="5.5" width="26" height="21" rx="7" fill="rgba(255,255,255,.12)" stroke="rgba(255,255,255,.35)" strokeWidth="1.3"/><rect x="7.5" y="11" width="5.5" height="5.5" rx="2.5" fill="white"/><rect x="19" y="11" width="5.5" height="5.5" rx="2.5" fill="white"/><path d="M9.5 21.5 Q16 27 22.5 21.5" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none"/></svg>
                </div>
                <div style={{ padding:'13px 16px', borderRadius:16, borderBottomLeftRadius:4, background:'#fff', boxShadow:'0 2px 8px rgba(0,0,0,.07)', display:'flex', gap:5, alignItems:'center' }}>
                  {[0,1,2].map(i => <span key={i} style={{ width:7, height:7, borderRadius:'50%', background:'#c0ccd8', display:'inline-block', animation:`tdot 1.1s ${i*.18}s infinite` }}/>)}
                </div>
              </div>
            )}

            {!typing && suggestions.length > 0 && (
              <div style={{ display:'flex', flexWrap:'wrap', gap:7, paddingLeft:38, animation:'fadeUp .35s ease' }}>
                {suggestions.map((s, i) => (
                  <button key={i} onClick={() => send(s)} style={{ background:'#fff', border:'1.5px solid rgba(232,125,62,.25)', color:'#b85a1e', padding:'7px 14px', borderRadius:20, fontSize:'.76rem', fontWeight:600, cursor:'pointer', fontFamily:'inherit', whiteSpace:'nowrap', boxShadow:'0 1px 4px rgba(0,0,0,.06)', display:'flex', alignItems:'center', gap:5 }}>
                    <span style={{ fontSize:'.65rem', opacity:.5 }}>→</span> {s}
                  </button>
                ))}
              </div>
            )}
          </div>

          {showQuick && quickBtns.length > 0 && messages.length <= 1 && (
            <div style={{ display:'flex', flexWrap:'wrap', gap:7, padding:'10px 14px 0', background:'#f2f5fa' }}>
              {quickBtns.map(q => (
                <button key={q.id} onClick={() => send(q.message)} style={{ background:'none', border:'1.5px solid rgba(232,125,62,.35)', color:'#c45e25', padding:'6px 13px', borderRadius:20, fontSize:'.76rem', fontWeight:600, cursor:'pointer', fontFamily:'inherit', whiteSpace:'nowrap' }}>
                  {q.label}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div style={{ background:'#fff', padding:'12px 14px', borderTop:'1px solid #e4ebf4', display:'flex', alignItems:'center', gap:9, flexShrink:0 }}>
            <input
              value={displayInput}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key==='Enter' && voice.state==='idle' && send(input)}
              placeholder={placeholder}
              disabled={typing || voice.state==='processing'}
              style={{ flex:1, border:`1.5px solid ${voice.state!=='idle' ? '#e87d3e' : '#dce6f0'}`, borderRadius:12, padding:'10px 14px', fontSize:'.86rem', color: interimText ? '#b85a1e' : '#1a2b40', fontFamily:'inherit', outline:'none', background: voice.state!=='idle' ? '#fff9f5' : '#fff', direction: lang.code==='ar' ? 'rtl' : 'ltr', transition:'all .2s', fontStyle: interimText ? 'italic' : 'normal' }}
            />
            <MicButton voiceState={voice.state} onStart={voice.start} onStop={voice.stop} />
            <button onClick={() => send(input)} disabled={typing || !input.trim()} style={{ width:44, height:44, borderRadius:12, flexShrink:0, background:'linear-gradient(135deg,#e87d3e,#c45e25)', border:'none', cursor:'pointer', color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', opacity:(typing||!input.trim()) ? .4 : 1, transition:'opacity .2s', boxShadow:'0 2px 10px rgba(232,125,62,.35)' }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" style={{width:16,height:16}}><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
            </button>
          </div>

          <div style={{ background:'#fff', padding:'8px 14px', borderTop:'1px solid #f0f4f8', display:'flex', alignItems:'center', justifyContent:'space-between', flexShrink:0 }}>
            <span style={{ fontSize:'.65rem', color:'#b0c0d0' }}>🎤 Click mic to speak · 🔊 Click Listen to hear</span>
            <span style={{ fontSize:'.65rem', color:'#e87d3e', fontWeight:700 }}>SecComply AI</span>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideUp   { from{transform:scale(.9) translateY(24px);opacity:0} to{transform:scale(1) translateY(0);opacity:1} }
        @keyframes fadeUp    { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:none} }
        @keyframes tdot      { 0%,80%,100%{transform:translateY(0)} 40%{transform:translateY(-7px)} }
        @keyframes blink     { 0%,100%{opacity:1} 50%{opacity:.3} }
        @keyframes fabFloat  { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-4px)} }
        @keyframes fabRing   { 0%{transform:scale(1);opacity:.8} 100%{transform:scale(1.7);opacity:0} }
        @keyframes orbitSpin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes micRing   { 0%{transform:scale(1);opacity:1} 100%{transform:scale(1.6);opacity:0} }
      `}</style>
    </>
  );
}
