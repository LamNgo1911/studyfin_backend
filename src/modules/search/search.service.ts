import { Injectable, BadGatewayException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { SearchQueryDto, DbSearchQueryDto } from './dto/search-query.dto';
import {
  SearchResponseDto,
  InstitutionDto,
} from './dto/search-response.dto';
import { PrismaService } from '../../providers/prisma.service';
import { OPINTOPOLKU_BASE } from '../../config/opintopolku.config';

@Injectable()
export class SearchService {
  constructor(
    private readonly httpService: HttpService,
    private readonly prisma: PrismaService,
  ) {}

  async searchInstitutions(query: SearchQueryDto): Promise<SearchResponseDto> {
    const lng = query.lng ?? 'en';
    const size = query.size ?? 20;
    const page = query.page ?? 0;

    const params: Record<string, string | number> = {
      koulutustyyppi: 'yo,amk',
      lng,
      size,
      page,
    };

    if (query.keyword) {
      params.keyword = query.keyword;
    }

    let data: any;
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${OPINTOPOLKU_BASE}/search/oppilaitokset`, {
          params,
        }),
      );
      data = response.data;
    } catch {
      throw new BadGatewayException('Upstream Opintopolku API is unreachable');
    }

    return {
      total: data.total ?? 0,
      page,
      size,
      hits: (data.hits ?? []).map((hit: any) => this.mapInstitution(hit, lng)),
    };
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
      implementations: p.implementations,
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

  private mapInstitution(hit: any, lng: string): InstitutionDto {
    const name = hit.nimi?.[lng] ?? hit.nimi?.fi ?? '';
    const description = hit.kuvaus?.[lng] ?? hit.kuvaus?.fi ?? '';
    const counts = hit.koulutusohjelmatLkm ?? {};

    return {
      oid: hit.oid ?? '',
      name,
      description,
      logoUrl: hit.logo ?? '',
      locations: (hit.paikkakunnat ?? []).map((p: any) => ({
        code: p.koodiUri ?? '',
        name: p.nimi?.[lng] ?? p.nimi?.fi ?? '',
      })),
      languages: hit.kielivalinta ?? [],
      programCount: {
        total: counts.kaikki ?? 0,
        degreeProgrammes: counts.tutkintoonJohtavat ?? 0,
        nonDegree: counts.eiTutkintoonJohtavat ?? 0,
      },
    };
  }
}
