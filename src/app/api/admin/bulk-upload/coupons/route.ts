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
            const rowNum = i + 2; // Excel rows start at 1, plus header

            try {
                // Validate required fields
                if (!row.title || !row.storeSlug) {
                    results.errors.push({ row: rowNum, error: "Missing required fields: title, storeSlug" });
                    results.failed++;
                    continue;
                }

                // Find the store by slug
                const store = await prisma.store.findUnique({
                    where: { slug: String(row.storeSlug) },
                });

                if (!store) {
                    results.errors.push({ row: rowNum, error: `Store not found: ${row.storeSlug}` });
                    results.failed++;
                    continue;
                }

                // Parse expiry date if provided
                let expiresAt: Date | null = null;
                if (row.expiresAt) {
                    const dateValue = row.expiresAt;
                    if (typeof dateValue === "number") {
                        // Excel serial date number
                        expiresAt = new Date((dateValue - 25569) * 86400 * 1000);
                    } else {
                        expiresAt = new Date(String(dateValue));
                    }
                    if (isNaN(expiresAt.getTime())) {
                        expiresAt = null;
                    }
                }

                // Create the coupon
                await prisma.coupon.create({
                    data: {
                        title: String(row.title),
                        description: row.description ? String(row.description) : null,
                        code: row.code ? String(row.code) : null,
                        type: String(row.type || "coupon"),
                        discountType: row.discountType ? String(row.discountType) : "percentage",
                        discountValue: row.discountValue ? String(row.discountValue) : null,
                        affiliateUrl: row.affiliateUrl ? String(row.affiliateUrl) : (store.affiliateUrl || ""),
                        termsConditions: row.termsConditions ? String(row.termsConditions) : null,
                        expiresAt,
                        isVerified: row.isVerified === true || row.isVerified === "TRUE" || row.isVerified === "true",
                        isExclusive: row.isExclusive === true || row.isExclusive === "TRUE" || row.isExclusive === "true",
                        isFeatured: row.isFeatured === true || row.isFeatured === "TRUE" || row.isFeatured === "true",
                        storeId: store.id,
                    },
                });

                results.success++;
            } catch (error) {
                results.errors.push({
                    row: rowNum,
                    error: error instanceof Error ? error.message : "Unknown error",
                });
                results.failed++;
            }
        }

        // Update store offer counts
        const storeUpdates = new Set(
            data
                .filter((row) => row.storeSlug)
                .map((row) => String(row.storeSlug))
        );

        for (const slug of storeUpdates) {
            const count = await prisma.coupon.count({
                where: { store: { slug } },
            });
            await prisma.store.update({
                where: { slug },
                data: { offerCount: count },
            });
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
