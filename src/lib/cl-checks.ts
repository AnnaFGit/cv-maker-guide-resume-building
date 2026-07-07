import { CLSections, CLRecipient } from "./cl-types";

export interface CLCheck {
  passed: boolean;
  title: string;
  description: string;
  severity: "warning" | "danger" | "success";
}

const CLICHE_BLACKLIST = [
  "i am writing to apply",
  "i am writing to express my interest",
  "esteemed company",
  "esteemed organization",
  "i am the perfect candidate",
  "i believe i am the ideal",
  "passion for excellence",
  "i am a hard worker",
  "i am a team player",
  "to whom it may concern",
  "dear sir or madam",
  "dear hiring manager",
  "please find attached",
  "i would like to take this opportunity",
  "i am confident that i am the best",
];

const CLICHE_OPENER_ALTERNATIVES = [
  "Open with a concrete achievement or result.",
  "Lead with the specific impact you made in a previous role.",
  "Start by connecting your expertise to what the company needs.",
];

/**
 * Run deterministic quality checks on a cover letter.
 * Word count is body-only: opening + body1 + body2 + closing.
 * Contact block, date, greeting, and signoff are excluded.
 */
export function runCLChecks(
  sections: CLSections,
  recipient: CLRecipient,
): CLCheck[] {
  const checks: CLCheck[] = [];
  const bodyText = [
    sections.opening,
    sections.body1,
    sections.body2,
    sections.closing,
  ].join(" ");

  // 1. Word count band (150–250 words, body only)
  const wordCount = bodyText
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;

  if (wordCount === 0) {
    checks.push({
      passed: false,
      title: "No Content Yet",
      description:
        "Your letter body is empty. Use the draft generator or write your sections to get started.",
      severity: "warning",
    });
  } else if (wordCount < 150) {
    checks.push({
      passed: false,
      title: `Too Short (${wordCount} words)`,
      description: `Your letter body is ${wordCount} words. Aim for 150-250 words - most effective cover letters are about half a page.`,
      severity: "warning",
    });
  } else if (wordCount > 250) {
    checks.push({
      passed: false,
      title: `Too Long (${wordCount} words)`,
      description: `Your letter body is ${wordCount} words. Keep it under 250 words - hiring managers scan, not read.`,
      severity: "warning",
    });
  } else {
    checks.push({
      passed: true,
      title: `Good Length (${wordCount} words)`,
      description: "Your letter is within the recommended 150–250 word range.",
      severity: "success",
    });
  }

  // 2. Greeting check
  const openingLower = sections.opening.toLowerCase();
  if (
    openingLower.includes("to whom it may concern") ||
    openingLower.includes("dear sir or madam")
  ) {
    checks.push({
      passed: false,
      title: "Generic Greeting",
      description:
        'Avoid "To Whom It May Concern" or "Dear Sir or Madam". Address the hiring manager by name, or use "Dear [Company] Hiring Team".',
      severity: "warning",
    });
  } else {
    checks.push({
      passed: true,
      title: "Personalized Greeting",
      description: "Your opening avoids generic greetings.",
      severity: "success",
    });
  }

  // 3. Specificity — company name and role title in the body
  const bodyLower = (sections.body1 + " " + sections.body2).toLowerCase();
  const hasCompany =
    recipient.company.trim().length > 0 &&
    bodyLower.includes(recipient.company.toLowerCase());
  const hasRole =
    recipient.roleTitle.trim().length > 0 &&
    bodyLower.includes(recipient.roleTitle.toLowerCase());

  if (!hasCompany && recipient.company.trim().length > 0) {
    checks.push({
      passed: false,
      title: "Company Name Missing from Body",
      description: `Mention "${recipient.company}" in your body paragraphs to show the letter is tailored.`,
      severity: "warning",
    });
  } else if (recipient.company.trim().length > 0) {
    checks.push({
      passed: true,
      title: "Company Name Present",
      description: `"${recipient.company}" appears in your letter body.`,
      severity: "success",
    });
  }

  if (!hasRole && recipient.roleTitle.trim().length > 0) {
    checks.push({
      passed: false,
      title: "Role Title Missing from Body",
      description: `Reference the "${recipient.roleTitle}" position in your body to demonstrate relevance.`,
      severity: "warning",
    });
  } else if (recipient.roleTitle.trim().length > 0) {
    checks.push({
      passed: true,
      title: "Role Title Present",
      description: "The target role is mentioned in your letter body.",
      severity: "success",
    });
  }

  // 4. Cliché blacklist
  const allTextLower = bodyText.toLowerCase();
  const foundCliches: string[] = [];

  for (const cliche of CLICHE_BLACKLIST) {
    if (allTextLower.includes(cliche)) {
      foundCliches.push(cliche);
    }
  }

  if (foundCliches.length > 0) {
    const suggestion =
      CLICHE_OPENER_ALTERNATIVES[
        foundCliches.length % CLICHE_OPENER_ALTERNATIVES.length
      ];
    checks.push({
      passed: false,
      title: `Cliché Detected (${foundCliches.length})`,
      description: `Found: "${foundCliches[0]}". ${foundCliches.length > 1 ? `Plus ${foundCliches.length - 1} more. ` : ""}${suggestion}`,
      severity: "warning",
    });
  } else if (wordCount > 0) {
    checks.push({
      passed: true,
      title: "No Clichés Found",
      description:
        "Your letter avoids common overused phrases. Good writing.",
      severity: "success",
    });
  }

  return checks;
}
