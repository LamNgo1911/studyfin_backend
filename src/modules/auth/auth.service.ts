import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { UsersService } from '../users/users.service';
import { PrismaService } from '../../providers/prisma.service';
import { RegisterDto, LoginDto } from './dto';
import { User } from '../../../generated/prisma';

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export interface JwtPayload {
  sub: string;
  email: string;
}

@Injectable()
export class AuthService {
  private readonly SALT_ROUNDS = 10;
  private readonly VERIFY_TOKEN_EXPIRY_HOURS = 24;
  private readonly RESET_TOKEN_EXPIRY_HOURS = 1;

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  async register(
    dto: RegisterDto,
  ): Promise<{ user: Omit<User, 'passwordHash'> }> {
    const existingUser = await this.usersService.findByEmail(dto.email);
    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    const passwordHash = await this.hashPassword(dto.password);
    const emailVerifyToken = this.generateToken();
    const emailVerifyExpiresAt = new Date();
    emailVerifyExpiresAt.setHours(
      emailVerifyExpiresAt.getHours() + this.VERIFY_TOKEN_EXPIRY_HOURS,
    );

    const user = await this.usersService.create({
      email: dto.email,
      passwordHash,
      firstName: dto.firstName,
      lastName: dto.lastName,
      emailVerifyToken,
      emailVerifyExpiresAt,
    });

    // Log verification token (in production, this would be sent via email)
    console.log(
      `[Auth] Email verification token for ${user.email}: ${emailVerifyToken}`,
    );

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash: _, ...userWithoutPassword } = user;
    return { user: userWithoutPassword };
  }

  async verifyEmail(token: string): Promise<{ message: string }> {
    const user = await this.usersService.findByEmailVerifyToken(token);
    if (!user) {
      throw new BadRequestException('Invalid verification token');
    }

    if (user.emailVerifyExpiresAt && user.emailVerifyExpiresAt < new Date()) {
      throw new BadRequestException('Verification token has expired');
    }

    await this.usersService.updateEmailVerification(user.id, {
      emailVerifiedAt: new Date(),
      emailVerifyToken: null,
    });

    return { message: 'Email verified successfully' };
  }

  async login(dto: LoginDto): Promise<TokenPair> {
    const user = await this.validateUser(dto.email, dto.password);
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    if (!user.emailVerifiedAt) {
      throw new UnauthorizedException(
        'Please verify your email before logging in',
      );
    }

    return this.issueTokens(user);
  }

  async refreshTokens(refreshToken: string): Promise<TokenPair> {
    const auth = await this.prisma.auth.findFirst({
      where: { refreshToken },
      include: { user: true },
    });

    if (!auth) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    if (auth.expiresAt < new Date()) {
      await this.prisma.auth.delete({ where: { id: auth.id } });
      throw new UnauthorizedException('Refresh token has expired');
    }

    // Rotate the refresh token
    await this.prisma.auth.delete({ where: { id: auth.id } });

    return this.issueTokens(auth.user);
  }

  async forgotPassword(email: string): Promise<{ message: string }> {
    const user = await this.usersService.findByEmail(email);

    // Always return success to prevent email enumeration
    if (!user) {
      return {
        message:
          'If an account exists with this email, a password reset link has been sent',
      };
    }

    const resetToken = this.generateToken();
    const resetTokenExpiresAt = new Date();
    resetTokenExpiresAt.setHours(
      resetTokenExpiresAt.getHours() + this.RESET_TOKEN_EXPIRY_HOURS,
    );

    await this.usersService.setResetToken(
      user.id,
      resetToken,
      resetTokenExpiresAt,
    );

    // Log reset token (in production, this would be sent via email)
    console.log(`[Auth] Password reset token for ${user.email}: ${resetToken}`);

    return {
      message:
        'If an account exists with this email, a password reset link has been sent',
    };
  }

  async resetPassword(
    token: string,
    newPassword: string,
  ): Promise<{ message: string }> {
    const user = await this.usersService.findByResetToken(token);
    if (!user) {
      throw new BadRequestException('Invalid reset token');
    }

    if (user.resetTokenExpiresAt && user.resetTokenExpiresAt < new Date()) {
      throw new BadRequestException('Reset token has expired');
    }

    const passwordHash = await this.hashPassword(newPassword);
    await this.usersService.updatePassword(user.id, passwordHash);

    // Invalidate all existing refresh tokens for this user
    await this.prisma.auth.deleteMany({ where: { userId: user.id } });

    return { message: 'Password reset successfully' };
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      return null;
    }

    const isPasswordValid = await this.comparePasswords(
      password,
      user.passwordHash,
    );
    if (!isPasswordValid) {
      return null;
    }

    return user;
  }

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, this.SALT_ROUNDS);
  }

  async comparePasswords(plain: string, hash: string): Promise<boolean> {
    return bcrypt.compare(plain, hash);
  }

  private generateToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  private async issueTokens(user: User): Promise<TokenPair> {
    const payload: JwtPayload = { sub: user.id, email: user.email };

    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.generateToken();

    // Parse refresh token expiration from env
    const refreshExpiration = process.env.JWT_REFRESH_EXPIRATION || '7d';
    const expiresAt = this.parseExpiration(refreshExpiration);

    // Store refresh token in database
    await this.prisma.auth.upsert({
      where: { userId: user.id },
      update: { refreshToken, expiresAt },
      create: { userId: user.id, refreshToken, expiresAt },
    });

    return { accessToken, refreshToken };
  }

  private parseExpiration(expiration: string): Date {
    const date = new Date();
    const match = expiration.match(/^(\d+)([smhd])$/);

    if (!match) {
      // Default to 7 days if invalid format
      date.setDate(date.getDate() + 7);
      return date;
    }

    const value = parseInt(match[1], 10);
    const unit = match[2];

    switch (unit) {
      case 's':
        date.setSeconds(date.getSeconds() + value);
        break;
      case 'm':
        date.setMinutes(date.getMinutes() + value);
        break;
      case 'h':
        date.setHours(date.getHours() + value);
        break;
      case 'd':
        date.setDate(date.getDate() + value);
        break;
    }

    return date;
  }
}
