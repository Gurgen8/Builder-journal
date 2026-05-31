import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  const workTypesData = [
    { name: 'Кладка кирпичных перегородок' },
    { name: 'Монтаж опалубки перекрытия' },
    { name: 'Штукатурка стен цементно-песчаная' },
    { name: 'Бетонирование фундаментной плиты' },
    { name: 'Армирование железобетонных колонн' },
    { name: 'Гидроизоляция цокольного этажа' },
    { name: 'Монтаж металлоконструкций кровли' },
    { name: 'Укладка керамогранитной плитки' },
  ];

  const createdWorkTypes = [];
  for (const type of workTypesData) {
    const wt = await prisma.workType.upsert({
      where: { name: type.name },
      update: {},
      create: { name: type.name },
    });
    createdWorkTypes.push(wt);
    console.log(`Upserted WorkType: "${wt.name}"`);
  }

  const logsCount = await prisma.workLog.count();
  if (logsCount === 0) {
    console.log('No work logs found. Creating initial work logs...');

    const logsData = [
      {
        date: new Date('2026-05-25T08:00:00.000Z'),
        volume: 45.5,
        unit: 'м²',
        workerName: 'Иванов Иван Иванович',
        workTypeId: createdWorkTypes[0].id,
      },
      {
        date: new Date('2026-05-26T09:00:00.000Z'),
        volume: 120.0,
        unit: 'м²',
        workerName: 'Петров Петр Петрович',
        workTypeId: createdWorkTypes[1].id,
      },
      {
        date: new Date('2026-05-27T08:30:00.000Z'),
        volume: 85.0,
        unit: 'м²',
        workerName: 'Сидоров Сидор Сидорович',
        workTypeId: createdWorkTypes[2].id,
      },
      {
        date: new Date('2026-05-28T10:00:00.000Z'),
        volume: 35.0,
        unit: 'м³',
        workerName: 'Козлов Алексей Сергеевич',
        workTypeId: createdWorkTypes[3].id,
      },
      {
        date: new Date('2026-05-29T11:00:00.000Z'),
        volume: 2.4,
        unit: 'т',
        workerName: 'Морозов Дмитрий Александрович',
        workTypeId: createdWorkTypes[4].id,
      },
    ];

    for (const log of logsData) {
      await prisma.workLog.create({
        data: log,
      });
    }
    console.log(`Created ${logsData.length} initial work log entries.`);
  } else {
    console.log('Database already has work logs, skipping logs seeding.');
  }

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
