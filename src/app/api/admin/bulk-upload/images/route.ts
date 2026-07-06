import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";

export async function POST(request: NextRequest) {
    const session = await getSession();
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const formData = await request.formData();
        const files = formData.getAll("files") as File[];
        const folder = formData.get("folder") as string || "stores";

        if (files.length === 0) {
            return NextResponse.json({ error: "No files provided" }, { status: 400 });
        }

        // Ensure upload directory exists
        const uploadDir = path.join(process.cwd(), "public", "uploads", folder);
        if (!existsSync(uploadDir)) {
            await mkdir(uploadDir, { recursive: true });
        }

        const results = {
            total: files.length,
            success: 0,
            failed: 0,
            uploaded: [] as { filename: string; url: string }[],
            errors: [] as { filename: string; error: string }[],
        };

        for (const file of files) {
            try {
                // Validate file type
                const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"];
                if (!validTypes.includes(file.type)) {
                    results.errors.push({
                        filename: file.name,
                        error: `Invalid file type: ${file.type}`,
                    });
                    results.failed++;
                    continue;
                }

                // Generate unique filename
                const ext = path.extname(file.name);
                const baseName = path.basename(file.name, ext)
                    .toLowerCase()
                    .replace(/[^a-z0-9]/g, "-")
                    .replace(/-+/g, "-");
                const timestamp = Date.now();
                const filename = `${baseName}-${timestamp}${ext}`;

                // Save file
                const buffer = Buffer.from(await file.arrayBuffer());
                const filePath = path.join(uploadDir, filename);
                await writeFile(filePath, buffer);

                const url = `/uploads/${folder}/${filename}`;
                results.uploaded.push({ filename: file.name, url });
                results.success++;
            } catch (error) {
                results.errors.push({
                    filename: file.name,
                    error: error instanceof Error ? error.message : "Unknown error",
                });
                results.failed++;
            }
        }

        return NextResponse.json(results);
    } catch (error) {
        console.error("Image upload error:", error);
        return NextResponse.json(
            { error: "Failed to process images" },
            { status: 500 }
        );
    }
}
