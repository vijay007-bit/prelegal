"use client";

import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { defaultNdaData, ndaSchema, todayIsoDate, type NdaData } from "@/lib/nda/schema";
import { buildNdaDocument, ndaFileName } from "@/lib/nda/template";
import { NdaForm } from "./NdaForm";
import { NdaPreview } from "./NdaPreview";
import { DownloadButton } from "./DownloadButton";

/**
 * Wires the form to the live preview and download. This is the only place the
 * form state lives; children receive either the form instance or derived data.
 */
export function NdaCreator() {
  const form = useForm<NdaData>({
    resolver: zodResolver(ndaSchema),
    defaultValues: defaultNdaData,
    mode: "onChange",
  });

  // Default the effective date to today only after mount, so the prerendered
  // HTML (built at an arbitrary time) never disagrees with the client's clock.
  useEffect(() => {
    form.setValue("effectiveDate", todayIsoDate());
  }, [form]);

  // Subscribes to every field so the preview re-renders as the user types.
  const values = useWatch({ control: form.control });
  const document = buildNdaDocument(values);
  const fileName = ndaFileName(values);

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
      <div className="lg:sticky lg:top-8 lg:self-start">
        <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <NdaForm form={form} />
          <div className="mt-6 flex flex-col gap-2 border-t border-zinc-200 pt-6 dark:border-zinc-800">
            <DownloadButton
              document={document}
              fileName={fileName}
              disabled={!form.formState.isValid}
            />
            {!form.formState.isValid && (
              <p className="text-xs text-zinc-500">
                Complete all fields to enable the download.
              </p>
            )}
          </div>
        </div>
      </div>

      <NdaPreview document={document} />
    </div>
  );
}
