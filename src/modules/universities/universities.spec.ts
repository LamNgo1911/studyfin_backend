import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { UniversitiesService } from './universities.service';
import { PrismaService } from '../../providers/prisma.service';

const mockUniversityRow = {
  oid: '1.2.246.562.10.56753942459',
  name: 'Aalto University',
  description: 'A great university',
  logoUrl: 'https://example.com/logo.png',
  type: 'yo',
  municipality: 'Helsinki',
  website: 'https://aalto.fi',
  email: 'info@aalto.fi',
  studentCount: 15000,
  locations: [{ code: 'kunta_091', name: 'Helsinki' }],
};

describe('UniversitiesService', () => {
  let service: UniversitiesService;
  let prisma: {
    university: {
      count: jest.Mock;
      findMany: jest.Mock;
      findUnique: jest.Mock;
    };
    program: { count: jest.Mock; findMany: jest.Mock };
    $transaction: jest.Mock;
  };

  beforeEach(async () => {
    prisma = {
      university: {
        count: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
      },
      program: {
        count: jest.fn(),
        findMany: jest.fn(),
      },
      $transaction: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UniversitiesService,
        { provide: PrismaService, useValue: prisma },
        {
          provide: CACHE_MANAGER,
          useValue: { get: jest.fn(), set: jest.fn() },
        },
      ],
    }).compile();

    service = module.get<UniversitiesService>(UniversitiesService);
  });

  describe('findAll()', () => {
    it('returns paginated hits with correct field shape', async () => {
      prisma.$transaction.mockResolvedValue([1, [mockUniversityRow]]);

      const result = await service.findAll({ size: 20, page: 0 });

      expect(result.total).toBe(1);
      expect(result.page).toBe(0);
      expect(result.size).toBe(20);
      expect(result.hits).toHaveLength(1);
      const hit = result.hits[0];
      expect(hit.oid).toBe('1.2.246.562.10.56753942459');
      expect(hit.name).toBe('Aalto University');
      expect(hit.type).toBe('yo');
      expect(hit.municipality).toBe('Helsinki');
      expect(hit.locations).toEqual([{ code: 'kunta_091', name: 'Helsinki' }]);
    });

    it('returns empty hits when DB is empty', async () => {
      prisma.$transaction.mockResolvedValue([0, []]);

      const result = await service.findAll({});

      expect(result.total).toBe(0);
      expect(result.hits).toHaveLength(0);
    });

    it('applies pagination with skip and take', async () => {
      prisma.$transaction.mockImplementation(async (ops) => Promise.all(ops));
      prisma.university.count.mockResolvedValue(0);
      prisma.university.findMany.mockResolvedValue([]);

      await service.findAll({ page: 2, size: 5 });

      const findManyArgs = prisma.university.findMany.mock.calls[0][0];
      expect(findManyArgs.skip).toBe(10); // page 2 * size 5
      expect(findManyArgs.take).toBe(5);
    });
  });

  describe('findOne()', () => {
    it('returns full detail shape with website and email', async () => {
      prisma.university.findUnique.mockResolvedValue(mockUniversityRow);

      const result = await service.findOne('1.2.246.562.10.56753942459');

      expect(result.oid).toBe('1.2.246.562.10.56753942459');
      expect(result.website).toBe('https://aalto.fi');
      expect(result.email).toBe('info@aalto.fi');
      expect(result.locations).toEqual([
        { code: 'kunta_091', name: 'Helsinki' },
      ]);
    });

    it('throws NotFoundException for unknown OID', async () => {
      prisma.university.findUnique.mockResolvedValue(null);

      await expect(service.findOne('unknown-oid')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findPrograms()', () => {
    const mockProgramRow = {
      oid: 'prog-oid',
      name: 'Computer Science',
      type: 'yo',
      isDegree: true,
      imageUrl: null,
      fieldOfStudy: 'Computing',
      creditsAmount: 180,
      creditsUnit: 'ECTS credits',
      teachingLanguages: ['en'],
      universities: [
        {
          university: {
            oid: '1.2.246.562.10.56753942459',
            name: 'Aalto University',
          },
        },
      ],
    };

    it('returns programs for a university with correct shape', async () => {
      prisma.university.findUnique.mockResolvedValue({
        id: 'uni-db-id',
        oid: '1.2.246.562.10.56753942459',
        name: 'Aalto University',
      });
      prisma.$transaction.mockImplementation(async (ops) => Promise.all(ops));
      prisma.program.count.mockResolvedValue(1);
      prisma.program.findMany.mockResolvedValue([mockProgramRow]);

      const result = await service.findPrograms('1.2.246.562.10.56753942459', {
        page: 0,
        size: 20,
      });

      expect(result.total).toBe(1);
      expect(result.hits[0].oid).toBe('prog-oid');
    });

    it('throws NotFoundException when university OID not found', async () => {
      prisma.university.findUnique.mockResolvedValue(null);

      await expect(service.findPrograms('unknown-oid', {})).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
