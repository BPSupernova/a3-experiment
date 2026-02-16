import * as d3 from 'd3';
import { useMemo } from 'react';

export function OrdinalAxisVWithDotMarks({
  domain = ['A', 'B', 'C', 'D', 'E'],
  range = [10, 100],
  withTick = true,
  tickLen = 5,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  tickFilter = (t: any[]) => t,
}) {
  const ticks = useMemo(() => {
    // Use the same band scale logic but apply it to the Y axis
    const yScale = d3.scaleBand().domain(domain).range(range).padding(0.2);
    return tickFilter(
      domain.map((value) => ({
        value,
        yOffset: (yScale(value) || 0) + yScale.bandwidth() / 2,
      })),
    );
  }, [domain, range, tickFilter]);

  return (
    <g>
      {/* Vertical Axis Line */}
      <path
        d={['M', -tickLen, range[0], 'h', tickLen, 'V', range[1], 'h', -tickLen].join(' ')}
        fill="none"
        stroke="currentColor"
      />
      {withTick
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        && ticks.map(({ value, yOffset }: any) => (
          <g key={value} transform={`translate(0, ${yOffset})`}>
            <circle cx={10} r={2} fill="currentColor" />
            <text
              x={-10}
              style={{
                fontSize: '10px',
                textAnchor: 'end',
                alignmentBaseline: 'middle',
                fill: 'currentColor',
              }}
            >
              {value}
            </text>
          </g>
        ))}
    </g>
  );
}
