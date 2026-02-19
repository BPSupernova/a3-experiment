import { ParticipantData } from '../storage/types';
import { calculateLog2Error } from './calculateLog2Error';

export interface ClevelandTrialRow {
  participantId: string;
  component: string;
  trialId: string;
  reported: number;
  true: number;
  difference: number;
  log2Error: number;
  durationMs: number;
}

/**
 * Exports Cleveland-McGill trial data to CSV format with log2 errors.
 * This is useful for data analysis and sharing results.
 *
 * @param visibleParticipants - Array of ParticipantData to export
 * @returns CSV string with headers and data rows
 */
export function exportClevelandTrialsToCSV(visibleParticipants: ParticipantData[]): string {
  const rows: ClevelandTrialRow[] = [];

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

      // Extract component name (e.g., "barChart", "horizontalBarChart", etc.)
      const parts = taskId.split('_');
      const componentName = parts[0];

      // Get the 'cm-response' answer if it exists
      const cmResponseAnswer = answer.answer['cm-response'];
      const cmResponseCorrect = answer.correctAnswer.find((c) => c.id === 'cm-response')?.answer;

      // Skip if either is missing
      if (cmResponseAnswer === undefined || cmResponseCorrect === undefined) {
        return;
      }

      // Ensure both are numeric
      if (typeof cmResponseAnswer !== 'number' && typeof cmResponseAnswer !== 'string') {
        return;
      }

      if (typeof cmResponseCorrect !== 'number' && typeof cmResponseCorrect !== 'string') {
        return;
      }

      const reported = Number(cmResponseAnswer);
      const trueValue = Number(cmResponseCorrect);

      if (Number.isNaN(reported) || Number.isNaN(trueValue)) {
        return;
      }

      const difference = Math.abs(reported - trueValue);
      const log2Error = calculateLog2Error(reported, trueValue);
      const durationMs = answer.endTime - answer.startTime;

      rows.push({
        participantId: participant.participantId,
        component: componentName,
        trialId: taskId,
        reported,
        true: trueValue,
        difference,
        log2Error,
        durationMs,
      });
    });
  });

  // Sort by participant and trial
  rows.sort((a, b) => {
    if (a.participantId !== b.participantId) {
      return a.participantId.localeCompare(b.participantId);
    }
    return a.trialId.localeCompare(b.trialId);
  });

  // Generate CSV
  const headers = [
    'participantId',
    'component',
    'trialId',
    'reported',
    'true',
    'difference',
    'log2Error',
    'durationMs',
  ];

  const csvLines = [headers.join(',')];

  rows.forEach((row) => {
    const line = [
      row.participantId,
      row.component,
      row.trialId,
      row.reported,
      row.true,
      row.difference,
      row.log2Error.toFixed(6),
      row.durationMs,
    ].map((val) => `"${val}"`).join(',');

    csvLines.push(line);
  });

  return csvLines.join('\n');
}
