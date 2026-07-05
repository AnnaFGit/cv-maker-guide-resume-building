import { CLStructureType, CLSections } from "./cl-types";
import { tokenize, getNGrams } from "./ats-engine";
import templates from "@/data/coverletter-templates.json";

type TemplateBank = Record<string, Record<string, string[]>>;
const templateBank = templates as TemplateBank;

export interface DraftInputs {
  structureType: CLStructureType;
  role: string;
  years: string;
  strength1: string;
  strength2: string;
  strength3: string;
  company: string;
  targetRole: string;
  companyDetail: string;
  fullName: string;
}

/**
 * Assemble a draft from the sentence template library.
 * variantIndices controls which variant is picked per section (deterministic cycling).
 * Only fills sections that are currently empty (or all if forceAll=true with user confirmation).
 */
export function assembleDraft(
  inputs: DraftInputs,
  variantIndices: { opening: number; body1: number; body2: number; closing: number },
  existingSections: CLSections,
  forceAll: boolean = false,
): CLSections {
  const bank = templateBank[inputs.structureType];
  if (!bank) return existingSections;

  const fillSection = (key: keyof CLSections): string => {
    // Don't overwrite existing content unless forced
    if (!forceAll && existingSections[key].trim().length > 0) {
      return existingSections[key];
    }

    const variants = bank[key];
    if (!variants || variants.length === 0) return existingSections[key];

    const idx = variantIndices[key] % variants.length;
    let text = variants[idx];

    // Replace placeholders
    text = text.replace(/\{role\}/g, inputs.role || "professional");
    text = text.replace(/\{years\}/g, inputs.years || "several");
    text = text.replace(/\{strength1\}/g, inputs.strength1 || "my primary skill");
    text = text.replace(/\{strength2\}/g, inputs.strength2 || "my secondary skill");
    text = text.replace(/\{strength3\}/g, inputs.strength3 || "additional capabilities");
    text = text.replace(/\{company\}/g, inputs.company || "[Company Name]");
    text = text.replace(/\{targetRole\}/g, inputs.targetRole || "[Role Title]");
    text = text.replace(/\{companyDetail\}/g, inputs.companyDetail || "your organization's mission");
    text = text.replace(/\{fullName\}/g, inputs.fullName || "");

    return text;
  };

  return {
    opening: fillSection("opening"),
    body1: fillSection("body1"),
    body2: fillSection("body2"),
    closing: fillSection("closing"),
  };
}

/** Get the number of variants available per section for a structure type */
export function getVariantCounts(structureType: CLStructureType): { opening: number; body1: number; body2: number; closing: number } {
  const bank = templateBank[structureType];
  if (!bank) return { opening: 0, body1: 0, body2: 0, closing: 0 };
  return {
    opening: bank.opening?.length ?? 0,
    body1: bank.body1?.length ?? 0,
    body2: bank.body2?.length ?? 0,
    closing: bank.closing?.length ?? 0,
  };
}

/**
 * Extract company name, role title, and top keywords from a job description.
 * Results are suggestions — never auto-committed to the letter.
 */
export interface JDMeta {
  companySuggestion: string;
  roleSuggestion: string;
  topKeywords: string[];
}

export function extractJDMeta(jdText: string): JDMeta {
  if (!jdText.trim()) return { companySuggestion: "", roleSuggestion: "", topKeywords: [] };

  const lines = jdText.split("\n").map((l) => l.trim()).filter(Boolean);
  let companySuggestion = "";
  let roleSuggestion = "";

  // Heuristic 1: Look for explicit labels
  for (const line of lines) {
    const companyMatch = line.match(/^(?:company|organization|employer)\s*[:\-–—]\s*(.+)/i);
    if (companyMatch && !companySuggestion) {
      companySuggestion = companyMatch[1].trim();
    }

    const roleMatch = line.match(/^(?:role|position|job\s*title|title)\s*[:\-–—]\s*(.+)/i);
    if (roleMatch && !roleSuggestion) {
      roleSuggestion = roleMatch[1].trim();
    }
  }

  // Heuristic 2: Look for patterns like "at [Company]" or "[Role] at [Company]"
  if (!companySuggestion || !roleSuggestion) {
    const fullText = jdText;
    const atMatch = fullText.match(/(?:^|\n)\s*(.+?)\s+at\s+(.+?)(?:\n|$)/i);
    if (atMatch) {
      if (!roleSuggestion) roleSuggestion = atMatch[1].trim();
      if (!companySuggestion) companySuggestion = atMatch[2].trim().replace(/[.,:;]$/, "");
    }
  }

  // Heuristic 3: First non-trivial line could be the role title
  if (!roleSuggestion && lines.length > 0) {
    const firstLine = lines[0];
    if (firstLine.length < 80 && !firstLine.includes(".")) {
      roleSuggestion = firstLine;
    }
  }

  // Extract top keywords using the ATS tokenizer
  const tokens = tokenize(jdText);
  const ngrams = getNGrams(tokens);

  // Count frequency of tokens
  const freq = new Map<string, number>();
  tokens.forEach((t) => {
    freq.set(t, (freq.get(t) || 0) + 1);
  });

  // Sort by frequency and take top keywords (skip very short ones)
  const topKeywords = Array.from(freq.entries())
    .filter(([word]) => word.length > 2)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([word]) => word);

  // Also check for 2-grams that appear at least twice
  const bigramFreq = new Map<string, number>();
  const tokArr = tokens;
  for (let i = 0; i < tokArr.length - 1; i++) {
    const bigram = `${tokArr[i]} ${tokArr[i + 1]}`;
    bigramFreq.set(bigram, (bigramFreq.get(bigram) || 0) + 1);
  }

  const topBigrams = Array.from(bigramFreq.entries())
    .filter(([, count]) => count >= 2)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([phrase]) => phrase);

  const combined = [...topBigrams, ...topKeywords].slice(0, 10);

  // Suppress lint: ngrams is used for potential future expansion
  void ngrams;

  return {
    companySuggestion,
    roleSuggestion,
    topKeywords: combined,
  };
}
