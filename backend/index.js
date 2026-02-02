import express from "express";
import cors from "cors";
import multer from "multer";
import path from "path";
import { generateContractPdf } from "./contract.js";


import { createCase, getCase, listCases, attachEvidence } from "./cases.js";

const app = express();
const upload = multer({ dest: "uploads/" });

app.use(cors());
app.use(express.json());
app.use("/contracts", express.static(path.join(process.cwd(), "contracts")));


/**
 * Health check
 */
app.get("/health", (req, res) => {
    res.json({ ok: true });
});

/**
 * Create new settlement case
 */
app.post("/cases", (req, res) => {
    const record = createCase(req.body);
    res.status(201).json(record);
});

/**
 * List all cases (debug)
 */
app.get("/cases", (req, res) => {
    res.json(listCases());
});

/**
 * Fetch one case
 */
app.get("/cases/:id", (req, res) => {
    const record = getCase(req.params.id);
    if (!record) {
        return res.status(404).json({ error: "Not found" });
    }
    res.json(record);
});

/**
 * Upload evidence
 */
app.post("/cases/:id/evidence", upload.array("files"), (req, res) => {
    const record = attachEvidence(req.params.id, req.files);
    if (!record) {
        return res.status(404).json({ error: "Case not found" });
    }

    res.json(record);
});

app.post("/cases/:id/contract", async (req, res) => {
    const record = getCase(req.params.id);
    if (!record) return res.status(404).json({ error: "Case not found" });

    try {
        const pdfPath = await generateContractPdf(record);
        record.contractUrl = `/contracts/${record.id}.pdf`;
        res.json({ ok: true, contractUrl: record.contractUrl });
    } catch (e) {
        res.status(500).json({ error: "PDF generation failed", details: e.message });
    }
});


const PORT = 4000;
app.listen(PORT, () => {
    console.log(`🚀 TapToSettle backend running on http://localhost:${PORT}`);
});

