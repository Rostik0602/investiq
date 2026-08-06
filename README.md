# InvestIQ — Personal Finance Tracker

Full-stack web application for personal finance management built with React, TypeScript, Redux Toolkit, RTK Query, NestJS and PostgreSQL.

InvestIQ helps users track expenses and income, manage their balance, and analyze spending patterns through interactive charts. The project demonstrates client-server architecture, JWT authentication with access/refresh tokens, REST API design, state management and modern fullstack development practices.

> ⚠️ The backend is hosted on Render's free tier and may take 30–60 seconds to wake up on the first request after inactivity.

## Live Demo

🌐 **Frontend:** https://investiq-gray.vercel.app  
⚙️ **Backend API:** https://investiq-xfig.onrender.com  
📄 **Swagger Docs:** https://investiq-xfig.onrender.com/api/docs

## Tech Stack

### Frontend

- React 18
- TypeScript
- Redux Toolkit + RTK Query (server state, caching, automatic re-fetching)
- React Router v6 (protected routes, redirect logic)
- Formik + Yup (form management and validation)
- SCSS Modules (feature-scoped styles, design tokens)
- i18next + react-i18next (EN/UA language switcher)
- recharts (bar charts for spending breakdown)
- Lucide React (icon system)
- Vite

The application follows a feature-based architecture:

- `features/` — business logic modules (auth, balance, expenses, income, calculations, statistics, notification)
- `pages/` — application routes (AuthPage, DashboardPage, CalculationsPage)
- `components/` — app-level reusable components (Header)
- `shared/ui/` — design system primitives (Button, Input, Select, Table, Tabs, Avatar, Notification)
- `app/` — Redux store, RTK Query base setup with auto-refresh logic

### Backend

- Node.js + TypeScript (strict mode)
- NestJS (modular architecture, dependency injection, decorators)
- PostgreSQL + Prisma ORM (schema-first, type-safe queries, migrations)
- JWT authentication — access token (15m) + refresh token (7d) with rotation
- bcrypt password hashing
- class-validator + class-transformer (DTO validation)
- @nestjs/swagger (auto-generated API documentation)
- @nestjs/throttler (rate limiting on `/auth/*`)
- Jest (unit tests)

### Infrastructure

- Docker + docker-compose (local PostgreSQL, one-command setup)
- Vercel (Frontend)
- Render (Backend)
- Supabase (PostgreSQL hosting)

## Features

### Authentication

- User registration and login with validation
- JWT access + refresh token pair
- Automatic token refresh on 401 (silent re-auth with mutex to prevent race conditions)
- Logout with server-side token revocation
- Protected routes — unauthenticated users redirected to `/auth`
- Authenticated users redirected away from `/auth`
- Persistent session via localStorage

### Dashboard

- Balance management — set starting balance, confirm it once, edit anytime
- Onboarding hint for new users
- Tabs — switch between Expenses and Income views
- Add / delete expenses and income with date, description, category and amount
- Table view with all transactions
- Summary panel — monthly breakdown of expenses/income for the current year
- Link to Calculations page

### Calculations Page

- Period switcher — navigate by month/year (defaults to current month)
- Summary strip — total expenses and income for selected period
- Category grid — all categories with icons and totals for selected period
- Switch between Expenses/Income view in the grid
- Bar chart — spending breakdown by description within selected category
- Responsive chart orientation (vertical on desktop, horizontal on mobile)

### UI / UX

- Fully responsive — mobile 320px, tablet 768px, desktop 1200px
- EN / UA language switcher (defaults to English)
- Toast notifications (logout, errors)
- Loading, error and empty states throughout
- Orange accent color system

## Screenshots

### Authentication

User login and registration with Formik validation and JWT authentication.

![Auth Page](./screenshots/auth.png)

### Dashboard

Balance management, expense/income forms with category selection, transaction table and monthly summary panel.

![Dashboard](./screenshots/dashboard.png)

### Calculations

Period switcher, category grid with icons and totals, and interactive bar chart for spending breakdown.

![Calculations](./screenshots/calculations.png)

### Mobile View

Fully responsive layout with adapted navigation, stacked cards and horizontal chart orientation.

![Mobile](./screenshots/mobile.png)

## Architecture Highlights

**Single RTK Query instance** — all API slices use `api.injectEndpoints()` on a shared `createApi` instance so tag invalidation works across domains (adding an expense automatically re-fetches balance and statistics).

**Auto-reauth with mutex** — `baseQueryWithReauth` in `baseQuery.ts` intercepts 401 responses, calls `/auth/refresh`, retries the original request and dispatches `logout()` if the refresh also fails. A mutex prevents multiple simultaneous refresh calls.

**Server-side aggregation** — all statistics (monthly totals, category breakdowns, per-description charts) are computed in PostgreSQL via `groupBy` / `SUM`. No fetch-all-then-reduce in JavaScript.

**Ownership check in service layer** — `JwtAuthGuard` verifies identity; every service method additionally checks that the requested row belongs to the current user. A valid token for user A can never read or delete user B's data.

**Categories are Ukrainian strings on the wire, English enums in Postgres** — Prisma enum members can't contain apostrophes or spaces, so the DB uses plain identifiers (`HEALTH`, `UTILITIES`) and DTOs translate at the API boundary.

**Money is Decimal in Postgres, number in JSON** — all arithmetic happens as SQL `NUMERIC(14,2)`, never JS float accumulation. Conversion to a plain number happens only at the response-building step.

## Installation

### Clone the repository

```bash
git clone https://github.com/Rostik0602/investiq.git
cd investiq
```

### Start the database

```bash
cd server
cp .env.example .env
# Fill in JWT_SECRET and JWT_REFRESH_SECRET in .env
docker compose up
```

### Install and run the backend

```bash
cd server
npm install
npm run start:dev
```

### Install and run the frontend

```bash
cd my-app
npm install
npm run dev
```

Frontend: `http://localhost:5173`  
Backend: `http://localhost:3000`  
Swagger: `http://localhost:3000/api/docs`

## Environment Variables

Backend (`server/.env`):

```env
DATABASE_URL=postgresql://postgres:postgres@postgres:5432/investiq
JWT_SECRET=your_secret_here
JWT_REFRESH_SECRET=your_refresh_secret_here
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
BCRYPT_SALT_ROUNDS=12
NODE_ENV=development
PORT=3000
CORS_ORIGIN=http://localhost:5173
```

Frontend (`my-app/.env`):

```env
VITE_API_BASE_URL=http://localhost:3000
```

## Project Structure

```
investiq/
├── my-app/                    # React frontend
│   └── src/
│       ├── app/               # Redux store, RTK Query base, typed hooks
│       ├── features/          # Business logic by domain
│       │   ├── auth/          # Login, register, JWT, UserMenu
│       │   ├── balance/       # Balance bar, onboarding hint
│       │   ├── expenses/      # Expense form, table, API
│       │   ├── income/        # Income form, table, API
│       │   ├── calculations/  # Period switcher, category grid, chart
│       │   ├── statistics/    # RTK Query statistics endpoints
│       │   ├── summary/       # Monthly summary panel
│       │   └── notification/  # Toast notification system
│       ├── pages/             # AuthPage, DashboardPage, CalculationsPage
│       ├── components/        # Header
│       ├── routes/            # AppRouter, ProtectedRoute
│       └── shared/            # UI primitives, styles, i18n, utils
│
└── server/                    # NestJS backend
    ├── src/
    │   ├── auth/              # JWT strategies, register, login, refresh
    │   ├── users/             # User service
    │   ├── expenses/          # CRUD + ownership check
    │   ├── income/            # CRUD + ownership check
    │   ├── balance/           # Balance get/set
    │   ├── statistics/        # Aggregated stats for charts
    │   ├── prisma/            # PrismaService
    │   └── common/            # Guards, filters, decorators
    └── prisma/
        ├── schema.prisma      # Database schema
        ├── migrations/        # SQL migration history
        └── seed.ts            # Demo data seeder
```

## API Overview

Full documentation with request/response schemas available at `/api/docs` (Swagger UI).

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/auth/register` | public | Register new user |
| POST | `/auth/login` | public | Login, returns token pair |
| POST | `/auth/refresh` | refresh token | Rotate both tokens |
| POST | `/auth/logout` | access token | Revoke refresh token |
| GET | `/auth/me` | access token | Current user info |
| GET | `/expenses` | access token | List with month/year/category filters |
| POST | `/expenses` | access token | Add expense |
| DELETE | `/expenses/:id` | access token | Delete expense |
| GET | `/income` | access token | List with month/year/category filters |
| POST | `/income` | access token | Add income |
| DELETE | `/income/:id` | access token | Delete income |
| GET | `/balance` | access token | Get starting and total balance |
| POST | `/balance` | access token | Set starting balance |
| GET | `/statistics/monthly` | access token | Monthly totals for a year |
| GET | `/statistics/categories` | access token | Totals grouped by category |
| GET | `/statistics/breakdown` | access token | Totals grouped by description |

## Testing

```bash
cd server
npm test          # unit tests
npm run test:cov  # with coverage
```

Covered: `auth.service` (registration, login, wrong-password rejection) and `expenses.service` (ownership isolation — a request for another user's expense returns 404 and never reaches the delete call).

## License

MIT