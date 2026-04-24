# External Integrations

**Analysis Date:** 2026-04-24

## APIs & External Services

**Finnish National Higher Education API (Opintopolku):**
- Service: `opintopolku.fi/konfo-backend`
- Base URL constant: `https://opintopolku.fi/konfo-backend` (defined in `src/config/opintopolku.config.ts`)
- Auth: None — public API, no API key required
- SDK/Client: `@nestjs/axios` + `axios` with `firstValueFrom()` from `rxjs`

**Endpoints consumed:**

| Endpoint | Used by | Purpose |
|---|---|---|
| `GET /search/oppilaitokset` | `UniversitiesService`, `SyncService` | Paginated institution list |
| `GET /oppilaitos/{oid}` | `UniversitiesService`, `SyncService` | Single institution detail |
| `GET /search/koulutukset` | `UniversitiesService`, `ProgramsService`, `SyncService` | Paginated program/education list |
| `GET /koulutus/{oid}` | `ProgramsService`, `SyncService` | Single program detail |
| `GET /toteutus/{tOid}` | `ProgramsService` | Single implementation (toteutus) detail |

**HTTP Client Pattern:**
```typescript
// All upstream calls follow this pattern (firstValueFrom wraps the Observable)
const response = await firstValueFrom(
  this.httpService.get(`${OPINTOPOLKU_BASE}/search/oppilaitokset`, { params }),
);
// Upstream failures are caught and rethrown as BadGatewayException
```

Files using this pattern:
- `src/modules/universities/universities.service.ts`
- `src/modules/programs/programs.service.ts`
- `src/modules/sync/sync.service.ts`

## Data Storage

**Database:**
- Provider: PostgreSQL 16 (Alpine)
- ORM: Prisma ^7.6.0 with `@prisma/adapter-pg`
- Driver: `pg` ^8.20.0
- Connection env var: `DATABASE_URL`
- Local dev: Docker via `docker-compose.yml` — `postgres:16-alpine` on port `5432` (user/pass/db: `studyfin`)
- Prisma Postgres proxy URL (`prisma+postgres://`) supported for local dev
- Schema: `prisma/schema.prisma`
- PrismaService: `src/providers/prisma.service.ts`
- PrismaModule: `src/providers/prisma.module.ts` — registered `@Global()`, available to all modules

**PrismaService initialization:**
```typescript
// src/providers/prisma.service.ts
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
super({ adapter });
```

**File Storage:**
- Not used — no file storage integration

**Caching:**
- Redis 7 (Alpine) provisioned in `docker-compose.yml` on port `6379` — **not yet used by the application**
- No `ioredis` or similar client installed

## Authentication & Identity

**Auth Provider:** Custom JWT-based auth — no third-party identity provider

**Implementation approach:**
- `@nestjs/jwt` + `@nestjs/passport` + `passport-jwt`
- JWT strategy defined in `src/modules/auth/strategies/jwt.strategy.ts`
- Tokens extracted from `Authorization: Bearer <token>` header
- Access token: short-lived (default `15m`, configured via `JWT_ACCESS_EXPIRATION`)
- Refresh token: long-lived (default `7d`, configured via `JWT_REFRESH_EXPIRATION`), stored in the `Auth` model in PostgreSQL
- Token rotation: refresh token is deleted and reissued on each refresh call
- Password hashing: `bcrypt` with 10 salt rounds (`src/modules/auth/auth.service.ts`)
- Email verification and password reset tokens generated with `crypto.randomBytes(32)`

**Auth module:** `src/modules/auth/auth.module.ts`

**JWT configuration:**
```typescript
// src/modules/auth/auth.module.ts
secret: process.env.JWT_SECRET || 'fallback-secret-change-in-production'
expiresIn: process.env.JWT_ACCESS_EXPIRATION || '15m'
```

**JWT payload shape:**
```typescript
interface JwtPayload { sub: string; email: string; }
```

**Auth guards:** `@UseGuards(AuthGuard('jwt'))` pattern via Passport — guard files expected in `src/common/guards/` (currently empty placeholder)

## Scheduled Jobs

**Sync Job:**
- Module: `src/modules/sync/sync.module.ts`
- Service: `src/modules/sync/sync.service.ts`
- Schedule: `@Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)` — runs `syncAll()` nightly
- Purpose: Fetches all institutions and English-taught programs from Opintopolku API and upserts into PostgreSQL
- No external queue — runs in-process using `@nestjs/schedule`

## Monitoring & Observability

**Error Tracking:**
- None detected — no Sentry, Datadog, or similar integration

**Logging:**
- NestJS built-in `Logger` used in `SyncService` (`src/modules/sync/sync.service.ts`)
- `console.log` used in `AuthService` for email verification and password reset tokens (development placeholder)
- No structured logging library (Winston, Pino, etc.)

## CI/CD & Deployment

**Hosting:**
- Not detected — no platform config files (Dockerfile, fly.toml, vercel.json, etc.)

**CI Pipeline:**
- Not detected — no `.github/workflows/`, `.gitlab-ci.yml`, etc.

## Environment Configuration

**Required env vars:**

| Variable | Purpose | Default (if any) |
|---|---|---|
| `DATABASE_URL` | PostgreSQL connection string | None — required |
| `JWT_SECRET` | JWT signing secret | `'fallback-secret-change-in-production'` (insecure) |
| `JWT_ACCESS_EXPIRATION` | Access token lifetime | `'15m'` |
| `JWT_REFRESH_EXPIRATION` | Refresh token lifetime | `'7d'` |
| `PORT` | HTTP server port | `3000` |

**Env file:** `.env` present at project root — loaded via `import 'dotenv/config'` in `src/main.ts`

**Secrets location:** `.env` file (not committed; Docker Compose uses inline values for local database only)

## CORS Configuration

**Enabled in** `src/main.ts`:
```typescript
app.enableCors({
  origin: true,           // All origins allowed
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  credentials: true,
});
```

## Webhooks & Callbacks

**Incoming:** None detected

**Outgoing:** None detected — email sending is stubbed (tokens logged to console instead of sent via email)

---

*Integration audit: 2026-04-24*
