import { NextRequest, NextResponse } from "next/server";
import { getConceptById, saveWorkflow } from "@/lib/supabase";
import { Concept } from "@/schemas/concept";
import { WorkflowData } from "@/schemas/workflow";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json().catch(() => ({}));
    let concept: Concept | null = body.conceptData || null;

    if (!concept) {
      concept = await getConceptById(id);
    }

    if (!concept) {
      return NextResponse.json(
        { success: false, error: "Concept not found to build workflow" },
        { status: 404 }
      );
    }

    const workflowId = `wf-${Date.now()}`;
    const nodes = buildWorkflowNodes(concept);
    const edges = buildWorkflowEdges(nodes);

    const workflowData: WorkflowData = {
      id: workflowId,
      conceptId: concept.id,
      name: `${concept.title} — Production Graph`,
      createdAt: new Date().toISOString(),
      nodes,
      edges,
    };

    await saveWorkflow(workflowData);

    return NextResponse.json({
      success: true,
      workflow: workflowData,
    });
  } catch (error: any) {
    console.error("Workflow build error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to create workflow" },
      { status: 500 }
    );
  }
}

function buildWorkflowNodes(concept: Concept) {
  const xCenter = 280;
  let yOffset = 40;
  const yGap = 160;

  const primaryTool = concept.recommendedTools[0] || {
    tool: "Talking Actors",
    model: "Talking-Actor-v2.1-HQ",
    reason: "Direct conversational UGC delivery",
  };

  const secondaryTool = concept.recommendedTools[1] || {
    tool: "Creative Studio",
    model: "Flux-1.1-Pro-Ultra",
    reason: "Packshot isolation and studio lighting",
  };

  return [
    {
      id: "node-brief",
      type: "briefNode",
      position: { x: xCenter, y: yOffset },
      data: {
        title: "Product Brief & Constraints",
        subtitle: concept.platform,
        stepNumber: 1,
        status: "executed" as const,
        details: {
          conceptType: concept.conceptType,
          platform: concept.platform,
          hookSummary: concept.hook,
        },
      },
    },
    {
      id: "node-director",
      type: "directorNode",
      position: { x: xCenter, y: (yOffset += yGap) },
      data: {
        title: "AI Creative Director",
        subtitle: concept.title,
        stepNumber: 2,
        status: "executed" as const,
        details: {
          hook: concept.hook,
          strategy: concept.conceptType,
          productionNotes: concept.productionNotes,
        },
      },
    },
    {
      id: "node-script",
      type: "scriptNode",
      position: { x: xCenter, y: (yOffset += yGap) },
      data: {
        title: "Script & Shot List",
        subtitle: `${concept.shots.length} production beats`,
        stepNumber: 3,
        status: "configured" as const,
        details: {
          shots: concept.shots,
          totalDuration: `${concept.shots.length * 3.5}s estimated`,
        },
      },
    },
    {
      id: "node-casting",
      type: "castingNode",
      position: { x: xCenter, y: (yOffset += yGap) },
      data: {
        title: "Casting & Persona Specs",
        subtitle: concept.casting.ageRange ? `${concept.casting.ageRange} yrs` : "Target Persona",
        stepNumber: 4,
        status: "configured" as const,
        details: {
          persona: concept.casting.description,
          personality: concept.casting.personality || "Approachable & natural",
          environment: concept.casting.environment || "Modern studio",
        },
      },
    },
    {
      id: "node-actor",
      type: "generationNode",
      position: { x: xCenter, y: (yOffset += yGap) },
      data: {
        title: primaryTool.tool,
        subtitle: primaryTool.model || "Production Model",
        tool: primaryTool.tool,
        model: primaryTool.model,
        stepNumber: 5,
        status: "ready" as const,
        details: {
          purpose: "Facial animation & speech generation",
          reason: primaryTool.reason,
          fps: "30fps 9:16 vertical",
        },
      },
    },
    {
      id: "node-video",
      type: "videoNode",
      position: { x: xCenter, y: (yOffset += yGap) },
      data: {
        title: secondaryTool.tool,
        subtitle: secondaryTool.model || "Physics & B-roll Engine",
        tool: secondaryTool.tool,
        model: secondaryTool.model,
        stepNumber: 6,
        status: "ready" as const,
        details: {
          purpose: "B-roll plates & macro textures",
          reason: secondaryTool.reason,
          audioPacing: "Sync to voiceplate track",
        },
      },
    },
    {
      id: "node-cta",
      type: "ctaNode",
      position: { x: xCenter, y: (yOffset += yGap) },
      data: {
        title: "CTA & Retention Graphics",
        subtitle: "Overlay & Subtitles",
        tool: "Captions AI / Overlay",
        stepNumber: 7,
        status: "configured" as const,
        details: {
          campaignCta: concept.cta,
          subtitles: "Dynamic animated 9:16 kinetic text",
        },
      },
    },
    {
      id: "node-export",
      type: "exportNode",
      position: { x: xCenter, y: (yOffset += yGap) },
      data: {
        title: "Production Render Assembly",
        subtitle: "HexCoded Pipeline Dispatch",
        stepNumber: 8,
        status: "ready" as const,
        details: {
          outputFormat: "MP4 / H.265 1080x1920 (9:16)",
          status: "Ready for pipeline export",
        },
      },
    },
  ];
}

function buildWorkflowEdges(nodes: any[]) {
  const edges = [];
  for (let i = 0; i < nodes.length - 1; i++) {
    edges.push({
      id: `edge-${nodes[i].id}-${nodes[i + 1].id}`,
      source: nodes[i].id,
      target: nodes[i + 1].id,
      animated: true,
      label: i === 4 ? "sync audio/video" : undefined,
    });
  }
  return edges;
}
