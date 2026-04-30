import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../providers/prisma.service';

@Injectable()
export class ProgramsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: Record<string, any> = {}) {
    const rawSize = Number(query.size);
    const rawPage = Number(query.page);
    const size = Number.isFinite(rawSize) && rawSize > 0 ? Math.floor(rawSize) : 20;
    const page = Number.isFinite(rawPage) && rawPage >= 0 ? Math.floor(rawPage) : 0;

    const [total, rows] = await this.prisma.$transaction([
      this.prisma.program.count(),
      this.prisma.program.findMany({
        skip: page * size,
        take: size,
        include: {
          universities: {
            include: { university: { select: { oid: true, name: true } } },
          },
        },
      }),
    ]);

    return {
      total,
      page,
      size,
      hits: rows.map((row) => this.mapProgram(row)),
    };
  }

  async findOne(oid: string, _lng?: string) {
    const program = await this.prisma.program.findUnique({
      where: { oid },
      include: {
        universities: {
          include: { university: { select: { oid: true, name: true } } },
        },
        _count: { select: { guidanceSections: true } },
      },
    });
    if (!program) throw new NotFoundException(`Program not found: ${oid}`);
    return this.mapProgramDetail(program);
  }

  private mapProgram(row: any) {
    return {
      oid: row.oid,
      name: row.name,
      type: row.type,
      isDegree: row.isDegree,
      imageUrl: row.imageUrl ?? null,
      fieldOfStudy: row.fieldOfStudy ?? null,
      creditsAmount: row.creditsAmount ?? null,
      creditsUnit: row.creditsUnit ?? null,
      teachingLanguages: row.teachingLanguages ?? [],
      providers: (row.universities ?? []).map((pu: any) => ({
        oid: pu.university.oid,
        name: pu.university.name,
      })),
    };
  }

  private mapProgramDetail(row: any) {
    return {
      oid: row.oid,
      name: row.name,
      description: row.description ?? null,
      type: row.type,
      typePath: row.typePath ?? null,
      isDegree: row.isDegree,
      imageUrl: row.imageUrl ?? null,
      creditsAmount: row.creditsAmount ?? null,
      creditsUnit: row.creditsUnit ?? null,
      eqfLevel: row.eqfLevel ?? null,
      nqfLevel: row.nqfLevel ?? null,
      fieldOfStudy: row.fieldOfStudy ?? null,
      degreeTitles: row.degreeTitles ?? [],
      teachingLanguages: row.teachingLanguages ?? [],
      implementations: row.implementations ?? null,
      hasGuidance: (row._count?.guidanceSections ?? 0) > 0,
      universities: (row.universities ?? []).map((pu: any) => ({
        oid: pu.university.oid,
        name: pu.university.name,
      })),
    };
  }
}
