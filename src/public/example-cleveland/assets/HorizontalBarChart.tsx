import * as d3 from 'd3';
import { useChartDimensions } from './hooks/useChartDimensions';
import { Bars } from './chartcomponents/Bars';
import { NumericAxisH } from './chartcomponents/NumericAxisH'; // Swapped from V to H
import { OrdinalAxisVWithDotMarks } from './chartcomponents/OrdinalAxisVWithDotMarks'; // Swapped from H to V

const chartSettings = {
  marginBottom: 40,
  marginLeft: 100, // Increased margin for horizontal labels
  marginTop: 15,
  marginRight: 15,
  width: 400,
  height: 400,
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function HorizontalBarChart({ parameters }: { parameters: any }) {
  const tickLength = 6;
  const [ref, dms] = useChartDimensions(chartSettings);

  // xScale is now Numeric (Linear)
  const xScale = d3
    .scaleLinear()
    .domain([0, 100])
    .range([0, dms.boundedWidth]);

  // yScale is now Categorical (Band)
  const yScale = d3
    .scaleBand()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .domain(parameters.data.map((d: { name: any }) => d.name))
    .range([0, dms.boundedHeight])
    .padding(0.2);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const xAxisTickFilter = (ticks: any[]) => ticks.filter((t, i) => i === 0 || i === ticks.length - 1);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const yAxisTickFilter = (ticks: any[]) => ticks.filter((t, i) => parameters.selectedIndices.includes(i));

  return (
    <div className="Chart__wrapper" ref={ref} style={{ height: 400 }}>
      <svg width={dms.width} height={dms.height}>
        <g
          transform={`translate(${[dms.marginLeft, dms.marginTop].join(',')})`}
        >
          {/* X-Axis is now Numeric (at the bottom) */}
          <g transform={`translate(${[0, dms.boundedHeight].join(',')})`}>
            <NumericAxisH
              domain={xScale.domain()}
              range={xScale.range()}
              withTick
              tickLen={tickLength}
              tickFilter={xAxisTickFilter}
            />
          </g>

          {/* Y-Axis is now Ordinal (on the left) */}
          <g transform={`translate(${[0, 0].join(',')})`}>
            <OrdinalAxisVWithDotMarks
              domain={yScale.domain()}
              range={yScale.range()}
              withTick
              tickLen={0}
              tickFilter={yAxisTickFilter}
            />
          </g>

          {/* Pass the new scales to Bars */}
          <g transform={`translate(${[0, 0].join(',')})`}>
            <Bars
              data={parameters.data}
              xScale={xScale}
              yScale={yScale}
              horizontal // You must ensure your Bars component handles this
              height={dms.boundedHeight}
            />
          </g>
        </g>
      </svg>
    </div>
  );
}

export default HorizontalBarChart;
