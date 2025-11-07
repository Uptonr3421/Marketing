import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request) {
  try {
    const { contacts } = await request.json();

    if (!contacts || contacts.length === 0) {
      return NextResponse.json({ error: 'Contacts array is required' }, { status: 400 });
    }

    // Build comprehensive analysis prompt
    const analysisPrompt = `You are a sales intelligence analyst expert at finding deep parallels, patterns, and hidden connections that maximize sales opportunities.

CONTACT DATABASE (${contacts.length} contacts):

${contacts
  .map(
    (c, i) =>
      `${i + 1}. ${c.firstName} ${c.lastName} | ${c.company} | ${c.email} | Industry: ${c.industry || 'Unknown'} | Notes: ${c.notes || 'None'}`
  )
  .join('\n')}

YOUR MISSION: Find HARD-TO-SPOT parallels and connections that will maximize sales conversions.

ANALYZE AND PROVIDE:

1. INDUSTRY CLUSTERS & CROSS-SELL OPPORTUNITIES
   - Group contacts by industry/sector
   - Identify which industries have multiple contacts (concentration = opportunity)
   - Suggest industry-specific value propositions
   - Cross-selling pathways between industries

2. GEOGRAPHIC PATTERNS
   - Akron-based vs regional vs national contacts
   - Local community connections (shared events, initiatives, causes)
   - Geographic clustering for in-person meetings/events
   - Regional challenges/opportunities

3. ORGANIZATIONAL SIZE & MATURITY PATTERNS
   - Startups vs established organizations
   - Nonprofit vs for-profit patterns
   - Decision-maker level (C-suite vs managers vs coordinators)
   - Budget authority indicators

4. HIDDEN CONNECTIONS & PARALLELS
   - Mutual connections between contacts (who knows who?)
   - Overlapping causes/missions (e.g., arts orgs, education, healthcare)
   - Shared community involvement
   - Potential referral chains (A could intro to B, who knows C)
   - Board connections, partnerships, collaborations

5. PAIN POINT CLUSTERING
   - Common challenges by industry
   - Seasonal patterns (museums in summer, schools in fall, etc.)
   - Funding cycle patterns (grant seasons, fiscal years)
   - Technology/modernization needs

6. TIER RECOMMENDATIONS (Maximize ROI)
   - TIER 1 (High-Value, 35 contacts): Which contacts deserve white-glove treatment?
     * High budget authority
     * Multiple connections to other contacts
     * Large organizations or high-profile
     * Quick win potential

   - TIER 2 (Strong Potential, 50 contacts): Strong prospects with good conversion potential

   - TIER 3 (Standard Nurture, 40 contacts): Long-term nurture candidates

7. PARALLEL OUTREACH CAMPAIGNS
   - "Arts & Culture" campaign (museums, festivals, etc.)
   - "Education" campaign (schools, learning centers)
   - "Healthcare & Wellness" campaign
   - "Corporate" campaign
   - "Nonprofit" campaign
   - Which contacts fit each campaign?
   - Shared messaging angles for each group

8. REFERRAL MAPPING
   - Create a referral chain strategy
   - Who should we approach first to unlock others?
   - Which contacts are "influencers" in their networks?
   - Strategic sequence for maximum warm introductions

9. EVENT/INITIATIVE OPPORTUNITIES
   - Could we host an event that brings multiple contacts together?
   - Webinar topics that would attract multiple contacts
   - Collaboration opportunities between contacts
   - Community initiatives that align with multiple contacts

10. SALES MAXIMIZATION STRATEGY
    - Optimal outreach sequence across all 125 contacts
    - Which contacts to prioritize for quick wins
    - Which contacts to group for efficiency
    - Expected conversion rates by segment
    - Revenue potential estimates by tier
    - 90-day action plan for maximum sales

DELIVERABLE FORMAT:
Provide a comprehensive analysis that reads like an intelligence briefing. Be specific. Name names. Draw concrete connections. Give actionable recommendations that will directly increase sales.

The goal: Turn these 125 contacts into 10-15 new clients in 90 days by leveraging patterns, parallels, and strategic sequencing.`;

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 8000,
      temperature: 0.5, // Lower temperature for more analytical, focused output
      messages: [
        {
          role: 'user',
          content: analysisPrompt,
        },
      ],
    });

    const analysis = message.content[0].text;

    return NextResponse.json({
      totalContacts: contacts.length,
      analysis,
      timestamp: new Date().toISOString(),
      model: 'claude-sonnet-4-5',
    });
  } catch (error) {
    console.error('Parallel analysis error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze parallels', details: error.message },
      { status: 500 }
    );
  }
}

// GET endpoint for quick parallel insights
export async function GET(request) {
  return NextResponse.json({
    feature: 'AI-Powered Parallel Analysis',
    description:
      'Finds hard-to-spot connections, patterns, and parallels across your entire contact database to maximize sales opportunities',
    benefits: [
      'Identify cross-selling opportunities between industries',
      'Map referral chains and influence networks',
      'Group contacts into efficient outreach campaigns',
      'Discover hidden connections and mutual relationships',
      'Prioritize contacts by conversion potential',
      'Create strategic outreach sequences',
    ],
    usage: 'POST /api/ai-agents/analyze-parallels with {contacts: [array of contact objects]}',
    expectedOutcome:
      'Turn 125 contacts into 10-15 new clients through strategic parallel-based outreach',
  });
}
