# Phase 4: User Features - Context

**Gathered:** 2026-05-01
**Status:** Ready for planning

<domain>
## Phase Boundary

Expose user profile management (view and update own profile), program shortlisting (save, update status, remove, list saved programs with filtering), and mock test access gating (admin-controlled `hasTestAccess` flag on User model, enforced in MockTestsService.startTest). A new AdminModule provides user listing/search and mock test access management endpoints. This phase adds the `hasTestAccess` field to the User model (FOUND-02, deferred from Phase 1).

</domain>

<decisions>
## Implementation Decisions

### Profile response shape
- **D-01:** `GET /users/me` returns a curated safe subset: `id`, `email`, `firstName`, `lastName`, `role`, `emailVerifiedAt`, `createdAt`, plus `hasTestAccess` (boolean) and `savedProgramCount` (integer). Internal fields (passwordHash, tokens, reset fields) are excluded.
- **D-02:** `PATCH /users/me` allows updating `firstName` and `lastName` only. Email changes are out of scope (would require re-verification flow).

### Saved program statuses
- **D-03:** Saved program status uses a fixed set of allowed values: `interested`, `applying`, `applied`, `accepted`, `rejected`. Validate on save/update. The `UserProgram.status` field in the schema is already a `String?` — validate at the DTO level, not as a Prisma enum.
- **D-04:** Default status is `interested` when a program is first saved (POST /users/me/programs/:id). User does not need to specify a status on save.
- **D-05:** `GET /users/me/programs` supports an optional `?status=` query param to filter by status. Returns all saved programs when no filter is applied.
- **D-06:** Saved programs list response includes basic program info alongside the UserProgram record: `id`, `programId`, `status`, `createdAt`, plus program's `name`, `oid`, `type`, and `fieldOfStudy`. Uses Prisma include on the program relation.

### Mock test access gating
- **D-07:** Single toggle endpoint: `PATCH /admin/users/:id/mock-test-access` with `{ hasTestAccess: boolean }` in the request body. One endpoint handles both grant (USER-07) and revoke (USER-08).
- **D-08:** Revoking `hasTestAccess` blocks new test starts only. Active in-progress mock test attempts are not cancelled — if access was granted when the user started, they can finish.
- **D-09:** `hasTestAccess` check is enforced in `MockTestsService.startTest()` only (USER-09). Viewing test templates and test history remains accessible regardless of `hasTestAccess` status.

### Admin user management
- **D-10:** New `AdminModule` with `AdminController` under `/admin/*` routes. All admin routes guarded with `@UseGuards(JwtAuthGuard, RolesGuard) @Roles('ADMIN')`. Keeps admin logic separate from user-facing UsersModule.
- **D-11:** `GET /admin/users` returns a paginated user list with optional email search (`?email=`, `?page=`, `?size=`). Response per user: `id`, `email`, `firstName`, `lastName`, `role`, `hasTestAccess`, `emailVerifiedAt`, `createdAt`.
- **D-12:** `PATCH /admin/users/:id/mock-test-access` lives in AdminController, not UsersController.

### Claude's Discretion
- Exact DTO class structure and validation decorators for profile update, saved program operations, and admin endpoints
- Whether to add a `GET /admin/users/:id` single-user detail endpoint (not in requirements but may be useful)
- Error messages and HTTP status codes for edge cases (e.g., saving a program that doesn't exist, saving a program already saved)
- Whether `savedProgramCount` is computed via `_count` or a separate query in the profile endpoint
- Unit test structure and coverage for the new endpoints

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Requirements
- `.planning/REQUIREMENTS.md` — FOUND-02, USER-01 through USER-09 define the exact acceptance criteria for this phase
- `.planning/ROADMAP.md` — Phase 4 goal, success criteria, and dependencies

### User model and schema
- `prisma/schema.prisma` — User model (needs `hasTestAccess Boolean @default(false)` added), UserProgram model (already exists with `status String?` and `@@unique([userId, programId])`), UserUniversity model
- `src/modules/users/users.service.ts` — Existing UsersService with findById, findByEmail, create — extend with profile and saved program methods
- `src/modules/users/users.controller.ts` — Empty controller scaffold — ready to receive GET /users/me and PATCH /users/me routes

### Auth and guards
- `src/common/guards/jwt-auth.guard.ts` — JwtAuthGuard for route protection
- `src/common/guards/roles.guard.ts` — RolesGuard for admin-only routes
- `src/common/decorators/roles.decorator.ts` — @Roles('ADMIN') decorator
- `src/common/decorators/current-user.decorator.ts` — @CurrentUser() decorator and CurrentUserData interface

### Mock test integration
- `src/modules/mock-tests/mock-tests.service.ts` — MockTestsService.startTest() method where hasTestAccess check must be added (USER-09)
- `src/modules/mock-tests/mock-tests.module.ts` — MockTestsModule for understanding module wiring

### Prior phase context
- `.planning/phases/01-rbac-foundation/01-CONTEXT.md` — Phase 1 decisions: D-02 deferred hasTestAccess to Phase 4; D-03 guard stacking pattern; D-04 Reflector.createDecorator usage

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `UsersService` (`src/modules/users/users.service.ts`): Already has `findById`, `findByEmail`, `create` — extend with `getProfile`, `updateProfile`, `saveProgram`, `removeSavedProgram`, `listSavedPrograms`, `updateSavedProgramStatus`
- `PrismaService` (`src/providers/prisma.service.ts`): Global provider — inject directly, no module wiring required
- `JwtAuthGuard` + `RolesGuard`: Already implemented and tested in Phase 1 — reuse for admin endpoints
- `CurrentUser` decorator: Extracts `CurrentUserData` from request — includes `id`, `email`, `role`
- `UserProgram` model: Already exists in schema with `status String?`, `@@unique([userId, programId])`, cascade deletes

### Established Patterns
- Controllers apply `@UseGuards()` per-route, not globally
- `ValidationPipe({ transform: true, whitelist: true })` applied per-route
- DTOs use `class-validator` + `class-transformer` decorators
- Pagination uses `page` (0-indexed) + `size` params with `skip: page * size, take: size`
- Services throw NestJS HTTP exceptions directly (`NotFoundException`, `ForbiddenException`, `ConflictException`)
- Role enum values are uppercase: `'ADMIN'`, `'USER'`
- Prisma `$transaction` used for atomic multi-step operations (Phase 2 pattern)

### Integration Points
- `src/modules/users/users.module.ts` — UsersModule already exports UsersService; AdminModule may need to import UsersModule
- `src/app.module.ts` — AdminModule must be registered here
- `src/modules/mock-tests/mock-tests.service.ts:106` — `startTest()` method where hasTestAccess guard is inserted
- `CurrentUserData` interface — may need `hasTestAccess` added if the profile endpoint needs it without a separate DB query

</code_context>

<specifics>
## Specific Ideas

- `hasTestAccess` and `savedProgramCount` included in the `/users/me` response so the frontend has everything it needs in a single call
- Fixed status enum validated at DTO level (not Prisma enum) — keeps the schema flexible while enforcing consistency through validation
- AdminModule physically separates admin concerns from user-facing routes — cleaner code organization

</specifics>

<deferred>
## Deferred Ideas

- Saving/favoriting universities (USER-10, USER-11) — explicitly v2 per REQUIREMENTS.md
- Admin ability to change user roles — not in Phase 4 requirements
- Bulk mock test access management (grant/revoke for multiple users at once) — not in requirements, could be a future enhancement

</deferred>

---

*Phase: 04-user-features*
*Context gathered: 2026-05-01*
