"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getCLRecord, saveCLRecord } from "@/lib/cl-store";
import {
  CLRecord,
  CLContact,
  CLRecipient,
  CLSections,
  CLTemplateId,
  CLStructureType,
} from "@/lib/cl-types";
import { assembleDraft, extractJDMeta, getVariantCounts, DraftInputs } from "@/lib/cl-draft";
import { runCLChecks, CLCheck } from "@/lib/cl-checks";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import TextField from "@/components/ui/TextField";
import TextArea from "@/components/ui/TextArea";
import CLPreview from "./CLPreview";
import CLExportButton from "./CLExportButton";

type SavingState = "saved" | "saving" | "error";

const STRUCTURE_OPTIONS: { id: CLStructureType; name: string; desc: string }[] = [
  { id: "skills-first", name: "Skills-First", desc: "Lead with your core competencies and years of experience." },
  { id: "problem-solution", name: "Problem-Solution", desc: "Frame your experience around challenges you've solved." },
  { id: "story-impact", name: "Story-Impact", desc: "Tell a career narrative with concrete results." },
];

const TEMPLATE_OPTIONS: { id: CLTemplateId; name: string; desc: string }[] = [
  { id: "editorial", name: "Editorial", desc: "Newsreader serif, terracotta accent." },
  { id: "classic", name: "Classic", desc: "Georgia serif, centered header." },
  { id: "compact", name: "Compact", desc: "Hanken Grotesk, tight spacing." },
];

export default function CLEditorClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const clId = searchParams.get("id");

  const [record, setRecord] = useState<CLRecord | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [savingState, setSavingState] = useState<SavingState>("saved");
  const [mobileView, setMobileView] = useState<"edit" | "preview">("edit");

  // Inline name editing
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState("");

  // Draft generation
  const [variantIndices, setVariantIndices] = useState({ opening: 0, body1: 0, body2: 0, closing: 0 });
  const [jdText, setJDText] = useState("");
  const [jdSuggestions, setJDSuggestions] = useState<{ companySuggestion: string; roleSuggestion: string; topKeywords: string[] } | null>(null);

  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isFirstLoadRef = useRef(true);

  // 1. Load from IndexedDB
  useEffect(() => {
    if (!clId) {
      router.push("/cover-letter/");
      return;
    }

    const loadData = async () => {
      try {
        const data = await getCLRecord(clId);
        if (!data) {
          router.push("/cover-letter/");
          return;
        }
        setRecord(data);
        setNameInput(data.name);
      } catch (err) {
        console.error("Failed to read cover letter from IndexedDB:", err);
        router.push("/cover-letter/");
      } finally {
        setIsLoaded(true);
      }
    };

    loadData();
  }, [clId, router]);

  // 2. Debounced auto-save
  useEffect(() => {
    if (isFirstLoadRef.current) {
      if (record) isFirstLoadRef.current = false;
      return;
    }
    if (!record) return;

    setTimeout(() => setSavingState("saving"), 0);

    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);

    saveTimeoutRef.current = setTimeout(async () => {
      try {
        await saveCLRecord(record);
        setSavingState("saved");
      } catch (err) {
        console.error("Autosave failed:", err);
        setSavingState("error");
      }
    }, 1000);

    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    };
  }, [record]);

  // Update helpers
  const updateRecord = (updater: (prev: CLRecord) => CLRecord) => {
    setRecord((prev) => (prev ? updater(prev) : prev));
  };

  const updateContact = (field: keyof CLContact, value: string) => {
    updateRecord((prev) => ({ ...prev, contact: { ...prev.contact, [field]: value } }));
  };

  const updateRecipient = (field: keyof CLRecipient, value: string) => {
    updateRecord((prev) => ({ ...prev, recipient: { ...prev.recipient, [field]: value } }));
  };

  const updateSection = (field: keyof CLSections, value: string) => {
    updateRecord((prev) => ({ ...prev, sections: { ...prev.sections, [field]: value } }));
  };

  // Name editing
  const handleNameBlur = () => {
    if (!record) return;
    const trimmed = nameInput.trim();
    if (trimmed && trimmed !== record.name) {
      updateRecord((prev) => ({ ...prev, name: trimmed }));
    }
    setIsEditingName(false);
  };

  // Template change
  const handleTemplateChange = (id: CLTemplateId) => {
    updateRecord((prev) => ({ ...prev, templateId: id }));
  };

  // Structure change
  const handleStructureChange = (type: CLStructureType) => {
    updateRecord((prev) => ({ ...prev, structureType: type }));
  };

  // JD extraction — suggestions only, never auto-committed
  const handleExtractJD = () => {
    if (!jdText.trim()) return;
    const meta = extractJDMeta(jdText);
    setJDSuggestions(meta);
  };

  const acceptJDSuggestions = () => {
    if (!jdSuggestions || !record) return;
    updateRecord((prev) => ({
      ...prev,
      recipient: {
        ...prev.recipient,
        company: jdSuggestions.companySuggestion || prev.recipient.company,
        roleTitle: jdSuggestions.roleSuggestion || prev.recipient.roleTitle,
      },
    }));
    // Add keywords to strengths (deduplicated)
    const existing = new Set(record.selectedStrengths.map((s) => s.toLowerCase()));
    const newStrengths = jdSuggestions.topKeywords.filter((k) => !existing.has(k.toLowerCase()));
    updateRecord((prev) => ({
      ...prev,
      selectedStrengths: [...prev.selectedStrengths, ...newStrengths].slice(0, 10),
    }));
    setJDSuggestions(null);
  };

  // Draft assembly — only fills empty sections, deterministic cycling
  const handleGenerateDraft = () => {
    if (!record) return;

    // Check if any section has content
    const hasContent = Object.values(record.sections).some((s) => s.trim().length > 0);
    if (hasContent) {
      // Only fill empty sections
      const inputs = buildDraftInputs();
      const draft = assembleDraft(inputs, variantIndices, record.sections, false);
      updateRecord((prev) => ({ ...prev, sections: draft }));
    } else {
      // All empty — fill all
      const inputs = buildDraftInputs();
      const draft = assembleDraft(inputs, variantIndices, record.sections, true);
      updateRecord((prev) => ({ ...prev, sections: draft }));
    }
  };

  // Cycle variant for a specific section
  const cycleVariant = (section: keyof CLSections) => {
    if (!record) return;
    const counts = getVariantCounts(record.structureType);
    const max = counts[section];
    if (max === 0) return;

    const newIdx = (variantIndices[section] + 1) % max;
    const newIndices = { ...variantIndices, [section]: newIdx };
    setVariantIndices(newIndices);

    // Re-generate only this one section (force overwrite this section only)
    const inputs = buildDraftInputs();
    const forcedSections = { ...record.sections, [section]: "" }; // Clear to force refill
    const draft = assembleDraft(inputs, newIndices, forcedSections, false);
    updateSection(section, draft[section]);
  };

  const buildDraftInputs = (): DraftInputs => {
    if (!record) return { structureType: "skills-first", role: "", years: "", strength1: "", strength2: "", strength3: "", company: "", targetRole: "", companyDetail: "", fullName: "" };
    const s = record.selectedStrengths;
    return {
      structureType: record.structureType,
      role: record.contact.fullName ? "" : "", // Not used for role — user's title isn't stored separately
      years: record.yearsExperience,
      strength1: s[0] || "",
      strength2: s[1] || "",
      strength3: s[2] || "",
      company: record.recipient.company,
      targetRole: record.recipient.roleTitle,
      companyDetail: record.companyDetail,
      fullName: record.contact.fullName,
    };
  };

  // Quality checks — live
  const checks: CLCheck[] = useMemo(() => {
    if (!record) return [];
    return runCLChecks(record.sections, record.recipient);
  }, [record]);

  const removeStrength = (strength: string) => {
    updateRecord((prev) => ({
      ...prev,
      selectedStrengths: prev.selectedStrengths.filter((s) => s !== strength),
    }));
  };

  const [newStrength, setNewStrength] = useState("");
  const addCustomStrength = () => {
    if (!newStrength.trim() || !record) return;
    if (record.selectedStrengths.length >= 10) return;
    if (record.selectedStrengths.includes(newStrength.trim().toLowerCase())) return;
    updateRecord((prev) => ({
      ...prev,
      selectedStrengths: [...prev.selectedStrengths, newStrength.trim().toLowerCase()],
    }));
    setNewStrength("");
  };

  // Loading & guard
  if (!isLoaded) {
    return (
      <div className="text-center py-12 text-muted label-micro animate-pulse">
        Initializing Editor...
      </div>
    );
  }
  if (!record) return null;

  return (
    <div className="flex flex-col gap-5 animate-fade-in">
      {/* Top Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex flex-col gap-1 min-w-0">
          <button
            onClick={() => router.push("/cover-letter/")}
            className="self-start text-xs text-muted hover:text-accent-text transition-colors font-sans flex items-center gap-1 mb-1"
          >
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
            All Cover Letters
          </button>

          <div className="flex items-center gap-2 min-w-0">
            {isEditingName ? (
              <input
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                onBlur={handleNameBlur}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleNameBlur();
                  if (e.key === "Escape") { setNameInput(record.name); setIsEditingName(false); }
                }}
                autoFocus
                className="font-serif text-xl md:text-2xl font-extrabold text-ink bg-transparent border-b-2 border-accent focus:outline-none w-full max-w-md"
              />
            ) : (
              <h1
                className="font-serif text-xl md:text-2xl font-extrabold text-ink tracking-tight truncate cursor-pointer hover:text-accent-text transition-colors"
                onClick={() => { setNameInput(record.name); setIsEditingName(true); }}
                title="Click to rename"
              >
                {record.name}
              </h1>
            )}
          </div>

          {/* Save indicator */}
          <div className="text-[10px] font-sans mt-0.5">
            {savingState === "saved" && (
              <span className="flex items-center gap-1 text-success">
                <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Saved
              </span>
            )}
            {savingState === "saving" && (
              <span className="flex items-center gap-1 text-muted-2 animate-pulse">Saving...</span>
            )}
            {savingState === "error" && (
              <span className="flex items-center gap-1 text-danger font-semibold">⚠️ Save Error</span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between sm:justify-end gap-3 w-full md:w-auto">
          <div className="flex bg-surface border border-border-strong rounded-xl p-0.5 md:hidden">
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
          <CLExportButton record={record} />
        </div>
      </div>

      {/* Editor Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* Form Column */}
        <div className={`flex flex-col gap-5 md:col-span-6 lg:col-span-5 ${mobileView === "edit" ? "flex" : "hidden md:flex"}`}>

          {/* Template Selector */}
          <Card>
            <div className="flex flex-col gap-2">
              <span className="label-micro text-xs text-muted">Select Template</span>
              <div className="grid grid-cols-3 gap-3">
                {TEMPLATE_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => handleTemplateChange(opt.id)}
                    className={`flex flex-col text-left p-3 rounded-xl border text-xs font-sans transition-all focus-ring ${
                      record.templateId === opt.id
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
          </Card>

          {/* Structure Picker */}
          <Card>
            <div className="flex flex-col gap-2">
              <span className="label-micro text-xs text-muted">Letter Structure</span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {STRUCTURE_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => handleStructureChange(opt.id)}
                    className={`flex flex-col text-left p-3 rounded-xl border text-xs font-sans transition-all focus-ring ${
                      record.structureType === opt.id
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
          </Card>

          {/* Prefill Panel */}
          <Card>
            <div className="flex flex-col gap-3">
              <span className="label-micro text-xs text-muted">Quick Fill from Job Description</span>
              <TextArea
                label="Paste Job Description"
                placeholder="Paste the full job description here to extract company, role, and keywords..."
                value={jdText}
                onChange={(e) => setJDText(e.target.value)}
                rows={4}
              />
              <Button variant="secondary" size="sm" onClick={handleExtractJD} disabled={!jdText.trim()}>
                Extract Info
              </Button>

              {jdSuggestions && (
                <div className="bg-surface border border-border rounded-xl p-3 flex flex-col gap-2 text-xs">
                  <span className="label-micro text-[10px] text-accent-text">Suggestions (review before accepting)</span>
                  {jdSuggestions.companySuggestion && (
                    <div className="flex justify-between items-center">
                      <span className="text-muted-2">Company:</span>
                      <span className="font-semibold text-ink">{jdSuggestions.companySuggestion}</span>
                    </div>
                  )}
                  {jdSuggestions.roleSuggestion && (
                    <div className="flex justify-between items-center">
                      <span className="text-muted-2">Role:</span>
                      <span className="font-semibold text-ink">{jdSuggestions.roleSuggestion}</span>
                    </div>
                  )}
                  {jdSuggestions.topKeywords.length > 0 && (
                    <div className="flex flex-col gap-1">
                      <span className="text-muted-2">Keywords:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {jdSuggestions.topKeywords.map((kw, i) => (
                          <span key={i} className="px-2 py-0.5 bg-accent/10 text-accent-text rounded-lg text-[10px] font-semibold">{kw}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="flex gap-2 mt-1">
                    <Button variant="primary" size="sm" onClick={acceptJDSuggestions}>Accept Suggestions</Button>
                    <button type="button" onClick={() => setJDSuggestions(null)} className="text-xs text-muted hover:text-ink">Dismiss</button>
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Draft Assembly Controls */}
          <Card>
            <div className="flex flex-col gap-3">
              <span className="label-micro text-xs text-muted">Draft Generator</span>
              <div className="grid grid-cols-2 gap-3">
                <TextField
                  label="Years of Experience"
                  placeholder="e.g. 5"
                  value={record.yearsExperience}
                  onChange={(e) => updateRecord((prev) => ({ ...prev, yearsExperience: e.target.value }))}
                />
                <TextField
                  label="Company Detail"
                  placeholder="what excites you about them"
                  value={record.companyDetail}
                  onChange={(e) => updateRecord((prev) => ({ ...prev, companyDetail: e.target.value }))}
                />
              </div>

              {/* Strength Chips */}
              <div className="flex flex-col gap-1.5">
                <span className="text-xs text-muted-2 font-sans font-semibold">Strengths (pick 2–3 for the draft)</span>
                <div className="flex flex-wrap gap-1.5">
                  {record.selectedStrengths.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => removeStrength(s)}
                      className="px-2.5 py-1 bg-accent/10 text-accent-text rounded-lg text-[11px] font-semibold hover:bg-accent/20 transition-colors flex items-center gap-1"
                    >
                      {s}
                      <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newStrength}
                    onChange={(e) => setNewStrength(e.target.value)}
                    placeholder="Add a strength..."
                    className="flex-1 px-3 py-1.5 border border-border-strong rounded-xl bg-paper text-ink font-sans text-xs focus:outline-none focus:border-accent"
                    onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addCustomStrength(); } }}
                  />
                  <Button variant="secondary" size="sm" onClick={addCustomStrength} disabled={!newStrength.trim()}>Add</Button>
                </div>
              </div>

              <Button variant="primary" size="sm" onClick={handleGenerateDraft}>
                {Object.values(record.sections).some((s) => s.trim()) ? "Fill Empty Sections" : "Generate Draft"}
              </Button>
              <p className="text-[10px] text-muted-2 font-sans leading-relaxed">
                {Object.values(record.sections).some((s) => s.trim())
                  ? "Only empty sections will be filled. Existing content is preserved."
                  : "All four sections will be filled from the template library."}
              </p>
            </div>
          </Card>

          {/* Contact Section */}
          <Card>
            <div className="flex flex-col gap-3">
              <span className="label-micro text-xs text-muted">Your Contact Details</span>
              <TextField label="Full Name" value={record.contact.fullName} onChange={(e) => updateContact("fullName", e.target.value)} placeholder="Jane Doe" />
              <div className="grid grid-cols-2 gap-3">
                <TextField label="Email" value={record.contact.email} onChange={(e) => updateContact("email", e.target.value)} placeholder="jane@example.com" />
                <TextField label="Phone" value={record.contact.phone} onChange={(e) => updateContact("phone", e.target.value)} placeholder="+1 555 012 3456" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <TextField label="City" value={record.contact.city} onChange={(e) => updateContact("city", e.target.value)} placeholder="San Francisco, CA" />
                <TextField label="LinkedIn" value={record.contact.linkedin} onChange={(e) => updateContact("linkedin", e.target.value)} placeholder="linkedin.com/in/janedoe" />
              </div>
            </div>
          </Card>

          {/* Recipient Section */}
          <Card>
            <div className="flex flex-col gap-3">
              <span className="label-micro text-xs text-muted">Recipient</span>
              <TextField label="Hiring Manager" value={record.recipient.hiringManager} onChange={(e) => updateRecipient("hiringManager", e.target.value)} placeholder="Alex Johnson (optional)" />
              <div className="grid grid-cols-2 gap-3">
                <TextField label="Company" value={record.recipient.company} onChange={(e) => updateRecipient("company", e.target.value)} placeholder="Acme Corp" />
                <TextField label="Role Title" value={record.recipient.roleTitle} onChange={(e) => updateRecipient("roleTitle", e.target.value)} placeholder="Senior Engineer" />
              </div>
            </div>
          </Card>

          {/* Date */}
          <Card>
            <TextField label="Date" value={record.date} onChange={(e) => updateRecord((prev) => ({ ...prev, date: e.target.value }))} placeholder="July 2, 2026" />
          </Card>

          {/* Letter Sections */}
          <Card>
            <div className="flex flex-col gap-4">
              <span className="label-micro text-xs text-muted">Letter Content</span>

              {(["opening", "body1", "body2", "closing"] as const).map((section) => {
                const labels: Record<string, string> = {
                  opening: "Opening Paragraph",
                  body1: "Body Paragraph 1",
                  body2: "Body Paragraph 2",
                  closing: "Closing Paragraph",
                };
                return (
                  <div key={section} className="flex flex-col gap-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-2 font-sans font-semibold">{labels[section]}</span>
                      <button
                        type="button"
                        onClick={() => cycleVariant(section)}
                        className="text-[10px] text-accent-text hover:underline font-sans"
                        title="Try a different version"
                      >
                        Try another version ↻
                      </button>
                    </div>
                    <TextArea
                      label=""
                      value={record.sections[section]}
                      onChange={(e) => updateSection(section, e.target.value)}
                      rows={4}
                      placeholder={`Write your ${labels[section].toLowerCase()} here...`}
                    />
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Signoff */}
          <Card>
            <TextField label="Sign-off" value={record.signoff} onChange={(e) => updateRecord((prev) => ({ ...prev, signoff: e.target.value }))} placeholder="Sincerely" />
          </Card>

          {/* Quality Checklist */}
          <Card>
            <div className="flex flex-col gap-2">
              <span className="label-micro text-xs text-muted">Quality Check</span>
              {checks.length === 0 ? (
                <p className="text-xs text-muted-2 font-sans">Start writing to see quality feedback.</p>
              ) : (
                <div className="flex flex-col gap-1.5">
                  {checks.map((check, i) => (
                    <div key={i} className={`flex items-start gap-2 p-2 rounded-lg text-xs font-sans ${
                      check.severity === "success" ? "bg-success/5 text-success" :
                      check.severity === "warning" ? "bg-warning/5 text-warning" :
                      "bg-danger/5 text-danger"
                    }`}>
                      <span className="mt-0.5">
                        {check.passed ? (
                          <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        )}
                      </span>
                      <div className="flex flex-col gap-0.5">
                        <span className="font-semibold">{check.title}</span>
                        <span className="text-[10px] opacity-80 leading-snug">{check.description}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Preview Column */}
        <div className={`flex flex-col gap-3 md:col-span-6 lg:col-span-7 ${mobileView === "preview" ? "flex" : "hidden md:flex"}`}>
          <div className="flex justify-between items-center px-1">
            <span className="label-micro text-xs text-muted-2">Live Letter Preview</span>
            <span className="text-[10px] text-muted font-sans">Preview matches PDF output</span>
          </div>
          <CLPreview record={record} />
        </div>
      </div>
    </div>
  );
}
