# Requirements: StudyFin Backend

**Defined:** 2026-04-25
**Core Value:** International students can discover and search all English-taught higher education programs in Finland from a single, reliable source — and get step-by-step guidance on how to apply.

## v1 Requirements

Requirements for this milestone. Each maps to roadmap phases.

### Foundation (Phase 1)

- [x] **FOUND-01
**: User model has `role` field (String, default "user") for two-level RBAC
- [ ] **FOUND-02**: User model has `hasTestAccess` boolean field for mock test monetization gating
- [ ] **FOUND-03**: JWT strategy returns user `role` from database on every authenticated request
- [x] **FOUND-04
**: `CurrentUserData` interface includes `role: string`
- [ ] **FOUND-05**: `@Roles()` decorator created using `Reflector.createDecorator` in common/decorators
- [ ] **FOUND-06**: `RolesGuard` created in common/guards implementing `CanActivate`, composable with `JwtAuthGuard`
- [ ] **FOUND-07**: English-only DB cleanup: delete all programs where `en` is not in `teachingLanguages`

### Data Access (Phase 2)

- [ ] **DATA-01**: ProgramsService uses PrismaService queries instead of HttpService calls to Opintopolku
- [ ] **DATA-02**: UniversitiesService uses PrismaService queries instead of HttpService calls to Opintopolku
- [ ] **DATA-03**: HttpModule removed from ProgramsModule and UniversitiesModule
- [ ] **DATA-04**: SyncService wraps location delete/recreate in `prisma.$transaction()`
- [ ] **DATA-05**: SyncService has mutex flag preventing concurrent sync runs

### Guidance Content (Phase 3)

- [ ] **GUID-01**: `Guidance` Prisma model exists with `programOid String @unique`, `sections Json`, `updatedAt`, `createdAt`
- [ ] **GUID-02**: `GuidanceModule` created with public `GET /guidance/:programOid` (no auth)
- [ ] **GUID-03**: Guidance read endpoint returns sections JSON shaped as `[{key, title, body, order}]`
- [ ] **GUID-04**: `GuidanceModule` has admin `POST /guidance/:programOid` guarded by `@UseGuards(JwtAuthGuard, RolesGuard) @Roles('admin')`
- [ ] **GUID-05**: `GuidanceModule` has admin `PATCH /guidance/:programOid` guarded by `@UseGuards(JwtAuthGuard, RolesGuard) @Roles('admin')`
- [ ] **GUID-06**: Guidance DTOs validate section structure (`key`, `title`, `body`, `order` fields required)
- [ ] **GUID-07**: `GET /programs/:oid` and `GET /universities/:oid` responses include guidance availability indicator

### User Features (Phase 4)

- [ ] **USER-01**: User can get own profile via `GET /users/me` (requires JWT auth)
- [ ] **USER-02**: User can update own profile via `PATCH /users/me` (requires JWT auth)
- [ ] **USER-03**: User can save/favorite a program via `POST /users/me/programs/:id`
- [ ] **USER-04**: User can update saved program status via `PATCH /users/me/programs/:id`
- [ ] **USER-05**: User can remove saved program via `DELETE /users/me/programs/:id`
- [ ] **USER-06**: User can list saved programs via `GET /users/me/programs`
- [ ] **USER-07**: Admin can grant mock test access via `PATCH /admin/users/:id/mock-test-access` (requires admin role)
- [ ] **USER-08**: Admin can revoke mock test access via `PATCH /admin/users/:id/mock-test-access` (requires admin role)
- [ ] **USER-09**: MockTestsService checks `hasTestAccess` flag before allowing test start; throws `ForbiddenException` if false

### Search & Infrastructure (Phase 5)

- [ ] **SRCH-01**: `fullTextSearchPostgres` preview feature enabled in Prisma schema
- [ ] **SRCH-02**: Unified search endpoint `GET /search?q=&type=&page=&size=` returns mixed programs + institutions
- [ ] **SRCH-03**: Search results include relevance scoring via `orderBy: { _relevance }`
- [ ] **SRCH-04**: Search results include type filter (programs only, institutions only, or both)
- [ ] **SRCH-05**: `@nestjs/config` installed and replaces bare `dotenv/config` for typed environment variables
- [ ] **SRCH-06**: `@nestjs/cache-manager` + `@keyv/redis` wired to Redis; program/institution lists cached with 24h TTL
- [ ] **SRCH-07**: `@nestjs/throttler` applied globally; admin routes have stricter limits
- [ ] **SRCH-08**: `@nestjs/swagger` installed; Swagger UI available at `/api`; key DTOs have `@ApiProperty` decorators

## v2 Requirements

Deferred to future milestone.

### User Features

- **USER-10**: User can save/favorite universities via `POST/DELETE /users/me/universities/:id`
- **USER-11**: User can view application status history for saved programs

### Guidance Content

- **GUID-08**: Guidance sections support application deadline fields (due date, application round info)
- **GUID-09**: Guidance sections support cost/scholarship information per program

### Mock Tests

- **TEST-01**: Admin can create test templates via `POST /admin/test-templates`
- **TEST-02**: Admin can update test templates via `PATCH /admin/test-templates/:id`
- **TEST-03**: Admin can list all test templates via `GET /admin/test-templates`
- **TEST-04**: Admin can delete test templates via `DELETE /admin/test-templates/:id`
- **TEST-05**: Test templates support field-of-study-specific section sets mapped from `fieldOfStudy`

### Notifications

- **NOTF-01**: User receives email notification for application deadline reminders
- **NOTF-02**: User receives email notification when mock test access is granted

### Search

- **SRCH-09**: Search supports autocomplete/typeahead endpoint with prefix matching
- **SRCH-10**: Full-text `tsvector` search or Meilisearch integration for improved relevance

## Out of Scope

Explicitly excluded. Documented to prevent scope creep.

| Feature | Reason |
|---------|--------|
| Payment integration (Stripe) | Manual gating sufficient for v1 at low user volume; payment adds webhook handling, idempotency, failed flows |
| OAuth/social login | Email/password + JWT sufficient for v1; adds external provider dependency and account linking complexity |
| Real-time features (WebSocket, SSE) | No use case warrants it; REST polling is sufficient for this domain |
| AI-generated guidance content | Immigration/visa domain requires human editorial sign-off; semi-automated (Opintopolku + manual) is correct approach |
| Mobile app API differences | Single API serves web frontend |
| Full application submission | Universities use Studyinfo/HAREK systems; duplicating creates compliance/data risk |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| FOUND-01 | Phase 1 | Pending |
| FOUND-02 | Phase 1 | Pending |
| FOUND-03 | Phase 1 | Pending |
| FOUND-04 | Phase 1 | Pending |
| FOUND-05 | Phase 1 | Pending |
| FOUND-06 | Phase 1 | Pending |
| FOUND-07 | Phase 1 | Pending |
| DATA-01 | Phase 2 | Pending |
| DATA-02 | Phase 2 | Pending |
| DATA-03 | Phase 2 | Pending |
| DATA-04 | Phase 2 | Pending |
| DATA-05 | Phase 2 | Pending |
| GUID-01 | Phase 3 | Pending |
| GUID-02 | Phase 3 | Pending |
| GUID-03 | Phase 3 | Pending |
| GUID-04 | Phase 3 | Pending |
| GUID-05 | Phase 3 | Pending |
| GUID-06 | Phase 3 | Pending |
| GUID-07 | Phase 3 | Pending |
| USER-01 | Phase 4 | Pending |
| USER-02 | Phase 4 | Pending |
| USER-03 | Phase 4 | Pending |
| USER-04 | Phase 4 | Pending |
| USER-05 | Phase 4 | Pending |
| USER-06 | Phase 4 | Pending |
| USER-07 | Phase 4 | Pending |
| USER-08 | Phase 4 | Pending |
| USER-09 | Phase 4 | Pending |
| SRCH-01 | Phase 5 | Pending |
| SRCH-02 | Phase 5 | Pending |
| SRCH-03 | Phase 5 | Pending |
| SRCH-04 | Phase 5 | Pending |
| SRCH-05 | Phase 5 | Pending |
| SRCH-06 | Phase 5 | Pending |
| SRCH-07 | Phase 5 | Pending |
| SRCH-08 | Phase 5 | Pending |

**Coverage:**
- v1 requirements: 34 total
- Mapped to phases: 34
- Unmapped: 0

---
*Requirements defined: 2026-04-25*
*Last updated: 2026-04-25 after research synthesis*
