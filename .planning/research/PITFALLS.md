# Pitfalls Research

**Domain:** Education platform backend — Opintopolku integration, NestJS monolith extension
**Researched:** 2026-04-25
**Confidence:** HIGH (based on codebase analysis + domain-specific patterns from other research files)

---

## 1. Opintopolku API Integration Pitfalls

### Finnish Field Names Leak into DB

**Risk:** The upstream API uses Finnish keys (`nimi`, `koulutustyyppi`, `kielivalinta`, `kotipaikka`, `yhteystiedot`, `esittely`, etc.). The current `resolveLang` helper extracts English values, but if a field has no English translation, the Finnish value (or empty string) silently enters the DB.

**Code location:** `src/modules/sync/sync.service.ts` — every `resolveLang()` call.

**Mitigation:** Log warnings when `resolveLang` falls back to `fi` for fields that should always have English values (e.g., program name, description). Consider a `syncWarnings` counter per sync run.

### API Structure Changes Without Notice

**Risk:** Opintopolku is a government API with no versioning guarantees. Field paths like `metadata.kuvaus`, `metadata.koulutusala[0].nimi`, `metadata.tutkintonimike` can change between releases. The `any` typing throughout `sync.service.ts` means these changes produce silent runtime failures (undefined → null → empty string), not compile-time errors.

**Mitigation:** Add a lightweight schema validation step after fetching detail: check that expected fields exist before processing. Log and skip records that don't match expected shape rather than inserting garbage data.

### Rate Limiting on Detail Fetches

**Risk:** The sync fetches a list page, then for each hit calls `GET /oppilaitos/:oid` or `GET /koulutus/:oid` — one HTTP request per record. With 200+ institutions and 500+ programs, this is 700+ sequential HTTP requests. Opintopolku may throttle or return 429s.

**Code location:** `sync.service.ts:80` (institution detail), `sync.service.ts:213` (program detail).

**Mitigation:** Add concurrency-limited parallel fetches (`p-limit` with concurrency 3-5) instead of sequential `for` loops. Add retry-with-backoff on 429 responses. Track failed fetches and retry them at end of sync.

---

## 2. NestJS RBAC Guard Pitfalls

### Guard Execution Order Matters

**Risk:** When applying `@UseGuards(JwtAuthGuard, RolesGuard)`, NestJS executes guards left-to-right. If `RolesGuard` is listed first, `request.user` is undefined and the guard either crashes or silently allows access.

**Mitigation:** Always declare `JwtAuthGuard` before `RolesGuard`. Consider creating a composed `AdminGuard` that internally chains both to prevent ordering mistakes.

### `@Roles()` Decorator Inheritance on Class vs Method

**Risk:** If `@Roles('admin')` is applied at the class level, it applies to ALL methods — including methods that should be public (e.g., `GET /guidance/:programOid` should be public, but `POST /guidance/:programOid` should be admin-only). Class-level role decorators create accidental lockouts.

**Mitigation:** Apply `@Roles()` at the method level only. Never apply at the class level in modules that mix public and admin routes.

### Missing `@Roles()` Decorator With RolesGuard Applied

**Risk:** If `@UseGuards(JwtAuthGuard, RolesGuard)` is applied but `@Roles()` is forgotten, `RolesGuard` reads `undefined` from the reflector. The current recommended pattern returns `true` when no roles are required — meaning the route is accessible to any authenticated user, not just admins.

**Mitigation:** This is actually the correct behavior (authenticated but not role-restricted). Document it clearly. If you want the opposite default (deny when no roles specified), adjust `RolesGuard` to return `false` when `required` is undefined — but this breaks backward compatibility with existing auth-only routes.

---

## 3. Prisma Upsert Risks During Sync

### Upsert Overwrites Manual Edits

**Risk:** `prisma.program.upsert()` overwrites ALL update fields on every sync. If an admin manually edits a program's description or adds metadata, the next midnight sync overwrites it with the Opintopolku version.

**Code location:** `sync.service.ts:252-297` — the `update` block mirrors `create` exactly.

**Mitigation:** Separate synced fields from editorial fields. Synced fields (name, type, credits, etc.) are overwritten on every sync. Editorial fields (guidance, admin notes) live in separate tables (Guidance model) that the sync never touches. This is already the planned architecture — just don't add editorial fields to the Program model itself.

### Location Delete-Recreate Race Condition

**Risk:** `sync.service.ts:153-166` does `deleteMany` then `createMany` for university locations. If a read query happens between delete and create, it returns a university with zero locations. There's no transaction wrapping this.

**Mitigation:** Wrap the delete+create in a `prisma.$transaction()` call. This is a straightforward fix.

### Concurrent Sync Runs

**Risk:** The `POST /sync/run` endpoint calls `void this.syncService.syncAll()` (fire-and-forget). If called twice, two syncs run concurrently, causing duplicate upserts and potential unique constraint violations on `ProgramUniversity`.

**Mitigation:** Add a `private syncing = false` flag in `SyncService`. Check it at the start of `syncAll()` and skip if already running. Reset on completion (in a `finally` block).

---

## 4. N+1 Patterns in Sync Operations

### Current Pattern: O(N) HTTP Requests Per Page

**Risk:** For each of the ~500+ programs, sync makes: 1 detail fetch + 1 program upsert + N provider upserts + N programUniversity upserts + N university lookups. This is 4-6 DB operations per program, all sequential.

**Code location:** `sync.service.ts:192-341` — the inner `for` loop of `syncPrograms` and `upsertProgram`.

**Impact:** Full sync likely takes 10-30 minutes. During this time, the DB is under sustained write load.

**Mitigation:**
1. Batch detail fetches with `Promise.all` + `p-limit(5)` per page
2. Use `prisma.$transaction()` to batch upserts per page rather than per-record
3. Consider `createMany`/`updateMany` where applicable (though upsert doesn't have a native batch in Prisma)

### Provider University Minimal Upserts Create Ghost Records

**Risk:** `sync.service.ts:306-318` creates minimal university records (just oid + name + empty type) for program providers. If the institution sync hasn't run yet (or the provider isn't in the institution list), these ghost records persist with incomplete data.

**Mitigation:** Run institution sync before program sync (already the case). After program sync, mark any ghost universities (where `type = ''`) for review. Don't delete them — they may be legitimate providers not in the main institution search results.

---

## 5. Guidance Content JSON Column Pitfalls

### JSON Schema Evolution

**Risk:** The `sections: Json` column in the Guidance model has no schema enforcement. If the frontend expects `{ key, title, body, order }` but an admin writes `{ key, content, sortOrder }`, there's no validation at the DB level.

**Mitigation:** Validate the JSON structure in the `GuidanceService` (or via a DTO with `class-validator`) before writing. Define a TypeScript interface for `GuidanceSection` and validate against it. Never trust raw JSON input.

### No Partial Section Updates

**Risk:** With a single `sections: Json` column, updating one section requires reading the full array, modifying it, and writing the whole thing back. Two admins editing different sections simultaneously will cause last-write-wins data loss.

**Mitigation:** For v1 with a small editorial team (likely 1-2 people), this is acceptable. If concurrent editing becomes a problem, migrate to a `GuidanceSection` relational table. The JSON approach is correct for now given the team size.

### JSON Columns Aren't Indexable

**Risk:** You cannot create a PostgreSQL index on individual fields inside a `Json` column via Prisma. Queries like "find all programs with a visa guidance section" require scanning the full JSON.

**Mitigation:** For v1, guidance is always fetched by `programOid` (which IS indexed). Section-level queries aren't needed. If they become needed, add a computed column or migrate to relational tables.

---

## 6. Dual Data Source Architecture Risks

### Stale Data After Failed Sync

**Risk:** If the midnight sync fails (Opintopolku down, network issue, partial failure), the DB contains yesterday's data. DB-backed endpoints serve stale data without any indication to the client.

**Mitigation:** Track `syncedAt` per record (already in schema). Add a sync health check: if the most recent `syncedAt` is >26 hours old, log a warning. Consider adding a `X-Data-Freshness` response header so the frontend can display a stale-data indicator.

### Migration Window: Proxy and DB Return Different Results

**Risk:** During the migration period, `GET /programs/:oid` (proxy) and `GET /search/programs` (DB) may return different data for the same program — different field names, different values, different inclusion/exclusion of non-English programs.

**Mitigation:** Migrate all endpoints in a single phase. Don't leave some endpoints on proxy and others on DB for an extended period. The architecture research already recommends: English filter → verify DB → retire proxy (in that order).

### Non-English Programs Left in DB From Pre-Filter Syncs

**Risk:** The sync now filters English-only programs (`isEnglishTaught` check), but programs synced before this filter was added may still be in the DB with non-English data.

**Code location:** `sync.service.ts:223-225` — the filter skips non-English programs but doesn't delete previously synced ones.

**Mitigation:** Add a one-time cleanup migration: `DELETE FROM Program WHERE NOT ('en' = ANY(teachingLanguages))`. Run this after the English filter is verified working.

---

## 7. JWT Auth Extension Pitfalls

### Role Not in JWT Payload — Correct but Understand the Trade-off

**Decision:** Read `role` from DB in `JwtStrategy.validate()` on every request, not from the JWT payload.

**Trade-off:** One extra DB field per authenticated request (negligible). Benefit: role changes take effect immediately without waiting for token expiry. This is the correct choice for manual access gating (admin grants mock test access → user should see it immediately).

### Token Invalidation on Role Change

**Risk:** When an admin changes a user's role or revokes mock test access, existing access tokens (valid for ~1 hour) continue working. Since role is read from DB on each request (not from token), this is actually NOT a problem — the role check is always fresh.

**Non-issue:** The architecture research correctly recommended DB-based role lookup. No additional token invalidation mechanism is needed.

### Refresh Token Single-Session Constraint

**Risk (existing):** `Auth` model uses `userId` as a unique constraint. Only one refresh token per user. Logging in from a second device invalidates the first session.

**Mitigation:** This is a known concern (documented in CONCERNS.md). For v1 with a small user base, this is acceptable. Fix in a future milestone by changing `Auth` to allow multiple sessions per user (keyed by session ID, not user ID).

---

## 8. PostgreSQL Performance Concerns

### Large Batch Upserts During Sync

**Risk:** Syncing 500+ programs with individual `upsert` calls means 500+ individual SQL transactions. This creates sustained disk I/O and WAL pressure on PostgreSQL.

**Mitigation:** Wrap upserts in batched transactions (e.g., 50 records per `$transaction` call). At current scale (hundreds, not thousands), this is an optimization rather than a necessity — but it's cheap to implement.

### Missing Indexes for Search Queries

**Risk:** The `SearchService` does `ILIKE` queries on `name` and `description` fields. Without indexes, these are sequential scans on the full table.

**Current state:** The schema has indexes on `oid` (unique) and foreign keys, but no text search indexes.

**Mitigation:** Add `@@index([name])` to `Program` and `University` models. For `ILIKE` queries, consider a `pg_trgm` GIN index: `CREATE INDEX idx_program_name_trgm ON "Program" USING gin (name gin_trgm_ops)`. With Prisma, this requires a raw SQL migration.

### `implementations` JSON Column Query Performance

**Risk:** `Program.implementations` is a `Json?` column containing nested arrays. The `SearchService.cleanImplementations()` method processes this in application code. Any query that needs to filter by implementation fields (e.g., find programs by provider municipality) cannot use DB indexes.

**Mitigation:** For v1, implementations are only read after a program is fetched — no filtering needed. If filtering becomes needed, extract implementation data into a relational table.

---

## 9. Project-Specific Pitfalls

### `resolveType` Heuristic Is Fragile

**Risk:** `sync.service.ts:366-375` guesses institution type from string matching (`includes('yo')`, `includes('amk')`). The fallback uses OID prefix patterns. If Opintopolku changes their type coding, all institutions get wrong types.

**Mitigation:** Log when `resolveType` hits the OID fallback path. Consider maintaining a manual mapping for known OID→type pairs as a config constant.

### `server.pid` Committed to Repo

**Risk:** `server.pid` is tracked by git. Every developer's local PID file creates a dirty working tree.

**Mitigation:** Add `server.pid` to `.gitignore` and `git rm --cached server.pid`.

### `docs/entity-relationship.mmd` Is Out of Date

**Risk:** The Mermaid diagram doesn't match the actual Prisma schema. New developers will build mental models from wrong diagrams.

**Mitigation:** Either regenerate from `prisma/schema.prisma` or delete the outdated file. Don't maintain two sources of truth for the data model.

### Console.log for Auth Tokens in Production

**Risk:** `auth.service.ts` logs email verification and password reset tokens via `console.log`. In production, these tokens appear in server logs — anyone with log access can verify emails or reset passwords.

**Mitigation:** Remove `console.log` for tokens before production deployment. Replace with a proper email delivery integration (even if deferred, the `console.log` fallback should be behind a `NODE_ENV === 'development'` check).

---

## Summary: Top 5 Pitfalls to Address First

| Priority | Pitfall | Phase Impact |
|----------|---------|--------------|
| 1 | Non-English programs left in DB from pre-filter syncs | Must clean before retiring proxy |
| 2 | Upsert overwrites separate editorial from synced fields | Guidance model must be standalone table |
| 3 | Guard ordering (`JwtAuthGuard` must precede `RolesGuard`) | All admin endpoints depend on this |
| 4 | Concurrent sync runs causing conflicts | Protect before admin sync trigger goes live |
| 5 | `resolveType` heuristic fragility | Monitor during sync; accept risk for v1 |

---
*Pitfalls research for: StudyFin backend — Opintopolku integration + NestJS monolith extension*
*Researched: 2026-04-25*
