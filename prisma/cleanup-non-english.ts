import 'dotenv/config';
import { PrismaClient } from '../generated/prisma';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});
const prisma = new PrismaClient({ adapter });

async function cleanupNonEnglishPrograms() {
  // Delete programs that do not include 'en' in teachingLanguages.
  // NOT { has: 'en' } covers both empty arrays (D-07) and arrays
  // with only non-English codes (D-06) in a single query.
  const result = await prisma.program.deleteMany({
    where: {
      NOT: {
        teachingLanguages: { has: 'en' },
      },
    },
  });

  console.log(`Deleted ${result.count} non-English programs`);
}

cleanupNonEnglishPrograms()
  .catch((e) => {
    console.error('Error running cleanup:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
