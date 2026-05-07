import { Injectable, NotFoundException, Inject } from '@nestjs/common';
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
    const size =
      Number.isFinite(rawSize) && rawSize > 0 ? Math.floor(rawSize) : 20;
    const page =
      Number.isFinite(rawPage) && rawPage >= 0 ? Math.floor(rawPage) : 0;

    const allRows = await this.prisma.program.findMany({
      include: {
        universities: {
          include: {
            university: {
              select: {
                oid: true,
                name: true,
                nameMultilingual: true,
                descriptionMultilingual: true,
              },
            },
          },
        },
      },
    });

    const englishRows = allRows.filter((row: any) =>
      this.programHasEnglishUniversity(row),
    );
    const total = englishRows.length;
    const start = page * size;
    const sliced = englishRows.slice(start, start + size);

    const result = {
      total,
      page,
      size,
      hits: sliced.map((row) => this.mapProgram(row)),
    };

    await this.cacheManager.set(cacheKey, result, 24 * 60 * 60 * 1000);
    return result;
  }

  async findOne(oid: string) {
    const cacheKey = `programs:detail:${oid}`;
    const cached = await this.cacheManager.get(cacheKey);
    if (cached) return cached;

    const program = await this.prisma.program.findUnique({
      where: { oid },
      include: {
        universities: {
          include: {
            university: {
              select: {
                oid: true,
                name: true,
                nameMultilingual: true,
                descriptionMultilingual: true,
              },
            },
          },
        },
        _count: { select: { guidanceSections: true } },
      },
    });
    if (!program) throw new NotFoundException(`Program not found: ${oid}`);

    if (!this.programHasEnglishUniversity(program))
      throw new NotFoundException(`Program not found: ${oid}`);

    const result = this.mapProgramDetail(program);
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

  private programHasEnglishUniversity(row: any): boolean {
    return (row.universities ?? []).some((pu: any) =>
      this.hasEnglish(pu.university),
    );
  }

  private resolveLang(data: any): string {
    if (!data) return '';
    if (typeof data === 'string') return data;
    if (typeof data !== 'object') return String(data);
    return data.en ?? data.fi ?? '';
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
      providers: (row.universities ?? [])
        .filter((pu: any) => this.hasEnglish(pu.university))
        .map((pu: any) => ({
          oid: pu.university.oid,
          name: this.resolveLang(
            pu.university.nameMultilingual ?? pu.university.name,
          ),
        })),
    };
  }

  private mapProgramDetail(row: any) {
    return {
      oid: row.oid,
      name: row.name,
      description: row.description ?? null,
      type: row.type,
      typePath: row.typePath ?? null,
      isDegree: row.isDegree,
      imageUrl: row.imageUrl ?? null,
      creditsAmount: row.creditsAmount ?? null,
      creditsUnit: row.creditsUnit ?? null,
      eqfLevel: row.eqfLevel ?? null,
      nqfLevel: row.nqfLevel ?? null,
      fieldOfStudy: row.fieldOfStudy ?? null,
      degreeTitles: row.degreeTitles ?? [],
      teachingLanguages: row.teachingLanguages ?? [],
      implementations: row.implementations ?? null,
      applicationTargets: row.applicationTargets ?? null,
      duration: row.duration ?? null,
      hasGuidance: (row._count?.guidanceSections ?? 0) > 0,
      universities: (row.universities ?? [])
        .filter((pu: any) => this.hasEnglish(pu.university))
        .map((pu: any) => ({
          oid: pu.university.oid,
          name: this.resolveLang(
            pu.university.nameMultilingual ?? pu.university.name,
          ),
        })),
    };
  }
}
