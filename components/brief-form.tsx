"use client";

import { useState } from "react";
import { Sparkles, Link2, ArrowRight, Wand2, Search, CheckCircle2, AlertCircle } from "lucide-react";
import { BriefInput } from "@/schemas/brief";

interface BriefFormProps {
  onSubmit: (data: BriefInput) => void;
  isLoading: boolean;
  initialValues?: Partial<BriefInput>;
}

const DEMO_PRESET: BriefInput = {
  product:
    "Reusable insulated water bottle, ₹899. Keeps drinks cold for 24 hours, no condensation, sold direct on Shopify.",
  productUrl: "",
  audience: "People who commute or work out daily.",
  platform: "Instagram Reels",
  tone: "UGC, casual",
  conceptCount: 3,
};

export function BriefForm({ onSubmit, isLoading, initialValues }: BriefFormProps) {
  const [product, setProduct] = useState(initialValues?.product || "");
  const [productUrl, setProductUrl] = useState(initialValues?.productUrl || "");
  const [audience, setAudience] = useState(initialValues?.audience || "");
  const [platform, setPlatform] = useState(initialValues?.platform || "Instagram Reels");
  const [tone, setTone] = useState(initialValues?.tone || "UGC, casual");
  const [conceptCount, setConceptCount] = useState(initialValues?.conceptCount || 3);
  const [analyzingUrl, setAnalyzingUrl] = useState(false);
  const [urlMessage, setUrlMessage] = useState<string | null>(null);

  const handleApplyPreset = () => {
    setProduct(DEMO_PRESET.product);
    setProductUrl(DEMO_PRESET.productUrl || "");
    setAudience(DEMO_PRESET.audience || "");
    setPlatform(DEMO_PRESET.platform);
    setTone(DEMO_PRESET.tone);
    setConceptCount(DEMO_PRESET.conceptCount);
    setUrlMessage("Filled Recruiter Demo Path parameters.");
    setTimeout(() => setUrlMessage(null), 3000);
  };

  const handleAnalyzeUrl = async () => {
    if (!productUrl) return;
    setAnalyzingUrl(true);
    setUrlMessage(null);
    try {
      const res = await fetch("/api/research", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: productUrl }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        const item = data.data;
        const featuresText = item.keyFeatures ? ` Key highlights: ${item.keyFeatures.join(", ")}.` : "";
        const priceText = item.price ? ` Sold at ${item.price}.` : "";
        setProduct(`${item.title}: ${item.description}${priceText}${featuresText}`);
        if (item.derivedAudience && !audience) {
          setAudience(item.derivedAudience);
        }
        setUrlMessage(`Extracted product insights from ${item.brand || "page"}`);
      } else {
        setUrlMessage("Unable to parse URL content directly; manual entry active.");
      }
    } catch (e) {
      setUrlMessage("URL research failed; please enter product details below.");
    } finally {
      setAnalyzingUrl(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!product.trim()) return;

    onSubmit({
      product,
      productUrl: productUrl.trim() || undefined,
      audience: audience.trim() || undefined,
      platform,
      tone,
      conceptCount,
    });
  };

  return (
    <div className="space-y-6">
      {/* Hero headline and supporting copy */}
      <div className="space-y-3">
        <div className="inline-flex items-center space-x-1.5 font-mono text-[11px] uppercase tracking-widest text-[#EF432F] font-semibold">
          <span>AI Pre-Production Layer</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#171717] tracking-tight leading-[1.1] font-medium">
          Before you cast an actor or spend a render, know what you’re making.
        </h1>
        <p className="text-sm sm:text-base text-[#6F6A61] leading-relaxed max-w-2xl font-normal">
          Brief Lab turns a product, URL, or rough idea into production-ready creative concepts,
          complete with shot lists, casting direction, and routes each concept to the optimal
          HexCoded-compatible tool pipeline.
        </p>
      </div>

      {/* Main Brief Card */}
      <form
        onSubmit={handleSubmit}
        className="paper-card border border-[#DDD8CE] rounded-md bg-[#F1EBDD] p-6 sm:p-8 space-y-6 shadow-xs"
      >
        <div className="flex items-center justify-between border-b border-[#DDD8CE] pb-3">
          <span className="font-mono text-xs uppercase tracking-wider text-[#171717] font-semibold">
            Product Campaign Brief
          </span>
          <button
            type="button"
            onClick={handleApplyPreset}
            className="inline-flex items-center space-x-1.5 text-xs font-mono text-[#EF432F] hover:text-[#D93825] px-2.5 py-1 bg-[#FFFFFF] border border-[#DDD8CE] hover:border-[#EF432F] rounded-sm transition-colors shadow-2xs"
          >
            <Wand2 className="w-3 h-3" />
            <span>Load Recruiter Demo (Water Bottle)</span>
          </button>
        </div>

        {/* Optional URL Input */}
        <div className="space-y-1.5">
          <label className="flex items-center justify-between text-xs font-mono text-[#6F6A61]">
            <span>Have a product page? Paste the URL. (Optional)</span>
            <span className="text-[11px] text-[#6F6A61]/80">Firecrawl URL Analyzer</span>
          </label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Link2 className="w-4 h-4 text-[#6F6A61] absolute left-3 top-3" />
              <input
                type="url"
                value={productUrl}
                onChange={(e) => setProductUrl(e.target.value)}
                placeholder="https://yourbrand.com/products/insulated-bottle"
                className="w-full pl-9 pr-3 py-2 text-xs font-mono bg-[#FFFFFF] border border-[#DDD8CE] focus:border-[#171717] focus:outline-none rounded-sm placeholder:text-[#6F6A61]/50"
              />
            </div>
            <button
              type="button"
              onClick={handleAnalyzeUrl}
              disabled={!productUrl || analyzingUrl}
              className="px-3 py-2 bg-[#FFFFFF] border border-[#DDD8CE] hover:border-[#171717] disabled:opacity-50 text-xs font-mono text-[#171717] rounded-sm transition-colors shrink-0 flex items-center space-x-1"
            >
              {analyzingUrl ? (
                <span className="animate-spin text-xs">⟳</span>
              ) : (
                <Search className="w-3.5 h-3.5" />
              )}
              <span>{analyzingUrl ? "Extracting..." : "Analyze"}</span>
            </button>
          </div>
          {urlMessage && (
            <p className="text-[11px] font-mono text-emerald-700 flex items-center space-x-1">
              <CheckCircle2 className="w-3 h-3" />
              <span>{urlMessage}</span>
            </p>
          )}
        </div>

        {/* Product Description */}
        <div className="space-y-1.5">
          <label className="block text-xs font-mono uppercase tracking-wider text-[#171717] font-semibold">
            Product Description *
          </label>
          <textarea
            required
            rows={4}
            value={product}
            onChange={(e) => setProduct(e.target.value)}
            placeholder="Describe the product, key benefits, pricing, and specific differentiators..."
            className="w-full p-3 text-sm bg-[#FFFFFF] border border-[#DDD8CE] focus:border-[#171717] focus:outline-none rounded-sm placeholder:text-[#6F6A61]/60 leading-relaxed font-sans"
          />
        </div>

        {/* Audience, Platform, Tone Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-mono text-[#6F6A61]">
              Target Audience
            </label>
            <input
              type="text"
              value={audience}
              onChange={(e) => setAudience(e.target.value)}
              placeholder="e.g. Daily commuters, gym-goers"
              className="w-full px-3 py-2 text-xs bg-[#FFFFFF] border border-[#DDD8CE] focus:border-[#171717] focus:outline-none rounded-sm"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-mono text-[#6F6A61]">
              Primary Platform
            </label>
            <select
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-[#FFFFFF] border border-[#DDD8CE] focus:border-[#171717] focus:outline-none rounded-sm"
            >
              <option value="Instagram Reels">Instagram Reels (9:16)</option>
              <option value="TikTok">TikTok (9:16)</option>
              <option value="YouTube Shorts">YouTube Shorts (9:16)</option>
              <option value="Paid Social Ad">Paid Social Ad (4:5 / 9:16)</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-mono text-[#6F6A61]">
              Creative Tone
            </label>
            <select
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-[#FFFFFF] border border-[#DDD8CE] focus:border-[#171717] focus:outline-none rounded-sm"
            >
              <option value="UGC, casual">UGC, casual & relatable</option>
              <option value="Cinematic, premium">Cinematic & macro product</option>
              <option value="Founder-led, honest">Founder-led & behind-the-scenes</option>
              <option value="Problem / Agitate / Solve">Problem / Agitate / Solve</option>
              <option value="High-energy, disruptive">High-energy & fast cuts</option>
            </select>
          </div>
        </div>

        {/* Concept Count & Primary CTA */}
        <div className="pt-4 border-t border-[#DDD8CE] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3 w-full sm:w-auto">
            <span className="text-xs font-mono text-[#6F6A61]">Concepts:</span>
            <div className="flex space-x-1.5">
              {[1, 2, 3].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setConceptCount(num)}
                  className={`w-7 h-7 rounded-xs font-mono text-xs border transition-colors ${
                    conceptCount === num
                      ? "bg-[#171717] text-[#FFFFFF] border-[#171717]"
                      : "bg-[#FFFFFF] text-[#171717] border-[#DDD8CE] hover:border-[#6F6A61]"
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
            <span className="text-[11px] font-mono text-[#6F6A61] hidden sm:inline">
              (Distinct strategies)
            </span>
          </div>

          <button
            type="submit"
            disabled={isLoading || !product.trim()}
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-3 bg-[#EF432F] hover:bg-[#D93825] disabled:opacity-50 text-[#FFFFFF] font-mono text-xs uppercase tracking-wider font-semibold rounded-sm transition-colors shadow-xs group"
          >
            <span>{isLoading ? "Synthesizing Concepts..." : "Build the reel"}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </form>
    </div>
  );
}
