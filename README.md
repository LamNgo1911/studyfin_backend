# StudyFin Backend

> NestJS backend API for helping students discover Finnish educational institutions and programs.

## Tech Stack

- **Runtime:** Node.js · TypeScript
- **Framework:** [NestJS](https://nestjs.com/) v11
- **ORM:** [Prisma](https://www.prisma.io/) v7 (PostgreSQL)
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
│   ├── auth/              # Authentication (scaffold)
│   ├── users/             # User management (scaffold)
│   ├── universities/      # University data
│   ├── search/            # Institution & program search (local DB)
│   ├── programs/          # Study programs
│   ├── sync/              # DB sync from Opintopolku API
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

## API Routes

### Health

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/` | Health check |

### Universities

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/universities` | Paginated university list |
| `GET` | `/universities/:oid` | University by OID (`lng` query param supported) |
| `GET` | `/universities/:oid/programs` | Programs for a university |

### Programs

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/programs` | List programs |
| `GET` | `/programs/:oid` | Program by OID (`lng` query param supported) |

### Search

Queries the local database.

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/search/institutions` | Search universities by keyword |
| `GET` | `/search` | Search institutions or programs |

**Query parameters for `/search/institutions`:**
- `keyword` — search term (min 3 chars)
- `size` — results per page (1–50, default: 20)
- `page` — page number (0-indexed, default: 0)

**Query parameters for `/search`:**
- `q` — search term
- `type` — `institutions` or `programs` (default: `programs`)
- `size` — results per page (1–100, default: 20)
- `page` — page number (0-indexed, default: 0)

**`GET /search/institutions` response shape:**
```json
{
  "total": 50,
  "page": 0,
  "size": 20,
  "hits": [
    {
      "oid": "1.2.246.562.10.56753942459",
      "name": "Aalto University",
      "type": "yo",
      "municipality": "Helsinki",
      "website": "https://aalto.fi",
      "email": "info@aalto.fi",
      "studentCount": 15000,
      "description": "...",
      "logoUrl": "...",
      "locations": [{ "code": "kunta_091", "name": "Helsinki" }]
    }
  ]
}
```

### Sync

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/sync/run` | Sync universities and programs from Opintopolku into the DB (202 Accepted, runs in background) |

## API Modules

### Search

Queries the local PostgreSQL database. No longer proxies the Opintopolku API directly — data is populated via `POST /sync/run`.

### Auth

Handles user authentication (in development).

### Users

User profile management – CRUD operations (in development).

### Universities

University data management (in development).

### Programs

University programs management

## Database

Prisma with PostgreSQL. The schema (`prisma/schema.prisma`) includes models for:
- `University`, `UniversityLocation` — institution data
- `Program`, `ProgramUniversity` — study programs and their university associations
- `User`, `Auth` — user accounts and refresh token sessions
- `UserProgram`, `UserUniversity` — user saved items
- `MockTest` — practice test records

Prisma client is generated to `generated/prisma` — import from there, not `@prisma/client`.

## License

This project is private and unlicensed.
