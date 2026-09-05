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

    const exportPayload = {
      exportVersion: "1.0",
      generator: "HexCoded Brief Lab Companion",
      timestamp: new Date().toISOString(),
      workflow,
    };

    return new NextResponse(JSON.stringify(exportPayload, null, 2), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename="hexcoded-workflow-${id}.json"`,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to export workflow" },
      { status: 500 }
    );
  }
}
