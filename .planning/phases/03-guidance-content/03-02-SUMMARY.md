---
phase: 03-guidance-content
plan: 02
subsystem: api
tags: [nestjs, prisma, dto, class-validator, class-transformer]

requires:
  - phase: 03-guidance-content
    provides: GuidanceSection Prisma model with all required fields and generated Prisma client types

provides:
  - GuidanceSectionDto with class-validator decorators for key/title/body/order fields
  - CreateGuidanceDto with ValidateNested array support for sections
  - UpdateGuidanceDto extending PartialType for partial PATCH payloads
  - GuidanceService with findByProgramOid, upsert, and patch methods
affects: [03-03, 03-04]

tech-stack:
  added: []
  patterns: [PartialType for PATCH DTOs, ValidateNested+Type for nested DTO validation, $transaction callback for multi-step atomic writes, $transaction array for concurrent upserts]

key-files:
  created:
    - src/modules/guidance/dto/guidance-section.dto.ts
    - src/modules/guidance/dto/create-guidance.dto.ts
    - src/modules/guidance/dto/update-guidance.dto.ts
    - src/modules/guidance/guidance.service.ts
  modified: []

key-decisions:
  - "upsert() uses $transaction callback form (not array form) to allow deleteMany followed by createMany in a single atomic transaction"
  - "patch() uses $transaction array form with per-section guidanceSection.upsert — only provided sections touched, unchanged sections preserved"
  - "mapSection() strips id/programOid/createdAt/updatedAt to keep API response surface minimal (T-03-06 threat mitigation)"
  - "findByProgramOid() returns empty array (not NotFoundException) when program has no guidance — program may legitimately have no sections yet"

patterns-established:
  - "@ValidateNested({ each: true }) + @Type(() => DtoClass) for arrays of nested DTOs"
  - "PartialType(CreateXxxDto) for UpdateXxxDto — no individual @IsOptional() needed"
  - "Program existence check via findUnique before write operations in service"

requirements-completed: [GUID-03, GUID-06]

duration: 12min
completed: 2026-04-30
---

# Phase 03 Plan 02: DTOs and GuidanceService Summary

**class-validator DTO stack (GuidanceSectionDto, CreateGuidanceDto, UpdateGuidanceDto) and GuidanceService with atomic upsert and per-key patch operations via Prisma $transaction**

## Performance

- **Duration:** 12 min
- **Started:** 2026-04-30T20:13:11Z
- **Completed:** 2026-04-30T20:25:00Z
- **Tasks:** 2
- **Files modified:** 4

## Accomplishments

- Three DTO files validated with class-validator/class-transformer: GuidanceSectionDto (field-level), CreateGuidanceDto (nested array), UpdateGuidanceDto (PartialType)
- GuidanceService.upsert atomically replaces all sections via $transaction callback (deleteMany + createMany)
- GuidanceService.patch merges individual sections without disturbing unchanged keys via $transaction array form
- mapSection() strips DB-internal fields — only {key, title, body, order} exposed in API responses (T-03-06 mitigated)
- TypeScript build passes with 0 errors

## Task Commits

Each task was committed atomically:

1. **Task 1: Create GuidanceSectionDto, CreateGuidanceDto, and UpdateGuidanceDto** - `7e1e787` (feat)
2. **Task 2: Create GuidanceService** - `e45bef0` (feat)

## Files Created/Modified

- `src/modules/guidance/dto/guidance-section.dto.ts` - GuidanceSectionDto with @IsString/@IsNotEmpty on key/title/body and @IsInt on order
- `src/modules/guidance/dto/create-guidance.dto.ts` - CreateGuidanceDto with @ValidateNested({ each: true }) + @Type(() => GuidanceSectionDto) on sections array
- `src/modules/guidance/dto/update-guidance.dto.ts` - UpdateGuidanceDto extends PartialType(CreateGuidanceDto) for PATCH support
- `src/modules/guidance/guidance.service.ts` - GuidanceService with findByProgramOid, upsert, patch, and private mapSection

## Decisions Made

- upsert() uses the callback form of $transaction (not the array form) because it requires two sequential dependent operations: deleteMany must complete before createMany can run. The array form only supports a static array of independent promises.
- patch() uses the array form of $transaction because each section upsert is independent — no dependency ordering needed, and the array form is simpler and more performant for parallel operations.
- findByProgramOid() returns an empty array (not NotFoundException) when a program has no sections, since a program may legitimately have zero guidance entries.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- All DTOs and GuidanceService are ready for controller layer (Plan 03)
- PrismaModule is @Global() — GuidanceModule will not need to import PrismaModule separately
- GuidanceService must be added to GuidanceModule providers when the module is created in Plan 03

## Self-Check: PASSED

- FOUND: src/modules/guidance/dto/guidance-section.dto.ts
- FOUND: src/modules/guidance/dto/create-guidance.dto.ts
- FOUND: src/modules/guidance/dto/update-guidance.dto.ts
- FOUND: src/modules/guidance/guidance.service.ts
- FOUND commit: 7e1e787 (Task 1)
- FOUND commit: e45bef0 (Task 2)

---
*Phase: 03-guidance-content*
*Completed: 2026-04-30*
