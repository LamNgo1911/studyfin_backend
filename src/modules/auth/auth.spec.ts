import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import {
  ConflictException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { PrismaService } from '../../providers/prisma.service';

const mockUser = {
  id: 'user-123',
  email: 'test@example.com',
  passwordHash: '$2b$10$hashedpassword',
  firstName: 'Test',
  lastName: 'User',
  emailVerifiedAt: new Date(),
  emailVerifyToken: null,
  emailVerifyExpiresAt: null,
  resetToken: null,
  resetTokenExpiresAt: null,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockUnverifiedUser = {
  ...mockUser,
  id: 'user-456',
  emailVerifiedAt: null,
  emailVerifyToken: 'verify-token-123',
  emailVerifyExpiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
};

describe('AuthService', () => {
  let service: AuthService;
  let usersService: {
    findByEmail: jest.Mock;
    findById: jest.Mock;
    create: jest.Mock;
    findByEmailVerifyToken: jest.Mock;
    findByResetToken: jest.Mock;
    updateEmailVerification: jest.Mock;
    setResetToken: jest.Mock;
    updatePassword: jest.Mock;
  };
  let jwtService: { sign: jest.Mock };
  let prisma: {
    auth: {
      findFirst: jest.Mock;
      upsert: jest.Mock;
      delete: jest.Mock;
      deleteMany: jest.Mock;
    };
  };

  beforeEach(async () => {
    usersService = {
      findByEmail: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
      findByEmailVerifyToken: jest.fn(),
      findByResetToken: jest.fn(),
      updateEmailVerification: jest.fn(),
      setResetToken: jest.fn(),
      updatePassword: jest.fn(),
    };

    jwtService = {
      sign: jest.fn().mockReturnValue('mock-access-token'),
    };

    prisma = {
      auth: {
        findFirst: jest.fn(),
        upsert: jest.fn(),
        delete: jest.fn(),
        deleteMany: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: usersService },
        { provide: JwtService, useValue: jwtService },
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get(AuthService);
  });

  describe('register()', () => {
    it('creates a new user with hashed password', async () => {
      usersService.findByEmail.mockResolvedValue(null);
      usersService.create.mockResolvedValue(mockUnverifiedUser);

      const result = await service.register({
        email: 'test@example.com',
        password: 'password123',
        firstName: 'Test',
        lastName: 'User',
      });

      expect(usersService.findByEmail).toHaveBeenCalledWith('test@example.com');
      expect(usersService.create).toHaveBeenCalledWith(
        expect.objectContaining({
          email: 'test@example.com',
          firstName: 'Test',
          lastName: 'User',
        }),
      );
      expect(result.user).not.toHaveProperty('passwordHash');
      expect(result.user.email).toBe('test@example.com');
    });

    it('throws ConflictException if email already registered', async () => {
      usersService.findByEmail.mockResolvedValue(mockUser);

      await expect(
        service.register({
          email: 'test@example.com',
          password: 'password123',
        }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('verifyEmail()', () => {
    it('verifies email with valid token', async () => {
      usersService.findByEmailVerifyToken.mockResolvedValue(mockUnverifiedUser);
      usersService.updateEmailVerification.mockResolvedValue(mockUser);

      const result = await service.verifyEmail('verify-token-123');

      expect(result.message).toBe('Email verified successfully');
      expect(usersService.updateEmailVerification).toHaveBeenCalledWith(
        mockUnverifiedUser.id,
        expect.objectContaining({
          emailVerifyToken: null,
        }),
      );
    });

    it('throws BadRequestException for invalid token', async () => {
      usersService.findByEmailVerifyToken.mockResolvedValue(null);

      await expect(service.verifyEmail('invalid-token')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('throws BadRequestException for expired token', async () => {
      const expiredUser = {
        ...mockUnverifiedUser,
        emailVerifyExpiresAt: new Date(Date.now() - 1000),
      };
      usersService.findByEmailVerifyToken.mockResolvedValue(expiredUser);

      await expect(service.verifyEmail('expired-token')).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('login()', () => {
    it('returns tokens for valid credentials with verified email', async () => {
      usersService.findByEmail.mockResolvedValue(mockUser);
      prisma.auth.upsert.mockResolvedValue({});

      // Mock bcrypt comparison - need to hash the password first
      const hashedPassword = await service.hashPassword('password123');
      const userWithCorrectHash = { ...mockUser, passwordHash: hashedPassword };
      usersService.findByEmail.mockResolvedValue(userWithCorrectHash);

      const result = await service.login({
        email: 'test@example.com',
        password: 'password123',
      });

      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
      expect(jwtService.sign).toHaveBeenCalledWith({
        sub: userWithCorrectHash.id,
        email: userWithCorrectHash.email,
      });
    });

    it('throws UnauthorizedException for invalid credentials', async () => {
      usersService.findByEmail.mockResolvedValue(null);

      await expect(
        service.login({
          email: 'test@example.com',
          password: 'wrongpassword',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('throws UnauthorizedException for unverified email', async () => {
      const hashedPassword = await service.hashPassword('password123');
      const unverifiedUser = {
        ...mockUnverifiedUser,
        passwordHash: hashedPassword,
      };
      usersService.findByEmail.mockResolvedValue(unverifiedUser);

      await expect(
        service.login({
          email: 'test@example.com',
          password: 'password123',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('refreshTokens()', () => {
    it('issues new tokens with valid refresh token', async () => {
      const authRecord = {
        id: 'auth-123',
        userId: mockUser.id,
        refreshToken: 'valid-refresh-token',
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        user: mockUser,
      };
      prisma.auth.findFirst.mockResolvedValue(authRecord);
      prisma.auth.delete.mockResolvedValue({});
      prisma.auth.upsert.mockResolvedValue({});

      const result = await service.refreshTokens('valid-refresh-token');

      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
      expect(prisma.auth.delete).toHaveBeenCalledWith({
        where: { id: authRecord.id },
      });
    });

    it('throws UnauthorizedException for invalid refresh token', async () => {
      prisma.auth.findFirst.mockResolvedValue(null);

      await expect(
        service.refreshTokens('invalid-refresh-token'),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('throws UnauthorizedException for expired refresh token', async () => {
      const expiredAuth = {
        id: 'auth-123',
        userId: mockUser.id,
        refreshToken: 'expired-token',
        expiresAt: new Date(Date.now() - 1000),
        user: mockUser,
      };
      prisma.auth.findFirst.mockResolvedValue(expiredAuth);
      prisma.auth.delete.mockResolvedValue({});

      await expect(service.refreshTokens('expired-token')).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('forgotPassword()', () => {
    it('generates reset token for existing user', async () => {
      usersService.findByEmail.mockResolvedValue(mockUser);
      usersService.setResetToken.mockResolvedValue({});

      const result = await service.forgotPassword('test@example.com');

      expect(result.message).toContain('password reset link');
      expect(usersService.setResetToken).toHaveBeenCalledWith(
        mockUser.id,
        expect.any(String),
        expect.any(Date),
      );
    });

    it('returns same message for non-existing user (no enumeration)', async () => {
      usersService.findByEmail.mockResolvedValue(null);

      const result = await service.forgotPassword('nonexistent@example.com');

      expect(result.message).toContain('password reset link');
      expect(usersService.setResetToken).not.toHaveBeenCalled();
    });
  });

  describe('resetPassword()', () => {
    it('resets password with valid token', async () => {
      const userWithResetToken = {
        ...mockUser,
        resetToken: 'valid-reset-token',
        resetTokenExpiresAt: new Date(Date.now() + 60 * 60 * 1000),
      };
      usersService.findByResetToken.mockResolvedValue(userWithResetToken);
      usersService.updatePassword.mockResolvedValue({});
      prisma.auth.deleteMany.mockResolvedValue({});

      const result = await service.resetPassword(
        'valid-reset-token',
        'newpassword123',
      );

      expect(result.message).toBe('Password reset successfully');
      expect(usersService.updatePassword).toHaveBeenCalledWith(
        userWithResetToken.id,
        expect.any(String),
      );
      expect(prisma.auth.deleteMany).toHaveBeenCalledWith({
        where: { userId: userWithResetToken.id },
      });
    });

    it('throws BadRequestException for invalid token', async () => {
      usersService.findByResetToken.mockResolvedValue(null);

      await expect(
        service.resetPassword('invalid-token', 'newpassword'),
      ).rejects.toThrow(BadRequestException);
    });

    it('throws BadRequestException for expired token', async () => {
      const expiredUser = {
        ...mockUser,
        resetToken: 'expired-token',
        resetTokenExpiresAt: new Date(Date.now() - 1000),
      };
      usersService.findByResetToken.mockResolvedValue(expiredUser);

      await expect(
        service.resetPassword('expired-token', 'newpassword'),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('hashPassword() and comparePasswords()', () => {
    it('hashes password correctly', async () => {
      const password = 'testpassword123';
      const hash = await service.hashPassword(password);

      expect(hash).not.toBe(password);
      expect(hash).toMatch(/^\$2[ab]\$\d+\$/);
    });

    it('compares passwords correctly', async () => {
      const password = 'testpassword123';
      const hash = await service.hashPassword(password);

      const isValid = await service.comparePasswords(password, hash);
      const isInvalid = await service.comparePasswords('wrongpassword', hash);

      expect(isValid).toBe(true);
      expect(isInvalid).toBe(false);
    });
  });
});
