import { Test, TestingModule } from '@nestjs/testing';
import { SearchService } from './search.service';
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

describe('SearchService', () => {
  let service: SearchService;
  let prisma: {
    university: { count: jest.Mock; findMany: jest.Mock };
    program: { count: jest.Mock; findMany: jest.Mock };
  };

  beforeEach(async () => {
    prisma = {
      university: { count: jest.fn(), findMany: jest.fn() },
      program: { count: jest.fn(), findMany: jest.fn() },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SearchService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get(SearchService);
  });

  describe('searchInstitutions()', () => {
    it('maps DB rows to InstitutionDto correctly', async () => {
      prisma.university.count.mockResolvedValue(1);
      prisma.university.findMany.mockResolvedValue([mockUniversityRow]);

      const result = await service.searchInstitutions({
        keyword: 'aalto',
        size: 20,
        page: 0,
      });

      expect(result.total).toBe(1);
      expect(result.page).toBe(0);
      expect(result.size).toBe(20);
      expect(result.hits).toHaveLength(1);

      const hit = result.hits[0];
      expect(hit.oid).toBe('1.2.246.562.10.56753942459');
      expect(hit.name).toBe('Aalto University');
      expect(hit.description).toBe('A great university');
      expect(hit.logoUrl).toBe('https://example.com/logo.png');
      expect(hit.type).toBe('yo');
      expect(hit.municipality).toBe('Helsinki');
      expect(hit.website).toBe('https://aalto.fi');
      expect(hit.email).toBe('info@aalto.fi');
      expect(hit.studentCount).toBe(15000);
      expect(hit.locations).toEqual([{ code: 'kunta_091', name: 'Helsinki' }]);
    });

    it('applies keyword ILIKE filter when keyword is provided', async () => {
      prisma.university.count.mockResolvedValue(0);
      prisma.university.findMany.mockResolvedValue([]);

      await service.searchInstitutions({ keyword: 'aalto', size: 20, page: 0 });

      const whereArg = prisma.university.count.mock.calls[0][0].where;
      expect(whereArg).toEqual({
        name: { contains: 'aalto', mode: 'insensitive' },
      });
    });

    it('uses empty where when no keyword is provided', async () => {
      prisma.university.count.mockResolvedValue(0);
      prisma.university.findMany.mockResolvedValue([]);

      await service.searchInstitutions({ size: 20, page: 0 });

      const whereArg = prisma.university.count.mock.calls[0][0].where;
      expect(whereArg).toEqual({});
    });

    it('applies pagination correctly', async () => {
      prisma.university.count.mockResolvedValue(0);
      prisma.university.findMany.mockResolvedValue([]);

      await service.searchInstitutions({ size: 10, page: 3 });

      const findManyArgs = prisma.university.findMany.mock.calls[0][0];
      expect(findManyArgs.skip).toBe(30); // page * size = 3 * 10
      expect(findManyArgs.take).toBe(10);
    });
  });

  describe('search()', () => {
    it('type=institutions delegates correctly and returns paginated hits', async () => {
      prisma.university.count.mockResolvedValue(1);
      prisma.university.findMany.mockResolvedValue([mockUniversityRow]);

      const result = await service.search({
        q: 'aalto',
        type: 'institutions',
        size: 20,
        page: 0,
      });

      expect(result.total).toBe(1);
      expect(result.page).toBe(0);
      expect(result.size).toBe(20);
      expect(result.hits).toHaveLength(1);
      expect(result.hits[0].oid).toBe('1.2.246.562.10.56753942459');
      expect(result.hits[0].type).toBe('yo');
    });

    it('type=programs queries programs with nested universities+locations join', async () => {
      const mockProgram = {
        oid: 'prog-oid',
        name: 'Computer Science',
        description: 'A great program',
        type: 'koulutustyyppi_15',
        typePath: ['koulutustyyppi_15'],
        isDegree: true,
        imageUrl: null,
        creditsAmount: 180,
        creditsUnit: 'op',
        eqfLevel: 6,
        nqfLevel: 6,
        fieldOfStudy: 'tietojenkasittely',
        degreeTitles: ['Bachelor of Science'],
        teachingLanguages: ['en'],
        implementations: null,
        universities: [
          {
            university: {
              oid: '1.2.246.562.10.56753942459',
              name: 'Aalto University',
              locations: [{ code: 'kunta_091', name: 'Helsinki' }],
            },
          },
        ],
      };

      prisma.program.count.mockResolvedValue(1);
      prisma.program.findMany.mockResolvedValue([mockProgram]);

      const result = await service.search({
        q: 'computer',
        type: 'programs',
        size: 20,
        page: 0,
      });

      expect(result.total).toBe(1);
      expect(result.hits).toHaveLength(1);

      const hit = result.hits[0];
      expect(hit.oid).toBe('prog-oid');
      expect(hit.name).toBe('Computer Science');
      expect(hit.providers).toHaveLength(1);
      expect(hit.providers[0].oid).toBe('1.2.246.562.10.56753942459');
      expect(hit.providers[0].locations).toEqual([
        { code: 'kunta_091', name: 'Helsinki' },
      ]);

      const findManyArgs = prisma.program.findMany.mock.calls[0][0];
      expect(findManyArgs.include.universities.include.university.include.locations).toBe(true);
    });
  });
});
