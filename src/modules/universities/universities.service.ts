import { Injectable, BadGatewayException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { OPINTOPOLKU_BASE } from '../../config/opintopolku.config';

@Injectable()
export class UniversitiesService {
  constructor(private readonly httpService: HttpService) {}

  async findAll(query: Record<string, any> = {}) {
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

    try {
      const response = await firstValueFrom(
        this.httpService.get(`${OPINTOPOLKU_BASE}/search/oppilaitokset`, {
          params,
        }),
      );
      
      const data = response.data;
      return {
        total: data.total ?? 0,
        page,
        size,
        hits: (data.hits ?? []).map((hit: any) => this.mapInstitution(hit, lng)),
      };
    } catch {
      throw new BadGatewayException('Upstream Opintopolku API is unreachable');
    }
  }

  async findOne(oid: string, lng: string = 'en') {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${OPINTOPOLKU_BASE}/oppilaitos/${oid}`)
      );
      return this.mapDetailedInstitution(response.data, lng);
    } catch {
      throw new BadGatewayException(`Upstream Opintopolku API is unreachable for OID: ${oid}`);
    }
  }

  private mapDetailedInstitution(data: any, lng: string) {
    const oppilaitos = data.oppilaitos ?? {};
    const metadata = oppilaitos.metadata ?? {};
    const yhteystiedot = metadata.yhteystiedot ?? {};

    const resolveLang = (obj: any) => {
      if (!obj || typeof obj !== 'object') return obj ?? '';
      return obj[lng] ?? obj.en ?? obj.fi ?? '';
    };

    return {
      oid: data.oid,
      name: resolveLang(data.nimi),
      type: resolveLang(data.oppilaitostyyppi?.nimi),
      description: resolveLang(metadata.esittely),
      location: resolveLang(data.kotipaikka?.nimi),
      students: metadata.opiskelijoita ?? null,
      campuses: metadata.kampuksia ?? null,
      contact: {
        email: resolveLang(yhteystiedot.sahkoposti),
        phone: resolveLang(yhteystiedot.puhelinnumero),
        website: resolveLang(yhteystiedot.www),
        address: resolveLang(yhteystiedot.postiosoiteStr),
      },
      parts: (data.osat ?? []).map((osa: any) => ({
        oid: osa.oid,
        name: resolveLang(osa.nimi),
        status: osa.status,
        teachingLanguages: (osa.opetuskieli ?? []).map((k: any) => resolveLang(k.nimi)),
      })),
    };
  }

  async findPrograms(oid: string, query: Record<string, any> = {}) {
    const lng = query.lng ?? 'en';
    const size = query.size ?? 20;
    const page = query.page ?? 0;

    const params: Record<string, any> = {
      tarjoaja: oid,
      lng,
      size,
      page,
    };

    if (query.keyword) {
      params.keyword = query.keyword;
    }
    if (query.degreeOnly === 'true') {
      params.johtaaTutkintoon = true;
    }

    try {
      const response = await firstValueFrom(
        this.httpService.get(`${OPINTOPOLKU_BASE}/search/koulutukset`, {
          params,
        })
      );
      
      const data = response.data;
      return {
        total: data.total ?? 0,
        page,
        size,
        hits: (data.hits ?? []).map((hit: any) => this.mapProgram(hit, lng)),
      };
    } catch {
      throw new BadGatewayException(`Upstream Opintopolku API is unreachable for programs of OID: ${oid}`);
    }
  }

  private mapProgram(hit: any, lng: string) {
    const resolveLang = (obj: any) => {
      if (!obj || typeof obj !== 'object') return obj ?? '';
      return obj[lng] ?? obj.en ?? obj.fi ?? '';
    };

    return {
      oid: hit.oid,
      name: resolveLang(hit.nimi),
      description: resolveLang(hit.kuvaus),
      type: hit.koulutustyyppi,
      credits: hit.opintojenLaajuusNumero ?? hit.opintojenLaajuusNumeroMax ?? null,
      image: hit.teemakuva ?? '',
      isOpenUniversity: !!hit.isAvoinKorkeakoulutus,
      providers: hit.toteutustenTarjoajat?.nimi ? [resolveLang(hit.toteutustenTarjoajat?.nimi)] : [],
    };
  }

  private mapInstitution(hit: any, lng: string) {
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

