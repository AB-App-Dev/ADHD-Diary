# ADHD Therapy Monitoring App

A mobile/web app to track a teenager's medication effects and daily/weekly wellbeing. The app collects daily "workday" entries and a single weekly entry (weekend), provides analytics over selectable time periods, and includes configurable medication/settings and reminder behaviour.

## Tech Stack

- **Framework**: Next.js (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL via Neon
- **ORM**: Prisma

## Features

- **Daily Workday Form**: Track attention, energy, mood, sleep & appetite using Likert scales
- **Weekly Weekend Form**: Parent observations, side effects, overall assessment
- **Settings Management**: Medication name, dosage, intake times, monitoring period
- **Analytics Dashboard**: Visualizations by category, trend analysis, compliance rate
- **Notifications**: Push, email, SMS reminders (configurable)

## User Flow

1. Register/Login as parent
2. Configure medication and monitoring period in Settings
3. Start monitoring (locks settings)
4. Fill daily workday forms on school/work days
5. Fill weekly form on weekends
6. View analytics and trends

## Getting Started

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Add your Neon database connection string

# Run database migrations
npx prisma migrate dev

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Commands

```bash
npm run dev      # Start development server
npm run build    # Production build
npm run lint     # Run ESLint
```

## Documentation

See `docs/SPECS.md` for full specification.
