'use client';
import { useState, useEffect, useRef } from 'react';

/* ─── CONFIG ────────────────────────────────────────────────── */
const PHONE       = '+919860013381';
const BOOKING_URL = 'https://calendly.com/seccomply';   // update to real link
const CONTACT_URL = 'https://seccomply.net/contact';

/* ─── LANGUAGES ─────────────────────────────────────────────── */
const LANGS = [
  { code:'en', label:'English',  native:'English',  voice:'en-US', dir:'ltr', flag:'🇺🇸' },
  { code:'hi', label:'Hindi',    native:'हिंदी',    voice:'hi-IN', dir:'ltr', flag:'🇮🇳' },
  { code:'mr', label:'Marathi',  native:'मराठी',    voice:'mr-IN', dir:'ltr', flag:'🇮🇳' },
  { code:'fr', label:'French',   native:'Français', voice:'fr-FR', dir:'ltr', flag:'🇫🇷' },
  { code:'de', label:'German',   native:'Deutsch',  voice:'de-DE', dir:'ltr', flag:'🇩🇪' },
  { code:'es', label:'Spanish',  native:'Español',  voice:'es-ES', dir:'ltr', flag:'🇪🇸' },
  { code:'ar', label:'Arabic',   native:'العربية',  voice:'ar-SA', dir:'rtl', flag:'🇸🇦' },
  { code:'zh', label:'Chinese',  native:'中文',      voice:'zh-CN', dir:'ltr', flag:'🇨🇳' },
  { code:'ja', label:'Japanese', native:'日本語',    voice:'ja-JP', dir:'ltr', flag:'🇯🇵' },
];

/* ─── LOCALISED UI STRINGS ──────────────────────────────────── */
const T = {
  en: {
    name:'Veri by SecComply', status:'Online · Replies instantly',
    welcome:"Hey there! 👋 I'm **Veri**, SecComply's AI compliance guide.\n\nI help businesses navigate **SOC 2, ISO 27001, HIPAA, GDPR** and 50+ frameworks — faster than you'd imagine.\n\n💡 Most companies spend *months* on compliance paperwork. Our clients do it in **days**.\n\nTell me — what compliance challenge are you working through right now?",
    ph:"Ask anything about compliance or SecComply…",
    listen:'Listen', stop:'Stop',
    wrongLang:"Looks like you typed in a different language 😊 I'm currently in **English** mode — please type in English or tap the language button to switch!",
    callHeading:'Talk to Our Experts',
    callSub:'Real humans. Real answers. Available now.',
    audioLbl:'Audio Call', videoLbl:'Video Call', bookLbl:'Schedule a Meeting',
    callAvail:'Mon – Fri · 9 AM – 6 PM IST',
    connecting:'Connecting you…',
    connected:'Opening…',
    footer:'SecComply · AI-powered compliance platform',
  },
  hi: {
    name:'Veri by SecComply', status:'ऑनलाइन · तुरंत जवाब',
    welcome:"नमस्ते! 👋 मैं **Veri** हूं, SecComply की AI compliance सहायक।\n\nमैं **SOC 2, ISO 27001, HIPAA, GDPR** और 50+ frameworks में आपकी मदद करती हूं।\n\n💡 ज़्यादातर कंपनियां compliance में महीने बर्बाद करती हैं — SecComply इसे **दिनों में** पूरा करता है।\n\nआज आप किस compliance चुनौती का सामना कर रहे हैं?",
    ph:"SecComply के बारे में पूछें…",
    listen:'सुनें', stop:'रोकें',
    wrongLang:"आपने अलग भाषा में लिखा लग रहा है 😊 मैं **हिंदी** मोड में हूं — कृपया हिंदी में लिखें!",
    callHeading:'हमारी टीम से बात करें',
    callSub:'असली विशेषज्ञ। सीधे जवाब।',
    audioLbl:'ऑडियो कॉल', videoLbl:'वीडियो कॉल', bookLbl:'मीटिंग शेड्यूल करें',
    callAvail:'सोम – शुक्र · 9 AM – 6 PM IST',
    connecting:'जोड़ा जा रहा है…', connected:'खुल रहा है…',
    footer:'SecComply · AI-संचालित compliance प्लेटफ़ॉर्म',
  },
  mr: {
    name:'Veri by SecComply', status:'ऑनलाइन · त्वरित उत्तर',
    welcome:"नमस्कार! 👋 मी **Veri** आहे, SecComply ची AI compliance सहाय्यक.\n\nमी **SOC 2, ISO 27001, HIPAA, GDPR** आणि 50+ frameworks मध्ये मदत करतो.\n\n💡 बहुतेक कंपन्या compliance वर महिने घालवतात — SecComply ते **दिवसांत** पूर्ण करते.\n\nआज तुम्हाला कोणती compliance आव्हान आहे?",
    ph:"SecComply बद्दल विचारा…",
    listen:'ऐका', stop:'थांबा',
    wrongLang:"तुम्ही वेगळ्या भाषेत लिहिले 😊 मी **मराठी** मोडमध्ये आहे — कृपया मराठीत लिहा!",
    callHeading:'आमच्या तज्ञांशी बोला',
    callSub:'खरे तज्ञ. थेट उत्तरे.',
    audioLbl:'ऑडिओ कॉल', videoLbl:'व्हिडिओ कॉल', bookLbl:'मीटिंग शेड्यूल करा',
    callAvail:'सोम – शुक्र · 9 AM – 6 PM IST',
    connecting:'जोडले जात आहे…', connected:'उघडत आहे…',
    footer:'SecComply · AI-चालित compliance प्लॅटफॉर्म',
  },
  fr: {
    name:'Veri by SecComply', status:'En ligne · Répond instantanément',
    welcome:"Bonjour ! 👋 Je suis **Veri**, guide IA de SecComply.\n\nJ'aide les entreprises avec **SOC 2, ISO 27001, HIPAA, RGPD** et 50+ frameworks.\n\n💡 La plupart des entreprises passent *des mois* sur la conformité. Nos clients le font en **jours**.\n\nQuel défi de conformité rencontrez-vous aujourd'hui ?",
    ph:"Posez une question sur SecComply…",
    listen:'Écouter', stop:'Arrêter',
    wrongLang:"Il semble que vous ayez tapé dans une autre langue 😊 Je suis en mode **Français** — veuillez écrire en français !",
    callHeading:'Parler à nos experts',
    callSub:'Des humains réels. Des réponses directes.',
    audioLbl:'Appel audio', videoLbl:'Appel vidéo', bookLbl:'Planifier une réunion',
    callAvail:'Lun – Ven · 9h – 18h IST',
    connecting:'Connexion…', connected:'Ouverture…',
    footer:'SecComply · Plateforme de conformité IA',
  },
  de: {
    name:'Veri by SecComply', status:'Online · Antwortet sofort',
    welcome:"Hallo! 👋 Ich bin **Veri**, SecComply's KI-Compliance-Assistentin.\n\nIch helfe bei **SOC 2, ISO 27001, HIPAA, DSGVO** und 50+ Frameworks.\n\n💡 Die meisten Unternehmen verbringen *Monate* mit Compliance. Unsere Kunden schaffen es in **Tagen**.\n\nWelche Compliance-Herausforderung haben Sie gerade?",
    ph:"Fragen Sie zu SecComply…",
    listen:'Anhören', stop:'Stoppen',
    wrongLang:"Sie scheinen in einer anderen Sprache zu schreiben 😊 Ich bin im **Deutschen** Modus — bitte schreiben Sie auf Deutsch!",
    callHeading:'Mit unseren Experten sprechen',
    callSub:'Echte Menschen. Direkte Antworten.',
    audioLbl:'Audioanruf', videoLbl:'Videoanruf', bookLbl:'Meeting planen',
    callAvail:'Mo – Fr · 9 – 18 Uhr IST',
    connecting:'Verbinde…', connected:'Öffnen…',
    footer:'SecComply · KI-gestützte Compliance-Plattform',
  },
  es: {
    name:'Veri by SecComply', status:'En línea · Responde al instante',
    welcome:"¡Hola! 👋 Soy **Veri**, guía de IA de SecComply.\n\nAyudo con **SOC 2, ISO 27001, HIPAA, GDPR** y más de 50 marcos.\n\n💡 La mayoría de empresas pasan *meses* en cumplimiento. Nuestros clientes lo hacen en **días**.\n\n¿Qué desafío de cumplimiento tienes hoy?",
    ph:"Pregunta sobre SecComply…",
    listen:'Escuchar', stop:'Detener',
    wrongLang:"Parece que escribiste en otro idioma 😊 Estoy en modo **Español** — ¡escribe en español por favor!",
    callHeading:'Hablar con nuestros expertos',
    callSub:'Personas reales. Respuestas directas.',
    audioLbl:'Llamada de audio', videoLbl:'Videollamada', bookLbl:'Programar reunión',
    callAvail:'Lun – Vie · 9 AM – 6 PM IST',
    connecting:'Conectando…', connected:'Abriendo…',
    footer:'SecComply · Plataforma de cumplimiento con IA',
  },
  ar: {
    name:'Veri by SecComply', status:'متصل · يرد فوراً',
    welcome:"مرحباً! 👋 أنا **Veri**، مساعدة الذكاء الاصطناعي من SecComply.\n\nأساعد في **SOC 2، ISO 27001، HIPAA، GDPR** وأكثر من 50 إطاراً.\n\n💡 معظم الشركات تقضي *أشهراً* في الامتثال — عملاؤنا ينهونه في **أيام**.\n\nما تحدي الامتثال الذي تواجهه اليوم؟",
    ph:"اسأل عن SecComply…",
    listen:'استمع', stop:'إيقاف',
    wrongLang:"يبدو أنك كتبت بلغة مختلفة 😊 أنا في وضع **العربية** — يرجى الكتابة بالعربية!",
    callHeading:'تحدث مع خبرائنا',
    callSub:'بشر حقيقيون. إجابات مباشرة.',
    audioLbl:'مكالمة صوتية', videoLbl:'مكالمة فيديو', bookLbl:'جدولة اجتماع',
    callAvail:'الاثنين – الجمعة · 9 صباحاً – 6 مساءً IST',
    connecting:'جارٍ التوصيل…', connected:'فتح…',
    footer:'SecComply · منصة امتثال مدعومة بالذكاء الاصطناعي',
  },
  zh: {
    name:'Veri by SecComply', status:'在线 · 即时回复',
    welcome:"你好！👋 我是 **Veri**，SecComply 的 AI 合规助手。\n\n我帮助企业应对 **SOC 2、ISO 27001、HIPAA、GDPR** 等 50+ 合规框架。\n\n💡 大多数公司花费*数月*处理合规工作 — 我们的客户只需**几天**。\n\n您今天面临什么合规挑战？",
    ph:"询问关于 SecComply…",
    listen:'收听', stop:'停止',
    wrongLang:"看起来您用其他语言输入 😊 我现在是**中文**模式 — 请用中文输入！",
    callHeading:'与我们的专家交流',
    callSub:'真实的人。直接的答案。',
    audioLbl:'语音通话', videoLbl:'视频通话', bookLbl:'安排会议',
    callAvail:'周一至周五 · 9AM–6PM IST',
    connecting:'正在连接…', connected:'正在打开…',
    footer:'SecComply · AI 合规平台',
  },
  ja: {
    name:'Veri by SecComply', status:'オンライン · すぐに返信',
    welcome:"こんにちは！👋 私は **Veri**、SecComply の AI コンプライアンスガイドです。\n\n**SOC 2、ISO 27001、HIPAA、GDPR** など 50 以上のフレームワークをサポートします。\n\n💡 多くの企業がコンプライアンスに*数ヶ月*かけています — 私たちのクライアントは**数日で**完了します。\n\n今日はどのようなコンプライアンスの課題がありますか？",
    ph:"SecComplyについて質問してください…",
    listen:'聞く', stop:'停止',
    wrongLang:"別の言語で入力されたようです 😊 私は**日本語**モードです — 日本語で入力してください！",
    callHeading:'専門家に相談する',
    callSub:'本物の人間。直接の回答。',
    audioLbl:'音声通話', videoLbl:'ビデオ通話', bookLbl:'ミーティングを予約',
    callAvail:'月〜金 · 9AM〜6PM IST',
    connecting:'接続中…', connected:'開いています…',
    footer:'SecComply · AI コンプライアンスプラットフォーム',
  },
};

/* ─── WELCOME CHIPS ─────────────────────────────────────────── */
const CHIPS0 = {
  en:['What is SecComply?','SOC 2 compliance help?','Book a free demo','Supported frameworks?'],
  hi:['SecComply क्या है?','SOC 2 compliance?','मुफ़्त डेमो बुक करें','कौन से frameworks?'],
  mr:['SecComply काय आहे?','SOC 2 compliance?','मोफत डेमो बुक करा','कोणते frameworks?'],
  fr:["Qu'est-ce que SecComply?",'Aide SOC 2?','Démo gratuite','Frameworks supportés?'],
  de:['Was ist SecComply?','SOC 2 Hilfe?','Kostenlose Demo','Unterstützte Frameworks?'],
  es:['¿Qué es SecComply?','¿Ayuda SOC 2?','Demo gratis','¿Frameworks soportados?'],
  ar:['ما هو SecComply؟','مساعدة SOC 2؟','عرض توضيحي مجاني','الأطر المدعومة؟'],
  zh:['什么是SecComply？','SOC 2合规？','预约免费演示','支持哪些框架？'],
  ja:['SecComplyとは？','SOC 2コンプライアンス？','無料デモを予約','対応フレームワーク？'],
};

/* ─── FALLBACK CHIP POOL ────────────────────────────────────── */
const POOL = {
  en:['HIPAA compliance?','GDPR support?','DPDP Act help?','VAPT service?','ISO 27001 consulting?','CISO as a Service?','Vendor risk management?','Cloud security?','Internal audit services?','Meet the team?','Free DPDP assessment?','SecComply integrations?'],
  hi:['HIPAA compliance?','GDPR सहायता?','DPDP अनुपालन?','VAPT सेवा?','ISO 27001?','CISO सेवा?','टीम से मिलें?'],
  mr:['HIPAA compliance?','GDPR सहाय्य?','DPDP अनुपालन?','VAPT सेवा?','ISO 27001?','CISO सेवा?','टीमशी भेटा?'],
  fr:['HIPAA?','RGPD?','Service VAPT?','ISO 27001?','Service CISO?','Équipe?'],
  de:['HIPAA?','DSGVO?','VAPT?','ISO 27001?','CISO?','Team?'],
  es:['HIPAA?','GDPR?','VAPT?','ISO 27001?','CISO?','Equipo?'],
  ar:['HIPAA؟','GDPR؟','VAPT؟','ISO 27001؟','CISO؟','الفريق؟'],
  zh:['HIPAA？','GDPR？','VAPT？','ISO 27001？','CISO？','团队？'],
  ja:['HIPAA？','GDPR？','VAPT？','ISO 27001？','CISO？','チーム？'],
};

/* ─── LANG DETECTION ────────────────────────────────────────── */
function detectOk(text, code) {
  const t = text.trim();
  if (!t || t.length < 3) return true;
  const deva  = /[\u0900-\u097F]/.test(t);
  const arab  = /[\u0600-\u06FF]/.test(t);
  const han   = /[\u4E00-\u9FFF]/.test(t);
  const kana  = /[\u3040-\u30FF]/.test(t);
  const latin = /[a-zA-Z]{3,}/.test(t);
  if (code==='hi'||code==='mr') return deva;
  if (code==='ar') return arab;
  if (code==='zh') return han && !latin;
  if (code==='ja') return kana || (han && !latin);
  if (['en','fr','de','es'].includes(code)) return latin && !arab && !deva;
  return true;
}

/* ─── RICH TEXT FORMATTER ───────────────────────────────────── */
function richText(raw) {
  let out = '', list = false;
  for (const line of raw.split('\n')) {
    const t = line.trim();
    if (t.startsWith('- ') || t.startsWith('* ')) {
      if (!list) { out += '<ul>'; list = true; }
      out += `<li>${t.slice(2)}</li>`;
    } else {
      if (list) { out += '</ul>'; list = false; }
      out += t ? `<p>${line}</p>` : '<br>';
    }
  }
  if (list) out += '</ul>';
  return out
    .replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>')
    .replace(/\*(.+?)\*/g,'<em>$1</em>');
}

/* ─── VOICE HOOK ────────────────────────────────────────────── */
function useVoice(onFinal, onInterim, voiceLang) {
  const [vs, setVs] = useState('idle'); // idle | on | busy
  const ref = useRef(null);
  function start() {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { alert('Voice needs Chrome or Edge'); return; }
    const r = new SR(); r.lang = voiceLang; r.interimResults = true;
    r.onstart  = () => setVs('on');
    r.onresult = e => {
      const txt = Array.from(e.results).map(x=>x[0].transcript).join('');
      if (e.results[e.results.length-1].isFinal) { setVs('busy'); setTimeout(()=>{ onFinal(txt); setVs('idle'); }, 300); }
      else onInterim?.(txt);
    };
    r.onerror = r.onend = () => setVs('idle');
    r.start(); ref.current = r;
  }
  function stop() { ref.current?.stop(); setVs('idle'); }
  return { vs, start, stop };
}

/* ─── TTS ───────────────────────────────────────────────────── */
function tts(text, voiceLang, onEnd) {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const plain = text.replace(/\*\*/g,'').replace(/\*/g,'').replace(/<[^>]+>/g,'').slice(0,320);
  const u = new SpeechSynthesisUtterance(plain);
  u.lang = voiceLang; u.rate = 0.93; u.pitch = 1.05;
  u.onend = () => onEnd?.();
  window.speechSynthesis.speak(u);
}

/* ═══════════════════════════════════════════════════════════════
   CALL MODAL
═══════════════════════════════════════════════════════════════ */
function CallModal({ t, lang, onClose }) {
  const [phase, setPhase] = useState('menu'); // menu | ringing | done

  function audioCall() {
    setPhase('ringing');
    tts(t.connecting, lang.voice);
    setTimeout(() => { window.location.href = `tel:${PHONE}`; setPhase('done'); }, 2200);
  }
  function videoCall() {
    setPhase('ringing');
    tts(t.connecting, lang.voice);
    setTimeout(() => { window.open(BOOKING_URL,'_blank'); setPhase('done'); }, 2200);
  }
  function bookMeeting() {
    window.open(BOOKING_URL,'_blank'); onClose();
  }

  return (
    <div className="cm-backdrop" onClick={onClose}>
      <div className="cm-card" onClick={e=>e.stopPropagation()}>
        <button className="cm-x" onClick={onClose}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>

        {phase === 'menu' && (
          <>
            {/* Card top */}
            <div className="cm-head">
              <div className="cm-team-avatars">
                {['S','V','A'].map((c,i) => (
                  <div key={i} className="cm-avatar" style={{marginLeft: i?'-10px':'0', zIndex:3-i}}>
                    <span>{c}</span>
                  </div>
                ))}
                <div className="cm-online-ring"/>
              </div>
              <div>
                <div className="cm-title">{t.callHeading}</div>
                <div className="cm-sub">{t.callSub}</div>
              </div>
            </div>

            {/* Call options */}
            <div className="cm-options">
              <button className="cm-opt cm-opt-green" onClick={audioCall}>
                <div className="cm-opt-icon">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2A19.79 19.79 0 0 1 4.69 12 19.79 19.79 0 0 1 3.6 1.25h3A2 2 0 0 1 8.6 3a12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.9a16 16 0 0 0 6 6l.95-.95a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 21.5 16.5z"/>
                  </svg>
                </div>
                <div className="cm-opt-text">
                  <span>{t.audioLbl}</span>
                  <small>{PHONE}</small>
                </div>
              </button>

              <button className="cm-opt cm-opt-blue" onClick={videoCall}>
                <div className="cm-opt-icon">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <polygon points="23 7 16 12 23 17 23 7"/>
                    <rect x="1" y="5" width="15" height="14" rx="2"/>
                  </svg>
                </div>
                <div className="cm-opt-text">
                  <span>{t.videoLbl}</span>
                  <small>Google Meet / Zoom</small>
                </div>
              </button>
            </div>

            {/* Book meeting */}
            <button className="cm-book" onClick={bookMeeting}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              {t.bookLbl}
            </button>
            <p className="cm-avail">🕐 {t.callAvail}</p>
          </>
        )}

        {phase === 'ringing' && (
          <div className="cm-ringing">
            <div className="cm-ring-wrap">
              <div className="cm-ring r1"/><div className="cm-ring r2"/><div className="cm-ring r3"/>
              <div className="cm-ring-core">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2A19.79 19.79 0 0 1 4.69 12 19.79 19.79 0 0 1 3.6 1.25h3A2 2 0 0 1 8.6 3a12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.9a16 16 0 0 0 6 6l.95-.95a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 21.5 16.5z"/>
                </svg>
              </div>
            </div>
            <p className="cm-rtext">{t.connecting}</p>
            <p className="cm-rsub">SecComply Team</p>
          </div>
        )}

        {phase === 'done' && (
          <div className="cm-ringing">
            <div style={{fontSize:'3.5rem',marginBottom:'16px'}}>🎉</div>
            <p className="cm-rtext">You're all set!</p>
            <button className="cm-book" style={{marginTop:'16px'}} onClick={onClose}>Back to Chat</button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   LANGUAGE PICKER
═══════════════════════════════════════════════════════════════ */
function LangPicker({ onPick }) {
  return (
    <div className="lp-root">
      <div className="lp-hero">
        <div className="lp-bot-icon">
          <svg width="36" height="36" viewBox="0 0 40 40" fill="none">
            <circle cx="14" cy="19" r="4" fill="white" opacity=".9"/>
            <circle cx="26" cy="19" r="4" fill="white" opacity=".9"/>
            <circle cx="15" cy="18" r="1.6" fill="#FFD04A"/>
            <circle cx="27" cy="18" r="1.6" fill="#FFD04A"/>
            <path d="M12 28 Q20 34 28 28" stroke="white" strokeWidth="2.2" strokeLinecap="round" fill="none"/>
            <line x1="20" y1="3" x2="20" y2="8" stroke="white" strokeWidth="2" strokeLinecap="round" opacity=".7"/>
            <circle cx="20" cy="2" r="2" fill="white" opacity=".5">
              <animate attributeName="opacity" values=".5;.05;.5" dur="2s" repeatCount="indefinite"/>
            </circle>
            <rect x="2" y="9" width="36" height="24" rx="9" fill="white" fillOpacity=".1" stroke="white" strokeOpacity=".3" strokeWidth="1.5"/>
          </svg>
        </div>
        <h2 className="lp-title"><span>Veri</span> · SecComply</h2>
        <p className="lp-desc">AI compliance guide · by SecComply</p>
        <div className="lp-badge">🌐 Choose your language to continue</div>
      </div>

      <div className="lp-grid">
        {LANGS.map(l => (
          <button key={l.code} className="lp-btn" onClick={() => onPick(l)}>
            <span className="lp-flag">{l.flag}</span>
            <span className="lp-native">{l.native}</span>
            <span className="lp-label">{l.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SUGGESTION CHIPS
═══════════════════════════════════════════════════════════════ */
function Chips({ items, onSend }) {
  return (
    <div className="chips">
      {items.map((s,i) => <button key={i} className="chip" onClick={() => onSend(s)}>{s}</button>)}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN WIDGET
═══════════════════════════════════════════════════════════════ */
export default function ChatWidget() {
  const [mounted, setMounted] = useState(false);
  const [open,    setOpen]    = useState(false);
  const [screen,  setScreen]  = useState('chat');   // lang | chat  -- starts directly in chat
  const [lang,    setLang]    = useState(LANGS[0]);
  const [msgs,    setMsgs]    = useState([]);
  const [input,   setInput]   = useState('');
  const [busy,    setBusy]    = useState(false);
  const [hist,    setHist]    = useState([]);
  const [spkId,   setSpkId]   = useState(null);
  const [interim, setInterim] = useState('');
  const [callOpen,setCallOpen]= useState(false);
  const [langDD,  setLangDD]  = useState(false);
  const [badge,   setBadge]   = useState(1);

  const bottomRef = useRef(null);
  const inited    = useRef(false);
  const sid       = useRef('s'+Math.random().toString(36).slice(2));
  const idleT     = useRef(null);
  const idleDone  = useRef(false);
  const asked     = useRef(new Set());
  const fbI       = useRef(0);
  const msgN      = useRef(0);

  const t    = T[lang.code] || T.en;
  const voice = useVoice(
    v  => { setInput(v); setInterim(''); },
    v  => setInterim(v),
    lang.voice
  );

  /* Only render on client to avoid SSR hydration mismatch */
  useEffect(() => { setMounted(true); }, []);

  /* Open automatically 400ms after mount */
  useEffect(() => {
    const id = setTimeout(() => { setOpen(true); setBadge(0); }, 400);
    return () => clearTimeout(id);
  }, []);

  /* Scroll to bottom */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior:'smooth' });
  }, [msgs, busy]);

  /* Start chat after language chosen */
  function pickLang(l) {
    setLang(l); setScreen('chat'); inited.current = false;
  }

  useEffect(() => {
    if (screen !== 'chat' || inited.current) return;
    inited.current = true; idleDone.current = false;
    asked.current.clear(); setMsgs([]); setHist([]);
    msgN.current = 0; fbI.current = 0;
    const now = T[lang.code] || T.en;
    const chips = (CHIPS0[lang.code] || CHIPS0.en).slice(0,4);
    setTimeout(() => {
      pushBot(now.welcome, chips);
      tts(now.welcome.replace(/\*\*/g,'').replace(/\*/g,'').replace(/\n/g,' ').slice(0,260), lang.voice, () => setSpkId(null));
    }, 500);
  }, [screen, lang.code]);

  /* Idle nudge after 90s */
  useEffect(() => {
    if (!open || screen !== 'chat') return;
    clearTimeout(idleT.current);
    if (msgs.length > 0 && !busy && !idleDone.current) {
      idleT.current = setTimeout(() => {
        if (idleDone.current) return;
        idleDone.current = true;
        pushBot("Still thinking about compliance? 🤔 I'm right here — ask me anything!", fallbackChips(3));
      }, 90000);
    }
    return () => clearTimeout(idleT.current);
  }, [msgs, open, busy, screen]);

  function fallbackChips(n=3) {
    const pool = POOL[lang.code] || POOL.en;
    const res = [];
    for (let i=0; i<n*3 && res.length<n; i++) {
      const c = pool[fbI.current % pool.length]; fbI.current++;
      if (!asked.current.has(c.toLowerCase())) res.push(c);
    }
    return res;
  }

  const ts = () => new Date().toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'});

  function pushBot(text, chips=[]) {
    setMsgs(p => [...p, {id:Date.now()+Math.random(), role:'bot', text, time:ts(), chips}]);
  }
  function pushUser(text) {
    setMsgs(p => [...p, {id:Date.now()+Math.random(), role:'user', text, time:ts()}]);
  }

  function switchLang(l) {
    setLangDD(false);
    setLang(l);
    inited.current = false;
    setScreen('chat');  // stay on chat, never show lang picker
  }

  async function send(text) {
    const txt = typeof text === 'string' ? text : input;
    if (!txt?.trim() || busy) return;
    clearTimeout(idleT.current);

    if (!detectOk(txt, lang.code)) {
      pushUser(txt); setInput(''); setInterim('');
      const msg = (T[lang.code]||T.en).wrongLang;
      setTimeout(() => { pushBot(msg,[]); tts(msg.replace(/\*\*/g,'').slice(0,200), lang.voice); }, 600);
      return;
    }

    asked.current.add(txt.toLowerCase().trim());
    setInput(''); setInterim('');
    pushUser(txt);
    msgN.current++;
    const next = [...hist, { role:'user', content:txt }];
    setHist(next); setBusy(true);

    try {
      const r  = await fetch('/api/chat', { method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ messages:next, session_id:sid.current, language:lang.label, msg_count:msgN.current }) });
      const d  = await r.json();
      const reply = d.reply || 'Something went wrong. Please try again!';
      let chips = (d.suggestions||[]).filter(s => !asked.current.has(s.toLowerCase().trim()));
      if (chips.length < 2) chips = [...chips, ...fallbackChips(3-chips.length)];
      chips = chips.filter(s => !asked.current.has(s.toLowerCase())).slice(0,3);
      setHist(p => [...p, { role:'assistant', content:reply }]);
      setTimeout(() => {
        pushBot(reply, chips);
        tts(reply.replace(/\*\*/g,'').replace(/\*/g,'').slice(0,300), lang.voice, () => setSpkId(null));
        setSpkId('latest');
      }, 60);
    } catch {
      pushBot('Something went wrong. Please try again!');
    } finally {
      setBusy(false);
    }
  }

  function toggleSpeak(m) {
    if (!window.speechSynthesis) return;
    if (spkId === m.id) { window.speechSynthesis.cancel(); setSpkId(null); return; }
    setSpkId(m.id);
    tts(m.text, lang.voice, () => setSpkId(null));
  }

  const dispInput = interim || input;
  const rtl = lang.dir === 'rtl';

  if (!mounted) return null;

  return (
    <>
      {/* ── FAB ─────────────────────────────────────────────────── */}
      <button className="fab" onClick={() => { setOpen(o=>!o); setBadge(0); }}>
        {badge>0 && !open && <span className="fab-badge">{badge}</span>}
        {!open && <><span className="fab-pulse p1"/><span className="fab-pulse p2"/></>}
        {open
          ? <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          : <svg viewBox="0 0 40 40" width="32" height="32" fill="none">
              <rect x="2" y="9" width="36" height="24" rx="9" fill="white" fillOpacity=".15" stroke="white" strokeOpacity=".4" strokeWidth="1.5"/>
              <circle cx="14" cy="19" r="4" fill="white" opacity=".9"/>
              <circle cx="26" cy="19" r="4" fill="white" opacity=".9"/>
              <circle cx="15" cy="18" r="1.6" fill="#FFD04A"/>
              <circle cx="27" cy="18" r="1.6" fill="#FFD04A"/>
              <path d="M12 28 Q20 34 28 28" stroke="white" strokeWidth="2.2" strokeLinecap="round" fill="none"/>
            </svg>
        }
      </button>

      {/* ── CALL MODAL ───────────────────────────────────────────── */}
      {callOpen && <CallModal t={t} lang={lang} onClose={() => setCallOpen(false)}/>}

      {/* ── CHAT WINDOW ─────────────────────────────────────────── */}
      {open && (
        <div className="win">

          {screen === 'lang'
            ? <LangPicker onPick={pickLang}/>
            : <> {/* always chat */}
                {/* HEADER */}
                <header className="hdr">
                  <div className="hdr-left">
                    <div className="hdr-avt">
                      <svg viewBox="0 0 40 40" width="26" height="26" fill="none">
                        <rect x="1" y="7" width="38" height="26" rx="8" fill="white" fillOpacity=".15" stroke="white" strokeOpacity=".35" strokeWidth="1.5"/>
                        <circle cx="13" cy="18" r="4" fill="white" opacity=".9"/>
                        <circle cx="27" cy="18" r="4" fill="white" opacity=".9"/>
                        <circle cx="14" cy="17" r="1.5" fill="#FFD04A"/>
                        <circle cx="28" cy="17" r="1.5" fill="#FFD04A"/>
                        <path d="M11 27 Q20 33 29 27" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none"/>
                      </svg>
                      <span className="hdr-dot"/>
                    </div>
                    <div className="hdr-info">
                      <div className="hdr-name">
                        <span className="hdr-veri">Veri</span><span className="hdr-by"> · SecComply</span>
                      </div>
                      <span className="hdr-status">
                        <span className="hdr-blink"/>
                        {t.status}
                      </span>
                    </div>
                  </div>

                  <div className="hdr-right">
                    {/* Call button */}
                    <button className="hbtn hbtn-call" onClick={() => setCallOpen(true)}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2A19.79 19.79 0 0 1 4.69 12 19.79 19.79 0 0 1 3.6 1.25h3A2 2 0 0 1 8.6 3a12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.9a16 16 0 0 0 6 6l.95-.95a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 21.5 16.5z"/>
                      </svg>
                      Call
                    </button>

                    {/* Language switcher */}
                    <div style={{position:'relative'}}>
                      <button className="hbtn" onClick={() => setLangDD(d=>!d)}>
                        {lang.flag}&nbsp;{lang.native.slice(0,5)}
                        <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="6 9 12 15 18 9"/></svg>
                      </button>
                      {langDD && (
                        <div className="ldd">
                          {LANGS.map(l => (
                            <button key={l.code} className={`ldd-item${lang.code===l.code?' ldd-active':''}`} onClick={() => switchLang(l)}>
                              <span>{l.flag}</span>
                              <span className="ldd-name">{l.native}</span>
                              <span className="ldd-en">{l.label}</span>
                              {lang.code===l.code && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Close */}
                    <button className="hbtn hbtn-close" onClick={() => setOpen(false)}>
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    </button>
                  </div>
                </header>

                {/* VOICE STRIP */}
                {voice.vs !== 'idle' && (
                  <div className={`vstrip ${voice.vs==='on'?'vstrip-on':'vstrip-busy'}`}>
                    <div className="vwave">{[1,2,3,4,5,6].map(i => <span key={i} style={{animationDelay:`${i*65}ms`}}/>)}</div>
                    <span>{voice.vs==='on' ? '🎤 Listening…' : '⚙️ Processing…'}</span>
                    {voice.vs==='on' && <button className="vdone" onClick={voice.stop}>Done</button>}
                  </div>
                )}

                {/* INTERIM TEXT */}
                {interim && <div className="vinterim">"{interim}…"</div>}

                {/* MESSAGES */}
                <div className="msgs" dir={rtl?'rtl':'ltr'}>
                  {msgs.map(m => (
                    <div key={m.id} className={`msg msg-${m.role}`}>
                      {m.role==='bot' && (
                        <div className="msg-avt">
                          <svg viewBox="0 0 40 40" width="22" height="22" fill="none">
                            <rect x="1" y="7" width="38" height="26" rx="8" fill="white" fillOpacity=".2" stroke="white" strokeOpacity=".4" strokeWidth="1.5"/>
                            <circle cx="13" cy="18" r="3.5" fill="white" opacity=".9"/>
                            <circle cx="27" cy="18" r="3.5" fill="white" opacity=".9"/>
                            <circle cx="13.8" cy="17" r="1.3" fill="#FFD04A"/>
                            <circle cx="27.8" cy="17" r="1.3" fill="#FFD04A"/>
                            <path d="M11 27 Q20 32 29 27" stroke="white" strokeWidth="1.8" strokeLinecap="round" fill="none"/>
                          </svg>
                        </div>
                      )}
                      <div className="msg-col">
                        <div className={`bubble bubble-${m.role}`}>
                          <div className="bubble-body" dangerouslySetInnerHTML={{__html: richText(m.text)}}/>
                        </div>
                        <div className={`msg-meta ${m.role==='user'?'meta-user':''}`}>
                          <span className="msg-time">{m.time}</span>
                          {m.role==='bot' && (
                            <button className={`spk ${spkId===m.id?'spk-on':''}`} onClick={()=>toggleSpeak(m)}>
                              {spkId===m.id
                                ? <><svg width="9" height="9" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg> {t.stop}</>
                                : <><svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/></svg> {t.listen}</>
                              }
                            </button>
                          )}
                        </div>
                        {m.role==='bot' && m.chips?.length > 0 && <Chips items={m.chips} onSend={send}/>}
                      </div>
                    </div>
                  ))}

                  {busy && (
                    <div className="msg msg-bot">
                      <div className="msg-avt">
                        <svg viewBox="0 0 40 40" width="22" height="22" fill="none">
                          <rect x="1" y="7" width="38" height="26" rx="8" fill="white" fillOpacity=".2" stroke="white" strokeOpacity=".4" strokeWidth="1.5"/>
                          <circle cx="13" cy="18" r="3.5" fill="white" opacity=".9"/>
                          <circle cx="27" cy="18" r="3.5" fill="white" opacity=".9"/>
                          <circle cx="13.8" cy="17" r="1.3" fill="#FFD04A"/>
                          <circle cx="27.8" cy="17" r="1.3" fill="#FFD04A"/>
                          <path d="M11 27 Q20 32 29 27" stroke="white" strokeWidth="1.8" strokeLinecap="round" fill="none"/>
                        </svg>
                      </div>
                      <div className="bubble bubble-bot bubble-typing">
                        <span/><span style={{animationDelay:'.18s'}}/><span style={{animationDelay:'.36s'}}/>
                      </div>
                    </div>
                  )}
                  <div ref={bottomRef}/>
                </div>

                {/* INPUT BAR */}
                <div className="ibar">
                  <input
                    className={`inp ${voice.vs!=='idle'?'inp-voice':''}`}
                    value={dispInput}
                    onChange={e=>setInput(e.target.value)}
                    onKeyDown={e=>e.key==='Enter'&&voice.vs==='idle'&&send(input)}
                    placeholder={voice.vs==='on'?'🎤 Listening…':voice.vs==='busy'?'Processing…':t.ph}
                    disabled={busy||voice.vs==='busy'}
                    dir={rtl?'rtl':'ltr'}
                    style={{fontStyle:interim?'italic':'normal'}}
                  />
                  <button className={`mic-btn ${voice.vs==='on'?'mic-on':''}`}
                    onClick={voice.vs==='on' ? voice.stop : voice.start}>
                    {voice.vs==='on'
                      ? <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
                      : <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="9" y="2" width="6" height="12" rx="3"/><path d="M5 10a7 7 0 0 0 14 0"/><line x1="12" y1="19" x2="12" y2="22"/><line x1="9" y1="22" x2="15" y2="22"/></svg>
                    }
                  </button>
                  <button className="send-btn" onClick={()=>send(input)} disabled={busy||!input.trim()}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
                    </svg>
                  </button>
                </div>

                {/* FOOTER */}
                <div className="ftr">
                  <span>{t.footer}</span>
                  <a href={CONTACT_URL} target="_blank" rel="noreferrer" className="ftr-link">seccomply.net ↗</a>
                </div>
              </>
          }
        </div>
      )}

      {/* ═══════════════ ALL STYLES ═══════════════ */}
      <style>{`
        /* ── Design tokens ── */
        .win, .fab, .cm-card, .lp-root, .ldd {
          --bg0:    #070D1A;
          --bg1:    #0C1628;
          --bg2:    #101E32;
          --bg3:    #16263E;
          --border: rgba(255,255,255,.07);
          --text:   #C8DEFF;
          --muted:  #3D5A80;
          --accent: #FF6B35;
          --accL:   rgba(255,107,53,.14);
          --green:  #4CE6A8;
          --font:   'DM Sans', 'Segoe UI', sans-serif;
        }

        /* ── FAB ── */
        .fab {
          position:fixed; bottom:26px; right:26px; z-index:9999;
          width:60px; height:60px; border-radius:50%; border:none; cursor:pointer;
          background:linear-gradient(145deg,#FF8040,#E8521E,#B83010);
          display:flex; align-items:center; justify-content:center;
          box-shadow:0 8px 28px rgba(255,107,53,.5);
          animation:fab-float 3.5s ease-in-out infinite;
          transition:transform .2s, box-shadow .2s;
          font-family:var(--font);
        }
        .fab:hover { transform:scale(1.09) translateY(-2px); box-shadow:0 12px 36px rgba(255,107,53,.6); }
        .fab-badge {
          position:absolute; top:-4px; right:-4px;
          width:20px; height:20px; border-radius:50%;
          background:#FF3355; border:2.5px solid #fff;
          font-size:10px; font-weight:800; color:#fff;
          display:flex; align-items:center; justify-content:center;
          font-family:var(--font);
        }
        .fab-pulse {
          position:absolute; border-radius:50%;
          border:2px solid rgba(255,107,53,.35);
          animation:fab-ring 2.8s ease-out infinite;
        }
        .fab-pulse.p1 { inset:-10px; }
        .fab-pulse.p2 { inset:-18px; animation-delay:.9s; border-color:rgba(255,107,53,.18); }

        /* ── Window ── */
        .win {
          position:fixed; bottom:104px; right:26px;
          width:412px; max-height:660px;
          z-index:9998; border-radius:20px;
          overflow:hidden; display:flex; flex-direction:column;
          background:var(--bg0);
          box-shadow:0 24px 72px rgba(0,0,0,.72), 0 0 0 1px rgba(255,255,255,.06);
          animation:win-in .32s cubic-bezier(.34,1.56,.64,1);
          font-family:var(--font);
        }

        /* ── Language picker ── */
        .lp-root { display:flex; flex-direction:column; height:100%; background:var(--bg0); }
        .lp-hero {
          background:linear-gradient(160deg, #0D1E38 0%, #0A1428 100%);
          padding:28px 20px 22px; text-align:center;
          border-bottom:1px solid var(--border);
          flex-shrink:0;
        }
        .lp-bot-icon {
          width:72px; height:72px; border-radius:20px;
          background:linear-gradient(145deg,#FF8040,#E8521E,#B83010);
          display:flex; align-items:center; justify-content:center;
          margin:0 auto 14px; box-shadow:0 10px 36px rgba(255,107,53,.45);
        }
        .lp-title {
          font-size:1.25rem; font-weight:800; color:#fff; margin:0 0 5px;
          letter-spacing:-.03em; font-family:var(--font);
        }
        .lp-title span { color:var(--accent); }
        .lp-desc { font-size:.72rem; color:var(--muted); margin:0 0 16px; letter-spacing:.06em; text-transform:uppercase; }
        .lp-badge {
          display:inline-block; background:rgba(255,107,53,.12);
          border:1px solid rgba(255,107,53,.25); color:var(--accent);
          padding:7px 16px; border-radius:20px; font-size:.8rem; font-weight:600;
        }
        .lp-grid {
          flex:1; overflow-y:auto; padding:16px;
          display:grid; grid-template-columns:1fr 1fr 1fr; gap:10px;
        }
        .lp-grid::-webkit-scrollbar{width:3px;}
        .lp-grid::-webkit-scrollbar-thumb{background:rgba(255,255,255,.08);border-radius:3px;}
        .lp-btn {
          background:rgba(255,255,255,.04); border:1px solid rgba(255,255,255,.07);
          border-radius:14px; padding:16px 8px; cursor:pointer;
          display:flex; flex-direction:column; align-items:center; gap:5px;
          font-family:var(--font); transition:all .2s;
        }
        .lp-btn:hover {
          background:rgba(255,107,53,.16); border-color:rgba(255,107,53,.4);
          transform:translateY(-3px); box-shadow:0 8px 22px rgba(255,107,53,.18);
        }
        .lp-flag  { font-size:1.9rem; }
        .lp-native{ font-size:.8rem; font-weight:700; color:#fff; }
        .lp-label { font-size:.63rem; color:var(--muted); }

        /* ── Header ── */
        .hdr {
          background:linear-gradient(135deg, #0C1828 0%, #112040 100%);
          padding:13px 14px; display:flex; align-items:center; justify-content:space-between;
          flex-shrink:0; border-bottom:1px solid var(--border);
        }
        .hdr-left { display:flex; align-items:center; gap:10px; }
        .hdr-avt {
          position:relative; width:44px; height:44px; border-radius:13px;
          background:linear-gradient(145deg,#FF8040,#E8521E,#B83010);
          display:flex; align-items:center; justify-content:center; flex-shrink:0;
          box-shadow:0 4px 18px rgba(255,107,53,.4);
        }
        .hdr-dot {
          position:absolute; bottom:1px; right:1px;
          width:11px; height:11px; border-radius:50%;
          background:var(--green); border:2px solid #0C1828;
        }
        .hdr-info { display:flex; flex-direction:column; gap:3px; }
        .hdr-name { font-size:.88rem; font-weight:800; color:#fff; line-height:1; display:flex; align-items:baseline; gap:0; }
        .hdr-veri { background:linear-gradient(90deg,#FF8040,#FFB347); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; font-size:.95rem; font-weight:900; letter-spacing:-.01em; }
        .hdr-by { color:rgba(200,222,255,.5); font-size:.7rem; font-weight:500; letter-spacing:.01em; }
        .hdr-status {
          font-size:.65rem; color:var(--green);
          display:flex; align-items:center; gap:5px;
        }
        .hdr-blink {
          width:5px; height:5px; border-radius:50%; background:var(--green);
          animation:blink 2.4s ease-in-out infinite;
        }
        .hdr-right { display:flex; align-items:center; gap:6px; }
        .hbtn {
          background:rgba(255,255,255,.07); border:1px solid rgba(255,255,255,.1);
          border-radius:9px; padding:7px 10px; color:rgba(255,255,255,.75);
          font-size:.72rem; font-weight:600; cursor:pointer;
          display:flex; align-items:center; gap:5px; font-family:var(--font);
          transition:all .18s;
        }
        .hbtn:hover { background:rgba(255,255,255,.13); color:#fff; }
        .hbtn-call { background:rgba(76,230,168,.1)!important; color:var(--green)!important; border-color:rgba(76,230,168,.22)!important; }
        .hbtn-call:hover { background:rgba(76,230,168,.2)!important; }
        .hbtn-close:hover { background:rgba(255,60,60,.15)!important; color:#ff7070!important; }

        /* ── Language dropdown ── */
        .ldd {
          position:absolute; top:calc(100% + 8px); right:0;
          background:#0E1D32; border:1px solid rgba(255,255,255,.08);
          border-radius:14px; overflow:hidden; z-index:100;
          min-width:180px; max-height:280px; overflow-y:auto;
          box-shadow:0 20px 60px rgba(0,0,0,.7);
        }
        .ldd::-webkit-scrollbar{width:3px;}
        .ldd::-webkit-scrollbar-thumb{background:rgba(255,255,255,.08);}
        .ldd-item {
          display:flex; align-items:center; gap:9px; width:100%;
          padding:10px 13px; background:none; border:none;
          border-bottom:1px solid rgba(255,255,255,.04);
          color:rgba(200,222,255,.7); font-size:.82rem;
          cursor:pointer; font-family:var(--font); transition:background .15s;
        }
        .ldd-item:hover { background:rgba(255,255,255,.05); }
        .ldd-active { background:rgba(255,107,53,.15)!important; color:var(--accent)!important; }
        .ldd-name { flex:1; font-weight:600; }
        .ldd-en { font-size:.64rem; color:var(--muted); }

        /* ── Voice strip ── */
        .vstrip {
          padding:9px 15px; display:flex; align-items:center;
          justify-content:space-between; flex-shrink:0;
          font-family:var(--font); font-size:.82rem; font-weight:600; color:#fff;
          gap:10px;
        }
        .vstrip-on   { background:linear-gradient(90deg,#C0392B,#FF4B5C); }
        .vstrip-busy { background:linear-gradient(90deg,#D35400,#F39C12); }
        .vwave { display:flex; align-items:center; gap:3px; height:18px; flex-shrink:0; }
        .vwave span {
          width:3px; border-radius:3px; background:rgba(255,255,255,.85);
          animation:wave .6s ease-in-out infinite alternate;
        }
        .vdone {
          background:rgba(255,255,255,.22); border:none; color:#fff;
          padding:4px 12px; border-radius:20px; font-size:.72rem; font-weight:700;
          cursor:pointer; font-family:var(--font); flex-shrink:0;
        }
        .vinterim {
          padding:7px 16px; font-size:.82rem; font-style:italic;
          color:var(--accent); background:rgba(255,107,53,.07);
          border-bottom:1px solid rgba(255,107,53,.14); flex-shrink:0;
          font-family:var(--font);
        }

        /* ── Messages ── */
        .msgs {
          flex:1; overflow-y:auto; padding:14px 13px 8px;
          display:flex; flex-direction:column; gap:4px;
          background:linear-gradient(180deg,#07101C 0%,#091426 100%);
        }
        .msgs::-webkit-scrollbar{width:4px;}
        .msgs::-webkit-scrollbar-thumb{background:rgba(255,255,255,.07);border-radius:4px;}
        .msg {
          display:flex; align-items:flex-end; gap:8px;
          max-width:88%; animation:msg-in .22s ease; margin-bottom:8px;
        }
        .msg-bot  { align-self:flex-start; }
        .msg-user { align-self:flex-end; flex-direction:row-reverse; }
        .msg-avt {
          width:32px; height:32px; border-radius:10px; flex-shrink:0;
          background:linear-gradient(145deg,#FF8040,#B83010);
          display:flex; align-items:center; justify-content:center; margin-bottom:2px;
          box-shadow:0 3px 12px rgba(255,107,53,.35);
        }
        .msg-col { display:flex; flex-direction:column; gap:0; }
        .bubble {
          padding:11px 15px; font-size:.855rem; line-height:1.72;
          max-width:275px; word-break:break-word; font-family:var(--font);
        }
        .bubble-bot {
          background:var(--bg3); color:var(--text);
          border:1px solid rgba(255,255,255,.07);
          border-radius:16px 16px 16px 4px;
          box-shadow:0 3px 14px rgba(0,0,0,.3), inset 0 1px 0 rgba(255,255,255,.04);
        }
        .bubble-user {
          background:linear-gradient(135deg,#FF6B35,#C94726);
          color:#fff; border-radius:16px 16px 4px 16px;
          box-shadow:0 3px 14px rgba(255,107,53,.38);
        }
        .bubble-typing {
          padding:13px 16px!important;
          display:flex!important; align-items:center; gap:6px;
        }
        .bubble-typing span {
          width:7px; height:7px; border-radius:50%; background:#2A4A6A;
          display:inline-block; animation:dot 1.2s ease-in-out infinite;
        }
        .bubble-body p { margin:0 0 5px; }
        .bubble-body p:last-child { margin-bottom:0; }
        .bubble-body strong { font-weight:700; }
        .bubble-body em { font-style:italic; opacity:.8; }
        .bubble-body ul { padding-left:0; margin:8px 0 4px; list-style:none; }
        .bubble-body li {
          padding:3px 0 3px 16px; position:relative; line-height:1.6;
        }
        .bubble-body li::before {
          content:'›'; position:absolute; left:2px;
          color:var(--accent); font-weight:700;
        }
        .msg-meta {
          display:flex; align-items:center; gap:6px;
          margin-top:5px; padding-left:2px; font-family:var(--font);
        }
        .meta-user { justify-content:flex-end; }
        .msg-time { font-size:.6rem; color:var(--muted); }
        .spk {
          background:none; border:none; cursor:pointer; color:var(--muted);
          display:flex; align-items:center; gap:3px;
          font-size:.66rem; padding:2px 7px; border-radius:6px;
          transition:all .18s; font-family:var(--font);
        }
        .spk:hover { color:var(--accent); background:var(--accL); }
        .spk-on   { color:var(--accent)!important; background:var(--accL)!important; }

        /* ── Chips ── */
        .chips {
          display:flex; flex-wrap:wrap; gap:6px;
          padding-left:40px; margin-top:9px;
          animation:msg-in .38s ease;
        }
        .chip {
          background:rgba(255,107,53,.08); border:1.5px solid rgba(255,107,53,.22);
          color:var(--accent); padding:6px 13px; border-radius:20px;
          font-size:.73rem; font-weight:600; cursor:pointer;
          font-family:var(--font); white-space:nowrap; transition:all .18s;
        }
        .chip:hover {
          background:linear-gradient(135deg,#FF6B35,#C94726);
          color:#fff; border-color:transparent;
          transform:translateY(-2px); box-shadow:0 5px 14px rgba(255,107,53,.32);
        }

        /* ── Input bar ── */
        .ibar {
          display:flex; align-items:center; gap:8px;
          padding:11px 12px; border-top:1px solid rgba(255,255,255,.05);
          background:#07101A; flex-shrink:0;
        }
        .inp {
          flex:1; background:rgba(255,255,255,.05);
          border:1.5px solid rgba(255,255,255,.09);
          border-radius:13px; padding:10px 14px;
          font-size:.86rem; color:var(--text);
          font-family:var(--font); outline:none;
          caret-color:var(--accent); transition:border-color .2s;
        }
        .inp:focus { border-color:rgba(255,107,53,.38); }
        .inp::placeholder { color:var(--muted); }
        .inp-voice { border-color:rgba(255,107,53,.38)!important; background:rgba(255,107,53,.05)!important; }
        .mic-btn {
          width:40px; height:40px; border-radius:50%; border:none; cursor:pointer;
          background:rgba(255,255,255,.07); color:rgba(200,220,255,.55);
          display:flex; align-items:center; justify-content:center;
          flex-shrink:0; transition:all .2s;
        }
        .mic-btn:hover { background:var(--accL); color:var(--accent); }
        .mic-on { background:linear-gradient(135deg,#FF4757,#C0392B)!important; color:#fff!important; box-shadow:0 0 0 5px rgba(255,71,87,.18)!important; }
        .send-btn {
          width:40px; height:40px; border-radius:12px; border:none; cursor:pointer;
          background:linear-gradient(135deg,#FF6B35,#C94726);
          color:#fff; display:flex; align-items:center; justify-content:center;
          flex-shrink:0; box-shadow:0 3px 12px rgba(255,107,53,.38); transition:all .2s;
        }
        .send-btn:not(:disabled):hover { transform:translateY(-1px); box-shadow:0 6px 18px rgba(255,107,53,.5); }
        .send-btn:disabled { opacity:.3; cursor:default; box-shadow:none; }

        /* ── Footer ── */
        .ftr {
          background:#050D18; padding:7px 14px; flex-shrink:0;
          border-top:1px solid rgba(255,255,255,.03);
          display:flex; align-items:center; justify-content:space-between;
          font-family:var(--font);
        }
        .ftr span { font-size:.6rem; color:rgba(61,90,128,.7); }
        .ftr-link { font-size:.62rem; color:var(--accent); font-weight:700; text-decoration:none; }
        .ftr-link:hover { text-decoration:underline; }

        /* ── Call Modal ── */
        .cm-backdrop {
          position:fixed; inset:0; z-index:10000;
          background:rgba(0,0,0,.65); backdrop-filter:blur(8px);
          display:flex; align-items:center; justify-content:center;
          animation:fade-in .2s ease;
        }
        .cm-card {
          background:linear-gradient(160deg,#0D1E36,#112344);
          border:1px solid rgba(255,255,255,.08); border-radius:22px;
          padding:26px 22px 22px; width:350px; max-width:calc(100vw - 32px);
          position:relative; box-shadow:0 32px 80px rgba(0,0,0,.75);
          animation:win-in .28s ease; font-family:var(--font);
        }
        .cm-x {
          position:absolute; top:14px; right:14px;
          background:rgba(255,255,255,.07); border:none;
          color:rgba(255,255,255,.45); width:28px; height:28px;
          border-radius:8px; cursor:pointer; display:flex; align-items:center; justify-content:center;
          transition:all .18s;
        }
        .cm-x:hover { background:rgba(255,60,60,.15); color:#ff7070; }
        .cm-head { display:flex; align-items:center; gap:14px; margin-bottom:22px; }
        .cm-team-avatars { display:flex; align-items:center; position:relative; flex-shrink:0; }
        .cm-avatar {
          width:38px; height:38px; border-radius:50%;
          background:linear-gradient(135deg,#FF6B35,#C94726);
          border:2px solid #0D1E36;
          display:flex; align-items:center; justify-content:center;
          font-size:.8rem; font-weight:800; color:#fff;
          box-shadow:0 3px 10px rgba(0,0,0,.3);
        }
        .cm-online-ring {
          position:absolute; bottom:-2px; right:-2px;
          width:12px; height:12px; border-radius:50%;
          background:var(--green); border:2.5px solid #0D1E36;
        }
        .cm-title { font-size:1rem; font-weight:800; color:#fff; }
        .cm-sub { font-size:.74rem; color:var(--muted); margin-top:3px; }
        .cm-options { display:flex; gap:10px; margin-bottom:12px; }
        .cm-opt {
          flex:1; padding:16px 12px; border-radius:15px;
          border:none; cursor:pointer; display:flex; flex-direction:column;
          align-items:center; gap:9px; font-family:var(--font); transition:all .2s;
        }
        .cm-opt-green { background:rgba(76,230,168,.1); border:1.5px solid rgba(76,230,168,.24); color:var(--green); }
        .cm-opt-green:hover { background:rgba(76,230,168,.2); transform:translateY(-2px); box-shadow:0 8px 22px rgba(76,230,168,.18); }
        .cm-opt-blue { background:rgba(82,166,255,.1); border:1.5px solid rgba(82,166,255,.24); color:#82A6FF; }
        .cm-opt-blue:hover { background:rgba(82,166,255,.2); transform:translateY(-2px); box-shadow:0 8px 22px rgba(82,166,255,.18); }
        .cm-opt-icon {
          width:48px; height:48px; border-radius:50%;
          background:rgba(255,255,255,.08);
          display:flex; align-items:center; justify-content:center;
        }
        .cm-opt-text { display:flex; flex-direction:column; align-items:center; gap:3px; }
        .cm-opt-text span { font-size:.88rem; font-weight:700; }
        .cm-opt-text small { font-size:.64rem; opacity:.6; }
        .cm-book {
          width:100%; padding:13px; border-radius:12px;
          background:linear-gradient(135deg,#FF6B35,#C94726);
          border:none; color:#fff; font-weight:700; font-size:.88rem;
          cursor:pointer; font-family:var(--font);
          display:flex; align-items:center; justify-content:center; gap:8px;
          box-shadow:0 4px 16px rgba(255,107,53,.35); transition:all .2s;
        }
        .cm-book:hover { box-shadow:0 6px 22px rgba(255,107,53,.5); transform:translateY(-1px); }
        .cm-avail { font-size:.71rem; color:var(--muted); text-align:center; margin:10px 0 0; }
        .cm-ringing { display:flex; flex-direction:column; align-items:center; padding:22px 0 14px; }
        .cm-ring-wrap { position:relative; width:100px; height:100px; margin-bottom:18px; }
        .cm-ring {
          position:absolute; border-radius:50%;
          border:2px solid rgba(76,230,168,.3);
          animation:call-ring 2s ease-out infinite;
        }
        .cm-ring.r1 { inset:0; }
        .cm-ring.r2 { inset:-14px; animation-delay:.55s; }
        .cm-ring.r3 { inset:-28px; animation-delay:1.1s; }
        .cm-ring-core {
          position:absolute; inset:0; border-radius:50%;
          background:linear-gradient(135deg,var(--green),#2AB87E)!important;
          border:none!important; display:flex!important;
          align-items:center; justify-content:center; animation:none!important;
        }
        .cm-rtext { font-size:1.05rem; font-weight:700; color:#fff; }
        .cm-rsub  { font-size:.78rem; color:var(--muted); margin-top:6px; }

        /* ── Keyframes ── */
        @keyframes fab-float  { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-5px)} }
        @keyframes fab-ring   { 0%{transform:scale(1);opacity:.8} 100%{transform:scale(1.9);opacity:0} }
        @keyframes win-in     { from{opacity:0;transform:scale(.92) translateY(24px)} to{opacity:1;transform:none} }
        @keyframes fade-in    { from{opacity:0} to{opacity:1} }
        @keyframes msg-in     { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:none} }
        @keyframes blink      { 0%,100%{opacity:1} 50%{opacity:.1} }
        @keyframes dot        { 0%,80%,100%{transform:translateY(0)} 40%{transform:translateY(-9px)} }
        @keyframes wave       { from{height:4px} to{height:18px} }
        @keyframes call-ring  { 0%{transform:scale(1);opacity:.6} 100%{transform:scale(1.5);opacity:0} }

        /* ── Responsive ── */
        @media(max-width:480px){
          .win{bottom:0!important;right:0!important;left:0!important;width:100%!important;max-height:93vh!important;border-radius:18px 18px 0 0!important;}
          .fab{bottom:18px;right:18px;}
        }
        @media(min-width:481px) and (max-width:768px){
          .win{right:12px!important;width:calc(100vw - 24px)!important;max-height:82vh!important;}
        }
      `}</style>
    </>
  );
}
