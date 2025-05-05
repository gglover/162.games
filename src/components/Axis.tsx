import * as d3 from "d3";

const AXIS_GRAY = "#d0d0d0";
const TICK_FONT_SIZE = "10px";

export enum AxisOrientation {
  Horizontal = "Horizontal",
  Vertical = "Vertical",
}

export interface AxisProps {
  scale: d3.ScaleLinear;
  x: number;
  y: number;
  orientation: AxisOrientation;
}

export function Axis({ scale, x, y, orientation }: AxisProps) {
  const range = scale.range();
  const width = range[1] - range[0];
  const pixelsPerTick = 30;
  const numberOfTicksTarget = Math.max(1, Math.floor(width / pixelsPerTick));
  const ticks = scale.ticks(numberOfTicksTarget).map((value: string) => ({
    value,
    xOffset: scale(value),
  }));

  return (
    <g transform={`translate(${x}, ${y})`}>
      {orientation === AxisOrientation.Horizontal ? (
        <LineHorizontal range={range} />
      ) : (
        <LineVertical range={range} />
      )}
      {orientation === AxisOrientation.Horizontal ? (
        <TicksHorizontal ticks={ticks} />
      ) : (
        <TicksVertical ticks={ticks} />
      )}
    </g>
  );
}

function LineHorizontal({ range }: { range: [number, number] }) {
  return (
    <path
      d={["M", range[0], 6, "v", -6, "H", range[1], "v", 6].join(" ")}
      fill="none"
      stroke={AXIS_GRAY}
    />
  );
}

function TicksHorizontal({ ticks }: { ticks: any }) {
  return ticks.map(({ value, xOffset }: { value: string; xOffset: number }) => (
    <g key={value} transform={`translate(${xOffset}, 0)`}>
      <line y2="6" stroke={AXIS_GRAY} />
      <text
        key={value}
        style={{
          fontSize: "10px",
          color: AXIS_GRAY,
          textAnchor: "middle",
          transform: "translateY(20px)",
        }}
      >
        {value}
      </text>
    </g>
  ));
}

function LineVertical({ range }: { range: [number, number] }) {
  return (
    <path
      d={["M", range[0], 6, "H", -6, "v", range[1], "H", 6].join(" ")}
      fill="none"
      stroke={AXIS_GRAY}
    />
  );
}

function TicksVertical({ ticks }: { ticks: any }) {
  return ticks.map(({ value, xOffset }: { value: string; xOffset: number }) => (
    <g key={value} transform={`translate(0, ${xOffset})`}>
      <line x2="6" stroke={AXIS_GRAY} />
      <text
        key={value}
        style={{
          fontSize: TICK_FONT_SIZE,
          color: AXIS_GRAY,
          textAnchor: "middle",
          transform: "translateX(20px)",
        }}
      >
        {value}
      </text>
    </g>
  ));
}
