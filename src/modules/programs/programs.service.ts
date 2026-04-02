import { Injectable, BadGatewayException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

const OPINTOPOLKU_BASE = 'https://opintopolku.fi/konfo-backend';

@Injectable()
export class ProgramsService {
  constructor(private readonly httpService: HttpService) {}

  async findAll(query: Record<string, any> = {}) {
    const lng = query.lng ?? 'en';
    const size = query.size ?? 20;
    const page = query.page ?? 0;

    const params: Record<string, any> = { lng, size, page };

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
        }),
      );

      const data = response.data;
      return {
        total: data.total ?? 0,
        page,
        size,
        hits: (data.hits ?? []).map((hit: any) => this.mapProgram(hit, lng)),
      };
    } catch {
      throw new BadGatewayException('Upstream Opintopolku API is unreachable');
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
      providers: hit.toteutustenTarjoajat?.nimi
        ? [resolveLang(hit.toteutustenTarjoajat?.nimi)]
        : [],
    };
  }

  async findOne(oid: string, lng: string = 'en') {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${OPINTOPOLKU_BASE}/koulutus/${oid}`)
      );
      return this.mapProgramDetails(response.data, lng);
    } catch {
      throw new BadGatewayException(`Upstream Opintopolku API is unreachable for Program OID: ${oid}`);
    }
  }

  private mapProgramDetails(data: any, lng: string) {
    const resolveLang = (obj: any) => {
      if (!obj || typeof obj !== 'object') return obj ?? '';
      return obj[lng] ?? obj.en ?? obj.fi ?? '';
    };

    const metadata = data.metadata ?? {};

    return {
      oid: data.oid,
      name: resolveLang(data.nimi),
      description: resolveLang(metadata.kuvaus),
      type: data.koulutustyyppi,
      typePath: data.koulutustyyppiPath ?? null,
      isDegree: !!data.johtaaTutkintoon,
      image: data.teemakuva ?? '',
      languages: data.kielivalinta ?? [],
      credits: {
        amount: metadata.opintojenLaajuusNumero ?? null,
        unit: resolveLang(metadata.opintojenLaajuusyksikko?.nimi) || null,
      },
      qualificationLevel: {
        eqf: (data.eqf ?? []).map((e: any) => ({ code: e.koodiUri, name: resolveLang(e.nimi) })),
        nqf: (data.nqf ?? []).map((e: any) => ({ code: e.koodiUri, name: resolveLang(e.nimi) })),
      },
      degreeTitles: (metadata.tutkintonimike ?? []).map((t: any) => ({
        code: t.koodiUri,
        name: resolveLang(t.nimi),
      })),
      fieldOfStudy: (metadata.koulutusala ?? []).map((k: any) => ({
        code: k.koodiUri,
        name: resolveLang(k.nimi),
      })),
      educationCodes: (data.koulutukset ?? []).map((k: any) => ({
        code: k.koodiUri,
        name: resolveLang(k.nimi),
      })),
      providers: (data.tarjoajat ?? []).map((t: any) => ({
        oid: t.oid,
        name: resolveLang(t.nimi),
        municipality: resolveLang(t.paikkakunta?.nimi),
      })),
      implementations: (data.toteutukset ?? []).map((t: any) => ({
        oid: t.oid,
        name: resolveLang(t.nimi),
        providers: (t.tarjoajat ?? []).map((p: any) => ({
          oid: p.oid,
          name: resolveLang(p.nimi),
          municipality: resolveLang(p.paikkakunta?.nimi),
        })),
      })),
    };
  }
}
