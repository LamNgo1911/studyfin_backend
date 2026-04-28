# Phase 2: DB-Backed APIs - Context

**Gathered:** 2026-04-28
**Status:** Ready for planning

<domain>
## Phase Boundary

Retire the live Opintopolku proxy for program and institution data. After this phase, `ProgramsService` and `UniversitiesService` read entirely from local PostgreSQL via `PrismaService`. `HttpModule` is removed from both feature modules. `SyncService` gains a transaction wrapper for location updates (DATA-04) and an in-memory mutex that prevents concurrent sync runs (DATA-05). `SyncService` already writes English-only programs — no filtering change needed there.

</domain>

<decisions>
## Implementation Decisions

### DB response shape
- **D-01:** `ProgramsService.findAll()` returns the same field shape as the current Opintopolku proxy: `oid`, `name`, `type`, `isDegree`, `imageUrl`, `fieldOfStudy`, `creditsAmount`, `creditsUnit`, `teachingLanguages`, and `providers` expanded from the `ProgramUniversity` join (oid + name from joined `University`). Match the proxy shape as closely as possible to avoid breaking callers.
- **D-02:** `ProgramsService.findOne()` returns the full rich shape — all stored scalar fields plus `implementations` (from the `Json?` column) and `universities` from the join. Match the current `mapProgramDetails` shape.
- **D-03:** `UniversitiesService.findAll()` returns: `oid`, `name`, `description`, `logoUrl`, `type`, `municipality`, `locations` (from `UniversityLocation`), `studentCount`. Match current proxy list shape.
- **D-04:** `UniversitiesService.findOne()` returns the full detail shape including `locations`, `website`, `email`, `studentCount`. Match current `mapDetailedInstitution` shape.
- **D-05:** `UniversitiesService.findPrograms()` returns the same list shape as `ProgramsService.findAll()`, filtered by university via the `ProgramUniversity` join table.

### Module cleanup
- **D-06:** Remove `HttpModule` from `ProgramsModule` and `UniversitiesModule` (DATA-03). `SyncModule` retains `HttpModule` — it still calls Opintopolku.
- **D-07:** `ProgramsService` and `UniversitiesService` inject `PrismaService` instead of `HttpService`. `PrismaModule` is already global — no module import change needed.

### Sync reliability
- **D-08:** Wrap the location delete + recreate in `upsertInstitution` in `prisma.$transaction()` (DATA-04). The two steps (`deleteMany` + `createMany`) must be atomic to prevent a window where locations are empty.
- **D-09:** Add an in-memory boolean mutex (`private isSyncing = false`) to `SyncService` (DATA-05). If `syncAll()` is called while `isSyncing` is true, log a warning and return early. This is v1-appropriate (single-process Node.js, no multi-instance deployment).

### Sync endpoint auth
- **D-10:** `POST /sync/run` stays **unguarded** — operational convenience, can be triggered from scripts without auth. Auth can be added in Phase 5 hardening if needed.

### Claude's Discretion
- Exact Prisma query structure for the programs list (include vs. select, how to expand ProgramUniversity → University name)
- Pagination implementation for DB queries (offset-based, matching existing `page`/`size` pattern)
- Error handling shape when a record is not found (NotFoundException vs. null return)
- Whether to keep the `lng` query param on DB-backed endpoints (it was used for proxy language resolution — it can be dropped or kept as a no-op for now)

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Requirements
- `.planning/REQUIREMENTS.md` — DATA-01 through DATA-05 define the exact acceptance criteria for this phase
- `.planning/ROADMAP.md` — Phase 2 goal, success criteria, and dependencies

### Existing services to replace
- `src/modules/programs/programs.service.ts` — Current HttpService-based proxy; this file is rewritten to use PrismaService
- `src/modules/universities/universities.service.ts` — Current HttpService-based proxy; rewritten to use PrismaService
- `src/modules/programs/programs.module.ts` — Must remove HttpModule import
- `src/modules/universities/universities.module.ts` — Must remove HttpModule import

### Sync service to fix
- `src/modules/sync/sync.service.ts` — `upsertInstitution` needs `$transaction` wrapper (DATA-04); `syncAll` needs mutex (DATA-05)

### Data model
- `prisma/schema.prisma` — Full schema: `Program`, `University`, `UniversityLocation`, `ProgramUniversity` join table. Read before writing queries.

### Shared infrastructure
- `src/providers/prisma.service.ts` — Global PrismaService; inject directly, no module import needed
- `src/common/guards/` — `JwtAuthGuard` and `RolesGuard` available if needed (sync endpoint staying unguarded per D-10)

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `PrismaService` (`src/providers/prisma.service.ts`): Global provider — inject via constructor, no module wiring required
- `SyncService` (`src/modules/sync/sync.service.ts`): Already handles English-only filtering at write time (`isEnglishTaught()`). Location upsert pattern exists but lacks transaction wrapper.
- `resolveLang` helper: Defined inline per-service — consistent pattern across the codebase

### Established Patterns
- Services inject dependencies via constructor only — no property injection
- `BadGatewayException` used for upstream failures — use `NotFoundException` for missing DB records
- Pagination uses `page` (0-indexed) + `size` params — carry this through to DB queries with `skip: page * size, take: size`
- `firstValueFrom()` pattern is specific to RxJS/HttpService — will be removed from ProgramsService and UniversitiesService

### Integration Points
- `src/modules/programs/programs.controller.ts` — Controller does not change; only the service is rewired
- `src/modules/universities/universities.controller.ts` — Controller does not change
- `ProgramUniversity` join table at `prisma/schema.prisma:79` — used to resolve `universities` for a program and `programs` for a university
- `UniversityLocation` at `prisma/schema.prisma:36` — used to resolve `locations` for a university

</code_context>

<specifics>
## Specific Ideas

- User explicitly wants program detail to include all info needed to link to A-Z guidance (Phase 3) — ensure `oid` is always returned prominently in both list and detail responses so guidance can be keyed on it.
- User wants `GET /universities` and `GET /universities/:oid` both working from DB — confirmed in scope.
- User wants `GET /programs` (list all programs) working from DB — confirmed in scope per DATA-01.

</specifics>

<deferred>
## Deferred Ideas

- Guarding `POST /sync/run` with admin auth — deferred to Phase 5 hardening (per D-10)
- DB-level sync mutex (survives restarts, multi-instance) — in-memory flag is sufficient for v1; revisit if multi-instance deployment is added

</deferred>

---

*Phase: 02-db-backed-apis*
*Context gathered: 2026-04-28*
