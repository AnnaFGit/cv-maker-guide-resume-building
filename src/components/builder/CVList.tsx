"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  listCVRecords,
  saveCVRecord,
  deleteCVRecord,
  duplicateCVRecord,
} from "@/lib/cv-store";
import { CVRecord } from "@/lib/cv-types";
import { SAMPLE_CV_DATA } from "@/lib/sample-data";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

export default function CVList() {
  const router = useRouter();
  const [records, setRecords] = useState<CVRecord[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Custom Modal States
  const [renameTarget, setRenameTarget] = useState<CVRecord | null>(null);
  const [renameInput, setRenameInput] = useState("");
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const fetchRecords = async () => {
    try {
      const data = await listCVRecords();
      setTimeout(() => setRecords(data), 0);
    } catch (err) {
      console.error("Failed to load CVs from IndexedDB:", err);
    }
  };

  useEffect(() => {
    fetchRecords().then(() => {
      setTimeout(() => setIsLoaded(true), 0);
    });
  }, []);

  const handleCreateNew = async () => {
    const id = typeof crypto !== "undefined" && crypto.randomUUID 
      ? crypto.randomUUID() 
      : Math.random().toString(36).substring(2, 11);
      
    const newRecord: CVRecord = {
      id,
      name: `Untitled Resume`,
      templateId: "editorial",
      updatedAt: Date.now(),
      data: JSON.parse(JSON.stringify(SAMPLE_CV_DATA)), // Clone sample data
    };

    try {
      await saveCVRecord(newRecord);
      router.push(`/builder/edit/?id=${id}`);
    } catch (err) {
      console.error("Failed to create new CV record:", err);
    }
  };

  const handleRename = (record: CVRecord) => {
    setRenameTarget(record);
    setRenameInput(record.name);
  };

  const submitRename = async () => {
    if (!renameTarget || renameInput.trim() === "") return;

    try {
      await saveCVRecord({
        ...renameTarget,
        name: renameInput.trim(),
        updatedAt: Date.now(),
      });
      setRenameTarget(null);
      await fetchRecords();
    } catch (err) {
      console.error("Failed to rename CV record:", err);
    }
  };

  const handleDuplicate = async (id: string) => {
    try {
      await duplicateCVRecord(id);
      await fetchRecords();
    } catch (err) {
      console.error("Failed to duplicate CV record:", err);
    }
  };

  const handleDelete = (id: string) => {
    setDeleteTargetId(id);
  };

  const submitDelete = async () => {
    if (!deleteTargetId) return;

    try {
      await deleteCVRecord(deleteTargetId);
      setDeleteTargetId(null);
      await fetchRecords();
    } catch (err) {
      console.error("Failed to delete CV record:", err);
    }
  };

  const formatUpdateDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!isLoaded) {
    return <div className="text-center py-12 text-muted label-micro animate-pulse">Loading dashboard...</div>;
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Create New / List Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <h2 className="label-micro text-xs text-muted-2">
          Your Resumes ({records.length})
        </h2>
        <Button variant="primary" onClick={handleCreateNew} className="w-full sm:w-auto">
          <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Create New CV
        </Button>
      </div>

      {records.length === 0 ? (
        <Card className="flex flex-col items-center justify-center text-center py-16 px-6 gap-4">
          <div className="text-muted-2 border border-dashed border-border-strong p-4 rounded-full bg-surface/50">
            <svg className="h-10 w-10 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
            </svg>
          </div>
          <div>
            <h3 className="font-serif text-lg font-bold text-ink">No resumes saved yet</h3>
            <p className="text-sm text-muted-2 mt-1">Get started by creating a new resume with realistic sample data pre-filled.</p>
          </div>
          <Button variant="primary" onClick={handleCreateNew} size="sm">
            Create Resume
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {records.map((record) => (
            <Card key={record.id} className="flex flex-col h-full justify-between gap-5">
              <div className="flex flex-col gap-2">
                <h3
                  onClick={() => router.push(`/builder/edit/?id=${record.id}`)}
                  className="font-serif text-lg font-bold text-ink hover:text-accent-text transition-colors cursor-pointer truncate"
                  title="Click to edit resume"
                >
                  {record.name}
                </h3>
                <span className="text-[10px] text-muted-2 label-micro">
                  Saved: {formatUpdateDate(record.updatedAt)}
                </span>
                <span className="inline-block mt-1 bg-surface border border-border px-2 py-0.5 rounded-md text-[10px] font-semibold text-muted-2 w-fit capitalize font-sans">
                  Template: {record.templateId}
                </span>
              </div>

              <div className="flex items-center gap-2 border-t border-border pt-4 mt-2">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => router.push(`/builder/edit/?id=${record.id}`)}
                  className="flex-1"
                >
                  Edit
                </Button>
                <div className="flex gap-1">
                  <button
                    onClick={() => handleRename(record)}
                    className="p-2 border border-border-strong rounded-xl bg-paper hover:bg-surface text-muted-2 hover:text-ink focus-ring"
                    title="Rename"
                    aria-label={`Rename resume ${record.name}`}
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDuplicate(record.id)}
                    className="p-2 border border-border-strong rounded-xl bg-paper hover:bg-surface text-muted-2 hover:text-ink focus-ring"
                    title="Duplicate"
                    aria-label={`Duplicate resume ${record.name}`}
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDelete(record.id)}
                    className="p-2 border border-border-strong rounded-xl bg-paper hover:bg-surface text-muted-2 hover:text-danger focus-ring"
                    title="Delete"
                    aria-label={`Delete resume ${record.name}`}
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Rename Modal Overlay */}
      {renameTarget && (
        <div className="fixed inset-0 bg-ink/30 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-paper border border-border-strong rounded-2xl p-6 shadow-2xl max-w-sm w-full flex flex-col gap-4 animate-scale-in">
            <h3 className="font-serif text-lg font-bold text-ink">Rename Resume</h3>
            
            <div className="flex flex-col gap-1.5">
              <label htmlFor="rename-cv-input" className="label-micro text-[10px] text-muted-2 font-bold">
                Resume Name
              </label>
              <input
                id="rename-cv-input"
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
              <button
                type="button"
                onClick={() => setRenameTarget(null)}
                className="px-4 py-2 text-xs font-semibold text-muted hover:text-ink transition-colors"
              >
                Cancel
              </button>
              <Button
                variant="primary"
                onClick={submitRename}
                disabled={!renameInput.trim()}
                size="sm"
              >
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal Overlay */}
      {deleteTargetId && (
        <div className="fixed inset-0 bg-ink/30 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-paper border border-border-strong rounded-2xl p-6 shadow-2xl max-w-sm w-full flex flex-col gap-4 animate-scale-in">
            <h3 className="font-serif text-lg font-bold text-danger">Delete Resume</h3>
            <p className="text-xs md:text-sm font-sans text-muted-2 leading-relaxed">
              Are you sure you want to permanently delete this resume? All data will be removed from your browser and this action cannot be undone.
            </p>
            
            <div className="flex justify-end gap-2 mt-1">
              <button
                type="button"
                onClick={() => setDeleteTargetId(null)}
                className="px-4 py-2 text-xs font-semibold text-muted hover:text-ink transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={submitDelete}
                className="px-4.5 py-2 text-xs font-semibold rounded-xl bg-danger text-paper hover:bg-danger-hover transition-colors font-sans"
              >
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
