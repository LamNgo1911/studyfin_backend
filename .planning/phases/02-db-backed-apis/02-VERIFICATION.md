---
status: PASS
phase: "02"
verified: "2026-04-28"
criteria:
  - id: SC-1
    description: GET /programs/:oid serves from local DB (no Opintopolku call)
    result: PASS
    evidence: >
      programs.service.ts:6 — `constructor(private readonly prisma: PrismaService)` injects PrismaService.
      Line 34 — `this.prisma.program.findUnique({ where: { oid } })` queries local DB.
      Line 42 — `throw new NotFoundException(...)` thrown for missing records.
      Grep for `OPINTOPOLKU_BASE|HttpService|firstValueFrom` in programs.service.ts: no matches.
      programs.module.ts:6 — `imports: []` (empty). HttpModule completely absent.
      programs.spec.ts has 5 it() blocks covering findAll (paginated list, pagination math, empty DB) and findOne (full detail, NotFoundException).
      All 68 tests pass (npm run test). Build succeeds.
  - id: SC-2
    description: GET /universities/:oid serves from local DB (no Opintopolku call)
    result: PASS
    evidence: >
      universities.service.ts:6 — `constructor(private readonly prisma: PrismaService)` injects PrismaService.
      Line 30 — `this.prisma.university.findUnique({ where: { oid }, include: { locations: true } })` queries local DB.
      Lines 34-35 — `throw new NotFoundException(...)` thrown for missing records.
      Grep for `OPINTOPOLKU_BASE|HttpService|firstValueFrom` in universities.service.ts: no matches.
      universities.module.ts:6 — `imports: []` (empty). HttpModule completely absent.
      universities.spec.ts has 7 it() blocks covering findAll, findOne, findPrograms, and NotFoundException paths.
      All 68 tests pass (npm run test). Build succeeds.
  - id: SC-3
    description: Concurrent sync jobs don't corrupt upsert results (mutex prevents overlap)
    result: PASS
    evidence: >
      sync.service.ts:15 — `private isSyncing = false;` class field declared.
      Lines 28-45 — syncAll() checks `if (this.isSyncing)` at line 29 and returns `{ institutions: 0, programs: 0 }` immediately, logs warning at line 30.
      Line 33 — `this.isSyncing = true` acquires lock before any work.
      Lines 42-44 — `finally { this.isSyncing = false; }` always releases lock, even on error.
      sync.spec.ts lines 72-82 — test sets `(service as any).isSyncing = true`, calls syncAll(), verifies result is `{institutions:0, programs:0}` and `httpService.get.not.toHaveBeenCalled()`.
      All 68 tests pass. Build succeeds.
      Note: in-process mutex only (T-02-09 threat accepted in plan; distributed lock deferred to future).
  - id: SC-4
    description: Location update is atomic during sync (delete+create in $transaction)
    result: PASS
    evidence: >
      sync.service.ts:163 — `await this.prisma.$transaction([` wraps the location delete+create.
      Lines 163-177 — transaction array contains:
        1. `this.prisma.universityLocation.deleteMany({ where: { universityId: university.id } })`
        2. `this.prisma.universityLocation.createMany({ data: [...], skipDuplicates: true })`
      Both operations are in the same database transaction — if create fails, delete is rolled back.
      sync.spec.ts lines 86-126 — test verifies `prisma.$transaction` was called with an array (array form confirms atomicity), not the callback form.
      All 68 tests pass. Build succeeds.
requirements_validated:
  - DATA-01  # ProgramsService uses PrismaService, not HttpService
  - DATA-02  # UniversitiesService uses PrismaService, not HttpService
  - DATA-03  # HttpModule removed from ProgramsModule and UniversitiesModule
  - DATA-04  # SyncService wraps location delete/recreate in prisma.$transaction()
  - DATA-05  # SyncService has mutex flag (isSyncing) preventing concurrent sync runs
---

# Phase 02: DB-Backed APIs — Verification Report

**Phase Goal:** All program and institution data is served from local PostgreSQL with no live calls to Opintopolku.

**Verified:** 2026-04-28
**Status:** PASS
**Test suite:** 68/68 tests passing (npm run test)
**Build:** Clean (npm run build)

---

## Goal Achievement

### Observable Truths

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | `GET /programs/:oid` returns program from local DB | PASS | `programs.service.ts:34` — `prisma.program.findUnique`. No Opintopolku references anywhere in the file. |
| 2 | `GET /universities/:oid` returns institution from local DB | PASS | `universities.service.ts:30` — `prisma.university.findUnique`. No Opintopolku references anywhere in the file. |
| 3 | Concurrent sync jobs don't corrupt upsert results | PASS | `sync.service.ts:15,29-44` — `isSyncing` mutex with try/finally. |
| 4 | Location update is atomic during sync | PASS | `sync.service.ts:163` — `prisma.$transaction([deleteMany, createMany])`. |

**Score:** 4/4 truths verified.

---

## Criterion SC-1 Detail: ProgramsService serves from local DB

**What was planned (02-01-PLAN.md):**
Rewrite ProgramsService to replace HttpService/Opintopolku calls with PrismaService queries. Remove HttpModule from ProgramsModule.

**What was found in the codebase:**

`src/modules/programs/programs.service.ts` — fully replaced:
- Line 2: `import { PrismaService } from '../../providers/prisma.service'` — PrismaService injected
- Line 6: `constructor(private readonly prisma: PrismaService)` — dependency injection
- Lines 12-23: `findAll()` uses `this.prisma.$transaction([program.count(), program.findMany(...)])` — paginated DB query
- Lines 34-44: `findOne()` uses `this.prisma.program.findUnique({ where: { oid } })` — single-record DB query
- Line 42: `throw new NotFoundException(...)` for unknown OIDs
- `mapProgram()` (line 46) and `mapProgramDetail()` (line 64) return structured response shapes
- Grep confirms zero occurrences of `OPINTOPOLKU_BASE`, `HttpService`, or `firstValueFrom` in this file

`src/modules/programs/programs.module.ts` — cleaned:
- `imports: []` — HttpModule completely absent
- No `@nestjs/axios` import anywhere in the file

`src/modules/programs/programs.spec.ts` — 5 test cases:
- `findAll()` — paginated list with `total`, `page`, `size`, `hits`, providers shape
- `findAll()` — pagination math (page=2, size=10 → skip=20, take=10)
- `findAll()` — empty DB returns `{ hits: [] }`, no exception
- `findOne()` — full detail including `implementations` and `universities`
- `findOne()` — throws `NotFoundException` with exact message for unknown OID

---

## Criterion SC-2 Detail: UniversitiesService serves from local DB

**What was planned (02-02-PLAN.md):**
Rewrite UniversitiesService to replace HttpService/Opintopolku calls with PrismaService queries. Remove HttpModule from UniversitiesModule.

**What was found in the codebase:**

`src/modules/universities/universities.service.ts` — fully replaced:
- Line 2: `import { PrismaService }` — PrismaService injected
- Line 6: `constructor(private readonly prisma: PrismaService)` — dependency injection
- Lines 12-27: `findAll()` uses `$transaction([university.count(), university.findMany(...)])` with `include: { locations: true }`
- Lines 30-37: `findOne()` uses `prisma.university.findUnique` with `include: { locations: true }`
- Lines 39-73: `findPrograms()` uses `prisma.university.findUnique` first to resolve OID→id, then `$transaction` with `program.count(...)` and `program.findMany(...)` filtered by `universities: { some: { universityId } }` — the join table is used correctly
- Lines 34-35, 48-49: `NotFoundException` thrown for unknown OIDs
- `mapUniversity()`, `mapDetailedUniversity()`, `mapProgram()` private methods return structured shapes
- Grep confirms zero occurrences of `OPINTOPOLKU_BASE`, `HttpService`, or `firstValueFrom`

`src/modules/universities/universities.module.ts` — cleaned:
- `imports: []` — HttpModule completely absent

`src/modules/universities/universities.spec.ts` — 7 test cases covering findAll (3), findOne (2), findPrograms (2).

---

## Criterion SC-3 Detail: Concurrent sync jobs don't corrupt results

**What was planned (02-03-PLAN.md):**
Add `private isSyncing = false` mutex flag to prevent concurrent sync runs. Second call returns early with `{ institutions: 0, programs: 0 }`.

**What was found in the codebase:**

`sync.service.ts`:
- Line 15: `private isSyncing = false;` — class field
- Lines 28-45: `syncAll()` method body:
  ```typescript
  if (this.isSyncing) {
    this.logger.warn('Sync already in progress — skipping concurrent run');
    return { institutions: 0, programs: 0 };
  }
  this.isSyncing = true;
  try {
    // ...sync work...
    return { institutions: institutionCount, programs: programCount };
  } finally {
    this.isSyncing = false;
  }
  ```
- Lock is acquired before any work, released in `finally` (guaranteed even on exceptions)

`sync.spec.ts` lines 72-82:
```typescript
it('returns early with zeros when called while another sync is running', async () => {
  (service as any).isSyncing = true;
  const result = await service.syncAll();
  expect(result.institutions).toBe(0);
  expect(result.programs).toBe(0);
  expect(httpService.get).not.toHaveBeenCalled();
});
```

**Caveat (documented in plan threat model T-02-09):** This is an in-process mutex only. Multiple simultaneous instances of the NestJS application would not share this flag. Distributed locking (e.g., Redis-based) is deferred to a future phase. For single-instance deployment this is sufficient.

---

## Criterion SC-4 Detail: Location update is atomic

**What was planned (02-03-PLAN.md):**
Wrap location delete+recreate in `prisma.$transaction([...])` to ensure locations are never left empty during a sync run.

**What was found in the codebase:**

`sync.service.ts` lines 157-179 (within `upsertInstitution`):
```typescript
if (locations.length > 0) {
  const university = await this.prisma.university.findUnique({
    where: { oid },
    select: { id: true },
  });
  if (university) {
    await this.prisma.$transaction([
      this.prisma.universityLocation.deleteMany({
        where: { universityId: university.id },
      }),
      this.prisma.universityLocation.createMany({
        data: locations
          .filter((l) => l.code)
          .map((l) => ({
            universityId: university.id,
            code: l.code,
            name: l.name,
          })),
        skipDuplicates: true,
      }),
    ]);
  }
}
```

- The two Prisma calls are wrapped in a single `$transaction([...])` — they execute atomically
- If `createMany` fails, the `deleteMany` is rolled back, leaving existing locations intact
- `sync.spec.ts` lines 119-125 verify the transaction was called with an array form (not the callback form), confirming atomic semantics

---

## Requirements Coverage

| Requirement | Description | Status | Evidence |
|-------------|-------------|--------|----------|
| DATA-01 | ProgramsService uses PrismaService instead of HttpService | SATISFIED | `programs.service.ts` imports only `PrismaService`. No Opintopolku calls. |
| DATA-02 | UniversitiesService uses PrismaService instead of HttpService | SATISFIED | `universities.service.ts` imports only `PrismaService`. No Opintopolku calls. |
| DATA-03 | HttpModule removed from ProgramsModule and UniversitiesModule | SATISFIED | Both modules have `imports: []`. Grep for `HttpModule` in both files returns nothing. |
| DATA-04 | SyncService wraps location delete/recreate in `prisma.$transaction()` | SATISFIED | `sync.service.ts:163` — `$transaction([deleteMany, createMany])` confirmed. |
| DATA-05 | SyncService has mutex flag preventing concurrent sync runs | SATISFIED | `sync.service.ts:15` — `private isSyncing = false`. Lines 29, 33, 43 implement guard + try/finally. |

---

## Anti-Pattern Scan

| File | Pattern Searched | Result |
|------|-----------------|--------|
| `programs.service.ts` | `TODO\|FIXME\|placeholder\|coming soon` | No matches |
| `universities.service.ts` | `TODO\|FIXME\|placeholder\|coming soon` | No matches |
| `sync.service.ts` | `TODO\|FIXME\|placeholder\|coming soon` | No matches |
| `programs.service.ts` | `OPINTOPOLKU_BASE\|HttpService\|firstValueFrom` | No matches |
| `universities.service.ts` | `OPINTOPOLKU_BASE\|HttpService\|firstValueFrom` | No matches |
| `programs.module.ts` | `HttpModule\|@nestjs/axios` | No matches |
| `universities.module.ts` | `HttpModule\|@nestjs/axios` | No matches |
| `sync.service.ts` | `HttpService` (retained intentionally) | Present — `private readonly httpService: HttpService` at line 18 — correct, SyncService still reads from Opintopolku to seed the DB |

No anti-patterns or stub indicators found.

---

## Test Summary

All 68 unit tests across 9 test suites pass. Phase-2-specific tests:

| Spec File | Test Cases | Coverage |
|-----------|-----------|---------|
| `programs.spec.ts` | 5 `it()` blocks | findAll pagination, empty DB, findOne detail + 404 |
| `universities.spec.ts` | 7 `it()` blocks | findAll, findOne, findPrograms + 404 paths |
| `sync.spec.ts` | 3 `it()` blocks | mutex early-return, mutex blocking HTTP calls, $transaction wrapping |

---

_Verified: 2026-04-28_
_Verifier: Claude (gsd-verifier)_
