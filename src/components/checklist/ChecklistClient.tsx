"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Card from "@/components/ui/Card";
import ProgressBar from "@/components/ui/ProgressBar";
import Button from "@/components/ui/Button";
import ConfirmModal from "@/components/ui/ConfirmModal";
import checklistData from "@/data/checklist.json";

interface ChecklistItem {
  id: string;
  text: string;
}

interface ChecklistCategory {
  id: string;
  name: string;
  items: ChecklistItem[];
}

export default function ChecklistClient() {
  const [checkedIds, setCheckedIds] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("cv_checklist_progress");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setTimeout(() => setCheckedIds(parsed), 0);
      } catch (err) {
        console.error("Failed to parse checklist progress", err);
      }
    }
    setTimeout(() => setIsLoaded(true), 0);
  }, []);

  const handleToggle = (id: string) => {
    const nextChecked = checkedIds.includes(id)
      ? checkedIds.filter((x) => x !== id)
      : [...checkedIds, id];
    
    setCheckedIds(nextChecked);
    localStorage.setItem("cv_checklist_progress", JSON.stringify(nextChecked));
  };

  const totalItems = checklistData.categories.reduce(
    (acc, cat) => acc + cat.items.length,
    0
  );
  
  const completedItems = checkedIds.length;
  const progressPercentage = totalItems > 0 ? (completedItems / totalItems) * 100 : 0;

  const handleReset = () => {
    setIsResetModalOpen(true);
  };

  const confirmReset = () => {
    setCheckedIds([]);
    localStorage.removeItem("cv_checklist_progress");
    setIsResetModalOpen(false);
  };

  return (
    <div className="flex flex-col gap-6 max-w-2xl mx-auto animate-fade-in">
      {/* Page Header */}
      <div>
        <Link href="/course/" className="text-sm font-semibold text-accent-text hover:text-accent flex items-center gap-1 mb-2">
          &larr; Back to Learning
        </Link>
        <h1 className="font-serif text-3xl md:text-4xl font-extrabold text-ink tracking-tight">
          ATS-Safe CV Checklist
        </h1>
        <p className="font-sans text-sm md:text-base text-muted leading-relaxed mt-2">
          Use this checklist to inspect your CV before applying. If you tick every item here, your resume is highly optimized for both bots and humans.
        </p>
      </div>

      {/* Progress Bar Header */}
      {isLoaded && (
        <Card className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="w-full sm:max-w-md">
            <ProgressBar value={progressPercentage} showText />
          </div>
          <div className="flex items-center gap-4 w-full sm:w-auto shrink-0 justify-between sm:justify-end">
            <span className="text-xs font-semibold text-muted-2 font-mono">
              {completedItems}/{totalItems} Checked
            </span>
            <button
              onClick={handleReset}
              className="text-xs font-semibold text-accent-text hover:text-accent focus-ring p-1 rounded"
            >
              Reset All
            </button>
          </div>
        </Card>
      )}

      {/* Checklist items by category */}
      {isLoaded && (
        <div className="flex flex-col gap-6">
          {checklistData.categories.map((category: ChecklistCategory) => {
            const catItems = category.items;
            const catCompleted = catItems.filter((i) => checkedIds.includes(i.id)).length;
            
            return (
              <Card key={category.id} className="flex flex-col gap-4">
                <div className="flex justify-between items-center border-b border-border pb-3">
                  <h2 className="font-serif text-lg font-bold text-ink">
                    {category.name}
                  </h2>
                  <span className="label-micro text-[10px] text-muted-2">
                    {catCompleted}/{catItems.length} Done
                  </span>
                </div>
                
                <ul className="flex flex-col gap-3">
                  {catItems.map((item) => {
                    const isChecked = checkedIds.includes(item.id);
                    return (
                      <li
                        key={item.id}
                        onClick={() => handleToggle(item.id)}
                        className="flex items-start gap-3 cursor-pointer select-none group py-1"
                      >
                        <div
                          className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-lg border transition-all duration-150 focus-ring ${
                            isChecked
                              ? "bg-accent border-transparent text-paper"
                              : "border-border-strong bg-paper group-hover:border-muted"
                          }`}
                        >
                          {isChecked && (
                            <svg className="h-3.5 w-3.5 stroke-[3]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                        <span
                          className={`font-sans text-sm md:text-base leading-tight transition-colors duration-150 ${
                            isChecked ? "text-muted line-through" : "text-ink-2"
                          }`}
                        >
                          {item.text}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </Card>
            );
          })}
        </div>
      )}

      {/* CTA Footer */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-surface border border-border p-5 rounded-2xl">
        <div className="text-center sm:text-left">
          <h3 className="font-serif text-base font-bold text-ink">Ready to start building?</h3>
          <p className="text-xs text-muted-2 mt-0.5">Put these guidelines into practice immediately in our local builder.</p>
        </div>
        <Link href="/builder/" className="w-full sm:w-auto">
          <Button variant="primary" className="w-full">
            Go to CV Builder
          </Button>
        </Link>
      </div>

      <ConfirmModal
        isOpen={isResetModalOpen}
        title="Reset Progress"
        message="Are you sure you want to reset all checklist progress? This action cannot be undone."
        confirmText="Yes, Reset"
        cancelText="Cancel"
        onConfirm={confirmReset}
        onCancel={() => setIsResetModalOpen(false)}
      />
    </div>
  );
}
