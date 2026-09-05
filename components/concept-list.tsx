"use client";

import { useState } from "react";
import { Sparkles, Layers, Download, Check } from "lucide-react";
import { Concept } from "@/schemas/concept";
import { ConceptCard } from "./concept-card";

interface ConceptListProps {
  concepts: Concept[];
  onSelectWorkflow?: (concept: Concept) => void;
}

export function ConceptList({ concepts, onSelectWorkflow }: ConceptListProps) {
  const [copiedAll, setCopiedAll] = useState(false);

  const handleExportAll = () => {
    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(concepts, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `brief-lab-concepts-${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Result list header */}
      <div className="flex items-center justify-between border-b border-[#DDD8CE] pb-3">
        <div className="flex items-center space-x-2">
          <Layers className="w-4 h-4 text-[#EF432F]" />
          <h2 className="font-serif text-xl sm:text-2xl text-[#171717] font-medium">
            {concepts.length} concepts ready
          </h2>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleExportAll}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-[#FFFFFF] border border-[#DDD8CE] hover:border-[#171717] text-xs font-mono text-[#171717] rounded-sm transition-colors shadow-2xs"
          >
            {copiedAll ? <Check className="w-3 h-3 text-emerald-600" /> : <Download className="w-3 h-3 text-[#6F6A61]" />}
            <span>{copiedAll ? "Exported!" : "Export All (JSON)"}</span>
          </button>
        </div>
      </div>

      {/* Vertically stacked cards */}
      <div className="space-y-8">
        {concepts.map((concept, index) => (
          <ConceptCard
            key={concept.id || index}
            concept={concept}
            index={index}
            onSelectWorkflow={onSelectWorkflow}
          />
        ))}
      </div>
    </div>
  );
}
