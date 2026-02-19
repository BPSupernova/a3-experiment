/**
 * Calculates the Cleveland-McGill Log2 Error.
 *
 * @param reported - The participant's answer (0-100)
 * @param trueValue - The actual calculated percentage (0-100)
 * @returns The log2 error, or 0 if perfectly correct (diff === 0)
 */
export function calculateLog2Error(reported: number, trueValue: number): number {
  const diff = Math.abs(reported - trueValue);

  // Handle the edge case
  if (diff === 0) {
    return 0;
  }

  // log2(diff + 1/8)
  return Math.log2(diff + 1 / 8);
}
