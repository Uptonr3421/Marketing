// ============================================================================
// Script 3: Validation Script
// File: scripts/validate-import.js
// Purpose: Verify successful import and data integrity
// ============================================================================

const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

// Color codes
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
};

// Validation checks
async function validateImport() {
  console.log('\n' + '='.repeat(60));
  console.log(`${colors.bright}🔍 IMPORT VALIDATION REPORT${colors.reset}`);
  console.log('='.repeat(60) + '\n');

  const report = {
    timestamp: new Date().toISOString(),
    checks: [],
    errors: [],
    warnings: [],
  };

  try {
    await prisma.$connect();

    // CHECK 1: Total contact count
    console.log(`${colors.cyan}📊 Check 1: Total Contact Count${colors.reset}`);
    const totalContacts = await prisma.contact.count();
    const expectedCount = 350;

    const countCheck = {
      name: 'Total Contact Count',
      expected: expectedCount,
      actual: totalContacts,
      status: totalContacts === expectedCount ? 'PASS' : 'FAIL',
    };
    report.checks.push(countCheck);

    if (countCheck.status === 'PASS') {
      console.log(`${colors.green}✅ PASS: Found ${totalContacts} contacts (expected ${expectedCount})${colors.reset}\n`);
    } else {
      console.log(`${colors.red}❌ FAIL: Found ${totalContacts} contacts (expected ${expectedCount})${colors.reset}\n`);
      report.errors.push(`Expected ${expectedCount} contacts, found ${totalContacts}`);
    }

    // CHECK 2: Required fields populated
    console.log(`${colors.cyan}📋 Check 2: Required Fields${colors.reset}`);

    const nullChecks = [
      { field: 'rank', label: 'Rank' },
      { field: 'company', label: 'Company' },
      { field: 'contact_name', label: 'Contact Name' },
      { field: 'email', label: 'Email' },
    ];

    for (const { field, label } of nullChecks) {
      const nullCount = await prisma.contact.count({
        where: {
          [field]: null,
        },
      });

      const emptyCount = await prisma.contact.count({
        where: {
          [field]: '',
        },
      });

      const totalInvalid = nullCount + emptyCount;
      const status = totalInvalid === 0 ? 'PASS' : 'FAIL';

      report.checks.push({
        name: `${label} - Not Null/Empty`,
        expected: 0,
        actual: totalInvalid,
        status,
      });

      if (status === 'PASS') {
        console.log(`${colors.green}✅ ${label}: All populated${colors.reset}`);
      } else {
        console.log(`${colors.red}❌ ${label}: ${totalInvalid} missing values${colors.reset}`);
        report.errors.push(`${label} has ${totalInvalid} missing/empty values`);
      }
    }
    console.log('');

    // CHECK 3: Unique ranks
    console.log(`${colors.cyan}🔢 Check 3: Unique Ranks${colors.reset}`);
    const distinctRanks = await prisma.contact.groupBy({
      by: ['rank'],
      _count: {
        rank: true,
      },
      having: {
        rank: {
          _count: {
            gt: 1,
          },
        },
      },
    });

    const uniqueRankCheck = {
      name: 'Unique Ranks',
      expected: 0,
      actual: distinctRanks.length,
      status: distinctRanks.length === 0 ? 'PASS' : 'FAIL',
    };
    report.checks.push(uniqueRankCheck);

    if (uniqueRankCheck.status === 'PASS') {
      console.log(`${colors.green}✅ PASS: All ranks are unique${colors.reset}\n`);
    } else {
      console.log(`${colors.red}❌ FAIL: Found ${distinctRanks.length} duplicate ranks${colors.reset}`);
      console.log(`   Duplicates: ${distinctRanks.map(r => r.rank).join(', ')}\n`);
      report.errors.push(`Found ${distinctRanks.length} duplicate ranks`);
    }

    // CHECK 4: Rank range (1-350)
    console.log(`${colors.cyan}🎯 Check 4: Rank Range (1-350)${colors.reset}`);
    const minRank = await prisma.contact.findFirst({
      orderBy: { rank: 'asc' },
      select: { rank: true },
    });
    const maxRank = await prisma.contact.findFirst({
      orderBy: { rank: 'desc' },
      select: { rank: true },
    });

    const rankRangeCheck = {
      name: 'Rank Range',
      expected: '1-350',
      actual: `${minRank?.rank}-${maxRank?.rank}`,
      status: minRank?.rank === 1 && maxRank?.rank === 350 ? 'PASS' : 'WARNING',
    };
    report.checks.push(rankRangeCheck);

    if (rankRangeCheck.status === 'PASS') {
      console.log(`${colors.green}✅ PASS: Rank range is 1-350${colors.reset}\n`);
    } else {
      console.log(`${colors.yellow}⚠️  WARNING: Rank range is ${minRank?.rank}-${maxRank?.rank}${colors.reset}\n`);
      report.warnings.push(`Rank range is ${minRank?.rank}-${maxRank?.rank}, expected 1-350`);
    }

    // CHECK 5: Optional fields statistics
    console.log(`${colors.cyan}📈 Check 5: Optional Fields Coverage${colors.reset}`);

    const optionalFields = [
      { field: 'phone', label: 'Phone' },
      { field: 'role', label: 'Role' },
      { field: 'industry', label: 'Industry' },
      { field: 'website', label: 'Website' },
      { field: 'linkedin_url', label: 'LinkedIn URL' },
      { field: 'lead_score', label: 'Lead Score' },
      { field: 'tier', label: 'Tier' },
      { field: 'deep_research', label: 'Deep Research' },
      { field: 'pain_points', label: 'Pain Points' },
      { field: 'ai_solutions', label: 'AI Solutions' },
    ];

    for (const { field, label } of optionalFields) {
      const populatedCount = await prisma.contact.count({
        where: {
          [field]: {
            not: null,
          },
        },
      });

      const percentage = ((populatedCount / totalContacts) * 100).toFixed(1);
      console.log(`   ${label}: ${populatedCount}/${totalContacts} (${percentage}%)`);

      report.checks.push({
        name: `${label} Coverage`,
        expected: 'N/A',
        actual: `${percentage}%`,
        status: 'INFO',
      });
    }
    console.log('');

    // CHECK 6: Sample data verification
    console.log(`${colors.cyan}🔎 Check 6: Sample Data${colors.reset}`);
    const sampleContacts = await prisma.contact.findMany({
      take: 3,
      orderBy: { rank: 'asc' },
      select: {
        rank: true,
        company: true,
        contact_name: true,
        email: true,
        tier: true,
        lead_score: true,
      },
    });

    console.log(`${colors.green}✅ Sample contacts (first 3):${colors.reset}`);
    sampleContacts.forEach(contact => {
      console.log(`   Rank ${contact.rank}: ${contact.contact_name} at ${contact.company}`);
      console.log(`      Email: ${contact.email} | Tier: ${contact.tier} | Score: ${contact.lead_score}`);
    });
    console.log('');

    // CHECK 7: Database stats
    console.log(`${colors.cyan}💾 Check 7: Database Statistics${colors.reset}`);
    const stats = {
      totalContacts,
      avgLeadScore: await prisma.contact.aggregate({
        _avg: { lead_score: true },
      }),
      tierDistribution: await prisma.contact.groupBy({
        by: ['tier'],
        _count: { tier: true },
      }),
      industryCount: await prisma.contact.groupBy({
        by: ['industry'],
        _count: { industry: true },
      }),
    };

    console.log(`   Total Contacts: ${stats.totalContacts}`);
    console.log(`   Avg Lead Score: ${stats.avgLeadScore._avg.lead_score?.toFixed(2) || 'N/A'}`);
    console.log(`   Unique Industries: ${stats.industryCount.length}`);
    console.log(`   Tier Distribution:`);
    stats.tierDistribution.forEach(({ tier, _count }) => {
      console.log(`      ${tier || 'NULL'}: ${_count.tier}`);
    });
    console.log('');

    // FINAL REPORT SUMMARY
    console.log('='.repeat(60));
    console.log(`${colors.bright}📊 VALIDATION SUMMARY${colors.reset}`);
    console.log('='.repeat(60));

    const passCount = report.checks.filter(c => c.status === 'PASS').length;
    const failCount = report.checks.filter(c => c.status === 'FAIL').length;
    const warnCount = report.checks.filter(c => c.status === 'WARNING').length;

    console.log(`${colors.green}✅ Passed: ${passCount}${colors.reset}`);
    console.log(`${colors.red}❌ Failed: ${failCount}${colors.reset}`);
    console.log(`${colors.yellow}⚠️  Warnings: ${warnCount}${colors.reset}`);
    console.log('='.repeat(60) + '\n');

    if (failCount === 0) {
      console.log(`${colors.green}${colors.bright}🎉 VALIDATION PASSED! Import is successful and data integrity verified.${colors.reset}\n`);
    } else {
      console.log(`${colors.red}⚠️  VALIDATION FAILED with ${failCount} errors:${colors.reset}`);
      report.errors.forEach(error => console.log(`   - ${error}`));
      console.log('');
    }

    // Save report to file
    const reportPath = path.join(__dirname, 'validation-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    console.log(`${colors.cyan}📄 Full report saved to: ${reportPath}${colors.reset}\n`);

    return report;

  } catch (error) {
    console.error(`\n${colors.red}💥 VALIDATION ERROR:${colors.reset}`, error.message);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Execute
if (require.main === module) {
  validateImport()
    .then(() => {
      process.exit(0);
    })
    .catch(() => {
      process.exit(1);
    });
}

module.exports = { validateImport };
