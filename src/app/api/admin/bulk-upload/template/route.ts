import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import * as XLSX from "xlsx";

const templates = {
    coupons: {
        headers: [
            "title",
            "description",
            "code",
            "type",
            "discountType",
            "discountValue",
            "storeSlug",
            "affiliateUrl",
            "termsConditions",
            "isVerified",
            "isExclusive",
            "isFeatured",
            "expiresAt",
        ],
        sampleData: [
            {
                title: "50% Off on Electronics",
                description: "Get 50% off on all electronics products",
                code: "ELEC50",
                type: "coupon",
                discountType: "percentage",
                discountValue: "50% Off",
                storeSlug: "amazon",
                affiliateUrl: "https://amazon.in/?tag=example",
                termsConditions: "Valid on select items only",
                isVerified: "TRUE",
                isExclusive: "FALSE",
                isFeatured: "TRUE",
                expiresAt: "2026-12-31",
            },
            {
                title: "Free Delivery Deal",
                description: "Free delivery on orders above Rs.500",
                code: "",
                type: "deal",
                discountType: "flat",
                discountValue: "Free Delivery",
                storeSlug: "flipkart",
                affiliateUrl: "",
                termsConditions: "",
                isVerified: "TRUE",
                isExclusive: "FALSE",
                isFeatured: "FALSE",
                expiresAt: "",
            },
        ],
    },
    stores: {
        headers: [
            "name",
            "slug",
            "description",
            "website",
            "affiliateUrl",
            "cashbackRate",
            "categorySlug",
            "logo",
            "isActive",
            "isFeatured",
        ],
        sampleData: [
            {
                name: "Example Store",
                slug: "example-store",
                description: "A sample store description",
                website: "https://example.com",
                affiliateUrl: "https://example.com/?ref=couponhub",
                cashbackRate: "Up to 10%",
                categorySlug: "electronics",
                logo: "example-store.png",
                isActive: "TRUE",
                isFeatured: "TRUE",
            },
        ],
    },
    categories: {
        headers: [
            "name",
            "slug",
            "description",
            "icon",
            "displayOrder",
            "isActive",
            "isFeatured",
        ],
        sampleData: [
            {
                name: "Example Category",
                slug: "example-category",
                description: "A sample category",
                icon: "Shirt",
                displayOrder: "1",
                isActive: "TRUE",
                isFeatured: "TRUE",
            },
        ],
    },
};

export async function GET(request: NextRequest) {
    const session = await getSession();
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type") as keyof typeof templates;

    if (!type || !templates[type]) {
        return NextResponse.json(
            { error: "Invalid template type. Use: coupons, stores, or categories" },
            { status: 400 }
        );
    }

    const template = templates[type];

    // Create workbook
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(template.sampleData, {
        header: template.headers,
    });

    // Set column widths
    worksheet["!cols"] = template.headers.map(() => ({ wch: 20 }));

    XLSX.utils.book_append_sheet(workbook, worksheet, type);

    // Generate buffer
    const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

    return new NextResponse(buffer, {
        headers: {
            "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            "Content-Disposition": `attachment; filename="${type}-template.xlsx"`,
        },
    });
}
