# Phase 1: RBAC Foundation - Pattern Map

**Mapped:** 2026-04-25
**Files analyzed:** 7 (2 new files created, 3 existing files modified, 2 new scripts)
**Analogs found:** 7 / 7

## File Classification

| New/Modified File | Role | Data Flow | Closest Analog | Match Quality |
|---|---|---|---|---|
| `prisma/schema.prisma` | model | CRUD | `prisma/schema.prisma` (self — add enum + field) | exact |
| `src/common/decorators/roles.decorator.ts` | decorator | request-response | `src/common/decorators/current-user.decorator.ts` | role-match |
| `src/common/guards/roles.guard.ts` | guard | request-response | `src/common/guards/jwt-auth.guard.ts` | role-match |
| `src/common/decorators/current-user.decorator.ts` | decorator | request-response | self (modify existing) | exact |
| `src/modules/auth/strategies/jwt.strategy.ts` | service | request-response | self (modify existing) | exact |
| `prisma/seed.ts` | utility | CRUD | `prisma/seed-mock-tests.ts` | exact |
| `prisma/cleanup-non-english.ts` | utility | batch | `prisma/seed-mock-tests.ts` | role-match |

---

## Pattern Assignments

### `prisma/schema.prisma` (model — CRUD modification)

**Analog:** `prisma/schema.prisma` (self — add enum above User model, add field to User)

**Where to insert the enum** — place it immediately above the `// ─── Users & Auth` section comment at line 88:

```prisma
enum Role {
  USER
  ADMIN
}
```

**Where to add the field** — inside the `User` model (lines 90-112), add after `lastName`:

```prisma
model User {
  id              String    @id @default(cuid())
  email           String    @unique
  passwordHash    String
  firstName       String?
  lastName        String?
  role            Role      @default(USER)   // <-- new field
  emailVerifiedAt DateTime?
  ...
}
```

**Key conventions observed in existing schema:**
- Enums go above the model that uses them
- Field comment style: `// inline comment`
- Default values use `@default(...)` attribute on the same line as the field

---

### `src/common/decorators/roles.decorator.ts` (decorator — request-response, NEW FILE)

**Analog:** `src/common/decorators/current-user.decorator.ts`

**Imports pattern** (analog lines 1-2):
```typescript
import { Reflector } from '@nestjs/core';
```

**Core pattern** — use `Reflector.createDecorator` (NestJS 10+ API, as specified in D-04):
```typescript
import { Reflector } from '@nestjs/core';

export const Roles = Reflector.createDecorator<string[]>();
```

**Note:** `Reflector.createDecorator<string[]>()` is the modern API. It returns a decorator factory plus the reflector key in one call. Do NOT use the legacy `SetMetadata('roles', roles)` pattern.

---

### `src/common/guards/roles.guard.ts` (guard — request-response, NEW FILE)

**Analog:** `src/common/guards/jwt-auth.guard.ts` (lines 1-5)

**Existing guard imports pattern** (lines 1-2):
```typescript
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
```

**New guard imports pattern** (copy structure, different symbols):
```typescript
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Roles } from '../decorators/roles.decorator';
import { CurrentUserData } from '../decorators/current-user.decorator';
import { Request } from 'express';
```

**Core pattern** — `CanActivate` class with `Reflector` injection, reading the decorator metadata and comparing to `request.user.role`:
```typescript
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get(Roles, context.getHandler());

    // If no @Roles() decorator, allow access (guard is additive)
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();
    const user = request.user as CurrentUserData;

    if (!user || !requiredRoles.includes(user.role)) {
      throw new ForbiddenException(
        'You do not have permission to access this resource',
      );
    }

    return true;
  }
}
```

**Error handling pattern:** Throw `ForbiddenException` (HTTP 403) when role check fails — this is distinct from `UnauthorizedException` (HTTP 401) thrown by `JwtAuthGuard`. The stacking order `@UseGuards(JwtAuthGuard, RolesGuard)` ensures 401 fires before 403.

**Usage pattern to document for planner** (not in this file, but referenced in PLAN):
```typescript
// On any admin-only route handler or controller:
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
```

---

### `src/common/decorators/current-user.decorator.ts` (decorator — MODIFY existing)

**File:** `src/common/decorators/current-user.decorator.ts`

**Analog:** self — modify the `CurrentUserData` interface only (lines 4-9).

**Current interface** (lines 4-9):
```typescript
export interface CurrentUserData {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
}
```

**Target interface** — add `role` field after `lastName`:
```typescript
export interface CurrentUserData {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  role: string;
}
```

**Imports pattern** (lines 1-2 — unchanged):
```typescript
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
```

**No other changes needed.** The decorator body (lines 11-18) does not need modification — it already returns the full user object from `request.user`.

---

### `src/modules/auth/strategies/jwt.strategy.ts` (service — MODIFY existing)

**File:** `src/modules/auth/strategies/jwt.strategy.ts`

**Analog:** self — modify the `validate()` return object only (lines 18-31).

**Current validate() return** (lines 24-30):
```typescript
return {
  id: user.id,
  email: user.email,
  firstName: user.firstName,
  lastName: user.lastName,
};
```

**Target validate() return** — add `role`:
```typescript
return {
  id: user.id,
  email: user.email,
  firstName: user.firstName,
  lastName: user.lastName,
  role: user.role,
};
```

**Imports pattern** (lines 1-5 — unchanged):
```typescript
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '../../users/users.service';
import { JwtPayload } from '../auth.service';
```

**Note:** `user.role` will be available on the Prisma `User` type once the schema migration adds the `role` field and client is regenerated. No import changes are needed.

---

### `prisma/seed.ts` (utility — CRUD, NEW FILE)

**Analog:** `prisma/seed-mock-tests.ts` (lines 1-8, 486-547)

**Imports pattern** (analog lines 1-8):
```typescript
import 'dotenv/config';
import { PrismaClient } from '../generated/prisma';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});
const prisma = new PrismaClient({ adapter });
```

**Core pattern** — `upsert` to create-or-promote admin user based on `ADMIN_EMAIL` env var (analog for conditional check: lines 493-500):
```typescript
async function seed() {
  const adminEmail = process.env.ADMIN_EMAIL;
  if (!adminEmail) {
    console.error('ADMIN_EMAIL environment variable is not set');
    process.exit(1);
  }

  const user = await prisma.user.upsert({
    where: { email: adminEmail },
    update: { role: 'ADMIN' },
    create: {
      email: adminEmail,
      passwordHash: '<hashed-placeholder>',
      role: 'ADMIN',
    },
  });

  console.log(`Admin user ensured: ${user.email} (id: ${user.id})`);
}
```

**Script entry/exit pattern** (analog lines 541-546):
```typescript
seed()
  .catch((e) => {
    console.error('Error seeding admin:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
```

**package.json entry to add** (analog: `"seed:mock-tests": "ts-node prisma/seed-mock-tests.ts"` at line 21):
```json
"seed": "ts-node prisma/seed.ts"
```

Note: the `prisma.config.ts` section in `package.json` does not yet have a `"seed"` key under `"prisma"`. The planner must decide whether to use the npm script pattern (matching existing `seed:mock-tests`) or add a `"prisma": { "seed": "ts-node prisma/seed.ts" }` key for `npx prisma db seed` support. Both patterns are valid; D-05 mentions `npx prisma db seed`, which requires the second approach.

---

### `prisma/cleanup-non-english.ts` (utility — batch, NEW FILE)

**Analog:** `prisma/seed-mock-tests.ts` (same script skeleton; different operation)

**Imports pattern** (analog lines 1-8 — identical boilerplate):
```typescript
import 'dotenv/config';
import { PrismaClient } from '../generated/prisma';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});
const prisma = new PrismaClient({ adapter });
```

**Core pattern** — bulk delete using `deleteMany` with array-not-contains filter (D-06: delete where `'en'` is not in `teachingLanguages`; D-07: also delete where array is empty):
```typescript
async function cleanupNonEnglishPrograms() {
  // Delete programs that do not include 'en' in teachingLanguages
  // This covers both empty arrays (D-07) and arrays without 'en' (D-06)
  const result = await prisma.program.deleteMany({
    where: {
      NOT: {
        teachingLanguages: { has: 'has' },
      },
    },
  });

  console.log(`Deleted ${result.count} non-English programs`);
}
```

**Prisma array filter note:** Use `{ has: 'en' }` to check if `'en'` is in `teachingLanguages String[]`. The `NOT { has: 'en' }` condition handles both the empty array case and arrays containing only non-English codes, matching D-06 and D-07 in a single query.

**Script entry/exit pattern** (analog lines 541-546):
```typescript
cleanupNonEnglishPrograms()
  .catch((e) => {
    console.error('Error running cleanup:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
```

**package.json entry to add** (following `seed:mock-tests` naming convention at line 21):
```json
"cleanup:programs": "ts-node prisma/cleanup-non-english.ts"
```

---

## Shared Patterns

### PrismaClient bootstrap (standalone scripts)
**Source:** `prisma/seed-mock-tests.ts` (lines 1-8)
**Apply to:** `prisma/seed.ts`, `prisma/cleanup-non-english.ts`
```typescript
import 'dotenv/config';
import { PrismaClient } from '../generated/prisma';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});
const prisma = new PrismaClient({ adapter });
```

### Script error/disconnect pattern
**Source:** `prisma/seed-mock-tests.ts` (lines 541-546)
**Apply to:** `prisma/seed.ts`, `prisma/cleanup-non-english.ts`
```typescript
myFunction()
  .catch((e) => {
    console.error('Error message:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
```

### Guard stacking pattern
**Source:** decision D-03 + `src/common/guards/jwt-auth.guard.ts`
**Apply to:** Any controller route using admin protection
```typescript
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
```

### Prisma import convention
**Source:** `src/modules/users/users.service.ts` (line 3), `src/modules/auth/auth.service.ts` (line 13)
**Apply to:** All new TypeScript files that access Prisma types
```typescript
import { User } from '../../../generated/prisma';  // adjust relative depth
// NOT: import { User } from '@prisma/client'
```

### PrismaService injection (NestJS modules)
**Source:** `src/modules/users/users.service.ts` (lines 1-2, 15-16)
**Apply to:** Any new NestJS service or guard needing database access
```typescript
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../providers/prisma.service';

@Injectable()
export class MyService {
  constructor(private readonly prisma: PrismaService) {}
}
```

### Single quotes + trailing commas (code style)
**Source:** All existing TypeScript files
**Apply to:** All new TypeScript files
- Single quotes for strings
- Trailing commas in multi-line arrays and objects
- These are enforced by Prettier (`prettier/prettier: error`)

---

## No Analog Found

All files in this phase have strong analogs. No entries needed here.

---

## Metadata

**Analog search scope:** `src/common/guards/`, `src/common/decorators/`, `src/modules/auth/`, `prisma/`, `src/providers/`, `src/modules/users/`
**Files scanned:** 8 source files fully read
**Pattern extraction date:** 2026-04-25
