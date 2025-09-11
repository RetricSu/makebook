#!/usr/bin/env node
import { Command } from 'commander';
import { convertPdfToBooklet } from './lib/converter';

const program = new Command();

program
  .name('makebook')
  .description('Convert a PDF into a booklet-printable PDF')
  .argument('<input>', 'input PDF file')
  .option('-o, --output <file>', 'output PDF file', 'booklet.pdf')
  .option('--dry-run', 'do not write output file')
  .action(async (input: string, options: { output: string; dryRun?: boolean }) => {
    try {
      console.log(`Input: ${input}`);
      console.log(`Output: ${options.output}`);
      if (options.dryRun) {
        console.log('Dry run: no file will be written.');
      }
      await convertPdfToBooklet(input, options.output, { dryRun: !!options.dryRun });
      console.log('Done.');
    } catch (err) {
      console.error('Error:', err);
      process.exit(1);
    }
  });

program.parseAsync(process.argv);
