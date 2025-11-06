-- Bespoke Ethos CRM Platform - CORRECT Database Schema
-- Run this AFTER cleanup-wrong-schema.sql
-- Run in your Supabase SQL Editor

-- ============================================================================
-- CAMPAIGNS TABLE
-- ============================================================================
CREATE TABLE campaigns (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    name TEXT NOT NULL,
    tier TEXT NOT NULL,
    status TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- CONTACTS TABLE (Main table for 350 contacts)
-- ============================================================================
CREATE TABLE contacts (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    rank INTEGER UNIQUE NOT NULL,
    company TEXT NOT NULL,
    contact_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    role TEXT,
    industry TEXT,
    website TEXT,
    linkedin_url TEXT,
    lead_score INTEGER,
    tier TEXT,
    deep_research TEXT,
    pain_points JSONB,
    ai_solutions JSONB,
    campaign_id TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT contacts_campaign_id_fkey FOREIGN KEY (campaign_id)
        REFERENCES campaigns(id) ON DELETE SET NULL
);

-- ============================================================================
-- ACTIVITIES TABLE (Track outreach activities)
-- ============================================================================
CREATE TABLE activities (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    contact_id TEXT NOT NULL,
    activity_type TEXT NOT NULL,
    status TEXT NOT NULL,
    notes TEXT,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    due_date TIMESTAMPTZ,
    CONSTRAINT activities_contact_id_fkey FOREIGN KEY (contact_id)
        REFERENCES contacts(id) ON DELETE CASCADE
);

-- ============================================================================
-- DEALS TABLE (Sales opportunities)
-- ============================================================================
CREATE TABLE deals (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    contact_id TEXT NOT NULL,
    deal_value DECIMAL(12, 2) NOT NULL,
    deal_type TEXT NOT NULL,
    status TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT deals_contact_id_fkey FOREIGN KEY (contact_id)
        REFERENCES contacts(id) ON DELETE CASCADE
);

-- ============================================================================
-- AGENT_LOGS TABLE (AI agent action logs)
-- ============================================================================
CREATE TABLE agent_logs (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    agent_name TEXT NOT NULL,
    action TEXT NOT NULL,
    status TEXT NOT NULL,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    input_data JSONB,
    output_data JSONB
);

-- ============================================================================
-- INDEXES (for better query performance)
-- ============================================================================
CREATE INDEX idx_contacts_rank ON contacts(rank);
CREATE INDEX idx_contacts_tier ON contacts(tier);
CREATE INDEX idx_contacts_campaign_id ON contacts(campaign_id);
CREATE INDEX idx_activities_contact_id ON activities(contact_id);
CREATE INDEX idx_activities_timestamp ON activities(timestamp);
CREATE INDEX idx_deals_contact_id ON deals(contact_id);
CREATE INDEX idx_deals_status ON deals(status);
CREATE INDEX idx_agent_logs_timestamp ON agent_logs(timestamp);

-- ============================================================================
-- TRIGGER (auto-update updated_at timestamp)
-- ============================================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_contacts_updated_at
    BEFORE UPDATE ON contacts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- VERIFICATION
-- ============================================================================
-- Check that all tables were created
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;

-- Should show:
-- activities
-- agent_logs
-- campaigns
-- contacts
-- deals
