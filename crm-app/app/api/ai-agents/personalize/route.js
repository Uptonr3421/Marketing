import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request) {
  try {
    const { contact, touchNumber = 1, context = '' } = await request.json();

    if (!contact) {
      return NextResponse.json(
        { error: 'Contact information is required' },
        { status: 400 }
      );
    }

    // Build personalization context
    const personalizationPrompt = `You are a sales personalization expert. Generate hyper-personalized outreach content for this contact.

CONTACT INFORMATION:
- Name: ${contact.firstName} ${contact.lastName}
- Company: ${contact.company}
- Email: ${contact.email}
- Role/Title: ${contact.title || 'Not specified'}
- Industry: ${contact.industry || 'Not specified'}
- Previous interactions: ${contact.lastInteraction || 'None'}
- Notes: ${contact.notes || 'None'}

CAMPAIGN CONTEXT:
- Touch number: ${touchNumber} of 12
- Additional context: ${context}

STRATEGY TO FOLLOW (from research):
- 76% increase in engagement with deep personalization beyond first name
- Reference specific company details, achievements, or industry trends
- Lead with VALUE first (no ask on first touch)
- Use the PAID method: Personalize, Acknowledge, Insight, Direction
- Create "peak moments" that are memorable
- Use specificity to build trust

YOUR TASK:
Generate the following for Touch #${touchNumber}:

1. 5 SUBJECT LINE OPTIONS (each highly specific to their company/role):
   - Must reference specific details about their organization
   - Include numbers or specific outcomes when possible
   - Avoid generic phrases like "quick question" or "touching base"

2. PERSONALIZED EMAIL BODY:
   - Opening: Specific compliment or recognition (1 sentence)
   - Value: Relevant insight, statistic, or resource (2-3 sentences)
   - Social Proof: Brief mention of similar organizations helped (1 sentence)
   - Call-to-Action: Clear, low-friction next step
   - P.S.: Personal touch referencing something specific about them/their company

3. LINKEDIN MESSAGE (if applicable):
   - Shorter version (100-150 words)
   - More casual tone
   - Focus on connection, not sale

4. PERSONALIZATION SCORE (rate 1-10 how personalized this is):
   - Score:
   - Key personalization elements used:
   - Suggestions to make even more personal:

5. FOLLOW-UP STRATEGY:
   - Best time to follow up (based on touch number and typical response patterns)
   - What to reference in next touch
   - Alternative angle if no response

IMPORTANT GUIDELINES:
- Never be generic or templated
- Always reference something specific about their company/role
- Provide genuine value, not just pitch
- Build trust through specificity and insight
- Make them feel seen and understood

Generate the complete personalized outreach package now.`;

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 4000,
      temperature: 0.7,
      messages: [
        {
          role: 'user',
          content: personalizationPrompt,
        },
      ],
    });

    const generatedContent = message.content[0].text;

    // Parse the generated content into structured format
    const structuredResponse = {
      touchNumber,
      contact: {
        name: `${contact.firstName} ${contact.lastName}`,
        company: contact.company,
      },
      generated: generatedContent,
      timestamp: new Date().toISOString(),
      model: 'claude-sonnet-4-5',
    };

    return NextResponse.json(structuredResponse);
  } catch (error) {
    console.error('Personalization error:', error);
    return NextResponse.json(
      { error: 'Failed to generate personalized content', details: error.message },
      { status: 500 }
    );
  }
}

// GET endpoint for batch personalization
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const tier = searchParams.get('tier') || '1';
    const touchNumber = searchParams.get('touch') || '1';

    // Return personalization strategy guide based on tier
    const strategies = {
      '1': {
        tier: 'High-Value Targets',
        approaches: [
          'Personalized video messages (30-45 seconds)',
          'Handwritten notes with relevant resources',
          'Custom research reports specific to their company',
          '1:1 executive outreach from leadership',
          'Thoughtful gifts under $50 (books, local items)',
          'Personal introductions to valuable connections',
        ],
        touchSequence: {
          1: 'Hyper-personalized email with industry insight',
          2: 'LinkedIn connection with personal note',
          3: 'Personalized video message',
          4: 'Phone call',
          5: 'Handwritten note + resource',
          6: 'Custom research report',
          7: 'Executive intro call',
          8: 'Case study + webinar invite',
          9: 'Gift delivery',
          10: 'Strategic introduction',
          11: 'Executive-level outreach',
          12: 'Creative close email',
        },
        expectedConversion: '40-50%',
      },
      '2': {
        tier: 'Strong Potential',
        approaches: [
          'Deep personalized emails with specific research',
          'Phone calls at optimal times',
          'Relevant case studies from their industry',
          'Active LinkedIn engagement',
          'Targeted webinar invitations',
          'Resource packages tailored to their challenges',
        ],
        touchSequence: {
          1: 'Personalized email with value',
          2: 'LinkedIn connection',
          3: 'Industry-relevant article',
          4: 'Phone call',
          5: 'Case study delivery',
          6: 'Webinar invitation',
          7: 'Phone follow-up',
          8: 'Resource package',
          9: 'LinkedIn engagement',
          10: 'Executive outreach',
          11: 'Final value offer',
          12: 'Permission-to-close email',
        },
        expectedConversion: '25-35%',
      },
      '3': {
        tier: 'Standard Nurture',
        approaches: [
          'Personalized email templates (company-specific)',
          'Automated value sequences',
          'Social media engagement',
          'Newsletter inclusion with personalized intro',
          'Quarterly check-ins',
          'Event invitations',
        ],
        touchSequence: {
          1: 'Personalized intro email',
          2: 'LinkedIn connection',
          3: 'Value content share',
          4: 'Newsletter + personal note',
          5: 'Case study',
          6: 'Phone outreach',
          7: 'Webinar invite',
          8: 'Resource delivery',
          9: 'Social engagement',
          10: 'Event invitation',
          11: 'Final offer',
          12: 'Close-file email',
        },
        expectedConversion: '15-20%',
      },
    };

    return NextResponse.json({
      strategy: strategies[tier] || strategies['1'],
      currentTouch: touchNumber,
      researchBasis:
        'Based on Salesforce research: 8 touches needed for qualified leads, 80% of sales happen between touches 5-12',
    });
  } catch (error) {
    console.error('Strategy fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch strategy', details: error.message },
      { status: 500 }
    );
  }
}
