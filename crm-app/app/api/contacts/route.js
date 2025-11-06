import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

// GET all contacts
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit') || '100';
    const offset = searchParams.get('offset') || '0';
    const search = searchParams.get('search') || '';

    let query;
    if (search) {
      query = sql`
        SELECT * FROM contacts
        WHERE contact_name ILIKE ${'%' + search + '%'}
           OR company ILIKE ${'%' + search + '%'}
           OR email ILIKE ${'%' + search + '%'}
        ORDER BY created_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `;
    } else {
      query = sql`
        SELECT * FROM contacts
        ORDER BY created_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `;
    }

    const { rows } = await query;

    // Get total count
    const countQuery = search
      ? sql`
          SELECT COUNT(*) FROM contacts
          WHERE contact_name ILIKE ${'%' + search + '%'}
             OR company ILIKE ${'%' + search + '%'}
             OR email ILIKE ${'%' + search + '%'}
        `
      : sql`SELECT COUNT(*) FROM contacts`;

    const { rows: countRows } = await countQuery;
    const total = parseInt(countRows[0].count);

    return NextResponse.json({
      success: true,
      data: rows,
      pagination: {
        total,
        limit: parseInt(limit),
        offset: parseInt(offset),
      },
    });
  } catch (error) {
    console.error('Error fetching contacts:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch contacts', message: error.message },
      { status: 500 }
    );
  }
}

// POST new contact
export async function POST(request) {
  try {
    const body = await request.json();
    const {
      contact_name,
      title,
      company,
      company_website,
      linkedin_url,
      activity_level,
      top_skills,
      email,
    } = body;

    // Validate required fields
    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email is required' },
        { status: 400 }
      );
    }

    // Check if contact already exists
    const existingContact = await sql`
      SELECT id FROM contacts WHERE email = ${email}
    `;

    if (existingContact.rows.length > 0) {
      return NextResponse.json(
        { success: false, error: 'Contact with this email already exists' },
        { status: 409 }
      );
    }

    // Insert new contact
    const { rows } = await sql`
      INSERT INTO contacts (
        contact_name,
        title,
        company,
        company_website,
        linkedin_url,
        activity_level,
        top_skills,
        email,
        created_at,
        updated_at
      )
      VALUES (
        ${contact_name || null},
        ${title || null},
        ${company || null},
        ${company_website || null},
        ${linkedin_url || null},
        ${activity_level || null},
        ${top_skills || null},
        ${email},
        NOW(),
        NOW()
      )
      RETURNING *
    `;

    return NextResponse.json(
      {
        success: true,
        message: 'Contact created successfully',
        data: rows[0],
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating contact:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create contact', message: error.message },
      { status: 500 }
    );
  }
}
