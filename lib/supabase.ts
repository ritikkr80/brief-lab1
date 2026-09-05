import { Concept } from "@/schemas/concept";
import { WorkflowData } from "@/schemas/workflow";

// In-memory store for instant recruiter demonstration without requiring active Supabase credentials
const memoryStore = {
  briefs: new Map<string, any>(),
  concepts: new Map<string, Concept>(),
  workflows: new Map<string, WorkflowData>(),
};

export async function saveBrief(brief: {
  id: string;
  product: string;
  productUrl?: string;
  audience?: string;
  platform: string;
  tone: string;
  conceptCount: number;
}) {
  memoryStore.briefs.set(brief.id, { ...brief, createdAt: new Date().toISOString() });
  return brief;
}

export async function saveConcepts(briefId: string, concepts: Concept[]) {
  for (const c of concepts) {
    memoryStore.concepts.set(c.id, c);
  }
  return concepts;
}

export async function getConceptById(id: string): Promise<Concept | null> {
  return memoryStore.concepts.get(id) || null;
}

export async function saveWorkflow(workflow: WorkflowData): Promise<WorkflowData> {
  memoryStore.workflows.set(workflow.id, workflow);
  return workflow;
}

export async function getWorkflowById(id: string): Promise<WorkflowData | null> {
  return memoryStore.workflows.get(id) || null;
}
