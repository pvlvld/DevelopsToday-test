import { PrismaClient } from '../generated/prisma';

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1 },
  });

  await prisma.holiday.createMany({
    data: [
      {
        date: new Date('2025-01-01'),
        localName: "New Year's Day",
        name: "New Year's Day",
        isGlobal: true,
        countryCode: 'US',
        userId: user.id,
      },
      {
        date: new Date('2025-07-04'),
        localName: 'Independence Day',
        name: 'Independence Day',
        isGlobal: true,
        countryCode: 'US',
        userId: user.id,
      },
    ],
    skipDuplicates: true,
  });

  console.log('Seed data created.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
