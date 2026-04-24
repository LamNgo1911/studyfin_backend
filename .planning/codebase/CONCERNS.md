# Codebase Concerns

**Analysis Date:** 2026-04-24

---

## Incomplete / Scaffold-Only Areas

**UsersController — no routes:**
- Files: `src/modules/users/users.controller.ts`
- The controller declares `@Controller('users')` and injects `UsersService` but exposes zero routes. No `GET /users/me`, no `PATCH /users/:id`, nothing. Any client call to `/users/*` returns 404.
- Impact: User profile management, password change, and account deletion are completely absent from the API surface.

**Empty entity and DTO stubs:**
- `src/modules/users/entities/user.entity.ts` — `export class User {}`
- `src/modules/auth/entities/auth.entity.ts` — `export class Auth {}`
- `src/modules/users/dto/create-user.dto.ts` — `export class CreateUserDto {}`
- `src/modules/users/dto/update-user.dto.ts` — uses `PartialType` of an empty class, so also empty
- `src/modules/universities/dto/create-university.dto.ts` — `export class CreateUniversityDto {}`
- `src/modules/universities/entities/university.entity.ts` — `export class University {}`
- These classes are generated scaffolds that were never filled. Any code that relies on them getting populated (e.g., Swagger decorators, serialisation interceptors) will fail silently.

**`src/common/` directories are entirely empty:**
- `src/common/filters/` — no exception filters; all unhandled exceptions fall through to NestJS defaults.
- `src/common/interceptors/` — no logging, serialisation, or transform interceptors.
- `src/common/middleware/` — no request-level middleware (rate limiting, correlation IDs, etc.).
- `src/common/pipes/` — no custom pipes beyond per-route `ValidationPipe` instances.
- `src/common/utils/` — the `resolveLang` helper is copy-pasted into every service rather than living here.
- `src/config/` and `src/providers/` have `.gitkeep` placeholders but no real config modules.

**Email delivery not implemented:**
- Files: `src/modules/auth/auth.service.ts` lines 62–63 and 148–149
- Email verification tokens and password-reset tokens are logged to `console.log` only. No email transport (`nodemailer`, SendGrid, SES, etc.) exists anywhere in the codebase.
- Impact: Registration and password-reset flows cannot be completed by real users. Tokens are only visible in server logs.

---

## Security Gaps

**JWT secret has an insecure fallback:**
- Files: `src/modules/auth/auth.module.ts` line 10, `src/modules/auth/strategies/jwt.strategy.ts` line 14
- Both files use `process.env.JWT_SECRET || 'fallback-secret-change-in-production'`. If `JWT_SECRET` is absent at runtime (e.g., missing `.env` in a new deployment), the server silently signs tokens with a publicly known string. Any attacker can forge valid JWTs.
- Fix: Throw on startup if `JWT_SECRET` is not set (use a startup validation guard or `ConfigModule`).

**CORS is fully open:**
- File: `src/main.ts` line 7–11
- `origin: true` reflects the request's `Origin` header verbatim, meaning every origin is allowed. Combined with `credentials: true`, this allows any website to make authenticated cross-origin requests.
- Fix: Restrict `origin` to a whitelist of known frontend origins, driven by environment config.

**Unvalidated query parameters on proxy routes:**
- Files: `src/modules/universities/universities.controller.ts`, `src/modules/programs/programs.controller.ts`
- Both controllers accept `@Query() query: Record<string, any>` with no `ValidationPipe` and pass those raw values directly to upstream Opintopolku API calls. An attacker can inject arbitrary query parameters into upstream requests.
- Compare to: `src/modules/search/search.controller.ts` which correctly uses a typed DTO + `ValidationPipe`.
- Fix: Define typed DTOs for all proxy query parameters; apply `ValidationPipe`.

**`/sync/run` endpoint is unauthenticated:**
- File: `src/modules/sync/sync.controller.ts`
- The `POST /sync/run` endpoint triggers a full sync against the upstream API and DB writes. There is no `JwtAuthGuard`, no admin role check, nothing. Any unauthenticated caller can trigger potentially expensive DB upserts.
- Fix: Protect with `JwtAuthGuard` and an admin/role check, or make the route internal-only.

**Tokens stored in plain text in the database:**
- File: `prisma/schema.prisma` — `Auth.refreshToken`, `User.emailVerifyToken`, `User.resetToken`
- Refresh tokens and reset tokens are stored as raw hex strings. If the DB is compromised, all active sessions and pending resets are immediately usable.
- Fix: Store hashed tokens (SHA-256 of the secret is sufficient for non-guessable random bytes).

**One-session-per-user constraint is weak:**
- File: `src/modules/auth/auth.service.ts` lines 219–223
- `prisma.auth.upsert` on `userId` means a user can only have one refresh token at a time. Logging in from a second device invalidates the first. This is a usability problem that will surface quickly.
- Fix: Replace `Auth` model with a `sessions` table keyed by a unique session ID, allowing multiple concurrent refresh tokens per user.

**No rate limiting anywhere:**
- The application installs no rate-limiting middleware on any route. The auth endpoints (`/auth/login`, `/auth/register`, `/auth/forgot-password`) are fully open to brute-force and enumeration attacks.
- Fix: Add `@nestjs/throttler` or a Redis-backed rate limiter as global middleware.

---

## Technical Debt

**`resolveLang` helper duplicated across every service:**
- Files: `src/modules/universities/universities.service.ts`, `src/modules/programs/programs.service.ts`, `src/modules/sync/sync.service.ts`
- All three define a local `resolveLang = (obj: any) => obj[lng] ?? obj.en ?? obj.fi ?? ''` function. `src/common/utils/` is the intended home for shared utilities but is empty.
- Fix: Extract to `src/common/utils/resolve-lang.ts` and import.

**Inconsistent `ValidationPipe` application — per-route vs global:**
- Some controllers apply `ValidationPipe` per-route (`SearchController`, `AuthController`, `MockTestsController`).
- `UniversitiesController` and `ProgramsController` apply no `ValidationPipe` at all.
- `main.ts` does not register a global `ValidationPipe`.
- This means some endpoints validate input and some do not, with no clear rule.
- Fix: Register `ValidationPipe({ transform: true, whitelist: true })` globally in `main.ts` and remove per-route instances.

**Pervasive use of `any` type:**
- Files: `src/modules/sync/sync.service.ts`, `src/modules/universities/universities.service.ts`, `src/modules/programs/programs.service.ts`
- The upstream Opintopolku API response shapes are typed as `any` throughout. ESLint rule `no-explicit-any` is disabled. This means TypeScript provides no safety for any upstream data transformation.
- Risk: Renaming or restructuring API fields produces silent runtime errors with no compile-time warning.

**`sync.service.ts` — sequential upserts inside loops (N+1 problem):**
- File: `src/modules/sync/sync.service.ts` lines 59–66 (institutions) and lines 192–199 (programs)
- For each hit on each page, the sync calls `upsertInstitution()` or `upsertProgram()`, which itself makes 1–2 additional HTTP requests to Opintopolku and multiple DB operations — all sequentially inside a `for` loop.
- Impact: A full sync of hundreds of institutions each requiring a detail fetch will be very slow and may hit API rate limits.
- Fix: Batch detail fetches with `Promise.all` with concurrency limiting (e.g., `p-limit`).

**Entity files are NestJS scaffolds, not Prisma entities:**
- The codebase generates database types from Prisma (`generated/prisma`), but the `entities/` directories contain hand-written empty classes. These two representations are completely disconnected.
- Fix: Either use the Prisma-generated types directly (as `auth.service.ts` and `users.service.ts` already do) or populate entity classes with proper field decorators. The empty entity files should be deleted or populated.

**`docs/entity-relationship.mmd` is out of date:**
- File: `docs/entity-relationship.mmd`
- The diagram omits `TestTemplate`, `Question`, `AnswerOption`, `MockTestAnswer`, `ProgramUniversity`, and `UniversityLocation` models that are all present in the actual schema. The diagram also shows a `Language` entity that does not exist in `prisma/schema.prisma`.
- Risk: Misleads developers about the actual data model.

**`server.pid` committed to the repository:**
- File: `/home/liam/Downloads/github_repo/studyfin-backend/server.pid` exists at the project root and is not in `.gitignore`. PID files from a running `nest start` process should not be tracked.

---

## Data Layer Concerns

**No database migrations committed:**
- The Prisma schema in `prisma/schema.prisma` has a full set of models, but there is no `prisma/migrations/` directory. Migrations must be generated before the schema can be applied to a real database.
- Impact: A new developer cannot run `prisma migrate deploy` — they must use `prisma db push` (destructive) or generate migrations manually.

**`prisma/schema.prisma` has no `url` in datasource block:**
- File: `prisma/schema.prisma` lines 6–8
- The `datasource db` block has `provider = "postgresql"` but no `url = env("DATABASE_URL")`. This works when `DATABASE_URL` is set in `.env` and `dotenv/config` is loaded first (as in `prisma.config.ts`), but will break any tool or CI step that invokes Prisma CLI without loading the env file first.
- Fix: Add `url = env("DATABASE_URL")` explicitly to the datasource block.

**`PrismaService` does not implement `OnModuleDestroy`:**
- File: `src/providers/prisma.service.ts`
- `OnModuleInit` calls `$connect()`, but there is no `OnModuleDestroy` with `$disconnect()`. In tests and graceful shutdowns, the Prisma connection pool is never explicitly closed, which can cause test timeouts and logs warnings.

**`type` field on `University` and `Program` is an unvalidated string:**
- Files: `prisma/schema.prisma` lines 18 and 53
- Comments say `// "yo" | "amk" | "amm"` but the field is a plain `String` with no enum constraint. The sync service derives the type via heuristic string matching (`resolveType`), which can silently produce unexpected values if the upstream API changes.
- Fix: Use a Prisma `enum` or add a DB check constraint.

---

## Missing Infrastructure

**Redis is provisioned but never used:**
- File: `docker-compose.yml`
- Redis 7 is declared as a service on port 6379, but no Redis client (`ioredis`, `@nestjs-modules/ioredis`, etc.) is installed or imported. Redis is unused for caching, session storage, rate limiting, or background queues.

**No environment variable validation on startup:**
- The application reads `JWT_SECRET`, `JWT_ACCESS_EXPIRATION`, `JWT_REFRESH_EXPIRATION`, `DATABASE_URL`, and `PORT` directly from `process.env` without any validation or defaults that fail loudly. A missing `DATABASE_URL` will only surface at runtime when the Prisma adapter tries to connect.
- Fix: Add `@nestjs/config` with a `Joi` or `zod`-based validation schema that fails fast at startup if required variables are missing.

**No global exception filter:**
- `src/common/filters/` is empty. Prisma errors (`PrismaClientKnownRequestError`, `PrismaClientValidationError`) are not caught anywhere. When a Prisma unique constraint is violated outside of code that explicitly catches it, NestJS will leak a raw Prisma error object to the client including internal DB details.
- Fix: Add a `PrismaExceptionFilter` in `src/common/filters/` and register it globally.

**No request logging or correlation IDs:**
- `src/common/interceptors/` and `src/common/middleware/` are empty. There is no request lifecycle logging. Debugging production issues requires finding relevant logs without any way to correlate a request across service calls.

**No health check beyond the root route:**
- `GET /` returns `'Hello World!'`. There is no structured health check (no `@nestjs/terminus`, no DB ping, no upstream API reachability check).

---

## Risks for Future Development

**Dual data source architecture creates synchronisation risk:**
- Several modules (`universities`, `programs`) still proxy directly to the Opintopolku API and return live data. Other modules (`search`) query the local PostgreSQL database populated by the sync service. Adding features that join live proxy data with DB data is not straightforward because the two sources can be out of sync.
- Fix: Decide on a single source of truth. Either retire the proxy routes when the sync is reliable, or keep both and make the divergence explicit.

**Auth module creates a hard coupling between `AuthService` and `UsersService`:**
- Files: `src/modules/auth/auth.service.ts`, `src/modules/auth/auth.module.ts`
- `AuthService` depends on `UsersService` for all user lookups and mutations. `UsersModule` exports `UsersService` for this purpose. Any expansion of user management (roles, bans, 2FA) must touch both services and their cross-module imports.

**`MockTest.status` is an unvalidated string enum:**
- File: `prisma/schema.prisma` line 210
- `status String @default("in_progress")` — valid values are `"in_progress"` and `"completed"`, enforced only by application code in `mock-tests.service.ts`. No DB enum, no Prisma-level enum. A bug or migration could produce records with arbitrary status strings.

**`implementations` field is untyped JSON:**
- Files: `prisma/schema.prisma` line 64, `src/modules/search/search.service.ts` lines 145–168
- `Program.implementations` is a `Json?` column. The `cleanImplementations` method in `SearchService` contains defensive code to handle "both old (raw API shape) and new (already resolved) formats", indicating the stored data shape changed at some point and the field now contains mixed formats. This is fragile.
- Fix: Define a typed interface, migrate all stored records to a single shape, or extract implementations into a proper relational table.

**Test coverage gaps:**
- `src/modules/sync/` — `SyncService` has no test file. It contains the most complex and stateful logic in the codebase (multi-page HTTP pagination, nested upserts, location delete+recreate). This is the highest-risk untested module.
- `src/modules/search/search.spec.ts` — `DbSearchQueryDto`, `SearchQueryDto`, and the `search()` method on `SearchService` are tested, but the controller layer (validation pipe behaviour, bad query params) is not tested.
- `src/modules/universities/universities.spec.ts` and `src/modules/users/users.spec.ts` — only test that controllers and services are defined (`toBeDefined()`). No behaviour is tested.
- `src/modules/programs/` — no test file at all.
- `test/app.e2e-spec.ts` — the single E2E test checks only `GET /` for `'Hello World!'`. No auth, no DB, no real route behaviour is covered.
- `src/common/guards/jwt-auth.guard.ts` — guard is not tested.

---

*Concerns audit: 2026-04-24*
