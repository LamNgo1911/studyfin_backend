# Phase 2: DB-Backed APIs - Pattern Map

**Mapped:** 2026-04-28
**Files analyzed:** 5
**Analogs found:** 5 / 5

## File Classification

| New/Modified File | Role | Data Flow | Closest Analog | Match Quality |
|---|---|---|---|---|
| `src/modules/programs/programs.service.ts` | service | CRUD | `src/modules/sync/sync.service.ts` | exact — same PrismaService injection, same models |
| `src/modules/universities/universities.service.ts` | service | CRUD | `src/modules/sync/sync.service.ts` | exact — same PrismaService injection, same models |
| `src/modules/programs/programs.module.ts` | config | n/a | `src/modules/sync/sync.module.ts` | role-match — module without HttpModule to copy |
| `src/modules/universities/universities.module.ts` | config | n/a | `src/modules/sync/sync.module.ts` | role-match — module without HttpModule to copy |
| `src/modules/sync/sync.service.ts` | service | CRUD + event-driven | `src/modules/sync/sync.service.ts` | self — patch only (transaction + mutex additions) |

---

## Pattern Assignments

### `src/modules/programs/programs.service.ts` (service, CRUD)

**Analog:** `src/modules/sync/sync.service.ts`

The current file uses `HttpService` + `firstValueFrom()` for every data fetch. This is replaced entirely by `PrismaService` queries. The SyncService is the only existing file that already performs Prisma reads/writes against the `Program` and `University` models — making it the definitive analog for import style, injection, and query structure.

**Imports pattern** (`src/modules/sync/sync.service.ts`, lines 1–7):
```typescript
import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../providers/prisma.service';
// NOTE: Remove HttpService, firstValueFrom, OPINTOPOLKU_BASE imports entirely.
// Add NotFoundException from @nestjs/common for missing-record errors (see D-07 / Discretion note).
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../providers/prisma.service';
```

**Constructor injection pattern** (`src/modules/sync/sync.service.ts`, lines 16–19):
```typescript
constructor(
  private readonly prisma: PrismaService,
) {}
// Remove: private readonly httpService: HttpService
// PrismaModule is global — no module import change needed (see D-07).
```

**Core Prisma findMany with pagination** (`src/modules/sync/sync.service.ts`, lines 252–297 — upsert shape reveals all column names):
```typescript
// Pattern: offset pagination matching existing page/size convention (see CONTEXT D-01, code_context)
const [total, rows] = await this.prisma.$transaction([
  this.prisma.program.count({ where }),
  this.prisma.program.findMany({
    where,
    skip: page * size,
    take: size,
    include: {
      universities: {
        include: { university: { select: { oid: true, name: true } } },
      },
    },
  }),
]);
return { total, page, size, hits: rows.map(this.mapProgram) };
```

**Core Prisma findUnique (single record)** (`src/modules/sync/sync.service.ts`, lines 320–326 — findUnique by oid already used):
```typescript
// Pattern: findUnique by oid; throw NotFoundException when null (Discretion note in CONTEXT)
const program = await this.prisma.program.findUnique({
  where: { oid },
  include: {
    universities: {
      include: { university: { select: { oid: true, name: true } } },
    },
  },
});
if (!program) throw new NotFoundException(`Program not found: ${oid}`);
return this.mapProgramDetails(program);
```

**Error handling pattern** — existing services use `BadGatewayException` for upstream HTTP failures (`src/modules/programs/programs.service.ts`, lines 38–40). For DB-backed reads the analog is `NotFoundException`:
```typescript
// Replace:
throw new BadGatewayException('Upstream Opintopolku API is unreachable');
// With:
throw new NotFoundException(`Program not found: ${oid}`);
// findAll never throws NotFoundException — empty result is { total: 0, hits: [] }.
```

**Pagination parameters** (`src/modules/programs/programs.service.ts`, lines 12–13 — keep the same defaults):
```typescript
const size = Number(query.size ?? 20);
const page = Number(query.page ?? 0);
// skip: page * size, take: size  — matches existing controller contract
```

**Field mapping to preserve** — D-01 requires matching the current proxy list shape. Fields stored in DB (from `prisma/schema.prisma` lines 48–76) that map to proxy shape:
```
DB column        → proxy field
oid              → oid
name             → name
type             → type
isDegree         → isDegree
imageUrl         → imageUrl
fieldOfStudy     → fieldOfStudy
creditsAmount    → creditsAmount
creditsUnit      → creditsUnit
teachingLanguages → teachingLanguages
universities[].university.oid  → providers[].oid
universities[].university.name → providers[].name
```

---

### `src/modules/universities/universities.service.ts` (service, CRUD)

**Analog:** `src/modules/sync/sync.service.ts`

Same migration as programs: drop `HttpService`, inject `PrismaService`, convert every method to a Prisma query. The University model columns are in `prisma/schema.prisma` lines 12–34; `UniversityLocation` lines 36–44.

**Imports pattern** (same as programs.service.ts pattern above):
```typescript
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../providers/prisma.service';
// Remove: HttpService, firstValueFrom, OPINTOPOLKU_BASE
```

**Constructor injection pattern** (lines 16–19 of sync.service.ts):
```typescript
constructor(
  private readonly prisma: PrismaService,
) {}
```

**Core Prisma findMany with locations** (`prisma/schema.prisma` lines 27–28 — `locations` relation exists):
```typescript
// Pattern: include locations relation for both list and detail
const [total, rows] = await this.prisma.$transaction([
  this.prisma.university.count({ where }),
  this.prisma.university.findMany({
    where,
    skip: page * size,
    take: size,
    include: { locations: true },
  }),
]);
return { total, page, size, hits: rows.map(this.mapUniversity) };
```

**Core Prisma findUnique** (`src/modules/sync/sync.service.ts`, lines 148–151 — pattern already used for university lookup):
```typescript
const university = await this.prisma.university.findUnique({
  where: { oid },
  include: { locations: true },
});
if (!university) throw new NotFoundException(`University not found: ${oid}`);
```

**findPrograms via join table** (`prisma/schema.prisma` lines 79–86 — `ProgramUniversity` join table; `University.programs` relation):
```typescript
// Pattern: query programs filtered by university using ProgramUniversity join
const [total, rows] = await this.prisma.$transaction([
  this.prisma.program.count({
    where: { universities: { some: { universityId: university.id } } },
  }),
  this.prisma.program.findMany({
    where: { universities: { some: { universityId: university.id } } },
    skip: page * size,
    take: size,
    include: {
      universities: {
        include: { university: { select: { oid: true, name: true } } },
      },
    },
  }),
]);
```

**Field mapping to preserve** — D-03 / D-04 list shape from DB columns (`prisma/schema.prisma` lines 12–34):
```
DB column     → proxy field (list shape D-03)
oid           → oid
name          → name
description   → description
logoUrl       → logoUrl
type          → type
municipality  → municipality
studentCount  → studentCount
locations[]   → locations (UniversityLocation: { code, name })

Additional for detail (D-04):
website       → website
email         → email
```

---

### `src/modules/programs/programs.module.ts` (config, n/a)

**Analog:** `src/modules/sync/sync.module.ts`

The change is mechanical: remove `HttpModule` from `imports`. `PrismaModule` is global — no import needed. SyncModule is the reference because it imports `HttpModule` (which must stay there); Programs/UniversitiesModule must drop it.

**Current file** (`src/modules/programs/programs.module.ts`, lines 1–12):
```typescript
import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';          // REMOVE this line
import { ProgramsController } from './programs.controller';
import { ProgramsService } from './programs.service';

@Module({
  imports: [HttpModule],                             // REMOVE HttpModule from array
  controllers: [ProgramsController],
  providers: [ProgramsService],
  exports: [ProgramsService],
})
export class ProgramsModule {}
```

**Target pattern** (after HttpModule removal):
```typescript
import { Module } from '@nestjs/common';
import { ProgramsController } from './programs.controller';
import { ProgramsService } from './programs.service';

@Module({
  imports: [],                                       // or omit imports entirely
  controllers: [ProgramsController],
  providers: [ProgramsService],
  exports: [ProgramsService],
})
export class ProgramsModule {}
```

---

### `src/modules/universities/universities.module.ts` (config, n/a)

**Analog:** Same pattern as programs.module.ts above.

**Current file** (`src/modules/universities/universities.module.ts`, lines 1–12):
```typescript
import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';          // REMOVE
import { UniversitiesController } from './universities.controller';
import { UniversitiesService } from './universities.service';

@Module({
  imports: [HttpModule],                             // REMOVE HttpModule
  controllers: [UniversitiesController],
  providers: [UniversitiesService],
  exports: [UniversitiesService],
})
export class UniversitiesModule {}
```

**Target pattern** (after removal):
```typescript
import { Module } from '@nestjs/common';
import { UniversitiesController } from './universities.controller';
import { UniversitiesService } from './universities.service';

@Module({
  imports: [],
  controllers: [UniversitiesController],
  providers: [UniversitiesService],
  exports: [UniversitiesService],
})
export class UniversitiesModule {}
```

**Note:** `SyncModule` (`src/modules/sync/sync.module.ts`, lines 1–11) **retains** `HttpModule` — do not modify it (per D-06).

---

### `src/modules/sync/sync.service.ts` — patches only (service, CRUD + event-driven)

This file is not rewritten. Two targeted additions are required: a `$transaction` wrapper around the location delete+recreate block (D-08), and an in-memory boolean mutex on `syncAll` (D-09).

**Existing location upsert block to wrap** (`src/modules/sync/sync.service.ts`, lines 147–167):
```typescript
// CURRENT — two separate awaits, no atomicity:
await this.prisma.universityLocation.deleteMany({
  where: { universityId: university.id },
});
await this.prisma.universityLocation.createMany({
  data: locations
    .filter((l) => l.code)
    .map((l) => ({
      universityId: university.id,
      code: l.code,
      name: l.name,
    })),
  skipDuplicates: true,
});
```

**Target pattern — wrap in `$transaction`** (D-08):
```typescript
// AFTER — atomic: if createMany fails, deleteMany is rolled back
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
```

**Mutex pattern to add** (D-09) — add field at class level, guard inside `syncAll`:
```typescript
// Add at class level (after logger declaration, before constructor):
private isSyncing = false;

// Wrap existing syncAll body:
async syncAll(): Promise<{ institutions: number; programs: number }> {
  if (this.isSyncing) {
    this.logger.warn('Sync already in progress — skipping concurrent run');
    return { institutions: 0, programs: 0 };
  }
  this.isSyncing = true;
  try {
    this.logger.log('Starting full sync');
    const institutionCount = await this.syncInstitutions();
    const programCount = await this.syncPrograms();
    this.logger.log(
      `Sync complete: ${institutionCount} institutions, ${programCount} programs`,
    );
    return { institutions: institutionCount, programs: programCount };
  } finally {
    this.isSyncing = false;
  }
}
```

**Logger pattern** — already present in SyncService (`src/modules/sync/sync.service.ts`, line 14). Copy this same pattern if adding logging to other services:
```typescript
private readonly logger = new Logger(SyncService.name);
// Usage:
this.logger.warn('Sync already in progress — skipping concurrent run');
```

---

## Shared Patterns

### PrismaService Injection
**Source:** `src/modules/sync/sync.service.ts` lines 5–19
**Apply to:** `programs.service.ts`, `universities.service.ts`
```typescript
import { PrismaService } from '../../providers/prisma.service';

constructor(
  private readonly prisma: PrismaService,
) {}
// No module import needed — PrismaModule is global (see providers/prisma.service.ts).
```

### Prisma Import Path
**Source:** `src/modules/sync/sync.service.ts`, line 7
**Apply to:** Any file needing Prisma types (e.g., `Prisma.InputJsonValue`)
```typescript
import { Prisma } from '../../../generated/prisma';
// NOT from '@prisma/client' — custom output path per CLAUDE.md
```

### Prisma $transaction (sequential array form)
**Source:** pattern from `src/modules/sync/sync.service.ts` lines 147–167 (to be wrapped)
**Apply to:** `sync.service.ts` location upsert block
```typescript
await this.prisma.$transaction([
  this.prisma.model.deleteMany({ where: { ... } }),
  this.prisma.model.createMany({ data: [...] }),
]);
```

### NotFoundException for Missing DB Records
**Source:** `@nestjs/common` — replaces `BadGatewayException` from proxy era
**Apply to:** `programs.service.ts` `findOne`, `universities.service.ts` `findOne` and `findPrograms` (when university OID not found)
```typescript
import { Injectable, NotFoundException } from '@nestjs/common';
// ...
if (!record) throw new NotFoundException(`<Entity> not found: ${oid}`);
```

### Pagination Offset Pattern
**Source:** `src/modules/programs/programs.service.ts` lines 12–13, `src/modules/universities/universities.service.ts` lines 12–13
**Apply to:** all `findAll` and `findPrograms` methods
```typescript
const size = Number(query.size ?? 20);
const page = Number(query.page ?? 0);
// In Prisma query:
skip: page * size,
take: size,
// In return shape:
return { total, page, size, hits: [...] };
```

### Module Structure (no HttpModule)
**Source:** `src/modules/sync/sync.module.ts` lines 1–11 (inverted — sync keeps HttpModule, these drop it)
**Apply to:** `programs.module.ts`, `universities.module.ts`
```typescript
import { Module } from '@nestjs/common';
import { XxxController } from './xxx.controller';
import { XxxService } from './xxx.service';

@Module({
  imports: [],
  controllers: [XxxController],
  providers: [XxxService],
  exports: [XxxService],
})
export class XxxModule {}
```

---

## No Analog Found

All five files have strong analogs in the codebase. No file requires falling back to RESEARCH.md reference patterns.

---

## Metadata

**Analog search scope:** `src/modules/`, `src/providers/`, `prisma/`
**Files scanned:** 9 (`programs.service.ts`, `programs.module.ts`, `programs.controller.ts`, `universities.service.ts`, `universities.module.ts`, `universities.controller.ts`, `sync.service.ts`, `sync.module.ts`, `providers/prisma.service.ts`, `prisma/schema.prisma`)
**Pattern extraction date:** 2026-04-28
