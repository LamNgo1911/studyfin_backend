import { Test, TestingModule } from '@nestjs/testing';
import { Logger } from '@nestjs/common';
import { SyncService } from './sync.service';
import { PrismaService } from '../../providers/prisma.service';
import { HttpService } from '@nestjs/axios';

describe('SyncService', () => {
  let service: SyncService;
  let prisma: {
    university: { upsert: jest.Mock; findUnique: jest.Mock; createMany: jest.Mock; deleteMany: jest.Mock };
    program: { upsert: jest.Mock; findUnique: jest.Mock; createMany: jest.Mock; deleteMany: jest.Mock; count: jest.Mock; findMany: jest.Mock };
    $transaction: jest.Mock;
    universityLocation: { deleteMany: jest.Mock; createMany: jest.Mock };
  };
  let httpService: { get: jest.Mock };

  beforeEach(async () => {
    prisma = {
      university: { upsert: jest.fn(), findUnique: jest.fn(), createMany: jest.fn(), deleteMany: jest.fn() },
      program: { upsert: jest.fn(), findUnique: jest.fn(), createMany: jest.fn(), deleteMany: jest.fn(), count: jest.fn(), findMany: jest.fn() },
      $transaction: jest.fn(),
      universityLocation: { deleteMany: jest.fn(), createMany: jest.fn() },
    };
    httpService = { get: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SyncService,
        { provide: PrismaService, useValue: prisma },
        { provide: HttpService, useValue: httpService },
      ],
    }).compile();

    service = module.get<SyncService>(SyncService);
  });

  describe('syncAll() mutex', () => {
    it('calls syncInstitutions and syncPrograms when no sync is running', async () => {
      // Mock the HTTP calls that syncInstitutions and syncPrograms make internally
      httpService.get.mockResolvedValue({ data: { total: 0, hits: [] } });

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
      prisma.$transaction.mockImplementation(async (operations) => {
        // Execute the operations array directly
        return operations[0]; // first operation is deleteMany result (empty count)
      });
      prisma.university.upsert.mockResolvedValue({ id: 'uni-db-id', oid: 'test-oid' });
      prisma.university.findUnique.mockResolvedValue({ id: 'uni-db-id', oid: 'test-oid' });

      // Manually call upsertInstitution via reflection or make it accessible
      // We test this by verifying $transaction was called with the right operations
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
      httpService.get
        .mockResolvedValueOnce({ data: { hits: [hit] } })
        .mockResolvedValueOnce(detailResponse);

      await service.syncInstitutions();

      // Verify $transaction was called for the upsertInstitution call
      const transactionCalls = prisma.$transaction.mock.calls;
      const locationTransaction = transactionCalls.find(
        (call) => Array.isArray(call[0]) && call[0][0]?.args?.where?.universityId !== undefined,
      );
      expect(locationTransaction).toBeDefined();
    });
  });
});