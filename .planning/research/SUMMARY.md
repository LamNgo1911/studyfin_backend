# Project Research Summary

**Project:** StudyFin Backend
**Domain:** Education guidance platform backend — English-taught Finnish programs for international students
**Researched:** 2026-04-25
**Confidence:** HIGH

## Executive Summary

StudyFin is a NestJS 11 + Prisma 7 + PostgreSQL 16 monolith serving international students seeking English-taught programs at Finnish universities and UAS institutions. The core stack is locked and non-negotiable; this milestone extends an already-working system rather than starting from scratch. The recommended approach is to ship foundational infrastructure first (RBAC role system, English-only DB cleanup, proxy retirement) before building the editorial and monetization features that depend on it. All new feature work follows the existing controller-service-DTO-Prisma pattern established in the universities and search modules — no architectural transformation is required.

The highest-leverage features for this milestone are: retiring the live Opintopolku proxy in favor of DB-backed APIs (delivering sub-100ms response times), a structured A-Z guidance content system (the primary differentiator over studyinfo.fi), and manual mock test access gating (monetization without payment integration complexity). All three depend on a two-role RBAC system (user/admin) being in place first. The RBAC implementation requires no external library — NestJS Reflector + a custom `RolesGuard` is the canonical approach and fits the existing guard conventions.

The primary risk in this milestone is data integrity at the DB-to-proxy transition boundary. Non-English programs from pre-filter syncs may still be in the DB, concurrent sync invocations can corrupt upserts, and the location delete/recreate pattern in sync lacks transaction wrapping. These must be resolved before the proxy is retired. Keep editorial content (guidance) in a separate, sync-never-touches table to eliminate any risk of Opintopolku overwrites destroying admin-created content.

---

## Key Findings

### Recommended Stack

The existing stack requires no replacement. Six npm packages should be added for this milestone: `@nestjs/config` (typed env vars replacing bare `dotenv`), `@nestjs/cache-manager` + `@keyv/redis` + `cache-manager` (Redis caching — Redis is already provisioned but unused), `@nestjs/throttler` (rate limiting for admin and public endpoints), and `@nestjs/swagger` (OpenAPI docs for the frontend team).

**Critical version constraint:** `cache-manager-redis-store` and `cache-manager-ioredis` are incompatible with `@nestjs/cache-manager` v3+. Use only `@keyv/redis` with `cache-manager` v7. Many StackOverflow answers reference the old broken packages.

**Core technologies:**
- NestJS 11 + Prisma 7 + PostgreSQL 16: locked in, fully compatible
- `@nestjs/config` 4.0.4: replaces bare `dotenv`; provides typed `ConfigService` with at-startup validation
- `@nestjs/cache-manager` 3.1.2 + `@keyv/redis` 5.1.6 + `cache-manager` 7.2.8: Redis caching via the NestJS v3 Keyv pattern
- `@nestjs/throttler` 6.5.0: per-route rate limiting via guard decorators
- `@nestjs/swagger` 11.4.1: OpenAPI auto-generation from existing DTO decorators
- Prisma `fullTextSearchPostgres` preview feature: enables `search:` operator for unified homepage search (still preview in Prisma v7; requires explicit flag — NOT the GA `fullTextSearch` which is MySQL-only)

See `.planning/research/STACK.md` for full installation commands and alternatives considered.

### Expected Features

**Must have (P1 — this milestone):**
- DB-backed program and institution APIs replacing the live Opintopolku proxy — core reliability and speed win
- Admin role on User model + `RolesGuard` — root dependency for all admin features
- A-Z guidance content model + admin CRUD endpoints — primary product differentiator
- Guidance read endpoints (`GET /programs/:id/guidance`, `GET /universities/:id/guidance`)
- Mock test `hasTestAccess` flag on User + admin toggle endpoint — monetization gating without Stripe
- User profile endpoints (`GET /users/me`, `PATCH /users/me`) — needed for any personalization
- User-program save/status endpoints — shortlisting across sessions
- Unified search endpoint returning mixed program + institution results — expected on any modern platform

**Should have (P2 — add when P1 is stable):**
- Admin test template management CRUD
- Saved universities endpoints (analogous to saved programs)
- Field-of-study-specific exam section tagging on TestTemplate
- Application deadline fields in guidance content

**Defer (P3 / v2+):**
- Payment integration (Stripe) — manual gating covers v1 at low user volume
- Email notifications — requires transactional email integration
- Full-text `tsvector` search or Meilisearch — not needed at hundreds-of-programs scale
- OAuth / social login — email+JWT sufficient for v1
- Search autocomplete/typeahead — add when UX feedback confirms need

See `.planning/research/FEATURES.md` for full prioritization matrix and competitor analysis.

### Architecture Approach

The architecture is a NestJS monolith organized by feature module. No AdminModule is needed — admin controllers live inside their feature modules and are distinguished by `@UseGuards(JwtAuthGuard, RolesGuard) @Roles('admin')` decorators on individual handlers. This matches the existing per-route guard pattern and avoids silently breaking public routes that would result from a global guard registration. Role is read from the DB on every authenticated request (in `JwtStrategy.validate()`) rather than embedded in the JWT — this ensures revocations take effect immediately, which matters for mock test access gating.

**Major components:**
1. `RolesGuard` + `@Roles()` decorator in `common/guards/` and `common/decorators/` — foundational RBAC; must be built before any admin feature
2. `GuidanceModule` — new standalone module; public read via `GET /guidance/:programOid`, admin write via POST/PATCH guarded by `@Roles('admin')`; `sections` stored as typed JSON column (not one table per section type)
3. `ProgramsService` / `UniversitiesService` (DB-backed) — replace `HttpService` calls with `PrismaService` queries; service-layer-only change, controllers unchanged
4. `SyncService` (English-only cleanup) — add filter and one-time DB cleanup before proxy retirement
5. `UsersModule` extensions — expose profile endpoints, add `mockTestAccess: Boolean` field, add `grantMockTestAccess` admin handler
6. `SearchModule` extension — add unified search endpoint using Prisma `fullTextSearchPostgres` preview feature

See `.planning/research/ARCHITECTURE.md` for full data flow diagrams and anti-pattern catalog.

### Critical Pitfalls

1. **Non-English programs left in DB from pre-filter syncs** — run a one-time `DELETE FROM Program WHERE NOT ('en' = ANY(teachingLanguages))` after the English filter is verified on sync, before retiring the proxy. Retiring the proxy with dirty DB data exposes Finnish-only records to users.

2. **Guard execution order — `JwtAuthGuard` must precede `RolesGuard`** — `@UseGuards(JwtAuthGuard, RolesGuard)` executes left-to-right. If reversed, `request.user` is undefined when `RolesGuard` runs, producing silent allow-all behavior. Consider a composed `AdminGuard` to prevent ordering mistakes.

3. **Sync upsert overwrites editorial content** — the Prisma upsert in `sync.service.ts` mirrors `create` fields exactly in the `update` block. Guidance content must live in a separate `Guidance` table that `SyncService` never touches. Do not add editorial fields directly to the `Program` model.

4. **Concurrent sync runs cause conflicts** — `POST /sync/run` is fire-and-forget with no mutex. Two concurrent calls produce duplicate upserts and unique constraint violations on `ProgramUniversity`. Add a `private syncing = false` flag with a `finally` reset in `SyncService.syncAll()`.

5. **Location delete/recreate lacks a transaction** — `sync.service.ts` does `deleteMany` then `createMany` for university locations without wrapping in `prisma.$transaction()`. A read between the two operations returns a university with zero locations. Wrap in a transaction.

6. **Auth tokens logged in plain text** — `auth.service.ts` logs email verification and password reset tokens via `console.log`. Gate this behind `NODE_ENV === 'development'` before any production deployment.

See `.planning/research/PITFALLS.md` for the full pitfall catalog including performance concerns and Opintopolku API integration risks.

---

## Implications for Roadmap

### Phase 1: RBAC Foundation + DB Cleanup

**Rationale:** Everything admin-related is blocked until the role system exists. The proxy cannot be safely retired until the DB is English-only. Both are low-complexity, high-dependency work that must come first.

**Delivers:**
- `User.role` field (Prisma migration)
- `User.mockTestAccess` boolean field (same migration)
- `JwtStrategy.validate()` extended to return `role`
- `CurrentUserData` interface updated
- `@Roles()` decorator + `RolesGuard` in `common/`
- English-only DB cleanup migration (delete non-English programs)
- `server.pid` added to `.gitignore`

**Addresses:** Admin role (P1), mock test access gating prerequisite (P1)
**Avoids:** Guard ordering pitfall, sync-overwrites-editorial pitfall, dirty-DB proxy retirement pitfall
**Research flag:** Standard NestJS pattern — no additional research needed

---

### Phase 2: DB-Backed APIs (Proxy Retirement)

**Rationale:** Depends on Phase 1 completing the DB cleanup. Once the DB is verified English-only, swap `HttpService` for `PrismaService` in `ProgramsService` and `UniversitiesService`. This is a service-layer-only migration — controllers do not change. Eliminates upstream latency and rate-limit exposure.

**Delivers:**
- `ProgramsService` rewritten to use `PrismaService`
- `UniversitiesService` rewritten to use `PrismaService`
- `HttpModule` removed from Programs and Universities modules
- Sub-100ms response times on program and institution reads
- Sync concurrent-run mutex added to `SyncService`
- Location delete/recreate wrapped in `prisma.$transaction()`

**Addresses:** DB-backed API (P1, highest-priority table stake)
**Avoids:** Concurrent sync pitfall, location read race condition
**Research flag:** Standard pattern — no additional research needed

---

### Phase 3: Guidance Content System

**Rationale:** Depends on Phases 1–2 (needs admin role system; guidance references programs that are now DB-backed). This is the primary product differentiator and the most complex new feature. The JSON-column approach for `sections` avoids per-section-type migration overhead and is the correct choice at this team size.

**Delivers:**
- `Guidance` Prisma model (`programOid @unique`, `sections Json`, `@@index([programOid])`)
- `GuidanceModule` with public `GET /guidance/:programOid` (no auth) and admin `POST/PATCH /guidance/:programOid` (JwtAuthGuard + RolesGuard)
- `GuidanceSection` TypeScript interface with DTO validation (prevent unstructured JSON writes)
- Guidance read endpoints linked from program detail responses

**Addresses:** A-Z guidance content (P1), guidance read endpoints (P1)
**Avoids:** JSON schema drift pitfall (validate before write), sync-overwrites pitfall (standalone table)
**Research flag:** No additional research needed — JSON column pattern and upsert pattern are well-documented

---

### Phase 4: User Features + Mock Test Gating

**Rationale:** User profile and saved-programs endpoints depend only on existing JWT auth (no new infrastructure). Mock test access gating requires Phase 1 (role system + `mockTestAccess` field). Group these together as they all extend `UsersModule`.

**Delivers:**
- `GET /users/me` and `PATCH /users/me` (user profile)
- `POST/PATCH/DELETE /users/me/programs/:id` (UserProgram shortlisting)
- `PATCH /users/:id/mock-test-access` admin endpoint (grant/revoke `hasTestAccess`)
- `MockTestsService` access-gate check throwing `ForbiddenException` if `mockTestAccess` is false

**Addresses:** User profile (P1), user-program tracking (P1), mock test gating (P1)
**Avoids:** Role-in-JWT anti-pattern (access revocation takes effect immediately via DB lookup)
**Research flag:** Standard CRUD — no additional research needed

---

### Phase 5: Unified Search + Config/Cache Infrastructure

**Rationale:** Unified search requires `fullTextSearchPostgres` preview feature and depends on the DB-backed program and institution APIs from Phase 2. Config and cache infrastructure (`@nestjs/config`, `@nestjs/cache-manager`) can be added anytime but are most useful once all modules exist to configure.

**Delivers:**
- `fullTextSearchPostgres` preview flag added to `prisma/schema.prisma`
- `GET /search` unified endpoint returning programs + institutions sorted by relevance
- `@nestjs/config` installed; `ConfigService` replaces `process.env` direct access across modules
- `@nestjs/cache-manager` + `@keyv/redis` wired up; Redis caching on program list and search results
- `@nestjs/throttler` applied globally with per-route overrides on admin and public search endpoints
- `@nestjs/swagger` installed; `@ApiProperty` decorators added to key DTOs; Swagger UI at `/api`

**Addresses:** Unified search (P1), API documentation (frontend team need)
**Avoids:** Wrong Redis adapter pitfall (use `@keyv/redis`, not `cache-manager-redis-store`)
**Research flag:** Prisma `fullTextSearchPostgres` is still preview — verify behavior with actual data volume before relying on relevance scoring

---

### Phase Ordering Rationale

- Phases 1 and 2 are strictly sequential: DB cleanup must precede proxy retirement, and the role system must precede any admin endpoint.
- Phase 3 (guidance) can begin in parallel with Phase 2 as soon as Phase 1 completes, since guidance only requires the role system and the Prisma models.
- Phase 4 (user features) can begin after Phase 1 completes; it does not depend on Phase 2 or 3.
- Phase 5 (search + infra) is additive and has no blocking dependency after Phase 2 completes.
- The build order from ARCHITECTURE.md exactly matches this: role field → JwtStrategy extension → RolesGuard → sync cleanup → proxy retirement → guidance module → user endpoints → UserProgram endpoints.

### Research Flags

**Needs deeper research during planning:**
- Phase 5 (Prisma `fullTextSearchPostgres`): Preview feature with limited production case studies for PostgreSQL relevance scoring; validate query results with actual synced data before committing to this approach.

**Standard patterns (skip research-phase):**
- Phase 1 (RBAC): Canonical NestJS docs pattern; codebase already has JWT guards as reference.
- Phase 2 (proxy retirement): Service-layer swap; no new patterns.
- Phase 3 (guidance CRUD): Standard NestJS module + Prisma JSON column; well-documented.
- Phase 4 (user features/CRUD): Extends existing scaffolded UsersModule; straightforward.

---

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | All package versions verified via npm; NestJS cache-manager v3 Keyv requirement confirmed against GitHub releases |
| Features | HIGH (core), MEDIUM (competitor specifics) | Feature categories based on established study-abroad platform patterns; competitor pricing verified via pass-uas.fi |
| Architecture | HIGH | Based on direct codebase analysis + NestJS official authorization docs |
| Pitfalls | HIGH | Based on reading actual sync.service.ts code locations cited; patterns confirmed against codebase |

**Overall confidence:** HIGH

### Gaps to Address

- **Opintopolku English coverage**: Research flagged that `resolveLang` silently falls back to Finnish when no English translation exists. The actual proportion of programs without English names/descriptions is unknown — needs a test sync run with warning logging to assess. If significant, the proxy may need to remain as fallback for specific fields.
- **Refresh token single-session limitation**: Only one refresh token per user (unique constraint on `userId` in `Auth` model). Multi-device login is blocked. Documented as known concern in CONCERNS.md; acceptable for v1 but must be addressed before marketing to users who use multiple devices.
- **`docs/entity-relationship.mmd` is stale**: The Mermaid diagram does not match the current Prisma schema. New contributors will form incorrect mental models. Either regenerate or delete before onboarding anyone.
- **Sync duration at full scale**: With 500+ programs requiring sequential detail fetches, full sync may take 10–30 minutes. At current scale this is acceptable, but it should be measured on first real run. Mitigation (`p-limit` concurrency batching) is documented in PITFALLS.md and can be added in Phase 2.

---

## Sources

### Primary (HIGH confidence)
- NestJS official docs (Context7 — `nestjs/docs.nestjs.com`): caching.md, rate-limiting.md, authorization.md, configuration.md
- `github.com/nestjs/cache-manager/releases` — confirmed v3.0.0 Keyv requirement
- `prisma.io/docs/v6/orm/prisma-client/queries/full-text-search` — `fullTextSearchPostgres` flag
- `prisma.io/docs/guides/upgrade-prisma-orm/v6` — GA full-text search is MySQL-only; Postgres still needs `fullTextSearchPostgres`
- npm package metadata (2026-04-24): all recommended packages at stated versions
- Direct codebase analysis: `src/modules/auth/`, `src/modules/sync/sync.service.ts`, `src/common/`, `prisma/schema.prisma`

### Secondary (MEDIUM confidence)
- `uasinfo.fi/international-uas-exam/` — UAS exam section structure (7 sections)
- `pass-uas.fi` — competitor mock test platform and EUR 39.95 pricing
- NestJS RBAC community patterns — corroborated against official authorization docs
- `studyinfinland.fi`, `studyportals.com` — feature benchmarking for study-abroad platforms

### Tertiary (LOW confidence)
- `webcoderspeed.com/blog/scaling/nestjs-2026-patterns` — NestJS 2026 advanced patterns; treated as supplementary only

---
*Research completed: 2026-04-25*
*Ready for roadmap: yes*
