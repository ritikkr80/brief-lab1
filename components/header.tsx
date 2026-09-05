"use client";

import Link from "next/link";
import { Sparkles, Terminal } from "lucide-react";

export function Header() {
  return (
    <header className="w-full border-b border-[#DDD8CE] bg-[#F7F5F0]/80 backdrop-blur-sm sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="w-6 h-6 bg-[#171717] rounded-sm flex items-center justify-center text-[#F7F5F0] font-mono text-xs font-bold group-hover:bg-[#EF432F] transition-colors">
              H
            </div>
            <span className="font-mono text-xs tracking-wider uppercase text-[#171717] font-semibold">
              HEXCODED
            </span>
            <span className="text-[#6F6A61] font-mono text-xs">·</span>
            <span className="text-[#6F6A61] font-mono text-xs tracking-wide">
              companion tool
            </span>
          </Link>
        </div>

        <div className="flex items-center space-x-4">
          <div className="hidden sm:flex items-center space-x-2 px-3 py-1 rounded-full bg-[#202020] text-[#FAF7F0] border border-[#333333] shadow-xs">
            <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse"></span>
            <span className="font-mono text-[11px] tracking-tight">
              Live — calls a real model, not a demo
            </span>
          </div>

          <Link
            href="/workflow"
            className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-mono text-[#6F6A61] hover:text-[#171717] border border-[#DDD8CE] hover:border-[#171717] rounded-sm transition-colors bg-[#FFFFFF]"
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Canvas View</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
