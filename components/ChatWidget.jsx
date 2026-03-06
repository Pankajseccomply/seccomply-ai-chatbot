'use client';
import { useState, useEffect, useRef } from 'react';

const LANGUAGES = [
  { code: 'en', label: 'English',  voice: 'en-US' },
  { code: 'hi', label: 'हिंदी',    voice: 'hi-IN' },
  { code: 'fr', label: 'Français', voice: 'fr-FR' },
  { code: 'de', label: 'Deutsch',  voice: 'de-DE' },
  { code: 'es', label: 'Español',  voice: 'es-ES' },
  { code: 'ar', label: 'العربية',  voice: 'ar-SA' },
  { code: 'zh', label: '中文',      voice: 'zh-CN' },
  { code: 'ja', label: '日本語',    voice: 'ja-JP' },
];

function formatText(text) {
  const lines = text.split('\n');
  let html = '';
  let inList = false;
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      if (!inList) { html += '<ul style="padding-left:16px;margin:6px 0">'; inList = true; }
      html += `<li style="margin:3px 0">${trimmed.slice(2)}</li>`;
    } else {
      if (inList) { html += '</ul>'; inList = false; }
      if (trimmed === '') { html += '<br/>'; }
      else { html += line + '<br/>'; }
    }
  }
  if (inList) html += '</ul>';
  return html
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/<br\/>$/, '');
}

function useVoiceInput(onResult, langVoice) {
  const [listening, setListening] = useState(false);
  const recRef = useRef(null);

  function start() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Voice input not supported in this browser. Please use Chrome or Edge.');
      return;
    }
    const rec = new SpeechRecognition();
    rec.lang            = langVoice;
    rec.interimResults  = false;
    rec.maxAlternatives = 1;
    rec.onresult = e => { onResult(e.results[0][0].transcript); setListening(false); };
    rec.onerror  = ()  => setListening(false);
    rec.onend    = ()  => setListening(false);
    rec.start();
    recRef.current = rec;
    setListening(true);
  }

  function stop() {
    recRef.current?.stop();
    setListening(false);
  }

  return { listening, start, stop };
}

export default function ChatWidget() {
  const [open,         setOpen]         = useState(false);
  const [messages,     setMessages]     = useState([]);
  const [questions,    setQuestions]    = useState([]);
  const [input,        setInput]        = useState('');
  const [typing,       setTyping]       = useState(false);
  const [badge,        setBadge]        = useState(true);
  const [showQuick,    setShowQuick]    = useState(true);
  const [history,      setHistory]      = useState([]);
  const [lang,         setLang]         = useState(LANGUAGES[0]);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [speaking,     setSpeaking]     = useState(null);

  const msgsRef   = useRef(null);
  const inited    = useRef(false);
  const sessionId = useRef('sess_' + Math.random().toString(36).slice(2));

  const voice = useVoiceInput((text) => setInput(text), lang.voice);

  useEffect(() => {
    if (msgsRef.current) msgsRef.current.scrollTop = msgsRef.current.scrollHeight;
  }, [messages, typing]);

  useEffect(() => {
    if (!open || inited.current) return;
    inited.current = true;
    setBadge(false);
    fetch('/api/questions?active=true')
      .then(r => r.json())
      .then(d => setQuestions((d.data || []).slice(0, 6)))
      .catch(() => {});
    setTimeout(() => addBot("👋 Hey! I'm the SecComply AI. Ask me anything about compliance, our platform, or book a demo!"), 400);
  }, [open]);

  const ts      = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const addBot  = t  => setMessages(p => [...p, { id: Date.now(), role: 'bot',  text: t, time: ts() }]);
  const addUser = t  => setMessages(p => [...p, { id: Date.now(), role: 'user', text: t, time: ts() }]);

  async function send(text) {
    if (!text?.trim() || typing) return;
    setInput('');
    setShowQuick(false);
    addUser(text);
    const next = [...history, { role: 'user', content: text }];
    setHistory(next);
    setTyping(true);
    try {
      const res   = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: next, session_id: sessionId.current, language: lang.label }),
      });
      const d     = await res.json();
      const reply = d.reply || 'Sorry, something went wrong.';
      setHistory(p => [...p, { role: 'assistant', content: reply }]);
      addBot(reply);
    } catch {
      addBot('Something went wrong. Please try again!');
    } finally {
      setTyping(false);
    }
  }

  function toggleSpeak(msg) {
    if (!window.speechSynthesis) return;
    if (speaking === msg.id) {
      window.speechSynthesis.cancel();
      setSpeaking(null);
    } else {
      window.speechSynthesis.cancel();
      const plain = msg.text.replace(/\*\*/g, '').replace(/\*/g, '').replace(/#+/g, '');
      const utt   = new SpeechSynthesisUtterance(plain);
      utt.lang    = lang.voice;
      utt.rate    = 0.95;
      utt.onend   = () => setSpeaking(null);
      window.speechSynthesis.speak(utt);
      setSpeaking(msg.id);
    }
  }

  const placeholder =
    voice.listening      ? '🎤 Listening...'
    : lang.code === 'hi' ? 'अनुपालन के बारे में पूछें…'
    : lang.code === 'ar' ? 'اسأل عن الامتثال…'
    : lang.code === 'fr' ? 'Posez une question…'
    : lang.code === 'es' ? 'Pregunta sobre cumplimiento…'
    : lang.code === 'de' ? 'Frage zur Compliance…'
    : lang.code === 'zh' ? '询问合规问题…'
    : lang.code === 'ja' ? 'コンプライアンスについて質問…'
    : 'Ask about compliance…';

  return (
    <>
      {/* FAB */}
      <button
        onClick={() => setOpen(o => !o)}
        style={{ position:'fixed', bottom:28, right:28, zIndex:9999, width:60, height:60, borderRadius:'50%', background:'linear-gradient(135deg,#e87d3e,#d4612a)', border:'none', cursor:'pointer', color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 4px 28px rgba(232,125,62,.5)', animation:'fabPulse 2.5s 3s ease infinite' }}
      >
        {badge && (
          <span style={{ position:'absolute', top:-2, right:-2, width:20, height:20, borderRadius:'50%', background:'#ff3355', border:'2px solid #07101e', fontSize:10, fontWeight:800, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center' }}>1</span>
        )}
        {open
          ? <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          : <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" style={{width:26,height:26}}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
        }
      </button>

      {/* Chat Window */}
      {open && (
        <div style={{ position:'fixed', bottom:104, right:28, zIndex:9998, width:390, maxHeight:600, borderRadius:18, overflow:'hidden', display:'flex', flexDirection:'column', boxShadow:'0 30px 90px rgba(0,0,0,.5),0 0 0 1px rgba(255,255,255,.07)', animation:'slideUp .25s ease' }}>

          {/* Header */}
          <div style={{ background:'linear-gradient(135deg,#0f1e36,#142540)', padding:'14px 16px', display:'flex', alignItems:'center', justifyContent:'space-between', borderBottom:'1px solid rgba(255,255,255,.07)', flexShrink:0 }}>
            <div style={{ display:'flex', alignItems:'center', gap:10 }}>
              <div style={{ width:38, height:38, borderRadius:10, background:'linear-gradient(135deg,#e87d3e,#c45e25)', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', boxShadow:'0 0 16px rgba(232,125,62,.35)', flexShrink:0 }}>
                <svg viewBox="0 0 24 24" fill="currentColor" style={{width:18,height:18}}><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5L12 1z"/></svg>
              </div>
              <div>
                <div style={{ fontFamily:'Manrope,sans-serif', fontSize:'.9rem', fontWeight:800, color:'#fff', lineHeight:1.1 }}>SecComply AI</div>
                <div style={{ fontSize:'.7rem', color:'#5ce6b5', marginTop:2, display:'flex', alignItems:'center', gap:5 }}>
                  <span style={{ width:6, height:6, borderRadius:'50%', background:'#5ce6b5', display:'inline-block', animation:'blink 2s infinite' }}/>
                  Online · Replies instantly
                </div>
              </div>
            </div>

            <div style={{ display:'flex', alignItems:'center', gap:8 }}>
              {/* Language dropdown */}
              <div style={{ position:'relative' }}>
                <button
                  onClick={() => setShowLangMenu(m => !m)}
                  style={{ background:'rgba(255,255,255,.1)', border:'1px solid rgba(255,255,255,.15)', borderRadius:7, padding:'5px 10px', color:'#fff', fontSize:'.75rem', fontWeight:600, cursor:'pointer', display:'flex', alignItems:'center', gap:5, fontFamily:'inherit' }}
                >
                  🌐 {lang.label}
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="6 9 12 15 18 9"/></svg>
                </button>
                {showLangMenu && (
                  <div style={{ position:'absolute', top:'110%', right:0, background:'#1a2b40', border:'1px solid rgba(255,255,255,.1)', borderRadius:10, overflow:'hidden', zIndex:100, minWidth:130, boxShadow:'0 10px 30px rgba(0,0,0,.4)' }}>
                    {LANGUAGES.map(l => (
                      <button
                        key={l.code}
                        onClick={() => { setLang(l); setShowLangMenu(false); }}
                        style={{ display:'block', width:'100%', padding:'9px 14px', textAlign:'left', background: lang.code===l.code ? 'rgba(232,125,62,.2)' : 'none', border:'none', color: lang.code===l.code ? '#e87d3e' : '#c0d0e0', fontSize:'.82rem', cursor:'pointer', fontFamily:'inherit' }}
                      >
                        {l.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Close button */}
              <button
                onClick={() => setOpen(false)}
                style={{ background:'rgba(255,255,255,.07)', border:'none', cursor:'pointer', color:'rgba(255,255,255,.5)', width:28, height:28, borderRadius:7, display:'flex', alignItems:'center', justifyContent:'center' }}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
          </div>

          {/* Messages area */}
          <div ref={msgsRef} style={{ flex:1, overflowY:'auto', padding:'14px 12px', display:'flex', flexDirection:'column', gap:10, background:'#f4f7fc', scrollBehavior:'smooth' }}>
            {messages.map(m => (
              <div key={m.id} style={{ display:'flex', flexDirection:'column', maxWidth:'86%', alignSelf: m.role==='bot' ? 'flex-start' : 'flex-end' }}>
                <div style={{ display:'flex', alignItems:'flex-end', gap:7, flexDirection: m.role==='bot' ? 'row' : 'row-reverse' }}>
                  {m.role==='bot' && (
                    <div style={{ width:26, height:26, borderRadius:7, flexShrink:0, background:'linear-gradient(135deg,#e87d3e,#c45e25)', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', marginBottom:2 }}>
                      <svg viewBox="0 0 24 24" fill="currentColor" style={{width:12,height:12}}><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5L12 1z"/></svg>
                    </div>
                  )}
                  <div style={m.role==='bot'
                    ? { padding:'10px 13px', borderRadius:14, borderBottomLeftRadius:4, fontSize:'.85rem', lineHeight:1.65, background:'#fff', color:'#1a2b3c', boxShadow:'0 1px 5px rgba(0,0,0,.08)', maxWidth:270 }
                    : { padding:'10px 13px', borderRadius:14, borderBottomRightRadius:4, fontSize:'.85rem', lineHeight:1.65, background:'linear-gradient(135deg,#0f2040,#0a1628)', color:'#e0ecff', boxShadow:'0 2px 10px rgba(0,0,0,.2)', maxWidth:270 }
                  }>
                    <span dangerouslySetInnerHTML={{ __html: formatText(m.text) }} />
                  </div>
                </div>

                {/* Timestamp + listen button */}
                <div style={{ display:'flex', alignItems:'center', gap:6, marginTop:4, paddingLeft: m.role==='bot' ? 33 : 0, justifyContent: m.role==='bot' ? 'flex-start' : 'flex-end' }}>
                  <span style={{ fontSize:'.65rem', color:'#a0b4c8' }}>{m.time}</span>
                  {m.role==='bot' && (
                    <button
                      onClick={() => toggleSpeak(m)}
                      title="Listen"
                      style={{ background:'none', border:'none', cursor:'pointer', padding:'2px 4px', borderRadius:4, color: speaking===m.id ? '#e87d3e' : '#a0b4c8', display:'flex', alignItems:'center' }}
                    >
                      {speaking===m.id
                        ? <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
                        : <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>
                      }
                    </button>
                  )}
                </div>
              </div>
            ))}

            {/* Typing dots */}
            {typing && (
              <div style={{ display:'flex', alignItems:'flex-end', gap:7, alignSelf:'flex-start' }}>
                <div style={{ width:26, height:26, borderRadius:7, background:'linear-gradient(135deg,#e87d3e,#c45e25)', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff' }}>
                  <svg viewBox="0 0 24 24" fill="currentColor" style={{width:12,height:12}}><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5L12 1z"/></svg>
                </div>
                <div style={{ padding:'12px 14px', borderRadius:14, borderBottomLeftRadius:4, background:'#fff', boxShadow:'0 1px 5px rgba(0,0,0,.08)', display:'flex', gap:5, alignItems:'center' }}>
                  {[0,1,2].map(i => <span key={i} style={{ width:7, height:7, borderRadius:'50%', background:'#bfccda', display:'inline-block', animation:`tdot 1.1s ${i*.18}s infinite` }}/>)}
                </div>
              </div>
            )}
          </div>

          {/* Quick replies */}
          {showQuick && questions.length > 0 && (
            <div style={{ display:'flex', flexWrap:'wrap', gap:7, padding:'10px 12px 0', background:'#f4f7fc' }}>
              {questions.map(q => (
                <button
                  key={q.id}
                  onClick={() => send(q.message)}
                  style={{ background:'none', border:'1.5px solid rgba(232,125,62,.3)', color:'#c45e25', padding:'6px 12px', borderRadius:20, fontSize:'.76rem', fontWeight:600, cursor:'pointer', fontFamily:'inherit', whiteSpace:'nowrap' }}
                >
                  {q.label}
                </button>
              ))}
            </div>
          )}

          {/* Input bar */}
          <div style={{ background:'#fff', padding:'11px 12px', borderTop:'1px solid #e4ebf4', display:'flex', alignItems:'center', gap:8, flexShrink:0 }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && send(input)}
              placeholder={placeholder}
              disabled={typing}
              style={{ flex:1, border:`1.5px solid ${voice.listening ? '#e87d3e' : '#dce6f0'}`, borderRadius:9, padding:'9px 13px', fontSize:'.85rem', color:'#1a2b40', fontFamily:'inherit', outline:'none', height:38, background: voice.listening ? '#fff9f5' : '#fff', direction: lang.code==='ar' ? 'rtl' : 'ltr', transition:'all .2s' }}
            />

            {/* Mic button */}
            <button
              onClick={() => voice.listening ? voice.stop() : voice.start()}
              title={voice.listening ? 'Stop listening' : 'Voice input'}
              style={{ width:38, height:38, borderRadius:9, flexShrink:0, background: voice.listening ? 'linear-gradient(135deg,#ff4444,#cc2222)' : 'rgba(232,125,62,.1)', border:`1.5px solid ${voice.listening ? '#ff4444' : 'rgba(232,125,62,.3)'}`, cursor:'pointer', color: voice.listening ? '#fff' : '#e87d3e', display:'flex', alignItems:'center', justifyContent:'center', animation: voice.listening ? 'fabPulse 1s infinite' : 'none' }}
            >
              {voice.listening
                ? <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
                : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="9" y="2" width="6" height="12" rx="3"/><path d="M5 10a7 7 0 0 0 14 0"/><line x1="12" y1="19" x2="12" y2="22"/><line x1="9" y1="22" x2="15" y2="22"/></svg>
              }
            </button>

            {/* Send button */}
            <button
              onClick={() => send(input)}
              disabled={typing}
              style={{ width:38, height:38, borderRadius:9, flexShrink:0, background:'linear-gradient(135deg,#e87d3e,#c45e25)', border:'none', cursor:'pointer', color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', opacity: typing ? .4 : 1 }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" style={{width:15,height:15}}><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
            </button>
          </div>

          <div style={{ background:'#fff', padding:'7px 12px', borderTop:'1px solid #e4ebf4', textAlign:'center', fontSize:'.66rem', color:'#b0c0d0', letterSpacing:'.04em', flexShrink:0 }}>
            Powered by <span style={{ color:'#e87d3e', fontWeight:700 }}>SecComply AI</span>
          </div>
        </div>
      )}
    </>
  );
}
