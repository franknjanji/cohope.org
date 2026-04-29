# COHOPE Culture School — Deployment Guide
## Express.js + Supabase (Non-Vercel Deployment)

This guide shows you how to deploy the COHOPE Culture School website as a standalone Express.js application using Supabase as the database.

---

## Prerequisites

- Node.js 18 or higher installed
- A Supabase account (free tier is sufficient)
- (Optional) Resend account for transactional emails
- (Optional) Mailchimp account for newsletter
- (Optional) Twilio account for SMS notifications

---

## STEP 1 — Install Dependencies

Open PowerShell or Command Prompt in your project directory and run:

```powershell
# If you have PowerShell execution policy issues, run this first:
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Then install dependencies:
npm install
```

This will install:
- `express` - Web server framework
- `cors` - Cross-origin resource sharing
- `dotenv` - Environment variable management
- `@supabase/supabase-js` - Supabase client
- `resend` - Email service
- `twilio` - SMS service

---

## STEP 2 — Set Up Supabase

1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Click **"New Project"**
3. Name it (e.g., "cohope-culture-school")
4. Choose a region (closest to your users)
5. Wait for the project to be created (1-2 minutes)

### Get Your Supabase Credentials

In your Supabase project dashboard:

1. Go to **Settings → API**
2. Copy these values:
   - **Project URL** (e.g., `https://xxxxxxxxxxxxx.supabase.co`)
   - **anon/public key** (starts with `eyJ...`)
   - **service_role key** (starts with `eyJ...` - this is for server-side use)

### Set Up the Database Schema

1. In Supabase, go to **SQL Editor**
2. Click **"New Query"**
3. Copy the contents of `supabase-schema.sql` from your project
4. Paste it into the SQL Editor
5. Click **"Run"** to create the tables

The schema includes:
- `contact_submissions` - Contact form submissions
- `event_registrations` - Event registrations
- `callback_requests` - Phone callback requests
- `newsletter_subscribers` - Newsletter signups

---

## STEP 3 — Configure Environment Variables

1. Copy the example environment file:

```bash
cp .env.example .env
```

2. Open `.env` in your text editor
3. Fill in your Supabase credentials:

```env
# Supabase
SUPABASE_URL=https://YOUR-PROJECT.supabase.co
SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

4. (Optional) Add other service credentials:

```env
# Resend (Email)
RESEND_API_KEY=re_your_resend_key
FROM_EMAIL=hello@cohope.org.uk
CONTACT_RECEIVER_EMAIL=info@cohope.org.uk

# Mailchimp (Newsletter)
MAILCHIMP_API_KEY=your_mailchimp_key-us21
MAILCHIMP_AUDIENCE_ID=your_audience_id
MAILCHIMP_SERVER_PREFIX=us21

# Twilio (SMS)
TWILIO_ACCOUNT_SID=ACyour_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_FROM_NUMBER=+441234567890
TWILIO_ADMIN_NUMBER=+447700000000
```

---

## STEP 4 — Run Locally

Start the development server:

```bash
npm run dev
```

The application will start at `http://localhost:3000`

### Test the Application

1. Open `http://localhost:3000` in your browser
2. Test the contact form
3. Test event registration
4. Test newsletter signup
5. Check your Supabase dashboard to see the data being stored

---

## STEP 5 — Deploy to Production

Choose one of the following deployment platforms:

### Option A: Render (Recommended - Free Tier)

1. Go to [render.com](https://render.com) and sign up
2. Click **"New +" → "Web Service"**
3. Connect your GitHub repository
4. Configure:
   - **Name**: `cohope-culture-school`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Click **"Advanced"** → "Environment Variables"
6. Add all your environment variables from `.env`
7. Click **"Create Web Service"**

Render will:
- Build your application
- Deploy it to a URL like `https://cohope-culture-school.onrender.com`
- Provide automatic SSL certificates

### Option B: Railway (Free Tier Available)

1. Go to [railway.app](https://railway.app) and sign up
2. Click **"New Project" → "Deploy from GitHub repo"**
3. Select your repository
4. Railway will detect it's a Node.js project
5. Click **"Add Variables"** and add your environment variables
6. Click **"Deploy"**

Railway will provide a URL like `https://cohope-culture-school.up.railway.app`

### Option C: Heroku (Paid)

1. Install the Heroku CLI: `npm install -g heroku`
2. Login: `heroku login`
3. Create app: `heroku create cohope-culture-school`
4. Set environment variables:
```bash
heroku config:set SUPABASE_URL=your_url
heroku config:set SUPABASE_ANON_KEY=your_key
heroku config:set SUPABASE_SERVICE_ROLE_KEY=your_service_key
# Add other variables similarly
```
5. Deploy: `git push heroku main`

### Option D: DigitalOcean App Platform

1. Go to [digitalocean.com](https://digitalocean.com)
2. Create an account
3. Click **"Create" → "Apps"**
4. Connect your GitHub repository
5. Configure build and run settings
6. Add environment variables
7. Deploy

---

## STEP 6 — Configure Your Domain (Optional)

### Using Render

1. In your Render dashboard, go to your service
2. Click **"Settings" → "Domains"**
3. Add your custom domain (e.g., `cohope.org.uk`)
4. Update your DNS records as instructed by Render

### Using Railway

1. In your Railway dashboard, go to your project
2. Click **"Settings" → "Domains"**
3. Add your custom domain
4. Update your DNS records

### Using Heroku

1. Run: `heroku domains:add cohope.org.uk`
2. Update your DNS records to point to Heroku's DNS target

---

## STEP 7 — Set Up Email Domain (Optional but Recommended)

If you want to use your own domain for emails (instead of `onboarding@resend.dev`):

1. Go to [resend.com](https://resend.com) → **Domains**
2. Click **"Add Domain"**
3. Enter your domain (e.g., `cohope.org.uk`)
4. Follow the DNS verification instructions:
   - Add TXT record at your domain registrar
   - Add CNAME record at your domain registrar
5. Once verified, update your `.env`:
```env
FROM_EMAIL=hello@cohope.org.uk
```

---

## STEP 8 — Production Checklist

Before going live, ensure:

- [ ] Supabase database schema is set up
- [ ] All environment variables are configured in production
- [ ] Email sending is tested (Resend)
- [ ] SMS notifications are tested (Twilio)
- [ ] Newsletter signup is tested (Mailchimp)
- [ ] Custom domain is configured (optional)
- [ ] SSL certificates are active (automatic on most platforms)
- [ ] All forms are submitting data to Supabase correctly

---

## Troubleshooting

### Application Won't Start

- Check that Node.js 18+ is installed: `node --version`
- Ensure all dependencies are installed: `npm install`
- Check that `.env` file exists and is properly configured

### Supabase Connection Errors

- Verify your `SUPABASE_URL` and keys are correct
- Check that your Supabase project is active
- Ensure the database schema is set up

### Email Not Sending

- Verify `RESEND_API_KEY` is correct
- Check that you're using a verified email domain
- Test with `onboarding@resend.dev` first

### SMS Not Sending

- Verify Twilio credentials
- Check that your Twilio number is active
- Ensure `TWILIO_ADMIN_NUMBER` is in E.164 format

---

## Monitoring

### Check Logs

- **Render**: Dashboard → Logs
- **Railway**: Dashboard → Logs
- **Heroku**: `heroku logs --tail`

### Monitor Supabase

- Go to Supabase Dashboard → Database → Table Editor
- Check that data is being inserted correctly
- Monitor usage in Supabase Dashboard → Settings → Billing

---

## Support

For service-specific issues:
- **Supabase**: [supabase.com/docs](https://supabase.com/docs)
- **Resend**: [resend.com/docs](https://resend.com/docs)
- **Twilio**: [twilio.com/docs](https://twilio.com/docs)
- **Mailchimp**: [mailchimp.com/help](https://mailchimp.com/help)

---

## Security Notes

- Never commit `.env` files to Git
- Use strong, unique API keys
- Rotate keys periodically
- Enable Row Level Security (RLS) in Supabase for production
- Keep dependencies updated: `npm audit fix`

---

*COHOPE Culture School · Anglican Church Community · United Kingdom · Ages 15–30*  
*Revisit. Regrow. Embrace.*
