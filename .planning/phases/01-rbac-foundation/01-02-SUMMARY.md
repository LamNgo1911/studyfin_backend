---
phase: 01-rbac-foundation
plan: "02"
subsystem: auth
tags: [nestjs, rbac, guards, decorators, jwt, roles, reflector]

dependency_graph:
  requires:
    - phase: "01-rbac-foundation"
      plan: "01"
      provides: "CurrentUserData interface with role: string; Role enum in Prisma schema"
  provides:
    - "Roles decorator using Reflector.createDecorator<string[]>() at src/common/decorators/roles.decorator.ts"
    - "RolesGuard implementing CanActivate — throws ForbiddenException (403) on role mismatch"
    - "JwtStrategy.validate() returns role from database User object (not from JWT payload)"
  affects:
    - "Any future route decorated @UseGuards(JwtAuthGuard, RolesGuard) @Roles('ADMIN')"
    - "Plan 01-03 (JwtAuthGuard + RolesGuard wiring into AdminGuard or module-level guard)"

tech_stack:
  added: []
  patterns:
    - "Reflector.createDecorator<string[]>() for type-safe decorator metadata (NestJS 10+ API)"
    - "Additive guard pattern — RolesGuard passes through when no @Roles() decorator is present"
    - "DB-sourced role on every authenticated request (role never read from JWT payload)"

key_files:
  created:
    - src/common/decorators/roles.decorator.ts
    - src/common/guards/roles.guard.ts
    - src/common/guards/roles.guard.spec.ts
  modified:
    - src/modules/auth/strategies/jwt.strategy.ts

key_decisions:
  - "Used Reflector.createDecorator<string[]>() (NestJS 10+ typed API) not SetMetadata('roles', roles) (legacy pattern per D-04)"
  - "RolesGuard is additive — no @Roles() means allow all; guard is not restrictive by default"
  - "ForbiddenException (403) thrown on role mismatch, not UnauthorizedException (401) — correct HTTP semantics"
  - "Role read from DB on every authenticated request via JwtStrategy.validate() -> usersService.findById() — immediate revocation capability (per FOUND-03)"

patterns-established:
  - "Guard stacking: @UseGuards(JwtAuthGuard, RolesGuard) @Roles('ADMIN') for admin-only routes"
  - "Roles metadata propagated via Reflector.get(Roles, context.getHandler()) in CanActivate.canActivate()"
  - "Unit test pattern for guards: mock Reflector.get() + mock ExecutionContext via jest.fn()"

requirements-completed: [FOUND-03, FOUND-05, FOUND-06]

duration: 6min
completed: "2026-04-25"
---

# Phase 01 Plan 02: Roles Decorator, RolesGuard, and JwtStrategy Role Summary

**Roles decorator using Reflector.createDecorator, RolesGuard enforcing 403 on role mismatch, and JwtStrategy returning role from DB for immediate revocation capability.**

## Performance

- **Duration:** ~6 min
- **Started:** 2026-04-25T10:05:43Z
- **Completed:** 2026-04-25T10:11:21Z
- **Tasks:** 2 of 2
- **Files modified:** 4

## Accomplishments

- Created `Roles` decorator using `Reflector.createDecorator<string[]>()` — the NestJS 10+ typed API (not legacy `SetMetadata`)
- Created `RolesGuard` implementing `CanActivate` — throws `ForbiddenException` (403) when `requiredRoles.includes(user.role)` fails; passes through with no `@Roles()` decorator
- Updated `JwtStrategy.validate()` to include `role: user.role` from the Prisma `User` object returned by `UsersService.findById()` — role is now read from database on every authenticated request, not from the JWT payload
- Unit tests cover all four guard behavior cases (5 tests, all passing)

## Task Commits

Each task was committed atomically:

1. **Task 1: Create roles.decorator.ts and roles.guard.ts (TDD)** - `9405e10` (feat)
2. **Task 2: Update JwtStrategy.validate() to return role from DB** - `aee8f40` (feat)

_Note: Task 1 was TDD. RED phase confirmed test failure (module not found). GREEN phase implemented guard and all 5 tests passed._

## Files Created/Modified

- `src/common/decorators/roles.decorator.ts` - Roles decorator: `export const Roles = Reflector.createDecorator<string[]>()`
- `src/common/guards/roles.guard.ts` - RolesGuard: injects Reflector, throws ForbiddenException on role mismatch, passes allow-all when no decorator
- `src/common/guards/roles.guard.spec.ts` - Unit tests for RolesGuard covering 4 behavior cases (no decorator, role match, wrong role, no user)
- `src/modules/auth/strategies/jwt.strategy.ts` - Added `role: user.role` to validate() return object

## Decisions Made

- Used `Reflector.createDecorator<string[]>()` (NestJS 10+ API) instead of the legacy `SetMetadata('roles', roles)` pattern — per D-04 from plan research
- Guard is additive: missing `@Roles()` decorator means allow all — routes default to open unless explicitly annotated
- `ForbiddenException` (HTTP 403) is semantically correct for role denial; `UnauthorizedException` (HTTP 401) is reserved for missing/invalid tokens (handled by JwtAuthGuard)
- Role sourced from DB `User` object on every request — revocation of admin access takes effect immediately without needing to invalidate existing JWT tokens

## Deviations from Plan

None — plan executed exactly as written. TDD cycle followed correctly: RED (test import failed), GREEN (implementation made all 5 pass), no REFACTOR needed.

## Issues Encountered

The `--testPathPattern` flag has been replaced by `--testPathPatterns` in the version of Jest installed in this project. Used the correct flag. This did not affect any outcomes.

Pre-existing test failures in `universities.spec.ts` and `users.spec.ts` (missing mock providers for `HttpService`/`PrismaService`) were confirmed to predate this plan via `git stash` verification. Not in scope.

## Known Stubs

None. All three files are complete and wired correctly. `roles.decorator.ts` and `roles.guard.ts` are fully implemented. `jwt.strategy.ts` now returns the complete `CurrentUserData` shape including `role`.

## Threat Flags

No new network endpoints introduced. Security-relevant changes in this plan are mitigated per plan threat model:

| Mitigation | File | Description |
|------------|------|-------------|
| T-01-03 mitigated | roles.guard.ts | `requiredRoles.includes(user.role)` — exact string match, no wildcard |
| T-01-04 mitigated | jwt.strategy.ts | Role read from DB via `findById()`, JWT payload role claim discarded |
| T-01-05 accepted | roles.guard.ts | Generic ForbiddenException message — does not reveal role schema |

## User Setup Required

None — no external service configuration required.

## Next Phase Readiness

The complete RBAC runtime policy machinery is now in place:

- `@UseGuards(JwtAuthGuard, RolesGuard) @Roles('ADMIN')` pattern is ready to apply to any route
- `request.user.role` is populated from the database on every authenticated request
- Plan 01-03 can now wire these guards into the admin endpoints

No blockers.

## Self-Check: PASSED

- [x] `src/common/decorators/roles.decorator.ts` exists with `Reflector.createDecorator<string[]>()`
- [x] `src/common/guards/roles.guard.ts` exists with `ForbiddenException` and `implements CanActivate`
- [x] `src/common/guards/roles.guard.spec.ts` exists with 5 passing tests
- [x] `src/modules/auth/strategies/jwt.strategy.ts` contains `role: user.role`
- [x] Commit `9405e10` exists: `feat(01-02): create Roles decorator and RolesGuard`
- [x] Commit `aee8f40` exists: `feat(01-02): add role from DB to JwtStrategy.validate() return value`
- [x] `npm run build` exits 0
- [x] `npm run test -- --testPathPatterns=roles.guard` exits 0 with 5 passed

---
*Phase: 01-rbac-foundation*
*Completed: 2026-04-25*
