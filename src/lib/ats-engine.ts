import { STOP_WORDS } from "./stopwords";
import keywordsData from "@/data/keywords.json";
import { CVData } from "./cv-types";

interface KeywordsDB {
  version: number;
  match_weights: { term: number; soft_skill: number };
  terms: Record<string, string[]>;
  soft_skills: string[];
  certifications: string[];
  acronyms: Record<string, string[]>;
}

const db = keywordsData as KeywordsDB;

// Extract all keywords from our database into a flat map with weights
const getKeywordsMap = (): Map<string, { type: "term" | "soft_skill" | "certification"; weight: number }> => {
  const map = new Map();

  // Hard skills / terms
  Object.values(db.terms).forEach((list) => {
    list.forEach((term) => {
      map.set(term.toLowerCase().trim(), { type: "term", weight: db.match_weights.term });
    });
  });

  // Soft skills
  db.soft_skills.forEach((skill) => {
    map.set(skill.toLowerCase().trim(), { type: "soft_skill", weight: db.match_weights.soft_skill });
  });

  // Certifications
  db.certifications.forEach((cert) => {
    map.set(cert.toLowerCase().trim(), { type: "certification", weight: db.match_weights.term });
  });

  return map;
};

const keywordsMap = getKeywordsMap();

// Tokenize text into words (lowercased, filtered from punctuation)
export function tokenize(text: string): string[] {
  if (!text) return [];
  return text
    .toLowerCase()
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"']/g, " ") // Strip punctuation
    .split(/\s+/)
    .filter((word) => word.length > 1 && !STOP_WORDS.has(word));
}

// Generate 1-gram, 2-gram, and 3-grams from tokenized words
export function getNGrams(words: string[]): Set<string> {
  const ngrams = new Set<string>();
  
  // 1-grams
  words.forEach((w) => ngrams.add(w));
  
  // 2-grams
  for (let i = 0; i < words.length - 1; i++) {
    ngrams.add(`${words[i]} ${words[i + 1]}`);
  }
  
  // 3-grams
  for (let i = 0; i < words.length - 2; i++) {
    ngrams.add(`${words[i]} ${words[i + 1]} ${words[i + 2]}`);
  }

  return ngrams;
}

// Stitches CV contents into a single string for full scanning
export function serializeCV(data: CVData): string {
  const parts: string[] = [];
  
  // Contact details (name, title)
  parts.push(data.contact.name || "");
  parts.push(data.contact.title || "");
  
  // Summary
  parts.push(data.summary || "");
  
  // Experience
  data.experience.forEach((exp) => {
    parts.push(exp.title || "");
    parts.push(exp.company || "");
    parts.push(exp.description || "");
  });

  // Education
  data.education.forEach((edu) => {
    parts.push(edu.degree || "");
    parts.push(edu.school || "");
    parts.push(edu.description || "");
  });

  // Skills
  parts.push(data.skills.join(" "));

  // Optional sections
  data.optional.forEach((sec) => {
    parts.push(sec.title || "");
    sec.items.forEach((item) => {
      parts.push(item.title || "");
      parts.push(item.subtitle || "");
      parts.push(item.description || "");
    });
  });

  return parts.join("\n");
}

export interface MatchResult {
  score: number;
  matchedKeywords: { keyword: string; type: string; weight: number }[];
  missingKeywords: { keyword: string; type: string; weight: number }[];
  hygieneChecks: {
    passed: boolean;
    title: string;
    description: string;
    severity: "warning" | "danger" | "success";
  }[];
}

export function checkATS(cvData: CVData, jobDescription: string): MatchResult {
  const cvText = serializeCV(cvData);
  
  const jdTokens = tokenize(jobDescription);
  const jdNGrams = getNGrams(jdTokens);
  
  const cvTokens = tokenize(cvText);
  const cvNGrams = getNGrams(cvTokens);

  // 1. Identify Target Keywords present in the Job Description
  const targetKeywords = new Set<string>();
  
  keywordsMap.forEach((meta, keyword) => {
    if (jdNGrams.has(keyword)) {
      targetKeywords.add(keyword);
    }
  });

  // Handle Acronyms: if acronym is in target, add its long form and vice versa
  Object.entries(db.acronyms).forEach(([acronym, longForms]) => {
    const acronymLower = acronym.toLowerCase();
    
    // Check if acronym or any long forms are in the JD
    const hasAcronym = jdNGrams.has(acronymLower);
    const hasLongForm = longForms.some((lf) => jdNGrams.has(lf.toLowerCase()));
    
    if (hasAcronym || hasLongForm) {
      targetKeywords.add(acronymLower);
      longForms.forEach((lf) => {
        const lfLower = lf.toLowerCase();
        // Only add if it exists in our dictionary
        if (keywordsMap.has(lfLower)) {
          targetKeywords.add(lfLower);
        }
      });
    }
  });

  const matchedKeywords: { keyword: string; type: string; weight: number }[] = [];
  const missingKeywords: { keyword: string; type: string; weight: number }[] = [];
  
  let matchedWeight = 0;
  let totalWeight = 0;

  // 2. Evaluate CV matches against targets
  targetKeywords.forEach((keyword) => {
    const meta = keywordsMap.get(keyword) || { type: "term", weight: 1.0 };
    totalWeight += meta.weight;

    // Check if CV matches this keyword (or its acronym equivalent)
    let isMatched = cvNGrams.has(keyword);

    // If not matched, check if an acronym equivalent is matched in the CV
    if (!isMatched) {
      // Check if keyword is an acronym
      if (db.acronyms[keyword.toUpperCase()]) {
        const longForms = db.acronyms[keyword.toUpperCase()];
        isMatched = longForms.some((lf) => cvNGrams.has(lf.toLowerCase()));
      } else {
        // Check if keyword is one of the long forms of an acronym
        Object.entries(db.acronyms).forEach(([acronym, longForms]) => {
          if (longForms.map((lf) => lf.toLowerCase()).includes(keyword)) {
            if (cvNGrams.has(acronym.toLowerCase())) {
              isMatched = true;
            }
          }
        });
      }
    }

    if (isMatched) {
      matchedWeight += meta.weight;
      matchedKeywords.push({ keyword, type: meta.type, weight: meta.weight });
    } else {
      missingKeywords.push({ keyword, type: meta.type, weight: meta.weight });
    }
  });

  // Calculate final score
  const score = totalWeight > 0 ? Math.round((matchedWeight / totalWeight) * 100) : 0;

  // 3. Compile Hygiene Checks
  const hygieneChecks: MatchResult["hygieneChecks"] = [];

  // Check 1: Photo Check
  if (cvData.contact.showPhoto) {
    hygieneChecks.push({
      passed: false,
      title: "Profile Photo Detected",
      description: "In major English-speaking markets (US/UK/Canada), resumes with photos are often automatically rejected by compliance filters to avoid bias claims.",
      severity: "danger",
    });
  } else {
    hygieneChecks.push({
      passed: true,
      title: "No Photo (ATS-safe)",
      description: "Excellent. Removing photos complies with standard recruitment best practices.",
      severity: "success",
    });
  }

  // Check 2: Keyword Stuffing Check (repeated >6 times)
  const stuffedKeywords: string[] = [];
  
  targetKeywords.forEach((keyword) => {
    // Count exact occurrences of keyword in CV tokens
    let count = 0;
    
    // Simple 1-word count for speed
    if (!keyword.includes(" ")) {
      cvTokens.forEach((t) => {
        if (t === keyword) count++;
      });
    } else {
      // N-gram count
      const parts = cvText.toLowerCase().split(keyword);
      count = parts.length - 1;
    }

    if (count > 6) {
      stuffedKeywords.push(keyword);
    }
  });

  if (stuffedKeywords.length > 0) {
    hygieneChecks.push({
      passed: false,
      title: "Keyword Stuffing Detected",
      description: `The term(s) [${stuffedKeywords.join(", ")}] appeared more than 6 times. Modern ATS algorithms flag artificial stuffing, and it reads poorly to human reviewers.`,
      severity: "warning",
    });
  } else {
    hygieneChecks.push({
      passed: true,
      title: "Natural Keyword Density",
      description: "No stuffed keywords detected. Your keywords are distributed organically.",
      severity: "success",
    });
  }

  // Check 3: Summary Length Check
  const summaryWords = cvData.summary ? cvData.summary.trim().split(/\s+/).filter(Boolean).length : 0;
  if (summaryWords > 80) {
    hygieneChecks.push({
      passed: false,
      title: "Summary is Too Wordy",
      description: `Your summary is ${summaryWords} words. Recruiters scan in 6 seconds; keep it to a tight 30–80 words (2-3 sentences).`,
      severity: "warning",
    });
  } else if (summaryWords > 0 && summaryWords < 30) {
    hygieneChecks.push({
      passed: false,
      title: "Summary is Too Short",
      description: `Your summary is only ${summaryWords} words. Expand it slightly (aim for 30-80 words) to frame your value proposition.`,
      severity: "warning",
    });
  } else {
    hygieneChecks.push({
      passed: true,
      title: "Optimal Summary Length",
      description: "Your professional summary fits the recommended length guideline.",
      severity: "success",
    });
  }

  // Sort missing keywords by weight (higher weight terms first)
  missingKeywords.sort((a, b) => b.weight - a.weight);

  return {
    score,
    matchedKeywords,
    missingKeywords,
    hygieneChecks,
  };
}
