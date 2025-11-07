#!/usr/bin/env python3
"""
Fix all remaining incomplete name entries in plexus_contacts CSV
"""
import csv
import re
from typing import Tuple, Optional

def is_incomplete_name(name: str) -> bool:
    """Check if a name appears incomplete or placeholder-like"""
    if not name or name.strip() == '':
        return True

    name = name.strip()

    # Check if it's very short (1-2 letters) but not common initials
    if len(name) <= 2 and name not in ['Ed', 'Ty', 'Jo', 'Al', 'Bo']:
        return True

    # Check if it looks like a title (Dr., Mr., Ms., etc.)
    if re.match(r'^(Dr|Mr|Ms|Mrs|Prof)\.?$', name, re.IGNORECASE):
        return True

    # Check if it's a location/company name appearing as a person name
    location_patterns = [
        r'^(Akron|Cleveland|Columbus|Public|Private|Ohio)$',
    ]
    for pattern in location_patterns:
        if re.match(pattern, name, re.IGNORECASE):
            return True

    # Check if it looks like a placeholder
    placeholder_patterns = [
        r'^[A-Z]$',  # Single capital letter
        r'^[A-Z]{1,2}\.?$',  # 1-2 capital letters with optional period
        r'^\d+$',  # Just numbers
        r'^(test|temp|placeholder|unknown|tbd|n/a|na)$',  # Common placeholders
    ]

    for pattern in placeholder_patterns:
        if re.match(pattern, name, re.IGNORECASE):
            return True

    # Check if it looks like abbreviated (e.g., "de", "aV")
    if len(name) <= 3 and (name[0].islower() or name == 'de'):
        return True

    return False

def extract_name_from_email(email: str) -> Tuple[Optional[str], Optional[str]]:
    """Try to extract a name from email address"""
    if not email or '@' not in email:
        return None, None

    local_part = email.split('@')[0]

    # Skip generic emails
    generic_patterns = [
        r'^(info|contact|admin|hello|mail|support|accounting|programs|personnel|comms|orep|chair|editor|president|college)$'
    ]
    for pattern in generic_patterns:
        if re.match(pattern, local_part, re.IGNORECASE):
            return None, None

    # Handle patterns like "aVukoder" - lowercase first letter followed by capital
    match = re.match(r'^([a-z])([A-Z][a-z]+)$', local_part)
    if match:
        # Treat the lowercase letter as first initial
        first_initial = match.group(1).upper()
        last_name = match.group(2)
        return f"{first_initial}.", last_name

    # Handle firstname.lastname or firstname_lastname
    parts = re.split(r'[._\-]', local_part)
    # Remove numbers and short parts
    parts = [p for p in parts if p and len(p) > 1 and not p.isdigit()]

    if len(parts) >= 2:
        first_name = parts[0].capitalize()
        last_name = parts[1].capitalize()
        return first_name, last_name
    elif len(parts) == 1 and len(parts[0]) > 2:
        # Single name in email - check if it looks like a username
        name = parts[0]
        # If it starts with a letter and looks like a name, use it
        if re.match(r'^[a-zA-Z][a-zA-Z]+$', name):
            return name.capitalize(), None

    return None, None

def fix_csv(input_file: str, output_file: str):
    """Read CSV, fix incomplete names, and write to output file"""

    fixes_made = []
    could_not_fix = []

    rows = []

    with open(input_file, 'r', encoding='utf-8') as f:
        reader = csv.reader(f)
        header = next(reader)
        rows.append(header)

        for line_num, row in enumerate(reader, start=2):
            if len(row) < 3:
                rows.append(row)
                continue

            company = row[0] if len(row) > 0 else ''
            first_name = row[1] if len(row) > 1 else ''
            last_name = row[2] if len(row) > 2 else ''
            email = row[3] if len(row) > 3 else ''

            # Check if either first or last name is incomplete
            first_incomplete = is_incomplete_name(first_name)
            last_incomplete = is_incomplete_name(last_name)

            if first_incomplete or last_incomplete:
                # Try to infer name from email
                inferred_first, inferred_last = extract_name_from_email(email)

                old_first = first_name
                old_last = last_name

                # Apply fixes
                if inferred_first and inferred_last:
                    # We have both names from email
                    first_name = inferred_first
                    last_name = inferred_last
                    fixes_made.append({
                        'line': line_num,
                        'company': company,
                        'old': f"{old_first} {old_last}",
                        'new': f"{first_name} {last_name}",
                        'email': email
                    })
                elif inferred_first and not first_incomplete:
                    # Keep original first, use inferred as last
                    last_name = inferred_first
                    fixes_made.append({
                        'line': line_num,
                        'company': company,
                        'old': f"{old_first} {old_last}",
                        'new': f"{first_name} {last_name}",
                        'email': email
                    })
                elif inferred_last and first_incomplete:
                    # Use current name as first, inferred as last
                    if not is_incomplete_name(old_last):
                        first_name = old_last
                        last_name = inferred_last
                        fixes_made.append({
                            'line': line_num,
                            'company': company,
                            'old': f"{old_first} {old_last}",
                            'new': f"{first_name} {last_name}",
                            'email': email
                        })
                    else:
                        # Could not fix
                        could_not_fix.append({
                            'line': line_num,
                            'company': company,
                            'current': f"{old_first} {old_last}",
                            'email': email,
                            'reason': 'Both names incomplete, only got last name from email'
                        })
                else:
                    # Could not infer anything useful
                    could_not_fix.append({
                        'line': line_num,
                        'company': company,
                        'current': f"{old_first} {old_last}",
                        'email': email,
                        'reason': 'Could not infer name from email (generic or no pattern)'
                    })

                # Update row
                row[1] = first_name
                row[2] = last_name

            rows.append(row)

    # Write updated CSV
    with open(output_file, 'w', encoding='utf-8', newline='') as f:
        writer = csv.writer(f)
        writer.writerows(rows)

    return fixes_made, could_not_fix

if __name__ == '__main__':
    input_file = '/home/user/Marketing/plexus_contacts - Sheet1.csv'
    output_file = '/home/user/Marketing/plexus_contacts - Sheet1.csv'

    print("Fixing incomplete name entries...")
    print("=" * 80)

    fixes, unfixed = fix_csv(input_file, output_file)

    print(f"\n✓ Successfully fixed {len(fixes)} entries")
    print(f"✗ Could not fix {len(unfixed)} entries")
    print("=" * 80)

    if fixes:
        print("\n\nFIXES MADE:")
        print("=" * 80)
        for i, fix in enumerate(fixes, 1):
            print(f"{i}. Line {fix['line']}: {fix['company']}")
            print(f"   Before: {fix['old']}")
            print(f"   After:  {fix['new']}")
            print(f"   Email:  {fix['email']}")
            print()

    if unfixed:
        print("\n\nCOULD NOT FIX (manual review needed):")
        print("=" * 80)
        for i, entry in enumerate(unfixed, 1):
            print(f"{i}. Line {entry['line']}: {entry['company']}")
            print(f"   Current: {entry['current']}")
            print(f"   Email:   {entry['email']}")
            print(f"   Reason:  {entry['reason']}")
            print()
