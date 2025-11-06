import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

// GET all deals
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const contact_id = searchParams.get('contact_id');
    const stage = searchParams.get('stage');
    const status = searchParams.get('status');
    const limit = searchParams.get('limit') || '100';
    const offset = searchParams.get('offset') || '0';

    let query;
    const conditions = [];
    const params = [];

    if (contact_id) {
      conditions.push('d.contact_id = $' + (params.length + 1));
      params.push(contact_id);
    }

    if (stage) {
      conditions.push('d.stage = $' + (params.length + 1));
      params.push(stage);
    }

    if (status) {
      conditions.push('d.status = $' + (params.length + 1));
      params.push(status);
    }

    const whereClause = conditions.length > 0 ? 'WHERE ' + conditions.join(' AND ') : '';

    if (contact_id && stage && status) {
      query = sql`
        SELECT d.*, c.contact_name, c.company, c.email
        FROM deals d
        LEFT JOIN contacts c ON d.contact_id = c.id
        WHERE d.contact_id = ${contact_id}
          AND d.stage = ${stage}
          AND d.status = ${status}
        ORDER BY d.created_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `;
    } else if (contact_id && stage) {
      query = sql`
        SELECT d.*, c.contact_name, c.company, c.email
        FROM deals d
        LEFT JOIN contacts c ON d.contact_id = c.id
        WHERE d.contact_id = ${contact_id} AND d.stage = ${stage}
        ORDER BY d.created_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `;
    } else if (contact_id && status) {
      query = sql`
        SELECT d.*, c.contact_name, c.company, c.email
        FROM deals d
        LEFT JOIN contacts c ON d.contact_id = c.id
        WHERE d.contact_id = ${contact_id} AND d.status = ${status}
        ORDER BY d.created_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `;
    } else if (stage && status) {
      query = sql`
        SELECT d.*, c.contact_name, c.company, c.email
        FROM deals d
        LEFT JOIN contacts c ON d.contact_id = c.id
        WHERE d.stage = ${stage} AND d.status = ${status}
        ORDER BY d.created_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `;
    } else if (contact_id) {
      query = sql`
        SELECT d.*, c.contact_name, c.company, c.email
        FROM deals d
        LEFT JOIN contacts c ON d.contact_id = c.id
        WHERE d.contact_id = ${contact_id}
        ORDER BY d.created_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `;
    } else if (stage) {
      query = sql`
        SELECT d.*, c.contact_name, c.company, c.email
        FROM deals d
        LEFT JOIN contacts c ON d.contact_id = c.id
        WHERE d.stage = ${stage}
        ORDER BY d.created_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `;
    } else if (status) {
      query = sql`
        SELECT d.*, c.contact_name, c.company, c.email
        FROM deals d
        LEFT JOIN contacts c ON d.contact_id = c.id
        WHERE d.status = ${status}
        ORDER BY d.created_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `;
    } else {
      query = sql`
        SELECT d.*, c.contact_name, c.company, c.email
        FROM deals d
        LEFT JOIN contacts c ON d.contact_id = c.id
        ORDER BY d.created_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `;
    }

    const { rows } = await query;

    return NextResponse.json({
      success: true,
      data: rows,
    });
  } catch (error) {
    console.error('Error fetching deals:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch deals', message: error.message },
      { status: 500 }
    );
  }
}

// POST new deal
export async function POST(request) {
  try {
    const body = await request.json();
    const { contact_id, title, value, stage, status, description, expected_close_date } = body;

    // Validate required fields
    if (!contact_id) {
      return NextResponse.json(
        { success: false, error: 'contact_id is required' },
        { status: 400 }
      );
    }

    if (!title) {
      return NextResponse.json(
        { success: false, error: 'Deal title is required' },
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

    // Insert new deal
    const { rows } = await sql`
      INSERT INTO deals (
        contact_id,
        title,
        value,
        stage,
        status,
        description,
        expected_close_date,
        created_at,
        updated_at
      )
      VALUES (
        ${contact_id},
        ${title},
        ${value || 0},
        ${stage || 'prospecting'},
        ${status || 'open'},
        ${description || null},
        ${expected_close_date || null},
        NOW(),
        NOW()
      )
      RETURNING *
    `;

    return NextResponse.json(
      {
        success: true,
        message: 'Deal created successfully',
        data: rows[0],
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating deal:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create deal', message: error.message },
      { status: 500 }
    );
  }
}
