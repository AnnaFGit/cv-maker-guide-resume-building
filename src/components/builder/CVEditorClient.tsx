"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getCVRecord, saveCVRecord } from "@/lib/cv-store";
import { CVRecord, CVData, TemplateId, ThemeColorId, ContactInfo, ExperienceItem, EducationItem, OptionalSection } from "@/lib/cv-types";
import Card from "@/components/ui/Card";
import CVPreview from "./CVPreview";
import ExportButton from "./ExportButton";
import TemplateSelector from "./TemplateSelector";
import ContactSection from "./ContactSection";
import SummarySection from "./SummarySection";
import ExperienceSection from "./ExperienceSection";
import EducationSection from "./EducationSection";
import SkillsSection from "./SkillsSection";
import OptionalSections from "./OptionalSections";

type SavingState = "saved" | "saving" | "error";

export default function CVEditorClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const cvId = searchParams.get("id");

  const [record, setRecord] = useState<CVRecord | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [savingState, setSavingState] = useState<SavingState>("saved");
  const [mobileView, setMobileView] = useState<"edit" | "preview">("edit");

  // Custom CV Name Editing States
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState("");

  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isFirstLoadRef = useRef(true);

  // 1. Fetch CV data from IndexedDB
  useEffect(() => {
    if (!cvId) {
      router.push("/builder/");
      return;
    }

    const loadData = async () => {
      try {
        const data = await getCVRecord(cvId);
        if (!data) {
          router.push("/builder/");
          return;
        }
        setRecord(data);
        setNameInput(data.name);
      } catch (err) {
        console.error("Failed to read CV from IndexedDB:", err);
        router.push("/builder/");
      } finally {
        setIsLoaded(true);
      }
    };

    loadData();
  }, [cvId, router]);

  // 2. Debounce Auto-save
  useEffect(() => {
    // Prevent auto-save on initial state load
    if (isFirstLoadRef.current) {
      if (record) {
        isFirstLoadRef.current = false;
      }
      return;
    }

    if (!record) return;

    setTimeout(() => setSavingState("saving"), 0);
    
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(async () => {
      try {
        await saveCVRecord(record);
        setSavingState("saved");
      } catch (err) {
        console.error("Autosave failed:", err);
        setSavingState("error");
      }
    }, 1000);

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [record]);

  // Helper: update data field
  const updateDataField = (updater: (prev: CVData) => CVData) => {
    if (!record) return;
    setRecord({
      ...record,
      data: updater(record.data),
    });
  };

  const handleTemplateChange = (templateId: TemplateId) => {
    if (!record) return;
    setRecord({
      ...record,
      templateId,
    });
  };

  const handleThemeColorChange = (themeColor: ThemeColorId) => {
    if (!record) return;
    setRecord({
      ...record,
      themeColor,
    });
  };

  const handleSaveName = () => {
    if (!record || nameInput.trim() === "") return;
    setRecord({
      ...record,
      name: nameInput.trim(),
    });
    setIsEditingName(false);
  };

  if (!isLoaded || !record) {
    return <div className="text-center py-20 text-muted label-micro animate-pulse">Loading Editor...</div>;
  }

  return (
    <div className="flex flex-col gap-6 animate-fade-in max-w-none px-0">
      
      {/* Editor Header Panel */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between border-b border-border pb-4">
        <div className="flex flex-col gap-1 w-full md:w-auto">
          <div className="flex items-center gap-2">
            <button
              onClick={() => router.push("/builder/")}
              className="text-sm font-semibold text-accent-text hover:text-accent flex items-center gap-1 focus-ring p-1 rounded"
            >
              &larr; Back
            </button>
            <span className="text-muted-2">/</span>
            {isEditingName ? (
              <div className="flex items-center gap-1.5 shrink-0">
                <input
                  id="editor-cv-name-input"
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  className="px-2 py-0.5 text-sm border border-border-strong rounded-xl bg-paper text-ink font-serif font-bold focus:outline-none focus:border-accent w-36 sm:w-56"
                  autoFocus
                  onBlur={handleSaveName}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSaveName();
                    if (e.key === "Escape") {
                      setNameInput(record.name);
                      setIsEditingName(false);
                    }
                  }}
                />
              </div>
            ) : (
              <div
                className="flex items-center gap-1 group cursor-pointer select-none"
                onClick={() => setIsEditingName(true)}
                title="Click to rename"
              >
                <span className="font-serif font-bold text-base sm:text-lg text-ink truncate max-w-[160px] sm:max-w-xs hover:text-accent-text transition-colors">
                  {record.name}
                </span>
                <span className="p-0.5 rounded text-muted-2 opacity-40 group-hover:opacity-100 group-hover:text-accent-text transition-all">
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </span>
              </div>
            )}
          </div>
          
          {/* Save Status Indicators */}
          <div className="flex items-center gap-2 text-xs">
            {savingState === "saved" && (
              <span className="flex items-center gap-1 text-success font-semibold">
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Saved locally
              </span>
            )}
            {savingState === "saving" && (
              <span className="flex items-center gap-1 text-accent-text animate-pulse">
                <svg className="animate-spin h-3.5 w-3.5 text-accent-text" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={4} />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Saving changes...
              </span>
            )}
            {savingState === "error" && (
              <span className="flex items-center gap-1 text-danger font-semibold">
                ⚠️ Connection/Save Error
              </span>
            )}
          </div>
        </div>

        {/* Actions panel */}
        <div className="flex flex-row items-center justify-between gap-2.5 w-full md:w-auto md:justify-end md:gap-4 shrink-0">
          {/* Mobile view toggle */}
          <div className="flex bg-surface border border-border-strong rounded-xl p-0.5 md:hidden shrink-0">
            <button
              onClick={() => setMobileView("edit")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold font-sans focus-ring ${
                mobileView === "edit" ? "bg-paper text-accent-text shadow-sm" : "text-muted-2"
              }`}
            >
              Form
            </button>
            <button
              onClick={() => setMobileView("preview")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold font-sans focus-ring ${
                mobileView === "preview" ? "bg-paper text-accent-text shadow-sm" : "text-muted-2"
              }`}
            >
              Preview
            </button>
          </div>

          {/* Theme Accent Color Swatches */}
          <div className="flex items-center gap-1.5 shrink-0">
            {[
              { id: "terracotta" as const, class: "bg-[#B9502E] border-[#A8431F]", name: "Terracotta" },
              { id: "amber" as const, class: "bg-[#D97706] border-[#B45309]", name: "Amber" },
              { id: "brick" as const, class: "bg-[#A12E2E] border-[#8F2323]", name: "Brick" },
              { id: "olive" as const, class: "bg-[#5B7B3E] border-[#496430]", name: "Olive" },
            ].map((c) => {
              const isActive = (record.themeColor || "terracotta") === c.id;
              return (
                <button
                  key={c.id}
                  type="button"
                  title={c.name}
                  onClick={() => handleThemeColorChange(c.id)}
                  className={`h-5 w-5 rounded-full border transition-all ${c.class} ${
                    isActive
                      ? "ring-2 ring-offset-2 ring-ink scale-110 shadow-md border-transparent"
                      : "opacity-80 hover:opacity-100 hover:scale-105 border-border-strong"
                  }`}
                  aria-label={`Select ${c.name} color theme`}
                />
              );
            })}
          </div>

          <ExportButton
            data={record.data}
            templateId={record.templateId}
            resumeName={record.name}
            themeColor={record.themeColor || "terracotta"}
          />
        </div>
      </div>

      {/* Editor Content Area */}
      {/* Desktop split layout vs Mobile toggled layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        
        {/* Editor Form Columns (Visible in Form Mode or Desktop) */}
        <div
          className={`flex flex-col gap-6 md:col-span-6 lg:col-span-5 ${
            mobileView === "edit" ? "flex" : "hidden md:flex"
          }`}
        >
          {/* Template Picker */}
          <Card>
            <TemplateSelector
              value={record.templateId}
              onChange={handleTemplateChange}
            />
          </Card>

          {/* Contact Details Card */}
          <Card>
            <ContactSection
              value={record.data.contact}
              onChange={(contactVal: ContactInfo) =>
                updateDataField((prev) => ({ ...prev, contact: contactVal }))
              }
            />
          </Card>

          {/* Summary Card */}
          <Card>
            <SummarySection
              value={record.data.summary}
              onChange={(summaryVal: string) =>
                updateDataField((prev) => ({ ...prev, summary: summaryVal }))
              }
            />
          </Card>

          {/* Work Experience Card */}
          <Card>
            <ExperienceSection
              value={record.data.experience}
              onChange={(expVal: ExperienceItem[]) =>
                updateDataField((prev) => ({ ...prev, experience: expVal }))
              }
            />
          </Card>

          {/* Education History Card */}
          <Card>
            <EducationSection
              value={record.data.education}
              onChange={(eduVal: EducationItem[]) =>
                updateDataField((prev) => ({ ...prev, education: eduVal }))
              }
            />
          </Card>

          {/* Skills Card */}
          <Card>
            <SkillsSection
              value={record.data.skills}
              onChange={(skillsVal: string[]) =>
                updateDataField((prev) => ({ ...prev, skills: skillsVal }))
              }
            />
          </Card>

          {/* Additional Sections Card */}
          <Card>
            <OptionalSections
              value={record.data.optional}
              onChange={(optVal: OptionalSection[]) =>
                updateDataField((prev) => ({ ...prev, optional: optVal }))
              }
            />
          </Card>
        </div>

        {/* Live Preview Column (Visible in Preview Mode or Desktop) */}
        <div
          className={`flex flex-col gap-3 md:col-span-6 lg:col-span-7 ${
            mobileView === "preview" ? "flex" : "hidden md:flex"
          }`}
        >
          <div className="flex justify-between items-center px-1">
            <span className="label-micro text-xs text-muted-2">Live Resume Preview</span>
            <span className="text-[10px] text-muted font-sans">Preview matches print / PDF output exactly</span>
          </div>

          <CVPreview
            data={record.data}
            templateId={record.templateId}
            themeColor={record.themeColor || "terracotta"}
          />
        </div>

      </div>
    </div>
  );
}
