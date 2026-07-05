import { jsPDF } from "jspdf";
import { CLRecord, CLTemplateId } from "./cl-types";

export function generateCLPDF(record: CLRecord): string {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "pt",
    format: "a4",
  });

  const { contact, date, recipient, sections, signoff, templateId } = record;

  const leftMargin = 50;
  const rightMargin = 50;
  const contentWidth = 595 - leftMargin - rightMargin;
  const pageHeight = 842;
  const yLimit = pageHeight - 50;
  let y = 50;

  // Match CV PDF font logic exactly — uses jsPDF core fonts only
  const headerFont = templateId === "compact" ? "helvetica" : "times";
  const bodyFont = templateId === "classic" ? "times" : "helvetica";

  const checkSpace = (needed: number) => {
    if (y + needed > yLimit) {
      doc.addPage();
      y = 50;
    }
  };

  const renderWrapped = (text: string, fontSize: number, lineHeight: number) => {
    doc.setFontSize(fontSize);
    const lines = doc.splitTextToSize(text, contentWidth);
    const needed = lines.length * lineHeight;
    checkSpace(needed);
    doc.text(lines, leftMargin, y);
    y += needed;
  };

  // --- SENDER CONTACT BLOCK ---
  renderContactBlock(doc, contact, templateId, headerFont, bodyFont, leftMargin, contentWidth);
  y = doc.getNumberOfPages() === 1 ? getContactBlockHeight(templateId) : y;

  // --- DATE ---
  y += 5;
  doc.setFont(bodyFont, "normal");
  doc.setFontSize(9.5);
  doc.setTextColor(33, 29, 24);
  if (date) {
    doc.text(date, leftMargin, y);
    y += 16;
  }

  // --- RECIPIENT BLOCK ---
  if (recipient.hiringManager || recipient.company || recipient.roleTitle) {
    doc.setFont(bodyFont, "normal");
    doc.setFontSize(9.5);
    if (recipient.hiringManager) {
      doc.text(recipient.hiringManager, leftMargin, y);
      y += 13;
    }
    if (recipient.company) {
      doc.text(recipient.company, leftMargin, y);
      y += 13;
    }
    if (recipient.roleTitle) {
      doc.setFont(bodyFont, "italic");
      doc.text(`Re: ${recipient.roleTitle}`, leftMargin, y);
      y += 13;
    }
    y += 5;
  }

  // --- GREETING ---
  doc.setFont(bodyFont, "normal");
  doc.setFontSize(10);
  const greeting = recipient.hiringManager
    ? `Dear ${recipient.hiringManager},`
    : recipient.company
      ? `Dear ${recipient.company} Hiring Team,`
      : "Dear Hiring Team,";
  checkSpace(20);
  doc.text(greeting, leftMargin, y);
  y += 20;

  // --- BODY SECTIONS ---
  doc.setFont(bodyFont, "normal");
  doc.setFontSize(10);
  doc.setTextColor(33, 29, 24);
  const lineHeight = 14;

  if (sections.opening) {
    renderWrapped(sections.opening, 10, lineHeight);
    y += 10;
  }
  if (sections.body1) {
    renderWrapped(sections.body1, 10, lineHeight);
    y += 10;
  }
  if (sections.body2) {
    renderWrapped(sections.body2, 10, lineHeight);
    y += 10;
  }
  if (sections.closing) {
    renderWrapped(sections.closing, 10, lineHeight);
    y += 20;
  }

  // --- SIGNOFF ---
  checkSpace(50);
  doc.setFont(bodyFont, "normal");
  doc.setFontSize(10);
  doc.text(signoff || "Sincerely", leftMargin, y);
  y += 30;

  // --- NAME ---
  doc.setFont(headerFont, "bold");
  doc.setFontSize(12);
  doc.text(contact.fullName || "", leftMargin, y);

  return doc.output("datauristring").split(",")[1];
}

// Helper: render sender contact block at top of page
function renderContactBlock(
  doc: jsPDF,
  contact: { fullName: string; email: string; phone: string; city: string; linkedin: string },
  templateId: CLTemplateId,
  headerFont: string,
  bodyFont: string,
  leftMargin: number,
  contentWidth: number,
) {
  let y = 50;

  if (templateId === "classic") {
    // Centered
    doc.setFont(headerFont, "bold");
    doc.setFontSize(20);
    const name = contact.fullName || "Your Name";
    const nameWidth = doc.getTextWidth(name);
    doc.text(name, (595 - nameWidth) / 2, y);
    y += 16;

    doc.setFont(bodyFont, "normal");
    doc.setFontSize(9);
    const details = [contact.email, contact.phone, contact.city, contact.linkedin]
      .filter(Boolean)
      .join("  |  ");
    const detailsWidth = doc.getTextWidth(details);
    doc.text(details, (595 - detailsWidth) / 2, y);
    y += 15;

    doc.setDrawColor(33, 29, 24);
    doc.setLineWidth(0.5);
    doc.line(leftMargin, y, leftMargin + contentWidth, y);
  } else {
    // Left-aligned for Editorial & Compact
    doc.setFont(headerFont, "bold");
    doc.setFontSize(templateId === "compact" ? 18 : 22);
    doc.text(contact.fullName || "Your Name", leftMargin, y);
    y += templateId === "compact" ? 14 : 18;

    doc.setFont(bodyFont, "normal");
    doc.setFontSize(9);
    const details = [contact.email, contact.phone, contact.city, contact.linkedin]
      .filter(Boolean)
      .join("   •   ");
    doc.text(details, leftMargin, y);
    y += 12;

    if (templateId === "editorial") {
      doc.setDrawColor(185, 80, 46);
      doc.setLineWidth(2);
    } else {
      doc.setDrawColor(33, 29, 24);
      doc.setLineWidth(0.5);
    }
    doc.line(leftMargin, y, leftMargin + contentWidth, y);
  }
}

function getContactBlockHeight(templateId: CLTemplateId): number {
  if (templateId === "classic") return 50 + 16 + 15 + 10;
  if (templateId === "compact") return 50 + 14 + 12 + 10;
  return 50 + 18 + 12 + 10; // editorial
}
