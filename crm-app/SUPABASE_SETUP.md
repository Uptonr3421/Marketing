# Supabase Database Setup Guide

## Prerequisites

You've already completed:
- ✅ Supabase account created
- ✅ Database URL obtained: `db.dhxitbmzdfpgopauhjek.supabase.co`
- ✅ `.env.local` file created with connection string

## Step 0: Clean Up Wrong Schema (If Needed)

If you previously created a schema with a "users" table or incorrect structure:

1. Go to your Supabase project: https://supabase.com/dashboard
2. Navigate to **SQL Editor**
3. Run the contents of `prisma/cleanup-wrong-schema.sql`
4. This will drop all incorrect tables and start fresh

## Step 1: Create Correct Database Schema

### Option A: Using Supabase SQL Editor (Recommended)

1. Go to your Supabase project: https://supabase.com/dashboard
2. Navigate to **SQL Editor** in the left sidebar
3. Click **New Query**
4. Copy and paste the contents of `prisma/create-correct-schema.sql`
5. Click **Run** to execute

### Option B: Using psql Locally

```bash
cd crm-app

# First, clean up wrong schema (if needed)
psql "postgresql://postgres:marketingBespoke12@db.dhxitbmzdfpgopauhjek.supabase.co:5432/postgres" -f prisma/cleanup-wrong-schema.sql

# Then, create correct schema
psql "postgresql://postgres:marketingBespoke12@db.dhxitbmzdfpgopauhjek.supabase.co:5432/postgres" -f prisma/create-correct-schema.sql
```

### Verify Tables Created

Run this query in SQL Editor to verify:

```sql
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;
```

You should see:
- activities
- agent_logs
- campaigns
- contacts
- deals

## Step 2: Import Contact Data

The import scripts are located in `crm-app/scripts/`.

### Install Script Dependencies

```bash
cd crm-app/scripts
npm install
```

### Run Import (3 steps)

```bash
# Step 1: Convert CSV to JSON (already tested ✅)
node convert-csv-to-json.js

# Step 2: Import 350 contacts to database (7 batches of 50)
node import-contacts.js

# Step 3: Validate import
node validate-import.js
```

Expected output:
```
✅ Batch 1/7: 50 contacts imported
✅ Batch 2/7: 50 contacts imported
...
✅ Batch 7/7: 50 contacts imported
🎉 Successfully imported 350 contacts!
```

## Step 3: Run Development Server

```bash
cd crm-app
npm run dev
```

Visit http://localhost:3000 to see your CRM!

## Step 4: Deploy to Vercel

### Add Environment Variables in Vercel

1. Go to your Vercel project settings
2. Navigate to **Environment Variables**
3. Add these variables:

```
POSTGRES_URL=postgresql://postgres:marketingBespoke12@db.dhxitbmzdfpgopauhjek.supabase.co:5432/postgres
POSTGRES_PRISMA_URL=postgresql://postgres:marketingBespoke12@db.dhxitbmzdfpgopauhjek.supabase.co:5432/postgres?pgbouncer=true&connection_limit=1
POSTGRES_URL_NON_POOLING=postgresql://postgres:marketingBespoke12@db.dhxitbmzdfpgopauhjek.supabase.co:5432/postgres
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
```

### Push to Main Branch

```bash
git push origin main
```

Vercel will automatically detect the push and deploy your app!

## Troubleshooting

### If import fails:

```bash
# Check database connection
psql "postgresql://postgres:marketingBespoke12@db.dhxitbmzdfpgopauhjek.supabase.co:5432/postgres" -c "SELECT version();"

# Check existing contacts
psql "postgresql://postgres:marketingBespoke12@db.dhxitbmzdfpgopauhjek.supabase.co:5432/postgres" -c "SELECT COUNT(*) FROM contacts;"
```

### If Vercel build fails:

1. Check that `vercel.json` is in the root directory
2. Verify environment variables are set
3. Check build logs for specific errors

## Database Schema Overview

### Tables Created

1. **contacts** - 350 personalized outreach contacts
   - Primary fields: rank, company, contact_name, email, tier, lead_score
   - JSON fields: pain_points, ai_solutions

2. **activities** - Track outreach activities
   - Types: call, email, meeting, task, note
   - Status: pending, completed, cancelled

3. **deals** - Sales opportunities
   - Tracks deal value, type, and status

4. **campaigns** - Marketing campaigns
   - Organizes contacts by tier and status

5. **agent_logs** - AI agent action logs
   - Audit trail for all AI operations

## Security Notes

⚠️ **IMPORTANT:** Never commit `.env.local` to git!

The `.gitignore` file already protects it, but always verify:

```bash
git status
# Should NOT show .env.local
```

## Support

If you encounter issues:
1. Check Supabase logs: https://supabase.com/dashboard → Logs
2. Check Vercel logs: Project → Deployments → Click deployment → View logs
3. Run validation script: `node scripts/validate-import.js`
