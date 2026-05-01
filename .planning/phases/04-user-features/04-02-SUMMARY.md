---
phase: 04-user-features
plan: 02
subsystem: users
tags: [users, profile, saved-programs, prisma, dto, class-validator, nestjs]

# Dependency graph
requires:
  - phase: 04-user-features
    plan: 01
    provides: "User.hasTestAccess Boolean field in Prisma schema and DB"
  - phase: 03-guidance-content
    provides: "GuidanceSection model and established Prisma patterns"
provides:
  - "UpdateProfileDto — validated firstName/lastName patch DTO"
  - "UpdateSavedProgramDto — status field validated against IsIn fixed set"
  - "ListSavedProgramsQueryDto — optional status filter DTO"
  - "UsersService.getProfile — safe profile shape via Prisma select allowlist"
  - "UsersService.updateProfile — firstName/lastName only, P2025 → NotFoundException"
  - "UsersService.saveProgram — programId existence check, default status='interested', P2002 → ConflictException"
  - "UsersService.updateSavedProgramStatus — validates ownership via userId+programId composite key"
  - "UsersService.removeSavedProgram — validates ownership before delete"
  - "UsersService.listSavedPrograms — ordered by createdAt desc, optional status filter, program name/oid/type/fieldOfStudy included"
affects: [04-03, 04-04]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Prisma select allowlist: PROFILE_SELECT const prevents leaking passwordHash/tokens even if ORM adds new fields"
    - "Composite unique key lookup: userId_programId compound where clause for UserProgram CRUD operations"
    - "Prisma error code catch: P2002 → ConflictException, P2025 → NotFoundException"
    - "Program existence pre-check before UserProgram create (prevents orphan records)"

key-files:
  created:
    - src/modules/users/dto/update-profile.dto.ts
    - src/modules/users/dto/save-program.dto.ts
    - src/modules/users/dto/list-saved-programs-query.dto.ts
  modified:
    - src/modules/users/users.service.ts

key-decisions:
  - "PROFILE_SELECT defined as 'as const' private field (not inline) so both getProfile and updateProfile share the identical select shape without drift"
  - "saveProgram pre-checks program existence explicitly (findUnique) rather than relying solely on FK violation — provides a clean NotFoundException('Program not found') message"
  - "updateProfile wraps prisma.user.update in try/catch to convert P2025 to NotFoundException — NestJS does not surface P2025 as 404 by default"
  - "updateSavedProgramStatus and removeSavedProgram use findUnique first then update/delete (two queries) for explicit 404 behavior rather than relying on Prisma throwing P2025"

patterns-established:
  - "All UserProgram mutations query with both userId AND programId to prevent cross-user data access"
  - "mapProfile helper centralizes profile response mapping — avoids duplicating field selection at each callsite"

requirements-completed: [USER-01, USER-02, USER-03, USER-04, USER-05, USER-06]

# Metrics
duration: 5min
completed: 2026-05-01
---

# Phase 4 Plan 02: UsersService Profile and Saved-Programs Methods Summary

**UsersService extended with six business-logic methods (getProfile, updateProfile, saveProgram, updateSavedProgramStatus, removeSavedProgram, listSavedPrograms) plus three validated DTOs, using Prisma select allowlist for security and composite key lookups for cross-user isolation**

## Performance

- **Duration:** 5 min
- **Started:** 2026-05-01T09:07:21Z
- **Completed:** 2026-05-01T09:12:00Z
- **Tasks:** 2 completed
- **Files modified:** 4 (3 new DTOs, 1 extended service)

## Accomplishments

- Created `UpdateProfileDto` with `@IsOptional @IsString @MaxLength(100)` on `firstName` and `lastName`; no other fields accepted (whitelist via ValidationPipe)
- Created `UpdateSavedProgramDto` with `@IsString @IsIn(['interested','applying','applied','accepted','rejected'])` on required `status` field
- Created `ListSavedProgramsQueryDto` with `@IsOptional @IsString @IsIn(ALLOWED_STATUSES)` on optional `status` field
- Extended `UsersService` with `PROFILE_SELECT` private constant (select allowlist) and `mapProfile` helper — used by both `getProfile` and `updateProfile`
- Implemented `getProfile`: Prisma `findUnique` with `select: PROFILE_SELECT` plus `_count.savedPrograms`; throws `NotFoundException` if user absent
- Implemented `updateProfile`: patches only `firstName`/`lastName`; catches Prisma error P2025 (record not found) and rethrows as `NotFoundException`
- Implemented `saveProgram`: pre-checks `program.findUnique` to throw `NotFoundException('Program not found')` on missing program; catches P2002 (unique constraint) as `ConflictException('Program already saved')`; sets default `status='interested'`
- Implemented `updateSavedProgramStatus`: queries `userId_programId` composite key to enforce ownership; throws `NotFoundException('Saved program not found')` if record absent
- Implemented `removeSavedProgram`: ownership check via composite key; throws `NotFoundException` then deletes; no return value (void)
- Implemented `listSavedPrograms`: `findMany` with `orderBy: { createdAt: 'desc' }`, optional status filter, includes `program: { name, oid, type, fieldOfStudy }`
- TypeScript build exits 0; existing users tests still pass

## Task Commits

Each task was committed atomically:

1. **Task 1: Create UpdateProfileDto, UpdateSavedProgramDto, ListSavedProgramsQueryDto** - `f536012`
2. **Task 2: Add profile and saved-program methods to UsersService** - `ab5fe89`

## Files Created/Modified

- `/home/liam/Downloads/github_repo/studyfin-backend/src/modules/users/dto/update-profile.dto.ts` — new; `UpdateProfileDto` class with optional firstName/lastName
- `/home/liam/Downloads/github_repo/studyfin-backend/src/modules/users/dto/save-program.dto.ts` — new; `UpdateSavedProgramDto` class with IsIn status validation
- `/home/liam/Downloads/github_repo/studyfin-backend/src/modules/users/dto/list-saved-programs-query.dto.ts` — new; `ListSavedProgramsQueryDto` class with optional IsIn status filter
- `/home/liam/Downloads/github_repo/studyfin-backend/src/modules/users/users.service.ts` — extended; added PROFILE_SELECT, mapProfile, and six new async methods

## Decisions Made

- `PROFILE_SELECT` defined as `as const` private field shared between `getProfile` and `updateProfile` to guarantee identical select shapes (no field drift between the two)
- `saveProgram` uses explicit `program.findUnique` pre-check — provides semantically correct `NotFoundException('Program not found')` rather than relying on FK violation (P2003 caught later)
- `updateProfile` catches P2025 → NotFoundException in try/catch because NestJS surfaces Prisma's P2025 as a 500 InternalServerError by default
- `updateSavedProgramStatus` and `removeSavedProgram` use `findUnique` then action (two-query pattern) for predictable 404 behavior

## Deviations from Plan

None — plan executed exactly as written. The note about wrapping `updateProfile` in try/catch for P2025 was documented in the plan's action section and was implemented as specified.

## Threat Model Compliance

All five HIGH/MED threat mitigations from the plan's `<threat_model>` were applied:

| Threat | Mitigation Applied |
|--------|-------------------|
| Cross-user UserProgram mutation | All UserProgram queries use `where: { userId_programId: { userId, programId } }` — attacker must supply both IDs |
| Status field injection | `UpdateSavedProgramDto.@IsIn(ALLOWED_STATUSES)` rejects arbitrary strings at DTO validation layer |
| Profile field injection | `UpdateProfileDto` exposes only `firstName`/`lastName`; ValidationPipe `whitelist: true` strips extras |
| getProfile leaks passwordHash/tokens | `PROFILE_SELECT` is an explicit allowlist — passwordHash, resetToken, emailVerifyToken never selected |
| saveProgram with non-existent programId | `program.findUnique` pre-check throws `NotFoundException('Program not found')` before create |

## Known Stubs

None — all methods have real Prisma query implementations. No hardcoded empty values or placeholder data.

## Self-Check: PASSED

- FOUND: `src/modules/users/dto/update-profile.dto.ts` — contains `class UpdateProfileDto`
- FOUND: `src/modules/users/dto/save-program.dto.ts` — contains `class UpdateSavedProgramDto` with `@IsIn`
- FOUND: `src/modules/users/dto/list-saved-programs-query.dto.ts` — contains `class ListSavedProgramsQueryDto`
- FOUND: `src/modules/users/users.service.ts` — contains all 6 new methods (lines 126, 135, 155, 185, 210, 221)
- FOUND: commit `f536012` — feat(04-02): create UpdateProfileDto, UpdateSavedProgramDto, ListSavedProgramsQueryDto
- FOUND: commit `ab5fe89` — feat(04-02): add profile and saved-program methods to UsersService
- BUILD: `npm run build` exits 0
- TESTS: `npm run test -- --testPathPatterns=users` — 1 passed
