import { Test, TestingModule } from '@nestjs/testing';
import { AdminService } from './admin.service';
import { PrismaService } from '../../providers/prisma.service';
import { NotFoundException } from '@nestjs/common';

const mockUser = {
  id: 'user-1',
  email: 'test@example.com',
  firstName: 'Test',
  lastName: 'User',
  role: 'USER',
  hasTestAccess: false,
  emailVerifiedAt: null,
  createdAt: new Date('2026-01-01'),
};

describe('AdminService', () => {
  let service: AdminService;
  let prisma: {
    user: {
      count: jest.Mock;
      findMany: jest.Mock;
      update: jest.Mock;
    };
  };

  beforeEach(async () => {
    prisma = {
      user: {
        count: jest.fn(),
        findMany: jest.fn(),
        update: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdminService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get(AdminService);
  });

  describe('listUsers()', () => {
    it('returns paginated user list with total, page, size, and users', async () => {
      prisma.user.count.mockResolvedValue(2);
      prisma.user.findMany.mockResolvedValue([mockUser, { ...mockUser, id: 'user-2', email: 'other@example.com' }]);

      const result = await service.listUsers({ page: 0, size: 20 });

      expect(result.total).toBe(2);
      expect(result.page).toBe(0);
      expect(result.size).toBe(20);
      expect(result.users).toHaveLength(2);
      expect(result.users[0].email).toBe('test@example.com');
    });

    it('filters by email when provided', async () => {
      prisma.user.count.mockResolvedValue(1);
      prisma.user.findMany.mockResolvedValue([mockUser]);

      await service.listUsers({ email: 'test', page: 0, size: 20 });

      expect(prisma.user.count).toHaveBeenCalledWith({
        where: { email: { contains: 'test', mode: 'insensitive' } },
      });
      expect(prisma.user.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { email: { contains: 'test', mode: 'insensitive' } },
        }),
      );
    });

    it('uses empty where clause when email not provided', async () => {
      prisma.user.count.mockResolvedValue(0);
      prisma.user.findMany.mockResolvedValue([]);

      await service.listUsers({ page: 0, size: 20 });

      expect(prisma.user.count).toHaveBeenCalledWith({ where: {} });
    });

    it('paginates correctly with skip and take', async () => {
      prisma.user.count.mockResolvedValue(50);
      prisma.user.findMany.mockResolvedValue([]);

      await service.listUsers({ page: 2, size: 10 });

      expect(prisma.user.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          skip: 20,
          take: 10,
          orderBy: { createdAt: 'desc' },
        }),
      );
    });

    it('does not expose passwordHash or token fields (uses select allowlist)', async () => {
      prisma.user.count.mockResolvedValue(1);
      prisma.user.findMany.mockResolvedValue([mockUser]);

      const result = await service.listUsers({ page: 0, size: 20 });

      expect(result.users[0]).not.toHaveProperty('passwordHash');
      expect(result.users[0]).not.toHaveProperty('password');
      expect(result.users[0]).toHaveProperty('id');
      expect(result.users[0]).toHaveProperty('email');
      expect(result.users[0]).toHaveProperty('hasTestAccess');
    });
  });

  describe('toggleMockTestAccess()', () => {
    it('updates hasTestAccess to true and returns updated user fields', async () => {
      const updatedUser = { ...mockUser, hasTestAccess: true };
      prisma.user.update.mockResolvedValue(updatedUser);

      const result = await service.toggleMockTestAccess('user-1', {
        hasTestAccess: true,
      });

      expect(result.hasTestAccess).toBe(true);
      expect(prisma.user.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'user-1' },
          data: { hasTestAccess: true },
        }),
      );
    });

    it('updates hasTestAccess to false', async () => {
      const updatedUser = { ...mockUser, hasTestAccess: false };
      prisma.user.update.mockResolvedValue(updatedUser);

      const result = await service.toggleMockTestAccess('user-1', {
        hasTestAccess: false,
      });

      expect(result.hasTestAccess).toBe(false);
    });

    it('throws NotFoundException when user id does not exist (P2025)', async () => {
      prisma.user.update.mockRejectedValue({ code: 'P2025' });

      await expect(
        service.toggleMockTestAccess('nonexistent-id', { hasTestAccess: true }),
      ).rejects.toThrow(NotFoundException);
    });

    it('rethrows non-P2025 errors', async () => {
      const dbError = new Error('Database connection failed');
      prisma.user.update.mockRejectedValue(dbError);

      await expect(
        service.toggleMockTestAccess('user-1', { hasTestAccess: true }),
      ).rejects.toThrow('Database connection failed');
    });
  });
});
