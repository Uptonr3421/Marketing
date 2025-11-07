#!/usr/bin/env python3
"""
Extract small businesses from contacts CSV and create individual text dossiers.
Focus on boutiques, consultants, local shops, and small service businesses.
"""

import csv
import os
import re

# Keywords to identify small businesses (exclude large corporations)
SMALL_BUSINESS_INDICATORS = [
    'LLC', 'Consulting', 'Studio', 'Shop', 'Boutique', 'Catering', 'Photography',
    'Design', 'Coaching', 'Services', 'Consulting', 'Group', 'Soap', 'Wellness',
    'Therapy', 'Counseling', 'Creative', 'Media', 'Event', 'Planning', 'Floral',
    'Hair', 'Salon', 'Spa', 'Fitness', 'Yoga', 'Massage', 'Bakery', 'Cafe',
    'Restaurant', 'Bar', 'Lounge', 'Venue', 'Realty', 'Real Estate', 'Law',
    'Legal', 'Accounting', 'Financial', 'Insurance', 'Marketing', 'Advertising',
    'Web', 'Digital', 'Graphic', 'Video', 'Film', 'Music', 'Entertainment',
    'Limousine', 'Transportation', 'Travel', 'Tours', 'Cleaning', 'Maintenance',
    'Repair', 'Construction', 'Landscaping', 'Painting', 'Plumbing', 'Electrical'
]

# Large corporations to EXCLUDE
EXCLUDE_COMPANIES = [
    'FirstEnergy', 'Diebold Nixdorf', 'American Greetings', 'Goodyear',
    'J.M. Smucker', 'Nestle', 'PNC Bank', 'Huntington Bank', 'KeyBank',
    'Cleveland Cavaliers', 'Playhouse Square', 'Medical Mutual', 'Anthem',
    'MetroHealth', 'Cleveland Clinic', 'University Hospitals', 'Summa Health',
    'Cleveland Public Library', 'Cuyahoga County', 'Cleveland State University',
    'Kent State', 'Case Western', 'Oberlin College', 'Cleveland Foundation',
    'United Way', 'Greater Cleveland', 'Destination Cleveland', 'WKYC',
    'Plain Dealer', 'Cleveland.com', 'Sherwin-Williams', 'Progressive',
    'Eaton', 'Parker Hannifin', 'TimkenSteel', 'Avery Dennison', 'OverDrive',
    'Hyland Software', 'Westfield', 'GCRTA', 'RTA', 'Regional Transit'
]

def is_small_business(company):
    """Determine if company is a small business."""
    # Check if it's a large corporation to exclude
    for exclude in EXCLUDE_COMPANIES:
        if exclude.lower() in company.lower():
            return False

    # Check for small business indicators
    for indicator in SMALL_BUSINESS_INDICATORS:
        if indicator.lower() in company.lower():
            return True

    return False

def extract_small_businesses():
    """Extract all small businesses from CSV."""
    input_file = '/home/user/Marketing/plexus_contacts - Sheet1.csv'
    small_businesses = {}

    with open(input_file, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            company = row['Company']

            if is_small_business(company):
                if company not in small_businesses:
                    small_businesses[company] = []

                small_businesses[company].append({
                    'first_name': row['First Name'],
                    'last_name': row['Last Name'],
                    'email': row['Email']
                })

    return small_businesses

def create_dossier(company, contacts):
    """Create a text dossier for a small business."""

    # Sanitize filename
    filename = re.sub(r'[^\w\s-]', '', company).strip().replace(' ', '_')
    filepath = f'/home/user/Marketing/dossiers/{filename}.txt'

    # Create dossiers directory if it doesn't exist
    os.makedirs('/home/user/Marketing/dossiers', exist_ok=True)

    dossier = f"""
═══════════════════════════════════════════════════════════════════
BUSINESS INTELLIGENCE DOSSIER
═══════════════════════════════════════════════════════════════════

Company: {company}
Type: Small Business
Total Contacts: {len(contacts)}
Last Updated: 2025-11-07

───────────────────────────────────────────────────────────────────
CONTACTS
───────────────────────────────────────────────────────────────────

"""

    for i, contact in enumerate(contacts, 1):
        name = f"{contact['first_name']} {contact['last_name']}".strip()
        email = contact['email']
        dossier += f"{i}. {name}\n   Email: {email}\n\n"

    dossier += """───────────────────────────────────────────────────────────────────
BUSINESS OVERVIEW
───────────────────────────────────────────────────────────────────

[Market research to be added]

───────────────────────────────────────────────────────────────────
PAIN POINTS & OPPORTUNITIES
───────────────────────────────────────────────────────────────────

• [Pain point 1]
• [Pain point 2]
• [Pain point 3]
• [Pain point 4]

───────────────────────────────────────────────────────────────────
OUTREACH STRATEGY
───────────────────────────────────────────────────────────────────

[Personalized outreach strategy to be added]

═══════════════════════════════════════════════════════════════════
"""

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(dossier)

    return filepath

if __name__ == '__main__':
    print("Extracting small businesses from contacts...")
    businesses = extract_small_businesses()

    print(f"\nFound {len(businesses)} small businesses")
    print(f"Creating dossiers...\n")

    created = 0
    for company, contacts in sorted(businesses.items()):
        filepath = create_dossier(company, contacts)
        created += 1
        print(f"✓ Created: {os.path.basename(filepath)}")

    print(f"\n✓ Successfully created {created} dossiers in /home/user/Marketing/dossiers/")
