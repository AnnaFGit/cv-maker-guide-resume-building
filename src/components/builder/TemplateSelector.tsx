import React from "react";
import { TemplateId } from "@/lib/cv-types";

interface TemplateSelectorProps {
  value: TemplateId;
  onChange: (id: TemplateId) => void;
}

export default function TemplateSelector({ value, onChange }: TemplateSelectorProps) {
  const options: { id: TemplateId; name: string; desc: string }[] = [
    {
      id: "editorial",
      name: "Editorial",
      desc: "Newsreader serif headings with terracotta rules. Warm, modern look.",
    },
    {
      id: "classic",
      name: "Classic",
      desc: "Traditional Georgia serif centered headers. Standard corporate style.",
    },
    {
      id: "compact",
      name: "Compact",
      desc: "Tight Hanken Grotesk sans. Perfect for highly-detailed history.",
    },
  ];

  return (
    <div className="flex flex-col gap-2">
      <span className="label-micro text-xs text-muted">Select Template</span>
      <div className="grid grid-cols-3 gap-3">
        {options.map((opt) => (
          <button
            key={opt.id}
            type="button"
            onClick={() => onChange(opt.id)}
            className={`flex flex-col text-left p-3 rounded-xl border text-xs font-sans transition-all focus-ring ${
              value === opt.id
                ? "border-accent bg-accent/5 text-accent-text font-semibold"
                : "border-border-strong bg-paper hover:bg-surface text-ink-2"
            }`}
          >
            <span className="font-bold text-sm block mb-1">{opt.name}</span>
            <span className="text-[10px] text-muted-2 leading-snug">{opt.desc}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
