---
phase: 03-guidance-content
plan: 03
subsystem: api
tags: [nestjs, guards, jwt, rbac, controller, routing]

requires:
  - phase: 03-guidance-content
    plan: 02
    provides: GuidanceService with findByProgramOid/upsert/patch methods and CreateGuidanceDto/UpdateGuidanceDto

provides:
  - GuidanceController with GET (public), POST (admin), PATCH (admin) routes on /guidance/:programOid
  - GuidanceModule registering GuidanceController and GuidanceService
  - AppModule extended to import GuidanceModule
affects: [03-04]

tech-stack:
  added: []
  patterns: [UseGuards with JwtAuthGuard+RolesGuard stack, Roles decorator with array syntax, UsePipes ValidationPipe per-route, HttpCode explicit 200 on PATCH]

key-files:
  created:
    - src/modules/guidance/guidance.controller.ts
    - src/modules/guidance/guidance.module.ts
  modified:
    - src/app.module.ts

key-decisions:
  - "@Roles(['ADMIN']) requires array syntax (not string) — Reflector.createDecorator<string[]> enforces typed array parameter"
  - "GET /guidance/:programOid has no guards — intentionally public per GUID-02 and T-03-09 accept disposition"
  - "ValidationPipe applied per-route (not globally) following project convention from SearchController"

requirements-completed: [GUID-02, GUID-04, GUID-05]

duration: 6min
completed: 2026-04-30
---

# Phase 03 Plan 03: GuidanceController and Module Wiring Summary

**GuidanceController (GET/POST/PATCH on /guidance/:programOid) with JWT+RBAC guards on write routes, wired into AppModule via GuidanceModule**

## Performance

- **Duration:** ~6 min
- **Started:** 2026-04-30T20:30:15Z
- **Completed:** 2026-04-30T20:36:19Z
- **Tasks:** 2
- **Files modified:** 3 (2 created, 1 modified)

## Accomplishments

- GuidanceController exposes three routes: GET (public, no guards), POST and PATCH (JwtAuthGuard + RolesGuard + @Roles(['ADMIN']))
- POST returns 201 (NestJS default), PATCH returns 200 (explicit @HttpCode(200))
- ValidationPipe with transform+whitelist applied to POST and PATCH per project convention
- GuidanceModule registers controller and service, PrismaModule not imported (it is @Global())
- AppModule updated to import GuidanceModule between ProgramsModule and MockTestsModule
- TypeScript build exits 0 with no errors

## Task Commits

Each task was committed atomically:

1. **Task 1: Create GuidanceController with GET/POST/PATCH routes** - `c1abd5c` (feat)
2. **Task 2: Create GuidanceModule and wire into AppModule** - `aa46b6d` (feat)

## Files Created/Modified

- `src/modules/guidance/guidance.controller.ts` - GuidanceController with @Controller('guidance'), public GET, admin-only POST and PATCH
- `src/modules/guidance/guidance.module.ts` - GuidanceModule with controllers=[GuidanceController], providers/exports=[GuidanceService]
- `src/app.module.ts` - Added GuidanceModule import statement and entry in imports array

## Decisions Made

- `@Roles(['ADMIN'])` uses array syntax because `Reflector.createDecorator<string[]>()` requires a `string[]` argument. The plan's code snippet showed `@Roles('ADMIN')` (string) which caused a TS2345 type error — fixed inline per Rule 1.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed @Roles decorator call to use array syntax**
- **Found during:** Task 2 (build verification)
- **Issue:** Plan's code snippet used `@Roles('ADMIN')` but `Reflector.createDecorator<string[]>()` requires a `string[]` argument. TypeScript emitted TS2345 error on both @Post and @Patch routes.
- **Fix:** Changed to `@Roles(['ADMIN'])` on both routes to match the decorator type signature.
- **Files modified:** src/modules/guidance/guidance.controller.ts
- **Commit:** aa46b6d (included in Task 2 commit)

## Known Stubs

None — controller delegates fully to GuidanceService methods from Plan 02.

## Threat Flags

No new security surface introduced beyond what the plan's threat model covers. POST and PATCH are guarded by JwtAuthGuard + RolesGuard + @Roles(['ADMIN']) per T-03-07 and T-03-08. GET is intentionally public per T-03-09 (accept disposition).

## Self-Check: PASSED

- FOUND: src/modules/guidance/guidance.controller.ts
- FOUND: src/modules/guidance/guidance.module.ts
- FOUND: src/app.module.ts (contains GuidanceModule in import and imports array)
- FOUND commit: c1abd5c (Task 1)
- FOUND commit: aa46b6d (Task 2)

---
*Phase: 03-guidance-content*
*Completed: 2026-04-30*
