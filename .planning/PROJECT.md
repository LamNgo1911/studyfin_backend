# StudyFin Backend

## What This Is

A backend API for international students who want to study English-taught programs in Finland. It aggregates data from Finland's national Opintopolku API (universities, UAS, vocational schools, and their programs), normalizes messy multilingual fields, and serves a clean own API. The platform provides A-Z guidance for each program (application process, visa, housing, etc.) and offers paid UAS entrance exam mock tests as the monetization layer.

## Core Value

International students can discover and search all English-taught higher education programs in Finland from a single, reliable source — and get step-by-step guidance on how to apply.

## Requirements

### Validated

- ✓ Opintopolku institution proxy (universities, UAS) — existing
- ✓ Opintopolku program proxy with detail fetching — existing
- ✓ Daily cron-based data sync from Opintopolku to PostgreSQL — existing
- ✓ JWT authentication (register, login, refresh, email verify, password reset) — existing
- ✓ DB-backed institution and program search — existing
- ✓ Mock test system (templates, questions, attempts, scoring) — existing
- ✓ Prisma schema with 13 models (University, Program, User, Auth, MockTest, etc.) — existing
- ✓ Global PrismaService with PostgreSQL adapter — existing
- ✓ English-only program filtering at sync time (Phase 01; cleanup script ready, DB cleanup pending operational run)
- ✓ Clean API layer — programs and universities served from local PostgreSQL, Opintopolku live proxy retired (Phase 02)

### Active

- [ ] A-Z guidance content system (application steps, visa, housing, costs per program)
- [ ] Program-specific info pages API (requirements, deadlines, what to expect)
- [ ] Admin API endpoints for managing guidance content and mock test templates
- [ ] Homepage search API (institutions + programs, unified search)
- [ ] User-program relationships (saved/favorited programs, application tracking)
- [ ] Manual access gating for mock tests (admin-set flag, no payment integration yet)

### Out of Scope

- Payment integration (Stripe, etc.) — defer to future milestone; manual gating sufficient for now
- Frontend application — separate repo (`studyfin_frontend`), not part of this backend scope
- Admin panel UI — frontend team handles this; backend provides admin API endpoints only
- AI-generated content — guidance content is semi-automated (pulled from Opintopolku + manual editorial)
- Real-time features (WebSocket, SSE) — not needed for current use case
- OAuth/social login — email/password auth sufficient for v1
- Mobile app API differences — single API serves web frontend

## Context

- **Existing codebase:** NestJS 11 monolith with TypeScript 5.7, Prisma 7.6, PostgreSQL 16
- **Data source:** `opintopolku.fi/konfo-backend` — Finland's national education API; fields often use Finnish keys instead of English; API can be slow/rate-limited
- **Sync strategy:** Daily midnight cron pulls all institutions and programs, upserts into local PostgreSQL; filtering to English-only programs at sync time (Phase 01). SyncService has in-process mutex to prevent concurrent runs.
- **Data access:** All program and institution modules (Programs, Universities) now serve from local PostgreSQL via PrismaService. Opintopolku is only contacted during sync. (Phase 02 — live proxy retired.)
- **Target users:** International students researching Finland as a study destination
- **Monetization:** ~$20-30/year access fee for UAS entrance exam mock tests; free tier includes search and A-Z guidance
- **Frontend:** Separate `studyfin_frontend` repo at same directory level; consumes this backend API
- **Infrastructure:** Docker Compose with PostgreSQL 16 + Redis 7 (Redis provisioned but unused)

## Constraints

- **Tech stack**: NestJS 11 + Prisma + PostgreSQL — established, no migration
- **Data source**: Opintopolku API is the only upstream; Finnish field names must be handled in sync layer
- **Scope**: Backend API + admin endpoints only; no frontend changes
- **Auth**: JWT-based auth already implemented; extend, don't replace
- **English-only**: Only English-taught programs stored after sync filtering

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Filter English programs at sync time, not query time | Keeps DB focused, simpler queries, less storage waste | ✓ Done (Phase 01) |
| Serve all data from local DB, retire Opintopolku live proxy | Avoids rate limits, normalizes Finnish field mess, faster responses | ✓ Done (Phase 02) |
| Manual access gating for mock tests (no payment integration) | Keeps v1 simple; payment integration deferred to future milestone | — Pending |
| Semi-automated guidance content (Opintopolku data + manual editorial) | Balance between automation and content quality | — Pending |
| Admin API endpoints only (no admin UI) | Frontend team handles admin panel in separate repo | — Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-04-28 after Phase 02 completion*
