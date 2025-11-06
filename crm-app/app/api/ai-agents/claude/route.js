import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

// POST endpoint for Claude to submit research data
export async function POST(request) {
  try {
    const body = await request.json();
    const {
      contact_id,
      research_type,
      research_data,
      summary,
      confidence_score,
      sources,
      metadata,
    } = body;

    // Validate required fields
    if (!contact_id) {
      return NextResponse.json(
        { success: false, error: 'contact_id is required' },
        { status: 400 }
      );
    }

    if (!research_data) {
      return NextResponse.json(
        { success: false, error: 'research_data is required' },
        { status: 400 }
      );
    }

    // Verify contact exists
    const { rows: contactCheck } = await sql`
      SELECT id, contact_name, company FROM contacts WHERE id = ${contact_id}
    `;

    if (contactCheck.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Contact not found' },
        { status: 404 }
      );
    }

    const contact = contactCheck[0];

    // Insert AI research data
    const { rows } = await sql`
      INSERT INTO ai_research (
        contact_id,
        research_type,
        research_data,
        summary,
        confidence_score,
        sources,
        metadata,
        created_at
      )
      VALUES (
        ${contact_id},
        ${research_type || 'general'},
        ${JSON.stringify(research_data)},
        ${summary || null},
        ${confidence_score || null},
        ${sources ? JSON.stringify(sources) : null},
        ${metadata ? JSON.stringify(metadata) : null},
        NOW()
      )
      RETURNING *
    `;

    // Optionally create an activity log for this research
    await sql`
      INSERT INTO activities (
        contact_id,
        type,
        description,
        notes,
        date,
        created_at
      )
      VALUES (
        ${contact_id},
        'ai_research',
        ${`Claude AI completed ${research_type || 'general'} research`},
        ${summary || 'AI research data submitted'},
        NOW(),
        NOW()
      )
    `;

    return NextResponse.json(
      {
        success: true,
        message: 'Research data submitted successfully',
        data: {
          ...rows[0],
          contact: {
            id: contact.id,
            name: contact.contact_name,
            company: contact.company,
          },
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error submitting research data:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to submit research data', message: error.message },
      { status: 500 }
    );
  }
}

// GET endpoint to retrieve AI research for a contact
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const contact_id = searchParams.get('contact_id');
    const research_type = searchParams.get('research_type');
    const limit = searchParams.get('limit') || '50';

    if (!contact_id) {
      return NextResponse.json(
        { success: false, error: 'contact_id is required' },
        { status: 400 }
      );
    }

    // Verify contact exists
    const { rows: contactCheck } = await sql`
      SELECT id FROM contacts WHERE id = ${contact_id}
    `;

    if (contactCheck.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Contact not found' },
        { status: 404 }
      );
    }

    let query;

    if (research_type) {
      query = sql`
        SELECT * FROM ai_research
        WHERE contact_id = ${contact_id} AND research_type = ${research_type}
        ORDER BY created_at DESC
        LIMIT ${limit}
      `;
    } else {
      query = sql`
        SELECT * FROM ai_research
        WHERE contact_id = ${contact_id}
        ORDER BY created_at DESC
        LIMIT ${limit}
      `;
    }

    const { rows } = await query;

    // Parse JSON fields
    const parsedRows = rows.map((row) => ({
      ...row,
      research_data: typeof row.research_data === 'string' ? JSON.parse(row.research_data) : row.research_data,
      sources: row.sources && typeof row.sources === 'string' ? JSON.parse(row.sources) : row.sources,
      metadata: row.metadata && typeof row.metadata === 'string' ? JSON.parse(row.metadata) : row.metadata,
    }));

    return NextResponse.json({
      success: true,
      data: parsedRows,
    });
  } catch (error) {
    console.error('Error fetching AI research:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch AI research', message: error.message },
      { status: 500 }
    );
  }
}
