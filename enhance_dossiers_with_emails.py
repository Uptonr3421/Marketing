#!/usr/bin/env python3
"""
Enhance small business dossiers with personalized emails using Bespoke Ethos voice.
Integrates research intel and reflects NGLCC certification, Catalant vetting, and Plexus community.
"""

import os
import re

# Bespoke Ethos positioning
BESPOKE_ETHOS_VOICE = {
    "target": "Average small business owners",
    "credentials": ["Catalant vetted", "NGLCC certified", "Plexus members"],
    "tone": "Peer-to-peer, approachable, community-focused",
    "approach": "Fellow small business owners who understand the challenges"
}

# Industry-specific pain points and solutions for small businesses
SMALL_BUSINESS_INTEL = {
    "catering": {
        "pain_points": [
            "Event booking and client management consuming too much admin time",
            "Last-minute changes and menu customization requests",
            "Seasonal revenue fluctuations and cash flow management",
            "Staff scheduling and coordination for multiple events"
        ],
        "opportunities": [
            "Streamlined booking systems that save 10+ hours per week",
            "Automated client communication and follow-ups",
            "Financial planning tools for seasonal businesses",
            "Digital coordination systems for event logistics"
        ],
        "hook": "fellow small business owners in the events industry"
    },
    "photography": {
        "pain_points": [
            "Client acquisition and maintaining steady bookings",
            "Time spent on editing and post-production",
            "Managing client galleries and delivery",
            "Inconsistent income and seasonal booking gaps"
        ],
        "opportunities": [
            "Marketing automation to fill your booking calendar",
            "Workflow tools to cut editing time by 30%",
            "Automated gallery delivery and client communication",
            "Business operations systems freeing time for creative work"
        ],
        "hook": "fellow creative entrepreneurs"
    },
    "consulting": {
        "pain_points": [
            "Client acquisition and building consistent pipeline",
            "Administrative work taking time away from billable hours",
            "Scaling beyond 1:1 client work",
            "Demonstrating ROI and value to prospective clients"
        ],
        "opportunities": [
            "Marketing systems that build your authority and attract clients",
            "Automation freeing 15+ hours per week for client work",
            "Productized offerings and scalable service models",
            "Case study and testimonial systems that sell for you"
        ],
        "hook": "fellow consultants and service providers"
    },
    "therapy_counseling": {
        "pain_points": [
            "Administrative burden reducing time with clients",
            "Insurance billing and claims management complexity",
            "Client scheduling and no-show management",
            "Maintaining HIPAA compliance with documentation"
        ],
        "opportunities": [
            "Practice management systems reducing admin by 50%",
            "Automated billing and insurance claim processing",
            "Smart scheduling with automated reminders",
            "Compliant digital documentation systems"
        ],
        "hook": "fellow mental health professionals"
    },
    "event_services": {
        "pain_points": [
            "Multiple vendor coordination and communication",
            "Client expectations and last-minute changes",
            "Seasonal business with uneven cash flow",
            "Marketing and keeping calendar full"
        ],
        "opportunities": [
            "Vendor coordination platforms saving hours per event",
            "Client portal systems managing expectations",
            "Financial tools for seasonal revenue planning",
            "Automated marketing keeping your pipeline full"
        ],
        "hook": "fellow event professionals"
    },
    "legal": {
        "pain_points": [
            "Client intake and onboarding process complexity",
            "Document management and case file organization",
            "Billable hours tracking and client billing",
            "Marketing to attract ideal clients"
        ],
        "opportunities": [
            "Automated client intake saving 5+ hours per new client",
            "Digital document systems with instant retrieval",
            "Time tracking integrated with billing automation",
            "Content marketing systems building your practice"
        ],
        "hook": "fellow legal professionals"
    },
    "creative_design": {
        "pain_points": [
            "Client revisions and scope creep eating into profits",
            "Inconsistent project pipeline and income",
            "Time spent on admin vs. creative work",
            "Pricing and presenting value to clients"
        ],
        "opportunities": [
            "Project management tools with clear scope boundaries",
            "Marketing automation for consistent client flow",
            "Systems reclaiming 20% more time for creative work",
            "Value-based pricing frameworks and proposals"
        ],
        "hook": "fellow creatives and designers"
    },
    "real_estate": {
        "pain_points": [
            "Lead generation in competitive market",
            "Client communication and transaction coordination",
            "Time management juggling multiple clients",
            "Standing out from other agents"
        ],
        "opportunities": [
            "Lead nurturing systems that convert prospects",
            "Transaction coordination automation",
            "CRM systems managing your entire pipeline",
            "Personal branding that differentiates you"
        ],
        "hook": "fellow real estate professionals"
    },
    "fitness_wellness": {
        "pain_points": [
            "Client retention and maintaining consistent attendance",
            "Scheduling and class management",
            "Payment processing and membership management",
            "Marketing to fill classes and programs"
        ],
        "opportunities": [
            "Retention systems keeping clients engaged",
            "Automated scheduling with waitlist management",
            "Seamless payment and membership automation",
            "Community-building tools that market for you"
        ],
        "hook": "fellow wellness entrepreneurs"
    },
    "default": {
        "pain_points": [
            "Finding time to work ON your business instead of just IN it",
            "Inconsistent revenue and cash flow management",
            "Administrative tasks consuming valuable time",
            "Scaling beyond your current capacity"
        ],
        "opportunities": [
            "Operations systems reclaiming 15+ hours per week",
            "Financial planning tools for small business stability",
            "Automation handling repetitive tasks",
            "Growth strategies that don't require working more hours"
        ],
        "hook": "fellow small business owners"
    }
}

def categorize_business(company_name):
    """Determine business category from company name."""
    company_lower = company_name.lower()

    if any(word in company_lower for word in ['catering', 'food']):
        return 'catering'
    elif any(word in company_lower for word in ['photography', 'photo']):
        return 'photography'
    elif any(word in company_lower for word in ['consulting', 'consultant', 'advisory', 'strategies']):
        return 'consulting'
    elif any(word in company_lower for word in ['therapy', 'counseling', 'mental health', 'wellness']):
        return 'therapy_counseling'
    elif any(word in company_lower for word in ['event', 'venue', 'wedding', 'rental']):
        return 'event_services'
    elif any(word in company_lower for word in ['law', 'legal', 'attorney']):
        return 'legal'
    elif any(word in company_lower for word in ['design', 'creative', 'studio', 'media', 'marketing', 'graphics']):
        return 'creative_design'
    elif any(word in company_lower for word in ['real estate', 'realty', 'realtor']):
        return 'real_estate'
    elif any(word in company_lower for word in ['fitness', 'yoga', 'massage', 'spa']):
        return 'fitness_wellness'
    else:
        return 'default'

def generate_email(company_name, contact_name, category_intel):
    """Generate personalized email for small business."""

    first_name = contact_name.split()[0] if contact_name else "there"

    email = f"""
Subject: Fellow Plexus Member – Quick Question About {company_name}

Hi {first_name},

I'm reaching out as a fellow Plexus member and small business owner. I came across {company_name} in our community network and wanted to connect.

As {category_intel['hook']}, I know firsthand the challenges we face:

{chr(10).join(f"• {pain}" for pain in category_intel['pain_points'][:3])}

At Bespoke Ethos, we're a Catalant-vetted, NGLCC-certified consultancy specifically for small businesses like ours. We've helped {category_intel['hook']} with:

{chr(10).join(f"• {opp}" for opp in category_intel['opportunities'][:3])}

I'd love to share some quick wins that have worked for similar businesses in our Plexus community – no sales pitch, just peer-to-peer insights that might save you time or headaches.

Would you be open to a 15-minute conversation in the next week or two?

Best regards,

[Your Name]
Bespoke Ethos
Catalant Vetted | NGLCC Certified | Plexus Member

P.S. - As fellow LGBTQ+-allied businesses, supporting each other's success is what our community is all about.
"""

    return email.strip()

def generate_linkedin_message(company_name, contact_name, category_intel):
    """Generate shorter LinkedIn message."""

    first_name = contact_name.split()[0] if contact_name else "there"

    message = f"""Hi {first_name},

Fellow Plexus member here! I saw {company_name} in our community network and wanted to connect.

As {category_intel['hook']}, I know how challenging it can be to balance growth with day-to-day operations. At Bespoke Ethos (Catalant-vetted, NGLCC-certified), we help small businesses reclaim time and scale smarter.

Would love to share some quick wins from other {category_intel['hook']} in our network – peer-to-peer, no pitch.

Open to connecting?"""

    return message.strip()

def enhance_dossier(filepath):
    """Add personalized emails to an existing dossier."""

    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Extract company name
    company_match = re.search(r'Company: (.+)', content)
    if not company_match:
        return False

    company_name = company_match.group(1)

    # Extract first contact name
    contact_match = re.search(r'\d+\. (.+?)\n', content)
    contact_name = contact_match.group(1) if contact_match else "there"

    # Get category-specific intel
    category = categorize_business(company_name)
    intel = SMALL_BUSINESS_INTEL[category]

    # Generate overview
    overview = f"""{company_name} is a small business serving the {category.replace('_', ' ')} sector.
As a fellow Plexus community member and {intel['hook']}, they face common challenges including
{intel['pain_points'][0].lower()}, and {intel['pain_points'][1].lower()}.

Our shared values as LGBTQ+-allied businesses and community members create natural alignment
for peer-to-peer collaboration and mutual support."""

    # Generate pain points section
    pain_points_text = "\n".join(f"• {pain}" for pain in intel['pain_points'])

    # Generate email and LinkedIn
    email = generate_email(company_name, contact_name, intel)
    linkedin = generate_linkedin_message(company_name, contact_name, intel)

    # Generate outreach strategy
    outreach = f"""APPROACH: Peer-to-peer connection as fellow Plexus members and small business owners.
Lead with community connection and shared values (NGLCC certification).

POSITIONING: Bespoke Ethos as Catalant-vetted experts who understand small business
challenges because we ARE small business owners.

VALUE PROPOSITION: Time reclaimed, operations streamlined, growth without burnout.

PROOF POINTS: Reference other {intel['hook']} in Plexus network who've seen results.

CALL-TO-ACTION: Low-pressure 15-minute peer conversation, not a sales pitch."""

    # Replace placeholders
    content = content.replace('[Market research to be added]', overview)
    content = content.replace('• [Pain point 1]\n• [Pain point 2]\n• [Pain point 3]\n• [Pain point 4]',
                            pain_points_text)
    content = content.replace('[Personalized outreach strategy to be added]', outreach)

    # Add email section
    email_section = f"""

───────────────────────────────────────────────────────────────────
EMAIL OUTREACH
───────────────────────────────────────────────────────────────────

{email}

───────────────────────────────────────────────────────────────────
LINKEDIN MESSAGE
───────────────────────────────────────────────────────────────────

{linkedin}
"""

    content = content.replace('═══════════════════════════════════════════════════════════════════\n',
                            email_section + '\n═══════════════════════════════════════════════════════════════════\n')

    # Write enhanced content
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

    return True

if __name__ == '__main__':
    dossiers_dir = '/home/user/Marketing/dossiers'

    print("Enhancing small business dossiers with Bespoke Ethos intelligence...\n")

    enhanced = 0
    failed = 0

    for filename in sorted(os.listdir(dossiers_dir)):
        if filename.endswith('.txt'):
            filepath = os.path.join(dossiers_dir, filename)
            try:
                if enhance_dossier(filepath):
                    enhanced += 1
                    print(f"✓ Enhanced: {filename}")
                else:
                    failed += 1
                    print(f"✗ Failed: {filename}")
            except Exception as e:
                failed += 1
                print(f"✗ Error in {filename}: {str(e)}")

    print(f"\n{'='*60}")
    print(f"COMPLETE: Enhanced {enhanced} dossiers")
    if failed > 0:
        print(f"Failed: {failed} dossiers")
    print(f"{'='*60}")
