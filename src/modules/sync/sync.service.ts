import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Cron, CronExpression } from '@nestjs/schedule';
import { firstValueFrom } from 'rxjs';
import { PrismaService } from '../../providers/prisma.service';
import { OPINTOPOLKU_BASE } from '../../config/opintopolku.config.js';

const PAGE_SIZE = 100;
const EDUCATION_TYPES = 'yo,amk,amm';

@Injectable()
export class SyncService {
  private readonly logger = new Logger(SyncService.name);

  constructor(
    private readonly httpService: HttpService,
    private readonly prisma: PrismaService,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async scheduledSync() {
    this.logger.log('Starting scheduled sync');
    await this.syncAll();
  }

  async syncAll(): Promise<{ institutions: number; programs: number }> {
    this.logger.log('Starting full sync');
    const institutionCount = await this.syncInstitutions();
    const programCount = await this.syncPrograms();
    this.logger.log(
      `Sync complete: ${institutionCount} institutions, ${programCount} programs`,
    );
    return { institutions: institutionCount, programs: programCount };
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
        await this.prisma.universityLocation.deleteMany({
          where: { universityId: university.id },
        });
        await this.prisma.universityLocation.createMany({
          data: locations
            .filter((l) => l.code)
            .map((l) => ({
              universityId: university.id,
              code: l.code,
              name: l.name,
            })),
          skipDuplicates: true,
        });
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
      (detail.koulutustyyppi as string) ??
      (hit.koulutustyyppi as string) ??
      '';
    const simpleType = this.resolveType(type, '');

    const fieldOfStudy =
      resolveLang((metadata.koulutusala ?? [])[0]?.nimi) || null;

    const degreeTitles: string[] = (metadata.tutkintonimike ?? [])
      .map((t: any) => resolveLang(t.nimi))
      .filter(Boolean);

    const eqfLevel: string | null =
      (detail.eqf ?? [])[0]?.koodiUri ?? null;
    const nqfLevel: string | null =
      (detail.nqf ?? [])[0]?.koodiUri ?? null;

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
        implementations: detail.toteutukset ?? null,
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
        implementations: detail.toteutukset ?? null,
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
          type: '',
          syncedAt,
        },
        update: {},
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

  private isEnglishTaught(data: any): boolean {
    return (
      Array.isArray(data.kielivalinta) && data.kielivalinta.includes('en')
    );
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
