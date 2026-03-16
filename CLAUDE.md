# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

StudyFin backend — a NestJS application using TypeScript, Prisma (PostgreSQL), and Jest for testing.

## Commands

- `npm run build` — compile TypeScript to `dist/`
- `npm run lint` — ESLint with auto-fix
- `npm run format` — Prettier formatting
- `npm run test` — run unit tests (Jest)
- `npm run test -- --testPathPattern=<pattern>` — run a single test file
- `npm run test:e2e` — run end-to-end tests (config: `test/jest-e2e.json`)
- `npm run test:cov` — run tests with coverage

## Architecture

NestJS modular architecture with a single root module (`AppModule`). New features should be added as separate NestJS modules under `src/`.

Entry point: `src/main.ts` — bootstraps on `process.env.PORT ?? 3000`.

## Database

Prisma with PostgreSQL. The schema lives at `prisma/schema.prisma`. Database URL is configured via `prisma.config.ts` which reads `DATABASE_URL` from the environment.

Prisma client is generated to `generated/prisma` (not the default location) — import from `generated/prisma`, not `@prisma/client`.

## Code Style

- ESLint flat config (`eslint.config.mjs`) with `typescript-eslint` recommended + Prettier integration
- `@typescript-eslint/no-explicit-any` is off
- `@typescript-eslint/no-floating-promises` is warn
- `strictNullChecks` enabled, `noImplicitAny` disabled
- Module resolution: `nodenext`
