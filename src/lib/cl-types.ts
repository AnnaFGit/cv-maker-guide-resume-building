export interface CLContact {
  fullName: string;
  email: string;
  phone: string;
  city: string;
  linkedin: string;
}

export interface CLRecipient {
  hiringManager: string;
  company: string;
  roleTitle: string;
}

export interface CLSections {
  opening: string;
  body1: string;
  body2: string;
  closing: string;
}

export type CLTemplateId = "editorial" | "classic" | "compact";
export type CLStructureType = "skills-first" | "problem-solution" | "story-impact";

export interface CLRecord {
  id: string;
  name: string;
  updatedAt: number;
  templateId: CLTemplateId;
  contact: CLContact;
  date: string;
  recipient: CLRecipient;
  sections: CLSections;
  signoff: string;
  selectedStrengths: string[];
  yearsExperience: string;
  companyDetail: string;
  structureType: CLStructureType;
}

export const EMPTY_CL_CONTACT: CLContact = {
  fullName: "",
  email: "",
  phone: "",
  city: "",
  linkedin: "",
};

export const EMPTY_CL_RECIPIENT: CLRecipient = {
  hiringManager: "",
  company: "",
  roleTitle: "",
};

export const EMPTY_CL_SECTIONS: CLSections = {
  opening: "",
  body1: "",
  body2: "",
  closing: "",
};

export function createEmptyCLRecord(id: string): CLRecord {
  return {
    id,
    name: "Untitled Cover Letter",
    updatedAt: Date.now(),
    templateId: "editorial",
    contact: { ...EMPTY_CL_CONTACT },
    date: new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
    recipient: { ...EMPTY_CL_RECIPIENT },
    sections: { ...EMPTY_CL_SECTIONS },
    signoff: "Sincerely",
    selectedStrengths: [],
    yearsExperience: "",
    companyDetail: "",
    structureType: "skills-first",
  };
}
