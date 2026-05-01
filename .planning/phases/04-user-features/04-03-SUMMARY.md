---
phase: 04-user-features
plan: 03
subsystem: api
tags: [nestjs, prisma, admin, mock-tests, access-control, rbac, guards]

# Dependency graph
requires:
  - phase: 04-user-features plan 01
    provides: User.hasTestAccess Boolean field in schema.prisma and PostgreSQL

provides:
  - MockTestsService.startTest() hasTestAccess guard at entry (ForbiddenException if user lacks access)
  - AdminModule with AdminService and AdminController
  - GET /admin/users endpoint with email filter, pagination, user field allowlist
  - PATCH /admin/users/:id/mock-test-access endpoint for toggling user mock test access
  - ListUsersQueryDto and ToggleMockTestAccessDto
affects: [04-04, mock-tests, admin-frontend]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Controller-level @UseGuards + @Roles applied once for all routes in an admin controller (not per-route)"
    - "Per-route ValidationPipe (transform: true, whitelist: true) matching established search/guidance pattern"
    - "Prisma select allowlist constant (USER_ADMIN_SELECT) to prevent sensitive field leakage"
    - "P2025 Prisma error code caught in service and rethrown as NotFoundException"

key-files:
  created:
    - src/modules/admin/admin.controller.ts
    - src/modules/admin/admin.service.ts
    - src/modules/admin/admin.module.ts
    - src/modules/admin/dto/list-users-query.dto.ts
    - src/modules/admin/dto/toggle-mock-test-access.dto.ts
    - src/modules/admin/admin.service.spec.ts
    - src/modules/admin/admin.controller.spec.ts
  modified:
    - src/modules/mock-tests/mock-tests.service.ts
    - src/modules/mock-tests/mock-tests.spec.ts
    - src/app.module.ts

key-decisions:
  - "Controller-level @UseGuards and @Roles applied at class level (not per-route) — all admin routes share the same guard requirement"
  - "PrismaModule is @Global() so AdminModule does not need to import it; module declaration is minimal"
  - "USER_ADMIN_SELECT constant defined as const to provide Prisma select allowlist — prevents passwordHash and token fields from appearing in any admin user response"
  - "hasTestAccess check uses prisma.user.findUnique with select: { hasTestAccess: true } — minimal DB read before potentially expensive template lookup"

patterns-established:
  - "Admin guard pattern: class-level @UseGuards(JwtAuthGuard, RolesGuard) + @Roles(['ADMIN']) on AdminController"
  - "Access gating in service method first, before other business logic — fail-fast pattern"

requirements-completed: [USER-07, USER-08, USER-09]

# Metrics
duration: 12min
completed: 2026-05-01
---

# Phase 4 Plan 03: Mock Test Access Gating and Admin User Management API Summary

**MockTestsService.startTest() gated on User.hasTestAccess with ForbiddenException; AdminModule with GET /admin/users (paginated, email-filtered) and PATCH /admin/users/:id/mock-test-access both guarded by JwtAuthGuard + RolesGuard + @Roles(['ADMIN'])**

## Performance

- **Duration:** 12 min
- **Started:** 2026-05-01T09:07:34Z
- **Completed:** 2026-05-01T09:19:34Z
- **Tasks:** 2 completed (each with TDD RED/GREEN commits)
- **Files modified:** 10 (7 created, 3 modified)

## Accomplishments

- Patched `MockTestsService.startTest()` to check `hasTestAccess` as the very first action — fetches user by userId with `select: { hasTestAccess: true }`, throws `ForbiddenException('Mock test access is not enabled for your account')` if user not found or flag is false (USER-09, D-09)
- Created `AdminService` with `listUsers()` (paginated, email case-insensitive contains filter, Prisma select allowlist preventing sensitive field leakage) and `toggleMockTestAccess()` (P2025 caught and rethrown as NotFoundException)
- Created `AdminController` with `GET /admin/users` and `PATCH /admin/users/:id/mock-test-access`, both gated by `@UseGuards(JwtAuthGuard, RolesGuard) @Roles(['ADMIN'])` applied at controller level
- Created `ListUsersQueryDto` (email optional, page/size with @Type(() => Number)) and `ToggleMockTestAccessDto` (@IsBoolean())
- Registered `AdminModule` in `AppModule`
- All 91 unit tests pass (no regressions); new admin specs: 11 tests covering service and controller behaviours

## Task Commits

Each task was committed atomically following TDD RED/GREEN pattern:

1. **Task 1 RED: Add failing tests for hasTestAccess guard and AdminService** - `d80b5cb` (test)
2. **Task 1 GREEN: Patch startTest hasTestAccess guard and create AdminModule skeleton** - `5444906` (feat)
3. **Task 2 RED: Add failing tests for AdminController routes** - `c66e0f8` (test)
4. **Task 2 GREEN: Create AdminController with guarded /admin routes** - `d242ea2` (feat)

_Note: TDD tasks have RED (test) + GREEN (feat) commits per task._

## Files Created/Modified

- `/home/liam/Downloads/github_repo/studyfin-backend/src/modules/mock-tests/mock-tests.service.ts` - Added hasTestAccess guard at top of startTest(); updated test mock to include user.findUnique
- `/home/liam/Downloads/github_repo/studyfin-backend/src/modules/mock-tests/mock-tests.spec.ts` - Updated prisma mock type to include user.findUnique; updated startTest tests; added 2 new ForbiddenException tests
- `/home/liam/Downloads/github_repo/studyfin-backend/src/modules/admin/admin.service.ts` - AdminService with listUsers and toggleMockTestAccess
- `/home/liam/Downloads/github_repo/studyfin-backend/src/modules/admin/admin.controller.ts` - AdminController with GET /admin/users and PATCH /admin/users/:id/mock-test-access
- `/home/liam/Downloads/github_repo/studyfin-backend/src/modules/admin/admin.module.ts` - AdminModule wiring controller and service
- `/home/liam/Downloads/github_repo/studyfin-backend/src/modules/admin/dto/list-users-query.dto.ts` - ListUsersQueryDto with email, page, size
- `/home/liam/Downloads/github_repo/studyfin-backend/src/modules/admin/dto/toggle-mock-test-access.dto.ts` - ToggleMockTestAccessDto with @IsBoolean() hasTestAccess
- `/home/liam/Downloads/github_repo/studyfin-backend/src/modules/admin/admin.service.spec.ts` - 9 unit tests for AdminService
- `/home/liam/Downloads/github_repo/studyfin-backend/src/modules/admin/admin.controller.spec.ts` - 4 unit tests for AdminController
- `/home/liam/Downloads/github_repo/studyfin-backend/src/app.module.ts` - Registered AdminModule

## Decisions Made

- Controller-level guard applied at class level (`@UseGuards` and `@Roles` on the class, not per-route) — cleaner and ensures no route can accidentally be added without protection
- `PrismaModule` is `@Global()` so `AdminModule` does not import it — the global provider is already available; importing would be redundant (though harmless per plan note)
- `USER_ADMIN_SELECT` defined as `const` object — single source of truth for admin-safe user fields, applied in both `listUsers` (select) and `toggleMockTestAccess` (select) for consistency
- `hasTestAccess` revocation does not cancel in-progress tests — per D-08 accepted design decision; only `startTest()` checks the flag

## Deviations from Plan

None - plan executed exactly as written. The only minor structural note is that `AdminModule` was initially created without the `AdminController` reference (before Task 2 created the file) to allow Task 1 build verification to pass, then updated in Task 2 to include the controller. This is an implicit sequencing requirement between the two tasks and is not a deviation from the plan's intent.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- USER-07, USER-08, USER-09 satisfied: mock test access is now gated via `hasTestAccess` in `startTest()`, and admins can manage user access via the new `/admin/users` endpoints
- Plan 04-04 (UsersController wiring) can proceed independently — no dependencies on this plan's changes
- Admin API is functional but has no rate limiting (deferred per project scope); acceptable for v1 manual-use admin endpoints

---
*Phase: 04-user-features*
*Completed: 2026-05-01*

## Self-Check: PASSED

- FOUND: `src/modules/mock-tests/mock-tests.service.ts` — contains hasTestAccess guard
- FOUND: `src/modules/admin/admin.controller.ts` — AdminController with /admin routes
- FOUND: `src/modules/admin/admin.service.ts` — AdminService with listUsers and toggleMockTestAccess
- FOUND: `src/modules/admin/admin.module.ts` — AdminModule
- FOUND: `src/modules/admin/dto/list-users-query.dto.ts` — ListUsersQueryDto
- FOUND: `src/modules/admin/dto/toggle-mock-test-access.dto.ts` — ToggleMockTestAccessDto
- FOUND: `.planning/phases/04-user-features/04-03-SUMMARY.md` — this file
- FOUND: commit `d80b5cb` — test(04-03): add failing tests for hasTestAccess guard and AdminService
- FOUND: commit `5444906` — feat(04-03): patch startTest hasTestAccess guard and create AdminModule skeleton
- FOUND: commit `c66e0f8` — test(04-03): add failing tests for AdminController routes
- FOUND: commit `d242ea2` — feat(04-03): create AdminController with guarded /admin routes
