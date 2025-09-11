import { PDFDocument } from 'pdf-lib';
import fs from 'fs/promises';

async function main() {
  const doc = await PDFDocument.create();
  for (let i = 0; i < 3; i++) {
    doc.addPage([595.28, 841.89]);
  }
  const bytes = await doc.save();
  await fs.writeFile('sample.pdf', bytes);
  console.log('Wrote sample.pdf (3 pages)');
}

main().catch(err => { console.error(err); process.exit(1); });
