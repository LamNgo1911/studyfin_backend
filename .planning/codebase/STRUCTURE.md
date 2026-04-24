# Codebase Structure

**Analysis Date:** 2026-04-24

## Directory Layout

```
studyfin-backend/
├── src/
│   ├── main.ts                          # App bootstrap, CORS, port
│   ├── app.module.ts                    # Root module, imports all feature modules
│   ├── app.controller.ts                # GET / health check
│   ├── app.controller.spec.ts           # Root controller unit test
│   ├── app.service.ts                   # Returns "Hello World!"
│   ├── modules/
│   │   ├── auth/                        # JWT auth: register, login, refresh, password reset
│   │   │   ├── auth.module.ts
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── auth.spec.ts
│   │   │   ├── dto/
│   │   │   │   ├── index.ts             # Barrel export for all auth DTOs
│   │   │   │   ├── register.dto.ts
│   │   │   │   ├── login.dto.ts
│   │   │   │   ├── refresh-token.dto.ts
│   │   │   │   ├── forgot-password.dto.ts
│   │   │   │   ├── reset-password.dto.ts
│   │   │   │   └── verify-email.dto.ts
│   │   │   ├── entities/
│   │   │   │   └── auth.entity.ts       # Empty stub
│   │   │   └── strategies/
│   │   │       └── jwt.strategy.ts      # Passport JWT strategy
│   │   ├── universities/                # Live proxy to Opintopolku institutions API
│   │   │   ├── universities.module.ts
│   │   │   ├── universities.controller.ts
│   │   │   ├── universities.service.ts
│   │   │   ├── universities.spec.ts
│   │   │   ├── dto/
│   │   │   │   ├── create-university.dto.ts  # Empty stub
│   │   │   │   └── update-university.dto.ts
│   │   │   └── entities/
│   │   │       └── university.entity.ts      # Empty stub
│   │   ├── programs/                    # Live proxy to Opintopolku programs API
│   │   │   ├── programs.module.ts
│   │   │   ├── programs.controller.ts
│   │   │   ├── programs.service.ts
│   │   │   └── (no dto/ or entities/ subdirs)
│   │   ├── search/                      # DB-backed full-text search (institutions + programs)
│   │   │   ├── search.module.ts
│   │   │   ├── search.controller.ts
│   │   │   ├── search.service.ts
│   │   │   ├── search.spec.ts
│   │   │   └── dto/
│   │   │       ├── search-query.dto.ts  # SearchQueryDto + DbSearchQueryDto
│   │   │       └── search-response.dto.ts
│   │   ├── users/                       # User data access; no controller routes yet
│   │   │   ├── users.module.ts
│   │   │   ├── users.controller.ts      # Empty controller body
│   │   │   ├── users.service.ts
│   │   │   ├── users.spec.ts
│   │   │   ├── dto/
│   │   │   │   ├── create-user.dto.ts
│   │   │   │   └── update-user.dto.ts
│   │   │   └── entities/
│   │   │       └── user.entity.ts       # Empty stub
│   │   ├── mock-tests/                  # UAS entrance exam practice tests
│   │   │   ├── mock-tests.module.ts
│   │   │   ├── mock-tests.controller.ts
│   │   │   ├── mock-tests.service.ts
│   │   │   ├── mock-tests.spec.ts
│   │   │   └── dto/
│   │   │       ├── index.ts             # Barrel export for mock-tests DTOs
│   │   │       ├── list-templates-query.dto.ts
│   │   │       ├── start-mock-test.dto.ts
│   │   │       ├── submit-answers.dto.ts
│   │   │       └── mock-test-history-query.dto.ts
│   │   └── sync/                        # Scheduled + manual Opintopolku → DB sync
│   │       ├── sync.module.ts
│   │       ├── sync.controller.ts       # POST /sync/run
│   │       └── sync.service.ts          # @Cron + pagination logic
│   ├── common/
│   │   ├── decorators/
│   │   │   └── current-user.decorator.ts  # @CurrentUser() param decorator + CurrentUserData interface
│   │   ├── guards/
│   │   │   └── jwt-auth.guard.ts          # JwtAuthGuard extends AuthGuard('jwt')
│   │   ├── filters/                    # Empty placeholder (.gitkeep only)
│   │   ├── interceptors/               # Empty placeholder (.gitkeep only)
│   │   ├── middleware/                 # Empty placeholder (.gitkeep only)
│   │   ├── pipes/                      # Empty placeholder (.gitkeep only)
│   │   └── utils/                      # Empty placeholder (.gitkeep only)
│   ├── config/
│   │   └── opintopolku.config.ts       # OPINTOPOLKU_BASE constant
│   └── providers/
│       ├── prisma.module.ts            # @Global() module exporting PrismaService
│       └── prisma.service.ts           # PrismaClient subclass with PrismaPg adapter
├── prisma/
│   ├── schema.prisma                   # Prisma schema (PostgreSQL, output: ../generated/prisma)
│   └── migrations/
│       ├── 20260402221509_init/
│       ├── 20260402230847_add_teaching_languages/
│       ├── 20260409204742_add_user_token_fields/
│       └── 20260413202532_add_mock_test_models/
├── generated/
│   └── prisma/                         # Generated Prisma client (gitignored or auto-generated)
├── test/
│   ├── app.e2e-spec.ts                 # E2E test (NestJS supertest)
│   └── jest-e2e.json                   # E2E Jest config
├── docs/
│   └── entity-relationship.mmd         # Mermaid ERD (reference document)
├── dist/                               # Compiled output (generated, not committed)
├── .planning/
│   └── codebase/                       # GSD codebase analysis documents
├── package.json                        # Dependencies + inline Jest config
├── tsconfig.json                       # TypeScript config (ES2023, nodenext)
├── eslint.config.mjs                   # ESLint flat config
├── prisma.config.ts                    # Prisma CLI config (reads DATABASE_URL via dotenv)
└── docker-compose.yml                  # PostgreSQL 16 + Redis 7 for local dev
```

## Directory Purposes

**`src/modules/`:**
- Purpose: All feature domains; one subdirectory per NestJS module
- Contains: Controller, service, spec file, `dto/` subdirectory, optional `entities/` subdirectory
- Key files: Each feature is self-contained; `auth/strategies/` is the only nested non-dto/entities subdirectory

**`src/common/`:**
- Purpose: Code shared across all feature modules
- Contains: Guards, decorators, and empty placeholder subdirectories for filters, interceptors, middleware, pipes, utils
- Key files: `src/common/guards/jwt-auth.guard.ts`, `src/common/decorators/current-user.decorator.ts`

**`src/providers/`:**
- Purpose: Shared infrastructure providers registered globally
- Contains: `PrismaModule` (@Global) and `PrismaService`
- Note: Because `PrismaModule` is `@Global()`, feature modules do NOT import `PrismaModule`; `PrismaService` is available for injection directly

**`src/config/`:**
- Purpose: Application-level configuration constants
- Contains: `opintopolku.config.ts` with `OPINTOPOLKU_BASE` URL constant

**`prisma/`:**
- Purpose: Database schema definition and migration history
- Contains: `schema.prisma` (models), `migrations/` (applied migration SQL)
- Key configuration: `output = "../generated/prisma"` — client generated outside `src/`

**`generated/prisma/`:**
- Purpose: Auto-generated Prisma client and types
- Generated: Yes (run `npx prisma generate`)
- Committed: Unknown (gitignore not inspected), but import path is `../../generated/prisma` or `../../../generated/prisma` from service files
- Import pattern: `import { PrismaClient, User, Prisma } from '../../generated/prisma'` (or `../../../generated/prisma` from module-level)

**`test/`:**
- Purpose: End-to-end tests only
- Contains: `app.e2e-spec.ts` (supertest-based), `jest-e2e.json` (separate Jest config for e2e)

## Key File Locations

**Entry Points:**
- `src/main.ts`: Application bootstrap
- `src/app.module.ts`: Root module composing all feature modules

**Upstream API Configuration:**
- `src/config/opintopolku.config.ts`: `OPINTOPOLKU_BASE` constant used by proxy services and sync service

**Database Access:**
- `src/providers/prisma.service.ts`: Singleton Prisma client
- `src/providers/prisma.module.ts`: Global module registration
- `prisma/schema.prisma`: Schema definition

**Authentication Infrastructure:**
- `src/modules/auth/strategies/jwt.strategy.ts`: Passport strategy definition
- `src/common/guards/jwt-auth.guard.ts`: Guard extending Passport's `AuthGuard('jwt')`
- `src/common/decorators/current-user.decorator.ts`: `@CurrentUser()` decorator + `CurrentUserData` interface

**Reference Module (canonical module structure example):**
- `src/modules/universities/` — most complete example with controller, service, spec, dto/, entities/

**Most Complete DTO Example:**
- `src/modules/search/dto/search-query.dto.ts` — shows `@IsOptional`, `@IsIn`, `@Type(() => Number)`, `@IsInt`, `@Min`, `@Max`

## Naming Conventions

**Files:**
- Module files: `<feature>.module.ts`
- Controllers: `<feature>.controller.ts`
- Services: `<feature>.service.ts`
- Spec files (unit tests): `<feature>.spec.ts` (co-located with source)
- E2E spec files: `<feature>.e2e-spec.ts` (in `test/`)
- DTOs: `<purpose>.dto.ts` (e.g., `register.dto.ts`, `search-query.dto.ts`, `submit-answers.dto.ts`)
- Guards: `<name>.guard.ts`
- Decorators: `<name>.decorator.ts`
- Strategies: `<name>.strategy.ts`
- Entities: `<name>.entity.ts`

**Directories:**
- Feature modules: kebab-case matching the NestJS controller prefix (e.g., `mock-tests/`, `universities/`)
- Sub-directories within modules: `dto/`, `entities/`, `strategies/`

**Classes:**
- Modules: `PascalCase` + `Module` suffix (e.g., `MockTestsModule`)
- Controllers: `PascalCase` + `Controller` suffix
- Services: `PascalCase` + `Service` suffix
- DTOs: `PascalCase` + `Dto` suffix (e.g., `RegisterDto`, `SubmitAnswersDto`)
- Guards: `PascalCase` + `Guard` suffix
- Strategies: `PascalCase` + `Strategy` suffix

## Module Anatomy

Each fully implemented module contains:

```
<feature>/
├── <feature>.module.ts      # @Module() decorator; imports (HttpModule or PrismaService via global), controllers, providers, exports
├── <feature>.controller.ts  # @Controller('<prefix>'), route methods, ValidationPipe, UseGuards
├── <feature>.service.ts     # @Injectable(), business logic, Prisma or HttpService calls
├── <feature>.spec.ts        # Co-located unit test (Jest + ts-jest)
├── dto/
│   ├── index.ts             # Optional barrel export (used in auth and mock-tests)
│   └── <purpose>.dto.ts     # class-validator decorated DTO classes
└── entities/                # Optional; currently all entity files are empty stubs
    └── <name>.entity.ts
```

Modules that proxy Opintopolku (universities, programs, sync) import `HttpModule` from `@nestjs/axios`.
Modules that query the database (search, mock-tests, users, auth) use `PrismaService` injected via the global `PrismaModule` without importing it.

## Where to Add New Code

**New Feature Module:**
1. Create directory: `src/modules/<feature-name>/`
2. Create files following the anatomy above
3. Add `<Feature>Module` to the `imports` array in `src/app.module.ts`
4. If the module needs the upstream API: import `HttpModule` in the module's `@Module({ imports: [] })`
5. If the module needs database access: inject `PrismaService` directly (no module import needed)

**New DTO:**
- Place in `src/modules/<feature>/dto/<purpose>.dto.ts`
- Use `class-validator` decorators; use `@Type(() => Number)` for query-param number coercion
- Add to barrel `index.ts` if one exists for the module

**New Guard:**
- Place in `src/common/guards/<name>.guard.ts`
- Apply per-route with `@UseGuards(<GuardName>)`

**New Decorator:**
- Place in `src/common/decorators/<name>.decorator.ts`

**New Shared Utility:**
- Place in `src/common/utils/<name>.ts` (directory exists but is empty)

**New Exception Filter:**
- Place in `src/common/filters/<name>.filter.ts` (directory exists but is empty)
- Register globally in `src/main.ts` or per-controller with `@UseFilters()`

**New Interceptor:**
- Place in `src/common/interceptors/<name>.interceptor.ts` (directory exists but is empty)

**New Prisma Model:**
1. Add model to `prisma/schema.prisma`
2. Run `npx prisma migrate dev` to generate migration
3. Run `npx prisma generate` to update `generated/prisma/`
4. Import types from `generated/prisma` (e.g., `import { User } from '../../../generated/prisma'`)

**New Database Configuration:**
- Add constants to `src/config/` as a `<name>.config.ts` file

## Co-location Patterns

**Unit tests** (`*.spec.ts`) are co-located with the source file they test:
- `src/modules/auth/auth.spec.ts` tests `auth.service.ts`
- `src/modules/search/search.spec.ts` tests `search.service.ts`
- `src/app.controller.spec.ts` tests `app.controller.ts`

**E2E tests** live separately in `test/`:
- `test/app.e2e-spec.ts`
- Config: `test/jest-e2e.json`

**DTOs** always live in a `dto/` subdirectory within the module folder.

## Special Directories

**`generated/`:**
- Purpose: Auto-generated Prisma client output
- Generated: Yes, via `npx prisma generate`
- Import path used in services: `../../generated/prisma` or `../../../generated/prisma` depending on nesting depth
- Do NOT import from `@prisma/client`

**`.planning/codebase/`:**
- Purpose: GSD codebase analysis documents (STACK.md, INTEGRATIONS.md, CONVENTIONS.md, TESTING.md, ARCHITECTURE.md, STRUCTURE.md)
- Generated: By GSD map-codebase command
- Committed: Yes

**`dist/`:**
- Purpose: Compiled TypeScript output
- Generated: Yes, via `npm run build`
- Committed: No

**`prisma/migrations/`:**
- Purpose: Timestamped SQL migration files applied by Prisma Migrate
- Generated: Yes, via `npx prisma migrate dev`
- Committed: Yes

---

*Structure analysis: 2026-04-24*
