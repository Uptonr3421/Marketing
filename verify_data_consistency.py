#!/usr/bin/env python3
"""
Data Consistency Verification Script for Bespoke Ethos CRM
Compares plexus_outreach_master_v6.csv with individual contact profile files
"""

import csv
import os
import re
from collections import defaultdict
from pathlib import Path

# Paths
CSV_FILE = "/home/user/Marketing/plexus_outreach_master_v6.csv"
PROFILES_DIR = "/home/user/Marketing/contact_profiles"

def parse_contact_profile(filepath):
    """Parse a contact profile .txt file and extract key fields"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()

        profile = {}

        # Extract profile number from first line
        match = re.search(r'CONTACT PROFILE #(\d+)', content)
        if match:
            profile['rank'] = int(match.group(1))

        # Extract fields from BASIC INFO section
        profile['company'] = extract_field(content, r'Company:\s*(.+?)(?:\n|$)')
        profile['contact_name'] = extract_field(content, r'Contact:\s*(.+?)(?:\n|$)')
        profile['email'] = extract_field(content, r'Email:\s*(.+?)(?:\n|$)')
        profile['phone'] = extract_field(content, r'Phone:\s*(.+?)(?:\n|$)')
        profile['role'] = extract_field(content, r'Role:\s*(.+?)(?:\n|$)')
        profile['linkedin'] = extract_field(content, r'LinkedIn:\s*(.+?)(?:\n|$)')
        profile['website'] = extract_field(content, r'Website:\s*(.+?)(?:\n|$)')
        profile['industry'] = extract_field(content, r'Industry:\s*(.+?)(?:\n|$)')
        profile['tier'] = extract_field(content, r'Tier:\s*(.+?)(?:\n|$)')
        profile['lead_score'] = extract_field(content, r'Lead Score:\s*(.+?)(?:\n|$)')

        # Extract email subject
        profile['email_subject'] = extract_field(content, r'Email Subject:\s*(.+?)(?:\n|$)')

        # Extract best send time
        profile['best_send_time'] = extract_field(content, r'BEST SEND TIME:\s*(.+?)(?:\n|$)')

        # Extract status
        profile['status'] = extract_field(content, r'STATUS:\s*(.+?)(?:\n|$)')

        profile['filename'] = os.path.basename(filepath)

        return profile
    except Exception as e:
        return {'error': str(e), 'filename': os.path.basename(filepath)}

def extract_field(content, pattern):
    """Extract a field using regex pattern"""
    match = re.search(pattern, content, re.MULTILINE)
    if match:
        value = match.group(1).strip()
        if value.lower() in ['not specified', 'nan', '']:
            return None
        return value
    return None

def normalize_company_name(name):
    """Normalize company names for comparison"""
    if not name:
        return ""
    # Remove special characters and extra whitespace
    name = re.sub(r'[_\-&]+', ' ', name)
    name = re.sub(r'\s+', ' ', name)
    return name.strip().lower()

def normalize_email(email):
    """Normalize email for comparison"""
    if not email:
        return ""
    return email.strip().lower()

def validate_email(email):
    """Check if email format is valid"""
    if not email:
        return False
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return bool(re.match(pattern, email))

def validate_linkedin_url(url):
    """Check if LinkedIn URL format is valid"""
    if not url:
        return False
    if url.lower() in ['nan', 'not specified']:
        return False
    return bool(re.match(r'^https?://(www\.)?linkedin\.com/', url))

def parse_csv():
    """Parse the CSV file"""
    csv_records = {}
    errors = []

    try:
        with open(CSV_FILE, 'r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            for row in reader:
                try:
                    rank = int(row['Rank'])
                    csv_records[rank] = {
                        'rank': rank,
                        'company': row.get('Company', '').strip(),
                        'contact_name': row.get('Contact_Name', '').strip(),
                        'email': row.get('Email', '').strip(),
                        'phone': row.get('Phone', '').strip(),
                        'role': row.get('Role', '').strip(),
                        'industry': row.get('Industry', '').strip(),
                        'tier': row.get('Tier', '').strip(),
                        'linkedin': row.get('LinkedIn', '').strip(),
                        'website': row.get('Website', '').strip(),
                        'lead_score': row.get('Lead_Score', '').strip(),
                        'email_subject': row.get('Email_Subject', '').strip(),
                        'best_send_day': row.get('Best_Send_Day', '').strip(),
                        'best_send_time': row.get('Best_Send_Time', '').strip(),
                        'status': row.get('Status', '').strip(),
                    }
                except (ValueError, KeyError) as e:
                    errors.append(f"Error parsing CSV row: {e}")
    except Exception as e:
        errors.append(f"Error reading CSV file: {e}")

    return csv_records, errors

def main():
    print("=" * 80)
    print("BESPOKE ETHOS CRM - DATA CONSISTENCY VERIFICATION REPORT")
    print("=" * 80)
    print()

    # Parse CSV
    print("Step 1: Parsing CSV file...")
    csv_records, csv_errors = parse_csv()
    print(f"  - CSV records parsed: {len(csv_records)}")
    if csv_errors:
        print(f"  - CSV parsing errors: {len(csv_errors)}")
        for error in csv_errors[:5]:  # Show first 5 errors
            print(f"    • {error}")
    print()

    # Parse contact profile files
    print("Step 2: Parsing contact profile files...")
    profile_files = sorted(Path(PROFILES_DIR).glob("*.txt"))
    print(f"  - Profile files found: {len(profile_files)}")

    profile_records = {}
    profile_errors = []

    for filepath in profile_files:
        profile = parse_contact_profile(filepath)
        if 'error' in profile:
            profile_errors.append(f"{profile['filename']}: {profile['error']}")
        elif 'rank' in profile:
            profile_records[profile['rank']] = profile
        else:
            profile_errors.append(f"{profile['filename']}: Could not extract rank")

    print(f"  - Profile records parsed: {len(profile_records)}")
    if profile_errors:
        print(f"  - Profile parsing errors: {len(profile_errors)}")
    print()

    # Verify rank coverage
    print("=" * 80)
    print("RANK COVERAGE ANALYSIS")
    print("=" * 80)
    print()

    csv_ranks = set(csv_records.keys())
    profile_ranks = set(profile_records.keys())
    expected_ranks = set(range(1, 351))

    print(f"Expected ranks: 1-350 ({len(expected_ranks)} total)")
    print(f"CSV ranks present: {len(csv_ranks)}")
    print(f"Profile ranks present: {len(profile_ranks)}")
    print()

    # Missing ranks
    missing_in_csv = expected_ranks - csv_ranks
    missing_in_profiles = expected_ranks - profile_ranks

    if missing_in_csv:
        print(f"⚠️  Ranks missing in CSV ({len(missing_in_csv)}):")
        print(f"   {sorted(missing_in_csv)}")
        print()
    else:
        print("✓ All ranks 1-350 present in CSV")
        print()

    if missing_in_profiles:
        print(f"⚠️  Ranks missing in profile files ({len(missing_in_profiles)}):")
        print(f"   {sorted(missing_in_profiles)}")
        print()
    else:
        print("✓ All ranks 1-350 present in profile files")
        print()

    # Extra ranks
    extra_in_csv = csv_ranks - expected_ranks
    extra_in_profiles = profile_ranks - expected_ranks

    if extra_in_csv:
        print(f"⚠️  Extra ranks in CSV: {sorted(extra_in_csv)}")
        print()

    if extra_in_profiles:
        print(f"⚠️  Extra ranks in profiles: {sorted(extra_in_profiles)}")
        print()

    # Data consistency check
    print("=" * 80)
    print("DATA CONSISTENCY ANALYSIS")
    print("=" * 80)
    print()

    mismatches = []
    common_ranks = csv_ranks & profile_ranks

    for rank in sorted(common_ranks):
        csv_rec = csv_records[rank]
        prof_rec = profile_records[rank]

        issues = []

        # Compare company names
        csv_company = normalize_company_name(csv_rec['company'])
        prof_company = normalize_company_name(prof_rec['company'])
        if csv_company != prof_company and csv_company and prof_company:
            issues.append(f"Company: CSV='{csv_rec['company']}' vs File='{prof_rec['company']}'")

        # Compare emails
        csv_email = normalize_email(csv_rec['email'])
        prof_email = normalize_email(prof_rec['email'])
        if csv_email != prof_email and csv_email and prof_email:
            issues.append(f"Email: CSV='{csv_rec['email']}' vs File='{prof_rec['email']}'")

        # Compare contact names
        if csv_rec['contact_name'] != prof_rec['contact_name'] and csv_rec['contact_name'] and prof_rec['contact_name']:
            issues.append(f"Name: CSV='{csv_rec['contact_name']}' vs File='{prof_rec['contact_name']}'")

        # Compare tier
        if csv_rec['tier'] != prof_rec['tier'] and prof_rec['tier']:
            issues.append(f"Tier: CSV='{csv_rec['tier']}' vs File='{prof_rec['tier']}'")

        # Compare lead score
        csv_score = csv_rec['lead_score'].strip() if csv_rec['lead_score'] else ''
        prof_score = prof_rec['lead_score'].strip() if prof_rec['lead_score'] else ''
        if csv_score != prof_score and prof_score:
            issues.append(f"Lead Score: CSV='{csv_score}' vs File='{prof_score}'")

        if issues:
            mismatches.append({
                'rank': rank,
                'issues': issues
            })

    if mismatches:
        print(f"⚠️  Data mismatches found: {len(mismatches)}")
        print()
        for mismatch in mismatches[:20]:  # Show first 20
            print(f"Rank {mismatch['rank']}:")
            for issue in mismatch['issues']:
                print(f"  • {issue}")
            print()
        if len(mismatches) > 20:
            print(f"... and {len(mismatches) - 20} more mismatches")
            print()
    else:
        print("✓ No data mismatches found in common records")
        print()

    # Data completeness check
    print("=" * 80)
    print("CSV DATA COMPLETENESS ANALYSIS")
    print("=" * 80)
    print()

    required_fields = ['company', 'contact_name', 'email', 'role', 'industry', 'tier', 'lead_score']
    field_stats = defaultdict(lambda: {'filled': 0, 'empty': 0})

    invalid_emails = []
    invalid_linkedin = []

    for rank, rec in csv_records.items():
        for field in required_fields:
            value = rec.get(field, '').strip()
            if value and value.lower() not in ['nan', 'not specified']:
                field_stats[field]['filled'] += 1
            else:
                field_stats[field]['empty'] += 1

        # Validate email format
        if rec['email']:
            if not validate_email(rec['email']):
                invalid_emails.append(f"Rank {rank}: {rec['email']}")

        # Validate LinkedIn URL format
        if rec['linkedin'] and rec['linkedin'].lower() not in ['nan', '']:
            if not validate_linkedin_url(rec['linkedin']):
                invalid_linkedin.append(f"Rank {rank}: {rec['linkedin']}")

    total_records = len(csv_records)

    print("Field completeness:")
    for field in required_fields:
        filled = field_stats[field]['filled']
        empty = field_stats[field]['empty']
        pct = (filled / total_records * 100) if total_records > 0 else 0
        status = "✓" if pct >= 95 else "⚠️"
        print(f"  {status} {field:20s}: {filled:3d}/{total_records} ({pct:.1f}% complete)")
    print()

    if invalid_emails:
        print(f"⚠️  Invalid email formats found: {len(invalid_emails)}")
        for email in invalid_emails[:10]:
            print(f"   {email}")
        if len(invalid_emails) > 10:
            print(f"   ... and {len(invalid_emails) - 10} more")
        print()
    else:
        print("✓ All email addresses have valid format")
        print()

    if invalid_linkedin:
        print(f"⚠️  Invalid LinkedIn URLs found: {len(invalid_linkedin)}")
        for url in invalid_linkedin[:10]:
            print(f"   {url}")
        if len(invalid_linkedin) > 10:
            print(f"   ... and {len(invalid_linkedin) - 10} more")
        print()
    else:
        print("✓ All LinkedIn URLs have valid format")
        print()

    # Tier distribution
    print("=" * 80)
    print("TIER DISTRIBUTION ANALYSIS")
    print("=" * 80)
    print()

    tier_counts = defaultdict(int)
    for rec in csv_records.values():
        tier = rec['tier'].strip()
        if tier:
            tier_counts[tier] += 1
        else:
            tier_counts['(empty)'] += 1

    print("Tier assignments:")
    for tier in sorted(tier_counts.keys()):
        count = tier_counts[tier]
        pct = (count / total_records * 100) if total_records > 0 else 0
        print(f"  {tier:30s}: {count:3d} ({pct:.1f}%)")
    print()

    # Summary score
    print("=" * 80)
    print("OVERALL DATA QUALITY SCORE")
    print("=" * 80)
    print()

    score_components = []

    # Rank completeness (30%)
    rank_completeness = (len(csv_ranks & expected_ranks) / 350) * 100
    score_components.append(('Rank completeness (CSV)', rank_completeness * 0.15))
    rank_completeness_prof = (len(profile_ranks & expected_ranks) / 350) * 100
    score_components.append(('Rank completeness (Files)', rank_completeness_prof * 0.15))

    # Data consistency (30%)
    consistency_score = ((len(common_ranks) - len(mismatches)) / len(common_ranks) * 100) if common_ranks else 0
    score_components.append(('Data consistency', consistency_score * 0.30))

    # Field completeness (40%)
    avg_completeness = sum(field_stats[f]['filled'] / total_records * 100 for f in required_fields) / len(required_fields) if total_records > 0 else 0
    score_components.append(('Field completeness', avg_completeness * 0.40))

    total_score = sum(score[1] for score in score_components)

    for component, score in score_components:
        print(f"  {component:30s}: {score:.1f} points")
    print()
    print(f"  {'TOTAL SCORE':30s}: {total_score:.1f}/100")
    print()

    if total_score >= 90:
        print("  Rating: EXCELLENT ✓")
    elif total_score >= 80:
        print("  Rating: GOOD")
    elif total_score >= 70:
        print("  Rating: FAIR ⚠️")
    else:
        print("  Rating: NEEDS IMPROVEMENT ⚠️")
    print()

    # Corrections needed
    print("=" * 80)
    print("CORRECTIONS NEEDED")
    print("=" * 80)
    print()

    corrections = []

    if missing_in_csv:
        corrections.append(f"• Add {len(missing_in_csv)} missing ranks to CSV: {sorted(missing_in_csv)}")

    if missing_in_profiles:
        corrections.append(f"• Create {len(missing_in_profiles)} missing profile files for ranks: {sorted(missing_in_profiles)}")

    if mismatches:
        corrections.append(f"• Resolve {len(mismatches)} data mismatches between CSV and profile files")

    if invalid_emails:
        corrections.append(f"• Fix {len(invalid_emails)} invalid email formats")

    if invalid_linkedin:
        corrections.append(f"• Fix {len(invalid_linkedin)} invalid LinkedIn URL formats")

    for field in required_fields:
        empty_count = field_stats[field]['empty']
        if empty_count > 0:
            pct = (empty_count / total_records * 100) if total_records > 0 else 0
            if pct > 5:  # Only report if more than 5% empty
                corrections.append(f"• Fill {empty_count} empty '{field}' values ({pct:.1f}% incomplete)")

    if corrections:
        for correction in corrections:
            print(correction)
    else:
        print("✓ No corrections needed - data is consistent and complete!")

    print()
    print("=" * 80)
    print("END OF REPORT")
    print("=" * 80)

if __name__ == "__main__":
    main()
