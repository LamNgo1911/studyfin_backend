---
phase: 04-user-features
reviewed: 2026-05-01T09:52:18Z
depth: standard
files_reviewed: 17
files_reviewed_list:
  - prisma/schema.prisma
  - src/app.module.ts
  - src/modules/admin/admin.controller.spec.ts
  - src/modules/admin/admin.controller.ts
  - src/modules/admin/admin.module.ts
  - src/modules/admin/admin.service.spec.ts
  - src/modules/admin/admin.service.ts
  - src/modules/admin/dto/list-users-query.dto.ts
  - src/modules/admin/dto/toggle-mock-test-access.dto.ts
  - src/modules/mock-tests/mock-tests.service.ts
  - src/modules/mock-tests/mock-tests.spec.ts
  - src/modules/users/dto/list-saved-programs-query.dto.ts
  - src/modules/users/dto/save-program.dto.ts
  - src/modules/users/dto/update-profile.dto.ts
  - src/modules/users/users.controller.ts
  - src/modules/users/users.service.ts
  - src/modules/users/users.spec.ts
findings:
  critical: 5
  warning: 5
  info: 3
  total: 13
status: issues_found
---

# Phase 04: Code Review Report

**Reviewed:** 2026-05-01T09:52:18Z
**Depth:** standard
**Files Reviewed:** 17
**Status:** issues_found

## Summary

This phase delivers user self-service features (profile, saved programs), admin user-management endpoints, and a mock-test engine. The code is generally well-structured — select allowlists prevent credential leakage, guards are composed correctly, and the transaction usage in `submitAnswers` is sound. However, five blocker-level defects were found across security and correctness dimensions:

- The mock-test `GET /templates` and `GET /templates/:id` endpoints are publicly unauthenticated, yet `isActive` filtering on the template detail endpoint is evaluated **after** the query returns, meaning the guard logic can be bypassed on an already-fetched (possibly inactive or future) template with a timing-dependent race (minor severity here), but more critically the `GET /mock-tests/history` route is reachable by any authenticated user without a test-access check.
- `submitAnswers` allows duplicate answers for the same question to be submitted in a single payload — the per-row unique constraint in the DB (`@@unique([mockTestId, questionId])`) will cause a runtime `P2002` error that is not caught, crashing the request with a 500.
- `RolesGuard` reads roles from `context.getHandler()` only, not the class-level metadata, so the class-level `@Roles(['ADMIN'])` on `AdminController` is silently ignored — both admin endpoints are effectively unprotected against non-admin authenticated users.
- `updateProfile` accepts an empty body silently: both fields are optional, so a PATCH with `{}` succeeds and performs a `user.update` with an empty `data: {}` object — a no-op that returns HTTP 200, which is misleading but also confirms the guard bypass impact is wider since no field validation forces at least one field to change.
- The `Auth` model stores `refreshToken` as a plain string — there is no indication of hashing in the schema, service, or surrounding code; storing a bearer-equivalent credential in plaintext is a security vulnerability.

---

## Critical Issues

### CR-01: RolesGuard reads only handler-level metadata — class-level `@Roles` is ignored, admin endpoints are unprotected

**File:** `src/common/guards/roles.guard.ts:17`

**Issue:** `this.reflector.get(Roles, context.getHandler())` reads the `@Roles` decorator only from the individual handler method. `AdminController` decorates the **class** with `@Roles(['ADMIN'])` (line 22 of `admin.controller.ts`), not individual methods. Because none of the handler methods carry their own `@Roles` decorator, `requiredRoles` is always `undefined` for every admin route, causing the guard to short-circuit to `return true` at line 20. Any authenticated user — regardless of role — can call `GET /admin/users` and `PATCH /admin/users/:id/mock-test-access`.

**Fix:** Replace `reflector.get` with `reflector.getAllAndOverride`, which checks handler first then falls back to the class:

```typescript
const requiredRoles = this.reflector.getAllAndOverride<string[]>(Roles, [
  context.getHandler(),
  context.getClass(),
]);
```

---

### CR-02: `submitAnswers` does not deduplicate answers — duplicate `questionId` entries cause an unhandled DB unique-constraint crash (HTTP 500)

**File:** `src/modules/mock-tests/mock-tests.service.ts:233-265`

**Issue:** The loop at line 233 iterates every entry in `dto.answers` and pushes a row into `answersToCreate` for each one, including duplicates for the same `questionId`. The schema defines `@@unique([mockTestId, questionId])` on `MockTestAnswer`. When `tx.mockTestAnswer.create` is called for the second entry with the same `questionId`, Prisma throws a P2002 error inside the `$transaction` callback. This error propagates uncaught, producing an HTTP 500 for the client and leaving the mock test in a corrupted intermediate state (transaction rolls back, but the test status remains `in_progress`).

**Fix:** Deduplicate `dto.answers` by `questionId` before the loop, or detect and reject duplicates early:

```typescript
const seenQuestions = new Set<string>();
for (const answer of dto.answers) {
  if (seenQuestions.has(answer.questionId)) {
    throw new BadRequestException(
      `Duplicate answer submitted for question ${answer.questionId}`,
    );
  }
  seenQuestions.add(answer.questionId);
  // ... rest of grading logic
}
```

---

### CR-03: `GET /mock-tests/history` is accessible to any authenticated user regardless of `hasTestAccess`

**File:** `src/modules/mock-tests/mock-tests.controller.ts:49-57`

**Issue:** `startTest` (line 40) and `getAttempt` (line 59) are guarded by `JwtAuthGuard` and `startTest` additionally checks `hasTestAccess` inside the service (line 112 of `mock-tests.service.ts`). However, `getHistory` (line 49) and implicitly `submitAnswers` (line 65) have no access guard beyond authentication. A user without `hasTestAccess` who somehow has an existing mock test record (e.g., from before the flag was revoked) can retrieve their history or submit answers. More importantly, `getHistory` can be called by any authenticated user even with no tests at all — there is inconsistency in who is allowed to interact with the mock-test surface. Per `startTest`'s guard, access is gated. That gate should apply to all mock-test user operations.

**Fix:** Add `hasTestAccess` check (matching the pattern in `startTest`) at the start of both `getHistory` and `submitAnswers` in `MockTestsService`, or add a reusable guard/decorator for test access.

```typescript
// At the top of getHistory:
const userAccess = await this.prisma.user.findUnique({
  where: { id: userId },
  select: { hasTestAccess: true },
});
if (!userAccess || !userAccess.hasTestAccess) {
  throw new ForbiddenException('Mock test access is not enabled for your account');
}
```

---

### CR-04: `Auth.refreshToken` stored as plaintext — compromised DB exposes all refresh tokens as bearer-equivalent credentials

**File:** `prisma/schema.prisma:143`

**Issue:** The `Auth` model stores `refreshToken String` with no indication of hashing. A refresh token is functionally equivalent to a long-lived session credential: anyone with read access to the database (e.g., via SQL injection elsewhere, backup exposure, or insider threat) can immediately impersonate every logged-in user by using their refresh token. OWASP recommends storing token verifiers using a one-way hash (SHA-256 of the random token is sufficient for non-password tokens).

**Fix:** Store only `SHA-256(refreshToken)` in the database. On verification, hash the incoming token and compare. The schema field name can be changed to `refreshTokenHash String` to make the intent clear. The corresponding auth service logic must hash before write and hash before compare.

```prisma
model Auth {
  id                String   @id @default(cuid())
  userId            String   @unique
  user              User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  refreshTokenHash  String   // SHA-256 of the issued token; never store plaintext
  createdAt         DateTime @default(now())
  expiresAt         DateTime
}
```

---

### CR-05: `GET /mock-tests/templates` and `GET /mock-tests/templates/:id` are publicly unauthenticated — test content exposed without access control

**File:** `src/modules/mock-tests/mock-tests.controller.ts:26-37`

**Issue:** Both template listing and template detail endpoints have no `@UseGuards(JwtAuthGuard)`. This means the full question bank — question bodies, answer options, and all metadata — is readable by any unauthenticated caller. The `isCorrect` field is intentionally omitted from options in `getTemplate` (line 62-69 of `mock-tests.service.ts`), but unauthenticated access to question bodies enables harvesting and sharing of test content. Given that `startTest` requires authentication and `hasTestAccess`, the template endpoints should require at minimum authentication; access to template details should arguably also require `hasTestAccess`.

**Fix:** Add `@UseGuards(JwtAuthGuard)` to both template routes:

```typescript
@Get('templates')
@UseGuards(JwtAuthGuard)
listTemplates(...) { ... }

@Get('templates/:id')
@UseGuards(JwtAuthGuard)
getTemplate(...) { ... }
```

---

## Warnings

### WR-01: `updateProfile` accepts an empty body and silently performs a no-op database update

**File:** `src/modules/users/users.service.ts:135-153`

**Issue:** Both `firstName` and `lastName` are optional in `UpdateProfileDto`. When neither is provided, `data` is `{}` and Prisma executes `UPDATE "User" SET "updatedAt" = NOW() WHERE id = $1` — touching the row but changing nothing meaningful. The caller receives HTTP 200 with unchanged data, providing no feedback that their request was effectively empty. In addition to being misleading, an empty-body PATCH that always succeeds means the endpoint cannot distinguish "intentional update" from "malformed client".

**Fix:** Add a validation check that at least one field is present before calling the database:

```typescript
if (dto.firstName === undefined && dto.lastName === undefined) {
  throw new BadRequestException('At least one field (firstName, lastName) must be provided');
}
```

---

### WR-02: `submitAnswers` does not validate that all template questions have been answered — partial submissions accepted silently

**File:** `src/modules/mock-tests/mock-tests.service.ts:233-265`

**Issue:** The grading loop only processes the questions present in `dto.answers`. A client can submit an empty `answers: []` array and receive a score of 0 with a `completed` status — no error is raised. Unanswered questions are simply absent from the stored `MockTestAnswer` rows. This is inconsistent: `getAttempt` on the completed test will then show some questions with `userAnswer: null` even though the test was submitted after (apparently) answering all questions. The DB schema has `@@unique([mockTestId, questionId])` but does not enforce completeness.

**Fix:** After building `answersToCreate`, verify that every question in `questionMap` has been answered:

```typescript
for (const [qId] of questionMap) {
  if (!answersToCreate.find((a) => a.questionId === qId)) {
    throw new BadRequestException(
      `Answer missing for question ${qId}`,
    );
  }
}
```

Alternatively, accept partial submission as a design choice but document it explicitly and ensure `getAttempt` handles `userAnswer: null` gracefully (it already does, so this is a softer requirement).

---

### WR-03: `save-program.dto.ts` file name does not match the exported class name

**File:** `src/modules/users/dto/save-program.dto.ts:11`

**Issue:** The file is named `save-program.dto.ts` but exports `UpdateSavedProgramDto`. The controller imports it as `UpdateSavedProgramDto` from `./dto/save-program.dto` (line 18 of `users.controller.ts`). While this is functional TypeScript, the mismatched file name creates confusion: the save (create) operation uses `POST /me/programs/:programId` with no body at all, while this DTO is only used for the PATCH. The file should be named `update-saved-program.dto.ts` to match the class and its actual usage.

**Fix:** Rename the file to `update-saved-program.dto.ts` and update the import paths in `users.controller.ts` and `users.service.ts`.

---

### WR-04: `listSavedPrograms` has no pagination — unbounded result set for users with many saved programs

**File:** `src/modules/users/users.service.ts:221-240`

**Issue:** `listSavedPrograms` calls `findMany` with no `take` or `skip`, returning all saved programs for a user in a single query. While today's user base is small, this is a correctness risk: the associated `ListSavedProgramsQueryDto` has no page/size fields, making it impossible to add pagination later without a breaking API change. Other list endpoints in the same codebase (`listUsers`, `listTemplates`, `getHistory`) all paginate.

**Fix:** Add `page` and `size` pagination fields to `ListSavedProgramsQueryDto` and apply them in `listSavedPrograms`, consistent with other list endpoints.

---

### WR-05: `getAttempt` fetches full `options` (including `isCorrect`) for in-progress tests inside the DB query, then strips it in application code — data exists in memory during the request

**File:** `src/modules/mock-tests/mock-tests.service.ts:422-428`

**Issue:** For `getAttempt`, the Prisma include at line 422-428 fetches `options` with no field selection, meaning `isCorrect` is loaded for all options regardless of test status. For in-progress tests (line 453), the response mapping manually omits `isCorrect` from the returned shape. While the HTTP response is correct, the data is present in the application's heap during the request lifecycle. If an unhandled exception or future code change accidentally surfaces the full object, `isCorrect` leaks. The safer pattern (already used in `getTemplate`) is to exclude `isCorrect` at the Prisma query level using a `select`.

**Fix:** Mirror the `getTemplate` select pattern inside the `getAttempt` include for the in-progress code path:

```typescript
options: {
  orderBy: { orderIndex: 'asc' },
  select: {
    id: true,
    label: true,
    body: true,
    orderIndex: true,
    isCorrect: true, // included; filtered out in mapping for in-progress
  },
},
```

Alternatively, split into two separate Prisma calls based on status, using a select that excludes `isCorrect` for in-progress.

---

## Info

### IN-01: `ALLOWED_STATUSES` constant is duplicated between two DTO files

**File:** `src/modules/users/dto/save-program.dto.ts:3-9` and `src/modules/users/dto/list-saved-programs-query.dto.ts:3-9`

**Issue:** The same `ALLOWED_STATUSES` array is defined identically in two files. If a new status is added, both files must be updated in sync.

**Fix:** Extract the constant to a shared location such as `src/modules/users/dto/program-status.ts` and import it from both DTOs.

---

### IN-02: `AdminModule` does not declare `PrismaModule` as an import — works only because `PrismaModule` is global

**File:** `src/modules/admin/admin.module.ts:5-9`

**Issue:** `AdminService` injects `PrismaService`, but `AdminModule` lists no `imports`. This works at runtime because `PrismaModule` is registered globally (inferred from the pattern in this codebase). If `PrismaModule` were ever de-globalized, this module would fail to start silently until runtime. The same implicit dependency pattern appears in `UsersModule` (not listed in reviewed files but inferred via `UsersService`).

**Fix:** Explicitly import `PrismaModule` into `AdminModule`:

```typescript
@Module({
  imports: [PrismaModule],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
```

---

### IN-03: `users.spec.ts` uses a module-level `mockPrisma` object shared across tests with `jest.clearAllMocks()` — mock state is not fully reset between tests

**File:** `src/modules/users/users.spec.ts:26-41`

**Issue:** `mockPrisma` is declared at module scope as a plain object of `jest.fn()` references. `jest.clearAllMocks()` in `beforeEach` clears call history and return values, but the mock functions themselves are the same references throughout the test suite run. This is subtle: if any test mutates the mock implementation (e.g., `mockImplementation` instead of `mockResolvedValue`), it could bleed state into subsequent tests. By contrast, `mock-tests.spec.ts` and `admin.service.spec.ts` both recreate mocks in `beforeEach`, which is the safer pattern.

**Fix:** Move `mockPrisma` construction inside `beforeEach`:

```typescript
beforeEach(async () => {
  const prisma = {
    user: { findUnique: jest.fn(), update: jest.fn() },
    program: { findUnique: jest.fn() },
    userProgram: {
      create: jest.fn(), findUnique: jest.fn(),
      update: jest.fn(), delete: jest.fn(), findMany: jest.fn(),
    },
  };
  // ... use prisma in TestingModule
});
```

---

_Reviewed: 2026-05-01T09:52:18Z_
_Reviewer: Claude (gsd-code-reviewer)_
_Depth: standard_
