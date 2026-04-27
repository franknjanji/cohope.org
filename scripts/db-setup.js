// scripts/db-setup.js
// Run this ONCE after connecting Vercel Postgres to create the database schema.
// Command: node scripts/db-setup.js
// (Make sure .env.local is populated with your Postgres credentials first)

import { sql } from '@vercel/postgres';

async function setup() {
  console.log('🗄️  Setting up COHOPE database schema...\n');

  try {
    // Registrations table
    await sql`
      CREATE TABLE IF NOT EXISTS registrations (
        id                SERIAL PRIMARY KEY,
        first_name        VARCHAR(100) NOT NULL,
        last_name         VARCHAR(100) NOT NULL,
        email             VARCHAR(255) NOT NULL,
        phone             VARCHAR(30),
        age_group         VARCHAR(20),
        background        VARCHAR(50),
        event_id          INTEGER NOT NULL,
        event_name        VARCHAR(255) NOT NULL,
        event_date        TIMESTAMPTZ,
        event_location    VARCHAR(255),
        emergency_contact VARCHAR(255),
        gdpr_consent      BOOLEAN NOT NULL DEFAULT FALSE,
        ip_address        VARCHAR(45),
        created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        status            VARCHAR(20) NOT NULL DEFAULT 'confirmed'
      );
    `;
    console.log('✅  registrations table created');

    // Events table (for future event management)
    await sql`
      CREATE TABLE IF NOT EXISTS events (
        id            SERIAL PRIMARY KEY,
        title         VARCHAR(255) NOT NULL,
        description   TEXT,
        event_date    TIMESTAMPTZ NOT NULL,
        location      VARCHAR(255),
        capacity      INTEGER DEFAULT 50,
        pillar        VARCHAR(100),
        age_group     VARCHAR(50),
        is_active     BOOLEAN NOT NULL DEFAULT TRUE,
        created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `;
    console.log('✅  events table created');

    // Newsletter subscribers (backup store alongside Mailchimp)
    await sql`
      CREATE TABLE IF NOT EXISTS newsletter_subscribers (
        id            SERIAL PRIMARY KEY,
        email         VARCHAR(255) UNIQUE NOT NULL,
        first_name    VARCHAR(100),
        last_name     VARCHAR(100),
        age_group     VARCHAR(20),
        source        VARCHAR(100),
        status        VARCHAR(20) NOT NULL DEFAULT 'pending',
        created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `;
    console.log('✅  newsletter_subscribers table created');

    // Contact form submissions log
    await sql`
      CREATE TABLE IF NOT EXISTS contact_submissions (
        id            SERIAL PRIMARY KEY,
        name          VARCHAR(200) NOT NULL,
        email         VARCHAR(255) NOT NULL,
        phone         VARCHAR(30),
        subject       VARCHAR(255),
        message       TEXT NOT NULL,
        ip_address    VARCHAR(45),
        created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `;
    console.log('✅  contact_submissions table created');

    // Useful indexes
    await sql`CREATE INDEX IF NOT EXISTS idx_registrations_email ON registrations(email);`;
    await sql`CREATE INDEX IF NOT EXISTS idx_registrations_event ON registrations(event_id);`;
    await sql`CREATE INDEX IF NOT EXISTS idx_newsletter_email ON newsletter_subscribers(email);`;
    console.log('✅  Indexes created');

    console.log('\n🎉  Database setup complete! COHOPE is ready.\n');
  } catch (error) {
    console.error('❌  Database setup failed:', error);
    process.exit(1);
  }
}

setup();
