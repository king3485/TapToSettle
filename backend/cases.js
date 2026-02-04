import { v4 as uuidv4 } from "uuid";
import crypto from "crypto";

const cases = new Map();

export function makeShareToken() {
    return crypto.randomBytes(16).toString("hex"); // 32 chars
}

export function createCase(payload = {}) {
    const record = {
        id: uuidv4(),
        createdAt: new Date().toISOString(),
        status: "OPEN",

        amountCents: payload.amountCents || 0,
        months: payload.months || 0,
        downPaymentCents: payload.downPaymentCents || 0,
        downPct: payload.downPct || 0,

        paymentStatus: payload.paymentStatus || "UNPAID",
        stripeSessionId: payload.stripeSessionId || null,

        evidence: [],
        contractUrl: null,
    };

    record.shareToken = makeShareToken();
    record.shareUrl = `/share/${record.shareToken}`;

    cases.set(record.id, record);
    return record;
}

export function getCase(id) {
    return cases.get(id) || null;
}

export function listCases() {
    return Array.from(cases.values());
}

export function getCaseByShareToken(token) {
    for (const c of cases.values()) {
        if (c.shareToken === token) return c;
    }
    return null;
}

export function attachEvidence(id, files = []) {
    const record = cases.get(id);
    if (!record) return null;

    record.evidence = record.evidence || [];
    record.evidence.push(
        ...files.map((f) => ({
            name: f.originalname,
            path: f.path,
            size: f.size,
            mimetype: f.mimetype,
        }))
    );

    return record;
}
