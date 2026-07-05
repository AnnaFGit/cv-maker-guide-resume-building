export interface ContactInfo {
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  showPhoto: boolean;
  photo?: string; // Base64 encoded string
}

export interface ExperienceItem {
  id: string;
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string; // Bullet items separated by newlines
}

export interface EducationItem {
  id: string;
  degree: string;
  school: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

export interface OptionalItem {
  id: string;
  title: string;       // e.g. Project Name, Certificate Name
  subtitle?: string;    // e.g. Organization, Issuing Body
  date?: string;        // e.g. Date completed, duration
  description?: string; // Details
}

export interface OptionalSection {
  id: string;
  title: string;        // e.g. "Certifications", "Projects", "Languages"
  items: OptionalItem[];
}

export interface CVData {
  contact: ContactInfo;
  summary: string;
  experience: ExperienceItem[];
  education: EducationItem[];
  skills: string[];
  optional: OptionalSection[];
}

export type TemplateId = "editorial" | "classic" | "compact";

export type ThemeColorId = "terracotta" | "amber" | "brick" | "olive";

export interface CVRecord {
  id: string;
  name: string;
  updatedAt: number;
  templateId: TemplateId;
  themeColor?: ThemeColorId;
  data: CVData;
}
