import { NextRequest, NextResponse } from "next/server";
import { getWorkflowById } from "@/lib/supabase";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const workflow = await getWorkflowById(id);

    if (!workflow) {
      return NextResponse.json(
        { success: false, error: "Workflow not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      workflow,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch workflow" },
      { status: 500 }
    );
  }
}
