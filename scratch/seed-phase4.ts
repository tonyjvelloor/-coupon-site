import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    console.log("Seeding Phase 4 Data...");

    // Seed Events
    await prisma.saleEvent.create({
        data: {
            title: 'Prime Day',
            slug: 'prime-day',
            subtitle: 'Starts in 3 days',
            description: 'The biggest shopping event of the year for Amazon Prime members.',
            seoTitle: 'Amazon Prime Day Offers & Coupons',
            date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
            icon: 'local_fire_department',
            isActive: true,
        }
    });

    await prisma.saleEvent.create({
        data: {
            title: 'Big Billion Days',
            slug: 'big-billion-days',
            subtitle: 'Coming in September',
            description: 'Flipkart\'s annual shopping festival with massive discounts.',
            seoTitle: 'Flipkart Big Billion Days Offers',
            date: new Date(new Date().getFullYear(), 8, 15), // Sept 15
            icon: 'event',
            isActive: true,
        }
    });

    // Seed Banks
    const hdfc = await prisma.bank.create({
        data: {
            name: 'HDFC Bank',
            slug: 'hdfc',
            description: 'HDFC Bank credit and debit card offers across all major retailers.',
            seoTitle: 'HDFC Bank Offers & Coupons',
            isActive: true,
        }
    });

    const icici = await prisma.bank.create({
        data: {
            name: 'ICICI Bank',
            slug: 'icici',
            description: 'ICICI Bank credit and debit card offers across all major retailers.',
            seoTitle: 'ICICI Bank Offers & Coupons',
            isActive: true,
        }
    });

    // Seed Bank Offers
    await prisma.bankOffer.create({
        data: {
            bankId: hdfc.id,
            discountDetails: '10% Instant Discount up to ₹1,500',
            terms: 'On minimum purchase of ₹5,000',
            isActive: true,
        }
    });

    await prisma.bankOffer.create({
        data: {
            bankId: icici.id,
            discountDetails: '5% Unlimited Cashback on Amazon Pay Credit Card',
            terms: 'For Prime members only',
            isActive: true,
        }
    });

    console.log("Seeding Phase 4 completed!");
}

main().catch(console.error).finally(() => prisma.$disconnect());
