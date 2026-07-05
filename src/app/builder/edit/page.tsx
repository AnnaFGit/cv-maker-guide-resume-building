import { Metadata } from "next";
import { Suspense } from "react";
import CVEditorClient from "@/components/builder/CVEditorClient";

export const metadata: Metadata = {
  title: "Edit Resume",
  description: "CV Editor - Design your professional single-column resume.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function EditPage() {
  return (
    <Suspense fallback={<div className="text-center py-12 text-muted label-micro animate-pulse">Initializing Editor...</div>}>
      <CVEditorClient />
    </Suspense>
  );
}
