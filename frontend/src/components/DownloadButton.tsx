"use client";

import { useState } from "react";
import type { NdaDocument } from "@/lib/nda/template";

interface DownloadButtonProps {
  document: NdaDocument;
  fileName: string;
  disabled?: boolean;
}

/**
 * Generates the PDF on demand. The renderer is imported lazily inside the click
 * handler so its sizeable bundle is only fetched when the user actually downloads.
 */
export function DownloadButton({ document: ndaDocument, fileName, disabled }: DownloadButtonProps) {
  const [status, setStatus] = useState<"idle" | "generating" | "error">("idle");

  async function handleDownload() {
    setStatus("generating");
    try {
      const [{ pdf }, { NdaPdf }] = await Promise.all([
        import("@react-pdf/renderer"),
        import("./NdaPdf"),
      ]);
      const blob = await pdf(<NdaPdf document={ndaDocument} />).toBlob();
      const url = URL.createObjectURL(blob);
      const anchor = window.document.createElement("a");
      anchor.href = url;
      anchor.download = fileName;
      anchor.click();
      // Safari/Firefox read the blob URL asynchronously after click(); revoking
      // synchronously can leave them with an empty download.
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      setStatus("idle");
    } catch (error) {
      console.error("Failed to generate NDA PDF", error);
      setStatus("error");
    }
  }

  const busy = status === "generating";

  return (
    <div className="flex flex-col gap-1">
      <button
        type="button"
        onClick={handleDownload}
        disabled={disabled || busy}
        className="inline-flex items-center justify-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {busy ? "Generating PDF…" : "Download PDF"}
      </button>
      {status === "error" && (
        <p role="alert" className="text-xs text-red-600 dark:text-red-400">
          Something went wrong generating the PDF. Please try again.
        </p>
      )}
    </div>
  );
}
