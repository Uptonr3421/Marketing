#!/usr/bin/env python3
"""
Comprehensive fix for ALL incomplete name entries in plexus_contacts CSV
"""
import csv
import re
from typing import Tuple, Optional

def is_clearly_incomplete_name(name: str) -> bool:
    """Check if a name is CLEARLY incomplete"""
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
    """Extract first and last name from email with comprehensive patterns"""
    if not email or '@' not in email:
        return None, None

    local_part = email.split('@')[0]

    # Skip truly generic emails
    generic_exact = ['info', 'contact', 'admin', 'hello', 'mail', 'support',
                     'accounting', 'programs', 'personnel', 'comms', 'orep',
                     'chair', 'editor', 'president', 'pride', 'admissions']
    if local_part.lower() in generic_exact:
        return None, None

    # Skip emails that start with generic keywords
    if re.match(r'^(info|contact|admin|hello|mail|support|programs|personnel|college|twistscc|ceo|wedding|western|diversity)', local_part, re.IGNORECASE):
        return None, None

    # Pattern: DrewFilipski, CarmenDunkle (CamelCase concatenated names)
    match = re.match(r'^([A-Z][a-z]+)([A-Z][a-z]+)$', local_part)
    if match:
        first_name = match.group(1)
        last_name = match.group(2)
        return first_name, last_name

    # Pattern: PastorGeorge, CJ (Title + Name or initials)
    match = re.match(r'^(Pastor|Rev|Dr)([A-Z][a-z]+)$', local_part, re.IGNORECASE)
    if match:
        # Skip the title, use the name as first name
        first_name = match.group(2)
        return first_name, None

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
    if len(parts) == 1:
        name = parts[0]
        # If it's a reasonable length and looks like a name
        if 3 <= len(name) <= 10 and name.isalpha():
            return name.capitalize(), None

    return None, None

def fix_csv(input_file: str, output_file: str):
    """Read CSV, fix incomplete names comprehensively"""

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

            first_incomplete = is_clearly_incomplete_name(first_name)
            last_incomplete = is_clearly_incomplete_name(last_name)

            if not (first_incomplete or last_incomplete):
                rows.append(row)
                continue

            inferred_first, inferred_last = extract_name_from_email(email)

            old_first = first_name
            old_last = last_name
            fixed = False

            # CASE 1: Both names incomplete
            if first_incomplete and last_incomplete:
                if inferred_first and inferred_last:
                    # We have both names from email
                    first_name = inferred_first
                    last_name = inferred_last
                    fixed = True
                elif inferred_first and not inferred_last:
                    # Only got one name, use it as first
                    first_name = inferred_first
                    last_name = ''  # Clear the incomplete last name
                    fixed = "partial"

            # CASE 2: Only first name incomplete, last name is good
            elif first_incomplete and not last_incomplete:
                if inferred_first:
                    first_name = inferred_first
                    # If we also got a last name from email, it might be better
                    if inferred_last:
                        last_name = inferred_last
                    fixed = True

            # CASE 3: Only last name incomplete, first name is good
            elif not first_incomplete and last_incomplete:
                if inferred_last:
                    last_name = inferred_last
                    fixed = True
                elif inferred_first and not inferred_last:
                    # Only got one name from email, use it as last
                    last_name = inferred_first
                    fixed = True

            # Special case: If current last name looks like it should be first name
            # and we got initial + lastname from email (e.g., "Dr. Christina" + "aVukoder")
            if old_first in ['Dr.', 'Mr.', 'Ms.', 'Mrs.', 'Mx.', 'Prof.']:
                if inferred_first and len(inferred_first) <= 2 and inferred_last:
                    # Email gave us initial + last name, current last is actually first name
                    if not is_clearly_incomplete_name(old_last):
                        first_name = old_last  # Use current last as first
                        last_name = inferred_last  # Use inferred last
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
                row[1] = first_name
                row[2] = last_name
            else:
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
    print("COMPREHENSIVE FIX FOR INCOMPLETE NAME ENTRIES")
    print("=" * 80)

    fixes, unfixed = fix_csv(input_file, output_file)

    print(f"\n✓ Successfully fixed: {len(fixes)} entries")
    print(f"✗ Could not fix: {len(unfixed)} entries")
    print(f"📊 Total incomplete entries found: {len(fixes) + len(unfixed)}")
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
        print(f"COULD NOT FIX ({len(unfixed)} entries - Manual Review Needed):")
        print("=" * 80)
        for i, entry in enumerate(unfixed, 1):
            print(f"\n{i}. Line {entry['line']}: {entry['company']}")
            print(f"   Current: [{entry['old_first']}] [{entry['old_last']}]")
            print(f"   Email:   {entry['email']}")

    print("\n" + "=" * 80)
    print(f"SUMMARY: Fixed {len(fixes)}/{len(fixes) + len(unfixed)} incomplete entries")
    print("=" * 80)
