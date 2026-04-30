---
phase: 03-guidance-content
plan: 04
subsystem: api
tags: [prisma, testing, jest, nestjs]

requires:
  - phase: 03-guidance-content
    plan: 02
    provides: GuidanceService with findByProgramOid, upsert, patch methods
provides:
  - hasGuidance boolean field in GET /programs/:oid response
  - hasGuidance boolean field in GET /universities/:oid/programs response
  - GuidanceService unit tests (7 tests, all passing)
affects: []

tech-stack:
  added: []
  patterns: [Prisma _count include for boolean existence flag, jest mock with $transaction callback pattern]

key-files:
  created: [src/modules/guidance/guidance.spec.ts]
  modified: [src/modules/programs/programs.service.ts, src/modules/universities/universities.service.ts]

key-decisions:
  - "Used _count: { select: { guidanceSections: true } } Prisma include for hasGuidance — single query, no N+1"
  - "hasGuidance added only to mapProgramDetail in programs.service.ts (detail endpoint), not mapProgram list"
  - "hasGuidance added to mapProgram in universities.service.ts covering findPrograms use case"

patterns-established:
  - "Prisma _count include pattern for boolean existence flags in response payloads"
  - "Jest $transaction mock: callback form uses mockImplementation(async fn => fn(prisma)), array form uses mockImplementation(async ops => Promise.all(ops))"

requirements-completed: [GUID-07]

duration: 8min
completed: 2026-04-30
---

# Plan 03-04: hasGuidance Flag + GuidanceService Unit Tests Summary

**`hasGuidance` boolean added to program detail and university program list responses via Prisma `_count` include; 7 GuidanceService unit tests all passing**

## Performance

- **Duration:** ~8 min
- **Tasks:** 2
- **Files modified:** 3 (modified 2, created 1)

## Accomplishments
- `GET /programs/:oid` response now includes `hasGuidance: boolean` via `_count.guidanceSections`
- `GET /universities/:oid/programs` program items include `hasGuidance: boolean`
- GuidanceService unit tests: 7 tests covering findByProgramOid (2), upsert (2), patch (3) — all pass

## Task Commits

Each task was committed atomically:

1. **Task 1: Add hasGuidance flag** - `55741e7` (feat)
2. **Task 2: Write GuidanceService unit tests** - `eb18b72` (test)

## Files Created/Modified
- `src/modules/programs/programs.service.ts` — Added `_count: { select: { guidanceSections: true } }` to findOne query; `hasGuidance` in mapProgramDetail
- `src/modules/universities/universities.service.ts` — Added `_count` include to findPrograms query; `hasGuidance` in mapProgram
- `src/modules/guidance/guidance.spec.ts` — 7 unit tests for GuidanceService using PrismaService mock pattern

## Decisions Made
- `hasGuidance` added only to `mapProgramDetail` (not `mapProgram` list) in programs.service.ts — GUID-07 specifies the detail endpoint only
- `mapProgram` in universities.service.ts already covers findPrograms, so one addition handles that use case

## Deviations from Plan
None — plan executed exactly as written.

## Issues Encountered
None.

## User Setup Required
None — no external service configuration required.

## Next Phase Readiness
- All Phase 3 plans complete
- Guidance endpoints live: GET (public), POST/PATCH (admin-only)
- hasGuidance flag available on program detail and university program list responses
- 7 GuidanceService unit tests passing

---
*Phase: 03-guidance-content*
*Completed: 2026-04-30*
