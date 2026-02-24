import "dotenv/config";
import { prisma } from "../src/lib/db";
import bcrypt from "bcryptjs";

async function main() {
    console.log("🌱 Starting seed...");

    // Create admin user
    const hashedPassword = await bcrypt.hash("admin123", 12);
    const admin = await prisma.admin.upsert({
        where: { email: "admin@couponhub.store" },
        update: {},
        create: {
            email: "admin@couponhub.store",
            password: hashedPassword,
            name: "Admin"
        }
    });
    console.log("✅ Admin verified:", admin.email);

    // Create site settings
    await prisma.siteSettings.upsert({
        where: { id: "default" },
        update: {},
        create: {
            id: "default",
            siteName: "CouponHub",
            siteTagline: "Save Big with Verified Coupons",
            siteDescription: "India's trusted destination for the best coupons, promo codes, and deals.",
            contactEmail: "contact@couponhub.store"
        }
    });

    // Create categories
    const categories = [
        { name: "Fashion", slug: "fashion", icon: "Shirt", displayOrder: 1, isFeatured: true },
        { name: "Electronics", slug: "electronics", icon: "Smartphone", displayOrder: 2, isFeatured: true },
        { name: "Food & Dining", slug: "food-dining", icon: "UtensilsCrossed", displayOrder: 3, isFeatured: true },
        { name: "Travel", slug: "travel", icon: "Plane", displayOrder: 4, isFeatured: true },
        { name: "Health & Beauty", slug: "health-beauty", icon: "Heart", displayOrder: 5, isFeatured: true },
        { name: "Home & Living", slug: "home-living", icon: "Home", displayOrder: 6, isFeatured: true },
        { name: "Entertainment", slug: "entertainment", icon: "Film", displayOrder: 7, isFeatured: true },
        { name: "Sports & Fitness", slug: "sports-fitness", icon: "Dumbbell", displayOrder: 8, isFeatured: true },
    ];

    for (const cat of categories) {
        await prisma.category.upsert({
            where: { slug: cat.slug },
            update: {
                // Ensure icons and names are updated if they changed
                name: cat.name,
                icon: cat.icon,
                displayOrder: cat.displayOrder,
                isFeatured: cat.isFeatured
            },
            create: {
                ...cat,
                isActive: true,
                description: `Best ${cat.name.toLowerCase()} deals and coupons`
            }
        });
    }
    console.log("✅ Categories seeded");

    // Get category IDs for linking
    const fashionCat = await prisma.category.findUnique({ where: { slug: "fashion" } });
    const electronicsCat = await prisma.category.findUnique({ where: { slug: "electronics" } });
    const foodCat = await prisma.category.findUnique({ where: { slug: "food-dining" } });

    // Create stores with Real Logos
    const stores = [
        {
            name: "Amazon",
            slug: "amazon",
            description: "World's largest online retailer with millions of products",
            logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/2560px-Amazon_logo.svg.png",
            website: "https://www.amazon.in",
            affiliateUrl: "https://www.amazon.in/?tag=couponhub-21",
            cashbackRate: "Up to 10%",
            isActive: true,
            isFeatured: true,
            categoryId: electronicsCat?.id
        },
        {
            name: "Flipkart",
            slug: "flipkart",
            description: "India's leading e-commerce marketplace",
            logo: "https://upload.wikimedia.org/wikipedia/en/thumb/7/7a/Flipkart_logo.svg/1200px-Flipkart_logo.svg.png",
            website: "https://www.flipkart.com",
            affiliateUrl: "https://www.flipkart.com/?affid=couponhub",
            cashbackRate: "Up to 8%",
            isActive: true,
            isFeatured: true,
            categoryId: electronicsCat?.id
        },
        {
            name: "Myntra",
            slug: "myntra",
            description: "India's biggest fashion destination for men, women and kids",
            logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Myntra_logo.png/600px-Myntra_logo.png",
            website: "https://www.myntra.com",
            affiliateUrl: "https://www.myntra.com/?affid=couponhub",
            cashbackRate: "Up to 12%",
            isActive: true,
            isFeatured: true,
            categoryId: fashionCat?.id
        },
        {
            name: "AJIO",
            slug: "ajio",
            description: "Reliance's fashion and lifestyle destination",
            logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Ajio_logo.svg/800px-Ajio_logo.svg.png",
            website: "https://www.ajio.com",
            affiliateUrl: "https://www.ajio.com/?affid=couponhub",
            cashbackRate: "Up to 15%",
            isActive: true,
            isFeatured: true,
            categoryId: fashionCat?.id
        },
        {
            name: "Swiggy",
            slug: "swiggy",
            description: "Order food online from your favorite restaurants",
            logo: "https://upload.wikimedia.org/wikipedia/en/thumb/1/12/Swiggy_logo.svg/1200px-Swiggy_logo.svg.png",
            website: "https://www.swiggy.com",
            affiliateUrl: "https://www.swiggy.com/?affid=couponhub",
            cashbackRate: "Up to 20%",
            isActive: true,
            isFeatured: true,
            categoryId: foodCat?.id
        },
        {
            name: "Zomato",
            slug: "zomato",
            description: "Discover great restaurants and get food delivered",
            logo: "https://upload.wikimedia.org/wikipedia/commons/b/bd/Zomato_Logo.svg",
            website: "https://www.zomato.com",
            affiliateUrl: "https://www.zomato.com/?affid=couponhub",
            cashbackRate: "Up to 18%",
            isActive: true,
            isFeatured: true,
            categoryId: foodCat?.id
        }
    ];

    for (const store of stores) {
        const { categoryId, ...storeData } = store;
        const createdStore = await prisma.store.upsert({
            where: { slug: store.slug },
            update: {
                // Update everything to ensure fresh data
                name: storeData.name,
                description: storeData.description,
                logo: storeData.logo,
                website: storeData.website,
                affiliateUrl: storeData.affiliateUrl,
                cashbackRate: storeData.cashbackRate,
                isActive: storeData.isActive,
                isFeatured: storeData.isFeatured
            },
            create: storeData
        });

        // Create store-category relationship if category exists
        if (categoryId) {
            await prisma.storeCategory.upsert({
                where: {
                    storeId_categoryId: {
                        storeId: createdStore.id,
                        categoryId: categoryId
                    }
                },
                update: {},
                create: {
                    storeId: createdStore.id,
                    categoryId: categoryId
                }
            });
        }
    }
    console.log("✅ Stores seeded with logos");

    console.log("🎉 Seed completed successfully!");
}

main()
    .catch((e) => {
        console.error("❌ Seed failed:", e);
        process.exit(1);
    })
    .finally(() => prisma.$disconnect());
