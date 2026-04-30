import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../providers/prisma.service';
import { CreateGuidanceDto } from './dto/create-guidance.dto';
import { UpdateGuidanceDto } from './dto/update-guidance.dto';

@Injectable()
export class GuidanceService {
  constructor(private readonly prisma: PrismaService) {}

  async findByProgramOid(programOid: string) {
    const program = await this.prisma.program.findUnique({
      where: { oid: programOid },
      select: { oid: true },
    });
    if (!program)
      throw new NotFoundException(`Program not found: ${programOid}`);

    const sections = await this.prisma.guidanceSection.findMany({
      where: { programOid },
      orderBy: { order: 'asc' },
    });
    return sections.map((s) => this.mapSection(s));
  }

  async upsert(programOid: string, dto: CreateGuidanceDto) {
    const program = await this.prisma.program.findUnique({
      where: { oid: programOid },
      select: { oid: true },
    });
    if (!program)
      throw new NotFoundException(`Program not found: ${programOid}`);

    const sections = await this.prisma.$transaction(async (tx) => {
      await tx.guidanceSection.deleteMany({ where: { programOid } });
      await tx.guidanceSection.createMany({
        data: dto.sections.map((s) => ({
          programOid,
          key: s.key,
          title: s.title,
          body: s.body,
          order: s.order,
        })),
      });
      return tx.guidanceSection.findMany({
        where: { programOid },
        orderBy: { order: 'asc' },
      });
    });

    return sections.map((s) => this.mapSection(s));
  }

  async patch(programOid: string, dto: UpdateGuidanceDto) {
    const program = await this.prisma.program.findUnique({
      where: { oid: programOid },
      select: { oid: true },
    });
    if (!program)
      throw new NotFoundException(`Program not found: ${programOid}`);

    if (!dto.sections || dto.sections.length === 0) {
      throw new BadRequestException(
        'sections must contain at least one entry',
      );
    }

    await this.prisma.$transaction(
      dto.sections.map((s) =>
        this.prisma.guidanceSection.upsert({
          where: { programOid_key: { programOid, key: s.key } },
          update: {
            title: s.title,
            body: s.body,
            order: s.order,
          },
          create: {
            programOid,
            key: s.key,
            title: s.title,
            body: s.body,
            order: s.order,
          },
        }),
      ),
    );

    const sections = await this.prisma.guidanceSection.findMany({
      where: { programOid },
      orderBy: { order: 'asc' },
    });
    return sections.map((s) => this.mapSection(s));
  }

  private mapSection(s: {
    key: string;
    title: string;
    body: string;
    order: number;
  }) {
    return {
      key: s.key,
      title: s.title,
      body: s.body,
      order: s.order,
    };
  }
}
