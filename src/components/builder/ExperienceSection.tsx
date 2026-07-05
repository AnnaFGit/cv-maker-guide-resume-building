"use client";

import React, { useState } from "react";
import { ExperienceItem } from "@/lib/cv-types";
import TextField from "@/components/ui/TextField";
import TextArea from "@/components/ui/TextArea";
import Button from "@/components/ui/Button";
import actionVerbsData from "@/data/action-verbs.json";

interface ExperienceSectionProps {
  value: ExperienceItem[];
  onChange: (val: ExperienceItem[]) => void;
}

export default function ExperienceSection({ value, onChange }: ExperienceSectionProps) {
  const [expandedIds, setExpandedIds] = useState<string[]>(
    value.length > 0 ? [value[0].id] : []
  );
  const [activeVerbGroup, setActiveVerbGroup] = useState<string | null>(null);

  // Load action verbs from JSON
  const verbGroups = actionVerbsData.groups as Record<string, string[]>;
  const allVerbs = Object.values(verbGroups).flat().map((v) => v.toLowerCase());

  const handleToggleExpand = (id: string) => {
    setExpandedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleItemChange = (id: string, field: keyof ExperienceItem, val: string | boolean) => {
    onChange(
      value.map((item) => {
        if (item.id === id) {
          const updated = { ...item, [field]: val } as ExperienceItem;
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
    console.log("Add Experience Button Clicked!");
    const currentItems = Array.isArray(value) ? value : [];
    const newId = `exp-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    const newItem: ExperienceItem = {
      id: newId,
      title: "",
      company: "",
      location: "",
      startDate: "",
      endDate: "",
      current: false,
      description: "",
    };
    
    console.log("Adding new item:", newItem);
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

  // Check if description bullets start with action verbs
  const checkActionVerbs = (desc: string) => {
    if (!desc) return null;
    const bullets = desc.split("\n").filter(Boolean);
    if (bullets.length === 0) return null;

    const invalidBulletsCount = bullets.filter((b) => {
      const cleanBullet = b.trim().replace(/^[^a-zA-Z]+/, "");
      const firstWord = cleanBullet.split(/\s+/)[0]?.replace(/[^a-zA-Z]/g, "").toLowerCase();
      return firstWord && !allVerbs.includes(firstWord);
    }).length;

    if (invalidBulletsCount > 0) {
      return (
        <span className="text-xs text-warning font-semibold block mt-1">
          💡 Tip: {invalidBulletsCount} of your bullets do not start with a strong action verb (e.g. &apos;Led&apos;, &apos;Optimized&apos;).
        </span>
      );
    }
    return null;
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="border-b border-border pb-2 flex justify-between items-center">
        <h3 className="font-serif text-md font-bold text-ink">Work Experience</h3>
        <Button variant="secondary" size="sm" onClick={handleAddNew}>
          Add Experience
        </Button>
      </div>

      {value.length === 0 ? (
        <div className="text-center py-6 border border-dashed border-border-strong rounded-xl bg-surface/30">
          <p className="text-sm text-muted-2">No work experience added yet.</p>
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
                      {item.title || "Untitled Role"}
                    </span>
                    {item.company && (
                      <span className="text-xs text-muted-2 font-sans font-medium">
                        {item.company}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
                    {/* Reordering Controls */}
                    <div className="flex gap-0.5">
                      <button
                        onClick={() => handleMoveUp(idx)}
                        disabled={idx === 0}
                        className="p-1 rounded text-muted hover:text-ink hover:bg-surface disabled:opacity-30 disabled:pointer-events-none"
                        title="Move Up"
                        aria-label="Move experience item up"
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
                        aria-label="Move experience item down"
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
                      title="Delete Experience"
                      aria-label="Delete experience item"
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
                        label="Job Title"
                        id={`exp-title-${item.id}`}
                        value={item.title}
                        onChange={(e) => handleItemChange(item.id, "title", e.target.value)}
                        placeholder="e.g. Senior Software Engineer"
                      />
                      <TextField
                        label="Company Name"
                        id={`exp-company-${item.id}`}
                        value={item.company}
                        onChange={(e) => handleItemChange(item.id, "company", e.target.value)}
                        placeholder="e.g. Innovatech Solutions"
                      />
                      <TextField
                        label="Location"
                        id={`exp-location-${item.id}`}
                        value={item.location}
                        onChange={(e) => handleItemChange(item.id, "location", e.target.value)}
                        placeholder="e.g. San Francisco, CA (or Remote)"
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <TextField
                          label="Start Date"
                          id={`exp-start-${item.id}`}
                          type="month"
                          value={item.startDate}
                          onChange={(e) => handleItemChange(item.id, "startDate", e.target.value)}
                        />
                        <TextField
                          label="End Date"
                          id={`exp-end-${item.id}`}
                          type="month"
                          value={item.endDate}
                          onChange={(e) => handleItemChange(item.id, "endDate", e.target.value)}
                          disabled={item.current}
                        />
                      </div>
                    </div>

                    {/* Current Role Checkbox */}
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-muted select-none">
                      <input
                        type="checkbox"
                        checked={item.current}
                        onChange={(e) => handleItemChange(item.id, "current", e.target.checked)}
                        className="rounded border-border-strong text-accent focus:ring-accent"
                      />
                      <span>I currently work in this role</span>
                    </label>

                    {/* Description Bullets Area */}
                    <div className="flex flex-col gap-1.5">
                      <TextArea
                        label="Description (One Bullet per line)"
                        id={`exp-desc-${item.id}`}
                        value={item.description}
                        onChange={(e) => handleItemChange(item.id, "description", e.target.value)}
                        placeholder="e.g. Spearheaded the migration of legacy services...\nOptimized database responses by 25%..."
                        rows={4}
                        autoResize
                      />
                      {checkActionVerbs(item.description)}
                    </div>

                    {/* Action Verb Assistant */}
                    <div className="mt-1 pt-3 border-t border-border">
                      <span className="label-micro text-[10px] text-muted-2 block mb-2">
                        Action Verb Assistant
                      </span>
                      <div className="flex flex-wrap gap-1.5 mb-2">
                        {Object.keys(verbGroups).map((groupName) => (
                          <button
                            key={groupName}
                            type="button"
                            onClick={() => setActiveVerbGroup(activeVerbGroup === groupName ? null : groupName)}
                            className={`px-2.5 py-1 border text-[10px] font-sans font-semibold rounded-lg transition-colors ${
                              activeVerbGroup === groupName
                                ? "bg-accent text-paper border-transparent"
                                : "bg-surface border-border-strong text-ink-2 hover:bg-border/30"
                            }`}
                          >
                            {groupName.replace("_", " & ")}
                          </button>
                        ))}
                      </div>

                      {activeVerbGroup && (
                        <div className="p-3 bg-surface/50 border border-border-strong rounded-xl flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
                          {verbGroups[activeVerbGroup].map((verb) => (
                            <button
                              key={verb}
                              type="button"
                              onClick={() => {
                                const descField = document.getElementById(`exp-desc-${item.id}`) as HTMLTextAreaElement;
                                if (descField) {
                                  const text = item.description ? `${item.description}\n${verb} ` : `${verb} `;
                                  handleItemChange(item.id, "description", text);
                                  descField.focus();
                                }
                              }}
                              className="px-2 py-0.5 border border-border-strong rounded-md text-[10px] font-medium bg-paper text-ink-2 hover:border-accent hover:text-accent-text"
                            >
                              +{verb}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

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
