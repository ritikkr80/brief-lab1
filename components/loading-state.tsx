"use client";

import { useEffect, useState } from "react";
import { Sparkles, Compass, Film, Workflow } from "lucide-react";

export function LoadingState() {
  const [stepIndex, setStepIndex] = useState(0);

  const steps = [
    { title: "Analyzing product value proposition...", icon: Compass },
    { title: "Evaluating audience friction points...", icon: Sparkles },
    { title: "Synthesizing 3 distinct creative angles...", icon: Film },
    { title: "Routing concepts to HexCoded tool pipelines...", icon: Workflow },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setStepIndex((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 1200);
    return () => clearInterval(interval);
  }, [steps.length]);

  return (
    <div className="paper-card border border-[#DDD8CE] rounded-md p-8 sm:p-12 text-center max-w-xl mx-auto space-y-6 bg-[#F1EBDD] animate-in fade-in">
      <div className="w-12 h-12 rounded-full bg-[#FFFFFF] border border-[#DDD8CE] mx-auto flex items-center justify-center shadow-xs">
        <Sparkles className="w-6 h-6 text-[#EF432F] animate-spin" />
      </div>

      <div className="space-y-2">
        <h4 className="font-serif text-xl sm:text-2xl text-[#171717] font-medium">
          AI Creative Director at work
        </h4>
        <p className="text-xs font-mono text-[#6F6A61]">
          Pre-production calculation — zero rendering cost
        </p>
      </div>

      <div className="space-y-2 max-w-sm mx-auto text-left">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          const isDone = idx < stepIndex;
          const isCurrent = idx === stepIndex;

          return (
            <div
              key={idx}
              className={`flex items-center space-x-3 text-xs p-2 rounded-sm transition-colors ${
                isCurrent
                  ? "bg-[#FAF7F0] border border-[#DDD8CE] text-[#171717] font-medium"
                  : isDone
                  ? "text-[#6F6A61] line-through opacity-70"
                  : "text-[#DDD8CE]"
              }`}
            >
              <Icon
                className={`w-3.5 h-3.5 shrink-0 ${
                  isCurrent ? "text-[#EF432F] animate-pulse" : isDone ? "text-emerald-600" : "text-[#DDD8CE]"
                }`}
              />
              <span className="font-mono text-[11px] truncate">{step.title}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
