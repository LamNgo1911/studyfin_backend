# StudyFin Backend

> NestJS backend API for helping students discover Finnish educational institutions and programs.

## Tech Stack

- **Runtime:** Node.js · TypeScript
- **Framework:** [NestJS](https://nestjs.com/) v11
- **ORM:** [Prisma](https://www.prisma.io/) v7 (PostgreSQL, full-text search)
- **Caching:** Redis 7 (Keyv, cache-aside, 24h TTL)
- **Rate Limiting:** `@nestjs/throttler` (100 req/60s global, 10/60s auth, 30/60s admin)
- **API Docs:** Swagger (`@nestjs/swagger`) at `/api/docs`
- **Validation:** class-validator · class-transformer
- **Infrastructure:** Docker Compose (PostgreSQL 16, Redis 7)
- **Testing:** Jest · Supertest

## Project Structure

```
src/
├── common/                # Shared utilities
│   ├── decorators/
│   ├── filters/
│   ├── guards/
│   ├── interceptors/
│   ├── middleware/
│   ├── pipes/
│   └── utils/
├── config/                # App configuration
├── modules/
│   ├── admin/             # Admin dashboard & user management
│   ├── auth/              # JWT authentication
│   ├── users/             # User profile & saved programs
│   ├── universities/      # University data (cached)
│   ├── programs/          # Study programs (cached)
│   ├── guidance/          # A-Z guidance content per program
│   ├── search/            # Unified full-text search (cached)
│   ├── sync/              # DB sync from Opintopolku API (admin-only)
│   └── mock-tests/        # UAS entrance exam practice tests
├── providers/             # External providers (PrismaService)
└── main.ts
```

## Prerequisites

- **Node.js** ≥ 18
- **Docker** & **Docker Compose** (for local PostgreSQL & Redis)

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Start infrastructure

```bash
docker compose up -d
```

This starts **PostgreSQL 16** (port 5432) and **Redis 7** (port 6379).

### 3. Configure environment

Copy `.env` and update `DATABASE_URL` if needed. The default `.env` is configured for local Prisma Postgres.

### 4. Generate Prisma client

```bash
npx prisma generate
```

### 5. Run the app

```bash
# Development (watch mode)
npm run start:dev

# Production build
npm run build
npm run start:prod
```

The server starts at **http://localhost:3000** by default.

## Available Scripts

| Script              | Description                       |
|---------------------|-----------------------------------|
| `npm run start`     | Start the app                     |
| `npm run start:dev` | Start in watch mode               |
| `npm run start:prod`| Start production build            |
| `npm run build`     | Compile the project               |
| `npm run lint`      | Lint & auto-fix with ESLint       |
| `npm run format`    | Format code with Prettier         |
| `npm test`          | Run unit tests                    |
| `npm run test:watch`| Run tests in watch mode           |
| `npm run test:cov`  | Run tests with coverage           |
| `npm run test:e2e`  | Run end-to-end tests              |

## API Routes

### Health

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/` | Health check |

### Universities

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/v1/universities` | Paginated university list |
| `GET` | `/api/v1/universities/:oid` | University by OID |
| `GET` | `/api/v1/universities/:oid/programs` | Programs for a university |

**Query parameters for `/universities`:**
- `size` — results per page (default: 20)
- `page` — page number (0-indexed, default: 0)
- `language` — filter universities by teaching language (e.g. `en`, `fi`). Only universities with at least one program in that language are returned.

### Programs

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/v1/programs` | List programs |
| `GET` | `/api/v1/programs/:oid` | Program by OID |

### Search

Full-text search across programs and institutions in the local database.

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/v1/search` | Unified full-text search |

**Query parameters:**
- `q` — search term
- `type` — `programs` or `institutions` (optional, omit for mixed results)
- `size` — results per page (1–100, default: 20)
- `page` — page number (0-indexed, default: 0)

**Response shape:**
```json
{
  "total": 50,
  "page": 0,
  "size": 20,
  "hits": [
    {
      "oid": "1.2.246.562.10.56753942459",
      "name": "Aalto University",
      "description": "...",
      "type": "institution",
      "itemType": "institution",
      "logoUrl": "...",
      "municipality": "Helsinki",
      "website": "https://aalto.fi",
      "email": "info@aalto.fi",
      "studentCount": 15000,
      "locations": [{ "code": "kunta_091", "name": "Helsinki" }]
    },
    {
      "oid": "1.2.246.562.20.12345678901",
      "name": "Computer Science (BSc)",
      "type": "program",
      "itemType": "program",
      "isDegree": true,
      "fieldOfStudy": "Computer Science",
      "teachingLanguages": ["en", "fi"],
      "providers": [{ "oid": "...", "name": "Aalto University" }]
    }
  ]
}
```

### Auth

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/api/v1/auth/register` | Register a new user |
| `POST` | `/api/v1/auth/verify-email` | Verify email with token |
| `POST` | `/api/v1/auth/login` | Login and receive JWT tokens |
| `POST` | `/api/v1/auth/refresh` | Refresh access token |
| `POST` | `/api/v1/auth/forgot-password` | Request password reset email |
| `POST` | `/api/v1/auth/reset-password` | Reset password with token |
| `GET` | `/api/v1/auth/me` | Get current user profile (requires auth) |

### Sync

Admin-only endpoint to populate the local database from the Opintopolku API.

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/api/v1/sync/run` | Sync universities and programs from Opintopolku into the DB (202 Accepted, runs in background, requires ADMIN) |

### Guidance

A-Z guidance content per study program. Public read, admin-only write.

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/v1/guidance/:programOid` | Get guidance sections for a program |
| `POST` | `/api/v1/guidance/:programOid` | Create/replace guidance sections (requires ADMIN) |
| `PATCH` | `/api/v1/guidance/:programOid` | Partial update or delete guidance sections (requires ADMIN) |

### Admin

Administrative dashboard for user management.

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/v1/admin/users` | List all users — supports `email`, `page`, `size` query params (requires ADMIN) |
| `PATCH` | `/api/v1/admin/users/:id/mock-test-access` | Toggle mock test access for a user (requires ADMIN) |

### Mock Tests

Practice tests for UAS (Universities of Applied Sciences) entrance exams.

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/v1/mock-tests/templates` | List available test templates |
| `GET` | `/api/v1/mock-tests/templates/:id` | Get a specific template |
| `POST` | `/api/v1/mock-tests` | Start a new test attempt (requires auth) |
| `GET` | `/api/v1/mock-tests/history` | Get user's test history (requires auth) |
| `GET` | `/api/v1/mock-tests/:id` | Get a specific attempt (requires auth) |
| `POST` | `/api/v1/mock-tests/:id/submit` | Submit answers for an attempt (requires auth) |

**Query parameters for `/mock-tests/templates`:**
- `subject` — filter by subject: `math`, `language_en`, `reading`, `analytical`
- `size` — results per page (1–50, default: 20)
- `page` — page number (0-indexed, default: 0)

**Query parameters for `/mock-tests/history`:**
- `status` — filter by status: `in_progress`, `completed`
- `size` — results per page (1–50, default: 20)
- `page` — page number (0-indexed, default: 0)

## Authentication

JWT-based authentication using `@nestjs/passport` and `passport-jwt`. Routes marked _"requires auth"_ expect an `Authorization: Bearer <token>` header. Obtain a token via `POST /api/v1/auth/login`. Admin routes additionally require the user to have the `ADMIN` role (checked by `RolesGuard`).

## API Docs (Swagger)

Interactive Swagger UI available at **`/api/docs`** in development (`NODE_ENV !== 'production'`). Provides full endpoint documentation, request/response schemas, and in-browser testing. Disabled in production.

## Rate Limiting

Rate limits are enforced globally via `@nestjs/throttler`:

| Scope | Limit | Window |
|-------|-------|--------|
| Global | 100 req | 60 sec |
| Auth routes (`/auth/*`) | 10 req | 60 sec |
| Admin routes (`/admin/*`) | 30 req | 60 sec |

## API Modules

### Auth

JWT-based authentication with access and refresh tokens. Supports user registration, email verification, login, and password reset flows. Protected routes use the `JwtAuthGuard`.

### Search

PostgreSQL full-text search across program names/descriptions and institution names/descriptions. Results are cached in Redis (24h TTL). Supports filtering by type (`programs` or `institutions`).

### Users

User profile management — view and update profile, save/manage programs with application status tracking.

### Universities

University data served from local PostgreSQL with Redis cache-aside (24h TTL). Includes institution details, locations, and program associations.

### Programs

Study program data served from local PostgreSQL with Redis cache-aside (24h TTL). Includes degree info, credits, teaching languages, and provider associations.

### Guidance

A-Z guidance content per program. Admin can create, update, and delete guidance sections for any program. Public read access for all guidance sections.

### Admin

Administrative dashboard for user management. List users with optional email filter and pagination. Toggle mock test access per user.

### Sync

Admin-triggered data sync from the Finnish national education API (Opintopolku). Fires-and-forgets: returns 202 Accepted immediately while sync runs in the background. Invalidates Redis caches after successful sync.

### Mock Tests

UAS entrance exam practice. Users can browse test templates, start timed attempts, and submit answers for scoring. Supports subjects: math, language (English), reading comprehension, and analytical reasoning.

## Database

Prisma with PostgreSQL. The schema (`prisma/schema.prisma`) includes models for:
- `University`, `UniversityLocation` — institution data
- `Program`, `ProgramUniversity` — study programs and their university associations
- `User`, `Auth` — user accounts and refresh token sessions
- `UserProgram`, `UserUniversity` — user saved items
- `GuidanceSection` — A-Z guidance content per program
- `TestTemplate`, `Question`, `AnswerOption` — mock test definitions
- `MockTest`, `MockTestAnswer` — user test attempts and responses

Prisma client is generated to `generated/prisma` — import from there, not `@prisma/client`.

## License

This project is private and unlicensed.
