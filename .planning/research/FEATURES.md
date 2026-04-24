# Feature Research

**Domain:** Education guidance / study-abroad backend — international students seeking English-taught programs in Finland
**Researched:** 2026-04-24
**Confidence:** HIGH (core feature categories); MEDIUM (competitor comparison specifics)

---

## Feature Landscape

### Table Stakes (Users Expect These)

Features users assume exist. Missing these = product feels incomplete or untrustworthy.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Program search with filters | Core job-to-be-done: find a program | MEDIUM | Filters: type (UAS/uni), field of study, city, level (bachelor/master). Already partially implemented via search module. |
| Program detail page API | Users need full info before applying | LOW | Name, description, ECTS credits, EQF level, teaching languages, degree titles, university, deadlines. Existing programs module proxies live; must be DB-backed. |
| Institution (university) listing and detail | Students research schools, not just programs | LOW | Name, type, city, website, email, logo, student count. Already in universities module; needs to serve from DB. |
| English-only data filtering | Target audience is international/English speakers; Finnish-only programs are noise | MEDIUM | Filter at sync time (already implemented in sync service for programs; institutions need review). |
| User account (register, login, profile) | Personalization and saved state requires auth | LOW | JWT auth, email verification, password reset — all implemented. Profile endpoint (GET/PATCH /users/me) is scaffolded but not exposed. |
| Saved / favorited programs | Students shortlist programs across sessions | LOW | UserProgram model exists with status field; needs controller CRUD endpoints. |
| A-Z guidance content per program | "How do I apply?" is the #1 question; without this, users go to competitor sites | HIGH | Steps: application, entrance exam, visa, accommodation, costs, arrival. This is editorial content tied to program or institution. Needs new Guidance content model and admin write path. |
| Unified search (institutions + programs together) | Homepage search box is expected on any modern platform | MEDIUM | Single endpoint returning mixed results, sorted by relevance. Currently institutions and programs are separate endpoints. |
| Pagination and sorting on all list endpoints | Required at any meaningful data volume | LOW | All list endpoints need stable cursor/offset pagination and sort options (alphabetical, relevance). |
| Proper error responses | Clients need machine-readable errors | LOW | Consistent error shape: `{ statusCode, message, error }`. NestJS default covers most; confirm alignment. |

### Differentiators (Competitive Advantage)

Features that set the product apart from studyinfo.fi, pass-uas.fi, and generic study-abroad aggregators.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| UAS entrance exam mock tests with section-accurate structure | pass-uas.fi charges EUR 39.95 one-time; this platform can monetize the same gap — UAS exam has 7 subject sections (reasoning, English, math, etc.). Existing TestTemplate/Question models cover this well. | HIGH | Implement field-specific section sets. Scoring with penalty marking (wrong = negative points on real exam). |
| Manual access gating for mock tests (admin-set flag) | Removes payment integration complexity for v1 while still enabling monetization through manual approval | LOW | Add `hasTestAccess` boolean to User model. Admin endpoint to set/unset. Guard on mock-test start route checks this flag. |
| Structured, step-by-step A-Z guidance per program type | Studyinfo.fi has raw data; this wraps it in "What do I do next?" editorial format international students actually need | HIGH | Guidance model with ordered steps, each step has title, body, optional external URLs, optional deadline anchors. API: GET /programs/:id/guidance, GET /universities/:id/guidance. |
| Field-of-study–specific exam sections | Students applying to Technology programs face different exam sections than Health Care students. Surfacing this is unique. | MEDIUM | Map program fieldOfStudy to exam section set. Already have subject field on TestTemplate. |
| DB-backed API with no live upstream dependency | Opintopolku can be slow (3-10 sec responses observed in proxy pattern). Serving from local PostgreSQL delivers sub-100ms responses. | MEDIUM | Already in progress: retire live proxy, serve from synced DB. Complete migration in this milestone. |
| User-program status tracking (saved / applying / applied) | Lightweight application tracking without being a full CRM; gives user a checklist feel | LOW | UserProgram.status field already in schema. Expose CRUD: POST /users/me/programs/:id, PATCH status, DELETE. |
| Admin endpoints for content and test management | Editorial team can update guidance steps and create mock test templates without touching the DB directly | MEDIUM | Needs role guard (ADMIN role on User). Endpoints: CRUD /admin/guidance, CRUD /admin/test-templates, PATCH /admin/users/:id/test-access. |

### Anti-Features (Commonly Requested, Often Problematic)

| Feature | Why Requested | Why Problematic | Alternative |
|---------|---------------|-----------------|-------------|
| Live Opintopolku proxy (keep existing) | "Why sync when we can just proxy?" sounds simpler | Rate limits, slow upstream responses (3-10s), messy Finnish field keys bleed into API responses, no control over data shape | Sync once per day to PostgreSQL, serve from local DB. Already the chosen direction. |
| Payment integration (Stripe webhooks, subscription management) | Monetization is the goal | Adds significant complexity: webhook handling, idempotency, failed payment flows, PCI scope; blocks launch for weeks | Manual access gating (admin sets flag per user) is sufficient for v1 at small scale (~$20-30/year, low volume) |
| Real-time features (WebSocket, SSE) | "Live" application status updates sound polished | No use case warrants it; students do not need millisecond updates on their shortlist; Redis is provisioned but unused by app | REST polling from frontend on user-initiated actions is perfectly sufficient |
| AI-generated guidance content | LLMs can draft guidance copy faster | Guidance content about Finnish visa rules, Migri processes, and application deadlines can be wrong in dangerous ways; legal/immigration domain requires human editorial sign-off | Semi-automated: pull structured data from Opintopolku + Migri official sources, editorial layer finalizes |
| OAuth / social login | Users request Google/Facebook login | Adds dependency on external provider, token refresh complexity, account linking edge cases; auth is already working | Email/password + JWT is sufficient for v1; defer social login to post-PMF |
| Full application submission (to universities) | Seems like natural extension | Universities already have Studyinfo/HAREK application systems; duplicating this creates compliance/data risk and would require deep integrations | Guide users to apply via official channels; provide links/deadlines but don't process applications |
| Mobile push notifications | Engagement mechanism | Requires FCM/APNs integration, device token management, GDPR consent flows; no mobile app in scope | Email notifications via transactional email (Resend/SES) when needed; defer push to mobile milestone |
| Search autocomplete / typeahead endpoint | Good UX | Requires separate optimized endpoint (Postgres trigram index or Elasticsearch); premature at current data volume | Full-text search on PostgreSQL with `tsvector` is sufficient for v1; add autocomplete when user feedback confirms need |

---

## Feature Dependencies

```
[A-Z Guidance content system]
    └──requires──> [Admin write endpoints]
                       └──requires──> [Role-based access (ADMIN role on User)]
                                          └──requires──> [User model has role field]

[Mock test access gating]
    └──requires──> [User model has hasTestAccess field]
    └──requires──> [Admin endpoint to set/unset flag]
                       └──requires──> [Role-based access (ADMIN role on User)]

[UserProgram status tracking (save/apply)]
    └──requires──> [JWT auth guard on endpoints]
                       └──requires──> [JWT auth — already implemented]

[DB-backed program and university API]
    └──requires──> [English-only sync filtering complete]
                       └──requires──> [Daily cron sync (already running)]

[Unified search (institutions + programs)]
    └──requires──> [DB-backed program and university API]

[Field-specific mock test sections]
    └──enhances──> [UAS mock tests]
    └──requires──> [Program fieldOfStudy correctly synced]

[A-Z guidance steps]
    └──enhances──> [Program detail API]
    └──enhances──> [Institution detail API]

[Admin test template management]
    └──enhances──> [Mock test system]
    └──requires──> [Role-based access (ADMIN role on User)]
```

### Dependency Notes

- **Role-based access is the root dependency for admin features:** Both the guidance CMS and mock test access gating require an `ADMIN` role on User. This must be implemented before any admin endpoints. Requires adding `role` field to User model (Prisma migration) and a `RolesGuard` + `@Roles()` decorator.
- **English-only sync must complete before retiring the proxy:** The live proxy is the fallback while sync data may be incomplete. Retire proxy only after confirming sync produces complete, accurate data.
- **UserProgram endpoints depend only on existing JWT auth:** No new model changes needed; just controller + service implementation.
- **Unified search is additive:** Existing separate search endpoints remain; unified search is a new endpoint that aggregates them.

---

## MVP Definition

This is a subsequent milestone (v2 of a working system), so "MVP" here means minimum viable milestone: what must ship to deliver the milestone's value.

### Launch With (v1 of this milestone)

- [x] English-only sync filtering verified complete (programs — sync.service already filters; institutions need review)
- [ ] DB-backed institution and program APIs replacing live Opintopolku proxy — core reliability win
- [ ] User profile endpoint (GET /users/me, PATCH /users/me) — needed for any personalization
- [ ] User-program save/status endpoints (POST/PATCH/DELETE /users/me/programs/:id) — shortlisting
- [ ] Admin role on User model + RolesGuard — unlocks all admin features
- [ ] Admin guidance content CRUD — allows editorial team to create A-Z guidance
- [ ] Guidance read endpoints (GET /programs/:id/guidance, GET /universities/:id/guidance) — surfaces guidance to frontend
- [ ] Mock test hasTestAccess flag + admin toggle endpoint — monetization gating without payment infra
- [ ] Unified search endpoint (GET /search — institutions + programs combined) — homepage search

### Add After Validation (v1.x)

- [ ] Application deadline fields on Program guidance — add when editorial team has deadline data
- [ ] Cost/scholarship section in guidance — useful but requires reliable cost data per program
- [ ] Field-specific exam section tagging on TestTemplate — when mock test content library has enough variety
- [ ] Saved universities (GET/POST/DELETE /users/me/universities/:id) — analogous to saved programs; lower priority initially

### Future Consideration (v2+)

- [ ] Full-text search with `tsvector` (PostgreSQL) or Meilisearch — when data volume or query quality becomes limiting
- [ ] Email notifications (application deadline reminders) — requires transactional email integration (Resend/SES)
- [ ] Payment integration for mock test access — when user volume justifies replacing manual gating
- [ ] Autocomplete/typeahead search endpoint — when frontend team identifies UX need
- [ ] Usage analytics API (admin dashboard data) — when editorial team needs content performance metrics

---

## Feature Prioritization Matrix

| Feature | User Value | Implementation Cost | Priority |
|---------|------------|---------------------|----------|
| DB-backed program/institution API (retire proxy) | HIGH | MEDIUM | P1 |
| Admin role + RolesGuard | HIGH | LOW | P1 |
| A-Z guidance content model + admin CRUD | HIGH | MEDIUM | P1 |
| Guidance read endpoints | HIGH | LOW | P1 |
| Mock test access gating (hasTestAccess flag) | HIGH | LOW | P1 |
| User profile endpoints (GET/PATCH /users/me) | MEDIUM | LOW | P1 |
| User-program save/status (shortlisting) | MEDIUM | LOW | P1 |
| Unified search endpoint | MEDIUM | MEDIUM | P1 |
| Admin test template management | MEDIUM | MEDIUM | P2 |
| Saved universities endpoints | LOW | LOW | P2 |
| Field-specific exam section tagging | MEDIUM | LOW | P2 |
| Application deadline fields in guidance | HIGH | LOW | P2 |
| Email notifications | MEDIUM | HIGH | P3 |
| Full-text tsvector search | MEDIUM | MEDIUM | P3 |
| Payment integration | HIGH | HIGH | P3 |

**Priority key:**
- P1: Must have for this milestone launch
- P2: Should have, add when P1 is stable
- P3: Future milestone — defer explicitly

---

## Competitor Feature Analysis

| Feature | studyinfo.fi (Opintopolku) | pass-uas.fi | StudyFin (this platform) |
|---------|---------------------------|-------------|--------------------------|
| English program search | Yes (all languages mixed) | No | English-only, filtered at sync |
| Program detail | Yes (Finnish-centric fields) | No | Normalized English fields |
| Institution profiles | Yes | No | Yes, from synced DB |
| A-Z application guidance | Partial (bare facts) | No | Structured editorial steps |
| UAS mock tests | No | Yes (~EUR 39.95 one-time) | Yes (manual access gating, ~$20-30/yr) |
| User accounts / saved programs | No | No | Yes (JWT auth + UserProgram) |
| Exam section accuracy (7 sections) | N/A | Partial | Full section mapping planned |
| Response speed | Slow (live upstream) | N/A | Fast (DB-backed, <100ms) |
| Admin content management | N/A | Unknown | Yes (admin API endpoints) |

---

## Sources

- [uasinfo.fi — International UAS Exam structure 2026](https://www.uasinfo.fi/international-uas-exam/)
- [pass-uas.fi — competitor UAS prep platform and pricing](https://www.pass-uas.fi/)
- [studyinfinland.fi — official Finnish study guidance portal](https://www.studyinfinland.fi/)
- [ApplyBoard — study abroad platform features](https://www.applyboard.com/)
- [NestJS RBAC patterns 2026](https://copyprogramming.com/howto/typescript-how-to-user-role-in-nestjs)
- [Opintopolku — upstream data source](https://opintopolku.fi)
- [Studyportals — program search feature patterns](https://studyportals.com)

---
*Feature research for: StudyFin backend — education guidance / study-in-Finland platform for international students*
*Researched: 2026-04-24*
