# Testing Patterns

**Analysis Date:** 2026-04-24

## Test Framework

**Runner:** Jest 30

**Transform:** `ts-jest` 29

**Config location:** Inline in `package.json` (unit tests); `test/jest-e2e.json` (e2e tests)

**Unit test config (`package.json`):**
```json
{
  "jest": {
    "moduleFileExtensions": ["js", "json", "ts"],
    "rootDir": "src",
    "testRegex": ".*\\.spec\\.ts$",
    "transform": { "^.+\\.(t|j)s$": "ts-jest" },
    "collectCoverageFrom": ["**/*.(t|j)s"],
    "coverageDirectory": "../coverage",
    "testEnvironment": "node"
  }
}
```

**E2E test config (`test/jest-e2e.json`):**
```json
{
  "moduleFileExtensions": ["js", "json", "ts"],
  "rootDir": ".",
  "testEnvironment": "node",
  "testRegex": ".e2e-spec.ts$",
  "transform": { "^.+\\.(t|j)s$": "ts-jest" }
}
```

**Assertion library:** Built-in Jest (`expect`)

## Run Commands

```bash
npm run test          # Run all unit tests (rootDir: src, *.spec.ts)
npm run test:watch    # Watch mode
npm run test:cov      # With coverage (outputs to ../coverage/)
npm run test:e2e      # E2E tests only (test/jest-e2e.json)
npm run test -- --testPathPattern=auth   # Run single test file by pattern
```

## Test File Organization

**Co-location pattern:** Unit test files live next to the source file they test.

```
src/
├── app.controller.spec.ts        # tests app.controller.ts
├── modules/
│   ├── auth/
│   │   └── auth.spec.ts          # tests auth.service.ts
│   ├── mock-tests/
│   │   └── mock-tests.spec.ts    # tests mock-tests.service.ts
│   ├── search/
│   │   └── search.spec.ts        # tests search.service.ts
│   ├── universities/
│   │   └── universities.spec.ts  # tests universities module
│   └── users/
│       └── users.spec.ts         # tests users module
test/
└── app.e2e-spec.ts               # e2e tests (separate from src/)
```

**Naming:**
- Unit test files: `{domain}.spec.ts`
- E2E test files: `{domain}.e2e-spec.ts`

## Unit Test Anatomy

**Standard structure** (from `src/modules/auth/auth.spec.ts`):

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { SomeService } from './some.service';
import { PrismaService } from '../../providers/prisma.service';
import { NotFoundException } from '@nestjs/common';

// 1. Define mock data at module level
const mockEntity = {
  id: 'entity-1',
  name: 'Example',
  // ... all fields matching the DB shape
};

describe('SomeService', () => {
  let service: SomeService;
  let prisma: {
    entity: { findUnique: jest.Mock; create: jest.Mock };
  };

  // 2. Create fresh mocks before each test
  beforeEach(async () => {
    prisma = {
      entity: {
        findUnique: jest.fn(),
        create: jest.fn(),
      },
    };

    // 3. Build NestJS testing module with real service + mocked dependencies
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SomeService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get(SomeService);
  });

  // 4. Group tests by method with nested describe
  describe('methodName()', () => {
    it('describes the happy path', async () => {
      prisma.entity.findUnique.mockResolvedValue(mockEntity);
      const result = await service.methodName('arg');
      expect(result.id).toBe('entity-1');
    });

    it('throws NotFoundException for missing record', async () => {
      prisma.entity.findUnique.mockResolvedValue(null);
      await expect(service.methodName('invalid')).rejects.toThrow(NotFoundException);
    });
  });
});
```

## Mocking

**Framework:** Jest built-in mocks (`jest.fn()`, `mockResolvedValue`, `mockReturnValue`)

**PrismaService mock pattern** — typed inline object (not `jest.mock()` module-level mock):

```typescript
let prisma: {
  university: { count: jest.Mock; findMany: jest.Mock };
  program: { count: jest.Mock; findMany: jest.Mock };
};

beforeEach(async () => {
  prisma = {
    university: { count: jest.fn(), findMany: jest.fn() },
    program: { count: jest.fn(), findMany: jest.fn() },
  };
  // inject via { provide: PrismaService, useValue: prisma }
});
```

**JwtService mock pattern:**
```typescript
let jwtService: { sign: jest.Mock };

jwtService = {
  sign: jest.fn().mockReturnValue('mock-access-token'),
};
// inject via { provide: JwtService, useValue: jwtService }
```

**Dependent service mock pattern** (UsersService mocked for AuthService tests):
```typescript
let usersService: {
  findByEmail: jest.Mock;
  create: jest.Mock;
  // ... one jest.Mock per method used
};

usersService = {
  findByEmail: jest.fn(),
  create: jest.fn(),
};
// inject via { provide: UsersService, useValue: usersService }
```

**Prisma `$transaction` mock pattern:**
```typescript
$transaction: jest.fn((fn: (tx: typeof prisma) => Promise<void>) => fn(prisma)),
```

**What to mock:**
- `PrismaService` — always mock; never hit the real database in unit tests
- `JwtService` — mock with `sign: jest.fn().mockReturnValue('mock-access-token')`
- Other NestJS services that the service under test depends on
- `HttpService` (for upstream proxy services) — mock via `useValue`

**What NOT to mock:**
- The service under test itself — always use the real implementation
- `bcrypt` — auth tests call the real `hashPassword()` method to generate valid hashes

## Mock Data Fixtures

**Pattern:** Defined as module-level `const` objects at the top of each spec file. Each fixture represents a complete database row shape.

```typescript
const mockTemplate = {
  id: 'template-1',
  title: 'Math Test',
  description: 'A math test',
  subject: 'math',
  durationMinutes: 30,
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockQuestion = {
  id: 'question-1',
  templateId: 'template-1',
  body: 'What is 2+2?',
  type: 'multiple_choice',
  points: 1,
  orderIndex: 0,
  explanation: 'Basic addition',
  createdAt: new Date(),
  updatedAt: new Date(),
};
```

**Fixture composition with spread:**
```typescript
// Create variants by spreading and overriding fields
const mockUnverifiedUser = {
  ...mockUser,
  id: 'user-456',
  emailVerifiedAt: null,
  emailVerifyToken: 'verify-token-123',
};
```

**No shared fixture files** — each spec file defines its own fixtures inline.

## Test Suite Organization

**Top-level `describe`:** Named after the class under test: `describe('MockTestsService', () => {...})`

**Nested `describe` per method:** Named with trailing `()`: `describe('startTest()', () => {...})`

**Test naming convention:**
- Happy path: describes what is returned/done: `'returns paginated list of active templates with question counts'`
- Error cases: describes the thrown exception and condition: `'throws NotFoundException for non-existent template'`
- Behaviour: describes observable side effect: `'applies keyword ILIKE filter when keyword is provided'`
- Security: describes the protection: `'returns same message for non-existing user (no enumeration)'`

## Assertion Patterns

**Paginated response check:**
```typescript
expect(result.total).toBe(1);
expect(result.page).toBe(0);
expect(result.size).toBe(20);
expect(result.hits).toHaveLength(1);
```

**Checking call arguments passed to Prisma:**
```typescript
const whereArg = prisma.university.count.mock.calls[0][0].where;
expect(whereArg).toEqual({ name: { contains: 'aalto', mode: 'insensitive' } });
```

**Checking a field is NOT present (security assertion):**
```typescript
expect(result.questions[0].options[0]).not.toHaveProperty('isCorrect');
```

**Exception assertions:**
```typescript
await expect(service.getTemplate('invalid')).rejects.toThrow(NotFoundException);
```

**Partial object match:**
```typescript
expect(usersService.create).toHaveBeenCalledWith(
  expect.objectContaining({
    email: 'test@example.com',
    firstName: 'Test',
  }),
);
```

**`expect.any(String)` and `expect.any(Date)`:**
```typescript
expect(usersService.setResetToken).toHaveBeenCalledWith(
  mockUser.id,
  expect.any(String),
  expect.any(Date),
);
```

**Sequential mock return values with `mockResolvedValueOnce`:**
```typescript
prisma.mockTest.findUnique
  .mockResolvedValueOnce(mockTestWithTemplate)   // first call
  .mockResolvedValueOnce({ ...mockMockTest, score: 1, status: 'completed' }); // second call
```

## Async Testing

All test cases involving service methods are `async`:

```typescript
it('creates a new test attempt', async () => {
  prisma.testTemplate.findUnique.mockResolvedValue({...});
  const result = await service.startTest('user-1', { templateId: 'template-1' });
  expect(result.status).toBe('in_progress');
});
```

Exception testing uses `await expect(...).rejects.toThrow(...)`:
```typescript
it('throws BadRequestException for already completed test', async () => {
  prisma.mockTest.findUnique.mockResolvedValue({ ...mockTestWithTemplate, status: 'completed' });
  await expect(
    service.submitAnswers('user-1', 'test-1', { answers: [] }),
  ).rejects.toThrow(BadRequestException);
});
```

## E2E Tests

**Location:** `test/` directory (separate from `src/`)

**Framework:** `supertest` 7 + full `AppModule` bootstrap

**Pattern:**
```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });
});
```

**Current E2E coverage:** Only the health check `GET /` is e2e tested. All feature modules lack e2e tests.

## What Is Tested (Coverage Summary)

| Module | Spec File | Coverage Type |
|---|---|---|
| `AppController` | `src/app.controller.spec.ts` | Scaffold only — `toBeDefined()` |
| `AuthService` | `src/modules/auth/auth.spec.ts` | Comprehensive — all methods, happy + error paths |
| `MockTestsService` | `src/modules/mock-tests/mock-tests.spec.ts` | Comprehensive — all methods, happy + error paths |
| `SearchService` | `src/modules/search/search.spec.ts` | Comprehensive — all methods, DB query args verified |
| `UniversitiesModule` | `src/modules/universities/universities.spec.ts` | Scaffold only — `toBeDefined()` |
| `UsersModule` | `src/modules/users/users.spec.ts` | Scaffold only — `toBeDefined()` |
| E2E | `test/app.e2e-spec.ts` | Health check only |

**Not tested at all:**
- `UniversitiesService` (HTTP proxy logic)
- `ProgramsService` (HTTP proxy logic)
- All controller routing/validation behavior
- JWT strategy and guard behavior
- `PrismaService` lifecycle

## Coverage Configuration

**Target:** None enforced (no `coverageThreshold` in jest config)

**Collection scope:** `"collectCoverageFrom": ["**/*.(t|j)s"]` — collects from all files in `src/`

**Output directory:** `../coverage/` (relative to `src/`, so project root `coverage/`)

**View coverage:**
```bash
npm run test:cov
```

---

*Testing analysis: 2026-04-24*
