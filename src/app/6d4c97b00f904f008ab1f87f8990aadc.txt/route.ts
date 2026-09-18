import { NextResponse } from "next/server";

export async function GET() {
  return new NextResponse("6d4c97b00f904f008ab1f87f8990aadc", {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
