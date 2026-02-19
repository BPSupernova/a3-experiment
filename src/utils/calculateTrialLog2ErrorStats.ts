import { ParticipantData } from '../storage/types';
import { calculateLog2Error } from './calculateLog2Error';

export interface TrialLog2ErrorStats {
  totalTrials: number;
  avgLog2Error: number;
  medianLog2Error: number;
  minLog2Error: number;
  maxLog2Error: number;
  stdDevLog2Error: number;
  byComponent: Record<string, {
    totalTrials: number;
    avgLog2Error: number;
    medianLog2Error: number;
    minLog2Error: number;
    maxLog2Error: number;
  }>;
}

/**
 * Calculates log2 error statistics for Cleveland-McGill trials across participants.
 * This function processes completed trials and calculates aggregate error metrics.
 *
 * @param visibleParticipants - Array of ParticipantData to analyze
 * @returns Statistics including overall and per-component log2 error metrics
 */
export function calculateTrialLog2ErrorStats(
  visibleParticipants: ParticipantData[],
): TrialLog2ErrorStats {
  const errors: number[] = [];
  const componentErrors: Record<string, number[]> = {};

  // Filter out rejected participants
  const validParticipants = visibleParticipants.filter((p) => !p.rejected);

  validParticipants.forEach((participant) => {
    Object.entries(participant.answers).forEach(([taskId, answer]) => {
      // Skip incomplete trials
      if (answer.endTime === -1) {
        return;
      }

      // Only process trials with correct answers defined
      if (!answer.correctAnswer || answer.correctAnswer.length === 0) {
        return;
      }

      // Extract component name
      const parts = taskId.split('_');
      const componentName = parts[0];

      // Get the 'cm-response' answer if it exists
      const cmResponseAnswer = answer.answer['cm-response'];
      const cmResponseCorrect = answer.correctAnswer.find((c) => c.id === 'cm-response')?.answer;

      // Skip if either is missing
      if (cmResponseAnswer === undefined || cmResponseCorrect === undefined) {
        return;
      }

      // Check if the answer is correct type (numeric or string representation)
      if (typeof cmResponseAnswer !== 'number' && typeof cmResponseAnswer !== 'string') {
        return;
      }

      if (typeof cmResponseCorrect !== 'number' && typeof cmResponseCorrect !== 'string') {
        return;
      }

      // Calculate log2 error
      const reported = Number(cmResponseAnswer);
      const trueValue = Number(cmResponseCorrect);

      if (Number.isNaN(reported) || Number.isNaN(trueValue)) {
        return;
      }

      const error = calculateLog2Error(reported, trueValue);
      errors.push(error);

      // Track by component
      if (!componentErrors[componentName]) {
        componentErrors[componentName] = [];
      }
      componentErrors[componentName].push(error);
    });
  });

  // Calculate statistics
  const calculateStats = (errorArray: number[]) => {
    if (errorArray.length === 0) {
      return {
        totalTrials: 0,
        avgLog2Error: 0,
        medianLog2Error: 0,
        minLog2Error: 0,
        maxLog2Error: 0,
        stdDevLog2Error: 0,
      };
    }

    const sorted = [...errorArray].sort((a, b) => a - b);
    const avg = errorArray.reduce((a, b) => a + b, 0) / errorArray.length;
    const median = sorted.length % 2 === 0
      ? (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2
      : sorted[Math.floor(sorted.length / 2)];
    const min = sorted[0];
    const max = sorted[sorted.length - 1];
    const variance = errorArray.reduce((sum, val) => sum + (val - avg) ** 2, 0) / errorArray.length;
    const stdDev = Math.sqrt(variance);

    return {
      totalTrials: errorArray.length,
      avgLog2Error: avg,
      medianLog2Error: median,
      minLog2Error: min,
      maxLog2Error: max,
      stdDevLog2Error: stdDev,
    };
  };

  const overallStats = calculateStats(errors);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const byComponent: Record<string, any> = {};

  Object.entries(componentErrors).forEach(([component, componentErrorArray]) => {
    const componentStats = calculateStats(componentErrorArray);
    byComponent[component] = componentStats;
  });

  return {
    ...overallStats,
    byComponent,
  };
}
