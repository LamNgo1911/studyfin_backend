# Phase 5: Search and Infrastructure - Pattern Map

**Mapped:** 2026-05-01
**Files analyzed:** 11 (all modified, no new files)
**Analogs found:** 11 / 11

## File Classification

| New/Modified File | Role | Data Flow | Closest Analog | Match Quality |
|---|---|---|---|---|
| `prisma/schema.prisma` | config/schema | data-definition | `prisma/schema.prisma` (self) | exact |
| `src/modules/search/search.service.ts` | service | full-text-search | `src/modules/search/search.service.ts` (existing) | exact |
| `src/modules/search/search.controller.ts` | controller | request-response | `src/modules/search/search.controller.ts` (existing) | exact |
| `src/modules/search/search.module.ts` | module | config | `src/modules/search/search.module.ts` (existing) | exact |
| `src/modules/search/dto/search-query.dto.ts` | dto | request-response | `src/modules/search/dto/search-query.dto.ts` (existing) | exact |
| `src/modules/search/dto/search-response.dto.ts` | dto | request-response | `src/modules/search/dto/search-response.dto.ts` (existing) | exact |
| `src/app.module.ts` | module | config | `src/app.module.ts` (existing) | exact |
| `src/main.ts` | bootstrap | config | `src/main.ts` (existing) | exact |
| `src/modules/sync/sync.service.ts` | service | batch | `src/modules/sync/sync.service.ts` (existing) | exact |
| `src/modules/programs/programs.service.ts` | service | CRUD | `src/modules/programs/programs.service.ts` (existing) | exact |
| `src/modules/universities/universities.service.ts` | service | CRUD | `src/modules/universities/universities.service.ts` (existing) | exact |

## Pattern Assignments

### `prisma/schema.prisma` (config/schema, data-definition)

**Analog:** `prisma/schema.prisma` (self -- modified in place)

**Schema structure** (lines 1-8):
```prisma
generator client {
  provider = "prisma-client-js"
  output   = "../generated/prisma"
}

datasource db {
  provider = "postgresql"
}
```

**Preview features pattern** -- add to generator block (line 3):
```prisma
generator client {
  provider        = "prisma-client-js"
  output          = "../generated/prisma"
  previewFeatures = ["fullTextSearchPostgres"]
}
```

**Index patterns on existing models** (lines 32-34 for University, lines 74-77 for Program):
```prisma
  @@index([type])
  @@index([syncedAt])
```

**Full-text index addition pattern** -- append to University model (after line 34) and Program model (after line 77):
```prisma
  @@index([name], type: BTree)  // existing-like pattern for full-text index
```

**Note:** Full-text search indexes in Prisma use the `@@index` directive with a specific `type` field. The exact `fullTextSearchPostgres` index syntax is:
```prisma
  @@index([name], type: BTree)   // BTree is implicit default
```
But for full-text search, the relevant index approach is to use a raw SQL migration to create a GIN index, or use Prisma's `@@index` with the `type` parameter if supported. The `fullTextSearchPostgres` preview feature enables `orderBy: { _relevance }` which requires the GIN index on a `tsvector` column. This is typically done via a raw migration.

---

### `src/modules/search/search.service.ts` (service, full-text-search)

**Analog:** `src/modules/search/search.service.ts` (existing -- rewritten in place)

**Imports pattern** (lines 1-7):
```typescript
import { Injectable } from '@nestjs/common';
import { SearchQueryDto, DbSearchQueryDto } from './dto/search-query.dto';
import {
  InstitutionDto,
  InstitutionSearchResponseDto,
} from './dto/search-response.dto';
import { PrismaService } from '../../providers/prisma.service';
```

**Constructor/DI pattern** (lines 10-11):
```typescript
@Injectable()
export class SearchService {
  constructor(private readonly prisma: PrismaService) {}
```

**Pagination pattern (existing)** (lines 17-18, 56-60):
```typescript
const size = query.size ?? 20;
const page = query.page ?? 0;
// ...
skip: page * size,
take: size,
```

**CRUD query + count pattern** (lines 24-33):
```typescript
const [total, rows] = await Promise.all([
  this.prisma.university.count({ where }),
  this.prisma.university.findMany({
    where,
    include: { locations: true },
    skip: page * size,
    take: size,
    orderBy: { name: 'asc' },
  }),
]);
```

**Response shape pattern** (lines 48, 91, 142):
```typescript
return { total, page, size, hits };
```

**Helper method pattern** (lines 145-169):
```typescript
private cleanImplementations(raw: any): any[] | null {
  if (!Array.isArray(raw)) return null;
  // ...
  return result.length > 0 ? result : null;
}
```

**Full-text search pattern for Prisma with `fullTextSearchPostgres`**:
```typescript
// When q is provided, use full-text search with relevance scoring
const where = q
  ? { name: { search: q, mode: 'insensitive' as const } }
  : {};

// Relevance ordering:
orderBy: { _relevance: { search: q, fields: ['name', 'description'], sort: 'desc' } },
```

**Analog for query+count pattern:** `src/modules/programs/programs.service.ts` lines 14-25 (same `$transaction` approach for parallel count+findMany):
```typescript
const [total, rows] = await this.prisma.$transaction([
  this.prisma.program.count(),
  this.prisma.program.findMany({
    skip: page * size,
    take: size,
    include: {
      universities: {
        include: { university: { select: { oid: true, name: true } } },
      },
    },
  }),
]);
```

**Same pattern for include with nested relations** -- `src/modules/universities/universities.service.ts` lines 55-70:
```typescript
const [total, rows] = await this.prisma.$transaction([
  this.prisma.program.count({
    where: { universities: { some: { universityId: university.id } } },
  }),
  this.prisma.program.findMany({
    where: { universities: { some: { universityId: university.id } } },
    skip: page * size,
    take: size,
    include: { ... },
  }),
]);
```

**Error handling pattern** -- Services throw NestJS HTTP exceptions directly (no try/catch for expected conditions).
Analog: `src/modules/programs/programs.service.ts` line 45:
```typescript
if (!program) throw new NotFoundException(`Program not found: ${oid}`);
```

---

### `src/modules/search/search.controller.ts` (controller, request-response)

**Analog:** `src/modules/search/search.controller.ts` (existing -- modified in place)

**Imports pattern** (lines 1-4):
```typescript
import { Controller, Get, Query, ValidationPipe } from '@nestjs/common';
import { SearchService } from './search.service';
import { SearchQueryDto, DbSearchQueryDto } from './dto/search-query.dto';
import { InstitutionSearchResponseDto } from './dto/search-response.dto';
```

**Route + validation pattern** (lines 18-24):
```typescript
@Get()
search(
  @Query(new ValidationPipe({ transform: true, whitelist: true }))
  query: DbSearchQueryDto,
) {
  return this.searchService.search(query);
}
```

**Swagger decoration pattern** (new -- to add): Controller-level decorator for tags:
```typescript
import { ApiTags, ApiQuery, ApiResponse } from '@nestjs/swagger';

@ApiTags('Search')
@Controller('search')
export class SearchController {
```

Per-method query parameter documentation (per D-08, only DTOs get `@ApiProperty`, not per-method `@ApiResponse`):
```typescript
@Get()
@ApiQuery({ name: 'q', required: false, type: String })
@ApiQuery({ name: 'type', required: false, enum: ['programs', 'institutions'] })
@ApiQuery({ name: 'page', required: false, type: Number })
@ApiQuery({ name: 'size', required: false, type: Number })
search(
  @Query(new ValidationPipe({ transform: true, whitelist: true }))
  query: UnifiedSearchQueryDto,
) {
  return this.searchService.search(query);
}
```

**Analog for existing route pattern** -- `src/modules/universities/universities.controller.ts` lines 8-16:
```typescript
@Get()
findAll(@Query() query: Record<string, any>) {
  return this.universitiesService.findAll(query);
}

@Get(':oid')
findOne(@Param('oid') oid: string, @Query('lng') lng?: string) {
  return this.universitiesService.findOne(oid, lng);
}
```

---

### `src/modules/search/search.module.ts` (module, config)

**Analog:** `src/modules/search/search.module.ts` (existing lines 1-9):
```typescript
import { Module } from '@nestjs/common';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';

@Module({
  controllers: [SearchController],
  providers: [SearchService],
})
export class SearchModule {}
```

**No CacheModule import needed** if caching is done at service layer within the service methods (via `@nestjs/cache-manager` decorator or manual `CacheManager` injection). If caching is module-level, the pattern follows `HttpModule` on `SyncModule` -- analog: `src/modules/sync/sync.module.ts` lines 1-11:
```typescript
import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { SyncController } from './sync.controller';
import { SyncService } from './sync.service';

@Module({
  imports: [HttpModule],
  controllers: [SyncController],
  providers: [SyncService],
})
export class SyncModule {}
```

---

### `src/modules/search/dto/search-query.dto.ts` (dto, request-response)

**Analog:** `src/modules/search/dto/search-query.dto.ts` (existing -- modified in place)

**class-validator + class-transformer pattern** (lines 1-11):
```typescript
import {
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
  MinLength,
} from 'class-validator';

import { Type } from 'class-transformer';
```

**Existing DbSearchQueryDto as base pattern** (lines 33-54):
```typescript
export class DbSearchQueryDto {
  @IsOptional()
  @IsString()
  q?: string = '';

  @IsOptional()
  @IsIn(['institutions', 'programs'])
  type?: 'institutions' | 'programs' = 'programs';

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  size?: number = 20;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  page?: number = 0;
}
```

**Swagger ApiProperty pattern** (new -- to add per D-08): Decorate each field with `@ApiProperty`:
```typescript
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UnifiedSearchQueryDto {
  @ApiPropertyOptional({ description: 'Search keyword' })
  @IsOptional()
  @IsString()
  q?: string = '';

  @ApiPropertyOptional({ enum: ['programs', 'institutions'] })
  @IsOptional()
  @IsIn(['programs', 'institutions'])
  type?: 'programs' | 'institutions';

  @ApiPropertyOptional({ default: 20 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  size?: number = 20;

  @ApiPropertyOptional({ default: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  page?: number = 0;
}
```

**Analog for nested DTO validation** -- `src/modules/guidance/dto/create-guidance.dto.ts` lines 1-11:
```typescript
import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, ValidateNested } from 'class-validator';
import { GuidanceSectionDto } from './guidance-section.dto';

export class CreateGuidanceDto {
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => GuidanceSectionDto)
  sections: GuidanceSectionDto[];
}
```

---

### `src/modules/search/dto/search-response.dto.ts` (dto, request-response)

**Analog:** `src/modules/search/dto/search-response.dto.ts` (existing -- modified in place)

**Existing DTO class pattern** (lines 1-24):
```typescript
export class LocationDto {
  code: string;
  name: string;
}

export class InstitutionDto {
  oid: string;
  name: string;
  description: string | null;
  logoUrl: string | null;
  type: string;
  municipality: string | null;
  website: string | null;
  email: string | null;
  studentCount: number | null;
  locations: LocationDto[];
}

export class InstitutionSearchResponseDto {
  total: number;
  page: number;
  size: number;
  hits: InstitutionDto[];
}
```

**Swagger ApiProperty pattern** (new -- to add per D-08):
```typescript
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SearchHitDto {
  @ApiProperty()
  oid: string;

  @ApiProperty()
  name: string;

  @ApiProperty({ description: "'program' | 'institution'" })
  type: string;

  // ... discriminator-based fields
}

export class UnifiedSearchResponseDto {
  @ApiProperty()
  total: number;

  @ApiProperty()
  page: number;

  @ApiProperty()
  size: number;

  @ApiProperty({ type: [SearchHitDto] })
  hits: SearchHitDto[];
}
```

---

### `src/app.module.ts` (module, config)

**Analog:** `src/app.module.ts` (existing lines 1-33):

**Existing module import pattern** (lines 16-29):
```typescript
@Module({
  imports: [
    ScheduleModule.forRoot(),
    PrismaModule,
    SyncModule,
    AuthModule,
    SearchModule,
    UsersModule,
    UniversitiesModule,
    ProgramsModule,
    GuidanceModule,
    MockTestsModule,
    AdminModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

**Pattern for adding global modules** (new -- CacheModule, ThrottlerModule, ConfigModule):
```typescript
import { CacheModule } from '@nestjs/cache-manager';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    // Config must be first to make env vars available
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([{
      ttl: 60000,    // 60 seconds
      limit: 100,    // 100 requests
    }]),
    CacheModule.register({
      isGlobal: true,
      ttl: 24 * 60 * 60 * 1000,  // 24h in ms
    }),
    ScheduleModule.forRoot(),
    PrismaModule,
    // ... feature modules
  ],
  providers: [
    AppService,
    { provide: APP_GUARD, useClass: ThrottlerGuard },
  ],
})
export class AppModule {}
```

**Analog for @Global() module pattern** -- `src/providers/prisma.module.ts` lines 1-9:
```typescript
import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
```

**Note:** `ConfigModule.forRoot({ isGlobal: true })` and `CacheModule.register({ isGlobal: true })` avoid needing to import them in every feature module.

---

### `src/main.ts` (bootstrap, config)

**Analog:** `src/main.ts` (existing lines 1-14):

**Existing bootstrap pattern**:
```typescript
import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
```

**Swagger setup pattern** (new -- add to bootstrap):
```typescript
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Swagger
  const config = new DocumentBuilder()
    .setTitle('StudyFin API')
    .setDescription('Finnish higher education API for international students')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // CORS
  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 3000);
}
```

**ConfigService replacement pattern** (replace `import 'dotenv/config'` with `ConfigService`):
```typescript
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get('PORT', 3000);
  // ...
  await app.listen(port);
}
```

---

### `src/modules/sync/sync.service.ts` (service, batch)

**Analog:** `src/modules/sync/sync.service.ts` (existing -- modified in place)

**Existing inject + Logger pattern** (lines 1-20):
```typescript
import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Cron, CronExpression } from '@nestjs/schedule';
import { firstValueFrom } from 'rxjs';
import { PrismaService } from '../../providers/prisma.service';
import { OPINTOPOLKU_BASE } from '../../config/opintopolku.config';
import { Prisma } from '../../../generated/prisma';

const PAGE_SIZE = 100;
const EDUCATION_TYPES = 'yo,amk,amm';

@Injectable()
export class SyncService {
  private readonly logger = new Logger(SyncService.name);
  private isSyncing = false;

  constructor(
    private readonly httpService: HttpService,
    private readonly prisma: PrismaService,
  ) {}
```

**Cache invalidation pattern** (new -- add CacheManager injection + invalidation in `syncAll()`):
```typescript
import { Inject, Injectable, Logger } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class SyncService {
  constructor(
    private readonly httpService: HttpService,
    private readonly prisma: PrismaService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  async syncAll(): Promise<{ institutions: number; programs: number }> {
    if (this.isSyncing) {
      this.logger.warn('Sync already in progress -- skipping concurrent run');
      return { institutions: 0, programs: 0 };
    }
    this.isSyncing = true;
    try {
      this.logger.log('Starting full sync');
      const institutionCount = await this.syncInstitutions();
      const programCount = await this.syncPrograms();
      this.logger.log(
        `Sync complete: ${institutionCount} institutions, ${programCount} programs`,
      );

      // Invalidate cache after successful sync
      await this.invalidateCache();
      this.logger.log('Cache invalidated after sync');

      return { institutions: institutionCount, programs: programCount };
    } finally {
      this.isSyncing = false;
    }
  }

  private async invalidateCache(): Promise<void> {
    // Cache key naming convention (Claude's discretion area -- example pattern)
    const keys = [
      'programs:*',
      'universities:*',
      'search:*',
    ];
    // keyv/redis supports pattern-based deletion via keyv.keyvStore
    // or iterate and delete specific prefixes
  }
}
```

---

### `src/modules/programs/programs.service.ts` (service, CRUD)

**Analog:** `src/modules/programs/programs.service.ts` (existing -- modified in place)

**Existing CRUD pattern** (lines 1-91) -- same as above.

**Caching pattern for findAll** (new -- add CacheManager + cache-aside):
```typescript
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { PrismaService } from '../../providers/prisma.service';

@Injectable()
export class ProgramsService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  async findAll(query: Record<string, any> = {}) {
    const cacheKey = `programs:list:${JSON.stringify(query)}`;
    const cached = await this.cacheManager.get(cacheKey);
    if (cached) return cached;

    const rawSize = Number(query.size);
    const rawPage = Number(query.page);
    const size = Number.isFinite(rawSize) && rawSize > 0 ? Math.floor(rawSize) : 20;
    const page = Number.isFinite(rawPage) && rawPage >= 0 ? Math.floor(rawPage) : 0;

    const [total, rows] = await this.prisma.$transaction([
      this.prisma.program.count(),
      this.prisma.program.findMany({ ... }),
    ]);

    const result = { total, page, size, hits: rows.map((row) => this.mapProgram(row)) };
    await this.cacheManager.set(cacheKey, result, 24 * 60 * 60 * 1000); // 24h TTL
    return result;
  }

  async findOne(oid: string, _lng?: string) {
    const cacheKey = `programs:detail:${oid}`;
    const cached = await this.cacheManager.get(cacheKey);
    if (cached) return cached;

    const program = await this.prisma.program.findUnique({ ... });
    if (!program) throw new NotFoundException(`Program not found: ${oid}`);

    const result = this.mapProgramDetail(program);
    await this.cacheManager.set(cacheKey, result, 24 * 60 * 60 * 1000);
    return result;
  }
}
```

---

### `src/modules/universities/universities.service.ts` (service, CRUD)

**Analog:** `src/modules/universities/universities.service.ts` (existing -- modified in place)

**Same caching pattern** as `programs.service.ts` above.

**Existing CRUD + pagination pattern** (lines 8-29):
```typescript
async findAll(query: Record<string, any> = {}) {
  const rawSize = Number(query.size);
  const rawPage = Number(query.page);
  const size = Number.isFinite(rawSize) && rawSize > 0 ? Math.floor(rawSize) : 20;
  const page = Number.isFinite(rawPage) && rawPage >= 0 ? Math.floor(rawPage) : 0;

  const [total, rows] = await this.prisma.$transaction([
    this.prisma.university.count(),
    this.prisma.university.findMany({
      skip: page * size,
      take: size,
      include: { locations: true },
    }),
  ]);

  return {
    total,
    page,
    size,
    hits: rows.map((row) => this.mapUniversity(row)),
  };
}
```

---

## Shared Patterns

### Caching via `@nestjs/cache-manager` + `@keyv/redis`
**Source:** New pattern (no existing analog in codebase)
**Apply to:** `programs.service.ts`, `universities.service.ts`, `search.service.ts`, `sync.service.ts`

```typescript
import { Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Inject(CACHE_MANAGER) private readonly cacheManager: Cache
```

Cache-aside pattern:
1. Check cache: `const cached = await this.cacheManager.get(key); if (cached) return cached;`
2. Compute result from DB
3. Store: `await this.cacheManager.set(key, result, ttlMs);`

**Global CacheModule registration** in `app.module.ts`:
```typescript
CacheModule.registerAsync({
  isGlobal: true,
  useFactory: () => ({
    stores: [new KeyvRedis(redisClient)],
    ttl: 24 * 60 * 60 * 1000, // default 24h
  }),
}),
```

### Rate Limiting via `@nestjs/throttler`
**Source:** New pattern (no existing analog)
**Apply to:** `app.module.ts` (global) with per-route overrides for admin/auth endpoints

```typescript
// Global registration (app.module.ts)
ThrottlerModule.forRoot([{
  ttl: 60000,      // 60 seconds window
  limit: 100,      // 100 requests per window
}]),

// APP_GUARD provider
{ provide: APP_GUARD, useClass: ThrottlerGuard },

// Per-route override for admin/auth:
@SkipThrottle()          // skip throttling
@Throttle({ default: { limit: 30, ttl: 60000 } })  // custom limit
```

### Configuration via `@nestjs/config`
**Source:** New pattern (replaces bare `dotenv/config`)
**Apply to:** `main.ts`, `prisma.service.ts`, `app.module.ts`

```typescript
// app.module.ts
ConfigModule.forRoot({ isGlobal: true })

// main.ts - replace `import 'dotenv/config'`
const configService = app.get(ConfigService);
const port = configService.get('PORT', 3000);

// prisma.service.ts - replace `process.env.DATABASE_URL`
// (requires ConfigService injection or keep process.env since env is loaded globally)
```

### Swagger Documentation
**Source:** New pattern (no existing analog)
**Apply to:** All controllers and DTOs

**Controller-level:**
```typescript
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Programs')
@Controller('programs')
export class ProgramsController { ... }
```

**DTO property level (per D-08 -- only DTOs, not response shapes):**
```typescript
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SomeDto {
  @ApiProperty({ description: 'Item OID', example: '1.2.246.562.10.123' })
  oid: string;

  @ApiPropertyOptional({ description: 'Optional name filter' })
  name?: string;
}
```

**Set up in main.ts** (see Swagger setup pattern above).

### Throttler Override for Admin Routes
**Source:** `src/modules/guidance/guidance.controller.ts` (existing auth guard pattern)
**Apply to:** Admin controllers needing stricter rate limits:
```typescript
import { SkipThrottle, Throttle } from '@nestjs/throttler';

// Stricter limit for auth endpoints
@Throttle({ default: { limit: 10, ttl: 60000 } })
@UseGuards(JwtAuthGuard)
```

### Error Handling
**Source:** All existing services
**Apply to:** All service files (existing pattern, no change needed)

NestJS HTTP exceptions thrown directly from services:
```typescript
// src/modules/programs/programs.service.ts line 45
if (!program) throw new NotFoundException(`Program not found: ${oid}`);
```

### Prisma Module (Global)
**Source:** `src/providers/prisma.module.ts` lines 1-9
**Apply to:** Reference for how to make new modules global

```typescript
@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
```

### Validation Pipe (Per-Route)
**Source:** `src/modules/search/search.controller.ts` lines 20-21
**Apply to:** Any controller with validated inputs

```typescript
@Query(new ValidationPipe({ transform: true, whitelist: true }))
query: SomeDto
```

---

## No Analog Found

All 11 files being modified have direct existing analogs in the codebase (they are being modified in place). However, several patterns being introduced have NO existing analog:

| Pattern | Reason for No Analog |
|---------|---------------------|
| `@nestjs/cache-manager` + `@keyv/redis` caching | No caching infrastructure exists yet; entirely new dependency |
| `@nestjs/throttler` rate limiting | No rate limiting exists yet; entirely new dependency |
| `@nestjs/swagger` documentation | No API documentation exists yet; entirely new dependency |
| `@nestjs/config` | Currently using bare `dotenv/config`; migration to `@nestjs/config` is new |
| Prisma `fullTextSearchPostgres` | Preview feature not yet enabled; full-text search is new |
| Prisma GIN indexes for full-text | Raw migration or new index types not yet used |

For these patterns, the planner should use NestJS documentation patterns and the specific library README conventions. The pattern excerpts provided in the Shared Patterns section above are sufficient to guide implementation.

---

## Metadata

**Analog search scope:** `src/modules/search/`, `src/modules/programs/`, `src/modules/universities/`, `src/modules/sync/`, `src/modules/guidance/`, `src/providers/`, `src/common/guards/`, `src/common/decorators/`, `src/config/`, `prisma/`
**Files scanned:** 11 source files + 3 supporting files (guards, decorators, spec)
**Pattern extraction date:** 2026-05-01
