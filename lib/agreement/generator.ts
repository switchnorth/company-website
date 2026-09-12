import fs from "node:fs";
import path from "node:path";
import PDFDocument from "pdfkit";
import { agreementDefaults, serviceAgreementVersion } from "../../data/agreement";
import { formatConsultationPrice } from "../../data/booking";
import { siteConfig } from "../../data/site";
import { contactInterestOptions } from "../../data/contact";
import {
  createAgreementTimeline,
  createServiceAgreementSections,
  validateAgreementData,
} from "./template";
import type {
  AgreementSection,
  AgreementTimelineItem,
  GeneratedAgreement,
  ServiceAgreementData,
} from "../../types/agreement";
import type { AppointmentRecord, ConsultationType } from "../../types/booking";

const margin = 54;

function createAgreementId(appointmentId: string) {
  return `agr-${appointmentId}-${Date.now().toString(36)}`;
}

function formatDate(date = new Date()) {
  return new Intl.DateTimeFormat("en-CA", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date);
}

function contactInterestLabel(value: string) {
  return (
    contactInterestOptions.find((option) => option.value === value)?.label ?? value
  );
}

function buildPdfBuffer(doc: PDFKit.PDFDocument) {
  return new Promise<Buffer>((resolve, reject) => {
    const chunks: Buffer[] = [];

    doc.on("data", (chunk: Buffer) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);
  });
}

function addHeader(doc: PDFKit.PDFDocument, data: ServiceAgreementData) {
  const logoPath = siteConfig.logo.src
    ? path.join(process.cwd(), "public", siteConfig.logo.src)
    : "";

  if (logoPath && fs.existsSync(logoPath)) {
    doc.image(logoPath, margin, 28, { fit: [105, 46] });
  }

  doc
    .font("Helvetica-Bold")
    .fontSize(10)
    .fillColor("#172a50")
    .text(data.businessName, 180, 30, { align: "right", width: 360 });
  doc
    .font("Helvetica")
    .fontSize(8.5)
    .fillColor("#526173")
    .text(`${data.businessWebsite} | ${data.businessEmail} | ${data.businessPhone}`, {
      align: "right",
      width: 360,
    });
  doc.moveTo(margin, 82).lineTo(558, 82).strokeColor("#d7e1e7").stroke();
}

function addFooter(doc: PDFKit.PDFDocument, pageNumber: number, totalPages?: number) {
  doc.moveTo(margin, 740).lineTo(558, 740).strokeColor("#d7e1e7").stroke();
  doc
    .font("Helvetica")
    .fontSize(8)
    .fillColor("#526173")
    .text(
      `Service Agreement ${serviceAgreementVersion} | Page ${pageNumber}${
        totalPages ? ` of ${totalPages}` : ""
      }`,
      margin,
      748,
      { align: "center", width: 504 },
    );
}

function ensureSpace(doc: PDFKit.PDFDocument, height: number, data: ServiceAgreementData) {
  if (doc.y + height > 720) {
    doc.addPage();
    addHeader(doc, data);
    doc.y = 102;
  }
}

function drawHeading(doc: PDFKit.PDFDocument, text: string, data: ServiceAgreementData) {
  ensureSpace(doc, 34, data);
  doc
    .font("Helvetica-Bold")
    .fontSize(12)
    .fillColor("#172a50")
    .text(text, margin, doc.y, { width: 504 });
  doc.moveDown(0.35);
}

function drawParagraph(doc: PDFKit.PDFDocument, text: string, data: ServiceAgreementData) {
  ensureSpace(doc, 44, data);
  doc
    .font("Helvetica")
    .fontSize(9.5)
    .fillColor("#0b1730")
    .text(text, margin, doc.y, {
      align: "left",
      lineGap: 3,
      width: 504,
    });
  doc.moveDown(0.45);
}

function drawBullet(doc: PDFKit.PDFDocument, text: string, data: ServiceAgreementData) {
  ensureSpace(doc, 30, data);
  const y = doc.y + 2;
  doc.circle(margin + 4, y + 4, 2).fillColor("#0f7894").fill();
  doc
    .font("Helvetica")
    .fontSize(9.5)
    .fillColor("#0b1730")
    .text(text, margin + 16, y, { lineGap: 3, width: 488 });
  doc.moveDown(0.35);
}

function drawInitials(
  doc: PDFKit.PDFDocument,
  kind: NonNullable<AgreementSection["initials"]>,
  data: ServiceAgreementData,
) {
  ensureSpace(doc, 24, data);
  const label = kind === "client" ? "Client's initials" : "Licensee's initials";
  doc
    .font("Helvetica")
    .fontSize(9)
    .fillColor("#526173")
    .text("________", margin, doc.y, { continued: true })
    .text(` (${label})`);
  doc.moveDown(0.7);
}

function drawTimeline(
  doc: PDFKit.PDFDocument,
  timeline: AgreementTimelineItem[],
  data: ServiceAgreementData,
) {
  ensureSpace(doc, 90, data);
  const widths = [215, 145, 144];
  const startX = margin;

  doc
    .font("Helvetica-Bold")
    .fontSize(8.5)
    .fillColor("#ffffff");
  doc.rect(startX, doc.y, 504, 22).fill("#172a50");
  doc.fillColor("#ffffff").text("Work Description", startX + 8, doc.y + 7, { width: widths[0] });
  doc.text("Responsible Entity", startX + widths[0] + 8, doc.y, { width: widths[1] });
  doc.text("Time Expectation", startX + widths[0] + widths[1] + 8, doc.y, {
    width: widths[2],
  });
  doc.y += 22;

  for (const item of timeline) {
    ensureSpace(doc, 38, data);
    const rowY = doc.y;
    doc.rect(startX, rowY, 504, 36).strokeColor("#d7e1e7").stroke();
    doc
      .font("Helvetica")
      .fontSize(8.5)
      .fillColor("#0b1730")
      .text(item.workDescription, startX + 8, rowY + 8, { width: widths[0] - 14 })
      .text(item.responsibleEntity, startX + widths[0] + 8, rowY + 8, {
        width: widths[1] - 14,
      })
      .text(item.timeExpectation, startX + widths[0] + widths[1] + 8, rowY + 8, {
        width: widths[2] - 14,
      });
    doc.y = rowY + 36;
  }

  doc.moveDown(0.8);
}

function drawFeeMilestones(doc: PDFKit.PDFDocument, data: ServiceAgreementData) {
  ensureSpace(doc, 70, data);
  doc
    .font("Helvetica-Bold")
    .fontSize(10)
    .fillColor("#172a50")
    .text("Payment Milestones", margin, doc.y);
  doc.moveDown(0.3);

  for (const milestone of data.paymentMilestones) {
    drawParagraph(
      doc,
      `${milestone.label}: ${milestone.amount}. Due: ${milestone.due}.`,
      data,
    );
  }
}

function drawSignatureBlocks(doc: PDFKit.PDFDocument, data: ServiceAgreementData) {
  ensureSpace(doc, 150, data);
  doc.moveDown(0.7);
  doc
    .font("Helvetica-Bold")
    .fontSize(10)
    .fillColor("#172a50")
    .text("THE PARTIES HERETO HAVE SIGNED ON THE DATE NOTED BELOW:", margin, doc.y);
  doc.moveDown(1);

  const y = doc.y;
  const blockWidth = 232;
  doc.rect(margin, y, blockWidth, 118).strokeColor("#d7e1e7").stroke();
  doc.rect(margin + 272, y, blockWidth, 118).strokeColor("#d7e1e7").stroke();

  doc
    .font("Helvetica-Bold")
    .fontSize(9.5)
    .fillColor("#0b1730")
    .text("Client Signature: [ ]", margin + 12, y + 14, { width: blockWidth - 24 })
    .font("Helvetica")
    .fontSize(9)
    .text(data.agreementDate, margin + 12, y + 34)
    .text(data.clientName, margin + 12, y + 55)
    .text(data.clientAddress, margin + 12, y + 70, { width: blockWidth - 24 })
    .text(data.clientEmail, margin + 12, y + 92);

  doc
    .font("Helvetica-Bold")
    .fontSize(9.5)
    .fillColor("#0b1730")
    .text("Licensee Signature: [ ]", margin + 284, y + 14, { width: blockWidth - 24 })
    .font("Helvetica")
    .fontSize(9)
    .text(data.agreementDate, margin + 284, y + 34)
    .text(data.consultantName, margin + 284, y + 55)
    .text(data.businessAddress, margin + 284, y + 70, { width: blockWidth - 24 })
    .text(`${data.businessPhone} | ${data.businessEmail}`, margin + 284, y + 96, {
      width: blockWidth - 24,
    });
  doc.y = y + 132;
}

export function createServiceAgreementData({
  appointment,
  consultationType,
}: {
  appointment: AppointmentRecord;
  consultationType: ConsultationType;
}): ServiceAgreementData {
  const fee = formatConsultationPrice(consultationType);

  return {
    agreementId: createAgreementId(appointment.id),
    agreementVersion: serviceAgreementVersion,
    agreementDate: formatDate(),
    clientName: appointment.client.fullName,
    clientEmail: appointment.client.email,
    clientPhone: appointment.client.phone,
    clientAddress: appointment.client.country || "To be confirmed",
    consultantName: siteConfig.consultantName,
    consultantTitle: siteConfig.consultantTitle,
    consultantLicenseNumber: siteConfig.consultantLicense,
    businessName: siteConfig.businessName,
    businessAddress: siteConfig.address,
    businessEmail: siteConfig.email,
    businessPhone: siteConfig.phone,
    businessWebsite: siteConfig.domain,
    applicationType: contactInterestLabel(appointment.client.interest),
    consultationType: consultationType.title,
    professionalFee: fee,
    tax: agreementDefaults.tax,
    totalFee: fee,
    initialPayment: fee,
    remainingPayment: "CAD $0.00 unless additional services are agreed separately",
    paymentMilestones: [
      {
        label: "Consultation payment",
        amount: fee,
        due: "Paid through Stripe Checkout before confirmation",
      },
      {
        label: "Additional services",
        amount: "To be agreed separately",
        due: "Only if a new service agreement is approved",
      },
    ],
    estimatedProcessingTime: agreementDefaults.estimatedProcessingTime,
    governingProvince: agreementDefaults.governingProvince,
    documentInstructions: agreementDefaults.documentInstructions,
  };
}

export async function generateServiceAgreementPdf(
  data: ServiceAgreementData,
): Promise<GeneratedAgreement> {
  const missingFields = validateAgreementData(data);

  if (missingFields.length > 0) {
    throw new Error(`Missing required agreement fields: ${missingFields.join(", ")}`);
  }

  const doc = new PDFDocument({
    autoFirstPage: false,
    bufferPages: true,
    margin,
    size: "LETTER",
  });
  const bufferPromise = buildPdfBuffer(doc);

  doc.addPage();
  addHeader(doc, data);
  doc.y = 102;
  doc
    .font("Helvetica-Bold")
    .fontSize(20)
    .fillColor("#172a50")
    .text("Service Agreement", margin, doc.y, { width: 504 });
  doc
    .font("Helvetica")
    .fontSize(9.5)
    .fillColor("#526173")
    .text(`Agreement ID: ${data.agreementId}`, margin, doc.y + 8, { align: "right", width: 504 });
  doc.moveDown(1.2);

  const sections = createServiceAgreementSections(data);

  for (const section of sections) {
    drawHeading(doc, `${section.id}. ${section.title}`, data);

    for (const sectionParagraph of section.paragraphs ?? []) {
      drawParagraph(doc, sectionParagraph, data);
    }

    if (section.id === "7") {
      drawFeeMilestones(doc, data);
      drawTimeline(doc, createAgreementTimeline(data), data);
    }

    for (const bullet of section.bullets ?? []) {
      drawBullet(doc, bullet, data);
    }

    if (section.initials) {
      drawInitials(doc, section.initials, data);
    }
  }

  drawSignatureBlocks(doc, data);

  const range = doc.bufferedPageRange();
  for (let index = 0; index < range.count; index += 1) {
    doc.switchToPage(index);
    addFooter(doc, index + 1, range.count);
  }

  doc.end();

  return {
    agreementId: data.agreementId,
    agreementVersion: data.agreementVersion,
    fileName: `${data.businessName.replaceAll(" ", "-")}-Service-Agreement-${data.agreementId}.pdf`,
    generatedAt: new Date().toISOString(),
    pdf: await bufferPromise,
  };
}
