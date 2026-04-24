# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-04-25)

**Core value:** International students can discover and search all English-taught higher education programs in Finland from a single, reliable source — and get step-by-step guidance on how to apply.
**Current focus:** Phase 1 — RBAC Foundation

## Current Position

Phase: 1 of 5 (RBAC Foundation)
Plan: 0 of TBD in current phase
Status: Ready to plan
Last activity: 2026-04-25 — Roadmap created (5 phases, 34 requirements mapped)

Progress: [░░░░░░░░░░] 0%

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

## Accumulated Context

### Decisions

Decisions are logged in PROJECT.md Key Decisions table.
Recent decisions affecting current work:

- Filter English-only programs at sync time; run one-time DB cleanup before retiring the Opintopolku proxy
- Role read from DB on every request (not in JWT) so mock test access revocation takes effect immediately
- Guidance content stored in a separate table that SyncService never touches (prevents Opintopolku sync from overwriting editorial content)
- `@nestjs/cache-manager` v3+ requires `@keyv/redis` adapter — do NOT use `cache-manager-redis-store`

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

Last session: 2026-04-25
Stopped at: Roadmap written; STATE.md initialized; ready to plan Phase 1
Resume file: None
