import { Injectable } from '@nestjs/common';
import { SearchQueryDto, DbSearchQueryDto } from './dto/search-query.dto';
import {
  InstitutionDto,
  InstitutionSearchResponseDto,
} from './dto/search-response.dto';
import { PrismaService } from '../../providers/prisma.service';

@Injectable()
export class SearchService {
  constructor(private readonly prisma: PrismaService) {}

  async searchInstitutions(
    query: SearchQueryDto,
  ): Promise<InstitutionSearchResponseDto> {
    const keyword = query.keyword ?? '';
    const size = query.size ?? 20;
    const page = query.page ?? 0;

    const where = keyword
      ? { name: { contains: keyword, mode: 'insensitive' as const } }
      : {};

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

    const hits: InstitutionDto[] = rows.map((u) => ({
      oid: u.oid,
      name: u.name,
      description: u.description,
      logoUrl: u.logoUrl,
      type: u.type,
      municipality: u.municipality,
      website: u.website,
      email: u.email,
      studentCount: u.studentCount,
      locations: u.locations.map((l) => ({ code: l.code, name: l.name })),
    }));

    return { total, page, size, hits };
  }

  async search(query: DbSearchQueryDto): Promise<{
    total: number;
    page: number;
    size: number;
    hits: any[];
  }> {
    const q = query.q ?? '';
    const type = query.type ?? 'programs';
    const page = query.page ?? 0;
    const size = query.size ?? 20;

    if (type === 'institutions') {
      const where = q
        ? { name: { contains: q, mode: 'insensitive' as const } }
        : {};

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

      const hits = rows.map((u) => ({
        oid: u.oid,
        name: u.name,
        description: u.description,
        logoUrl: u.logoUrl,
        type: u.type,
        municipality: u.municipality,
        website: u.website,
        email: u.email,
        studentCount: u.studentCount,
        locations: u.locations.map((l) => ({ code: l.code, name: l.name })),
      }));

      return { total, page, size, hits };
    }

    // programs
    const where = q
      ? { name: { contains: q, mode: 'insensitive' as const } }
      : {};

    const [total, rows] = await Promise.all([
      this.prisma.program.count({ where }),
      this.prisma.program.findMany({
        where,
        include: {
          universities: {
            include: { university: { include: { locations: true } } },
          },
        },
        skip: page * size,
        take: size,
        orderBy: { name: 'asc' },
      }),
    ]);

    const hits = rows.map((p) => ({
      oid: p.oid,
      name: p.name,
      description: p.description,
      type: p.type,
      typePath: p.typePath,
      isDegree: p.isDegree,
      imageUrl: p.imageUrl,
      credits: {
        amount: p.creditsAmount,
        unit: p.creditsUnit,
      },
      eqfLevel: p.eqfLevel,
      nqfLevel: p.nqfLevel,
      fieldOfStudy: p.fieldOfStudy,
      degreeTitles: p.degreeTitles,
      teachingLanguages: p.teachingLanguages,
      implementations: this.cleanImplementations(p.implementations),
      providers: p.universities.map((pu) => ({
        oid: pu.university.oid,
        name: pu.university.name,
        locations: pu.university.locations.map((l) => ({
          code: l.code,
          name: l.name,
        })),
      })),
    }));

    return { total, page, size, hits };
  }

  private cleanImplementations(raw: any): any[] | null {
    if (!Array.isArray(raw)) return null;
    // Handle both old (raw API shape) and new (already resolved) formats
    const result = raw
      .filter((t: any) => {
        // Already resolved: has string name
        if (typeof t.name === 'string') return true;
        // Raw API shape: must have English nimi
        return t.nimi?.en;
      })
      .map((t: any) => {
        if (typeof t.name === 'string') return t; // already clean
        return {
          oid: t.oid,
          name: t.nimi?.en ?? t.nimi?.fi ?? '',
          providers: (t.tarjoajat ?? []).map((p: any) => ({
            oid: p.oid,
            name: p.nimi?.en ?? p.nimi?.fi ?? '',
            municipality: p.paikkakunta?.nimi?.en ?? p.paikkakunta?.nimi?.fi ?? '',
          })),
        };
      });
    return result.length > 0 ? result : null;
  }
}
