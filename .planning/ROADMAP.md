# Roadmap: StudyFin Backend

## Overview

This milestone extends an already-working NestJS 11 + Prisma + PostgreSQL system into a production-ready API for international students discovering English-taught Finnish higher education programs. The work proceeds in five phases: first establishing the RBAC foundation and English-only DB state that everything else depends on, then retiring the live Opintopolku proxy in favor of fast DB-backed reads, then building the A-Z guidance content system that is the primary product differentiator, then exposing user profile and program-shortlisting capabilities with mock test access gating, and finally completing the platform with unified search and infrastructure hardening.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [ ] **Phase 1: RBAC Foundation** - Add role system, RBAC guards, and English-only DB cleanup
- [x] **Phase 2: DB-Backed APIs** - Retire live Opintopolku proxy; serve all data from local PostgreSQL
- [ ] **Phase 3: Guidance Content** - Build A-Z guidance content model, admin CRUD, and public read endpoints
- [ ] **Phase 4: User Features** - Expose user profile, program shortlisting, and mock test access gating
- [ ] **Phase 5: Search and Infrastructure** - Unified search, Redis caching, rate limiting, and Swagger docs

## Phase Details

### Phase 1: RBAC Foundation
**Goal**: The platform has a two-role access control system (user/admin) and contains only English-taught programs
**Depends on**: Nothing (first phase)
**Requirements**: FOUND-01, FOUND-03, FOUND-04, FOUND-05, FOUND-06, FOUND-07
**Success Criteria** (what must be TRUE):
  1. An authenticated request returns the caller's role from the database (not from the JWT payload)
  2. A route decorated with `@Roles('ADMIN')` returns 403 when called by a user with role "USER"
  3. A route decorated with `@Roles('ADMIN')` returns 200 when called by a user with role "ADMIN"
  4. The programs table contains no programs where "en" is absent from teachingLanguages
**Plans**: 4 plans

Plans:
- [ ] 01-01-PLAN.md — Add Role enum + db push + CurrentUserData interface (Wave 1)
- [ ] 01-02-PLAN.md — Create RolesGuard, Roles decorator, update JwtStrategy (Wave 2)
- [ ] 01-03-PLAN.md — Admin seed script + English cleanup script + package.json wiring (Wave 2)
- [x] 01-04-PLAN.md — Gap closure: fix role casing in docs, reassign FOUND-02, run DB cleanup (Wave 1, gap closure)

### Phase 2: DB-Backed APIs
**Goal**: All program and institution data is served from local PostgreSQL with no live calls to Opintopolku
**Depends on**: Phase 1
**Requirements**: DATA-01, DATA-02, DATA-03, DATA-04, DATA-05
**Success Criteria** (what must be TRUE):
  1. `GET /programs/:oid` returns a program record sourced from the local database, not from Opintopolku
  2. `GET /universities/:oid` returns an institution record sourced from the local database, not from Opintopolku
  3. Running two concurrent sync jobs does not produce duplicate-key errors or corrupt upsert results
  4. A university's locations are never empty during a sync run (location update is atomic)
**Plans**: 3 plans

Plans:
- [x] 02-01-PLAN.md — Rewrite ProgramsService with PrismaService + remove HttpModule from ProgramsModule (Wave 1)
- [x] 02-02-PLAN.md — Rewrite UniversitiesService with PrismaService + remove HttpModule from UniversitiesModule (Wave 1)
- [x] 02-03-PLAN.md — Patch SyncService: add mutex guard and $transaction for location upsert (Wave 1)

### Phase 3: Guidance Content
**Goal**: Admins can create and update A-Z guidance content per program; any visitor can read it
**Depends on**: Phase 1, Phase 2
**Requirements**: GUID-01, GUID-02, GUID-03, GUID-04, GUID-05, GUID-06, GUID-07
**Success Criteria** (what must be TRUE):
  1. `GET /guidance/:programOid` returns structured sections (key, title, body, order) without authentication
  2. `POST /guidance/:programOid` creates guidance when called by an admin; returns 403 for non-admin callers
  3. `PATCH /guidance/:programOid` updates existing guidance sections when called by an admin
  4. Posting guidance with a malformed section (missing required fields) returns a 400 validation error
  5. `GET /programs/:oid` and `GET /universities/:oid` responses include a flag indicating whether guidance exists
**Plans**: 4 plans

Plans:
- [x] 03-01-PLAN.md — Add GuidanceSection schema model + npx prisma db push [BLOCKING] (Wave 1)
- [x] 03-02-PLAN.md — Create GuidanceSectionDto, CreateGuidanceDto, UpdateGuidanceDto + GuidanceService (Wave 2)
- [x] 03-03-PLAN.md — Create GuidanceController + GuidanceModule + wire into AppModule (Wave 3)
- [x] 03-04-PLAN.md — Add hasGuidance flag to programs/universities services + guidance.spec.ts (Wave 3, parallel)

**UI hint**: no

### Phase 4: User Features
**Goal**: Authenticated users can manage their profile and saved programs; admins can control mock test access
**Depends on**: Phase 1
**Requirements**: FOUND-02, USER-01, USER-02, USER-03, USER-04, USER-05, USER-06, USER-07, USER-08, USER-09
**Success Criteria** (what must be TRUE):
  1. `GET /users/me` returns the authenticated user's profile data
  2. `PATCH /users/me` updates and returns the authenticated user's profile
  3. A user can save, update status on, and remove a program from their shortlist via the `/users/me/programs` endpoints
  4. `GET /users/me/programs` returns the authenticated user's full saved-program list
  5. Attempting to start a mock test without `hasTestAccess` returns 403; an admin can grant or revoke that flag
**Plans**: 4 plans

Plans:
- [x] 04-01-PLAN.md — Add hasTestAccess to User schema + npx prisma db push [BLOCKING] (Wave 1)
- [x] 04-02-PLAN.md — UsersService profile/saved-program methods + DTOs (Wave 2)
- [x] 04-03-PLAN.md — MockTestsService hasTestAccess guard + AdminModule controller/service/DTOs (Wave 2, parallel)
- [x] 04-04-PLAN.md — UsersController routes + AdminModule AppModule registration + unit tests (Wave 3)

**UI hint**: no

### Phase 5: Search and Infrastructure
**Goal**: A unified search endpoint finds programs and institutions by relevance; the platform has caching, rate limiting, and API documentation
**Depends on**: Phase 2
**Requirements**: SRCH-01, SRCH-02, SRCH-03, SRCH-04, SRCH-05, SRCH-06, SRCH-07, SRCH-08
**Success Criteria** (what must be TRUE):
  1. `GET /search?q=engineering` returns a relevance-ranked list of matching programs and institutions
  2. `GET /search?q=engineering&type=programs` returns only program results; `type=institutions` returns only institutions
  3. Program list and search responses are served from Redis cache on repeat requests within the 24-hour TTL
  4. Excessive requests to public and admin endpoints are rejected with 429 after the configured threshold
  5. Swagger UI is accessible at `/api` and documents all key endpoints and their DTOs
**Plans**: 4 plans
**UI hint**: no

Plans:
- [ ] 05-01-PLAN.md — Infrastructure foundation: npm packages, Prisma full-text search, ConfigModule/CacheModule/ThrottlerModule, Swagger bootstrap
- [ ] 05-02-PLAN.md — Unified search rewrite: full-text search with relevance scoring, mixed results, type discriminator
- [ ] 05-03-PLAN.md — Caching layer: cache-aside on programs/universities/search services, sync-triggered invalidation
- [ ] 05-04-PLAN.md — Swagger docs + throttle overrides: @ApiTags on public controllers, @ApiProperty on input DTOs, auth/admin rate limits

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4 → 5

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. RBAC Foundation | 4/4 | Complete (SC #4 DB cleanup pending operational step) | 2026-04-28 |
| 2. DB-Backed APIs | 3/3 | Complete | 2026-04-28 |
| 3. Guidance Content | 2/4 | In Progress|  |
| 4. User Features | 0/4 | Not started | - |
| 5. Search and Infrastructure | 0/4 | Planned | - |
