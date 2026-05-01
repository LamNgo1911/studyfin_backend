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
    const progWhere = q
      ? { name: { search: q } }
      : {};

    // University-specific where with full-text search when q is provided
    const uniWhere = q
      ? { name: { search: q } }
      : {};

    // Relevance ordering when q is provided, alphabetical otherwise
    const progOrderBy = q
      ? [{ _relevance: { search: q, fields: ['name', 'description'] as const, sort: 'desc' as const } }]
      : [{ name: 'asc' as const }];

    const uniOrderBy = q
      ? [{ _relevance: { search: q, fields: ['name', 'description'] as const, sort: 'desc' as const } }]
      : [{ name: 'asc' as const }];

    let result: { total: number; page: number; size: number; hits: SearchHitDto[] };

    if (type === 'programs') {
      result = await this.searchProgramsOnly(progWhere, progOrderBy, page, size);
    } else if (type === 'institutions') {
      result = await this.searchInstitutionsOnly(uniWhere, uniOrderBy, page, size);
    } else {
      // Mixed: query both types, merge with relevance-first ordering
      result = await this.searchMixed(progWhere, uniWhere, progOrderBy, uniOrderBy, page, size);
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
    const [total, rows] = await this.prisma.$transaction([
      this.prisma.university.count({ where }),
      this.prisma.university.findMany({
        where,
        orderBy,
        skip: page * size,
        take: size,
        include: { locations: true },
      }),
    ]);

    return {
      total,
      page,
      size,
      hits: rows.map((u) => this.mapInstitutionHit(u)),
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
    // Fetch both types — take extra results to ensure good mixing after pagination
    const fetchSize = size;
    const [progTotal, uniTotal, programs, universities] = await Promise.all([
      this.prisma.program.count({ where: progWhere }),
      this.prisma.university.count({ where: uniWhere }),
      this.prisma.program.findMany({
        where: progWhere,
        orderBy: progOrderBy,
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
        take: fetchSize,
        include: { locations: true },
      }),
    ]);

    // Merge: programs first when q is provided (they are more specific),
    // then institutions. When no q, alternate for visual variety.
    let merged: any[];
    const progHits = programs.map((p) => this.mapProgramHit(p));
    const uniHits = universities.map((u) => this.mapInstitutionHit(u));

    if (progWhere.name?.search) {
      // Relevance mode: programs first, then institutions
      merged = [...progHits, ...uniHits];
    } else {
      // No query: interleave for visual variety
      merged = [];
      const maxLen = Math.max(progHits.length, uniHits.length);
      for (let i = 0; i < maxLen; i++) {
        if (i < progHits.length) merged.push(progHits[i]);
        if (i < uniHits.length) merged.push(uniHits[i]);
      }
    }

    const total = progTotal + uniTotal;
    const start = page * size;
    const paginated = merged.slice(start, start + size);

    return { total, page, size, hits: paginated };
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
      providers: (row.universities ?? []).map((pu: any) => ({
        oid: pu.university.oid,
        name: pu.university.name,
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
      name: row.name,
      description: row.description ?? undefined,
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
