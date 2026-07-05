import React from "react";
import { CLRecord } from "@/lib/cl-types";

interface CLTemplateProps {
  record: CLRecord;
}

export default function CLCompact({ record }: CLTemplateProps) {
  const { contact, date, recipient, sections, signoff } = record;

  const greeting = recipient.hiringManager
    ? `Dear ${recipient.hiringManager},`
    : recipient.company
      ? `Dear ${recipient.company} Hiring Team,`
      : "Dear Hiring Team,";

  return (
    <div className="bg-white p-6 md:p-10 w-full text-zinc-950 font-sans shadow-sm flex flex-col gap-3 select-text text-[12px]">
      {/* Contact Header — Tight */}
      <header className="border-b border-zinc-300 pb-2 flex flex-col gap-0.5">
        <h1 className="font-sans text-xl font-bold tracking-tight text-zinc-900 leading-none">
          {contact.fullName || "Your Name"}
        </h1>
        <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-[11px] text-zinc-600 font-sans">
          {contact.email && <span>{contact.email}</span>}
          {contact.phone && <span>•</span>}
          {contact.phone && <span>{contact.phone}</span>}
          {contact.city && <span>•</span>}
          {contact.city && <span>{contact.city}</span>}
          {contact.linkedin && <span>•</span>}
          {contact.linkedin && <span>{contact.linkedin}</span>}
        </div>
      </header>

      {/* Date */}
      {date && <p className="text-[11px] text-zinc-600">{date}</p>}

      {/* Recipient */}
      {(recipient.hiringManager || recipient.company || recipient.roleTitle) && (
        <div className="flex flex-col gap-0 text-[11px] text-zinc-700">
          {recipient.hiringManager && <span>{recipient.hiringManager}</span>}
          {recipient.company && <span>{recipient.company}</span>}
          {recipient.roleTitle && (
            <span className="italic">Re: {recipient.roleTitle}</span>
          )}
        </div>
      )}

      {/* Greeting */}
      <p className="text-[12px] text-zinc-900 font-semibold">{greeting}</p>

      {/* Body */}
      {sections.opening && (
        <p className="text-[12px] text-zinc-800 leading-relaxed">{sections.opening}</p>
      )}
      {sections.body1 && (
        <p className="text-[12px] text-zinc-800 leading-relaxed">{sections.body1}</p>
      )}
      {sections.body2 && (
        <p className="text-[12px] text-zinc-800 leading-relaxed">{sections.body2}</p>
      )}
      {sections.closing && (
        <p className="text-[12px] text-zinc-800 leading-relaxed">{sections.closing}</p>
      )}

      {/* Signoff */}
      <div className="mt-3 flex flex-col gap-0.5">
        <p className="text-[12px] text-zinc-800">{signoff || "Sincerely"},</p>
        <p className="font-sans text-sm font-bold text-zinc-900 mt-2">
          {contact.fullName || "Your Name"}
        </p>
      </div>
    </div>
  );
}
