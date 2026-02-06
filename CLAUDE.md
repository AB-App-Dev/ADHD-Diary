# CLAUDE.md

We're building the app described in @/docs/SPEC.MD. Read that file for general architectural tasks or to double-check the exact database structure, tech stack or application architecture.

Keep your replies extremely concise and focus on conveying the key information. No unnecessary fluff, no long code snippets.

## Documentation First

**IMPORTANT: Before generating any code, ALWAYS check the `/docs` folder for relevant documentation files.** These docs contain project-specific patterns, specifications, and implementation details that must be followed. Read the relevant docs first to ensure generated code aligns with established project conventions.

- /docs/ui.md
- /docs/local.md

Whenever working with any third-party library or something similar, you MUST look up the official documentation to ensure that you're working with up-to-date information. Use the DocsExplorer subagent for efficient documentation lookup.

## Tech Stack
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Database**: PostgreSQL via Neon
- **ORM**: Prisma

## Project Structure
```
app/                    # Next.js App Router
  (auth)/               # Auth routes (login, register)
  (dashboard)/          # Protected routes (home, settings, form, analytics)
  api/                  # API routes
components/             # React components
  ui/                   # Base UI components
  forms/                # Form components (workday, weekend)
  charts/               # Chart components
  shared/               # Navbar, sidebar, footer
lib/                    # Utilities and Prisma client
  validations/          # Zod schemas
services/               # Business logic layer
actions/                # Next.js Server Actions
hooks/                  # Custom React hooks
types/                  # TypeScript definitions
prisma/                 # Database schema
```

## Database Models
- **User**: Parent account with email/password auth
- **Session**: Medication monitoring period with settings (locked after start)
- **Entry**: Daily workday or weekly weekend form submissions (JSON answers)
- **EntryType**: WORKDAY | WEEKEND enum

## Key Features
- Daily workday form (Likert scales for attention, energy, mood, sleep)
- Weekly weekend form (parent observations, side effects)
- Settings lock after monitoring period starts
- Analytics dashboard with time period selection
- Notifications/reminders (push, email, SMS)

## Commands
```bash
npm run dev      # Start development server
npm run build    # Production build
npm run lint     # Run ESLint
```

## Specs
Full specification available in `docs/SPECS.md`
