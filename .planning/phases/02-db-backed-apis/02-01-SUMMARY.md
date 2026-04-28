---
phase: 02-db-backed-apis
plan: 01
subsystem: programs
tags: [db-backed, prisma, migration]
dependency_graph:
  requires: []
  provides:
    - requirements: [DATA-01, DATA-03]
      description: ProgramsService reads from PostgreSQL; all reads sourced from local DB
tech_stack:
  added:
    - PrismaService injection
  patterns:
    - $transaction([count, findMany]) for paginated reads
    - findUnique by oid with NotFoundException guard
    - TDD RED/GREEN cycle before commit
key_files:
  created:
    - src/modules/programs/programs.spec.ts
  modified:
    - src/modules/programs/programs.service.ts
    - src/modules/programs/programs.module.ts
decisions:
  - id: DB-backed programs
    rationale: "Retire Opintopolku live proxy for programs; serve all reads from local DB seeded by SyncService (DATA-01)"
    alternatives_considered:
      - "Keep proxy + cache layer — rejected: adds complexity and still depends on upstream availability"
  - id: TDD cycle
    rationale: "Spec written first (RED), service implemented to pass (GREEN) — catches type/contract mismatches before build"
metrics:
  duration_minutes: "< 10"
  completed: "2026-04-28"
  tasks: 2
  files: 3
---

# Phase 02 Plan 01: DB-Backed ProgramsService Summary

Rewrote ProgramsService to serve all data from local PostgreSQL via PrismaService and removed HttpModule from ProgramsModule.

## What Was Built

**Task 1 — Rewrite ProgramsService to use PrismaService (TDD cycle)**

`src/modules/programs/programs.service.ts` is a full replacement:

- Dropped: `HttpService`, `firstValueFrom`, `OPINTOPOLKU_BASE`, all upstream proxy logic
- Added: `PrismaService` constructor injection; all reads via Prisma ORM
- `findAll(query)`: `$transaction([program.count(), program.findMany()])` with offset pagination; maps to D-01 shape — `oid, name, type, isDegree, imageUrl, fieldOfStudy, creditsAmount, creditsUnit, teachingLanguages, providers[{oid, name}]`
- `findOne(oid)`: `program.findUnique()` with universities join; throws `NotFoundException("Program not found: {oid}")` for unknown OIDs; maps to D-02 shape — adds `description, typePath, eqfLevel, nqfLevel, degreeTitles, implementations (Json), universities[{oid, name}]`
- `findAll` with empty DB returns `{ total: 0, page: 0, size: 20, hits: [] }` — no exception
- `findOne` with unknown OID throws `NotFoundException` — no generic 500

`src/modules/programs/programs.spec.ts` (5 tests, all passing):

| Test | What it verifies |
|------|-----------------|
| `findAll()` — paginated hits from DB | `$transaction` resolves to `[1, [row]]`, result has `total: 1`, hits[0].oid, hits[0].providers[0].oid |
| `findAll()` pagination | `page=2, size=10` → Prisma `skip: 20, take: 10` |
| `findAll()` empty DB | Returns `{ total: 0, hits: [] }` — no exception |
| `findOne()` found | Full D-02 shape including `implementations`, `universities`, `eqfLevel` |
| `findOne()` not found | Throws `NotFoundException` with `Program not found: unknown-oid` |

**Task 2 — Remove HttpModule from ProgramsModule**

`src/modules/programs/programs.module.ts`: `imports: []` — no `@nestjs/axios`, no `HttpModule`. `SyncModule` remains untouched.

## Verification Results

| Check | Result |
|-------|--------|
| No `OPINTOPOLKU_BASE`, `HttpService`, `firstValueFrom` in service | PASS |
| `PrismaService` injection present (import + constructor) | PASS |
| No `HttpModule` / `@nestjs/axios` in ProgramsModule | PASS |
| `SyncModule` still has `HttpModule` (untouched) | PASS |
| 5 unit tests in `programs.spec.ts` | PASS |
| `npm run build` exits 0 | PASS |

## Deviations from Plan

**Auto-fixed: TDD pagination test mock**
- **Found during:** Task 1 GREEN phase
- **Issue:** Initial pagination test used `mockResolvedValue` on `$transaction`, which did not populate `findMany.mock.calls` — the test couldn't inspect Prisma query args
- **Fix:** Changed mock to `mockImplementation(async (ops) => { const results = await Promise.all(ops); return results; })` with explicit `count` and `findMany` mock setup, allowing `findMany.mock.calls[0][0]` to expose skip/take
- **Files:** `src/modules/programs/programs.spec.ts`
- **Commit:** `e88cf0a`

## Threat Surface

No new threat surface introduced. T-02-01 (NaN pagination from `Number(undefined)`) is mitigated by `?? 0` / `?? 20` defaults before `Number()` coercion. T-02-02 and T-02-03 remain in `accept` disposition per the plan threat model — size unbounded and OID in 404 are acceptable for v1.

## Self-Check: PASSED

All files created, all 3 commits found, no missing items.
