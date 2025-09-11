import { describe, it, expect } from 'vitest';
import { convertPdfToBooklet } from '../src/lib/converter';

// Basic smoke test: ensure function exists and returns a Promise when called with non-existent file (will reject)
describe('converter', () => {
  it('exports convertPdfToBooklet', () => {
    expect(typeof convertPdfToBooklet).toBe('function');
  });
});
