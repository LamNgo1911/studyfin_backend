# Architecture

**Analysis Date:** 2026-04-24

## Pattern Overview

**Overall:** NestJS modular monolith with dual data-access strategies

**Key Characteristics:**
- Feature modules under `src/modules/` follow a strict controller-service-DTO pattern
- Two distinct data-access modes coexist: live-proxy (HttpService → Opintopolku API) and DB-backed (PrismaService → PostgreSQL)
- A scheduled sync service (`SyncModule`) bridges both modes: it polls the upstream API and writes normalized data into the database
- JWT-based authentication via Passport; guards applied per-route, not globally
- `ValidationPipe` is applied per-endpoint (not globally), with `transform: true` and `whitelist: true`
- No global exception filter, interceptors, or middleware; all cross-cutting concerns are applied locally

## Layers

**HTTP Layer (Controllers):**
- Purpose: Receive HTTP requests, parse and validate inputs, delegate to service, return response
- Location: `src/modules/<feature>/<feature>.controller.ts`
- Contains: `@Controller`, `@Get`/`@Post` decorators, `ValidationPipe` instantiation, `@UseGuards`, `@CurrentUser`
- Depends on: Feature service, DTOs, guards, decorators
- Used by: NestJS HTTP adapter

**Business Logic Layer (Services):**
- Purpose: Orchestrate data retrieval, transformation, and persistence
- Location: `src/modules/<feature>/<feature>.service.ts`
- Contains: All domain logic, proxy calls via `HttpService`, Prisma queries, error throwing
- Depends on: `PrismaService` (via global module injection), `HttpService` (imported per-module), upstream config
- Used by: Controllers within same module; `AuthService` depends on `UsersService`

**Data Access Layer:**
- Purpose: Typed interface to PostgreSQL database
- Location: `src/providers/prisma.service.ts`, `generated/prisma/`
- Contains: `PrismaService` extending `PrismaClient`, Prisma-generated types and client
- Depends on: `DATABASE_URL` environment variable
- Used by: Any service — PrismaModule is `@Global()` so no per-module import needed

**Shared Infrastructure:**
- Purpose: Cross-cutting concerns reusable across all modules
- Location: `src/common/guards/`, `src/common/decorators/`
- Contains: `JwtAuthGuard` (wraps Passport `AuthGuard('jwt')`), `CurrentUser` param decorator
- Note: `src/common/filters/`, `src/common/interceptors/`, `src/common/middleware/`, `src/common/pipes/`, `src/common/utils/` all exist as empty placeholder directories

**Configuration Layer:**
- Purpose: Centralized external constants
- Location: `src/config/opintopolku.config.ts`
- Contains: `OPINTOPOLKU_BASE` constant (`https://opintopolku.fi/konfo-backend`)
- Note: `src/config/.gitkeep` exists — config directory is otherwise a placeholder

## Module Dependency Graph

```
AppModule
├── PrismaModule (@Global)        → provides PrismaService to all modules
├── ScheduleModule.forRoot()      → enables @Cron decorators
├── SyncModule
│   ├── HttpModule
│   ├── SyncService (depends on: PrismaService, HttpService)
│   └── SyncController
├── AuthModule
│   ├── UsersModule (imported)
│   ├── PassportModule
│   ├── JwtModule
│   ├── AuthService (depends on: UsersService, JwtService, PrismaService)
│   ├── AuthController
│   └── JwtStrategy (depends on: UsersService)
├── SearchModule
│   ├── SearchService (depends on: PrismaService)
│   └── SearchController
├── UsersModule
│   ├── UsersService (depends on: PrismaService)
│   └── UsersController (empty — no routes yet)
├── UniversitiesModule
│   ├── HttpModule
│   ├── UniversitiesService (depends on: HttpService)
│   └── UniversitiesController
├── ProgramsModule
│   ├── HttpModule
│   ├── ProgramsService (depends on: HttpService)
│   └── ProgramsController
└── MockTestsModule
    ├── MockTestsService (depends on: PrismaService)
    └── MockTestsController
```

**Cross-module exports:**
- `PrismaModule` exports `PrismaService` globally (no import needed in feature modules)
- `UniversitiesModule` exports `UniversitiesService` (unused by other modules currently)
- `ProgramsModule` exports `ProgramsService` (unused by other modules currently)
- `AuthModule` exports `AuthService`, `JwtModule`
- `UsersModule` exports `UsersService` (imported by `AuthModule`)
- `MockTestsModule` exports `MockTestsService` (unused currently)

## Data Flow

**Live-Proxy Flow (universities, programs endpoints):**

1. HTTP request hits `UniversitiesController` or `ProgramsController`
2. Controller calls service method with raw query params
3. Service builds upstream params and calls Opintopolku API via `firstValueFrom(this.httpService.get(...))`
4. On success: service runs inline `mapInstitution` / `mapProgram` / `mapProgramDetails` shaping helpers using `resolveLang` pattern
5. On upstream failure: service throws `BadGatewayException('Upstream Opintopolku API is unreachable')`
6. Shaped response returned to controller, serialized as JSON

**DB-Backed Flow (search, mock-tests endpoints):**

1. HTTP request hits `SearchController` or `MockTestsController`
2. Controller validates DTO via per-route `ValidationPipe({ transform: true, whitelist: true })`
3. Service queries `PrismaService` directly using Prisma query builder
4. Results mapped to plain objects inline in service; no ORM entity classes used
5. Paginated response `{ total, page, size, hits/templates/tests }` returned to controller

**Auth Flow:**

1. Client sends `POST /auth/register` or `POST /auth/login` with body DTO
2. `AuthController` validates body with `ValidationPipe` and delegates to `AuthService`
3. `AuthService` uses `UsersService` to look up/create users via Prisma
4. On login success: issues JWT access token + opaque refresh token; refresh token stored in `Auth` table via `prisma.auth.upsert`
5. Authenticated routes apply `@UseGuards(JwtAuthGuard)`: Passport validates Bearer token, `JwtStrategy.validate()` looks up user, attaches `CurrentUserData` to `request.user`
6. `@CurrentUser()` decorator extracts user from `request.user` and injects into handler parameter

**Sync Flow:**

1. Triggered via `POST /sync/run` (fire-and-forget: `void this.syncService.syncAll()`) or `@Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)`
2. `SyncService` paginates through all institutions then programs from Opintopolku API
3. Each record is fetched in detail then upserted into PostgreSQL via `prisma.university.upsert` / `prisma.program.upsert`
4. Provider-program join table (`ProgramUniversity`) maintained after each program upsert
5. Logger (`NestJS Logger`) used throughout for progress reporting

**State Management:**
- No in-memory state; all state persisted in PostgreSQL via Prisma
- Redis infrastructure present (docker-compose) but not used by the application

## Key Abstractions

**DTOs (Data Transfer Objects):**
- Purpose: Typed validated input shapes for HTTP request bodies and query strings
- Examples: `src/modules/search/dto/search-query.dto.ts`, `src/modules/auth/dto/register.dto.ts`, `src/modules/mock-tests/dto/submit-answers.dto.ts`
- Pattern: `class-validator` decorators on plain classes; `@Type(() => Number)` from `class-transformer` for query param coercion; barrel `index.ts` for auth and mock-tests DTOs

**resolveLang Helper:**
- Purpose: Safely extract localized string from Opintopolku multilingual objects
- Pattern: Inline function defined inside each service method (not shared utility):
  ```typescript
  const resolveLang = (obj: any) => obj?.[lng] ?? obj?.en ?? obj?.fi ?? '';
  ```
- Location: Repeated in `src/modules/universities/universities.service.ts`, `src/modules/programs/programs.service.ts`, `src/modules/sync/sync.service.ts`

**PrismaService:**
- Purpose: Singleton database client, globally available
- Location: `src/providers/prisma.service.ts`
- Pattern: Extends `PrismaClient` directly; connects on `onModuleInit`; uses `@prisma/adapter-pg` for connection
- Import path for Prisma types: `generated/prisma` (not `@prisma/client`)

**JwtAuthGuard + CurrentUser:**
- Purpose: Route-level JWT enforcement and authenticated user injection
- Guard location: `src/common/guards/jwt-auth.guard.ts`
- Decorator location: `src/common/decorators/current-user.decorator.ts`
- Usage: `@UseGuards(JwtAuthGuard)` on method, `@CurrentUser() user: CurrentUserData` as parameter

## Entry Points

**HTTP Server:**
- Location: `src/main.ts`
- Triggers: Node.js process start
- Responsibilities: Creates NestJS app, enables CORS (all origins, credentials), listens on `process.env.PORT ?? 3000`

**Root Health Check:**
- Location: `src/app.controller.ts` + `src/app.service.ts`
- Route: `GET /`
- Returns: `"Hello World!"` string

**Scheduled Sync:**
- Location: `src/modules/sync/sync.service.ts`
- Triggers: Cron `EVERY_DAY_AT_MIDNIGHT` or `POST /sync/run`
- Responsibilities: Full re-sync of institutions and programs from Opintopolku into PostgreSQL

## Error Handling

**Strategy:** Throw NestJS built-in HTTP exceptions from services; no custom exception filter registered

**Patterns:**
- Upstream API unreachable: `throw new BadGatewayException('Upstream Opintopolku API is unreachable')` in proxy services (caught in `try/catch` around `firstValueFrom`)
- Resource not found (DB queries): `throw new NotFoundException('...')` in `MockTestsService`
- Auth failures: `throw new UnauthorizedException('...')` in `AuthService` and `JwtStrategy`
- Conflict (duplicate registration, active test): `throw new ConflictException('...')` in `AuthService` and `MockTestsService`
- Invalid input (business rule): `throw new BadRequestException('...')` in `AuthService` and `MockTestsService`
- Authorization (ownership): `throw new ForbiddenException('...')` in `MockTestsService`
- Sync service swallows detail errors per-record with `this.logger.warn(...)` and continues

## Cross-Cutting Concerns

**Logging:**
- `SyncService` uses `new Logger(SyncService.name)` (NestJS built-in)
- `AuthService` uses `console.log` for verification/reset tokens (dev-only pattern, no email integration yet)
- No centralized logging configuration or structured log format

**Validation:**
- Applied per-route via `new ValidationPipe({ transform: true, whitelist: true })` as a parameter pipe
- Not registered globally in `main.ts`
- Pattern used in: `AuthController`, `SearchController`, `MockTestsController`; `UniversitiesController` and `ProgramsController` use unvalidated `Record<string, any>` query params

**Authentication:**
- Passport JWT strategy registered in `AuthModule`
- `JwtAuthGuard` applied at method level via `@UseGuards(JwtAuthGuard)`
- Routes that require auth: `GET /auth/me`, `POST /mock-tests`, `GET /mock-tests/history`, `GET /mock-tests/:id`, `POST /mock-tests/:id/submit`
- Public routes: all university, program, search, sync endpoints; auth register/login/refresh/password routes

**CORS:**
- Enabled globally in `main.ts` with `origin: true` (all origins), all HTTP methods, `credentials: true`

## What Is Implemented vs Scaffolded

**Fully Implemented:**
- `UniversitiesModule` — all three routes with live Opintopolku proxy
- `ProgramsModule` — list and detail routes with live Opintopolku proxy (detail fetches implementations)
- `SearchModule` — DB-backed search for institutions and programs with full Prisma queries
- `SyncModule` — full paginated sync with cron scheduling, upsert logic, provider joins
- `AuthModule` — register, login, refresh, email verify, forgot/reset password, `GET /me`
- `UsersModule` — service layer complete; controller is empty (no routes)
- `MockTestsModule` — full CRUD: list templates, get template, start test, submit answers, get attempt, history

**Partially Scaffolded (empty or stub):**
- `src/modules/users/users.controller.ts` — controller exists but has no route handlers
- `src/modules/universities/entities/university.entity.ts` — empty `export class University {}`
- `src/modules/auth/entities/auth.entity.ts` — empty `export class Auth {}`
- `src/modules/users/entities/user.entity.ts` — empty `export class User {}`
- `src/modules/universities/dto/create-university.dto.ts` — empty `export class CreateUniversityDto {}`
- `src/common/filters/`, `src/common/interceptors/`, `src/common/middleware/`, `src/common/pipes/`, `src/common/utils/` — directories exist with only `.gitkeep`
- `src/providers/.gitkeep` — placeholder
- `src/config/.gitkeep` — placeholder alongside functional `opintopolku.config.ts`

---

*Architecture analysis: 2026-04-24*
