import { PDFDocument, PDFPage, rgb } from 'pdf-lib';
import { computePairs } from './pairing';
import fs from 'fs/promises';

export type ConvertOptions = {
  dryRun?: boolean;
};

/**
 * convertPdfToBooklet
 * - loads the input PDF
 * - pads pages to a multiple of 4 (required for simple booklet signatures)
 * - currently copies pages in order into a new PDF (placeholder for actual imposition)
 * - writes output PDF
 */
export async function convertPdfToBooklet(
  inputPath: string,
  outputPath: string,
  opts: ConvertOptions = {}
) {
  const inputBytes = await fs.readFile(inputPath);
  const srcDoc = await PDFDocument.load(inputBytes);

  // Ensure an even number of pages so pages can be paired (1,last), (2,last-1), ...
  let pageCount = srcDoc.getPageCount();
  const pad = pageCount % 2 === 0 ? 0 : 1;
  if (pad === 1) {
    // add a blank page with same size as first page (or A4 fallback)
    let bw = 595.28;
    let bh = 841.89;
    if (pageCount > 0) {
      const p0 = srcDoc.getPage(0);
      try {
        bw = p0.getWidth();
        bh = p0.getHeight();
      } catch (e) {
        // ignore
      }
    }
    srcDoc.addPage([bw, bh]);
    pageCount += 1;
  }

  const outDoc = await PDFDocument.create();

  // Determine base page size from first page (fallback to A4 if not available)
  let baseWidth = 595.28; // ~A4 width in points (portrait)
  let baseHeight = 841.89; // ~A4 height in points (portrait)
  if (pageCount > 0) {
    const p = srcDoc.getPage(0);
    try {
      baseWidth = p.getWidth();
      baseHeight = p.getHeight();
    } catch (e) {
      // ignore and use defaults
    }
  }

  // Output page will place two original pages side-by-side on one sheet.
  // We'll use sheet width = baseWidth * 2, height = baseHeight (i.e., A4 landscape if input is A4 portrait)
  const sheetWidth = baseWidth * 2;
  const sheetHeight = baseHeight;

  // Pair pages: (0, pageCount-1), (1, pageCount-2), ...
  const pairsArr = computePairs(pageCount);
  const pairs = pairsArr.length;
  for (let i = 0; i < pairs; i++) {
    const [leftIdx, rightIdx] = pairsArr[i];

    // Create a one-page PDF for the left page and embed it
    const leftTemp = await PDFDocument.create();
    const [copiedLeft] = await leftTemp.copyPages(srcDoc, [leftIdx]);
    leftTemp.addPage(copiedLeft);
    // Draw a tiny invisible rectangle to ensure the page has a Contents stream
    try {
      leftTemp
        .getPage(0)
        .drawRectangle({ x: 0, y: 0, width: 1, height: 1, color: rgb(1, 1, 1), opacity: 0 });
    } catch (e) {
      // ignore if drawing fails
    }
    const leftBytes = await leftTemp.save();
    const leftEmbArr = await outDoc.embedPdf(leftBytes);
    const embLeft = leftEmbArr[0];

    // Create a one-page PDF for the right page and embed it
    const rightTemp = await PDFDocument.create();
    const [copiedRight] = await rightTemp.copyPages(srcDoc, [rightIdx]);
    rightTemp.addPage(copiedRight);
    try {
      rightTemp
        .getPage(0)
        .drawRectangle({ x: 0, y: 0, width: 1, height: 1, color: rgb(1, 1, 1), opacity: 0 });
    } catch (e) {
      // ignore if drawing fails
    }
    const rightBytes = await rightTemp.save();
    const rightEmbArr = await outDoc.embedPdf(rightBytes);
    const embRight = rightEmbArr[0];

    const outPage = outDoc.addPage([sheetWidth, sheetHeight]);

    // Draw higher-indexed page on the left, lower-indexed on the right
    outPage.drawPage(embRight, {
      x: 0,
      y: 0,
      width: baseWidth,
      height: baseHeight,
    });

    outPage.drawPage(embLeft, {
      x: baseWidth,
      y: 0,
      width: baseWidth,
      height: baseHeight,
    });
  }

  if (opts.dryRun) return;

  const outBytes = await outDoc.save();
  await fs.writeFile(outputPath, outBytes);
}
