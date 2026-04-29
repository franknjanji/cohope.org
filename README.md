# COHOPE Culture School — Website

> **Revisit. Regrow. Embrace.**  
> Official website for COHOPE Culture School — a community programme for young Zimbabweans of heritage in the UK. Ages 15–30. Anglican Church context.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Hosting & Serverless Functions | [Vercel](https://vercel.com) |
| Transactional Email | [Resend](https://resend.com) |
| Mailing List / Newsletter | [Mailchimp](https://mailchimp.com) |
| Database (submissions) | [Supabase](https://supabase.com) |
| SMS / Phone Notifications | [Twilio](https://twilio.com) |

---

## Project Structure

```
cohope/
├── public/
│   └── index.html          ← The full website (HTML/CSS/JS)
├── api/
│   ├── contact.js          ← Contact form → email + SMS
│   ├── register.js         ← Event registration → DB + email + SMS
│   ├── newsletter.js       ← Newsletter signup → Mailchimp
│   └── callback.js         ← Phone callback request → SMS + email
├── lib/
│   ├── utils.js            ← Shared helpers (validation, rate limiting)
│   └── email-templates.js  ← Branded HTML email templates
├── scripts/
│   └── db-setup.js         ← One-time database schema setup
├── .env.example            ← Template for all environment variables
├── .gitignore
├── package.json
└── vercel.json             ← Vercel deployment configuration
```

---

## Step-by-Step: Publishing to Vercel

Follow these steps **in order**. Each section is self-contained.

---

### STEP 1 — Create a GitHub Repository

1. Go to [github.com](https://github.com) and sign in (or create a free account).
2. Click **New repository**.
3. Name it `cohope-culture-school` → set to **Private** → click **Create repository**.
4. On your computer, open Terminal and run:

```bash
cd /path/to/cohope
git init
git add .
git commit -m "Initial commit — COHOPE Culture School"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/cohope-culture-school.git
git push -u origin main
```

---

### STEP 2 — Create a Vercel Account & Import the Project

1. Go to [vercel.com](https://vercel.com) → Sign up with your GitHub account.
2. Click **Add New → Project**.
3. Find `cohope-culture-school` in the list → click **Import**.
4. Leave all settings as default → click **Deploy**.

Vercel will build and give you a free URL like:  
`https://cohope-culture-school.vercel.app`

> You can add a custom domain later (Step 8).

---

### STEP 3 — Set Up Resend (Transactional Email)

Resend handles the contact form emails and registration confirmations.

1. Go to [resend.com](https://resend.com) → Sign up free.
2. Go to **API Keys** → click **Create API Key** → name it `COHOPE Production`.
3. Copy the key (starts with `re_`).
4. Go to **Domains** → **Add Domain** → enter your future domain (e.g. `cohope.org.uk`).  
   - Follow the DNS instructions to verify it (add the TXT and CNAME records at your domain registrar).
   - **Until you have a domain**, you can send from `onboarding@resend.dev` but only to your own email address — good enough for testing.

**Set in Vercel** (next step shows you how to add env vars):
```
RESEND_API_KEY = re_xxxxxxxxxxxx
FROM_EMAIL = hello@cohope.org.uk
CONTACT_RECEIVER_EMAIL = info@cohope.org.uk
```

---

### STEP 4 — Set Up Mailchimp (Newsletter)

1. Go to [mailchimp.com](https://mailchimp.com) → Sign up free.
2. Go to **Account → Extras → API Keys** → click **Create A Key** → copy it.
3. Go to **Audience → Manage Audience → Settings** → copy your **Audience ID**.
4. Your server prefix is the last part of your API key, e.g. if the key ends in `-us21` then prefix = `us21`.

**Set in Vercel:**
```
MAILCHIMP_API_KEY = xxxxxxxxxxxxxxxx-us21
MAILCHIMP_AUDIENCE_ID = xxxxxxxxxx
MAILCHIMP_SERVER_PREFIX = us21
```

---

### STEP 5 — Set Up Twilio (SMS Notifications)

1. Go to [twilio.com](https://twilio.com) → Sign up free (includes trial credit).
2. From the Console Dashboard, copy your **Account SID** and **Auth Token**.
3. Go to **Phone Numbers → Buy a Number** → buy a UK number (or US number for testing).
4. Copy the phone number in E.164 format (e.g. `+441234567890`).

**Set in Vercel:**
```
TWILIO_ACCOUNT_SID = ACxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN = xxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_FROM_NUMBER = +441234567890
TWILIO_ADMIN_NUMBER = +447700000000   ← YOUR personal number for alerts
```

---

### STEP 6 — Add Environment Variables to Vercel

1. Go to your project on [vercel.com](https://vercel.com).
2. Click **Settings → Environment Variables**.
3. Add each variable from `.env.example` one by one:
   - Click **Add New**
   - Type the variable name (e.g. `RESEND_API_KEY`)
   - Paste the value
   - Select **Production, Preview, Development**
   - Click **Save**
4. Repeat for all variables.
5. Go to **Deployments** → click the three dots on your latest deployment → **Redeploy** (so the new env vars take effect).

---

### STEP 7 — Set Up Supabase (database)

1. Create a Supabase project.
2. In Supabase Dashboard → **SQL Editor**, run `supabase-schema.sql`.
3. In your Vercel project, set these environment variables (from `.env.example`):
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `ADMIN_API_KEY`

---

### STEP 8 — Add a Custom Domain (When Ready)

1. In Vercel project → **Settings → Domains** → type your domain (e.g. `cohope.org.uk`) → **Add**.
2. Vercel gives you two DNS records to add at your domain registrar (GoDaddy, Namecheap, etc.):
   - An **A record** pointing to Vercel's IP
   - A **CNAME** for `www`
3. Wait 5–30 minutes for DNS to propagate → Vercel automatically provisions an SSL certificate.

**Recommended domain registrars (affordable):**
- [Namecheap](https://namecheap.com) — `.org.uk` domains from ~£5/year
- [123-reg](https://123-reg.co.uk) — UK-based, easy DNS management

---

### STEP 9 — Test Everything

Once live, test each backend feature:

| Feature | How to Test |
|---|---|
| Contact Form | Fill in and submit → check admin email + SMS |
| Registration | Fill in and submit → check confirmation email + admin notification |
| Newsletter | Enter email → check Mailchimp audience for new subscriber |
| Callback | Submit → check admin SMS arrives immediately |

---

## Local Development

```bash
# 1. Clone the repo
git clone https://github.com/YOUR-USERNAME/cohope-culture-school.git
cd cohope-culture-school

# 2. Install dependencies
npm install

# 3. Copy the env template and fill in your values
cp .env.example .env.local
# Edit .env.local with your keys

# 4. Run local dev server (Vercel CLI)
npm run dev
# → Opens at http://localhost:3000
```

---

## Deploying Updates

Any time you push to the `main` branch, Vercel automatically redeploys:

```bash
git add .
git commit -m "Update: describe your change"
git push
```

For manual deploys:
```bash
npm run deploy
```

---

## API Endpoints Reference

| Endpoint | Method | Purpose |
|---|---|---|
| `/api/contact` | POST | Contact form submission |
| `/api/register` | POST | Event / programme registration |
| `/api/newsletter` | POST | Mailchimp newsletter signup |
| `/api/callback` | POST | Phone callback request |

All endpoints return JSON: `{ success: true, message: "..." }` or `{ error: "..." }`.

---

## Security Features

- **Rate limiting** — All endpoints limit requests per IP (5–10 per 10 minutes)
- **Input validation** — All fields validated server-side before any external calls
- **CORS headers** — Configured in `vercel.json`
- **Security headers** — X-Frame-Options, X-XSS-Protection, Referrer-Policy applied globally
- **GDPR consent** — Required checkbox on registration form; stored in database
- **Environment variables** — All secrets in Vercel env vars, never in code

---

## Phase 2 — Admin Surface (API)

Admin endpoints are available (token-protected). Send:
- `Authorization: Bearer <ADMIN_API_KEY>`

Endpoints:
- `GET /api/admin/contact` + `PATCH /api/admin/contact` (contact_submissions)
- `GET /api/admin/registrations` + `PATCH /api/admin/registrations` (event_registrations)
- `GET /api/admin/callback` + `PATCH /api/admin/callback` (callback_requests)
- `GET /api/admin/newsletter` + `PATCH /api/admin/newsletter` (newsletter_subscribers)

- **Admin dashboard** — View all registrations and contact submissions
- **Event management** — Create and publish events from a CMS
- **Payment integration** — Stripe for programme fees or donations
- **WhatsApp notifications** — Twilio WhatsApp API
- **Google Analytics** — Visitor tracking

---

## Support

If you run into any issues with deployment, contact details for each service:
- **Vercel support:** vercel.com/support
- **Resend docs:** resend.com/docs
- **Mailchimp help:** mailchimp.com/help
- **Twilio docs:** twilio.com/docs

---

*COHOPE Culture School · Anglican Church Community · United Kingdom · Ages 15–30*  
*Revisit. Regrow. Embrace.*
