import { ParticipantData } from '../storage/types';
import { calculateTrialLog2ErrorStats } from './calculateTrialLog2ErrorStats';

/**
 * Export only the per-component summary (component-level stats) to CSV.
 * @param visibleParticipants - participants to compute stats from
 * @returns CSV string containing component summary table
 */
export function exportClevelandSummaryToCSV(visibleParticipants: ParticipantData[]): string {
  const stats = calculateTrialLog2ErrorStats(visibleParticipants);

  const summaryHeaders = [
    'component',
    'totalTrials',
    'avgLog2Error',
    'medianLog2Error',
    'minLog2Error',
    'maxLog2Error',
    'stdDevLog2Error',
  ];

  const lines: string[] = [summaryHeaders.join(',')];

  Object.entries(stats.byComponent)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .forEach(([component, compStats]) => {
      const line = [
        component,
        compStats.totalTrials,
        compStats.avgLog2Error.toFixed(6),
        compStats.medianLog2Error.toFixed(6),
        compStats.minLog2Error.toFixed(6),
        compStats.maxLog2Error.toFixed(6),
        (compStats.stdDevLog2Error ?? 0).toFixed(6),
      ].map((v) => `"${v}"`).join(',');

      lines.push(line);
    });

  return lines.join('\n');
}
