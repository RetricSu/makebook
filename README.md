# makebook

A CLI tool to convert a regular PDF into a booklet-printable PDF (scaffold).

Features included in this scaffold:
- TypeScript + pnpm project setup
- CLI wiring using `commander`
- Basic converter that loads a PDF, pads it to a multiple of 4 pages, and writes an output PDF
- Placeholders and TODOs for imposition / 2-up layout and signatures

Quick start

1. Install dependencies (pnpm is recommended):

```bash
pnpm install
```

2. Build:

```bash
pnpm run build
```

3. Run (dev mode):

```bash
pnpm run dev -- input.pdf -o output.pdf
```

Next steps
- Implement page imposition (2-up/4-up) to lay out pages for booklet printing
- Add tests and sample PDFs
- Add options for page size and signatures
