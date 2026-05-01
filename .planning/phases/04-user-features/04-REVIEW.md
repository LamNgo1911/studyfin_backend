---
phase: 04-user-features
reviewed: 2026-05-01T11:26:00Z
depth: standard
files_reviewed: 16
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
  - src/modules/users/dto/update-profile.dto.ts
  - src/modules/users/users.controller.ts
  - src/modules/users/users.service.ts
  - src/modules/users/users.spec.ts
findings:
  critical: 1
  warning: 4
  info: 2
  total: 7
status: issues_found
---

# Phase 04: Code Review Report (Iteration 2)

**Reviewed:** 2026-05-01T11:26:00Z
**Depth:** standard
**Files Reviewed:** 16
**Status:** issues_found

## Summary

This is the second review of phase 04 code. The first review found 13 issues (CR-01 through CR-05, WR-01 through WR-05, IN-01 through IN-03). Fixes were applied on branch `review-fix-04`, and a subset of those fixes were cherry-picked to the current branch `review-fix-temp`. Seven issues remain:

**1 critical:** The CR-03 fix (`hasTestAccess` guard on `submitAnswers` and `getHistory`) was applied to the service code, but the corresponding test file was not updated -- all 9 tests in `submitAnswers` and `getHistory` suites fail at runtime because `prisma.user.findUnique` returns `undefined` and the ForbiddenException fires before any test logic executes. One test ("wrong user") silently passes for the wrong reason.

**4 warnings:** Two prior findings (WR-04 pagination, WR-05 explicit select for options) were never applied to this branch -- their fix commits exist only on `review-fix-04`. Two additional issues: TOCTOU race conditions in `removeSavedProgram`/`updateSavedProgramStatus` (unhandled P2025 = 500 error), and empty-string acceptance in `updateProfile` (name fields overwritable with `""`).

**2 info items:** Missing test for WR-01 fix, and an assertion gap in the `removeSavedProgram` test.

## Previously Fixed Issues (Not Re-reviewed in Detail)

The following findings from the first review were confirmed as addressed in this codebase revision:

- **CR-01** -- RolesGuard now uses `getAllAndOverride` to respect class-level `@Roles`
- **CR-02** -- Duplicate questionId rejection added in `submitAnswers`
- **CR-03** -- `hasTestAccess` checks added to `submitAnswers` and `getHistory`
- **CR-04** -- Auth schema uses `refreshTokenHash` with SHA-256
- **CR-05** -- JwtAuthGuard added to template endpoints
- **WR-01** -- Empty body rejection in `updateProfile`
- **WR-02** -- All-questions-answered validation in `submitAnswers`
- **WR-03** -- DTO file renamed from `save-program.dto.ts` to `update-saved-program.dto.ts`

WR-04 and WR-05 are **not** fixed on this branch (see findings below).

---

## Critical Issues

### CR-06: All `submitAnswers` and `getHistory` tests broken by CR-03 fix -- missing `hasTestAccess` mock

**File:** `/home/liam/Downloads/github_repo/studyfin-backend/src/modules/mock-tests/mock-tests.spec.ts`
**Lines:** 295-417 (submitAnswers suite), 420-455 (getHistory suite)
**Issue:** The CR-03 fix added `hasTestAccess` checks at the start of both `submitAnswers` (lines 191-200) and `getHistory` (lines 387-396) in `mock-tests.service.ts`. However, the test spec file was only updated to mock `prisma.user.findUnique` for the `startTest` test suite. The `submitAnswers` and `getHistory` tests do not mock `prisma.user.findUnique`. Since the jest mock returns `undefined` by default, the check `if (!userAccess || !userAccess.hasTestAccess)` evaluates `!undefined` as `true` and throws `ForbiddenException` before any test-specific logic runs.

Consequences for each test:

| Test in `submitAnswers` | Expected outcome | Actual outcome |
|---|---|---|
| `grades answers correctly and returns results` | succeed, score=1 | **FAIL -- ForbiddenException** |
| `throws NotFoundException for non-existent test` | NotFoundException | **FAIL -- ForbiddenException** |
| `throws ForbiddenException for wrong user` | ForbiddenException | **PASSES FOR WRONG REASON** (thrown by hasTestAccess, not userId check) |
| `throws BadRequestException for already completed test` | BadRequestException | **FAIL -- ForbiddenException** |
| `throws BadRequestException for invalid question` | BadRequestException | **FAIL -- ForbiddenException** |
| `throws BadRequestException for invalid option` | BadRequestException | **FAIL -- ForbiddenException** |
| `handles unanswered questions (null selectedOptionId)` | succeed, score=0 | **FAIL -- ForbiddenException** |

| Test in `getHistory` | Expected outcome | Actual outcome |
|---|---|---|
| `returns paginated list of user test attempts` | succeed, percentage=80 | **FAIL -- ForbiddenException** |
| `filters by status when provided` | succeed | **FAIL -- ForbiddenException** |

The "wrong user" false positive is the most dangerous -- it appears green in CI but verifies nothing about the authorization check it claims to test.

**Fix:** Add `prisma.user.findUnique.mockResolvedValue({ hasTestAccess: true })` at the top of every `submitAnswers` and `getHistory` test that expects the logic to proceed past the access check. Also add explicit tests for the `hasTestAccess` guard in these suites:

```typescript
// In submitAnswers describe block:
it('throws ForbiddenException when user does not have test access', async () => {
  prisma.user.findUnique.mockResolvedValue({ hasTestAccess: false });
  await expect(
    service.submitAnswers('user-1', 'test-1', { answers: [] }),
  ).rejects.toThrow(ForbiddenException);
});

// In getHistory describe block:
it('throws ForbiddenException when user does not have test access', async () => {
  prisma.user.findUnique.mockResolvedValue({ hasTestAccess: false });
  await expect(
    service.getHistory('user-1', { size: 20, page: 0 }),
  ).rejects.toThrow(ForbiddenException);
});
```

---

## Warnings

### WR-06: WR-04 fix not applied -- `listSavedPrograms` lacks pagination

**File:** `/home/liam/Downloads/github_repo/studyfin-backend/src/modules/users/users.service.ts`
**Lines:** 228-247
**Issue:** The `listSavedPrograms` method calls `findMany` without `skip`/`take`. The `ListSavedProgramsQueryDto` has no `page` or `size` fields. The fix commit `653628b` (`fix(04): WR-04 add pagination to listSavedPrograms endpoint`) exists only on branch `review-fix-04` and was never cherry-picked to `review-fix-temp`. The REVIEW-FIX.md erroneously reports this as fixed.

Users with many saved programs receive the entire result set in a single response. Other list endpoints in the same codebase (`listUsers`, `listTemplates`, `getHistory`) all paginate.

**Fix:** Cherry-pick commit `653628b` from `review-fix-04`, or apply the following changes manually:

1. Add pagination fields to `ListSavedProgramsQueryDto`:
```typescript
import { Type } from 'class-transformer';
import { IsIn, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

const ALLOWED_STATUSES = [
  'interested',
  'applying',
  'applied',
  'accepted',
  'rejected',
] as const;

export class ListSavedProgramsQueryDto {
  @IsOptional()
  @IsString()
  @IsIn(ALLOWED_STATUSES)
  status?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  page?: number = 0;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  size?: number = 20;
}
```

2. Update `listSavedPrograms` in `users.service.ts`:
```typescript
async listSavedPrograms(userId: string, query: ListSavedProgramsQueryDto) {
  const { status, page = 0, size = 20 } = query;

  const where = {
    userId,
    ...(status && { status }),
  };

  const [total, programs] = await Promise.all([
    this.prisma.userProgram.count({ where }),
    this.prisma.userProgram.findMany({
      where,
      skip: page * size,
      take: size,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        programId: true,
        status: true,
        createdAt: true,
        program: {
          select: { name: true, oid: true, type: true, fieldOfStudy: true },
        },
      },
    }),
  ]);

  return { total, page, size, programs };
}
```

### WR-07: WR-05 fix not applied -- `getAttempt` fetches `isCorrect` in DB query for in-progress tests

**File:** `/home/liam/Downloads/github_repo/studyfin-backend/src/modules/mock-tests/mock-tests.service.ts`
**Lines:** 462-470
**Issue:** The `getAttempt` method uses `include: { options: { orderBy: { orderIndex: 'asc' } } }` inside the Prisma query, which fetches ALL option fields including `isCorrect` unconditionally. For in-progress tests (line 496), `isCorrect` is stripped in the response mapping, but the data exists in server memory during the request lifecycle. An unhandled exception dump, verbose log, or future code change could accidentally expose it.

The fix commit `c4d920c` (`fix(04): WR-05 use explicit select for options in getAttempt`) exists only on `review-fix-04` and was never applied to `review-fix-temp`.

**Fix:** Cherry-pick commit `c4d920c` from `review-fix-04`, or replace the unrestricted `include` with an explicit `select` that documents the data contract:

```typescript
include: {
  options: {
    orderBy: { orderIndex: 'asc' },
    select: {
      id: true,
      label: true,
      body: true,
      orderIndex: true,
      isCorrect: true, // explicitly listed so the data contract is clear
    },
  },
},
```

### WR-08: TOCTOU race condition in `removeSavedProgram` and `updateSavedProgramStatus`

**File:** `/home/liam/Downloads/github_repo/studyfin-backend/src/modules/users/users.service.ts`
**Lines:** 197-215 (updateSavedProgramStatus), 218-226 (removeSavedProgram)
**Issue:** Both methods follow a read-then-write pattern:

```typescript
// Check (line 197-200)
const existing = await this.prisma.userProgram.findUnique({
  where: { userId_programId: { userId, programId } },
});
if (!existing) throw new NotFoundException('Saved program not found');

// Act (line 202-214) -- TOCTOU window between the two calls
return this.prisma.userProgram.update({ ... });
```

If the `UserProgram` record is deleted by a concurrent request between the `findUnique` and the `update`/`delete`, Prisma throws `P2025` (RecordNotFound). Neither method has a try/catch for P2025, so the error propagates as an unhandled HTTP 500 response. By contrast, `saveProgram` correctly handles its analogous race via P2002 catch (lines 183-188).

The `findUnique` check is also redundant -- the subsequent `update`/`delete` with the same compound key would fail with P2025 anyway, so eliminating the read saves a query while also removing the race window.

**Fix:** Replace the `findUnique` + `update`/`delete` pattern with a single `update`/`delete` wrapped in a try/catch for P2025:

For `removeSavedProgram`:
```typescript
async removeSavedProgram(userId: string, programId: string) {
  try {
    await this.prisma.userProgram.delete({
      where: { userId_programId: { userId, programId } },
    });
  } catch (err: any) {
    if (err?.code === 'P2025') {
      throw new NotFoundException('Saved program not found');
    }
    throw err;
  }
}
```

For `updateSavedProgramStatus`:
```typescript
async updateSavedProgramStatus(
  userId: string,
  programId: string,
  dto: UpdateSavedProgramDto,
) {
  try {
    return await this.prisma.userProgram.update({
      where: { userId_programId: { userId, programId } },
      data: { status: dto.status },
      select: {
        id: true,
        programId: true,
        status: true,
        createdAt: true,
        program: {
          select: { name: true, oid: true, type: true, fieldOfStudy: true },
        },
      },
    });
  } catch (err: any) {
    if (err?.code === 'P2025') {
      throw new NotFoundException('Saved program not found');
    }
    throw err;
  }
}
```

### WR-09: `updateProfile` accepts empty strings for `firstName`/`lastName`

**File:** `/home/liam/Downloads/github_repo/studyfin-backend/src/modules/users/dto/update-profile.dto.ts`
**Lines:** 1-13
**Issue:** The `UpdateProfileDto` uses `@IsOptional()` and `@IsString()` but does not use `@IsNotEmpty()`. An empty string (`""`) passes `@IsString()` validation. The service then spreads it into the update data because `dto.firstName !== undefined` evaluates to `true` for `""`:

```typescript
// DTO allows: { firstName: "" }
// Service logic:
...(dto.firstName !== undefined && { firstName: "" })
// Result: User name is overwritten with empty string
```

A user with a legitimate name can accidentally or maliciously have their display name set to an empty string.

**Fix:** Add `@IsNotEmpty()` to both fields in the DTO:

```typescript
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  firstName?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  lastName?: string;
}
```

---

## Info

### IN-04: Missing test for WR-01 fix (empty body rejection in `updateProfile`)

**File:** `/home/liam/Downloads/github_repo/studyfin-backend/src/modules/users/users.spec.ts`
**Lines:** 78-86
**Issue:** The `updateProfile` test suite has only one happy-path test. The WR-01 fix (empty body rejection throwing `BadRequestException`) has no corresponding test to verify it works. If the rejection logic is accidentally removed or broken in a future refactor, no test will catch the regression.

**Fix:** Add a test for the empty body rejection:

```typescript
it('throws BadRequestException when body is empty', async () => {
  await expect(
    service.updateProfile('user-1', {}),
  ).rejects.toThrow(BadRequestException);
});
```

### IN-05: `removeSavedProgram` test does not verify `delete` was skipped on 404

**File:** `/home/liam/Downloads/github_repo/studyfin-backend/src/modules/users/users.spec.ts`
**Lines:** 127-139
**Issue:** The `removeSavedProgram` 404 test (line 135-138) verifies that `NotFoundException` is thrown but does not assert that `userProgram.delete` was never called. In the current implementation this is guaranteed by the early return, but a future refactor that reorders the logic could accidentally call `delete` before the existence check. An explicit assertion would catch that regression.

**Fix:** Add an assertion that `delete` was not called:

```typescript
it('throws NotFoundException when saved program not found', async () => {
  mockPrisma.userProgram.findUnique.mockResolvedValue(null);
  await expect(
    service.removeSavedProgram('user-1', 'bad-prog'),
  ).rejects.toThrow(NotFoundException);
  expect(mockPrisma.userProgram.delete).not.toHaveBeenCalled();
});
```

---

_Reviewed: 2026-05-01T11:26:00Z_
_Reviewer: Claude (gsd-code-reviewer)_
_Depth: standard_
