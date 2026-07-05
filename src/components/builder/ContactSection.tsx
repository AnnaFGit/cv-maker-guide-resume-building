import React from "react";
import { ContactInfo } from "@/lib/cv-types";
import TextField from "@/components/ui/TextField";

interface ContactSectionProps {
  value: ContactInfo;
  onChange: (val: ContactInfo) => void;
}

export default function ContactSection({ value, onChange }: ContactSectionProps) {
  const handleFieldChange = (field: keyof ContactInfo, val: string | boolean) => {
    onChange({
      ...value,
      [field]: val,
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="border-b border-border pb-2">
        <h3 className="font-serif text-md font-bold text-ink">Contact Details</h3>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <TextField
          label="Full Name"
          id="contact-name"
          value={value.name || ""}
          onChange={(e) => handleFieldChange("name", e.target.value)}
          placeholder="e.g. Alex Carter"
        />
        <TextField
          label="Professional Title"
          id="contact-title"
          value={value.title || ""}
          onChange={(e) => handleFieldChange("title", e.target.value)}
          placeholder="e.g. Senior Software Engineer"
        />
        <TextField
          label="Email Address"
          id="contact-email"
          type="email"
          value={value.email || ""}
          onChange={(e) => handleFieldChange("email", e.target.value)}
          placeholder="e.g. alex.carter@domain.com"
        />
        <TextField
          label="Phone Number"
          id="contact-phone"
          value={value.phone || ""}
          onChange={(e) => handleFieldChange("phone", e.target.value)}
          placeholder="e.g. +1 (555) 019-2834"
        />
        <TextField
          label="Location (City, Country)"
          id="contact-location"
          value={value.location || ""}
          onChange={(e) => handleFieldChange("location", e.target.value)}
          placeholder="e.g. San Francisco, CA"
          helperText="City and State/Country is safer than a full home address."
        />
        <TextField
          label="LinkedIn Profile URL"
          id="contact-linkedin"
          value={value.linkedin || ""}
          onChange={(e) => handleFieldChange("linkedin", e.target.value)}
          placeholder="e.g. linkedin.com/in/alexcarter"
        />
      </div>
    </div>
  );
}
