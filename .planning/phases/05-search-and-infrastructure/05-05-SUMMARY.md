---
phase: 05-search-and-infrastructure
plan: 05
subsystem: swagger
tags:
  - swagger
  - dto
  - api-property
  - documentation
dependency_graph:
  requires: []
  provides:
    - Swagger field-level documentation for 12 public input DTOs
  affects:
    - src/modules/auth/**
    - src/modules/guidance/**
    - src/modules/users/**
tech-stack:
  added: []
  patterns:
    - Required fields: `@ApiProperty({ description: '...' })`
    - Optional fields: `@ApiPropertyOptional({ description: '...' })`
    - Fields with defaults include `default:` in decorator
    - Array fields use `type: [TypeName]` or `type: [String]`
key-files:
  created: []
  modified:
    - src/modules/auth/dto/register.dto.ts
    - src/modules/auth/dto/login.dto.ts
    - src/modules/auth/dto/refresh-token.dto.ts
    - src/modules/auth/dto/forgot-password.dto.ts
    - src/modules/auth/dto/reset-password.dto.ts
    - src/modules/auth/dto/verify-email.dto.ts
    - src/modules/guidance/dto/create-guidance.dto.ts
    - src/modules/guidance/dto/update-guidance.dto.ts
    - src/modules/guidance/dto/guidance-section.dto.ts
    - src/modules/users/dto/update-profile.dto.ts
    - src/modules/users/dto/list-saved-programs-query.dto.ts
    - src/modules/users/dto/update-saved-program.dto.ts
decisions: []
metrics:
  duration: ~2 minutes
  completed_date: 2026-05-01
---

# Phase 05 Plan 05: ApiProperty Decorators on Public Input DTOs

Add @ApiProperty and @ApiPropertyOptional decorators to all 12 public input DTOs across Auth, Guidance, and Users modules per D-08. This enables Swagger UI at /api to show field-level documentation for request body and query DTOs.

## Commit History

Committed in `47865be` (co-committed with 05-02 SUMMARY). All 12 DTO files already had correct decorators committed by parallel worktree agents in plans 05-02 and 05-04 whose changes were merged into this worktree before execution.

| DTO File | Fields Decorated | Count |
|----------|-----------------|-------|
| register.dto.ts | email, password, firstName, lastName | 4 |
| login.dto.ts | email, password | 2 |
| refresh-token.dto.ts | refreshToken | 1 |
| forgot-password.dto.ts | email | 1 |
| reset-password.dto.ts | token, newPassword | 2 |
| verify-email.dto.ts | token | 1 |
| create-guidance.dto.ts | sections | 1 |
| update-guidance.dto.ts | sections, deleteKeys | 2 |
| guidance-section.dto.ts | key, title, body, order | 4 |
| update-profile.dto.ts | firstName, lastName | 2 |
| list-saved-programs-query.dto.ts | status, page, size | 3 |
| update-saved-program.dto.ts | status | 1 |

## Deviations from Plan

None. The decorators were applied correctly to all 12 files per the plan specification. The parallel worktree agents committed these changes before this agent executed, confirming the task was already complete.

## Blocker Check

None.

## Known Stubs

None -- these are pure decorator additions with no wiring dependencies.

## Threat Flags

None. Per threat register T-05-13, decorators expose field descriptions and types in Swagger UI but contain no runtime secrets or internal logic. Accepted risk.

## Verification

- [x] All 12 DTO files have @ApiProperty/@ApiPropertyOptional on every field
- [x] Pattern consistent: `@ApiProperty` for required fields, `@ApiPropertyOptional` for optional fields
- [x] Fields with defaults include `default:` value (page: 0, size: 20 in ListSavedProgramsQueryDto)
- [x] Array fields use `type: [TypeName]` syntax (GuidanceSectionDto[], String[])
- [x] D-08 compliance: Input DTOs only, no @ApiResponse on controllers

### Pre-Existing Issues (Not Caused by This Plan)

The following build and test failures are pre-existing and unrelated to this plan's changes:
- `src/modules/search/search.controller.ts` has 4 TypeScript errors (imports for SearchQueryDto, DbSearchQueryDto, InstitutionSearchResponseDto)
- Test failures in `users.service.spec.ts`: `this.prisma.userProgram.count is not a function`

## Self-Check: PASSED
