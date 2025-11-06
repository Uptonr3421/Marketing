# ⚡ QUICK START - Database Import

## Copy-Paste Execution Commands

### Prerequisites Check
```bash
# 1. Verify you're in the correct directory
cd /home/user/Marketing/crm-app

# 2. Verify database connection
npx prisma db pull

# 3. Check CSV file exists
ls -lh /home/user/Marketing/plexus_outreach_master_v6.csv
```

### Complete Import Pipeline (All 3 Steps)
```bash
cd /home/user/Marketing/crm-app && \
node scripts/convert-csv-to-json.js && \
node scripts/import-contacts.js && \
node scripts/validate-import.js
```

### Individual Steps

#### Step 1: Convert CSV → JSON
```bash
cd /home/user/Marketing/crm-app
node scripts/convert-csv-to-json.js
```

#### Step 2: Import to Database
```bash
cd /home/user/Marketing/crm-app
node scripts/import-contacts.js
```

#### Step 3: Validate Import
```bash
cd /home/user/Marketing/crm-app
node scripts/validate-import.js
```

### Verify Results
```bash
# Count contacts in database using Prisma Studio
npx prisma studio

# Or query via CLI
npx prisma db execute --stdin <<EOF
SELECT COUNT(*) FROM contacts;
EOF
```

## 🎯 Expected Results

- **Total Contacts:** 350
- **Import Time:** ~5-10 seconds
- **Success Rate:** 100%
- **Batches:** 7 (50 contacts each)

## 🚨 Troubleshooting

### Reset Database (if needed)
```bash
cd /home/user/Marketing/crm-app
npx prisma db push --force-reset
npx prisma generate
```

### Re-run Import
```bash
cd /home/user/Marketing/crm-app
node scripts/import-contacts.js
```

### View Logs
```bash
# Check validation report
cat /home/user/Marketing/crm-app/scripts/validation-report.json
```

---

**Status:** ✅ READY TO EXECUTE
**Last Updated:** 2025-11-06
