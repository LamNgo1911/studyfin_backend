# Phase 2: DB-Backed APIs - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-04-28
**Phase:** 02-db-backed-apis
**Areas discussed:** DB read response shape, Sync endpoint auth, Mutex strategy

---

## DB Read Response Shape

| Option | Description | Selected |
|--------|-------------|----------|
| Match proxy shape from DB | List returns rich fields + providers via join; findOne returns all stored fields including implementations JSON | ✓ |
| Minimal — OIDs only for providers | Use only native DB fields, providers as OID array only | |

**User's choice:** Match proxy shape from DB
**Notes:** User explicitly needs full program detail to support A-Z guidance linking in Phase 3. All endpoints (programs list, program detail, universities list, university detail, university programs) should return the same shape as the current Opintopolku proxy.

---

## University Programs Endpoint

| Option | Description | Selected |
|--------|-------------|----------|
| Same shape as programs list | Join ProgramUniversity → filter by universityId | ✓ |

**User's choice:** Same shape as programs list (inferred — user said "give me the best solution")

---

## Sync Endpoint Auth

| Option | Description | Selected |
|--------|-------------|----------|
| Guard with ADMIN role | POST /sync/run requires JwtAuthGuard + RolesGuard + @Roles('ADMIN') | |
| Leave unguarded | Operational convenience — trigger from scripts without auth | ✓ |

**User's choice:** Leave unguarded
**Notes:** User prefers operational convenience for v1. Can be added in Phase 5 hardening.

---

## Mutex Strategy for Concurrent Sync

| Option | Description | Selected |
|--------|-------------|----------|
| In-memory boolean flag | Simple, resets on restart, single-process friendly | ✓ |
| DB-level lock | Survives restarts, handles multi-instance | |

**User's choice:** In-memory boolean flag (Claude recommended; user deferred to recommendation)

---

## Claude's Discretion

- Exact Prisma query structure (include vs. select, join expansion)
- Pagination implementation for DB queries
- Error handling shape for missing records
- Whether to retain the `lng` query param on DB-backed endpoints

## Deferred Ideas

- Guarding POST /sync/run with admin auth — Phase 5 hardening
- DB-level sync mutex for multi-instance deployments
