import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Seeding Phase 2 Data...');

  // Seed SaleEvents
  await prisma.saleEvent.create({
    data: {
      title: 'Prime Day',
      subtitle: 'Starts in 3 days',
      date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      icon: 'local_fire_department',
      isActive: true,
    }
  });

  await prisma.saleEvent.create({
    data: {
      title: 'Big Billion Days',
      subtitle: 'Coming in September',
      date: new Date(new Date().getFullYear(), 8, 15), // Sept 15
      icon: 'event',
      isActive: true,
    }
  });

  // Seed ShoppingTips
  await prisma.shoppingTip.create({
    data: {
      title: 'Use HDFC cards on Amazon',
      description: 'Get an instant 10% discount during major sales by keeping an HDFC card ready.',
      category: 'Bank Offers',
      icon: 'credit_card',
      href: '/guides/hdfc-amazon',
      isActive: true,
    }
  });

  await prisma.shoppingTip.create({
    data: {
      title: 'Compare cashback providers',
      description: 'Rates change daily. Always check the store page to see who offers the most.',
      category: 'Strategy',
      icon: 'compare_arrows',
      href: '/guides/compare-cashback',
      isActive: true,
    }
  });

  console.log('Seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
