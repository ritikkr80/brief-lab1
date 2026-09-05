import { Clock, Eye, MessageSquareQuote } from "lucide-react";
import { Shot } from "@/schemas/concept";

interface ShotListProps {
  shots: Shot[];
}

export function ShotList({ shots }: ShotListProps) {
  return (
    <div className="space-y-4">
      {shots.map((shot) => (
        <div
          key={shot.number}
          className="group relative pl-7 border-l-2 border-[#DDD8CE] hover:border-[#EF432F] transition-colors py-0.5"
        >
          {/* Shot number badge */}
          <div className="absolute -left-[11px] top-0.5 w-5 h-5 rounded-full bg-[#FFFFFF] border border-[#DDD8CE] group-hover:border-[#EF432F] text-[11px] font-mono font-semibold flex items-center justify-center text-[#171717] transition-colors">
            {shot.number}
          </div>

          <div className="space-y-1.5">
            {/* Visual description */}
            <div className="flex items-start justify-between gap-2">
              <p className="text-xs sm:text-sm text-[#171717] leading-relaxed font-normal">
                {shot.visual}
              </p>
              {shot.duration && (
                <span className="shrink-0 inline-flex items-center text-[10px] font-mono text-[#6F6A61] bg-[#FAF7F0] px-1.5 py-0.5 rounded border border-[#DDD8CE]">
                  <Clock className="w-2.5 h-2.5 mr-1" />
                  {shot.duration}
                </span>
              )}
            </div>

            {/* Dialogue / voice line */}
            {shot.dialogue && (
              <div className="flex items-start space-x-1.5 text-xs text-[#202020] bg-[#FFFFFF]/80 p-2 rounded border border-[#DDD8CE]/60 font-sans italic">
                <MessageSquareQuote className="w-3.5 h-3.5 text-[#EF432F] shrink-0 mt-0.5 not-italic" />
                <span className="leading-snug">“{shot.dialogue}”</span>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
