import { Injectable, BadGatewayException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { SearchQueryDto } from './dto/search-query.dto';
import {
  SearchResponseDto,
  InstitutionDto,
} from './dto/search-response.dto';

const OPINTOPOLKU_BASE = 'https://opintopolku.fi/konfo-backend';

@Injectable()
export class SearchService {
  constructor(private readonly httpService: HttpService) {}

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
