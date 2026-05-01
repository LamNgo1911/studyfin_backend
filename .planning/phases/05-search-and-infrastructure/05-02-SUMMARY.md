---
phase: 05-search-and-infrastructure
plan: 02
subsystem: api
tags: [search, full-text-search, prisma, postgres, relevance-scoring]
requires:
  - phase: 04
    provides: PrismaService, Prisma schema with University and Program models
  - phase: 05-01
    provides: ThrottlerGuard rate limiting for search endpoints
provides:
  - Unified search endpoint GET /search with full-text matching
  - Relevance scoring via Prisma _relevance orderBy
  - Type filtering (programs/institutions/both)
affects: []
tech-stack:
  added: []
  patterns:
    - Prisma fullTextSearchPostgres { search } where clause for full-text queries
    - Prisma _relevance orderBy for relevance-ranked results
    - Mixed result merging with type discriminator pattern
key-files:
  created: []
  modified:
    - src/modules/search/dto/search-query.dto.ts
    - src/modules/search/dto/search-response.dto.ts
    - src/modules/search/search.service.ts
    - src/modules/search/search.controller.ts
    - src/modules/search/search.module.ts
    - src/modules/search/search.spec.ts
key-decisions:
  - "Mixed results: programs first in relevance mode (q provided), interleaved in alphabetical mode (no q)"
  - "Null values converted to undefined (??) for cleaner JSON serialization"
  - "Program type-only fields given default values in institution hits (isDegree: false, degreeTitles: [], teachingLanguages: [])"
patterns-established:
  - "Full-text search: Prisma { name: { search: q } } where clause with _relevance orderBy"
  - "Mixed results: parallel Promise.all queries merged with type disciminator approach"
requirements-completed:
  - SRCH-02
  - SRCH-03
  - SRCH-04
duration: 3m
completed: 2026-05-01
---

# Phase 5 Plan 2: Unified Full-Text Search with Relevance Scoring

**Replaced contains-based search with PostgreSQL full-text search using Prisma fullTextSearchPostgres, delivering a single GET /search endpoint with relevance scoring, type filtering, and mixed program/institution results.**

## Performance

- **Duration:** 3m 16s
- **Started:** 2026-05-01T13:05:00Z (approx)
- **Completed:** 2026-05-01T13:08:16Z
- **Tasks:** 3
- **Files modified:** 6

## Accomplishments
- Rewrote search DTOs with UnifiedSearchQueryDto (q, type, page, size) and UnifiedSearchResponseDto with SearchHitDto type discriminator
- Replaced contains-based search with Prisma fullTextSearchPostgres { search } where clause and _relevance orderBy
- Added three private search methods: searchProgramsOnly, searchInstitutionsOnly, searchMixed
- Removed deprecated GET /search/institutions route and old DTOs (SearchQueryDto, DbSearchQueryDto, InstitutionSearchResponseDto, InstitutionDto)
- Added @ApiProperty decorators on all input and output DTO fields

## Task Commits

Each task was committed atomically:

1. **Task 1: Rewrite search DTOs** - `b4a179a` (feat)
2. **Task 2: Rewrite SearchService with full-text search, relevance scoring, and mixed results** - `d2c5e34` (feat)
3. **Task 3: Update SearchController, SearchModule, and rewrite tests** - `0414167` (feat)

## Files Created/Modified
- `src/modules/search/dto/search-query.dto.ts` - UnifiedSearchQueryDto with q, type, page, size + @ApiPropertyOptional decorators
- `src/modules/search/dto/search-response.dto.ts` - SearchHitDto (type discriminator), UnifiedSearchResponseDto, ProviderDto
- `src/modules/search/search.service.ts` - Full-text search with _relevance scoring, mixed results, type filtering
- `src/modules/search/search.controller.ts` - Single GET /search route with @ApiTags, @ApiQuery, removed /search/institutions
- `src/modules/search/search.module.ts` - Unchanged structurally (SearchService already the sole provider)
- `src/modules/search/search.spec.ts` - 4 tests covering programs-only, institutions-only, mixed, and no-query paths

## Decisions Made
- Mixed result ordering: programs first when q is provided (relevance mode), interleaved when no q (alphabetical mode) -- per CONTEXT.md D-01
- Null values converted to undefined via `??` operator for cleaner JSON serialization across all hit mappings
- Program-only fields defaulted on institution hits (isDegree: false, degreeTitles: [], teachingLanguages: []) to satisfy SearchHitDto type requirements

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

- Jest CLI flag `--testPathPattern` has been renamed to `--testPathPatterns` in the installed Jest version; used the corrected flag.

## Verification

- `npm run build` exits 0 (succeeds)
- `npm run test -- --testPathPatterns "search"` passes 4/4 tests
- No references to old DTOs (SearchQueryDto, DbSearchQueryDto, InstitutionSearchResponseDto, InstitutionDto) in search module files
- No `@Get('institutions')` route exists
- SearchHitDto has `type: 'program' | 'institution'` discriminator
- Full-text search uses `_relevance` ordering when q is provided

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Unified search endpoint at GET /search ready for frontend consumption
- Old /search/institutions endpoint removed (returns 404)
- Next plan (05-03) can proceed with database indexing for full-text search performance

## Self-Check: PASSED

All 6 files verified present. All 3 commits verified in git log. Build exits 0. Tests: 4/4 pass.

---
*Phase: 05-search-and-infrastructure*
*Completed: 2026-05-01*
