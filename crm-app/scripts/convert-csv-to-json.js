// ============================================================================
// Script 1: CSV to JSON Converter
// File: scripts/convert-csv-to-json.js
// Purpose: Convert plexus_outreach_master_v6.csv to Prisma-compatible JSON
// ============================================================================

const fs = require('fs');
const csv = require('csv-parser');
const path = require('path');

// Configuration
const CSV_PATH = path.join(__dirname, '../../plexus_outreach_master_v6.csv');
const OUTPUT_PATH = path.join(__dirname, 'import.json');

// Field mapping from CSV to Prisma schema
const FIELD_MAPPING = {
  'Rank': 'rank',
  'Company': 'company',
  'Contact_Name': 'contact_name',
  'Email': 'email',
  'Phone': 'phone',
  'Role': 'role',
  'Industry': 'industry',
  'Tier': 'tier',
  'LinkedIn': 'linkedin_url',
  'Website': 'website',
  'Lead_Score': 'lead_score',
  'Notes': 'deep_research',
  'Status': 'status'
};

// Main converter function
async function convertCsvToJson() {
  console.log('🚀 Starting CSV to JSON conversion...\n');
  console.log(`📂 Reading from: ${CSV_PATH}`);
  console.log(`📝 Output to: ${OUTPUT_PATH}\n`);

  const contacts = [];
  let rowCount = 0;
  let errorCount = 0;

  return new Promise((resolve, reject) => {
    fs.createReadStream(CSV_PATH)
      .pipe(csv())
      .on('data', (row) => {
        try {
          rowCount++;

          // Parse and map fields
          const contact = {
            rank: parseInt(row.Rank),
            company: row.Company || '',
            contact_name: row.Contact_Name || '',
            email: row.Email || '',
            phone: row.Phone || null,
            role: row.Role || null,
            industry: row.Industry || null,
            tier: row.Tier || null,
            linkedin_url: row.LinkedIn || null,
            website: row.Website || null,
            lead_score: row.Lead_Score ? parseInt(row.Lead_Score) : null,
            deep_research: row.Notes || null,
          };

          // Generate pain_points from available data
          const painPoints = [];
          if (row.Industry) {
            painPoints.push(`Industry-specific challenges in ${row.Industry}`);
          }
          if (row.Email_Body && row.Email_Body.includes('pain') || row.Email_Body.includes('challenge')) {
            painPoints.push('Operational efficiency challenges identified');
          }

          // Generate ai_solutions from tier and industry
          const aiSolutions = [];
          if (row.Tier === 'A - Enterprise' || row.Tier === 'B - Mid-Market') {
            aiSolutions.push('Predictive analytics for data-driven decisions');
            aiSolutions.push('Process automation to reduce manual tasks');
          }
          if (row.Industry) {
            aiSolutions.push(`AI-powered solutions tailored for ${row.Industry}`);
          }

          // Only add if solutions exist, otherwise null
          contact.pain_points = painPoints.length > 0 ? painPoints : null;
          contact.ai_solutions = aiSolutions.length > 0 ? aiSolutions : null;

          // Validate required fields
          if (!contact.rank || !contact.company || !contact.contact_name || !contact.email) {
            console.warn(`⚠️  Warning: Missing required fields in row ${rowCount}`);
            errorCount++;
            return;
          }

          contacts.push(contact);

          // Progress indicator every 50 contacts
          if (contacts.length % 50 === 0) {
            console.log(`✅ Processed ${contacts.length} contacts...`);
          }
        } catch (error) {
          console.error(`❌ Error processing row ${rowCount}:`, error.message);
          errorCount++;
        }
      })
      .on('end', () => {
        // Write to JSON file
        try {
          fs.writeFileSync(OUTPUT_PATH, JSON.stringify(contacts, null, 2));

          console.log('\n' + '='.repeat(60));
          console.log('✅ CONVERSION COMPLETE!');
          console.log('='.repeat(60));
          console.log(`📊 Total rows processed: ${rowCount}`);
          console.log(`✅ Valid contacts converted: ${contacts.length}`);
          console.log(`⚠️  Errors/Warnings: ${errorCount}`);
          console.log(`📁 Output file: ${OUTPUT_PATH}`);
          console.log(`📦 File size: ${(fs.statSync(OUTPUT_PATH).size / 1024).toFixed(2)} KB`);
          console.log('='.repeat(60) + '\n');

          // Show sample contact
          if (contacts.length > 0) {
            console.log('📄 Sample contact (first):');
            console.log(JSON.stringify(contacts[0], null, 2));
          }

          resolve(contacts);
        } catch (error) {
          console.error('❌ Error writing JSON file:', error);
          reject(error);
        }
      })
      .on('error', (error) => {
        console.error('❌ Error reading CSV file:', error);
        reject(error);
      });
  });
}

// Execute
if (require.main === module) {
  convertCsvToJson()
    .then(() => {
      console.log('\n🎉 Ready for import! Run: node scripts/import-contacts.js');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n💥 Conversion failed:', error);
      process.exit(1);
    });
}

module.exports = { convertCsvToJson };
