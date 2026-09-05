import { NextResponse } from "next/server";
import { getAllTools } from "@/lib/tool-router";

export async function GET() {
  try {
    const tools = getAllTools();
    return NextResponse.json({
      success: true,
      count: tools.length,
      tools,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch tool catalog" },
      { status: 500 }
    );
  }
}
