---
gsd_state_version: 1.0
milestone: v1.0
milestone_name: milestone
status: executing
stopped_at: Phase 4 context gathered
last_updated: "2026-05-01T08:52:59.022Z"
last_activity: 2026-05-01 -- Phase 4 planning complete
progress:
  total_phases: 5
  completed_phases: 3
  total_plans: 15
  completed_plans: 11
  percent: 73
---

# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-04-25)

**Core value:** International students can discover and search all English-taught higher education programs in Finland from a single, reliable source — and get step-by-step guidance on how to apply.
**Current focus:** Phase 04 — pending planning

## Current Position

Phase: 03 (guidance-content) — COMPLETE
Plan: 4 of 4
Plans: 4/4 complete
Status: Ready to execute
Last activity: 2026-05-01 -- Phase 4 planning complete

Progress: [██████████] 60% (v1.0 overall: 3/5 phases done)

## Performance Metrics

**Velocity:**

- Total plans completed: 11
- Average duration: -
- Total execution time: 0.0 hours

**By Phase:**

| Phase | Plans | Total | Avg/Plan |
|-------|-------|-------|----------|
| 01 | 4 | 4 | - |
| 02 | 3 | 3 | - |
| 03 | 4 | 4 | - |

**Recent Trend:**

- Last 5 plans: Phase 03 plans
- Trend: -

*Updated after each plan completion*
| Phase 01 P01 | 449 | 2 tasks | 2 files |
| Phase 01-rbac-foundation P02 | 360 | 2 tasks | 4 files |
| Phase 01-rbac-foundation P04 | checkpoint-resumed | 2 tasks | 2 files |
| Phase 02-db-backed-apis P01 | ProgramsService → PrismaService | 2 tasks | 3 files |
| Phase 02-db-backed-apis P02 | UniversitiesService → PrismaService | 2 tasks | 3 files |
| Phase 02-db-backed-apis P03 | SyncService mutex + $transaction | 1 task | 2 files |
| Phase 03-guidance-content P01 | GuidanceSection Prisma model + db push | 2 tasks | 1 file |
| Phase 03-guidance-content P02 | DTOs + GuidanceService | 2 tasks | 4 files |
| Phase 03-guidance-content P03 | GuidanceController + GuidanceModule wiring | 2 tasks | 3 files |
| Phase 03-guidance-content P04 | hasGuidance flag + unit tests | 2 tasks | 3 files |

## Accumulated Context

### Decisions

Decisions are logged in PROJECT.md Key Decisions table.
Recent decisions affecting current work:

- Filter English-only programs at sync time; run one-time DB cleanup before retiring the Opintopolku proxy
- Role read from DB on every request (not in JWT) so mock test access revocation takes effect immediately
- Guidance content stored in a separate table that SyncService never touches (prevents Opintopolku sync from overwriting editorial content)
- `@nestjs/cache-manager` v3+ requires `@keyv/redis` adapter — do NOT use `cache-manager-redis-store`
- Role enum placed above the User model comment block in schema.prisma; role field positioned between lastName and emailVerifiedAt per D-01 ordering
- role typed as string in CurrentUserData (not Prisma enum) so the decorator file does not import from generated/prisma across regenerations
- Role read from DB on every authenticated request (not from JWT payload) — immediate revocation capability (FOUND-03)
- Used Reflector.createDecorator<string[]>() for Roles decorator (NestJS 10+ typed API, not SetMetadata)
- Canonical role casing is ADMIN/USER (uppercase) matching Prisma enum — all planning docs and future @Roles() decorators must use uppercase strings
- FOUND-02 (hasTestAccess field) formally moved to Phase 4 ownership; Phase 4 requirements list now includes FOUND-02 explicitly
- ProgramsService reads from PostgreSQL via PrismaService; uses $transaction([count, findMany]) for atomic pagination
- UniversitiesService reads from PostgreSQL via PrismaService; uses $transaction for findAll and findPrograms; findPrograms uses ProgramUniversity join
- SyncService uses in-memory mutex (isSyncing flag) for single-process concurrent sync prevention; Prisma $transaction for atomic location upsert

### Pending Todos

None yet.

### Blockers/Concerns

- Phase 5: Prisma `fullTextSearchPostgres` is still a preview feature — validate relevance scoring with real synced data before relying on it
- Known: Only one refresh token per user (single-device session); acceptable for v1 but must be addressed before broad marketing

## Deferred Items

| Category | Item | Status | Deferred At |
|----------|------|--------|-------------|
| Payments | Stripe integration | v2 | Init |
| Auth | OAuth/social login | v2 | Init |
| Search | Autocomplete/typeahead | v2 | Init |
| Mock tests | Admin template CRUD | v2 | Init |
| Notifications | Email deadline reminders | v2 | Init |

## Session Continuity

Last session: 2026-05-01T08:33:59.771Z
Stopped at: Phase 4 context gathered

**Next step:** `/gsd-next` to plan Phase 4, or `/gsd-code-review-fix 03` to address code review findings first.
