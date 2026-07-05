"use client";

import React from "react";
import Button from "./Button";
import Card from "./Card";

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmModal({
  isOpen,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/35 backdrop-blur-sm animate-fade-in"
      onClick={onCancel}
    >
      <div 
        className="w-full max-w-sm" 
        onClick={(e) => e.stopPropagation()}
      >
        <Card className="flex flex-col gap-4 shadow-xl border border-border-strong bg-paper p-6">
          <div>
            <h3 className="font-serif text-lg font-bold text-ink">
              {title}
            </h3>
            <p className="text-sm text-muted mt-2 leading-relaxed">
              {message}
            </p>
          </div>
          <div className="flex justify-end gap-3 mt-2">
            <Button variant="secondary" onClick={onCancel} className="text-xs">
              {cancelText}
            </Button>
            <Button variant="primary" onClick={onConfirm} className="text-xs">
              {confirmText}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
