---
phase: 01-rbac-foundation
plan: 03
subsystem: database
tags: [prisma, postgresql, seed, admin, cleanup]

# Dependency graph
requires:
  - phase: 01-rbac-foundation
    provides: Role enum + User.role field in schema (01-01); Roles decorator and RolesGuard (01-02)
provides:
  - Admin user upsert script runnable via npx prisma db seed
  - Bulk delete script for non-English programs runnable via npm run cleanup:programs
  - package.json prisma.seed config enabling npx prisma db seed
affects:
  - Any phase that requires an admin user to exist before testing admin-guarded routes
  - Phase that retires the Opintopolku live proxy (cleanup must run before cutover)

# Tech tracking
tech-stack:
  added: []
  patterns:
    - PrismaClient bootstrap pattern for standalone scripts (import dotenv/config, PrismaPg adapter)
    - Script error/disconnect pattern (.catch exit 1, .finally $disconnect)
    - upsert for idempotent admin bootstrap
    - Prisma NOT { has } array filter for bulk delete

key-files:
  created:
    - prisma/seed.ts
    - prisma/cleanup-non-english.ts
  modified:
    - package.json

key-decisions:
  - "passwordHash set to '<hashed-placeholder>' on create path in seed.ts; ADMIN_EMAIL user is expected to exist via normal registration; placeholder only used if account does not yet exist (accepted risk T-01-09)"
  - "NOT { has: 'en' } Prisma array filter handles both empty teachingLanguages arrays and arrays with only non-English codes in a single deleteMany query"
  - "prisma.seed top-level key added to package.json (not just an npm script) to enable npx prisma db seed — D-05 requirement"

patterns-established:
  - "Standalone Prisma script pattern: import dotenv/config + PrismaPg adapter + .finally($disconnect)"
  - "Admin bootstrap via upsert with ADMIN_EMAIL gate — fail loudly if env var missing (exit 1)"

requirements-completed: [FOUND-07]

# Metrics
duration: 5min
completed: 2026-04-27
---

# Phase 01 Plan 03: Admin Seed and English Program Cleanup Summary

**Admin user upsert via npx prisma db seed (ADMIN_EMAIL gated) and bulk non-English program cleanup via prisma.program.deleteMany NOT has 'en'**

## Performance

- **Duration:** 5 min
- **Started:** 2026-04-27T12:21:21Z
- **Completed:** 2026-04-27T12:27:06Z
- **Tasks:** 2
- **Files modified:** 3

## Accomplishments

- Created `prisma/seed.ts` — idempotent admin user upsert gated on ADMIN_EMAIL env var; exits 1 if not set; works for both create and promote-existing flows
- Created `prisma/cleanup-non-english.ts` — bulk delete of programs missing 'en' in teachingLanguages using Prisma NOT { has: 'en' } filter; covers empty arrays and non-English-only arrays in one query
- Updated `package.json` with `"prisma": { "seed": "ts-node prisma/seed.ts" }` top-level key (enables `npx prisma db seed`) and `cleanup:programs` npm script

## Task Commits

Each task was committed atomically:

1. **Task 1: Create prisma/seed.ts and add prisma.seed config to package.json** - `b2b0883` (feat)
2. **Task 2: Create prisma/cleanup-non-english.ts and add cleanup:programs npm script** - `c41182d` (feat)

**Plan metadata:** _(to be committed after SUMMARY creation)_

## Files Created/Modified

- `prisma/seed.ts` — Admin user upsert script; reads ADMIN_EMAIL from env; upserts with role ADMIN; exits 1 if env not set
- `prisma/cleanup-non-english.ts` — Bulk delete of non-English programs using `NOT { teachingLanguages: { has: 'en' } }`; logs deleted count
- `package.json` — Added `"prisma": { "seed": "ts-node prisma/seed.ts" }` top-level key; added `"cleanup:programs": "ts-node prisma/cleanup-non-english.ts"` to scripts

## Decisions Made

- `passwordHash: '<hashed-placeholder>'` on the create path in seed.ts — intentional placeholder for the edge case where the ADMIN_EMAIL account does not yet exist in the DB (expected: user registers first, seed promotes). Accepted risk per T-01-09.
- `NOT { has: 'en' }` Prisma array filter chosen over a positional check — it correctly handles both empty arrays (no 'en' element found) and arrays containing only non-English codes in a single `deleteMany` query.
- `"prisma": { "seed": ... }` added as a top-level package.json key (separate from npm scripts) — required for `npx prisma db seed` to work. Both the npm script pattern and the prisma key are present.

## Deviations from Plan

None — plan executed exactly as written. Both scripts match the analog pattern from `prisma/seed-mock-tests.ts`. Both were already committed in the prior execution session.

## Known Stubs

- `prisma/seed.ts` line 22: `passwordHash: '<hashed-placeholder>'` — intentional operational bootstrap placeholder. Only reached when ADMIN_EMAIL user does not yet exist in the DB. Plan documents this as accepted risk (T-01-09). Does not prevent the plan's goal (admin promotion works for existing users; create path is a fallback).

## Threat Flags

No new network endpoints, auth paths, or file access patterns introduced. Scripts are developer-run CLI tools, not HTTP endpoints. Threat model fully covered by T-01-07, T-01-08, T-01-09 in the plan.

## Issues Encountered

None.

## User Setup Required

To run the admin seed script, operators must set `ADMIN_EMAIL` in their environment:

```bash
ADMIN_EMAIL=admin@example.com npx prisma db seed
```

To run the cleanup script (one-time, irreversible):

```bash
npm run cleanup:programs
```

No external service configuration required beyond the existing `DATABASE_URL` env var.

## Next Phase Readiness

- Admin user infrastructure complete — ADMIN_EMAIL-gated seed creates/promotes admin; ready for admin-guarded routes to be tested
- Non-English program cleanup script ready to run before retiring the Opintopolku live proxy
- Phase 01 RBAC Foundation complete (all 3 plans delivered)

---
*Phase: 01-rbac-foundation*
*Completed: 2026-04-27*
