import { z } from "zod";

export const workflowNodeSchema = z.object({
  id: z.string(),
  type: z.string(),
  position: z.object({
    x: z.number(),
    y: z.number(),
  }),
  data: z.object({
    title: z.string(),
    subtitle: z.string().optional(),
    details: z.record(z.string(), z.any()),
    stepNumber: z.number().optional(),
    status: z.enum(["ready", "configured", "pending", "executed"]).default("configured"),
    tool: z.string().optional(),
    model: z.string().optional(),
  }),
});

export const workflowEdgeSchema = z.object({
  id: z.string(),
  source: z.string(),
  target: z.string(),
  label: z.string().optional(),
  animated: z.boolean().default(true),
});

export const workflowSchema = z.object({
  id: z.string(),
  conceptId: z.string(),
  name: z.string(),
  createdAt: z.string(),
  nodes: z.array(workflowNodeSchema),
  edges: z.array(workflowEdgeSchema),
});

export type WorkflowNode = z.infer<typeof workflowNodeSchema>;
export type WorkflowEdge = z.infer<typeof workflowEdgeSchema>;
export type WorkflowData = z.infer<typeof workflowSchema>;
