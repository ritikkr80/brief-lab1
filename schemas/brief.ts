import { z } from "zod";

export const briefSchema = z.object({
  product: z
    .string()
    .min(10, "Product description must be at least 10 characters")
    .max(2000, "Product description too long"),
  productUrl: z
    .string()
    .url("Invalid URL")
    .optional()
    .or(z.literal("")),
  audience: z.string().optional(),
  platform: z.string().default("Instagram Reels"),
  tone: z.string().default("UGC, casual"),
  conceptCount: z.number().min(1).max(5).default(3),
});

export interface BriefInput {
  product: string;
  productUrl?: string;
  audience?: string;
  platform: string;
  tone: string;
  conceptCount: number;
}
