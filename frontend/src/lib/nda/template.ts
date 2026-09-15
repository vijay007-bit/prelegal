import type { NdaData } from "./schema";

/** A renderer-agnostic representation of the finished agreement. */
export interface NdaSection {
  heading: string;
  paragraphs: string[];
}

export interface NdaSignatureBlock {
  partyName: string;
}

export interface NdaDocument {
  title: string;
  preamble: string;
  sections: NdaSection[];
  closing: string;
  signatureBlocks: NdaSignatureBlock[];
}

/** Bracketed text shown in place of any field the user hasn't filled in yet. */
const PLACEHOLDERS: Record<keyof NdaData, string> = {
  party1Name: "[Party 1 Name]",
  party1Address: "[Party 1 Address]",
  party2Name: "[Party 2 Name]",
  party2Address: "[Party 2 Address]",
  effectiveDate: "[Effective Date]",
  purpose: "[purpose of the disclosure]",
  termYears: "[term]",
  governingLaw: "[Governing Law]",
};

/**
 * Formats an ISO date (YYYY-MM-DD) as e.g. "September 14, 2026".
 * Parsed as UTC so the calendar day never shifts with the viewer's timezone.
 */
export function formatEffectiveDate(isoDate: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(isoDate);
  if (!match) return PLACEHOLDERS.effectiveDate;
  const [, year, month, day] = match.map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  if (Number.isNaN(date.getTime())) return PLACEHOLDERS.effectiveDate;
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  }).format(date);
}

function formatTerm(years: number | undefined): string {
  if (years === undefined || !Number.isFinite(years) || years < 1) {
    return PLACEHOLDERS.termYears;
  }
  return `${years} ${years === 1 ? "year" : "years"}`;
}

function text(value: string | undefined, key: keyof NdaData): string {
  const trimmed = value?.trim();
  return trimmed ? trimmed : PLACEHOLDERS[key];
}

/**
 * Builds the full agreement from whatever the user has entered so far.
 * Accepts partial data so the preview can update live as the form is filled in.
 */
export function buildNdaDocument(input: Partial<NdaData>): NdaDocument {
  const party1 = text(input.party1Name, "party1Name");
  const party2 = text(input.party2Name, "party2Name");
  const address1 = text(input.party1Address, "party1Address");
  const address2 = text(input.party2Address, "party2Address");
  const effectiveDate = input.effectiveDate
    ? formatEffectiveDate(input.effectiveDate)
    : PLACEHOLDERS.effectiveDate;
  const purpose = text(input.purpose, "purpose");
  const term = formatTerm(input.termYears);
  const governingLaw = text(input.governingLaw, "governingLaw");

  return {
    title: "Mutual Non-Disclosure Agreement",
    preamble:
      `This Mutual Non-Disclosure Agreement (the "Agreement") is entered into as of ${effectiveDate} ` +
      `(the "Effective Date") by and between ${party1}, having its principal place of business at ${address1}, ` +
      `and ${party2}, having its principal place of business at ${address2}. ` +
      `Each is referred to herein as a "Party" and together as the "Parties".`,
    sections: [
      {
        heading: "1. Purpose",
        paragraphs: [
          `The Parties wish to explore ${purpose} (the "Purpose"). In connection with the Purpose, each Party may ` +
            `disclose to the other certain confidential technical and business information that the disclosing Party ` +
            `desires the receiving Party to treat as confidential.`,
        ],
      },
      {
        heading: "2. Definition of Confidential Information",
        paragraphs: [
          `"Confidential Information" means any information disclosed by either Party (the "Disclosing Party") to the ` +
            `other Party (the "Receiving Party"), either directly or indirectly, in writing, orally or by inspection of ` +
            `tangible objects, that is designated as "Confidential" or "Proprietary" or that reasonably should be ` +
            `understood to be confidential given the nature of the information and the circumstances of disclosure.`,
          `Confidential Information includes, without limitation, business plans, financial information, customer ` +
            `lists, product designs, software, source code, inventions, processes and know-how.`,
        ],
      },
      {
        heading: "3. Exclusions",
        paragraphs: [
          `Confidential Information does not include information that: (a) is or becomes publicly available through ` +
            `no fault of the Receiving Party; (b) was rightfully known to the Receiving Party before disclosure by the ` +
            `Disclosing Party; (c) is rightfully received from a third party without a duty of confidentiality; or ` +
            `(d) is independently developed by the Receiving Party without use of or reference to the Disclosing ` +
            `Party's Confidential Information.`,
        ],
      },
      {
        heading: "4. Obligations of the Receiving Party",
        paragraphs: [
          `The Receiving Party shall: (a) use the Confidential Information solely for the Purpose; (b) not disclose ` +
            `the Confidential Information to any third party except to its employees, officers, advisors and ` +
            `contractors who need to know it for the Purpose and who are bound by confidentiality obligations at ` +
            `least as protective as those in this Agreement; and (c) protect the Confidential Information using at ` +
            `least the same degree of care it uses to protect its own confidential information, and in no event less ` +
            `than reasonable care.`,
          `The Receiving Party may disclose Confidential Information to the extent required by law or court order, ` +
            `provided that it gives the Disclosing Party prompt written notice (where legally permitted) and ` +
            `reasonable assistance in seeking a protective order or other appropriate remedy.`,
        ],
      },
      {
        heading: "5. Term",
        paragraphs: [
          `This Agreement commences on the Effective Date and remains in effect for ${term} thereafter, unless ` +
            `earlier terminated by either Party upon thirty (30) days' written notice to the other Party.`,
          `The Receiving Party's obligations with respect to Confidential Information disclosed during the term ` +
            `survive for three (3) years after the termination or expiration of this Agreement and, with respect to ` +
            `any trade secrets, for as long as such information remains a trade secret under applicable law.`,
        ],
      },
      {
        heading: "6. Return of Materials",
        paragraphs: [
          `Upon the Disclosing Party's written request, or upon termination or expiration of this Agreement, the ` +
            `Receiving Party shall promptly return or destroy all Confidential Information and any copies thereof, ` +
            `and shall certify in writing that it has done so.`,
        ],
      },
      {
        heading: "7. No License; No Warranty",
        paragraphs: [
          `All Confidential Information remains the property of the Disclosing Party. Nothing in this Agreement ` +
            `grants the Receiving Party any license under any patent, copyright, trademark, trade secret or other ` +
            `intellectual property right. ALL CONFIDENTIAL INFORMATION IS PROVIDED "AS IS" WITHOUT WARRANTY OF ANY ` +
            `KIND, EXPRESS OR IMPLIED.`,
        ],
      },
      {
        heading: "8. No Obligation",
        paragraphs: [
          `Nothing in this Agreement obligates either Party to disclose any particular information or to enter into ` +
            `any further agreement or business relationship with the other Party.`,
        ],
      },
      {
        heading: "9. Remedies",
        paragraphs: [
          `Each Party acknowledges that any unauthorized use or disclosure of Confidential Information may cause ` +
            `irreparable harm for which monetary damages would be an inadequate remedy, and agrees that the ` +
            `Disclosing Party is entitled to seek injunctive or other equitable relief in addition to any other ` +
            `remedies available at law or in equity.`,
        ],
      },
      {
        heading: "10. Governing Law",
        paragraphs: [
          `This Agreement is governed by and construed in accordance with the laws of ${governingLaw}, without regard ` +
            `to its conflict of laws principles.`,
        ],
      },
      {
        heading: "11. Entire Agreement",
        paragraphs: [
          `This Agreement constitutes the entire agreement between the Parties regarding its subject matter and ` +
            `supersedes all prior or contemporaneous discussions and agreements, whether written or oral. It may be ` +
            `amended only by a writing signed by both Parties. If any provision is held unenforceable, the remaining ` +
            `provisions remain in full force and effect. This Agreement may be executed in counterparts, including by ` +
            `electronic signature, each of which is deemed an original.`,
        ],
      },
    ],
    closing:
      "IN WITNESS WHEREOF, the Parties have executed this Agreement as of the Effective Date.",
    signatureBlocks: [{ partyName: party1 }, { partyName: party2 }],
  };
}

/** A filesystem-safe file name for the downloaded PDF. */
export function ndaFileName(input: Partial<NdaData>): string {
  const slug = (value: string | undefined) =>
    (value ?? "")
      .trim()
      .replace(/[^a-z0-9]+/gi, "-")
      .replace(/^-+|-+$/g, "");
  const parties = [slug(input.party1Name), slug(input.party2Name)].filter(Boolean);
  return ["Mutual-NDA", ...parties].join("-") + ".pdf";
}
