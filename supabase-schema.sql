-- ============================================================
-- COHOPE Culture School — Supabase Database Schema
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- ── 1. Contact form submissions ──────────────────────────────
CREATE TABLE IF NOT EXISTS contact_submissions (
  id              BIGSERIAL PRIMARY KEY,
  name            TEXT NOT NULL,
  email           TEXT NOT NULL,
  phone           TEXT,
  subject         TEXT DEFAULT 'General Enquiry',
  message         TEXT NOT NULL,
  status          TEXT DEFAULT 'new' CHECK (status IN ('new', 'read', 'replied', 'archived')),
  submitted_at    TIMESTAMPTZ DEFAULT NOW(),
  notes           TEXT  -- internal team notes
);

-- ── 2. Newsletter subscribers ────────────────────────────────
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id                  BIGSERIAL PRIMARY KEY,
  email               TEXT UNIQUE NOT NULL,
  first_name          TEXT,
  last_name           TEXT,
  age_group           TEXT,
  heritage_background TEXT,
  status              TEXT DEFAULT 'active' CHECK (status IN ('active', 'unsubscribed', 'bounced')),
  source              TEXT DEFAULT 'website',
  subscribed_at       TIMESTAMPTZ DEFAULT NOW(),
  resubscribed_at     TIMESTAMPTZ,
  unsubscribed_at     TIMESTAMPTZ
);

-- ── 3. Event registrations ───────────────────────────────────
CREATE TABLE IF NOT EXISTS event_registrations (
  id                  BIGSERIAL PRIMARY KEY,
  name                TEXT NOT NULL,
  email               TEXT NOT NULL,
  phone               TEXT,
  event_name          TEXT NOT NULL,
  event_id            TEXT,
  event_date          TEXT,
  age_group           TEXT NOT NULL,
  heritage_background TEXT,
  uk_born             TEXT,
  notes               TEXT,
  how_heard           TEXT,
  status              TEXT DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'waitlist', 'cancelled', 'attended')),
  registered_at       TIMESTAMPTZ DEFAULT NOW()
);

-- ── 4. Callback requests ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS callback_requests (
  id              BIGSERIAL PRIMARY KEY,
  name            TEXT NOT NULL,
  phone           TEXT NOT NULL,
  email           TEXT,
  preferred_time  TEXT DEFAULT 'Any time',
  reason          TEXT DEFAULT 'General enquiry',
  status          TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'called', 'no-answer', 'resolved')),
  requested_at    TIMESTAMPTZ DEFAULT NOW(),
  resolved_at     TIMESTAMPTZ,
  team_notes      TEXT
);

-- ── Row Level Security (RLS) ─────────────────────────────────
-- Only allow inserts from anonymous users (the website)
-- Reads are restricted to authenticated users (your Supabase dashboard login)

ALTER TABLE contact_submissions    ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_registrations    ENABLE ROW LEVEL SECURITY;
ALTER TABLE callback_requests      ENABLE ROW LEVEL SECURITY;

-- Allow public insert only
CREATE POLICY "Allow public insert" ON contact_submissions    FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Allow public insert" ON newsletter_subscribers FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Allow public insert" ON event_registrations    FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Allow public insert" ON callback_requests      FOR INSERT TO anon WITH CHECK (true);

-- Allow public select on newsletter (for duplicate check)
CREATE POLICY "Allow public select" ON newsletter_subscribers FOR SELECT TO anon USING (true);
CREATE POLICY "Allow public select" ON event_registrations    FOR SELECT TO anon USING (true);

-- Allow authenticated users (you) to see and update everything
CREATE POLICY "Allow authenticated full access" ON contact_submissions    FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow authenticated full access" ON newsletter_subscribers FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow authenticated full access" ON event_registrations    FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow authenticated full access" ON callback_requests      FOR ALL TO authenticated USING (true);

-- ── Indexes for performance ──────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_contact_email      ON contact_submissions (email);
CREATE INDEX IF NOT EXISTS idx_contact_status     ON contact_submissions (status);
CREATE INDEX IF NOT EXISTS idx_newsletter_email   ON newsletter_subscribers (email);
CREATE INDEX IF NOT EXISTS idx_newsletter_status  ON newsletter_subscribers (status);
CREATE INDEX IF NOT EXISTS idx_registrations_event ON event_registrations (event_id);
CREATE INDEX IF NOT EXISTS idx_registrations_email ON event_registrations (email);
CREATE INDEX IF NOT EXISTS idx_callback_status    ON callback_requests (status);

-- Done! Your COHOPE database is ready.
