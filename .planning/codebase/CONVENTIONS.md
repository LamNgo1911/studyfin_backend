# Coding Conventions

**Analysis Date:** 2026-04-24

## Naming Patterns

**Files:**
- Controllers: `{domain}.controller.ts` (e.g., `universities.controller.ts`, `mock-tests.controller.ts`)
- Services: `{domain}.service.ts` (e.g., `auth.service.ts`, `users.service.ts`)
- Modules: `{domain}.module.ts`
- DTOs: `{action}-{noun}.dto.ts` (e.g., `register.dto.ts`, `submit-answers.dto.ts`, `list-templates-query.dto.ts`)
- Specs: `{domain}.spec.ts` co-located with source (e.g., `search.spec.ts`, `mock-tests.spec.ts`)
- Guards: `{name}.guard.ts` (e.g., `jwt-auth.guard.ts`)
- Decorators: `{name}.decorator.ts` (e.g., `current-user.decorator.ts`)
- Entities: `{domain}.entity.ts`
- Config: `{name}.config.ts` (e.g., `opintopolku.config.ts`)

**Classes:**
- PascalCase for all classes: `AuthService`, `MockTestsController`, `SubmitAnswersDto`
- Guards extend NestJS base: `export class JwtAuthGuard extends AuthGuard('jwt') {}`
- Services decorated with `@Injectable()`
- Controllers decorated with `@Controller('{route-prefix}')`

**Functions and Methods:**
- camelCase: `findAll`, `findOne`, `startTest`, `submitAnswers`, `mapProgramDetails`
- Private helpers prefixed with nothing but typed `private`: `private resolveTuitionType`, `private mapProgram`
- Async methods return explicit Promise types: `async findByEmail(email: string): Promise<User | null>`

**Variables:**
- camelCase: `passwordHash`, `emailVerifyToken`, `accessToken`
- Constants: `UPPER_SNAKE_CASE` for class-level private readonly: `private readonly SALT_ROUNDS = 10`
- Inline helpers: camelCase arrow function: `const resolveLang = (obj: any) => ...`

**Interfaces:**
- PascalCase, no `I` prefix: `TokenPair`, `JwtPayload`, `CreateUserInput`, `CurrentUserData`

**Types:**
- Inline types used freely: `Promise<{ message: string }>`, `Omit<User, 'passwordHash'>`

## TypeScript Strictness

**Enabled in `tsconfig.json`:**
- `strictNullChecks: true` — null/undefined must be handled explicitly
- `forceConsistentCasingInFileNames: true`
- `esModuleInterop: true`
- `emitDecoratorMetadata: true` (required for NestJS DI)
- `experimentalDecorators: true`

**Disabled:**
- `noImplicitAny: false` — `any` types are used freely (see ESLint rule below)
- `strictBindCallApply: false`
- `noFallthroughCasesInSwitch: false`

**Practical consequence:** `any` is used extensively for upstream API response shapes. Do not add `noImplicitAny` without a migration plan.

## Code Style

**Formatter:** Prettier

**Key settings (`/.prettierrc`):**
- `singleQuote: true` — use single quotes for strings
- `trailingComma: "all"` — trailing commas everywhere (function params, arrays, objects)
- `endOfLine: "auto"` — set via ESLint rule, not prettierrc

**Run formatter:**
```bash
npm run format   # prettier --write "src/**/*.ts" "test/**/*.ts"
```

## Linting

**Tool:** ESLint 9 flat config (`eslint.config.mjs`) with `typescript-eslint`

**Ruleset base:** `tseslint.configs.recommendedTypeChecked` + `eslint-plugin-prettier/recommended`

**Non-standard overrides:**
- `@typescript-eslint/no-explicit-any: off` — `any` is permitted everywhere
- `@typescript-eslint/no-floating-promises: warn` — unhandled promises trigger a warning (not error)
- `@typescript-eslint/no-unsafe-argument: warn` — passing `any` to typed params is a warning (not error)
- `prettier/prettier: error` with `{ endOfLine: "auto" }`

**Run linter:**
```bash
npm run lint   # eslint "{src,apps,libs,test}/**/*.ts" --fix
```

## Import Organization

No enforced import ordering tool. Observed pattern from source files:

1. NestJS framework imports (`@nestjs/common`, `@nestjs/axios`, etc.)
2. Third-party library imports (`rxjs`, `bcrypt`, `crypto`)
3. Internal module imports (relative paths)
4. Generated code imports (`../../../generated/prisma`)

**Example (`src/modules/auth/auth.service.ts`):**
```typescript
import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { UsersService } from '../users/users.service';
import { PrismaService } from '../../providers/prisma.service';
import { RegisterDto, LoginDto } from './dto';
import { User } from '../../../generated/prisma';
```

**Path aliases:** None configured. All imports use relative paths.

**Prisma import rule:** Always import from `generated/prisma`, never from `@prisma/client`.
```typescript
import { PrismaClient } from '../../generated/prisma';  // correct
import { User } from '../../../generated/prisma';        // correct
```

## DTO Patterns

**Validation library:** `class-validator` + `class-transformer`

**Standard decorators in use:**
- `@IsEmail()` — email format
- `@IsString()` — string type
- `@IsNotEmpty()` — non-empty string
- `@IsOptional()` — mark field as optional
- `@IsInt()` — integer check
- `@IsIn([...])` — allowlist of values
- `@IsArray()` — array check
- `@ValidateNested({ each: true })` — nested DTO validation
- `@Min(n)`, `@Max(n)` — numeric range
- `@MinLength(n)` — string minimum length
- `@Type(() => Number)` — transform string query param to number
- `@Type(() => AnswerDto)` — transform for nested DTO arrays

**Query DTO example (`src/modules/search/dto/search-query.dto.ts`):**
```typescript
export class SearchQueryDto {
  @IsOptional()
  @IsString()
  @MinLength(3)
  keyword?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  size?: number = 20;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  page?: number = 0;
}
```

**Nested DTO validation (`src/modules/mock-tests/dto/submit-answers.dto.ts`):**
```typescript
export class SubmitAnswersDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AnswerDto)
  answers: AnswerDto[];
}
```

**Update DTOs:** Extend using `PartialType` from `@nestjs/mapped-types`:
```typescript
// src/modules/universities/dto/update-university.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateUniversityDto } from './create-university.dto';

export class UpdateUniversityDto extends PartialType(CreateUniversityDto) {}
```

**Response DTOs:** Plain classes without decorators (no `class-validator` annotations):
```typescript
// src/modules/search/dto/search-response.dto.ts
export class InstitutionDto {
  oid: string;
  name: string;
  description: string | null;
  locations: LocationDto[];
}
```

**ValidationPipe:** Applied per-route (not globally), always with `{ transform: true, whitelist: true }`:
```typescript
@Post('register')
register(
  @Body(new ValidationPipe({ transform: true, whitelist: true }))
  dto: RegisterDto,
) { ... }

@Get('templates')
listTemplates(
  @Query(new ValidationPipe({ transform: true, whitelist: true }))
  query: ListTemplatesQueryDto,
) { ... }
```

## Error Handling

**HTTP exceptions thrown from services** (never from controllers directly):

| Scenario | Exception |
|---|---|
| Resource not found | `NotFoundException` |
| Duplicate / conflict | `ConflictException` |
| Invalid input / expired token | `BadRequestException` |
| Wrong credentials / unauthenticated | `UnauthorizedException` |
| Wrong user accessing resource | `ForbiddenException` |
| Upstream API failure | `BadGatewayException` |

**Upstream API pattern (`src/modules/universities/universities.service.ts`):**
```typescript
try {
  const response = await firstValueFrom(
    this.httpService.get(`${OPINTOPOLKU_BASE}/search/oppilaitokset`, { params }),
  );
  return { total: data.total ?? 0, page, size, hits: [...] };
} catch {
  throw new BadGatewayException('Upstream Opintopolku API is unreachable');
}
```

**Not found pattern:**
```typescript
const template = await this.prisma.testTemplate.findUnique(...);
if (!template || !template.isActive) {
  throw new NotFoundException(`Template not found`);
}
```

**No global exception filter** is implemented yet — NestJS defaults apply.

## Response Shaping

**Paginated response shape (all list endpoints):**
```typescript
{
  total: number,   // total matching records
  page: number,    // current zero-indexed page
  size: number,    // page size
  hits: [...],     // or templates: [...] / tests: [...]
}
```

**Success message shape (auth endpoints):**
```typescript
{ message: string }
```

**Sensitive field stripping:** Done manually via destructuring, not class serialization:
```typescript
const { passwordHash: _, ...userWithoutPassword } = user;
return { user: userWithoutPassword };
```

**isCorrect never exposed on in-progress tests:** Stripped manually in service responses.

## Helper Patterns

**`resolveLang` helper** — used in every proxy service for localised string resolution. Defined as an inline arrow function inside each method/service (not extracted to a shared module):

```typescript
const resolveLang = (obj: any) => {
  if (!obj || typeof obj !== 'object') return obj ?? '';
  return obj[lng] ?? obj.en ?? obj.fi ?? '';
};
```

Language priority: requested `lng` > `en` > `fi` > empty string.

**`mapCodeName` helper** — inline helper for Opintopolku code/name pair arrays:
```typescript
const mapCodeName = (arr: any[] = []) =>
  (arr ?? []).map((e: any) => ({
    code: e.koodiUri,
    name: resolveLang(e.nimi),
  }));
```

**RxJS to Promise conversion:** Always use `firstValueFrom()` from `rxjs`, never `.toPromise()`:
```typescript
const response = await firstValueFrom(this.httpService.get(url, { params }));
```

**Private class constants** for config values:
```typescript
private readonly SALT_ROUNDS = 10;
private readonly VERIFY_TOKEN_EXPIRY_HOURS = 24;
```

## Authentication Pattern

**Guard usage:** `@UseGuards(JwtAuthGuard)` applied at method level (not controller level) for mixed-auth controllers:
```typescript
@Get(':id')
@UseGuards(JwtAuthGuard)
getAttempt(@CurrentUser() user: CurrentUserData, @Param('id') id: string) { ... }
```

**`@CurrentUser()` decorator** extracts the authenticated user from `request.user`:
```typescript
// src/common/decorators/current-user.decorator.ts
export const CurrentUser = createParamDecorator(
  (data: keyof CurrentUserData | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();
    const user = request.user as CurrentUserData;
    return data ? user?.[data] : user;
  },
);
```

## Logging

**Library:** `console.log` only — no logging framework.

**Pattern:** Prefixed with module tag in square brackets:
```typescript
console.log(`[Auth] Email verification token for ${user.email}: ${emailVerifyToken}`);
console.log(`[Auth] Password reset token for ${user.email}: ${resetToken}`);
```

**Note:** These `console.log` calls are temporary scaffolding for tokens that should be sent via email in production.

## Comments

**Style:** Inline comments for intent, not mechanism. Comment WHY, not WHAT.
```typescript
// Log verification token (in production, this would be sent via email)
// Always return success to prevent email enumeration
// Rotate the refresh token
// Invalidate all existing refresh tokens for this user
```

**No JSDoc/TSDoc** used in the current codebase.

**ESLint disable comments** used sparingly with specific rule names:
```typescript
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { passwordHash: _, ...userWithoutPassword } = user;
```

## Module Design

**Exports:** Each module exports its own service for use by other modules:
```typescript
// auth.module.ts exports AuthService
// users.module.ts exports UsersService
```

**Barrel files:** DTOs use an `index.ts` barrel in `dto/` folder:
```typescript
// src/modules/auth/dto/index.ts
export { RegisterDto } from './register.dto';
export { LoginDto } from './login.dto';
// ... etc
```

**Barrel import usage:**
```typescript
import { RegisterDto, LoginDto, RefreshTokenDto } from './dto';
```

**No barrel files** for other module types (controllers, services import directly).

---

*Convention analysis: 2026-04-24*
