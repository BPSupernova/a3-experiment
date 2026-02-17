import * as d3 from 'd3';
import { NumericAxisV } from './chartcomponents/NumericAxisV';
import { OrdinalAxisHWithDotMarks } from './chartcomponents/OrdinalAxisHWithDotMarks';
import { useChartDimensions } from './hooks/useChartDimensions';
// testing
const chartSettings = {
  marginBottom: 40,
  marginLeft: 40,
  marginTop: 15,
  marginRight: 15,
  width: 400,
  height: 400,
};

function UpsideDownBarChart({ parameters }: { parameters: any }) { // eslint-disable-line @typescript-eslint/no-explicit-any
  const tickLength = 6;
  const [ref, dms] = useChartDimensions(chartSettings);

  const xScale = d3
    .scaleBand()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .domain(parameters.data.map((d: { name: any }) => d.name))
    .range([0, dms.boundedWidth])
    .padding(0.2);

  // For upside down bars, we want 0 at the top and max value at the bottom
  const yScale = d3
    .scaleLinear()
    .domain([0, 100]) // 0 at top, 100 at bottom
    .range([0, dms.boundedHeight]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const yAxisTickFilter = (ticks: any[]) => ticks.filter((t, i) => i === 0 || i === ticks.length - 1);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const xAxisTickFilter = (ticks: any[]) => ticks.filter((t, i) => parameters.selectedIndices.includes(i));

  // Custom bar rendering for upside down bars
  const renderUpsideDownBars = () => parameters.data.map((d: any, i: number) => { // eslint-disable-line @typescript-eslint/no-explicit-any
    const x = xScale(d.name);
    const y = 0; // Start from the top
    const barWidth = xScale.bandwidth();
    const barHeight = yScale(d.value); // Height based on value (since 0->0 height, 100->full height)

    return (
      <rect
        key={i}
        x={x}
        y={y}
        width={barWidth}
        height={barHeight}
        fill="none" // No fill color
        stroke="black" // Black outline
        strokeWidth={1}
      />
    );
  });

  return (
    <div className="Chart__wrapper" ref={ref} style={{ height: 400 }}>
      <svg width={dms.width} height={dms.height}>
        <g transform={`translate(${[dms.marginLeft, dms.marginTop].join(',')})`}>
          {/* Horizontal axis (moved to top) */}
          <g transform={`translate(${[tickLength, 0].join(',')})`}>
            <OrdinalAxisHWithDotMarks
              domain={xScale.domain()}
              range={xScale.range()}
              withTick
              tickLen={0}
              tickFilter={xAxisTickFilter}
            />
          </g>

          {/* Vertical axis */}
          <g transform={`translate(${[0, 0].join(',')})`}>
            <NumericAxisV
              domain={yScale.domain()}
              range={yScale.range()}
              withTick
              tickLen={tickLength}
              tickFilter={yAxisTickFilter}
            />
          </g>

          {/* Upside down bars */}
          <g transform={`translate(${[0, 0].join(',')})`}>
            {renderUpsideDownBars()}
          </g>
        </g>
      </svg>
    </div>
  );
}

export default UpsideDownBarChart;
