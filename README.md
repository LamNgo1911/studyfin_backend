# StudyFin Backend

> NestJS backend API for helping students discover Finnish educational institutions and programs.

## Tech Stack

- **Runtime:** Node.js · TypeScript
- **Framework:** [NestJS](https://nestjs.com/) v11
- **ORM:** [Prisma](https://www.prisma.io/) v7 (PostgreSQL)
- **HTTP Client:** Axios (via `@nestjs/axios`)
- **Validation:** class-validator · class-transformer
- **Infrastructure:** Docker Compose (PostgreSQL 16, Redis 7)
- **Testing:** Jest · Supertest

## Project Structure

```
src/
├── common/                # Shared utilities
│   ├── decorators/
│   ├── filters/
│   ├── guards/
│   ├── interceptors/
│   ├── middleware/
│   ├── pipes/
│   └── utils/
├── config/                # App configuration
├── modules/
│   ├── auth/              # Authentication
│   ├── users/             # User management
│   ├── universities/      # University data
│   ├── search/            # Institution search (Opintopolku API)
│   ├── programs/          # Study programs (scaffold)
│   └── mock-tests/        # Mock test data (scaffold)
├── providers/             # External providers
└── main.ts
```

## Prerequisites

- **Node.js** ≥ 18
- **Docker** & **Docker Compose** (for local PostgreSQL & Redis)

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Start infrastructure

```bash
docker compose up -d
```

This starts **PostgreSQL 16** (port 5432) and **Redis 7** (port 6379).

### 3. Configure environment

Copy `.env` and update `DATABASE_URL` if needed. The default `.env` is configured for local Prisma Postgres.

### 4. Generate Prisma client

```bash
npx prisma generate
```

### 5. Run the app

```bash
# Development (watch mode)
npm run start:dev

# Production build
npm run build
npm run start:prod
```

The server starts at **http://localhost:3000** by default.

## Available Scripts

| Script              | Description                       |
|---------------------|-----------------------------------|
| `npm run start`     | Start the app                     |
| `npm run start:dev` | Start in watch mode               |
| `npm run start:prod`| Start production build            |
| `npm run build`     | Compile the project               |
| `npm run lint`      | Lint & auto-fix with ESLint       |
| `npm run format`    | Format code with Prettier         |
| `npm test`          | Run unit tests                    |
| `npm run test:watch`| Run tests in watch mode           |
| `npm run test:cov`  | Run tests with coverage           |
| `npm run test:e2e`  | Run end-to-end tests              |

## API Modules

### Search

Proxies the [Opintopolku](https://opintopolku.fi) API to search Finnish educational institutions. Supports keyword filtering, pagination, and multi-language results (Finnish, Swedish, English).

### Auth

Handles user authentication (in development).

### Users

User profile management – CRUD operations (in development).

### Universities

University data management (in development).

## License

This project is private and unlicensed.
