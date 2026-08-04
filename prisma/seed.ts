import { PrismaClient } from '@prisma/client';
import { runSeed } from '../src/lib/seed';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding Tiny Treasure Competitions...');
  const log = await runSeed(prisma);
  for (const line of log) console.log(`   ✔ ${line}`);
  console.log('✅ Seed complete.');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
