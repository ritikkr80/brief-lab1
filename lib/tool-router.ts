import { HEXCODED_TOOLS, HexCodedTool } from "@/data/hexcoded-tools";

export interface RoutedToolResult {
  tool: string;
  model: string;
  reason: string;
}

export function routeConceptToTools(
  conceptType: string,
  hasDialogue: boolean,
  visualStyle: string,
  productContext: string
): RoutedToolResult[] {
  const normalizedType = conceptType.toLowerCase();
  const normalizedVisual = visualStyle.toLowerCase();
  const recommendations: RoutedToolResult[] = [];

  // Primary execution tool selection
  if (normalizedType.includes("testimonial") || normalizedType.includes("ugc") || hasDialogue) {
    const talkingActors = HEXCODED_TOOLS.find((t) => t.id === "talking-actors");
    if (talkingActors) {
      recommendations.push({
        tool: talkingActors.name,
        model: talkingActors.recommendedModels[0],
        reason:
          "Selected for realistic UGC direct-to-camera presentation with natural micro-expressions and accurate lip-sync.",
      });
    }
  } else if (
    normalizedType.includes("cinematic") ||
    normalizedType.includes("demo") ||
    normalizedVisual.includes("motion")
  ) {
    const kling = HEXCODED_TOOLS.find((t) => t.id === "kling");
    if (kling) {
      recommendations.push({
        tool: kling.name,
        model: kling.recommendedModels[0],
        reason:
          "Selected for fluid camera tracking, realistic thermal condensation physics, and high-framerate liquid motion.",
      });
    }
  } else {
    const creativeStudio = HEXCODED_TOOLS.find((t) => t.id === "creative-studio");
    if (creativeStudio) {
      recommendations.push({
        tool: creativeStudio.name,
        model: creativeStudio.recommendedModels[0],
        reason:
          "Selected for premium commercial packshot relighting and crisp product isolation against modern minimalist sets.",
      });
    }
  }

  // Audio / Voice routing
  if (hasDialogue) {
    const elevenLabs = HEXCODED_TOOLS.find((t) => t.id === "elevenlabs");
    if (elevenLabs && !recommendations.some((r) => r.tool === elevenLabs.name)) {
      recommendations.push({
        tool: elevenLabs.name,
        model: elevenLabs.recommendedModels[0],
        reason:
          "Generates conversational pacing with authentic breath pauses, vocal fry, and crisp ambient audio layers.",
      });
    }
  }

  // Post / Overlay routing
  const captions = HEXCODED_TOOLS.find((t) => t.id === "captions-ai");
  if (captions && recommendations.length < 3) {
    recommendations.push({
      tool: captions.name,
      model: captions.recommendedModels[0],
      reason:
        "Applies 9:16 mobile retention subtitle treatments and conversion-optimized call-to-action badges.",
    });
  }

  return recommendations;
}

export function getAllTools(): HexCodedTool[] {
  return HEXCODED_TOOLS;
}
