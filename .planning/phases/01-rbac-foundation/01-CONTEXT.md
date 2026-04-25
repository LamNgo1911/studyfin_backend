# Phase 1: RBAC Foundation - Context

**Gathered:** 2026-04-25
**Status:** Ready for planning

<domain>
## Phase Boundary

Add a two-role access control system (user/admin) to the platform and ensure the programs table contains only English-taught programs. This phase delivers: a `role` enum on the User model, a `@Roles()` decorator, a `RolesGuard`, updates to the JWT strategy to return `role` from the database on every request, and a one-time cleanup of non-English programs from the database.

</domain>

<decisions>
## Implementation Decisions

### Role field design
- **D-01:** Add a Prisma enum `Role { USER ADMIN }` to the schema. The `User` model gets a `role Role @default(USER)` field.
- **D-02:** `hasTestAccess` boolean field is **deferred to Phase 4** — not added in this phase. Phase 1 only adds the `role` field.

### Guard composition
- **D-03:** `RolesGuard` and `JwtAuthGuard` are stacked via `@UseGuards(JwtAuthGuard, RolesGuard)`. JwtAuthGuard runs first (returns 401 if unauthenticated), then RolesGuard checks the user's role (returns 403 if insufficient role).
- **D-04:** The `@Roles()` decorator is created using `Reflector.createDecorator<string[]>()` — the modern NestJS 10+ API as specified in FOUND-05.

### Admin seeding
- **D-05:** A Prisma seed script (`prisma/seed.ts`) creates or promotes an admin user based on the `ADMIN_EMAIL` environment variable. Run via `npx prisma db seed`. This ensures at least one admin exists before admin-guarded routes are useful.

### English cleanup strategy
- **D-06:** One-time cleanup only — delete all programs where `'en'` is not in `teachingLanguages`. The sync service is NOT modified in this phase (sync filtering is Phase 2 work).
- **D-07:** Programs with empty `teachingLanguages` arrays are also deleted — if a program doesn't explicitly list English, it is not considered English-taught.

### Claude's Discretion
- Exact implementation of the cleanup script (Prisma migration with raw SQL vs. a standalone script)
- `CurrentUserData` interface update approach (extend existing interface or replace)
- RolesGuard error message wording
- Whether to add unit tests for the guard/decorator or rely on e2e tests

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Requirements
- `.planning/REQUIREMENTS.md` — FOUND-01 through FOUND-07 define the exact acceptance criteria for this phase
- `.planning/ROADMAP.md` — Phase 1 goal, success criteria, and dependencies

### Data model
- `prisma/schema.prisma` — Current User model (no `role` or `hasTestAccess` yet); Program model with `teachingLanguages String[]`
- `docs/entity-relationship.mmd` — Planned entity relationships (reference only — schema.prisma is the source of truth)

### Existing auth infrastructure
- `src/common/guards/jwt-auth.guard.ts` — Existing JwtAuthGuard that RolesGuard must compose with
- `src/common/decorators/current-user.decorator.ts` — CurrentUserData interface that needs `role` added
- `src/modules/auth/strategies/jwt.strategy.ts` — JwtStrategy.validate() that needs to return `role` from DB

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `JwtAuthGuard` (`src/common/guards/jwt-auth.guard.ts`): Already handles JWT authentication — RolesGuard stacks on top of it
- `CurrentUser` decorator (`src/common/decorators/current-user.decorator.ts`): Extracts `CurrentUserData` from request — needs `role: string` added to the interface
- `UsersService.findById()` (`src/modules/users/users.service.ts`): Already used by JwtStrategy — the role field will be available once the Prisma model is updated
- `PrismaService` (`src/providers/prisma.service.ts`): Global provider, available in all modules — used for the cleanup query

### Established Patterns
- Guards are applied per-route with `@UseGuards()`, not globally — follow this for RolesGuard
- Decorators live in `src/common/decorators/`, guards in `src/common/guards/` — place new files there
- `ValidationPipe` is per-route with `{ transform: true, whitelist: true }` — consistent pattern
- DTOs use barrel `index.ts` exports in `dto/` folders

### Integration Points
- `JwtStrategy.validate()` at `src/modules/auth/strategies/jwt.strategy.ts:18` — must add `role` to the return object
- `CurrentUserData` interface at `src/common/decorators/current-user.decorator.ts:4` — must add `role` property
- `User` model in `prisma/schema.prisma:90` — must add `role` enum field
- Any future admin-only route (Phase 3 guidance CRUD, Phase 4 test access management) will use `@UseGuards(JwtAuthGuard, RolesGuard) @Roles('ADMIN')`

</code_context>

<specifics>
## Specific Ideas

No specific requirements — open to standard approaches

</specifics>

<deferred>
## Deferred Ideas

- `hasTestAccess` boolean on User model — deferred to Phase 4 (User Features), where mock test gating is implemented
- Sync service English-only filtering — deferred to Phase 2 (DB-Backed APIs), where the sync is being reworked anyway

</deferred>

---

*Phase: 01-rbac-foundation*
*Context gathered: 2026-04-25*
