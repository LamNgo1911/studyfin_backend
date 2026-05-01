import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { PrismaService } from '../../providers/prisma.service';

@Injectable()
export class UniversitiesService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  async findAll(query: Record<string, any> = {}) {
    const cacheKey = `universities:list:${JSON.stringify(query)}`;
    const cached = await this.cacheManager.get(cacheKey);
    if (cached) return cached;

    const rawSize = Number(query.size);
    const rawPage = Number(query.page);
    const size = Number.isFinite(rawSize) && rawSize > 0 ? Math.floor(rawSize) : 20;
    const page = Number.isFinite(rawPage) && rawPage >= 0 ? Math.floor(rawPage) : 0;

    const where =
      query.language
        ? {
            programs: {
              some: {
                program: {
                  teachingLanguages: { has: query.language },
                },
              },
            },
          }
        : {};

    const [total, rows] = await this.prisma.$transaction([
      this.prisma.university.count({ where }),
      this.prisma.university.findMany({
        where,
        skip: page * size,
        take: size,
        include: { locations: true },
      }),
    ]);

    const result = {
      total,
      page,
      size,
      hits: rows.map((row) => this.mapUniversity(row)),
    };

    await this.cacheManager.set(cacheKey, result, 24 * 60 * 60 * 1000);
    return result;
  }

  async findOne(oid: string) {
    const cacheKey = `universities:detail:${oid}`;
    const cached = await this.cacheManager.get(cacheKey);
    if (cached) return cached;

    const university = await this.prisma.university.findUnique({
      where: { oid },
      include: { locations: true },
    });
    if (!university)
      throw new NotFoundException(`University not found: ${oid}`);

    const result = this.mapDetailedUniversity(university);
    await this.cacheManager.set(cacheKey, result, 24 * 60 * 60 * 1000);
    return result;
  }

  async findPrograms(oid: string, query: Record<string, any> = {}) {
    const cacheKey = `universities:programs:${oid}:${JSON.stringify(query)}`;
    const cached = await this.cacheManager.get(cacheKey);
    if (cached) return cached;

    const rawSize = Number(query.size);
    const rawPage = Number(query.page);
    const size = Number.isFinite(rawSize) && rawSize > 0 ? Math.floor(rawSize) : 20;
    const page = Number.isFinite(rawPage) && rawPage >= 0 ? Math.floor(rawPage) : 0;

    // Resolve university id from OID (needed for join filter)
    const university = await this.prisma.university.findUnique({
      where: { oid },
      select: { id: true },
    });
    if (!university)
      throw new NotFoundException(`University not found: ${oid}`);

    const [total, rows] = await this.prisma.$transaction([
      this.prisma.program.count({
        where: { universities: { some: { universityId: university.id } } },
      }),
      this.prisma.program.findMany({
        where: { universities: { some: { universityId: university.id } } },
        skip: page * size,
        take: size,
        include: {
          universities: {
            include: { university: { select: { oid: true, name: true } } },
          },
          _count: { select: { guidanceSections: true } },
        },
      }),
    ]);

    const result = {
      total,
      page,
      size,
      hits: rows.map((row) => this.mapProgram(row)),
    };

    await this.cacheManager.set(cacheKey, result, 24 * 60 * 60 * 1000);
    return result;
  }

  private mapUniversity(row: any) {
    return {
      oid: row.oid,
      name: row.name,
      description: row.description ?? null,
      logoUrl: row.logoUrl ?? null,
      type: row.type ?? null,
      municipality: row.municipality ?? null,
      studentCount: row.studentCount ?? null,
      locations: (row.locations ?? []).map((loc: any) => ({
        code: loc.code,
        name: loc.name,
      })),
    };
  }

  private mapDetailedUniversity(row: any) {
    return {
      ...this.mapUniversity(row),
      website: row.website ?? null,
      email: row.email ?? null,
    };
  }

  private mapProgram(row: any) {
    return {
      oid: row.oid,
      name: row.name,
      type: row.type,
      isDegree: row.isDegree,
      imageUrl: row.imageUrl ?? null,
      fieldOfStudy: row.fieldOfStudy ?? null,
      creditsAmount: row.creditsAmount ?? null,
      creditsUnit: row.creditsUnit ?? null,
      teachingLanguages: row.teachingLanguages ?? [],
      hasGuidance: (row._count?.guidanceSections ?? 0) > 0,
      providers: (row.universities ?? []).map((pu: any) => ({
        oid: pu.university.oid,
        name: pu.university.name,
      })),
    };
  }
}
