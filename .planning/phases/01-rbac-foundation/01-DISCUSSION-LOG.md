# Phase 1: RBAC Foundation - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-04-25
**Phase:** 01-rbac-foundation
**Areas discussed:** Role field design, Guard composition, Admin seeding, English cleanup scope

---

## Role field design

| Option | Description | Selected |
|--------|-------------|----------|
| String | A plain String column with default 'user'. Flexible — new roles without migration. | |
| Prisma enum | A Prisma enum (enum Role { USER ADMIN }). Type-safe at DB level, requires migration for new roles. | ✓ |
| You decide | Let Claude pick the approach. | |

**User's choice:** Prisma enum with USER as default
**Notes:** User explicitly chose enum for type safety.

---

| Option | Description | Selected |
|--------|-------------|----------|
| Add now | Add `hasTestAccess Boolean @default(false)` to User model now alongside role. Batch schema changes in one migration. | |
| Defer to Phase 4 | Wait until Phase 4 where mock test gating is implemented. Keeps Phase 1 scope minimal. | ✓ |

**User's choice:** Defer to Phase 4
**Notes:** User preferred minimal scope for Phase 1.

---

## Guard composition

| Option | Description | Selected |
|--------|-------------|----------|
| Stacked guards | `@UseGuards(JwtAuthGuard, RolesGuard)`. JwtAuthGuard first (401), then RolesGuard (403). Standard NestJS pattern. | ✓ |
| Combined guard | Single combined guard handling both JWT and role. Fewer decorators but diverges from patterns. | |
| You decide | Let Claude pick. | |

**User's choice:** Stacked guards (Recommended)
**Notes:** None — straightforward selection of the standard pattern.

---

| Option | Description | Selected |
|--------|-------------|----------|
| Reflector.createDecorator | Modern NestJS 10+ API as specified in FOUND-05. | ✓ |
| SetMetadata | Older NestJS approach, still works but more boilerplate. | |
| You decide | Let Claude pick. | |

**User's choice:** Reflector.createDecorator (Recommended)
**Notes:** Matches the FOUND-05 requirement exactly.

---

## Admin seeding

| Option | Description | Selected |
|--------|-------------|----------|
| Prisma seed script | `prisma/seed.ts` creates/promotes admin based on ADMIN_EMAIL env var. Run via `npx prisma db seed`. | ✓ |
| Bootstrap on startup | Check ADMIN_EMAIL env var on app boot, auto-promote. Runs every boot. | |
| Manual DB update | No mechanism. Admin created via manual SQL UPDATE. | |
| You decide | Let Claude pick. | |

**User's choice:** Prisma seed script (Recommended)
**Notes:** None — standard Prisma pattern selected.

---

## English cleanup scope

| Option | Description | Selected |
|--------|-------------|----------|
| Cleanup only | One-time deletion script. Don't touch sync service — Phase 2 handles that. | ✓ |
| Cleanup + sync filter | One-time cleanup AND update SyncService to filter non-English during sync. | |
| You decide | Let Claude pick. | |

**User's choice:** Cleanup only (Recommended)
**Notes:** Sync service modifications are Phase 2 territory.

---

| Option | Description | Selected |
|--------|-------------|----------|
| Delete them | Treat empty teachingLanguages as non-English. Conservative approach. | ✓ |
| Keep them | Keep for manual review. Might be English but missing data. | |
| You decide | Let Claude pick. | |

**User's choice:** Delete them (Recommended)
**Notes:** If a program doesn't explicitly list English, it's not considered English-taught.

---

## Claude's Discretion

- Exact implementation of the cleanup script (Prisma migration with raw SQL vs. standalone script)
- CurrentUserData interface update approach
- RolesGuard error message wording
- Test strategy for guard/decorator (unit vs. e2e)

## Deferred Ideas

- `hasTestAccess` boolean on User model — deferred to Phase 4
- Sync service English-only filtering — deferred to Phase 2
