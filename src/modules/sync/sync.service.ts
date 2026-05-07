import { Injectable, Logger, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { HttpService } from '@nestjs/axios';
import { Cron, CronExpression } from '@nestjs/schedule';
import { firstValueFrom } from 'rxjs';
import { PrismaService } from '../../providers/prisma.service';
import { OPINTOPOLKU_BASE } from '../../config/opintopolku.config';
import { Prisma } from '../../../generated/prisma';

const PAGE_SIZE = 100;
const EDUCATION_TYPES = 'yo,amk,amm';

@Injectable()
export class SyncService {
  private readonly logger = new Logger(SyncService.name);
  private isSyncing = false;

  constructor(
    private readonly httpService: HttpService,
    private readonly prisma: PrismaService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async scheduledSync() {
    this.logger.log('Starting scheduled sync');
    await this.syncAll();
  }

  async syncAll(): Promise<{ institutions: number; programs: number }> {
    if (this.isSyncing) {
      this.logger.warn('Sync already in progress — skipping concurrent run');
      return { institutions: 0, programs: 0 };
    }
    this.isSyncing = true;
    try {
      this.logger.log('Starting full sync');
      const institutionCount = await this.syncInstitutions();
      const programCount = await this.syncPrograms();
      this.logger.log(
        `Sync complete: ${institutionCount} institutions, ${programCount} programs`,
      );

      // Invalidate cache after successful sync (D-04)
      await this.cacheManager.clear();
      this.logger.log('Cache invalidated after sync');

      return { institutions: institutionCount, programs: programCount };
    } finally {
      this.isSyncing = false;
    }
  }

  async syncInstitutions(): Promise<number> {
    this.logger.log('Syncing institutions...');
    let page = 0;
    let total = 0;
    let upserted = 0;

    do {
      const response = await firstValueFrom(
        this.httpService.get(`${OPINTOPOLKU_BASE}/search/oppilaitokset`, {
          params: {
            koulutustyyppi: EDUCATION_TYPES,
            lng: 'en',
            size: PAGE_SIZE,
            page,
          },
        }),
      );

      const data = response.data;
      total = data.total ?? 0;
      const hits: any[] = data.hits ?? [];

      for (const hit of hits) {
        await this.upsertInstitution(hit);
        upserted++;
      }

      this.logger.log(
        `Institutions page ${page}: processed ${hits.length} hits (${upserted}/${total})`,
      );
      page++;
    } while (upserted < total);

    return upserted;
  }

  private async upsertInstitution(hit: any): Promise<void> {
    const oid: string = hit.oid ?? '';
    if (!oid) return;

    // Fetch detail for description, contact, studentCount
    let detail: any = {};
    try {
      const detailResponse = await firstValueFrom(
        this.httpService.get(`${OPINTOPOLKU_BASE}/oppilaitos/${oid}`),
      );
      detail = detailResponse.data ?? {};
    } catch {
      this.logger.warn(`Could not fetch detail for institution ${oid}`);
    }

    const resolveLang = (obj: any): string => {
      if (!obj || typeof obj !== 'object') return obj ?? '';
      return obj.en ?? obj.fi ?? '';
    };

    const oppilaitos = detail.oppilaitos ?? {};
    const metadata = oppilaitos.metadata ?? {};
    const yhteystiedot = metadata.yhteystiedot ?? {};
    const name = resolveLang(hit.nimi) || resolveLang(detail.nimi) || oid;
    const type =
      (hit.koulutustyyppi as string) ??
      (hit.oppilaitostyyppiUri as string) ??
      '';

    // Derive simplified type
    const simpleType = this.resolveType(type, oid);

    const locations: { code: string; name: string }[] = (
      hit.paikkakunnat ?? []
    ).map((p: any) => ({
      code: p.koodiUri ?? '',
      name: resolveLang(p.nimi),
    }));

    const syncedAt = new Date();

    await this.prisma.university.upsert({
      where: { oid },
      create: {
        oid,
        name,
        description: resolveLang(metadata.esittely) || null,
        nameMultilingual: hit.nimi ?? detail.nimi ?? Prisma.JsonNull,
        descriptionMultilingual: metadata.esittely ?? Prisma.JsonNull,
        logoUrl: hit.logo ?? null,
        type: simpleType,
        municipality: resolveLang(detail.kotipaikka?.nimi) || null,
        website: resolveLang(yhteystiedot.www) || null,
        email: resolveLang(yhteystiedot.sahkoposti) || null,
        studentCount: metadata.opiskelijoita ?? null,
        syncedAt,
        locations: {
          create: locations
            .filter((l) => l.code)
            .map((l) => ({ code: l.code, name: l.name })),
        },
      },
      update: {
        name,
        description: resolveLang(metadata.esittely) || null,
        nameMultilingual: hit.nimi ?? detail.nimi ?? Prisma.JsonNull,
        descriptionMultilingual: metadata.esittely ?? Prisma.JsonNull,
        logoUrl: hit.logo ?? null,
        type: simpleType,
        municipality: resolveLang(detail.kotipaikka?.nimi) || null,
        website: resolveLang(yhteystiedot.www) || null,
        email: resolveLang(yhteystiedot.sahkoposti) || null,
        studentCount: metadata.opiskelijoita ?? null,
        syncedAt,
      },
    });

    // Upsert locations separately (delete + recreate for simplicity)
    if (locations.length > 0) {
      const university = await this.prisma.university.findUnique({
        where: { oid },
        select: { id: true },
      });
      if (university) {
        await this.prisma.$transaction([
          this.prisma.universityLocation.deleteMany({
            where: { universityId: university.id },
          }),
          this.prisma.universityLocation.createMany({
            data: locations
              .filter((l) => l.code)
              .map((l) => ({
                universityId: university.id,
                code: l.code,
                name: l.name,
              })),
            skipDuplicates: true,
          }),
        ]);
      }
    }
  }

  async syncPrograms(): Promise<number> {
    this.logger.log('Syncing programs...');
    let page = 0;
    let total = 0;
    let upserted = 0;

    do {
      const response = await firstValueFrom(
        this.httpService.get(`${OPINTOPOLKU_BASE}/search/koulutukset`, {
          params: {
            koulutustyyppi: EDUCATION_TYPES,
            lng: 'en',
            size: PAGE_SIZE,
            page,
          },
        }),
      );

      const data = response.data;
      total = data.total ?? 0;
      const hits: any[] = data.hits ?? [];

      for (const hit of hits) {
        await this.upsertProgram(hit);
        upserted++;
      }

      this.logger.log(
        `Programs page ${page}: processed ${hits.length} hits (${upserted}/${total})`,
      );
      page++;
    } while (upserted < total && page * PAGE_SIZE < total);

    return upserted;
  }

  private async upsertProgram(hit: any): Promise<void> {
    const oid: string = hit.oid ?? '';
    if (!oid) return;

    // Fetch full detail
    let detail: any = {};
    try {
      const detailResponse = await firstValueFrom(
        this.httpService.get(`${OPINTOPOLKU_BASE}/koulutus/${oid}`),
      );
      detail = detailResponse.data ?? {};
    } catch {
      this.logger.warn(`Could not fetch detail for program ${oid}`);
      return;
    }

    // Filter: only English-taught programmes
    if (!this.isEnglishTaught(detail)) {
      return;
    }

    const resolveLang = (obj: any): string => {
      if (!obj || typeof obj !== 'object') return obj ?? '';
      return obj.en ?? obj.fi ?? '';
    };

    const metadata = detail.metadata ?? {};
    const name = resolveLang(detail.nimi) || oid;
    const type =
      (detail.koulutustyyppi as string) ?? (hit.koulutustyyppi as string) ?? '';
    const simpleType = this.resolveType(type, '');

    const fieldOfStudy =
      resolveLang((metadata.koulutusala ?? [])[0]?.nimi) || null;

    const degreeTitles: string[] = (metadata.tutkintonimike ?? [])
      .map((t: any) => resolveLang(t.nimi))
      .filter(Boolean);

    const teachingLanguages: string[] = detail.kielivalinta ?? [];

    const toteutusOids: string[] = (detail.toteutukset ?? [])
      .map((t: any) => t.oid)
      .filter(Boolean);
    const valintaperusteCache = new Map<string, any>();

    // Enrich each toteutus via /toteutus/{oid}
    const toteutusResults = await Promise.allSettled(
      toteutusOids.map((oid) =>
        this.enrichToteutus(oid, resolveLang, valintaperusteCache),
      ),
    );

    // Flatten all hakukohteet from successful toteutus enrichments
    const targetsRaw: any[] = [];
    const implementationDataList: any[] = [];
    let enrichedDuration: string | null = null;

    for (const result of toteutusResults) {
      if (result.status === 'fulfilled') {
        const {
          hakukohteet,
          duration: toteutusDuration,
          implementationData,
        } = result.value;
        targetsRaw.push(...hakukohteet);
        if (implementationData !== null) {
          implementationDataList.push(implementationData);
        }
        if (!enrichedDuration && toteutusDuration) {
          enrichedDuration = toteutusDuration;
        }
      }
    }

    const resolvedTargets = await this.resolveApplicationTargets(
      targetsRaw,
      resolveLang,
      valintaperusteCache,
    );

    const duration: string | null = enrichedDuration ?? detail.kesto ?? null;

    const implementations: Prisma.InputJsonValue | typeof Prisma.JsonNull =
      implementationDataList.length > 0
        ? (implementationDataList as unknown as Prisma.InputJsonValue)
        : Prisma.JsonNull;

    const eqfLevel: string | null = (detail.eqf ?? [])[0]?.koodiUri ?? null;
    const nqfLevel: string | null = (detail.nqf ?? [])[0]?.koodiUri ?? null;

    const syncedAt = new Date();

    await this.prisma.program.upsert({
      where: { oid },
      create: {
        oid,
        name,
        description: resolveLang(metadata.kuvaus) || null,
        type: simpleType,
        typePath: detail.koulutustyyppiPath ?? null,
        isDegree: !!detail.johtaaTutkintoon,
        imageUrl: detail.teemakuva ?? null,
        creditsAmount: metadata.opintojenLaajuusNumero ?? null,
        creditsUnit:
          resolveLang(metadata.opintojenLaajuusyksikko?.nimi) || null,
        eqfLevel,
        nqfLevel,
        fieldOfStudy,
        degreeTitles,
        teachingLanguages,
        implementations,
        applicationTargets: resolvedTargets,
        duration,
        syncedAt,
      },
      update: {
        name,
        description: resolveLang(metadata.kuvaus) || null,
        type: simpleType,
        typePath: detail.koulutustyyppiPath ?? null,
        isDegree: !!detail.johtaaTutkintoon,
        imageUrl: detail.teemakuva ?? null,
        creditsAmount: metadata.opintojenLaajuusNumero ?? null,
        creditsUnit:
          resolveLang(metadata.opintojenLaajuusyksikko?.nimi) || null,
        eqfLevel,
        nqfLevel,
        fieldOfStudy,
        degreeTitles,
        teachingLanguages,
        implementations,
        applicationTargets: resolvedTargets,
        duration,
        syncedAt,
      },
    });

    // Upsert provider universities and join rows
    const providers: any[] = detail.tarjoajat ?? [];
    for (const provider of providers) {
      const providerOid: string = provider.oid ?? '';
      if (!providerOid) continue;

      // Ensure university exists (minimal upsert)
      await this.prisma.university.upsert({
        where: { oid: providerOid },
        create: {
          oid: providerOid,
          name:
            (provider.nimi?.en as string) ??
            (provider.nimi?.fi as string) ??
            providerOid,
          nameMultilingual: provider.nimi ?? Prisma.JsonNull,
          descriptionMultilingual: Prisma.JsonNull,
          type: '',
          syncedAt,
        },
        update: {
          name:
            (provider.nimi?.en as string) ??
            (provider.nimi?.fi as string) ??
            providerOid,
          nameMultilingual: provider.nimi ?? Prisma.JsonNull,
        },
      });

      const program = await this.prisma.program.findUnique({
        where: { oid },
        select: { id: true },
      });
      const university = await this.prisma.university.findUnique({
        where: { oid: providerOid },
        select: { id: true },
      });

      if (program && university) {
        await this.prisma.programUniversity.upsert({
          where: {
            programId_universityId: {
              programId: program.id,
              universityId: university.id,
            },
          },
          create: { programId: program.id, universityId: university.id },
          update: {},
        });
      }
    }
  }

  private async enrichToteutus(
    toteutusOid: string,
    resolveLang: (obj: any) => string,
    valintaperusteCache: Map<string, any>,
  ): Promise<{
    hakukohteet: any[];
    duration: string | null;
    implementationData: any;
  }> {
    try {
      const resp = await firstValueFrom(
        this.httpService.get(`${OPINTOPOLKU_BASE}/toteutus/${toteutusOid}`),
      );
      const data = resp.data ?? {};

      // --- Hakukohteet ---
      // Normalize field names: /toteutus/{oid} uses different keys than /haku/{oid}
      const seenOids = new Set<string>();
      const hakukohteet: any[] = [];
      for (const ht of data.hakutiedot ?? []) {
        for (const hk of ht.hakukohteet ?? []) {
          const oid: string = (hk.hakukohdeOid ?? hk.oid ?? '') as string;
          if (oid && !seenOids.has(oid)) {
            seenOids.add(oid);
            hk.oid = oid;
            hk.hakuOid = ht.hakuOid;
            hk.pohjakoulutusvaatimukset =
              hk.pohjakoulutusvaatimukset ?? hk.pohjakoulutusvaatimus;
            hk._haku = {
              hakuajat: hk.hakuajat ?? ht.hakuajat ?? [],
              nimi: ht.nimi,
              hakulomakeLinkki: hk.hakulomakeLinkki ?? null,
            };
            hakukohteet.push(hk);
          }
        }
      }

      // --- Duration ---
      const duration: string | null =
        resolveLang(data.metadata?.opetus?.suunniteltuKestoKuvaus) || null;

      // --- Implementation data ---
      const opetus = data.metadata?.opetus ?? {};
      const implementationData = {
        oid: data.oid,
        name: resolveLang(data.nimi),
        providers: (data.tarjoajat ?? []).map((p: any) => ({
          oid: p.oid,
          name: resolveLang(p.nimi),
          municipality: resolveLang(p.paikkakunta?.nimi),
        })),
        studyMode: (opetus.opetustapa ?? []).map((t: any) =>
          resolveLang(t.nimi),
        ),
        studyTime: (opetus.opetusaika ?? []).map((t: any) =>
          resolveLang(t.nimi),
        ),
        teachingLanguages: (opetus.opetuskieli ?? []).map((t: any) =>
          resolveLang(t.nimi),
        ),
        tuitionFee: opetus.maksunMaara ?? null,
        tuitionCurrency: opetus.maksunMaara ? 'EUR' : null,
        scholarshipAmount: opetus.apuraha?.min ?? opetus.apuraha?.max ?? null,
        scholarshipInfo:
          opetus.apuraha?.min != null && opetus.apuraha?.max != null
            ? `${opetus.apuraha.min}–${opetus.apuraha.max} EUR`
            : null,
        tuitionFeeDescription: resolveLang(opetus.maksullisuusKuvaus) || null,
        teachingMethodDescription: resolveLang(opetus.opetustapaKuvaus) || null,
        teachingLanguageDescription:
          resolveLang(opetus.opetuskieletKuvaus) || null,
        scholarshipDescription: resolveLang(opetus.apuraha?.kuvaus) || null,
        durationYears: opetus.suunniteltuKestoVuodet ?? null,
        startPlaces: opetus.aloituspaikat?.lukumaara ?? null,
        additionalInfo: (opetus.lisatiedot ?? []).map((i: any) => ({
          title: resolveLang(i.otsikko?.nimi),
          text: resolveLang(i.teksti),
        })),
        contactPersons: (data.yhteyshenkilot ?? []).map((c: any) => ({
          name: resolveLang(c.nimi),
          title: resolveLang(c.titteli),
          email: resolveLang(c.sahkoposti),
        })),
        hakuAuki: data.hakuAuki ?? false,
      };

      return { hakukohteet, duration, implementationData };
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : String(error);
      this.logger.warn(`Could not fetch /toteutus/${toteutusOid}: ${msg}`);
      return { hakukohteet: [], duration: null, implementationData: null };
    }
  }

  private async fetchValintaperuste(
    vpId: string,
    resolveLang: (obj: any) => string,
    cache: Map<string, any>,
  ): Promise<any | null> {
    if (!vpId) return null;
    if (cache.has(vpId)) return cache.get(vpId);
    try {
      const resp = await firstValueFrom(
        this.httpService.get(`${OPINTOPOLKU_BASE}/valintaperuste/${vpId}`),
      );
      const vp = resp.data;
      const enriched = {
        id: vp.id ?? null,
        name: resolveLang(vp.nimi),
        selectionMethods: (vp.metadata?.valintatavat ?? []).map((vt: any) => ({
          name: resolveLang(vt.nimi),
          type: vt.valintatapa?.koodiUri ?? null,
          description: resolveLang(vt.sisalto?.[0]?.data) || null,
          thresholdCondition: vt.kynnysehto ? resolveLang(vt.kynnysehto) : null,
        })),
        eligibilityCriteria: resolveLang(vp.metadata?.hakukelpoisuus) || null,
        additionalInfo: resolveLang(vp.metadata?.lisatiedot) || null,
        entranceExams: vp.valintakokeet ?? [],
      };
      cache.set(vpId, enriched);
      return enriched;
    } catch {
      this.logger.warn(`Could not fetch valintaperuste ${vpId}`);
      cache.set(vpId, null);
      return null;
    }
  }

  private async resolveApplicationTargets(
    targets: any[] | null | undefined,
    resolveLang: (obj: any) => string,
    valintaperusteCache: Map<string, any>,
  ): Promise<Prisma.InputJsonValue | typeof Prisma.JsonNull> {
    if (!Array.isArray(targets) || targets.length === 0) return Prisma.JsonNull;
    const results = await Promise.all(
      targets.map(async (h: any) => {
        const vpId: string | null = h.valintaperusteId ?? null;
        const valintaperuste = vpId
          ? await this.fetchValintaperuste(
              vpId,
              resolveLang,
              valintaperusteCache,
            )
          : null;
        return {
          oid: h.oid,
          name: resolveLang(h.nimi),
          applicationPeriod: {
            start: h.hakuaika?.alkaa ?? h._haku?.hakuajat?.[0]?.alkaa ?? null,
            end: h.hakuaika?.paattyy ?? h._haku?.hakuajat?.[0]?.paattyy ?? null,
          },
          requiredEducation:
            resolveLang(h.pohjakoulutusvaatimukset?.[0]?.nimi) || null,
          admissionCriteriaOid: h.valintapere?.oid ?? null,
          applicationFormUrl:
            (h.linkit?.find((l: any) => l.tyyppi === 'hakulomake')?.href ??
              resolveLang(h._haku?.hakulomakeLinkki)) ||
            null,
          implementationOids: h.toteutusOid
            ? [h.toteutusOid]
            : (h.kaytetytToteutusOid ?? []),
          valintaperusteId: vpId,
          toteutusOid: h.toteutusOid ?? null,
          hakuOid: h.hakuOid ?? null,
          valintaperuste,
        };
      }),
    );
    return results;
  }

  private isEnglishTaught(data: any): boolean {
    return Array.isArray(data.kielivalinta) && data.kielivalinta.includes('en');
  }

  private resolveType(type: string, oid: string): string {
    if (!type) {
      if (oid.startsWith('1.2.246.562.10.')) return 'yo';
      return 'amk';
    }
    if (type.includes('yo')) return 'yo';
    if (type.includes('amk')) return 'amk';
    if (type.includes('amm')) return 'amm';
    return type;
  }
}
