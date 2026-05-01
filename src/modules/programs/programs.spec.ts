import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { ProgramsService } from './programs.service';
import { PrismaService } from '../../providers/prisma.service';

const mockProgramRow = {
  oid: 'prog-oid-1',
  name: 'Computer Science',
  type: 'yo',
  isDegree: true,
  imageUrl: null,
  fieldOfStudy: 'Computing',
  creditsAmount: 180,
  creditsUnit: 'ECTS credits',
  teachingLanguages: ['en'],
  universities: [
    { university: { oid: 'uni-oid-1', name: 'Aalto University' } },
  ],
};

const mockProgramDetailRow = {
  ...mockProgramRow,
  description: 'A description',
  typePath: 'kk/yo',
  eqfLevel: 'eqf_6',
  nqfLevel: 'nqf_6',
  degreeTitles: ['Bachelor of Science'],
  implementations: [{ oid: 'impl-oid', name: 'CS implementation' }],
};

describe('ProgramsService', () => {
  let service: ProgramsService;
  let prisma: {
    program: {
      count: jest.Mock;
      findMany: jest.Mock;
      findUnique: jest.Mock;
    };
    $transaction: jest.Mock;
  };

  beforeEach(async () => {
    const transactionMock = jest.fn();
    prisma = {
      program: { count: jest.fn(), findMany: jest.fn(), findUnique: jest.fn() },
      $transaction: transactionMock,
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProgramsService,
        { provide: PrismaService, useValue: prisma },
        {
          provide: CACHE_MANAGER,
          useValue: { get: jest.fn(), set: jest.fn() },
        },
      ],
    }).compile();

    service = module.get(ProgramsService);
  });

  describe('findAll()', () => {
    it('returns paginated hits from DB with providers', async () => {
      prisma.$transaction.mockResolvedValue([1, [mockProgramRow]]);

      const result = await service.findAll();

      expect(result.total).toBe(1);
      expect(result.page).toBe(0);
      expect(result.size).toBe(20);
      expect(result.hits).toHaveLength(1);
      expect(result.hits[0].oid).toBe('prog-oid-1');
      expect(result.hits[0].providers[0].oid).toBe('uni-oid-1');
      expect(result.hits[0].providers[0].name).toBe('Aalto University');
    });

    it('applies page and size pagination to Prisma query', async () => {
      // $transaction receives [countPromise, findManyPromise] — intercept and
      // delegate to the individual mocks so spy calls get recorded.
      prisma.$transaction.mockImplementation(async (ops) => {
        const results = await Promise.all(ops);
        return results;
      });
      prisma.program.count.mockResolvedValue(0);
      prisma.program.findMany.mockResolvedValue([]);

      await service.findAll({ page: '2', size: '10' });

      const findManyArgs = prisma.program.findMany.mock.calls[0][0];
      expect(findManyArgs.skip).toBe(20); // page 2 * size 10
      expect(findManyArgs.take).toBe(10);
    });

    it('returns empty hits when DB is empty', async () => {
      prisma.$transaction.mockResolvedValue([0, []]);

      const result = await service.findAll();

      expect(result.total).toBe(0);
      expect(result.hits).toHaveLength(0);
    });
  });

  describe('findOne()', () => {
    it('returns full program detail including implementations and universities', async () => {
      prisma.program.findUnique.mockResolvedValue(mockProgramDetailRow);

      const result = await service.findOne('prog-oid-1');

      expect(result.oid).toBe('prog-oid-1');
      expect(result.description).toBe('A description');
      expect(result.typePath).toBe('kk/yo');
      expect(result.eqfLevel).toBe('eqf_6');
      expect(result.nqfLevel).toBe('nqf_6');
      expect(result.degreeTitles).toEqual(['Bachelor of Science']);
      expect(result.implementations).toEqual([
        { oid: 'impl-oid', name: 'CS implementation' },
      ]);
      expect(result.universities[0].oid).toBe('uni-oid-1');
      expect(result.universities[0].name).toBe('Aalto University');
    });

    it('throws NotFoundException when program OID not in DB', async () => {
      prisma.program.findUnique.mockResolvedValue(null);

      await expect(service.findOne('unknown-oid')).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.findOne('unknown-oid')).rejects.toThrow(
        'Program not found: unknown-oid',
      );
    });
  });
});
