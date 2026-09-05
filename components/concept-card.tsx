"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Copy, Check, Globe2, ArrowRight, UserCheck, Megaphone, ChevronDown, ChevronUp, FileText } from "lucide-react";
import { Concept } from "@/schemas/concept";
import { ShotList } from "./shot-list";
import { ToolBadge } from "./tool-badge";
import { LocalizationModal } from "./localization-modal";

interface ConceptCardProps {
  concept: Concept;
  index: number;
  onSelectWorkflow?: (concept: Concept) => void;
}

export function ConceptCard({ concept, index, onSelectWorkflow }: ConceptCardProps) {
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const [isLocalizeOpen, setIsLocalizeOpen] = useState(false);
  const [currentConcept, setCurrentConcept] = useState<Concept>(concept);
  const [isExpanded, setIsExpanded] = useState(true);

  const handleCopyScript = () => {
    const formatted = [
      `TITLE: ${currentConcept.title}`,
      `FORMAT: ${currentConcept.conceptType}`,
      `HOOK: ${currentConcept.hook}`,
      "",
      "--- SHOT LIST ---",
      ...currentConcept.shots.map(
        (s) => `Shot ${s.number} (${s.duration || "3s"}):\nVisual: ${s.visual}\nDialogue: "${s.dialogue || "N/A"}"`
      ),
      "",
      "--- CASTING ---",
      `Persona: ${currentConcept.casting.description}`,
      `Age: ${currentConcept.casting.ageRange || "Any"} | Environment: ${currentConcept.casting.environment || "Studio"}`,
      "",
      "--- CAMPAIGN CTA ---",
      currentConcept.cta,
      "",
      "--- RECOMMENDED TOOL PIPELINE ---",
      ...currentConcept.recommendedTools.map((t) => `${t.tool} (${t.model}): ${t.reason}`),
    ].join("\n");

    navigator.clipboard.writeText(formatted);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const handleBuildWorkflow = () => {
    // Cache concept in sessionStorage for seamless workflow transition
    if (typeof window !== "undefined") {
      sessionStorage.setItem("active_workflow_concept", JSON.stringify(currentConcept));
    }
    if (onSelectWorkflow) {
      onSelectWorkflow(currentConcept);
    } else {
      router.push(`/workflow?conceptId=${currentConcept.id}`);
    }
  };

  const handleApplyLocalization = (
    localizedShots: any[],
    localizedHook: string,
    localizedCta: string
  ) => {
    setCurrentConcept({
      ...currentConcept,
      hook: localizedHook,
      cta: localizedCta,
      shots: localizedShots,
    });
  };

  return (
    <>
      <article className="paper-card rounded-md transition-shadow hover:shadow-md border border-[#DDD8CE] bg-[#F1EBDD] overflow-hidden">
        {/* Top Header & Hook Section */}
        <div className="p-6 perforated-border">
          <div className="flex items-center justify-between mb-2">
            <span className="font-mono text-[11px] uppercase tracking-widest text-[#6F6A61] font-semibold">
              {currentConcept.conceptType.toUpperCase()}
            </span>
            <span className="font-mono text-[10px] text-[#6F6A61] px-2 py-0.5 rounded-xs bg-[#FAF7F0] border border-[#DDD8CE]">
              {currentConcept.platform}
            </span>
          </div>

          <h3 className="font-serif text-xl sm:text-2xl text-[#171717] font-medium tracking-tight mb-3">
            {currentConcept.title}
          </h3>

          <div className="bg-[#FAF7F0] border border-[#DDD8CE] p-3.5 rounded-sm">
            <span className="font-mono text-[10px] uppercase tracking-wider text-[#EF432F] font-semibold block mb-1">
              Hook / Opening Beat
            </span>
            <p className="text-sm font-serif italic text-[#171717] leading-snug">
              “{currentConcept.hook}”
            </p>
          </div>
        </div>

        {/* Shot List Section */}
        <div className="p-6 perforated-border bg-[#F5EFE3]">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <FileText className="w-3.5 h-3.5 text-[#6F6A61]" />
              <span className="font-mono text-[11px] uppercase tracking-wider text-[#6F6A61] font-semibold">
                Production Shot List ({currentConcept.shots.length} Beats)
              </span>
            </div>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-xs font-mono text-[#6F6A61] hover:text-[#171717] flex items-center space-x-1"
            >
              <span>{isExpanded ? "Collapse" : "Expand"}</span>
              {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>

          {isExpanded && <ShotList shots={currentConcept.shots} />}
        </div>

        {/* Casting, Tool Recommendation & CTA Section */}
        <div className="p-6 space-y-5 bg-[#F1EBDD]">
          {/* Tool Recommendation */}
          <div>
            <span className="font-mono text-[10px] uppercase tracking-wider text-[#6F6A61] font-semibold block mb-2">
              HexCoded Tool & Model Pipeline
            </span>
            <div className="space-y-2">
              {currentConcept.recommendedTools.map((tool, i) => (
                <ToolBadge key={i} tool={tool} />
              ))}
            </div>
          </div>

          {/* Casting Direction */}
          <div className="pt-2 border-t border-[#DDD8CE]/60">
            <div className="flex items-center space-x-1.5 mb-1.5">
              <UserCheck className="w-3.5 h-3.5 text-[#171717]" />
              <span className="font-mono text-[11px] uppercase tracking-wider text-[#171717] font-semibold">
                Casting Specification
              </span>
            </div>
            <p className="text-xs text-[#171717] leading-relaxed">
              {currentConcept.casting.description}
            </p>
            {(currentConcept.casting.ageRange || currentConcept.casting.environment) && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {currentConcept.casting.ageRange && (
                  <span className="inline-block font-mono text-[10px] text-[#6F6A61] bg-[#FAF7F0] px-2 py-0.5 rounded border border-[#DDD8CE]">
                    Age: {currentConcept.casting.ageRange}
                  </span>
                )}
                {currentConcept.casting.environment && (
                  <span className="inline-block font-mono text-[10px] text-[#6F6A61] bg-[#FAF7F0] px-2 py-0.5 rounded border border-[#DDD8CE]">
                    Setting: {currentConcept.casting.environment}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Campaign CTA */}
          <div className="pt-2 border-t border-[#DDD8CE]/60">
            <div className="flex items-center space-x-1.5 mb-1">
              <Megaphone className="w-3.5 h-3.5 text-[#EF432F]" />
              <span className="font-mono text-[11px] uppercase tracking-wider text-[#171717] font-semibold">
                Campaign CTA
              </span>
            </div>
            <p className="text-xs font-medium text-[#171717] bg-[#FFFFFF] p-2.5 rounded border border-[#DDD8CE]">
              {currentConcept.cta}
            </p>
          </div>

          {/* Action Bar */}
          <div className="pt-3 border-t border-[#DDD8CE] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsLocalizeOpen(true)}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center space-x-1.5 px-3 py-1.5 text-xs font-mono text-[#171717] bg-[#FFFFFF] border border-[#DDD8CE] hover:border-[#171717] rounded-sm transition-colors shadow-2xs"
              >
                <Globe2 className="w-3.5 h-3.5 text-[#6F6A61]" />
                <span>Localize</span>
              </button>

              <button
                onClick={handleCopyScript}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center space-x-1.5 px-3 py-1.5 text-xs font-mono text-[#171717] bg-[#FFFFFF] border border-[#DDD8CE] hover:border-[#171717] rounded-sm transition-colors shadow-2xs"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-[#6F6A61]" />}
                <span>{copied ? "Copied!" : "Copy Script"}</span>
              </button>
            </div>

            <button
              onClick={handleBuildWorkflow}
              className="inline-flex items-center justify-center space-x-2 px-4 py-2 bg-[#171717] hover:bg-[#2e2e2e] text-[#FFFFFF] text-xs font-mono font-medium rounded-sm transition-colors shadow-xs group"
            >
              <span>Build this workflow</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </article>

      <LocalizationModal
        concept={currentConcept}
        isOpen={isLocalizeOpen}
        onClose={() => setIsLocalizeOpen(false)}
        onApplyLocalization={handleApplyLocalization}
      />
    </>
  );
}
