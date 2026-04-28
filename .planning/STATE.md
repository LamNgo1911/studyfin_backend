---
gsd_state_version: 1.0
milestone: v1.0
milestone_name: milestone
status: executing
stopped_at: Completed 01-04-PLAN.md - Gap closure for role casing, FOUND-02 reassignment
last_updated: "2026-04-28T00:00:00Z"
last_activity: 2026-04-27 -- Phase 01 execution started
progress:
  total_phases: 5
  completed_phases: 0
  total_plans: 4
  completed_plans: 3
  percent: 75
---

# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-04-25)

**Core value:** International students can discover and search all English-taught higher education programs in Finland from a single, reliable source — and get step-by-step guidance on how to apply.
**Current focus:** Phase 01 — RBAC Foundation

## Current Position

Phase: 01 (RBAC Foundation) — EXECUTING
Plan: 4 of 4 (complete)
Status: Phase 01 complete — all 4 plans executed
Last activity: 2026-04-28 -- Phase 01 plan 04 gap closure complete

Progress: [███████░░░] 75%

## Performance Metrics

**Velocity:**

- Total plans completed: 0
- Average duration: -
- Total execution time: 0.0 hours

**By Phase:**

| Phase | Plans | Total | Avg/Plan |
|-------|-------|-------|----------|
| - | - | - | - |

**Recent Trend:**

- Last 5 plans: -
- Trend: -

*Updated after each plan completion*
| Phase 01 P01 | 449 | 2 tasks | 2 files |
| Phase 01-rbac-foundation P02 | 360 | 2 tasks | 4 files |
| Phase 01-rbac-foundation P04 | checkpoint-resumed | 2 tasks | 2 files |

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

Last session: 2026-04-28T00:00:00Z
Stopped at: Completed 01-04-PLAN.md - Gap closure for role casing, FOUND-02 reassignment
Resume file: None

**Planned Phase:** 1 (RBAC Foundation) — 3 plans — 2026-04-25T09:45:35.192Z
