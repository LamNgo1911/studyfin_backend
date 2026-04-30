---
phase: 03-guidance-content
reviewed: 2026-04-30T00:00:00Z
depth: standard
files_reviewed: 11
files_reviewed_list:
  - prisma/schema.prisma
  - src/app.module.ts
  - src/modules/guidance/dto/create-guidance.dto.ts
  - src/modules/guidance/dto/guidance-section.dto.ts
  - src/modules/guidance/dto/update-guidance.dto.ts
  - src/modules/guidance/guidance.controller.ts
  - src/modules/guidance/guidance.module.ts
  - src/modules/guidance/guidance.service.ts
  - src/modules/guidance/guidance.spec.ts
  - src/modules/programs/programs.service.ts
  - src/modules/universities/universities.service.ts
findings:
  critical: 4
  warning: 4
  info: 2
  total: 10
status: issues_found
---

# Phase 03: Code Review Report

**Reviewed:** 2026-04-30T00:00:00Z
**Depth:** standard
**Files Reviewed:** 11
**Status:** issues_found

## Summary

This phase introduces the `GuidanceSection` Prisma model, a `GuidanceModule` with full CRUD-style controller/service, DTOs, and unit tests. The `ProgramsService` and `UniversitiesService` are updated to reference the new model. The implementation is largely coherent, but contains several serious issues: the `GuidanceModule` fails to register its dependency-injected guards at runtime (causing a silent DI crash for every mutating request), a hardcoded JWT fallback secret exists in `AuthModule`, the `PATCH` endpoint silently accepts and ignores an empty `sections` array despite the route's stated purpose, and pagination parameters across two services are vulnerable to `NaN` propagation into Prisma queries.

---

## Critical Issues

### CR-01: `RolesGuard` is instantiated via `@UseGuards` without being provided in any module — will throw at runtime

**File:** `src/modules/guidance/guidance.controller.ts:30` and `:42`

**Issue:** `@UseGuards(JwtAuthGuard, RolesGuard)` passes the class reference to NestJS, which then tries to resolve it from the DI container. `RolesGuard` has a constructor dependency (`Reflector`) and is not registered as a provider in `GuidanceModule`, `AppModule`, or any globally available module. NestJS cannot instantiate a guard with constructor dependencies unless it is present in the DI container. The result is a runtime `Nest can't resolve dependencies of the RolesGuard` error on every `POST /guidance/:programOid` and `PATCH /guidance/:programOid` request, making all admin write operations non-functional.

**Fix:** Register `RolesGuard` and `Reflector` as providers in `GuidanceModule`, or (preferred) register `RolesGuard` globally in `AppModule`:

```typescript
// Option A — in guidance.module.ts
import { Module } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RolesGuard } from '../../common/guards/roles.guard';

@Module({
  imports: [],
  controllers: [GuidanceController],
  providers: [GuidanceService, RolesGuard, Reflector],
  exports: [GuidanceService],
})
export class GuidanceModule {}

// Option B — global guard in app.module.ts (applies everywhere)
import { APP_GUARD } from '@nestjs/core';
{ provide: APP_GUARD, useClass: RolesGuard }
```

---

### CR-02: Hardcoded JWT fallback secret in `AuthModule`

**File:** `src/modules/auth/auth.module.ts:10`

**Issue:** `secret: process.env.JWT_SECRET || 'fallback-secret-change-in-production'` means any deployment that neglects to set `JWT_SECRET` silently uses a well-known string. An attacker who reads this source file (or guesses the convention) can forge valid JWTs and bypass all `JwtAuthGuard`-protected routes — including the newly added admin-only guidance write endpoints.

**Fix:** Fail fast at startup if the secret is absent:

```typescript
const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) {
  throw new Error('JWT_SECRET environment variable is required');
}

const jwtOptions: JwtModuleOptions = {
  secret: jwtSecret,
  signOptions: { expiresIn: (process.env.JWT_ACCESS_EXPIRATION || '15m') as any },
};
```

---

### CR-03: `GuidanceSection` schema relates to `Program.oid` (non-PK), breaking referential integrity guarantees

**File:** `prisma/schema.prisma:94`

**Issue:** The `GuidanceSection` model declares:
```
program  Program  @relation(fields: [programOid], references: [oid], onDelete: Cascade)
```
The `oid` field on `Program` has a `@unique` constraint, so Prisma will accept this. However, using a business-key (`oid`) as a foreign key instead of the surrogate primary key (`id`) is fragile: if the Opintopolku API ever issues a new OID for a program that is logically the same entry, an `oid` update on `Program` would either cascade-delete all guidance sections or break referential integrity. More concretely, all service-layer code in `guidance.service.ts` uses `programOid` as the join key, which is consistent but cementing a design that will require a migration (and data loss) if OIDs are ever corrected in the sync pipeline. The more immediate risk is that `oid` is a mutable business field — it has no `@updatedAt` protection, no application-layer lock, and an `oid` correction in the sync module would silently cascade-delete all guidance sections for that program.

**Fix:** Add the foreign key relation on `Program.id` (the surrogate PK) and store `programId String` on `GuidanceSection`. Alternatively, if the OID-keyed design is intentional, add an explicit code comment and ensure the sync pipeline never changes OIDs for existing programs.

---

### CR-04: Unguarded `NaN` pagination parameters reach Prisma in `ProgramsService` and `UniversitiesService`

**File:** `src/modules/programs/programs.service.ts:9-10`, `src/modules/universities/universities.service.ts:9-10` and `:40-41`

**Issue:** `Number(query.size ?? 20)` produces `NaN` when `query.size` is the string `"abc"` (or any non-numeric string), because the `??` operator only guards against `null`/`undefined`, not non-numeric strings. `NaN` then propagates into `skip: page * size` and `take: size`, both of which Prisma passes directly to the PostgreSQL driver. Prisma will throw a validation error (`Argument take: Invalid value NaN`), producing an unhandled 500 response instead of a clean 400.

**Fix:** Use `parseInt`/`parseFloat` with a fallback after validation, or validate via the controller DTO. The simplest inline fix:

```typescript
const rawSize = Number(query.size);
const rawPage = Number(query.page);
const size = Number.isFinite(rawSize) && rawSize > 0 ? Math.floor(rawSize) : 20;
const page = Number.isFinite(rawPage) && rawPage >= 0 ? Math.floor(rawPage) : 0;
```

---

## Warnings

### WR-01: `PATCH` endpoint silently succeeds when `dto.sections` is `undefined` or empty — misleading semantics

**File:** `src/modules/guidance/guidance.service.ts:55`

**Issue:** `if (dto.sections && dto.sections.length > 0)` means a `PATCH` request with no `sections` field, or `sections: []`, returns HTTP 200 with the current state unchanged. The caller gets no indication that nothing was modified. Since `UpdateGuidanceDto` extends `PartialType(CreateGuidanceDto)`, `sections` is optional — so this code path is reachable by any valid PATCH body. This makes the endpoint unreliable as a partial-update API: callers cannot distinguish "update succeeded" from "no-op accepted silently."

**Fix:** Return HTTP 400 (`BadRequestException`) when `dto.sections` is present but empty, or return HTTP 422 when the body is entirely empty. At minimum, document the no-op behavior clearly and consider returning a `304 Not Modified` status.

```typescript
if (!dto.sections || dto.sections.length === 0) {
  throw new BadRequestException('sections must contain at least one entry');
}
```

---

### WR-02: `upsert()` reads back sections outside the transaction — inconsistent result window

**File:** `src/modules/guidance/guidance.service.ts:40-44`

**Issue:** After the `$transaction` that deletes and recreates sections (lines 27-38), the final `findMany` on lines 40-44 runs outside the transaction. Between the transaction commit and this read, another concurrent write (a second simultaneous `POST` or `PATCH` to the same `programOid`) could modify the sections. The response then reflects a state that was never atomically consistent. This is a TOCTOU (time-of-check / time-of-use) issue: the transaction guarantees the write is atomic, but the return value does not reflect that same snapshot.

**Fix:** Move the final `findMany` inside the transaction callback so both operations share the same snapshot:

```typescript
const sections = await this.prisma.$transaction(async (tx) => {
  await tx.guidanceSection.deleteMany({ where: { programOid } });
  await tx.guidanceSection.createMany({ data: dto.sections.map((s) => ({ programOid, ...s })) });
  return tx.guidanceSection.findMany({
    where: { programOid },
    orderBy: { order: 'asc' },
  });
});
return sections.map((s) => this.mapSection(s));
```

The same pattern applies in `patch()` (lines 78-82).

---

### WR-03: `GuidanceSectionDto` does not validate that `order` is a non-negative integer

**File:** `src/modules/guidance/dto/guidance-section.dto.ts:16-17`

**Issue:** `@IsInt()` accepts any integer, including negative values and zero. Negative `order` values are meaningless (sections are sorted ascending by `order`) and could produce confusing API responses or UI rendering bugs if the consuming frontend uses `order` directly. There is also no `@Min(0)` guard.

**Fix:**

```typescript
import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

@IsInt()
@Min(0)
order: number;
```

---

### WR-04: `GET /guidance/:programOid` returns an empty array for a non-existent program — no 404

**File:** `src/modules/guidance/guidance.service.ts:10-16`

**Issue:** `findByProgramOid` queries `guidanceSection` directly and returns whatever it finds (possibly an empty array) without verifying that the `programOid` itself refers to a valid program. A request for `GET /guidance/does-not-exist` will return `200 []` instead of `404`. This is inconsistent with the write operations (which do check program existence) and with the pattern used by `ProgramsService.findOne` and `UniversitiesService.findOne`.

**Fix:** Add a program existence check before returning:

```typescript
async findByProgramOid(programOid: string) {
  const program = await this.prisma.program.findUnique({
    where: { oid: programOid },
    select: { oid: true },
  });
  if (!program) throw new NotFoundException(`Program not found: ${programOid}`);

  const sections = await this.prisma.guidanceSection.findMany({
    where: { programOid },
    orderBy: { order: 'asc' },
  });
  return sections.map((s) => this.mapSection(s));
}
```

---

## Info

### IN-01: `GuidanceModule` exports `GuidanceService` but nothing imports it — unnecessary export

**File:** `src/modules/guidance/guidance.module.ts:9`

**Issue:** `exports: [GuidanceService]` is declared, but no other module imports `GuidanceModule` or consumes `GuidanceService`. This is dead configuration that adds noise when reasoning about the module graph.

**Fix:** Remove the export until another module actually depends on it:

```typescript
@Module({
  imports: [],
  controllers: [GuidanceController],
  providers: [GuidanceService],
})
export class GuidanceModule {}
```

---

### IN-02: `_lng` parameter accepted by `ProgramsService.findOne` but never used

**File:** `src/modules/programs/programs.service.ts:33`

**Issue:** `async findOne(oid: string, _lng?: string)` accepts a `_lng` language parameter (prefixed with `_` to suppress the lint warning for unused variables) but does not use it anywhere in the method body. The `mapProgramDetail` method returns a single set of strings with no localisation. This is likely leftover scaffolding from the proxy-based implementation but deceives callers into thinking language selection is supported.

**Fix:** Remove the parameter entirely if localisation is not yet implemented, or implement language resolution before the parameter accumulates callers that pass it expecting effect.

```typescript
async findOne(oid: string) {  // remove _lng until localisation is implemented
```

---

_Reviewed: 2026-04-30T00:00:00Z_
_Reviewer: Claude (gsd-code-reviewer)_
_Depth: standard_
