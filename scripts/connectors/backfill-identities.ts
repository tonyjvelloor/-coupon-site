import * as dotenv from "dotenv";
dotenv.config({ path: ".env" });
import { PrismaClient, MerchantIdentityType } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const stores = await prisma.store.findMany({
    include: { merchantIdentity: true }
  });
  
  let count = 0;
  for (const s of stores) {
    if (!s.merchantIdentity) {
      await prisma.merchantIdentity.create({
        data: {
          type: MerchantIdentityType.CANONICAL,
          canonicalStoreId: s.id,
        },
      });
      count++;
    }
  }
  console.log(`Created ${count} identities for existing stores`);
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
