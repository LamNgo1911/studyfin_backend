---
phase: 05-search-and-infrastructure
plan: 03
subsystem: api
tags: [caching, redis, cache-aside, cache-invalidation, sync]
requires:
  - phase: 05-01
    provides: Global CacheModule with Redis (KeyvRedis) adapter and 24h TTL
  - phase: 05-02
    provides: Unified full-text search service (SearchService)
provides:
  - Cache-aside pattern on ProgramsService (findAll, findOne)
  - Cache-aside pattern on UniversitiesService (findAll, findOne, findPrograms)
  - Cache-aside pattern on SearchService (search)
  - Cache invalidation on SyncService.syncAll after successful sync
affects: [search-performance, programs-performance, universities-performance, sync-behavior]
tech-stack:
  added: []
  patterns:
    - "Cache-aside: check cacheManager.get() before DB, set on miss with 24h TTL"
    - "Cache invalidation: cacheManager.clear() after successful sync cycle"
    - "Cache key convention: {module}:{type}:{identifier}"
key-files:
  created: []
  modified:
    - src/modules/programs/programs.service.ts - Cache-aside on findAll and findOne
    - src/modules/universities/universities.service.ts - Cache-aside on findAll, findOne, findPrograms
    - src/modules/search/search.service.ts - Cache-aside on search method
    - src/modules/sync/sync.service.ts - Cache invalidation in syncAll
    - src/modules/programs/programs.spec.ts - CACHE_MANAGER mock provider
    - src/modules/universities/universities.spec.ts - CACHE_MANAGER mock provider
    - src/modules/search/search.spec.ts - CACHE_MANAGER mock provider
    - src/modules/sync/sync.spec.ts - CACHE_MANAGER mock provider with clear mock
key-decisions:
  - "Used cacheManager.clear() instead of cacheManager.reset() — cache-manager v6+ Cache interface provides clear(): Promise<boolean>, not reset()"
  - "Failed cache.get() or cache.set() operations propagate as exceptions — no try/catch wrapping to preserve transparency for monitoring"
  - "NotFoundException paths bypass cache.set() — not-found errors are never cached (throws before cache.set)"
  - "Cache key includes full JSON-serialized query object for precise cache keying on paginated/sorted results"
requirements-completed:
  - SRCH-06
duration: 5m
completed: 2026-05-01
---

# Phase 5 Plan 3: Redis Cache-Aside Implementation

**Added Redis caching to ProgramsService, UniversitiesService, and SearchService using cache-aside pattern with 24h TTL. Added cache invalidation in SyncService after successful sync.**

## Performance

- **Duration:** 5 min
- **Started:** 2026-05-01T13:26:00Z (following Plan 2 completion)
- **Completed:** 2026-05-01T13:31:00Z
- **Tasks:** 2
- **Files modified:** 8

## Accomplishments

- Added cache-aside pattern to **ProgramsService.findAll** and **ProgramsService.findOne** with cache keys `programs:list:{json}` and `programs:detail:{oid}`
- Added cache-aside pattern to **UniversitiesService.findAll**, **UniversitiesService.findOne**, and **UniversitiesService.findPrograms** with cache keys `universities:list:{json}`, `universities:detail:{oid}`, and `universities:programs:{oid}:{json}`
- Added cache-aside pattern to **SearchService.search** with cache key `search:{json}`; refactored the method to use `let result` pattern so cache.set() is called once after all three branches (programs-only, institutions-only, mixed)
- Added cache invalidation with `cacheManager.clear()` in **SyncService.syncAll** after successful completion log (before `return`), inside the try block so partial sync failures do not trigger invalidation (per threat model T-05-09)
- Updated all four spec files with `CACHE_MANAGER` mock providers to resolve the new constructor dependency
- All services inject `CACHE_MANAGER` via `@Inject(CACHE_MANAGER) private readonly cacheManager: Cache` following the established pattern from Phase 05-01 infrastructure

## Task Commits

Each task was committed atomically:

1. **Task 1: Add cache-aside to ProgramsService and UniversitiesService** - `2774e1d` (feat)
   - ProgramsService: findAll and findOne with cache-aside
   - UniversitiesService: findAll, findOne, findPrograms with cache-aside
   - Cache keys follow convention: `programs:list`, `programs:detail`, `universities:list`, `universities:detail`, `universities:programs`

2. **Task 2: Add cache-aside to SearchService and cache invalidation to SyncService** - `4802329` (feat)
   - SearchService.search: cache-aside with `search:{json}` key, refactored to single-result pattern
   - SyncService.syncAll: `cacheManager.clear()` after successful sync
   - All 4 spec files updated with CACHE_MANAGER mock providers
   - 19/19 tests pass across all modified modules

**Plan metadata:** (committed in this SUMMARY below)

## Files Created/Modified

- `src/modules/programs/programs.service.ts` - Added Inject, CACHE_MANAGER imports; cacheManager in constructor; cache-aside on findAll and findOne
- `src/modules/universities/universities.service.ts` - Added Inject, CACHE_MANAGER imports; cacheManager in constructor; cache-aside on findAll, findOne, findPrograms
- `src/modules/search/search.service.ts` - Added Inject, CACHE_MANAGER imports; cacheManager in constructor; cache-aside on search method; refactored to let-result pattern
- `src/modules/sync/sync.service.ts` - Added Inject, CACHE_MANAGER imports; cacheManager in constructor; cacheManager.clear() after successful sync completion log
- `src/modules/programs/programs.spec.ts` - Added CACHE_MANAGER mock (get/set) provider
- `src/modules/universities/universities.spec.ts` - Added CACHE_MANAGER mock (get/set) provider
- `src/modules/search/search.spec.ts` - Added CACHE_MANAGER mock (get/set) provider
- `src/modules/sync/sync.spec.ts` - Added CACHE_MANAGER mock (get/set/clear) provider

## Decisions Made

- Used `cacheManager.clear()` instead of `cacheManager.reset()` — the `Cache` interface from `cache-manager` v6+ exposes `clear(): Promise<boolean>` (line 66 of `index.d.ts`), not `reset()`. KeyvRedis supports clear() for flushing all keys in the namespace, achieving the same invalidation goal described in D-04.
- Refactored SearchService.search() from multiple `return` statements to a single `let result; ... result = await ...` pattern so that `cacheManager.set()` is called once after all code paths (programs-only, institutions-only, mixed). This is cleaner than duplicating the cache.set() call in each branch.
- Cache keys include the full JSON-serialized query object so that different page/size/filter combinations are cached independently. No normalization applied because DTO validation ensures controlled input shapes.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] cacheManager.reset() does not exist on Cache interface**
- **Found during:** Task 2 (Build verification)
- **Issue:** The plan referenced `cacheManager.reset()` but the installed `cache-manager` v6+ `Cache` interface uses `clear(): Promise<boolean>` instead of `reset()`. The TypeScript compiler rejected `reset()` with `TS2339: Property 'reset' does not exist on type 'Cache'`. This is an upstream API difference between cache-manager v5 (which had `reset`) and v6+ (which uses `clear`).
- **Fix:** Changed `await this.cacheManager.reset()` to `await this.cacheManager.clear()` in `sync.service.ts`. KeyvRedis adapter supports `clear()` for flushing all keys in the namespace, achieving the same invalidation behavior.
- **Files modified:** src/modules/sync/sync.service.ts
- **Verification:** `npm run build` exits 0
- **Committed in:** `4802329` (Task 2)

**2. [Rule 3 - Blocking] CACHE_MANAGER not provided in test modules**
- **Found during:** Task 2 (Test verification)
- **Issue:** After adding `@Inject(CACHE_MANAGER) private readonly cacheManager: Cache` to all four service constructors, the existing test specs did not provide `CACHE_MANAGER` tokens. NestJS threw `Nest can't resolve dependencies ... argument "CACHE_MANAGER" at index [2] is not available` for all four test modules.
- **Fix:** Added `{ provide: CACHE_MANAGER, useValue: { get: jest.fn(), set: jest.fn() } }` provider to all four spec files (sync.spec.ts also adds `clear: jest.fn()` since it uses cacheManager.clear()).
- **Files modified:** programs.spec.ts, universities.spec.ts, search.spec.ts, sync.spec.ts
- **Verification:** `npm run test -- --testPathPatterns="programs|universities|search|sync"` passes 19/19 tests
- **Committed in:** `4802329` (Task 2)

---

**Total deviations:** 2 auto-fixed (2 blocking)
**Impact on plan:** Both deviations were blocking issues resolved with equivalent outcomes. Functionality is unchanged — cache-aside works as specified, cache invalidation uses clear() instead of reset() with identical behavior. No scope creep.

## Issues Encountered

- `cacheManager.reset()` does not exist on the `Cache` interface in the installed version of `cache-manager` (v6+). The correct method is `clear()`. The plan documentation mentioned `reset()` which was accurate for cache-manager v5 but is now deprecated. KeyvRedis adapter supports `clear()` equivalently.

## Verification

- `npm run build` exits 0 (succeeds)
- `npm run test -- --testPathPatterns="programs|universities|search|sync"` passes 19/19 tests
- ProgramsService.findAll checks `cacheManager.get(cacheKey)` before querying
- ProgramsService.findOne checks `cacheManager.get(cacheKey)` before querying
- UniversitiesService.findAll checks `cacheManager.get(cacheKey)` before querying
- UniversitiesService.findOne checks `cacheManager.get(cacheKey)` before querying
- UniversitiesService.findPrograms checks `cacheManager.get(cacheKey)` before querying
- SearchService.search checks `cacheManager.get(cacheKey)` before querying
- SyncService.syncAll calls `await this.cacheManager.clear()` after successful sync
- NotFoundException paths bypass cache.set() per plan requirement

## Threat Surface

- T-05-07 (Information Disclosure): Cache stores public program/institution/search data only -- accepted, no PII or sensitive data
- T-05-08 (Tampering): Cache key injection via JSON.stringify(query) -- accepted, query objects from validated DTOs with class-validator whitelist
- T-05-09 (Spoofing): Stale cache after failed sync -- mitigated, cacheManager.clear() is inside try block before return; if sync fails mid-way, exception propagates and cache is NOT invalidated

## Known Stubs

None -- all cache methods are fully wired with real Redis calls at 24h TTL.

## Next Phase Readiness

- All read endpoints now serve from Redis cache on repeat requests within the 24h TTL window
- Sync-triggered cache invalidation ensures fresh data is served after each daily midnight sync
- Next plan (05-04) can proceed with rate-limit configuration or per-route throttle settings

---
*Phase: 05-search-and-infrastructure*
*Completed: 2026-05-01*

## Self-Check: PASSED
