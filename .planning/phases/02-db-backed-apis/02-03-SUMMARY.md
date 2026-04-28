---
phase: 02-db-backed-apis
plan: 03
subsystem: sync
tags: [data-integrity, concurrency, prisma]
dependency_graph:
  requires:
    - 02-02 (SyncService existing)
  provides:
    - sync.service.ts (mutex + $transaction)
    - sync.spec.ts (unit tests)
  affects:
    - src/modules/sync/sync.service.ts
tech_stack:
  added:
    - in-memory boolean mutex (`isSyncing` flag)
    - Prisma $transaction array form for atomic location upsert
  patterns:
    - try/finally mutex pattern (D-09)
    - prisma.$transaction atomic block (D-08)
key_files:
  created:
    - src/modules/sync/sync.spec.ts
  modified:
    - src/modules/sync/sync.service.ts
decisions:
  - "TDD applied: RED test committed first, GREEN implementation added, then fixed tests to use Observable mocks (rule: RED must fail, GREEN must pass)"
  - "In-memory mutex chosen over distributed Redis lock: v1 is single-instance, multi-instance lock deferred to Phase 5"
---

# Phase 02 Plan 03: SyncService Reliability Patches — Summary

## What Was Built

Patched `SyncService` with two targeted reliability fixes:

**DATA-05 — Mutex guard (in-memory, single-process)**
Added `private isSyncing = false` class field. `syncAll()` now checks this flag before proceeding — a second concurrent call returns `{ institutions: 0, programs: 0 }` immediately with a warning log. The flag is set to `true` at start and reset via `try/finally` so it always releases even on error.

**DATA-04 — Atomic location upsert**
Replaced two separate `await` calls (`universityLocation.deleteMany` + `createMany`) with a single `this.prisma.$transaction([...])` array operation inside `upsertInstitution()`. If `createMany` fails, the prior `deleteMany` is rolled back — no orphan empty-location state can occur.

## Deviation Notes

**Rule 1 auto-fix — Test Observable mocking:** RED-phase tests used `mockResolvedValue()` (returns Promise), but `firstValueFrom()` from RxJS requires an Observable. Fixed all HTTP mock returns to use `of()` from `rxjs` so tests correctly exercise the real `firstValueFrom()` path. No plan change needed — this is a test-only fix.

## TDD Gate Compliance

| Gate | Commit | Status |
|------|--------|--------|
| RED | `test(02-03): add failing test for mutex and transaction behavior` | 6c061f6 |
| GREEN | `feat(02-03): add mutex guard and $transaction to SyncService` | 84fbfe1 |

## Acceptance Criteria — All Met

- `private isSyncing = false` field present
- `if (this.isSyncing)` guard in `syncAll()` body
- `this.isSyncing = true` set before sync body
- `} finally { this.isSyncing = false; }` always resets flag
- `this.prisma.$transaction([` wraps location deleteMany + createMany
- `HttpService` retained (sync still reads Opintopolku)
- `sync.spec.ts` has 3 `it()` blocks
- `npm run test -- --testPathPatterns=sync.spec` — 3 passed
- `npm run build` — exits 0

## Commits

| Hash | Type | Message |
|------|------|---------|
| `6c061f6` | test | add failing test for mutex and transaction behavior |
| `84fbfe1` | feat | add mutex guard and $transaction to SyncService |

## Threat Flags

| Flag | File | Description |
|------|------|-------------|
| threat_flag: T-02-09 | sync.service.ts | In-memory mutex is single-process only; distributed Redis lock deferred to Phase 5 |

---

**Duration:** ~8 min | **Tasks:** 1 | **Files:** 2 (1 created, 1 modified)