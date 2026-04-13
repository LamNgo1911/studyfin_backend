import { Test, TestingModule } from '@nestjs/testing';
import { MockTestsService } from './mock-tests.service';
import { PrismaService } from '../../providers/prisma.service';
import {
  NotFoundException,
  ConflictException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';

const mockTemplate = {
  id: 'template-1',
  title: 'Math Test',
  description: 'A math test',
  subject: 'math',
  durationMinutes: 30,
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockQuestion = {
  id: 'question-1',
  templateId: 'template-1',
  body: 'What is 2+2?',
  type: 'multiple_choice',
  points: 1,
  orderIndex: 0,
  explanation: 'Basic addition',
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockOptions = [
  {
    id: 'opt-a',
    questionId: 'question-1',
    label: 'A',
    body: '3',
    isCorrect: false,
    orderIndex: 0,
    createdAt: new Date(),
  },
  {
    id: 'opt-b',
    questionId: 'question-1',
    label: 'B',
    body: '4',
    isCorrect: true,
    orderIndex: 1,
    createdAt: new Date(),
  },
  {
    id: 'opt-c',
    questionId: 'question-1',
    label: 'C',
    body: '5',
    isCorrect: false,
    orderIndex: 2,
    createdAt: new Date(),
  },
];

const mockMockTest = {
  id: 'test-1',
  userId: 'user-1',
  templateId: 'template-1',
  programId: null,
  score: null,
  maxScore: 1,
  timeTakenMinutes: null,
  status: 'in_progress',
  completedAt: null,
  createdAt: new Date(),
};

describe('MockTestsService', () => {
  let service: MockTestsService;
  let prisma: {
    testTemplate: {
      count: jest.Mock;
      findMany: jest.Mock;
      findUnique: jest.Mock;
    };
    question: {
      aggregate: jest.Mock;
    };
    program: {
      findUnique: jest.Mock;
    };
    mockTest: {
      count: jest.Mock;
      findFirst: jest.Mock;
      findUnique: jest.Mock;
      findMany: jest.Mock;
      create: jest.Mock;
      update: jest.Mock;
    };
    mockTestAnswer: {
      create: jest.Mock;
    };
    $transaction: jest.Mock;
  };

  beforeEach(async () => {
    prisma = {
      testTemplate: {
        count: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
      },
      question: {
        aggregate: jest.fn(),
      },
      program: {
        findUnique: jest.fn(),
      },
      mockTest: {
        count: jest.fn(),
        findFirst: jest.fn(),
        findUnique: jest.fn(),
        findMany: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
      },
      mockTestAnswer: {
        create: jest.fn(),
      },
      $transaction: jest.fn((fn: (tx: typeof prisma) => Promise<void>) =>
        fn(prisma),
      ),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MockTestsService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get(MockTestsService);
  });

  describe('listTemplates()', () => {
    it('returns paginated list of active templates with question counts', async () => {
      prisma.testTemplate.count.mockResolvedValue(1);
      prisma.testTemplate.findMany.mockResolvedValue([
        { ...mockTemplate, _count: { questions: 10 } },
      ]);

      const result = await service.listTemplates({ size: 20, page: 0 });

      expect(result.total).toBe(1);
      expect(result.page).toBe(0);
      expect(result.size).toBe(20);
      expect(result.templates).toHaveLength(1);
      expect(result.templates[0].questionCount).toBe(10);
      expect(result.templates[0].title).toBe('Math Test');
    });

    it('filters by subject when provided', async () => {
      prisma.testTemplate.count.mockResolvedValue(0);
      prisma.testTemplate.findMany.mockResolvedValue([]);

      await service.listTemplates({ subject: 'math', size: 20, page: 0 });

      expect(prisma.testTemplate.count).toHaveBeenCalledWith({
        where: { isActive: true, subject: 'math' },
      });
    });
  });

  describe('getTemplate()', () => {
    it('returns template with questions but without correct answers', async () => {
      prisma.testTemplate.findUnique.mockResolvedValue({
        ...mockTemplate,
        questions: [{ ...mockQuestion, options: mockOptions }],
      });

      const result = await service.getTemplate('template-1');

      expect(result.id).toBe('template-1');
      expect(result.questions).toHaveLength(1);
      expect(result.questions[0].options).toHaveLength(3);
      // Verify isCorrect is not exposed
      expect(result.questions[0].options[0]).not.toHaveProperty('isCorrect');
    });

    it('throws NotFoundException for non-existent template', async () => {
      prisma.testTemplate.findUnique.mockResolvedValue(null);

      await expect(service.getTemplate('invalid')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('throws NotFoundException for inactive template', async () => {
      prisma.testTemplate.findUnique.mockResolvedValue({
        ...mockTemplate,
        isActive: false,
        questions: [],
      });

      await expect(service.getTemplate('template-1')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('startTest()', () => {
    it('creates a new test attempt', async () => {
      prisma.testTemplate.findUnique.mockResolvedValue({
        ...mockTemplate,
        _count: { questions: 10 },
      });
      prisma.mockTest.findFirst.mockResolvedValue(null);
      prisma.question.aggregate.mockResolvedValue({ _sum: { points: 10 } });
      prisma.mockTest.create.mockResolvedValue({
        ...mockMockTest,
        maxScore: 10,
        template: mockTemplate,
      });

      const result = await service.startTest('user-1', {
        templateId: 'template-1',
      });

      expect(result.id).toBe('test-1');
      expect(result.status).toBe('in_progress');
      expect(result.maxScore).toBe(10);
    });

    it('throws NotFoundException for invalid template', async () => {
      prisma.testTemplate.findUnique.mockResolvedValue(null);

      await expect(
        service.startTest('user-1', { templateId: 'invalid' }),
      ).rejects.toThrow(NotFoundException);
    });

    it('throws ConflictException for duplicate in-progress test', async () => {
      prisma.testTemplate.findUnique.mockResolvedValue({
        ...mockTemplate,
        _count: { questions: 10 },
      });
      prisma.mockTest.findFirst.mockResolvedValue(mockMockTest);

      await expect(
        service.startTest('user-1', { templateId: 'template-1' }),
      ).rejects.toThrow(ConflictException);
    });

    it('validates programId when provided', async () => {
      prisma.testTemplate.findUnique.mockResolvedValue({
        ...mockTemplate,
        _count: { questions: 10 },
      });
      prisma.program.findUnique.mockResolvedValue(null);

      await expect(
        service.startTest('user-1', {
          templateId: 'template-1',
          programId: 'invalid-program',
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('submitAnswers()', () => {
    const mockTestWithTemplate = {
      ...mockMockTest,
      template: {
        ...mockTemplate,
        questions: [{ ...mockQuestion, options: mockOptions }],
      },
    };

    it('grades answers correctly and returns results', async () => {
      prisma.mockTest.findUnique
        .mockResolvedValueOnce(mockTestWithTemplate)
        .mockResolvedValueOnce({
          ...mockMockTest,
          score: 1,
          status: 'completed',
          completedAt: new Date(),
          template: { id: 'template-1', title: 'Math Test', subject: 'math' },
          answers: [
            {
              questionId: 'question-1',
              selectedOptionId: 'opt-b',
              selectedOption: { label: 'B' },
              isCorrect: true,
              pointsAwarded: 1,
              question: { ...mockQuestion, options: mockOptions },
            },
          ],
        });

      const result = await service.submitAnswers('user-1', 'test-1', {
        timeTakenMinutes: 15,
        answers: [{ questionId: 'question-1', selectedOptionId: 'opt-b' }],
      });

      expect(result.score).toBe(1);
      expect(result.maxScore).toBe(1);
      expect(result.percentage).toBe(100);
      expect(result.answers[0].isCorrect).toBe(true);
    });

    it('throws NotFoundException for non-existent test', async () => {
      prisma.mockTest.findUnique.mockResolvedValue(null);

      await expect(
        service.submitAnswers('user-1', 'invalid', { answers: [] }),
      ).rejects.toThrow(NotFoundException);
    });

    it('throws ForbiddenException for wrong user', async () => {
      prisma.mockTest.findUnique.mockResolvedValue({
        ...mockTestWithTemplate,
        userId: 'other-user',
      });

      await expect(
        service.submitAnswers('user-1', 'test-1', { answers: [] }),
      ).rejects.toThrow(ForbiddenException);
    });

    it('throws BadRequestException for already completed test', async () => {
      prisma.mockTest.findUnique.mockResolvedValue({
        ...mockTestWithTemplate,
        status: 'completed',
      });

      await expect(
        service.submitAnswers('user-1', 'test-1', { answers: [] }),
      ).rejects.toThrow(BadRequestException);
    });

    it('throws BadRequestException for invalid question', async () => {
      prisma.mockTest.findUnique.mockResolvedValue(mockTestWithTemplate);

      await expect(
        service.submitAnswers('user-1', 'test-1', {
          answers: [
            { questionId: 'invalid-question', selectedOptionId: 'opt-a' },
          ],
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('throws BadRequestException for invalid option', async () => {
      prisma.mockTest.findUnique.mockResolvedValue(mockTestWithTemplate);

      await expect(
        service.submitAnswers('user-1', 'test-1', {
          answers: [
            { questionId: 'question-1', selectedOptionId: 'invalid-option' },
          ],
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('handles unanswered questions (null selectedOptionId)', async () => {
      prisma.mockTest.findUnique
        .mockResolvedValueOnce(mockTestWithTemplate)
        .mockResolvedValueOnce({
          ...mockMockTest,
          score: 0,
          status: 'completed',
          completedAt: new Date(),
          template: { id: 'template-1', title: 'Math Test', subject: 'math' },
          answers: [
            {
              questionId: 'question-1',
              selectedOptionId: null,
              selectedOption: null,
              isCorrect: false,
              pointsAwarded: 0,
              question: { ...mockQuestion, options: mockOptions },
            },
          ],
        });

      const result = await service.submitAnswers('user-1', 'test-1', {
        answers: [{ questionId: 'question-1' }],
      });

      expect(result.score).toBe(0);
      expect(result.answers[0].isCorrect).toBe(false);
    });
  });

  describe('getHistory()', () => {
    it('returns paginated list of user test attempts', async () => {
      prisma.mockTest.count.mockResolvedValue(1);
      prisma.mockTest.findMany.mockResolvedValue([
        {
          ...mockMockTest,
          score: 8,
          maxScore: 10,
          status: 'completed',
          template: mockTemplate,
          program: null,
        },
      ]);

      const result = await service.getHistory('user-1', { size: 20, page: 0 });

      expect(result.total).toBe(1);
      expect(result.tests).toHaveLength(1);
      expect(result.tests[0].percentage).toBe(80);
    });

    it('filters by status when provided', async () => {
      prisma.mockTest.count.mockResolvedValue(0);
      prisma.mockTest.findMany.mockResolvedValue([]);

      await service.getHistory('user-1', {
        status: 'completed',
        size: 20,
        page: 0,
      });

      expect(prisma.mockTest.count).toHaveBeenCalledWith({
        where: { userId: 'user-1', status: 'completed' },
      });
    });
  });

  describe('getAttempt()', () => {
    it('returns in-progress test with questions but no correct answers', async () => {
      prisma.mockTest.findUnique.mockResolvedValue({
        ...mockMockTest,
        template: {
          ...mockTemplate,
          questions: [{ ...mockQuestion, options: mockOptions }],
        },
        program: null,
        answers: [],
      });

      const result = await service.getAttempt('user-1', 'test-1');

      expect(result.status).toBe('in_progress');
      expect(result.questions).toHaveLength(1);
      // Options should not have isCorrect
      expect(result.questions[0].options[0]).not.toHaveProperty('isCorrect');
    });

    it('returns completed test with correct answers and user answers', async () => {
      prisma.mockTest.findUnique.mockResolvedValue({
        ...mockMockTest,
        score: 1,
        status: 'completed',
        completedAt: new Date(),
        template: {
          ...mockTemplate,
          questions: [{ ...mockQuestion, options: mockOptions }],
        },
        program: null,
        answers: [
          {
            questionId: 'question-1',
            selectedOptionId: 'opt-b',
            selectedOption: { label: 'B' },
            isCorrect: true,
            pointsAwarded: 1,
          },
        ],
      });

      const result = await service.getAttempt('user-1', 'test-1');

      expect(result.status).toBe('completed');
      expect(result.score).toBe(1);
      // Completed tests show isCorrect on options
      expect(
        (result.questions[0].options[1] as { isCorrect: boolean }).isCorrect,
      ).toBe(true);
      const userAnswer = result.questions[0].userAnswer as {
        isCorrect: boolean;
      } | null;
      expect(userAnswer?.isCorrect).toBe(true);
    });

    it('throws NotFoundException for non-existent test', async () => {
      prisma.mockTest.findUnique.mockResolvedValue(null);

      await expect(service.getAttempt('user-1', 'invalid')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('throws ForbiddenException for wrong user', async () => {
      prisma.mockTest.findUnique.mockResolvedValue({
        ...mockMockTest,
        userId: 'other-user',
        template: mockTemplate,
        program: null,
        answers: [],
      });

      await expect(service.getAttempt('user-1', 'test-1')).rejects.toThrow(
        ForbiddenException,
      );
    });
  });
});
