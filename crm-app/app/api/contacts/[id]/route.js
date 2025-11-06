import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

// GET single contact with activities and deals
export async function GET(request, { params }) {
  try {
    const { id } = params;

    // Validate ID
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { success: false, error: 'Valid contact ID is required' },
        { status: 400 }
      );
    }

    // Get contact details
    const { rows: contactRows } = await sql`
      SELECT * FROM contacts WHERE id = ${id}
    `;

    if (contactRows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Contact not found' },
        { status: 404 }
      );
    }

    // Get associated activities
    const { rows: activityRows } = await sql`
      SELECT * FROM activities
      WHERE contact_id = ${id}
      ORDER BY date DESC, created_at DESC
    `;

    // Get associated deals
    const { rows: dealRows } = await sql`
      SELECT * FROM deals
      WHERE contact_id = ${id}
      ORDER BY created_at DESC
    `;

    const contact = {
      ...contactRows[0],
      activities: activityRows,
      deals: dealRows,
    };

    return NextResponse.json({
      success: true,
      data: contact,
    });
  } catch (error) {
    console.error('Error fetching contact:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch contact', message: error.message },
      { status: 500 }
    );
  }
}

// PUT update contact
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();

    // Validate ID
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { success: false, error: 'Valid contact ID is required' },
        { status: 400 }
      );
    }

    // Check if contact exists
    const { rows: existingContact } = await sql`
      SELECT id FROM contacts WHERE id = ${id}
    `;

    if (existingContact.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Contact not found' },
        { status: 404 }
      );
    }

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

    // If email is being changed, check for duplicates
    if (email) {
      const { rows: emailCheck } = await sql`
        SELECT id FROM contacts WHERE email = ${email} AND id != ${id}
      `;

      if (emailCheck.length > 0) {
        return NextResponse.json(
          { success: false, error: 'Another contact with this email already exists' },
          { status: 409 }
        );
      }
    }

    // Build dynamic update query
    const updateFields = [];
    const values = [];

    if (contact_name !== undefined) {
      updateFields.push('contact_name = $' + (values.length + 1));
      values.push(contact_name);
    }
    if (title !== undefined) {
      updateFields.push('title = $' + (values.length + 1));
      values.push(title);
    }
    if (company !== undefined) {
      updateFields.push('company = $' + (values.length + 1));
      values.push(company);
    }
    if (company_website !== undefined) {
      updateFields.push('company_website = $' + (values.length + 1));
      values.push(company_website);
    }
    if (linkedin_url !== undefined) {
      updateFields.push('linkedin_url = $' + (values.length + 1));
      values.push(linkedin_url);
    }
    if (activity_level !== undefined) {
      updateFields.push('activity_level = $' + (values.length + 1));
      values.push(activity_level);
    }
    if (top_skills !== undefined) {
      updateFields.push('top_skills = $' + (values.length + 1));
      values.push(top_skills);
    }
    if (email !== undefined) {
      updateFields.push('email = $' + (values.length + 1));
      values.push(email);
    }

    // Always update the updated_at timestamp
    updateFields.push('updated_at = NOW()');

    if (updateFields.length === 1) {
      // Only updated_at would be updated, meaning no actual changes
      return NextResponse.json(
        { success: false, error: 'No fields to update' },
        { status: 400 }
      );
    }

    // Update contact
    const { rows } = await sql`
      UPDATE contacts
      SET
        contact_name = ${contact_name !== undefined ? contact_name : sql`contact_name`},
        title = ${title !== undefined ? title : sql`title`},
        company = ${company !== undefined ? company : sql`company`},
        company_website = ${company_website !== undefined ? company_website : sql`company_website`},
        linkedin_url = ${linkedin_url !== undefined ? linkedin_url : sql`linkedin_url`},
        activity_level = ${activity_level !== undefined ? activity_level : sql`activity_level`},
        top_skills = ${top_skills !== undefined ? top_skills : sql`top_skills`},
        email = ${email !== undefined ? email : sql`email`},
        updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `;

    return NextResponse.json({
      success: true,
      message: 'Contact updated successfully',
      data: rows[0],
    });
  } catch (error) {
    console.error('Error updating contact:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update contact', message: error.message },
      { status: 500 }
    );
  }
}
