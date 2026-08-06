# InvestIQ API

Backend for the InvestIQ personal-finance frontend (Витрати / Доходи / Баланс).
NestJS + PostgreSQL + Prisma, JWT auth with access/refresh tokens.

## Stack

- Node.js + TypeScript (strict)
- NestJS (modular, DI, decorators)
- PostgreSQL + Prisma ORM
- JWT (access + refresh) via `@nestjs/jwt` / `passport-jwt`
- bcrypt password hashing
- class-validator / class-transformer DTO validation
- `@nestjs/swagger` API docs
- `@nestjs/throttler` rate limiting on `/auth/*`
- Jest unit tests

## Getting started (local, no Docker)

Prerequisites: Node 20+, a running PostgreSQL instance.

```bash
cd server
npm install
cp .env.example .env
# edit .env — at minimum set DATABASE_URL, JWT_SECRET, JWT_REFRESH_SECRET

npx prisma migrate dev --name init   # creates the DB schema
npm run prisma:seed                  # optional: demo user + sample data

npm run start:dev
```

API: `http://localhost:3000`
Swagger docs: `http://localhost:3000/api/docs`

## Getting started (Docker — one command)

```bash
cd server
cp .env.example .env
# edit .env — JWT_SECRET / JWT_REFRESH_SECRET are required by docker-compose.yml

docker compose up --build
```

This starts Postgres, runs `prisma migrate deploy` once (the `migrate`
service), then starts the API on `http://localhost:3000`. Run the seed
separately once containers are up:

```bash
docker compose exec api npx prisma db seed
```

## Prisma workflow

| Command                        | What it does                                   |
| ------------------------------- | ----------------------------------------------- |
| `npm run prisma:generate`       | Regenerate the Prisma Client                    |
| `npm run prisma:migrate`        | Create + apply a new migration (dev)            |
| `npm run prisma:migrate:deploy` | Apply existing migrations (prod/CI, no prompts) |
| `npm run prisma:studio`         | Open Prisma Studio (DB GUI)                     |
| `npm run prisma:seed`           | Run `prisma/seed.ts`                            |

Seeded demo account: **demo@investiq.app / Demo12345!** — has a confirmed
starting balance and a few months of expenses/income, enough to see
non-empty charts on Зведення and Розрахунки immediately.

## Testing

```bash
npm test          # unit tests
npm run test:cov  # with coverage
```

Covered: `auth.service` (registration, login, wrong-password rejection)
and `expenses.service` (the ownership check in `remove()` — a request for
another user's expense id returns 404, not 200/403, and never touches the
delete call).

## API overview

All endpoints except `/auth/register`, `/auth/login`, `/auth/refresh` require
`Authorization: Bearer <accessToken>`. Full request/response schemas are in
Swagger (`/api/docs`).

### Auth

| Method | Path            | Auth            | Notes                              |
| ------ | --------------- | ---------------- | ----------------------------------- |
| POST   | `/auth/register` | public (throttled) | `{ email, password, name }`       |
| POST   | `/auth/login`     | public (throttled) | `{ email, password }`             |
| POST   | `/auth/refresh`   | refresh token     | rotates both tokens                |
| POST   | `/auth/logout`    | access token      | revokes the stored refresh token   |
| GET    | `/auth/me`        | access token      | current user                       |

### Expenses / Income

Identical shape on both `/expenses` and `/income`.

| Method | Path             | Notes                                          |
| ------ | ---------------- | ----------------------------------------------- |
| GET    | `/expenses?month=&year=&category=` | `month`+`year` must be given together |
| POST   | `/expenses`       | `{ description, category, amount, date }`      |
| DELETE | `/expenses/:id`   | 404 if the id doesn't exist *or* isn't yours    |

### Balance

| Method | Path       | Notes                                                        |
| ------ | ---------- | -------------------------------------------------------------- |
| GET    | `/balance` | `{ startingBalance, isConfirmed, totalBalance }`               |
| POST   | `/balance` | `{ startingBalance }` — sets it the first time, or edits it later |

### Statistics

| Method | Path                    | Feeds                                            |
| ------ | ----------------------- | -------------------------------------------------- |
| GET    | `/statistics/monthly?year=` | Зведення — 12 rows, `{month, totalExpenses, totalIncome}` |
| GET    | `/statistics/categories?month=&year=&type=` | Розрахунки category grid — all categories, 0 for unused ones |
| GET    | `/statistics/breakdown?month=&year=&type=&category=` | Розрахунки bar chart — per-description totals; `category` is **optional** (omit it to aggregate across every category, which is what the existing chart does) |

All aggregation runs as SQL (`groupBy` / raw grouped `SUM`), never
fetch-everything-then-reduce-in-JS.

## Design notes (read before wiring up the frontend)

**Categories are Ukrainian strings on the wire, English enums in Postgres.**
Prisma enum members can't contain apostrophes, commas, or spaces (`Здоров'я`,
`Комуналка, зв'язок`), so the DB enum uses plain identifiers
(`HEALTH`, `UTILITIES`, ...) and every DTO/response translates through
`expense-category.ts` / `income-category.ts`. The JSON your frontend
sends and receives uses the *exact* strings already in
`EXPENSE_CATEGORIES` / `INCOME_CATEGORIES` — no frontend mapping needed.

**Money is `Decimal` in Postgres, `number` in JSON.** Storage and every
sum/aggregate happen as SQL `NUMERIC(14,2)` arithmetic (never JS float
accumulation). The very last step — building the HTTP response — converts
to a plain JS `number`, matching the frontend's existing `amount: number`
type. This is safe because the imprecise step (repeated addition) never
happens in JS; only a single already-computed value gets converted.

**Dates are ISO 8601 on the wire, `DateTime` (UTC) in Postgres.** The
frontend's current in-memory format is `dd.mm.yyyy` — when wiring up RTK
Query, convert to `date.toISOString()` (or just `yyyy-mm-dd`) before
POSTing, and format `yyyy-mm-dd`/ISO back to `dd.mm.yyyy` for display.
This conversion was deliberately pushed to the frontend/DTO boundary
rather than accepting `dd.mm.yyyy` server-side, since ISO dates parse
unambiguously and sort/filter correctly at the DB level.

**Ownership is checked in the service layer, not just the guard.**
`JwtAuthGuard` only proves *who* is asking. Every `findUnique` +
"does this row's `userId` match the token's `userId`" check happens in
the service (see `expenses.service.ts#remove`, mirrored in `income`) —
a valid token for user A can never read or delete user B's row, even
knowing its id. `expenses.service.spec.ts` tests exactly this.

## Environment variables

See `.env.example`. All secrets (`JWT_SECRET`, `JWT_REFRESH_SECRET`,
`DATABASE_URL`) must be overridden in your own `.env` — the example file
ships with obvious placeholder values and is **not** safe to run in
production as-is.
