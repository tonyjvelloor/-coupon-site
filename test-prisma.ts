import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    const categories = await prisma.category.findMany({
        where: { isActive: true },
        select: {
            slug: true,
            _count: {
                select: {
                    storeCategories: true,
                    coupons: {
                        where: {
                            OR: [
                                { expiresAt: null },
                                { expiresAt: { gt: new Date() } }
                            ]
                        }
                    }
                }
            }
        }
    });
    console.log(categories.slice(0, 5));
}
main().catch(console.error).finally(() => prisma.$disconnect());
