"use client";

import { useState } from "react";
import { X, Globe2, Copy, Check, Sparkles, RefreshCw } from "lucide-react";
import { Concept } from "@/schemas/concept";

interface LocalizationModalProps {
  concept: Concept;
  isOpen: boolean;
  onClose: () => void;
  onApplyLocalization?: (localizedShots: any[], localizedHook: string, localizedCta: string) => void;
}

const MARKETS = [
  { id: "India", label: "India (Hinglish)", flag: "🇮🇳" },
  { id: "US", label: "United States (D2C)", flag: "🇺🇸" },
  { id: "UK", label: "United Kingdom (Vernacular)", flag: "🇬🇧" },
  { id: "Japan", label: "Japan (Tokyo Metro)", flag: "🇯🇵" },
  { id: "Germany", label: "Germany (Pragmatic)", flag: "🇩🇪" },
  { id: "France", label: "France (Aesthetic)", flag: "🇫🇷" },
];

export function LocalizationModal({
  concept,
  isOpen,
  onClose,
  onApplyLocalization,
}: LocalizationModalProps) {
  const [selectedMarket, setSelectedMarket] = useState("India");
  const [customMarket, setCustomMarket] = useState("");
  const [loading, setLoading] = useState(false);
  const [localizedData, setLocalizedData] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleLocalize = async (marketName?: string) => {
    const market = marketName || (selectedMarket === "Custom" ? customMarket : selectedMarket);
    if (!market) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/concepts/${concept.id}/localize`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetMarket: market,
          conceptData: concept,
        }),
      });

      const data = await res.json();
      if (data.success && data.localization) {
        setLocalizedData(data.localization);
      }
    } catch (err) {
      console.error("Localization request failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!localizedData) return;
    const scriptText = [
      `TARGET MARKET: ${localizedData.targetMarket}`,
      `HOOK: ${localizedData.localizedHook}`,
      `CULTURAL NOTES: ${localizedData.culturalNotes}`,
      "",
      "SHOTS:",
      ...localizedData.localizedShots.map(
        (s: any) => `[Shot ${s.number}] ${s.visual}\nDialogue: "${s.dialogue}"`
      ),
      "",
      `CTA: ${localizedData.localizedCta}`,
    ].join("\n");

    navigator.clipboard.writeText(scriptText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#171717]/40 backdrop-blur-xs animate-in fade-in">
      <div className="bg-[#F7F5F0] border border-[#DDD8CE] rounded-md shadow-2xl max-w-2xl w-full overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-[#DDD8CE] flex items-center justify-between bg-[#FAF7F0]">
          <div className="flex items-center space-x-2">
            <Globe2 className="w-4 h-4 text-[#EF432F]" />
            <h3 className="font-serif text-lg text-[#171717] font-semibold">
              Cultural Script Localization
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-[#6F6A61] hover:text-[#171717] p-1 rounded-sm hover:bg-[#DDD8CE]/30 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-[#6F6A61] mb-2 font-medium">
              Target Market / Regional Vernacular
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {MARKETS.map((market) => (
                <button
                  key={market.id}
                  onClick={() => {
                    setSelectedMarket(market.id);
                    handleLocalize(market.id);
                  }}
                  className={`flex items-center space-x-2 px-3 py-2 text-xs font-medium rounded-sm border text-left transition-all ${
                    selectedMarket === market.id
                      ? "bg-[#171717] text-[#FFFFFF] border-[#171717]"
                      : "bg-[#FFFFFF] text-[#171717] border-[#DDD8CE] hover:border-[#6F6A61]"
                  }`}
                >
                  <span className="text-base">{market.flag}</span>
                  <span className="truncate">{market.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Trigger button if not already localized */}
          {!localizedData && !loading && (
            <div className="text-center py-8 border border-dashed border-[#DDD8CE] rounded-sm bg-[#FAF7F0] space-y-3">
              <p className="text-xs text-[#6F6A61] max-w-md mx-auto">
                Adapt colloquialisms, spoken rhythm, currency, and humor without losing the core strategic hook.
              </p>
              <button
                onClick={() => handleLocalize()}
                className="inline-flex items-center space-x-2 px-4 py-2 bg-[#EF432F] text-[#FFFFFF] text-xs font-medium rounded-sm hover:bg-[#D93825] transition-colors shadow-xs"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Localize to {selectedMarket}</span>
              </button>
            </div>
          )}

          {/* Loading Indicator */}
          {loading && (
            <div className="py-12 flex flex-col items-center justify-center space-y-3">
              <RefreshCw className="w-5 h-5 text-[#EF432F] animate-spin" />
              <p className="font-mono text-xs text-[#6F6A61]">
                Adapting cultural vernacular for {selectedMarket}...
              </p>
            </div>
          )}

          {/* Localized Result Container */}
          {localizedData && !loading && (
            <div className="space-y-4 animate-in fade-in">
              <div className="p-3 bg-[#FAF7F0] border border-[#DDD8CE] rounded-sm">
                <span className="font-mono text-[10px] uppercase tracking-wider text-[#EF432F] font-semibold block mb-1">
                  Cultural Strategy Note
                </span>
                <p className="text-xs text-[#171717] leading-relaxed">
                  {localizedData.culturalNotes}
                </p>
              </div>

              {/* Localized Hook */}
              <div className="p-4 bg-[#FFFFFF] border border-[#DDD8CE] rounded-sm space-y-1">
                <span className="font-mono text-[10px] uppercase text-[#6F6A61] tracking-wider font-semibold">
                  Localized Hook
                </span>
                <p className="text-sm font-serif italic text-[#171717]">
                  “{localizedData.localizedHook}”
                </p>
              </div>

              {/* Localized Shots */}
              <div className="space-y-3">
                <span className="font-mono text-[10px] uppercase text-[#6F6A61] tracking-wider font-semibold block">
                  Dialogue & Nuance Pass ({localizedData.localizedShots?.length} Shots)
                </span>
                {localizedData.localizedShots?.map((s: any) => (
                  <div
                    key={s.number}
                    className="p-3 bg-[#FFFFFF] border border-[#DDD8CE] rounded-sm space-y-1 text-xs"
                  >
                    <div className="flex justify-between items-center text-[10px] font-mono text-[#6F6A61]">
                      <span>Shot {s.number}</span>
                      <span>{s.duration}</span>
                    </div>
                    <p className="text-[#6F6A61] text-[11px]">{s.visual}</p>
                    <p className="font-medium text-[#171717] bg-[#FAF7F0] p-1.5 rounded-xs border border-[#DDD8CE]/50">
                      “{s.dialogue}”
                    </p>
                  </div>
                ))}
              </div>

              {/* Localized CTA */}
              <div className="p-3 bg-[#FFFFFF] border border-[#DDD8CE] rounded-sm">
                <span className="font-mono text-[10px] uppercase text-[#6F6A61] tracking-wider font-semibold block mb-1">
                  Regional CTA
                </span>
                <p className="text-xs font-semibold text-[#171717]">
                  {localizedData.localizedCta}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-[#DDD8CE] flex items-center justify-between bg-[#FAF7F0]">
          <button
            onClick={onClose}
            className="text-xs font-mono text-[#6F6A61] hover:text-[#171717]"
          >
            Close
          </button>
          {localizedData && (
            <div className="flex items-center space-x-2">
              <button
                onClick={handleCopy}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-[#FFFFFF] border border-[#DDD8CE] hover:border-[#171717] text-xs font-mono text-[#171717] rounded-sm transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? "Copied!" : "Copy Script"}</span>
              </button>
              {onApplyLocalization && (
                <button
                  onClick={() => {
                    onApplyLocalization(
                      localizedData.localizedShots,
                      localizedData.localizedHook,
                      localizedData.localizedCta
                    );
                    onClose();
                  }}
                  className="px-3 py-1.5 bg-[#171717] hover:bg-[#333333] text-xs font-mono text-[#FFFFFF] rounded-sm transition-colors"
                >
                  Apply to Concept
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
