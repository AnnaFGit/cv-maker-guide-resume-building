import React from "react";
import { CVData } from "@/lib/cv-types";

interface TemplateProps {
  data: CVData;
}

export default function Editorial({ data }: TemplateProps) {
  const { contact, summary, experience, education, skills, optional } = data;

  const renderBullets = (text: string) => {
    if (!text) return null;
    return text.split("\n").filter(Boolean).map((bullet, idx) => (
      <li key={idx} className="text-[13px] text-zinc-800 leading-relaxed font-sans list-disc ml-4 pl-1">
        {bullet.trim()}
      </li>
    ));
  };

  return (
    <div className="bg-white p-8 md:p-12 w-full text-zinc-950 font-sans shadow-sm flex flex-col gap-6 select-text">
      {/* Contact Section */}
      <header className="border-b-2 border-accent pb-4 flex flex-col gap-2">
        <h1 className="font-serif text-3xl font-extrabold tracking-tight text-zinc-900 leading-none">
          {contact.name || "Your Name"}
        </h1>
        <p className="font-serif text-lg italic text-accent-text font-medium leading-none">
          {contact.title || "Professional Title"}
        </p>
        <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-1.5 text-xs text-zinc-600 font-sans">
          {contact.email && (
            <span className="flex items-center gap-1">
              {contact.email}
            </span>
          )}
          {contact.phone && (
            <span className="flex items-center gap-1">
              {contact.phone}
            </span>
          )}
          {contact.location && (
            <span className="flex items-center gap-1">
              {contact.location}
            </span>
          )}
          {contact.linkedin && (
            <span className="flex items-center gap-1">
              {contact.linkedin}
            </span>
          )}
        </div>
      </header>

      {/* Summary */}
      {summary && (
        <section className="flex flex-col gap-2">
          <h2 className="font-serif text-lg font-bold text-zinc-900 border-b border-zinc-200 pb-1">
            Professional Summary
          </h2>
          <p className="text-[13px] text-zinc-800 leading-relaxed font-sans">
            {summary}
          </p>
        </section>
      )}

      {/* Experience */}
      {experience && experience.length > 0 && (
        <section className="flex flex-col gap-4">
          <h2 className="font-serif text-lg font-bold text-zinc-900 border-b border-zinc-200 pb-1">
            Professional Experience
          </h2>
          <div className="flex flex-col gap-4">
            {experience.map((item) => (
              <div key={item.id} className="flex flex-col gap-1.5">
                <div className="flex justify-between items-baseline">
                  <h3 className="font-serif text-md font-bold text-zinc-900">
                    {item.title} &middot; <span className="font-sans text-xs font-semibold text-zinc-700">{item.company}</span>
                  </h3>
                  <span className="text-xs text-zinc-500 font-mono">
                    {item.startDate} &mdash; {item.current ? "Present" : item.endDate}
                  </span>
                </div>
                {item.location && (
                  <p className="text-xs text-zinc-500 italic leading-none">{item.location}</p>
                )}
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
        <section className="flex flex-col gap-4">
          <h2 className="font-serif text-lg font-bold text-zinc-900 border-b border-zinc-200 pb-1">
            Education
          </h2>
          <div className="flex flex-col gap-3">
            {education.map((item) => (
              <div key={item.id} className="flex flex-col gap-1">
                <div className="flex justify-between items-baseline">
                  <h3 className="font-serif text-md font-bold text-zinc-900">
                    {item.degree}
                  </h3>
                  <span className="text-xs text-zinc-500 font-mono">
                    {item.startDate} &mdash; {item.endDate}
                  </span>
                </div>
                <div className="flex justify-between text-xs text-zinc-600">
                  <span>{item.school}</span>
                  {item.location && <span className="italic">{item.location}</span>}
                </div>
                {item.description && (
                  <p className="text-[12px] text-zinc-700 leading-relaxed font-sans mt-1">
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
        <section className="flex flex-col gap-2">
          <h2 className="font-serif text-lg font-bold text-zinc-900 border-b border-zinc-200 pb-1">
            Skills &amp; Technologies
          </h2>
          <p className="text-[13px] text-zinc-800 leading-relaxed font-sans capitalize">
            {skills.join(", ")}
          </p>
        </section>
      )}

      {/* Optional Sections (Projects, Certifications, etc.) */}
      {optional && optional.length > 0 && (
        <div className="flex flex-col gap-6">
          {optional.map((section) => {
            if (section.items.length === 0) return null;
            return (
              <section key={section.id} className="flex flex-col gap-3">
                <h2 className="font-serif text-lg font-bold text-zinc-900 border-b border-zinc-200 pb-1">
                  {section.title}
                </h2>
                <div className="flex flex-col gap-3">
                  {section.items.map((item) => (
                    <div key={item.id} className="flex flex-col gap-1">
                      <div className="flex justify-between items-baseline">
                        <h3 className="font-serif text-md font-bold text-zinc-900">
                          {item.title}
                        </h3>
                        {item.date && (
                          <span className="text-xs text-zinc-500 font-mono">
                            {item.date}
                          </span>
                        )}
                      </div>
                      {item.subtitle && (
                        <p className="text-xs text-zinc-600 font-sans">{item.subtitle}</p>
                      )}
                      {item.description && (
                        <p className="text-[12px] text-zinc-700 leading-relaxed font-sans mt-0.5">
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
