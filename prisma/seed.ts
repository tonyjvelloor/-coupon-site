import "dotenv/config";
import { prisma } from "../src/lib/db";
import bcrypt from "bcryptjs";

async function main() {
    console.log("🌱 Starting seed...");

    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminEmail || !adminPassword) {
        console.error("❌ Seed failed: ADMIN_EMAIL and ADMIN_PASSWORD must be provided in the environment.");
        process.exit(1);
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash(adminPassword, 12);
    const admin = await prisma.admin.upsert({
        where: { email: adminEmail },
        update: {},
        create: {
            email: adminEmail,
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
        let aboutContent = undefined;
        let faqContent = undefined;

        if (cat.slug === "fashion") {
            aboutContent = "Explore the best fashion coupons and promo codes on CouponHub. We aggregate deals for ethnic wear, western wear, footwear, and accessories from top brands like Myntra and Ajio. Use our exclusive discount codes to save on top-tier apparel and stay trendy without breaking the bank.";
            faqContent = JSON.stringify([
                { question: "How do I find fashion coupons?", answer: "Browse our Fashion category to see the latest verified coupons and deals from top clothing stores." },
                { question: "Do fashion promo codes expire?", answer: "Yes, most promo codes have an expiration date. We actively monitor and tag active coupons for your convenience." }
            ]);
        } else if (cat.slug === "electronics") {
            aboutContent = "Discover the highest discounts on electronics curated just for you. From flagship smartphones and ultrabooks to smart home devices, CouponHub tracks the best electronics promo codes and upcoming sale dates across Amazon, Flipkart, and more.";
            faqContent = JSON.stringify([
                { question: "Are there coupons for laptops?", answer: "Absolutely. We regularly update our electronics category with high-value coupons for laptops and accessories." },
                { question: "Can I combine bank offers with these coupons?", answer: "Often, yes! Many electronics retailers allow you to use a promo code and also apply a bank-specific discount at checkout." }
            ]);
        }

        await prisma.category.upsert({
            where: { slug: cat.slug },
            update: {
                // Ensure icons and names are updated if they changed
                name: cat.name,
                icon: cat.icon,
                displayOrder: cat.displayOrder,
                isFeatured: cat.isFeatured,
                aboutContent,
                faqContent
            },
            create: {
                ...cat,
                isActive: true,
                description: `Best ${cat.name.toLowerCase()} deals and coupons`,
                aboutContent,
                faqContent
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
            logo: "/images/stores/amazon.png",
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
            logo: "/images/stores/flipkart.png",
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
            logo: "/images/stores/myntra.png",
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
            logo: "/images/stores/ajio.png",
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
            logo: "/images/stores/swiggy.png",
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
        let aboutContent = undefined;
        let faqContent = undefined;

        if (store.slug === "amazon") {
            aboutContent = `Amazon is the world's leading platform for almost everything. At CouponHub, we track the best Amazon promo codes, upcoming sale dates (like the Great Indian Festival), and free shipping offers. Whether you are looking for discounts on electronics, home essentials, or books, apply our verified coupons at checkout to maximize your savings.`;
            faqContent = JSON.stringify([
                { question: "How do I use an Amazon coupon code?", answer: "Find a valid code on CouponHub, copy it, and paste it into the 'Gift Cards & Promotional Codes' box during Amazon checkout." },
                { question: "Does Amazon offer free shipping?", answer: "Yes, Amazon offers free shipping on many items, especially for Prime members or orders above a certain threshold." }
            ]);
        } else if (store.slug === "flipkart") {
            aboutContent = `Flipkart is India's leading e-commerce marketplace for mobiles, fashion, and appliances. At CouponHub, we track the best Flipkart promo codes, Big Billion Days sale offers, and exclusive bank discounts. Apply our verified coupons at checkout for massive savings.`;
            faqContent = JSON.stringify([
                { question: "How do I use a Flipkart coupon code?", answer: "Select a coupon from CouponHub, copy the code, and apply it in the 'Offers' or 'Promo Code' section on Flipkart's payment page." },
                { question: "What is Flipkart Plus?", answer: "Flipkart Plus is a loyalty program that offers free delivery, early access to sales, and superior customer support." }
            ]);
        }

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
                isFeatured: storeData.isFeatured,
                aboutContent,
                faqContent
            },
            create: {
                ...storeData,
                aboutContent,
                faqContent
            }
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
