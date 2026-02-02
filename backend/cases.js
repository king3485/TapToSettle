import { v4 as uuidv4 } from "uuid";

const cases = new Map();

export function createCase(data) {
    const id = "TTS-" + uuidv4().slice(0, 8).toUpperCase();

    const record = {
        id,
        createdAt: new Date().toISOString(),
        status: "OPEN",
        ...data,
    };

    cases.set(id, record);
    return record;
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
