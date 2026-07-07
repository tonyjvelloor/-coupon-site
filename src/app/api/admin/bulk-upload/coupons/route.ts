import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import * as XLSX from "xlsx";
import { ImportPipeline } from "@/lib/import-engine/pipeline";
import { CsvConnector } from "@/lib/import-engine/connectors/csv-connector";

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
        
        // Convert to CSV string for the CsvConnector
        const csvData = XLSX.utils.sheet_to_csv(worksheet);

        if (!csvData || csvData.trim() === "") {
            return NextResponse.json({ error: "File is empty" }, { status: 400 });
        }

        const pipeline = new ImportPipeline();
        const connector = new CsvConnector(csvData);

        // Run pipeline
        const jobId = await pipeline.run(connector);

        return NextResponse.json({ 
            success: true, 
            jobId,
            message: "Import job queued and processed successfully." 
        });

    } catch (error) {
        console.error("Bulk upload error:", error);
        return NextResponse.json(
            { error: "Failed to process file" },
            { status: 500 }
        );
    }
}

