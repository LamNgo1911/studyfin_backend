---
phase: 05-search-and-infrastructure
plan: 04
subsystem: api-layer
tags:
  - swagger
  - throttling
  - api-documentation
dependency-graph:
  requires:
    - 05-01: ThrottlerModule + SwaggerModule setup in main.ts
  provides:
    - Rate-limit overrides for auth (10 req/60s) and admin (30 req/60s)
    - Swagger @ApiTags grouping for all 6 public controllers
    - @ApiBearerAuth() on JWT-guarded controllers (Auth, Users)
  affects:
    - src/modules/auth/auth.controller.ts
    - src/modules/admin/admin.controller.ts
    - src/modules/programs/programs.controller.ts
    - src/modules/universities/universities.controller.ts
    - src/modules/guidance/guidance.controller.ts
    - src/modules/sync/sync.controller.ts
    - src/modules/users/users.controller.ts
tech-stack:
  added:
    - '@nestjs/swagger decorators: @ApiTags, @ApiBearerAuth'
    - '@nestjs/throttler decorator: @Throttle'
  patterns:
    - Class-level decorator ordering: @ApiTags, @ApiBearerAuth, @Throttle, @Controller
key-files:
  created: []
  modified:
    - src/modules/auth/auth.controller.ts
    - src/modules/admin/admin.controller.ts
    - src/modules/programs/programs.controller.ts
    - src/modules/universities/universities.controller.ts
    - src/modules/guidance/guidance.controller.ts
    - src/modules/sync/sync.controller.ts
    - src/modules/users/users.controller.ts
decisions:
  - 'AdminController excluded from @ApiTags per D-07: admin endpoints do not appear in public Swagger documentation'
metrics:
  duration: ~5 minutes
  completed_date: 2026-05-01
---

# Phase 05 Plan 04: Swagger Tags + Throttle Overrides Summary

Added @Throttle rate-limit overrides for auth (10 req/60s) and admin (30 req/60s) endpoints per D-06, and @ApiTags on all 6 public controllers plus @ApiBearerAuth on JWT-guarded ones per D-07.

## Tasks Completed

| #  | Name | Commit | Files |
|----|------|--------|-------|
| 1 | Add @Throttle overrides to AuthController and AdminController | `5857f12` | `src/modules/auth/auth.controller.ts`, `src/modules/admin/admin.controller.ts` |
| 2 | Add @ApiTags to all public controllers + @ApiBearerAuth where needed | `4a1dab9` | `src/modules/programs/programs.controller.ts`, `src/modules/universities/universities.controller.ts`, `src/modules/guidance/guidance.controller.ts`, `src/modules/sync/sync.controller.ts`, `src/modules/auth/auth.controller.ts`, `src/modules/users/users.controller.ts` |

## What Was Built

### Task 1: @Throttle Overrides

**AuthController** (`src/modules/auth/auth.controller.ts`):
- Added `import { Throttle } from '@nestjs/throttler'`
- Added `@Throttle({ default: { limit: 10, ttl: 60000 } })` class-level decorator -- limits auth endpoints (register, login, refresh, forgot-password, reset-password, verify-email, me) to 10 requests per 60 seconds, preventing brute force and token refresh flooding (T-05-10).

**AdminController** (`src/modules/admin/admin.controller.ts`):
- Added `import { Throttle } from '@nestjs/throttler'`
- Added `@Throttle({ default: { limit: 30, ttl: 60000 } })` class-level decorator after `@Roles(['ADMIN'])` -- limits admin endpoints to 30 requests per 60 seconds, reducing blast radius if admin credentials are compromised (T-05-12).

### Task 2: @ApiTags and @ApiBearerAuth

Six controllers tagged for Swagger UI grouping:

| Controller | @ApiTags | @ApiBearerAuth | Swagger UI |
|------------|----------|----------------|------------|
| ProgramsController | `'Programs'` | No | Shows in Programs group |
| UniversitiesController | `'Universities'` | No | Shows in Universities group |
| GuidanceController | `'Guidance'` | No | Shows in Guidance group |
| SyncController | `'Sync'` | No | Shows in Sync group |
| AuthController | `'Auth'` | Yes | Shows in Auth group with lock icon |
| UsersController | `'Users'` | Yes | Shows in Users group with lock icon |
| AdminController | (none) | No | Excluded per D-07 |

All decorators are class-level. The final ordering is: `@ApiTags -> @ApiBearerAuth -> @Throttle -> @Controller`.

## Verification Results

| Check | Result |
|-------|--------|
| ProgramsController has @ApiTags('Programs') | PASS |
| UniversitiesController has @ApiTags('Universities') | PASS |
| GuidanceController has @ApiTags('Guidance') | PASS |
| SyncController has @ApiTags('Sync') | PASS |
| AuthController has @ApiTags('Auth') + @ApiBearerAuth() | PASS |
| UsersController has @ApiTags('Users') + @ApiBearerAuth() | PASS |
| AdminController has @Throttle but NOT @ApiTags | PASS |
| npm run build (exit 0) | NOT APPLICABLE -- 7 pre-existing TS2305 errors in `src/modules/search/` |
| npm run test (all pass) | NOT APPLICABLE -- pre-existing test failures in users service |

## Deviations from Plan

None -- plan executed exactly as written.

## Pre-existing Issues (Out of Scope)

| Issue | Details |
|-------|---------|
| Build failure | `npm run build` fails with 7 TS2305 errors in `src/modules/search/`: missing exports `InstitutionDto` and `InstitutionSearchResponseDto` from `search-response.dto.ts`. These files were not modified by this plan. |
| Test failures | `npm run test` shows pre-existing failures (9 failed, 93 passed). All failures are in `users.service.ts` (`prisma.userProgram.count is not a function`) and `users.spec.ts`. Not related to decorator additions. |

## Threat Surface

The threat model identifies T-05-10 (DoS on auth endpoints), T-05-11 (Swagger info disclosure -- accepted), and T-05-12 (privilege escalation on admin endpoints). All mitigations were implemented:
- T-05-10: AuthController @Throttle 10 req/60s
- T-05-12: AdminController @Throttle 30 req/60s
- T-05-11: Accepted -- Swagger exposes endpoint structure but no sensitive data

No new threat surface introduced beyond what the plan's threat model covers.

## Self-Check: PASSED

- Commits verified: `5857f12` (Task 1), `4a1dab9` (Task 2) -- both present in git log
- All 7 modified controller files exist and have correct decorators per verification checks above
- No unintended file deletions
