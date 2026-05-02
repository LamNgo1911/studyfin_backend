---
phase: quick/lz4
plan: 01
subsystem: sync
tags: [hakukohteet, duration, program-detail, syncing]
requires: []
provides: [hakukohteet-field, duration-field, resolveHakukohteet-method]
affects: [ProgramsService, SyncService, PrismaSchema]
tech-stack:
  added: []
  patterns:
    - 'resolveComplexNestedJson': 'Filter + map pattern for extracting upstream nested JSON, returns Prisma.InputJsonValue | typeof Prisma.JsonNull'
key-files:
  created: []
  modified:
    - 'prisma/schema.prisma': 'Added hakukohteet (Json?) and duration (String?) to Program model'
    - 'src/modules/sync/sync.service.ts': 'Added resolveHakukohteet() method, wired into upsertProgram create/update'
    - 'src/modules/sync/sync.spec.ts': 'Added 5 tests for resolveHakukohteet resolution, filtering, null handling'
    - 'src/modules/programs/programs.service.ts': 'Added hakukohteet and duration to mapProgramDetail() response'
    - 'src/modules/programs/programs.spec.ts': 'Updated fixtures and assertions for new fields; fixed pre-existing mock issues'
decisions:
  - 'filter-hakukohteet-by-english-name': 'Hakukohteet filtered by presence of nimi.en (mirrors toteutukset English filter) rather than cross-referencing implementation OIDs, since resolved English implementations are not available at extraction time'
  - 'english-university-mock-fix': 'Pre-existing test failures fixed by adding descriptionMultilingual to mock university data, required by hasEnglish() check from commit 8066db9'
  - 'findall-pagination-test-fix': 'Pre-existing test updated to verify in-memory pagination (post-English-filter) instead of stale Prisma skip/take behavior'
metrics:
  duration: '~7 minutes'
  completed: '2026-05-02T12:54:03Z'
  tasks: 2
  commits: 2
  files_changed: 5
---

# Phase quick/lz4 Plan 01: Add requirements and admissions (hakukohteet) to program details

Added hakukohteet (application targets) and duration fields to the Program model, sync extraction, and API response. The sync service now extracts hakukohteet from the upstream koulutus detail, English-filters them, and stores the resolved objects alongside the rest of the program data. The GET /programs/:oid endpoint now returns hakukohteet and duration in the detail response.

## Tasks Executed

| # | Name | Commit | Files |
|---|------|--------|-------|
| 1 | Add hakukohteet and duration to Prisma schema and sync extraction | `bfba636` | `prisma/schema.prisma`, `src/modules/sync/sync.service.ts`, `src/modules/sync/sync.spec.ts` |
| 2 | Expose hakukohteet and duration in program detail response | `a70fc22` | `src/modules/programs/programs.service.ts`, `src/modules/programs/programs.spec.ts` |

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Pre-existing program test mocks missing descriptionMultilingual**
- **Found during:** Task 2
- **Issue:** `mockProgramRow` and `mockProgramDetailRow` university objects lacked `descriptionMultilingual`, causing `hasEnglish()` to filter them out and throw `NotFoundException`. Root cause: commit `8066db9` added English-university filtering but tests were not updated.
- **Fix:** Added `descriptionMultilingual: { fi: 'Kuvaus', en: 'Description' }` to the mock university data.
- **Files modified:** `src/modules/programs/programs.spec.ts`
- **Commit:** `a70fc22`

**2. [Rule 3 - Blocking] findOne test failures due to stale $transaction mock in findAll**
- **Found during:** Task 2
- **Issue:** `findAll` tests used `prisma.$transaction.mockResolvedValue(...)` but the service now calls `prisma.program.findMany()` directly (no transaction).
- **Fix:** Changed `findAll` tests to mock `prisma.program.findMany` directly instead of `prisma.$transaction`.
- **Files modified:** `src/modules/programs/programs.spec.ts`
- **Commit:** `a70fc22`

**3. [Rule 3 - Blocking] Pagination test verifying stale Prisma skip/take behavior**
- **Found during:** Task 2
- **Issue:** Pagination test checked for `skip`/`take` on Prisma `findMany` args, but the service now does in-memory pagination after English filtering (all rows fetched, filtered, then sliced).
- **Fix:** Replaced with test that verifies in-memory pagination: 15 rows with page 1/size 10 returns 5 hits starting at index 10.
- **Files modified:** `src/modules/programs/programs.spec.ts`
- **Commit:** `a70fc22`

### Known Stubs

None. All hakukohteet and duration fields are fully wired from upstream extraction through to API response.

### Threat Flags

None. Data flows within existing trust boundaries. No new network endpoints or auth paths introduced.

### Out-of-Scope Discoveries

The following test failures are pre-existing and were NOT caused by this plan's changes. They are logged here but were not modified:

- `src/modules/users/users.spec.ts`: 4 failures (missing `count` mock on `userProgram`, stale `NotFoundException` expectations)
- `src/modules/universities/universities.spec.ts`: 4 failures (missing `descriptionMultilingual` on mock university data, stale pagination tests)
- `src/modules/search/search.spec.ts`: 4 failures (missing `findMany` mock setup, mismatch between mocked and actual search behavior)
- `src/common/guards/roles.guard.spec.ts`: 4 failures (mock ExecutionContext missing `getClass`)
- `src/modules/mock-tests/mock-tests.spec.ts`: file-level error (likely import path issue)

## Verification

| Check | Result |
|-------|--------|
| `npx prisma validate` | Passed |
| `npm run test -- --testPathPatterns="sync"` | 8/8 passed |
| `npm run test -- --testPathPatterns="programs"` | 6/6 passed |
| `npm run build` | Passed (0 errors) |

## Success Criteria

- [x] `prisma/schema.prisma` includes `hakukohteet Json?` and `duration String?` on the Program model
- [x] `src/modules/sync/sync.service.ts` extracts hakukohteet from upstream detail with English resolution
- [x] `src/modules/programs/programs.service.ts` returns `hakukohteet` and `duration` in GET /programs/:oid
- [x] All targeted unit tests pass (sync + programs)
- [x] Existing programs in DB (null fields) serve detail without errors (tested)
- [x] `npm run build` succeeds

## Self-Check

- [x] `prisma/schema.prisma` has `hakukohteet` and `duration` fields
- [x] `src/modules/sync/sync.service.ts` has `resolveHakukohteet()` method
- [x] `src/modules/sync/sync.spec.ts` has 5 new tests
- [x] `src/modules/programs/programs.service.ts` returns `hakukohteet` and `duration` in mapProgramDetail
- [x] `src/modules/programs/programs.spec.ts` has updated fixtures and null test
- [x] Commit `bfba636` exists
- [x] Commit `a70fc22` exists
