import fs from "fs";
import path from "path";
import PDFDocument from "pdfkit";

function formatUSD(cents = 0) {
    return `$${(cents / 100).toFixed(2)}`;
}

export function generateContractPdf(record) {
    const contractsDir = path.join(process.cwd(), "contracts");
    if (!fs.existsSync(contractsDir)) fs.mkdirSync(contractsDir, { recursive: true });

    const pdfPath = path.join(contractsDir, `${record.id}.pdf`);

    // Find signature files we uploaded
    const sigA = (record.evidence || []).find((f) => f.name === "sigA.png");
    const sigB = (record.evidence || []).find((f) => f.name === "sigB.png");

    const amountCents = record.amountCents || 0;
    const downPaymentCents = record.downPaymentCents || 0;
    const months = record.months || 0;

    const remainingCents = Math.max(0, amountCents - downPaymentCents);
    const monthlyCents = months ? Math.ceil(remainingCents / months) : 0;

    const doc = new PDFDocument({ size: "LETTER", margin: 50 });
    const stream = fs.createWriteStream(pdfPath);
    doc.pipe(stream);

    // Header
    doc.fontSize(20).text("TapToSettle – Property Damage Settlement", { bold: true });
    doc.moveDown(0.5);
    doc.fontSize(11).fillColor("#444").text(`Case ID: ${record.id}`);
    doc.text(`Created: ${record.createdAt || new Date().toISOString()}`);
    doc.moveDown();

    // Terms
    doc.fillColor("#000").fontSize(12).text("Settlement Terms", { underline: true });
    doc.moveDown(0.5);

    doc.fontSize(11).text(`Settlement Amount: ${formatUSD(amountCents)}`);
    doc.text(`Down Payment: ${formatUSD(downPaymentCents)}`);
    doc.text(`Remaining Balance: ${formatUSD(remainingCents)}`);
    doc.text(`Term: ${months} month(s)`);
    doc.text(`Estimated Monthly Payment: ${formatUSD(monthlyCents)}`);
    doc.moveDown();

    doc.fontSize(10).fillColor("#111").text(
        "This settlement is for PROPERTY DAMAGE ONLY. Both parties affirm that no injuries or medical symptoms are known at the time of signing. TapToSettle is not insurance and does not provide legal advice.",
        { align: "left" }
    );

    doc.moveDown(1.2);

    // Simple payment schedule (MVP)
    doc.fontSize(12).fillColor("#000").text("Payment Schedule (MVP)", { underline: true });
    doc.moveDown(0.5);
    doc.fontSize(10);

    if (months > 0) {
        const start = new Date();
        for (let i = 1; i <= months; i++) {
            const due = new Date(start);
            due.setMonth(due.getMonth() + i);
            doc.text(`Payment ${i}: ${formatUSD(monthlyCents)} due ~ ${due.toDateString()}`);
        }
    } else {
        doc.text("No payment schedule (months not provided).");
    }

    doc.moveDown(1.2);

    // Signatures
    doc.fontSize(12).text("Signatures", { underline: true });
    doc.moveDown(0.5);

    const sigWidth = 220;
    const sigHeight = 90;

    doc.fontSize(10).text("Driver A Signature:");
    if (sigA?.path && fs.existsSync(sigA.path)) {
        doc.image(sigA.path, { width: sigWidth, height: sigHeight });
    } else {
        doc.text("(missing)");
    }
    doc.moveDown(0.7);

    doc.text("Driver B Signature:");
    if (sigB?.path && fs.existsSync(sigB.path)) {
        doc.image(sigB.path, { width: sigWidth, height: sigHeight });
    } else {
        doc.text("(missing)");
    }

    doc.moveDown(1.2);

    // Evidence list (MVP: list filenames)
    doc.fontSize(12).text("Evidence (Uploaded Files)", { underline: true });
    doc.moveDown(0.5);
    doc.fontSize(9);

    (record.evidence || []).forEach((f) => {
        doc.text(`• ${f.name}`);
    });

    doc.end();

    return new Promise((resolve, reject) => {
        stream.on("finish", () => resolve(pdfPath));
        stream.on("error", reject);
    });
}
