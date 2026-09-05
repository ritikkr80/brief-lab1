export interface HexCodedTool {
  id: string;
  name: string;
  category: "video" | "creative" | "image" | "audio" | "post-production";
  description: string;
  capabilities: string[];
  recommendedModels: string[];
  bestFor: string[];
  apiStatus: "production" | "experimental" | "supported";
}

export const HEXCODED_TOOLS: HexCodedTool[] = [
  {
    id: "talking-actors",
    name: "Talking Actors",
    category: "video",
    description: "HexCoded native pipeline for digital human presenters, lip-sync, and UGC talking-head delivery.",
    capabilities: [
      "AI actors",
      "spoken dialogue",
      "UGC",
      "lip-sync",
      "direct-to-camera",
      "casual testimonial"
    ],
    recommendedModels: ["Talking-Actor-v2.1-HQ", "LivePortrait-Ultra"],
    bestFor: [
      "Testimonial concepts",
      "Direct-to-camera founder reels",
      "Conversational UGC reviews"
    ],
    apiStatus: "production"
  },
  {
    id: "creative-studio",
    name: "Creative Studio",
    category: "creative",
    description: "Multi-modal suite for compositing, brand asset harmonization, and studio lighting pass.",
    capabilities: [
      "image generation",
      "image editing",
      "product shot replacement",
      "relighting",
      "packshot clean-up"
    ],
    recommendedModels: ["Hex-Studio-Pro-v3", "Flux-1.1-Pro-Ultra"],
    bestFor: [
      "Macro product close-ups",
      "Clean e-commerce packshots",
      "Side-by-side comparison graphics"
    ],
    apiStatus: "production"
  },
  {
    id: "kling",
    name: "Kling",
    category: "video",
    description: "Fluid physical simulation and continuous camera tracking for motion b-roll and kinetic action.",
    capabilities: [
      "text-to-video",
      "image-to-video",
      "fluid dynamics",
      "high-speed motion",
      "macro liquid simulation"
    ],
    recommendedModels: ["Kling-1.5-Pro", "Kling-Standard"],
    bestFor: [
      "Condensation & ice droplets on bottles",
      "Gym commute action shots",
      "High dynamic range product reveals"
    ],
    apiStatus: "production"
  },
  {
    id: "runway-gen3",
    name: "Runway Gen-3 Alpha",
    category: "video",
    description: "Cinematic camera movement, precise temporal consistency, and narrative b-roll.",
    capabilities: [
      "photorealistic video",
      "camera control",
      "motion brush",
      "narrative atmosphere"
    ],
    recommendedModels: ["Gen-3-Alpha-Turbo", "Gen-3-Alpha-HQ"],
    bestFor: [
      "Cinematic urban morning b-roll",
      "Subway commute atmosphere",
      "Moody athletic gym sequences"
    ],
    apiStatus: "production"
  },
  {
    id: "elevenlabs",
    name: "ElevenLabs",
    category: "audio",
    description: "Nuanced emotional voiceover, conversational pacing, and ambient sound effects.",
    capabilities: [
      "voice cloning",
      "conversational tone",
      "emotional pacing",
      "multilingual speech",
      "environmental sfx"
    ],
    recommendedModels: ["Eleven-Multilingual-v2", "Eleven-Turbo-v2.5"],
    bestFor: [
      "Natural conversational voiceover",
      "Ice cube clinking and vacuum seal pop sfx",
      "Regional accent localization"
    ],
    apiStatus: "production"
  },
  {
    id: "captions-ai",
    name: "Captions AI / Overlay",
    category: "post-production",
    description: "High-retention mobile subtitle formatting, kinetic text emphasis, and CTA cards.",
    capabilities: [
      "kinetic captions",
      "dynamic callouts",
      "price pill overlays",
      "CTA card generation"
    ],
    recommendedModels: ["Captions-Kinetic-v2", "AutoReel-Overlay"],
    bestFor: [
      "Mobile 9:16 thumb-stop hooks",
      "Price tag highlight (e.g. ₹899 / $29)",
      "Shopify bio-link call to action"
    ],
    apiStatus: "production"
  }
];
