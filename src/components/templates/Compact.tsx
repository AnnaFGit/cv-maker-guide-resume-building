import React from "react";
import { CVData } from "@/lib/cv-types";

interface TemplateProps {
  data: CVData;
}

export default function Compact({ data }: TemplateProps) {
  const { contact, summary, experience, education, skills, optional } = data;

  const renderBullets = (text: string) => {
    if (!text) return null;
    return text.split("\n").filter(Boolean).map((bullet, idx) => (
      <li key={idx} className="text-[11px] text-zinc-800 leading-tight font-sans list-disc ml-3.5 pl-0.5">
        {bullet.trim()}
      </li>
    ));
  };

  return (
    <div className="bg-white p-6 md:p-8 w-full text-zinc-950 font-sans shadow-sm flex flex-col gap-4 select-text">
      {/* Compact Side-by-Side Header Details */}
      <header className="border-b border-zinc-300 pb-2.5 flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-zinc-900 leading-none">
            {contact.name || "Your Name"}
          </h1>
          <p className="text-xs font-bold text-zinc-700 mt-1 leading-none">
            {contact.title || "Professional Title"}
          </p>
        </div>
        <div className="flex flex-wrap sm:justify-end gap-x-2.5 gap-y-0.5 text-[10px] text-zinc-500 font-mono sm:text-right">
          {contact.email && <span>{contact.email}</span>}
          {contact.phone && <span>{contact.phone}</span>}
          {contact.location && <span>{contact.location}</span>}
          {contact.linkedin && <span>{contact.linkedin}</span>}
        </div>
      </header>

      {/* Summary */}
      {summary && (
        <section className="flex flex-col gap-1">
          <h2 className="text-[11px] font-extrabold tracking-wider text-zinc-900 uppercase border-b border-zinc-200 pb-0.5">
            Summary
          </h2>
          <p className="text-[11px] text-zinc-800 leading-normal">
            {summary}
          </p>
        </section>
      )}

      {/* Experience */}
      {experience && experience.length > 0 && (
        <section className="flex flex-col gap-2">
          <h2 className="text-[11px] font-extrabold tracking-wider text-zinc-900 uppercase border-b border-zinc-200 pb-0.5">
            Experience
          </h2>
          <div className="flex flex-col gap-2.5">
            {experience.map((item) => (
              <div key={item.id} className="flex flex-col gap-0.5">
                <div className="flex justify-between items-baseline">
                  <h3 className="text-[11px] font-bold text-zinc-900">
                    {item.title} &middot; <span className="font-normal text-zinc-600">{item.company}</span>
                  </h3>
                  <span className="text-[10px] text-zinc-500 font-mono">
                    {item.startDate} &mdash; {item.current ? "Present" : item.endDate}
                  </span>
                </div>
                <div className="flex justify-between text-[10px] text-zinc-400 leading-none">
                  <span>{item.location}</span>
                </div>
                {item.description && (
                  <ul className="flex flex-col gap-0.5 mt-0.5">
                    {renderBullets(item.description)}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {education && education.length > 0 && (
        <section className="flex flex-col gap-2">
          <h2 className="text-[11px] font-extrabold tracking-wider text-zinc-900 uppercase border-b border-zinc-200 pb-0.5">
            Education
          </h2>
          <div className="flex flex-col gap-2">
            {education.map((item) => (
              <div key={item.id} className="flex flex-col gap-0.5">
                <div className="flex justify-between items-baseline">
                  <h3 className="text-[11px] font-bold text-zinc-900">
                    {item.degree}
                  </h3>
                  <span className="text-[10px] text-zinc-500 font-mono">
                    {item.startDate} &mdash; {item.endDate}
                  </span>
                </div>
                <div className="flex justify-between text-[10px] text-zinc-500">
                  <span>{item.school} &middot; {item.location}</span>
                </div>
                {item.description && (
                  <p className="text-[10px] text-zinc-600 leading-tight mt-0.5">
                    {item.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {skills && skills.length > 0 && (
        <section className="flex flex-col gap-1">
          <h2 className="text-[11px] font-extrabold tracking-wider text-zinc-900 uppercase border-b border-zinc-200 pb-0.5">
            Skills
          </h2>
          <p className="text-[11px] text-zinc-800 leading-normal capitalize">
            {skills.join(", ")}
          </p>
        </section>
      )}

      {/* Optional Sections */}
      {optional && optional.length > 0 && (
        <div className="flex flex-col gap-4">
          {optional.map((section) => {
            if (section.items.length === 0) return null;
            return (
              <section key={section.id} className="flex flex-col gap-1.5">
                <h2 className="text-[11px] font-extrabold tracking-wider text-zinc-900 uppercase border-b border-zinc-200 pb-0.5">
                  {section.title}
                </h2>
                <div className="flex flex-col gap-2">
                  {section.items.map((item) => (
                    <div key={item.id} className="flex flex-col gap-0.5">
                      <div className="flex justify-between items-baseline">
                        <h3 className="text-[11px] font-bold text-zinc-900">
                          {item.title} {item.subtitle && <span className="font-normal text-zinc-500">&middot; {item.subtitle}</span>}
                        </h3>
                        {item.date && (
                          <span className="text-[10px] text-zinc-500 font-mono">
                            {item.date}
                          </span>
                        )}
                      </div>
                      {item.description && (
                        <p className="text-[10px] text-zinc-600 leading-tight mt-0.5">
                          {item.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
