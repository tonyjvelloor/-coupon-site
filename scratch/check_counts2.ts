import 'dotenv/config';
import { prisma } from '../src/lib/db';

async function checkCounts() {
    console.log("Blog Posts:", await prisma.blogPost.count());
    console.log("Collections:", await prisma.collection.count());
    console.log("Sale Events:", await prisma.saleEvent.count());
}

checkCounts().finally(() => prisma.$disconnect());
