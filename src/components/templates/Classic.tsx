import React from "react";
import { CVData } from "@/lib/cv-types";

interface TemplateProps {
  data: CVData;
}

export default function Classic({ data }: TemplateProps) {
  const { contact, summary, experience, education, skills, optional } = data;

  const renderBullets = (text: string) => {
    if (!text) return null;
    return text.split("\n").filter(Boolean).map((bullet, idx) => (
      <li key={idx} className="text-xs text-zinc-900 leading-normal font-serif list-disc ml-5 pl-1">
        {bullet.trim()}
      </li>
    ));
  };

  return (
    <div className="bg-white p-8 md:p-12 w-full text-zinc-950 font-serif shadow-sm flex flex-col gap-5 select-text">
      {/* Centered Classic Header */}
      <header className="flex flex-col items-center text-center gap-1.5 border-b border-zinc-900 pb-3">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-950 uppercase leading-none">
          {contact.name || "Your Name"}
        </h1>
        <p className="text-sm font-semibold tracking-wider text-zinc-800 uppercase leading-none">
          {contact.title || "Professional Title"}
        </p>
        <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 mt-1 text-[11px] text-zinc-700">
          {contact.email && <span>{contact.email}</span>}
          {contact.email && (contact.phone || contact.location || contact.linkedin) && <span>|</span>}
          {contact.phone && <span>{contact.phone}</span>}
          {contact.phone && (contact.location || contact.linkedin) && <span>|</span>}
          {contact.location && <span>{contact.location}</span>}
          {contact.location && contact.linkedin && <span>|</span>}
          {contact.linkedin && <span>{contact.linkedin}</span>}
        </div>
      </header>

      {/* Summary */}
      {summary && (
        <section className="flex flex-col gap-1.5">
          <h2 className="text-sm font-bold tracking-wider text-zinc-900 uppercase border-b border-zinc-300 pb-0.5">
            Professional Summary
          </h2>
          <p className="text-xs text-zinc-900 leading-relaxed">
            {summary}
          </p>
        </section>
      )}

      {/* Experience */}
      {experience && experience.length > 0 && (
        <section className="flex flex-col gap-3">
          <h2 className="text-sm font-bold tracking-wider text-zinc-900 uppercase border-b border-zinc-300 pb-0.5">
            Professional Experience
          </h2>
          <div className="flex flex-col gap-3.5">
            {experience.map((item) => (
              <div key={item.id} className="flex flex-col gap-1">
                <div className="flex justify-between items-baseline">
                  <h3 className="text-xs font-bold text-zinc-950">
                    {item.company} &mdash; <span className="font-normal italic">{item.title}</span>
                  </h3>
                  <span className="text-xs text-zinc-800">
                    {item.startDate} &mdash; {item.current ? "Present" : item.endDate}
                  </span>
                </div>
                <div className="flex justify-between text-[11px] text-zinc-600 leading-none">
                  <span>{item.location}</span>
                </div>
                {item.description && (
                  <ul className="flex flex-col gap-1 mt-1">
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
        <section className="flex flex-col gap-3">
          <h2 className="text-sm font-bold tracking-wider text-zinc-900 uppercase border-b border-zinc-300 pb-0.5">
            Education
          </h2>
          <div className="flex flex-col gap-3">
            {education.map((item) => (
              <div key={item.id} className="flex flex-col gap-1">
                <div className="flex justify-between items-baseline">
                  <h3 className="text-xs font-bold text-zinc-950">
                    {item.school} &mdash; <span className="font-normal italic">{item.degree}</span>
                  </h3>
                  <span className="text-xs text-zinc-800">
                    {item.startDate} &mdash; {item.endDate}
                  </span>
                </div>
                <div className="flex justify-between text-[11px] text-zinc-600">
                  <span>{item.location}</span>
                </div>
                {item.description && (
                  <p className="text-[11px] text-zinc-700 leading-normal italic mt-1 pl-4">
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
        <section className="flex flex-col gap-1.5">
          <h2 className="text-sm font-bold tracking-wider text-zinc-900 uppercase border-b border-zinc-300 pb-0.5">
            Skills &amp; Qualifications
          </h2>
          <p className="text-xs text-zinc-900 leading-relaxed capitalize">
            {skills.join(", ")}
          </p>
        </section>
      )}

      {/* Optional Sections */}
      {optional && optional.length > 0 && (
        <div className="flex flex-col gap-5">
          {optional.map((section) => {
            if (section.items.length === 0) return null;
            return (
              <section key={section.id} className="flex flex-col gap-2">
                <h2 className="text-sm font-bold tracking-wider text-zinc-900 uppercase border-b border-zinc-300 pb-0.5">
                  {section.title}
                </h2>
                <div className="flex flex-col gap-2.5">
                  {section.items.map((item) => (
                    <div key={item.id} className="flex flex-col gap-0.5">
                      <div className="flex justify-between items-baseline">
                        <h3 className="text-xs font-bold text-zinc-950">
                          {item.title} {item.subtitle && <span className="font-normal italic">&mdash; {item.subtitle}</span>}
                        </h3>
                        {item.date && (
                          <span className="text-xs text-zinc-800">
                            {item.date}
                          </span>
                        )}
                      </div>
                      {item.description && (
                        <p className="text-[11px] text-zinc-700 leading-normal mt-0.5 pl-4">
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
