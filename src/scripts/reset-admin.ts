import "dotenv/config";
import { prisma } from "../lib/db";
import bcrypt from "bcryptjs";

async function main() {
    console.log("Resetting admin password...");
    const newPassword = "CouponMasterSecure#2026!";
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    const admin = await prisma.admin.upsert({
        where: { email: "admin@couponhub.store" },
        update: { password: hashedPassword },
        create: {
            email: "admin@couponhub.store",
            password: hashedPassword,
            name: "Admin"
        }
    });

    console.log("✅ Success! Admin credentials:");
    console.log("Email: admin@couponhub.store");
    console.log(`Password: ${newPassword}`);
}

main()
    .catch((e) => {
        console.error("Error:", e);
        process.exit(1);
    })
    .finally(() => prisma.$disconnect());
