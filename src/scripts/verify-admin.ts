import { prisma } from "../lib/db";
import bcrypt from "bcryptjs";

async function main() {
    console.log("🔍 Verifying admin credentials...");

    // 1. Fetch user
    const admin = await prisma.admin.findUnique({
        where: { email: "admin@couponhub.store" }
    });

    if (!admin) {
        console.error("❌ Admin user NOT found in database!");
        return;
    }
    console.log("✅ Admin user found:", admin.email);
    console.log("   Hash stored:", admin.password.substring(0, 15) + "...");

    // 2. Verify password
    const password = "admin123";
    const isValid = await bcrypt.compare(password, admin.password);

    if (isValid) {
        console.log("✅ Password verification PASSED");
    } else {
        console.error("❌ Password verification FAILED");
    }
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
