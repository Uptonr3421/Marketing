#!/usr/bin/env python3
"""
Fix ONLY clearly incomplete name entries in plexus_contacts CSV
Conservative approach - only fix what we can confidently infer
"""
import csv
import re
from typing import Tuple, Optional

def is_clearly_incomplete_name(name: str) -> bool:
    """Check if a name is CLEARLY incomplete (not just suspicious)"""
    if not name or name.strip() == '':
        return True

    name = name.strip()

    # Titles used as names
    if re.match(r'^(Dr|Mr|Ms|Mrs|Prof|Mx)\.?$', name, re.IGNORECASE):
        return True

    # Just initials with period (J., K., etc.)
    if re.match(r'^[A-Z]\.?$', name):
        return True

    # 2-3 initials with periods (L.S., etc.)
    if re.match(r'^[A-Z]\.[A-Z]\.?$', name):
        return True

    # Location/placeholder names
    if name in ['Akron', 'Cleveland', 'Columbus', 'Public', 'Private', 'Ohio']:
        return True

    # Lowercase start (de, aV, etc.)
    if name[0].islower():
        return True

    # Very short without being a common name
    if len(name) <= 2 and name not in ['Ed', 'Ty', 'Jo', 'Al', 'Bo', 'Ky']:
        return True

    return False

def extract_name_from_email(email: str) -> Tuple[Optional[str], Optional[str]]:
    """Try to extract first and last name from email address"""
    if not email or '@' not in email:
        return None, None

    local_part = email.split('@')[0]

    # Skip generic emails - return None so we know not to fix these
    generic_keywords = ['info', 'contact', 'admin', 'hello', 'mail', 'support',
                       'accounting', 'programs', 'personnel', 'comms', 'orep',
                       'chair', 'editor', 'president', 'college', 'admissions',
                       'programscoordinator', 'cleveland', 'pride']
    if any(keyword in local_part.lower() for keyword in generic_keywords):
        return None, None

    # Pattern: aVukoder (lowercase initial + capitalized last name)
    match = re.match(r'^([a-z])([A-Z][a-z]+)$', local_part)
    if match:
        first_initial = match.group(1).upper()
        last_name = match.group(2)
        return first_initial, last_name

    # Pattern: jfiume, jkramer, twright (initial + lastname, all lowercase)
    match = re.match(r'^([a-z])([a-z]{4,})$', local_part)
    if match:
        first_initial = match.group(1).upper()
        last_name = match.group(2).capitalize()
        return first_initial, last_name

    # Pattern: firstname.lastname or firstname_lastname
    parts = re.split(r'[._\-]', local_part)
    # Remove numbers and very short parts
    parts = [p for p in parts if p and len(p) > 1 and not p.isdigit()]

    if len(parts) >= 2:
        first_name = parts[0].capitalize()
        last_name = parts[1].capitalize()
        return first_name, last_name

    # Pattern: single name that looks like a first name (not a username)
    if len(parts) == 1 and len(parts[0]) >= 3 and len(parts[0]) <= 10:
        name = parts[0].capitalize()
        return name, None

    return None, None

def fix_csv(input_file: str, output_file: str):
    """Read CSV, fix clearly incomplete names, and write to output file"""

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

            # Check if names are CLEARLY incomplete
            first_incomplete = is_clearly_incomplete_name(first_name)
            last_incomplete = is_clearly_incomplete_name(last_name)

            if not (first_incomplete or last_incomplete):
                # Both names look OK, skip
                rows.append(row)
                continue

            # At least one name is clearly incomplete, try to fix
            inferred_first, inferred_last = extract_name_from_email(email)

            old_first = first_name
            old_last = last_name
            fixed = False

            # CASE 1: Both names incomplete
            if first_incomplete and last_incomplete:
                if inferred_first and inferred_last:
                    # We got both names from email
                    first_name = inferred_first
                    last_name = inferred_last
                    fixed = True
                elif inferred_first and not inferred_last:
                    # Only got one name from email, use it as first name
                    first_name = inferred_first
                    # Keep last name as is (might be empty or incomplete)
                    fixed = "partial"

            # CASE 2: Only first name incomplete
            elif first_incomplete and not last_incomplete:
                if inferred_first:
                    # Use inferred first name, keep last name
                    first_name = inferred_first
                    fixed = True
                elif inferred_last:
                    # Got a different last name from email, use inferred as first name
                    first_name = inferred_last
                    fixed = True

            # CASE 3: Only last name incomplete
            elif not first_incomplete and last_incomplete:
                if inferred_last:
                    # Use inferred last name, keep first name
                    last_name = inferred_last
                    fixed = True
                elif inferred_first and not inferred_last:
                    # Only got one name from email, use it as last name
                    last_name = inferred_first
                    fixed = True

            if fixed:
                fixes_made.append({
                    'line': line_num,
                    'company': company,
                    'old_first': old_first,
                    'old_last': old_last,
                    'new_first': first_name,
                    'new_last': last_name,
                    'email': email
                })
                # Update row
                row[1] = first_name
                row[2] = last_name
            else:
                # Could not fix
                could_not_fix.append({
                    'line': line_num,
                    'company': company,
                    'old_first': old_first,
                    'old_last': old_last,
                    'email': email
                })

            rows.append(row)

    # Write updated CSV
    with open(output_file, 'w', encoding='utf-8', newline='') as f:
        writer = csv.writer(f)
        writer.writerows(rows)

    return fixes_made, could_not_fix

if __name__ == '__main__':
    input_file = '/home/user/Marketing/plexus_contacts - Sheet1.csv'
    output_file = '/home/user/Marketing/plexus_contacts - Sheet1.csv'

    print("=" * 80)
    print("FIXING INCOMPLETE NAME ENTRIES")
    print("=" * 80)

    fixes, unfixed = fix_csv(input_file, output_file)

    print(f"\n✓ Successfully fixed: {len(fixes)} entries")
    print(f"✗ Could not fix: {len(unfixed)} entries")
    print("=" * 80)

    if fixes:
        print("\n\nDETAILED FIXES MADE:")
        print("=" * 80)
        for i, fix in enumerate(fixes, 1):
            print(f"\n{i}. Line {fix['line']}: {fix['company']}")
            print(f"   BEFORE: [{fix['old_first']}] [{fix['old_last']}]")
            print(f"   AFTER:  [{fix['new_first']}] [{fix['new_last']}]")
            print(f"   EMAIL:  {fix['email']}")

    if unfixed:
        print("\n\n" + "=" * 80)
        print("COULD NOT FIX (Manual Review Needed):")
        print("=" * 80)
        for i, entry in enumerate(unfixed, 1):
            print(f"\n{i}. Line {entry['line']}: {entry['company']}")
            print(f"   Current: [{entry['old_first']}] [{entry['old_last']}]")
            print(f"   Email:   {entry['email']}")
            print(f"   Reason:  Generic email or could not infer name pattern")

    print("\n" + "=" * 80)
    print(f"SUMMARY: Fixed {len(fixes)}/{len(fixes) + len(unfixed)} incomplete entries")
    print("=" * 80)
