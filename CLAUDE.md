# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

StudyFin backend — a NestJS 11 application using TypeScript, Prisma (PostgreSQL), and Jest for testing.

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
├── app.controller.ts        # Root controller
├── app.service.ts           # Root service
├── modules/                 # Feature modules (one folder per domain)
│   ├── universities/        # Reference module with controller, service, DTOs, entity
│   ├── auth/
│   ├── users/
│   ├── programs/
│   ├── search/
│   └── mock-tests/
├── common/                  # Shared code
│   ├── decorators/
│   ├── filters/
│   ├── guards/
│   ├── interceptors/
│   ├── middleware/
│   ├── pipes/
│   └── utils/
├── config/                  # App configuration
└── providers/               # Shared providers
```

New features go under `src/modules/` as separate NestJS modules. Use `src/modules/universities/` as the reference for module structure (controller, service, DTOs in `dto/`, entities in `entities/`).

DTOs use `class-validator` and `class-transformer`. Partial update DTOs extend `PartialType` from `@nestjs/mapped-types`.

## Database

Prisma with PostgreSQL. The schema lives at `prisma/schema.prisma`. Database URL is configured via `prisma.config.ts` which reads `DATABASE_URL` from the environment.

Prisma client is generated to `generated/prisma` (not the default location) — import from `generated/prisma`, not `@prisma/client`.

## Infrastructure

`docker-compose.yml` provides:
- PostgreSQL 16 (Alpine) on port `5432` — user/pass/db: `studyfin`
- Redis 7 (Alpine) on port `6379`

## Testing

- Unit tests are co-located with source files as `*.spec.ts`
- E2E tests live in `test/` as `*.e2e-spec.ts`
- Jest config is inline in `package.json` (rootDir: `src`, transform: `ts-jest`)
- Test environment: `node`

## Code Style

- ESLint flat config (`eslint.config.mjs`) with `typescript-eslint` recommendedTypeChecked + Prettier
- `@typescript-eslint/no-explicit-any`: off
- `@typescript-eslint/no-floating-promises`: warn
- `@typescript-eslint/no-unsafe-argument`: warn
- `prettier/prettier`: error (endOfLine: auto)
- Prettier: single quotes, trailing commas (`all`)
- `strictNullChecks` enabled, `noImplicitAny` disabled
- Target: `ES2023`, module resolution: `nodenext`
