# Phase 4: User Features - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-05-01
**Phase:** 04-user-features
**Areas discussed:** Profile response shape, Saved program statuses, Mock test access gating, Admin user management

---

## Profile Response Shape

### Q1: What should GET /users/me return?

| Option | Description | Selected |
|--------|-------------|----------|
| Curated safe subset | Return id, email, firstName, lastName, role, emailVerifiedAt, createdAt. Omits passwordHash, tokens, and reset fields. | ✓ |
| Full model minus password | Return all User columns except passwordHash. Includes internal fields like resetToken timestamps. | |
| You decide | Let Claude decide based on what makes sense for a student-facing API. | |

**User's choice:** Curated safe subset (Recommended)

### Q2: What fields should PATCH /users/me allow updating?

| Option | Description | Selected |
|--------|-------------|----------|
| Name fields only | Users can update firstName and lastName only. Email changes require a separate verification flow (not in scope). | ✓ |
| Name + email | Allow firstName, lastName, and email. Email change triggers re-verification. | |
| You decide | Let Claude decide what's reasonable for v1. | |

**User's choice:** Name fields only (Recommended)

### Q3: Should the profile response include hasTestAccess status and saved program count?

| Option | Description | Selected |
|--------|-------------|----------|
| Yes, include both | Include hasTestAccess boolean and savedProgramCount in the /users/me response so the frontend knows what to show. | ✓ |
| No, keep profile minimal | Keep /users/me lean — frontend can call separate endpoints for test access and saved programs. | |
| You decide | Let Claude decide what's practical. | |

**User's choice:** Yes, include both

---

## Saved Program Statuses

### Q1: What values should the status field support?

| Option | Description | Selected |
|--------|-------------|----------|
| Fixed enum | Define a set of allowed statuses: 'interested', 'applying', 'applied', 'accepted', 'rejected'. Validates on save/update. | ✓ |
| Free text | The status field accepts any string. Frontend defines its own labels. | |
| No status, just save/unsave | Don't use statuses at all — saved programs are just a simple favorites list. | |

**User's choice:** Fixed enum (Recommended)

### Q2: What should the initial status be when saving a program?

| Option | Description | Selected |
|--------|-------------|----------|
| Default 'interested' | Default to 'interested' when a program is first saved. User can update to other statuses later. | ✓ |
| User must choose on save | Require the user to pick a status when saving. No default. | |
| You decide | Let Claude decide what's practical. | |

**User's choice:** Default 'interested' (Recommended)

### Q3: Should GET /users/me/programs support filtering by status?

| Option | Description | Selected |
|--------|-------------|----------|
| List all, no filtering | GET /users/me/programs returns all saved programs with their statuses. No status-based filtering. | |
| Optional status filter | Support optional ?status=applying query param to filter the saved programs list. | ✓ |
| You decide | Let Claude decide what's practical. | |

**User's choice:** Optional status filter (Recommended)

### Q4: What should saved programs list include?

| Option | Description | Selected |
|--------|-------------|----------|
| Include basic program info | Return id, programId, status, createdAt, plus the program's name, oid, type, and fieldOfStudy for display. | ✓ |
| UserProgram fields only | Return only UserProgram fields. Frontend must call /programs/:oid separately. | |
| You decide | Let Claude decide. | |

**User's choice:** Include basic program info (Recommended)

---

## Mock Test Access Gating

### Q1: How should the admin grant/revoke mock test access?

| Option | Description | Selected |
|--------|-------------|----------|
| Single toggle endpoint | Single PATCH /admin/users/:id/mock-test-access with { hasTestAccess: true/false } in the body. | ✓ |
| Separate grant/revoke | Separate POST .../grant and POST .../revoke endpoints. More explicit but more routes. | |

**User's choice:** Single toggle endpoint (Recommended)

### Q2: What happens when access is revoked mid-test?

| Option | Description | Selected |
|--------|-------------|----------|
| Block new starts only | Return 403 on startTest but don't cancel active attempts. If access was granted when they started, they can finish. | ✓ |
| Cancel active attempts too | Revoke immediately cancels any in-progress mock test attempts for that user. | |
| You decide | Let Claude decide. | |

**User's choice:** Block new starts only (Recommended)

### Q3: Where should the hasTestAccess check be enforced?

| Option | Description | Selected |
|--------|-------------|----------|
| Gate startTest only | Check hasTestAccess in MockTestsService.startTest() only. View templates and list history remain accessible. | ✓ |
| Gate startTest + template listing | Gate startTest AND template listing. Users without access can't even browse available tests. | |
| You decide | Let Claude decide. | |

**User's choice:** Gate startTest only (Recommended)

---

## Admin User Management

### Q1: Should admins be able to list/search users?

| Option | Description | Selected |
|--------|-------------|----------|
| Paginated list + search | Add GET /admin/users with pagination and optional email search. Admins need to find users to manage their test access. | ✓ |
| No user listing | No listing endpoint. Admins must already know the user ID. | |
| You decide | Let Claude decide. | |

**User's choice:** Paginated list + search (Recommended)

### Q2: Where should admin endpoints live?

| Option | Description | Selected |
|--------|-------------|----------|
| Separate AdminModule | Create a new AdminModule with AdminController under /admin/* routes. Keeps admin logic separate. | ✓ |
| Add to UsersController | Add admin routes to UsersController with guard decoration. Simpler but mixes concerns. | |
| You decide | Let Claude decide. | |

**User's choice:** Separate AdminModule (Recommended)

### Q3: What should GET /admin/users return per user?

| Option | Description | Selected |
|--------|-------------|----------|
| Management-focused subset | Return id, email, firstName, lastName, role, hasTestAccess, emailVerifiedAt, createdAt. Enough for admin to manage users. | ✓ |
| Same as user profile | Same curated subset as GET /users/me. Admins see the same fields as users. | |
| You decide | Let Claude decide. | |

**User's choice:** Management-focused subset (Recommended)

---

## Claude's Discretion

- Exact DTO class structure and validation decorators
- Whether to add GET /admin/users/:id single-user detail endpoint
- Error messages and HTTP status codes for edge cases
- Whether savedProgramCount is computed via _count or separate query
- Unit test structure and coverage

## Deferred Ideas

- Saving/favoriting universities (USER-10, USER-11) — v2
- Admin ability to change user roles — not in requirements
- Bulk mock test access management — not in requirements
