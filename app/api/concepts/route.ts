import { NextRequest, NextResponse } from "next/server";
import { briefSchema } from "@/schemas/brief";
import { generateConceptsWithAI } from "@/lib/anthropic";
import { saveBrief, saveConcepts } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validation = briefSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid brief input parameters",
          issues: validation.error.issues,
        },
        { status: 400 }
      );
    }

    const { product, productUrl, audience, platform, tone, conceptCount } = validation.data;
    const briefId = `brief-${Date.now()}`;

    // Save initial brief metadata
    await saveBrief({
      id: briefId,
      product,
      productUrl,
      audience,
      platform,
      tone,
      conceptCount,
    });

    // Run AI Creative Director
    const concepts = await generateConceptsWithAI({
      product,
      productUrl,
      audience,
      platform,
      tone,
      conceptCount,
    });

    // Persist concepts
    await saveConcepts(briefId, concepts);

    return NextResponse.json({
      success: true,
      briefId,
      conceptCount: concepts.length,
      concepts,
    });
  } catch (error: any) {
    console.error("Error generating concepts in /api/concepts:", error);
    return NextResponse.json(
      {
        success: false,
        error: error?.message || "Failed to generate creative concepts",
      },
      { status: 500 }
    );
  }
}
