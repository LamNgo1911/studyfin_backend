import { Test, TestingModule } from '@nestjs/testing';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { SyncService } from './sync.service';
import { PrismaService } from '../../providers/prisma.service';
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
});
