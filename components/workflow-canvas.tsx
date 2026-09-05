"use client";

import React, { useState, useMemo, useCallback } from "react";
import {
  ReactFlow,
  Controls,
  Background,
  applyNodeChanges,
  applyEdgeChanges,
  NodeChange,
  EdgeChange,
  Handle,
  Position,
  MiniMap,
  Panel,
  ReactFlowProvider,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import {
  FileText,
  Sparkles,
  UserCheck,
  Cpu,
  Film,
  Megaphone,
  Download,
  Copy,
  Check,
  ExternalLink,
  Settings,
  Layers,
  CheckCircle2,
} from "lucide-react";
import { WorkflowData } from "@/schemas/workflow";

// Custom Node Component matching Brief Lab's warm paper editorial style
function CustomEditorialNode({ data, id }: any) {
  const [expanded, setExpanded] = useState(false);

  const getIcon = () => {
    const title = (data.title || "").toLowerCase();
    if (title.includes("brief")) return <FileText className="w-3.5 h-3.5 text-[#171717]" />;
    if (title.includes("director")) return <Sparkles className="w-3.5 h-3.5 text-[#EF432F]" />;
    if (title.includes("script")) return <Layers className="w-3.5 h-3.5 text-[#6F6A61]" />;
    if (title.includes("casting")) return <UserCheck className="w-3.5 h-3.5 text-[#10B981]" />;
    if (title.includes("actor") || title.includes("talking")) return <Cpu className="w-3.5 h-3.5 text-[#EF432F]" />;
    if (title.includes("video") || title.includes("kling") || title.includes("runway")) return <Film className="w-3.5 h-3.5 text-[#3B82F6]" />;
    if (title.includes("cta") || title.includes("overlay")) return <Megaphone className="w-3.5 h-3.5 text-[#F59E0B]" />;
    return <Settings className="w-3.5 h-3.5 text-[#6F6A61]" />;
  };

  return (
    <div className="w-72 bg-[#FFFFFF] border-2 border-[#DDD8CE] hover:border-[#171717] rounded-sm shadow-md transition-all font-sans text-left">
      <Handle type="target" position={Position.Top} className="!bg-[#171717] !w-2.5 !h-2.5 !border-2 !border-[#FAF7F0]" />

      {/* Node Header */}
      <div className="p-3 bg-[#FAF7F0] border-b border-[#DDD8CE] flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {getIcon()}
          <div>
            <span className="font-mono text-[10px] uppercase tracking-wider text-[#6F6A61] block leading-none">
              Step {data.stepNumber || 1}
            </span>
            <span className="text-xs font-semibold text-[#171717] leading-tight line-clamp-1">
              {data.title}
            </span>
          </div>
        </div>

        <span className="font-mono text-[9px] uppercase px-1.5 py-0.5 rounded-xs bg-[#EFE9DC] text-[#171717] border border-[#DDD8CE]">
          {data.status || "Ready"}
        </span>
      </div>

      {/* Node Body */}
      <div className="p-3 text-xs space-y-2">
        {data.subtitle && (
          <p className="font-mono text-[11px] text-[#6F6A61] border-b border-[#DDD8CE]/60 pb-1.5">
            {data.subtitle}
          </p>
        )}

        {data.details && (
          <div className="space-y-1.5 text-[11px] text-[#171717]">
            {data.details.purpose && (
              <p className="text-[#6F6A61] leading-snug">
                <strong className="text-[#171717]">Purpose:</strong> {data.details.purpose}
              </p>
            )}
            {data.details.hookSummary && (
              <p className="italic text-[#171717] line-clamp-2">
                “{data.details.hookSummary}”
              </p>
            )}
            {data.details.campaignCta && (
              <p className="font-medium text-[#171717] bg-[#FAF7F0] p-1.5 rounded-xs border border-[#DDD8CE]/60">
                CTA: {data.details.campaignCta}
              </p>
            )}
            {data.details.persona && (
              <p className="text-[#6F6A61] line-clamp-2 leading-relaxed">
                {data.details.persona}
              </p>
            )}
            {data.details.reason && (
              <p className="font-mono text-[10px] text-[#6F6A61] leading-tight">
                ↳ {data.details.reason}
              </p>
            )}
            {data.details.totalDuration && (
              <span className="inline-block font-mono text-[10px] text-[#171717] bg-[#F1EBDD] px-1.5 py-0.5 rounded border border-[#DDD8CE]">
                Duration: {data.details.totalDuration}
              </span>
            )}
          </div>
        )}
      </div>

      <Handle type="source" position={Position.Bottom} className="!bg-[#171717] !w-2.5 !h-2.5 !border-2 !border-[#FAF7F0]" />
    </div>
  );
}

interface WorkflowCanvasProps {
  initialWorkflow: WorkflowData;
}

export function WorkflowCanvas({ initialWorkflow }: WorkflowCanvasProps) {
  const [nodes, setNodes] = useState<any[]>(initialWorkflow.nodes);
  const [edges, setEdges] = useState<any[]>(initialWorkflow.edges);
  const [copied, setCopied] = useState(false);
  const [showJsonModal, setShowJsonModal] = useState(false);

  const nodeTypes = useMemo(
    () => ({
      briefNode: CustomEditorialNode,
      directorNode: CustomEditorialNode,
      scriptNode: CustomEditorialNode,
      castingNode: CustomEditorialNode,
      generationNode: CustomEditorialNode,
      videoNode: CustomEditorialNode,
      ctaNode: CustomEditorialNode,
      exportNode: CustomEditorialNode,
    }),
    []
  );

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  const currentWorkflowData: WorkflowData = {
    ...initialWorkflow,
    nodes,
    edges,
  };

  const handleCopyWorkflow = () => {
    navigator.clipboard.writeText(JSON.stringify(currentWorkflowData, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadJson = () => {
    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(currentWorkflowData, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute(
      "download",
      `hexcoded-workflow-${initialWorkflow.id}.json`
    );
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="w-full h-full min-h-[680px] relative border border-[#DDD8CE] rounded-md overflow-hidden bg-[#F7F5F0]">
      {/* Canvas Top Bar */}
      <div className="absolute top-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
        <div className="bg-[#FAF7F0]/90 backdrop-blur-sm border border-[#DDD8CE] px-4 py-2 rounded-sm shadow-xs pointer-events-auto">
          <span className="font-mono text-[10px] uppercase tracking-wider text-[#EF432F] font-semibold block">
            HexCoded Pipeline Canvas
          </span>
          <h2 className="font-serif text-base text-[#171717] font-medium">
            {initialWorkflow.name}
          </h2>
        </div>

        <div className="flex items-center space-x-2 pointer-events-auto">
          <button
            onClick={handleCopyWorkflow}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-[#FFFFFF] border border-[#DDD8CE] hover:border-[#171717] text-xs font-mono text-[#171717] rounded-sm transition-colors shadow-xs"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? "Copied JSON!" : "Copy Workflow"}</span>
          </button>

          <button
            onClick={() => setShowJsonModal(true)}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-[#171717] hover:bg-[#2e2e2e] text-xs font-mono text-[#FFFFFF] rounded-sm transition-colors shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Pipeline JSON</span>
          </button>
        </div>
      </div>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        fitView
        fitViewOptions={{ padding: 0.3 }}
        minZoom={0.2}
        maxZoom={1.5}
      >
        <Background color="#DDD8CE" gap={20} size={1} />
        <Controls className="!bg-[#FFFFFF] !border-[#DDD8CE] !rounded-sm !shadow-xs" />
        <MiniMap
          nodeColor="#171717"
          maskColor="rgba(247, 245, 240, 0.7)"
          className="!border-[#DDD8CE] !rounded-sm !bg-[#FAF7F0]"
        />
      </ReactFlow>

      {/* JSON Inspector / Export Modal */}
      {showJsonModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#171717]/40 backdrop-blur-xs">
          <div className="bg-[#FFFFFF] border border-[#DDD8CE] rounded-md shadow-2xl max-w-3xl w-full max-h-[85vh] flex flex-col">
            <div className="px-6 py-4 border-b border-[#DDD8CE] flex items-center justify-between bg-[#FAF7F0]">
              <h3 className="font-serif text-lg font-semibold text-[#171717]">
                HexCoded Node Graph Export JSON
              </h3>
              <button
                onClick={() => setShowJsonModal(false)}
                className="text-xs font-mono text-[#6F6A61] hover:text-[#171717]"
              >
                Close
              </button>
            </div>

            <div className="p-6 overflow-y-auto font-mono text-xs bg-[#171717] text-[#FAF7F0] flex-1">
              <pre className="whitespace-pre-wrap leading-relaxed">
                {JSON.stringify(currentWorkflowData, null, 2)}
              </pre>
            </div>

            <div className="px-6 py-3 border-t border-[#DDD8CE] flex items-center justify-end space-x-3 bg-[#FAF7F0]">
              <button
                onClick={handleCopyWorkflow}
                className="px-3 py-1.5 border border-[#DDD8CE] bg-[#FFFFFF] hover:border-[#171717] text-xs font-mono text-[#171717] rounded-sm transition-colors"
              >
                {copied ? "Copied to Clipboard" : "Copy to Clipboard"}
              </button>
              <button
                onClick={handleDownloadJson}
                className="px-4 py-1.5 bg-[#EF432F] hover:bg-[#D93825] text-xs font-mono text-[#FFFFFF] rounded-sm transition-colors"
              >
                Download .JSON File
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
