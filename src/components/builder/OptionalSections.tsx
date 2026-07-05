"use client";

import React, { useState } from "react";
import { OptionalSection, OptionalItem } from "@/lib/cv-types";
import TextField from "@/components/ui/TextField";
import TextArea from "@/components/ui/TextArea";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import ConfirmModal from "@/components/ui/ConfirmModal";

interface OptionalSectionsProps {
  value: OptionalSection[];
  onChange: (val: OptionalSection[]) => void;
}

function generateId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

export default function OptionalSections({ value, onChange }: OptionalSectionsProps) {
  const [expandedSectionIds, setExpandedSectionIds] = useState<string[]>([]);
  const [expandedItemIds, setExpandedItemIds] = useState<string[]>([]);
  const [sectionToDelete, setSectionToDelete] = useState<string | null>(null);

  // List of standard optional sections users can add
  const availableSectionTypes = [
    "Certifications",
    "Projects",
    "Awards",
    "Languages",
    "Volunteer Work",
  ];

  const activeSectionTitles = value.map((s) => s.title);
  const remainingTypes = availableSectionTypes.filter((t) => !activeSectionTitles.includes(t));

  const handleAddSection = (title: string) => {
    const newId = generateId("opt-sec");
    const newSection: OptionalSection = {
      id: newId,
      title,
      items: [],
    };
    onChange([...value, newSection]);
    setExpandedSectionIds((prev) => [...prev, newSection.id]);
  };

  const handleDeleteSection = (sectionId: string) => {
    setSectionToDelete(sectionId);
  };

  const confirmDeleteSection = () => {
    if (sectionToDelete) {
      onChange(value.filter((s) => s.id !== sectionToDelete));
      setSectionToDelete(null);
    }
  };

  const handleToggleSectionExpand = (sectionId: string) => {
    setExpandedSectionIds((prev) =>
      prev.includes(sectionId) ? prev.filter((x) => x !== sectionId) : [...prev, sectionId]
    );
  };

  const handleAddNewItem = (sectionId: string) => {
    const itemId = generateId("opt-item");
    const newItem: OptionalItem = {
      id: itemId,
      title: "",
      subtitle: "",
      date: "",
      description: "",
    };

    onChange(
      value.map((sec) => {
        if (sec.id === sectionId) {
          return { ...sec, items: [...sec.items, newItem] };
        }
        return sec;
      })
    );
    setExpandedItemIds((prev) => [...prev, itemId]);
  };

  const handleItemChange = (sectionId: string, itemId: string, field: keyof OptionalItem, val: string) => {
    onChange(
      value.map((sec) => {
        if (sec.id === sectionId) {
          return {
            ...sec,
            items: sec.items.map((item) => {
              if (item.id === itemId) {
                return { ...item, [field]: val };
              }
              return item;
            }),
          };
        }
        return sec;
      })
    );
  };

  const handleDeleteItem = (sectionId: string, itemId: string) => {
    onChange(
      value.map((sec) => {
        if (sec.id === sectionId) {
          return { ...sec, items: sec.items.filter((i) => i.id !== itemId) };
        }
        return sec;
      })
    );
  };

  const handleToggleItemExpand = (itemId: string) => {
    setExpandedItemIds((prev) =>
      prev.includes(itemId) ? prev.filter((x) => x !== itemId) : [...prev, itemId]
    );
  };

  const handleMoveItemUp = (sectionId: string, itemIdx: number) => {
    if (itemIdx === 0) return;
    onChange(
      value.map((sec) => {
        if (sec.id === sectionId) {
          const items = [...sec.items];
          const temp = items[itemIdx];
          items[itemIdx] = items[itemIdx - 1];
          items[itemIdx - 1] = temp;
          return { ...sec, items };
        }
        return sec;
      })
    );
  };

  const handleMoveItemDown = (sectionId: string, itemIdx: number, totalItems: number) => {
    if (itemIdx === totalItems - 1) return;
    onChange(
      value.map((sec) => {
        if (sec.id === sectionId) {
          const items = [...sec.items];
          const temp = items[itemIdx];
          items[itemIdx] = items[itemIdx + 1];
          items[itemIdx + 1] = temp;
          return { ...sec, items };
        }
        return sec;
      })
    );
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="border-b border-border pb-2">
        <h3 className="font-serif text-md font-bold text-ink">Additional Sections</h3>
      </div>

      {/* Add New Section Buttons */}
      {remainingTypes.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {remainingTypes.map((type) => (
            <Button key={type} variant="secondary" size="sm" onClick={() => handleAddSection(type)}>
              + Add {type}
            </Button>
          ))}
        </div>
      )}

      {/* Active optional sections list */}
      <div className="flex flex-col gap-4">
        {value.map((section) => {
          const isSecExpanded = expandedSectionIds.includes(section.id);
          return (
            <Card key={section.id} className="flex flex-col gap-4 border-border-strong bg-paper/50">
              {/* Section Header */}
              <div className="flex justify-between items-center border-b border-border pb-2">
                <div
                  onClick={() => handleToggleSectionExpand(section.id)}
                  className="flex items-center gap-2 cursor-pointer select-none"
                >
                  <h4 className="font-serif text-base font-bold text-ink hover:text-accent-text transition-colors">
                    {section.title}
                  </h4>
                  <svg
                    className={`h-4 w-4 text-muted transition-transform ${isSecExpanded ? "rotate-180 text-accent" : ""}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25-7.5 7.5-7.5-7.5" />
                  </svg>
                </div>

                <div className="flex items-center gap-2">
                  <Button variant="secondary" size="sm" onClick={() => handleAddNewItem(section.id)}>
                    Add Item
                  </Button>
                  <button
                    onClick={() => handleDeleteSection(section.id)}
                    className="p-1 rounded text-muted hover:text-danger hover:bg-danger/10"
                    title="Remove Section"
                    aria-label={`Remove section ${section.title}`}
                  >
                    <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Items List inside Section */}
              {isSecExpanded && (
                <div className="flex flex-col gap-3">
                  {section.items.length === 0 ? (
                    <p className="text-xs text-muted-2 italic py-2">No items added to this section yet.</p>
                  ) : (
                    section.items.map((item, itemIdx) => {
                      const isItemExpanded = expandedItemIds.includes(item.id);
                      return (
                        <div key={item.id} className="border border-border rounded-xl bg-paper overflow-hidden">
                          {/* Item Header row */}
                          <div
                            onClick={() => handleToggleItemExpand(item.id)}
                            className="flex items-center justify-between p-3 cursor-pointer hover:bg-surface/50 select-none bg-surface/5"
                          >
                            <span className="font-sans font-bold text-xs text-ink truncate max-w-xs">
                              {item.title || "Untitled Item"}
                            </span>

                            <div className="flex items-center gap-2.5" onClick={(e) => e.stopPropagation()}>
                              {/* Reorder items */}
                              <div className="flex gap-0.5">
                                <button
                                  onClick={() => handleMoveItemUp(section.id, itemIdx)}
                                  disabled={itemIdx === 0}
                                  className="p-0.5 rounded text-muted hover:text-ink hover:bg-surface disabled:opacity-30 disabled:pointer-events-none"
                                  title="Move Up"
                                  aria-label="Move item up"
                                >
                                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
                                  </svg>
                                </button>
                                <button
                                  onClick={() => handleMoveItemDown(section.id, itemIdx, section.items.length)}
                                  disabled={itemIdx === section.items.length - 1}
                                  className="p-0.5 rounded text-muted hover:text-ink hover:bg-surface disabled:opacity-30 disabled:pointer-events-none"
                                  title="Move Down"
                                  aria-label="Move item down"
                                >
                                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                  </svg>
                                </button>
                              </div>

                              {/* Delete item */}
                              <button
                                onClick={() => handleDeleteItem(section.id, item.id)}
                                className="p-1 rounded text-muted hover:text-danger hover:bg-danger/10"
                                title="Delete Item"
                                aria-label="Delete item"
                              >
                                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>

                              {/* Item Expand arrow */}
                              <button
                                onClick={() => handleToggleItemExpand(item.id)}
                                className="p-1 rounded text-muted hover:bg-surface"
                                aria-label={isItemExpanded ? "Collapse item detail" : "Expand item detail"}
                              >
                                <svg
                                  className={`h-3.5 w-3.5 transition-transform ${isItemExpanded ? "rotate-180 text-accent" : ""}`}
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

                          {/* Item form inputs */}
                          {isItemExpanded && (
                            <div className="p-4 border-t border-border flex flex-col gap-4">
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <TextField
                                  label="Title / Name"
                                  id={`opt-item-title-${item.id}`}
                                  value={item.title}
                                  onChange={(e) => handleItemChange(section.id, item.id, "title", e.target.value)}
                                  placeholder="e.g. AWS Solutions Architect / Open Source App"
                                />
                                <TextField
                                  label="Subtitle / Organization"
                                  id={`opt-item-sub-${item.id}`}
                                  value={item.subtitle || ""}
                                  onChange={(e) => handleItemChange(section.id, item.id, "subtitle", e.target.value)}
                                  placeholder="e.g. Amazon Web Services (AWS) / Creator"
                                />
                                <TextField
                                  label="Date / Duration"
                                  id={`opt-item-date-${item.id}`}
                                  value={item.date || ""}
                                  onChange={(e) => handleItemChange(section.id, item.id, "date", e.target.value)}
                                  placeholder="e.g. 2024"
                                />
                              </div>
                              <TextArea
                                label="Details / Description"
                                id={`opt-item-desc-${item.id}`}
                                value={item.description || ""}
                                onChange={(e) => handleItemChange(section.id, item.id, "description", e.target.value)}
                                placeholder="e.g. Details about the project or certificate specifications..."
                                rows={2}
                                autoResize
                              />
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              )}
            </Card>
          );
        })}
      </div>

      <ConfirmModal
        isOpen={sectionToDelete !== null}
        title="Delete Optional Section"
        message="Are you sure you want to delete this entire optional section? This will remove all items within it."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={confirmDeleteSection}
        onCancel={() => setSectionToDelete(null)}
      />
    </div>
  );
}
