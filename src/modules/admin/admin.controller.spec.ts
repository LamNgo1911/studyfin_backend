import { Test, TestingModule } from '@nestjs/testing';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';

describe('AdminController', () => {
  let controller: AdminController;
  let adminService: {
    listUsers: jest.Mock;
    toggleMockTestAccess: jest.Mock;
  };

  beforeEach(async () => {
    adminService = {
      listUsers: jest.fn(),
      toggleMockTestAccess: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminController],
      providers: [{ provide: AdminService, useValue: adminService }],
    }).compile();

    controller = module.get(AdminController);
  });

  describe('listUsers()', () => {
    it('delegates to adminService.listUsers with query params', async () => {
      const expected = { total: 1, page: 0, size: 20, users: [] };
      adminService.listUsers.mockResolvedValue(expected);

      const result = await controller.listUsers({ page: 0, size: 20 });

      expect(adminService.listUsers).toHaveBeenCalledWith({ page: 0, size: 20 });
      expect(result).toEqual(expected);
    });

    it('passes email filter to adminService.listUsers', async () => {
      adminService.listUsers.mockResolvedValue({ total: 0, page: 0, size: 20, users: [] });

      await controller.listUsers({ email: 'test@example.com', page: 0, size: 20 });

      expect(adminService.listUsers).toHaveBeenCalledWith({
        email: 'test@example.com',
        page: 0,
        size: 20,
      });
    });
  });

  describe('toggleMockTestAccess()', () => {
    it('delegates to adminService.toggleMockTestAccess with id and dto', async () => {
      const expected = {
        id: 'user-1',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        role: 'USER',
        hasTestAccess: true,
        emailVerifiedAt: null,
        createdAt: new Date(),
      };
      adminService.toggleMockTestAccess.mockResolvedValue(expected);

      const result = await controller.toggleMockTestAccess('user-1', {
        hasTestAccess: true,
      });

      expect(adminService.toggleMockTestAccess).toHaveBeenCalledWith('user-1', {
        hasTestAccess: true,
      });
      expect(result).toEqual(expected);
    });

    it('can set hasTestAccess to false', async () => {
      adminService.toggleMockTestAccess.mockResolvedValue({
        id: 'user-1',
        hasTestAccess: false,
      });

      await controller.toggleMockTestAccess('user-1', { hasTestAccess: false });

      expect(adminService.toggleMockTestAccess).toHaveBeenCalledWith('user-1', {
        hasTestAccess: false,
      });
    });
  });
});
