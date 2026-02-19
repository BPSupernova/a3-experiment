/**
 * Component for displaying Cleveland-McGill log2 error statistics.
 * This displays overall performance metrics based on the Cleveland-McGill error model.
 */

import {
  Card, Grid, Group, Stack, Table, Text, Button,
} from '@mantine/core';
import { IconChartBar, IconMath, IconDownload } from '@tabler/icons-react';
import { useMemo } from 'react';
import { ParticipantData } from '../../../storage/types';
import { calculateTrialLog2ErrorStats } from '../../../utils/calculateTrialLog2ErrorStats';
import { exportClevelandTrialsToCSV } from '../../../utils/exportClevelandTrialsToCSV';

export function Log2ErrorStats({ visibleParticipants }: { visibleParticipants: ParticipantData[] }) {
  const stats = useMemo(() => calculateTrialLog2ErrorStats(visibleParticipants), [visibleParticipants]);

  if (stats.totalTrials === 0) {
    return (
      <Card withBorder radius="md" p="md">
        <Card.Section withBorder inheritPadding py="md">
          <Group justify="space-between">
            <Text size="lg" fw={700}>
              Cleveland-McGill Log2 Error Analysis
            </Text>
            <Group>
              <Button
                size="xs"
                variant="light"
                onClick={() => {
                  const csv = exportClevelandTrialsToCSV(visibleParticipants);
                  const a = document.createElement('a');
                  a.href = `data:text/csv;charset=utf-8,${encodeURIComponent(csv)}`;
                  a.download = 'cleveland-results.csv';
                  document.body.appendChild(a);
                  a.click();
                  a.remove();
                }}
                leftSection={<IconDownload size={14} />}
              >
                Download CSV
              </Button>
              <IconMath size={20} />
            </Group>
          </Group>
        </Card.Section>
        <Card.Section inheritPadding py="md">
          <Text c="dimmed">No completed Cleveland-McGill trials found in dataset.</Text>
        </Card.Section>
      </Card>
    );
  }

  return (
    <Stack gap="md">
      <Card withBorder radius="md" p="md">
        <Card.Section withBorder inheritPadding py="md">
          <Group justify="space-between">
            <Text size="lg" fw={700}>
              Cleveland-McGill Log2 Error Analysis
            </Text>
            <Group>
              <Button
                size="xs"
                variant="light"
                onClick={() => {
                  const csv = exportClevelandTrialsToCSV(visibleParticipants);
                  const a = document.createElement('a');
                  a.href = `data:text/csv;charset=utf-8,${encodeURIComponent(csv)}`;
                  a.download = 'cleveland-results.csv';
                  document.body.appendChild(a);
                  a.click();
                  a.remove();
                }}
                leftSection={<IconDownload size={14} />}
              >
                Download CSV
              </Button>
              <IconMath size={20} />
            </Group>
          </Group>
        </Card.Section>
        <Card.Section inheritPadding py="md">
          <Grid>
            <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
              <Stack gap={4} align="center">
                <Text size="sm" c="dimmed">
                  Total Trials
                </Text>
                <Text size="xl" fw={700}>
                  {stats.totalTrials}
                </Text>
              </Stack>
            </Grid.Col>
            <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
              <Stack gap={4} align="center">
                <Text size="sm" c="dimmed">
                  Average Log2 Error
                </Text>
                <Text size="xl" fw={700}>
                  {stats.avgLog2Error.toFixed(4)}
                </Text>
              </Stack>
            </Grid.Col>
            <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
              <Stack gap={4} align="center">
                <Text size="sm" c="dimmed">
                  Median Log2 Error
                </Text>
                <Text size="xl" fw={700}>
                  {stats.medianLog2Error.toFixed(4)}
                </Text>
              </Stack>
            </Grid.Col>
            <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
              <Stack gap={4} align="center">
                <Text size="sm" c="dimmed">
                  Std Dev
                </Text>
                <Text size="xl" fw={700}>
                  {stats.stdDevLog2Error.toFixed(4)}
                </Text>
              </Stack>
            </Grid.Col>
            <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
              <Stack gap={4} align="center">
                <Text size="sm" c="dimmed">
                  Min Error
                </Text>
                <Text size="xl" fw={700}>
                  {stats.minLog2Error.toFixed(4)}
                </Text>
              </Stack>
            </Grid.Col>
            <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
              <Stack gap={4} align="center">
                <Text size="sm" c="dimmed">
                  Max Error
                </Text>
                <Text size="xl" fw={700}>
                  {stats.maxLog2Error.toFixed(4)}
                </Text>
              </Stack>
            </Grid.Col>
          </Grid>
        </Card.Section>
      </Card>

      {Object.keys(stats.byComponent).length > 0 && (
        <Card withBorder radius="md" p="md">
          <Card.Section withBorder inheritPadding py="md">
            <Group justify="space-between">
              <Text size="lg" fw={700}>
                Error by Visualization Component
              </Text>
              <Group>
                <Button
                  size="xs"
                  variant="outline"
                  onClick={() => {
                    const csv = exportClevelandTrialsToCSV(visibleParticipants);
                    const a = document.createElement('a');
                    a.href = `data:text/csv;charset=utf-8,${encodeURIComponent(csv)}`;
                    a.download = 'cleveland-results.csv';
                    document.body.appendChild(a);
                    a.click();
                    a.remove();
                  }}
                  leftSection={<IconDownload size={14} />}
                >
                  Download CSV
                </Button>
                <IconChartBar size={20} />
              </Group>
            </Group>
          </Card.Section>
          <Card.Section inheritPadding py="md">
            <Table striped highlightOnHover>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Component</Table.Th>
                  <Table.Th align="right">Trials</Table.Th>
                  <Table.Th align="right">Avg Error</Table.Th>
                  <Table.Th align="right">Median Error</Table.Th>
                  <Table.Th align="right">Min Error</Table.Th>
                  <Table.Th align="right">Max Error</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {Object.entries(stats.byComponent)
                  .sort((a, b) => a[0].localeCompare(b[0]))
                  .map(([component, componentStats]) => (
                    <Table.Tr key={component}>
                      <Table.Td fw={500}>{component}</Table.Td>
                      <Table.Td align="right">{componentStats.totalTrials}</Table.Td>
                      <Table.Td align="right">{componentStats.avgLog2Error.toFixed(4)}</Table.Td>
                      <Table.Td align="right">{componentStats.medianLog2Error.toFixed(4)}</Table.Td>
                      <Table.Td align="right">{componentStats.minLog2Error.toFixed(4)}</Table.Td>
                      <Table.Td align="right">{componentStats.maxLog2Error.toFixed(4)}</Table.Td>
                    </Table.Tr>
                  ))}
              </Table.Tbody>
            </Table>
          </Card.Section>
        </Card>
      )}

      <Card withBorder radius="md" p="md">
        <Card.Section withBorder inheritPadding py="md">
          <Text size="sm" c="dimmed">
            <strong>Note:</strong>
            {' '}
            Log2 error is calculated as log₂(|reported - true| + 1/8), with a special case
            where perfect answers (difference = 0) return 0. This metric is from Cleveland &
            McGill (1984) for analyzing graphical perception tasks.
          </Text>
        </Card.Section>
      </Card>
    </Stack>
  );
}
