# Technology Stack

**Analysis Date:** 2026-04-24

## Languages

**Primary:**
- TypeScript 5.7.x - All application source code in `src/`
- SQL - Prisma schema migrations for PostgreSQL

**Secondary:**
- JavaScript (ESM) - ESLint config at `eslint.config.mjs`

## Runtime

**Environment:**
- Node.js v22.19.0 (runtime in use; no `.nvmrc` specifying a pinned version)

**Package Manager:**
- npm (lockfile: `package-lock.json` present)

## Frameworks

**Core:**
- `@nestjs/common` ^11.0.1 - Core NestJS: decorators, pipes, guards, interceptors
- `@nestjs/core` ^11.0.1 - NestJS application bootstrap
- `@nestjs/platform-express` ^11.0.1 - HTTP adapter (Express under the hood)

**Auth:**
- `@nestjs/passport` ^11.0.5 - Passport integration layer
- `@nestjs/jwt` ^11.0.2 - JWT signing / verification
- `passport` ^0.7.0 - Passport.js core
- `passport-jwt` ^4.0.1 - JWT strategy for Passport

**HTTP Client:**
- `@nestjs/axios` ^4.0.1 - NestJS wrapper for Axios
- `axios` ^1.13.6 - HTTP client used for upstream API calls

**Scheduling:**
- `@nestjs/schedule` ^6.1.1 - Cron-based task scheduling (daily sync job)

**Validation:**
- `class-validator` ^0.15.1 - Decorator-based DTO validation
- `class-transformer` ^0.5.1 - Object transformation for DTOs
- `@nestjs/mapped-types` ^2.1.0 - `PartialType`, `PickType` helpers

**Reactive:**
- `rxjs` ^7.8.1 - Used via `firstValueFrom()` to convert Axios observables to promises

**Testing:**
- `jest` ^30.0.0 - Test runner
- `ts-jest` ^29.2.5 - TypeScript transform for Jest
- `@nestjs/testing` ^11.0.1 - NestJS testing utilities
- `supertest` ^7.0.0 - HTTP integration testing

**Build/Dev:**
- `@nestjs/cli` ^11.0.0 - NestJS CLI for build and scaffolding (`nest build`, `nest start`)
- `ts-node` ^10.9.2 - TypeScript execution for scripts (used for seed script)
- `tsconfig-paths` ^4.2.0 - Path alias resolution

## Database Layer

**ORM:**
- `prisma` ^7.6.0 (dev) - Schema management and migrations
- `@prisma/client` ^7.6.0 - Generated Prisma client
- **Client output location:** `generated/prisma` (non-default; import from `generated/prisma`, not `@prisma/client`)
- `@prisma/adapter-pg` ^7.6.0 - pg-based driver adapter (used in `PrismaService`)

**PostgreSQL driver:**
- `pg` ^8.20.0 - Native PostgreSQL driver

**Schema state:** Fully defined — models for `University`, `UniversityLocation`, `Program`, `ProgramUniversity`, `User`, `Auth`, `UserProgram`, `UserUniversity`, `TestTemplate`, `Question`, `AnswerOption`, `MockTest`, `MockTestAnswer`

**Schema file:** `prisma/schema.prisma`

**PrismaService:** `src/providers/prisma.service.ts` — globally provided via `src/providers/prisma.module.ts`

## Key Dependencies

**Critical:**
- `bcrypt` ^6.0.0 - Password hashing (10 salt rounds) used in `AuthService`
- `dotenv` ^17.4.0 - Env var loading (`import 'dotenv/config'` in `src/main.ts`)
- `reflect-metadata` ^0.2.2 - Required by NestJS decorator system

**Infrastructure:**
- `@types/node` ^22.10.7 - Node.js type definitions

## TypeScript Configuration

**File:** `tsconfig.json`

**Key settings:**
- `target`: `ES2023`
- `module`: `commonjs`
- `moduleResolution`: `node`
- `strict`: partial — `strictNullChecks: true`, `noImplicitAny: false`, `strictBindCallApply: false`
- `emitDecoratorMetadata: true`, `experimentalDecorators: true` — required for NestJS
- `outDir`: `./dist`
- `incremental: true` — faster rebuilds
- `isolatedModules: true`

## Configuration

**Environment:**
- Loaded via `dotenv/config` in `src/main.ts`
- `.env` file present (contents not read)
- Key vars: `PORT`, `DATABASE_URL`, `JWT_SECRET`, `JWT_ACCESS_EXPIRATION`, `JWT_REFRESH_EXPIRATION`

**Build:**
- `nest build` → compiles TypeScript to `dist/`
- Production start: `node dist/main`

## Dev Tooling

**Linting:**
- ESLint ^9.18.0 with flat config at `eslint.config.mjs`
- `typescript-eslint` ^8.20.0 — `recommendedTypeChecked` preset
- `eslint-plugin-prettier` ^5.2.2 — Prettier enforced as ESLint error

**Formatting:**
- Prettier ^3.4.2
- Config at `.prettierrc`: `singleQuote: true`, `trailingComma: "all"`, `endOfLine: "auto"`

## Available Scripts

```bash
npm run build          # Compile TypeScript to dist/
npm run start          # Start compiled app
npm run start:dev      # Watch mode dev server
npm run start:debug    # Debug + watch mode
npm run start:prod     # Run compiled dist/main.js
npm run lint           # ESLint with auto-fix
npm run format         # Prettier format src/ and test/
npm run test           # Run unit tests (Jest)
npm run test:watch     # Jest watch mode
npm run test:cov       # Coverage report
npm run test:debug     # Debug test run
npm run test:e2e       # E2E tests via test/jest-e2e.json
npm run seed:mock-tests  # Run prisma/seed-mock-tests.ts with ts-node
```

## Platform Requirements

**Development:**
- Node.js v22+ recommended (v22.19.0 confirmed in environment)
- PostgreSQL 16 (via Docker: `docker-compose up`)
- Redis 7 (via Docker: defined in `docker-compose.yml`, not yet used by app)

**Production:**
- Node.js runtime, `dist/main.js` entrypoint
- PostgreSQL connection via `DATABASE_URL` env var (supports `prisma+postgres://` for local Prisma Postgres proxy or standard `postgresql://`)

---

*Stack analysis: 2026-04-24*
