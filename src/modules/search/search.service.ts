import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { UnifiedSearchQueryDto } from './dto/search-query.dto';
import { SearchHitDto } from './dto/search-response.dto';
import { PrismaService } from '../../providers/prisma.service';

@Injectable()
export class SearchService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  async search(query: UnifiedSearchQueryDto): Promise<{
    total: number;
    page: number;
    size: number;
    hits: SearchHitDto[];
  }> {
    const q = query.q ?? '';
    const type = query.type;
    const page = query.page ?? 0;
    const size = query.size ?? 20;

    // Cache-aside
    const cacheKey = `search:${JSON.stringify(query)}`;
    const cached = await this.cacheManager.get<{
      total: number;
      page: number;
      size: number;
      hits: SearchHitDto[];
    }>(cacheKey);
    if (cached) return cached;

    // Program-specific where with full-text search when q is provided
    const progWhere = q ? { name: { search: q } } : {};

    // University-specific where with full-text search when q is provided
    const uniWhere = q ? { name: { search: q } } : {};

    // Relevance ordering when q is provided, alphabetical otherwise
    const progOrderBy = q
      ? [
          {
            _relevance: {
              search: q,
              fields: ['name', 'description'] as const,
              sort: 'desc' as const,
            },
          },
        ]
      : [{ name: 'asc' as const }];

    const uniOrderBy = q
      ? [
          {
            _relevance: {
              search: q,
              fields: ['name', 'description'] as const,
              sort: 'desc' as const,
            },
          },
        ]
      : [{ name: 'asc' as const }];

    let result: {
      total: number;
      page: number;
      size: number;
      hits: SearchHitDto[];
    };

    if (type === 'programs') {
      result = await this.searchProgramsOnly(
        progWhere,
        progOrderBy,
        page,
        size,
      );
    } else if (type === 'institutions') {
      result = await this.searchInstitutionsOnly(
        uniWhere,
        uniOrderBy,
        page,
        size,
      );
    } else {
      // Mixed: query both types, merge with relevance-first ordering
      result = await this.searchMixed(
        progWhere,
        uniWhere,
        progOrderBy,
        uniOrderBy,
        page,
        size,
      );
    }

    await this.cacheManager.set(cacheKey, result, 24 * 60 * 60 * 1000);
    return result;
  }

  private async searchProgramsOnly(
    where: any,
    orderBy: any,
    page: number,
    size: number,
  ) {
    const [total, rows] = await this.prisma.$transaction([
      this.prisma.program.count({ where }),
      this.prisma.program.findMany({
        where,
        orderBy,
        skip: page * size,
        take: size,
        include: {
          universities: {
            include: { university: { include: { locations: true } } },
          },
        },
      }),
    ]);

    return {
      total,
      page,
      size,
      hits: rows.map((p) => this.mapProgramHit(p)),
    };
  }

  private async searchInstitutionsOnly(
    where: any,
    orderBy: any,
    page: number,
    size: number,
  ) {
    const allRows = await this.prisma.university.findMany({
      where,
      orderBy,
      include: { locations: true },
    });

    const englishRows = allRows.filter((u: any) => this.hasEnglish(u));
    const start = page * size;
    const sliced = englishRows.slice(start, start + size);

    return {
      total: englishRows.length,
      page,
      size,
      hits: sliced.map((u) => this.mapInstitutionHit(u)),
    };
  }

  private async searchMixed(
    progWhere: any,
    uniWhere: any,
    progOrderBy: any,
    uniOrderBy: any,
    page: number,
    size: number,
  ) {
    // Fetch both types — take enough from each to cover the requested page
    // after merging. 2× size is a safe ceiling for the worst case of highly
    // unbalanced result sets (all hits come from one side).
    const fetchSize = size * 2;
    const [progTotal, uniTotal, programs, universities] = await Promise.all([
      this.prisma.program.count({ where: progWhere }),
      this.prisma.university.count({ where: uniWhere }),
      this.prisma.program.findMany({
        where: progWhere,
        orderBy: progOrderBy,
        skip: page * Math.ceil(size / 2),
        take: fetchSize,
        include: {
          universities: {
            include: { university: { include: { locations: true } } },
          },
        },
      }),
      this.prisma.university.findMany({
        where: uniWhere,
        orderBy: uniOrderBy,
        skip: page * Math.floor(size / 2),
        take: fetchSize,
        include: { locations: true },
      }),
    ]);

    // Program hits first (more specific results), then institution hits.
    // Filter to only items with English university content.
    const progHits = programs
      .filter((p: any) =>
        (p.universities ?? []).some((pu: any) =>
          this.hasEnglish(pu.university),
        ),
      )
      .map((p) => this.mapProgramHit(p));
    const uniHits = universities
      .filter((u: any) => this.hasEnglish(u))
      .map((u) => this.mapInstitutionHit(u));
    const merged = [...progHits, ...uniHits];

    const total = progTotal + uniTotal;
    const paginated = merged.slice(0, size);

    return { total, page, size, hits: paginated };
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

  private resolveLang(data: any): string {
    if (!data) return '';
    if (typeof data === 'string') return data;
    if (typeof data !== 'object') return String(data);
    return data.en ?? data.fi ?? '';
  }

  private mapProgramHit(row: any): SearchHitDto {
    return {
      oid: row.oid,
      name: row.name,
      description: row.description ?? undefined,
      type: 'program',
      itemType: row.type,
      typePath: row.typePath ?? undefined,
      isDegree: row.isDegree,
      imageUrl: row.imageUrl ?? undefined,
      creditsAmount: row.creditsAmount ?? undefined,
      creditsUnit: row.creditsUnit ?? undefined,
      eqfLevel: row.eqfLevel ?? undefined,
      nqfLevel: row.nqfLevel ?? undefined,
      fieldOfStudy: row.fieldOfStudy ?? undefined,
      degreeTitles: row.degreeTitles ?? [],
      teachingLanguages: row.teachingLanguages ?? [],
      implementations: row.implementations ?? undefined,
      providers: (row.universities ?? [])
        .filter((pu: any) => this.hasEnglish(pu.university))
        .map((pu: any) => ({
          oid: pu.university.oid,
          name: this.resolveLang(
            pu.university.nameMultilingual ?? pu.university.name,
          ),
          locations: (pu.university.locations ?? []).map((l: any) => ({
            code: l.code,
            name: l.name,
          })),
        })),
    };
  }

  private mapInstitutionHit(row: any): SearchHitDto {
    return {
      oid: row.oid,
      name: this.resolveLang(row.nameMultilingual ?? row.name),
      description:
        this.resolveLang(row.descriptionMultilingual ?? row.description) ??
        undefined,
      type: 'institution',
      itemType: row.type,
      logoUrl: row.logoUrl ?? undefined,
      municipality: row.municipality ?? undefined,
      website: row.website ?? undefined,
      email: row.email ?? undefined,
      studentCount: row.studentCount ?? undefined,
      locations: (row.locations ?? []).map((l: any) => ({
        code: l.code,
        name: l.name,
      })),
      // Program-specific fields defaulted
      isDegree: false,
      degreeTitles: [],
      teachingLanguages: [],
    };
  }
}
