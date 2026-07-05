import React from "react";
import { CVData, TemplateId, ThemeColorId } from "@/lib/cv-types";
import Editorial from "../templates/Editorial";
import Classic from "../templates/Classic";
import Compact from "../templates/Compact";

interface CVPreviewProps {
  data: CVData;
  templateId: TemplateId;
  themeColor?: ThemeColorId;
}

export default function CVPreview({
  data,
  templateId,
  themeColor = "terracotta",
}: CVPreviewProps) {
  const templates = {
    editorial: Editorial,
    classic: Classic,
    compact: Compact,
  };
  
  const SelectedTemplate = templates[templateId] || Editorial;

  // Custom colors for live theme rendering
  const themeColors = {
    terracotta: { accent: "#B9502E", accentText: "#A8431F" },
    amber: { accent: "#D97706", accentText: "#B45309" },
    brick: { accent: "#A12E2E", accentText: "#8F2323" },
    olive: { accent: "#5B7B3E", accentText: "#496430" },
  };

  const colors = themeColors[themeColor] || themeColors.terracotta;

  return (
    <div
      className="w-full bg-border/40 dark:bg-border/20 rounded-2xl p-2 md:p-6 overflow-y-auto max-h-[80vh] shadow-inner"
      style={{
        "--accent": colors.accent,
        "--accent-text": colors.accentText,
        "--color-accent": "var(--accent)",
        "--color-accent-text": "var(--accent-text)",
      } as React.CSSProperties}
    >
      {/* Simulation of A4 page size */}
      <div className="max-w-[794px] mx-auto bg-white shadow-lg border border-border-strong overflow-hidden select-text">
        <SelectedTemplate data={data} />
      </div>
    </div>
  );
}
