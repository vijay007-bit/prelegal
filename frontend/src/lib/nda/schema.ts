import { z } from "zod";

/**
 * Single source of truth for the information the user provides.
 * The form, the preview and the PDF all derive from this shape.
 */
export const ndaSchema = z.object({
  party1Name: z.string().trim().min(1, "Party 1 name is required"),
  party1Address: z.string().trim().min(1, "Party 1 address is required"),
  party2Name: z.string().trim().min(1, "Party 2 name is required"),
  party2Address: z.string().trim().min(1, "Party 2 address is required"),
  effectiveDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Effective date is required"),
  purpose: z.string().trim().min(1, "Purpose is required"),
  termYears: z
    .number({ error: "Term is required" })
    .int("Term must be a whole number of years")
    .min(1, "Term must be at least 1 year")
    .max(10, "Term must be at most 10 years"),
  governingLaw: z.string().trim().min(1, "Governing law is required"),
});

export type NdaData = z.infer<typeof ndaSchema>;

/**
 * Values the form starts with; the preview shows placeholders for anything blank.
 * Deliberately has no time-dependent value so server and client render identically;
 * the effective date is filled in on the client after mount (see NdaCreator).
 */
export const defaultNdaData: NdaData = {
  party1Name: "",
  party1Address: "",
  party2Name: "",
  party2Address: "",
  effectiveDate: "",
  purpose: "",
  termYears: 2,
  governingLaw: "",
};

/** Today's date in the browser's local timezone as YYYY-MM-DD, matching <input type="date">. */
export function todayIsoDate(now: Date = new Date()): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}
