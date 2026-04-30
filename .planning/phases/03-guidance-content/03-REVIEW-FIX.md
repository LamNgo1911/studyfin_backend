---
phase: 03-guidance-content
review_source: 03-REVIEW.md
fixed_at: 2026-05-01T00:00:00Z
findings_total: 10
findings_fixed: 7
findings_skipped: 1
findings_deferred: 2
test_result: 76 passed, 0 failed
---

# Phase 03: Code Review Fix Report

**Source:** `03-REVIEW.md` (standard depth, 11 files)
**Fixed:** 2026-05-01
**Test result:** 76 passed, 0 failed (10 suites)

---

## Fixes Applied

### CR-01 [CRITICAL] — RolesGuard DI resolution failure
**Commit:** `a57a78b`
**File:** `src/modules/guidance/guidance.module.ts`
**Action:** Added `RolesGuard` and `Reflector` (from `@nestjs/core`) as providers in `GuidanceModule` so NestJS can resolve the guard's constructor dependency. Chose module-level registration (Option A) over global registration to keep the guard scoped to guidance routes only.

### CR-02 [CRITICAL] — Hardcoded JWT fallback secret
**Commit:** `20d3e03`
**File:** `src/modules/auth/auth.module.ts`
**Action:** Replaced `process.env.JWT_SECRET || 'fallback-secret-change-in-production'` with a fail-fast `throw new Error('JWT_SECRET environment variable is required')` when the env var is absent. Prevents silent deployment with a known secret. Test commands now require `JWT_SECRET=test-secret` prefix.

### CR-03 [CRITICAL] — FK on `Program.oid` instead of `Program.id`
**Action:** SKIPPED — intentional design decision. The `oid` (Opintopolku OID) is the stable business identifier used across the entire API surface. Switching to surrogate `id` would require a lookup indirection in every guidance endpoint and break the URL contract (`/guidance/:programOid`). The sync pipeline is designed to never reassign OIDs for existing programs. Added no code comment since this is a schema-level architectural choice documented here.

### CR-04 [CRITICAL] — NaN pagination parameters
**Commit:** `6fbca49`
**Files:** `src/modules/programs/programs.service.ts`, `src/modules/universities/universities.service.ts`
**Action:** Replaced `Number(query.size ?? 20)` pattern with `Number.isFinite()` guard in all three pagination sites (programs `findAll`, universities `findAll`, universities `findPrograms`). Non-numeric strings now fall back to defaults (size=20, page=0) instead of producing NaN.

### WR-01 [WARNING] — Silent no-op on empty PATCH sections
**Commit:** `2c4635e`
**File:** `src/modules/guidance/guidance.service.ts`
**Action:** Added explicit `BadRequestException` when `dto.sections` is undefined or empty in `patch()`. Callers now get a clear 400 response instead of a misleading 200 with unchanged data.

### WR-02 [WARNING] — findMany outside transaction in upsert()
**Commit:** `2c4635e`
**File:** `src/modules/guidance/guidance.service.ts`
**Action:** Moved the final `findMany` call inside the `$transaction` callback so the read shares the same snapshot as the delete+create operations, eliminating the TOCTOU window.

### WR-03 [WARNING] — Missing @Min(0) on order field
**Commit:** `2c4635e`
**File:** `src/modules/guidance/dto/guidance-section.dto.ts`
**Action:** Added `@Min(0)` decorator to the `order` field alongside existing `@IsInt()`. Negative order values are now rejected at validation time.

### WR-04 [WARNING] — GET returns 200 [] for non-existent program
**Commit:** `2c4635e`
**File:** `src/modules/guidance/guidance.service.ts`
**Action:** Added program existence check (`findUnique` on `Program`) at the start of `findByProgramOid()`. Non-existent program OIDs now return 404 instead of 200 with an empty array.

### Test update
**Commit:** `ddc37f0`
**File:** `src/modules/guidance/guidance.spec.ts`
**Action:** Updated tests to match new behavior: all `findByProgramOid` tests now mock `prisma.program.findUnique`, added NotFoundException test for missing program, empty-sections patch test now expects `BadRequestException`.

---

## Deferred

### IN-01 [INFO] — Unnecessary `exports: [GuidanceService]`
**Reason:** Low-risk dead configuration. Will be addressed when another module imports GuidanceModule (at which point the export becomes necessary) or during a future cleanup pass.

### IN-02 [INFO] — Unused `_lng` parameter in ProgramsService.findOne
**Reason:** Placeholder for planned localisation feature. Removing it now would require re-adding it when localisation is implemented. No functional impact.

---

## Verification

```
JWT_SECRET=test-secret npm test

Test Suites: 10 passed, 10 total
Tests:       76 passed, 76 total
```

All fixes verified against passing test suite. No regressions introduced.
