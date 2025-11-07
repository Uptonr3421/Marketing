import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

// POST new activity
export async function POST(request) {
  try {
    const body = await request.json();
    const { contact_id, type, description, date, notes } = body;

    // Validate required fields
    if (!contact_id) {
      return NextResponse.json(
        { success: false, error: 'contact_id is required' },
        { status: 400 }
      );
    }

    if (!type) {
      return NextResponse.json(
        { success: false, error: 'Activity type is required' },
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

    // Insert new activity
    const { rows } = await sql`
      INSERT INTO activities (
        contact_id,
        type,
        description,
        date,
        notes,
        created_at
      )
      VALUES (
        ${contact_id},
        ${type},
        ${description || null},
        ${date || 'NOW()'},
        ${notes || null},
        NOW()
      )
      RETURNING *
    `;

    return NextResponse.json(
      {
        success: true,
        message: 'Activity created successfully',
        data: rows[0],
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating activity:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create activity', message: error.message },
      { status: 500 }
    );
  }
}

// GET all activities (optional - for listing all activities across all contacts)
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const contact_id = searchParams.get('contact_id');
    const type = searchParams.get('type');
    const limit = searchParams.get('limit') || '100';
    const offset = searchParams.get('offset') || '0';

    let query;

    if (contact_id && type) {
      query = sql`
        SELECT a.*, c.contact_name, c.company, c.email
        FROM activities a
        LEFT JOIN contacts c ON a.contact_id = c.id
        WHERE a.contact_id = ${contact_id} AND a.type = ${type}
        ORDER BY a.date DESC, a.created_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `;
    } else if (contact_id) {
      query = sql`
        SELECT a.*, c.contact_name, c.company, c.email
        FROM activities a
        LEFT JOIN contacts c ON a.contact_id = c.id
        WHERE a.contact_id = ${contact_id}
        ORDER BY a.date DESC, a.created_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `;
    } else if (type) {
      query = sql`
        SELECT a.*, c.contact_name, c.company, c.email
        FROM activities a
        LEFT JOIN contacts c ON a.contact_id = c.id
        WHERE a.type = ${type}
        ORDER BY a.date DESC, a.created_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `;
    } else {
      query = sql`
        SELECT a.*, c.contact_name, c.company, c.email
        FROM activities a
        LEFT JOIN contacts c ON a.contact_id = c.id
        ORDER BY a.date DESC, a.created_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `;
    }

    const { rows } = await query;

    return NextResponse.json({
      success: true,
      data: rows,
    });
  } catch (error) {
    console.error('Error fetching activities:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch activities', message: error.message },
      { status: 500 }
    );
  }
}
