import React from "react";
import { CLRecord } from "@/lib/cl-types";

interface CLTemplateProps {
  record: CLRecord;
}

export default function CLEditorial({ record }: CLTemplateProps) {
  const { contact, date, recipient, sections, signoff } = record;

  const greeting = recipient.hiringManager
    ? `Dear ${recipient.hiringManager},`
    : recipient.company
      ? `Dear ${recipient.company} Hiring Team,`
      : "Dear Hiring Team,";

  return (
    <div className="bg-white p-8 md:p-12 w-full text-zinc-950 font-sans shadow-sm flex flex-col gap-4 select-text">
      {/* Contact Header */}
      <header className="border-b-2 border-accent pb-3 flex flex-col gap-1">
        <h1 className="font-serif text-2xl font-extrabold tracking-tight text-zinc-900 leading-none">
          {contact.fullName || "Your Name"}
        </h1>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-zinc-600 font-sans">
          {contact.email && <span>{contact.email}</span>}
          {contact.phone && <span>{contact.phone}</span>}
          {contact.city && <span>{contact.city}</span>}
          {contact.linkedin && <span>{contact.linkedin}</span>}
        </div>
      </header>

      {/* Date */}
      {date && (
        <p className="text-[13px] text-zinc-600 font-sans">{date}</p>
      )}

      {/* Recipient */}
      {(recipient.hiringManager || recipient.company || recipient.roleTitle) && (
        <div className="flex flex-col gap-0.5 text-[13px] text-zinc-700 font-sans">
          {recipient.hiringManager && <span>{recipient.hiringManager}</span>}
          {recipient.company && <span>{recipient.company}</span>}
          {recipient.roleTitle && (
            <span className="italic">Re: {recipient.roleTitle}</span>
          )}
        </div>
      )}

      {/* Greeting */}
      <p className="text-[14px] text-zinc-900 font-sans">{greeting}</p>

      {/* Body Sections */}
      {sections.opening && (
        <p className="text-[13px] text-zinc-800 leading-relaxed font-sans">
          {sections.opening}
        </p>
      )}
      {sections.body1 && (
        <p className="text-[13px] text-zinc-800 leading-relaxed font-sans">
          {sections.body1}
        </p>
      )}
      {sections.body2 && (
        <p className="text-[13px] text-zinc-800 leading-relaxed font-sans">
          {sections.body2}
        </p>
      )}
      {sections.closing && (
        <p className="text-[13px] text-zinc-800 leading-relaxed font-sans">
          {sections.closing}
        </p>
      )}

      {/* Signoff */}
      <div className="mt-4 flex flex-col gap-1">
        <p className="text-[14px] text-zinc-800 font-sans">{signoff || "Sincerely"},</p>
        <p className="font-serif text-base font-bold text-zinc-900 mt-3">
          {contact.fullName || "Your Name"}
        </p>
      </div>
    </div>
  );
}
