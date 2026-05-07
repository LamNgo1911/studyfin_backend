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
    const size =
      Number.isFinite(rawSize) && rawSize > 0 ? Math.floor(rawSize) : 20;
    const page =
      Number.isFinite(rawPage) && rawPage >= 0 ? Math.floor(rawPage) : 0;
    const lng: string = query.lng ?? 'en';

    const where = query.language
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

    // Fetch all matching rows (no skip/take) so we can filter by English
    // content and then paginate the filtered set accurately.
    const allRows = await this.prisma.university.findMany({
      where,
      include: { locations: true },
    });

    const englishRows = allRows.filter((row: any) => this.hasEnglish(row));
    const start = page * size;
    const sliced = englishRows.slice(start, start + size);

    const result = {
      total: englishRows.length,
      page,
      size,
      hits: sliced.map((row) => this.mapUniversity(row, lng)),
    };

    await this.cacheManager.set(cacheKey, result, 24 * 60 * 60 * 1000);
    return result;
  }

  async findOne(oid: string, lng: string = 'en') {
    const cacheKey = `universities:detail:${oid}:${lng}`;
    const cached = await this.cacheManager.get(cacheKey);
    if (cached) return cached;

    const university = await this.prisma.university.findUnique({
      where: { oid },
      include: { locations: true },
    });
    if (!university)
      throw new NotFoundException(`University not found: ${oid}`);

    const result = this.mapDetailedUniversity(university, lng);
    await this.cacheManager.set(cacheKey, result, 24 * 60 * 60 * 1000);
    return result;
  }

  async findPrograms(oid: string, query: Record<string, any> = {}) {
    const cacheKey = `universities:programs:${oid}:${JSON.stringify(query)}`;
    const cached = await this.cacheManager.get(cacheKey);
    if (cached) return cached;

    const rawSize = Number(query.size);
    const rawPage = Number(query.page);
    const size =
      Number.isFinite(rawSize) && rawSize > 0 ? Math.floor(rawSize) : 20;
    const page =
      Number.isFinite(rawPage) && rawPage >= 0 ? Math.floor(rawPage) : 0;
    const lng: string = query.lng ?? 'en';

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
            include: {
              university: {
                select: { oid: true, name: true, nameMultilingual: true },
              },
            },
          },
          _count: { select: { guidanceSections: true } },
        },
      }),
    ]);

    const result = {
      total,
      page,
      size,
      hits: rows.map((row) => this.mapProgram(row, lng)),
    };

    await this.cacheManager.set(cacheKey, result, 24 * 60 * 60 * 1000);
    return result;
  }

  private hasEnglish(row: any): boolean {
    const name = row.nameMultilingual;
    if (name == null || typeof name !== 'object' || !('en' in name))
      return false;
    const desc = row.descriptionMultilingual;
    if (desc == null || typeof desc !== 'object' || !('en' in desc))
      return false;
    return true;
  }

  private resolveLang(data: any, lng: string): string {
    if (!data) return '';
    if (typeof data === 'string') return data;
    if (typeof data !== 'object') return String(data);
    return data[lng] ?? data.en ?? data.fi ?? '';
  }

  private mapUniversity(row: any, lng: string) {
    return {
      oid: row.oid,
      name: this.resolveLang(row.nameMultilingual ?? row.name, lng),
      description:
        this.resolveLang(row.descriptionMultilingual ?? row.description, lng) ??
        null,
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

  private mapDetailedUniversity(row: any, lng: string) {
    return {
      ...this.mapUniversity(row, lng),
      website: row.website ?? null,
      email: row.email ?? null,
    };
  }

  private mapProgram(row: any, lng: string) {
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
        name: this.resolveLang(
          pu.university.nameMultilingual ?? pu.university.name,
          lng,
        ),
      })),
    };
  }
}
