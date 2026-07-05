import React from "react";
import { CLRecord, CLTemplateId } from "@/lib/cl-types";
import CLEditorial from "../templates/CLEditorial";
import CLClassic from "../templates/CLClassic";
import CLCompact from "../templates/CLCompact";

interface CLPreviewProps {
  record: CLRecord;
}

export default function CLPreview({ record }: CLPreviewProps) {
  const templates: Record<CLTemplateId, React.ComponentType<{ record: CLRecord }>> = {
    editorial: CLEditorial,
    classic: CLClassic,
    compact: CLCompact,
  };

  const SelectedTemplate = templates[record.templateId] || CLEditorial;

  return (
    <div className="w-full bg-border/40 dark:bg-border/20 rounded-2xl p-2 md:p-6 overflow-y-auto max-h-[80vh] shadow-inner">
      {/* A4 page simulation */}
      <div className="max-w-[794px] mx-auto bg-white shadow-lg border border-border-strong overflow-hidden select-text">
        <SelectedTemplate record={record} />
      </div>
    </div>
  );
}
