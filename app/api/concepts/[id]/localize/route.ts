import { NextRequest, NextResponse } from "next/server";
import { getConceptById } from "@/lib/supabase";
import { localizeConceptWithAI } from "@/lib/anthropic";
import { Concept } from "@/schemas/concept";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { targetMarket, conceptData } = body;

    let concept: Concept | null = conceptData || null;

    if (!concept) {
      concept = await getConceptById(id);
    }

    if (!concept) {
      return NextResponse.json(
        { success: false, error: "Concept not found for localization" },
        { status: 404 }
      );
    }

    const localization = await localizeConceptWithAI({
      concept,
      targetMarket: targetMarket || "India (Hinglish)",
    });

    return NextResponse.json({
      success: true,
      localization,
    });
  } catch (error: any) {
    console.error("Localization error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error?.message || "Failed to localize concept",
      },
      { status: 500 }
    );
  }
}
