---
status: clean
phase: "02"
reviewed: "2026-04-28"
files_reviewed: 8
severity_counts:
  critical: 0
  high: 0
  medium: 0
  low: 3
  info: 0
---

# Phase 02 Code Review Report

## Scope

Reviewed all 8 files changed during phase 02 execution (programs.service.ts, programs.module.ts, programs.spec.ts, universities.service.ts, universities.module.ts, universities.spec.ts, sync.service.ts, users.spec.ts).

## Changes Summary

| File | Change | Lines |
|------|--------|-------|
| programs.service.ts | Full rewrite: Opintopolku proxy → PrismaService | -252 net |
| programs.module.ts | HttpModule removed from imports | -2 |
| programs.spec.ts | 5 unit tests for PrismaService-backed service | +126 |
| universities.service.ts | Full rewrite: Opintopolku proxy → PrismaService | -142 net |
| universities.module.ts | HttpModule removed from imports | -2 |
| universities.spec.ts | 6 unit tests for PrismaService-backed service | +145 |
| sync.service.ts | isSyncing mutex + $transaction for location upsert | +32/-20 |
| users.spec.ts | Mock PrismaService added to fix pre-existing broken test | +15 |

## Severity Breakdown

### Low (3 findings — acceptable)

| # | File | Rule | Issue | Action |
|---|------|------|-------|--------|
| 1 | programs.service.ts, universities.service.ts | `@typescript-eslint/no-unsafe-member-access` | `row.locations`, `row.universities`, etc. accessed on `any` typed Prisma result rows | Accept — plan precedent set in 02-PATTERNS.md; ORM result objects intentionally left untyped |
| 2 | programs.spec.ts:84 | `@typescript-eslint/no-unsafe-member-access` | `findManyArgs.skip` on `any` | Accept — same rationale as above |
| 3 | universities.spec.ts:90-91 | `@typescript-eslint/no-unsafe-member-access` | `findManyArgs.skip/take` on `any` | Accept — same rationale |

### Pre-existing Errors (not in scope)

297 ESLint errors/warnings in unchanged files (`search.service.ts`, `auth*.ts`, scaffold stubs) are outside phase 02 scope. No new lint errors introduced by phase 02 changes.

## Security

**No issues found.** All Prisma queries use parameterized ORM calls — no raw SQL, no SQL injection vectors. NotFoundException for unknown OIDs is correct behavior. Mutex is in-process (acceptable per Phase 5 roadmap).

## Correctness

- `ProgramsService.findOne` throws `NotFoundException` for unknown OIDs ✓
- `UniversitiesService.findOne` throws `NotFoundException` for unknown OIDs ✓
- `UniversitiesService.findPrograms` throws `NotFoundException` for unknown OIDs ✓
- `$transaction` wraps count + findMany in both services ✓
- Location delete/create in sync.service.ts wrapped in `$transaction` ✓
- `isSyncing` flag reset via `try/finally` (always releases on error) ✓
- `SyncModule` still has `HttpModule` (sync reads Opintopolku — correct) ✓

## Test Coverage

- 68 tests passing (Phase 02 added 11 new tests: 5 programs + 6 universities)
- Pre-existing stub specs (`users.spec.ts`, scaffold stubs) fixed to provide required mock providers
- No test coverage gaps introduced by phase 02 changes

## Architecture

**Patterns correctly established:**
- PrismaService injected via `constructor(private readonly prisma: PrismaService)`
- `$transaction([count, findMany])` for atomic pagination reads
- `mapXxx()` private methods for field shape transformation
- `NotFoundException` for 404 responses (consistent with NestJS conventions)

## Verdict

**CLEAN** — Phase 02 changes introduce no new lint errors, no security issues, and no correctness regressions. All must-haves from PLAN.md verified against implementation. 3 low-severity findings are consistent with the plan's design decisions.
