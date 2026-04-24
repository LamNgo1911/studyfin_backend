# Stack Research

**Domain:** Education platform backend — content management, search, test/quiz, admin API
**Researched:** 2026-04-24
**Confidence:** HIGH (core stack locked, supporting libraries verified with Context7 + npm)

---

## Context: This Is an Extension, Not a Greenfield

The stack is **established and non-negotiable** per project constraints. NestJS 11 + Prisma 7 + PostgreSQL 16 are locked in. Every recommendation below is additive — what to install on top of the existing base to cover the new milestone's requirements:

- English-only sync filtering
- DB-backed API (retire live Opintopolku proxy)
- A-Z guidance content system
- Admin API endpoints
- Manual mock test access gating
- Unified homepage search

---

## Recommended Stack

### Core Technologies (Already Installed — Versions Verified)

| Technology | Current Version | Purpose | Status |
|------------|-----------------|---------|--------|
| NestJS | ^11.0.1 | HTTP framework, DI, module system | Installed |
| Prisma | ^7.6.0 | ORM, migrations, type-safe queries | Installed; latest is 7.8.0 |
| PostgreSQL | 16 (Docker) | Primary database | Running |
| TypeScript | ^5.7.3 | Language | Installed |
| `@nestjs/jwt` + passport-jwt | ^11.0.2 / ^4.0.1 | JWT auth (access + refresh) | Installed |
| `@nestjs/schedule` | ^6.1.1 | Cron-based daily sync | Installed |
| `class-validator` + `class-transformer` | ^0.15.1 / ^0.5.1 | DTO validation | Installed |

### New Libraries to Add

#### 1. `@nestjs/config` — Environment Configuration

**Version:** 4.0.4 (latest, verified via npm)
**Install:** `npm install @nestjs/config`
**Why:** The project currently loads env with bare `dotenv/config` in `main.ts`. This works but means services must read `process.env` directly without type safety. `@nestjs/config` provides `ConfigService` with typed injection, `isGlobal: true` so no per-module import, and at-startup validation via `class-validator` so bad env fails fast at boot rather than at first use. The admin endpoints and Redis connection will add several new env vars; now is the right time to formalize config.

**Confidence:** HIGH — Official NestJS docs, latest version verified.

#### 2. `@nestjs/cache-manager` + `@keyv/redis` — Response Caching

**Versions:** `@nestjs/cache-manager` 3.1.2, `@keyv/redis` 5.1.6, `cache-manager` 7.2.8 (all latest, verified via npm + GitHub releases)
**Install:** `npm install @nestjs/cache-manager @keyv/redis cache-manager`
**Why:** Redis is already provisioned in `docker-compose.yml` but unused. The new DB-backed API serves program and university lists that change only once a day (after the midnight sync cron). Caching these responses in Redis eliminates per-request DB queries for the most frequent reads. `@nestjs/cache-manager` v3+ dropped the old `cache-manager-redis-store` (which was broken in NestJS 11) in favor of Keyv — this is the current idiomatic pattern per the NestJS docs and the v3.0.0 release notes.

**Do NOT use:** `cache-manager-redis-store` or `cache-manager-ioredis` — these use the pre-v6 cache-manager API and are incompatible with `@nestjs/cache-manager` v3+. Many StackOverflow answers still reference them incorrectly.

**Confidence:** HIGH — Verified with NestJS docs (caching.md), `@nestjs/cache-manager` GitHub releases confirmed v3 requires Keyv.

#### 3. `@nestjs/throttler` — Rate Limiting

**Version:** 6.5.0 (latest, verified via npm)
**Install:** `npm install @nestjs/throttler`
**Why:** Admin endpoints that mutate content (create/update/delete guidance steps, test templates) need protection from accidental bulk requests. Public search endpoints need protection from scraping. `@nestjs/throttler` integrates directly into the NestJS guard system with `@Throttle()` and `@SkipThrottle()` decorators, so rate limits can be tuned per-route without middleware plumbing.

**Confidence:** HIGH — Official NestJS docs (security/rate-limiting.md), version verified.

#### 4. `@nestjs/swagger` — API Documentation

**Version:** 11.4.1 (latest, verified via npm; compatible with NestJS 11)
**Install:** `npm install @nestjs/swagger`
**Why:** Admin endpoints and the new A-Z guidance content API need to be consumable by the frontend team without constant back-and-forth. Swagger auto-generates from decorators that are already on DTOs (`@ApiProperty`, `@ApiTags`, `@ApiBearerAuth`). The `@nestjs/cli-plugin` flag in `nest-cli.json` reduces decorator boilerplate by inferring types automatically. This is the standard documentation approach for NestJS backends serving a separate frontend.

**Confidence:** HIGH — Official NestJS docs, version verified. NestJS 11 compatibility confirmed (package is maintained by the NestJS team).

### Supporting Libraries

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `@nestjs/config` | 4.0.4 | Typed env vars via `ConfigService` | Install now — needed for Redis URL, admin secrets, etc. |
| `@nestjs/cache-manager` | 3.1.2 | Cache decorator + `CACHE_MANAGER` token | Install now — Redis already provisioned |
| `@keyv/redis` | 5.1.6 | Redis Keyv adapter for cache-manager v6+ | Install with cache-manager |
| `cache-manager` | 7.2.8 | Cache-manager v6+ core (Keyv-based) | Install with cache-manager |
| `@nestjs/throttler` | 6.5.0 | Per-route rate limiting | Install now — needed before admin routes go live |
| `@nestjs/swagger` | 11.4.1 | OpenAPI spec generation | Install now — frontend team needs docs |

### Development Tools (No Changes Needed)

| Tool | Current Version | Notes |
|------|-----------------|-------|
| Jest | ^30.0.0 | Already newest major; no action |
| ts-jest | ^29.2.5 | Compatible with Jest 30 |
| ESLint + Prettier | ^9.18.0 / ^3.4.2 | Already current |
| `@nestjs/cli` | ^11.0.0 | Add `@nestjs/swagger` plugin flag to `nest-cli.json` after install |

---

## Installation

```bash
# New dependencies for this milestone
npm install @nestjs/config @nestjs/cache-manager @keyv/redis cache-manager @nestjs/throttler @nestjs/swagger
```

No dev dependencies needed — all are runtime packages.

After installing Swagger, add the plugin to `nest-cli.json` to reduce DTO decorator boilerplate:

```json
{
  "collection": "@nestjs/schematics",
  "sourceRoot": "src",
  "compilerOptions": {
    "plugins": ["@nestjs/swagger"]
  }
}
```

---

## Alternatives Considered

| Recommended | Alternative | Why Not |
|-------------|-------------|---------|
| `@nestjs/config` | bare `dotenv/config` (current) | No type safety, no at-startup validation, requires `process.env` access in services rather than injected `ConfigService` |
| `@keyv/redis` + cache-manager v7 | `cache-manager-redis-store` | Incompatible with cache-manager v6+; `@nestjs/cache-manager` v3 explicitly dropped support |
| `@keyv/redis` + cache-manager v7 | `ioredis` directly | Would require a custom `CacheModule` wrapper; no reason to avoid `@nestjs/cache-manager` since Redis is already provisioned |
| `@nestjs/throttler` | Custom rate-limit middleware | Throttler integrates with the guard system and supports per-route overrides; roll-your-own adds complexity for no benefit |
| `@nestjs/swagger` | Postman collections (manual) | Manual docs drift from code; Swagger is auto-generated and always current |
| Prisma `fullTextSearchPostgres` preview | Dedicated search service (Meilisearch, Typesense) | At the current scale (hundreds of programs), PostgreSQL full-text search via `search:` operator is sufficient; adds no new infrastructure |

---

## What NOT to Use

| Avoid | Why | Use Instead |
|-------|-----|-------------|
| `cache-manager-redis-store` | Uses pre-v6 cache-manager API that `@nestjs/cache-manager` v3 dropped; npm package is effectively abandoned | `@keyv/redis` with cache-manager 7+ |
| `@casl/ability` / full ABAC library | Overkill for a two-level system (admin/user); adds a learning curve and abstraction layer | Native NestJS `Reflector` + `@Roles()` decorator + `RolesGuard` — documented pattern, ~50 lines of code |
| `class-validator` `@IsRole()` custom decorator for role checks | Validation layer is wrong place for authorization | Guard layer via `RolesGuard` extending existing `JwtAuthGuard` |
| Elasticsearch / Typesense / Meilisearch | Overkill for hundreds of English-only programs; new infra to operate | Prisma `fullTextSearchPostgres` preview feature on the existing PostgreSQL instance |
| `@nestjs/mongoose` / TypeORM | Different ORM — would require rewriting existing Prisma layer | Prisma (already installed, schema fully defined) |
| `bull` / BullMQ queue | Async job queue for background processing; daily sync already handled by `@nestjs/schedule` cron | `@nestjs/schedule` (already installed) |

---

## Prisma Feature Flag: Full-Text Search

The unified homepage search (programs + universities) requires enabling a Prisma preview feature. Add to `prisma/schema.prisma`:

```prisma
generator client {
  provider        = "prisma-client-js"
  output          = "../generated/prisma"
  previewFeatures = ["fullTextSearchPostgres"]
}
```

This enables the `search:` operator in Prisma queries:

```typescript
// Unified search example
const programs = await prisma.program.findMany({
  where: {
    name: { search: 'business administration' },
  },
  orderBy: {
    _relevance: { fields: ['name', 'description'], search: keyword, sort: 'desc' },
  },
});
```

**Important:** `fullTextSearchPostgres` is a separate preview feature from the general `fullTextSearch` (which went GA for MySQL only in Prisma v6). PostgreSQL still requires the `Postgres` suffix flag. Confirmed via Prisma v6 upgrade guide.

**Confidence:** HIGH — Verified in Prisma official docs (`prisma.io/docs/v6/orm/prisma-client/queries/full-text-search`) and the v6 upgrade guide.

---

## Admin Role Pattern (No New Library Needed)

The admin API requires a simple two-level RBAC (user / admin). The NestJS docs pattern covers this with no extra library:

1. Add `role` field to the `User` model in `prisma/schema.prisma` (`String @default("user")`)
2. Create `src/common/decorators/roles.decorator.ts` using `Reflector.createDecorator<string[]>()`
3. Create `src/common/guards/roles.guard.ts` implementing NestJS `CanActivate`
4. Compose with existing `JwtAuthGuard`: `@UseGuards(JwtAuthGuard, RolesGuard)` + `@Roles(['admin'])`

This is the exact pattern from NestJS authorization docs. No external ABAC/RBAC library needed for two roles.

**Confidence:** HIGH — Verified in NestJS docs (security/authorization.md).

---

## A-Z Guidance Content: No CMS Library Needed

The guidance content system (application steps, visa info, housing, costs per program) is structured data, not freeform rich text. It should be modeled as Prisma relations, not a headless CMS:

- `GuidanceSection` model (category: `application | visa | housing | costs | ...`)
- `GuidanceStep` model (ordered steps per section, linked to Program or global)
- Admin creates/updates via REST endpoints — no CMS overhead

Avoid strapi, directus, or other headless CMS frameworks. They add a separate server process, a new database schema management system, and a plugin ecosystem to maintain. The data is simple enough to be an ordinary Prisma model.

**Confidence:** MEDIUM — Based on project scope described in PROJECT.md ("semi-automated guidance content", "admin API endpoints only"). No external CMS evaluation was done because scope explicitly excludes it.

---

## Version Compatibility

| Package A | Compatible With | Notes |
|-----------|-----------------|-------|
| `@nestjs/cache-manager` 3.1.2 | `cache-manager` ^7.0.0 (specifically 7.x) | v3+ required migration from cache-manager v5 to v6+/v7 |
| `@keyv/redis` 5.1.6 | `keyv` ^5.x | Both are in the same family; install together |
| `@nestjs/swagger` 11.4.1 | NestJS ^11.0.x | Major version tracks NestJS major |
| `@nestjs/throttler` 6.5.0 | NestJS ^11.0.x | Compatible with NestJS 11 |
| `@nestjs/config` 4.0.4 | NestJS ^11.0.x | Compatible with NestJS 11 |
| Prisma `fullTextSearchPostgres` | Prisma ^7.x | Still preview in v7; requires flag in schema |

---

## Sources

- `/nestjs/docs.nestjs.com` (Context7) — caching.md (Redis + Keyv pattern), rate-limiting.md (throttler), authorization.md (RBAC guard pattern), serialization.md, configuration.md
- `https://github.com/nestjs/cache-manager/releases` — confirmed v3.0.0 breaks with cache-manager <v6, Keyv required
- `https://www.prisma.io/docs/v6/orm/prisma-client/queries/full-text-search` — fullTextSearchPostgres flag requirement
- `https://www.prisma.io/docs/guides/upgrade-prisma-orm/v6` — confirmed fullTextSearch GA is MySQL-only; Postgres still needs `fullTextSearchPostgres`
- npm info: `@nestjs/swagger@11.4.1`, `@nestjs/cache-manager@3.1.2`, `@nestjs/config@4.0.4`, `@nestjs/throttler@6.5.0`, `@keyv/redis@5.1.6`, `cache-manager@7.2.8` — all latest versions confirmed 2026-04-24

---
*Stack research for: StudyFin backend — education platform, subsequent milestone*
*Researched: 2026-04-24*
