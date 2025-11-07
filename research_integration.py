#!/usr/bin/env python3
"""
RESEARCH-ENHANCED EMAIL INTEGRATION
Integrates live web research findings into conversion emails for hyper-personalization.
"""

import os
import re

# LIVE RESEARCH FINDINGS - Real business details discovered through web research
RESEARCH_DATABASE = {
    "Marigold Catering": {
        "hook_detail": "I saw Marigold was acquired by Icon Hospitality Group in July and you're expanding to Cuyahoga Falls in March - that's the kind of growth trajectory that requires serious operational efficiency.",
        "specific_pain": "With $7.4M in annual revenue and exclusive partnerships at 5 venues, you're at the exact inflection point where manual processes become the bottleneck to scaling further.",
        "personalized_benefit": "• Handle your March expansion without operational chaos\n• Scale your Icon Hospitality portfolio systematically\n• Maintain quality across 5 exclusive venues + new locations"
    },

    "Dale Dong Photography": {
        "hook_detail": "I saw your performing arts portfolio - the dance, theatre, and music work is stunning. But here's the truth: capturing a perfect arabesque in low light is harder than most photographers' entire careers.",
        "specific_pain": "Performing arts photographers face unique admin hell: venue coordination, multiple client contacts per show, rapid turnaround galleries, and managing rights for performers vs. venues.",
        "personalized_benefit": "• Gallery delivery within 24 hours of curtain call\n• Automated venue/performer/company communications\n• Handle 40% more shows without post-production burnout\n• Your calendar fills from referrals while you're shooting"
    },

    "Bosco Consulting, LLC": {
        "hook_detail": "Dr. Bosco - your work as Plexus Inclusion Hub Director and your DEI consulting practice are exactly what organizations need right now. But I'm guessing you're spending more time on proposals than delivering the transformation work.",
        "specific_pain": "As an EdD with DEI expertise across Cleveland AND California, you're too valuable to be doing intake forms and invoice follow-up. Every hour on admin is an hour not spent designing inclusion programs.",
        "personalized_benefit": "• DEI assessment reports that generate themselves from client data\n• Workshop materials customized automatically per organization\n• Your thought leadership reaching more organizations with less admin\n• Focus on inclusion strategy, not scheduling logistics"
    },

    "Clever Girl Marketing": {
        "hook_detail": "Heather - I heard you on 'That's a Hard No' talking about mission-driven marketing. Here's my hard truth: even the best strategists waste too much time on client admin instead of strategic work.",
        "specific_pain": "Running a full-service agency with award-winning strategists, writers, designers, and developers means you're juggling complex workflows. Manual client communication is your hidden profit leak.",
        "personalized_benefit": "• Client onboarding that happens while you're recording your podcast\n• Project status updates that write themselves from your team's work\n• Your strategists strategizing, not updating spreadsheets\n• Scale your mission-driven client roster without agency bloat"
    },

    "Food for Thought Catering": {
        "hook_detail": "Bonnie - 30 years in business, and you're still one of Northeast Ohio's largest full-service caterers. That longevity proves you do it right. But after three decades, isn't it time the business ran itself?",
        "specific_pain": "Congratulations on being recognized as a luminary female leader in 2024. Now let's make sure you're leading strategy, not drowning in same-day order logistics and menu customization emails.",
        "personalized_benefit": "• Same-day orders processed automatically\n• Menu customization workflows that don't need you at 11 PM\n• Handle your volume without proportional admin growth\n• 30 years of expertise scaled through systems, not hours"
    },

    "Where the Heart Is Catering": {
        "hook_detail": "As a Black-owned business working toward being #1 in Greater Cleveland, you've got the vision and the 'Creative, Unique & Excellent' execution. Manual admin is the only thing standing between you and that #1 spot.",
        "specific_pain": "Box catering, drop-offs, decorating, corporate events - you handle it all. But each service type has different workflows, and managing them manually means you're working IN the business, not ON reaching #1.",
        "personalized_benefit": "• Automated workflows for each service type\n• Scale your 'Creative, Unique & Excellent' promise across more events\n• Book corporate clients while you're decorating wedding receptions\n• Your vision of #1 in Greater Cleveland, powered by systems"
    },

    "Leigh Bacho Photography LLC": {
        "hook_detail": "Lauren - working with NBA, NFL, Getty Images, and AP Images is the dream. You're already at the top. But sports photography is unforgiving: tight deadlines, massive file volumes, and clients who need photos NOW.",
        "specific_pain": "Award-winning sports photojournalism means you're often shooting game day, processing that night, and delivering next morning. Manual gallery delivery and client communication steal the hours you need for the work that pays.",
        "personalized_benefit": "• Game-to-gallery pipeline automated for same-day turnaround\n• Team/athlete/media client workflows customized per deliverable type\n• Handle more games without sacrificing quality or sleep\n• Focus on the shot, not the upload process"
    },

    "Paige Mireles Photography": {
        "hook_detail": "Your alternative, LGBTQ+ and BIPOC-affirming approach with moody, artistic style has earned you a 5.0 rating from 29 couples. That's not luck - that's exceptional work. But here's the question: how many more couples could you serve?",
        "specific_pain": "100% couples recommendation means your inquiry-to-booking ratio should be higher. If you're buried in editing and gallery delivery, you're missing inquiries during your 24-48 hour response window.",
        "personalized_benefit": "• Inquiry responses that happen while you're shooting\n• Gallery delivery automated so couples get their moody magic faster\n• Book 40% more LGBTQ+/BIPOC weddings without workflow chaos\n• Your artistic vision scaled, not diluted"
    },

    "Thrive Coaching & Consulting": {
        "hook_detail": "A master's in Applied Positive Psychology from UPenn plus 20 years in HR - you've got the credentials and experience. But I bet you're spending more time on consulting admin than on the strengths-based coaching that transforms organizations.",
        "specific_pain": "Fractional HR, executive coaching, leadership development, and talent assessments - each service needs different workflows. Manual coordination means you're doing HR work instead of strategic HR leadership.",
        "personalized_benefit": "• Client assessments and reports automated from your methodologies\n• Coaching session prep generated from client goals and progress\n• Scale your fractional HR practice without proportional admin hours\n• Your UPenn expertise reaching more leaders with less logistics"
    },

    "Cleveland Therapy Group": {
        "hook_detail": "Specializing in mood disorders, trauma, EMDR, and offering telehealth across Ohio - you're meeting demand in a mental health crisis. But are you turning away clients because admin is eating your clinical hours?",
        "specific_pain": "Telehealth for all Ohio clients means you've already embraced efficiency. Now automate the insurance billing, no-show reminders, and session notes that steal time from actual therapy.",
        "personalized_benefit": "• EMDR session documentation automated and HIPAA-compliant\n• Insurance billing that happens without clinical staff involvement\n• Reduce no-shows by 40% with automated client engagement\n• More therapy hours, same clinical team size"
    },

    "Navigate Counseling and Consultation Services": {
        "hook_detail": "Being a leader in LGBTQ-affirming counseling in the Akron area is vital work. Your sliding scale ($135-165) shows you prioritize accessibility. But manual admin costs you sessions you could offer at sliding scale rates.",
        "specific_pain": "Individual, couples, family counseling PLUS continuing education for other counselors - you're serving two client types with different needs. Manual coordination means Leanne is doing admin instead of clinical supervision.",
        "personalized_benefit": "• Sliding scale calculations and billing automated\n• Client intake that identifies LGBTQ-specific needs before session 1\n• CE course admin handled systematically\n• Serve 6-8 more weekly clients at sliding scale rates with time reclaimed"
    },

    "Oasis Counseling Solutions LLC": {
        "hook_detail": "Mondie - 25+ years in mental health and 10 years in private practice shows serious staying power. Your trauma-informed, eclectic approach helps families heal. But after 25 years, shouldn't your practice admin be automatic?",
        "specific_pain": "Individuals, couples, and families mean three different intake processes, treatment planning approaches, and billing scenarios. Manual management multiplies your administrative load.",
        "personalized_benefit": "• Trauma-informed intake that happens before you meet the client\n• Treatment plans that update from session notes automatically\n• Family therapy coordination (multiple clients, one case) simplified\n• 25 years of clinical wisdom, powered by systems from year 26 forward"
    },

    "Lago Custom Events": {
        "hook_detail": "A luxury venue in downtown Cleveland serving 300 guests with full-service catering is an operational symphony. Corina, Diana, Jordan, and Aubrey are executing beautifully. But are manual processes limiting your event capacity?",
        "specific_pain": "Custom events means every wedding, corporate event, and nonprofit gala has unique specs. Without automated workflows, your coordinators are recreating the wheel for each booking instead of focusing on execution excellence.",
        "personalized_benefit": "• Event planning workflows customized per event type (wedding/corporate/nonprofit)\n• Client communication automated from inquiry through post-event follow-up\n• Your team executing custom events, not managing spreadsheets\n• Book 30% more events at the same staffing level"
    },

    "Linear Creative LLC": {
        "hook_detail": "Ray - you started Linear Creative in 2001, and you're NGLCC certified with 75% nonprofit clients. Your empathy marketing approach is exactly what mission-driven orgs need. But are you practicing what you preach when it comes to efficiency?",
        "specific_pain": "Full-service agency work (branding, web design, video, SEO, social, copywriting) for nonprofit clients means tight budgets and high impact expectations. Manual agency operations eat the margin you could reinvest in client work.",
        "personalized_benefit": "• Client onboarding automated so you start projects faster\n• Project status reports generated from your team's actual work\n• Serve more nonprofits at the same 2-10 person team size\n• Your empathy marketing scaled through systems, not burnout"
    },

    "Nadas Law LLC": {
        "hook_detail": "Tas - estate planning and probate administration as a boutique firm means deeply personal client relationships. But here's the truth: your clients need your legal expertise, not your data entry skills.",
        "specific_pain": "Probate litigation, guardianships, and trust administration involve extensive paperwork, court deadlines, and beneficiary communication. Manual management means you're doing paralegal work at attorney rates.",
        "personalized_benefit": "• Estate planning documents generated from client intake interviews\n• Court deadline tracking automated so nothing falls through\n• Beneficiary updates that happen systematically throughout probate\n• Your J.D. and M.B.A. focused on legal strategy, not document assembly"
    },

    "Kim Karbon Photography": {
        "hook_detail": "Your lifestyle photography capturing authentic moments - proposals, triathlons, Cleveland Crunch games, date nights - is beautiful work. But action photography means tight turnaround times, and manual gallery delivery kills your workflow.",
        "specific_pain": "Lifestyle and sports photography clients want their photos FAST. If you're manually culling, editing, and delivering galleries, you're creating bottlenecks that cost you bookings and referrals.",
        "personalized_benefit": "• Sports event galleries delivered within hours, not days\n• Proposal photo reveals automated for that 'wow' client experience\n• Handle more Cleveland Crunch games + lifestyle sessions without editor burnout\n• Your authentic moment-capturing, scaled through efficiency"
    },

    "Where the Heart Is Catering": {
        "hook_detail": "As a Black-owned business in Cleveland working toward being #1 in Greater Cleveland, you've got the vision and the 'Creative, Unique & Excellent' execution. Manual admin is the only thing standing between you and that #1 spot.",
        "specific_pain": "Box catering, drop-offs, decorating, corporate events, wedding receptions - you handle it all. But each service type has different workflows, and managing them manually means you're working IN the business, not ON reaching #1.",
        "personalized_benefit": "• Automated workflows for each service type (box catering/events/decorating)\n• Scale your 'Creative, Unique & Excellent' promise across more events\n• Book corporate clients while you're decorating wedding receptions\n• Your vision of #1 in Greater Cleveland, powered by systems"
    },

    "Thrive Coaching & Consulting": {
        "hook_detail": "A master's in Applied Positive Psychology from UPenn plus 20+ years in HR leadership - you've got the credentials and experience that organizations need. But I bet you're spending more time on consulting admin than on the strengths-based coaching that transforms organizations.",
        "specific_pain": "Fractional HR Leadership, executive coaching, leadership development, and talent assessments - each service needs different workflows. Manual coordination means you're doing HR paperwork instead of strategic HR leadership.",
        "personalized_benefit": "• Client assessments and reports automated from your methodologies\n• Coaching session prep generated from client goals and progress data\n• Scale your fractional HR practice without proportional admin hours\n• Your UPenn expertise reaching more leaders with less logistics"
    }
}


def normalize_company_name(name):
    """Normalize company name for matching by removing punctuation variations."""
    # Remove commas and periods after LLC
    normalized = name.replace(',', '').replace('LLC.', 'LLC')
    # Replace & with 'and' for consistent matching
    normalized = normalized.replace('&', 'and')
    # Standardize multiple spaces to single space
    while '  ' in normalized:
        normalized = normalized.replace('  ', ' ')
    return normalized.strip()


def update_dossier_with_research(filepath, company_name):
    """Update a single dossier with research-enhanced email if research exists."""

    # Normalize company name for matching
    normalized_input = normalize_company_name(company_name)

    # Find matching research entry
    research = None
    for db_company_name, db_research in RESEARCH_DATABASE.items():
        if normalize_company_name(db_company_name) == normalized_input:
            research = db_research
            company_name = db_company_name  # Use the properly formatted name
            break

    if research is None:
        return False

    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Extract contact name for personalization
    contact_match = re.search(r'1\. (.+?)\n   Email:', content)
    if not contact_match:
        return False

    contact_name = contact_match.group(1)
    name_parts = contact_name.split()
    first_name = name_parts[0] if name_parts else "there"

    # Find current email section
    email_pattern = r'(───────────────────────────────────────────────────────────────────\nEMAIL OUTREACH\n───────────────────────────────────────────────────────────────────\n\n).+?(\n\n───────────────────────────────────────────────────────────────────\nLINKEDIN MESSAGE)'

    # Build research-enhanced email
    subject = f"{first_name} - I did my homework on {company_name}"

    new_email = f"""{subject}

{research.get('hook_detail', '')}

{research.get('specific_pain', '')}

{research.get('personalized_benefit', '')}

**Here's why I'm reaching out now:** The businesses in our Plexus network who systematized BEFORE their busy season grew 30-40% without adding headcount. The ones who waited? Still fighting fires.

**Zero risk:** I'll show you the 3 automation workflows specifically for businesses like yours - free, on our call. Whether we work together or not, you keep the knowledge. Plexus members help each other.

15 minutes this week to show you the system?

Fellow small business owner,

Bespoke Ethos
Catalant Vetted | NGLCC Certified | Plexus Member

P.S. - Every business owner we've shown this to says the same thing: "Why didn't I do this sooner?" Don't be next year's regret."""

    # Replace email section
    new_section = f'\\1{new_email}\\2'
    updated_content = re.sub(email_pattern, new_section, content, flags=re.DOTALL)

    if updated_content != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(updated_content)
        return True

    return False


def enhance_all_with_research():
    """Update all dossiers that have research data."""

    dossiers_dir = '/home/user/Marketing/dossiers'
    enhanced_count = 0

    for filename in os.listdir(dossiers_dir):
        if not filename.endswith('.txt'):
            continue

        filepath = os.path.join(dossiers_dir, filename)

        # Extract company name from filename
        # First replace double underscores with & (common convention in filenames)
        company_name = filename.replace('__', ' & ').replace('_', ' ').replace('.txt', '')

        if update_dossier_with_research(filepath, company_name):
            enhanced_count += 1
            print(f"✓ Research-enhanced: {company_name}")

    print(f"\n{'='*70}")
    print(f"RESEARCH INTEGRATION: Enhanced {enhanced_count} dossiers with live research")
    print(f"{'='*70}")


if __name__ == '__main__':
    enhance_all_with_research()
