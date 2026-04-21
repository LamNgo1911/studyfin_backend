import { Injectable, BadGatewayException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { OPINTOPOLKU_BASE } from '../../config/opintopolku.config';

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
      credits:
        hit.opintojenLaajuusNumero ?? hit.opintojenLaajuusNumeroMax ?? null,
      image: hit.teemakuva ?? '',
      isOpenUniversity: !!hit.isAvoinKorkeakoulutus,
      providers: hit.toteutustenTarjoajat?.nimi
        ? [resolveLang(hit.toteutustenTarjoajat?.nimi)]
        : [],
    };
  }

  async findOne(oid: string, lng: string = 'en') {
    let koulutus: any;
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${OPINTOPOLKU_BASE}/koulutus/${oid}`),
      );
      koulutus = response.data;
    } catch {
      throw new BadGatewayException(
        `Upstream Opintopolku API is unreachable for Program OID: ${oid}`,
      );
    }

    const toteutusOids: string[] = (koulutus.toteutukset ?? [])
      .map((t: any) => t.oid)
      .filter((o: any): o is string => typeof o === 'string');

    const toteutukset = await Promise.all(
      toteutusOids.map(async (tOid) => {
        try {
          const r = await firstValueFrom(
            this.httpService.get(`${OPINTOPOLKU_BASE}/toteutus/${tOid}`),
          );
          return r.data;
        } catch {
          return null;
        }
      }),
    );

    return this.mapProgramDetails(
      koulutus,
      toteutukset.filter((t) => t !== null),
      lng,
    );
  }

  private mapProgramDetails(data: any, toteutukset: any[], lng: string) {
    const resolveLang = (obj: any) => {
      if (!obj || typeof obj !== 'object') return obj ?? '';
      return obj[lng] ?? obj.en ?? obj.fi ?? '';
    };

    const mapCodeName = (arr: any[] = []) =>
      (arr ?? []).map((e: any) => ({
        code: e.koodiUri,
        name: resolveLang(e.nimi),
      }));

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
        eqf: mapCodeName(data.eqf),
        nqf: mapCodeName(data.nqf),
      },
      degreeTitles: mapCodeName(metadata.tutkintonimike),
      fieldOfStudy: mapCodeName(metadata.koulutusala),
      educationCodes: mapCodeName(data.koulutukset),
      providers: (data.tarjoajat ?? []).map((t: any) => ({
        oid: t.oid,
        name: resolveLang(t.nimi),
        municipality: resolveLang(t.paikkakunta?.nimi),
      })),
      implementations: toteutukset.map((t: any) =>
        this.mapImplementation(t, lng),
      ),
    };
  }

  private mapImplementation(t: any, lng: string) {
    const resolveLang = (obj: any) => {
      if (!obj || typeof obj !== 'object') return obj ?? '';
      return obj[lng] ?? obj.en ?? obj.fi ?? '';
    };

    const mapCodeName = (arr: any[] = []) =>
      (arr ?? []).map((e: any) => ({
        code: e.koodiUri,
        name: resolveLang(e.nimi),
      }));

    const metadata = t.metadata ?? {};
    const opetus = metadata.opetus ?? {};

    const careerTitles = Array.isArray(metadata.ammattinimikkeet)
      ? Array.from(
          new Set(
            metadata.ammattinimikkeet
              .filter((a: any) => !lng || a.kieli === lng || a.kieli === 'en')
              .map((a: any) => a.arvo)
              .filter(Boolean),
          ),
        )
      : [];

    const hakutiedot = Array.isArray(t.hakutiedot) ? t.hakutiedot : [];

    return {
      oid: t.oid,
      name: resolveLang(t.nimi),
      description: resolveLang(metadata.kuvaus),
      learningOutcomes: resolveLang(metadata.osaamistavoitteet),
      providers: (t.tarjoajat ?? []).map((p: any) => ({
        oid: p.oid,
        name: resolveLang(p.nimi),
        municipality: resolveLang(p.paikkakunta?.nimi),
      })),
      teaching: {
        languages: mapCodeName(opetus.opetuskieli),
        languagesDescription: resolveLang(opetus.opetuskieletKuvaus),
        methods: mapCodeName(opetus.opetustapa),
        methodsDescription: resolveLang(opetus.opetustapaKuvaus),
        times: mapCodeName(opetus.opetusaika),
        timesDescription: resolveLang(opetus.opetusaikaKuvaus),
      },
      duration: {
        years: opetus.suunniteltuKestoVuodet ?? null,
        months: opetus.suunniteltuKestoKuukaudet ?? null,
        description: resolveLang(opetus.suunniteltuKestoKuvaus),
      },
      tuition: {
        type: this.resolveTuitionType(opetus.maksullisuustyyppi),
        amount: opetus.maksunMaara ?? null,
        description: resolveLang(opetus.maksullisuusKuvaus),
        hasScholarship: !!opetus.onkoApuraha,
        scholarshipDescription: resolveLang(opetus.apuraha),
      },
      careerTitles,
      applicationRounds: hakutiedot.map((h: any) => ({
        hakuOid: h.hakuOid,
        name: resolveLang(h.nimi),
        applicationMethod: h.hakutapa
          ? {
              code: h.hakutapa.koodiUri,
              name: resolveLang(h.hakutapa.nimi),
            }
          : null,
        startSeason: h.koulutuksenAlkamiskausi
          ? {
              season: resolveLang(
                h.koulutuksenAlkamiskausi.koulutuksenAlkamiskausi?.nimi,
              ),
              year:
                h.koulutuksenAlkamiskausi.koulutuksenAlkamisvuosi ?? null,
            }
          : null,
        applicationTargets: (h.hakukohteet ?? []).map((hk: any) =>
          this.mapApplicationTarget(hk, lng),
        ),
      })),
    };
  }

  private resolveTuitionType(type: string | undefined): string | null {
    const map: Record<string, string> = {
      maksuton: 'Free of charge',
      maksullinen: 'Tuition fee',
      lukuvuosimaksu: 'Annual tuition fee',
    };
    return type ? (map[type] ?? type) : null;
  }

  private mapApplicationTarget(hk: any, lng: string) {
    const resolveLang = (obj: any) => {
      if (!obj || typeof obj !== 'object') return obj ?? '';
      return obj[lng] ?? obj.en ?? obj.fi ?? '';
    };

    return {
      hakukohdeOid: hk.hakukohdeOid,
      name: resolveLang(hk.nimi),
      seats: hk.aloituspaikat?.lukumaara ?? null,
      seatsDescription: resolveLang(hk.aloituspaikat?.kuvaus),
      applicationPeriods: (hk.hakuajat ?? []).map((a: any) => ({
        startsAt: a.alkaa ?? null,
        endsAt: a.paattyy ?? null,
        startsAtFormatted: resolveLang(a.formatoituAlkaa),
        endsAtFormatted: resolveLang(a.formatoituPaattyy),
        isOpen: !!a.hakuAuki,
        hasPassed: !!a.hakuMennyt,
      })),
      eligibility: (hk.pohjakoulutusvaatimus ?? []).map((p: any) => ({
        code: p.koodiUri,
        name: resolveLang(p.nimi),
      })),
      applicationFormType: hk.hakulomaketyyppi ?? null,
      applicationFormLink: resolveLang(hk.hakulomakeLinkki) || null,
      location: hk.jarjestyspaikka
        ? {
            oid: hk.jarjestyspaikka.oid,
            name: resolveLang(hk.jarjestyspaikka.nimi),
            municipality: resolveLang(hk.jarjestyspaikka.paikkakunta?.nimi),
          }
        : null,
    };
  }
}
