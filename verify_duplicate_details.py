#!/usr/bin/env python3
"""
Detailed analysis of duplicate entries to determine if they're intentional variations
"""

import csv
from collections import defaultdict

CSV_FILE = "/home/user/Marketing/plexus_outreach_master_v6.csv"

def main():
    print("=" * 80)
    print("DUPLICATE ENTRIES - DETAILED ANALYSIS")
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
                'email_subject': row.get('Email_Subject', '').strip(),
                'linkedin_message': row.get('LinkedIn_Message', '').strip()[:100],  # First 100 chars
                'status': row.get('Status', '').strip(),
            })

    # Find duplicate emails and analyze their variations
    email_map = defaultdict(list)
    for rec in csv_records:
        if rec['email']:
            email_map[rec['email'].lower()].append(rec)

    duplicate_emails = {k: v for k, v in email_map.items() if len(v) > 1}

    print("Analyzing duplicate email entries for messaging variations...")
    print()

    same_message_count = 0
    different_message_count = 0

    for email, records in sorted(duplicate_emails.items())[:10]:
        print(f"Email: {email}")
        print(f"Contact: {records[0]['contact_name']} at {records[0]['company']}")
        print(f"Appears {len(records)} times:")
        print()

        # Check if messages are different
        subjects = set(rec['email_subject'] for rec in records if rec['email_subject'])
        if len(subjects) > 1:
            different_message_count += 1
            print("  ✓ DIFFERENT MESSAGING APPROACHES:")
            for i, rec in enumerate(records, 1):
                print(f"    Rank {rec['rank']:3d}: \"{rec['email_subject']}\"")
        else:
            same_message_count += 1
            print("  ⚠️  IDENTICAL MESSAGING:")
            for i, rec in enumerate(records, 1):
                print(f"    Rank {rec['rank']:3d}: \"{rec['email_subject']}\"")
        print()

    if len(duplicate_emails) > 10:
        print(f"... and {len(duplicate_emails) - 10} more duplicate emails not shown")
        print()

    print("=" * 80)
    print("DUPLICATE ANALYSIS SUMMARY")
    print("=" * 80)
    print()

    # Count all duplicates
    total_same = 0
    total_different = 0

    for email, records in duplicate_emails.items():
        subjects = set(rec['email_subject'] for rec in records if rec['email_subject'])
        if len(subjects) > 1:
            total_different += 1
        else:
            total_same += 1

    print(f"Total duplicate emails: {len(duplicate_emails)}")
    print(f"  - With different messaging: {total_different} ({total_different/len(duplicate_emails)*100:.1f}%)")
    print(f"  - With identical messaging: {total_same} ({total_same/len(duplicate_emails)*100:.1f}%)")
    print()

    if total_different > 0:
        print("✓ Most duplicates appear to be intentional multiple outreach approaches")
        print("  (same contact, different messaging strategies)")
    if total_same > 0:
        print(f"⚠️  {total_same} duplicate entries have identical messaging")
        print("  (may be unintentional duplicates)")
    print()

    # Show specific example of different messaging
    print("=" * 80)
    print("EXAMPLE: Multiple Messaging Approaches to Same Contact")
    print("=" * 80)
    print()

    # Find a good example
    for email, records in duplicate_emails.items():
        subjects = set(rec['email_subject'] for rec in records if rec['email_subject'])
        if len(subjects) > 1:
            print(f"Contact: {records[0]['contact_name']}")
            print(f"Email: {email}")
            print(f"Company: {records[0]['company']}")
            print(f"Number of outreach attempts: {len(records)}")
            print()
            print("Different messaging approaches:")
            for i, rec in enumerate(records, 1):
                print(f"\nApproach {i} (Rank {rec['rank']}):")
                print(f"  Subject: {rec['email_subject']}")
            break

if __name__ == "__main__":
    main()
