---
phase: 01-rbac-foundation
plan: 04
subsystem: planning-docs
tags: [rbac, roles, requirements-tracking, gap-closure]

# Dependency graph
requires:
  - phase: 01-rbac-foundation
    provides: "RBAC guard, Roles decorator, JwtStrategy, cleanup script — all implementation code shipping in plans 01-01 through 01-03"
provides:
  - "ROADMAP.md corrected: SC #2 and SC #3 use @Roles('ADMIN') matching Prisma enum"
  - "REQUIREMENTS.md corrected: GUID-04 and GUID-05 use @Roles('ADMIN') matching Prisma enum"
  - "FOUND-02 formally assigned to Phase 4 in ROADMAP.md requirements list and REQUIREMENTS.md traceability table"
  - "Zero lowercase @Roles('admin') occurrences remain in planning documents"
affects:
  - "Phase 3 (Guidance Content) — admin route decorators must use @Roles('ADMIN') (uppercase); contract is now documented correctly"
  - "Phase 4 (User Features) — FOUND-02 (hasTestAccess field) is now explicitly claimed by Phase 4"

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Role string casing canonical: uppercase ADMIN and USER matching Prisma enum output — all future @Roles() decorators must use uppercase strings"

key-files:
  created:
    - ".planning/phases/01-rbac-foundation/01-04-SUMMARY.md"
  modified:
    - ".planning/ROADMAP.md"
    - ".planning/REQUIREMENTS.md"

key-decisions:
  - "Resolve role casing by updating planning docs to uppercase (ADMIN/USER), not by lowercasing the Prisma enum — keeps the implementation canonical and avoids a mapping layer"
  - "FOUND-02 moved to Phase 4 per D-02; Phase 4 requirements list now includes FOUND-02 explicitly so it cannot become orphaned again"
  - "Task 3 (DB cleanup execution) skipped at operator request (no DB available); cleanup:programs script remains correct and ready; running it is a pending operational step"

patterns-established:
  - "Planning doc casing: role strings in ROADMAP success criteria and REQUIREMENTS decorators must always match the Prisma enum value (uppercase)"

requirements-completed: [FOUND-02, FOUND-07]

# Metrics
duration: checkpoint-resumed
completed: 2026-04-28
---

# Phase 01 Plan 04: Gap Closure Summary

**Corrected @Roles casing in ROADMAP.md and REQUIREMENTS.md to match ADMIN/USER Prisma enum, and formally moved FOUND-02 from Phase 1 to Phase 4 ownership**

## Performance

- **Duration:** Resumed from human-action checkpoint (Task 3 skipped — no DB available)
- **Started:** 2026-04-28 (checkpoint resumed)
- **Completed:** 2026-04-28
- **Tasks:** 2/3 completed (Task 3 skipped by operator)
- **Files modified:** 2 (.planning/ROADMAP.md, .planning/REQUIREMENTS.md)

## Accomplishments

- Closed Gap 1: corrected role casing in ROADMAP.md SC #2 and #3 and REQUIREMENTS.md GUID-04 and GUID-05 from lowercase 'admin' to uppercase 'ADMIN', matching the Prisma enum and guard implementation
- Closed Gap 2: formally reassigned FOUND-02 from Phase 1 to Phase 4 in both ROADMAP.md requirements list and REQUIREMENTS.md traceability table — requirement is no longer orphaned
- Gap 3 (DB cleanup execution): deferred — operator has no DB available; cleanup:programs script is correct and ready; this remains a pending operational step

## Task Commits

1. **Task 1: Fix role casing and FOUND-02 phase assignment in ROADMAP.md** - `9e1bfae` (docs)
2. **Task 2: Fix role casing and FOUND-02 phase assignment in REQUIREMENTS.md** - `9e1bfae` (docs)
3. **Task 3: Run cleanup:programs against live database** — SKIPPED (no DB available; operational step deferred)

Tasks 1 and 2 were committed together in a single commit `9e1bfae` before the checkpoint was reached.

## Files Created/Modified

- `.planning/ROADMAP.md` — corrected three items:
  1. SC #2: `@Roles('admin')` → `@Roles('ADMIN')` and role `"user"` → role `"USER"`
  2. SC #3: `@Roles('admin')` → `@Roles('ADMIN')` and role `"admin"` → role `"ADMIN"`
  3. Phase 1 requirements: removed FOUND-02; Phase 4 requirements: added FOUND-02 at front of list
- `.planning/REQUIREMENTS.md` — corrected three items:
  1. GUID-04: `@Roles('admin')` → `@Roles('ADMIN')`
  2. GUID-05: `@Roles('admin')` → `@Roles('ADMIN')`
  3. Traceability table row for FOUND-02: Phase 1 → Phase 4

## Exact Before/After Changes

### ROADMAP.md

**SC #2 (line 29):**
- Before: `  2. A route decorated with \`@Roles('admin')\` returns 403 when called by a user with role "user"`
- After:  `  2. A route decorated with \`@Roles('ADMIN')\` returns 403 when called by a user with role "USER"`

**SC #3 (line 30):**
- Before: `  3. A route decorated with \`@Roles('admin')\` returns 200 when called by a user with role "admin"`
- After:  `  3. A route decorated with \`@Roles('ADMIN')\` returns 200 when called by a user with role "ADMIN"`

**Phase 1 Requirements line (line 26):**
- Before: `**Requirements**: FOUND-01, FOUND-02, FOUND-03, FOUND-04, FOUND-05, FOUND-06, FOUND-07`
- After:  `**Requirements**: FOUND-01, FOUND-03, FOUND-04, FOUND-05, FOUND-06, FOUND-07`

**Phase 4 Requirements line (line 66):**
- Before: `**Requirements**: USER-01, USER-02, USER-03, USER-04, USER-05, USER-06, USER-07, USER-08, USER-09`
- After:  `**Requirements**: FOUND-02, USER-01, USER-02, USER-03, USER-04, USER-05, USER-06, USER-07, USER-08, USER-09`

### REQUIREMENTS.md

**GUID-04 (line 38):**
- Before: `- [ ] **GUID-04**: \`GuidanceModule\` has admin \`POST /guidance/:programOid\` guarded by \`@UseGuards(JwtAuthGuard, RolesGuard) @Roles('admin')\``
- After:  `- [ ] **GUID-04**: \`GuidanceModule\` has admin \`POST /guidance/:programOid\` guarded by \`@UseGuards(JwtAuthGuard, RolesGuard) @Roles('ADMIN')\``

**GUID-05 (line 39):**
- Before: `- [ ] **GUID-05**: \`GuidanceModule\` has admin \`PATCH /guidance/:programOid\` guarded by \`@UseGuards(JwtAuthGuard, RolesGuard) @Roles('admin')\``
- After:  `- [ ] **GUID-05**: \`GuidanceModule\` has admin \`PATCH /guidance/:programOid\` guarded by \`@UseGuards(JwtAuthGuard, RolesGuard) @Roles('ADMIN')\``

**FOUND-02 traceability row (line 118):**
- Before: `| FOUND-02 | Phase 1 | Pending |`
- After:  `| FOUND-02 | Phase 4 | Pending |`

## Role Casing Verification

Zero occurrences of `@Roles('admin')` (lowercase) remain in planning docs:

```
grep "@Roles('admin')" .planning/ROADMAP.md .planning/REQUIREMENTS.md
# Returns: zero matches
```

Four occurrences of `@Roles('ADMIN')` (uppercase) exist — SC #2, SC #3, GUID-04, GUID-05:

```
grep "@Roles('ADMIN')" .planning/ROADMAP.md .planning/REQUIREMENTS.md
# Returns:
# .planning/ROADMAP.md:29:  2. A route decorated with `@Roles('ADMIN')` ...
# .planning/ROADMAP.md:30:  3. A route decorated with `@Roles('ADMIN')` ...
# .planning/REQUIREMENTS.md:38: ... @Roles('ADMIN') ...
# .planning/REQUIREMENTS.md:39: ... @Roles('ADMIN') ...
```

## Decisions Made

- Resolve role casing by updating planning docs to uppercase (ADMIN/USER), not by lowercasing the Prisma enum in JwtStrategy.validate() — keeps implementation canonical and avoids a silent mapping layer
- FOUND-02 formally moved to Phase 4 per the D-02 decision already recorded in STATE.md; Phase 4 requirements list now explicitly includes FOUND-02 so it cannot become orphaned again
- Task 3 DB cleanup is an operational step, not a code gap; it will be executed when a live database is available; its absence does not block Phase 2 planning work

## Deviations from Plan

None for Tasks 1 and 2 — executed exactly as specified.

Task 3 was skipped by operator (resume signal: "skipped: no DB available"). This is documented as a pending operational step, not a failure. The cleanup:programs script is verified correct in plan 01-03.

## Issues Encountered

None for Tasks 1 and 2.

Task 3: No database connection available at execution time. Operator acknowledged and accepted the skip. The cleanup:programs script (`prisma/cleanup-non-english.ts`) was verified as correct in plan 01-03 and remains ready to run.

## Pending Operational Step

**ROADMAP SC #4 — Database cleanup not yet confirmed:**

To satisfy Phase 1 SC #4 ("The programs table contains no programs where 'en' is absent from teachingLanguages"), run the following when a populated database is available:

```bash
npm run cleanup:programs
```

Expected output: `Deleted N non-English programs` (N >= 0), exit 0.

Post-run verification SQL:
```sql
SELECT COUNT(*) FROM "Program" WHERE NOT ('en' = ANY("teachingLanguages"));
-- Expected: 0
```

## User Setup Required

None — this plan only modifies planning documentation.

## Next Phase Readiness

- Phase 1 documentation and tracking gaps are closed
- Role casing contract is settled: all future @Roles() decorators must use uppercase strings (ADMIN, USER) matching the Prisma enum
- FOUND-02 traceability is correct: Phase 4 owns it
- Phase 2 (DB-Backed APIs) can proceed; it does not depend on SC #4 database state
- Phase 3 (Guidance Content) route decorators must use @Roles('ADMIN') — now correctly documented

**Remaining gap:** ROADMAP SC #4 (database state) — blocked on DB availability. Not blocking for Phase 2.

---
*Phase: 01-rbac-foundation*
*Completed: 2026-04-28*
