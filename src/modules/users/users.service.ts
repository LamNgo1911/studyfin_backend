import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../providers/prisma.service';
import { User } from '../../../generated/prisma';

export interface CreateUserInput {
  email: string;
  passwordHash: string;
  firstName?: string;
  lastName?: string;
  emailVerifyToken?: string;
  emailVerifyExpiresAt?: Date;
}

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async create(input: CreateUserInput): Promise<User> {
    return this.prisma.user.create({
      data: {
        email: input.email,
        passwordHash: input.passwordHash,
        firstName: input.firstName,
        lastName: input.lastName,
        emailVerifyToken: input.emailVerifyToken,
        emailVerifyExpiresAt: input.emailVerifyExpiresAt,
      },
    });
  }

  async updateEmailVerification(
    userId: string,
    data: { emailVerifiedAt: Date; emailVerifyToken: null },
  ): Promise<User> {
    return this.prisma.user.update({
      where: { id: userId },
      data,
    });
  }

  async findByEmailVerifyToken(token: string): Promise<User | null> {
    return this.prisma.user.findFirst({
      where: { emailVerifyToken: token },
    });
  }

  async findByResetToken(token: string): Promise<User | null> {
    return this.prisma.user.findFirst({
      where: { resetToken: token },
    });
  }

  async setResetToken(
    userId: string,
    resetToken: string,
    resetTokenExpiresAt: Date,
  ): Promise<User> {
    return this.prisma.user.update({
      where: { id: userId },
      data: { resetToken, resetTokenExpiresAt },
    });
  }

  async updatePassword(userId: string, passwordHash: string): Promise<User> {
    return this.prisma.user.update({
      where: { id: userId },
      data: {
        passwordHash,
        resetToken: null,
        resetTokenExpiresAt: null,
      },
    });
  }
}
