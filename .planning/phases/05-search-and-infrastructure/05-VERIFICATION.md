---
phase: 05-search-and-infrastructure
verified: 2026-05-01T17:30:00Z
status: human_needed
score: 28/28 must-haves verified
overrides_applied: 0
gaps: []
human_verification:
  - test: "Swagger UI loads at GET /api"
    expected: "Swagger UI page renders with all public endpoint groups (Programs, Universities, Guidance, Sync, Auth, Search, Users), Bearer auth lock icons on Auth and Users, and field-level DTO documentation"
    why_human: "Requires running the server with npm run start:dev and opening http://localhost:3000/api in a browser"
  - test: "Auth endpoints return 429 after 10 requests in 60 seconds"
    expected: "POST /auth/login returns 429 Too Many Requests after 10 rapid requests within 60 seconds"
    why_human: "Requires running server and making sequential curl requests to verify rate limit threshold"
  - test: "Admin endpoints return 429 after 30 requests in 60 seconds"
    expected: "GET /admin/users returns 429 Too Many Requests after 30 rapid requests within 60 seconds"
    why_human: "Requires running server and making sequential curl requests to verify rate limit threshold"
  - test: "GIN full-text indexes exist in the database"
    expected: "PostgreSQL has GIN indexes named University_name_description_fts_idx and Program_name_description_fts_idx on to_tsvector('english', ...) columns"
    why_human: "Requires connecting to the PostgreSQL database with psql to verify index existence"
---

# Phase 5: Search and Infrastructure Verification Report

**Phase Goal:** A unified search endpoint finds programs and institutions by relevance; the platform has caching, rate limiting, and API documentation
**Verified:** 2026-05-01T17:30:00Z
**Status:** human_needed
**Re-verification:** No -- initial verification

## Goal Achievement

### Observable Truths

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | `GET /search?q=engineering` returns a single hits array with program AND institution results | VERIFIED | `search.service.ts` `searchMixed()` queries both `program` and `university` tables via `Promise.all` (lines 134-153) and merges results (lines 157-178) |
| 2 | Each hit has a type discriminator: `'program'` or `'institution'` | VERIFIED | `mapProgramHit()` returns `type: 'program'` (line 186), `mapInstitutionHit()` returns `type: 'institution'` (line 215) |
| 3 | Results use relevance scoring via `_relevance` when `q` is provided | VERIFIED | `search.service.ts` lines 48-52: `_relevance` orderBy with `sort: 'desc'` when `q` is truthy |
| 4 | `type=programs` returns only programs | VERIFIED | `search.service.ts` lines 57-59: calls `searchProgramsOnly()` which queries only the program table |
| 5 | `type=institutions` returns only institutions | VERIFIED | `search.service.ts` lines 59-60: calls `searchInstitutionsOnly()` which queries only the university table |
| 6 | `GET /search/institutions` endpoint is removed (returns 404) | VERIFIED | `search.controller.ts` has only `@Get()` at line 11, no `@Get('institutions')` route |
| 7 | ProgramsService.findAll returns cached results on repeat requests within 24h TTL | VERIFIED | `programs.service.ts` line 14: cache key, line 15-16: cache.get(), line 43: cache.set() with 24h TTL |
| 8 | ProgramsService.findOne returns cached results on repeat requests within 24h TTL | VERIFIED | `programs.service.ts` line 48: cache key, line 49-50: cache.get(), line 64: cache.set() with 24h TTL |
| 9 | UniversitiesService.findAll returns cached results on repeat requests within 24h TTL | VERIFIED | `universities.service.ts` line 14: cache key, line 15-16: cache.get(), line 39: cache.set() with 24h TTL |
| 10 | UniversitiesService.findOne returns cached results on repeat requests within 24h TTL | VERIFIED | `universities.service.ts` line 44: cache key, line 45-46: cache.get(), line 56: cache.set() with 24h TTL |
| 11 | SearchService.search returns cached results on repeat requests within 24h TTL | VERIFIED | `search.service.ts` line 27: cache key, line 28-34: cache.get() with generic type, line 66: cache.set() with 24h TTL |
| 12 | SyncService.syncAll invalidates cache keys after successful sync | VERIFIED | `sync.service.ts` line 46: `await this.cacheManager.clear()` after sync completion log (lines 41-43), inside try block before finally |
| 13 | API rate limit of 100 requests per 60 seconds is enforced on all endpoints | VERIFIED | `app.module.ts` line 24-27: `ThrottlerModule.forRoot([{ ttl: 60000, limit: 100 }])`, line 52: `{ provide: APP_GUARD, useClass: ThrottlerGuard }` |
| 14 | Auth endpoints limited to 10 req/60s | VERIFIED | `auth.controller.ts` line 28: `@Throttle({ default: { limit: 10, ttl: 60000 } })` class-level decorator |
| 15 | Admin endpoints limited to 30 req/60s | VERIFIED | `admin.controller.ts` line 24: `@Throttle({ default: { limit: 30, ttl: 60000 } })` class-level decorator |
| 16 | Swagger API documentation is browsable at `GET /api` | VERIFIED | `main.ts` line 18: `SwaggerModule.setup('api', app, document)`, lines 12-17: `DocumentBuilder` config with title, Bearer auth |
| 17 | 6 public controllers have `@ApiTags` | VERIFIED | ProgramsController: `@ApiTags('Programs')`, Universities: `'Universities'`, Guidance: `'Guidance'`, Sync: `'Sync'`, Auth: `'Auth'`, Users: `'Users'`, Search: `'Search'` |
| 18 | AdminController is NOT tagged in Swagger | VERIFIED | `admin.controller.ts` has no `@ApiTags` decorator |
| 19 | UsersController and AuthController have `@ApiBearerAuth()` | VERIFIED | `users.controller.ts` line 23: `@ApiBearerAuth()`, `auth.controller.ts` line 27: `@ApiBearerAuth()` |
| 20 | Auth DTOs (6 files) have `@ApiProperty` on all fields | VERIFIED | register.dto.ts (4 fields), login.dto.ts (2), refresh-token.dto.ts (1), forgot-password.dto.ts (1), reset-password.dto.ts (2), verify-email.dto.ts (1) |
| 21 | Guidance DTOs (3 files) have `@ApiProperty` on all fields | VERIFIED | create-guidance.dto.ts (1), update-guidance.dto.ts (2 with `@ApiPropertyOptional`), guidance-section.dto.ts (4) |
| 22 | Users DTOs (3 files) have `@ApiProperty` on all fields | VERIFIED | update-profile.dto.ts (2 with `@ApiPropertyOptional`), list-saved-programs-query.dto.ts (3 with `@ApiPropertyOptional`), update-saved-program.dto.ts (1) |
| 23 | UnifiedSearchQueryDto has `@ApiPropertyOptional` on all fields | VERIFIED | `search-query.dto.ts`: `@ApiPropertyOptional` on `q`, `type`, `size`, `page` |
| 24 | Application configuration loaded from env vars by ConfigService | VERIFIED | `app.module.ts` line 23: `ConfigModule.forRoot({ isGlobal: true })`; `main.ts` line 9: `app.get(ConfigService)`, line 28: `configService.get('PORT', 3000)`; no `import 'dotenv/config'` in main.ts |
| 25 | `GET /search` without `q` returns all results ordered by name | VERIFIED | `search.service.ts` lines 38-39: `progWhere = {}`, line 49: `progOrderBy = [{ name: 'asc' }]` when q is empty |
| 26 | Pagination: page 0-indexed (default 0), size default 20 (max 100) | VERIFIED | `search-query.dto.ts`: `page` default 0 with `@Min(0)`, `size` default 20 with `@Max(100)`; `search.service.ts` line 81: `skip: page * size, take: size` |
| 27 | Cache keys follow convention: `{module}:{type}:{identifier}` | VERIFIED | `programs:list:{json}`, `programs:detail:{oid}`, `universities:list:{json}`, `universities:detail:{oid}`, `universities:programs:{oid}:{json}`, `search:{json}` |
| 28 | `fullTextSearchPostgres` preview feature enabled with GIN index support | VERIFIED | `schema.prisma` line 4: `previewFeatures = ["fullTextSearchPostgres"]`; `prisma/create-fulltext-indexes.sql` creates GIN indexes on both tables |

**Score:** 28/28 truths verified

### Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `prisma/schema.prisma` | `fullTextSearchPostgres` preview + GIN index support | VERIFIED | Line 4: `previewFeatures = ["fullTextSearchPostgres"]`; raw SQL GIN indexes in `create-fulltext-indexes.sql` (Prisma 7 PSL limitation documented) |
| `src/app.module.ts` | ConfigModule/CacheModule/ThrottlerModule registration | VERIFIED | Lines 23-36: all three modules registered globally; line 52: `APP_GUARD` with `ThrottlerGuard` |
| `src/main.ts` | Swagger bootstrap + ConfigService port resolution | VERIFIED | Lines 12-19: Swagger setup; line 9: ConfigService retrieval; line 28: port from configService |
| `src/modules/search/dto/search-query.dto.ts` | UnifiedSearchQueryDto with 4 fields + @ApiProperty | VERIFIED | 4 fields (q, type, size, page) with `@ApiPropertyOptional` decorators |
| `src/modules/search/dto/search-response.dto.ts` | SearchHitDto with type discriminator | VERIFIED | `SearchHitDto` with `type: 'program' | 'institution'` at line 63 |
| `src/modules/search/search.service.ts` | Full-text search, relevance scoring, mixed results | VERIFIED | Uses `{ search: q }` where clause, `_relevance` orderBy, 3 search methods |
| `src/modules/search/search.controller.ts` | Unified `GET /search` route, no `/search/institutions` | VERIFIED | Single `@Get()` route; no `@Get('institutions')` |
| `src/modules/programs/programs.service.ts` | Cache-aside on findAll and findOne | VERIFIED | Lines 14-16 (get), 43 (set) for findAll; lines 48-50 (get), 64 (set) for findOne |
| `src/modules/universities/universities.service.ts` | Cache-aside on findAll, findOne, findPrograms | VERIFIED | 3 methods each with cache.get/set with 24h TTL |
| `src/modules/search/search.service.ts` (caching) | Cache-aside on search method | VERIFIED | Lines 27-34 (get), 66 (set) with 24h TTL |
| `src/modules/sync/sync.service.ts` | Cache invalidation in syncAll | VERIFIED | Line 46: `await this.cacheManager.clear()` after successful sync |
| `src/modules/auth/auth.controller.ts` | @Throttle 10 req/60s | VERIFIED | Line 28: `@Throttle({ default: { limit: 10, ttl: 60000 } })` |
| `src/modules/admin/admin.controller.ts` | @Throttle 30 req/60s (no @ApiTags) | VERIFIED | Line 24: `@Throttle({ default: { limit: 30, ttl: 60000 } })`; no `@ApiTags` |

### Key Link Verification

| From | To | Via | Status | Details |
|------|----|-----|--------|---------|
| `app.module.ts` | `@nestjs/config` | `ConfigModule.forRoot` | WIRED | Line 23: `ConfigModule.forRoot({ isGlobal: true })` |
| `app.module.ts` | `@keyv/redis` | `CacheModule.registerAsync -> KeyvRedis` | WIRED | Lines 29-36: `new KeyvRedis(configService.get('REDIS_URL'))` |
| `app.module.ts` | `@nestjs/throttler` | `ThrottlerModule.forRoot` | WIRED | Lines 24-28: `ThrottlerModule.forRoot([{ ttl: 60000, limit: 100 }])` |
| `app.module.ts` | `APP_GUARD` | `ThrottlerGuard provider` | WIRED | Line 52: `{ provide: APP_GUARD, useClass: ThrottlerGuard }` |
| `main.ts` | `@nestjs/swagger` | `SwaggerModule.createDocument + setup` | WIRED | Lines 18-19: both createDocument and setup called |
| `search.controller.ts` | `search.service.ts` | `search()` method | WIRED | Line 20: `return this.searchService.search(query)` |
| `search.service.ts` | Prisma full-text API | `_relevance` orderBy + `{ search }` where | WIRED | Lines 38, 48: `{ name: { search: q } }` where clause, `_relevance` orderBy |
| `search.service.ts` | `UnifiedSearchQueryDto` | query parameter type | WIRED | Line 4: import from dto; line 15: method parameter type |
| `programs.service.ts` | `CACHE_MANAGER` | `@Inject(CACHE_MANAGER)` | WIRED | Lines 2, 10: import and injection |
| `universities.service.ts` | `CACHE_MANAGER` | `@Inject(CACHE_MANAGER)` | WIRED | Lines 2, 10: import and injection |
| `search.service.ts` | `CACHE_MANAGER` | `@Inject(CACHE_MANAGER)` | WIRED | Lines 2, 12: import and injection |
| `sync.service.ts` | `CACHE_MANAGER` | `@Inject(CACHE_MANAGER)` | WIRED | Lines 2, 22: import and injection |
| `SyncService.syncAll` | cache invalidation | `cacheManager.clear()` | WIRED | Line 46: `await this.cacheManager.clear()` after completion log |
| `auth.controller.ts` | `@nestjs/throttler` | `@Throttle` decorator | WIRED | Lines 10, 28: import and decorator with 10 req/60s |
| `admin.controller.ts` | `@nestjs/throttler` | `@Throttle` decorator | WIRED | Lines 13, 24: import and decorator with 30 req/60s |

### Data-Flow Trace (Level 4)

| Artifact | Data Variable | Source | Produces Real Data | Status |
|----------|--------------|--------|--------------------|--------|
| `search.service.ts` | `hits` array | Prisma full-text query with `_relevance` orderBy | Yes -- Prisma queries against PostgreSQL with full-text search where clause | FLOWING |
| `search.service.ts` | `progWhere` / `uniWhere` | Prisma `{ name: { search: q } }` | Yes -- maps validated query DTO to Prisma where clause | FLOWING |
| `programs.service.ts` | `result` | Prisma `findMany` on Program table | Yes -- queries real DB columns with full includes | FLOWING |
| `universities.service.ts` | `result` | Prisma `findMany` on University table | Yes -- queries real DB columns with location includes | FLOWING |

### Behavioral Spot-Checks

| Behavior | Command | Result | Status |
|----------|---------|--------|--------|
| `npm run build` compiles | `npm run build` | Build exits 0 with no errors | PASS |
| Search tests pass | `npm run test -- --testPathPatterns="search"` | 4/4 tests pass, 1 suite passed | PASS |
| Old DTOs removed | `grep` for SearchQueryDto, DbSearchQueryDto, etc. in search module | No matches found | PASS |
| Old route removed | `grep` for `@Get('institutions')` in search controller | No matches found | PASS |
| dotenv import removed | `grep` for `import 'dotenv/config'` in main.ts | No matches found | PASS |

Note: Full test suite shows 9 pre-existing failures in `users.service.spec.ts` (`prisma.userProgram.count is not a function`). These are unrelated to Phase 5 changes and exist on the base commit.

### Requirements Coverage

| Requirement | Source Plan | Description | Status | Evidence |
|-------------|------------|-------------|--------|----------|
| SRCH-01 | 05-01-PLAN | `fullTextSearchPostgres` preview feature enabled | SATISFIED | `schema.prisma` line 4; raw SQL GIN indexes at `prisma/create-fulltext-indexes.sql` |
| SRCH-02 | 05-02-PLAN | Unified search endpoint GET /search returns mixed programs + institutions | SATISFIED | `search.controller.ts` `@Get()`, `search.service.ts` `searchMixed()` |
| SRCH-03 | 05-02-PLAN | Relevance scoring via `orderBy: { _relevance }` | SATISFIED | `search.service.ts` lines 48-52 |
| SRCH-04 | 05-02-PLAN | Type filter (programs only, institutions only, or both) | SATISFIED | `search.service.ts` lines 57-63: type routing logic |
| SRCH-05 | 05-01-PLAN | `@nestjs/config` installed, replaces `dotenv/config` | SATISFIED | `package.json` line 29; `app.module.ts` line 23; `main.ts` has no `import 'dotenv/config'` |
| SRCH-06 | 05-03-PLAN | `@nestjs/cache-manager` + `@keyv/redis` wired; program/institution lists cached 24h TTL | SATISFIED | `app.module.ts` lines 29-36 (CacheModule); 4 service files with cache-aside pattern |
| SRCH-07 | 05-04-PLAN | `@nestjs/throttler` applied globally; admin routes have stricter limits | SATISFIED | `app.module.ts` lines 24-28 (ThrottlerModule) + line 52 (ThrottlerGuard); `auth.controller.ts` 10/60s; `admin.controller.ts` 30/60s |
| SRCH-08 | 05-01, 05-04, 05-05-PLAN | `@nestjs/swagger` installed; Swagger UI at `/api`; key DTOs have `@ApiProperty` | SATISFIED | `main.ts` SwaggerModule; 6 controllers with `@ApiTags`; 12+ DTO files with `@ApiProperty`/`@ApiPropertyOptional` |

### Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
|------|------|---------|----------|--------|
| (none) | - | - | - | No anti-patterns detected in Phase 5 modified files |

### Deferred Items

No deferred items -- all Phase 5 requirements are addressed within Phase 5 plans.

### Human Verification Required

1. **Swagger UI loads at GET /api**
   - **Test:** Start the app with `npm run start:dev`, visit `http://localhost:3000/api`
   - **Expected:** Swagger UI renders with all public endpoint groups (Programs, Universities, Guidance, Sync, Auth, Search, Users), Bearer auth lock icons on Auth and Users routes, and field-level documentation for DTOs
   - **Why human:** Requires running server and visual inspection of the Swagger UI page

2. **Auth endpoints rate-limited to 10 req/60s**
   - **Test:** Make 11 rapid POST requests to `POST /auth/login` within 60 seconds using curl
   - **Expected:** The 11th request returns HTTP 429 Too Many Requests
   - **Why human:** Requires running server and making sequential HTTP requests

3. **Admin endpoints rate-limited to 30 req/60s**
   - **Test:** Make 31 rapid requests to any admin endpoint with proper auth within 60 seconds
   - **Expected:** The 31st request returns HTTP 429 Too Many Requests
   - **Why human:** Requires running server and making sequential HTTP requests

4. **GIN full-text indexes exist in the database**
   - **Test:** Connect to PostgreSQL and run `SELECT indexname FROM pg_indexes WHERE indexname LIKE '%fts_idx'`
   - **Expected:** `University_name_description_fts_idx` and `Program_name_description_fts_idx` indexes exist, using GIN on `to_tsvector('english', ...)`
   - **Why human:** Requires database connection with psql client

### Gaps Summary

No gaps found. All 28 observable truths are verified in the codebase. The phase goal is fully implemented in code. Four runtime/operational checks require human verification (Swagger UI visualization, rate limit enforcement, and GIN index application in the live database).

---

_Verified: 2026-05-01T17:30:00Z_
_Verifier: Claude (gsd-verifier)_
