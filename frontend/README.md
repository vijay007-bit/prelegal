# prelegal frontend

Next.js app for the **Mutual NDA Creator** (Jira [PL-3](https://stuffprofessional928.atlassian.net/browse/PL-3)).
The user fills in a short form, sees the agreement update live, and downloads it as a PDF.

## Getting started

```bash
npm install
npm run dev        # http://localhost:3000
```

## Scripts

| Command             | What it does                        |
| ------------------- | ----------------------------------- |
| `npm run dev`       | Start the dev server                |
| `npm run build`     | Production build                    |
| `npm run start`     | Serve the production build          |
| `npm run lint`      | ESLint                              |
| `npm run typecheck` | `tsc --noEmit`                      |
| `npm test`          | Run unit tests once (Vitest)        |
| `npm run test:watch`| Run unit tests in watch mode        |

## How it fits together

```
src/
  lib/nda/schema.ts        zod schema + NdaData type — the single source of truth for form fields
  lib/nda/template.ts      pure function NdaData -> NdaDocument (title, sections, signature blocks)
  components/NdaForm.tsx   react-hook-form inputs bound to the schema
  components/NdaPreview.tsx  renders an NdaDocument as HTML
  components/NdaPdf.tsx      renders the same NdaDocument with @react-pdf/renderer
  components/DownloadButton.tsx  lazily loads the PDF renderer on click and saves the file
  components/NdaCreator.tsx  owns form state; wires form -> preview -> download
  app/page.tsx             page shell
```

The agreement text lives only in `template.ts`, so the on-screen preview and the PDF can never
drift apart. The template accepts partial data and substitutes bracketed placeholders, which is
what powers the live preview before the form is complete.

> The generated document is a general-purpose template, not legal advice.
