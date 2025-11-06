-- Drop incorrect schema and start fresh
-- Run this in your Supabase SQL Editor

-- Drop tables in correct order (respecting foreign key constraints)
DROP TABLE IF EXISTS activities CASCADE;
DROP TABLE IF EXISTS deals CASCADE;
DROP TABLE IF EXISTS agent_logs CASCADE;
DROP TABLE IF EXISTS contacts CASCADE;
DROP TABLE IF EXISTS campaigns CASCADE;

-- Drop the incorrect "users" table if it exists
DROP TABLE IF EXISTS users CASCADE;

-- Drop any other incorrect tables
DROP TABLE IF EXISTS public.users CASCADE;
DROP TABLE IF EXISTS public.activities CASCADE;
DROP TABLE IF EXISTS public.deals CASCADE;
DROP TABLE IF EXISTS public.contacts CASCADE;
DROP TABLE IF EXISTS public.campaigns CASCADE;
DROP TABLE IF EXISTS public.agent_logs CASCADE;

-- Verify tables are dropped
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;
