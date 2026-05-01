import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../providers/prisma.service';
import { User } from '../../../generated/prisma';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UpdateSavedProgramDto } from './dto/update-saved-program.dto';
import { ListSavedProgramsQueryDto } from './dto/list-saved-programs-query.dto';

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

  private readonly PROFILE_SELECT = {
    id: true,
    email: true,
    firstName: true,
    lastName: true,
    role: true,
    hasTestAccess: true,
    emailVerifiedAt: true,
    createdAt: true,
    _count: { select: { savedPrograms: true } },
  } as const;

  private mapProfile(user: {
    id: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
    role: string;
    hasTestAccess: boolean;
    emailVerifiedAt: Date | null;
    createdAt: Date;
    _count: { savedPrograms: number };
  }) {
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      hasTestAccess: user.hasTestAccess,
      emailVerifiedAt: user.emailVerifiedAt,
      createdAt: user.createdAt,
      savedProgramCount: user._count.savedPrograms,
    };
  }

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: this.PROFILE_SELECT,
    });
    if (!user) throw new NotFoundException('User not found');
    return this.mapProfile(user);
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    // Reject empty update: at least one field must be provided
    if (dto.firstName === undefined && dto.lastName === undefined) {
      throw new BadRequestException(
        'At least one field (firstName, lastName) must be provided',
      );
    }

    try {
      const user = await this.prisma.user.update({
        where: { id: userId },
        data: {
          ...(dto.firstName !== undefined && { firstName: dto.firstName }),
          ...(dto.lastName !== undefined && { lastName: dto.lastName }),
        },
        select: this.PROFILE_SELECT,
      });
      return this.mapProfile(user);
    } catch (err: any) {
      // P2025: record not found
      if (err?.code === 'P2025') {
        throw new NotFoundException('User not found');
      }
      throw err;
    }
  }

  async saveProgram(userId: string, programId: string) {
    // Verify program exists
    const program = await this.prisma.program.findUnique({
      where: { id: programId },
    });
    if (!program) throw new NotFoundException('Program not found');

    // Create with default status per D-04
    try {
      return await this.prisma.userProgram.create({
        data: { userId, programId, status: 'interested' },
        select: {
          id: true,
          programId: true,
          status: true,
          createdAt: true,
          program: {
            select: { name: true, oid: true, type: true, fieldOfStudy: true },
          },
        },
      });
    } catch (err: any) {
      // P2002: unique constraint violation (already saved)
      if (err?.code === 'P2002') {
        throw new ConflictException('Program already saved');
      }
      throw err;
    }
  }

  async updateSavedProgramStatus(
    userId: string,
    programId: string,
    dto: UpdateSavedProgramDto,
  ) {
    const existing = await this.prisma.userProgram.findUnique({
      where: { userId_programId: { userId, programId } },
    });
    if (!existing) throw new NotFoundException('Saved program not found');

    return this.prisma.userProgram.update({
      where: { userId_programId: { userId, programId } },
      data: { status: dto.status },
      select: {
        id: true,
        programId: true,
        status: true,
        createdAt: true,
        program: {
          select: { name: true, oid: true, type: true, fieldOfStudy: true },
        },
      },
    });
  }

  async removeSavedProgram(userId: string, programId: string) {
    const existing = await this.prisma.userProgram.findUnique({
      where: { userId_programId: { userId, programId } },
    });
    if (!existing) throw new NotFoundException('Saved program not found');

    await this.prisma.userProgram.delete({
      where: { userId_programId: { userId, programId } },
    });
  }

  async listSavedPrograms(userId: string, query: ListSavedProgramsQueryDto) {
    const { status, page = 0, size = 20 } = query;

    const where = {
      userId,
      ...(status && { status }),
    };

    const [total, programs] = await Promise.all([
      this.prisma.userProgram.count({ where }),
      this.prisma.userProgram.findMany({
        where,
        skip: page * size,
        take: size,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          programId: true,
          status: true,
          createdAt: true,
          program: {
            select: { name: true, oid: true, type: true, fieldOfStudy: true },
          },
        },
      }),
    ]);

    return { total, page, size, programs };
  }
}
