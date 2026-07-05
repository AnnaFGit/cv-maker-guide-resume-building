"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  listCLRecords,
  saveCLRecord,
  deleteCLRecord,
  duplicateCLRecord,
} from "@/lib/cl-store";
import { listCVRecords } from "@/lib/cv-store";
import { CLRecord, createEmptyCLRecord } from "@/lib/cl-types";
import { CVRecord } from "@/lib/cv-types";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

export default function CLList() {
  const router = useRouter();
  const [records, setRecords] = useState<CLRecord[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Modal states
  const [renameTarget, setRenameTarget] = useState<CLRecord | null>(null);
  const [renameInput, setRenameInput] = useState("");
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  // CV picker states
  const [showCVPicker, setShowCVPicker] = useState(false);
  const [cvRecords, setCVRecords] = useState<CVRecord[]>([]);

  const fetchRecords = async () => {
    try {
      const data = await listCLRecords();
      setTimeout(() => setRecords(data), 0);
    } catch (err) {
      console.error("Failed to load cover letters from IndexedDB:", err);
    }
  };

  useEffect(() => {
    fetchRecords().then(() => {
      setTimeout(() => setIsLoaded(true), 0);
    });
  }, []);

  const handleCreateNew = async () => {
    const id =
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : Math.random().toString(36).substring(2, 11);

    const newRecord = createEmptyCLRecord(id);
    await saveCLRecord(newRecord);
    router.push(`/cover-letter/edit/?id=${id}`);
  };

  // Conditional CV picker: 0→disabled, 1→auto-select, 2+→picker
  const handleStartFromCV = async () => {
    try {
      const cvs = await listCVRecords();
      if (cvs.length === 0) {
        // No CVs — this button shouldn't be reachable, but guard anyway
        return;
      }
      if (cvs.length === 1) {
        // Single CV — skip picker, use directly
        await createFromCV(cvs[0]);
      } else {
        // Multiple CVs — show picker
        setCVRecords(cvs);
        setShowCVPicker(true);
      }
    } catch (err) {
      console.error("Failed to load CVs:", err);
    }
  };

  const createFromCV = async (cv: CVRecord) => {
    setShowCVPicker(false);
    const id =
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : Math.random().toString(36).substring(2, 11);

    const newRecord = createEmptyCLRecord(id);
    // Copy contact from CV
    newRecord.contact = {
      fullName: cv.data.contact.name || "",
      email: cv.data.contact.email || "",
      phone: cv.data.contact.phone || "",
      city: cv.data.contact.location || "",
      linkedin: cv.data.contact.linkedin || "",
    };
    // Surface CV skills as selectable strengths
    newRecord.selectedStrengths = [...(cv.data.skills || [])].slice(0, 10);
    newRecord.name = `Cover Letter - ${cv.name}`;

    await saveCLRecord(newRecord);
    router.push(`/cover-letter/edit/?id=${id}`);
  };

  const handleRename = (record: CLRecord) => {
    setRenameTarget(record);
    setRenameInput(record.name);
  };

  const submitRename = async () => {
    if (!renameTarget || !renameInput.trim()) return;
    const updated = { ...renameTarget, name: renameInput.trim() };
    await saveCLRecord(updated);
    setRenameTarget(null);
    await fetchRecords();
  };

  const handleDelete = (id: string) => {
    setDeleteTargetId(id);
  };

  const submitDelete = async () => {
    if (!deleteTargetId) return;
    await deleteCLRecord(deleteTargetId);
    setDeleteTargetId(null);
    await fetchRecords();
  };

  const handleDuplicate = async (id: string) => {
    await duplicateCLRecord(id);
    await fetchRecords();
  };

  // Check if CVs exist to show/hide "Start from my CV"
  const [hasCVs, setHasCVs] = useState(false);
  useEffect(() => {
    listCVRecords()
      .then((cvs) => setTimeout(() => setHasCVs(cvs.length > 0), 0))
      .catch(() => setHasCVs(false));
  }, []);

  if (!isLoaded) {
    return (
      <div className="text-center py-12 text-muted label-micro animate-pulse">
        Loading cover letters...
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button variant="primary" onClick={handleCreateNew}>
          <svg className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          New Cover Letter
        </Button>

        {hasCVs ? (
          <Button variant="secondary" onClick={handleStartFromCV}>
            <svg className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Start from my CV
          </Button>
        ) : (
          <span className="text-xs text-muted-2 font-sans self-center">
            Build a CV first to pre-fill your cover letter contact details.
          </span>
        )}
      </div>

      {/* Records List */}
      {records.length === 0 ? (
        <Card className="text-center py-10 flex flex-col gap-2 items-center">
          <svg className="h-10 w-10 text-muted-2 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
          </svg>
          <p className="font-sans text-sm text-muted">No cover letters yet</p>
          <p className="font-sans text-xs text-muted-2">
            Create a new cover letter or start from an existing CV.
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {records.map((record) => (
            <Card
              key={record.id}
              hoverEffect
              className="flex flex-col gap-3 cursor-pointer group"
            >
              <div
                onClick={() => router.push(`/cover-letter/edit/?id=${record.id}`)}
                className="flex flex-col gap-1"
              >
                <h3 className="font-serif text-base font-bold text-ink truncate group-hover:text-accent-text transition-colors">
                  {record.name}
                </h3>
                <div className="flex items-center gap-2 text-[10px] text-muted-2 font-sans">
                  <span>{record.recipient.company || "No company"}</span>
                  <span>·</span>
                  <span>{record.recipient.roleTitle || "No role"}</span>
                </div>
                <span className="label-micro text-[10px] text-muted-2">
                  Updated {new Date(record.updatedAt).toLocaleDateString()}
                </span>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 pt-1 border-t border-border">
                <button
                  onClick={() => handleRename(record)}
                  className="p-2 border border-border-strong rounded-xl bg-paper hover:bg-surface text-muted-2 hover:text-ink focus-ring"
                  title="Rename"
                  aria-label={`Rename ${record.name}`}
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </button>
                <button
                  onClick={() => handleDuplicate(record.id)}
                  className="p-2 border border-border-strong rounded-xl bg-paper hover:bg-surface text-muted-2 hover:text-ink focus-ring"
                  title="Duplicate"
                  aria-label={`Duplicate ${record.name}`}
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                  </svg>
                </button>
                <button
                  onClick={() => handleDelete(record.id)}
                  className="p-2 border border-border-strong rounded-xl bg-paper hover:bg-surface text-muted-2 hover:text-danger focus-ring"
                  title="Delete"
                  aria-label={`Delete ${record.name}`}
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Rename Modal */}
      {renameTarget && (
        <div className="fixed inset-0 bg-ink/30 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-paper border border-border-strong rounded-2xl p-6 shadow-2xl max-w-sm w-full flex flex-col gap-4 animate-scale-in">
            <h3 className="font-serif text-lg font-bold text-ink">Rename Cover Letter</h3>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="rename-cl-input" className="label-micro text-[10px] text-muted-2 font-bold">
                Cover Letter Name
              </label>
              <input
                id="rename-cl-input"
                type="text"
                value={renameInput}
                onChange={(e) => setRenameInput(e.target.value)}
                className="w-full px-3 py-2 border border-border-strong rounded-xl bg-paper text-ink font-sans focus:outline-none focus:border-accent text-sm"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter") submitRename();
                  if (e.key === "Escape") setRenameTarget(null);
                }}
              />
            </div>
            <div className="flex justify-end gap-2 mt-1">
              <button type="button" onClick={() => setRenameTarget(null)} className="px-4 py-2 text-xs font-semibold text-muted hover:text-ink transition-colors">
                Cancel
              </button>
              <Button variant="primary" onClick={submitRename} disabled={!renameInput.trim()} size="sm">
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deleteTargetId && (
        <div className="fixed inset-0 bg-ink/30 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-paper border border-border-strong rounded-2xl p-6 shadow-2xl max-w-sm w-full flex flex-col gap-4 animate-scale-in">
            <h3 className="font-serif text-lg font-bold text-danger">Delete Cover Letter</h3>
            <p className="text-xs md:text-sm font-sans text-muted-2 leading-relaxed">
              Are you sure you want to permanently delete this cover letter? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-2 mt-1">
              <button type="button" onClick={() => setDeleteTargetId(null)} className="px-4 py-2 text-xs font-semibold text-muted hover:text-ink transition-colors">
                Cancel
              </button>
              <button type="button" onClick={submitDelete} className="px-4.5 py-2 text-xs font-semibold rounded-xl bg-danger text-paper hover:brightness-110 transition-colors font-sans">
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CV Picker Modal (2+ CVs) */}
      {showCVPicker && (
        <div className="fixed inset-0 bg-ink/30 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-paper border border-border-strong rounded-2xl p-6 shadow-2xl max-w-md w-full flex flex-col gap-4 animate-scale-in max-h-[80vh] overflow-y-auto">
            <h3 className="font-serif text-lg font-bold text-ink">Choose a CV to Start From</h3>
            <p className="text-xs text-muted-2 font-sans">
              Contact details and skills will be copied to your new cover letter.
            </p>
            <div className="flex flex-col gap-2">
              {cvRecords.map((cv) => (
                <button
                  key={cv.id}
                  onClick={() => createFromCV(cv)}
                  className="flex flex-col text-left p-3 rounded-xl border border-border-strong bg-paper hover:bg-surface transition-colors focus-ring"
                >
                  <span className="font-serif font-bold text-sm text-ink">{cv.name}</span>
                  <span className="text-[10px] text-muted-2 font-sans">
                    {cv.data.contact.name || "No name"} · Updated {new Date(cv.updatedAt).toLocaleDateString()}
                  </span>
                </button>
              ))}
            </div>
            <div className="flex justify-end">
              <button type="button" onClick={() => setShowCVPicker(false)} className="px-4 py-2 text-xs font-semibold text-muted hover:text-ink transition-colors">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
