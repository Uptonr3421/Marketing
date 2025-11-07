#!/usr/bin/env python3
"""
Analyze plexus_contacts CSV to find all remaining incomplete name entries
"""
import csv
import re

def is_incomplete_name(name):
    """Check if a name appears incomplete or placeholder-like"""
    if not name or name.strip() == '':
        return True

    name = name.strip()

    # Check if it's very short (1-2 letters) - but allow common titles/initials in context
    if len(name) <= 2:
        return True

    # Check if it looks like a placeholder
    placeholder_patterns = [
        r'^[A-Z]$',  # Single capital letter
        r'^[A-Z]{1,2}$',  # 1-2 capital letters only
        r'^\d+$',  # Just numbers
        r'^(test|temp|placeholder|unknown|tbd|n/a|na)$',  # Common placeholders
    ]

    for pattern in placeholder_patterns:
        if re.match(pattern, name, re.IGNORECASE):
            return True

    # Check if it looks like abbreviated/incomplete (e.g., "aV" or "Ch")
    if len(name) <= 3 and name[0].islower():
        return True

    return False

def extract_name_from_email(email):
    """Try to extract a name from email address"""
    if not email or '@' not in email:
        return None, None

    local_part = email.split('@')[0]

    # Remove common prefixes/suffixes
    local_part = re.sub(r'^(info|contact|admin|hello|mail|support)', '', local_part, flags=re.IGNORECASE)

    # Try to split on common separators
    parts = re.split(r'[._\-\d]', local_part)
    parts = [p for p in parts if p and len(p) > 1]

    if len(parts) >= 2:
        first_name = parts[0].capitalize()
        last_name = parts[1].capitalize()
        return first_name, last_name
    elif len(parts) == 1 and len(parts[0]) > 2:
        # Single name in email - might be full name or just one part
        return parts[0].capitalize(), None

    return None, None

def analyze_csv(filename):
    """Analyze CSV and find all incomplete entries"""
    incomplete_entries = []

    with open(filename, 'r', encoding='utf-8') as f:
        reader = csv.reader(f)
        header = next(reader)

        print(f"Header: {header}")
        print("=" * 80)

        for line_num, row in enumerate(reader, start=2):  # Start at 2 (header is line 1)
            if len(row) < 4:
                continue

            company = row[0] if len(row) > 0 else ''
            title = row[1] if len(row) > 1 else ''
            first_name = row[2] if len(row) > 2 else ''
            last_name = row[3] if len(row) > 3 else ''
            email = row[4] if len(row) > 4 else ''

            # Check if either first or last name is incomplete
            first_incomplete = is_incomplete_name(first_name)
            last_incomplete = is_incomplete_name(last_name)

            if first_incomplete or last_incomplete:
                # Try to infer name from email
                inferred_first, inferred_last = extract_name_from_email(email)

                incomplete_entries.append({
                    'line_num': line_num,
                    'company': company,
                    'title': title,
                    'first_name': first_name,
                    'last_name': last_name,
                    'email': email,
                    'first_incomplete': first_incomplete,
                    'last_incomplete': last_incomplete,
                    'inferred_first': inferred_first,
                    'inferred_last': inferred_last,
                    'full_row': row
                })

    return incomplete_entries

if __name__ == '__main__':
    filename = '/home/user/Marketing/plexus_contacts - Sheet1.csv'

    print("Analyzing CSV for incomplete name entries...")
    print("=" * 80)

    incomplete = analyze_csv(filename)

    print(f"\nFound {len(incomplete)} incomplete entries:")
    print("=" * 80)

    for i, entry in enumerate(incomplete, 1):
        print(f"\n{i}. Line {entry['line_num']}:")
        print(f"   Company: {entry['company']}")
        print(f"   Current: [{entry['title']}] {entry['first_name']} {entry['last_name']}")
        print(f"   Email: {entry['email']}")

        if entry['inferred_first'] or entry['inferred_last']:
            print(f"   Inferred: {entry['inferred_first']} {entry['inferred_last']}")
        else:
            print(f"   ⚠ Could not infer name from email")

        print(f"   Issues: First={'Incomplete' if entry['first_incomplete'] else 'OK'}, "
              f"Last={'Incomplete' if entry['last_incomplete'] else 'OK'}")
