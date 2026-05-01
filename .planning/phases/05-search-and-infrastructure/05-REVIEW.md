---
phase: 05-search-and-infrastructure
reviewed: 2026-05-01T12:00:00Z
depth: standard
files_reviewed: 44
files_reviewed_list:
  - package.json
  - prisma/create-fulltext-indexes.sql
  - prisma/schema.prisma
  - src/app.module.ts
  - src/main.ts
  - src/config/opintopolku.config.ts
  - src/providers/prisma.module.ts
  - src/providers/prisma.service.ts
  - src/common/decorators/current-user.decorator.ts
  - src/common/decorators/roles.decorator.ts
  - src/common/guards/jwt-auth.guard.ts
  - src/common/guards/roles.guard.ts
  - src/modules/admin/admin.controller.ts
  - src/modules/admin/admin.service.ts
  - src/modules/admin/dto/list-users-query.dto.ts
  - src/modules/admin/dto/toggle-mock-test-access.dto.ts
  - src/modules/auth/auth.controller.ts
  - src/modules/auth/auth.module.ts
  - src/modules/auth/auth.service.ts
  - src/modules/auth/dto/forgot-password.dto.ts
  - src/modules/auth/dto/index.ts
  - src/modules/auth/dto/login.dto.ts
  - src/modules/auth/dto/refresh-token.dto.ts
  - src/modules/auth/dto/register.dto.ts
  - src/modules/auth/dto/reset-password.dto.ts
  - src/modules/auth/dto/verify-email.dto.ts
  - src/modules/auth/strategies/jwt.strategy.ts
  - src/modules/guidance/dto/create-guidance.dto.ts
  - src/modules/guidance/dto/guidance-section.dto.ts
  - src/modules/guidance/dto/update-guidance.dto.ts
  - src/modules/guidance/guidance.controller.ts
  - src/modules/guidance/guidance.module.ts
  - src/modules/guidance/guidance.service.ts
  - src/modules/programs/programs.controller.ts
  - src/modules/programs/programs.service.ts
  - src/modules/programs/programs.spec.ts
  - src/modules/search/dto/search-query.dto.ts
  - src/modules/search/dto/search-response.dto.ts
  - src/modules/search/search.controller.ts
  - src/modules/search/search.service.ts
  - src/modules/search/search.spec.ts
  - src/modules/sync/sync.controller.ts
  - src/modules/sync/sync.service.ts
  - src/modules/sync/sync.spec.ts
  - src/modules/sync/sync.module.ts
  - src/modules/universities/universities.controller.ts
  - src/modules/universities/universities.service.ts
  - src/modules/universities/universities.spec.ts
  - src/modules/users/dto/list-saved-programs-query.dto.ts
  - src/modules/users/dto/update-profile.dto.ts
  - src/modules/users/dto/update-saved-program.dto.ts
  - src/modules/users/users.controller.ts
  - src/modules/users/users.module.ts
  - src/modules/users/users.service.ts
findings:
  critical: 3
  warning: 7
  info: 3
  total: 13
status: issues_found
---

# Phase 5: Code Review Report

**Reviewed:** 2026-05-01T12:00:00Z
**Depth:** standard
**Files Reviewed:** 44
**Status:** issues_found

## Summary

This review covers 44 source files spanning the search infrastructure, auth system, sync pipeline, guidance content system, and user/admin modules. Three critical issues were found: a broken mixed-search pagination implementation that returns wrong results for any page beyond 0, an unauthenticated sync endpoint open to abuse, and `deleteKeys` functionality that is defined in the DTO but silently ignored in the service implementation. Seven warnings were identified, primarily around unvalidated controller inputs, a hardcoded JWT fallback secret, overly permissive CORS, and a fire-and-forget promise without error handling that risks process crashes.

---

## Critical Issues

### CR-01: Mixed search pagination returns wrong results for pages beyond 0

**File:** `/home/liam/Downloads/github_repo/studyfin-backend/src/modules/search/search.service.ts:124-179`
**Issue:** The `searchMixed()` method does not apply `skip` (page offset) to the individual Prisma queries for programs and universities. It fetches only `fetchSize` (= `size`) records from each table regardless of page number, then applies `merged.slice(start, start + size)` to the combined result. For page 1 with size 20, it fetches 20 programs + 20 universities (40 total) and slices from index 20, giving items 20-39. This happens to not crash but produces wrong results (it shows items 20-39 of the first 40, instead of items 20-39 of the full dataset). For page 2, it would return 0 results because there are only 40 items to slice from.

**Fix:** Apply `skip: page * size` to both `findMany` calls, and fetch enough records to cover the requested page (at minimum `size * (page + 1)` from each table). Alternatively, restructure to avoid client-side pagination merging entirely:

```typescript
// In searchMixed, apply skip to both queries
const progSkip = page * Math.ceil(size / 2);
const uniSkip = page * Math.floor(size / 2);

const programs = await this.prisma.program.findMany({
  where: progWhere,
  orderBy: progOrderBy,
  skip: progSkip,      // <-- was missing
  take: size,           // <-- was fetchSize (=size), now takes full page worth
  ...
});

const universities = await this.prisma.university.findMany({
  where: uniWhere,
  orderBy: uniOrderBy,
  skip: uniSkip,        // <-- was missing
  take: size,           // <-- was fetchSize (=size)
  ...
});
```

### CR-02: Sync endpoint publicly accessible (no authentication)

**File:** `/home/liam/Downloads/github_repo/studyfin-backend/src/modules/sync/sync.controller.ts:10-16`
**Issue:** `POST /sync/run` has no auth guards at all. Any unauthenticated client can trigger a full data sync from Opintopolku. This can be abused to:
1. Launch a DoS attack against the upstream Opintopolku API by triggering rapid syncs
2. Overload the application's database connection pool
3. Degrade API response times for legitimate users by triggering cache invalidation (sync clears the entire cache)

**Fix:** Add `@UseGuards(JwtAuthGuard, RolesGuard)` with `@Roles(['ADMIN'])` to restrict sync to admin users, matching the pattern used in `GuidanceController`:

```typescript
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@Post('run')
@HttpCode(HttpStatus.ACCEPTED)
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(['ADMIN'])
async run(): Promise<{ message: string }> {
  void this.syncService.syncAll();
  return { message: 'Sync started' };
}
```

### CR-03: `deleteKeys` functionality defined in DTO but never implemented in service

**File:** `/home/liam/Downloads/github_repo/studyfin-backend/src/modules/guidance/guidance.service.ts:57-96`
**Issue:** `UpdateGuidanceDto` defines a `deleteKeys?: string[]` field intended to allow admins to delete specific guidance sections. However, `GuidanceService.patch()` never reads or applies `dto.deleteKeys`. Additionally, the method throws `BadRequestException` if `dto.sections` is empty/undefined, making it impossible to send a request that only deletes keys without also providing replacement sections. The `deleteKeys` field is dead code.

**Fix:** Implement deleteKeys handling in the `patch` method:

```typescript
async patch(programOid: string, dto: UpdateGuidanceDto) {
  // ... program existence check ...

  if ((!dto.sections || dto.sections.length === 0) && (!dto.deleteKeys || dto.deleteKeys.length === 0)) {
    throw new BadRequestException('At least one of sections or deleteKeys must be provided');
  }

  await this.prisma.$transaction(async (tx) => {
    if (dto.deleteKeys && dto.deleteKeys.length > 0) {
      await tx.guidanceSection.deleteMany({
        where: { programOid, key: { in: dto.deleteKeys } },
      });
    }
    if (dto.sections && dto.sections.length > 0) {
      for (const s of dto.sections) {
        await tx.guidanceSection.upsert({
          where: { programOid_key: { programOid, key: s.key } },
          update: { title: s.title, body: s.body, order: s.order },
          create: { programOid, key: s.key, title: s.title, body: s.body, order: s.order },
        });
      }
    }
  });

  // ... return updated sections ...
}
```

---

## Warnings

### WR-01: Fire-and-forget sync call without error handler risks unhandled promise rejection

**File:** `/home/liam/Downloads/github_repo/studyfin-backend/src/modules/sync/sync.controller.ts:14`
**Issue:** `void this.syncService.syncAll()` fires the promise without attaching a `.catch()` handler. The `syncAll()` method only has `try/finally` (no `try/catch`), so any HTTP or database error thrown inside `syncInstitutions()` or `syncPrograms()` will propagate as an unhandled promise rejection. In Node.js 15+, unhandled rejections terminate the process.

**Fix:** Add a `.catch()` to handle errors gracefully in the fire-and-forget path:

```typescript
void this.syncService.syncAll().catch((err) => {
  console.error('Background sync failed:', err);
});
```

### WR-02: Hardcoded fallback JWT secret in source code

**File:** `/home/liam/Downloads/github_repo/studyfin-backend/src/modules/auth/strategies/jwt.strategy.ts:13-14`
**Issue:** `secretOrKey` falls back to the literal string `'fallback-secret-change-in-production'` if `process.env.JWT_SECRET` is not set. While `auth.module.ts` performs a module-level check that prevents loading without `JWT_SECRET`, this hardcoded fallback creates a defense-in-depth weakness. If the module check is ever refactored or if `JWT_SECRET` becomes available late (e.g., dynamic config), any attacker who reads this source code can forge valid JWTs.

**Fix:** Remove the fallback and let it be undefined (passport-jwt will fail securely if the secret is missing):

```typescript
secretOrKey: process.env.JWT_SECRET,
```

### WR-03: CORS configuration allows any origin

**File:** `/home/liam/Downloads/github_repo/studyfin-backend/src/main.ts:23`
**Issue:** `origin: true` reflects the `Origin` request header, effectively allowing any origin to make credentialed requests. In production, this opens the API to cross-origin attacks from any website. The frontend is in a separate repository (`studyfin_frontend`), so the production origin should be restricted.

**Fix:** Use ConfigService to load the allowed origin from an environment variable:

```typescript
app.enableCors({
  origin: configService.get('CORS_ORIGIN', '*'),
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  credentials: true,
});
```

Or restrict to the known frontend URL in production.

### WR-04: Programs and Universities controllers accept unvalidated query parameters

**Files:**
- `/home/liam/Downloads/github_repo/studyfin-backend/src/modules/programs/programs.controller.ts:11`
- `/home/liam/Downloads/github_repo/studyfin-backend/src/modules/universities/universities.controller.ts:11,21`

**Issue:** The `findAll()` and `findPrograms()` endpoints accept `@Query() query: Record<string, any>` without a `ValidationPipe` or DTO. This is inconsistent with the `SearchController` which uses a proper DTO with `class-validator` decorators. While the services manually parse `size` and `page` with `Number()` and `Number.isFinite()` checks, the loose typing means arbitrary query parameters pass through without whitelisting.

**Fix:** Create DTOs with `@IsOptional()`, `@Type(() => Number)`, `@IsInt()`, `@Min()` validation (matching the pattern in `UnifiedSearchQueryDto`) and apply `ValidationPipe` in the controller:

```typescript
@Get()
findAll(@Query(new ValidationPipe({ transform: true, whitelist: true })) query: ProgramsQueryDto) {
  return this.programsService.findAll(query);
}
```

### WR-05: `_lng` parameter accepted but silently ignored

**Files:**
- `/home/liam/Downloads/github_repo/studyfin-backend/src/modules/programs/programs.service.ts:47`
- `/home/liam/Downloads/github_repo/studyfin-backend/src/modules/universities/universities.service.ts:43`

**Issue:** Both `findOne` methods accept an `_lng` parameter but never use it. The `_` prefix indicates intentional unused, but the parameter is still exposed via the controller's `@Query('lng')` mapping in `UniversitiesController` and `ProgramsController`. If a client sends `?lng=fi`, they get the same response as `?lng=en`. This could confuse API consumers and should either be removed from the route or documented as deprecated.

**Fix:** Remove the `lng` query parameter from the controller route decorations if it serves no purpose:

```typescript
// In programs.controller.ts and universities.controller.ts:
@Get(':oid')
findOne(@Param('oid') oid: string) {  // remove @Query('lng')
  return this.programsService.findOne(oid);  // adjust signature
}
```

### WR-06: Email enumeration timing side-channel in forgotPassword

**File:** `/home/liam/Downloads/github_repo/studyfin-backend/src/modules/auth/auth.service.ts:126-156`
**Issue:** When the email does not exist, `forgotPassword()` returns early without computing a token hash or writing to the database. When the email exists, it generates a crypto token, hashes it, and writes to the database. The extra work creates a measurable timing difference that could be used to enumerate registered emails.

**Fix:** Perform a constant-time dummy operation (e.g., generate a fake token and hash it) when the email is not found, so that the response time is indistinguishable from the success path:

```typescript
async forgotPassword(email: string): Promise<{ message: string }> {
  const user = await this.usersService.findByEmail(email);
  const resetToken = this.generateToken();

  if (user) {
    const resetTokenExpiresAt = new Date();
    resetTokenExpiresAt.setHours(resetTokenExpiresAt.getHours() + this.RESET_TOKEN_EXPIRY_HOURS);
    await this.usersService.setResetToken(user.id, resetToken, resetTokenExpiresAt);
    console.log(`[Auth] Password reset token for ${user.email}: ${resetToken}`);
  } else {
    // Dummy hash to make timing constant
    this.hashToken(resetToken);
  }

  return {
    message: 'If an account exists with this email, a password reset link has been sent',
  };
}
```

### WR-07: Domain-model DTOs defined but never wired into Swagger documentation

**File:** `/home/liam/Downloads/github_repo/studyfin-backend/src/modules/search/dto/search-response.dto.ts:125-137`
**Issue:** `UnifiedSearchResponseDto` and `SearchHitDto` are defined with Swagger property decorators but are never referenced by the `SearchController`. The controller does not use `@ApiOkResponse({ type: UnifiedSearchResponseDto })`, so the Swagger documentation does not reflect the response shape. These DTOs are effectively dead code with respect to API documentation.

**Fix:** Add response type decoration to the controller:

```typescript
import { ApiOkResponse } from '@nestjs/swagger';
import { UnifiedSearchResponseDto } from './dto/search-response.dto';

@Get()
@ApiOkResponse({ type: UnifiedSearchResponseDto })
search(@Query(new ValidationPipe({ ... })) query: UnifiedSearchQueryDto) {
  return this.searchService.search(query);
}
```

---

## Info

### IN-01: Unnecessary `findUnique` query after `upsert` in syncInstitutions

**File:** `/home/liam/Downloads/github_repo/studyfin-backend/src/modules/sync/sync.service.ts:132,165-169`
**Issue:** The `prisma.university.upsert()` at line 132 does not specify a `select` clause, so it returns the full university record (including `id`). However, lines 165-169 immediately issue a redundant `findUnique` query to get the same `id`. This wastes one database query per institution during sync.

**Fix:** Use the result of the `upsert` call directly instead of querying again:

```typescript
const university = await this.prisma.university.upsert({ ... });

// Then use university.id directly instead of re-querying:
if (locations.length > 0) {
  await this.prisma.$transaction([
    this.prisma.universityLocation.deleteMany({
      where: { universityId: university.id },
    }),
    this.prisma.universityLocation.createMany({
      data: locations.filter((l) => l.code).map((l) => ({
        universityId: university.id,
        code: l.code,
        name: l.name,
      })),
      skipDuplicates: true,
    }),
  ]);
}
```

### IN-02: Swagger API docs exposed without protection

**File:** `/home/liam/Downloads/github_repo/studyfin-backend/src/main.ts:19`
**Issue:** Swagger UI is mounted at `/api` without any access control. The Swagger document exposes the full API schema including request/response shapes, auth scheme, and endpoint descriptions. In production this should be behind an auth guard or disabled.

**Fix:** Conditionally enable Swagger only in non-production environments:

```typescript
if (process.env.NODE_ENV !== 'production') {
  SwaggerModule.setup('api', app, document);
}
```

### IN-03: Cache key instability with `JSON.stringify` of untrusted shapes

**Files:**
- `/home/liam/Downloads/github_repo/studyfin-backend/src/modules/search/search.service.ts:27`
- `/home/liam/Downloads/github_repo/studyfin-backend/src/modules/programs/programs.service.ts:14`
- `/home/liam/Downloads/github_repo/studyfin-backend/src/modules/universities/universities.service.ts:14,61`

**Issue:** Cache keys are built via `JSON.stringify(query)` where `query` is `Record<string, any>`. JavaScript property ordering (while generally preserved in modern V8) is not guaranteed by the ECMAScript specification for objects constructed from arbitrary input. Different HTTP libraries or proxy layers could reorder query parameters, producing different cache keys for semantically identical requests.

**Fix:** Sort keys before stringifying:

```typescript
const cacheKey = `search:${JSON.stringify(query, Object.keys(query).sort())}`;
```

Alternatively, use a stable hashing approach:

```typescript
const cacheKey = `search:${require('crypto').createHash('md5').update(JSON.stringify(query)).digest('hex')}`;
```

---

_Reviewed: 2026-05-01T12:00:00Z_
_Reviewer: Claude (gsd-code-reviewer)_
_Depth: standard_
