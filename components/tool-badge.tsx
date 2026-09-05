import { Cpu, Film, Palette, Volume2, Layers } from "lucide-react";
import { RecommendedTool } from "@/schemas/concept";

interface ToolBadgeProps {
  tool: RecommendedTool;
  compact?: boolean;
}

export function ToolBadge({ tool, compact = false }: ToolBadgeProps) {
  const getIcon = (toolName: string) => {
    const name = toolName.toLowerCase();
    if (name.includes("actor") || name.includes("talking")) return <Cpu className="w-3 h-3 text-[#EF432F]" />;
    if (name.includes("kling") || name.includes("runway") || name.includes("video")) return <Film className="w-3 h-3 text-[#3B82F6]" />;
    if (name.includes("eleven") || name.includes("audio")) return <Volume2 className="w-3 h-3 text-[#10B981]" />;
    if (name.includes("studio") || name.includes("image")) return <Palette className="w-3 h-3 text-[#8B5CF6]" />;
    return <Layers className="w-3 h-3 text-[#6F6A61]" />;
  };

  return (
    <div className="flex flex-col space-y-1">
      <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 bg-[#FFFFFF] border border-[#DDD8CE] rounded-sm text-xs shadow-2xs">
        {getIcon(tool.tool)}
        <span className="font-semibold text-[#171717]">{tool.tool}</span>
        {tool.model && (
          <>
            <span className="text-[#DDD8CE]">·</span>
            <span className="font-mono text-[11px] text-[#6F6A61]">{tool.model}</span>
          </>
        )}
      </div>
      {!compact && tool.reason && (
        <p className="text-[11px] text-[#6F6A61] leading-relaxed pl-1 font-mono">
          ↳ {tool.reason}
        </p>
      )}
    </div>
  );
}
