"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, RefreshCw, Layers } from "lucide-react";
import { Header } from "@/components/header";
import { WorkflowCanvas } from "@/components/workflow-canvas";
import { WorkflowData } from "@/schemas/workflow";
import { ReactFlowProvider } from "@xyflow/react";

function WorkflowContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const conceptId = searchParams.get("conceptId");

  const [loading, setLoading] = useState(true);
  const [workflow, setWorkflow] = useState<WorkflowData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadWorkflow() {
      setLoading(true);
      setError(null);

      try {
        let cachedConcept: any = null;
        if (typeof window !== "undefined") {
          const stored = sessionStorage.getItem("active_workflow_concept");
          if (stored) {
            try {
              cachedConcept = JSON.parse(stored);
            } catch (e) {}
          }
        }

        const effectiveId = conceptId || cachedConcept?.id || "demo-water-bottle-1";

        const res = await fetch(`/api/concepts/${effectiveId}/workflow`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            conceptData: cachedConcept,
          }),
        });

        const data = await res.json();
        if (data.success && data.workflow) {
          setWorkflow(data.workflow);
        } else {
          setError(data.error || "Failed to initialize workflow canvas");
        }
      } catch (err: any) {
        setError(err?.message || "Failed to load workflow data");
      } finally {
        setLoading(false);
      }
    }

    loadWorkflow();
  }, [conceptId]);

  return (
    <div className="flex-1 flex flex-col p-4 sm:p-6 max-w-7xl w-full mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center space-x-2 text-xs font-mono text-[#6F6A61] hover:text-[#171717] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Briefs & Concepts</span>
        </Link>
        <span className="font-mono text-xs text-[#6F6A61]">
          Editable node graph with pan, zoom & export
        </span>
      </div>

      <div className="flex-1 flex flex-col min-h-[720px]">
        {loading && (
          <div className="flex-1 flex flex-col items-center justify-center space-y-3 bg-[#FAF7F0] border border-[#DDD8CE] rounded-md min-h-[500px]">
            <RefreshCw className="w-6 h-6 text-[#EF432F] animate-spin" />
            <p className="font-mono text-xs text-[#6F6A61]">
              Constructing HexCoded node graph from concept pipeline...
            </p>
          </div>
        )}

        {error && (
          <div className="p-8 text-center bg-[#FAF7F0] border border-[#DDD8CE] rounded-md space-y-4">
            <p className="font-mono text-xs text-rose-600">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-[#171717] text-[#FFFFFF] font-mono text-xs rounded-sm"
            >
              Retry Canvas Generation
            </button>
          </div>
        )}

        {workflow && !loading && (
          <ReactFlowProvider>
            <WorkflowCanvas initialWorkflow={workflow} />
          </ReactFlowProvider>
        )}
      </div>
    </div>
  );
}

export default function WorkflowPage() {
  return (
    <main className="min-h-screen flex flex-col bg-[#F7F5F0]">
      <Header />
      <Suspense
        fallback={
          <div className="flex-1 flex items-center justify-center">
            <RefreshCw className="w-6 h-6 text-[#EF432F] animate-spin" />
          </div>
        }
      >
        <WorkflowContent />
      </Suspense>
    </main>
  );
}
