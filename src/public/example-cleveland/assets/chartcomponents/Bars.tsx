import { ScaleBand, ScaleLinear } from 'd3';

export function Bars({
  data,
  xScale,
  yScale,
  height,
  width,
  horizontal = false,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
  // Changed types to allow x and y scales to swap roles
  yScale: ScaleBand<string> | ScaleLinear<number, number>;
  xScale: ScaleLinear<number, number> | ScaleBand<string>;
  height: number;
  horizontal?: boolean;
}) {
  return (
    <g>
      {data.map((d: any, i: number) => {
        if (horizontal) {
          // SIDEWAYS LOGIC
          const sX = xScale as ScaleLinear<number, number>;
          const sY = yScale as ScaleBand<string>;
          return (
            <rect
              key={i}
              x={0} // Start at the left edge (the Y-axis)
              y={sY(d.name)} // Position vertically by name
              width={sX(d.value)} // Length is determined by the numeric value
              height={sY.bandwidth()} // Thickness of the bar
              fill="transparent"
              stroke="currentColor"
            />
          );
        }

        // VERTICAL LOGIC (Original)
        const sX = xScale as ScaleBand<string>;
        const sY = yScale as ScaleLinear<number, number>;
        return (
          <rect
            key={i}
            x={sX(d.name)}
            y={sY(d.value)}
            width={sX.bandwidth()}
            height={(height || 0) - sY(d.value)}
            fill="transparent"
            stroke="currentColor"
          />
        );
      })}
    </g>
  );
}
