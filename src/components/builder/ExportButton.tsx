"use client";

import React, { useState } from "react";
import { CVData, TemplateId, ThemeColorId } from "@/lib/cv-types";
import { generatePDF } from "@/lib/pdf-export";
import { exportPDF } from "@/lib/bridge";
import Button from "@/components/ui/Button";
import Toast from "@/components/ui/Toast";

interface ExportButtonProps {
  data: CVData;
  templateId: TemplateId;
  resumeName: string;
  themeColor?: ThemeColorId;
}

export default function ExportButton({
  data,
  templateId,
  resumeName,
  themeColor = "terracotta",
}: ExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const handleExport = async () => {
    setIsExporting(true);
    
    // Create clean file name: "Firstname_Lastname_CV.pdf" or fallback to sanitized resume name
    const sanitizedName = (data.contact.name || resumeName || "Resume")
      .trim()
      .replace(/\s+/g, "_")
      .replace(/[^a-zA-Z0-9_]/g, "");
    
    const filename = `${sanitizedName}_CV.pdf`;

    try {
      // Small timeout to allow loader to render smoothly
      await new Promise((resolve) => setTimeout(resolve, 300));
      
      const base64 = generatePDF(data, templateId, themeColor);
      exportPDF(filename, base64);
      
      setToast({
        message: "PDF exported successfully! Check your downloads.",
        type: "success",
      });
    } catch (err) {
      console.error("PDF generation failed:", err);
      setToast({
        message: "Failed to export PDF. Please check your data and try again.",
        type: "error",
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <Button
        variant="primary"
        onClick={handleExport}
        disabled={isExporting}
        className="w-full md:w-auto flex items-center justify-center gap-2 shrink-0"
      >
        {isExporting ? (
          <>
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-paper" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Generating PDF...
          </>
        ) : (
          <>
            <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export PDF
          </>
        )}
      </Button>
    </>
  );
}
