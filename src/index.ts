#!/usr/bin/env node
import { Command } from 'commander';
import { convertPdfToBooklet } from './lib/converter';
import { version } from '../package.json';

const program = new Command();

program
  .name('makebook')
  .description('Convert a PDF into a booklet-printable PDF (2-up, fixed pairing)')
  .version(version)
  .argument('<input>', 'input PDF file')
  .option('-o, --output <file>', 'output PDF file', 'booklet.pdf')
  .option('--dry-run', 'do not write output file')
  .action(async (input: string, options: { output: string; dryRun?: boolean }) => {
    try {
      console.log(`Converting: ${input} -> ${options.output}`);
      console.log(
        'Behavior: places pages as (1,last), (2,last-1), ... on sheets with 2 pages per A4 sheet. No config.'
      );
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

// pnpm and some wrappers may insert a standalone "--" into argv which
// marks the end of options for the wrapper and would prevent commander
// from seeing flags that come after it. Filter out any lone "--" so
// CLI flags like `-o` are parsed normally when using `pnpm run dev -- ...`.
const argv = process.argv.filter((a) => a !== '--');
program.parseAsync(argv);
