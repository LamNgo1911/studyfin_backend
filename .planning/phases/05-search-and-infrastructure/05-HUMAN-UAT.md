---
status: partial
phase: 05-search-and-infrastructure
source: [05-VERIFICATION.md]
started: 2026-05-01
updated: 2026-05-01
---

## Current Test

[awaiting human testing]

## Tests

### 1. Swagger UI visual inspection
expected: Browse to http://localhost:3000/api — see Programs, Universities, Guidance, Sync, Auth, Users groups with correct endpoints. Auth and Users should show lock icons. Admin endpoints should NOT appear in Swagger.
result: [pending]

### 2. Auth rate limit
expected: Send >10 requests to any auth endpoint (e.g., POST /auth/login) within 60 seconds. 11th request returns 429 Too Many Requests.
result: [pending]

### 3. Admin rate limit
expected: Send >30 requests to any admin endpoint within 60 seconds. 31st request returns 429 Too Many Requests.
result: [pending]

### 4. GIN indexes in PostgreSQL
expected: Run `SELECT indexname FROM pg_indexes WHERE tablename IN ('Program', 'University') AND indexdef LIKE '%gin%';` — should show GIN indexes on both tables.
result: [pending]

## Summary

total: 4
passed: 0
issues: 0
pending: 4
skipped: 0
blocked: 0

## Gaps
