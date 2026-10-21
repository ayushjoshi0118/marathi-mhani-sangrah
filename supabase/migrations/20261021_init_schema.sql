-- ==============================================================================
-- मराठी म्हणी संग्रह — Marathi Mhani Sangrah
-- Production PostgreSQL Database Schema & Security Policies (Supabase Compatible)
-- ==============================================================================

-- 1. Enable Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- 2. Proverbs Table
CREATE TABLE IF NOT EXISTS public.proverbs (
  id TEXT PRIMARY KEY,
  serial_number INTEGER NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  proverb TEXT NOT NULL,
  normalized TEXT NOT NULL,
  meaning_marathi TEXT NOT NULL,
  meaning_english TEXT NOT NULL,
  example_marathi TEXT NOT NULL,
  example_english TEXT NOT NULL,
  context TEXT NOT NULL,
  english_equivalent TEXT,
  category TEXT NOT NULL,
  tags TEXT[] NOT NULL DEFAULT '{}',
  provenance JSONB NOT NULL DEFAULT '{}'::jsonb,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'reviewed', 'pending_review', 'verified', 'published', 'archived')),
  editorial_review JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  published_at TIMESTAMPTZ
);

-- 3. Categories Table
CREATE TABLE IF NOT EXISTS public.categories (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title_marathi TEXT NOT NULL,
  title_english TEXT NOT NULL,
  description_marathi TEXT NOT NULL,
  description_english TEXT NOT NULL,
  icon TEXT NOT NULL,
  color TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Community Suggestions Table
CREATE TABLE IF NOT EXISTS public.suggestions (
  id TEXT PRIMARY KEY DEFAULT ('sug-' || gen_random_uuid()),
  proverb TEXT NOT NULL,
  meaning_marathi TEXT,
  meaning_english TEXT,
  example_marathi TEXT,
  category TEXT,
  contributor_name TEXT,
  contributor_email TEXT,
  source TEXT,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  admin_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Community Corrections Table
CREATE TABLE IF NOT EXISTS public.corrections (
  id TEXT PRIMARY KEY DEFAULT ('cor-' || gen_random_uuid()),
  proverb_id TEXT,
  proverb_text TEXT NOT NULL,
  serial_number INTEGER,
  issue_type TEXT NOT NULL CHECK (issue_type IN ('spelling', 'meaning', 'example', 'context', 'other')),
  description TEXT NOT NULL,
  suggested_correction TEXT NOT NULL,
  reporter_name TEXT,
  reporter_email TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'applied', 'rejected')),
  admin_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- Indexes for High Performance Querying
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_proverbs_serial_number ON public.proverbs(serial_number);
CREATE INDEX IF NOT EXISTS idx_proverbs_slug ON public.proverbs(slug);
CREATE INDEX IF NOT EXISTS idx_proverbs_status ON public.proverbs(status);
CREATE INDEX IF NOT EXISTS idx_proverbs_category ON public.proverbs(category);
CREATE INDEX IF NOT EXISTS idx_proverbs_search_trgm ON public.proverbs USING gin (normalized gin_trgm_ops);

-- ==============================================================================
-- Row Level Security (RLS) Policies
-- ==============================================================================

-- Enable RLS on all tables
ALTER TABLE public.proverbs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.suggestions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.corrections ENABLE ROW LEVEL SECURITY;

-- Proverbs Policies:
-- Anonymous public users can ONLY SELECT published proverbs
CREATE POLICY "Public can view published proverbs"
  ON public.proverbs
  FOR SELECT
  TO anon, authenticated
  USING (status = 'published');

-- Service role has full access to manage all proverbs
CREATE POLICY "Service role full access on proverbs"
  ON public.proverbs
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Categories Policies:
-- Public can read all categories
CREATE POLICY "Public can view all categories"
  ON public.categories
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Service role full access on categories"
  ON public.categories
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Suggestions Policies:
-- Public can submit suggestions (INSERT only)
CREATE POLICY "Public can insert suggestions"
  ON public.suggestions
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Only service role can read or update suggestions
CREATE POLICY "Service role can view and update suggestions"
  ON public.suggestions
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Corrections Policies:
-- Public can submit corrections (INSERT only)
CREATE POLICY "Public can insert corrections"
  ON public.corrections
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Only service role can read or update corrections
CREATE POLICY "Service role can view and update corrections"
  ON public.corrections
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
