import { Test, TestingModule } from '@nestjs/testing';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { SyncService } from './sync.service';
import { PrismaService } from '../../providers/prisma.service';
import { Prisma } from '../../../generated/prisma';
import { HttpService } from '@nestjs/axios';
import { of } from 'rxjs';

describe('SyncService', () => {
  let service: SyncService;
  let prisma: {
    university: {
      upsert: jest.Mock;
      findUnique: jest.Mock;
      createMany: jest.Mock;
      deleteMany: jest.Mock;
    };
    program: {
      upsert: jest.Mock;
      findUnique: jest.Mock;
      createMany: jest.Mock;
      deleteMany: jest.Mock;
      count: jest.Mock;
      findMany: jest.Mock;
    };
    $transaction: jest.Mock;
    universityLocation: { deleteMany: jest.Mock; createMany: jest.Mock };
  };
  let httpService: { get: jest.Mock };

  beforeEach(async () => {
    prisma = {
      university: {
        upsert: jest.fn(),
        findUnique: jest.fn(),
        createMany: jest.fn(),
        deleteMany: jest.fn(),
      },
      program: {
        upsert: jest.fn(),
        findUnique: jest.fn(),
        createMany: jest.fn(),
        deleteMany: jest.fn(),
        count: jest.fn(),
        findMany: jest.fn(),
      },
      $transaction: jest.fn(),
      universityLocation: { deleteMany: jest.fn(), createMany: jest.fn() },
    };
    httpService = { get: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SyncService,
        { provide: PrismaService, useValue: prisma },
        { provide: HttpService, useValue: httpService },
        {
          provide: CACHE_MANAGER,
          useValue: { get: jest.fn(), set: jest.fn(), clear: jest.fn() },
        },
      ],
    }).compile();

    service = module.get<SyncService>(SyncService);
  });

  describe('syncAll() mutex', () => {
    it('calls syncInstitutions and syncPrograms when no sync is running', async () => {
      // Mock HTTP calls to return RxJS Observables (required for firstValueFrom)
      httpService.get.mockReturnValue(of({ data: { total: 0, hits: [] } }));

      const result = await service.syncAll();

      expect(result).toHaveProperty('institutions');
      expect(result).toHaveProperty('programs');
    });

    it('returns early with zeros when called while another sync is running', async () => {
      // Simulate a sync already in progress by manually setting the flag
      (service as any).isSyncing = true;

      const result = await service.syncAll();

      expect(result.institutions).toBe(0);
      expect(result.programs).toBe(0);
      // HTTP calls should NOT have been made
      expect(httpService.get).not.toHaveBeenCalled();
    });
  });

  describe('upsertInstitution() location transaction', () => {
    it('wraps location delete+create in $transaction', async () => {
      prisma.$transaction.mockResolvedValue([{ count: 0 }, { count: 1 }]);
      prisma.university.upsert.mockResolvedValue({
        id: 'uni-db-id',
        oid: 'test-oid',
      });
      prisma.university.findUnique.mockResolvedValue({
        id: 'uni-db-id',
        oid: 'test-oid',
      });

      const hit = {
        oid: 'test-oid',
        nimi: { en: 'Test University', fi: 'Test' },
        koulutustyyppi: 'yo',
        paikkakunnat: [{ koodiUri: 'kunta_091', nimi: { en: 'Helsinki' } }],
      };
      const detailResponse = {
        data: {
          oppilaitos: {},
          kotipaikka: { nimi: { en: 'Helsinki' } },
          metadata: { yhteystiedot: {} },
        },
      };

      // Return Observables (firstValueFrom requires Observable, not Promise)
      httpService.get
        .mockReturnValueOnce(of({ data: { hits: [hit] } }))
        .mockReturnValueOnce(of(detailResponse));

      await service.syncInstitutions();

      // Verify nameMultilingual is stored in the upsert call
      const upsertCall = prisma.university.upsert.mock.calls[0][0];
      expect(upsertCall.create.nameMultilingual).toEqual({
        en: 'Test University',
        fi: 'Test',
      });
      expect(upsertCall.update.nameMultilingual).toEqual({
        en: 'Test University',
        fi: 'Test',
      });

      // Verify $transaction was called at least once (for the location upsert)
      expect(prisma.$transaction).toHaveBeenCalled();
      // Verify it was called with an array (array transaction form for atomicity)
      const transactionCalls = prisma.$transaction.mock.calls;
      const arrayTransactionCall = transactionCalls.find((call) =>
        Array.isArray(call[0]),
      );
      expect(arrayTransactionCall).toBeDefined();
    });
  });

  describe('enrichToteutus()', () => {
    it('returns minimal fallback struct on fetch failure', async () => {
      httpService.get.mockImplementationOnce(() => {
        throw new Error('Network error');
      });
      const resolveLang = (obj: any): string => obj?.en ?? obj?.fi ?? '';
      const cache = new Map<string, any>();

      const result = await (service as any).enrichToteutus(
        'tot-fail',
        resolveLang,
        cache,
      );

      expect(result).toEqual({
        hakukohteet: [],
        duration: null,
        implementationData: null,
      });
    });

    it('extracts hakukohteet from hakutiedot with deduplication', async () => {
      httpService.get.mockReturnValueOnce(
        of({
          data: {
            oid: 'tot-1',
            nimi: { en: 'Implementation 1' },
            tarjoajat: [],
            metadata: { opetus: {} },
            hakutiedot: [
              {
                nimi: { en: 'Spring 2025' },
                hakuajat: [{ alkaa: '2025-01-01', paattyy: '2025-03-15' }],
                hakukohteet: [
                  { oid: 'hk-1', nimi: { en: 'Target 1' } },
                  { oid: 'hk-2', nimi: { en: 'Target 2' } },
                ],
              },
            ],
          },
        }),
      );
      const resolveLang = (obj: any): string => obj?.en ?? obj?.fi ?? '';
      const cache = new Map<string, any>();

      const result = await (service as any).enrichToteutus(
        'tot-1',
        resolveLang,
        cache,
      );

      expect(result.hakukohteet).toHaveLength(2);
      expect(result.hakukohteet[0].oid).toBe('hk-1');
      expect(result.hakukohteet[1].oid).toBe('hk-2');
      expect(result.hakukohteet[0]._haku).toEqual({
        hakuajat: [{ alkaa: '2025-01-01', paattyy: '2025-03-15' }],
        nimi: { en: 'Spring 2025' },
      });
    });

    it('deduplicates across multiple hakutiedot entries', async () => {
      httpService.get.mockReturnValueOnce(
        of({
          data: {
            oid: 'tot-1',
            nimi: { en: 'Implementation 1' },
            tarjoajat: [],
            metadata: { opetus: {} },
            hakutiedot: [
              {
                nimi: { en: 'Spring 2025' },
                hakuajat: [],
                hakukohteet: [
                  { oid: 'hk-1', nimi: { en: 'Shared' } },
                  { oid: 'hk-2', nimi: { en: 'Unique 1' } },
                ],
              },
              {
                nimi: { en: 'Autumn 2025' },
                hakuajat: [],
                hakukohteet: [
                  { oid: 'hk-1', nimi: { en: 'Shared' } },
                  { oid: 'hk-3', nimi: { en: 'Unique 2' } },
                ],
              },
            ],
          },
        }),
      );
      const resolveLang = (obj: any): string => obj?.en ?? obj?.fi ?? '';
      const cache = new Map<string, any>();

      const result = await (service as any).enrichToteutus(
        'tot-1',
        resolveLang,
        cache,
      );

      expect(result.hakukohteet).toHaveLength(3);
      expect(result.hakukohteet.map((h: any) => h.oid)).toEqual([
        'hk-1',
        'hk-2',
        'hk-3',
      ]);
    });

    it('extracts duration from suunniteltuKestoKuvaus (English resolved)', async () => {
      httpService.get.mockReturnValueOnce(
        of({
          data: {
            oid: 'tot-1',
            nimi: { en: 'Implementation 1' },
            tarjoajat: [],
            metadata: {
              opetus: {
                suunniteltuKestoKuvaus: {
                  en: '3 years',
                  fi: '3 vuotta',
                },
              },
            },
            hakutiedot: [],
          },
        }),
      );
      const resolveLang = (obj: any): string => obj?.en ?? obj?.fi ?? '';
      const cache = new Map<string, any>();

      const result = await (service as any).enrichToteutus(
        'tot-1',
        resolveLang,
        cache,
      );

      expect(result.duration).toBe('3 years');
    });

    it('extracts duration from suunniteltuKestoKuvaus (Finnish fallback)', async () => {
      httpService.get.mockReturnValueOnce(
        of({
          data: {
            oid: 'tot-1',
            nimi: { en: 'Implementation 1' },
            tarjoajat: [],
            metadata: {
              opetus: {
                suunniteltuKestoKuvaus: {
                  fi: '3 vuotta',
                  sv: '3 år',
                },
              },
            },
            hakutiedot: [],
          },
        }),
      );
      const resolveLang = (obj: any): string => obj?.en ?? obj?.fi ?? '';
      const cache = new Map<string, any>();

      const result = await (service as any).enrichToteutus(
        'tot-1',
        resolveLang,
        cache,
      );

      expect(result.duration).toBe('3 vuotta');
    });

    it('extracts study mode, tuition, and additional info', async () => {
      httpService.get.mockReturnValueOnce(
        of({
          data: {
            oid: 'tot-1',
            nimi: { en: 'Implementation 1', fi: 'Toteutus 1' },
            tarjoajat: [
              {
                oid: 'p-1',
                nimi: { en: 'Provider One', fi: 'Tarjoaja yksi' },
                paikkakunta: { nimi: { en: 'Helsinki' } },
              },
            ],
            metadata: {
              opetus: {
                opetustapa: [{ nimi: { en: 'Full-time' } }],
                opetusaika: [{ nimi: { en: 'Daytime' } }],
                opetuskieli: [{ nimi: { en: 'English' } }],
                maksunMaara: 10000,
                maksullisuusKuvaus: { en: 'Tuition fee description' },
                apuraha: {
                  min: 5000,
                  max: 10000,
                  kuvaus: { en: 'Scholarship available' },
                },
                lisatiedot: [
                  {
                    otsikko: { nimi: { en: 'Career Prospects' } },
                    teksti: { en: 'Good career opportunities' },
                  },
                ],
              },
            },
            yhteyshenkilot: [
              {
                nimi: { en: 'John Doe' },
                titteli: { en: 'Coordinator' },
                sahkoposti: { en: 'john@example.com' },
              },
            ],
            hakutiedot: [],
            hakuAuki: true,
          },
        }),
      );
      const resolveLang = (obj: any): string => obj?.en ?? obj?.fi ?? '';
      const cache = new Map<string, any>();

      const result = await (service as any).enrichToteutus(
        'tot-1',
        resolveLang,
        cache,
      );

      const impl = result.implementationData;
      expect(impl.oid).toBe('tot-1');
      expect(impl.name).toBe('Implementation 1');
      expect(impl.providers).toHaveLength(1);
      expect(impl.providers[0].name).toBe('Provider One');
      expect(impl.providers[0].municipality).toBe('Helsinki');
      expect(impl.studyMode).toEqual(['Full-time']);
      expect(impl.studyTime).toEqual(['Daytime']);
      expect(impl.teachingLanguages).toEqual(['English']);
      expect(impl.tuitionFee).toBe(10000);
      expect(impl.tuitionCurrency).toBe('EUR');
      expect(impl.scholarshipAmount).toBe(5000);
      expect(impl.scholarshipInfo).toBe('5000–10000 EUR');
      expect(impl.tuitionFeeDescription).toBe('Tuition fee description');
      expect(impl.scholarshipDescription).toBe('Scholarship available');
      expect(impl.additionalInfo).toHaveLength(1);
      expect(impl.additionalInfo[0]).toEqual({
        title: 'Career Prospects',
        text: 'Good career opportunities',
      });
      expect(impl.contactPersons).toHaveLength(1);
      expect(impl.contactPersons[0]).toEqual({
        name: 'John Doe',
        title: 'Coordinator',
        email: 'john@example.com',
      });
      expect(impl.hakuAuki).toBe(true);
    });

    it('handles empty hakutiedot gracefully', async () => {
      httpService.get.mockReturnValueOnce(
        of({
          data: {
            oid: 'tot-1',
            nimi: { en: 'Implementation 1' },
            tarjoajat: [],
            metadata: { opetus: {} },
            hakutiedot: [],
          },
        }),
      );
      const resolveLang = (obj: any): string => obj?.en ?? obj?.fi ?? '';
      const cache = new Map<string, any>();

      const result = await (service as any).enrichToteutus(
        'tot-1',
        resolveLang,
        cache,
      );

      expect(result.hakukohteet).toEqual([]);
      expect(result.duration).toBeNull();
      expect(result.implementationData).toBeDefined();
    });

    it('uses resolveLang for all localized fields (English first, Finnish fallback)', async () => {
      httpService.get.mockReturnValueOnce(
        of({
          data: {
            oid: 'tot-1',
            nimi: { fi: 'Toteutus 1' },
            tarjoajat: [
              {
                oid: 'p-1',
                nimi: { fi: 'Tarjoaja yksi' },
                paikkakunta: { nimi: { fi: 'Helsinki' } },
              },
            ],
            metadata: {
              opetus: {
                opetustapa: [{ nimi: { fi: 'Kokopäivä' } }],
                suunniteltuKestoKuvaus: { fi: '3 vuotta' },
              },
            },
            hakutiedot: [],
          },
        }),
      );
      const resolveLang = (obj: any): string => obj?.en ?? obj?.fi ?? '';
      const cache = new Map<string, any>();

      const result = await (service as any).enrichToteutus(
        'tot-1',
        resolveLang,
        cache,
      );

      const impl = result.implementationData;
      expect(impl.name).toBe('Toteutus 1');
      expect(impl.providers[0].name).toBe('Tarjoaja yksi');
      expect(impl.providers[0].municipality).toBe('Helsinki');
      expect(impl.studyMode).toEqual(['Kokopäivä']);
      expect(result.duration).toBe('3 vuotta');
    });
  });

  describe('resolveApplicationTargets()', () => {
    const resolveLang = (obj: any): string => {
      if (!obj || typeof obj !== 'object') return obj ?? '';
      return obj.en ?? obj.fi ?? '';
    };

    it('returns Prisma.JsonNull for null/undefined input', async () => {
      const cache = new Map<string, any>();
      const result1 = await (service as any).resolveApplicationTargets(
        null,
        resolveLang,
        cache,
      );
      const result2 = await (service as any).resolveApplicationTargets(
        undefined,
        resolveLang,
        cache,
      );
      expect(JSON.stringify(result1)).toBe(JSON.stringify(Prisma.JsonNull));
      expect(JSON.stringify(result2)).toBe(JSON.stringify(Prisma.JsonNull));
    });

    it('returns Prisma.JsonNull for empty array', async () => {
      const cache = new Map<string, any>();
      const result = await (service as any).resolveApplicationTargets(
        [],
        resolveLang,
        cache,
      );
      expect(JSON.stringify(result)).toBe(JSON.stringify(Prisma.JsonNull));
    });

    it('falls back to Finnish name when English name is missing', async () => {
      const cache = new Map<string, any>();
      const targets = [
        { oid: 'hk-1', nimi: { fi: 'Suomenkielinen hakukohde' } },
        { oid: 'hk-2', nimi: { fi: 'Toinen suomenkielinen' } },
      ];
      const result = await (service as any).resolveApplicationTargets(
        targets,
        resolveLang,
        cache,
      );
      expect(Array.isArray(result)).toBe(true);
      expect(result).toHaveLength(2);
      expect(result[0].name).toBe('Suomenkielinen hakukohde');
      expect(result[1].name).toBe('Toinen suomenkielinen');
    });

    it('resolves hakukohteet with English names correctly', async () => {
      const cache = new Map<string, any>();
      const targets = [
        {
          oid: 'hakukohde-oid-1',
          nimi: { en: 'Application Group 1', fi: 'Hakuryhma 1' },
          hakuaika: {
            alkaa: '2025-01-01T00:00:00Z',
            paattyy: '2025-03-15T23:59:59Z',
          },
          pohjakoulutusvaatimukset: [
            {
              nimi: {
                en: 'General upper secondary school',
                fi: 'Ylioppilastutkinto',
              },
            },
          ],
          valintapere: { oid: 'valintaperuste-oid-1' },
          linkit: [
            {
              tyyppi: 'hakulomake',
              href: 'https://opintopolku.fi/app/hakulomake/hakukohde-oid-1',
            },
          ],
          toteutusOid: 'impl-oid',
        },
      ];
      const result = await (service as any).resolveApplicationTargets(
        targets,
        resolveLang,
        cache,
      );
      expect(Array.isArray(result)).toBe(true);
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        oid: 'hakukohde-oid-1',
        name: 'Application Group 1',
        applicationPeriod: {
          start: '2025-01-01T00:00:00Z',
          end: '2025-03-15T23:59:59Z',
        },
        requiredEducation: 'General upper secondary school',
        admissionCriteriaOid: 'valintaperuste-oid-1',
        applicationFormUrl:
          'https://opintopolku.fi/app/hakulomake/hakukohde-oid-1',
        implementationOids: ['impl-oid'],
        valintaperusteId: null,
        toteutusOid: 'impl-oid',
        hakuOid: null,
        valintaperuste: null,
      });
    });

    it('handles hakukohde with missing optional fields gracefully', async () => {
      const cache = new Map<string, any>();
      const targets = [
        {
          oid: 'hakukohde-oid-2',
          nimi: { en: 'Minimal Application Group' },
        },
      ];
      const result = await (service as any).resolveApplicationTargets(
        targets,
        resolveLang,
        cache,
      );
      expect(Array.isArray(result)).toBe(true);
      expect(result[0]).toEqual({
        oid: 'hakukohde-oid-2',
        name: 'Minimal Application Group',
        applicationPeriod: { start: null, end: null },
        requiredEducation: null,
        admissionCriteriaOid: null,
        applicationFormUrl: null,
        implementationOids: [],
        valintaperusteId: null,
        toteutusOid: null,
        hakuOid: null,
        valintaperuste: null,
      });
    });

    it('uses haku-level hakuajat fallback when hakukohde-level is missing', async () => {
      const cache = new Map<string, any>();
      const targets = [
        {
          oid: 'hk-oid-1',
          nimi: { en: 'Application Group' },
          _haku: {
            hakuajat: [{ alkaa: '2025-01-01', paattyy: '2025-03-15' }],
            nimi: { en: 'Joint Application' },
          },
        },
      ];
      const result = await (service as any).resolveApplicationTargets(
        targets,
        resolveLang,
        cache,
      );
      expect(result[0].applicationPeriod).toEqual({
        start: '2025-01-01',
        end: '2025-03-15',
      });
    });

    it('uses haku-level hakulomakeLinkki fallback when hakukohde-level is missing', async () => {
      const cache = new Map<string, any>();
      const targets = [
        {
          oid: 'hk-oid-1',
          nimi: { en: 'Application Group' },
          _haku: {
            hakuajat: [],
            hakulomakeLinkki: { en: 'https://apply.example.com' },
          },
        },
      ];
      const result = await (service as any).resolveApplicationTargets(
        targets,
        resolveLang,
        cache,
      );
      expect(result[0].applicationFormUrl).toBe('https://apply.example.com');
    });

    it('includes valintaperusteId, toteutusOid, and hakuOid fields', async () => {
      const cache = new Map<string, any>();
      const targets = [
        {
          oid: 'hk-oid-1',
          nimi: { en: 'Application Group' },
          valintaperusteId: 'vp-id-1',
          toteutusOid: 'tot-oid-1',
          hakuOid: 'haku-oid-1',
        },
      ];
      const result = await (service as any).resolveApplicationTargets(
        targets,
        resolveLang,
        cache,
      );
      expect(result[0].valintaperusteId).toBe('vp-id-1');
      expect(result[0].toteutusOid).toBe('tot-oid-1');
      expect(result[0].hakuOid).toBe('haku-oid-1');
    });
  });

  describe('fetchValintaperuste()', () => {
    const resolveLang = (obj: any): string => {
      if (!obj || typeof obj !== 'object') return obj ?? '';
      return obj.en ?? obj.fi ?? '';
    };

    it('returns null for empty vpId', async () => {
      const cache = new Map<string, any>();
      const result = await (service as any).fetchValintaperuste(
        '',
        resolveLang,
        cache,
      );
      expect(result).toBeNull();
    });

    it('returns cached value on subsequent calls with same vpId', async () => {
      const cache = new Map<string, any>();
      cache.set('vp-1', { id: 'vp-1', name: 'Cached' });

      // Should return cached value without making HTTP call
      const result = await (service as any).fetchValintaperuste(
        'vp-1',
        resolveLang,
        cache,
      );
      expect(result).toEqual({ id: 'vp-1', name: 'Cached' });
      expect(httpService.get).not.toHaveBeenCalled();
    });

    it('enriches valintaperuste with selectionMethods, eligibility, and exams', async () => {
      const cache = new Map<string, any>();
      httpService.get.mockReturnValueOnce(
        of({
          data: {
            id: 'vp-1',
            nimi: { en: 'Admission Criteria 2025' },
            metadata: {
              valintatavat: [
                {
                  nimi: { en: 'Certificate-based selection' },
                  valintatapa: { koodiUri: 'valintatapa_yo' },
                  sisalto: [
                    { data: { en: 'Based on matriculation exam results' } },
                  ],
                  kynnysehto: { en: 'Minimum grade C' },
                },
              ],
              hakukelpoisuus: {
                en: 'General eligibility for higher education',
              },
              lisatiedot: { en: 'Additional details here' },
            },
            valintakokeet: [{ id: 'exam-1', nimi: { en: 'Entrance Exam' } }],
          },
        }),
      );

      const result = await (service as any).fetchValintaperuste(
        'vp-1',
        resolveLang,
        cache,
      );

      expect(result).toEqual({
        id: 'vp-1',
        name: 'Admission Criteria 2025',
        selectionMethods: [
          {
            name: 'Certificate-based selection',
            type: 'valintatapa_yo',
            description: 'Based on matriculation exam results',
            thresholdCondition: 'Minimum grade C',
          },
        ],
        eligibilityCriteria: 'General eligibility for higher education',
        additionalInfo: 'Additional details here',
        entranceExams: [{ id: 'exam-1', nimi: { en: 'Entrance Exam' } }],
      });
    });

    it('returns null and caches null on fetch failure', async () => {
      const cache = new Map<string, any>();
      httpService.get.mockImplementationOnce(() => {
        throw new Error('Network error');
      });

      const result = await (service as any).fetchValintaperuste(
        'vp-fail',
        resolveLang,
        cache,
      );
      expect(result).toBeNull();
      // Subsequent call should return cached null without HTTP call
      httpService.get.mockClear();
      const result2 = await (service as any).fetchValintaperuste(
        'vp-fail',
        resolveLang,
        cache,
      );
      expect(result2).toBeNull();
      expect(httpService.get).not.toHaveBeenCalled();
    });

    it('handles valintaperuste with no valintatavat', async () => {
      const cache = new Map<string, any>();
      httpService.get.mockReturnValueOnce(
        of({
          data: {
            id: 'vp-minimal',
            nimi: { en: 'Minimal Criteria' },
            metadata: {},
            valintakokeet: [],
          },
        }),
      );

      const result = await (service as any).fetchValintaperuste(
        'vp-minimal',
        resolveLang,
        cache,
      );

      expect(result).toEqual({
        id: 'vp-minimal',
        name: 'Minimal Criteria',
        selectionMethods: [],
        eligibilityCriteria: null,
        additionalInfo: null,
        entranceExams: [],
      });
    });
  });
});
