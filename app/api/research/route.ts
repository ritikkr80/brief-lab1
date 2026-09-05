import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { researchProductUrl } from "@/lib/firecrawl";

const requestSchema = z.object({
  url: z.string().url("A valid URL is required"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = requestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid URL provided",
          details: parsed.error.issues,
        },
        { status: 400 }
      );
    }

    const research = await researchProductUrl(parsed.data.url);

    return NextResponse.json({
      success: true,
      data: research,
    });
  } catch (error) {
    console.error("Research API error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to analyze product URL" },
      { status: 500 }
    );
  }
}
