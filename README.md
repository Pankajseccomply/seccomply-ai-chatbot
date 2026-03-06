# 🛡️ SecComply

## Setup in 3 steps

### Step 1 — Fill in your keys
Open `.env.local` and fill in these 4 values:

```
NEXT_PUBLIC_SUPABASE_URL    → from supabase.com → Settings → API → Project URL
SUPABASE_SERVICE_ROLE_KEY   → from supabase.com → Settings → API → service_role key
ANTHROPIC_API_KEY           → from console.anthropic.com
ADMIN_PASSWORD              → make up any password (e.g. admin123)
```

**Get Supabase keys (free):**
1. Go to https://supabase.com → sign up → New Project
2. Wait 2 min → Settings (gear) → API → copy both values
3. Go to SQL Editor → New Query → paste the contents of `supabase-schema.sql` → click Run

**Get Anthropic key:**
1. Go to https://console.anthropic.com → API Keys → Create Key

---

### Step 2 — Install & run
```bash
npm install
npm run dev
```

---

### Step 3 — Open in browser
| URL                        | What it is        |
|----------------------------|-------------------|
| http://localhost:3000      | Your website      |
| http://localhost:3000/contact | Book demo page |
| http://localhost:3000/admin | Admin panel (username: admin, password: whatever you set) |

---

## Deploy to Vercel (free)
1. Push to GitHub
2. Go to vercel.com → New Project → Import your repo
3. Add the same 4 env vars in Vercel → Settings → Environment Variables
4. Deploy — done! ✅
