"use client";

import React, { useState } from "react";
import TextField from "@/components/ui/TextField";

interface SkillsSectionProps {
  value: string[];
  onChange: (val: string[]) => void;
}

export default function SkillsSection({ value, onChange }: SkillsSectionProps) {
  const [inputValue, setInputValue] = useState("");

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addSkill();
    }
  };

  const addSkill = () => {
    const trimmed = inputValue.trim().toLowerCase();
    if (!trimmed) return;
    
    // Prevent duplicates
    if (!value.includes(trimmed)) {
      onChange([...value, trimmed]);
    }
    setInputValue("");
  };

  const handleRemove = (skillToRemove: string) => {
    onChange(value.filter((s) => s !== skillToRemove));
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="border-b border-border pb-2">
        <h3 className="font-serif text-md font-bold text-ink">Skills &amp; Technologies</h3>
      </div>

      <div className="flex gap-2">
        <div className="flex-1">
          <TextField
            label="Add Skill (Press Enter or Comma to add)"
            id="skills-input"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={addSkill}
            placeholder="e.g. typescript, next.js, postgresql"
          />
        </div>
      </div>

      {/* Render Tags/Pills list */}
      <div className="flex flex-wrap gap-2 mt-2">
        {value.length === 0 ? (
          <span className="text-xs text-muted-2 italic">No skills added yet.</span>
        ) : (
          value.map((skill) => (
            <span
              key={skill}
              className="inline-flex items-center gap-1.5 bg-surface border border-border-strong px-3 py-1 rounded-xl text-xs font-semibold text-ink capitalize"
            >
              <span>{skill}</span>
              <button
                type="button"
                onClick={() => handleRemove(skill)}
                className="text-muted-2 hover:text-danger rounded-full focus-ring p-0.5"
                aria-label={`Remove skill ${skill}`}
              >
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </span>
          ))
        )}
      </div>
    </div>
  );
}
