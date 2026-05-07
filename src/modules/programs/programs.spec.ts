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
    {
      university: {
        oid: 'uni-oid-1',
        name: 'Aalto University',
        nameMultilingual: { fi: 'Aalto-yliopisto', en: 'Aalto University' },
        descriptionMultilingual: { fi: 'Kuvaus', en: 'Description' },
      },
    },
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
  applicationTargets: [
    {
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
    },
  ],
  duration: '3 years',
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
      prisma.program.findMany.mockResolvedValue([mockProgramRow]);

      const result = await service.findAll();

      expect(result.total).toBe(1);
      expect(result.page).toBe(0);
      expect(result.size).toBe(20);
      expect(result.hits).toHaveLength(1);
      expect(result.hits[0].oid).toBe('prog-oid-1');
      expect(result.hits[0].providers[0].oid).toBe('uni-oid-1');
      expect(result.hits[0].providers[0].name).toBe('Aalto University');
    });

    it('applies in-memory pagination after English university filtering', async () => {
      // Mock enough rows to test slicing
      const rows = Array.from({ length: 15 }, (_, i) => ({
        ...mockProgramRow,
        oid: `prog-${i}`,
      }));
      prisma.program.findMany.mockResolvedValue(rows);

      const result = await service.findAll({ page: '1', size: '10' });

      expect(result.page).toBe(1);
      expect(result.size).toBe(10);
      expect(result.total).toBe(15);
      expect(result.hits).toHaveLength(5); // 15 rows, page 1 starts at index 10
      expect(result.hits[0].oid).toBe('prog-10');
    });

    it('returns empty hits when DB is empty', async () => {
      prisma.program.findMany.mockResolvedValue([]);

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
      expect(result.applicationTargets).toEqual(
        mockProgramDetailRow.applicationTargets,
      );
      expect(result.duration).toBe('3 years');
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

    it('returns null applicationTargets and duration when not present in DB', async () => {
      const rowWithoutTargets = {
        ...mockProgramDetailRow,
        applicationTargets: undefined,
        duration: undefined,
      };
      prisma.program.findUnique.mockResolvedValue(rowWithoutTargets);

      const result = await service.findOne('prog-oid-1');

      expect(result.applicationTargets).toBeNull();
      expect(result.duration).toBeNull();
    });
  });
});
