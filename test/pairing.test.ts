import { describe, it, expect } from 'vitest';
import { computePairs } from '../src/lib/pairing';

describe('computePairs', () => {
  it('returns empty for 0 pages', () => {
    expect(computePairs(0)).toEqual([]);
  });

  it('pads odd page counts and pairs correctly', () => {
    // 3 pages -> effective 4 -> pairs: (0,3), (1,2)
    expect(computePairs(3)).toEqual([
      [0, 3],
      [1, 2],
    ]);
  });

  it('handles even page counts', () => {
    expect(computePairs(4)).toEqual([
      [0, 3],
      [1, 2],
    ]);
    expect(computePairs(2)).toEqual([[0, 1]]);
  });

  it('throws on negative input', () => {
    expect(() => computePairs(-1)).toThrow();
  });
});
