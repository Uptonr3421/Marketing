# API Documentation - Bespoke Ethos CRM Platform

Complete API reference for the Bespoke Ethos CRM Platform, including Claude AI integration endpoints.

## Base URL

**Development:** `http://localhost:3000`
**Production:** `https://your-domain.vercel.app`

## Authentication

All API endpoints require authentication via NextAuth.js session cookies or API tokens.

### Session Authentication

Include session cookie in requests (handled automatically by browser).

### API Token Authentication

Include in headers:
```
Authorization: Bearer YOUR_API_TOKEN
```

---

## Contacts API

### List All Contacts

Retrieve a paginated list of all contacts.

**Endpoint:** `GET /api/contacts`

**Query Parameters:**
- `page` (number, optional): Page number (default: 1)
- `limit` (number, optional): Items per page (default: 50, max: 100)
- `search` (string, optional): Search query for name, email, or company
- `company` (string, optional): Filter by company name
- `activity_level` (string, optional): Filter by activity level

**Request Example:**
```bash
curl -X GET "https://your-domain.vercel.app/api/contacts?page=1&limit=20&search=Akron" \
  -H "Authorization: Bearer YOUR_API_TOKEN"
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "contacts": [
      {
        "id": 1,
        "contact_name": "John Doe",
        "title": "Marketing Director",
        "company": "Akron Art Museum",
        "company_website": "https://akronartmuseum.org",
        "linkedin_url": "https://linkedin.com/in/johndoe",
        "activity_level": "high",
        "top_skills": "Marketing, Strategy, Leadership",
        "email": "jdoe@akronartmuseum.org",
        "created_at": "2025-01-15T10:30:00Z",
        "updated_at": "2025-01-15T10:30:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 150,
      "totalPages": 8
    }
  }
}
```

### Get Contact by ID

Retrieve a single contact by ID.

**Endpoint:** `GET /api/contacts/[id]`

**Path Parameters:**
- `id` (number): Contact ID

**Request Example:**
```bash
curl -X GET "https://your-domain.vercel.app/api/contacts/123" \
  -H "Authorization: Bearer YOUR_API_TOKEN"
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": 123,
    "contact_name": "Jane Smith",
    "title": "CEO",
    "company": "Tech Solutions Inc",
    "company_website": "https://techsolutions.com",
    "linkedin_url": "https://linkedin.com/in/janesmith",
    "activity_level": "medium",
    "top_skills": "Leadership, Technology, Innovation",
    "email": "jane@techsolutions.com",
    "created_at": "2025-01-10T14:20:00Z",
    "updated_at": "2025-01-12T09:15:00Z"
  }
}
```

**Error Response (404 Not Found):**
```json
{
  "success": false,
  "error": "Contact not found"
}
```

### Create Contact

Create a new contact.

**Endpoint:** `POST /api/contacts`

**Request Body:**
```json
{
  "contact_name": "John Doe",
  "title": "Marketing Director",
  "company": "Acme Corp",
  "company_website": "https://acme.com",
  "linkedin_url": "https://linkedin.com/in/johndoe",
  "activity_level": "high",
  "top_skills": "Marketing, Strategy",
  "email": "john@acme.com"
}
```

**Request Example:**
```bash
curl -X POST "https://your-domain.vercel.app/api/contacts" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -d '{
    "contact_name": "John Doe",
    "title": "Marketing Director",
    "company": "Acme Corp",
    "email": "john@acme.com"
  }'
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": 456,
    "contact_name": "John Doe",
    "title": "Marketing Director",
    "company": "Acme Corp",
    "company_website": "https://acme.com",
    "linkedin_url": "https://linkedin.com/in/johndoe",
    "activity_level": "high",
    "top_skills": "Marketing, Strategy",
    "email": "john@acme.com",
    "created_at": "2025-01-15T10:30:00Z",
    "updated_at": "2025-01-15T10:30:00Z"
  }
}
```

**Error Response (400 Bad Request):**
```json
{
  "success": false,
  "error": "Validation failed",
  "details": {
    "email": "Email is required and must be valid"
  }
}
```

### Update Contact

Update an existing contact.

**Endpoint:** `PUT /api/contacts/[id]`

**Path Parameters:**
- `id` (number): Contact ID

**Request Body:** (partial updates supported)
```json
{
  "title": "Senior Marketing Director",
  "activity_level": "very high"
}
```

**Request Example:**
```bash
curl -X PUT "https://your-domain.vercel.app/api/contacts/456" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -d '{
    "title": "Senior Marketing Director",
    "activity_level": "very high"
  }'
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": 456,
    "contact_name": "John Doe",
    "title": "Senior Marketing Director",
    "company": "Acme Corp",
    "activity_level": "very high",
    "email": "john@acme.com",
    "updated_at": "2025-01-15T11:45:00Z"
  }
}
```

### Delete Contact

Delete a contact.

**Endpoint:** `DELETE /api/contacts/[id]`

**Path Parameters:**
- `id` (number): Contact ID

**Request Example:**
```bash
curl -X DELETE "https://your-domain.vercel.app/api/contacts/456" \
  -H "Authorization: Bearer YOUR_API_TOKEN"
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Contact deleted successfully"
}
```

---

## Claude AI Agent API

### Chat with AI Agent

Interact with Claude AI to query and analyze contact data using natural language.

**Endpoint:** `POST /api/ai/chat`

**Request Body:**
```json
{
  "message": "Show me all contacts from Akron who work in marketing",
  "context": {
    "filters": {},
    "history": []
  }
}
```

**Request Example:**
```bash
curl -X POST "https://your-domain.vercel.app/api/ai/chat" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -d '{
    "message": "Show me all contacts from Akron who work in marketing"
  }'
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "response": "I found 15 contacts from Akron in marketing roles. Here are the top results:\n\n1. John Doe - Marketing Director at Akron Art Museum\n2. Jane Smith - Marketing Manager at Akron AIDS Collaborative\n...",
    "contacts": [
      {
        "id": 1,
        "contact_name": "John Doe",
        "title": "Marketing Director",
        "company": "Akron Art Museum",
        "email": "jdoe@akronartmuseum.org"
      }
    ],
    "suggestions": [
      "Would you like to send a bulk email to these contacts?",
      "I can help you analyze their activity levels"
    ]
  }
}
```

### Analyze Contacts

Use Claude AI to analyze contact data and provide insights.

**Endpoint:** `POST /api/ai/analyze`

**Request Body:**
```json
{
  "type": "company_distribution",
  "filters": {
    "company": "Akron Art Museum"
  }
}
```

**Analysis Types:**
- `company_distribution`: Analyze contacts by company
- `activity_trends`: Analyze activity levels over time
- `engagement_score`: Calculate engagement scores
- `segment_analysis`: Analyze contact segments

**Request Example:**
```bash
curl -X POST "https://your-domain.vercel.app/api/ai/analyze" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -d '{
    "type": "company_distribution",
    "filters": {}
  }'
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "analysis": {
      "summary": "Your database contains contacts from 45 different companies. The top 5 companies account for 60% of all contacts.",
      "insights": [
        "Akron Art Museum has the most contacts (23 total)",
        "Technology sector is underrepresented (only 12%)",
        "Most contacts have 'high' activity levels (65%)"
      ],
      "recommendations": [
        "Consider expanding outreach to technology companies",
        "Segment contacts by activity level for targeted campaigns",
        "Create dedicated workflows for top 5 companies"
      ]
    },
    "data": {
      "companies": [
        { "name": "Akron Art Museum", "count": 23 },
        { "name": "Akron AIDS Collaborative", "count": 18 }
      ]
    }
  }
}
```

### Get AI Suggestions

Get AI-powered suggestions for contact outreach and engagement.

**Endpoint:** `POST /api/ai/suggest`

**Request Body:**
```json
{
  "contact_id": 123,
  "type": "outreach"
}
```

**Suggestion Types:**
- `outreach`: Email outreach suggestions
- `follow_up`: Follow-up timing and content
- `engagement`: Engagement strategies
- `segmentation`: Contact segmentation ideas

**Request Example:**
```bash
curl -X POST "https://your-domain.vercel.app/api/ai/suggest" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -d '{
    "contact_id": 123,
    "type": "outreach"
  }'
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "suggestions": [
      {
        "title": "Personalized Email Subject",
        "content": "Following up on our conversation about marketing automation",
        "reasoning": "Based on their role as Marketing Director and company focus"
      },
      {
        "title": "Best Time to Contact",
        "content": "Tuesday or Wednesday, 10 AM - 2 PM",
        "reasoning": "Analysis of past interaction patterns"
      },
      {
        "title": "Relevant Topics",
        "content": "Digital transformation, Marketing ROI, AI in marketing",
        "reasoning": "Aligned with their skills and industry trends"
      }
    ]
  }
}
```

---

## Import/Export API

### Import Contacts from CSV

Bulk import contacts from CSV file.

**Endpoint:** `POST /api/import/csv`

**Request:** Multipart form data

**Form Fields:**
- `file`: CSV file (required)
- `skipDuplicates`: Boolean (optional, default: true)
- `updateExisting`: Boolean (optional, default: false)

**CSV Format:**
```csv
Contact_Name,Title,Company,Company_Website,LinkedIn_URL,Activity_Level,Top_Skills,Email
John Doe,Director,Acme Corp,https://acme.com,https://linkedin.com/in/johndoe,high,"Marketing, Strategy",john@acme.com
```

**Request Example:**
```bash
curl -X POST "https://your-domain.vercel.app/api/import/csv" \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -F "file=@contacts.csv" \
  -F "skipDuplicates=true"
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "imported": 245,
    "skipped": 12,
    "errors": 3,
    "details": {
      "duplicates": 12,
      "invalid_emails": 3
    }
  }
}
```

### Export Contacts to CSV

Export all contacts to CSV file.

**Endpoint:** `GET /api/export/csv`

**Query Parameters:**
- `filters` (string, optional): JSON string of filters to apply

**Request Example:**
```bash
curl -X GET "https://your-domain.vercel.app/api/export/csv?filters={\"company\":\"Akron\"}" \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -o contacts.csv
```

**Response:** CSV file download

---

## Activities API

Track and manage contact activities (emails, calls, meetings).

### Log Activity

**Endpoint:** `POST /api/activities`

**Request Body:**
```json
{
  "contact_id": 123,
  "type": "email",
  "subject": "Follow-up on proposal",
  "notes": "Sent proposal for Q2 marketing campaign",
  "date": "2025-01-15T14:30:00Z"
}
```

**Activity Types:**
- `email`: Email sent/received
- `call`: Phone call
- `meeting`: In-person or virtual meeting
- `note`: General note

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": 789,
    "contact_id": 123,
    "type": "email",
    "subject": "Follow-up on proposal",
    "notes": "Sent proposal for Q2 marketing campaign",
    "date": "2025-01-15T14:30:00Z",
    "created_at": "2025-01-15T14:30:00Z"
  }
}
```

### Get Contact Activities

**Endpoint:** `GET /api/contacts/[id]/activities`

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": 789,
      "type": "email",
      "subject": "Follow-up on proposal",
      "date": "2025-01-15T14:30:00Z"
    }
  ]
}
```

---

## Claude AI Integration Guide

### Setting Up Claude AI

1. **Get API Key:**
   - Sign up at [console.anthropic.com](https://console.anthropic.com)
   - Create an API key
   - Add to Vercel environment variables: `ANTHROPIC_API_KEY`

2. **Install SDK:**
```bash
npm install @anthropic-ai/sdk
```

3. **Initialize Client:**
```typescript
// lib/ai/claude.ts
import Anthropic from '@anthropic-ai/sdk';

export const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});
```

### Basic Usage Example

```typescript
// app/api/ai/chat/route.ts
import { anthropic } from '@/lib/ai/claude';
import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs'; // Claude API needs Node.js runtime

export async function POST(request: Request) {
  const { message } = await request.json();

  // Get relevant contacts from database
  const contacts = await sql`
    SELECT * FROM contacts
    WHERE company LIKE ${`%${message}%`}
    OR contact_name LIKE ${`%${message}%`}
    LIMIT 10
  `;

  // Create context for Claude
  const context = `
You are a CRM assistant. Here are the relevant contacts:
${JSON.stringify(contacts.rows, null, 2)}

User question: ${message}
`;

  // Call Claude API
  const response = await anthropic.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 1024,
    messages: [
      {
        role: 'user',
        content: context,
      },
    ],
  });

  return NextResponse.json({
    success: true,
    data: {
      response: response.content[0].text,
      contacts: contacts.rows,
    },
  });
}
```

### Advanced: Streaming Responses

```typescript
import { anthropic } from '@/lib/ai/claude';

export async function POST(request: Request) {
  const { message } = await request.json();

  const stream = await anthropic.messages.stream({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 1024,
    messages: [{ role: 'user', content: message }],
  });

  // Stream response to client
  return new Response(
    new ReadableStream({
      async start(controller) {
        for await (const chunk of stream) {
          if (chunk.type === 'content_block_delta') {
            controller.enqueue(
              new TextEncoder().encode(chunk.delta.text)
            );
          }
        }
        controller.close();
      },
    }),
    {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    }
  );
}
```

### Tool Use (Function Calling)

```typescript
const tools = [
  {
    name: 'search_contacts',
    description: 'Search for contacts in the CRM database',
    input_schema: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'Search query for name, company, or email',
        },
        filters: {
          type: 'object',
          description: 'Optional filters like company or activity level',
        },
      },
      required: ['query'],
    },
  },
];

const response = await anthropic.messages.create({
  model: 'claude-3-5-sonnet-20241022',
  max_tokens: 1024,
  tools: tools,
  messages: [
    {
      role: 'user',
      content: 'Find all contacts from Akron with high activity',
    },
  ],
});

// Handle tool use
if (response.stop_reason === 'tool_use') {
  const toolUse = response.content.find((block) => block.type === 'tool_use');

  if (toolUse.name === 'search_contacts') {
    // Execute the tool
    const results = await searchContacts(toolUse.input);

    // Send results back to Claude
    const finalResponse = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: 'Find all contacts from Akron with high activity',
        },
        {
          role: 'assistant',
          content: response.content,
        },
        {
          role: 'user',
          content: [
            {
              type: 'tool_result',
              tool_use_id: toolUse.id,
              content: JSON.stringify(results),
            },
          ],
        },
      ],
    });
  }
}
```

### Best Practices

1. **Context Management:**
   - Limit contact data sent to Claude (use top 10-20 most relevant)
   - Summarize large datasets before sending
   - Use pagination for large result sets

2. **Error Handling:**
```typescript
try {
  const response = await anthropic.messages.create({...});
} catch (error) {
  if (error.status === 429) {
    // Rate limit - implement retry logic
  } else if (error.status === 500) {
    // Server error - log and return fallback
  }
}
```

3. **Caching (for similar queries):**
```typescript
import { Redis } from '@vercel/kv';

const cacheKey = `ai:response:${hash(message)}`;
const cached = await Redis.get(cacheKey);

if (cached) {
  return NextResponse.json(cached);
}

// Make Claude API call
const response = await anthropic.messages.create({...});

// Cache for 1 hour
await Redis.set(cacheKey, response, { ex: 3600 });
```

4. **Rate Limiting:**
   - Implement request throttling
   - Use Vercel Edge Config for rate limits
   - Consider user tiers for API access

---

## Error Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request (validation error) |
| 401 | Unauthorized (missing/invalid auth) |
| 403 | Forbidden (insufficient permissions) |
| 404 | Not Found |
| 429 | Too Many Requests (rate limited) |
| 500 | Internal Server Error |
| 503 | Service Unavailable |

## Rate Limits

- **Contacts API:** 100 requests/minute per user
- **AI Chat API:** 20 requests/minute per user
- **Import/Export:** 5 requests/minute per user

## Webhooks (Coming Soon)

Subscribe to events:
- `contact.created`
- `contact.updated`
- `contact.deleted`
- `activity.logged`

---

**API Version:** v1
**Last Updated:** November 2025
**Support:** For API issues, contact support@bespokeethos.com
