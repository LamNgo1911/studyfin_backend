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

  describe('resolveHakukohteet()', () => {
    const resolveLang = (obj: any): string => {
      if (!obj || typeof obj !== 'object') return obj ?? '';
      return obj.en ?? obj.fi ?? '';
    };

    it('returns Prisma.JsonNull for null/undefined input', () => {
      const result1 = (service as any).resolveHakukohteet(null, resolveLang);
      const result2 = (service as any).resolveHakukohteet(undefined, resolveLang);
      expect(JSON.stringify(result1)).toBe(JSON.stringify(Prisma.JsonNull));
      expect(JSON.stringify(result2)).toBe(JSON.stringify(Prisma.JsonNull));
    });

    it('returns Prisma.JsonNull for empty array', () => {
      const result = (service as any).resolveHakukohteet([], resolveLang);
      expect(JSON.stringify(result)).toBe(JSON.stringify(Prisma.JsonNull));
    });

    it('filters out hakukohteet without English names', () => {
      const hakukohteet = [
        { nimi: { fi: 'Suomenkielinen hakukohde' } },
        { nimi: { fi: 'Toinen suomenkielinen' } },
      ];
      const result = (service as any).resolveHakukohteet(hakukohteet, resolveLang);
      expect(JSON.stringify(result)).toBe(JSON.stringify(Prisma.JsonNull));
    });

    it('resolves hakukohteet with English names correctly', () => {
      const hakukohteet = [
        {
          oid: 'hakukohde-oid-1',
          nimi: { en: 'Application Group 1', fi: 'Hakuryhma 1' },
          hakuaika: {
            alkaa: '2025-01-01T00:00:00Z',
            paattyy: '2025-03-15T23:59:59Z',
          },
          pohjakoulutusvaatimukset: [
            { nimi: { en: 'General upper secondary school', fi: 'Ylioppilastutkinto' } },
          ],
          valintapere: { oid: 'valintaperuste-oid-1' },
          linkit: [
            { tyyppi: 'hakulomake', href: 'https://opintopolku.fi/app/hakulomake/hakukohde-oid-1' },
          ],
          kaytetytToteutusOid: ['impl-oid'],
        },
      ];
      const result = (service as any).resolveHakukohteet(hakukohteet, resolveLang);
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
        applicationFormUrl: 'https://opintopolku.fi/app/hakulomake/hakukohde-oid-1',
        implementationOids: ['impl-oid'],
      });
    });

    it('handles hakukohde with missing optional fields gracefully', () => {
      const hakukohteet = [
        {
          oid: 'hakukohde-oid-2',
          nimi: { en: 'Minimal Application Group' },
          // No hakuaika, no pohjakoulutusvaatimukset, no valintapere, no linkit
        },
      ];
      const result = (service as any).resolveHakukohteet(hakukohteet, resolveLang);
      expect(Array.isArray(result)).toBe(true);
      expect(result[0]).toEqual({
        oid: 'hakukohde-oid-2',
        name: 'Minimal Application Group',
        applicationPeriod: { start: null, end: null },
        requiredEducation: null,
        admissionCriteriaOid: null,
        applicationFormUrl: null,
        implementationOids: [],
      });
    });
  });
});
