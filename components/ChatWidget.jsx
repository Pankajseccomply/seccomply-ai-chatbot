'use client';
import { useState, useEffect, useRef } from 'react';

/* ─── CONFIG ────────────────────────────────────────────────── */
const CONTACTS = [
  { name:'Aditya Hadke',     role:'Project Delivery Head', phone:'+918554003479', display:'+91 85540 03479' },
  { name:'Soham Sawant',     role:'Cyber Security Expert', phone:'+919823101731', display:'+91 98231 01731' },
  { name:'Aditi SecComply',  role:'Sales & Partnerships',  phone:'+918809468413', display:'+91 88094 68413' },
];
const BOOKING_URL   = 'https://calendly.com/seccomply';
const CONTACT_URL   = 'https://seccomply.net/contact';

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
    name:'SecComply AI', status:'Online  •  Replies instantly',
    welcome:"Hey there! 👋 I'm **SecComply AI**.\n\nI help companies get certified for **SOC 2, ISO 27001, HIPAA, GDPR** and 50+ frameworks. In days, not months.\n\nWhat are you trying to solve today?",
    ph:"Ask anything about compliance or SecComply…",
    listen:'Listen', stop:'Stop',
    wrongLang:"Looks like you typed in a different language 😊 I am currently in English mode. Please type in English or tap the language button to switch!",
    callHeading:'Talk to Our Experts',
    callSub:'Real humans. Real answers. Available now.',
    audioLbl:'Audio Call', videoLbl:'Video Call', bookLbl:'Schedule a Meeting',
    callAvail:'Mon to Fri  •  9 AM to 6 PM IST',
    connecting:'Connecting you…',
    connected:'Opening…',
    footer:'SecComply  •  AI-powered compliance platform',
  },
  hi: {
    name:'SecComply AI', status:'ऑनलाइन  •  तुरंत जवाब',
    welcome:"नमस्ते! 👋 मैं **SecComply AI** हूं।\n\nमैं **SOC 2, ISO 27001, HIPAA, GDPR** और 50+ frameworks में मदद करता हूं। महीनों की जगह **दिनों में**।\n\nआज आप किस compliance में मदद चाहते हैं?",
    ph:"SecComply के बारे में पूछें…",
    listen:'सुनें', stop:'रोकें',
    wrongLang:"आपने अलग भाषा में लिखा लग रहा है 😊 मैं हिंदी मोड में हूं। कृपया हिंदी में लिखें!",
    callHeading:'हमारी टीम से बात करें',
    callSub:'असली विशेषज्ञ। सीधे जवाब।',
    audioLbl:'ऑडियो कॉल', videoLbl:'वीडियो कॉल', bookLbl:'मीटिंग शेड्यूल करें',
    callAvail:'सोम से शुक्र  •  9 AM से 6 PM IST',
    connecting:'जोड़ा जा रहा है…', connected:'खुल रहा है…',
    footer:'SecComply  •  AI-संचालित compliance प्लेटफ़ॉर्म',
  },
  mr: {
    name:'SecComply AI', status:'ऑनलाइन  •  त्वरित उत्तर',
    welcome:"नमस्कार! 👋 मी **SecComply AI** आहे.\n\nमी **SOC 2, ISO 27001, HIPAA, GDPR** आणि 50+ frameworks मध्ये मदत करतो. महिन्यांऐवजी **दिवसांत**.\n\nआज तुम्हाला कशात मदत हवी आहे?",
    ph:"SecComply बद्दल विचारा…",
    listen:'ऐका', stop:'थांबा',
    wrongLang:"तुम्ही वेगळ्या भाषेत लिहिले 😊 मी मराठी मोडमध्ये आहे. कृपया मराठीत लिहा!",
    callHeading:'आमच्या तज्ञांशी बोला',
    callSub:'खरे तज्ञ. थेट उत्तरे.',
    audioLbl:'ऑडिओ कॉल', videoLbl:'व्हिडिओ कॉल', bookLbl:'मीटिंग शेड्यूल करा',
    callAvail:'सोम ते शुक्र  •  9 AM ते 6 PM IST',
    connecting:'जोडले जात आहे…', connected:'उघडत आहे…',
    footer:'SecComply  •  AI-चालित compliance प्लॅटफॉर्म',
  },
  fr: {
    name:'SecComply AI', status:'En ligne  •  Répond instantanément',
    welcome:"Bonjour ! 👋 Je suis **SecComply AI**.\n\nJ'aide les entreprises avec **SOC 2, ISO 27001, HIPAA, RGPD** et 50+ frameworks. En jours, pas en mois.\n\nQuel défi de conformité rencontrez-vous aujourd'hui ?",
    ph:"Posez une question sur SecComply…",
    listen:'Écouter', stop:'Arrêter',
    wrongLang:"Il semble que vous ayez tapé dans une autre langue 😊 Je suis en mode Français. Veuillez écrire en français !",
    callHeading:'Parler à nos experts',
    callSub:'Des humains réels. Des réponses directes.',
    audioLbl:'Appel audio', videoLbl:'Appel vidéo', bookLbl:'Planifier une réunion',
    callAvail:'Lun au Ven  •  9h à 18h IST',
    connecting:'Connexion…', connected:'Ouverture…',
    footer:'SecComply  •  Plateforme de conformité IA',
  },
  de: {
    name:'SecComply AI', status:'Online  •  Antwortet sofort',
    welcome:"Hallo! 👋 Ich bin **SecComply AI**.\n\nIch helfe bei **SOC 2, ISO 27001, HIPAA, DSGVO** und 50+ Frameworks. In Tagen, nicht Monaten.\n\nWelche Compliance-Herausforderung haben Sie gerade?",
    ph:"Fragen Sie zu SecComply…",
    listen:'Anhören', stop:'Stoppen',
    wrongLang:"Sie scheinen in einer anderen Sprache zu schreiben 😊 Ich bin im Deutschen Modus. Bitte schreiben Sie auf Deutsch!",
    callHeading:'Mit unseren Experten sprechen',
    callSub:'Echte Menschen. Direkte Antworten.',
    audioLbl:'Audioanruf', videoLbl:'Videoanruf', bookLbl:'Meeting planen',
    callAvail:'Mo bis Fr  •  9 bis 18 Uhr IST',
    connecting:'Verbinde…', connected:'Öffnen…',
    footer:'SecComply  •  KI-gestützte Compliance-Plattform',
  },
  es: {
    name:'SecComply AI', status:'En línea  •  Responde al instante',
    welcome:"Hola! 👋 Soy **SecComply AI**.\n\nAyudo con **SOC 2, ISO 27001, HIPAA, GDPR** y más de 50 marcos. En días, no meses.\n\nQué desafío de cumplimiento tienes hoy?",
    ph:"Pregunta sobre SecComply…",
    listen:'Escuchar', stop:'Detener',
    wrongLang:"Parece que escribiste en otro idioma 😊 Estoy en modo Español. Por favor escribe en español!",
    callHeading:'Hablar con nuestros expertos',
    callSub:'Personas reales. Respuestas directas.',
    audioLbl:'Llamada de audio', videoLbl:'Videollamada', bookLbl:'Programar reunión',
    callAvail:'Lun al Vie  •  9 AM a 6 PM IST',
    connecting:'Conectando…', connected:'Abriendo…',
    footer:'SecComply  •  Plataforma de cumplimiento con IA',
  },
  ar: {
    name:'SecComply AI', status:'متصل  •  يرد فوراً',
    welcome:"مرحباً! 👋 أنا **SecComply AI**.\n\nأساعد في **SOC 2، ISO 27001، HIPAA، GDPR** وأكثر من 50 إطاراً. في أيام وليس أشهراً.\n\nما تحدي الامتثال الذي تواجهه اليوم؟",
    ph:"اسأل عن SecComply…",
    listen:'استمع', stop:'إيقاف',
    wrongLang:"يبدو أنك كتبت بلغة مختلفة 😊 أنا في وضع العربية. يرجى الكتابة بالعربية!",
    callHeading:'تحدث مع خبرائنا',
    callSub:'بشر حقيقيون. إجابات مباشرة.',
    audioLbl:'مكالمة صوتية', videoLbl:'مكالمة فيديو', bookLbl:'جدولة اجتماع',
    callAvail:'الاثنين إلى الجمعة  •  9 صباحاً إلى 6 مساءً IST',
    connecting:'جارٍ التوصيل…', connected:'فتح…',
    footer:'SecComply  •  منصة امتثال مدعومة بالذكاء الاصطناعي',
  },
  zh: {
    name:'SecComply AI', status:'在线  •  即时回复',
    welcome:"你好！👋 我是 **SecComply AI**。\n\n我帮助企业应对 **SOC 2、ISO 27001、HIPAA、GDPR** 等 50+ 合规框架。以天计算，而非数月。\n\n您今天面临什么合规挑战？",
    ph:"询问关于 SecComply…",
    listen:'收听', stop:'停止',
    wrongLang:"看起来您用其他语言输入 😊 我现在是中文模式。请用中文输入！",
    callHeading:'与我们的专家交流',
    callSub:'真实的人。直接的答案。',
    audioLbl:'语音通话', videoLbl:'视频通话', bookLbl:'安排会议',
    callAvail:'周一至周五  •  9AM 至 6PM IST',
    connecting:'正在连接…', connected:'正在打开…',
    footer:'SecComply  •  AI 合规平台',
  },
  ja: {
    name:'SecComply AI', status:'オンライン  •  すぐに返信',
    welcome:"こんにちは！👋 私は **SecComply AI** です。\n\n**SOC 2、ISO 27001、HIPAA、GDPR** など 50 以上のフレームワークをサポートします。数ヶ月ではなく**数日で**。\n\n今日はどのようなコンプライアンスの課題がありますか？",
    ph:"SecComplyについて質問してください…",
    listen:'聞く', stop:'停止',
    wrongLang:"別の言語で入力されたようです 😊 私は日本語モードです。日本語で入力してください！",
    callHeading:'専門家に相談する',
    callSub:'本物の人間。直接の回答。',
    audioLbl:'音声通話', videoLbl:'ビデオ通話', bookLbl:'ミーティングを予約',
    callAvail:'月曜から金曜  •  9AM から 6PM IST',
    connecting:'接続中…', connected:'開いています…',
    footer:'SecComply  •  AI コンプライアンスプラットフォーム',
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
  const inline = s => s
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`(.+?)`/g, '<code>$1</code>');

  let out = '', ul = false, ol = false;

  const closeUl = () => { if (ul) { out += '</ul>'; ul = false; } };
  const closeOl = () => { if (ol) { out += '</ol>'; ol = false; } };

  for (const line of raw.split('\n')) {
    const t = line.trim();

    // Skip horizontal rules
    if (/^-{3,}$/.test(t) || /^={3,}$/.test(t)) { closeUl(); closeOl(); continue; }

    // H2 / H3 headings
    if (t.startsWith('### ')) { closeUl(); closeOl(); out += `<p class="rt-h3">${inline(t.slice(4))}</p>`; continue; }
    if (t.startsWith('## '))  { closeUl(); closeOl(); out += `<p class="rt-h2">${inline(t.slice(3))}</p>`; continue; }
    if (t.startsWith('# '))   { closeUl(); closeOl(); out += `<p class="rt-h2">${inline(t.slice(2))}</p>`; continue; }

    // Unordered list  (-, *, •)
    if (/^[-*•]\s/.test(t)) {
      closeOl();
      if (!ul) { out += '<ul>'; ul = true; }
      out += `<li>${inline(t.replace(/^[-*•]\s/, ''))}</li>`;
      continue;
    }

    // Ordered list  (1. 2. etc.)
    if (/^\d+\.\s/.test(t)) {
      closeUl();
      if (!ol) { out += '<ol>'; ol = true; }
      out += `<li>${inline(t.replace(/^\d+\.\s/, ''))}</li>`;
      continue;
    }

    // Blank line
    if (!t) { closeUl(); closeOl(); out += '<br>'; continue; }

    // Normal paragraph
    closeUl(); closeOl();
    out += `<p>${inline(t)}</p>`;
  }
  closeUl(); closeOl();
  return out;
}


/* ─── VOICE INPUT HOOK (speech-to-text only) ────────────────── */
function useVoice(onFinal, onInterim, voiceLang) {
  const [vs, setVs] = useState('idle'); // idle | on | busy
  const ref = useRef(null);
  function start() {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { alert('Voice input needs Chrome or Edge'); return; }
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

/* ═══════════════════════════════════════════════════════════════
   CALL MODAL
═══════════════════════════════════════════════════════════════ */
function CallModal({ t, onClose }) {
  const [calling, setCalling] = useState(null); // null | contact index

  function dialContact(idx) {
    setCalling(idx);
    setTimeout(() => { window.location.href = `tel:${CONTACTS[idx].phone}`; setCalling(null); }, 1800);
  }
  function bookMeeting() { window.open(BOOKING_URL,'_blank'); onClose(); }

  const PhoneIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2A19.79 19.79 0 0 1 4.69 12 19.79 19.79 0 0 1 3.6 1.25h3A2 2 0 0 1 8.6 3a12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.9a16 16 0 0 0 6 6l.95-.95a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 21.5 16.5z"/>
    </svg>
  );

  return (
    <div className="cm-backdrop" onClick={onClose}>
      <div className="cm-card" onClick={e=>e.stopPropagation()}>
        <button className="cm-x" onClick={onClose}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>

        {/* Header */}
        <div className="cm-head">
          <div className="cm-team-avatars">
            {CONTACTS.map((c,i) => (
              <div key={i} className="cm-avatar" style={{marginLeft:i?'-10px':'0', zIndex:3-i}}>
                <span>{c.name[0]}</span>
              </div>
            ))}
            <div className="cm-online-ring"/>
          </div>
          <div>
            <div className="cm-title">{t.callHeading}</div>
            <div className="cm-sub">{t.callSub}</div>
          </div>
        </div>

        {/* Contact list */}
        <div className="cm-contacts">
          {CONTACTS.map((c, i) => (
            <div key={i} className="cm-contact-row">
              <div className="cm-contact-info">
                <div className="cm-contact-avatar">{c.name[0]}</div>
                <div>
                  <div className="cm-contact-name">{c.name}</div>
                  <div className="cm-contact-role">{c.role} · {c.display}</div>
                </div>
              </div>
              <button
                className={`cm-dial-btn${calling===i?' cm-dial-calling':''}`}
                onClick={() => dialContact(i)}
                disabled={calling !== null}
              >
                {calling===i ? <span className="cm-dial-dots"><span/><span/><span/></span> : <><PhoneIcon/> Call</>}
              </button>
            </div>
          ))}
        </div>

        {/* Book meeting */}
        <button className="cm-book" onClick={bookMeeting} style={{marginTop:'4px'}}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/>
            <line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
          {t.bookLbl}
        </button>
        <p className="cm-avail">🕐 {t.callAvail}</p>
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
        <h2 className="lp-title"><span>SecComply</span> AI</h2>
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

/* ── Contact escalation card ── */
function ContactCard() {
  return (
    <div className="ct-card">
      <div className="ct-title-row">
        <div className="ct-icon">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
          </svg>
        </div>
        <div>
          <div className="ct-title">Talk to our team</div>
          <div className="ct-sub">Direct lines to our compliance experts</div>
        </div>
      </div>
      <div className="ct-contacts">
        {CONTACTS.map((c,i) => (
          <a key={i} href={`tel:${c.phone}`} className="ct-contact">
            <div className="ct-c-avatar">{c.name[0]}</div>
            <div className="ct-c-info">
              <span className="ct-c-name">{c.name}</span>
              <span className="ct-c-num">{c.display}</span>
            </div>
            <div className="ct-call-icon">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2A19.79 19.79 0 0 1 4.69 12 19.79 19.79 0 0 1 3.6 1.25h3A2 2 0 0 1 8.6 3a12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.9a16 16 0 0 0 6 6l.95-.95a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 21.5 16.5z"/></svg>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   TICKET MODAL
═══════════════════════════════════════════════════════════════ */
function TicketModal({ onClose }) {
  const [form, setForm] = useState({ name:'', email:'', subject:'', priority:'Medium', message:'' });
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    try {
      await fetch('/api/ticket', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(form) });
    } catch {}
    setDone(true); setBusy(false);
  }

  const field = (label, el) => (
    <div className="tk-field">
      <label className="tk-label">{label}</label>
      {el}
    </div>
  );

  return (
    <div className="cm-backdrop" onClick={onClose}>
      <div className="cm-card tk-card" onClick={e=>e.stopPropagation()}>
        <button className="cm-x" onClick={onClose}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>

        {done ? (
          <div className="tk-done">
            <div className="tk-done-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
            <p className="tk-done-title">Ticket Submitted!</p>
            <p className="tk-done-sub">Our team will respond within 24 hours.</p>
            <button className="cm-book" style={{marginTop:'20px'}} onClick={onClose}>Close</button>
          </div>
        ) : (
          <form onSubmit={submit}>
            <div className="tk-head">
              <div className="tk-head-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"><path d="M15 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V9z"/><polyline points="15 5 15 9 19 9"/><line x1="9" y1="13" x2="15" y2="13"/><line x1="9" y1="17" x2="13" y2="17"/></svg>
              </div>
              <div>
                <p className="tk-title">Submit a Support Ticket</p>
                <p className="tk-sub">We reply within 24 hours</p>
              </div>
            </div>

            <div className="tk-row">
              {field('Name', <input className="tk-inp" required placeholder="Your name" value={form.name} onChange={e=>setForm(p=>({...p,name:e.target.value}))}/>)}
              {field('Email', <input className="tk-inp" required type="email" placeholder="you@company.com" value={form.email} onChange={e=>setForm(p=>({...p,email:e.target.value}))}/>)}
            </div>
            <div className="tk-row">
              {field('Subject', <input className="tk-inp" required placeholder="Brief subject" value={form.subject} onChange={e=>setForm(p=>({...p,subject:e.target.value}))}/>)}
              {field('Priority',
                <select className="tk-inp tk-select" value={form.priority} onChange={e=>setForm(p=>({...p,priority:e.target.value}))}>
                  <option>Low</option><option>Medium</option><option>High</option><option>Urgent</option>
                </select>
              )}
            </div>
            {field('Description',
              <textarea className="tk-inp tk-ta" required rows={4} placeholder="Describe your issue in detail…" value={form.message} onChange={e=>setForm(p=>({...p,message:e.target.value}))}/>
            )}
            <button type="submit" className="cm-book" disabled={busy} style={{marginTop:'6px'}}>
              {busy ? 'Submitting…' : 'Submit Ticket'}
            </button>
          </form>
        )}
      </div>
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
  const [callOpen,setCallOpen]= useState(false);
  const [langDD,  setLangDD]  = useState(false);
  const [badge,   setBadge]   = useState(1);
  const [interim, setInterim] = useState('');
  const [ticketOpen, setTicketOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [speakingId, setSpeakingId] = useState(null);

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
    (txt) => { setInterim(''); send(txt); },
    (txt) => setInterim(txt),
    lang.voice
  );

  /* Only render on client to avoid SSR hydration mismatch */
  useEffect(() => { setMounted(true); }, []);

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

  function pushBot(text, chips=[], confident=true) {
    setMsgs(p => [...p, {id:Date.now()+Math.random(), role:'bot', text, time:ts(), chips, confident}]);
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
      pushUser(txt); setInput('');
      const msg = (T[lang.code]||T.en).wrongLang;
      setTimeout(() => { pushBot(msg,[]); }, 600);
      return;
    }

    asked.current.add(txt.toLowerCase().trim());
    setInput('');
    pushUser(txt);
    msgN.current++;
    const next = [...hist, { role:'user', content:txt }];
    setHist(next); setBusy(true);

    try {
      const r  = await fetch('/api/chat', { method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ messages:next, session_id:sid.current, language:lang.label, msg_count:msgN.current }) });
      const d  = await r.json();
      const reply = d.reply || 'Something went wrong. Please try again!';
      // Use API suggestions directly — they are context-aware
      // Only pad with fallbacks if API returned nothing at all
      let chips = (d.suggestions||[]).filter(s => typeof s === 'string' && s.trim() && !asked.current.has(s.toLowerCase().trim()));
      if (chips.length === 0) chips = fallbackChips(2);
      chips = chips.slice(0, 3);
      const confident = d.confident !== false; // default true
      setHist(p => [...p, { role:'assistant', content:reply }]);
      setTimeout(() => {
        pushBot(reply, chips, confident);
      }, 60);
    } catch {
      pushBot('Something went wrong. Please try again!');
    } finally {
      setBusy(false);
    }
  }

  function speak(id, text) {
    if (!window.speechSynthesis) return;
    if (speakingId === id) {
      window.speechSynthesis.cancel();
      setSpeakingId(null);
      return;
    }
    window.speechSynthesis.cancel();
    const plain = text.replace(/\*\*(.+?)\*\*/g,'$1').replace(/\*(.+?)\*/g,'$1').replace(/`(.+?)`/g,'$1');
    const utt = new SpeechSynthesisUtterance(plain);
    utt.lang = lang.voice;
    utt.onend = () => setSpeakingId(null);
    utt.onerror = () => setSpeakingId(null);
    setSpeakingId(id);
    window.speechSynthesis.speak(utt);
  }

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

      {/* ── TICKET MODAL ─────────────────────────────────────────── */}
      {ticketOpen && <TicketModal onClose={() => setTicketOpen(false)}/>}

      {/* ── CALL MODAL ───────────────────────────────────────────── */}
      {callOpen && <CallModal t={t} onClose={() => setCallOpen(false)}/>}

      {/* ── CHAT WINDOW ─────────────────────────────────────────── */}
      {open && (
        <div className={`win${darkMode ? '' : ' win-light'}`}>

          {screen === 'lang'
            ? <LangPicker onPick={pickLang}/>
            : <> {/* always chat */}
                {/* HEADER */}
                <header className="hdr">
                  {/* Row 1 — Identity + controls */}
                  <div className="hdr-row1">
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
                          <span className="hdr-veri">SecComply</span><span className="hdr-by"> AI</span>
                        </div>
                        <span className="hdr-status">
                          <span className="hdr-blink"/>
                          {t.status}
                        </span>
                      </div>
                    </div>

                    <div className="hdr-right">
                      {/* Language switcher */}
                      <div style={{position:'relative'}}>
                        <button className="hbtn hbtn-lang" onClick={() => setLangDD(d=>!d)}>
                          {lang.flag}
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

                      {/* Theme toggle */}
                      <button className="hbtn hbtn-theme" onClick={() => setDarkMode(d=>!d)} title={darkMode ? 'Light mode' : 'Dark mode'}>
                        {darkMode
                          ? <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
                          : <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
                        }
                      </button>

                      {/* Close */}
                      <button className="hbtn hbtn-close" onClick={() => setOpen(false)}>
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                      </button>
                    </div>
                  </div>

                  {/* Row 2 — Action buttons */}
                  <div className="hdr-actions">
                    <button className="hact-btn hact-ticket" onClick={() => setTicketOpen(true)}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M15 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V9z"/><polyline points="15 5 15 9 19 9"/><line x1="9" y1="13" x2="15" y2="13"/><line x1="9" y1="17" x2="13" y2="17"/></svg>
                      Support Ticket
                    </button>
                    <button className="hact-btn hact-call" onClick={() => setCallOpen(true)}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2A19.79 19.79 0 0 1 4.69 12 19.79 19.79 0 0 1 3.6 1.25h3A2 2 0 0 1 8.6 3a12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.9a16 16 0 0 0 6 6l.95-.95a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 21.5 16.5z"/>
                      </svg>
                      Call an Expert
                    </button>
                  </div>
                </header>

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
                            <button className={`speak-btn${speakingId===m.id?' speak-on':''}`} onClick={() => speak(m.id, m.text)} title={speakingId===m.id ? 'Stop' : 'Listen'}>
                              {speakingId===m.id
                                ? <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><rect x="6" y="6" width="12" height="12" rx="2"/></svg>
                                : <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>
                              }
                            </button>
                          )}
                        </div>
                        {m.role==='bot' && m.chips?.length > 0 && <Chips items={m.chips} onSend={send}/>}
                        {m.role==='bot' && m.confident===false && <ContactCard/>}
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
                    className={`inp${voice.vs==='on'?' inp-listening':''}`}
                    value={voice.vs==='on' ? interim : input}
                    onChange={e=>{ if(voice.vs==='idle') setInput(e.target.value); }}
                    onKeyDown={e=>e.key==='Enter'&&voice.vs==='idle'&&send(input)}
                    placeholder={voice.vs==='on' ? 'Listening…' : t.ph}
                    readOnly={voice.vs!=='idle'}
                    disabled={busy}
                    dir={rtl?'rtl':'ltr'}
                  />
                  <button
                    className={`mic-btn${voice.vs==='on'?' mic-on':''}`}
                    onClick={voice.vs==='on' ? voice.stop : voice.start}
                    disabled={busy}
                    title="Voice input"
                  >
                    {voice.vs==='on'
                      ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><rect x="6" y="6" width="12" height="12" rx="2"/></svg>
                      : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="9" y="2" width="6" height="11" rx="3"/><path d="M5 10a7 7 0 0 0 14 0"/><line x1="12" y1="19" x2="12" y2="22"/><line x1="8" y1="22" x2="16" y2="22"/></svg>
                    }
                  </button>
                  <button className="send-btn" onClick={()=>send(input)} disabled={busy||!input.trim()||voice.vs!=='idle'}>
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
        /* ── Design tokens — dark (default) ── */
        .win, .fab, .cm-card, .lp-root, .ldd {
          --bg0:    #070D1A;
          --bg1:    #0C1628;
          --bg2:    #101E32;
          --bg3:    #16263E;
          --border: rgba(255,255,255,.07);
          --text:   #D8EAFF;
          --muted:  #4A6A90;
          --accent: #FF6B35;
          --accL:   rgba(255,107,53,.14);
          --green:  #4CE6A8;
          --font:   'Inter', 'DM Sans', 'Segoe UI', sans-serif;
        }

        /* ── Design tokens — light ── */
        .win-light {
          --bg0:    #F5F7FA;
          --bg1:    #FFFFFF;
          --bg2:    #EEF1F6;
          --bg3:    #E4E9F2;
          --border: rgba(0,0,0,.08);
          --text:   #1A2640;
          --muted:  #7A90B0;
          --accent: #E8521E;
          --accL:   rgba(232,82,30,.1);
          --green:  #1BAD78;
          --font:   'Inter', 'DM Sans', 'Segoe UI', sans-serif;
        }

        /* ── Light mode overrides ── */
        .win-light .hdr { background:linear-gradient(135deg,#FFFFFF 0%,#F0F4FF 100%); border-bottom:1px solid rgba(0,0,0,.08); }
        .win-light .hdr-veri { background:linear-gradient(90deg,#E8521E,#FF8040); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
        .win-light .hdr-by { color:rgba(30,50,90,.45); }
        .win-light .hdr-status { color:var(--green); }
        .win-light .hdr-dot { border-color:#FFFFFF; }
        .win-light .hbtn { background:rgba(0,0,0,.05); border-color:rgba(0,0,0,.1); color:rgba(20,40,80,.7); }
        .win-light .hbtn:hover { background:rgba(0,0,0,.1); color:#1A2640; }
        .win-light .hact-ticket { background:rgba(91,141,239,.1); color:#3B6FD4; border-color:rgba(91,141,239,.25); }
        .win-light .hact-ticket:hover { background:rgba(91,141,239,.18); }
        .win-light .hact-call { background:rgba(27,173,120,.1); color:#1BAD78; border-color:rgba(27,173,120,.25); }
        .win-light .hact-call:hover { background:rgba(27,173,120,.18); }
        .win-light .msgs { background:linear-gradient(180deg,#F0F4FA 0%,#EBF0F8 100%); }
        .win-light .bubble-bot { background:#FFFFFF; color:#1A2640; border-color:rgba(0,0,0,.08); box-shadow:0 2px 10px rgba(0,0,0,.07); }
        .win-light .bubble-bot .bubble-body strong { color:#0D1E36; }
        .win-light .bubble-bot .bubble-body em { color:rgba(26,38,64,.6); }
        .win-light .bubble-bot .bubble-body code { background:rgba(0,0,0,.07); color:#C94726; }
        .win-light .bubble-bot .bubble-body li { background:rgba(0,0,0,.03); border-left-color:rgba(232,82,30,.3); }
        .win-light .bubble-typing span { background:#CBD5E8; }
        .win-light .msg-avt { box-shadow:0 3px 10px rgba(232,82,30,.25); }
        .win-light .chip { background:rgba(232,82,30,.07); border-color:rgba(232,82,30,.2); color:#C94726; }
        .win-light .chip:hover { background:linear-gradient(135deg,#E8521E,#C94726); color:#fff; border-color:transparent; }
        .win-light .ibar { background:#F5F7FA; border-top-color:rgba(0,0,0,.07); }
        .win-light .inp { background:#FFFFFF; border-color:rgba(0,0,0,.12); color:#1A2640; }
        .win-light .inp:focus { border-color:rgba(232,82,30,.4); }
        .win-light .inp::placeholder { color:#9AAFCC; }
        .win-light .mic-btn { background:rgba(0,0,0,.05); border-color:rgba(0,0,0,.12); color:#4A6A90; }
        .win-light .mic-btn:hover:not(:disabled) { background:rgba(0,0,0,.1); color:#1A2640; }
        .win-light .ftr { background:#EEF1F6; border-top-color:rgba(0,0,0,.06); }
        .win-light .ftr span { color:rgba(74,106,144,.6); }
        .win-light .msg-time { color:#9AAFCC; }
        .win-light .ldd { background:#FFFFFF; border-color:rgba(0,0,0,.1); box-shadow:0 16px 48px rgba(0,0,0,.14); }
        .win-light .ldd-item { color:rgba(26,38,64,.7); border-bottom-color:rgba(0,0,0,.04); }
        .win-light .ldd-item:hover { background:rgba(0,0,0,.04); }
        .win-light .ldd-active { background:rgba(232,82,30,.1)!important; color:#C94726!important; }
        .win-light .ldd-en { color:#9AAFCC; }
        .win-light .ct-card { background:rgba(27,173,120,.06); border-color:rgba(27,173,120,.2); }
        .win-light .ct-title { color:#0D1E36; }
        .win-light .ct-contact { background:rgba(0,0,0,.03); border-color:rgba(0,0,0,.08); }
        .win-light .ct-contact:hover { background:rgba(27,173,120,.08); border-color:rgba(27,173,120,.22); }
        .win-light .ct-c-name { color:#0D1E36; }
        .win-light .hbtn-theme { color:#E8A020!important; }
        .win-light .hbtn-close:hover { background:rgba(255,60,60,.1)!important; color:#cc3333!important; }

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
          padding:12px 14px 10px; display:flex; flex-direction:column; gap:10px;
          flex-shrink:0; border-bottom:1px solid var(--border);
        }
        .hdr-row1 { display:flex; align-items:center; justify-content:space-between; }
        .hdr-left { display:flex; align-items:center; gap:10px; }
        .hdr-avt {
          position:relative; width:42px; height:42px; border-radius:12px;
          background:linear-gradient(145deg,#FF8040,#E8521E,#B83010);
          display:flex; align-items:center; justify-content:center; flex-shrink:0;
          box-shadow:0 4px 18px rgba(255,107,53,.4);
        }
        .hdr-dot {
          position:absolute; bottom:1px; right:1px;
          width:10px; height:10px; border-radius:50%;
          background:var(--green); border:2px solid #0C1828;
        }
        .hdr-info { display:flex; flex-direction:column; gap:2px; }
        .hdr-name { font-size:.88rem; font-weight:800; color:#fff; line-height:1; display:flex; align-items:baseline; gap:0; }
        .hdr-veri { background:linear-gradient(90deg,#FF8040,#FFB347); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; font-size:.95rem; font-weight:900; letter-spacing:-.01em; }
        .hdr-by { color:rgba(200,222,255,.5); font-size:.7rem; font-weight:500; letter-spacing:.01em; }
        .hdr-status {
          font-size:.63rem; color:var(--green);
          display:flex; align-items:center; gap:5px;
        }
        .hdr-blink {
          width:5px; height:5px; border-radius:50%; background:var(--green);
          animation:blink 2.4s ease-in-out infinite;
        }
        .hdr-right { display:flex; align-items:center; gap:5px; }
        .hbtn {
          background:rgba(255,255,255,.07); border:1px solid rgba(255,255,255,.1);
          border-radius:8px; padding:6px 8px; color:rgba(255,255,255,.75);
          font-size:.72rem; font-weight:600; cursor:pointer;
          display:flex; align-items:center; gap:4px; font-family:var(--font);
          transition:all .18s;
        }
        .hbtn:hover { background:rgba(255,255,255,.13); color:#fff; }
        .hbtn-lang { font-size:.85rem; padding:5px 8px; }
        .hbtn-close:hover { background:rgba(255,60,60,.15)!important; color:#ff7070!important; }

        /* ── Header action strip ── */
        .hdr-actions {
          display:flex; gap:8px;
        }
        .hact-btn {
          flex:1; display:flex; align-items:center; justify-content:center; gap:6px;
          padding:7px 10px; border-radius:9px; border:1px solid;
          font-size:.72rem; font-weight:600; cursor:pointer; font-family:var(--font);
          transition:all .18s; letter-spacing:.01em;
        }
        .hact-ticket {
          background:rgba(130,166,255,.1); color:#82A6FF; border-color:rgba(130,166,255,.22);
        }
        .hact-ticket:hover { background:rgba(130,166,255,.2); }
        .hact-call {
          background:rgba(76,230,168,.1); color:var(--green); border-color:rgba(76,230,168,.22);
        }
        .hact-call:hover { background:rgba(76,230,168,.2); }

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
          padding:11px 15px; font-size:.875rem; line-height:1.75;
          max-width:290px; word-break:break-word; font-family:var(--font);
          letter-spacing:.012em;
        }
        .bubble-bot {
          background:var(--bg3); color:var(--text);
          border:1px solid rgba(255,255,255,.08);
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
        .bubble-body p { margin:0 0 7px; }
        .bubble-body p:last-child { margin-bottom:0; }
        .bubble-body br { display:block; content:''; margin:3px 0; }
        .bubble-body strong { font-weight:700; color:#fff; }
        .bubble-body em { font-style:italic; color:rgba(216,234,255,.7); }
        .bubble-body code { background:rgba(255,255,255,.08); border-radius:4px; padding:1px 5px; font-size:.82em; font-family:monospace; color:#FFD04A; }
        .bubble-body .rt-h2 { font-size:.92rem; font-weight:800; color:#fff; margin:10px 0 5px; letter-spacing:-.01em; }
        .bubble-body .rt-h3 { font-size:.84rem; font-weight:700; color:rgba(216,234,255,.85); margin:8px 0 4px; }
        .bubble-body ul, .bubble-body ol { padding-left:0; margin:8px 0 8px; list-style:none; display:flex; flex-direction:column; gap:4px; }
        .bubble-body ol { counter-reset:ol-cnt; }
        .bubble-body li {
          padding:5px 10px 5px 26px; position:relative; line-height:1.65;
          background:rgba(255,255,255,.03); border-radius:8px;
          border-left:2px solid rgba(255,107,53,.25);
        }
        .bubble-body ul li::before {
          content:'›'; position:absolute; left:8px;
          color:var(--accent); font-weight:800; font-size:1.05rem; top:4px;
        }
        .bubble-body ol li { counter-increment:ol-cnt; }
        .bubble-body ol li::before {
          content:counter(ol-cnt); position:absolute; left:7px; top:5px;
          color:var(--accent); font-weight:800; font-size:.72rem;
        }
        .msg-meta {
          display:flex; align-items:center; gap:6px;
          margin-top:5px; padding-left:2px; font-family:var(--font);
        }
        .meta-user { justify-content:flex-end; }
        .msg-time { font-size:.62rem; color:var(--muted); letter-spacing:.02em; }
        .speak-btn {
          width:22px; height:22px; border-radius:6px; border:1px solid rgba(255,255,255,.1);
          background:rgba(255,255,255,.05); color:var(--muted);
          display:flex; align-items:center; justify-content:center;
          cursor:pointer; transition:all .18s; flex-shrink:0; padding:0;
        }
        .speak-btn:hover { background:rgba(255,255,255,.12); color:var(--text); border-color:rgba(255,255,255,.2); }
        .speak-btn.speak-on { background:rgba(76,230,168,.12); border-color:rgba(76,230,168,.3); color:var(--green); animation:mic-pulse 1.4s ease-in-out infinite; }
        .win-light .speak-btn { background:rgba(0,0,0,.05); border-color:rgba(0,0,0,.1); color:#9AAFCC; }
        .win-light .speak-btn:hover { background:rgba(0,0,0,.1); color:#1A2640; }
        .win-light .speak-btn.speak-on { background:rgba(27,173,120,.1); border-color:rgba(27,173,120,.3); color:#1BAD78; }

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
        .send-btn {
          width:40px; height:40px; border-radius:12px; border:none; cursor:pointer;
          background:linear-gradient(135deg,#FF6B35,#C94726);
          color:#fff; display:flex; align-items:center; justify-content:center;
          flex-shrink:0; box-shadow:0 3px 12px rgba(255,107,53,.38); transition:all .2s;
        }
        .send-btn:not(:disabled):hover { transform:translateY(-1px); box-shadow:0 6px 18px rgba(255,107,53,.5); }
        .send-btn:disabled { opacity:.3; cursor:default; box-shadow:none; }

        /* ── Mic button ── */
        .mic-btn {
          width:40px; height:40px; border-radius:12px; border:1.5px solid rgba(255,255,255,.1);
          background:rgba(255,255,255,.06); color:rgba(216,234,255,.7);
          display:flex; align-items:center; justify-content:center;
          cursor:pointer; flex-shrink:0; transition:all .2s;
        }
        .mic-btn:hover:not(:disabled) { background:rgba(255,255,255,.12); color:#fff; border-color:rgba(255,255,255,.2); }
        .mic-btn.mic-on {
          background:rgba(255,60,60,.15); border-color:rgba(255,80,80,.4);
          color:#ff6b6b; animation:mic-pulse 1.2s ease-in-out infinite;
        }
        .mic-btn:disabled { opacity:.35; cursor:default; }
        .inp-listening { border-color:rgba(255,80,80,.4)!important; background:rgba(255,60,60,.06)!important; }
        @keyframes mic-pulse { 0%,100%{box-shadow:0 0 0 0 rgba(255,80,80,.35)} 50%{box-shadow:0 0 0 6px rgba(255,80,80,0)} }

        /* ── Ticket Modal ── */
        .tk-card { width:420px!important; max-height:90vh; overflow-y:auto; }
        .tk-card::-webkit-scrollbar{width:3px;}
        .tk-card::-webkit-scrollbar-thumb{background:rgba(255,255,255,.08);}
        .tk-head { display:flex; align-items:center; gap:12px; margin-bottom:20px; }
        .tk-head-icon {
          width:40px; height:40px; border-radius:12px; flex-shrink:0;
          background:linear-gradient(135deg,#5B8DEF,#3B6FD4);
          display:flex; align-items:center; justify-content:center;
          box-shadow:0 4px 16px rgba(91,141,239,.35);
        }
        .tk-title { font-size:.95rem; font-weight:800; color:#fff; margin:0; }
        .tk-sub { font-size:.7rem; color:var(--muted); margin:3px 0 0; }
        .tk-row { display:grid; grid-template-columns:1fr 1fr; gap:10px; }
        .tk-field { display:flex; flex-direction:column; gap:5px; margin-bottom:12px; }
        .tk-label { font-size:.72rem; font-weight:600; color:rgba(200,222,255,.6); letter-spacing:.04em; text-transform:uppercase; }
        .tk-inp {
          background:rgba(255,255,255,.05); border:1.5px solid rgba(255,255,255,.09);
          border-radius:10px; padding:10px 12px; font-size:.84rem;
          color:var(--text); font-family:var(--font); outline:none;
          caret-color:var(--accent); transition:border-color .2s; width:100%; box-sizing:border-box;
        }
        .tk-inp:focus { border-color:rgba(91,141,239,.45); }
        .tk-inp::placeholder { color:var(--muted); }
        .tk-select { cursor:pointer; }
        .tk-ta { resize:vertical; min-height:90px; line-height:1.6; }
        .tk-done { display:flex; flex-direction:column; align-items:center; padding:24px 0 12px; text-align:center; }
        .tk-done-icon {
          width:56px; height:56px; border-radius:50%; margin-bottom:16px;
          background:linear-gradient(135deg,var(--green),#2AB87E);
          display:flex; align-items:center; justify-content:center;
          box-shadow:0 8px 24px rgba(76,230,168,.35);
        }
        .tk-done-title { font-size:1.05rem; font-weight:800; color:#fff; margin:0 0 8px; }
        .tk-done-sub { font-size:.8rem; color:var(--muted); margin:0; }

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

        @keyframes call-ring  { 0%{transform:scale(1);opacity:.6} 100%{transform:scale(1.5);opacity:0} }

        /* ── Contact escalation card ── */
        .ct-card {
          background:rgba(76,230,168,.06); border:1.5px solid rgba(76,230,168,.18);
          border-radius:13px; padding:12px 14px; margin-top:10px;
          margin-left:40px; animation:msg-in .3s ease;
        }
        .ct-title-row { display:flex; align-items:center; gap:9px; margin-bottom:10px; }
        .ct-icon {
          width:30px; height:30px; border-radius:8px; flex-shrink:0;
          background:rgba(76,230,168,.15); color:var(--green);
          display:flex; align-items:center; justify-content:center;
        }
        .ct-title { font-size:.82rem; font-weight:700; color:#fff; margin:0; }
        .ct-sub   { font-size:.68rem; color:var(--muted); margin:2px 0 0; }
        .ct-contacts { display:flex; flex-direction:column; gap:5px; }
        .ct-contact {
          display:flex; align-items:center; gap:8px;
          background:rgba(255,255,255,.04); border:1px solid rgba(255,255,255,.07);
          border-radius:9px; padding:7px 10px; text-decoration:none;
          transition:all .18s; cursor:pointer;
        }
        .ct-contact:hover { background:rgba(76,230,168,.1); border-color:rgba(76,230,168,.25); }
        .ct-c-avatar {
          width:26px; height:26px; border-radius:50%; flex-shrink:0;
          background:linear-gradient(135deg,#FF6B35,#C94726);
          display:flex; align-items:center; justify-content:center;
          font-size:.68rem; font-weight:800; color:#fff;
        }
        .ct-c-info { display:flex; flex-direction:column; flex:1; gap:1px; }
        .ct-c-name { font-size:.75rem; font-weight:700; color:#fff; }
        .ct-c-num  { font-size:.66rem; color:var(--muted); }
        .ct-call-icon { color:var(--green); opacity:.7; display:flex; align-items:center; }
        .ct-contact:hover .ct-call-icon { opacity:1; }

        /* ── Call modal contacts ── */
        .cm-contacts { display:flex; flex-direction:column; gap:8px; margin-bottom:14px; }
        .cm-contact-row {
          display:flex; align-items:center; justify-content:space-between; gap:10px;
          background:rgba(255,255,255,.04); border:1px solid rgba(255,255,255,.07);
          border-radius:12px; padding:10px 12px;
        }
        .cm-contact-info { display:flex; align-items:center; gap:10px; }
        .cm-contact-avatar {
          width:36px; height:36px; border-radius:50%; flex-shrink:0;
          background:linear-gradient(135deg,#FF6B35,#C94726);
          display:flex; align-items:center; justify-content:center;
          font-size:.8rem; font-weight:800; color:#fff;
          box-shadow:0 2px 8px rgba(255,107,53,.3);
        }
        .cm-contact-name { font-size:.84rem; font-weight:700; color:#fff; display:block; }
        .cm-contact-role { font-size:.66rem; color:var(--muted); display:block; margin-top:2px; }
        .cm-dial-btn {
          display:flex; align-items:center; gap:5px;
          background:rgba(76,230,168,.12); border:1px solid rgba(76,230,168,.28);
          color:var(--green); padding:7px 13px; border-radius:9px;
          font-size:.75rem; font-weight:700; cursor:pointer;
          font-family:var(--font); transition:all .18s; flex-shrink:0;
          min-width:70px; justify-content:center;
        }
        .cm-dial-btn:hover:not(:disabled) { background:rgba(76,230,168,.22); transform:translateY(-1px); }
        .cm-dial-btn:disabled { opacity:.6; cursor:default; }
        .cm-dial-calling { background:rgba(76,230,168,.08)!important; }
        .cm-dial-dots { display:flex; gap:3px; align-items:center; }
        .cm-dial-dots span {
          width:5px; height:5px; border-radius:50%; background:var(--green);
          animation:dot 1.2s ease-in-out infinite;
        }
        .cm-dial-dots span:nth-child(2) { animation-delay:.2s; }
        .cm-dial-dots span:nth-child(3) { animation-delay:.4s; }

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
