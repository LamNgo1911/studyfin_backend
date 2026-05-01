# Phase 5: Search and Infrastructure - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-05-01
**Phase:** 05-search-and-infrastructure
**Areas discussed:** Unified search design, Caching scope & invalidation, Rate limiting thresholds, Swagger coverage scope

---

## Unified Search Design

| Option | Description | Selected |
|--------|-------------|----------|
| Replace existing GET /search with full-text | Rewrite search() to use fullTextSearchPostgres with relevance scoring. Keep `type` param. Keep /search/institutions as-is. | |
| Mixed results + type filter | Programs AND institutions in single hits array with `type` discriminator. `?type=` still filters. Relevance scoring. | ✓ |
| Keep existing + add mixed endpoint | Keep existing endpoints, add new GET /search/unified. Least disruptive. | |

**User's choice:** "what you recommend" → Mixed results + type filter (recommended by Claude)
**Notes:** This matches SRCH-02's explicit "mixed programs + institutions" requirement. PostgreSQL relevance ranking naturally sorts across both types.

| Option | Description | Selected |
|--------|-------------|----------|
| Deprecate GET /search/institutions | Keep it but undocumented for backward compat | |
| Keep it untouched | Leave as-is for legacy callers | |
| Remove it | Delete the route entirely, breaking change | ✓ |

**User's choice:** Remove it
**Notes:** Cleanest option. All callers migrate to GET /search?q=&type=institutions.

---

## Caching Scope & Invalidation

| Option | Description | Selected |
|--------|-------------|----------|
| Lists only | Cache GET /programs, /universities, /search only | |
| Lists + details | Cache list AND detail endpoints (GET /programs/:oid, /universities/:oid) | ✓ |
| Lists + details + guidance | Also cache guidance endpoints | |

**User's choice:** "what you recommend" → Lists + details (recommended by Claude)
**Notes:** Small incremental cost to add detail endpoints, same 24h TTL, details are what users click through to after search.

| Option | Description | Selected |
|--------|-------------|----------|
| Pure TTL only | 24h TTL, no active invalidation | |
| TTL + sync-triggered invalidation | SyncService clears cache keys after successful sync | ✓ |
| TTL + manual admin invalidation | Admin endpoint for cache flushing | |

**User's choice:** "what you recommend" → TTL + sync-triggered (recommended by Claude)
**Notes:** Minimal coupling (one method call in SyncService.syncAll()). No new admin endpoints needed.

---

## Rate Limiting Thresholds

| Option | Description | Selected |
|--------|-------------|----------|
| Moderate: 100 req/60s | 100 requests per 60s per IP for public endpoints | ✓ |
| Strict: 20 req/60s | NestJS default, tight for API | |
| Generous: 300 req/60s | Lenient for normal usage | |

**User's choice:** "you recommend" → 100 req/60s (recommended by Claude)
**Notes:** Handles real browsing patterns (paginating through search, checking multiple programs) without being restrictive.

| Option | Description | Selected |
|--------|-------------|----------|
| Admin 30, auth 10 | Admin: 30 req/60s, Auth: 10 req/60s | ✓ |
| Same limits everywhere | 100 req/60s for all routes | |
| Admin 30, auth 5 | Auth at 5 req/60s (strongest brute force protection) | |

**User's choice:** "you recommend" → Admin 30, auth 10 (recommended by Claude)
**Notes:** Auth at 10 prevents brute force without locking out legitimate users who mistype passwords.

---

## Swagger Coverage Scope

| Option | Description | Selected |
|--------|-------------|----------|
| All public + search endpoints | Programs, universities, search, guidance, sync, auth, user profile. ~15-20 endpoints. | ✓ |
| Just search + data endpoints | Search + programs + universities only. ~8-10 endpoints. | |
| All endpoints including admin | Complete documentation including admin. Largest scope. | |

**User's choice:** All public + search endpoints
**Notes:** Covers everything the frontend team actually calls.

| Option | Description | Selected |
|--------|-------------|----------|
| Input DTOs + response shapes | @ApiProperty on DTOs + @ApiResponse on controllers | |
| Input DTOs only | @ApiProperty on request body and query DTOs only | ✓ |
| You decide | Claude decides approach | |

**User's choice:** "You decide" → Input DTOs only (Claude's recommendation)
**Notes:** Response shapes inferred from TypeScript return types. Adding @ApiResponse on 15+ endpoints adds significant scope without proportional benefit.

---

## Claude's Discretion

Areas where user deferred to Claude's judgment:
- Cache scope (lists + details recommended and accepted)
- Cache invalidation (sync-triggered recommended and accepted)
- Public rate limit (100 req/60s recommended and accepted)
- Admin/auth rate limits (30/10 recommended and accepted)
- Swagger DTO depth (input DTOs only recommended and accepted)

## Deferred Ideas

- Guarding POST /sync/run with admin auth — considered during Phase 2 (D-10) and this discussion; left unguarded for operational convenience
- Advanced search (autocomplete, Meilisearch) — v2 per REQUIREMENTS.md
