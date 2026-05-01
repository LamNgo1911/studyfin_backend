import { Test, TestingModule } from '@nestjs/testing';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { SearchService } from './search.service';
import { PrismaService } from '../../providers/prisma.service';

const mockUniversityRow = {
  oid: '1.2.246.562.10.56753942459',
  id: 'uni-1',
  name: 'Aalto University',
  nameMultilingual: { fi: 'Aalto-yliopisto', en: 'Aalto University', sv: 'Aalto-universitetet' },
  description: 'A great university',
  descriptionMultilingual: { fi: 'Mahtava yliopisto', en: 'A great university' },
  logoUrl: 'https://example.com/logo.png',
  type: 'yo',
  municipality: 'Helsinki',
  website: 'https://aalto.fi',
  email: 'info@aalto.fi',
  studentCount: 15000,
  locations: [{ code: 'kunta_091', name: 'Helsinki' }],
};

const mockProgramRow = {
  id: 'prog-1',
  oid: 'prog-oid',
  name: 'Computer Science',
  description: 'A great program',
  type: 'koulutustyyppi_15',
  typePath: 'kk/yo',
  isDegree: true,
  imageUrl: null,
  creditsAmount: 180,
  creditsUnit: 'op',
  eqfLevel: 'eqf_6',
  nqfLevel: 'nqf_6',
  fieldOfStudy: 'Computer Science',
  degreeTitles: ['Bachelor of Science'],
  teachingLanguages: ['en'],
  implementations: null,
  universities: [
    {
      university: {
        oid: '1.2.246.562.10.56753942459',
        name: 'Aalto University',
        nameMultilingual: { fi: 'Aalto-yliopisto', en: 'Aalto University' },
        locations: [{ code: 'kunta_091', name: 'Helsinki' }],
      },
    },
  ],
};

describe('SearchService', () => {
  let service: SearchService;
  let prisma: {
    university: { count: jest.Mock; findMany: jest.Mock };
    program: { count: jest.Mock; findMany: jest.Mock };
    $transaction: jest.Mock;
  };

  beforeEach(async () => {
    prisma = {
      university: { count: jest.fn(), findMany: jest.fn() },
      program: { count: jest.fn(), findMany: jest.fn() },
      $transaction: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SearchService,
        { provide: PrismaService, useValue: prisma },
        {
          provide: CACHE_MANAGER,
          useValue: { get: jest.fn(), set: jest.fn() },
        },
      ],
    }).compile();

    service = module.get(SearchService);
  });

  describe('filtered: programs only', () => {
    it('queries only the program table and returns typed hits', async () => {
      prisma.$transaction.mockResolvedValue([1, [mockProgramRow]]);

      const result = await service.search({
        q: 'computer',
        type: 'programs',
        size: 20,
        page: 0,
      });

      expect(result.total).toBe(1);
      expect(result.hits).toHaveLength(1);
      expect(result.hits[0].type).toBe('program');
      expect(result.hits[0].name).toBe('Computer Science');
      expect(result.hits[0].providers).toHaveLength(1);
      expect(result.hits[0].providers![0].oid).toBe('1.2.246.562.10.56753942459');
    });
  });

  describe('filtered: institutions only', () => {
    it('queries only the university table and returns typed hits', async () => {
      prisma.$transaction.mockResolvedValue([1, [mockUniversityRow]]);

      const result = await service.search({
        q: 'aalto',
        type: 'institutions',
        size: 20,
        page: 0,
      });

      expect(result.total).toBe(1);
      expect(result.hits).toHaveLength(1);
      expect(result.hits[0].type).toBe('institution');
      expect(result.hits[0].name).toBe('Aalto University');
      expect(result.hits[0].locations).toHaveLength(1);
    });
  });

  describe('mixed results (no type filter)', () => {
    it('queries both tables and merges results', async () => {
      prisma.program.count.mockResolvedValue(1);
      prisma.university.count.mockResolvedValue(1);
      prisma.program.findMany.mockResolvedValue([mockProgramRow]);
      prisma.university.findMany.mockResolvedValue([mockUniversityRow]);

      const result = await service.search({
        q: 'aalto',
        size: 20,
        page: 0,
      });

      expect(result.total).toBe(2);
      expect(result.hits.length).toBeGreaterThanOrEqual(2);
      // Programs come first in relevance mode
      expect(result.hits[0].type).toBe('program');
      expect(result.hits[1].type).toBe('institution');
    });
  });

  describe('no query', () => {
    it('queries both tables without full-text filter', async () => {
      prisma.program.count.mockResolvedValue(0);
      prisma.university.count.mockResolvedValue(0);
      prisma.program.findMany.mockResolvedValue([]);
      prisma.university.findMany.mockResolvedValue([]);

      const result = await service.search({
        size: 20,
        page: 0,
      });

      // When q is empty, no { search } filter is applied
      const progFindManyArgs = prisma.program.findMany.mock.calls[0][0];
      expect(progFindManyArgs.where).toEqual({});
      expect(result.total).toBe(0);
    });
  });
});
