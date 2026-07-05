"use client";

import React, { useState } from "react";
import { EducationItem } from "@/lib/cv-types";
import TextField from "@/components/ui/TextField";
import TextArea from "@/components/ui/TextArea";
import Button from "@/components/ui/Button";

interface EducationSectionProps {
  value: EducationItem[];
  onChange: (val: EducationItem[]) => void;
}

export default function EducationSection({ value, onChange }: EducationSectionProps) {
  const [expandedIds, setExpandedIds] = useState<string[]>(
    value.length > 0 ? [value[0].id] : []
  );

  const handleToggleExpand = (id: string) => {
    setExpandedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleItemChange = (id: string, field: keyof EducationItem, val: string | boolean) => {
    onChange(
      value.map((item) => {
        if (item.id === id) {
          const updated = { ...item, [field]: val } as EducationItem;
          if (field === "current" && val === true) {
            updated.endDate = "";
          }
          return updated;
        }
        return item;
      })
    );
  };

  const handleAddNew = () => {
    console.log("Add Education Button Clicked!");
    const currentItems = Array.isArray(value) ? value : [];
    const newId = `edu-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    const newItem: EducationItem = {
      id: newId,
      degree: "",
      school: "",
      location: "",
      startDate: "",
      endDate: "",
      current: false,
      description: "",
    };
    
    console.log("Adding new education:", newItem);
    const updatedItems = [...currentItems, newItem];
    onChange(updatedItems);
    setExpandedIds((prev) => [...(prev || []), newId]);
  };

  const handleDelete = (id: string) => {
    onChange(value.filter((item) => item.id !== id));
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const items = [...value];
    const temp = items[index];
    items[index] = items[index - 1];
    items[index - 1] = temp;
    onChange(items);
  };

  const handleMoveDown = (index: number) => {
    if (index === value.length - 1) return;
    const items = [...value];
    const temp = items[index];
    items[index] = items[index + 1];
    items[index + 1] = temp;
    onChange(items);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="border-b border-border pb-2 flex justify-between items-center">
        <h3 className="font-serif text-md font-bold text-ink">Education History</h3>
        <Button variant="secondary" size="sm" onClick={handleAddNew}>
          Add Education
        </Button>
      </div>

      {value.length === 0 ? (
        <div className="text-center py-6 border border-dashed border-border-strong rounded-xl bg-surface/30">
          <p className="text-sm text-muted-2">No education history added yet.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {value.map((item, idx) => {
            const isExpanded = expandedIds.includes(item.id);
            return (
              <div
                key={item.id}
                className="border border-border rounded-xl bg-paper overflow-hidden transition-all shadow-[0_1px_2px_rgba(33,29,24,0.04)]"
              >
                {/* Header Row */}
                <div
                  onClick={() => handleToggleExpand(item.id)}
                  className="flex items-center justify-between p-4 cursor-pointer hover:bg-surface/50 select-none bg-surface/10"
                >
                  <div className="flex flex-col gap-0.5">
                    <span className="font-serif font-bold text-sm text-ink truncate max-w-xs sm:max-w-sm">
                      {item.degree || "Untitled Degree"}
                    </span>
                    {item.school && (
                      <span className="text-xs text-muted-2 font-sans font-medium">
                        {item.school}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
                    {/* Move controls */}
                    <div className="flex gap-0.5">
                      <button
                        onClick={() => handleMoveUp(idx)}
                        disabled={idx === 0}
                        className="p-1 rounded text-muted hover:text-ink hover:bg-surface disabled:opacity-30 disabled:pointer-events-none"
                        title="Move Up"
                        aria-label="Move education item up"
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleMoveDown(idx)}
                        disabled={idx === value.length - 1}
                        className="p-1 rounded text-muted hover:text-ink hover:bg-surface disabled:opacity-30 disabled:pointer-events-none"
                        title="Move Down"
                        aria-label="Move education item down"
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                    </div>

                    {/* Delete item */}
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-1.5 rounded text-muted hover:text-danger hover:bg-danger/10"
                      title="Delete Education"
                      aria-label="Delete education item"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>

                    {/* Collapse icon */}
                    <button
                      onClick={() => handleToggleExpand(item.id)}
                      className="p-1.5 rounded text-muted hover:bg-surface"
                      aria-label={isExpanded ? "Collapse item" : "Expand item"}
                    >
                      <svg
                        className={`h-4 w-4 transition-transform ${isExpanded ? "rotate-180 text-accent" : ""}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2.5}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25-7.5 7.5-7.5-7.5" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Form fields */}
                {isExpanded && (
                  <div className="p-4 border-t border-border flex flex-col gap-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <TextField
                        label="Degree / Certificate"
                        id={`edu-degree-${item.id}`}
                        value={item.degree}
                        onChange={(e) => handleItemChange(item.id, "degree", e.target.value)}
                        placeholder="e.g. B.S. in Computer Science"
                      />
                      <TextField
                        label="School / Institution"
                        id={`edu-school-${item.id}`}
                        value={item.school}
                        onChange={(e) => handleItemChange(item.id, "school", e.target.value)}
                        placeholder="e.g. Boston University"
                      />
                      <TextField
                        label="Location"
                        id={`edu-location-${item.id}`}
                        value={item.location}
                        onChange={(e) => handleItemChange(item.id, "location", e.target.value)}
                        placeholder="e.g. Boston, MA"
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <TextField
                          label="Start Date"
                          id={`edu-start-${item.id}`}
                          type="month"
                          value={item.startDate}
                          onChange={(e) => handleItemChange(item.id, "startDate", e.target.value)}
                        />
                        <TextField
                          label="Graduation Date"
                          id={`edu-end-${item.id}`}
                          type="month"
                          value={item.endDate}
                          onChange={(e) => handleItemChange(item.id, "endDate", e.target.value)}
                          disabled={item.current}
                        />
                      </div>
                    </div>

                    <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-muted select-none">
                      <input
                        type="checkbox"
                        checked={item.current}
                        onChange={(e) => handleItemChange(item.id, "current", e.target.checked)}
                        className="rounded border-border-strong text-accent focus:ring-accent"
                      />
                      <span>I am currently studying here</span>
                    </label>

                    <TextArea
                      label="Details / Description (Optional)"
                      id={`edu-desc-${item.id}`}
                      value={item.description}
                      onChange={(e) => handleItemChange(item.id, "description", e.target.value)}
                      placeholder="e.g. Graduated with honors, GPA: 3.8/4.0. Completed relevant coursework in database architectures..."
                      rows={3}
                      autoResize
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
