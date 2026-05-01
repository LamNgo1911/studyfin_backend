import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../providers/prisma.service';
import { ListTemplatesQueryDto } from './dto/list-templates-query.dto';
import { StartMockTestDto } from './dto/start-mock-test.dto';
import { SubmitAnswersDto } from './dto/submit-answers.dto';
import { MockTestHistoryQueryDto } from './dto/mock-test-history-query.dto';

@Injectable()
export class MockTestsService {
  constructor(private readonly prisma: PrismaService) {}

  async listTemplates(query: ListTemplatesQueryDto) {
    const { subject, size = 20, page = 0 } = query;

    const where = {
      isActive: true,
      ...(subject && { subject }),
    };

    const [total, templates] = await Promise.all([
      this.prisma.testTemplate.count({ where }),
      this.prisma.testTemplate.findMany({
        where,
        skip: page * size,
        take: size,
        orderBy: { createdAt: 'desc' },
        include: {
          _count: { select: { questions: true } },
        },
      }),
    ]);

    return {
      total,
      page,
      size,
      templates: templates.map((t) => ({
        id: t.id,
        title: t.title,
        description: t.description,
        subject: t.subject,
        durationMinutes: t.durationMinutes,
        questionCount: t._count.questions,
      })),
    };
  }

  async getTemplate(id: string) {
    const template = await this.prisma.testTemplate.findUnique({
      where: { id },
      include: {
        questions: {
          orderBy: { orderIndex: 'asc' },
          include: {
            options: {
              orderBy: { orderIndex: 'asc' },
              select: {
                id: true,
                label: true,
                body: true,
                orderIndex: true,
                // Intentionally omitting isCorrect
              },
            },
          },
        },
      },
    });

    if (!template) {
      throw new NotFoundException('Test template not found');
    }

    if (!template.isActive) {
      throw new NotFoundException('Test template not found');
    }

    return {
      id: template.id,
      title: template.title,
      description: template.description,
      subject: template.subject,
      durationMinutes: template.durationMinutes,
      questions: template.questions.map((q) => ({
        id: q.id,
        body: q.body,
        type: q.type,
        points: q.points,
        orderIndex: q.orderIndex,
        options: q.options.map((o) => ({
          id: o.id,
          label: o.label,
          body: o.body,
          orderIndex: o.orderIndex,
        })),
      })),
    };
  }

  async startTest(userId: string, dto: StartMockTestDto) {
    // USER-09: Check mock test access before anything else (per D-09)
    const userAccess = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { hasTestAccess: true },
    });
    if (!userAccess || !userAccess.hasTestAccess) {
      throw new ForbiddenException(
        'Mock test access is not enabled for your account',
      );
    }

    // Check template exists and is active
    const template = await this.prisma.testTemplate.findUnique({
      where: { id: dto.templateId },
      include: { _count: { select: { questions: true } } },
    });

    if (!template || !template.isActive) {
      throw new NotFoundException('Test template not found');
    }

    // Validate programId if provided
    if (dto.programId) {
      const program = await this.prisma.program.findUnique({
        where: { id: dto.programId },
      });
      if (!program) {
        throw new BadRequestException('Program not found');
      }
    }

    // Check for existing in-progress attempt for this template
    const existingAttempt = await this.prisma.mockTest.findFirst({
      where: {
        userId,
        templateId: dto.templateId,
        status: 'in_progress',
      },
    });

    if (existingAttempt) {
      throw new ConflictException(
        'You already have an in-progress attempt for this test',
      );
    }

    // Calculate max score from questions
    const maxScore = await this.prisma.question.aggregate({
      where: { templateId: dto.templateId },
      _sum: { points: true },
    });

    // Create the mock test attempt
    const mockTest = await this.prisma.mockTest.create({
      data: {
        userId,
        templateId: dto.templateId,
        programId: dto.programId,
        status: 'in_progress',
        maxScore: maxScore._sum.points ?? 0,
      },
      include: {
        template: {
          select: {
            id: true,
            title: true,
            subject: true,
            durationMinutes: true,
          },
        },
      },
    });

    return {
      id: mockTest.id,
      templateId: mockTest.templateId,
      template: mockTest.template,
      status: mockTest.status,
      maxScore: mockTest.maxScore,
      createdAt: mockTest.createdAt,
    };
  }

  async submitAnswers(userId: string, testId: string, dto: SubmitAnswersDto) {
    // Check mock test access before anything else
    const userAccess = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { hasTestAccess: true },
    });
    if (!userAccess || !userAccess.hasTestAccess) {
      throw new ForbiddenException(
        'Mock test access is not enabled for your account',
      );
    }

    // Get the mock test with template and questions
    const mockTest = await this.prisma.mockTest.findUnique({
      where: { id: testId },
      include: {
        template: {
          include: {
            questions: {
              include: {
                options: true,
              },
            },
          },
        },
      },
    });

    if (!mockTest) {
      throw new NotFoundException('Test attempt not found');
    }

    if (mockTest.userId !== userId) {
      throw new ForbiddenException('You do not have access to this test');
    }

    if (mockTest.status === 'completed') {
      throw new BadRequestException('This test has already been submitted');
    }

    // Build a map of questionId -> question for grading
    const questionMap = new Map(
      mockTest.template.questions.map((q) => [q.id, q]),
    );

    // Validate and grade answers
    let score = 0;
    const answersToCreate: {
      questionId: string;
      selectedOptionId: string | null;
      isCorrect: boolean;
      pointsAwarded: number;
    }[] = [];

    // Deduplicate answers by questionId to prevent DB unique constraint violation
    const seenQuestions = new Set<string>();
    for (const answer of dto.answers) {
      if (seenQuestions.has(answer.questionId)) {
        throw new BadRequestException(
          `Duplicate answer submitted for question ${answer.questionId}`,
        );
      }
      seenQuestions.add(answer.questionId);

      const question = questionMap.get(answer.questionId);
      if (!question) {
        throw new BadRequestException(
          `Question ${answer.questionId} does not belong to this test`,
        );
      }

      let isCorrect = false;
      let pointsAwarded = 0;

      if (answer.selectedOptionId) {
        const selectedOption = question.options.find(
          (o) => o.id === answer.selectedOptionId,
        );
        if (!selectedOption) {
          throw new BadRequestException(
            `Option ${answer.selectedOptionId} does not belong to question ${answer.questionId}`,
          );
        }
        isCorrect = selectedOption.isCorrect;
        pointsAwarded = isCorrect ? question.points : 0;
      }

      score += pointsAwarded;

      answersToCreate.push({
        questionId: answer.questionId,
        selectedOptionId: answer.selectedOptionId ?? null,
        isCorrect,
        pointsAwarded,
      });
    }

    // Save answers and update mock test atomically
    await this.prisma.$transaction(async (tx) => {
      // Create all answers
      for (const answerData of answersToCreate) {
        await tx.mockTestAnswer.create({
          data: {
            mockTestId: testId,
            ...answerData,
          },
        });
      }

      // Update the mock test
      await tx.mockTest.update({
        where: { id: testId },
        data: {
          score,
          timeTakenMinutes: dto.timeTakenMinutes,
          status: 'completed',
          completedAt: new Date(),
        },
      });
    });

    // Return graded result
    const result = await this.prisma.mockTest.findUnique({
      where: { id: testId },
      include: {
        template: {
          select: {
            id: true,
            title: true,
            subject: true,
          },
        },
        answers: {
          include: {
            question: {
              include: {
                options: true,
              },
            },
            selectedOption: true,
          },
          orderBy: {
            question: { orderIndex: 'asc' },
          },
        },
      },
    });

    if (!result) {
      throw new NotFoundException('Test attempt not found');
    }

    const resultScore = result.score ?? 0;
    const resultMaxScore = result.maxScore ?? 0;

    return {
      id: result.id,
      template: result.template,
      score: resultScore,
      maxScore: resultMaxScore,
      percentage:
        resultMaxScore > 0
          ? Math.round((resultScore / resultMaxScore) * 100)
          : 0,
      timeTakenMinutes: result.timeTakenMinutes,
      completedAt: result.completedAt,
      answers: result.answers.map((a) => {
        const correctOption = a.question.options.find((o) => o.isCorrect);
        return {
          questionId: a.questionId,
          questionBody: a.question.body,
          selectedOptionId: a.selectedOptionId,
          selectedOptionLabel: a.selectedOption?.label ?? null,
          correctOptionId: correctOption?.id ?? null,
          correctOptionLabel: correctOption?.label ?? null,
          isCorrect: a.isCorrect,
          pointsAwarded: a.pointsAwarded,
          maxPoints: a.question.points,
          explanation: a.question.explanation,
        };
      }),
    };
  }

  async getHistory(userId: string, query: MockTestHistoryQueryDto) {
    // Check mock test access before anything else
    const userAccess = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { hasTestAccess: true },
    });
    if (!userAccess || !userAccess.hasTestAccess) {
      throw new ForbiddenException(
        'Mock test access is not enabled for your account',
      );
    }

    const { status, size = 20, page = 0 } = query;

    const where = {
      userId,
      ...(status && { status }),
    };

    const [total, tests] = await Promise.all([
      this.prisma.mockTest.count({ where }),
      this.prisma.mockTest.findMany({
        where,
        skip: page * size,
        take: size,
        orderBy: { createdAt: 'desc' },
        include: {
          template: {
            select: {
              id: true,
              title: true,
              subject: true,
              durationMinutes: true,
            },
          },
          program: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      }),
    ]);

    return {
      total,
      page,
      size,
      tests: tests.map((t) => {
        const tScore = t.score ?? 0;
        const tMaxScore = t.maxScore ?? 0;
        return {
          id: t.id,
          template: t.template,
          program: t.program,
          score: t.score,
          maxScore: t.maxScore,
          percentage:
            t.status === 'completed' && tMaxScore > 0
              ? Math.round((tScore / tMaxScore) * 100)
              : null,
          timeTakenMinutes: t.timeTakenMinutes,
          status: t.status,
          completedAt: t.completedAt,
          createdAt: t.createdAt,
        };
      }),
    };
  }

  async getAttempt(userId: string, testId: string) {
    const mockTest = await this.prisma.mockTest.findUnique({
      where: { id: testId },
      include: {
        template: {
          include: {
            questions: {
              orderBy: { orderIndex: 'asc' },
              include: {
                options: {
                  orderBy: { orderIndex: 'asc' },
                },
              },
            },
          },
        },
        program: {
          select: {
            id: true,
            name: true,
          },
        },
        answers: {
          include: {
            selectedOption: true,
          },
        },
      },
    });

    if (!mockTest) {
      throw new NotFoundException('Test attempt not found');
    }

    if (mockTest.userId !== userId) {
      throw new ForbiddenException('You do not have access to this test');
    }

    // For in-progress tests, return questions without correct answers
    if (mockTest.status === 'in_progress') {
      return {
        id: mockTest.id,
        template: {
          id: mockTest.template.id,
          title: mockTest.template.title,
          subject: mockTest.template.subject,
          durationMinutes: mockTest.template.durationMinutes,
        },
        program: mockTest.program,
        status: mockTest.status,
        maxScore: mockTest.maxScore,
        createdAt: mockTest.createdAt,
        questions: mockTest.template.questions.map((q) => ({
          id: q.id,
          body: q.body,
          type: q.type,
          points: q.points,
          orderIndex: q.orderIndex,
          options: q.options.map((o) => ({
            id: o.id,
            label: o.label,
            body: o.body,
            orderIndex: o.orderIndex,
          })),
        })),
      };
    }

    // For completed tests, return full results with correct answers
    const answerMap = new Map(mockTest.answers.map((a) => [a.questionId, a]));
    const mtScore = mockTest.score ?? 0;
    const mtMaxScore = mockTest.maxScore ?? 0;

    return {
      id: mockTest.id,
      template: {
        id: mockTest.template.id,
        title: mockTest.template.title,
        subject: mockTest.template.subject,
        durationMinutes: mockTest.template.durationMinutes,
      },
      program: mockTest.program,
      score: mockTest.score,
      maxScore: mockTest.maxScore,
      percentage: mtMaxScore > 0 ? Math.round((mtScore / mtMaxScore) * 100) : 0,
      timeTakenMinutes: mockTest.timeTakenMinutes,
      status: mockTest.status,
      completedAt: mockTest.completedAt,
      createdAt: mockTest.createdAt,
      questions: mockTest.template.questions.map((q) => {
        const answer = answerMap.get(q.id);
        const correctOption = q.options.find((o) => o.isCorrect);
        return {
          id: q.id,
          body: q.body,
          type: q.type,
          points: q.points,
          orderIndex: q.orderIndex,
          explanation: q.explanation,
          options: q.options.map((o) => ({
            id: o.id,
            label: o.label,
            body: o.body,
            orderIndex: o.orderIndex,
            isCorrect: o.isCorrect,
          })),
          userAnswer: answer
            ? {
                selectedOptionId: answer.selectedOptionId,
                selectedOptionLabel: answer.selectedOption?.label ?? null,
                isCorrect: answer.isCorrect,
                pointsAwarded: answer.pointsAwarded,
              }
            : null,
          correctOptionId: correctOption?.id ?? null,
          correctOptionLabel: correctOption?.label ?? null,
        };
      }),
    };
  }
}
