"use client";

import { useState } from "react";
import { Header } from "@/components/header";
import { BriefForm } from "@/components/brief-form";
import { ConceptList } from "@/components/concept-list";
import { LoadingState } from "@/components/loading-state";
import { BriefInput } from "@/schemas/brief";
import { Concept } from "@/schemas/concept";
import { AlertCircle, RefreshCcw, Sparkles } from "lucide-react";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [concepts, setConcepts] = useState<Concept[] | null>(null);
  const [lastBrief, setLastBrief] = useState<BriefInput | null>(null);

  const handleGenerateConcepts = async (brief: BriefInput) => {
    setLoading(true);
    setError(null);
    setLastBrief(brief);

    try {
      const response = await fetch("/api/concepts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(brief),
      });

      const data = await response.json();

      if (data.success && data.concepts && data.concepts.length > 0) {
        setConcepts(data.concepts);
        // Scroll smoothly to results on mobile
        if (typeof window !== "undefined" && window.innerWidth < 1024) {
          setTimeout(() => {
            document.getElementById("results-section")?.scrollIntoView({ behavior: "smooth" });
          }, 100);
        }
      } else {
        setError(data.error || "Failed to generate creative concepts. Please try again.");
      }
    } catch (err: any) {
      console.error("Concept generation error:", err);
      setError(err?.message || "Network error while connecting to Creative Engine.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F5F0]">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* If no concepts generated yet: Centered Hero & Brief Form */}
        {!concepts && !loading && (
          <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in">
            <BriefForm onSubmit={handleGenerateConcepts} isLoading={loading} />
          </div>
        )}

        {/* Loading state during generation */}
        {loading && (
          <div className="py-12">
            <LoadingState />
          </div>
        )}

        {/* Error state with retry */}
        {error && !loading && (
          <div className="max-w-xl mx-auto p-6 bg-[#FFFFFF] border border-[#DDD8CE] rounded-md shadow-sm text-center space-y-4 my-8">
            <div className="w-10 h-10 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h3 className="font-serif text-lg font-semibold text-[#171717]">
                Creative Engine Interrupted
              </h3>
              <p className="text-xs font-mono text-[#6F6A61]">{error}</p>
            </div>
            {lastBrief && (
              <button
                onClick={() => handleGenerateConcepts(lastBrief)}
                className="inline-flex items-center space-x-1.5 px-4 py-2 bg-[#171717] hover:bg-[#333333] text-[#FFFFFF] text-xs font-mono rounded-sm transition-colors"
              >
                <RefreshCcw className="w-3.5 h-3.5" />
                <span>Retry Generation</span>
              </button>
            )}
          </div>
        )}

        {/* Screen 2: Dual Split Layout when concepts are ready */}
        {concepts && !loading && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-in fade-in">
            {/* Left side keeps the brief visible */}
            <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-[#DDD8CE]">
                <span className="font-mono text-xs uppercase tracking-wider text-[#6F6A61] font-semibold">
                  Active Product Brief
                </span>
                <button
                  onClick={() => {
                    setConcepts(null);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="text-xs font-mono text-[#EF432F] hover:underline"
                >
                  Edit Brief
                </button>
              </div>

              <div className="paper-card p-5 rounded-md border border-[#DDD8CE] bg-[#FAF7F0] space-y-4">
                <div>
                  <span className="font-mono text-[10px] uppercase text-[#6F6A61] block mb-1">
                    Product
                  </span>
                  <p className="text-xs text-[#171717] leading-relaxed font-medium">
                    {lastBrief?.product}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs pt-3 border-t border-[#DDD8CE]">
                  <div>
                    <span className="font-mono text-[10px] text-[#6F6A61] block">Platform</span>
                    <span className="font-medium text-[#171717]">{lastBrief?.platform}</span>
                  </div>
                  <div>
                    <span className="font-mono text-[10px] text-[#6F6A61] block">Tone</span>
                    <span className="font-medium text-[#171717]">{lastBrief?.tone}</span>
                  </div>
                </div>

                {lastBrief?.audience && (
                  <div className="pt-2 border-t border-[#DDD8CE]">
                    <span className="font-mono text-[10px] text-[#6F6A61] block">Audience</span>
                    <span className="text-xs text-[#171717]">{lastBrief.audience}</span>
                  </div>
                )}

                <button
                  onClick={() => lastBrief && handleGenerateConcepts(lastBrief)}
                  className="w-full inline-flex items-center justify-center space-x-1.5 py-2 px-3 bg-[#FFFFFF] border border-[#DDD8CE] hover:border-[#171717] text-xs font-mono text-[#171717] rounded-sm transition-colors shadow-2xs"
                >
                  <RefreshCcw className="w-3.5 h-3.5 text-[#6F6A61]" />
                  <span>Regenerate Concepts</span>
                </button>
              </div>
            </div>

            {/* Right side contains vertically stacked concept cards */}
            <div id="results-section" className="lg:col-span-7">
              <ConceptList concepts={concepts} />
            </div>
          </div>
        )}
      </main>

      {/* Footer per spec */}
      <footer className="w-full border-t border-[#DDD8CE] py-6 bg-[#FAF7F0] mt-16 text-center text-xs font-mono text-[#6F6A61]">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>HexCoded Brief Lab — AI Build Specification</span>
          <span className="text-[#171717] font-semibold">
            Know what you are making before you spend a render.
          </span>
          <span>Light Mode Production Build</span>
        </div>
      </footer>
    </div>
  );
}
