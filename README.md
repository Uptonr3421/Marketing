# Bespoke Ethos CRM Platform

A modern, AI-powered CRM platform built exclusively for Vercel's edge infrastructure, featuring Claude AI integration for intelligent contact management and marketing automation.

## Overview

Bespoke Ethos CRM is a serverless CRM solution designed to manage contacts, track interactions, and leverage AI for intelligent insights. The platform is built entirely on Vercel's infrastructure, utilizing Vercel Postgres for data storage and Vercel Edge Functions for API endpoints.

## Architecture

This platform uses a **Vercel-only architecture**:

- **Frontend**: Next.js 14+ (App Router) deployed on Vercel
- **Backend**: Vercel Serverless Functions (API Routes)
- **Database**: Vercel Postgres (powered by Neon)
- **AI Integration**: Claude API via Anthropic SDK
- **File Storage**: Vercel Blob Storage (for attachments/documents)
- **Authentication**: NextAuth.js with Vercel KV for session storage
- **Edge Runtime**: Vercel Edge Functions for global low-latency

All infrastructure runs on Vercel - no external services required except the Claude API.

## Tech Stack

- **Framework**: Next.js 14+ (App Router, React Server Components)
- **Language**: TypeScript
- **Database ORM**: Vercel Postgres SDK / Drizzle ORM
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn/ui
- **AI SDK**: Anthropic SDK (@anthropic-ai/sdk)
- **Authentication**: NextAuth.js v5
- **Validation**: Zod
- **State Management**: React Server Components + React Query
- **Deployment**: Vercel CLI

## Prerequisites

- Node.js 18.x or higher
- npm or pnpm
- Vercel account
- Anthropic API key (for Claude AI)

## Repository Structure

This repository uses a **subdirectory structure** for clean organization:

```
Marketing/
├── crm-app/              # Complete Next.js CRM application
│   ├── app/              # Next.js App Router
│   ├── components/       # React components
│   ├── lib/              # Utilities and database
│   ├── prisma/           # Database schema
│   ├── public/           # Static assets
│   └── package.json      # App dependencies
├── README.md             # This file
├── API_DOCS.md           # API documentation
├── DEPLOYMENT.md         # Deployment guide
├── vercel.json           # Vercel configuration
└── plexus_contacts - Sheet1.csv  # Contact data
```

**Important**: All CRM application code lives in `/crm-app`. Vercel is configured to build from this directory.

## Local Development Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd Marketing/crm-app
```

### 2. Install Dependencies

```bash
npm install
# or
pnpm install
```

### 3. Set Up Environment Variables

Create a `.env.local` file in the `/crm-app` directory:

```bash
# Database (Vercel Postgres)
POSTGRES_URL="postgres://..."
POSTGRES_PRISMA_URL="postgres://..."
POSTGRES_URL_NON_POOLING="postgres://..."
POSTGRES_USER="..."
POSTGRES_HOST="..."
POSTGRES_PASSWORD="..."
POSTGRES_DATABASE="..."

# Anthropic Claude API
ANTHROPIC_API_KEY="sk-ant-..."

# NextAuth.js
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"

# Vercel Blob Storage
BLOB_READ_WRITE_TOKEN="vercel_blob_..."

# App Configuration
NODE_ENV="development"
```

### 4. Link to Vercel Project (Recommended)

```bash
npm i -g vercel
vercel login
vercel link
vercel env pull .env.local
```

This automatically pulls your production environment variables.

### 5. Run Database Migrations

```bash
npm run db:migrate
```

### 6. Seed Database (Optional)

```bash
npm run db:seed
```

### 7. Start Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` to see the application.

## Package.json Scripts

Your `package.json` should include these scripts:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "type-check": "tsc --noEmit",
    "db:migrate": "node scripts/migrate.js",
    "db:seed": "node scripts/seed.js",
    "db:studio": "vercel env pull .env.local && drizzle-kit studio",
    "vercel-build": "next build"
  }
}
```

## Deployment to Vercel

### Quick Deploy

1. **Connect to GitHub**
   ```bash
   git push origin main
   ```

2. **Import to Vercel**
   - Visit [vercel.com/new](https://vercel.com/new)
   - Import your **Marketing** repository
   - Vercel will automatically detect `vercel.json` and build from `/crm-app`
   - Configure environment variables
   - Deploy

**Note**: The repository includes a `vercel.json` file that automatically configures Vercel to:
- Build from the `/crm-app` subdirectory
- Install dependencies from `/crm-app/package.json`
- Output to `/crm-app/.next`

No manual root directory configuration needed!

### CLI Deploy

```bash
# From repository root
vercel --prod
```

The Vercel CLI will automatically use the `vercel.json` configuration.

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

## Environment Variables

Required environment variables in Vercel:

| Variable | Description | Required |
|----------|-------------|----------|
| `POSTGRES_URL` | Vercel Postgres connection string | Yes |
| `ANTHROPIC_API_KEY` | Claude API key from Anthropic | Yes |
| `NEXTAUTH_SECRET` | Random secret for session encryption | Yes |
| `NEXTAUTH_URL` | Production URL (auto-set by Vercel) | Yes |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob storage token | Optional |

## API Endpoints

### Contacts

- `GET /api/contacts` - List all contacts (with pagination)
- `GET /api/contacts/[id]` - Get contact by ID
- `POST /api/contacts` - Create new contact
- `PUT /api/contacts/[id]` - Update contact
- `DELETE /api/contacts/[id]` - Delete contact

### AI Agent

- `POST /api/ai/chat` - Chat with Claude AI about contacts
- `POST /api/ai/analyze` - Analyze contact data
- `POST /api/ai/suggest` - Get AI suggestions for outreach

### Import/Export

- `POST /api/import/csv` - Import contacts from CSV
- `GET /api/export/csv` - Export contacts to CSV

See [API_DOCS.md](./API_DOCS.md) for detailed API documentation.

## Project Structure

```
Marketing/
├── crm-app/                      # CRM Application Root
│   ├── app/                      # Next.js App Router
│   │   ├── api/                  # API routes
│   │   │   ├── contacts/         # Contact CRUD endpoints
│   │   │   ├── activities/       # Activity tracking
│   │   │   ├── deals/            # Deal management
│   │   │   ├── dashboard/        # Dashboard stats
│   │   │   └── ai-agents/        # Claude AI integration
│   │   ├── contacts/             # Contact pages
│   │   │   ├── page.js           # Contact list
│   │   │   └── [id]/page.js      # Contact detail
│   │   ├── dashboard/            # Dashboard page
│   │   ├── page.js               # Home/Dashboard
│   │   ├── layout.js             # Root layout
│   │   └── globals.css           # Global styles
│   ├── components/               # React components
│   ├── lib/                      # Utility functions
│   │   └── prisma.js             # Prisma client
│   ├── prisma/                   # Database
│   │   └── schema.prisma         # Database schema
│   ├── public/                   # Static assets
│   ├── package.json              # Dependencies
│   ├── next.config.js            # Next.js config
│   ├── tailwind.config.js        # Tailwind config
│   └── .env.local.example        # Environment template
├── README.md                     # Documentation
├── API_DOCS.md                   # API reference
├── DEPLOYMENT.md                 # Deployment guide
├── vercel.json                   # Vercel config
└── plexus_contacts - Sheet1.csv  # Contact data
```

## Features

- **Contact Management**: Full CRUD operations for contacts
- **AI-Powered Insights**: Claude AI analyzes contact data and suggests actions
- **CSV Import/Export**: Bulk import and export contact data
- **Search & Filter**: Advanced search with multiple filters
- **Activity Tracking**: Log interactions and track engagement
- **Email Integration**: Send emails directly from the platform
- **Real-time Updates**: Edge functions for instant data sync
- **Responsive Design**: Mobile-first responsive interface

## Development Guidelines

### Database Changes

1. Modify schema in `lib/db/schema.ts`
2. Generate migration: `npm run db:generate`
3. Apply migration: `npm run db:migrate`
4. Test locally before deploying

### Adding New Features

1. Create API route in `app/api/`
2. Add TypeScript types in `types/`
3. Build UI components in `components/`
4. Update documentation

### Testing AI Features

Use the Claude AI agent endpoint locally:

```bash
curl -X POST http://localhost:3000/api/ai/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Show me all contacts from Akron"}'
```

## Troubleshooting

### Database Connection Issues

```bash
# Verify Postgres connection
vercel env pull
npm run db:migrate
```

### Build Failures

```bash
# Clear Next.js cache
rm -rf .next
npm run build
```

### Edge Function Timeout

Edge functions have a 25s timeout. For long-running tasks, use serverless functions instead by adding to route:

```typescript
export const runtime = 'nodejs'; // Default is 'edge'
```

## Support & Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Anthropic Claude API](https://docs.anthropic.com)
- [Vercel Postgres Guide](https://vercel.com/docs/storage/vercel-postgres)

## License

Proprietary - Bespoke Ethos CRM Platform
