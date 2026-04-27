---
phase: 01-rbac-foundation
verified: 2026-04-27T13:00:00Z
status: gaps_found
score: 11/14 must-haves verified
overrides_applied: 0
gaps:
  - truth: "A route decorated with @Roles('admin') returns 403 when called by a user with role \"user\" (ROADMAP SC #2)"
    status: failed
    reason: "Implementation uses 'ADMIN' (uppercase Prisma enum) for required roles in RolesGuard and seed.ts, but ROADMAP SC #2 and #3 specify @Roles('admin') (lowercase). REQUIREMENTS.md GUID-04 and GUID-05 also specify @Roles('admin'). If future routes follow the ROADMAP/REQUIREMENTS casing they will fail the guard's includes() check because 'ADMIN' !== 'admin'. No admin-decorated routes exist yet so the mismatch is not yet visible at runtime, but the contract is broken."
    artifacts:
      - path: "src/common/guards/roles.guard.ts"
        issue: "requiredRoles.includes(user.role) will use literal string comparison; user.role from Prisma is 'ADMIN' (uppercase); future routes using @Roles('admin') will produce 403 for admin users"
      - path: "prisma/seed.ts"
        issue: "role: 'ADMIN' — uppercase enum string. Consistent with guard but inconsistent with ROADMAP/REQUIREMENTS @Roles('admin') wording."
    missing:
      - "Decide and document the canonical role string casing: either (a) update ROADMAP SC #2/#3 and REQUIREMENTS GUID-04/GUID-05 to use 'ADMIN', or (b) lowercase the Prisma enum values to USER/ADMIN strings via a mapping in JwtStrategy.validate(). The guard and the decorator strings must match."

  - truth: "User model has hasTestAccess boolean field for mock test monetization gating (FOUND-02 / ROADMAP Phase 1 requirement)"
    status: failed
    reason: "ROADMAP.md Phase 1 lists FOUND-02 as a Phase 1 requirement. REQUIREMENTS.md traceability table maps FOUND-02 to Phase 1. The field does not exist in prisma/schema.prisma. Phase 1 Context D-02 deferred this to Phase 4, but no Phase 4 plan claims FOUND-02 explicitly (Phase 4 covers USER-09 behavior but not the FOUND-02 schema field). This is an orphaned requirement with no phase claiming ownership."
    artifacts:
      - path: "prisma/schema.prisma"
        issue: "User model has no hasTestAccess field"
    missing:
      - "Either (a) add hasTestAccess Boolean @default(false) to User model in this phase, or (b) update ROADMAP.md to move FOUND-02 to Phase 4 and update REQUIREMENTS.md traceability table accordingly, and ensure a Phase 4 plan claims it."

  - truth: "The programs table contains no programs where 'en' is absent from teachingLanguages (ROADMAP SC #4)"
    status: failed
    reason: "The cleanup script exists and is correct, but SC #4 describes a database state ('programs table contains no...'), not a script. The script has not been run — it is an operational one-time step requiring manual execution. The database state cannot be verified programmatically without a live DB connection. This gap will be resolved when the operator runs npm run cleanup:programs."
    artifacts:
      - path: "prisma/cleanup-non-english.ts"
        issue: "Script is correct and ready but not yet executed; database state is unknown"
    missing:
      - "Run npm run cleanup:programs against the target database and document the output (count of deleted records) to satisfy SC #4"
---

# Phase 1: RBAC Foundation Verification Report

**Phase Goal:** The platform has a two-role access control system (user/admin) and contains only English-taught programs
**Verified:** 2026-04-27T13:00:00Z
**Status:** gaps_found
**Re-verification:** No — initial verification

## Goal Achievement

### Observable Truths

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | The Prisma schema defines a Role enum with USER and ADMIN values | VERIFIED | `prisma/schema.prisma` lines 88-91: `enum Role { USER ADMIN }` — confirmed |
| 2 | The User model has a role field typed as Role with default USER | VERIFIED | `prisma/schema.prisma` line 101: `role Role @default(USER)` — confirmed |
| 3 | The CurrentUserData interface exposes role as a string property | VERIFIED | `src/common/decorators/current-user.decorator.ts` line 9: `role: string;` — confirmed |
| 4 | The Prisma client is regenerated with Role enum and User.role field available | VERIFIED | `generated/prisma/index.d.ts` lines 86-88: `export const Role: { USER: 'USER', ADMIN: 'ADMIN' }` — confirmed |
| 5 | @Roles('ADMIN') decorator can be placed on any route handler to declare required role | VERIFIED | `src/common/decorators/roles.decorator.ts` line 3: `export const Roles = Reflector.createDecorator<string[]>()` — substantive, fully functional |
| 6 | RolesGuard reads the Roles metadata and compares it to request.user.role | VERIFIED | `src/common/guards/roles.guard.ts` line 17: `this.reflector.get(Roles, context.getHandler())` and line 27: `requiredRoles.includes(user.role)` — confirmed |
| 7 | A route with @Roles('ADMIN') returns 403 when called by a user whose role is USER | VERIFIED | Unit tests (5 passing) confirm ForbiddenException thrown when `user.role !== 'ADMIN'`. Guard machinery is correct. |
| 8 | A route with no @Roles() decorator passes through RolesGuard without restriction | VERIFIED | `roles.guard.ts` lines 20-22: returns true when requiredRoles is undefined/empty — confirmed by test |
| 9 | JwtStrategy.validate() returns role from the database (from the User object), not from the JWT payload | VERIFIED | `src/modules/auth/strategies/jwt.strategy.ts` line 30: `role: user.role` — sourced from `usersService.findById(payload.sub)` DB call, not from payload |
| 10 | npx prisma db seed creates or promotes an admin user based on ADMIN_EMAIL env var | VERIFIED | `prisma/seed.ts`: checks `process.env.ADMIN_EMAIL`, exits 1 if missing, calls `prisma.user.upsert` with `role: 'ADMIN'` — correct |
| 11 | Running the seed with an existing user's email promotes that user to ADMIN role | VERIFIED | `prisma/seed.ts` line 19: `update: { role: 'ADMIN' }` in upsert — promotes existing user |
| 12 | Running the cleanup script deletes all programs where 'en' is not in teachingLanguages | VERIFIED (script only) | `prisma/cleanup-non-english.ts` uses `NOT: { teachingLanguages: { has: 'en' } }` — correct Prisma array filter. Script ready. DB state unverified. |
| 13 | A route decorated with @Roles('admin') returns 403 when called by a user with role "user" (ROADMAP SC #2/#3) | FAILED | ROADMAP and REQUIREMENTS use lowercase 'admin' but Prisma enum and implementation use uppercase 'ADMIN'. No route decorated yet, but the casing contract is broken. |
| 14 | User model has hasTestAccess boolean field (FOUND-02 / ROADMAP Phase 1 requirement) | FAILED | Field absent from schema. Deferred by D-02 decision but no later phase explicitly claims FOUND-02. Orphaned requirement. |

**Score:** 11/14 truths verified (Truths 1-12 pass; Truths 13-14 fail)

### Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `prisma/schema.prisma` | Role enum + User.role field | VERIFIED | enum Role { USER ADMIN } at line 88; role Role @default(USER) at line 101 |
| `src/common/decorators/current-user.decorator.ts` | CurrentUserData with role: string | VERIFIED | Interface updated at line 9; exports CurrentUserData and CurrentUser |
| `src/common/decorators/roles.decorator.ts` | Roles decorator using Reflector.createDecorator<string[]>() | VERIFIED | 3-line file, correct API, exports Roles |
| `src/common/guards/roles.guard.ts` | RolesGuard implementing CanActivate, ForbiddenException | VERIFIED | 35 lines, injects Reflector, throws ForbiddenException on mismatch, additive pattern |
| `src/common/guards/roles.guard.spec.ts` | 4 behavior cases covered, all passing | VERIFIED | 5 tests, all passing (npm test output confirmed) |
| `src/modules/auth/strategies/jwt.strategy.ts` | validate() returns role: user.role from DB | VERIFIED | Line 30: `role: user.role` from DB User object |
| `prisma/seed.ts` | Admin user upsert gated on ADMIN_EMAIL | VERIFIED | Correct upsert with role: 'ADMIN', exits 1 if env not set |
| `prisma/cleanup-non-english.ts` | deleteMany NOT has 'en' in teachingLanguages | VERIFIED | Correct Prisma filter, logs count, proper error/disconnect pattern |
| `package.json` | prisma.seed key + cleanup:programs script | VERIFIED | `"prisma": { "seed": "ts-node prisma/seed.ts" }` at line 76-78; cleanup:programs at line 22 |

### Key Link Verification

| From | To | Via | Status | Details |
|------|----|-----|--------|---------|
| `prisma/schema.prisma` | `generated/prisma` | prisma db push / generate | VERIFIED | Role enum visible in index.d.ts: `USER: 'USER', ADMIN: 'ADMIN'` |
| `src/common/decorators/current-user.decorator.ts` | `src/common/guards/roles.guard.ts` | CurrentUserData import | VERIFIED | roles.guard.ts line 9: `import { CurrentUserData } from '../decorators/current-user.decorator'` |
| `src/common/guards/roles.guard.ts` | `src/common/decorators/roles.decorator.ts` | Reflector.get(Roles, ...) | VERIFIED | roles.guard.ts line 17: `this.reflector.get(Roles, context.getHandler())` |
| `src/modules/auth/strategies/jwt.strategy.ts` | `UsersService.findById()` | user.role on returned User | VERIFIED | jwt.strategy.ts: calls `usersService.findById(payload.sub)` then returns `role: user.role` |
| `prisma/seed.ts` | `prisma.user.upsert` | PrismaClient with PrismaPg adapter | VERIFIED | seed.ts line 17: `prisma.user.upsert({ where: { email: adminEmail }, ... })` |
| `prisma/cleanup-non-english.ts` | `prisma.program.deleteMany` | NOT teachingLanguages has 'en' | VERIFIED | cleanup-non-english.ts line 14: `prisma.program.deleteMany({ where: { NOT: { teachingLanguages: { has: 'en' } } } })` |

### Data-Flow Trace (Level 4)

Scripts and guard machinery — no dynamic rendering components. Level 4 (data-flow trace) not applicable for this phase's artifacts (guards, decorators, CLI scripts are not rendering components).

### Behavioral Spot-Checks

| Behavior | Command | Result | Status |
|----------|---------|--------|--------|
| RolesGuard unit tests (all 4 cases) | `npm run test -- --testPathPatterns=roles.guard --no-coverage` | 5 passed, 1 suite | PASS |
| TypeScript build succeeds | `npm run build` | Exit 0, no errors | PASS |
| package.json prisma.seed key | `node -e "const d=require('./package.json'); console.log(d.prisma.seed)"` | `ts-node prisma/seed.ts` | PASS |
| package.json cleanup:programs script | `node -e "const d=require('./package.json'); console.log(d.scripts['cleanup:programs'])"` | `ts-node prisma/cleanup-non-english.ts` | PASS |
| Role enum in generated client | `grep "USER: 'USER'" generated/prisma/index.d.ts` | Match found at line 87 | PASS |
| Cleanup script DB state | npm run cleanup:programs (requires live DB) | Cannot test without DB connection | SKIP |

### Requirements Coverage

| Requirement | Source Plan | Description | Status | Evidence |
|-------------|------------|-------------|--------|----------|
| FOUND-01 | 01-01-PLAN.md | User model has role field (String, default "user") for two-level RBAC | SATISFIED | schema.prisma: `role Role @default(USER)`; generated client confirms field |
| FOUND-02 | None (orphaned) | User model has `hasTestAccess` boolean field for mock test monetization gating | BLOCKED | Field absent from schema. Deferred to Phase 4 per D-02, but ROADMAP still maps to Phase 1 and no Phase 4 plan claims it |
| FOUND-03 | 01-02-PLAN.md | JWT strategy returns user role from database on every authenticated request | SATISFIED | jwt.strategy.ts: `role: user.role` from `usersService.findById()` — DB lookup, not JWT payload |
| FOUND-04 | 01-01-PLAN.md | CurrentUserData interface includes role: string | SATISFIED | current-user.decorator.ts line 9: `role: string` |
| FOUND-05 | 01-02-PLAN.md | @Roles() decorator created using Reflector.createDecorator in common/decorators | SATISFIED | roles.decorator.ts: `export const Roles = Reflector.createDecorator<string[]>()` |
| FOUND-06 | 01-02-PLAN.md | RolesGuard created in common/guards implementing CanActivate, composable with JwtAuthGuard | SATISFIED | roles.guard.ts implements CanActivate, uses ForbiddenException, additive pattern |
| FOUND-07 | 01-03-PLAN.md | English-only DB cleanup: delete all programs where en is not in teachingLanguages | PARTIAL | Script exists and is correct; database state not yet confirmed (script not run) |

**Orphaned requirement:** FOUND-02 is listed in REQUIREMENTS.md traceability as Phase 1 but is claimed by no Phase 1 plan and deferred by Phase 1 context (D-02). Phase 4 does not explicitly list FOUND-02 in its requirements, though USER-09 (the dependent behavior) is Phase 4. FOUND-02 must be formally reassigned.

### Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
|------|------|---------|----------|--------|
| `prisma/seed.ts` | 22 | `passwordHash: '<hashed-placeholder>'` | Info | Documented accepted risk (T-01-09); only reached when ADMIN_EMAIL user does not exist in DB; this is the create fallback path. Not a blocker — upsert update path (promote existing user) is the expected real-world flow |
| ROADMAP.md / REQUIREMENTS.md | SC #2, #3, GUID-04, GUID-05 | `@Roles('admin')` lowercase vs implementation `'ADMIN'` uppercase | Blocker | If routes are decorated with `@Roles('admin')` following ROADMAP/REQUIREMENTS, the guard's `requiredRoles.includes(user.role)` will return false because Prisma returns `'ADMIN'` (uppercase). Future admin routes will silently deny admin users |

### Human Verification Required

#### 1. English-Only Database State

**Test:** Run `npm run cleanup:programs` against the populated database and inspect the output.
**Expected:** Script logs "Deleted N non-English programs" (N >= 0) and exits 0. After running, a query `SELECT COUNT(*) FROM "Program" WHERE NOT ('en' = ANY("teachingLanguages"))` should return 0.
**Why human:** Requires a live database connection with data loaded. Cannot be verified statically. The script is correct and ready, but the database state (ROADMAP SC #4) depends on operational execution.

### Gaps Summary

Three gaps block full goal achievement:

**Gap 1 — Role casing mismatch (Blocker):** The Prisma enum returns `'ADMIN'` and `'USER'` as uppercase strings. The RolesGuard seed script, and all implementation code correctly use uppercase. However, ROADMAP.md success criteria (#2, #3) and REQUIREMENTS.md GUID-04/GUID-05 consistently specify `@Roles('admin')` (lowercase). When the next phase implements admin routes following REQUIREMENTS.md, the guard will deny admin users. The canonical casing must be settled: either convert ROADMAP/REQUIREMENTS to uppercase (`'ADMIN'`) or add a lowercase mapping in JwtStrategy.validate() (e.g., `role: user.role.toLowerCase()`). **No routes are decorated yet, so no runtime regression exists today — but this will break Phase 3 admin routes if not resolved.**

**Gap 2 — FOUND-02 orphaned (Blocker for ROADMAP compliance):** The ROADMAP lists FOUND-02 as a Phase 1 requirement. The REQUIREMENTS.md traceability table maps it to Phase 1. The Phase 1 context (D-02) deliberately defers it to Phase 4. No Phase 4 plan includes FOUND-02 in its requirements list. The User model has no `hasTestAccess` field. Resolution options: (a) add the field now as a trivial schema addition, or (b) formally move FOUND-02 to Phase 4 by updating ROADMAP.md and REQUIREMENTS.md traceability table.

**Gap 3 — ROADMAP SC #4 (database state, human verification):** The cleanup script is correct and ready, but SC #4 describes a database truth ("programs table contains no non-English programs"), not a script. The database state cannot be confirmed without running the script. This is an operational step, not a code gap — but it must be executed to satisfy the success criterion.

---

_Verified: 2026-04-27T13:00:00Z_
_Verifier: Claude (gsd-verifier)_
