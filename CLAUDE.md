# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

StudyFin backend — a NestJS 11 application using TypeScript, Prisma (PostgreSQL), and Jest for testing. The app currently acts primarily as a validated proxy to the Finnish national higher education API (`opintopolku.fi/konfo-backend`), with database integration and auth not yet implemented.

## Commands

- `npm run build` — compile TypeScript to `dist/`
- `npm run start:dev` — start in watch mode (run manually in terminal)
- `npm run lint` — ESLint with auto-fix
- `npm run format` — Prettier formatting
- `npm run test` — run unit tests (Jest)
- `npm run test -- --testPathPattern=<pattern>` — run a single test file
- `npm run test:e2e` — run end-to-end tests (config: `test/jest-e2e.json`)
- `npm run test:cov` — run tests with coverage

## Architecture

NestJS modular architecture with a single root module (`AppModule`).

Entry point: `src/main.ts` — bootstraps on `process.env.PORT ?? 3000`.

### Project Structure

```
src/
├── main.ts                  # App entry point
├── app.module.ts            # Root module
├── app.controller.ts        # Root controller (GET / health check only)
├── app.service.ts           # Root service
├── modules/                 # Feature modules (one folder per domain)
│   ├── universities/        # Reference module with controller, service, DTOs, entity
│   ├── auth/                # Scaffold only — no routes/logic yet
│   ├── users/               # Scaffold only — no routes/logic yet
│   ├── programs/            # Implemented
│   ├── search/              # Implemented (most complete DTO example)
│   └── mock-tests/          # Empty placeholder
├── common/                  # Shared code (all subdirs are empty placeholders)
│   ├── decorators/
│   ├── filters/
│   ├── guards/
│   ├── interceptors/
│   ├── middleware/
│   ├── pipes/
│   └── utils/
├── config/                  # App configuration (empty placeholder)
└── providers/               # Shared providers (empty placeholder)
```

New features go under `src/modules/` as separate NestJS modules. Use `src/modules/universities/` as the reference for module structure (controller, service, DTOs in `dto/`, entities in `entities/`).

DTOs use `class-validator` and `class-transformer`. Partial update DTOs extend `PartialType` from `@nestjs/mapped-types`. See `src/modules/search/dto/search-query.dto.ts` for the most complete DTO example with `@IsOptional`, `@IsIn`, `@Type(() => Number)`, etc.

### Implemented Routes

- `GET /` — health check
- `GET /universities` — paginated university list (proxied from Opintopolku)
- `GET /universities/:oid` — university details
- `GET /universities/:oid/programs` — programs for a university
- `GET /programs/:oid` — individual program details
- `GET /search/institutions` — validated institution search (supports `keyword`, `lng`, `size`, `page` query params)

### HTTP Client Pattern

Implemented modules use `@nestjs/axios` (`HttpModule`). Services inject `HttpService`, call the upstream Opintopolku API, and convert RxJS observables to promises with `firstValueFrom()`. Upstream failures are caught and rethrown as `BadGatewayException`.

A `resolveLang` helper is used in each service to pick a localised string:
```typescript
const resolveLang = (obj: any) => obj?.[lng] ?? obj?.en ?? obj?.fi ?? '';
```

`ValidationPipe` is applied per-route (not globally) in `SearchController`:
```typescript
@Query(new ValidationPipe({ transform: true, whitelist: true })) query: SearchQueryDto
```

## Database

Prisma with PostgreSQL. The schema lives at `prisma/schema.prisma`. Database URL is configured via `prisma.config.ts` which reads `DATABASE_URL` from the environment (using `dotenv/config`).

Prisma client is generated to `generated/prisma` (not the default location) — import from `generated/prisma`, not `@prisma/client`.

**The schema currently has no models defined.** No `PrismaService` exists in the app yet. The planned data model is documented in `docs/entity-relationship.mmd` and covers: `User`, `Auth` (refresh token sessions), `University`, `Location`, `Language`, `Program`, `MockTest`, `UserProgram`, and `UserUniversity`.

The `.env` file uses a Prisma Postgres local proxy URL (`prisma+postgres://`), meaning `prisma dev` is used for local development rather than the Docker PostgreSQL container.

## Infrastructure

`docker-compose.yml` provides:
- PostgreSQL 16 (Alpine) on port `5432` — user/pass/db: `studyfin`
- Redis 7 (Alpine) on port `6379` (not yet used by the application)

## Testing

- Unit tests are co-located with source files as `*.spec.ts`
- E2E tests live in `test/` as `*.e2e-spec.ts`
- Jest config is inline in `package.json` (rootDir: `src`, transform: `ts-jest`)
- Test environment: `node`
- `src/modules/search/search.spec.ts` is the most complete test example (happy path, upstream failure, param passthrough)

## Code Style

- ESLint flat config (`eslint.config.mjs`) with `typescript-eslint` recommendedTypeChecked + Prettier
- `@typescript-eslint/no-explicit-any`: off
- `@typescript-eslint/no-floating-promises`: warn
- `@typescript-eslint/no-unsafe-argument`: warn
- `prettier/prettier`: error (endOfLine: auto)
- Prettier: single quotes, trailing commas (`all`)
- `strictNullChecks` enabled, `noImplicitAny` disabled
- Target: `ES2023`, module resolution: `nodenext`
