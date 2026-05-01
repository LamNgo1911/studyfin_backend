import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../providers/prisma.service';
import { ListUsersQueryDto } from './dto/list-users-query.dto';
import { ToggleMockTestAccessDto } from './dto/toggle-mock-test-access.dto';

const USER_ADMIN_SELECT = {
  id: true,
  email: true,
  firstName: true,
  lastName: true,
  role: true,
  hasTestAccess: true,
  emailVerifiedAt: true,
  createdAt: true,
} as const;

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  async listUsers(query: ListUsersQueryDto) {
    const { email, page = 0, size = 20 } = query;

    const where = email
      ? { email: { contains: email, mode: 'insensitive' as const } }
      : {};

    const [total, users] = await Promise.all([
      this.prisma.user.count({ where }),
      this.prisma.user.findMany({
        where,
        skip: page * size,
        take: size,
        orderBy: { createdAt: 'desc' },
        select: USER_ADMIN_SELECT,
      }),
    ]);

    return { total, page, size, users };
  }

  async toggleMockTestAccess(id: string, dto: ToggleMockTestAccessDto) {
    try {
      return await this.prisma.user.update({
        where: { id },
        data: { hasTestAccess: dto.hasTestAccess },
        select: USER_ADMIN_SELECT,
      });
    } catch (err: any) {
      if (err?.code === 'P2025') {
        throw new NotFoundException('User not found');
      }
      throw err;
    }
  }
}
