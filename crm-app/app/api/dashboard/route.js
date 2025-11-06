import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

// GET dashboard statistics
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const timeframe = searchParams.get('timeframe') || 'all'; // all, today, week, month, year

    let dateFilter = '';

    switch (timeframe) {
      case 'today':
        dateFilter = "AND created_at >= CURRENT_DATE";
        break;
      case 'week':
        dateFilter = "AND created_at >= CURRENT_DATE - INTERVAL '7 days'";
        break;
      case 'month':
        dateFilter = "AND created_at >= CURRENT_DATE - INTERVAL '30 days'";
        break;
      case 'year':
        dateFilter = "AND created_at >= CURRENT_DATE - INTERVAL '1 year'";
        break;
      default:
        dateFilter = '';
    }

    // Get total contacts
    const totalContactsQuery = dateFilter
      ? sql`SELECT COUNT(*) as count FROM contacts WHERE 1=1 ${sql.raw(dateFilter)}`
      : sql`SELECT COUNT(*) as count FROM contacts`;

    const { rows: totalContactsResult } = await totalContactsQuery;
    const totalContacts = parseInt(totalContactsResult[0].count);

    // Get DMs sent (activities with type 'dm' or 'message')
    const dmsSentQuery = dateFilter
      ? sql`
          SELECT COUNT(*) as count FROM activities
          WHERE type IN ('dm', 'message', 'email') ${sql.raw(dateFilter)}
        `
      : sql`
          SELECT COUNT(*) as count FROM activities
          WHERE type IN ('dm', 'message', 'email')
        `;

    const { rows: dmsSentResult } = await dmsSentQuery;
    const dmsSent = parseInt(dmsSentResult[0].count);

    // Get replies (activities with type 'reply' or 'response')
    const repliesQuery = dateFilter
      ? sql`
          SELECT COUNT(*) as count FROM activities
          WHERE type IN ('reply', 'response', 'received') ${sql.raw(dateFilter)}
        `
      : sql`
          SELECT COUNT(*) as count FROM activities
          WHERE type IN ('reply', 'response', 'received')
        `;

    const { rows: repliesResult } = await repliesQuery;
    const replies = parseInt(repliesResult[0].count);

    // Get deals closed (deals with status 'closed' or 'won')
    const dealsClosedQuery = dateFilter
      ? sql`
          SELECT COUNT(*) as count, COALESCE(SUM(value), 0) as total_value
          FROM deals
          WHERE status IN ('closed', 'won') ${sql.raw(dateFilter)}
        `
      : sql`
          SELECT COUNT(*) as count, COALESCE(SUM(value), 0) as total_value
          FROM deals
          WHERE status IN ('closed', 'won')
        `;

    const { rows: dealsClosedResult } = await dealsClosedQuery;
    const dealsClosed = parseInt(dealsClosedResult[0].count);
    const totalDealValue = parseFloat(dealsClosedResult[0].total_value);

    // Get open deals count
    const openDealsQuery = dateFilter
      ? sql`
          SELECT COUNT(*) as count, COALESCE(SUM(value), 0) as total_value
          FROM deals
          WHERE status = 'open' ${sql.raw(dateFilter)}
        `
      : sql`
          SELECT COUNT(*) as count, COALESCE(SUM(value), 0) as total_value
          FROM deals
          WHERE status = 'open'
        `;

    const { rows: openDealsResult } = await openDealsQuery;
    const openDeals = parseInt(openDealsResult[0].count);
    const openDealValue = parseFloat(openDealsResult[0].total_value);

    // Get recent activities (last 10)
    const { rows: recentActivities } = await sql`
      SELECT a.*, c.contact_name, c.company
      FROM activities a
      LEFT JOIN contacts c ON a.contact_id = c.id
      ORDER BY a.created_at DESC
      LIMIT 10
    `;

    // Get conversion rate
    const conversionRate = dmsSent > 0 ? ((replies / dmsSent) * 100).toFixed(2) : 0;

    // Get close rate
    const totalDeals = dealsClosed + openDeals;
    const closeRate = totalDeals > 0 ? ((dealsClosed / totalDeals) * 100).toFixed(2) : 0;

    return NextResponse.json({
      success: true,
      data: {
        overview: {
          totalContacts,
          dmsSent,
          replies,
          dealsClosed,
          conversionRate: parseFloat(conversionRate),
          closeRate: parseFloat(closeRate),
        },
        deals: {
          closed: dealsClosed,
          open: openDeals,
          totalValue: totalDealValue,
          openValue: openDealValue,
        },
        recentActivities,
        timeframe,
      },
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch dashboard statistics', message: error.message },
      { status: 500 }
    );
  }
}
