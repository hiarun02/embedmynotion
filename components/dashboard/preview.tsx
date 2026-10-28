"use client";
import { FileText, ArrowUpRight, Check, Code2 } from "lucide-react";
import type { Embed } from "@/lib/dashboard-model";
export function DocumentPreview({ embed }: { embed: Embed }) {
  return (
    <article
      className={`notion-preview preview-${embed.theme}`}
      style={{
        borderRadius: embed.radius,
        border: embed.border ? "1px solid #d9d9d9" : "none",
        maxWidth: embed.fullWidth ? "100%" : 640,
        minHeight: embed.height,
        marginInline: "auto",
      }}
    >
      <div className="preview-cover">
        <div />
        <span>THE STUDIO / A LIVING DOCUMENT</span>
      </div>
      <div className="px-6 pb-8 sm:px-10">
        <div className="preview-book">
          <FileText size={28} strokeWidth={1.4} />
        </div>
        <p className="mb-3 mt-6 text-[10px] font-medium tracking-[.16em] opacity-50">
          A LITTLE CLARITY GOES A LONG WAY
        </p>
        <h2 className="text-3xl font-semibold tracking-tight">
          {embed.title || "Untitled embed"}
        </h2>
        <p className="mt-3 text-sm leading-6 opacity-60">
          A home for the things we know, the way we work, and what comes next.
        </p>
        <div className="my-7 rounded-md bg-current/5 p-4 text-sm leading-6">
          👋 &nbsp; Welcome to our little corner of the internet. Make yourself
          at home.
        </div>
        <h3 className="mb-3 text-base font-semibold">Start here</h3>
        {[
          "Our story & principles",
          "How we work",
          "Resources & useful links",
        ].map((text, i) => (
          <div
            key={text}
            className="flex items-center gap-3 border-b border-current/10 py-3 text-sm"
          >
            <span className="opacity-40">0{i + 1}</span>
            {text}
            <ArrowUpRight className="ml-auto opacity-40" size={14} />
          </div>
        ))}
        <div className="mt-6 flex items-center gap-2 text-xs opacity-50">
          <Check size={13} /> Always a work in progress.
        </div>
        <div className="mt-10 flex items-center justify-center gap-1.5 text-[10px] opacity-40">
          <Code2 size={12} /> Made with EmbedMyNotion
        </div>
      </div>
    </article>
  );
}
