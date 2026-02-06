# ADHD Therapy Monitoring App Specification

## App Description
The **Weekly Plan for Monitoring ADHD Therapy** app is designed to support patients, parents, and therapists in tracking and managing ADHD therapy progress on a weekly basis. The app offers a structured, easy-to-use interface to record daily and weekly observations, medication intake, mood, and overall therapy effectiveness.

## Overview
A mobile/web app to track a teenager’s medication effects and daily/weekly wellbeing. The app collects daily “workday” entries and a single weekly entry (weekend), provides analytics over selectable time periods, and includes configurable medication/settings and reminder behaviour.

## User Roles
### Parent (primary account)
- Registers, logs in, configures medication and monitoring period.
- Completes daily and weekly forms
- Can view analytics and parent observations.
- Receives notifications/reminder (optional).

## Primary Screens
### Start / Home
- Buttons: `Register`, `Login`
- After login: shows short `Instructions` and `Settings` summary.
- Controls:
  - `Start / Stop` analysis (once started, some settings become locked).
  - Toggle: `Skip start page and go directly to form`.

### Settings Page
- Medication details:
  - Medication name
  - Dosage
  - Intake time(s)
- Monitoring period: `From` / `To`
- Other preferences:
  - Show/hide start page
  - Reminder schedule and channels
  - Notification rules for missed entries
- Access: reachable from Home and Form.

### Form Page (Two Variants)
- Workday form (filled on school/work days)
- Weekend / weekly form (one entry per week)

### Zwischenseite (Intermediate Page)
- Message when monitoring period ended
- Option to add retrospective entries
- Button: `Continue to Analytics`

### Analytics Page
- `Zeitperiode dashboard` — metrics for chosen date range
- Visualizations & trend analysis by category

## Navigation / Flow Summary
- Unauthenticated: `Register` / `Login`.
- After login, Home appears with options and current settings.
- From Home -> `Form`.
- Submissions from Form -> stored and visible in Analytics.
- If monitoring period ended -> Zwischenseite appears.
- Settings accessible from Home/Form.

## Forms — Fields & Validation
### Workday Form (Arbeitsstag)
- Date (prefilled; editable for backfill)
- Sections (5-point Likert or 0–10 scale):
  - Attention & School
  - Energy & Fatigue
  - Mood
  - Sleep & Appetite
- Optional free-text comment

### Weekend / Weekly Form (Samstag oder Sonntag)
- Date (prefilled; editable for backfill)
- Parent observations (free text, side effects)
- Parent Teenager assessment (Yes/No answers)
- Overall weekly assessment (single choice)
- One submission per week enforced

## Validation & Business Rules
- Settings lock after `Start`.
- Date backfill allowed within monitoring period.
- Weekly form limited to one per week.
- Notifications for reminders and missed entries.
- Inline validation on forms.

## Settings & Control
- Editable fields:
  - Monitoring period
  - Medication details
  - Skip start page toggle
  - Notification preferences
- Action buttons:
  - `Start`
  - `Stop`
  - `Save settings`
- UI hints about locked settings after start.

## Notifications & Reminders
- Types: push, email, SMS (configurable)
- Daily reminders at intake time
- Weekly reminder if weekend form missing
- Missed-entry alerts for parent

## Analytics & Dashboard
- Selectable time period
- Visualizations by category
- Weekly overall rating trend
- Side effects frequency
- Parent comments list
- Compliance rate
- Optional CSV/PDF export

# Project structure
Next.js application using TypeScript, Tailwind CSS, Prisma, and Neon
.
├── prisma/
│   └── schema.prisma          # Database models (User, Medication, Entry, Settings)
├── public/                    # Static assets (icons, logos)
├── src/
│   ├── app/                   # Next.js App Router (Pages & Layouts)
│   │   ├── (auth)/            # Route group for Login/Register
│   │   ├── (dashboard)/       # Route group for authenticated app
│   │   │   ├── home/          # Start/Home screen
│   │   │   ├── settings/      # Medication & Monitoring config
│   │   │   ├── form/          # Workday & Weekend form logic
│   │   │   ├── analytics/     # Dashboard & Visualizations
│   │   │   └── layout.tsx     # Shared nav/sidebar for the app
│   │   ├── api/               # Webhooks or specialized API routes
│   │   ├── layout.tsx         # Root layout (Providers, Fonts)
│   │   └── page.tsx           # Landing page / Redirect logic
│   ├── components/            # Reusable UI components
│   │   ├── ui/                # Shadcn/UI or base components (Button, Input, Card)
│   │   ├── forms/             # Specific form components (WorkdayForm, WeekendForm)
│   │   ├── charts/            # Reusable Recharts/Chart.js wrappers
│   │   └── shared/            # Navbar, Footer, Sidebar
│   ├── lib/                   # Core utilities
│   │   ├── prisma.ts          # Prisma client singleton
│   │   ├── utils.ts           # Tailwind merge & formatting helpers
│   │   └── validations/       # Zod schemas for forms (Workday, Settings)
│   ├── services/              # Business logic & Data access layer
│   │   ├── entries.ts         # CRUD for daily/weekly entries
│   │   ├── settings.ts        # Logic for locking/unlocking settings
│   │   └── analytics.ts       # Data aggregation for charts
│   ├── actions/               # Next.js Server Actions
│   │   ├── auth-actions.ts
│   │   ├── entry-actions.ts   # Submitting forms
│   │   └── setting-actions.ts # Updating medication/period
│   ├── hooks/                 # Custom React hooks (e.g., useNotification)
│   └── types/                 # TypeScript interfaces/enums
├── .env                       # Neon DB connection string
├── next.config.js
├── tailwind.config.js
└── tsconfig.json