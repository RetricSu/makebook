export function computePairs(pageCount: number): Array<[number, number]> {
  if (pageCount < 0) throw new Error('pageCount must be non-negative');
  const pairs: Array<[number, number]> = [];
  // pad to even if needed (consumer will add blank page as needed)
  const effective = pageCount % 2 === 0 ? pageCount : pageCount + 1;
  for (let i = 0; i < effective / 2; i++) {
    pairs.push([i, effective - 1 - i]);
  }
  return pairs;
}

export default computePairs;
