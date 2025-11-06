#!/usr/bin/env python3
"""
Detailed filename and data verification for Bespoke Ethos CRM
"""

import csv
import os
import re
from pathlib import Path

CSV_FILE = "/home/user/Marketing/plexus_outreach_master_v6.csv"
PROFILES_DIR = "/home/user/Marketing/contact_profiles"

def normalize_for_filename(name):
    """Normalize company name as it would appear in filename"""
    # Replace common separators
    name = re.sub(r'[/\\]', '_', name)
    # Replace & with and (sometimes)
    name = re.sub(r'\s*&\s*', '_', name)
    # Replace spaces with underscores
    name = re.sub(r'\s+', '_', name)
    # Remove special characters
    name = re.sub(r'[^\w\-_]', '', name)
    # Remove multiple underscores
    name = re.sub(r'_+', '_', name)
    return name

def main():
    print("=" * 80)
    print("FILENAME CONSISTENCY VERIFICATION")
    print("=" * 80)
    print()

    # Parse CSV
    csv_records = {}
    with open(CSV_FILE, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            rank = int(row['Rank'])
            csv_records[rank] = {
                'rank': rank,
                'company': row.get('Company', '').strip(),
                'contact_name': row.get('Contact_Name', '').strip(),
                'email': row.get('Email', '').strip(),
            }

    # Get all profile files
    profile_files = {}
    for filepath in Path(PROFILES_DIR).glob("*.txt"):
        filename = filepath.name
        # Extract rank from filename
        match = re.match(r'(\d+)_(.+)\.txt', filename)
        if match:
            rank = int(match.group(1))
            company_from_filename = match.group(2)
            profile_files[rank] = {
                'filename': filename,
                'company_from_filename': company_from_filename
            }

    print("Checking filename format consistency...")
    print()

    filename_mismatches = []

    for rank in sorted(csv_records.keys()):
        csv_company = csv_records[rank]['company']

        if rank not in profile_files:
            filename_mismatches.append({
                'rank': rank,
                'issue': 'File missing',
                'csv_company': csv_company
            })
            continue

        file_company = profile_files[rank]['company_from_filename']

        # Normalize both for comparison
        csv_normalized = normalize_for_filename(csv_company).lower()
        file_normalized = file_company.replace('_', '').replace('-', '').lower()
        csv_compare = csv_normalized.replace('_', '').replace('-', '')

        # Check if they match (allowing for some variation)
        if csv_compare not in file_normalized and file_normalized not in csv_compare:
            # Check if it's close enough (e.g., abbreviations)
            similarity = similar_enough(csv_normalized, file_company)
            if not similarity:
                filename_mismatches.append({
                    'rank': rank,
                    'issue': 'Company name mismatch',
                    'csv_company': csv_company,
                    'filename': profile_files[rank]['filename'],
                    'file_company': file_company
                })

    if filename_mismatches:
        print(f"⚠️  Filename inconsistencies found: {len(filename_mismatches)}")
        print()
        for item in filename_mismatches[:30]:
            print(f"Rank {item['rank']:3d}:")
            print(f"  CSV Company: {item['csv_company']}")
            if 'filename' in item:
                print(f"  Filename:    {item['filename']}")
                print(f"  File Company: {item['file_company']}")
            else:
                print(f"  Issue: {item['issue']}")
            print()
        if len(filename_mismatches) > 30:
            print(f"... and {len(filename_mismatches) - 30} more")
    else:
        print("✓ All filenames match CSV company names appropriately")

    print()
    print("=" * 80)
    print("SAMPLING RANDOM RECORDS FOR DETAILED VERIFICATION")
    print("=" * 80)
    print()

    # Sample a few records for detailed check
    sample_ranks = [1, 50, 100, 150, 200, 250, 300, 350]

    for rank in sample_ranks:
        if rank in csv_records:
            rec = csv_records[rank]
            print(f"Rank {rank}:")
            print(f"  Company: {rec['company']}")
            print(f"  Contact: {rec['contact_name']}")
            print(f"  Email:   {rec['email']}")
            if rank in profile_files:
                print(f"  File:    {profile_files[rank]['filename']}")
            print()

def similar_enough(csv_name, file_name):
    """Check if names are similar enough (handles abbreviations, etc.)"""
    csv_clean = csv_name.replace('_', '').replace('-', '').lower()
    file_clean = file_name.replace('_', '').replace('-', '').lower()

    # Check if one is substring of other (handles abbreviations)
    if csv_clean in file_clean or file_clean in csv_clean:
        return True

    # Check if they share significant portion
    if len(csv_clean) > 5 and len(file_clean) > 5:
        min_len = min(len(csv_clean), len(file_clean))
        if csv_clean[:min_len//2] == file_clean[:min_len//2]:
            return True

    return False

if __name__ == "__main__":
    main()
