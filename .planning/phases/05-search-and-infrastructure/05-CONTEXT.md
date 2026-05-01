# Phase 5: Search and Infrastructure - Context

**Gathered:** 2026-05-01
**Status:** Ready for planning

<domain>
## Phase Boundary

A unified full-text search endpoint finds programs and institutions by relevance; the platform gets Redis caching, rate limiting, and Swagger API documentation. This phase upgrades the existing SearchModule from simple `contains` matching to PostgreSQL full-text search with relevance scoring, wires Redis (already provisioned) into the application, applies global rate limiting, replaces bare `dotenv/config` with `@nestjs/config`, and adds Swagger documentation for all public endpoints.
</domain>

<decisions>
## Implementation Decisions

### Unified search design
- **D-01:** Replace existing `GET /search` endpoint with mixed results. Return programs AND institutions in a single `hits` array with a `type: 'program' | 'institution'` discriminator field on each hit. Use `fullTextSearchPostgres` preview feature with `orderBy: { _relevance }` for relevance scoring. Keep the `?type=` query param for filtering to programs-only or institutions-only. Pagination uses `?page=` (0-indexed) and `?size=` (default 20).
- **D-02:** Remove `GET /search/institutions` entirely. All search flows through `GET /search?q=&type=&page=&size=`.

### Caching scope & invalidation
- **D-03:** Cache lists AND detail endpoints: `GET /programs`, `GET /programs/:oid`, `GET /universities`, `GET /universities/:oid`, and `GET /search`. All with 24h TTL. Guidance and auth endpoints are not cached.
- **D-04:** TTL-based expiration with sync-triggered invalidation. After a successful sync run in `SyncService.syncAll()`, flush program, university, and search cache keys. This keeps data fresh after the daily midnight sync without complex event-driven invalidation.

### Rate limiting thresholds
- **D-05:** Public endpoints: 100 requests per 60 seconds per IP. Handles normal API browsing (pagination through programs, universities, search) while preventing scraping abuse.
- **D-06:** Admin routes: 30 req/60s. Auth endpoints (login, register, refresh, forgot/reset password): 10 req/60s — prevents brute force without locking out legitimate users.

### Swagger coverage scope
- **D-07:** Document all public endpoints: programs (list, detail, university-programs), universities (list, detail), search (unified), guidance (GET), sync (POST /sync/run), auth (register, login, refresh, me, verify, forgot/reset), and user profile (GET/PATCH /users/me). Admin endpoints excluded — they are internal and may change.
- **D-08:** Input DTOs only — `@ApiProperty` on request body and query DTOs. Response shapes inferred from TypeScript return types. No explicit `@ApiResponse` decorators on controllers.

### Claude's Discretion
- Exact `fullTextSearchPostgres` index configuration, query structure, and relevance weight tuning across Program and University tables
- Cache key naming convention and how cache invalidation in SyncService is implemented
- `@nestjs/cache-manager` + `@keyv/redis` module registration approach (global `CacheModule` vs per-module)
- `@nestjs/throttler` guard registration approach (global `APP_GUARD` or per-module `ThrottlerGuard` with skip logic)
- Exact `@ApiProperty` annotations on each DTO
- `@nestjs/config` migration approach — how to load typed env vars and integrate with existing `dotenv/config` usage
- Search result field shape for the mixed `hits` array (how much program vs institution detail to include per hit)
- Whether to guard `POST /sync/run` with admin auth (deferred from Phase 2 D-10) — default: leave unguarded unless user decides otherwise
</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Requirements
- `.planning/REQUIREMENTS.md` — SRCH-01 through SRCH-08 define the exact acceptance criteria for this phase
- `.planning/ROADMAP.md` — Phase 5 goal, success criteria, and dependencies (depends on Phase 2)

### Data model and Prisma
- `prisma/schema.prisma` — Full schema: Program, University, UniversityLocation models. Must enable `fullTextSearchPostgres` preview feature. Required indexes for full-text search columns.

### Search module (existing — to be upgraded)
- `src/modules/search/search.service.ts` — Current `search()` method with `contains` matching and separate type queries. Rewritten to use full-text search with relevance scoring and mixed results.
- `src/modules/search/search.controller.ts` — GET /search and GET /search/institutions (the latter removed per D-02)
- `src/modules/search/search.module.ts` — SearchModule wiring
- `src/modules/search/dto/search-query.dto.ts` — Existing DTOs with `q`, `type`, `page`, `size` params

### Services to wire for caching
- `src/modules/sync/sync.service.ts` — SyncService.syncAll() where cache invalidation is added (D-04)
- `src/modules/programs/programs.service.ts` — ProgramsService where cache applies (D-03)
- `src/modules/universities/universities.service.ts` — UniversitiesService where cache applies (D-03)
- `src/modules/guidance/guidance.module.ts` — GuidanceModule (not cached per D-03)
- `src/modules/users/users.module.ts` — UsersModule (profile endpoints get Swagger docs per D-07)

### Auth, guards, and decorators
- `src/common/guards/jwt-auth.guard.ts` — Reused for any auth-guarded endpoints
- `src/common/guards/roles.guard.ts` — Reused for admin-guarded endpoints
- `src/common/decorators/roles.decorator.ts` — @Roles('ADMIN') for any admin-only routes
- `src/common/decorators/current-user.decorator.ts` — CurrentUserData interface for authenticated routes

### Shared infrastructure
- `src/providers/prisma.service.ts` — Global PrismaService
- `src/app.module.ts` — AppModule where new global modules (CacheModule, ThrottlerModule, ConfigModule) are registered
- `src/main.ts` — App bootstrap where Swagger is configured and `dotenv/config` is replaced with ConfigModule
- `docker-compose.yml` — Redis 7 on port 6379 (already provisioned, unused)

### Prior phase context
- `.planning/phases/02-db-backed-apis/02-CONTEXT.md` — D-10 deferred sync endpoint auth to Phase 5; pagination and Prisma query patterns
- `.planning/phases/04-user-features/04-CONTEXT.md` — User profile and program shortlisting endpoints (documented in Swagger per D-07)
</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `SearchService` (`src/modules/search/search.service.ts`): Already has a working `search()` method with type filtering and pagination — upgrade to full-text and mixed results, don't rewrite from scratch
- `PrismaService` (`src/providers/prisma.service.ts`): Global provider, already injected everywhere needed
- `JwtAuthGuard` + `RolesGuard`: Already implemented — reuse for guarding sync endpoint if sync auth is decided
- Existing SearchQueryDto: Already validated `q`, `type`, `page`, `size` params — extend for the new search
- Redis 7 in docker-compose.yml: Already provisioned on port 6379 — just needs client library wiring

### Established Patterns
- Controllers apply `@UseGuards()` per-route, not globally — throttler should be global via `APP_GUARD` (different pattern, appropriate for rate limiting)
- `ValidationPipe({ transform: true, whitelist: true })` applied per-route
- DTOs use `class-validator` + `class-transformer` decorators
- Pagination: `page` (0-indexed) + `size` params with `skip: page * size, take: size`
- Services throw NestJS HTTP exceptions directly
- `PrismaModule` is `@Global()` — any new infrastructure modules (CacheModule, ConfigModule) should follow a similar pattern
- Contracts use `@prisma/adapter-pg` with `pg` driver — no ORM migration needed

### Integration Points
- `src/app.module.ts` — CacheModule, ThrottlerModule, ConfigModule registration
- `src/main.ts` — SwaggerModule setup, `ConfigService` replaces `dotenv/config`
- `src/modules/sync/sync.service.ts` — Inject CacheManager for post-sync invalidation
- `prisma/schema.prisma` — Add `previewFeatures = ["fullTextSearchPostgres"]` to generator block; add full-text indexes to Program and University tables
- `src/modules/search/search.controller.ts` — Remove `GET /search/institutions` route; update remaining routes
</code_context>

<specifics>
## Specific Ideas

- User explicitly chose mixed search results (programs + institutions in one ranked list) — matches SRCH-02's intent for a unified search experience
- User explicitly chose to remove `GET /search/institutions` — clean API surface, no backward compat cruft
- User defers on exact thresholds and configuration details to Claude during planning — researcher and planner should make informed choices based on NestJS/Prisma best practices
</specifics>

<deferred>
## Deferred Ideas

- Guarding `POST /sync/run` with admin auth — explicitly considered during Phase 2 (D-10) and Phase 5 discussion; left unguarded for operational convenience. Can be revisited if needed.
- Advanced search features (autocomplete, fuzzy matching, Meilisearch) — v2 per REQUIREMENTS.md (SRCH-09, SRCH-10)
- Admin cache invalidation endpoint — not in requirements; TTL + sync-triggered invalidation is sufficient

None — discussion stayed within phase scope
</deferred>

---

*Phase: 05-search-and-infrastructure*
*Context gathered: 2026-05-01*
