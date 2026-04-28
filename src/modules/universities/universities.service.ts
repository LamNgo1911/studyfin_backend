import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../providers/prisma.service';

@Injectable()
export class UniversitiesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: Record<string, any> = {}) {
    const size = Number(query.size ?? 20);
    const page = Number(query.page ?? 0);

    const [total, rows] = await this.prisma.$transaction([
      this.prisma.university.count(),
      this.prisma.university.findMany({
        skip: page * size,
        take: size,
        include: { locations: true },
      }),
    ]);

    return {
      total,
      page,
      size,
      hits: rows.map((row) => this.mapUniversity(row)),
    };
  }

  async findOne(oid: string, _lng?: string) {
    const university = await this.prisma.university.findUnique({
      where: { oid },
      include: { locations: true },
    });
    if (!university) throw new NotFoundException(`University not found: ${oid}`);
    return this.mapDetailedUniversity(university);
  }

  async findPrograms(oid: string, query: Record<string, any> = {}) {
    const size = Number(query.size ?? 20);
    const page = Number(query.page ?? 0);

    // Resolve university id from OID (needed for join filter)
    const university = await this.prisma.university.findUnique({
      where: { oid },
      select: { id: true },
    });
    if (!university) throw new NotFoundException(`University not found: ${oid}`);

    const [total, rows] = await this.prisma.$transaction([
      this.prisma.program.count({
        where: { universities: { some: { universityId: university.id } } },
      }),
      this.prisma.program.findMany({
        where: { universities: { some: { universityId: university.id } } },
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

  private mapUniversity(row: any) {
    return {
      oid: row.oid,
      name: row.name,
      description: row.description ?? null,
      logoUrl: row.logoUrl ?? null,
      type: row.type ?? null,
      municipality: row.municipality ?? null,
      studentCount: row.studentCount ?? null,
      locations: (row.locations ?? []).map((loc: any) => ({
        code: loc.code,
        name: loc.name,
      })),
    };
  }

  private mapDetailedUniversity(row: any) {
    return {
      ...this.mapUniversity(row),
      website: row.website ?? null,
      email: row.email ?? null,
    };
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
}
