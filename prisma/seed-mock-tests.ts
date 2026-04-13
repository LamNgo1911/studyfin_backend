import 'dotenv/config';
import { PrismaClient } from '../generated/prisma';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});
const prisma = new PrismaClient({ adapter });

interface QuestionData {
  body: string;
  explanation?: string;
  points?: number;
  options: { label: string; body: string; isCorrect: boolean }[];
}

interface TemplateData {
  title: string;
  description: string;
  subject: string;
  durationMinutes: number;
  questions: QuestionData[];
}

const mathTemplate: TemplateData = {
  title: 'UAS Mathematics Practice Test',
  description:
    'Practice test covering algebra, arithmetic, and basic problem-solving for Finnish UAS entrance exams.',
  subject: 'math',
  durationMinutes: 45,
  questions: [
    {
      body: 'Solve for x: 2x + 5 = 15',
      explanation: 'Subtract 5 from both sides: 2x = 10. Divide by 2: x = 5.',
      options: [
        { label: 'A', body: '5', isCorrect: true },
        { label: 'B', body: '10', isCorrect: false },
        { label: 'C', body: '7.5', isCorrect: false },
        { label: 'D', body: '20', isCorrect: false },
      ],
    },
    {
      body: 'What is 15% of 80?',
      explanation: '15% = 0.15. 0.15 × 80 = 12.',
      options: [
        { label: 'A', body: '8', isCorrect: false },
        { label: 'B', body: '12', isCorrect: true },
        { label: 'C', body: '15', isCorrect: false },
        { label: 'D', body: '65', isCorrect: false },
      ],
    },
    {
      body: 'If a rectangle has a length of 8 cm and width of 5 cm, what is its area?',
      explanation: 'Area = length × width = 8 × 5 = 40 cm².',
      options: [
        { label: 'A', body: '13 cm²', isCorrect: false },
        { label: 'B', body: '26 cm²', isCorrect: false },
        { label: 'C', body: '40 cm²', isCorrect: true },
        { label: 'D', body: '80 cm²', isCorrect: false },
      ],
    },
    {
      body: 'Simplify: (3x + 2) + (2x - 5)',
      explanation: 'Combine like terms: 3x + 2x = 5x, and 2 - 5 = -3. Result: 5x - 3.',
      options: [
        { label: 'A', body: '5x - 3', isCorrect: true },
        { label: 'B', body: '5x + 7', isCorrect: false },
        { label: 'C', body: 'x - 3', isCorrect: false },
        { label: 'D', body: '6x - 3', isCorrect: false },
      ],
    },
    {
      body: 'A shop offers a 20% discount on a product priced at €50. What is the discounted price?',
      explanation: '20% of €50 = €10. Discounted price = €50 - €10 = €40.',
      options: [
        { label: 'A', body: '€30', isCorrect: false },
        { label: 'B', body: '€40', isCorrect: true },
        { label: 'C', body: '€45', isCorrect: false },
        { label: 'D', body: '€10', isCorrect: false },
      ],
    },
    {
      body: 'What is the value of 2³ × 3²?',
      explanation: '2³ = 8 and 3² = 9. 8 × 9 = 72.',
      options: [
        { label: 'A', body: '36', isCorrect: false },
        { label: 'B', body: '54', isCorrect: false },
        { label: 'C', body: '72', isCorrect: true },
        { label: 'D', body: '18', isCorrect: false },
      ],
    },
    {
      body: 'If y = 3x - 4, what is the value of y when x = 6?',
      explanation: 'Substitute x = 6: y = 3(6) - 4 = 18 - 4 = 14.',
      options: [
        { label: 'A', body: '10', isCorrect: false },
        { label: 'B', body: '14', isCorrect: true },
        { label: 'C', body: '18', isCorrect: false },
        { label: 'D', body: '22', isCorrect: false },
      ],
    },
    {
      body: 'A train travels 240 km in 3 hours. What is its average speed?',
      explanation: 'Speed = distance / time = 240 / 3 = 80 km/h.',
      options: [
        { label: 'A', body: '60 km/h', isCorrect: false },
        { label: 'B', body: '70 km/h', isCorrect: false },
        { label: 'C', body: '80 km/h', isCorrect: true },
        { label: 'D', body: '90 km/h', isCorrect: false },
      ],
    },
    {
      body: 'What is the least common multiple (LCM) of 4 and 6?',
      explanation:
        'Multiples of 4: 4, 8, 12, 16... Multiples of 6: 6, 12, 18... The smallest common multiple is 12.',
      options: [
        { label: 'A', body: '2', isCorrect: false },
        { label: 'B', body: '12', isCorrect: true },
        { label: 'C', body: '24', isCorrect: false },
        { label: 'D', body: '6', isCorrect: false },
      ],
    },
    {
      body: 'Solve: -3 + 7 × 2 - 4',
      explanation:
        'Order of operations: first 7 × 2 = 14. Then: -3 + 14 - 4 = 7.',
      options: [
        { label: 'A', body: '4', isCorrect: false },
        { label: 'B', body: '7', isCorrect: true },
        { label: 'C', body: '11', isCorrect: false },
        { label: 'D', body: '-7', isCorrect: false },
      ],
    },
  ],
};

const englishReadingTemplate: TemplateData = {
  title: 'UAS English Reading Comprehension Test',
  description:
    'Practice test for English reading comprehension and language skills for Finnish UAS entrance exams.',
  subject: 'language_en',
  durationMinutes: 30,
  questions: [
    {
      body: `Read the passage and answer the question:

"The rapid growth of renewable energy sources has transformed the global energy landscape. Solar and wind power, once considered expensive alternatives, now compete directly with fossil fuels in many markets. Governments worldwide have implemented policies to accelerate this transition, recognizing both the environmental benefits and economic opportunities."

What is the main idea of this passage?`,
      explanation:
        'The passage focuses on how renewable energy has grown rapidly and now competes with traditional energy sources.',
      options: [
        {
          label: 'A',
          body: 'Fossil fuels are becoming more expensive',
          isCorrect: false,
        },
        {
          label: 'B',
          body: 'Renewable energy has become a competitive force in global energy markets',
          isCorrect: true,
        },
        {
          label: 'C',
          body: 'Governments are ignoring environmental issues',
          isCorrect: false,
        },
        {
          label: 'D',
          body: 'Solar power is the only viable renewable source',
          isCorrect: false,
        },
      ],
    },
    {
      body: 'Choose the correct word to complete the sentence: "The company _____ its profits by 20% last quarter."',
      explanation:
        '"Increased" is the correct past tense verb that fits the context of growing profits.',
      options: [
        { label: 'A', body: 'increasing', isCorrect: false },
        { label: 'B', body: 'increased', isCorrect: true },
        { label: 'C', body: 'increases', isCorrect: false },
        { label: 'D', body: 'increase', isCorrect: false },
      ],
    },
    {
      body: `Read the passage and answer the question:

"Finland has one of the world's most successful education systems. The country emphasizes equal opportunities, with free education from pre-school through university. Teachers are highly trained professionals, and there is minimal standardized testing. This approach has consistently placed Finland among the top performers in international education rankings."

According to the passage, what contributes to Finland's educational success?`,
      explanation:
        'The passage mentions equal opportunities, free education, highly trained teachers, and minimal testing as key factors.',
      options: [
        { label: 'A', body: 'Extensive standardized testing', isCorrect: false },
        {
          label: 'B',
          body: 'Equal opportunities and well-trained teachers',
          isCorrect: true,
        },
        { label: 'C', body: 'Private school systems', isCorrect: false },
        { label: 'D', body: 'Competitive student rankings', isCorrect: false },
      ],
    },
    {
      body: 'Which sentence is grammatically correct?',
      explanation:
        'Option B uses correct subject-verb agreement and proper preposition usage.',
      options: [
        {
          label: 'A',
          body: 'Neither of the students have finished their exam.',
          isCorrect: false,
        },
        {
          label: 'B',
          body: 'Neither of the students has finished the exam.',
          isCorrect: true,
        },
        {
          label: 'C',
          body: 'Neither of the students has finished their exams.',
          isCorrect: false,
        },
        {
          label: 'D',
          body: 'Neither of students has finished the exam.',
          isCorrect: false,
        },
      ],
    },
    {
      body: 'What is the meaning of the word "ubiquitous" in the sentence: "Smartphones have become ubiquitous in modern society."',
      explanation:
        '"Ubiquitous" means present, appearing, or found everywhere.',
      options: [
        { label: 'A', body: 'Expensive', isCorrect: false },
        { label: 'B', body: 'Rare', isCorrect: false },
        { label: 'C', body: 'Found everywhere', isCorrect: true },
        { label: 'D', body: 'Difficult to use', isCorrect: false },
      ],
    },
    {
      body: `Read the passage and answer the question:

"The gig economy has fundamentally changed how people work. Freelancers and independent contractors now make up a significant portion of the workforce. While this arrangement offers flexibility, it also raises concerns about job security and benefits that traditional employment provides."

What concern does the passage raise about the gig economy?`,
      explanation:
        'The passage explicitly mentions concerns about job security and benefits.',
      options: [
        { label: 'A', body: 'Too much flexibility', isCorrect: false },
        { label: 'B', body: 'Lack of job security and benefits', isCorrect: true },
        { label: 'C', body: 'Too few workers', isCorrect: false },
        { label: 'D', body: 'High salaries', isCorrect: false },
      ],
    },
    {
      body: 'Choose the correct preposition: "The report focuses _____ environmental issues."',
      explanation: '"Focus on" is the correct preposition combination.',
      options: [
        { label: 'A', body: 'in', isCorrect: false },
        { label: 'B', body: 'at', isCorrect: false },
        { label: 'C', body: 'on', isCorrect: true },
        { label: 'D', body: 'for', isCorrect: false },
      ],
    },
    {
      body: 'What does the phrase "a blessing in disguise" mean?',
      explanation:
        'This idiom means something that seems bad at first but turns out to be good.',
      options: [
        {
          label: 'A',
          body: 'A hidden treasure',
          isCorrect: false,
        },
        {
          label: 'B',
          body: 'Something that initially seems bad but turns out to be beneficial',
          isCorrect: true,
        },
        { label: 'C', body: 'A religious ceremony', isCorrect: false },
        { label: 'D', body: 'A costume party', isCorrect: false },
      ],
    },
    {
      body: 'Choose the sentence with correct punctuation:',
      explanation:
        'Option C correctly uses a comma after the introductory clause.',
      options: [
        {
          label: 'A',
          body: 'Although it was raining we went for a walk.',
          isCorrect: false,
        },
        {
          label: 'B',
          body: 'Although, it was raining we went for a walk.',
          isCorrect: false,
        },
        {
          label: 'C',
          body: 'Although it was raining, we went for a walk.',
          isCorrect: true,
        },
        {
          label: 'D',
          body: 'Although it was raining; we went for a walk.',
          isCorrect: false,
        },
      ],
    },
    {
      body: `Read the passage and answer the question:

"Artificial intelligence is increasingly being used in healthcare diagnostics. AI systems can analyze medical images with remarkable accuracy, sometimes outperforming human doctors. However, experts emphasize that AI should complement, not replace, human medical judgment."

What is the recommended role of AI in healthcare according to the passage?`,
      explanation:
        'The passage states that AI should complement human judgment, not replace it.',
      options: [
        {
          label: 'A',
          body: 'To completely replace human doctors',
          isCorrect: false,
        },
        {
          label: 'B',
          body: 'To work alongside and support human medical judgment',
          isCorrect: true,
        },
        { label: 'C', body: 'To be avoided in healthcare', isCorrect: false },
        {
          label: 'D',
          body: 'To only be used for administrative tasks',
          isCorrect: false,
        },
      ],
    },
  ],
};

const analyticalTemplate: TemplateData = {
  title: 'UAS Analytical Reasoning Practice Test',
  description:
    'Practice test for logical reasoning and analytical thinking skills for Finnish UAS entrance exams.',
  subject: 'analytical',
  durationMinutes: 40,
  questions: [
    {
      body: `If all roses are flowers, and some flowers fade quickly, which of the following must be true?`,
      explanation:
        'We know all roses are flowers, and some flowers fade quickly. This means some flowers (possibly including roses) fade quickly, but we cannot conclude definitely about roses.',
      options: [
        { label: 'A', body: 'All roses fade quickly', isCorrect: false },
        { label: 'B', body: 'Some roses fade quickly', isCorrect: false },
        { label: 'C', body: 'No roses fade quickly', isCorrect: false },
        {
          label: 'D',
          body: 'Some flowers that fade quickly may or may not be roses',
          isCorrect: true,
        },
      ],
    },
    {
      body: `In a row of five houses, each painted a different color (red, blue, green, yellow, white), the following is known:
- The red house is immediately to the left of the blue house
- The green house is at one of the ends
- The yellow house is not next to the green house

If the green house is on the left end, which house could be in the middle?`,
      explanation:
        'With green on the left and yellow not next to green, the order could be: Green, Red, Blue, ?, Yellow or variations. Red or Blue could be in the middle.',
      options: [
        { label: 'A', body: 'Green', isCorrect: false },
        { label: 'B', body: 'Blue', isCorrect: true },
        { label: 'C', body: 'Yellow', isCorrect: false },
        { label: 'D', body: 'White must be in the middle', isCorrect: false },
      ],
    },
    {
      body: `A, B, C, D, and E are sitting in a circle. A is between D and E. B is not next to A or E. Where is C sitting?`,
      explanation:
        'If A is between D and E, and B is not next to A or E, then B must be between C and D (or C and the other side). C ends up next to B and E.',
      options: [
        { label: 'A', body: 'Between A and B', isCorrect: false },
        { label: 'B', body: 'Between B and E', isCorrect: true },
        { label: 'C', body: 'Between D and E', isCorrect: false },
        { label: 'D', body: 'Between A and D', isCorrect: false },
      ],
    },
    {
      body: `Complete the pattern: 2, 6, 12, 20, 30, ?`,
      explanation:
        'The differences are: 4, 6, 8, 10, 12. The pattern increases by 2 each time. 30 + 12 = 42.',
      options: [
        { label: 'A', body: '40', isCorrect: false },
        { label: 'B', body: '42', isCorrect: true },
        { label: 'C', body: '44', isCorrect: false },
        { label: 'D', body: '36', isCorrect: false },
      ],
    },
    {
      body: `If it takes 5 machines 5 minutes to make 5 widgets, how long would it take 100 machines to make 100 widgets?`,
      explanation:
        'Each machine makes 1 widget in 5 minutes. So 100 machines can each make 1 widget in 5 minutes, producing 100 widgets total.',
      options: [
        { label: 'A', body: '1 minute', isCorrect: false },
        { label: 'B', body: '5 minutes', isCorrect: true },
        { label: 'C', body: '100 minutes', isCorrect: false },
        { label: 'D', body: '20 minutes', isCorrect: false },
      ],
    },
    {
      body: `Three friends - Anna, Ben, and Carl - each have a different pet: a cat, a dog, or a bird.
- Anna doesn't have the dog
- The person with the cat is not Ben
- Carl has a bird

Who has the dog?`,
      explanation:
        "Carl has the bird. Anna doesn't have the dog, so she has the cat. Therefore, Ben has the dog.",
      options: [
        { label: 'A', body: 'Anna', isCorrect: false },
        { label: 'B', body: 'Ben', isCorrect: true },
        { label: 'C', body: 'Carl', isCorrect: false },
        { label: 'D', body: 'Cannot be determined', isCorrect: false },
      ],
    },
    {
      body: `Which number should replace the question mark?
16 : 4 :: 49 : ?`,
      explanation:
        '16 is 4², and 4 is its square root. 49 is 7², so its square root is 7.',
      options: [
        { label: 'A', body: '6', isCorrect: false },
        { label: 'B', body: '7', isCorrect: true },
        { label: 'C', body: '12', isCorrect: false },
        { label: 'D', body: '14', isCorrect: false },
      ],
    },
    {
      body: `Statement: "Some doctors are teachers. All teachers are educated."
Conclusion: "Some doctors are educated."

Is the conclusion valid?`,
      explanation:
        'If some doctors are teachers, and all teachers are educated, then those doctors who are teachers must be educated. So some doctors are educated.',
      options: [
        { label: 'A', body: 'Yes, the conclusion is valid', isCorrect: true },
        { label: 'B', body: 'No, the conclusion is invalid', isCorrect: false },
        { label: 'C', body: 'Cannot be determined', isCorrect: false },
        {
          label: 'D',
          body: 'The conclusion is only sometimes valid',
          isCorrect: false,
        },
      ],
    },
    {
      body: `If Monday falls on the 1st of the month, what day of the week will the 23rd be?`,
      explanation:
        '22 days after Monday. 22 ÷ 7 = 3 weeks and 1 day. So the 23rd is Tuesday.',
      options: [
        { label: 'A', body: 'Monday', isCorrect: false },
        { label: 'B', body: 'Tuesday', isCorrect: true },
        { label: 'C', body: 'Wednesday', isCorrect: false },
        { label: 'D', body: 'Thursday', isCorrect: false },
      ],
    },
    {
      body: `In a certain code, COMPUTER is written as RFUVQNPC. How is PRINTER written in that code?`,
      explanation:
        'The code reverses the word and shifts each letter by +1. PRINTER reversed is RETNIRP, shifted by +1 is SFUOJSQ.',
      options: [
        { label: 'A', body: 'QSHOUFS', isCorrect: false },
        { label: 'B', body: 'SFUOJSQ', isCorrect: true },
        { label: 'C', body: 'SFUOJTQ', isCorrect: false },
        { label: 'D', body: 'RETNIRP', isCorrect: false },
      ],
    },
  ],
};

async function seedMockTests() {
  console.log('Seeding mock test templates...\n');

  const templates = [mathTemplate, englishReadingTemplate, analyticalTemplate];

  for (const templateData of templates) {
    // Check if template already exists
    const existing = await prisma.testTemplate.findFirst({
      where: { title: templateData.title },
    });

    if (existing) {
      console.log(`Template "${templateData.title}" already exists, skipping.`);
      continue;
    }

    // Create template with questions and options
    const template = await prisma.testTemplate.create({
      data: {
        title: templateData.title,
        description: templateData.description,
        subject: templateData.subject,
        durationMinutes: templateData.durationMinutes,
        isActive: true,
        questions: {
          create: templateData.questions.map((q, qIndex) => ({
            body: q.body,
            type: 'multiple_choice',
            points: q.points ?? 1,
            orderIndex: qIndex,
            explanation: q.explanation,
            options: {
              create: q.options.map((o, oIndex) => ({
                label: o.label,
                body: o.body,
                isCorrect: o.isCorrect,
                orderIndex: oIndex,
              })),
            },
          })),
        },
      },
      include: {
        _count: { select: { questions: true } },
      },
    });

    console.log(
      `Created template: "${template.title}" with ${template._count.questions} questions`,
    );
  }

  console.log('\nSeeding complete!');
}

seedMockTests()
  .catch((e) => {
    console.error('Error seeding mock tests:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
