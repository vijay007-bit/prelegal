import type { NdaDocument } from "@/lib/nda/template";

interface NdaPreviewProps {
  document: NdaDocument;
}

/** On-screen rendering of the agreement, styled to resemble a printed page. */
export function NdaPreview({ document }: NdaPreviewProps) {
  return (
    <article
      aria-label="Agreement preview"
      className="rounded-md bg-white px-8 py-10 font-serif text-[15px] leading-relaxed text-zinc-900 shadow-md ring-1 ring-zinc-200 sm:px-12"
    >
      <h2 className="mb-8 text-center text-xl font-bold uppercase tracking-wide">
        {document.title}
      </h2>
      <p className="mb-6 text-justify">{document.preamble}</p>

      {document.sections.map((section) => (
        <section key={section.heading} className="mb-5">
          <h3 className="mb-1 font-bold">{section.heading}</h3>
          {section.paragraphs.map((paragraph, i) => (
            <p key={i} className="mb-2 text-justify">
              {paragraph}
            </p>
          ))}
        </section>
      ))}

      <p className="mb-8 mt-8">{document.closing}</p>

      <div className="grid gap-10 sm:grid-cols-2">
        {document.signatureBlocks.map((block, i) => (
          <div key={i} className="flex flex-col gap-3">
            <p className="font-bold">{block.partyName}</p>
            {["By", "Name", "Title", "Date"].map((line) => (
              <p key={line} className="flex gap-2">
                <span className="shrink-0">{line}:</span>
                <span className="grow border-b border-zinc-500" />
              </p>
            ))}
          </div>
        ))}
      </div>
    </article>
  );
}
