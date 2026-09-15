# prelegal

Tools for generating everyday legal agreements from a short form. The first tool is a
**Mutual NDA creator**: fill in the parties and key terms, watch the agreement update live,
and download it as a PDF. Alongside it, the repo carries a dataset of open-source agreement
templates to build further generators on.

> **Status:** early prototype. Documents produced here are general-purpose templates and are
> **not legal advice** — have a qualified lawyer review anything before it is signed.

## What's in the repo

| Path | What it is |
| --- | --- |
| [`frontend/`](frontend/) | Next.js app — the Mutual NDA creator ([PL-3](https://stuffprofessional928.atlassian.net/browse/PL-3)) |
| [`templates/`](templates/) | 12 agreement templates (NDA, DPA, SLA, MSA, pilot, partnership, …) sourced from [Common Paper](https://commonpaper.com), CC BY 4.0 ([PL-2](https://stuffprofessional928.atlassian.net/browse/PL-2)) |
| [`catalog.json`](catalog.json) | Machine-readable index of the templates: id, name, description, source repo and canonical URL |

## Quick start

Requires **Node.js 22+** (developed on 24) and npm.

```bash
cd frontend
npm install
npm run dev        # http://localhost:3000
```

Fill in the form on the left; the agreement on the right updates as you type. Once every
field is valid, **Download PDF** produces `Mutual-NDA-<Party1>-<Party2>.pdf`.

### Scripts (run inside `frontend/`)

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | Generate Next.js route types and run `tsc --noEmit` |
| `npm test` | Unit tests (Vitest) |
| `npm run test:watch` | Unit tests in watch mode |

## How the NDA creator works

```
frontend/src/
  lib/nda/schema.ts        zod schema + NdaData type — single source of truth for the form fields
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
what powers the live preview before the form is complete. Everything runs in the browser — there
is no backend and nothing the user types leaves their machine.

Stack: Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · react-hook-form + zod ·
@react-pdf/renderer · Vitest. See [`frontend/README.md`](frontend/README.md) for more detail.

## Templates dataset

`templates/` contains Markdown versions of Common Paper's standard agreements. Each entry in
`catalog.json` links back to the upstream repository and canonical URL. The templates are
licensed **CC BY 4.0** — see [`templates/LICENSE.txt`](templates/LICENSE.txt) for the attribution
requirements.

## Roadmap

- [x] Mutual NDA creator (form → live preview → PDF)
- [x] Agreement templates dataset
- [ ] Generators for further agreement types, driven by the templates dataset
- [ ] CI (lint, typecheck, tests, build on every PR)
- [ ] Contributing guidelines
- [ ] Project license

## Contributing

Work is tracked in Jira (project **PL**). Branch from `main` as `feature/PL-<n>-<slug>`, keep
`npm run lint`, `npm run typecheck`, `npm test` and `npm run build` green, and open a PR
referencing the ticket.
