import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create sample users
  const user1 = await prisma.user.upsert({
    where: { email: 'john@example.com' },
    update: {},
    create: {
      email: 'john@example.com',
      name: 'John Doe',
      image: 'https://avatar.vercel.sh/john',
    },
  })

  const user2 = await prisma.user.upsert({
    where: { email: 'alice@example.com' },
    update: {},
    create: {
      email: 'alice@example.com',
      name: 'Alice Smith',
      image: 'https://avatar.vercel.sh/alice',
    },
  })

  const user3 = await prisma.user.upsert({
    where: { email: 'bob@example.com' },
    update: {},
    create: {
      email: 'bob@example.com',
      name: 'Bob Johnson',
      image: 'https://avatar.vercel.sh/bob',
    },
  })

  console.log('✅ Created sample users')

  // Create sample societies
  const society1 = await prisma.society.upsert({
    where: { id: 'society1' },
    update: {},
    create: {
      id: 'society1',
      name: 'College Friends',
      description: 'Our college buddy group for hangouts and activities',
      createdBy: user1.id,
      members: {
        create: [
          { userId: user1.id, role: 'ADMIN' },
          { userId: user2.id, role: 'MEMBER' },
          { userId: user3.id, role: 'MEMBER' },
        ],
      },
    },
  })

  const society2 = await prisma.society.upsert({
    where: { id: 'society2' },
    update: {},
    create: {
      id: 'society2',
      name: 'Weekend Warriors',
      description: 'Adventure seekers and outdoor enthusiasts',
      createdBy: user2.id,
      members: {
        create: [
          { userId: user2.id, role: 'ADMIN' },
          { userId: user1.id, role: 'MEMBER' },
        ],
      },
    },
  })

  const society3 = await prisma.society.upsert({
    where: { id: 'society3' },
    update: {},
    create: {
      id: 'society3',
      name: 'Food Explorers',
      description: 'Discovering great food spots around the city',
      createdBy: user3.id,
      members: {
        create: [
          { userId: user3.id, role: 'ADMIN' },
          { userId: user1.id, role: 'MEMBER' },
          { userId: user2.id, role: 'MEMBER' },
        ],
      },
    },
  })

  console.log('✅ Created sample societies')

  // Create sample outings
  const outing1 = await prisma.outing.upsert({
    where: { id: 'outing1' },
    update: {},
    create: {
      id: 'outing1',
      name: 'Pizza Night',
      date: new Date('2024-07-20T18:00:00Z'),
      societyId: society1.id,
      createdBy: user1.id,
      status: 'COMPLETED',
      participants: {
        create: [
          { userId: user1.id, status: 'CONFIRMED' },
          { userId: user2.id, status: 'CONFIRMED' },
          { userId: user3.id, status: 'CONFIRMED' },
        ],
      },
    },
  })

  const outing2 = await prisma.outing.upsert({
    where: { id: 'outing2' },
    update: {},
    create: {
      id: 'outing2',
      name: 'Movie Night',
      date: new Date('2024-07-25T19:00:00Z'),
      societyId: society1.id,
      createdBy: user2.id,
      status: 'PLANNED',
      participants: {
        create: [
          { userId: user1.id, status: 'CONFIRMED' },
          { userId: user2.id, status: 'CONFIRMED' },
        ],
      },
    },
  })

  const outing3 = await prisma.outing.upsert({
    where: { id: 'outing3' },
    update: {},
    create: {
      id: 'outing3',
      name: 'Hiking Adventure',
      date: new Date('2024-08-01T08:00:00Z'),
      societyId: society2.id,
      createdBy: user2.id,
      status: 'PLANNED',
      participants: {
        create: [
          { userId: user1.id, status: 'CONFIRMED' },
          { userId: user2.id, status: 'CONFIRMED' },
        ],
      },
    },
  })

  console.log('✅ Created sample outings')

  // Create sample instances for Pizza Night
  const instance1 = await prisma.instance.upsert({
    where: { id: 'instance1' },
    update: {},
    create: {
      id: 'instance1',
      name: 'Pizza Order',
      amount: 45.99,
      outingId: outing1.id,
      createdBy: user1.id,
      status: 'ENDED',
      participants: {
        create: [
          { userId: user1.id, amountOwed: 15.33, amountPaid: 45.99 },
          { userId: user2.id, amountOwed: 15.33, amountPaid: 0 },
          { userId: user3.id, amountOwed: 15.33, amountPaid: 0 },
        ],
      },
    },
  })

  const instance2 = await prisma.instance.upsert({
    where: { id: 'instance2' },
    update: {},
    create: {
      id: 'instance2',
      name: 'Drinks',
      amount: 18.75,
      outingId: outing1.id,
      createdBy: user2.id,
      status: 'ENDED',
      participants: {
        create: [
          { userId: user1.id, amountOwed: 9.38, amountPaid: 0 },
          { userId: user2.id, amountOwed: 9.37, amountPaid: 18.75 },
        ],
      },
    },
  })

  console.log('✅ Created sample instances')

  // Create sample settlements
  await prisma.settlement.upsert({
    where: { id: 'settlement1' },
    update: {},
    create: {
      id: 'settlement1',
      instanceId: instance1.id,
      payerId: user2.id,
      payeeId: user1.id,
      amount: 15.33,
      status: 'PENDING',
    },
  })

  await prisma.settlement.upsert({
    where: { id: 'settlement2' },
    update: {},
    create: {
      id: 'settlement2',
      instanceId: instance1.id,
      payerId: user3.id,
      payeeId: user1.id,
      amount: 15.33,
      status: 'PENDING',
    },
  })

  await prisma.settlement.upsert({
    where: { id: 'settlement3' },
    update: {},
    create: {
      id: 'settlement3',
      instanceId: instance2.id,
      payerId: user1.id,
      payeeId: user2.id,
      amount: 9.38,
      status: 'COMPLETED',
      settledAt: new Date('2024-07-21T10:00:00Z'),
    },
  })

  console.log('✅ Created sample settlements')

  console.log('🎉 Database seeded successfully!')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error('❌ Error seeding database:', e)
    await prisma.$disconnect()
    process.exit(1)
  }) 