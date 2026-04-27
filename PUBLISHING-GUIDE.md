# COHOPE Culture School — Publishing Guide
## From zero to live on Vercel in under 30 minutes

---

## WHAT YOU HAVE

```
cohope/
├── public/
│   └── index.html          ← Your full website (all pages + forms)
├── api/
│   ├── contact.js          ← Contact form backend
│   ├── newsletter.js       ← Newsletter signup backend
│   ├── register.js         ← Event registration backend
│   └── callback.js         ← Phone callback request backend
├── lib/
│   ├── supabase.js         ← Database client
│   └── email.js            ← All email templates
├── vercel.json             ← Vercel deployment config
├── package.json            ← Dependencies
├── .env.local              ← Your secret keys (NEVER commit this)
├── .gitignore              ← Keeps secrets safe
└── supabase-schema.sql     ← Run once to create your database tables
```

---

## STEP 1 — Create Accounts (all free)

### GitHub (version control + deploy trigger)
1. Go to https://github.com → Sign Up
2. Create a **New Repository** → name it `cohope-culture-school`
3. Set it to **Private** (recommended)

### Vercel (hosting)
1. Go to https://vercel.com → Sign Up with GitHub
2. No credit card needed — free tier is sufficient

### Supabase (database)
1. Go to https://supabase.com → Sign Up
2. Create a **New Project** → name it `cohope`
3. Choose region: **Europe West** (closest to UK)
4. Save your database password somewhere safe

### Resend (email)
1. Go to https://resend.com → Sign Up
2. Free tier: 3,000 emails/month — more than enough to start
3. Go to **API Keys** → Create API Key → copy it

---

## STEP 2 — Set Up the Database

1. In Supabase: go to **SQL Editor** → click **New Query**
2. Open the file `supabase-schema.sql` from this folder
3. Paste the entire contents into the SQL editor
4. Click **Run** (▶)
5. You should see: *"Success. No rows returned."*

Your 4 database tables are now created:
- `contact_submissions`
- `newsletter_subscribers`
- `event_registrations`
- `callback_requests`

---

## STEP 3 — Get Your API Keys

### From Supabase:
1. Supabase Dashboard → **Settings** → **API**
2. Copy **Project URL** (looks like: `https://abcdef.supabase.co`)
3. Copy **anon / public** key (long JWT string)

### From Resend:
1. Resend Dashboard → **API Keys**
2. Copy your API key (starts with `re_`)

### Your contact email:
This is the email address that will RECEIVE form submissions and call requests.
Use whatever email the COHOPE team checks regularly.

---

## STEP 4 — Push to GitHub

Open Terminal (Mac) or Command Prompt (Windows) in the `cohope` folder:

```bash
# Initialise git
git init
git add .
git commit -m "Initial commit — COHOPE Culture School"

# Connect to your GitHub repo (replace YOUR-USERNAME)
git remote add origin https://github.com/YOUR-USERNAME/cohope-culture-school.git
git branch -M main
git push -u origin main
```

---

## STEP 5 — Deploy to Vercel

1. Go to https://vercel.com/dashboard
2. Click **Add New Project**
3. Click **Import** next to your `cohope-culture-school` repo
4. Framework Preset: select **Other** (it's a static site with serverless functions)
5. Leave all build settings as default
6. Click **Deploy** — your site will be live in ~60 seconds

Your site will get a URL like: `https://cohope-culture-school.vercel.app`

---

## STEP 6 — Add Environment Variables

This is the most important step — without these, the forms won't work.

1. In Vercel: go to your project → **Settings** → **Environment Variables**
2. Add each variable below:

| Variable Name       | Value                              | Where to find it             |
|---------------------|------------------------------------|------------------------------|
| `RESEND_API_KEY`    | `re_xxxxxxxxxxxx`                  | Resend → API Keys            |
| `SUPABASE_URL`      | `https://xxxxx.supabase.co`        | Supabase → Settings → API    |
| `SUPABASE_ANON_KEY` | `eyJhbGci...` (long JWT)           | Supabase → Settings → API    |
| `CONTACT_EMAIL`     | `hello@cohope.org.uk`              | Your team's email address    |
| `SITE_URL`          | `https://cohope-culture-school.vercel.app` | Your Vercel URL     |

3. Set each variable for **Production**, **Preview**, and **Development**
4. After adding all variables: go to **Deployments** → click the three dots on latest → **Redeploy**

---

## STEP 7 — Verify Email Sending (Resend)

By default, Resend only allows sending FROM `onboarding@resend.dev` on the free plan.

**To send from your own email (e.g. noreply@cohope.org.uk):**
1. Resend Dashboard → **Domains** → **Add Domain**
2. Enter your domain (e.g. `cohope.org.uk`)
3. Add the DNS records Resend shows you to your domain registrar
4. Wait for verification (usually 5–30 minutes)
5. Update the `FROM` address in `lib/email.js` once verified

**Until you have a domain**, change the FROM line in `lib/email.js` to:
```javascript
const FROM = 'COHOPE Culture School <onboarding@resend.dev>';
```

---

## STEP 8 — Get a Domain Name

Recommended registrars for `.org.uk` domains:
- **Namecheap** (https://namecheap.com) — ~£7/year for `.org.uk`
- **GoDaddy** (https://godaddy.com)
- **Google Domains** (https://domains.google)

Suggested domain: `cohope.org.uk` or `cohopecultureschool.org.uk`

**Once you have a domain:**
1. Vercel → Project → **Settings** → **Domains** → Add your domain
2. Vercel will show you DNS records to add at your registrar
3. Follow the instructions — your site will be on the custom domain within 24 hours

---

## STEP 9 — Test Everything

Once deployed and variables are set, test each form:

1. ✅ **Contact form** → submit → check your CONTACT_EMAIL inbox
2. ✅ **Register form** → submit → check inbox for confirmation
3. ✅ **Callback form** → submit → check inbox for call request
4. ✅ **Newsletter bar** → submit → check Supabase → `newsletter_subscribers` table
5. ✅ **Supabase** → open each table and confirm records are appearing

---

## VIEWING YOUR DATA

All form submissions are stored in Supabase and visible in the dashboard:

1. Supabase → **Table Editor**
2. Select a table (e.g. `contact_submissions`)
3. You can filter, sort, export to CSV, and add team notes

---

## FUTURE UPDATES

Every time you make changes to the website:
```bash
git add .
git commit -m "Describe what you changed"
git push
```
Vercel will automatically redeploy within 60 seconds. Zero downtime.

---

## SUPPORT CONTACTS

| Service   | Support                          |
|-----------|----------------------------------|
| Vercel    | https://vercel.com/help          |
| Supabase  | https://supabase.com/docs        |
| Resend    | https://resend.com/docs          |

---

*COHOPE Culture School · Revisit. Regrow. Embrace.*
