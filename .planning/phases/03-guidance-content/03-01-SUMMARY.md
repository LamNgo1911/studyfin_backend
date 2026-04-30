---
phase: 03-guidance-content
plan: 01
subsystem: database
tags: [prisma, postgres, schema]

requires:
  - phase: 02-db-backed-apis
    provides: Prisma schema with Program model and PrismaService
provides:
  - GuidanceSection Prisma model with all required fields
  - Database table created via prisma db push
  - Generated Prisma client types for GuidanceSection
affects: [03-02, 03-03, 03-04]

tech-stack:
  added: []
  patterns: [row-per-section guidance design with composite unique key]

key-files:
  created: []
  modified: [prisma/schema.prisma]

key-decisions:
  - "Row-per-section design (not JSON column) for guidance — enables ordered reads and per-section updates"
  - "@@unique([programOid, key]) prevents duplicate sections per program"
  - "programOid FK references Program.oid (stable Opintopolku OID) not Program.id"

patterns-established:
  - "Guidance content stored as separate rows with key/title/body/order fields"
  - "Composite unique constraint for multi-row-per-parent tables"

requirements-completed: [GUID-01]

duration: 5min
completed: 2026-04-30
---

# Plan 03-01: Prisma GuidanceSection Model Summary

**GuidanceSection model added to Prisma schema with programOid FK, composite unique key, and index — DB table created via prisma db push**

## Performance

- **Duration:** 5 min
- **Tasks:** 2
- **Files modified:** 1

## Accomplishments
- Added GuidanceSection model with 9 fields (id, programOid, program relation, key, title, body, order, createdAt, updatedAt)
- Added inverse relation `guidanceSections GuidanceSection[]` to Program model
- Pushed schema to PostgreSQL and regenerated Prisma client with GuidanceSection types

## Task Commits

Each task was committed atomically:

1. **Task 1: Add GuidanceSection model to prisma/schema.prisma** - `b95b05c` (feat)
2. **Task 2: Push schema to database and regenerate Prisma client** - runtime operation (no file changes to commit)

## Files Created/Modified
- `prisma/schema.prisma` - Added GuidanceSection model with @@unique and @@index directives

## Decisions Made
None - followed plan as specified.

## Deviations from Plan
None - plan executed exactly as written.

## Issues Encountered
None.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- GuidanceSection table exists in PostgreSQL
- Prisma client types available for import from generated/prisma
- Ready for Plan 02 (DTOs + GuidanceService)

---
*Phase: 03-guidance-content*
*Completed: 2026-04-30*
