---
phase: 02-db-backed-apis
plan: 02
subsystem: universities
tags: [db-backed, prisma, migration]

key-files:
  created:
    - src/modules/universities/universities.spec.ts (6 unit tests)
  modified:
    - src/modules/universities/universities.service.ts (PrismaService-backed)
    - src/modules/universities/universities.module.ts (HttpModule removed)

decisions:
  - "findAll/findPrograms use $transaction for count + findMany atomicity"
  - "findPrograms resolves university OID to DB id first, then queries ProgramUniversity join"
  - "_lng parameter accepted but unused — DB stores English strings; preserves controller contract"

patterns-established:
  - "PrismaService injection pattern: constructor private readonly prisma: PrismaService"
  - "$transaction array form for read atomicity"
  - "NotFoundException on unknown OID (consistent with ProgramsService)"

requirements-completed: [DATA-02, DATA-03]

tech-stack:
  added: []
  patterns: [PrismaService, $transaction, NotFoundException]

duration: 18min (inline recovery)
completed: 2026-04-28
---

# Phase 02 Plan 02: UniversitiesService → PostgreSQL — Summary

## What Was Built

Rewrote `UniversitiesService` to serve all institution data from local PostgreSQL via `PrismaService`, and removed `HttpModule` from `UniversitiesModule`.

**DATA-02 / DATA-03 complete.**

### Task 1 — UniversitiesService PrismaService rewrite (TDD)

`findAll(query)` — `$transaction([count, findMany])` with offset pagination. Returns D-03 field shape:
`oid, name, description, logoUrl, type, municipality, studentCount, locations[{code, name}]`.

`findOne(oid, _lng)` — `findUnique` with `include: { locations: true }`. Throws `NotFoundException` for unknown OIDs. Returns D-04 shape (adds `website`, `email`).

`findPrograms(oid, query)` — resolves OID to DB `id` first, then `$transaction([count, findMany])` filtered via `ProgramUniversity` join. Same D-05 list shape as `ProgramsService`. Throws `NotFoundException` for unknown university OID.

6 unit tests: findAll field shape, empty DB, pagination skip/take, findOne detail + 404, findPrograms shape + 404.

### Task 2 — HttpModule removed

`UniversitiesModule` now has `imports: []`. `SyncModule` retains `HttpModule` (sync still reads Opintopolku).

## Deviations from Plan

None — plan executed exactly as specified.

## Acceptance Criteria — All Met

| Criterion | Status |
|-----------|--------|
| No `HttpService` / `firstValueFrom` / `OPINTOPOLKU_BASE` in service | PASS |
| `this.prisma.university.findMany` present | PASS |
| `this.prisma.university.findUnique` present | PASS |
| `throw new NotFoundException` present | PASS |
| `private readonly prisma: PrismaService` injection | PASS |
| `this.prisma.program.findMany` in findPrograms | PASS |
| universities.spec.ts has ≥ 5 `it(` blocks (has 6) | PASS |
| `npm run test -- --testPathPattern=universities.spec` — 6 passed | PASS |
| universities.module.ts has no `HttpModule` | PASS |
| `npm run build` exits 0 | PASS |

## Commits

| Hash | Type | Message |
|------|------|---------|
| `205af68` | feat | rewrite UniversitiesService with PrismaService, remove HttpModule |

## Issues Encountered

Plan 02-02 was executed inline as recovery after the parallel worktree agent silently failed (reported completion but committed no changes). No file state or commits were produced by the original agent. Executed inline in orchestrator context.

## Threat Surface

T-02-05 (NaN from `Number(undefined)`) mitigated by `?? 20`/`?? 0` defaults before `Number()`. T-02-06 and T-02-07 in `accept` disposition per plan threat model.

## Next Phase Readiness

All phase 02 requirements complete. Phase ready for verification.

---
*Phase: 02-db-backed-apis*
*Completed: 2026-04-28*
