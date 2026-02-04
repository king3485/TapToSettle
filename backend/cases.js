import { v4 as uuidv4 } from "uuid";
import crypto from "crypto";



function makeShareToken() {
    return crypto.randomBytes(16).toString("hex"); // 32-char token
}

const cases = new Map();

export function makeShareToken() {
    return crypto.randomBytes(16).toString("hex");
}

export function createCase(payload) {
    const record = {
        id: makeId(),
        createdAt: new Date().toISOString(),
        status: "OPEN",
        amountCents: payload.amountCents || 0,
        months: payload.months || 0,
        downPaymentCents: payload.downPaymentCents || 0,
        downPct: payload.downPct || 0,
        paymentStatus: "UNPAID",
    };

    record.shareToken = makeShareToken();
    record.shareUrl = `/share/${record.shareToken}`;

    CASES.push(record);
    return record;
}

export function getCaseByShareToken(token) {
    return CASES.find((c) => c.shareToken === token) || null;
}


export function getCase(id) {
    return cases.get(id);
}

export function listCases() {
    return Array.from(cases.values());
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
        }))
    );

    return record;
}
