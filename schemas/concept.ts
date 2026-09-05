import { z } from "zod";

export const shotSchema = z.object({
  number: z.number(),
  visual: z.string(),
  dialogue: z.string().optional().default(""),
  duration: z.string().optional().default("3s"),
});

export const castingSchema = z.object({
  description: z.string(),
  ageRange: z.string().optional(),
  gender: z.string().optional(),
  personality: z.string().optional(),
  environment: z.string().optional(),
});

export const recommendedToolSchema = z.object({
  tool: z.string(),
  model: z.string().optional(),
  reason: z.string(),
});

export const conceptSchema = z.object({
  id: z.string(),
  conceptType: z.string(),
  title: z.string(),
  hook: z.string(),
  shots: z.array(shotSchema).min(2),
  casting: castingSchema,
  cta: z.string(),
  platform: z.string(),
  recommendedTools: z.array(recommendedToolSchema).min(1),
  productionNotes: z.array(z.string()).default([]),
});

export const conceptsResponseSchema = z.object({
  briefId: z.string().optional(),
  concepts: z.array(conceptSchema).min(1),
});

export type Shot = z.infer<typeof shotSchema>;
export type Casting = z.infer<typeof castingSchema>;
export type RecommendedTool = z.infer<typeof recommendedToolSchema>;
export type Concept = z.infer<typeof conceptSchema>;
export type ConceptsResponse = z.infer<typeof conceptsResponseSchema>;
