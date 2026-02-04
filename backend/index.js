import express from "express";
import cors from "cors";
import multer from "multer";
import path from "path";
import dotenv from "dotenv";
import Stripe from "stripe";

import { generateContractPdf } from "./contract.js";
import { createCase, getCase, listCases, attachEvidence } from "./cases.js";

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2024-06-20",
});

console.log("Stripe key loaded?", !!process.env.STRIPE_SECRET_KEY);

const HOST = process.env.PUBLIC_HOST || "http://192.168.1.178:4000";

const app = express();
const upload = multer({ dest: "uploads/" });

app.use(cors());

/**
 * ✅ Stripe webhook (MUST be raw)
 * Where: BEFORE express.json()
 */
app.post("/webhook/stripe", express.raw({ type: "application/json" }), (req, res) => {
    let event;

    try {
        const sig = req.headers["stripe-signature"];
        event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === "checkout.session.completed") {
        const session = event.data.object;
        const caseId = session?.metadata?.caseId;

        if (caseId) {
            const record = getCase(caseId);
            if (record) {
                record.paymentStatus = "PAID";
                record.paidAt = new Date().toISOString();
                record.stripeSessionId = session.id;
            }
        }
    }

    res.json({ received: true });
});

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

    // ✅ ensure defaults exist (in case createCase doesn't set them)
    record.paymentStatus = record.paymentStatus || "UNPAID";
    record.stripeSessionId = record.stripeSessionId || null;

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
    if (!record) return res.status(404).json({ error: "Not found" });
    res.json(record);
});

/**
 * Upload evidence
 */
app.post("/cases/:id/evidence", upload.array("files"), (req, res) => {
    const record = attachEvidence(req.params.id, req.files);
    if (!record) return res.status(404).json({ error: "Case not found" });
    res.json(record);
});

/**
 * ✅ Create Stripe Checkout
 */
app.post("/cases/:id/checkout", async (req, res) => {
    const record = getCase(req.params.id);
    if (!record) return res.status(404).json({ error: "Case not found" });

    try {
        const session = await stripe.checkout.sessions.create({
            mode: "payment",
            line_items: [
                {
                    quantity: 1,
                    price_data: {
                        currency: "usd",
                        product_data: {
                            name: "TapToSettle – Settlement Contract",
                            description: `Case ${record.id}`,
                        },
                        unit_amount: 500, // $5.00
                    },
                },
            ],
            metadata: { caseId: record.id },
            success_url: `${HOST}/checkout/success?caseId=${record.id}`,
            cancel_url: `${HOST}/checkout/cancel?caseId=${record.id}`,
        });

        record.paymentStatus = "PENDING";
        record.stripeSessionId = session.id;

        res.json({ ok: true, url: session.url, sessionId: session.id });
    } catch (e) {
        res.status(500).json({ error: "Stripe checkout failed", details: e.message });
    }
});

/**
 * ✅ Redirect pages for Stripe
 */
app.get("/checkout/success", (req, res) => {
    res.send("Payment successful. You can return to the app.");
});

app.get("/checkout/cancel", (req, res) => {
    res.send("Payment cancelled. You can return to the app.");
});

/**
 * ✅ Generate contract (LOCKED until PAID)
 */
app.post("/cases/:id/contract", async (req, res) => {
    const record = getCase(req.params.id);
    if (!record) return res.status(404).json({ error: "Case not found" });

    if (record.paymentStatus !== "PAID") {
        return res.status(402).json({
            error: "Payment required",
            paymentStatus: record.paymentStatus || "UNPAID",
        });
    }

    try {
        await generateContractPdf(record);
        record.contractUrl = `/contracts/${record.id}.pdf`;
        res.json({ ok: true, contractUrl: record.contractUrl });
    } catch (e) {
        res.status(500).json({ error: "PDF generation failed", details: e.message });
    }
});

const PORT = 4000;
app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 TapToSettle backend running on ${HOST}`);
});
