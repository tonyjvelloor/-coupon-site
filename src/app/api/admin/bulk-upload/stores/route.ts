import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import * as XLSX from "xlsx";

export async function POST(request: NextRequest) {
    const session = await getSession();
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const formData = await request.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json({ error: "No file provided" }, { status: 400 });
        }

        // Read file buffer
        const buffer = Buffer.from(await file.arrayBuffer());
        const workbook = XLSX.read(buffer, { type: "buffer" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const data = XLSX.utils.sheet_to_json(worksheet) as Record<string, unknown>[];

        if (data.length === 0) {
            return NextResponse.json({ error: "Excel file is empty" }, { status: 400 });
        }

        const results = {
            total: data.length,
            success: 0,
            failed: 0,
            errors: [] as { row: number; error: string }[],
        };

        for (let i = 0; i < data.length; i++) {
            const row = data[i];
            const rowNum = i + 2;

            try {
                // Validate required fields
                if (!row.name || !row.slug) {
                    results.errors.push({ row: rowNum, error: "Missing required fields: name, slug" });
                    results.failed++;
                    continue;
                }

                // Check if store already exists
                const existingStore = await prisma.store.findUnique({
                    where: { slug: String(row.slug) },
                });

                if (existingStore) {
                    // Update existing store
                    await prisma.store.update({
                        where: { slug: String(row.slug) },
                        data: {
                            name: String(row.name),
                            description: row.description ? String(row.description) : null,
                            website: row.website ? String(row.website) : "",
                            affiliateUrl: row.affiliateUrl ? String(row.affiliateUrl) : null,
                            cashbackRate: row.cashbackRate ? String(row.cashbackRate) : null,
                            logo: row.logo ? `/uploads/stores/${row.logo}` : existingStore.logo,
                            isActive: row.isActive !== false && row.isActive !== "FALSE",
                            isFeatured: row.isFeatured === true || row.isFeatured === "TRUE" || row.isFeatured === "true",
                        },
                    });
                } else {
                    // Create new store
                    const store = await prisma.store.create({
                        data: {
                            name: String(row.name),
                            slug: String(row.slug),
                            description: row.description ? String(row.description) : null,
                            website: row.website ? String(row.website) : "",
                            affiliateUrl: row.affiliateUrl ? String(row.affiliateUrl) : null,
                            cashbackRate: row.cashbackRate ? String(row.cashbackRate) : null,
                            logo: row.logo ? `/uploads/stores/${row.logo}` : null,
                            isActive: row.isActive !== false && row.isActive !== "FALSE",
                            isFeatured: row.isFeatured === true || row.isFeatured === "TRUE" || row.isFeatured === "true",
                        },
                    });

                    // Handle category association
                    if (row.categorySlug) {
                        const category = await prisma.category.findUnique({
                            where: { slug: String(row.categorySlug) },
                        });
                        if (category) {
                            await prisma.storeCategory.create({
                                data: {
                                    storeId: store.id,
                                    categoryId: category.id,
                                },
                            });
                        }
                    }
                }

                results.success++;
            } catch (error) {
                results.errors.push({
                    row: rowNum,
                    error: error instanceof Error ? error.message : "Unknown error",
                });
                results.failed++;
            }
        }

        return NextResponse.json(results);
    } catch (error) {
        console.error("Bulk upload error:", error);
        return NextResponse.json(
            { error: "Failed to process file" },
            { status: 500 }
        );
    }
}
