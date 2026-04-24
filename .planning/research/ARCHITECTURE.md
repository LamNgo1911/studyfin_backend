# Architecture Research

**Domain:** Education platform backend — content management + admin API on existing NestJS monolith
**Researched:** 2026-04-24
**Confidence:** HIGH (based on direct codebase analysis + verified NestJS patterns)

## Standard Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                        HTTP Layer (Controllers)                      │
├───────────────┬──────────────────────────────────────────────────────┤
│  Public API   │              Admin API                                │
│  (no guard /  │  @UseGuards(JwtAuthGuard, RolesGuard)                │
│  JwtAuthGuard)│  @Roles('admin')                                     │
│               │                                                       │
│  SearchCtrl   │  GuidanceAdminCtrl   MockTestAdminCtrl               │
│  MockTestsCtrl│  UsersAdminCtrl      SyncAdminCtrl                   │
│  ProgramsCtrl │                                                       │
│  UnivCtrl     │                                                       │
├───────────────┴──────────────────────────────────────────────────────┤
│                     Business Logic Layer (Services)                   │
│                                                                       │
│  GuidanceService   MockTestsService   SearchService   SyncService    │
│  UsersService      ProgramsService    UniversitiesService            │
├─────────────────────────────────────────────────────────────────────┤
│                     Global Infrastructure                             │
│                                                                       │
│  PrismaService (@Global)    JwtAuthGuard    RolesGuard               │
│  JwtStrategy (Passport)     @Roles()        @CurrentUser()           │
├─────────────────────────────────────────────────────────────────────┤
│                     Data Layer (PostgreSQL via Prisma)                │
│                                                                       │
│  User(+role)   Program   University   Guidance   TestTemplate        │
│  UserProgram   MockTest   Auth         GuidanceSection               │
└─────────────────────────────────────────────────────────────────────┘
```

### Component Responsibilities

| Component | Responsibility | Communicates With |
|-----------|----------------|-------------------|
| `GuidanceModule` | CRUD for program guidance content; read endpoint for consumers, write endpoints admin-only | PrismaService, ProgramsModule (for program validation) |
| `AdminModule` (optional) | Aggregates admin-only controllers; alternative to per-module admin controllers | All feature modules |
| `RolesGuard` | Reads `@Roles()` metadata, checks `request.user.role` from JWT strategy | Reflector, JwtAuthGuard (applied first) |
| `@Roles()` decorator | Sets route-level metadata declaring which role is required | Used by RolesGuard via Reflector |
| `JwtStrategy` | Validates JWT, looks up User including `role` field, attaches to `request.user` | UsersService, PrismaService |
| `SyncService` | English-only filtering during sync; source of truth population | PrismaService, HttpService (Opintopolku) |
| `ProgramsService (DB-backed)` | Serves program data from PostgreSQL instead of live proxy | PrismaService |
| `UniversitiesService (DB-backed)` | Serves institution data from PostgreSQL instead of live proxy | PrismaService |
| `UserProgramModule` (or `UsersModule` extension) | Saved/favorited program relationships, application tracking | PrismaService |
| `MockTestsService` | Access-gating check via `user.mockTestAccess` flag; admin sets flag via UsersAdminController | PrismaService |

## Recommended Project Structure

```
src/
├── modules/
│   ├── auth/                     # Existing — extend JwtStrategy to include role
│   ├── users/                    # Existing — add mockTestAccess flag; admin sub-controller
│   │   ├── users.controller.ts   # Existing (empty) — add user profile routes
│   │   ├── users.service.ts      # Existing — add grantMockAccess, listUsers
│   │   └── dto/
│   │       ├── update-user.dto.ts
│   │       └── grant-access.dto.ts
│   ├── programs/                 # Migrate from live-proxy to DB-backed
│   │   ├── programs.controller.ts
│   │   ├── programs.service.ts   # Replace HttpService with PrismaService queries
│   │   └── dto/
│   ├── universities/             # Migrate from live-proxy to DB-backed
│   │   ├── universities.controller.ts
│   │   └── universities.service.ts
│   ├── search/                   # Existing — extend for unified homepage search
│   ├── sync/                     # Existing — add English-only filter at sync time
│   ├── mock-tests/               # Existing — add access gate check
│   └── guidance/                 # NEW — A-Z content per program
│       ├── guidance.module.ts
│       ├── guidance.controller.ts    # Public read: GET /guidance/:programOid
│       ├── guidance.service.ts
│       └── dto/
│           ├── upsert-guidance.dto.ts
│           └── guidance-response.dto.ts
├── common/
│   ├── decorators/
│   │   ├── current-user.decorator.ts   # Existing — extend CurrentUserData to include role
│   │   └── roles.decorator.ts          # NEW — @Roles('admin')
│   ├── guards/
│   │   ├── jwt-auth.guard.ts           # Existing
│   │   └── roles.guard.ts              # NEW — RolesGuard using Reflector
│   └── [other placeholder dirs]
├── config/
└── providers/
    ├── prisma.service.ts
    └── prisma.module.ts
```

### Structure Rationale

- **guidance/ module:** New standalone module following the existing controller-service-DTO pattern. Public read endpoint (one per program OID), admin write endpoints guarded by `@Roles('admin')`. Keeps guidance concern isolated from programs concern, even though guidance references programs by OID.
- **Roles guard in common/guards/:** Parallel to the existing `jwt-auth.guard.ts`. Applied at method level alongside `JwtAuthGuard` — `@UseGuards(JwtAuthGuard, RolesGuard)` — because JwtAuthGuard must execute first to populate `request.user`.
- **No separate AdminModule:** Admin endpoints live inside their feature modules (guidance admin in GuidanceController, mock-test admin in MockTestsController). This is simpler and avoids circular dependencies. Route prefix `/admin` is not used; the guard separation is sufficient.
- **User model role field:** Add `role String @default("user")` to the Prisma `User` model. Simple string (not enum to avoid Prisma enum migration complexity) with application-level enum constant `"admin"` | `"user"`. Role is read by `JwtStrategy.validate()` and included in `CurrentUserData`.

## Architectural Patterns

### Pattern 1: Dual Guard Chain for Admin Routes

**What:** Apply `JwtAuthGuard` then `RolesGuard` in sequence on admin-only handlers. JwtAuthGuard authenticates and populates `request.user`. RolesGuard then reads `request.user.role` and compares against `@Roles()` metadata.

**When to use:** Any write mutation that should be admin-only. In this project: guidance CRUD, mock-test template management, mock-test access grants to users.

**Trade-offs:** Simple and explicit. No global guard complexity. Each admin route self-documents its requirements via decorators.

**Example:**
```typescript
// src/common/decorators/roles.decorator.ts
export const Roles = (...roles: string[]) => SetMetadata('roles', roles);

// src/common/guards/roles.guard.ts
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const required = this.reflector.getAllAndOverride<string[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!required) return true;
    const { user } = context.switchToHttp().getRequest();
    return required.includes(user?.role);
  }
}

// In a controller:
@Post('guidance/:programOid')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
upsertGuidance(@Param('programOid') oid: string, @Body(...) dto: UpsertGuidanceDto) {
  return this.guidanceService.upsert(oid, dto);
}
```

### Pattern 2: Role Added to JwtStrategy Validate Return

**What:** `JwtStrategy.validate()` currently returns `{ id, email, firstName, lastName }`. Extend it to also call `usersService.findById()` (or inline Prisma call) and include `role` in the return. `CurrentUserData` interface is updated to include `role: string`. This surfaces role through the full chain: DB → JWT validate → request.user → @CurrentUser().

**When to use:** Immediately, as a prerequisite to any admin guard work.

**Trade-offs:** Role is fetched from DB on every authenticated request — correct and always fresh, but adds one DB read per authenticated call. At the scale of this application (early stage), this is acceptable and preferable to embedding role in the JWT payload (which can be stale).

**Example:**
```typescript
// In JwtStrategy.validate():
return {
  id: user.id,
  email: user.email,
  firstName: user.firstName,
  lastName: user.lastName,
  role: user.role,  // add this
};

// CurrentUserData interface:
export interface CurrentUserData {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  role: string;  // add this
}
```

### Pattern 3: Guidance as a Structured JSON Content Model

**What:** Store guidance content in a `Guidance` table with `programOid` as the foreign key and a `sections` JSON column holding the structured A-Z steps. Each section has `key` (e.g. `"application"`, `"visa"`, `"housing"`), `title`, `body` (markdown or plain text), and `order` fields. This avoids a rigid many-table design while remaining queryable and editable.

**When to use:** When guidance content structure may evolve (new sections added) without requiring schema migrations for each change. JSON sections are flexible; only add columns when you need to filter/index on a field.

**Trade-offs:** JSON sections are not individually queryable via Prisma without raw SQL. For this use case — reading all sections for a program at once, editing entire guidance records via admin — JSON is appropriate. Use a typed Prisma `Json` field.

**Example Prisma schema addition:**
```prisma
model Guidance {
  id         String   @id @default(cuid())
  programOid String   @unique  // references Program.oid; no FK to keep it loose
  sections   Json     // array of { key, title, body, order }
  updatedAt  DateTime @updatedAt
  createdAt  DateTime @default(now())

  @@index([programOid])
}
```

### Pattern 4: DB-Backed Module Migration (Proxy Retirement)

**What:** Replace `HttpService` calls in `ProgramsService` and `UniversitiesService` with `PrismaService` queries. The existing DB schema for `Program` and `University` is already populated by `SyncService`. This is a service-layer-only change; controllers are not modified.

**When to use:** When the sync layer is trusted to keep the DB current and the Opintopolku proxy is causing rate-limiting, latency, or field-normalization pain. In this project: immediately for programs; universities can follow the same pattern.

**Trade-offs:** If sync breaks, stale data is served. Mitigation: sync health monitoring (log failures, alert on no-sync for 24h). For this audience (students researching programs), a 24h staleness window is acceptable.

## Data Flow

### Request Flow: Public Program Read (Post-Migration)

```
GET /programs/:oid
    |
ProgramsController
    |
ProgramsService.getProgram(oid)
    |
PrismaService.program.findUnique({ where: { oid }, include: { universities, ... } })
    |
Map Prisma result to response shape
    |
JSON response to client
```

### Request Flow: Admin Guidance Upsert

```
POST /guidance/:programOid  (with Bearer token)
    |
JwtAuthGuard → JwtStrategy.validate() → finds user (including role) → attaches to request.user
    |
RolesGuard → reads @Roles('admin') metadata → checks request.user.role === 'admin'
    |
GuidanceController.upsert()
    |
GuidanceService.upsert(programOid, dto)
    |
PrismaService.guidance.upsert({ where: { programOid }, ... })
    |
201/200 response
```

### Request Flow: Public Guidance Read

```
GET /guidance/:programOid  (no auth required)
    |
GuidanceController.get()
    |
GuidanceService.findByProgramOid(programOid)
    |
PrismaService.guidance.findUnique({ where: { programOid } })
    |
Serialize sections JSON → response
```

### Request Flow: Mock Test Access Grant (Admin)

```
PATCH /admin/users/:userId/mock-test-access  (with Bearer admin token)
    |
JwtAuthGuard + RolesGuard(admin)
    |
UsersController.grantMockTestAccess(userId, { granted: true })
    |
UsersService.setMockTestAccess(userId, true)
    |
PrismaService.user.update({ where: { id: userId }, data: { mockTestAccess: true } })
    |
200 response
```

### Sync Flow: English-Only Filtering

```
SyncService.syncAll() (cron midnight / POST /sync/run)
    |
Paginate institutions from Opintopolku API
    |
For each institution:
    Fetch programs → filter to teachingLanguages.includes('en')
    → upsert to DB only English-taught programs
    Non-English records are skipped (not deleted if previously synced without filter)
    |
Clean-up pass: delete DB programs where teachingLanguages not contains 'en'
    (one-time migration step; thereafter only English enter)
```

### Key Data Flows Summary

1. **Sync → DB → API:** Opintopolku data enters only via `SyncService`. Feature modules read only from `PrismaService`. No module other than `SyncModule` calls the upstream API.
2. **Guidance content:** Written by admin via `GuidanceController`, read publicly. Decoupled from `SyncService` — guidance is editorial, not synced.
3. **Role propagation:** `User.role` in DB → `JwtStrategy.validate()` reads it → attaches to `request.user` → `RolesGuard` checks it → `@CurrentUser()` exposes it to handlers.
4. **Mock test access:** `User.mockTestAccess: Boolean` DB flag → `MockTestsService.startTest()` checks it → throws `ForbiddenException` if false → admin sets it via `UsersService`.

## Integration Points

### External Services

| Service | Integration Pattern | Notes |
|---------|---------------------|-------|
| Opintopolku API | HttpService (existing) — sync-only after migration | Retire from Programs/Universities controllers; keep in SyncModule only |
| PostgreSQL | PrismaService @Global (existing) | All new modules use it unchanged |
| Redis | Not yet used | Skip for this milestone; caching is a future optimization |

### Internal Boundaries

| Boundary | Communication | Notes |
|----------|---------------|-------|
| GuidanceModule ↔ ProgramsModule | None (loose coupling via programOid string) | Guidance does not import ProgramsModule; validates programOid exists via Prisma query only if needed |
| UsersModule ↔ MockTestsModule | None (MockTestsService reads user.mockTestAccess from User via PrismaService directly) | No cross-module service injection needed |
| AuthModule ↔ UsersModule | Direct service import (existing) | JwtStrategy uses UsersService.findById(); extend that method to return role |
| AdminRoutes ↔ CommonGuards | @UseGuards(JwtAuthGuard, RolesGuard) + @Roles('admin') (per-route decorator) | No AdminModule import needed; guards registered as providers in their respective modules or in CommonModule |

## Scaling Considerations

| Scale | Architecture Adjustments |
|-------|-----------------------------|
| 0-1k users | Current monolith is correct. No changes needed. |
| 1k-50k users | Add DB indexes on guidance.programOid (already planned), program search filters. Add Redis query caching for program list/search results (Redis already provisioned). No structural changes. |
| 50k+ users | Read replica for PostgreSQL to separate sync writes from API reads. Guidance content delivery via CDN if static enough. Still monolith — no split needed at this scale for this domain. |

### Scaling Priorities

1. **First bottleneck:** Program/institution search under concurrent load — mitigate with an indexed ILIKE query or pg_trgm index; Redis cache on common search terms is sufficient before considering Elasticsearch.
2. **Second bottleneck:** Daily sync locking the DB during upsert — mitigate with background queue (BullMQ with Redis) for sync jobs; Redis is already provisioned.

## Anti-Patterns

### Anti-Pattern 1: Embedding Role in JWT Payload

**What people do:** Add `role` to the JWT access token payload to avoid a DB read on each request.

**Why it's wrong:** If admin revokes a user's role between token issue and request, the stale role in the JWT still passes. For this application where admin manually grants mock test access, this stale window is unacceptable. Also, the JWT access token already expires quickly (default 1h); the savings are minor.

**Do this instead:** Read `role` from the DB in `JwtStrategy.validate()`. It is one additional field in the `findById` query — negligible cost.

### Anti-Pattern 2: Global Guard Registration for Admin

**What people do:** Register `RolesGuard` globally in `main.ts` or `AppModule` providers with `APP_GUARD`. This means every route must explicitly opt out.

**Why it's wrong:** The existing codebase applies guards per-route (`@UseGuards(JwtAuthGuard)` on mock-test endpoints). A global guard silently breaks all public routes unless each one adds a `@Public()` override decorator.

**Do this instead:** Keep the existing per-route guard pattern. Apply `@UseGuards(JwtAuthGuard, RolesGuard) @Roles('admin')` explicitly on each admin handler. It is verbose but matches the codebase convention and avoids surprising breakages.

### Anti-Pattern 3: Separate Database Tables per Guidance Section

**What people do:** Create `GuidanceApplication`, `GuidanceVisa`, `GuidanceHousing` tables for each section type.

**Why it's wrong:** Adds a migration every time a new guidance section type is introduced. Each new section type requires a new join, controller method, DTO, and service query. For content that is fundamentally editorial text with a predictable structure, this is over-engineered.

**Do this instead:** Single `Guidance` table with `sections Json` column. Each section is `{ key: string, title: string, body: string, order: number }`. Admin API accepts the full sections array and upserts it. Readable, writable, and extensible without migrations.

### Anti-Pattern 4: Migrating Proxy to DB Before Sync Filter is in Place

**What people do:** Retire the Opintopolku proxy from Programs/Universities modules before the sync layer has filtered non-English programs out of the DB.

**Why it's wrong:** The DB may contain non-English programs from prior un-filtered syncs. DB-backed queries would then return non-English programs to users. The English-only filter must be applied at sync time and the DB cleaned before the proxy is retired.

**Do this instead:** Phase the work: (1) add English filter to sync, run sync, verify DB state, (2) then retire the proxy from feature modules.

## Build Order Implications

The component dependency graph drives the recommended build order:

```
1. User.role field (Prisma migration)
       |
       v
2. JwtStrategy extends to return role + CurrentUserData update
       |
       v
3. @Roles() decorator + RolesGuard (common/guards)
       |
       v
4. Sync filter (English-only) → clean DB state
       |
       v
5. DB-backed ProgramsService + UniversitiesService (proxy retirement)
       |
       v
6. Guidance module (public read + admin write)
       |
       v
7. UsersController routes (profile, mock-test access grant)
       |
       v
8. UserProgram endpoints (saved/favorite programs)
```

Steps 1–3 are foundational (nothing admin-related works without role infrastructure).
Step 4 is foundational for step 5 (dirty DB makes proxy retirement risky).
Step 6 (guidance) depends only on steps 1–3 and can proceed in parallel with step 5.
Steps 7–8 have no hard dependency on guidance but extend `UsersModule` which is already scaffolded.

## Sources

- Direct codebase analysis: `src/modules/auth/`, `src/modules/mock-tests/`, `src/common/guards/`, `src/common/decorators/`, `prisma/schema.prisma`, `src/app.module.ts`
- NestJS RBAC guard pattern: https://oneuptime.com/blog/post/2026-01-25-rbac-custom-guards-nestjs/view (HIGH confidence — verified against codebase conventions)
- NestJS Roles decorator + Reflector pattern: https://leyaa.ai/codefly/learn/nestjs/qna/how-to-implement-role-based-access-nestjs (MEDIUM confidence — matches NestJS official docs authorization model)
- NestJS official authorization documentation: https://docs.nestjs.com/security/authorization (HIGH confidence — canonical source)
- NestJS advanced patterns 2026: https://webcoderspeed.com/blog/scaling/nestjs-2026-patterns (MEDIUM confidence)

---
*Architecture research for: StudyFin backend — content management + admin API milestone*
*Researched: 2026-04-24*
