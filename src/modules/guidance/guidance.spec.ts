import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { GuidanceService } from './guidance.service';
import { PrismaService } from '../../providers/prisma.service';

const mockSection = {
  id: 'section-id-1',
  programOid: 'prog-oid-123',
  key: 'application-process',
  title: 'Application Process',
  body: 'Apply via Studyinfo.',
  order: 1,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mappedSection = {
  key: 'application-process',
  title: 'Application Process',
  body: 'Apply via Studyinfo.',
  order: 1,
};

describe('GuidanceService', () => {
  let service: GuidanceService;
  let prisma: {
    guidanceSection: {
      findMany: jest.Mock;
      deleteMany: jest.Mock;
      createMany: jest.Mock;
      upsert: jest.Mock;
    };
    program: {
      findUnique: jest.Mock;
    };
    $transaction: jest.Mock;
  };

  beforeEach(async () => {
    prisma = {
      guidanceSection: {
        findMany: jest.fn(),
        deleteMany: jest.fn(),
        createMany: jest.fn(),
        upsert: jest.fn(),
      },
      program: {
        findUnique: jest.fn(),
      },
      $transaction: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GuidanceService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<GuidanceService>(GuidanceService);
  });

  describe('findByProgramOid()', () => {
    it('returns sections sorted by order asc', async () => {
      prisma.program.findUnique.mockResolvedValue({ oid: 'prog-oid-123' });
      prisma.guidanceSection.findMany.mockResolvedValue([mockSection]);

      const result = await service.findByProgramOid('prog-oid-123');

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual(mappedSection);
      expect(prisma.guidanceSection.findMany).toHaveBeenCalledWith({
        where: { programOid: 'prog-oid-123' },
        orderBy: { order: 'asc' },
      });
    });

    it('returns empty array when no sections exist', async () => {
      prisma.program.findUnique.mockResolvedValue({ oid: 'prog-oid-123' });
      prisma.guidanceSection.findMany.mockResolvedValue([]);

      const result = await service.findByProgramOid('prog-oid-123');

      expect(result).toEqual([]);
    });

    it('throws NotFoundException when program does not exist', async () => {
      prisma.program.findUnique.mockResolvedValue(null);

      await expect(
        service.findByProgramOid('unknown-oid'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('upsert()', () => {
    const dto = {
      sections: [
        { key: 'application-process', title: 'Application Process', body: 'Apply via Studyinfo.', order: 1 },
      ],
    };

    it('throws NotFoundException when programOid does not exist', async () => {
      prisma.program.findUnique.mockResolvedValue(null);

      await expect(service.upsert('unknown-oid', dto as any)).rejects.toThrow(NotFoundException);
    });

    it('deletes existing sections and creates new ones atomically', async () => {
      prisma.program.findUnique.mockResolvedValue({ oid: 'prog-oid-123' });
      // $transaction uses callback form — mock it to execute the callback
      prisma.$transaction.mockImplementation(async (fn: any) => fn(prisma));
      prisma.guidanceSection.deleteMany.mockResolvedValue({ count: 0 });
      prisma.guidanceSection.createMany.mockResolvedValue({ count: 1 });
      prisma.guidanceSection.findMany.mockResolvedValue([mockSection]);

      const result = await service.upsert('prog-oid-123', dto as any);

      expect(prisma.$transaction).toHaveBeenCalled();
      expect(prisma.guidanceSection.deleteMany).toHaveBeenCalledWith({
        where: { programOid: 'prog-oid-123' },
      });
      expect(prisma.guidanceSection.createMany).toHaveBeenCalled();
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual(mappedSection);
    });
  });

  describe('patch()', () => {
    const dto = {
      sections: [
        { key: 'application-process', title: 'Updated Title', body: 'Updated body.', order: 2 },
      ],
    };

    it('throws NotFoundException when programOid does not exist', async () => {
      prisma.program.findUnique.mockResolvedValue(null);

      await expect(service.patch('unknown-oid', dto as any)).rejects.toThrow(NotFoundException);
    });

    it('upserts provided sections and returns all sections sorted by order', async () => {
      prisma.program.findUnique.mockResolvedValue({ oid: 'prog-oid-123' });
      // $transaction uses interactive (callback-based) form for patch
      prisma.$transaction.mockImplementation(async (fn: any) => fn(prisma));
      prisma.guidanceSection.upsert.mockResolvedValue({ ...mockSection, title: 'Updated Title', order: 2 });
      prisma.guidanceSection.deleteMany.mockResolvedValue({ count: 0 });
      prisma.guidanceSection.findMany.mockResolvedValue([{ ...mockSection, title: 'Updated Title', order: 2 }]);

      const result = await service.patch('prog-oid-123', dto as any);

      expect(prisma.guidanceSection.upsert).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { programOid_key: { programOid: 'prog-oid-123', key: 'application-process' } },
        }),
      );
      expect(result[0].title).toBe('Updated Title');
    });

    it('throws BadRequestException when dto.sections and dto.deleteKeys are both empty', async () => {
      prisma.program.findUnique.mockResolvedValue({ oid: 'prog-oid-123' });

      await expect(
        service.patch('prog-oid-123', { sections: [] } as any),
      ).rejects.toThrow(BadRequestException);
    });
  });
});
