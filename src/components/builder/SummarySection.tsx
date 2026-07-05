import React from "react";
import TextArea from "@/components/ui/TextArea";

interface SummarySectionProps {
  value: string;
  onChange: (val: string) => void;
}

export default function SummarySection({ value, onChange }: SummarySectionProps) {
  const words = value ? value.trim().split(/\s+/).filter(Boolean).length : 0;

  const getWordCountFeedback = () => {
    if (words === 0) return null;
    if (words < 30) {
      return (
        <span className="text-xs font-semibold text-warning">
          Word count: {words} (Too short. Aim for 30–80 words to hook the recruiter.)
        </span>
      );
    }
    if (words > 80) {
      return (
        <span className="text-xs font-semibold text-danger">
          Word count: {words} (A bit long. Keep it concise, under 80 words.)
        </span>
      );
    }
    return (
      <span className="text-xs font-semibold text-success">
        Word count: {words} (Great summary length!)
      </span>
    );
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="border-b border-border pb-2">
        <h3 className="font-serif text-md font-bold text-ink">Professional Summary</h3>
      </div>

      <TextArea
        label="Summary Text"
        id="cv-summary"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="e.g. Results-driven Software Engineer with 6+ years of experience designing scalable web services..."
        rows={4}
        autoResize
      />

      <div className="flex justify-between items-center mt-1">
        {getWordCountFeedback()}
        <span className="text-[10px] text-muted-2 label-micro">Target: 30-80 words</span>
      </div>
    </div>
  );
}
