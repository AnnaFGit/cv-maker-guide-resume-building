import { jsPDF } from "jspdf";
import { CVData, TemplateId, ThemeColorId } from "./cv-types";

export function generatePDF(
  data: CVData,
  templateId: TemplateId,
  themeColor: ThemeColorId = "terracotta"
): string {
  // A4 size in points: 595.27 x 841.89 (approx 595 x 842)
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "pt",
    format: "a4",
  });

  const { contact, summary, experience, education, skills, optional } = data;

  const leftMargin = 50;
  const rightMargin = 50;
  const contentWidth = 595 - leftMargin - rightMargin;
  const pageHeight = 842;
  const yLimit = pageHeight - 50; // Leave 50pt margin at bottom
  let y = 50;

  // Determine fonts based on template
  const headerFont = templateId === "compact" ? "helvetica" : "times";
  const bodyFont = templateId === "classic" ? "times" : "helvetica";
  const monoFont = "courier";

  // Resolve accent RGB values for PDF rendering
  const themeRGB = {
    terracotta: { fill: [185, 80, 46], text: [168, 67, 31] },
    amber: { fill: [217, 119, 6], text: [180, 83, 9] },
    brick: { fill: [161, 46, 46], text: [143, 35, 35] },
    olive: { fill: [91, 123, 62], text: [73, 100, 48] },
  };

  const colors = themeRGB[themeColor] || themeRGB.terracotta;

  // Helper to check space and page break
  const checkSpace = (needed: number) => {
    if (y + needed > yLimit) {
      doc.addPage();
      y = 50;
      return true;
    }
    return false;
  };

  const renderSectionHeader = (title: string) => {
    checkSpace(35);
    y += 10;
    doc.setFont(headerFont, "bold");
    doc.setFontSize(12);
    
    // Custom style for Editorial
    if (templateId === "editorial") {
      doc.setTextColor(colors.fill[0], colors.fill[1], colors.fill[2]);
    } else {
      doc.setTextColor(33, 29, 24);
    }
    
    doc.text(title.toUpperCase(), leftMargin, y);
    y += 5;
    
    // Draw hairline divider
    doc.setDrawColor(228, 219, 204);
    doc.setLineWidth(0.5);
    doc.line(leftMargin, y, leftMargin + contentWidth, y);
    y += 15;
    doc.setTextColor(33, 29, 24); // Reset text color
  };

  // --- 1. HEADER SECTION ---
  if (templateId === "classic") {
    // Centered header for Classic
    doc.setFont(headerFont, "bold");
    doc.setFontSize(22);
    const name = contact.name || "Your Name";
    const nameWidth = doc.getTextWidth(name);
    doc.text(name, (595 - nameWidth) / 2, y);
    y += 18;

    doc.setFont(headerFont, "bold");
    doc.setFontSize(11);
    const title = (contact.title || "Professional Title").toUpperCase();
    const titleWidth = doc.getTextWidth(title);
    doc.text(title, (595 - titleWidth) / 2, y);
    y += 15;

    doc.setFont(bodyFont, "normal");
    doc.setFontSize(9);
    const details = [contact.email, contact.phone, contact.location, contact.linkedin]
      .filter(Boolean)
      .join("  |  ");
    const detailsWidth = doc.getTextWidth(details);
    doc.text(details, (595 - detailsWidth) / 2, y);
    y += 20;
  } else {
    // Left-aligned header for Editorial & Compact
    doc.setFont(headerFont, "bold");
    doc.setFontSize(templateId === "compact" ? 20 : 24);
    doc.text(contact.name || "Your Name", leftMargin, y);
    y += templateId === "compact" ? 14 : 18;

    doc.setFont(headerFont, templateId === "compact" ? "bold" : "italic");
    doc.setFontSize(templateId === "compact" ? 10 : 12);
    if (templateId === "editorial") {
      doc.setTextColor(colors.text[0], colors.text[1], colors.text[2]);
    }
    doc.text(contact.title || "Professional Title", leftMargin, y);
    doc.setTextColor(33, 29, 24); // Reset
    y += templateId === "compact" ? 12 : 15;

    doc.setFont(bodyFont, "normal");
    doc.setFontSize(9);
    const details = [contact.email, contact.phone, contact.location, contact.linkedin]
      .filter(Boolean)
      .join("   •   ");
    doc.text(details, leftMargin, y);
    y += 20;
  }

  // Draw thick accent border under Editorial header
  if (templateId === "editorial") {
    doc.setDrawColor(colors.fill[0], colors.fill[1], colors.fill[2]);
    doc.setLineWidth(2);
    doc.line(leftMargin, y - 5, leftMargin + contentWidth, y - 5);
    y += 5;
  } else {
    doc.setDrawColor(33, 29, 24);
    doc.setLineWidth(0.5);
    doc.line(leftMargin, y - 5, leftMargin + contentWidth, y - 5);
    y += 5;
  }

  // --- 2. SUMMARY SECTION ---
  if (summary) {
    renderSectionHeader("Professional Summary");
    doc.setFont(bodyFont, "normal");
    doc.setFontSize(9.5);
    const lines = doc.splitTextToSize(summary, contentWidth);
    const needed = lines.length * 13;
    checkSpace(needed);
    doc.text(lines, leftMargin, y);
    y += needed + 10;
  }

  // --- 3. EXPERIENCE SECTION ---
  if (experience && experience.length > 0) {
    renderSectionHeader("Professional Experience");
    experience.forEach((item) => {
      checkSpace(40);
      // Job title + Company
      doc.setFont(headerFont, "bold");
      doc.setFontSize(10.5);
      const titleStr = item.title || "Untitled Role";
      const companyStr = item.company ? ` - ${item.company}` : "";
      doc.text(`${titleStr}${companyStr}`, leftMargin, y);

      // Dates (Right-aligned)
      doc.setFont(monoFont, "normal");
      doc.setFontSize(9);
      const dateStr = `${item.startDate} - ${item.current ? "Present" : item.endDate}`;
      const dateWidth = doc.getTextWidth(dateStr);
      doc.text(dateStr, 595 - rightMargin - dateWidth, y);
      y += 12;

      // Location
      if (item.location) {
        doc.setFont(bodyFont, "italic");
        doc.setFontSize(9);
        doc.text(item.location, leftMargin, y);
        y += 12;
      }

      // Bullets
      if (item.description) {
        doc.setFont(bodyFont, "normal");
        doc.setFontSize(9);
        const bullets = item.description.split("\n").filter(Boolean);
        
        bullets.forEach((bullet) => {
          const cleanBullet = bullet.trim();
          const wrapped = doc.splitTextToSize(cleanBullet, contentWidth - 15);
          const neededLines = wrapped.length * 12;
          
          checkSpace(neededLines);
          
          // Draw bullet point symbol
          doc.text("•", leftMargin + 5, y);
          // Render actual text
          doc.text(wrapped, leftMargin + 15, y);
          y += neededLines + 2;
        });
      }
      y += 8;
    });
  }

  // --- 4. EDUCATION SECTION ---
  if (education && education.length > 0) {
    renderSectionHeader("Education");
    education.forEach((item) => {
      checkSpace(35);
      // Degree
      doc.setFont(headerFont, "bold");
      doc.setFontSize(10.5);
      doc.text(item.degree || "Degree", leftMargin, y);

      // Dates (Right-aligned)
      doc.setFont(monoFont, "normal");
      doc.setFontSize(9);
      const dateStr = `${item.startDate} - ${item.endDate}`;
      const dateWidth = doc.getTextWidth(dateStr);
      doc.text(dateStr, 595 - rightMargin - dateWidth, y);
      y += 12;

      // School & Location
      doc.setFont(bodyFont, "normal");
      doc.setFontSize(9);
      const schoolLoc = [item.school, item.location].filter(Boolean).join(", ");
      doc.text(schoolLoc, leftMargin, y);
      y += 12;

      // Details
      if (item.description) {
        const wrapped = doc.splitTextToSize(item.description, contentWidth);
        const needed = wrapped.length * 12;
        checkSpace(needed);
        doc.text(wrapped, leftMargin, y);
        y += needed;
      }
      y += 10;
    });
  }

  // --- 5. SKILLS SECTION ---
  if (skills && skills.length > 0) {
    renderSectionHeader("Skills & Technologies");
    doc.setFont(bodyFont, "normal");
    doc.setFontSize(9.5);
    const skillsStr = skills.join(", ");
    const wrapped = doc.splitTextToSize(skillsStr, contentWidth);
    const needed = wrapped.length * 13;
    checkSpace(needed);
    doc.text(wrapped, leftMargin, y);
    y += needed + 10;
  }

  // --- 6. OPTIONAL SECTIONS ---
  if (optional && optional.length > 0) {
    optional.forEach((section) => {
      if (section.items.length === 0) return;
      renderSectionHeader(section.title);

      section.items.forEach((item) => {
        checkSpace(35);
        // Item title
        doc.setFont(headerFont, "bold");
        doc.setFontSize(10.5);
        doc.text(item.title || "Untitled Item", leftMargin, y);

        // Date (Right-aligned)
        if (item.date) {
          doc.setFont(monoFont, "normal");
          doc.setFontSize(9);
          const dateWidth = doc.getTextWidth(item.date);
          doc.text(item.date, 595 - rightMargin - dateWidth, y);
        }
        y += 12;

        // Subtitle
        if (item.subtitle) {
          doc.setFont(bodyFont, "italic");
          doc.setFontSize(9);
          doc.text(item.subtitle, leftMargin, y);
          y += 12;
        }

        // Description
        if (item.description) {
          doc.setFont(bodyFont, "normal");
          doc.setFontSize(9);
          const wrapped = doc.splitTextToSize(item.description, contentWidth);
          const needed = wrapped.length * 12;
          checkSpace(needed);
          doc.text(wrapped, leftMargin, y);
          y += needed;
        }
        y += 8;
      });
    });
  }

  // Output as base64 string
  return doc.output("datauristring").split(",")[1];
}
