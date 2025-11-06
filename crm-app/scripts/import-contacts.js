// ============================================================================
// Script 2: Prisma Bulk Import
// File: scripts/import-contacts.js
// Purpose: Import contacts from JSON into PostgreSQL using Prisma
// ============================================================================

const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

// Configuration
const prisma = new PrismaClient();
const JSON_PATH = path.join(__dirname, 'import.json');
const BATCH_SIZE = 50;

// Color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
};

// Progress bar function
function createProgressBar(current, total, barLength = 40) {
  const percentage = (current / total) * 100;
  const filledLength = Math.round((barLength * current) / total);
  const bar = '█'.repeat(filledLength) + '░'.repeat(barLength - filledLength);
  return `[${bar}] ${current}/${total} (${percentage.toFixed(1)}%)`;
}

// Main import function
async function importContacts() {
  const startTime = Date.now();

  console.log('\n' + '='.repeat(60));
  console.log(`${colors.bright}🚀 PRISMA BULK IMPORT${colors.reset}`);
  console.log('='.repeat(60) + '\n');

  try {
    // Step 1: Load JSON data
    console.log(`${colors.cyan}📂 Loading JSON data...${colors.reset}`);
    if (!fs.existsSync(JSON_PATH)) {
      throw new Error(`JSON file not found: ${JSON_PATH}\nPlease run: node scripts/convert-csv-to-json.js first`);
    }

    const contacts = JSON.parse(fs.readFileSync(JSON_PATH, 'utf-8'));
    console.log(`${colors.green}✅ Loaded ${contacts.length} contacts${colors.reset}\n`);

    // Step 2: Validate database connection
    console.log(`${colors.cyan}🔌 Testing database connection...${colors.reset}`);
    await prisma.$connect();
    console.log(`${colors.green}✅ Database connected${colors.reset}\n`);

    // Step 3: Check for existing contacts
    console.log(`${colors.cyan}🔍 Checking for existing contacts...${colors.reset}`);
    const existingCount = await prisma.contact.count();
    console.log(`${colors.yellow}⚠️  Found ${existingCount} existing contacts${colors.reset}`);

    if (existingCount > 0) {
      console.log(`${colors.yellow}⚠️  Warning: Database is not empty. Continuing will add new contacts.${colors.reset}`);
      console.log(`${colors.yellow}⚠️  To clear database first, run: npx prisma db push --force-reset${colors.reset}\n`);
    } else {
      console.log(`${colors.green}✅ Database is empty and ready for import${colors.reset}\n`);
    }

    // Step 4: Calculate batches
    const totalBatches = Math.ceil(contacts.length / BATCH_SIZE);
    console.log(`${colors.cyan}📦 Import configuration:${colors.reset}`);
    console.log(`   Total contacts: ${contacts.length}`);
    console.log(`   Batch size: ${BATCH_SIZE}`);
    console.log(`   Total batches: ${totalBatches}\n`);

    // Step 5: Import in batches with transaction
    console.log(`${colors.bright}🔄 Starting batch import...${colors.reset}\n`);

    let successCount = 0;
    let failureCount = 0;
    const errors = [];

    for (let i = 0; i < totalBatches; i++) {
      const batchNum = i + 1;
      const start = i * BATCH_SIZE;
      const end = Math.min(start + BATCH_SIZE, contacts.length);
      const batch = contacts.slice(start, end);

      try {
        // Use createMany for batch insert
        const result = await prisma.contact.createMany({
          data: batch,
          skipDuplicates: true, // Skip contacts with duplicate unique fields
        });

        successCount += result.count;

        // Progress bar
        const progress = createProgressBar(end, contacts.length);
        console.log(`${colors.green}✅ Batch ${batchNum}/${totalBatches}: ${result.count} contacts imported${colors.reset}`);
        console.log(`   ${progress}`);

      } catch (error) {
        failureCount += batch.length;
        errors.push({
          batch: batchNum,
          error: error.message,
          contacts: batch.slice(0, 3).map(c => `${c.rank}: ${c.contact_name}`) // Show first 3
        });
        console.error(`${colors.red}❌ Batch ${batchNum}/${totalBatches} FAILED: ${error.message}${colors.reset}`);
      }
    }

    // Step 6: Final verification
    console.log(`\n${colors.cyan}🔍 Verifying import...${colors.reset}`);
    const finalCount = await prisma.contact.count();
    const importTime = ((Date.now() - startTime) / 1000).toFixed(2);

    // Final summary
    console.log('\n' + '='.repeat(60));
    console.log(`${colors.bright}📊 IMPORT SUMMARY${colors.reset}`);
    console.log('='.repeat(60));
    console.log(`✅ Successfully imported: ${successCount} contacts`);
    console.log(`❌ Failed: ${failureCount} contacts`);
    console.log(`📈 Total in database: ${finalCount} contacts`);
    console.log(`⏱️  Import time: ${importTime} seconds`);
    console.log(`⚡ Average: ${(contacts.length / importTime).toFixed(1)} contacts/second`);
    console.log('='.repeat(60) + '\n');

    // Show errors if any
    if (errors.length > 0) {
      console.log(`${colors.red}⚠️  ERRORS ENCOUNTERED:${colors.reset}`);
      errors.forEach(({ batch, error, contacts }) => {
        console.log(`\nBatch ${batch}:`);
        console.log(`  Error: ${error}`);
        console.log(`  Sample contacts: ${contacts.join(', ')}`);
      });
      console.log('');
    }

    // Success message
    if (successCount === contacts.length) {
      console.log(`${colors.green}${colors.bright}🎉 ALL CONTACTS IMPORTED SUCCESSFULLY!${colors.reset}\n`);
      console.log(`${colors.cyan}Next step: Run validation script${colors.reset}`);
      console.log(`${colors.cyan}Command: node scripts/validate-import.js${colors.reset}\n`);
    } else {
      console.log(`${colors.yellow}⚠️  Import completed with errors. Review the error log above.${colors.reset}\n`);
    }

  } catch (error) {
    console.error(`\n${colors.red}💥 FATAL ERROR:${colors.reset}`, error.message);
    console.error(error.stack);
    throw error;
  } finally {
    await prisma.$disconnect();
    console.log(`${colors.cyan}🔌 Database disconnected${colors.reset}\n`);
  }
}

// Execute
if (require.main === module) {
  importContacts()
    .then(() => {
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n💥 Import failed');
      process.exit(1);
    });
}

module.exports = { importContacts };
