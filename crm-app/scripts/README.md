# 🚀 Bespoke Ethos CRM - Database Import Scripts

Complete solution for importing 350 Plexus contacts into the CRM database.

## 📋 Overview

Three production-ready scripts to convert CSV data to JSON, bulk import to PostgreSQL via Prisma, and validate the import:

1. **convert-csv-to-json.js** - CSV parser and field mapper
2. **import-contacts.js** - Prisma bulk importer with batching
3. **validate-import.js** - Data integrity validator

## 🔧 Installation

```bash
# Navigate to CRM app directory
cd /home/user/Marketing/crm-app

# Install required dependencies
npm install csv-parser

# Generate Prisma client (if not already done)
npx prisma generate

# Verify database connection
npx prisma db pull
```

## ⚙️ Prerequisites

- Node.js v18+ installed
- PostgreSQL database configured
- `.env` file with `POSTGRES_PRISMA_URL` set
- CSV file at `/home/user/Marketing/plexus_outreach_master_v6.csv`

## 🚀 Execution Steps

### Step 1: Convert CSV to JSON

```bash
node scripts/convert-csv-to-json.js
```

**What it does:**
- Reads `plexus_outreach_master_v6.csv` (350 contacts)
- Maps CSV columns to Prisma schema fields
- Generates `pain_points` and `ai_solutions` JSON fields
- Validates required fields (rank, company, contact_name, email)
- Outputs `scripts/import.json`

**Expected output:**
```
✅ Processed 350 contacts...
✅ CONVERSION COMPLETE!
📊 Total rows processed: 350
✅ Valid contacts converted: 350
📁 Output file: scripts/import.json
```

**Time:** ~1-2 seconds

---

### Step 2: Bulk Import to Database

```bash
node scripts/import-contacts.js
```

**What it does:**
- Connects to PostgreSQL via Prisma
- Imports contacts in batches of 50 (7 total batches)
- Uses `createMany` with transaction safety
- Skips duplicates automatically
- Shows real-time progress bar
- Logs any errors with rollback support

**Expected output:**
```
✅ Batch 1/7: 50 contacts imported
[████████████████████████████████████████] 50/350 (14.3%)
✅ Batch 2/7: 50 contacts imported
[████████████████████████████████████████] 100/350 (28.6%)
...
✅ Successfully imported: 350 contacts
⏱️  Import time: 3.5 seconds
⚡ Average: 100 contacts/second
🎉 ALL CONTACTS IMPORTED SUCCESSFULLY!
```

**Time:** ~3-5 seconds

---

### Step 3: Validate Import

```bash
node scripts/validate-import.js
```

**What it does:**
- Counts total contacts (expects 350)
- Verifies required fields are populated
- Checks rank uniqueness (1-350)
- Validates rank range
- Shows optional field coverage statistics
- Displays sample data
- Generates validation report JSON

**Expected output:**
```
✅ PASS: Found 350 contacts (expected 350)
✅ Rank: All populated
✅ Company: All populated
✅ Contact Name: All populated
✅ Email: All populated
✅ PASS: All ranks are unique
✅ PASS: Rank range is 1-350

📈 Optional Fields Coverage:
   Phone: 0/350 (0.0%)
   Role: 350/350 (100.0%)
   Industry: 350/350 (100.0%)
   Website: 350/350 (100.0%)
   LinkedIn URL: 350/350 (100.0%)
   Lead Score: 350/350 (100.0%)
   Tier: 350/350 (100.0%)
   Deep Research: 350/350 (100.0%)
   Pain Points: 350/350 (100.0%)
   AI Solutions: 350/350 (100.0%)

✅ Passed: 7
❌ Failed: 0
⚠️  Warnings: 0

🎉 VALIDATION PASSED! Import is successful and data integrity verified.
```

**Time:** ~1-2 seconds

---

## 📊 Import Specifications

| Parameter | Value |
|-----------|-------|
| Total Contacts | 350 |
| Batch Size | 50 contacts |
| Total Batches | 7 |
| Estimated Time | 5-10 seconds |
| Database | PostgreSQL |
| ORM | Prisma v5.22.0 |

## 🗂️ Field Mapping

| CSV Column | Prisma Field | Type | Required |
|------------|--------------|------|----------|
| Rank | rank | Int | ✅ |
| Company | company | String | ✅ |
| Contact_Name | contact_name | String | ✅ |
| Email | email | String | ✅ |
| Phone | phone | String? | ❌ |
| Role | role | String? | ❌ |
| Industry | industry | String? | ❌ |
| Tier | tier | String? | ❌ |
| LinkedIn | linkedin_url | String? | ❌ |
| Website | website | String? | ❌ |
| Lead_Score | lead_score | Int? | ❌ |
| Notes | deep_research | String? | ❌ |
| (generated) | pain_points | Json? | ❌ |
| (generated) | ai_solutions | Json? | ❌ |

## 🔄 Full Import Workflow

```bash
# Complete import pipeline (all 3 steps)
node scripts/convert-csv-to-json.js && \
node scripts/import-contacts.js && \
node scripts/validate-import.js
```

## 🛠️ Troubleshooting

### Error: "JSON file not found"
```bash
# Run conversion first
node scripts/convert-csv-to-json.js
```

### Error: "Database connection failed"
```bash
# Check .env file has POSTGRES_PRISMA_URL
cat .env

# Test connection
npx prisma db pull
```

### Error: "Duplicate rank values"
```bash
# Clear database and reimport
npx prisma db push --force-reset
node scripts/import-contacts.js
```

### Import partial data
```bash
# Check logs in import-contacts.js output
# Review error messages for specific issues
# Validation script will show missing data
```

## 🧪 Testing

```bash
# Dry run: Convert CSV only (no database changes)
node scripts/convert-csv-to-json.js

# Check generated JSON
cat scripts/import.json | head -50

# Count contacts in JSON
cat scripts/import.json | grep -c '"rank"'
```

## 📝 Output Files

- `scripts/import.json` - Converted contact data (350 contacts)
- `scripts/validation-report.json` - Detailed validation results

## 🎯 Success Criteria

✅ All 350 contacts imported
✅ No duplicate ranks
✅ All required fields populated
✅ Rank range 1-350
✅ No database errors
✅ Validation report shows 0 failures

## 🚨 Safety Features

- **Batch processing**: Prevents memory overflow
- **skipDuplicates**: Avoids unique constraint violations
- **Error logging**: Captures and reports failures
- **Progress tracking**: Real-time feedback
- **Rollback support**: Transaction safety per batch
- **Data validation**: Pre-import and post-import checks

## 📞 Support

For issues or questions, review the validation report or check Prisma logs.

---

**Created by:** Agent 8 - Database Import Script Preparer
**Date:** 2025-11-06
**Version:** 1.0.0
**Status:** ✅ Ready for Production
