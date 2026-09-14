import { describe, expect, it } from "vitest";
import {
  buildNdaDocument,
  formatEffectiveDate,
  ndaFileName,
} from "./template";
import { defaultNdaData, ndaSchema, todayIsoDate, type NdaData } from "./schema";

const complete: NdaData = {
  party1Name: "Acme Corp",
  party1Address: "1 Main St, Springfield",
  party2Name: "Globex Inc",
  party2Address: "2 Elm St, Shelbyville",
  effectiveDate: "2026-09-14",
  purpose: "a potential software partnership",
  termYears: 2,
  governingLaw: "the State of Delaware, USA",
};

describe("formatEffectiveDate", () => {
  it("formats an ISO date as a long US date", () => {
    expect(formatEffectiveDate("2026-09-14")).toBe("September 14, 2026");
  });

  it("does not shift the day across timezones", () => {
    expect(formatEffectiveDate("2026-01-01")).toBe("January 1, 2026");
    expect(formatEffectiveDate("2026-12-31")).toBe("December 31, 2026");
  });

  it("falls back to a placeholder for malformed input", () => {
    expect(formatEffectiveDate("")).toBe("[Effective Date]");
    expect(formatEffectiveDate("not a date")).toBe("[Effective Date]");
  });
});

describe("buildNdaDocument", () => {
  it("fills every user-provided value into the agreement", () => {
    const doc = buildNdaDocument(complete);
    const fullText = [
      doc.preamble,
      ...doc.sections.flatMap((s) => s.paragraphs),
    ].join("\n");

    expect(doc.title).toBe("Mutual Non-Disclosure Agreement");
    expect(doc.preamble).toContain("September 14, 2026");
    expect(doc.preamble).toContain("Acme Corp");
    expect(doc.preamble).toContain("1 Main St, Springfield");
    expect(doc.preamble).toContain("Globex Inc");
    expect(doc.preamble).toContain("2 Elm St, Shelbyville");
    expect(fullText).toContain("a potential software partnership");
    expect(fullText).toContain("remains in effect for 2 years");
    expect(fullText).toContain("laws of the State of Delaware, USA");
    expect(fullText).not.toMatch(/\[[^\]]+\]/);
  });

  it("uses bracketed placeholders for anything not yet entered", () => {
    const doc = buildNdaDocument({});
    expect(doc.preamble).toContain("[Party 1 Name]");
    expect(doc.preamble).toContain("[Party 2 Address]");
    expect(doc.preamble).toContain("[Effective Date]");
    const term = doc.sections.find((s) => s.heading.startsWith("5."));
    expect(term?.paragraphs[0]).toContain("for [term] thereafter");
    const law = doc.sections.find((s) => s.heading.startsWith("10."));
    expect(law?.paragraphs[0]).toContain("laws of [Governing Law]");
  });

  it("treats whitespace-only input as blank", () => {
    const doc = buildNdaDocument({ party1Name: "   " });
    expect(doc.preamble).toContain("[Party 1 Name]");
  });

  it("singularises a one-year term", () => {
    const doc = buildNdaDocument({ termYears: 1 });
    const term = doc.sections.find((s) => s.heading.startsWith("5."));
    expect(term?.paragraphs[0]).toContain("for 1 year thereafter");
  });

  it("produces a signature block for each party in order", () => {
    const doc = buildNdaDocument(complete);
    expect(doc.signatureBlocks.map((b) => b.partyName)).toEqual([
      "Acme Corp",
      "Globex Inc",
    ]);
  });

  it("numbers the sections sequentially", () => {
    const headings = buildNdaDocument({}).sections.map((s) => s.heading);
    headings.forEach((heading, i) => {
      expect(heading.startsWith(`${i + 1}. `)).toBe(true);
    });
  });
});

describe("ndaFileName", () => {
  it("builds a safe file name from both party names", () => {
    expect(ndaFileName(complete)).toBe("Mutual-NDA-Acme-Corp-Globex-Inc.pdf");
  });

  it("strips characters that are unsafe in file names", () => {
    expect(
      ndaFileName({ party1Name: "A/B & C!", party2Name: "  D  " }),
    ).toBe("Mutual-NDA-A-B-C-D.pdf");
  });

  it("omits parties that are blank", () => {
    expect(ndaFileName({})).toBe("Mutual-NDA.pdf");
    expect(ndaFileName({ party2Name: "Globex" })).toBe("Mutual-NDA-Globex.pdf");
  });
});

describe("ndaSchema", () => {
  it("accepts complete data", () => {
    expect(ndaSchema.safeParse(complete).success).toBe(true);
  });

  it("rejects the default (empty) form values", () => {
    const result = ndaSchema.safeParse(defaultNdaData);
    expect(result.success).toBe(false);
  });

  it("rejects terms outside 1-10 whole years", () => {
    expect(ndaSchema.safeParse({ ...complete, termYears: 0 }).success).toBe(false);
    expect(ndaSchema.safeParse({ ...complete, termYears: 11 }).success).toBe(false);
    expect(ndaSchema.safeParse({ ...complete, termYears: 1.5 }).success).toBe(false);
    expect(ndaSchema.safeParse({ ...complete, termYears: NaN }).success).toBe(false);
  });

  it("has no time-dependent default so SSR and client output match", () => {
    expect(defaultNdaData.effectiveDate).toBe("");
  });
});

describe("todayIsoDate", () => {
  it("formats the local calendar date as YYYY-MM-DD with zero padding", () => {
    // Local-time constructor so the expected day is unambiguous in any timezone.
    expect(todayIsoDate(new Date(2026, 0, 5, 9, 30))).toBe("2026-01-05");
    expect(todayIsoDate(new Date(2026, 11, 31, 23, 59))).toBe("2026-12-31");
  });
});
