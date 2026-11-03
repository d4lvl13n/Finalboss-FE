/** Keep adverts on complete row boundaries: 4 columns on wide screens, 1–3
 * elsewhere. A short result set remains uninterrupted; never finish with an ad. */
export function buildAdPositions(count: number, wide: boolean): number[] {
  if (count < 12) return [];
  const interval = wide ? 8 : 6;
  const positions: number[] = [];
  for (let after = interval; after <= count - 4 && positions.length < (wide ? 2 : 3); after += interval) {
    positions.push(after);
  }
  return positions;
}
