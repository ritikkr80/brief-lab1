import { NextRequest, NextResponse } from "next/server";
import { getConceptById } from "@/lib/supabase";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const concept = await getConceptById(id);

    if (!concept) {
      return NextResponse.json(
        { success: false, error: "Concept not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      concept,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to retrieve concept" },
      { status: 500 }
    );
  }
}
