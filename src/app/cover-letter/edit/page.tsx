import { Metadata } from "next";
import { Suspense } from "react";
import CLEditorClient from "@/components/coverletter/CLEditorClient";

export const metadata: Metadata = {
  title: "Edit Cover Letter",
  description: "Cover Letter Editor - Write a tailored, professional cover letter.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function CoverLetterEditPage() {
  return (
    <Suspense fallback={<div className="text-center py-12 text-muted label-micro animate-pulse">Initializing Editor...</div>}>
      <CLEditorClient />
    </Suspense>
  );
}
