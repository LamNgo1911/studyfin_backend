import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { UsersService } from './users.service';
import { PrismaService } from '../../providers/prisma.service';

const mockUser = {
  id: 'user-1',
  email: 'test@example.com',
  firstName: 'Jane',
  lastName: 'Doe',
  role: 'USER',
  hasTestAccess: false,
  emailVerifiedAt: null,
  createdAt: new Date('2026-01-01'),
  _count: { savedPrograms: 2 },
};

const mockSavedProgram = {
  id: 'up-1',
  programId: 'prog-1',
  status: 'interested',
  createdAt: new Date('2026-01-01'),
  program: { name: 'CS Program', oid: 'oid-1', type: 'yo', fieldOfStudy: 'Engineering' },
};

const mockPrisma = {
  user: {
    findUnique: jest.fn(),
    update: jest.fn(),
  },
  program: {
    findUnique: jest.fn(),
  },
  userProgram: {
    create: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    findMany: jest.fn(),
  },
};

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    jest.clearAllMocks();
  });

  describe('getProfile', () => {
    it('returns safe profile shape for existing user', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(mockUser);
      const result = await service.getProfile('user-1');
      expect(result).toMatchObject({
        id: 'user-1',
        email: 'test@example.com',
        hasTestAccess: false,
        savedProgramCount: 2,
      });
      expect(result).not.toHaveProperty('passwordHash');
      expect(result).not.toHaveProperty('resetToken');
    });

    it('throws NotFoundException when user not found', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);
      await expect(service.getProfile('missing-id')).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateProfile', () => {
    it('updates firstName and lastName', async () => {
      const updated = { ...mockUser, firstName: 'Updated', lastName: 'Name' };
      mockPrisma.user.update.mockResolvedValue(updated);
      const result = await service.updateProfile('user-1', { firstName: 'Updated', lastName: 'Name' });
      expect(result.firstName).toBe('Updated');
      expect(result.lastName).toBe('Name');
    });
  });

  describe('saveProgram', () => {
    it('creates UserProgram with status interested', async () => {
      mockPrisma.program.findUnique.mockResolvedValue({ id: 'prog-1' });
      mockPrisma.userProgram.create.mockResolvedValue(mockSavedProgram);
      const result = await service.saveProgram('user-1', 'prog-1');
      expect(result.status).toBe('interested');
      expect(mockPrisma.userProgram.create).toHaveBeenCalledWith(
        expect.objectContaining({ data: expect.objectContaining({ status: 'interested' }) }),
      );
    });

    it('throws NotFoundException when program does not exist', async () => {
      mockPrisma.program.findUnique.mockResolvedValue(null);
      await expect(service.saveProgram('user-1', 'bad-prog')).rejects.toThrow(NotFoundException);
    });

    it('throws ConflictException when program already saved', async () => {
      mockPrisma.program.findUnique.mockResolvedValue({ id: 'prog-1' });
      mockPrisma.userProgram.create.mockRejectedValue({ code: 'P2002' });
      await expect(service.saveProgram('user-1', 'prog-1')).rejects.toThrow(ConflictException);
    });
  });

  describe('updateSavedProgramStatus', () => {
    it('updates status when record exists', async () => {
      mockPrisma.userProgram.findUnique.mockResolvedValue(mockSavedProgram);
      mockPrisma.userProgram.update.mockResolvedValue({ ...mockSavedProgram, status: 'applying' });
      const result = await service.updateSavedProgramStatus('user-1', 'prog-1', { status: 'applying' });
      expect(result.status).toBe('applying');
    });

    it('throws NotFoundException when saved program not found', async () => {
      mockPrisma.userProgram.findUnique.mockResolvedValue(null);
      await expect(
        service.updateSavedProgramStatus('user-1', 'bad-prog', { status: 'applying' }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('removeSavedProgram', () => {
    it('deletes the saved program', async () => {
      mockPrisma.userProgram.findUnique.mockResolvedValue(mockSavedProgram);
      mockPrisma.userProgram.delete.mockResolvedValue(mockSavedProgram);
      await expect(service.removeSavedProgram('user-1', 'prog-1')).resolves.toBeUndefined();
      expect(mockPrisma.userProgram.delete).toHaveBeenCalled();
    });

    it('throws NotFoundException when saved program not found', async () => {
      mockPrisma.userProgram.findUnique.mockResolvedValue(null);
      await expect(service.removeSavedProgram('user-1', 'bad-prog')).rejects.toThrow(NotFoundException);
    });
  });

  describe('listSavedPrograms', () => {
    it('returns all saved programs when no status filter', async () => {
      mockPrisma.userProgram.findMany.mockResolvedValue([mockSavedProgram]);
      const result = await service.listSavedPrograms('user-1', {});
      expect(result).toHaveLength(1);
      expect(mockPrisma.userProgram.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: expect.objectContaining({ userId: 'user-1' }) }),
      );
    });

    it('filters by status when provided', async () => {
      mockPrisma.userProgram.findMany.mockResolvedValue([mockSavedProgram]);
      await service.listSavedPrograms('user-1', { status: 'interested' });
      expect(mockPrisma.userProgram.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ userId: 'user-1', status: 'interested' }),
        }),
      );
    });
  });
});
