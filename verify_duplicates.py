#!/usr/bin/env python3
"""
Check for duplicate contacts and companies in the CRM data
"""

import csv
from collections import defaultdict

CSV_FILE = "/home/user/Marketing/plexus_outreach_master_v6.csv"

def main():
    print("=" * 80)
    print("DUPLICATE DETECTION ANALYSIS")
    print("=" * 80)
    print()

    csv_records = []
    with open(CSV_FILE, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            csv_records.append({
                'rank': int(row['Rank']),
                'company': row.get('Company', '').strip(),
                'contact_name': row.get('Contact_Name', '').strip(),
                'email': row.get('Email', '').strip(),
                'tier': row.get('Tier', '').strip(),
            })

    # Check for duplicate emails
    print("Checking for duplicate email addresses...")
    email_map = defaultdict(list)
    for rec in csv_records:
        if rec['email']:
            email_map[rec['email'].lower()].append(rec)

    duplicate_emails = {k: v for k, v in email_map.items() if len(v) > 1}

    if duplicate_emails:
        print(f"⚠️  Duplicate emails found: {len(duplicate_emails)}")
        print()
        for email, records in sorted(duplicate_emails.items())[:10]:
            print(f"Email: {email}")
            for rec in records:
                print(f"  - Rank {rec['rank']}: {rec['contact_name']} at {rec['company']}")
            print()
        if len(duplicate_emails) > 10:
            print(f"... and {len(duplicate_emails) - 10} more duplicate emails")
    else:
        print("✓ No duplicate email addresses found")
    print()

    # Check for duplicate contact names
    print("Checking for duplicate contact names...")
    name_map = defaultdict(list)
    for rec in csv_records:
        if rec['contact_name']:
            name_map[rec['contact_name'].lower()].append(rec)

    duplicate_names = {k: v for k, v in name_map.items() if len(v) > 1}

    if duplicate_names:
        print(f"⚠️  Duplicate contact names found: {len(duplicate_names)}")
        print()
        for name, records in sorted(duplicate_names.items())[:10]:
            print(f"Name: {name.title()}")
            for rec in records:
                print(f"  - Rank {rec['rank']}: {rec['email']} at {rec['company']}")
            print()
        if len(duplicate_names) > 10:
            print(f"... and {len(duplicate_names) - 10} more duplicate names")
    else:
        print("✓ No duplicate contact names found")
    print()

    # Check company distribution
    print("=" * 80)
    print("COMPANY DISTRIBUTION ANALYSIS")
    print("=" * 80)
    print()

    company_map = defaultdict(list)
    for rec in csv_records:
        if rec['company']:
            company_map[rec['company']].append(rec)

    # Show companies with multiple contacts
    multi_contact_companies = {k: v for k, v in company_map.items() if len(v) > 1}

    if multi_contact_companies:
        print(f"Companies with multiple contacts: {len(multi_contact_companies)}")
        print()

        # Sort by number of contacts
        sorted_companies = sorted(multi_contact_companies.items(), key=lambda x: len(x[1]), reverse=True)

        print("Top companies by contact count:")
        for company, records in sorted_companies[:20]:
            tier = records[0]['tier']
            ranks = [rec['rank'] for rec in records]
            print(f"  {company:50s} [{tier}]: {len(records):2d} contacts (ranks: {min(ranks)}-{max(ranks)})")

        print()
        print(f"Total unique companies: {len(company_map)}")
        print(f"Total contacts: {len(csv_records)}")
        print(f"Average contacts per company: {len(csv_records) / len(company_map):.2f}")
    else:
        print("All contacts are from different companies (1:1 mapping)")

    print()

    # Check tier balance
    print("=" * 80)
    print("DETAILED TIER ANALYSIS")
    print("=" * 80)
    print()

    tier_map = defaultdict(list)
    for rec in csv_records:
        tier_map[rec['tier']].append(rec)

    for tier in sorted(tier_map.keys()):
        contacts = tier_map[tier]
        print(f"{tier}:")
        print(f"  Total contacts: {len(contacts)}")

        # Company diversity in this tier
        companies = set(rec['company'] for rec in contacts)
        print(f"  Unique companies: {len(companies)}")
        print(f"  Contacts per company: {len(contacts) / len(companies):.2f}")
        print()

if __name__ == "__main__":
    main()
